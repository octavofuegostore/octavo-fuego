/**
 * L-Medusa Inventory Types
 * Adapted from MedusaJS v2 core: packages/core/src/services/inventory.ts
 * Modified for: Octavo Fuego — 1 unit = 1 gram, 2 locations
 */

// ─── Location ────────────────────────────────────────────────────────────────

export interface StockLocation {
  id: string;
  name: string;
  address: {
    city: string;
    country_code: string;
  };
}

export type LocationId = 'brazil_factory' | 'colombia_distribution';

// ─── Inventory Item ──────────────────────────────────────────────────────────

export interface InventoryItem {
  id: string;
  sku: string;
  title: string;
  requires_shipping: boolean;
}

// ─── Inventory Level ─────────────────────────────────────────────────────────

export interface InventoryLevel {
  inventory_item_id: string;
  location_id: string;
  stocked_quantity: number;
  reserved_quantity: number;
  incoming_quantity: number;
}

// ─── Reservation ─────────────────────────────────────────────────────────────

export interface Reservation {
  id: string;
  inventory_item_id: string;
  location_id: string;
  quantity: number;
  cart_id: string | null;
  created_at: string;
  expires_at: string | null;
}

// ─── Snapshot (public API) ───────────────────────────────────────────────────

export interface InventorySnapshot {
  slug: string;
  available_grams: number;
  location: LocationId;
  is_low_stock: boolean;
}

// ─── Service Interface ───────────────────────────────────────────────────────

export interface InventoryService {
  getAvailableGrams(slug: string, location: LocationId): Promise<number>;
  reserveGrams(
    slug: string,
    grams: number,
    location: LocationId,
    cartId: string
  ): Promise<Reservation>;
  confirmDeduction(
    slug: string,
    grams: number,
    location: LocationId
  ): Promise<boolean>;
  releaseReservation(reservationId: string): Promise<boolean>;
  transferStock(
    slug: string,
    grams: number,
    from: LocationId,
    to: LocationId
  ): Promise<boolean>;
  getLowStockItems(threshold?: number): Promise<InventorySnapshot[]>;
  getFullSnapshot(location: LocationId): Promise<InventorySnapshot[]>;
}

// ─── Constants ───────────────────────────────────────────────────────────────

export const LOCATIONS: Record<LocationId, StockLocation> = {
  brazil_factory: {
    id: 'sloc_brazil_factory',
    name: 'Fábrica Acre (BR)',
    address: {
      city: 'Rio Branco',
      country_code: 'BR',
    },
  },
  colombia_distribution: {
    id: 'sloc_colombia_distribution',
    name: 'Distribución Colombia (CO)',
    address: {
      city: 'Bogotá',
      country_code: 'CO',
    },
  },
};

export const LOW_STOCK_THRESHOLD_GRAMS = 50;
export const RESERVATION_TTL_MINUTES = 15;
