import { SupabaseClient } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { SupabaseService } from '@/lib/admin/services/base'
import { ActualizarEstadoSchema } from '@/lib/admin/schemas/orden'
import { ErrorValidacion } from '@/lib/admin/errores'
import type { LMOrdenRow } from '@/lib/admin/mapper'
import { mapToAdminOrden, OrdenMapper } from '@/lib/admin/mapper'
import type { Orden } from '@/types/admin'

export class OrdenService extends SupabaseService<LMOrdenRow> {
  constructor(supabase: SupabaseClient, bodegaId?: string) {
    super(supabase, 'ordenes', bodegaId)
  }

  protected generarMock(): LMOrdenRow[] {
    return []
  }

  async listar(opts?: { bodegaId?: string }): Promise<Orden[]> {
    if (!this.supabaseConfigurado) {
      await this.mockDelay()
      return []
    }

    const { data, error } = await supabase
      .from('ordenes')
      .select('*, clientes!inner(nombre_empresa, email, telefono)')
      .order('creado_en', { ascending: false })

    if (error) throw error

    return ((data ?? []) as LMOrdenRow[]).map(mapToAdminOrden)
  }

  async obtenerPorId(id: string, opts?: { bodegaId?: string }): Promise<Orden> {
    const row = await super.obtenerPorId(id, opts)

    const { data: items } = await supabase
      .from('orden_items')
      .select('*, variantes!inner(nombre_es, sku)')
      .eq('orden_id', id)

    const orden = mapToAdminOrden(row)
    orden.items = (items ?? []).map((i: any) => ({
      name: i.variantes?.nombre_es || i.variante_id,
      quantity: i.gramos,
      price: i.precio_unit,
    }))

    return orden
  }

  async cambiarEstado(ordenId: string, nuevoEstado: string): Promise<Orden> {
    const orden = await super.obtenerPorId(ordenId)

    const validation = ActualizarEstadoSchema.safeParse({
      estadoAnterior: orden.estado,
      estadoNuevo: nuevoEstado,
    })

    if (!validation.success) {
      throw new ErrorValidacion('Transición de estado no válida', 'estado')
    }

    const { data, error } = await supabase
      .from('ordenes')
      .update({ estado: nuevoEstado } as any)
      .eq('id', ordenId)
      .select()
      .single()

    if (error) throw error
    return OrdenMapper.toAdmin(data as LMOrdenRow)
  }
}
