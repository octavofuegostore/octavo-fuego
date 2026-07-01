import { SupabaseClient } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { SupabaseService } from '@/lib/admin/services/base'
import type { LMClienteRow, LMSolicitudB2BRow } from '@/lib/admin/mapper'
import { mapToAdminCliente, mapToAdminSolicitud, ClienteMapper } from '@/lib/admin/mapper'
import type { Cliente, SolicitudB2B } from '@/types/admin'

export class ClienteService extends SupabaseService<LMClienteRow> {
  constructor(supabase: SupabaseClient, bodegaId?: string) {
    super(supabase, 'clientes', bodegaId)
  }

  protected generarMock(): LMClienteRow[] {
    return []
  }

  async listar(opts?: { bodegaId?: string }): Promise<Cliente[]> {
    const rows = await super.listar(opts)
    return ClienteMapper.toAdminList(rows)
  }

  async obtenerPorId(id: string): Promise<Cliente> {
    const row = await super.obtenerPorId(id)
    return ClienteMapper.toAdmin(row)
  }

  async listarSolicitudes(): Promise<SolicitudB2B[]> {
    if (!this.supabaseConfigurado) {
      await this.mockDelay()
      return []
    }

    const { data, error } = await supabase
      .from('solicitudes_b2b')
      .select('*, bodegas!inner(nombre)')
      .order('creado_en', { ascending: false })
      .limit(100)

    if (error) throw error
    return (data ?? []).map((row: any) =>
      mapToAdminSolicitud(row as LMSolicitudB2BRow, row.bodegas?.nombre),
    )
  }

  async aprobarSolicitud(id: string, usuarioId: string): Promise<void> {
    const { error } = await supabase
      .from('solicitudes_b2b')
      .update({
        estado: 'aprobado',
        revisado_por: usuarioId,
        revisado_en: new Date().toISOString(),
      } as any)
      .eq('id', id)

    if (error) throw error
  }

  async rechazarSolicitud(id: string, usuarioId: string, motivo: string): Promise<void> {
    const { error } = await supabase
      .from('solicitudes_b2b')
      .update({
        estado: 'rechazado',
        revisado_por: usuarioId,
        revision_notas: motivo,
        revisado_en: new Date().toISOString(),
      } as any)
      .eq('id', id)

    if (error) throw error
  }
}
