/**
 * L-Medusa — Unified Backend Layer
 *
 * Main entry point for all L-Medusa services.
 * Import from here for convenience:
 *
 *   import { inventory, cart, customer, pricing, orders, region } from '@/lib';
 */

export { inventory } from './inventory';
export { cart, formatCOP } from './cart';
export { customer } from './customer';
export { pricing } from './pricing';
export { orders } from './orders';
export { region } from './region';

// Re-export all types
export type {
  InventoryItem,
  InventoryLevel,
  InventorySnapshot,
  InventoryService,
  LocationId,
  Reservation,
  StockLocation,
} from './inventory';

export type {
  CartItem,
  CartState,
  CartService,
} from './cart';

export type {
  Customer,
  CustomerGroup,
  CustomerService,
  Address,
  RegisterInput,
  RegisterB2BInput,
} from './customer';

export type {
  PriceTier,
  WholesalePricing,
  ProductPricing,
  PricingService,
} from './pricing';

export type {
  Order,
  OrderItem,
  OrderStatus,
  OrderService,
  ShippingAddress,
  CreateOrderInput,
} from './orders';

export type {
  Region,
  RegionCodigo,
  ConversionFactor,
  TarifaEnvio,
  RegionContext,
  RegionService,
} from './region';

export { REGION_DEFAULT, CURRENCY_DEFAULT, REGION_MAP } from './region';
