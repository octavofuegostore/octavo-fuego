/**
 * L-Medusa Inventory Module
 *
 * Usage:
 *   import { inventory, type InventorySnapshot } from '@/lib/inventory';
 *
 *   const available = await inventory.getAvailableGrams('tisunu', 'brazil_factory');
 *   const snapshots = await inventory.getFullSnapshot('colombia_distribution');
 *   const lowStock = await inventory.getLowStockItems(100);
 */

export { getInventoryService as inventory } from './service';
export {
  type InventoryItem,
  type InventoryLevel,
  type InventorySnapshot,
  type InventoryService,
  type LocationId,
  type Reservation,
  type StockLocation,
  LOCATIONS,
  LOW_STOCK_THRESHOLD_GRAMS,
  RESERVATION_TTL_MINUTES,
} from './types';
