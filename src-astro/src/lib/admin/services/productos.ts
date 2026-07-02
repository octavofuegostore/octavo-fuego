import { SupabaseClient } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { SupabaseService } from '@/lib/admin/services/base'
import type {
  LMProductoRow, LMVarianteRow, LMNivelInventarioRow,
} from '@/lib/admin/mapper'
import { mapToAdminProducto } from '@/lib/admin/mapper'
import { generarMockProductos } from '@/lib/admin/service'
import type { Producto } from '@/types/admin'

export class ProductoService extends SupabaseService<LMProductoRow> {
  constructor(supabase: SupabaseClient, bodegaId?: string) {
    super(supabase, 'productos', bodegaId)
  }

  protected generarMock(): LMProductoRow[] {
    return generarMockProductos().map(p => ({
      id: p.id,
      slug: p.name.toLowerCase().replace(/\s+/g, '-'),
      nombre_es: p.name,
      nombre_en: p.name,
      nombre_pt: p.name,
      descripcion_es: null,
      descripcion_en: null,
      descripcion_pt: null,
      tipo_venta: p.category === 'b2b' ? 'both' : 'retail',
      activo: p.status === 'active',
    }))
  }

  async listar(opts?: { bodegaId?: string; limit?: number }): Promise<Producto[]> {
    if (!this.supabaseConfigurado) {
      await this.mockDelay()
      return generarMockProductos()
    }

    // Batch: 3 queries, not N+1
    let productosQuery = supabase.from('productos').select('*').order('slug')
    if (opts?.limit) productosQuery = productosQuery.limit(opts.limit)
    const { data: productos } = await productosQuery

    if (!productos?.length) return []

    const productoIds = productos.map(p => p.id)

    const { data: variantes } = await supabase
      .from('variantes').select('*')
      .in('producto_id', productoIds)

    const variantesList = (variantes ?? []) as LMVarianteRow[]
    const varianteIds = variantesList.map(v => v.id)

    const { data: items } = await supabase
      .from('items_inventario').select('id')
      .in('variante_id', varianteIds)

    const itemIds = (items ?? []).map(i => i.id)

    let nivelesQuery = supabase
      .from('gramos_disponibles').select('*')
      .in('item_id', itemIds)

    const activeBodega = opts?.bodegaId ?? this.bodegaId
    if (activeBodega) nivelesQuery = nivelesQuery.eq('bodega_id', activeBodega)

    const { data: niveles } = await nivelesQuery
    const nivelesList = (niveles ?? []) as LMNivelInventarioRow[]

    return productos.map(prod =>
      mapToAdminProducto(prod, variantesList, nivelesList),
    )
  }

  async obtenerPorId(id: string, opts?: { bodegaId?: string }): Promise<Producto> {
    const producto = await super.obtenerPorId(id, opts)

    const { data: variantes } = await supabase
      .from('variantes').select('*')
      .eq('producto_id', id)

    const varianteIds = (variantes ?? []).map(v => v.id)

    const { data: items } = await supabase
      .from('items_inventario').select('id')
      .in('variante_id', varianteIds)

    const itemIds = (items ?? []).map(i => i.id)
    const activeBodega = opts?.bodegaId ?? this.bodegaId

    let nivelesQuery = supabase
      .from('gramos_disponibles').select('*')
      .in('item_id', itemIds)

    if (activeBodega) nivelesQuery = nivelesQuery.eq('bodega_id', activeBodega)

    const { data: niveles } = await nivelesQuery

    return mapToAdminProducto(
      producto as LMProductoRow,
      (variantes ?? []) as LMVarianteRow[],
      (niveles ?? []) as LMNivelInventarioRow[],
    )
  }

  async agregarVariante(data: {
    producto_id: string
    gramos: number
    precio_cop: number
    precio_brl?: number | null
    precio_usd?: number | null
    sku: string
  }): Promise<LMVarianteRow> {
    const { data: variante, error } = await supabase
      .from('variantes')
      .insert({ ...data, activo: true })
      .select()
      .single()

    if (error) throw error
    return variante as LMVarianteRow
  }

  async eliminarVariante(id: string): Promise<void> {
    const { error } = await supabase
      .from('variantes')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
