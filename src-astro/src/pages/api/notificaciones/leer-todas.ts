// POST /api/notificaciones/leer-todas — Mark all unread notifications for the current user as read
export const prerender = false;

import type { APIRoute } from 'astro';
import { verifyJWT } from '@/lib/auth';
import { getNotificaciones, marcarNotificacionLeida } from '@/lib/admin/service';

export const POST: APIRoute = async ({ cookies }) => {
  try {
    const token = cookies.get('of_admin_token')?.value;
    const payload = await verifyJWT(token);

    if (!payload) {
      return new Response(JSON.stringify({ error: 'No autenticado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const usuarioId = payload.sub;
    if (!usuarioId) {
      return new Response(JSON.stringify({ error: 'Token inválido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const notificaciones = await getNotificaciones(usuarioId);
    const sinLeer = notificaciones.filter((n) => !n.leida);

    await Promise.all(sinLeer.map((n) => marcarNotificacionLeida(n.id)));

    return new Response(JSON.stringify({ success: true, count: sinLeer.length }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
