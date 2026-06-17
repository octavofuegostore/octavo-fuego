# Exploration: MedusaJS Architecture Adapted to Octavo Fuego

## Executive Summary

We analyzed MedusaJS v2's core modules (Inventory, Cart, Order, Pricing) to extract architectural patterns for adaptation to Octavo Fuego's L-Medusa backend on Supabase. MedusaJS is a mature, battle-tested e-commerce engine built on Node.js + MikroORM + PostgreSQL. Our L-Medusa is a lightweight adaptation running on Astro SSR + Supabase PostgreSQL with localStorage-based services for MVP.

**Key Finding**: Our database schema (19 tables, 3 views, 3 RPC functions) already maps well to MedusaJS entities. The main gaps are in **service-layer patterns**: atomic transactions, event-driven architecture, order change tracking, and a sophisticated pricing engine.

---

## Current State

### MedusaJS v2 Architecture

MedusaJS uses a modular architecture with these core patterns:

1. **MedusaService Base Class** — Generic CRUD service that auto-generates `list`, `retrieve`, `create`, `update`, `delete` methods for each entity. Maps entity names to DTOs via TypeScript generics.

2. **Dependency Injection (Awilix)** — Services are injected via constructor with typed `InjectedDependencies`. Each module declares its dependencies explicitly.

3. **Decorator Pattern**:
   - `@InjectManager()` — Read operations (no transaction)
   - `@InjectTransactionManager()` — Write operations (within transaction)
   - `@EmitEvents()` — Publish domain events after method completion

4. **Entity Pattern** — MikroORM entities with relationships, decorators, and lifecycle hooks.

5. **Module Joiner** — Modules can communicate via `__joinerConfig()` for cross-module queries.

### Our L-Medusa Current State

| Module | Storage | Transactions | Events | Status |
|--------|---------|--------------|--------|--------|
| Inventory | localStorage (mock) | ❌ No | ❌ No | MVP complete |
| Cart | localStorage | ❌ No | ❌ No | MVP complete |
| Orders | localStorage | ❌ No | ❌ No | MVP complete |
| Pricing | Hardcoded COP | N/A | ❌ No | MVP complete |
| Customer | localStorage | ❌ No | ❌ No | MVP complete |
| Database | Supabase PostgreSQL | ✅ RPC functions | ❌ No | Schema ready |

**Database**: 19 tables, 3 views (`gramos_disponibles`), 3 RPC functions (`incrementar_reserva`, `confirmar_deduccion`, `ajustar_stock`).

---

## Affected Areas

- `src/lib/inventory/service.ts` — Needs Supabase backend, atomic transactions, reservation expiry
- `src/lib/inventory/types.ts` — Types already map well to DB schema
- `src/lib/cart/service.ts` — Needs Supabase backend, cart completion workflow
- `src/lib/cart/types.ts` — Needs multi-currency support
- `src/lib/orders/service.ts` — Needs Supabase backend, order change tracking
- `src/lib/orders/types.ts` — Needs richer status transitions
- `src/lib/pricing/service.ts` — Needs Supabase backend, price list support
- `src/lib/pricing/types.ts` — Needs price sets, rules, preferences
- `src/lib/customer/service.ts` — Needs Supabase Auth integration
- `supabase/migrations/001_initial_schema.sql` — Schema is solid, minor additions needed

---

## Pattern Extraction: Detailed Analysis

### A. Inventory Module

**MedusaJS Pattern:**
```
InventoryItem → InventoryLevel (per location) → ReservationItem
```

- `ensureInventoryLevels()` — Validates levels exist before operations
- `confirmInventory()` — Checks available quantity >= requested
- `adjustInventory()` — Atomic stock adjustment (positive/negative)
- Reservation lifecycle: create → update → delete/restore
- `reserved_quantity` is ONLY managed through reservation items (sanitized input)

**Our Adaptation:**
- Our `niveles_inventario` maps to MedusaJS `InventoryLevel`
- Our `reservas` maps to MedusaJS `ReservationItem`
- Our RPC functions (`incrementar_reserva`, `confirmar_deduccion`) already handle atomic operations
- **Gap**: No reservation expiry logic in DB (only `expira_en` column), no automatic cleanup

