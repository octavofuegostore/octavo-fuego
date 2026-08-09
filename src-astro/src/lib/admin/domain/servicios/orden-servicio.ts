/**
 * OrdenService — hexagonal Port & Adapter
 *
 * Single-file pattern: Port (interface) + 2 adapters (Supabase, Mock).
 * The factory chooses the implementation at construction time — zero branching
 * inside CRUD methods (ADR v2, rule 10: zero branching en servicios).
 *
 * Usage:
 *   import { crearOrdenServicio } from './orden-servicio'
 *   const svc = crearOrdenServicio()
 *   const ordenes = await svc.listar()
 */

import { supabase } from '@/lib/supabase'
import { ErrorNoEncontrado, ErrorSupabase, ErrorValidacion } from '@/lib/admin/errores'
import type { Orden, EstadoOrden, CanalOrden, ItemOrden } from '@/lib/admin/domain/entities/orden'
import { transicionValida } from '@/lib/admin/domain/entities/orden'

// ═══════════════════════════════════════════════════════════════════════════════
// Port
// ═══════════════════════════════════════════════════════════════════════════════

export interface IOrdenServicio {
  listar(opts?: { bodegaId?: string; limit?: number; desde?: Date; hasta?: Date }): Promise<Orden[]>
  obtenerPorId(id: string): Promise<Orden>
  crear(data: Partial<Orden>): Promise<Orden>
  actualizarEstado(id: string, nuevoEstado: EstadoOrden): Promise<Orden>
  eliminar(id: string): Promise<void>
}

// ═══════════════════════════════════════════════════════════════════════════════
// Adapter: Supabase (real implementation)
// ═══════════════════════════════════════════════════════════════════════════════

interface LMOrdenRow {
  id: string
  display_id: number
  cliente_id: string | null
  estado: string
  total_cop: number | null
  total_brl: number | null
  total_usd: number | null
  canal: string
  bodega_id: string | null
  notas: string | null
  creado_en: string
  actualizado_en: string
}

interface LMOrdenItemRow {
  id: string
  orden_id: string
  variante_id: string
  nombre: string
  gramos: number
  precio_unit: number
  cantidad: number
}

export class SupabaseOrdenServicio implements IOrdenServicio {
  async listar(opts?: { bodegaId?: string; limit?: number; desde?: Date; hasta?: Date }): Promise<Orden[]> {
    let query = supabase
      .from('ordenes')
      .select('*')
      .order('creado_en', { ascending: false })

    if (opts?.bodegaId) query = query.eq('bodega_id', opts.bodegaId)
    if (opts?.desde) query = query.gte('creado_en', opts.desde.toISOString())
    if (opts?.hasta) query = query.lte('creado_en', opts.hasta.toISOString())
    if (opts?.limit) query = query.limit(opts.limit)

    const { data, error } = await query
    if (error) throw new ErrorSupabase('Error al listar órdenes', error)

    return ((data ?? []) as LMOrdenRow[]).map((r) => this._mapear(r))
  }

  async obtenerPorId(id: string): Promise<Orden> {
    const { data, error } = await supabase
      .from('ordenes')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code === 'PGRST116') throw new ErrorNoEncontrado('Orden', id)
    if (error) throw new ErrorSupabase(`Error al obtener orden ${id}`, error)

    const orden = this._mapear(data as LMOrdenRow)

    const { data: items } = await supabase
      .from('orden_items')
      .select('*')
      .eq('orden_id', id)

    orden.items = ((items ?? []) as LMOrdenItemRow[]).map((i) => ({
      varianteId: i.variante_id,
      nombre: i.nombre,
      gramos: i.gramos,
      precioUnit: i.precio_unit,
      cantidad: i.cantidad ?? 1,
    }))

