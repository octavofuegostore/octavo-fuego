/**
 * ProductoService — hexagonal Port & Adapter
 *
 * Single-file pattern: Port (interface) + 2 adapters (Supabase, Mock).
 * The factory chooses the implementation at construction time — zero branching
 * inside CRUD methods (ADR v2, rule 10: zero branching en servicios).
 *
 * Usage:
 *   import { crearProductoServicio } from './producto-servicio'
 *   const svc = crearProductoServicio()
 *   const productos = await svc.listar()
 */

import { supabase } from '@/lib/supabase'
import { ProductoDomainMapper } from '@/lib/admin/mapper'
import type { LMProductoRow, LMVarianteRow, LMNivelInventarioRow } from '@/lib/admin/mapper'
import { ErrorNoEncontrado, ErrorSupabase } from '@/lib/admin/errores'
import type { Producto, TipoVenta, PaisDisponible } from '@/lib/admin/domain/entities/producto'

// ═══════════════════════════════════════════════════════════════════════════════
// Port
// ═══════════════════════════════════════════════════════════════════════════════

export interface IProductoServicio {
  listar(opts?: { bodegaId?: string; limit?: number }): Promise<Producto[]>
  obtenerPorId(id: string): Promise<Producto>
  crear(data: Partial<Producto>): Promise<Producto>
  actualizar(id: string, data: Partial<Producto>): Promise<Producto>
  eliminar(id: string): Promise<void>
}

// ═══════════════════════════════════════════════════════════════════════════════
// Adapter: Supabase (real implementation)
// ═══════════════════════════════════════════════════════════════════════════════

export class SupabaseProductoServicio implements IProductoServicio {
  async listar(opts?: { bodegaId?: string; limit?: number }): Promise<Producto[]> {
    let query = supabase.from('productos').select('*').order('slug')
    if (opts?.limit) query = query.limit(opts.limit)

    const { data: productos, error: prodError } = await query
    if (prodError) throw new ErrorSupabase('Error al listar productos', prodError)
    if (!productos?.length) return []

    return this._cargarConVariantes(productos as LMProductoRow[], opts?.bodegaId)
  }

  async obtenerPorId(id: string): Promise<Producto> {
    const { data: producto, error } = await supabase
      .from('productos')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code === 'PGRST116') throw new ErrorNoEncontrado('Producto', id)
    if (error) throw new ErrorSupabase(`Error al obtener producto ${id}`, error)

