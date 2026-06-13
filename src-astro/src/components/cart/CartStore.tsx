"use client"

import { useStore } from '@nanostores/react';
import { cartItems, cartTotal } from '@/stores/cartStore';

export function CartStore() {
  const items = useStore(cartItems);
  const total = useStore(cartTotal);

  return null;
}