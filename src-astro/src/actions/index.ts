import { defineAction } from 'astro:actions'
import { z } from 'astro/zod'
import { supabase } from '@/lib/supabase'
import { ProductoService } from '@/lib/admin/services/productos'
import { OrdenService } from '@/lib/admin/services/ordenes'
import { CrearProductoSchema } from '@/lib/admin/schemas/producto'
import { ActualizarEstadoSchema } from '@/lib/admin/schemas/orden'

export const server = {
  createProducto: defineAction({
    accept: 'form',
    input: CrearProductoSchema,
    handler: async (input) => {
      const svc = new ProductoService(supabase)
      return svc.crear(input as any)
    },
  }),

  updateProducto: defineAction({
    accept: 'form',
    input: CrearProductoSchema.partial(),
    handler: async (input, context) => {
      const svc = new ProductoService(supabase)
      const id = new URL(context.request.url).searchParams.get('id')
      if (!id) throw new Error('ID requerido')
      return svc.actualizar(id, input as any)
    },
  }),
}
