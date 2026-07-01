import { z } from 'zod'
import { b2bEstadoSchema, roleSchema } from './enums'

export const CrearClienteSchema = z.object({
  email: z.string().email('Email no válido'),
  nombre_empresa: z.string().nullable().optional(),
  telefono: z.string().nullable().optional(),
  pais: z.string().length(2, 'País debe ser código de 2 letras'),
  nit_cnpj: z.string().nullable().optional(),
  rol: roleSchema.default('viewer'),
  estado: b2bEstadoSchema,
}).strict()

export const ActualizarClienteSchema = CrearClienteSchema.partial().strict()

export type CrearClienteInput = z.infer<typeof CrearClienteSchema>
export type ActualizarClienteInput = z.infer<typeof ActualizarClienteSchema>