    return orden
  }

  async crear(data: Partial<Orden>): Promise<Orden> {
    const row: Record<string, unknown> = {}
    if (data.clienteId !== undefined) row.cliente_id = data.clienteId
    if (data.total !== undefined) row.total_cop = data.total
    if (data.divisa !== undefined) row.divisa = data.divisa
    if (data.estado !== undefined) row.estado = data.estado
    if (data.canal !== undefined) row.canal = data.canal
    if (data.bodegaId !== undefined) row.bodega_id = data.bodegaId
    if (data.notas !== undefined) row.notas = data.notas
    if (data.displayId !== undefined) row.display_id = data.displayId

    const { data: result, error } = await supabase
      .from('ordenes')
      .insert(row)
      .select()
      .single()

    if (error) throw new ErrorSupabase('Error al crear orden', error)
    return this.obtenerPorId((result as LMOrdenRow).id)
  }

  async actualizarEstado(id: string, nuevoEstado: EstadoOrden): Promise<Orden> {
    const orden = await this.obtenerPorId(id)

    if (!transicionValida(orden.estado, nuevoEstado)) {
      throw new ErrorValidacion(
        `Transición de ${orden.estado} a ${nuevoEstado} no es válida`,
        'estado',
      )
    }

    const { data, error } = await supabase
      .from('ordenes')
      .update({ estado: nuevoEstado })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new ErrorSupabase(`Error al actualizar estado de orden ${id}`, error)
    return this._mapear(data as LMOrdenRow)
  }

  async eliminar(id: string): Promise<void> {
    const { error } = await supabase.from('ordenes').delete().eq('id', id)
    if (error) throw new ErrorSupabase(`Error al eliminar orden ${id}`, error)
  }

  // ── Private: map LM row to domain entity ──────────────────────────────────

  private _mapear(row: LMOrdenRow): Orden {
    return {
      id: row.id,
      displayId: row.display_id,
      clienteId: row.cliente_id,
      items: [],
      total: row.total_cop ?? row.total_brl ?? row.total_usd ?? 0,
      divisa: row.total_cop ? 'COP' : row.total_brl ? 'BRL' : 'USD',
      estado: row.estado as EstadoOrden,
      canal: row.canal as CanalOrden,
      bodegaId: row.bodega_id ?? '',
      notas: row.notas,
      creadoEn: row.creado_en,
      actualizadoEn: row.actualizado_en,
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Adapter: Mock (for development / no-Supabase environments)
// ═══════════════════════════════════════════════════════════════════════════════

export class MockOrdenServicio implements IOrdenServicio {
  private ordenes: Orden[] = [...MockOrdenServicio._generarMock()]

  async listar(_opts?: { bodegaId?: string; limit?: number; desde?: Date; hasta?: Date }): Promise<Orden[]> {
    let result = [...this.ordenes]
    if (_opts?.desde) result = result.filter((o) => new Date(o.creadoEn) >= _opts.desde!)
    if (_opts?.hasta) result = result.filter((o) => new Date(o.creadoEn) <= _opts.hasta!)
    if (_opts?.limit) result = result.slice(0, _opts.limit)
    return result
  }

  async obtenerPorId(id: string): Promise<Orden> {
    const orden = this.ordenes.find((o) => o.id === id)
    if (!orden) throw new ErrorNoEncontrado('Orden', id)
    return orden
  }

  async crear(data: Partial<Orden>): Promise<Orden> {
    const now = new Date().toISOString()
    const orden: Orden = {
      id: crypto.randomUUID(),
      displayId: data.displayId ?? 0,
      clienteId: data.clienteId ?? null,
      items: data.items ?? [],
      total: data.total ?? 0,
      divisa: data.divisa ?? 'COP',
      estado: data.estado ?? 'pendiente',
      canal: data.canal ?? 'web',
      bodegaId: data.bodegaId ?? '',
      notas: data.notas ?? null,
      creadoEn: now,
      actualizadoEn: now,
    }
    this.ordenes.push(orden)
    return orden
  }

  async actualizarEstado(id: string, nuevoEstado: EstadoOrden): Promise<Orden> {
    const idx = this.ordenes.findIndex((o) => o.id === id)
    if (idx === -1) throw new ErrorNoEncontrado('Orden', id)

    if (!transicionValida(this.ordenes[idx].estado, nuevoEstado)) {
      throw new ErrorValidacion(
        `Transición de ${this.ordenes[idx].estado} a ${nuevoEstado} no es válida`,
        'estado',
      )
    }

    this.ordenes[idx] = {
      ...this.ordenes[idx],
      estado: nuevoEstado,
      actualizadoEn: new Date().toISOString(),
    }
    return this.ordenes[idx]
  }

  async eliminar(id: string): Promise<void> {
    const idx = this.ordenes.findIndex((o) => o.id === id)
    if (idx === -1) throw new ErrorNoEncontrado('Orden', id)
    this.ordenes.splice(idx, 1)
  }

  // ── Mock data ──────────────────────────────────────────────────────────────

  private static _generarMock(): Orden[] {
    const now = Date.now()
    const NOMBRES = ['Bobinsana', 'Kaxinawá', 'Nukini', 'Shawandawa', 'Katukina', 'Yawanawá', 'Ashaninka', 'Kuntanawa']
    const DIVISAS = ['COP', 'BRL'] as const
    const ESTADOS: EstadoOrden[] = ['pendiente', 'confirmada', 'pagada', 'preparando', 'enviada', 'entregada']
    const CANALES: CanalOrden[] = ['whatsapp', 'web', 'manual']
    const BODEGAS = ['CO-BOGOTA', 'BR-ACRE']

    return Array.from({ length: 48 }, (_, i) => {
      const daysAgo = Math.floor(Math.random() * 365)
      const createdDate = new Date(now - daysAgo * 86400000 - Math.floor(Math.random() * 86400000))
      const qty = (i % 3) + 1
      const precio = [35000, 70000, 100000][i % 3]
      const divisa = DIVISAS[i % 2]
      return {
        id: `MOCK-ORD-${String(i + 1).padStart(3, '0')}`,
        displayId: 1001 + i,
        clienteId: null,
        items: [
          {
            varianteId: `MOCK-VAR-${i % 8}-${i % 3}`,
            nombre: `${NOMBRES[i % 8]} ${[10, 20, 30][i % 3]}g`,
            gramos: [10, 20, 30][i % 3],
            precioUnit: precio,
            cantidad: qty,
          },
        ],
        total: precio * qty + Math.floor(Math.random() * 5000),
        divisa,
        estado: ESTADOS[i % ESTADOS.length],
        canal: CANALES[i % CANALES.length],
        bodegaId: BODEGAS[i % BODEGAS.length],
        notas: null,
        creadoEn: createdDate.toISOString(),
        actualizadoEn: createdDate.toISOString(),
      }
    })
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Factory
// ═══════════════════════════════════════════════════════════════════════════════

import { SUPABASE_CONFIGURED } from './config'

/**
 * Factory: returns MockOrdenServicio when Supabase is not configured,
 * SupabaseOrdenServicio otherwise. Zero branching inside the returned
 * instance — the decision is made once at construction time.
 */
export function crearOrdenServicio(): IOrdenServicio {
  return SUPABASE_CONFIGURED
    ? new SupabaseOrdenServicio()
    : new MockOrdenServicio()
}
