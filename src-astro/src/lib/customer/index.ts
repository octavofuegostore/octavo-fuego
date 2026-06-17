/**
 * L-Medusa Customer Module
 *
 * Usage:
 *   import { customer, type Customer, GROUP_MAP } from '@/lib/customer';
 *
 *   const profile = await customer.getProfile(token);
 *   await customer.registerB2B({ email, company_name, ... });
 */

export { getCustomerService as customer } from './service';
export {
  type Customer,
  type CustomerGroup,
  type CustomerService,
  type Address,
  type RegisterInput,
  type RegisterB2BInput,
  CUSTOMER_STORAGE_KEY,
  TOKEN_STORAGE_KEY,
  GROUP_MAP,
} from './types';
