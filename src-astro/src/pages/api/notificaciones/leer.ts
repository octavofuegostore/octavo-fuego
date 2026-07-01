// POST /api/notificaciones/leer — Mark a single notification as read
export const prerender = false;

import type { APIRoute } from 'astro';
import { verifyJWT } from '@/lib/auth';
import { marcarNotificacionLeida } from '@/lib/admin/service';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const token = cookies.get('of_admin_token')?.value;
    const payload = await verifyJWT(token);

    if (!payload) {
      return new Response(JSON.stringify({ error: 'No autenticado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { id } = body;

    if (!id || typeof id !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing notification id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const ok = await marcarNotificacionLeida(id);

    return new Response(JSON.stringify({ success: ok }), {
      status: ok ? 200 : 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
