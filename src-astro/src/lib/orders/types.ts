/**
 * L-Medusa Order Types
 * Adapted from MedusaJS v2: packages/core/src/services/order.ts
 * Modified for: Octavo Fuego — WhatsApp checkout, manual status updates
 */

// ─── Order Status ────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending' // Order created, waiting for WhatsApp confirmation
  | 'confirmed' // Payment confirmed via WhatsApp
  | 'processing' // Being prepared for shipping
  | 'shipped' // Handed to carrier
  | 'delivered' // Customer confirmed receipt
  | 'cancelled'; // Cancelled by customer or admin

// ─── Order Item ──────────────────────────────────────────────────────────────

export interface OrderItem {
  id: string;
  product_id: string;
  title: string;
  quantity: number; // grams
  unit_price: number; // COP
  total: number; // COP
}

// ─── Order ───────────────────────────────────────────────────────────────────

export interface Order {
  id: string;
  display_id: number;
  customer_id: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number; // COP
  currency_code: string;
  shipping_address: ShippingAddress;
  notes: string;
  created_at: string;
  updated_at: string;
}

// ─── Shipping Address ────────────────────────────────────────────────────────

export interface ShippingAddress {
  full_name: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country_code: string;
  phone: string;
}

// ─── Service Interface ───────────────────────────────────────────────────────

export interface OrderService {
  createOrder(data: CreateOrderInput): Promise<Order>;
  getOrder(orderId: string): Promise<Order | null>;
  getOrderByDisplayId(displayId: number): Promise<Order | null>;
  getCustomerOrders(customerId: string): Promise<Order[]>;
  updateStatus(orderId: string, status: OrderStatus): Promise<boolean>;
  addNote(orderId: string, note: string): Promise<boolean>;
  getNextDisplayId(): number;
}

// ─── Input Types ─────────────────────────────────────────────────────────────

export interface CreateOrderInput {
  customer_id: string;
  items: Array<{
    product_id: string;
    title: string;
    quantity: number;
    unit_price: number;
  }>;
  shipping_address: ShippingAddress;
  notes?: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

export const ORDER_STORAGE_KEY = 'of_orders_v1';
export const ORDER_COUNTER_KEY = 'of_order_counter';

export const STATUS_FLOW: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};
