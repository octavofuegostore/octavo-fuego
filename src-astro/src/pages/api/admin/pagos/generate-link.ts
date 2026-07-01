import type { APIRoute } from 'astro';
import { verifyJWT } from '@/lib/auth';

export const prerender = false;

/**
 * POST /api/admin/pagos/generate-link
 *
 * Generate a payment link for a given order and payment method.
 * Currently returns a mock link — will integrate with Wompi/Pix in Phase 2.
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

    // ─── Validate body ───────────────────────────────────────────────────────
    const body = await request.json();
    const { orden_id, metodo } = body;

    if (!orden_id) {
      return new Response(
        JSON.stringify({ error: 'orden_id es requerido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    if (!metodo || !['wompi_link', 'pix_qr', 'pix_copia_cola'].includes(metodo)) {
      return new Response(
        JSON.stringify({ error: 'metodo inválido. Usa: wompi_link, pix_qr, pix_copia_cola' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // ─── Generate mock link ──────────────────────────────────────────────────
    // TODO: Replace with real Wompi/Pix integration in Phase 2
    const mockId = crypto.randomUUID().slice(0, 8);

    const linkPago = metodo === 'wompi_link'
      ? `https://checkout.wompi.co/p/${mockId}`
      : metodo === 'pix_qr'
      ? `https://pix.example.com/qr/${mockId}`
      : `https://pix.example.com/copia/${mockId}`;

    return new Response(
      JSON.stringify({
        success: true,
        link_pago: linkPago,
        metodo,
        orden_id,
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('[api/pagos/generate-link]', err);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
