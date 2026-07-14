import { describe, it, expect } from 'vitest'
import crypto from 'node:crypto'
import { verifyBoldHmac } from './bold'

function sign(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload, 'utf-8').digest('hex')
}

describe('verifyBoldHmac', () => {
  const secret = 'test-secret-key-12345'

  it('returns true for a valid HMAC', () => {
    const payload = JSON.stringify({ event: 'payment.completed', data: { id: 'tx-abc' } })
    const signature = sign(payload, secret)
    expect(verifyBoldHmac(payload, signature, secret)).toBe(true)
  })

  it('returns false for a tampered payload', () => {
    const payload = JSON.stringify({ event: 'payment.completed', data: { id: 'tx-abc' } })
    const signature = sign(payload, secret)
    const tampered = JSON.stringify({ event: 'payment.failed', data: { id: 'tx-abc' } })
    expect(verifyBoldHmac(tampered, signature, secret)).toBe(false)
  })

  it('returns false for a tampered signature', () => {
    const payload = JSON.stringify({ event: 'payment.completed' })
    expect(verifyBoldHmac(payload, 'tampered-signature-value', secret)).toBe(false)
  })

  it('returns false for empty payload', () => {
    const signature = sign('anything', secret)
    expect(verifyBoldHmac('', signature, secret)).toBe(false)
  })

  it('returns false for empty signature', () => {
    const payload = JSON.stringify({ event: 'payment.completed' })
    expect(verifyBoldHmac(payload, '', secret)).toBe(false)
  })

  it('returns false for empty secret', () => {
    const payload = JSON.stringify({ event: 'payment.completed' })
    const signature = sign(payload, secret)
    expect(verifyBoldHmac(payload, signature, '')).toBe(false)
  })

  it('is constant-time — does not throw on length mismatch', () => {
    const payload = JSON.stringify({ event: 'payment.completed' })
    // timingSafeEqual throws if buffers differ in length, but our
    // catch block should handle that — verify it returns false
    expect(() => verifyBoldHmac(payload, 'short', secret)).not.toThrow()
    expect(verifyBoldHmac(payload, 'short', secret)).toBe(false)
  })

  it('handles invalid UTF-8 gracefully', () => {
    const invalidPayload = Buffer.from([0xff, 0xfe, 0x00, 0x61]).toString('binary')
    const signature = sign(invalidPayload, secret)
    expect(() => verifyBoldHmac(invalidPayload, signature, secret)).not.toThrow()
  })
})
