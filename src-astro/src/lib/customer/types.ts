/**
 * L-Medusa Customer Types
 * Adapted from MedusaJS v2: packages/core/src/services/customer.ts
 * Modified for: Octavo Fuego — WhatsApp checkout, no full auth
 */

// ─── Customer ────────────────────────────────────────────────────────────────

export interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  groups: CustomerGroup[];
  metadata: Record<string, string>;
}

// ─── Customer Group ──────────────────────────────────────────────────────────

export interface CustomerGroup {
  id: string;
  name: string; // 'retail' | 'wholesale'
}

// ─── Address ─────────────────────────────────────────────────────────────────

export interface Address {
  id: string;
  customer_id: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country_code: string;
  phone: string;
}

// ─── Service Interface ───────────────────────────────────────────────────────

export interface CustomerService {
  register(data: RegisterInput): Promise<Customer>;
  login(email: string, password: string): Promise<Customer>;
  getProfile(token: string): Promise<Customer | null>;
  updateProfile(token: string, data: Partial<Customer>): Promise<Customer>;
  registerB2B(data: RegisterB2BInput): Promise<Customer>;
  approveB2B(customerId: string): Promise<boolean>;
}

// ─── Input Types ─────────────────────────────────────────────────────────────

export interface RegisterInput {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
}

export interface RegisterB2BInput extends RegisterInput {
  company_name: string;
  tax_id: string;
  country: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

export const CUSTOMER_STORAGE_KEY = 'of_customer_v1';
export const TOKEN_STORAGE_KEY = 'of_token_v1';

export const GROUP_MAP = {
  retail: { id: 'grp_retail', name: 'retail' },
  wholesale: { id: 'grp_wholesale', name: 'wholesale' },
} as const satisfies Record<string, CustomerGroup>;
