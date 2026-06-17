/**
 * L-Medusa Pricing Module
 *
 * Usage:
 *   import { pricing, formatCOP, type PriceTier } from '@/lib/pricing';
 *
 *   const price = await pricing.getRetailPrice('tisunu', 20);
 *   console.log(pricing.formatCOP(price));
 */

export { getPricingService as pricing } from './service';
export {
  type PriceTier,
  type WholesalePricing,
  type ProductPricing,
  type PricingService,
  CURRENCY_CODE,
  EXCHANGE_RATES,
} from './types';
