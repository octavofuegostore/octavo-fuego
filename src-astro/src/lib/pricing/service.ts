/**
 * L-Medusa Pricing Service
 * Adapted from MedusaJS v2: packages/core/src/services/pricing.ts
 *
 * Current: hardcoded COP prices (matches products.ts)
 * Future: Supabase product_prices table
 */

import {
  type PricingService,
  type PriceTier,
  type ProductPricing,
  CURRENCY_CODE,
} from './types';

// ─── Price Data (matches products.ts) ────────────────────────────────────────

const PRODUCT_PRICING: Record<string, ProductPricing> = {
  tisunu: {
    retail: [
      { cantidad: 10, precio: 35000, label: '10g' },
      { cantidad: 20, precio: 70000, label: '20g' },
      { cantidad: 30, precio: 100000, label: '30g' },
    ],
    wholesale: {
      enabled: true,
      minGrams: 100,
      pricePerGram: 2800, // COP per gram
    },
  },
  pixuri: {
    retail: [
      { cantidad: 10, precio: 38000, label: '10g' },
      { cantidad: 20, precio: 76000, label: '20g' },
      { cantidad: 30, precio: 110000, label: '30g' },
    ],
    wholesale: {
      enabled: true,
      minGrams: 100,
      pricePerGram: 3100,
    },
  },
  parika: {
    retail: [
      { cantidad: 10, precio: 32000, label: '10g' },
      { cantidad: 20, precio: 64000, label: '20g' },
      { cantidad: 30, precio: 95000, label: '30g' },
    ],
    wholesale: {
      enabled: true,
      minGrams: 100,
      pricePerGram: 2600,
    },
  },
  'cumaru-de-cheiro': {
    retail: [
      { cantidad: 10, precio: 40000, label: '10g' },
      { cantidad: 20, precio: 80000, label: '20g' },
      { cantidad: 30, precio: 115000, label: '30g' },
    ],
    wholesale: {
      enabled: true,
      minGrams: 100,
      pricePerGram: 3300,
    },
  },
  'vena-de-paje': {
    retail: [
      { cantidad: 10, precio: 45000, label: '10g' },
      { cantidad: 20, precio: 90000, label: '20g' },
      { cantidad: 30, precio: 130000, label: '30g' },
    ],
    wholesale: {
      enabled: true,
      minGrams: 100,
      pricePerGram: 3800,
    },
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function interpolatePrice(tiers: PriceTier[], grams: number): number {
  if (tiers.length === 0) return 0;

  // Exact match
  const exact = tiers.find((t) => t.cantidad === grams);
  if (exact) return exact.precio;

  // Find closest tier below
  const below = [...tiers]
    .filter((t) => t.cantidad <= grams)
    .sort((a, b) => b.cantidad - a.cantidad)[0];

  // Find closest tier above
  const above = [...tiers]
    .filter((t) => t.cantidad >= grams)
    .sort((a, b) => a.cantidad - b.cantidad)[0];

  if (!below) return above!.precio;
  if (!above) return below.precio;

  // Linear interpolation
  const ratio = (grams - below.cantidad) / (above.cantidad - below.cantidad);
  return Math.round(below.precio + ratio * (above.precio - below.precio));
}

// ─── Mock Implementation ─────────────────────────────────────────────────────

class SimplePricingService implements PricingService {
  async getRetailPrice(slug: string, grams: number): Promise<number> {
    const pricing = PRODUCT_PRICING[slug];
    if (!pricing) return 0;

    return interpolatePrice(pricing.retail, grams);
  }

  async getWholesalePrice(slug: string, grams: number): Promise<number> {
    const pricing = PRODUCT_PRICING[slug];
    if (!pricing || !pricing.wholesale.enabled) return 0;

    if (grams < pricing.wholesale.minGrams) return 0;

    return grams * pricing.wholesale.pricePerGram;
  }

  async getPriceTiers(slug: string): Promise<PriceTier[]> {
    const pricing = PRODUCT_PRICING[slug];
    return pricing?.retail || [];
  }

  formatCOP(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: CURRENCY_CODE,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
}

// ─── Factory ─────────────────────────────────────────────────────────────────

let _service: PricingService | null = null;

export function getPricingService(): PricingService {
  if (_service) return _service;
  _service = new SimplePricingService();
  return _service;
}
