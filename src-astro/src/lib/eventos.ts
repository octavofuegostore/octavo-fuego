/**
 * Event bus — audit trail for admin actions.
 *
 * Wraps the `emitir_evento()` PostgreSQL function (created in migration 004).
 * All admin actions (login, order status change, inventory adjustment, etc.)
 * should emit an event for the audit trail.
 */

import { supabase } from '@/lib/supabase';

export type TipoEvento =
  | 'login'
  | 'logout'
  | 'orden.creada'
  | 'orden.actualizada'
  | 'orden.cancelada'
  | 'inventario.ajuste'
  | 'inventario.transferencia'
  | 'cliente.creado'
  | 'cliente.actualizado'
  | 'b2b.solicitud_aprobada'
  | 'b2b.solicitud_rechazada'
  | 'pago.registrado'
  | 'configuracion.cambiada';

/**
 * Emit an admin event to the audit trail.
 *
 * @param bodegaId - The bodega where the event occurred ('' for global).
 * @param tipo - Event type identifier.
 * @param payload - JSON-serializable event data.
 * @param usuarioId - The user who triggered the event.
 */
export async function emitirEvento(
  bodegaId: string,
  tipo: TipoEvento,
  payload: Record<string, unknown>,
  usuarioId?: string,
): Promise<void> {
  try {
    const { error } = await supabase.rpc('emitir_evento', {
      p_bodega_id: bodegaId || null,
      p_tipo: tipo,
      p_payload: payload,
      p_usuario_id: usuarioId || null,
    });

    if (error) {
      console.error('[eventos] Error emitting event:', error.message);
    }
  } catch (err) {
    console.error('[eventos] Failed to emit event:', err);
  }
}
