import { z } from 'zod'
import { metodoPagoSchema, monedaSchema, estadoPagoSchema } from './enums'

const TRANSICIONES_PAGO: Record<string, string[]> = {
  pendiente: ['procesando', 'fallido', 'reembolsado'],
  procesando: ['confirmado', 'fallido', 'reembolsado'],
  confirmado: ['reembolsado'],
  fallido: ['reembolsado'],
  reembolsado: [],
}

export const CrearPagoSchema = z.object({
  orden_id: z.string().uuid(),
  metodo: metodoPagoSchema,
  monto: z.number().positive('Monto debe ser positivo'),
  moneda: monedaSchema,
  estado: estadoPagoSchema.default('pendiente'),
}).strict()

export const ActualizarEstadoPagoSchema = z.object({
  estadoAnterior: estadoPagoSchema,
  estadoNuevo: estadoPagoSchema,
}).refine(
  (data) => (TRANSICIONES_PAGO[data.estadoAnterior] ?? []).includes(data.estadoNuevo),
  { message: 'Transición de estado de pago no válida', path: ['estadoNuevo'] },
)

export type CrearPagoInput = z.infer<typeof CrearPagoSchema>
export type ActualizarEstadoPagoInput = z.infer<typeof ActualizarEstadoPagoSchema>
