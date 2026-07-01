import { z } from 'zod'
import { estadoOrdenSchema, canalOrdenSchema } from './enums'

const TRANSICIONES_VALIDAS: Record<string, string[]> = {
  pendiente: ['confirmada', 'cancelada'],
  confirmada: ['pagada', 'cancelada'],
  pagada: ['preparando', 'cancelada'],
  preparando: ['enviada', 'cancelada'],
  enviada: ['entregada', 'cancelada'],
  entregada: [],
  cancelada: [],
}

export const CrearOrdenSchema = z.object({
  cliente_id: z.string().uuid(),
  items: z.array(z.object({
    variante_id: z.string().uuid(),
    gramos: z.number().int().positive(),
    precio_unit: z.number().int().positive(),
  })).min(1, 'La orden debe tener al menos un item'),
  canal: canalOrdenSchema,
  notas: z.string().nullable().optional(),
  bodega_id: z.string().uuid(),
}).strict()

export const ItemsOrdenSchema = z.object({
  variante_id: z.string().uuid(),
  gramos: z.number().int().positive(),
  precio_unit: z.number().int().positive(),
})

export const ActualizarEstadoSchema = z.object({
  estadoAnterior: estadoOrdenSchema,
  estadoNuevo: estadoOrdenSchema,
}).refine(
  (data) => (TRANSICIONES_VALIDAS[data.estadoAnterior] ?? []).includes(data.estadoNuevo),
  { message: 'Transición de estado no válida', path: ['estadoNuevo'] },
)

export type CrearOrdenInput = z.infer<typeof CrearOrdenSchema>
export type ItemsOrdenInput = z.infer<typeof ItemsOrdenSchema>
export type ActualizarEstadoInput = z.infer<typeof ActualizarEstadoSchema>
