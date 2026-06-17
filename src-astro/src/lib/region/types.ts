/**
 * L-Medusa Region Types
 * Adapted from MedusaJS v2: packages/core/src/services/pricing.ts
 * Modified for: Octavo Fuego — Multi-region (CO, BR, EU, US)
 *
 * Rules:
 * - CO: ships only to CO, from CO-BOGOTA, Wompi (COP)
 * - BR: ships to BR, from BR-ACRE, Stripe + Pix (BRL)
 * - EU/US: ships internationally from BR-ACRE, Stripe (USD)
 */

// ─── Region ──────────────────────────────────────────────────────────────────

export interface Region {
  id: string;
  codigo: string;        // 'CO', 'BR', 'EU', 'US'
  nombre: string;
  moneda: string;        // 'COP', 'BRL', 'USD'
  idioma: string;        // 'es', 'pt', 'en'
  gateway: string;       // 'wompi', 'stripe'
  bodega_default: string; // UUID de bodega
  activa: boolean;
}

export type RegionCodigo = 'CO' | 'BR' | 'EU' | 'US';

// ─── Conversion Factor ───────────────────────────────────────────────────────

export interface ConversionFactor {
  id: string;
  moneda_origen: string;   // 'BRL'
  moneda_destino: string;  // 'USD'
  factor: number;          // 0.2020 (1 BRL = 0.20 USD)
  actualizado_en: string;
}

// ─── Shipping Tariff ─────────────────────────────────────────────────────────

export interface TarifaEnvio {
  id: string;
  region_id: string;
  min_gramos: number;
  max_gramos: number;
  tarifa_fija: number;       // COP o USD según moneda
  tarifa_por_gramo: number;
  tiempo_estimado: string;   // '3-5 días hábiles'
}

// ─── Region Context (for cart/checkout) ──────────────────────────────────────

export interface RegionContext {
  region: Region;
  tarifa_envio: TarifaEnvio | null;
  total_envio: number;       // calculated shipping cost
}

// ─── Service Interface ───────────────────────────────────────────────────────

export interface RegionService {
  getRegionByCodigo(codigo: RegionCodigo): Promise<Region | null>;
  getRegionById(id: string): Promise<Region | null>;
  getAllRegions(): Promise<Region[]>;
  detectRegionFromHeaders(headers: Headers): Promise<Region>;
  getConversionFactor(monedaOrigen: string, monedaDestino: string): Promise<number>;
  convertCurrency(amount: number, monedaOrigen: string, monedaDestino: string): Promise<number>;
  getTarifaEnvio(regionId: string, gramos: number): Promise<TarifaEnvio | null>;
  calcularEnvio(regionId: string, gramos: number): Promise<number>;
}

// ─── Constants ───────────────────────────────────────────────────────────────

export const REGION_DEFAULT: RegionCodigo = 'CO';
export const CURRENCY_DEFAULT = 'COP';

export const REGION_MAP: Record<RegionCodigo, {
  idioma: string;
  moneda: string;
  gateway: string;
}> = {
  CO: { idioma: 'es', moneda: 'COP', gateway: 'wompi' },
  BR: { idioma: 'pt', moneda: 'BRL', gateway: 'stripe' },
  EU: { idioma: 'en', moneda: 'USD', gateway: 'stripe' },
  US: { idioma: 'en', moneda: 'USD', gateway: 'stripe' },
};
