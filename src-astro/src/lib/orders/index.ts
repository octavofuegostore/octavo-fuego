/**
 * L-Medusa Orders Module
 *
 * Usage:
 *   import { orders, type Order, STATUS_FLOW } from '@/lib/orders';
 *
 *   const order = await orders.createOrder({ customer_id, items, shipping_address });
 *   await orders.updateStatus(order.id, 'confirmed');
 *   await orders.addNote(order.id, 'Pago confirmado vía Nequi');
 */

export { getOrderService as orders } from './service';
export {
  type Order,
  type OrderItem,
  type OrderStatus,
  type OrderService,
  type ShippingAddress,
  type CreateOrderInput,
  ORDER_STORAGE_KEY,
  ORDER_COUNTER_KEY,
  STATUS_FLOW,
} from './types';
