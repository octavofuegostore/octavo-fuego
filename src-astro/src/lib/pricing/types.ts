/**
 * L-Medusa Pricing Types
 * Adapted from MedusaJS v2: packages/core/src/services/pricing.ts
 * Modified for: Octavo Fuego — COP only, simple tiered pricing
 */

// ─── Price Tier ──────────────────────────────────────────────────────────────

export interface PriceTier {
  cantidad: number; // grams
  precio: number; // COP
  label: string; // "10g", "20g", "30g"
}

// ─── Wholesale Pricing ───────────────────────────────────────────────────────

export interface WholesalePricing {
  enabled: boolean;
  minGrams: number; // minimum order for wholesale
  pricePerGram: number; // COP per gram
}

// ─── Product Pricing ─────────────────────────────────────────────────────────

export interface ProductPricing {
  retail: PriceTier[];
  wholesale: WholesalePricing;
}

// ─── Service Interface ───────────────────────────────────────────────────────

export interface PricingService {
  getRetailPrice(slug: string, grams: number): number;
  getWholesalePrice(slug: string, grams: number): number;
  getPriceTiers(slug: string): PriceTier[];
  formatCOP(amount: number): string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

export const CURRENCY_CODE = 'COP';

export const EXCHANGE_RATES: Record<string, number> = {
  COP: 1,
  BRL: 0.0012, // 1 COP ≈ 0.0012 BRL
  USD: 0.00024, // 1 COP ≈ 0.00024 USD
};
