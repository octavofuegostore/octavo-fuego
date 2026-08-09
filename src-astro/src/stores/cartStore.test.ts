import { describe, it, expect, beforeEach } from 'vitest';
import { cartItems, addToCart, removeFromCart, updateQuantity, clearCart } from './cartStore';
import type { CartItem } from '@/lib/cart/types';

const mockItem: CartItem = {
  id: '1',
  variantId: 'rape-kaxinawa-10g',
  nombre: { es: 'Rapé Kaxinawá', en: 'Rapé Kaxinawá', pt: 'Rapé Kaxinawá' },
  etnia: 'Kaxinawá',
  tipo: 'rape',
  precio: 45000,
  cantidad: 10,
  imagen: '/images/rape-kaxinawa.jpg',
  slug: 'rape-kaxinawa',
};

const mockItem2: CartItem = {
  id: '2',
  variantId: 'rape-nukini-20g',
  nombre: { es: 'Rapé Nukini', en: 'Rapé Nukini', pt: 'Rapé Nukini' },
  etnia: 'Nukini',
  tipo: 'rape',
  precio: 65000,
  cantidad: 20,
  imagen: '/images/rape-nukini.jpg',
  slug: 'rape-nukini',
};

describe('cartStore', () => {
  beforeEach(() => {
    localStorage.clear();
    cartItems.set([]);
  });

  it('adds a new item', () => {
    addToCart(mockItem);
    const items = cartItems.get();
    expect(items).toHaveLength(1);
    expect(items[0].variantId).toBe('rape-kaxinawa-10g');
    expect(items[0].cantidad).toBe(10);
  });

  it('increments quantity when adding an existing variantId', () => {
    addToCart(mockItem);
    addToCart({ ...mockItem, cantidad: 5 });
    const items = cartItems.get();
    expect(items).toHaveLength(1);
    expect(items[0].cantidad).toBe(15);
  });

  it('removes an item by variantId', () => {
    addToCart(mockItem);
    addToCart(mockItem2);
    removeFromCart('rape-kaxinawa-10g');
    const items = cartItems.get();
    expect(items).toHaveLength(1);
    expect(items[0].variantId).toBe('rape-nukini-20g');
  });

  it('updates quantity for an item', () => {
    addToCart(mockItem);
    updateQuantity('rape-kaxinawa-10g', 25);
    expect(cartItems.get()[0].cantidad).toBe(25);
  });

  it('removes the item when updating quantity to 0', () => {
    addToCart(mockItem);
    updateQuantity('rape-kaxinawa-10g', 0);
    expect(cartItems.get()).toHaveLength(0);
  });

  it('clears the entire cart', () => {
    addToCart(mockItem);
    addToCart(mockItem2);
    clearCart();
    expect(cartItems.get()).toHaveLength(0);
  });
});
