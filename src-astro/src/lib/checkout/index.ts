import { supabase } from '@/lib/supabase'
import { runWorkflow, type WorkflowStep } from './workflow'
import { eventBus } from '@/lib/admin/eventos'
import type { CartItem } from '@/stores/cartStore'

export interface CheckoutInput {
  items: CartItem[]
  bodegaId: string
  clienteInfo: {
    nombre: string
    telefono: string
    email?: string
  }
}

export async function iniciarCheckout(input: CheckoutInput): Promise<{ reservaId: string; mensaje: string }> {
  let reservaId = ''
  let mensajeWhatsApp = ''

  const steps: WorkflowStep[] = [
    {
      name: 'reservar_stock',
      execute: async () => {
        // For each item, create a reservation
        for (const item of input.items) {
          const { data, error } = await supabase.rpc('incrementar_reserva', {
            p_item_id: item.varianteId,
            p_bodega_id: input.bodegaId,
            p_gramos: item.gramos,
          })
          if (error) throw error
          reservaId = data as string
        }
      },
      compensate: async () => {
        if (reservaId) {
          await supabase.rpc('liberar_reserva', { p_reserva_id: reservaId })
        }
      },
    },
    {
      name: 'generar_mensaje',
      execute: async () => {
        const lines = input.items.map(i =>
          `• ${i.name}: ${i.gramos}g — $${i.precio.toLocaleString('es-CO')}`
        )
        const total = input.items.reduce((s, i) => s + i.precio, 0)
        mensajeWhatsApp = [
          `🍃 *Nuevo pedido - Octavo Fuego*`,
          ``,
          ...lines,
          ``,
          `*Total: $${total.toLocaleString('es-CO')}*`,
          ``,
          `Cliente: ${input.clienteInfo.nombre}`,
          `Tel: ${input.clienteInfo.telefono}`,
        ].join('\n')
      },
      compensate: async () => {
        mensajeWhatsApp = ''
      },
    },
    {
      name: 'emitir_evento',
      execute: async () => {
        await eventBus.emit('orden:creada', {
          ordenId: reservaId,
          clienteId: input.clienteInfo.nombre,
          total: input.items.reduce((s, i) => s + i.precio, 0),
          moneda: 'COP',
        })
      },
      compensate: async () => {
        // Event already emitted, no undo needed
      },
    },
  ]

  await runWorkflow(steps)

  return {
    reservaId,
    mensaje: mensajeWhatsApp,
  }
}