**Recommendation:**
- Add a Supabase Edge Function or pg_cron job to auto-expire reservations
- Implement `ensureInventoryLevels` as a Supabase RPC function
- Keep our `gramos_disponibles` view (it's equivalent to MedusaJS's available_quantity calculation)

### B. Cart Module

**MedusaJS Pattern:**
```
Cart → LineItem[] → {Adjustments, TaxLines}
     → ShippingMethod[] → {Adjustments, TaxLines}
     → Address (shipping + billing)
     → CreditLine[]
```

- `decorateCartTotals()` — Calculates subtotal, tax_total, discount_total, total
- Line item adjustments (discounts, surcharges)
- Tax lines per item and shipping method
- Shipping method adjustments
- Cart completion → Order creation

**Our Adaptation:**
- Our `carritos` + `items_carrito` maps to MedusaJS `Cart` + `LineItem`
- **Gap**: No adjustments, no tax lines, no shipping methods in cart
- **Gap**: No cart completion workflow (we go directly to WhatsApp)

**Recommendation:**
- For MVP: Keep cart simple (no adjustments/taxes in cart)
- Add cart→order conversion as a Supabase RPC function
- Later: Add tax calculation per region (CO: IVA 19%, BR: ICMS varies)

### C. Order Module

**MedusaJS Pattern:**
```
Order → OrderItem[] → OrderLineItem → {Adjustments, TaxLines}
     → OrderShippingMethod → {Adjustments, TaxLines}
     → OrderTransaction[]
     → OrderChange → OrderChangeAction[]
     → OrderSummary
     → Return / OrderClaim / OrderExchange
```

- **OrderChange** — Versioning system for tracking modifications (add item, change quantity, etc.)
- **OrderTransaction** — Payment tracking (capture, refund)
- **OrderSummary** — Aggregated totals with breakdown
- **OrderStatus** — Complex workflow with changes

**Our Adaptation:**
- Our `ordenes` + `items_orden` maps to MedusaJS `Order` + `OrderItem`
- Our `STATUS_FLOW` is simpler but covers our needs
- **Gap**: No order change tracking (we just update status directly)
- **Gap**: No transaction tracking (payment capture is manual via WhatsApp)

**Recommendation:**
- For MVP: Keep our simple status flow
- Add `orden_cambios` table for audit trail (who changed what, when)
- Add payment tracking table when we integrate Wompi/Stripe

### D. Pricing Module

**MedusaJS Pattern:**
```
PriceSet → Price[] → PriceRule[]
PriceList → PriceListRule[]
PricePreference (region, currency)
```

- `calculatePrices()` — Resolves price based on context (region, currency, customer group)
- Price lists: OVERRIDE (always use), SALE (use lowest)
- Price rules: attribute-based (region_id, currency_code)
- Price preferences: tax-inclusive pricing per region/currency

**Our Adaptation:**
- Our `listas_precio` maps to MedusaJS `PriceList`
- Our `variantes.precio_cop/brl/usd` is our "default price"
- **Gap**: No price calculation engine (we hardcode in service.ts)
- **Gap**: No price rules or preferences

**Recommendation:**
- For MVP: Move hardcoded prices to Supabase `variantes` table (already there!)
- Create `calcular_precio(variant_id, grupo_id, gramos)` RPC function
- Later: Add price lists for promotions

### E. Customer Module

**MedusaJS Pattern:**
- Customer → CustomerGroup (many-to-many)
- Customer group determines pricing tier
- B2B approval workflow

**Our Adaptation:**
- Our `clientes` + `grupos_clientes` maps well
- Our `b2b_estado` field handles approval workflow
- **Gap**: localStorage auth vs Supabase Auth

**Recommendation:**
- Move to Supabase Auth immediately
- Use `auth_id` column to link Supabase Auth UID to `clientes` table

---

## Approaches

### 1. **Incremental Migration** (Recommended)
Move services one-by-one from localStorage to Supabase, keeping the same API surface.

- **Pros**: Low risk, each module independently deployable, can test incrementally
- **Cons**: Temporary duplication, some patterns won't transfer cleanly
- **Effort**: Medium (2-3 weeks per module)

### 2. **Full Rewrite with MedusaJS Patterns**
Rewrite all services using MedusaJS patterns (DI, decorators, events) on Supabase.

