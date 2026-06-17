/**
 * L-Medusa Cart Types
 * Adapted from MedusaJS v2: packages/core/src/services/cart.ts
 * Modified for: Octavo Fuego — single currency (COP), WhatsApp checkout
 */

import type { Locale } from '@/i18n/config';

// ─── Cart Item ───────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  variantId: string;
  nombre: Record<Locale, string>;
  etnia: string;
  tipo: 'rape';
  precio: number; // COP
  cantidad: number; // grams
  imagen: string;
  slug: string;
}

// ─── Cart State ──────────────────────────────────────────────────────────────

export interface CartState {
  id: string | null;
  items: CartItem[];
  total: number;
  region_id: string; // 'co' | 'br'
  created_at: string;
  updated_at: string;
}

// ─── Service Interface ───────────────────────────────────────────────────────

export interface CartService {
  getCart(): CartState;
  addToCart(item: Omit<CartItem, 'id'>): CartState;
  removeFromCart(variantId: string): CartState;
  updateQuantity(variantId: string, cantidad: number): CartState;
  clearCart(): CartState;
  getCartTotal(): number;
  getItemCount(): number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

export const CART_STORAGE_KEY = 'of_cart_v1';
export const MAX_ITEMS_IN_CART = 10;
export const MAX_GRAMS_PER_ITEM = 500;

export const REGION_MAP: Record<string, string> = {
  CO: 'co',
  BR: 'br',
  DEFAULT: 'co',
};
