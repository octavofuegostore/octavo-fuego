import { supabase } from '@/lib/supabase'

export interface EventMap {
  'orden:creada': { ordenId: string; clienteId: string; total: number; moneda: string }
  'orden:estado_cambiado': { ordenId: string; estadoAnterior: string; estadoNuevo: string }
  'stock:alterado': { varianteId: string; bodegaId: string; gramos: number; tipo: 'entrada' | 'salida' }
  'pago:confirmado': { pagoId: string; ordenId: string; monto: number }
  'pago:fallido': { pagoId: string; ordenId: string; razon: string }
  'b2b:solicitud_aprobada': { solicitudId: string; clienteId: string }
  'b2b:solicitud_rechazada': { solicitudId: string; clienteId: string; motivo: string }
}

type EventCallback<E extends keyof EventMap> = (payload: EventMap[E]) => void | Promise<void>

class TypedEventBus {
  private listeners = new Map<string, Set<(...args: any[]) => void>>()

  on<E extends keyof EventMap>(event: E, handler: EventCallback<E>): () => void {
    if (!this.listeners.has(event as string)) {
      this.listeners.set(event as string, new Set())
    }
    this.listeners.get(event as string)!.add(handler as any)

    return () => {
      this.listeners.get(event as string)?.delete(handler as any)
    }
  }

  async emit<E extends keyof EventMap>(event: E, payload: EventMap[E]): Promise<void> {
    // Persist to eventos table via RPC
    try {
      const rpcPayload: Record<string, any> = {
        p_bodega_id: (payload as any).bodegaId ?? null,
        p_tipo: event as string,
        p_payload: payload as any,
      }
      if ('usuarioId' in (payload as any)) {
        rpcPayload.p_usuario_id = (payload as any).usuarioId
      }
      if ('ordenId' in (payload as any)) {
        rpcPayload.p_orden_id = (payload as any).ordenId
      }
      await supabase.rpc('emitir_evento', rpcPayload)
    } catch {
      // Silent fail — event bus should never break the caller
    }

    // Fire in-memory handlers
    const handlers = this.listeners.get(event as string)
    if (handlers) {
      for (const handler of handlers) {
        await handler(payload)
      }
    }
  }

  off<E extends keyof EventMap>(event: E, handler: EventCallback<E>): void {
    this.listeners.get(event as string)?.delete(handler as any)
  }
}

export const eventBus = new TypedEventBus()
