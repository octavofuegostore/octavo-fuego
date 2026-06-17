/**
 * L-Medusa Inventory Service
 * Adapted from MedusaJS v2: packages/core/src/services/inventory.ts
 *
 * Provider switch: PUBLIC_INVENTORY_PROVIDER
 *   - 'mock'    → in-memory (current MVP)
 *   - 'supabase'→ PostgreSQL (next)
 *   - 'medusa'  → Medusa backend (future)
 */

import {
  type InventorySnapshot,
  type InventoryService,
  type LocationId,
  type Reservation,
  LOCATIONS,
  LOW_STOCK_THRESHOLD_GRAMS,
  RESERVATION_TTL_MINUTES,
} from './types';
import {
  MOCK_INVENTORY_ITEMS,
  MOCK_INVENTORY_LEVELS,
  SLUG_TO_INVENTORY_ITEM_ID,
  MOCK_RESERVATIONS,
} from './mock-data';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateReservationId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'res_';
  for (let i = 0; i < 12; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function generateCartId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'cart_';
  for (let i = 0; i < 12; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function isExpired(reservation: Reservation): boolean {
  if (!reservation.expires_at) return false;
  return new Date(reservation.expires_at) < new Date();
}

// ─── Mock Implementation ─────────────────────────────────────────────────────

class MockInventoryService implements InventoryService {
  private levels = [...MOCK_INVENTORY_LEVELS];
  private reservations = [...MOCK_RESERVATIONS];

  async getAvailableGrams(slug: string, location: LocationId): Promise<number> {
    const itemId = SLUG_TO_INVENTORY_ITEM_ID[slug];
    if (!itemId) return 0;

    const level = this.levels.find(
      (l) => l.inventory_item_id === itemId && l.location_id === LOCATIONS[location].id
    );
    if (!level) return 0;

    const activeReservations = this.reservations.filter(
      (r) =>
        r.inventory_item_id === itemId &&
        r.location_id === LOCATIONS[location].id &&
        !isExpired(r)
    );
    const reservedGrams = activeReservations.reduce((sum, r) => sum + r.quantity, 0);

    return level.stocked_quantity - reservedGrams;
  }

  async reserveGrams(
    slug: string,
    grams: number,
    location: LocationId,
    cartId: string
  ): Promise<Reservation> {
    const available = await this.getAvailableGrams(slug, location);
    if (available < grams) {
      throw new Error(
        `Insufficient stock for ${slug}: ${available}g available, ${grams}g requested`
      );
    }

    const itemId = SLUG_TO_INVENTORY_ITEM_ID[slug];
    if (!itemId) {
      throw new Error(`Unknown product slug: ${slug}`);
    }

    const reservation: Reservation = {
      id: generateReservationId(),
      inventory_item_id: itemId,
      location_id: LOCATIONS[location].id,
      quantity: grams,
      cart_id: cartId,
      created_at: new Date().toISOString(),
      expires_at: new Date(
        Date.now() + RESERVATION_TTL_MINUTES * 60 * 1000
      ).toISOString(),
    };

    this.reservations.push(reservation);

    // Update reserved_quantity in level
    const level = this.levels.find(
      (l) =>
        l.inventory_item_id === itemId &&
        l.location_id === LOCATIONS[location].id
    );
    if (level) {
      level.reserved_quantity += grams;
    }

    return reservation;
  }

  async confirmDeduction(
    slug: string,
    grams: number,
    location: LocationId
  ): Promise<boolean> {
    const itemId = SLUG_TO_INVENTORY_ITEM_ID[slug];
    if (!itemId) return false;

    const level = this.levels.find(
      (l) =>
        l.inventory_item_id === itemId &&
        l.location_id === LOCATIONS[location].id
    );
    if (!level) return false;

    if (level.stocked_quantity < grams) {
      throw new Error(`Insufficient stock to deduct: ${level.stocked_quantity}g < ${grams}g`);
    }

    level.stocked_quantity -= grams;
    level.reserved_quantity = Math.max(0, level.reserved_quantity - grams);
    return true;
  }

  async releaseReservation(reservationId: string): Promise<boolean> {
    const index = this.reservations.findIndex((r) => r.id === reservationId);
    if (index === -1) return false;

    const reservation = this.reservations[index];
    const level = this.levels.find(
      (l) =>
        l.inventory_item_id === reservation.inventory_item_id &&
        l.location_id === reservation.location_id
    );
    if (level) {
      level.reserved_quantity = Math.max(
        0,
        level.reserved_quantity - reservation.quantity
      );
    }

    this.reservations.splice(index, 1);
    return true;
  }

  async transferStock(
    slug: string,
    grams: number,
    from: LocationId,
    to: LocationId
  ): Promise<boolean> {
    const fromItemId = SLUG_TO_INVENTORY_ITEM_ID[slug];
    if (!fromItemId) return false;

    const fromLevel = this.levels.find(
      (l) =>
        l.inventory_item_id === fromItemId &&
        l.location_id === LOCATIONS[from].id
    );
    const toLevel = this.levels.find(
      (l) =>
        l.inventory_item_id === fromItemId &&
        l.location_id === LOCATIONS[to].id
    );

    if (!fromLevel || !toLevel) return false;
    if (fromLevel.stocked_quantity < grams) {
      throw new Error(
        `Insufficient stock for transfer: ${fromLevel.stocked_quantity}g < ${grams}g`
      );
    }

    fromLevel.stocked_quantity -= grams;
    toLevel.stocked_quantity += grams;
    return true;
  }

  async getLowStockItems(
    threshold: number = LOW_STOCK_THRESHOLD_GRAMS
  ): Promise<InventorySnapshot[]> {
    const snapshots: InventorySnapshot[] = [];

    for (const item of MOCK_INVENTORY_ITEMS) {
      for (const locationId of Object.keys(LOCATIONS) as LocationId[]) {
        const grams = await this.getAvailableGrams(
          Object.keys(SLUG_TO_INVENTORY_ITEM_ID).find(
            (slug) => SLUG_TO_INVENTORY_ITEM_ID[slug] === item.id
          ) || '',
          locationId
        );
        if (grams > 0 && grams < threshold) {
          snapshots.push({
            slug: Object.keys(SLUG_TO_INVENTORY_ITEM_ID).find(
              (slug) => SLUG_TO_INVENTORY_ITEM_ID[slug] === item.id
            ) || '',
            available_grams: grams,
            location: locationId,
            is_low_stock: true,
          });
        }
      }
    }

    return snapshots;
  }

  async getFullSnapshot(location: LocationId): Promise<InventorySnapshot[]> {
    const snapshots: InventorySnapshot[] = [];

    for (const [slug, itemId] of Object.entries(SLUG_TO_INVENTORY_ITEM_ID)) {
      const grams = await this.getAvailableGrams(slug, location);
      snapshots.push({
        slug,
        available_grams: grams,
        location,
        is_low_stock: grams < LOW_STOCK_THRESHOLD_GRAMS,
      });
    }

    return snapshots;
  }
}

// ─── Factory ─────────────────────────────────────────────────────────────────

let _service: InventoryService | null = null;

export function getInventoryService(): InventoryService {
  if (_service) return _service;

  const provider = import.meta.env.PUBLIC_INVENTORY_PROVIDER || 'mock';

  switch (provider) {
    case 'mock':
      _service = new MockInventoryService();
      break;
    // case 'supabase':
    //   _service = new SupabaseInventoryService();
    //   break;
    // case 'medusa':
    //   _service = new MedusaInventoryService();
    //   break;
    default:
      _service = new MockInventoryService();
  }

  return _service;
}
