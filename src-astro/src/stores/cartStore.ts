import { atom } from 'nanostores';
import type { CartItem } from '@/lib/cart/types';

export type { CartItem } from '@/lib/cart/types';

const isBrowser = typeof window !== 'undefined';

/**
 * Legacy tipo values that are no longer valid.
 * If found in localStorage, filter them out with a console.warn.
 */
const VALID_TIPOS = new Set(['rape']);

function filterLegacyItems(items: CartItem[]): CartItem[] {
  return items.filter((item) => {
    if (!VALID_TIPOS.has(item.tipo)) {
      console.warn(
        `[cartStore] Removing legacy item "${item.nombre.es}" with invalid tipo="${item.tipo}". ` +
        `Only "rape" products are supported now.`
      );
      return false;
    }
    return true;
  });
}

const rawInitialCart: CartItem[] = isBrowser
  ? JSON.parse(localStorage.getItem('octavo-cart') || '[]')
  : [];

const initialCart = filterLegacyItems(rawInitialCart);

export const cartItems = atom<CartItem[]>(initialCart);

// Sync with localStorage
cartItems.listen((items) => {
  if (isBrowser) {
    localStorage.setItem('octavo-cart', JSON.stringify(items));
  }
});

// Cart count
export const cartCount = atom<number>(
  initialCart.reduce((sum, item) => sum + item.cantidad, 0)
);

cartItems.listen((items) => {
  cartCount.set(items.reduce((sum, item) => sum + item.cantidad, 0));
});

// Cart total
export const cartTotal = atom<number>(
  initialCart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
);

cartItems.listen((items) => {
  cartTotal.set(items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0));
});

// Actions
export function addToCart(item: CartItem) {
  const currentItems = cartItems.get();
  const existingIndex = currentItems.findIndex(
    (i) => i.variantId === item.variantId
  );

  if (existingIndex >= 0) {
    const updated = [...currentItems];
    updated[existingIndex] = {
      ...updated[existingIndex],
      cantidad: updated[existingIndex].cantidad + item.cantidad,
    };
    cartItems.set(updated);
  } else {
    cartItems.set([...currentItems, item]);
  }
}

export function removeFromCart(variantId: string) {
  const currentItems = cartItems.get();
  cartItems.set(currentItems.filter((i) => i.variantId !== variantId));
}

export function updateQuantity(variantId: string, cantidad: number) {
  if (cantidad <= 0) {
    removeFromCart(variantId);
    return;
  }

  const currentItems = cartItems.get();
  const updated = currentItems.map((item) =>
    item.variantId === variantId ? { ...item, cantidad } : item
  );
  cartItems.set(updated);
}

export function clearCart() {
  cartItems.set([]);
}

// Format COP currency
export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
