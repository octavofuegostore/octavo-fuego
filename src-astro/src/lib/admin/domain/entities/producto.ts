// Pure domain entity — NO infra imports, NO Zod

export type TipoVenta = 'b2c' | 'b2b' | 'ambos'
export type EstadoProducto = 'activo' | 'inactivo' | 'sin_stock'
export type PaisDisponible = 'CO' | 'BR'

export interface Producto {
  id: string
  slug: string
  nombre_es: string
  nombre_en: string
  nombre_pt: string
  descripcion_es: string | null
  descripcion_en: string | null
  descripcion_pt: string | null
  tipoVenta: TipoVenta
  disponibleEn: PaisDisponible[]
  variantes: Variante[]
  activo: boolean
  creadoEn: string
  actualizadoEn: string
}

export interface Variante {
  id: string
  productoId: string
  gramos: number
  precioCop: number
  precioBrl: number | null
  precioUsd: number | null
  sku: string
  activo: boolean
  creadoEn: string
  actualizadoEn: string
}

export interface NivelInventario {
  varianteId: string
  bodegaId: string
  gramosStock: number
  gramosReserva: number
  alertaStockBajo: boolean
}