    const productos = await this._cargarConVariantes([producto as LMProductoRow])
    return productos[0]
  }

  async crear(data: Partial<Producto>): Promise<Producto> {
    const row: Record<string, unknown> = {}
    if (data.slug !== undefined) row.slug = data.slug
    if (data.nombre_es !== undefined) row.nombre_es = data.nombre_es
    if (data.nombre_en !== undefined) row.nombre_en = data.nombre_en
    if (data.nombre_pt !== undefined) row.nombre_pt = data.nombre_pt
    if (data.descripcion_es !== undefined) row.descripcion_es = data.descripcion_es
    if (data.descripcion_en !== undefined) row.descripcion_en = data.descripcion_en
    if (data.descripcion_pt !== undefined) row.descripcion_pt = data.descripcion_pt
    if (data.tipoVenta !== undefined) row.tipo_venta = data.tipoVenta
    if (data.activo !== undefined) row.activo = data.activo

    const { data: result, error } = await supabase
      .from('productos')
      .insert(row)
      .select()
      .single()

    if (error) throw new ErrorSupabase('Error al crear producto', error)
    return this.obtenerPorId((result as LMProductoRow).id)
  }

  async actualizar(id: string, data: Partial<Producto>): Promise<Producto> {
    const row: Record<string, unknown> = {}
    if (data.slug !== undefined) row.slug = data.slug
    if (data.nombre_es !== undefined) row.nombre_es = data.nombre_es
    if (data.nombre_en !== undefined) row.nombre_en = data.nombre_en
    if (data.nombre_pt !== undefined) row.nombre_pt = data.nombre_pt
    if (data.descripcion_es !== undefined) row.descripcion_es = data.descripcion_es
    if (data.descripcion_en !== undefined) row.descripcion_en = data.descripcion_en
    if (data.descripcion_pt !== undefined) row.descripcion_pt = data.descripcion_pt
    if (data.tipoVenta !== undefined) row.tipo_venta = data.tipoVenta
    if (data.activo !== undefined) row.activo = data.activo

    const { data: result, error } = await supabase
      .from('productos')
      .update(row)
      .eq('id', id)
      .select()
      .single()

    if (error && error.code === 'PGRST116') throw new ErrorNoEncontrado('Producto', id)
    if (error) throw new ErrorSupabase(`Error al actualizar producto ${id}`, error)
    return this.obtenerPorId((result as LMProductoRow).id)
  }

  async eliminar(id: string): Promise<void> {
    const { error } = await supabase.from('productos').delete().eq('id', id)
    if (error) throw new ErrorSupabase(`Error al eliminar producto ${id}`, error)
  }

  // ── Private: batch-load variantes + inventory levels ────────────────────────

  private async _cargarConVariantes(
    productos: LMProductoRow[],
    bodegaId?: string,
  ): Promise<Producto[]> {
    const productoIds = productos.map((p) => p.id)

    const { data: variantes } = await supabase
      .from('variantes')
      .select('*')
      .in('producto_id', productoIds)

    const variantesList = (variantes ?? []) as LMVarianteRow[]
    const varianteIds = variantesList.map((v) => v.id)

    const { data: items } = await supabase
      .from('items_inventario')
      .select('id')
      .in('variante_id', varianteIds)

    const itemIds = (items ?? []).map((i: { id: string }) => i.id)

    let nivelesQuery = supabase
      .from('gramos_disponibles')
      .select('*')
      .in('item_id', itemIds)

    if (bodegaId) nivelesQuery = nivelesQuery.eq('bodega_id', bodegaId)

    const { data: niveles } = await nivelesQuery
    const nivelesList = (niveles ?? []) as LMNivelInventarioRow[]

    return productos.map((prod) =>
      ProductoDomainMapper.deDBaDominio({
        producto: prod,
        variantes: variantesList.filter((v) => v.producto_id === prod.id),
        niveles: nivelesList,
      }),
    )
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Adapter: Mock (for development / no-Supabase environments)
// ═══════════════════════════════════════════════════════════════════════════════

export class MockProductoServicio implements IProductoServicio {
  private productos: Producto[] = [...MockProductoServicio._generarMock()]

  async listar(_opts?: { bodegaId?: string; limit?: number }): Promise<Producto[]> {
    let result = [...this.productos]
    if (_opts?.limit) result = result.slice(0, _opts.limit)
    return result
  }

  async obtenerPorId(id: string): Promise<Producto> {
    const prod = this.productos.find((p) => p.id === id)
    if (!prod) throw new ErrorNoEncontrado('Producto', id)
    return prod
  }

  async crear(data: Partial<Producto>): Promise<Producto> {
    const now = new Date().toISOString()
    const producto: Producto = {
      id: crypto.randomUUID(),
      slug: data.slug ?? data.nombre_es?.toLowerCase().replace(/\s+/g, '-') ?? '',
      nombre_es: data.nombre_es ?? '',
      nombre_en: data.nombre_en ?? '',
      nombre_pt: data.nombre_pt ?? '',
      descripcion_es: data.descripcion_es ?? null,
      descripcion_en: data.descripcion_en ?? null,
      descripcion_pt: data.descripcion_pt ?? null,
      tipoVenta: data.tipoVenta ?? 'b2c',
      disponibleEn: data.disponibleEn ?? ['CO'],
      variantes: data.variantes ?? [],
      activo: data.activo ?? true,
      creadoEn: now,
      actualizadoEn: now,
    }
    this.productos.push(producto)
    return producto
  }

  async actualizar(id: string, data: Partial<Producto>): Promise<Producto> {
    const idx = this.productos.findIndex((p) => p.id === id)
    if (idx === -1) throw new ErrorNoEncontrado('Producto', id)

    this.productos[idx] = {
      ...this.productos[idx],
      ...data,
      actualizadoEn: new Date().toISOString(),
    }
    return this.productos[idx]
  }

  async eliminar(id: string): Promise<void> {
    const idx = this.productos.findIndex((p) => p.id === id)
    if (idx === -1) throw new ErrorNoEncontrado('Producto', id)
    this.productos.splice(idx, 1)
  }

  // ── Mock data ──────────────────────────────────────────────────────────────

  private static _generarMock(): Producto[] {
    const rapes = [
      { slug: 'bobinsana', nombre: 'Bobinsana', desc: 'Rapé sagrado de la selva amazónica, preparado con las hojas de la planta Bobinsana.' },
      { slug: 'kaxinawa', nombre: 'Kaxinawá', desc: 'Rapé tradicional del pueblo Huni Kuin, elaborado con tabaco sagrado y cenizas de árboles.' },
      { slug: 'nukini', nombre: 'Nukini', desc: 'Rapé preparado por el pueblo Nukini, con tabaco nativo y especies amazónicas.' },
      { slug: 'shawandawa', nombre: 'Shawandawa', desc: 'Rapé de la tradición Shawandawa, suave y aromático, ideal para meditación.' },
      { slug: 'katukina', nombre: 'Katukina', desc: 'Rapé del pueblo Katukina, con la fuerza del tabaco sagrado del Acre.' },
    ]

    const pesos = [10, 20, 30] as const
    const precios = {
      cop: [35000, 70000, 100000],
      brl: [45, 89, 130],
      usd: [9, 17, 25],
    }

    const now = new Date().toISOString()

    return rapes.map((rape, idx) => {
      const id = `MOCK-${String(idx + 1).padStart(3, '0')}`
      return {
        id,
        slug: rape.slug,
        nombre_es: rape.nombre,
        nombre_en: rape.nombre,
        nombre_pt: rape.nombre,
        descripcion_es: rape.desc,
        descripcion_en: rape.desc,
        descripcion_pt: rape.desc,
        tipoVenta: 'b2c' as TipoVenta,
        disponibleEn: ['CO', 'BR'] as PaisDisponible[],
        variantes: pesos.map((peso, pIdx) => ({
          id: `MOCK-VAR-${idx}-${pIdx}`,
          productoId: id,
          gramos: peso,
          precioCop: precios.cop[pIdx],
          precioBrl: precios.brl[pIdx],
          precioUsd: precios.usd[pIdx],
          sku: `${rape.slug.toUpperCase().slice(0, 3)}-${peso}`,
          activo: true,
          creadoEn: now,
          actualizadoEn: now,
        })),
        activo: true,
        creadoEn: now,
        actualizadoEn: now,
      }
    })
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Factory
// ═══════════════════════════════════════════════════════════════════════════════

import { SUPABASE_CONFIGURED } from './config'

/**
 * Factory: returns MockProductoServicio when Supabase is not configured,
 * SupabaseProductoServicio otherwise. Zero branching inside the returned
 * instance — the decision is made once at construction time.
 */
export function crearProductoServicio(): IProductoServicio {
  return SUPABASE_CONFIGURED
    ? new SupabaseProductoServicio()
    : new MockProductoServicio()
}
