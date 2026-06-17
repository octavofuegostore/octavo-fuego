/**
 * L-Medusa Cart Module
 *
 * Usage:
 *   import { cart, formatCOP, type CartItem } from '@/lib/cart';
 *
 *   const state = cart.getCart();
 *   cart.addToCart({ variantId: '10g_tisunu', ... });
 *   console.log(formatCOP(state.total));
 */

export { getCartService as cart, formatCOP } from './service';
export {
  type CartItem,
  type CartState,
  type CartService,
  CART_STORAGE_KEY,
  MAX_ITEMS_IN_CART,
  MAX_GRAMS_PER_ITEM,
  REGION_MAP,
} from './types';
