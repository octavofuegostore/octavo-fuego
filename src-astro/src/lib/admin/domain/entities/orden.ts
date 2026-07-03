// Pure domain entity — NO infra imports, NO Zod

export type EstadoOrden = 'pendiente' | 'confirmada' | 'pagada' | 'preparando' | 'enviada' | 'entregada' | 'cancelada'
export type CanalOrden = 'whatsapp' | 'web' | 'manual'

export const TRANSICIONES_ORDEN: Record<EstadoOrden, EstadoOrden[]> = {
  pendiente: ['confirmada', 'cancelada'],
  confirmada: ['pagada', 'cancelada'],
  pagada: ['preparando', 'cancelada'],
  preparando: ['enviada', 'cancelada'],
  enviada: ['entregada', 'cancelada'],
  entregada: [],
  cancelada: [],
}

export function transicionValida(desde: EstadoOrden, hasta: EstadoOrden): boolean {
  return (TRANSICIONES_ORDEN[desde] ?? []).includes(hasta)
}

export interface ItemOrden {
  varianteId: string
  nombre: string
  gramos: number
  precioUnit: number
  cantidad: number
}

export interface Orden {
  id: string
  displayId: number
  clienteId: string | null
  items: ItemOrden[]
  total: number
  divisa: string
  estado: EstadoOrden
  canal: CanalOrden
  bodegaId: string
  notas: string | null
  creadoEn: string
  actualizadoEn: string
}
