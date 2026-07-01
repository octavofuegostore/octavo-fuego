import type { APIRoute } from 'astro';
import { verifyJWT } from '@/lib/auth';
import { rechazarSolicitud } from '@/lib/admin/service';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Extract user from JWT cookie
    const token = cookies.get('of_admin_token')?.value;
    const payload = await verifyJWT(token);

    if (!payload) {
      return new Response(
        JSON.stringify({ error: 'No autenticado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const body = await request.json();
    const { id, notas } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'ID de solicitud requerido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const usuarioId = payload.sub || payload.email;
    const success = await rechazarSolicitud(id, usuarioId, notas);

    if (!success) {
      return new Response(
        JSON.stringify({ error: 'Error al rechazar la solicitud' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('[api/b2b/reject]', err);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
