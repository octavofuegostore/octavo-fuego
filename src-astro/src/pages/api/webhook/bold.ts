export const prerender = false

import type { APIRoute } from 'astro'
import { verifyBoldHmac } from '@/lib/admin/domain/gateways/bold'
import { eventBus } from '@/lib/admin/eventos'

/**
 * Bold payment webhook endpoint.
 *
 * Bold sends webhook events (payment.completed, payment.failed) to this URL.
 * HMAC SHA-256 signature is verified via `x-bold-signature` header before
 * processing. Returns 200 immediately and processes async via eventBus.
 *
 * Spec: R13-R16
 * - R13: MUST verify HMAC SHA-256
 * - R14: MUST update order state (via eventBus handler)
 * - R15: MUST respond 200 immediately, process async
 * - R16: MUST reject 401 if HMAC invalid
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    // Read secret lazily — supports import.meta.env (Astro) and
    // process.env (vitest) so integration tests can set it dynamically
    const secretKey =
      (import.meta as any).env?.BOLD_SECRET_KEY ||
      process.env.BOLD_SECRET_KEY ||
      ''

    const signature = request.headers.get('x-bold-signature')
    if (!signature) {
      return new Response(JSON.stringify({ error: 'Missing signature header' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const rawBody = await request.text()

    if (!verifyBoldHmac(rawBody, signature, secretKey)) {
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // ── Parse and dispatch webhook event ─────────────────────────────────
    const body = JSON.parse(rawBody)
    const eventType = body.event ?? ''
    const txData = body.data ?? {}

    if (eventType === 'payment.completed' || txData.status === 'approved') {
      eventBus.emit('pago:confirmado', {
        pagoId: txData.transactionId ?? txData.id ?? 'unknown',
        ordenId: txData.reference ?? txData.orderId ?? 'unknown',
        monto: txData.amount ?? 0,
      })
    } else if (eventType === 'payment.failed' || txData.status === 'failed') {
      eventBus.emit('pago:fallido', {
        pagoId: txData.transactionId ?? txData.id ?? 'unknown',
        ordenId: txData.reference ?? txData.orderId ?? 'unknown',
        razon: txData.reason ?? 'unknown',
      })
    }

    // R15: Return 200 immediately — processing continues via eventBus
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[Bold Webhook] Error:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
