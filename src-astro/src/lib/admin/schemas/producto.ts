import { z } from 'zod'
import { estadoProductoSchema } from './enums'

export const CrearProductoSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug solo permite minúsculas, números y guiones'),
  nombre_es: z.string().min(1).max(255),
  nombre_en: z.string().min(1).max(255),
  nombre_pt: z.string().min(1).max(255),
  descripcion_es: z.string().nullable().optional(),
  descripcion_en: z.string().nullable().optional(),
  descripcion_pt: z.string().nullable().optional(),
  tipo_venta: z.enum(['b2c', 'b2b', 'ambos']).default('b2c'),
  disponible_en: z.array(z.enum(['CO', 'BR'])).default(['CO', 'BR']),
  activo: z.boolean().default(true),
}).strict()

export const ActualizarProductoSchema = CrearProductoSchema.partial().strict()

export const CrearVarianteSchema = z.object({
  producto_id: z.string().uuid(),
  gramos: z.number().int().positive('Gramos debe ser positivo'),
  precio_cop: z.number().int().positive(),
  precio_brl: z.number().positive().nullable().optional(),
  precio_usd: z.number().positive().nullable().optional(),
  sku: z.string().regex(/^[A-Z0-9-]+$/, 'SKU solo mayúsculas, números y guiones'),
  activo: z.boolean().default(true),
}).strict()

export type CrearProductoInput = z.infer<typeof CrearProductoSchema>
export type ActualizarProductoInput = z.infer<typeof ActualizarProductoSchema>
export type CrearVarianteInput = z.infer<typeof CrearVarianteSchema>
