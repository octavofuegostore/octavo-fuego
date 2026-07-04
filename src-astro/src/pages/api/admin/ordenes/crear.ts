import type { APIRoute } from 'astro';
import { verifyJWT } from '@/lib/auth';
import { CrearOrdenSchema } from '@/lib/admin/schemas/orden';
import { crearServicios } from '@/lib/admin/provider';
import { getBodegaSeleccionada } from '@/lib/admin/bodega';

export const prerender = false;

/**
 * POST /api/admin/ordenes/crear
 *
 * Create a new order with items. Requires admin auth.
 */
export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // ─── Auth check ──────────────────────────────────────────────────────────
    const token = cookies.get('of_admin_token')?.value;
    const payload = await verifyJWT(token);

    if (!payload) {
      return new Response(
        JSON.stringify({ error: 'No autenticado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // ─── Parse body ──────────────────────────────────────────────────────────
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Cuerpo de la petición inválido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // ─── Validate schema ─────────────────────────────────────────────────────
    const validation = CrearOrdenSchema.safeParse(body);
    if (!validation.success) {
      return new Response(
        JSON.stringify({
          error: 'Datos de orden inválidos',
          details: validation.error.errors,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const data = validation.data;

    // ─── Resolve bodega ──────────────────────────────────────────────────────
    const bodegaIdCookie = getBodegaSeleccionada(cookies);
    const bodega_id = data.bodega_id || bodegaIdCookie || 'CO-BOGOTA';

    if (!['CO-BOGOTA', 'BR-ACRE'].includes(bodega_id)) {
      return new Response(
        JSON.stringify({ error: 'bodega_id no válida' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // ─── Create order ────────────────────────────────────────────────────────
    const svc = crearServicios(bodega_id === 'GLOBAL' ? undefined : bodega_id);
    const orden = await svc.ordenes.crear({ ...data, bodega_id });

    return new Response(
      JSON.stringify({ success: true, orden }),
      { status: 201, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('[api/admin/ordenes/crear]', err);

    const message = err instanceof Error ? err.message : 'Error interno del servidor';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