- **Pros**: Clean architecture, event-driven, production-ready
- **Cons**: High effort, overkill for MVP, requires Node.js server
- **Effort**: High (6-8 weeks)

### 3. **Hybrid: Supabase-First with MedusaJS Insights**
Use Supabase RPC functions for business logic, keep Astro SSR for API routes, adopt MedusaJS patterns where they add value.

- **Pros**: Leverages Supabase's strengths (RLS, RPC, Realtime), simpler than full MedusaJS
- **Cons**: Some patterns (events) need Supabase Edge Functions
- **Effort**: Medium (3-4 weeks)

---

## Recommendation

**Approach 3: Hybrid Supabase-First** — This is the sweet spot for Octavo Fuego:

1. **Keep our DB schema** (it's already well-designed)
2. **Move business logic to Supabase RPC functions** (atomic, testable, RLS-protected)
3. **Adopt MedusaJS patterns selectively**:
   - ✅ `ensureInventoryLevels` → RPC function
   - ✅ `confirmInventory` → RPC function  
   - ✅ Cart→Order conversion → RPC function
   - ✅ Price calculation → RPC function
   - ❌ MedusaService base class (overkill)
   - ❌ Awilix DI (we don't need it)
   - ❌ MikroORM entities (we use Supabase client)
   - ✅ Event system → Supabase Realtime + Edge Functions

**Implementation Order:**
1. **Inventory Supabase Service** (highest value, already has RPC functions)
2. **Pricing Supabase Service** (prices are in DB, just need RPC)
3. **Cart Supabase Service** (needs Supabase Auth first)
4. **Order Supabase Service** (depends on Cart)
5. **Customer Supabase Service** (Supabase Auth integration)

---

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Supabase RPC latency | Medium | Low | Use connection pooling, edge functions |
| Reservation expiry race conditions | High | Medium | Use DB-level locks, pg_cron |
| Multi-currency precision loss | Medium | Low | Use `numeric(10,2)` not `float` |
| WhatsApp checkout reliability | High | High | Add retry logic, status polling |
| B2B approval workflow complexity | Medium | Medium | Start simple, iterate |
| Data migration from localStorage | Low | High | One-time migration script |

---

## Comparison Matrix

| Aspect | MedusaJS | Our L-Medusa | Gap |
|--------|----------|--------------|-----|
| Backend | Node.js server | Astro SSR | Different runtime |
| Database | PostgreSQL via TypeORM | Supabase PostgreSQL | Same DB, different client |
| ORM | MikroORM | Supabase client | No ORM needed |
| DI | Awilix | None (factory pattern) | Not needed |
| Events | @EmitEvents decorator | None | Use Supabase Realtime |
| Transactions | @InjectTransactionManager | RPC functions | Equivalent |
| Auth | JWT/sessions | Supabase Auth | Different but fine |
| Inventory | InventoryModuleService | SupabaseInventoryService | Our RPC functions are good |
| Cart | CartModuleService | SupabaseCartService | Need cart completion |
| Orders | OrderModuleService | SupabaseOrdersService | Need change tracking |
| Pricing | PricingModuleService | SupabasePricingService | Need RPC function |
| Payments | Stripe, PayPal | Wompi + Stripe | Manual for now |
| Multi-currency | Price preferences | `precio_cop/brl/usd` columns | Our approach is simpler |
| Customer groups | CustomerGroup entity | `grupos_clientes` table | Equivalent |
| Price lists | PriceList entity | `listas_precio` table | Equivalent |
| Reservations | ReservationItem entity | `reservas` table | Need expiry logic |

---

## Ready for Proposal

**Yes** — The exploration is complete. The orchestrator should:

1. **Present findings to the user** — Show the comparison matrix and recommendation
2. **Ask which module to tackle first** — Inventory (recommended), Pricing, or Cart
3. **Create a change proposal** for the selected module
4. **Proceed to SDD proposal phase** with the chosen approach

The user should understand that:
- Our DB schema is already solid and maps well to MedusaJS patterns
- The main work is moving business logic from localStorage to Supabase RPC functions
- We're NOT building a full MedusaJS clone — we're extracting specific patterns
- The MVP can stay simple; production patterns come in phases
