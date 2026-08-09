// Bold Payment Gateway — Port & Adapter (single-file pattern)
// Implements PagoGateway for Bold's checkout API.
// See: https://docs.bold.co

import type { PagoGateway, ResultadoPago } from './pago-gateway'
import type { Monto } from '../value-objects/monto'
import crypto from 'node:crypto'

export interface BoldConfig {
  apiKey: string
  publicKey: string
  secretKey: string
  sandbox: boolean
}

// ── HMAC Webhook Verification ──────────────────────────────────────────────

/**
 * Verifies Bold's webhook HMAC SHA-256 signature.
 * Uses timingSafeEqual to prevent timing attacks.
 * Returns false for empty payload, signature, or secret (never throws).
 */
export function verifyBoldHmac(payload: string, signature: string, secret: string): boolean {
  if (!payload || !signature || !secret) return false
  try {
    const hmac = crypto.createHmac('sha256', secret).update(payload, 'utf-8').digest('hex')
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(signature))
  } catch {
    return false
  }
}

const BOLD_API = {
  sandbox: 'https://api-staging.bold.co',
  production: 'https://api.bold.co',
} as const

/**
 * Real Bold API integration.
 * Uses Bold Checkout API — creates a payment intent and returns a redirect URL.
 */
export class BoldAdapter implements PagoGateway {
  constructor(private config: BoldConfig) {}

  private get baseUrl(): string {
    return this.config.sandbox ? BOLD_API.sandbox : BOLD_API.production
  }

  private get headers(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.config.apiKey}`,
    }
  }

  async cobrar(monto: Monto, metadata: Record<string, unknown>): Promise<ResultadoPago> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/checkout`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          amount: monto.valor,
          currency: monto.divisa.codigo,
          reference: metadata.reference ?? `of-${Date.now()}`,
          description: metadata.description ?? 'Compra Octavo Fuego',
          redirect_url: metadata.redirect_url ?? '/checkout?bold=success',
          customer: metadata.customer ?? undefined,
        }),
      })

      if (!response.ok) {
        const errorBody = await response.text().catch(() => 'unknown error')
        return {
          exitoso: false,
          error: `Bold API error (${response.status}): ${errorBody}`,
        }
      }

      const data = (await response.json()) as {
        id?: string
        checkout_url?: string
        transaction_id?: string
        url?: string
      }

      return {
        exitoso: true,
        urlPago: data.checkout_url ?? data.url,
        codigoPasarela: data.transaction_id ?? data.id,
      }
    } catch (err) {
      return {
        exitoso: false,
        error: err instanceof Error ? err.message : 'Error desconocido al conectar con Bold',
      }
    }
  }

  async reembolsar(codigoPasarela: string): Promise<{ exitoso: boolean }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v1/transactions/${codigoPasarela}/refund`,
        {
          method: 'POST',
          headers: this.headers,
        },
      )
      return { exitoso: response.ok }
    } catch {
      return { exitoso: false }
    }
  }

  async consultar(codigoPasarela: string): Promise<{ estado: string }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v1/transactions/${codigoPasarela}`,
        { headers: this.headers },
      )
      if (!response.ok) return { estado: 'desconocido' }
      const data = (await response.json()) as { status?: string; state?: string }
      return { estado: data.status ?? data.state ?? 'desconocido' }
    } catch {
      return { estado: 'error_conexion' }
    }
  }
}

/**
 * Mock Bold adapter for development and testing.
 * Returns success with a fake checkout URL — no real API call.
 */
export class MockBoldAdapter implements PagoGateway {
  async cobrar(_monto: Monto, _metadata: Record<string, unknown>): Promise<ResultadoPago> {
    const fakeId = `bold_mock_${Date.now()}`
    return {
      exitoso: true,
      urlPago: `https://checkout.bold.co/mock/${fakeId}`,
      codigoPasarela: fakeId,
    }
  }

  async reembolsar(_codigoPasarela: string): Promise<{ exitoso: boolean }> {
    return { exitoso: true }
  }

  async consultar(_codigoPasarela: string): Promise<{ estado: string }> {
    return { estado: 'mock_aprobado' }
  }
}
