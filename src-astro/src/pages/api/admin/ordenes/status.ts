import type { APIRoute } from 'astro';
import { verifyJWT } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export const prerender = false;

const VALID_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const token = cookies.get('of_admin_token')?.value;
    const payload = await verifyJWT(token);

    if (!payload) {
      return new Response(
        JSON.stringify({ error: 'No autorizado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || typeof id !== 'string') {
      return new Response(
        JSON.stringify({ error: 'ID de orden requerido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return new Response(
        JSON.stringify({ error: 'Estado inválido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const { error } = await supabase
      .from('ordenes')
      .update({ estado: status })
      .eq('id', id);

    if (error) {
      console.error('[api/admin/ordenes/status] Error updating order:', error.message);
      return new Response(
        JSON.stringify({ error: 'Error al actualizar la orden' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('[api/admin/ordenes/status] Unexpected error:', err);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
