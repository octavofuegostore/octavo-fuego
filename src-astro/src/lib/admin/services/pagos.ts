import { SupabaseClient } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { SupabaseService } from '@/lib/admin/services/base'
import type { LMPagoRow } from '@/lib/admin/mapper'
import { PagoMapper } from '@/lib/admin/mapper'
import type { Pago } from '@/types/admin'

export class PagoService extends SupabaseService<LMPagoRow> {
  constructor(supabase: SupabaseClient, bodegaId?: string) {
    super(supabase, 'pagos', bodegaId)
  }

  protected generarMock(): LMPagoRow[] {
    return []
  }

  async listar(opts?: { bodegaId?: string }): Promise<Pago[]> {
    const rows = await super.listar(opts)
    return PagoMapper.toAdminList(rows)
  }

  async obtenerPorId(id: string): Promise<Pago> {
    const row = await super.obtenerPorId(id)
    return PagoMapper.toAdmin(row)
  }

  async confirmarPago(id: string, metadata?: Record<string, unknown>): Promise<Pago> {
    const { data, error } = await supabase
      .from('pagos')
      .update({
        estado: 'confirmado',
        metadata: metadata ?? {},
        confirmado_en: new Date().toISOString(),
      } as any)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return PagoMapper.toAdmin(data as LMPagoRow)
  }

  async marcarFallido(id: string, razon: string): Promise<Pago> {
    const { data, error } = await supabase
      .from('pagos')
      .update({
        estado: 'fallido',
        metadata: { razon_fallo: razon },
      } as any)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return PagoMapper.toAdmin(data as LMPagoRow)
  }
}
