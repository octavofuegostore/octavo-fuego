import { atom } from 'nanostores';

export type BoldStatus = 'idle' | 'processing' | 'redirecting' | 'success' | 'failed';

/**
 * Shared checkout/payment state for cross-island communication.
 * CheckoutForm writes to these stores; OrderSummary reads them.
 */
export const boldStatusStore = atom<BoldStatus>('idle');
export const boldTransactionIdStore = atom<string | null>(null);
export const boldOrderIdStore = atom<string | null>(null);
