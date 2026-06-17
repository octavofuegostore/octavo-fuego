# SDD Proposal: L-Medusa + Alfred UI Integration

## 1. Intent
Implement a robust, scalable B2B/B2C backend based on MedusaJS logic, running on top of Supabase (PostgreSQL), and integrated with a high-performance Admin/B2B portal built using Alfred UI (Lexington Themes) components, fully integrated into the existing Astro SSR codebase.

## 2. Scope
### Backend (L-Medusa Layer)
- **Database Schema**: Full SQL schema for products, inventory, customers, prices, carts, orders, and movements.
- **Service Layer**: Implement service modules (Inventory, Cart, Customer, Pricing, Orders) in `src/lib/` using Supabase as the data provider.
- **RPC Functions**: Use PostgreSQL functions for atomicity (stock deduction/deduction).

### Frontend (Alfred Integration)
- **Admin Panel**: Implement protected SSR routes using Alfred UI layouts.
- **B2B Portal**: Private portal for wholesale clients, validating MOQs (Minimum Order Quantities).
- **Data Binding**: Connect Alfred UI components to real Supabase data through the L-Medusa service layer.

## 3. Approach
### Logic Cannibalization (Medusa)
- We are *not* running a Medusa server.
- We *are* adopting Medusa's service-oriented architecture, data models, and logic patterns.
- Medusa GitHub → Logic Source (Read-only reference).
- Supabase → Execution Engine (Live database).

### Component Integration (Alfred)
- Alfred UI Kit components are transferred to `src/components/ui/alfred/`.
- All pages converted to Astro SSR (`prerender = false`).
- Minimalist Studio design aesthetic (clean lines, restricted color palette).

## 4. Risks & Mitigations
- **Licensing**: Keep Alfred repository private and files outside public client-side bundles.
- **Manual Sync**: Logic syncing from Medusa requires periodic manual review of Medusa's upstream updates.
- **Complexity**: Transitioning Alfred components from SSG to SSR requires careful refactoring of props and data fetching.

## 5. Next Steps
1. **Spec/Design Phase**: Formalize the service-to-database contract.
2. **Implementation (Batches)**:
   - Batch A: SQL Schema + Supabase Client.
   - Batch B: L-Medusa Backend Services.
   - Batch C: Admin Panel Routes + Alfred Integration.
3. **Verification**: E2E tests for inventory and order creation.

---
*Status: Draft — Awaiting User Approval*
*Project: Octavo Fuego*
*Date: June 16, 2026*
