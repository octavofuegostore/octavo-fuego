import { SupabaseClient } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { SupabaseService } from '@/lib/admin/services/base'
import { ActualizarEstadoSchema, CrearOrdenSchema } from '@/lib/admin/schemas/orden'
import { ErrorValidacion } from '@/lib/admin/errores'
import type { LMOrdenRow } from '@/lib/admin/mapper'
import { mapToAdminOrden, OrdenMapper } from '@/lib/admin/mapper'
import type { Orden } from '@/types/admin'
import type { CrearOrdenInput } from '@/lib/admin/schemas/orden'

export class OrdenService extends SupabaseService<LMOrdenRow> {
  constructor(supabase: SupabaseClient, bodegaId?: string) {
    super(supabase, 'ordenes', bodegaId)
  }

  protected generarMock(): LMOrdenRow[] {
    return []
  }

  async listar(opts?: { bodegaId?: string; limit?: number }): Promise<Orden[]> {
    if (!this.supabaseConfigurado) {
      await this.mockDelay()
      return []
    }

    let query = supabase
      .from('ordenes')
      .select('*, clientes!inner(nombre_empresa, email, telefono)')
      .order('creado_en', { ascending: false })

    if (opts?.bodegaId) query = query.eq('bodega_id', opts.bodegaId)
    if (opts?.limit) query = query.limit(opts.limit)

    const { data, error } = await query
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

  async crear(data: CrearOrdenInput & { bodega_id: string }): Promise<Orden> {
    const validation = CrearOrdenSchema.safeParse(data)
    if (!validation.success) {
      throw new ErrorValidacion('Datos de orden inválidos', 'input')
    }

    const total = data.items.reduce((sum, item) => sum + item.gramos * item.precio_unit, 0)
    const moneda = data.bodega_id === 'BR-ACRE' ? 'BRL' : 'COP'
    const totalField = moneda === 'BRL' ? 'total_brl' : 'total_cop'

    const insertData: Record<string, unknown> = {
      cliente_id: data.cliente_id,
      bodega_id: data.bodega_id,
      canal: data.canal,
      estado: 'pendiente',
      notas: data.notas ?? null,
      [totalField]: total,
    }

    const { data: ordenRow, error: ordenError } = await supabase
      .from('ordenes')
      .insert(insertData)
      .select('*, clientes!inner(nombre_empresa, email, telefono)')
      .single()

    if (ordenError) throw ordenError

    const ordenId = (ordenRow as LMOrdenRow).id

    const itemsToInsert = data.items.map(item => ({
      orden_id: ordenId,
      variante_id: item.variante_id,
      gramos: item.gramos,
      precio_unit: item.precio_unit,
    }))

    const { error: itemsError } = await supabase
      .from('orden_items')
      .insert(itemsToInsert)

    if (itemsError) {
      // Best-effort rollback: delete the orphan order
      await supabase.from('ordenes').delete().eq('id', ordenId)
      throw itemsError
    }

    const orden = mapToAdminOrden(ordenRow as LMOrdenRow)
    orden.items = data.items.map(item => ({
      name: item.variante_id,
      quantity: item.gramos,
      price: item.precio_unit,
    }))
    orden.total = total
    orden.currency = moneda
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
