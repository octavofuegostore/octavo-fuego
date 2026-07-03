/**
 * PagoService — hexagonal Port & Adapter
 *
 * Single-file pattern: Port (interface) + 2 adapters (Supabase, Mock).
 * The factory chooses the implementation at construction time — zero branching
 * inside CRUD methods (ADR v2, rule 10: zero branching en servicios).
 *
 * Usage:
 *   import { crearPagoServicio } from './pago-servicio'
 *   const svc = crearPagoServicio()
 *   const pagos = await svc.listar()
 */

import { supabase } from '@/lib/supabase'
import { ErrorNoEncontrado, ErrorSupabase } from '@/lib/admin/errores'
import type { Pago, EstadoPago, MetodoPago } from '@/lib/admin/domain/entities/pago'

// ═══════════════════════════════════════════════════════════════════════════════
// Port
// ═══════════════════════════════════════════════════════════════════════════════

export interface IPagoServicio {
  listar(opts?: { bodegaId?: string }): Promise<Pago[]>
  obtenerPorId(id: string): Promise<Pago>
  confirmarPago(id: string, metadata?: Record<string, unknown>): Promise<Pago>
  marcarFallido(id: string, razon: string): Promise<Pago>
}

// ═══════════════════════════════════════════════════════════════════════════════
// Adapter: Supabase (real implementation)
// ═══════════════════════════════════════════════════════════════════════════════

interface LMPagoRow {
  id: string
  orden_id: string
  bodega_id: string
  metodo: string
  estado: string
  monto: number
  moneda: string
  codigo_pasarela: string | null
  metadata: Record<string, unknown>
  creado_en: string
}

export class SupabasePagoServicio implements IPagoServicio {
  async listar(opts?: { bodegaId?: string }): Promise<Pago[]> {
    let query = supabase
      .from('pagos')
      .select('*')
      .order('creado_en', { ascending: false })

    if (opts?.bodegaId) query = query.eq('bodega_id', opts.bodegaId)

    const { data, error } = await query
    if (error) throw new ErrorSupabase('Error al listar pagos', error)

    return ((data ?? []) as LMPagoRow[]).map((r) => this._mapear(r))
  }

  async obtenerPorId(id: string): Promise<Pago> {
    const { data, error } = await supabase
      .from('pagos')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code === 'PGRST116') throw new ErrorNoEncontrado('Pago', id)
    if (error) throw new ErrorSupabase(`Error al obtener pago ${id}`, error)

    return this._mapear(data as LMPagoRow)
  }

  async confirmarPago(id: string, metadata?: Record<string, unknown>): Promise<Pago> {
    const { data, error } = await supabase
      .from('pagos')
      .update({
        estado: 'confirmado',
        metadata: metadata ?? {},
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new ErrorSupabase(`Error al confirmar pago ${id}`, error)
    return this._mapear(data as LMPagoRow)
  }

  async marcarFallido(id: string, razon: string): Promise<Pago> {
    const { data, error } = await supabase
      .from('pagos')
      .update({
        estado: 'fallido',
        metadata: { razon_fallo: razon },
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new ErrorSupabase(`Error al marcar pago ${id} como fallido`, error)
    return this._mapear(data as LMPagoRow)
  }

  // ── Private: map LM row to domain entity ──────────────────────────────────

  private _mapear(row: LMPagoRow): Pago {
    return {
      id: row.id,
      ordenId: row.orden_id,
      monto: row.monto,
      divisa: row.moneda,
      metodo: row.metodo as MetodoPago,
      codigoPasarela: row.codigo_pasarela ?? '',
      estado: row.estado as EstadoPago,
      metadata: row.metadata,
      creadoEn: row.creado_en,
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Adapter: Mock (for development / no-Supabase environments)
// ═══════════════════════════════════════════════════════════════════════════════

export class MockPagoServicio implements IPagoServicio {
  private pagos: Pago[] = [...MockPagoServicio._generarMock()]

  async listar(_opts?: { bodegaId?: string }): Promise<Pago[]> {
    return [...this.pagos]
  }

  async obtenerPorId(id: string): Promise<Pago> {
    const pago = this.pagos.find((p) => p.id === id)
    if (!pago) throw new ErrorNoEncontrado('Pago', id)
    return pago
  }

  async confirmarPago(id: string, metadata?: Record<string, unknown>): Promise<Pago> {
    const idx = this.pagos.findIndex((p) => p.id === id)
    if (idx === -1) throw new ErrorNoEncontrado('Pago', id)

    this.pagos[idx] = {
      ...this.pagos[idx],
      estado: 'confirmado',
      metadata: { ...this.pagos[idx].metadata, ...metadata },
    }
    return this.pagos[idx]
  }

  async marcarFallido(id: string, razon: string): Promise<Pago> {
    const idx = this.pagos.findIndex((p) => p.id === id)
    if (idx === -1) throw new ErrorNoEncontrado('Pago', id)

    this.pagos[idx] = {
      ...this.pagos[idx],
      estado: 'fallido',
      metadata: { ...this.pagos[idx].metadata, razon_fallo: razon },
    }
    return this.pagos[idx]
  }

  // ── Mock data ──────────────────────────────────────────────────────────────

  private static _generarMock(): Pago[] {
    return [
      {
        id: 'MOCK-PAG-001',
        ordenId: 'MOCK-ORD-001',
        monto: 35000,
        divisa: 'COP',
        metodo: 'transferencia',
        codigoPasarela: '',
        estado: 'confirmado',
        metadata: { metodo_pago: 'transferencia_bancolombia' },
        creadoEn: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: 'MOCK-PAG-002',
        ordenId: 'MOCK-ORD-002',
        monto: 140000,
        divisa: 'COP',
        metodo: 'pix',
        codigoPasarela: '',
        estado: 'pendiente',
        metadata: {},
        creadoEn: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'MOCK-PAG-003',
        ordenId: 'MOCK-ORD-003',
        monto: 100000,
        divisa: 'COP',
        metodo: 'wompi',
        codigoPasarela: '',
        estado: 'pendiente',
        metadata: {},
        creadoEn: new Date().toISOString(),
      },
    ]
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Factory
// ═══════════════════════════════════════════════════════════════════════════════

import { SUPABASE_CONFIGURED } from './config'

/**
 * Factory: returns MockPagoServicio when Supabase is not configured,
 * SupabasePagoServicio otherwise. Zero branching inside the returned
 * instance — the decision is made once at construction time.
 */
export function crearPagoServicio(): IPagoServicio {
  return SUPABASE_CONFIGURED
    ? new SupabasePagoServicio()
    : new MockPagoServicio()
}
