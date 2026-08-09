import { describe, it, expect } from 'vitest'
import crypto from 'node:crypto'
import { POST } from '@/pages/api/webhook/bold'

/**
 * Integration tests for POST /api/webhook/bold.
 *
 * The handler reads BOLD_SECRET_KEY from process.env at call time
 * (fallback from import.meta.env), so we set it at module top before
 * any describe blocks run.
 */
const TEST_SECRET = 'test-webhook-secret-999'
process.env.BOLD_SECRET_KEY = TEST_SECRET

function sign(payload: string): string {
  return crypto.createHmac('sha256', TEST_SECRET).update(payload, 'utf-8').digest('hex')
}

function buildRequest(body: Record<string, unknown>, signature?: string): Request {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (signature) headers['x-bold-signature'] = signature
  return new Request('http://localhost/api/webhook/bold', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
}

describe('POST /api/webhook/bold', () => {
  it('returns 200 for valid HMAC with payment.completed event', async () => {
    const payload = { event: 'payment.completed', data: { id: 'tx-456', reference: 'ord-789', amount: 35000 } }
    const signature = sign(JSON.stringify(payload))
    const request = buildRequest(payload, signature)
    const response = await POST({ request } as any)
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body).toEqual({ received: true })
  })

  it('returns 401 when no x-bold-signature header is present', async () => {
    const payload = { event: 'payment.completed' }
    const request = buildRequest(payload) // no signature
    const response = await POST({ request } as any)
    expect(response.status).toBe(401)
    const body = await response.json()
    expect(body).toHaveProperty('error')
  })

  it('returns 401 with invalid (tampered) HMAC', async () => {
    const payload = { event: 'payment.completed' }
    const request = buildRequest(payload, 'this-is-a-fake-signature')
    const response = await POST({ request } as any)
    expect(response.status).toBe(401)
    const body = await response.json()
    expect(body).toHaveProperty('error')
  })

  it('returns 401 with HMAC from a different secret', async () => {
    const payload = { event: 'payment.completed' }
    const wrongSignature = crypto
      .createHmac('sha256', 'wrong-secret-key')
      .update(JSON.stringify(payload), 'utf-8')
      .digest('hex')
    const request = buildRequest(payload, wrongSignature)
    const response = await POST({ request } as any)
    expect(response.status).toBe(401)
  })

  it('returns 401 with empty x-bold-signature header', async () => {
    const payload = { event: 'payment.completed' }
    const request = buildRequest(payload, '')
    const response = await POST({ request } as any)
    expect(response.status).toBe(401)
  })
})
