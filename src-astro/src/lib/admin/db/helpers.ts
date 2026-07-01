import { SupabaseClient } from '@supabase/supabase-js'
import type { LMNivelInventarioRow } from '@/lib/admin/mapper'

/** Query niveles_inventario with alerta_stock_bajo by variante IDs */
export async function getNivelesInventario(
  supabase: SupabaseClient,
  varianteIds: string[],
  bodegaId?: string,
): Promise<LMNivelInventarioRow[]> {
  let query = supabase
    .from('niveles_inventario')
    .select('*, alerta_stock_bajo')
    .in('item_id', varianteIds)

  if (bodegaId) query = query.eq('bodega_id', bodegaId)

  const { data } = await query
  return (data ?? []) as LMNivelInventarioRow[]
}

/** Query gramos_disponibles view with optional product/bodega filter */
export async function getGramosDisponibles(
  supabase: SupabaseClient,
  productoSlug?: string,
  bodegaId?: string,
): Promise<any[]> {
  let query = supabase.from('gramos_disponibles').select('*')

  if (productoSlug) query = query.eq('producto_slug', productoSlug)
  if (bodegaId) query = query.eq('bodega_id', bodegaId)

  const { data } = await query
  return (data ?? []) as any[]
}

/** Query listas_precio by customer group ID */
export async function getPreciosLista(
  supabase: SupabaseClient,
  grupoId: string,
): Promise<any[]> {
  const { data } = await supabase
    .from('listas_precio')
    .select('*')
    .eq('grupo_id', grupoId)

  return (data ?? []) as any[]
}

/** Query items_inventario by variante IDs */
export async function getItemsInventario(
  supabase: SupabaseClient,
  varianteIds: string[],
): Promise<any[]> {
  const { data } = await supabase
    .from('items_inventario')
    .select('id, variante_id')
    .in('variante_id', varianteIds)

  return (data ?? []) as any[]
}

/** Query orden_items by order ID */
export async function getOrdenItems(
  supabase: SupabaseClient,
  ordenId: string,
): Promise<any[]> {
  const { data } = await supabase
    .from('orden_items')
    .select('*')
    .eq('orden_id', ordenId)

  return (data ?? []) as any[]
}
