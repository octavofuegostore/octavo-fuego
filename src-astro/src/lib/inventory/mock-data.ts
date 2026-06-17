/**
 * L-Medusa Inventory Mock Data
 * Real gram values for 5 rapés × 2 locations
 */

import type { InventoryItem, InventoryLevel, LocationId } from './types';

// ─── Products (1 item per rapé variety) ──────────────────────────────────────

export const MOCK_INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 'iitem_tisunu',
    sku: 'RAPE-TISUNU-001',
    title: 'Tisunú — Rapé de Tabaco + Cumarú',
    requires_shipping: true,
  },
  {
    id: 'iitem_pixuri',
    sku: 'RAPE-PIXURI-001',
    title: 'Pixurí — Rapé de Tabaco + Jatobá',
    requires_shipping: true,
  },
  {
    id: 'iitem_parika',
    sku: 'RAPE-PARIKA-001',
    title: 'Pariká — Rapé de Tabaco + Pau Ferro',
    requires_shipping: true,
  },
  {
    id: 'iitem_cumaru',
    sku: 'RAPE-CUMARU-001',
    title: 'Cumarú de Cheiro — Rapé de Tabaco + Cumarú',
    requires_shipping: true,
  },
  {
    id: 'iitem_vena',
    sku: 'RAPE-VENA-001',
    title: 'Vena de Pajé — Rapé de Tabaco + Pajé',
    requires_shipping: true,
  },
];

// ─── Stock Levels (grams) ────────────────────────────────────────────────────

export const MOCK_INVENTORY_LEVELS: InventoryLevel[] = [
  // Tisunú — most popular, highest stock
  {
    inventory_item_id: 'iitem_tisunu',
    location_id: 'sloc_brazil_factory',
    stocked_quantity: 2000,
    reserved_quantity: 0,
    incoming_quantity: 500,
  },
  {
    inventory_item_id: 'iitem_tisunu',
    location_id: 'sloc_colombia_distribution',
    stocked_quantity: 500,
    reserved_quantity: 0,
    incoming_quantity: 0,
  },

  // Pixurí
  {
    inventory_item_id: 'iitem_pixuri',
    location_id: 'sloc_brazil_factory',
    stocked_quantity: 1500,
    reserved_quantity: 0,
    incoming_quantity: 0,
  },
  {
    inventory_item_id: 'iitem_pixuri',
    location_id: 'sloc_colombia_distribution',
    stocked_quantity: 300,
    reserved_quantity: 0,
    incoming_quantity: 0,
  },

  // Pariká
  {
    inventory_item_id: 'iitem_parika',
    location_id: 'sloc_brazil_factory',
    stocked_quantity: 1800,
    reserved_quantity: 0,
    incoming_quantity: 0,
  },
  {
    inventory_item_id: 'iitem_parika',
    location_id: 'sloc_colombia_distribution',
    stocked_quantity: 400,
    reserved_quantity: 0,
    incoming_quantity: 0,
  },

  // Cumarú de Cheiro
  {
    inventory_item_id: 'iitem_cumaru',
    location_id: 'sloc_brazil_factory',
    stocked_quantity: 1200,
    reserved_quantity: 0,
    incoming_quantity: 0,
  },
  {
    inventory_item_id: 'iitem_cumaru',
    location_id: 'sloc_colombia_distribution',
    stocked_quantity: 250,
    reserved_quantity: 0,
    incoming_quantity: 0,
  },

  // Vena de Pajé — rare, lowest stock
  {
    inventory_item_id: 'iitem_vena',
    location_id: 'sloc_brazil_factory',
    stocked_quantity: 900,
    reserved_quantity: 0,
    incoming_quantity: 0,
  },
  {
    inventory_item_id: 'iitem_vena',
    location_id: 'sloc_colombia_distribution',
    stocked_quantity: 200,
    reserved_quantity: 0,
    incoming_quantity: 0,
  },
];

// ─── Slug → InventoryItem ID mapping ─────────────────────────────────────────

export const SLUG_TO_INVENTORY_ITEM_ID: Record<string, string> = {
  tisunu: 'iitem_tisunu',
  pixuri: 'iitem_pixuri',
  parika: 'iitem_parika',
  'cumaru-de-cheiro': 'iitem_cumaru',
  'vena-de-paje': 'iitem_vena',
};

// ─── Reservations (in-memory for mock) ───────────────────────────────────────

export const MOCK_RESERVATIONS: Array<{
  id: string;
  inventory_item_id: string;
  location_id: string;
  quantity: number;
  cart_id: string | null;
  created_at: string;
  expires_at: string | null;
}> = [];
