/**
 * Typed dataLayer event helpers for the GA4 + GTM measurement slice
 * (publish-superpowers, design D5 / spec R-G4).
 *
 * PUBLIC_GTM_ID is the ONLY runtime driver: every helper is a build-time
 * no-op unless it is set. Vite statically replaces `import.meta.env.PUBLIC_*`
 * literals, so with the env var unset the payload branches below fold to
 * dead code and the "dataLayer" strings are eliminated from client bundles
 * (zero-bytes contract — grep-verifiable on dist).
 *
 * Event catalog is WhatsApp-first and honest:
 *   view_item, add_to_cart, begin_checkout, whatsapp_click, generate_lead.
 * purchase is intentionally NOT part of the catalog — it is deferred to the
 * R1.4 order-persistence slice (no client-side fake purchase while payment
 * happens off-platform).
 */

import type { CartItem } from '@/lib/cart/types';

export const EVENT_NAMES = {
  view_item: 'view_item',
  add_to_cart: 'add_to_cart',
  begin_checkout: 'begin_checkout',
  whatsapp_click: 'whatsapp_click',
  generate_lead: 'generate_lead',
} as const;

export type EventName = (typeof EVENT_NAMES)[keyof typeof EVENT_NAMES];

interface DataLayerWindow {
  dataLayer?: unknown[];
}

/**
 * Map a CartItem to the GA4 item schema used by view_item / add_to_cart /
 * begin_checkout pushes. Currency is COP for every locale (single-currency
 * store; if BRL is ever added, update the schema + SEO JSON-LD together).
 */
export function toEcommerceItem(item: Pick<CartItem, 'slug' | 'nombre' | 'precio' | 'cantidad'>): Record<string, unknown> {
  return {
    item_id: item.slug,
    item_name: item.nombre.es,
    price: item.precio,
    quantity: item.cantidad,
    currency: 'COP',
  };
}

/**
 * Push a catalog event to dataLayer. No-op unless PUBLIC_GTM_ID is set at
 * build time (the guard is intentionally inline so Vite's env replacement
 * makes it a literal `if (true) return` that Rollup dead-code-eliminates).
 */
export function pushEvent(name: string, params: Record<string, unknown> = {}): void {
  if (!import.meta.env.PUBLIC_GTM_ID) return;
  if (typeof window === 'undefined') return;
  const w = window as unknown as DataLayerWindow;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: name, ...params });
}
