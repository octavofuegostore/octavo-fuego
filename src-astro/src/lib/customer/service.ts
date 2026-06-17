/**
 * L-Medusa Customer Service
 * Adapted from MedusaJS v2: packages/core/src/services/customer.ts
 *
 * Provider: localStorage (current MVP)
 * Future: Supabase Auth
 *
 * Current: WhatsApp checkout (no full auth needed)
 * Future: Full auth for B2B portal
 */

import {
  type Customer,
  type CustomerService,
  type RegisterInput,
  type RegisterB2BInput,
  type CustomerGroup,
  CUSTOMER_STORAGE_KEY,
  TOKEN_STORAGE_KEY,
  GROUP_MAP,
} from './types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateCustomerId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'cust_';
  for (let i = 0; i < 12; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function generateToken(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'tok_';
  for (let i = 0; i < 32; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

// ─── Mock Implementation (localStorage) ──────────────────────────────────────

class LocalStorageCustomerService implements CustomerService {
  private customers: Map<string, Customer> = new Map();
  private tokens: Map<string, string> = new Map(); // token → customerId

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(CUSTOMER_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Customer[];
        parsed.forEach((c) => this.customers.set(c.id, c));
      }

      const tokenStored = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (tokenStored) {
        const parsed = JSON.parse(tokenStored) as Record<string, string>;
        Object.entries(parsed).forEach(([token, customerId]) =>
          this.tokens.set(token, customerId)
        );
      }
    } catch {
      // Corrupted data, start fresh
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(
        CUSTOMER_STORAGE_KEY,
        JSON.stringify(Array.from(this.customers.values()))
      );
      const tokenMap: Record<string, string> = {};
      this.tokens.forEach((customerId, token) => {
        tokenMap[token] = customerId;
      });
      localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokenMap));
    } catch {
      // Storage full or unavailable
    }
  }

  async register(data: RegisterInput): Promise<Customer> {
    // Check if email already exists
    for (const customer of this.customers.values()) {
      if (customer.email === data.email) {
        throw new Error('Email already registered');
      }
    }

    const customer: Customer = {
      id: generateCustomerId(),
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone,
      groups: [GROUP_MAP.retail],
      metadata: {},
    };

    this.customers.set(customer.id, customer);
    this.saveToStorage();
    return customer;
  }

  async login(email: string, _password: string): Promise<Customer> {
    for (const customer of this.customers.values()) {
      if (customer.email === email) {
        return customer;
      }
    }
    throw new Error('Customer not found');
  }

  async getProfile(token: string): Promise<Customer | null> {
    const customerId = this.tokens.get(token);
    if (!customerId) return null;

    const customer = this.customers.get(customerId);
    return customer || null;
  }

  async updateProfile(
    token: string,
    data: Partial<Customer>
  ): Promise<Customer> {
    const customerId = this.tokens.get(token);
    if (!customerId) throw new Error('Invalid token');

    const customer = this.customers.get(customerId);
    if (!customer) throw new Error('Customer not found');

    const updated = { ...customer, ...data, id: customer.id };
    this.customers.set(customerId, updated);
    this.saveToStorage();
    return updated;
  }

  async registerB2B(data: RegisterB2BInput): Promise<Customer> {
    const customer = await this.register(data);

    // Add to wholesale group
    customer.groups = [GROUP_MAP.retail, GROUP_MAP.wholesale];
    customer.metadata.company_name = data.company_name;
    customer.metadata.tax_id = data.tax_id;
    customer.metadata.b2b_status = 'pending';

    this.customers.set(customer.id, customer);
    this.saveToStorage();
    return customer;
  }

  async approveB2B(customerId: string): Promise<boolean> {
    const customer = this.customers.get(customerId);
    if (!customer) return false;

    customer.metadata.b2b_status = 'approved';
    this.customers.set(customerId, customer);
    this.saveToStorage();
    return true;
  }
}

// ─── Factory ─────────────────────────────────────────────────────────────────

let _service: CustomerService | null = null;

export function getCustomerService(): CustomerService {
  if (_service) return _service;
  _service = new LocalStorageCustomerService();
  return _service;
}
