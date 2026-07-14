/**
 * Lightweight payment gateway for the checkout React island.
 *
 * Mirrors the MockBoldAdapter behavior from the admin domain layer but
 * has ZERO Node.js dependencies — safe for browser client bundles.
 *
 * When Bold sandbox credentials are configured and the real BoldAdapter
 * is needed, swap this file's implementation to import from the domain layer.
 */

export interface CheckoutPaymentResult {
  exitoso: boolean;
  urlPago?: string;
  codigoPasarela?: string;
  error?: string;
}

export interface CheckoutGateway {
  cobrar(total: number, metadata: Record<string, unknown>): Promise<CheckoutPaymentResult>;
}

/**
 * Mock checkout gateway.
 * Returns a fake success with a simulated Bold checkout URL.
 * No real API call — safe for development and client-side bundles.
 */
class CheckoutMockGateway implements CheckoutGateway {
  async cobrar(_total: number, _metadata: Record<string, unknown>): Promise<CheckoutPaymentResult> {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 300));

    const fakeId = `bold_mock_${Date.now()}`;
    return {
      exitoso: true,
      urlPago: `https://checkout.bold.co/mock/${fakeId}`,
      codigoPasarela: fakeId,
    };
  }
}

let _instance: CheckoutGateway | null = null;

/**
 * Creates or returns the cached checkout gateway singleton.
 * Currently uses the mock implementation (no Bold credentials required).
 */
export function createCheckoutGateway(): CheckoutGateway {
  if (!_instance) {
    _instance = new CheckoutMockGateway();
  }
  return _instance;
}
