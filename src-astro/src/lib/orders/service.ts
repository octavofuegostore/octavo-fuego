/**
 * L-Medusa Order Service
 * Adapted from MedusaJS v2: packages/core/src/services/order.ts
 *
 * Current: localStorage (manual WhatsApp orders)
 * Future: Supabase orders table
 */

import {
  type Order,
  type OrderService,
  type OrderStatus,
  type CreateOrderInput,
  ORDER_STORAGE_KEY,
  ORDER_COUNTER_KEY,
  STATUS_FLOW,
} from './types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateOrderId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'ord_';
  for (let i = 0; i < 12; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function generateItemId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'oi_';
  for (let i = 0; i < 8; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

// ─── Mock Implementation (localStorage) ──────────────────────────────────────

class LocalStorageOrderService implements OrderService {
  private orders: Map<string, Order> = new Map();
  private counter: number = 1;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(ORDER_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Order[];
        parsed.forEach((o) => this.orders.set(o.id, o));
      }

      const counterStored = localStorage.getItem(ORDER_COUNTER_KEY);
      if (counterStored) {
        this.counter = parseInt(counterStored, 10) || 1;
      }
    } catch {
      // Corrupted data, start fresh
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(
        ORDER_STORAGE_KEY,
        JSON.stringify(Array.from(this.orders.values()))
      );
      localStorage.setItem(ORDER_COUNTER_KEY, String(this.counter));
    } catch {
      // Storage full or unavailable
    }
  }

  async createOrder(data: CreateOrderInput): Promise<Order> {
    const items = data.items.map((item) => ({
      id: generateItemId(),
      product_id: item.product_id,
      title: item.title,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total: item.quantity * item.unit_price,
    }));

    const total = items.reduce((sum, item) => sum + item.total, 0);

    const order: Order = {
      id: generateOrderId(),
      display_id: this.counter++,
      customer_id: data.customer_id,
      status: 'pending',
      items,
      total,
      currency_code: 'COP',
      shipping_address: data.shipping_address,
      notes: data.notes || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.orders.set(order.id, order);
    this.saveToStorage();
    return order;
  }

  async getOrder(orderId: string): Promise<Order | null> {
    return this.orders.get(orderId) || null;
  }

  async getOrderByDisplayId(displayId: number): Promise<Order | null> {
    for (const order of this.orders.values()) {
      if (order.display_id === displayId) return order;
    }
    return null;
  }

  async getCustomerOrders(customerId: string): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter((o) => o.customer_id === customerId)
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }

  async updateStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    const order = this.orders.get(orderId);
    if (!order) return false;

    // Validate status transition
    const allowed = STATUS_FLOW[order.status];
    if (!allowed.includes(status)) {
      console.warn(
        `Invalid status transition: ${order.status} → ${status}. Allowed: ${allowed.join(', ')}`
      );
      return false;
    }

    order.status = status;
    order.updated_at = new Date().toISOString();
    this.orders.set(orderId, order);
    this.saveToStorage();
    return true;
  }

  async addNote(orderId: string, note: string): Promise<boolean> {
    const order = this.orders.get(orderId);
    if (!order) return false;

    order.notes = order.notes
      ? `${order.notes}\n${note}`
      : note;
    order.updated_at = new Date().toISOString();
    this.orders.set(orderId, order);
    this.saveToStorage();
    return true;
  }

  getNextDisplayId(): number {
    return this.counter;
  }
}

// ─── Factory ─────────────────────────────────────────────────────────────────

let _service: OrderService | null = null;

export function getOrderService(): OrderService {
  if (_service) return _service;
  _service = new LocalStorageOrderService();
  return _service;
}
