/**
 * L-Medusa Pricing Service
 * Adapted from MedusaJS v2: packages/core/src/services/pricing.ts
 *
 * Supports both:
 * - SupabasePricingService (reads from variantes + listas_precio + factores_conversion)
 * - SimplePricingService (fallback mock data)
 */

import { supabase } from '@/lib/supabase';
import {
  type PricingService,
  type PriceTier,
  type ProductPricing,
  CURRENCY_CODE,
} from './types';

const SUPABASE_CONFIGURED = !!(import.meta.env.PUBLIC_SUPABASE_URL);

// ─── Conversion Factors (fallback) ───────────────────────────────────────────

const FACTORES_FALLBACK: Record<string, number> = {
  BRL_TO_USD: 0.2020,
  COP_TO_USD: 0.00024,
  BRL_TO_COP: 833.00,
  USD_TO_COP: 4166.00,
};

async function getFactor(origen: string, destino: string): Promise<number> {
  if (!SUPABASE_CONFIGURED) {
    return FACTORES_FALLBACK[`${origen}_TO_${destino}`] ?? 1;
  }
  const { data } = await supabase
    .from('factores_conversion')
    .select('factor')
    .eq('moneda_origen', origen)
    .eq('moneda_destino', destino)
    .single();
  return (data as any)?.factor ?? 1;
}

function convert(monto: number, factor: number): number {
  return Math.round(monto * factor);
}

// ─── Supabase Implementation ─────────────────────────────────────────────────

class SupabasePricingService implements PricingService {
  async getRetailPrice(slug: string, gramos: number): Promise<number> {
    return this.getPriceForSlug(slug, gramos, 'COP');
  }

  async getPriceForSlug(slug: string, gramos: number, moneda: string): Promise<number> {
    const { data: variantes } = await supabase
      .from('variantes')
      .select('id, gramos, precio_cop, precio_brl, precio_usd')
      .eq('productos.slug', slug);

    if (!variantes || variantes.length === 0) return 0;

    const tiers = variantes as any[];
    const monedaKey = `precio_${moneda.toLowerCase()}`;

    // Exact match
    const exact = tiers.find(t => t.gramos === gramos);
    if (exact) return exact[monedaKey] ?? exact.precio_cop;

    // Interpolate
    const sorted = [...tiers].sort((a, b) => a.gramos - b.gramos);
    const below = [...sorted].reverse().find(t => t.gramos <= gramos);
    const above = sorted.find(t => t.gramos >= gramos);

    if (!below && above) return above[monedaKey] ?? above.precio_cop;
    if (below && !above) return below[monedaKey] ?? below.precio_cop;
    if (!below || !above) return 0;

    const belowPrice = below[monedaKey] ?? below.precio_cop;
    const abovePrice = above[monedaKey] ?? above.precio_cop;
    const ratio = (gramos - below.gramos) / (above.gramos - below.gramos);
    return Math.round(belowPrice + ratio * (abovePrice - belowPrice));
  }

  async getWholesalePrice(slug: string, gramos: number, grupoId?: string): Promise<number> {
    if (!grupoId) return 0;

    const { data } = await supabase
      .from('listas_precio')
      .select('precio_cop, min_gramos')
      .eq('grupo_id', grupoId)
      .single();

    if (!data || gramos < (data as any).min_gramos) return 0;
    return gramos * (data as any).precio_cop;
  }

  async getPriceTiers(slug: string, moneda = 'COP'): Promise<PriceTier[]> {
    const { data } = await supabase
      .from('variantes')
      .select('gramos, precio_cop, precio_brl, precio_usd')
      .eq('productos.slug', slug)
      .order('gramos');

    if (!data) return [];

    return (data as any[]).map(v => ({
      cantidad: v.gramos,
      precio: v[`precio_${moneda.toLowerCase()}`] ?? v.precio_cop,
      label: `${v.gramos}g`,
    }));
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
  _service = SUPABASE_CONFIGURED
    ? new SupabasePricingService()
    : new SimplePricingService();
  return _service;
}
