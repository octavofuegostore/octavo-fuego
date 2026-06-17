/**
 * L-Medusa Cart Service
 * Adapted from MedusaJS v2: packages/core/src/services/cart.ts
 *
 * Provider: localStorage (current MVP)
 * Future: Supabase (persistent carts across devices)
 */

import {
  type CartItem,
  type CartState,
  type CartService,
  CART_STORAGE_KEY,
  MAX_ITEMS_IN_CART,
  MAX_GRAMS_PER_ITEM,
} from './types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateCartId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'cart_';
  for (let i = 0; i < 12; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function generateItemId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'item_';
  for (let i = 0; i < 8; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// ─── Mock Implementation (localStorage) ──────────────────────────────────────

class LocalStorageCartService implements CartService {
  private state: CartState;

  constructor() {
    this.state = this.loadFromStorage();
  }

  private loadFromStorage(): CartState {
    if (typeof window === 'undefined') {
      return this.createEmptyCart();
    }

    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CartState;
        if (Array.isArray(parsed.items) && typeof parsed.total === 'number') {
          return parsed;
        }
      }
    } catch {
      // Corrupted data, start fresh
    }

    return this.createEmptyCart();
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // Storage full or unavailable — fail silently
    }
  }

  private createEmptyCart(): CartState {
    return {
      id: null,
      items: [],
      total: 0,
      region_id: 'co',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  private recalculateTotal(): void {
    this.state.total = this.state.items.reduce(
      (sum, item) => sum + item.precio * item.cantidad,
      0
    );
    this.state.updated_at = new Date().toISOString();
  }

  getCart(): CartState {
    return { ...this.state, items: [...this.state.items] };
  }

  addToCart(item: Omit<CartItem, 'id'>): CartState {
    // Check cart limits
    if (this.state.items.length >= MAX_ITEMS_IN_CART) {
      console.warn(`Cart limit reached: ${MAX_ITEMS_IN_CART} items max`);
      return this.getCart();
    }

    // Check per-item gram limit
    if (item.cantidad > MAX_GRAMS_PER_ITEM) {
      console.warn(
        `Gram limit exceeded: ${MAX_GRAMS_PER_ITEM}g max per item`
      );
      return this.getCart();
    }

    // Check if variant already in cart
    const existingIndex = this.state.items.findIndex(
      (i) => i.variantId === item.variantId
    );

    if (existingIndex >= 0) {
      // Update quantity
      const newQuantity = this.state.items[existingIndex].cantidad + item.cantidad;
      if (newQuantity > MAX_GRAMS_PER_ITEM) {
        console.warn(
          `Total grams for this item would exceed ${MAX_GRAMS_PER_ITEM}g`
        );
        return this.getCart();
      }
      this.state.items[existingIndex].cantidad = newQuantity;
    } else {
      // Add new item
      this.state.items.push({
        ...item,
        id: generateItemId(),
      });
    }

    this.state.id = this.state.id || generateCartId();
    this.recalculateTotal();
    this.saveToStorage();
    return this.getCart();
  }

  removeFromCart(variantId: string): CartState {
    this.state.items = this.state.items.filter(
      (i) => i.variantId !== variantId
    );
    this.recalculateTotal();
    this.saveToStorage();
    return this.getCart();
  }

  updateQuantity(variantId: string, cantidad: number): CartState {
    const index = this.state.items.findIndex(
      (i) => i.variantId === variantId
    );
    if (index === -1) return this.getCart();

    if (cantidad <= 0) {
      return this.removeFromCart(variantId);
    }

    if (cantidad > MAX_GRAMS_PER_ITEM) {
      console.warn(
        `Gram limit exceeded: ${MAX_GRAMS_PER_ITEM}g max per item`
      );
      return this.getCart();
    }

    this.state.items[index].cantidad = cantidad;
    this.recalculateTotal();
    this.saveToStorage();
    return this.getCart();
  }

  clearCart(): CartState {
    this.state = this.createEmptyCart();
    this.saveToStorage();
    return this.getCart();
  }

  getCartTotal(): number {
    return this.state.total;
  }

  getItemCount(): number {
    return this.state.items.length;
  }
}

// ─── Factory ─────────────────────────────────────────────────────────────────

let _service: CartService | null = null;

export function getCartService(): CartService {
  if (_service) return _service;
  _service = new LocalStorageCartService();
  return _service;
}

export { formatCOP };
