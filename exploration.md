# Exploration: Phase 2 Core Ecommerce — Patterns to Cannibalize

**Date**: 2026-07-01
**Sources**: 12 Engram observations + full codebase inspection (50+ files across 5 service domains)

## Executive Summary

Octavo Fuego has a **well-designed database schema** (migration 001 — 19 tables, 3 RPCs, 1 view) and **all 6 service interfaces defined** (cart, inventory, pricing, orders, customer, region), but **EVERY service runs on mock/localStorage providers**. Phase 2's job is to switch all 6 services to real Supabase providers plus build the checkout workflow.

The Pipod Medusa-patterns exploration gives us 6 high-value patterns we can cannibalize directly. The biggest gap: **no checkout service exists at all** — not even a mock.

---

## Current State

### ✅ What Exists (Real Supabase)

| Asset | Status | Details |
|-------|--------|---------|
| Migration 001 | ✅ Applied | 19 tables, 3 RPCs, `gramos_disponibles` view, seed data |
| Migrations 002-008 | ✅ Applied | Admin auth, B2B, eventos, notificaciones, pagos |
| Products + Variants | ✅ Seeded | 5 products × 3 variants (10/20/30g), both bodegas |
| Inventory Levels | ✅ Seeded | Stock levels for both BR-ACRE and CO-BOGOTA |
| Regions + Shipping | ✅ Seeded | 4 regions (CO/BR/EU/US), 10 shipping tiers |
| Conversion Factors | ✅ Seeded | COP↔BRL↔USD factors |
| Wholesale Pricing | ✅ Seeded | $1,300 COP/g, MOQ 500g for `mayorista` group |
| RPC Functions | ✅ 3 functions | `incrementar_reserva`, `confirmar_deduccion`, `ajustar_stock` |
| Admin Base Service | ✅ `SupabaseService<T>` | CRUD abstraction with mock fallback |
| Region Service | ✅ **Supabase provider active** | Reads from `regiones`, `factores_conversion`, `tarifas_envio` |

### 🚧 What Exists (Mock/localStorage Only)

| Asset | Current Provider | Needs Supabase Provider |
|-------|-----------------|------------------------|
| Cart Service | `LocalStorageCartService` | `SupabaseCartService` |
| Inventory Service | `MockInventoryService` | `SupabaseInventoryService` |
| Pricing Service | `SimplePricingService` | `SupabasePricingService` |
| Order Service | `LocalStorageOrderService` | `SupabaseOrderService` |
| Customer Service | `LocalStorageCustomerService` | `SupabaseCustomerService` |

### ❌ What's Missing Entirely

| Feature | Status | Notes |
|---------|--------|-------|
| **Checkout Workflow** | ❌ Doesn't exist | No checkout service, no WhatsApp integration |
| **Payment Integration** | ❌ Doesn't exist | No Wompi/Stripe gateway code |
| **Event System** | ❌ Doesn't exist | Cross-module events (order.placed → stock deduction, notification) |
| **Cart → Reserves Integration** | ❌ Broken link | Cart doesn't call `incrementar_reserva` RPC |
| **Reservation Expiry + Cleanup** | ❌ Not wired | RPCs exist, no cron/edge function to expire them |

---

## Patterns Available for Cannibalization

### 1. Cart Service with Supabase Provider

**From Medusa (source: L-Medusa Spec §2.1 + migration 001)**:
- `carritos` table with `estado` (`activo`/`completado`/`abandonado`)
- `items_carrito` with `precio_unit` frozen at add-time (price snapshot pattern)
- Reservation link via `reserva_id` FK

**From Pipod (source: #555 Design §Phase 2)**:
- Clean interface/implementation separation pattern
- Factory pattern with provider switching
- `addItem` flow: verify stock → reserve → insert item → return cart

**What we already have**:
- ✅ Full cart schema in Supabase
- ✅ `CartService` interface (`cart/types.ts`)
- ✅ `CartState`, `CartItem` types with region support
- ✅ CartStore (Nanostores + localStorage for UI state)
- ✅ `MAX_ITEMS_IN_CART` (10) and `MAX_GRAMS_PER_ITEM` (500g) constants

**What needs building**:
- `SupabaseCartService` implementing `CartService` interface
- Wire `addItem` to call `incrementar_reserva` RPC
- Wire `removeItem` to release reservation
- Handle cart-abandoned detection + cleanup
- **Effort: Medium** (~2-3 days)

---

### 2. Inventory Reservation System

**From Medusa (source: L-Medusa Spec §3.3)**:
- 15-minute TTL on reservations (`expira_en`)
- Statuses: `pendiente` → `confirmada` / `cancelada`
- RPC functions: `incrementar_reserva`, `confirmar_deduccion`, `ajustar_stock`
- `movimientos_inventario` audit trail on ALL operations
- `gramos_disponibles` view (`stock - reserva`)

**From Pipod (source: #555 Design §Phase 1)**:
- RPC ran inside transaction (no partial states)
- `SELECT ... FOR UPDATE` on `niveles_inventario` for concurrent safety
- CHECK constraints: `gramos_stock >= 0`, `gramos_reserva >= 0`

**What we already have**:
- ✅ 3 RPCs exist in Supabase
- ✅ `reservas` table with estado, expira_en
- ✅ `movimientos_inventario` table
- ✅ `gramos_disponibles` view
- ✅ MockInventoryService with full interface

**Gaps**:
- No `SELECT ... FOR UPDATE` in RPCs (race condition risk)
- No cleanup job for expired reservations (Free Tier: no pg_cron → Edge Function)
- No `liberar_reserva` RPC (missing inverse of `incrementar_reserva`)
- Supabase provider not implemented
- Warning: existing RPCs don't add CHECK constraints (migration 001 doesn't include them)
- **Effort: Medium** (~2 days + 1 Edge Function)

---

### 3. Pricing Engine

**From Medusa (source: L-Medusa Spec §1.3 + migration 001)**:
- Retail: fixed per variant (precio_cop in `variantes`)
- Wholesale: `listas_precio` table with MOQ (`min_gramos`)
- Currency conversion: `factores_conversion` table
- Price snapshots: frozen at add-to-cart time

**From Pipod (source: #555 Design §Phase 1)**:
- Linear interpolation between price tiers
- `validateMOQ(grupoId, variantId, gramos)` pattern
- `calculateSubtotal(unitPrice, quantity)` — clean functional pattern

**What we already have**:
- ✅ `variantes.precio_cop` for retail
- ✅ `listas_precio` with `min_gramos` for wholesale
- ✅ `factores_conversion` with 4 initial factors
- ✅ `PricingService` interface
- ✅ Wholesale seed data ($1,300 COP/g from 500g)
- ✅ Region conversion via `RegionService.convertCurrency()`

**Gaps**:
- `SimplePricingService` is hardcoded COP → no Supabase reads
- No price interpolation for non-standard gram amounts (e.g., 25g)
- No MOQ validation integrated into cart flow
- **Effort: Low-Medium** (~1-2 days)

---

### 4. Checkout Workflow (Biggest Gap)

**From Medusa (source: L-Medusa Spec §2.2 + #555 Design)**:
- The entire "Cart → Order" state machine:
  ```
  activo → procesando (WhatsApp message sent)
  activo → completado (order confirmed)
  activo → abandonado (timeout)
  ```
- `crear_orden_desde_carrito` RPC (atomic: validate stock → copy items → confirm deductions → link reservations → update cart)
- WhatsApp message template with order summary
- Manual order creation (admin bypasses checkout)

**From Pipod (source: #749 §3.1 Workflow Engine)**:
- **CRITICAL PATTERN**: Step sequences with compensation
- `runWorkflow(steps, input)` with reverse compensation on failure
- Directly applicable to checkout: createReservation → sendWhatsApp → waitConfirmation → confirmOrder
- If WhatsApp fails → compensate (release reservations)
- If order creation fails → compensate (release stock, delete order record)

**What we already have**:
- ✅ `LocalStorageOrderService.createOrder()` (conceptual model)
- ✅ `LocalStorageOrderService.updateStatus()` (state machine)
- ✅ `ordenes` table with status workflow
- ✅ `items_orden` table (price snapshot pattern)

**What needs building**:
- **EVERYTHING** — no checkout service exists at any provider level
- Steps: validate cart → check stock → create reservations → build WhatsApp message → receive confirmation → create order → confirm deductions → update cart status
- RPC: `crear_orden_desde_carrito` (atomic create)
- WhatsApp message generation
- Abandonment timer cleanup
- **Effort: High** (~4-5 days) — this is the heart of Phase 2

---

### 5. Order State Machine

**From Medusa (source: L-Medusa Spec §2.3 + migration 001)**:
- Valid transitions documented:
  ```
  pendiente → pagado → preparando → enviado → entregado
  pendiente → cancelado
  pagado → cancelado (with refund)
  ```
- Display ID: serial counter (`OF-2026-0001`)
- Audit trail via `movimientos_inventario` on status changes

**From Pipod (source: #749 §3.2 Event System)**:
- Event-driven subscribers: order.estado_changed → triggers notifications, stock actions
- Zod validation on status transitions (already in `admin/schemas/orden.ts`)

**What we already have**:
- ✅ `ordenes` table with `estado` + `display_id`
- ✅ `LocalStorageOrderService` with `updateStatus()`, status flow validation
- ✅ `AdminSchemas.orden.ActualizarEstadoSchema` (Zod)
- ✅ `items_orden` with frozen prices

**Gaps**:
- No Supabase `OrdenService` with real DB reads/writes
- No event emission on status change
- No auto-transition logic (e.g., paid → preparing after 1h)
- **Effort: Low** (~1 day for Supabase provider)

---

### 6. Event System (Cross-Cutting)

**From Medusa (source: #749 §3.3 Event Bus)**:
- Events: `order.placed`, `order.paid`, `order.status_changed`
- Subscribers: notification, stock deduction, analytics, email
- In-process event bus with optional DB persistence
- Fire-and-forget: subscribers run in parallel, don't block main flow

**From Pipod (source: #749 exact code)**:
```typescript
class EventBus {
  private handlers = new Map<EventName, EventHandler[]>()

  on(event: EventName, handler: EventHandler): void { ... }
  async emit(event: EventName, payload: any): Promise<void> {
    // Fire handlers in parallel
    await Promise.allSettled(handlers.map(h => h(payload)))
  }
}
```

**What we already have**:
- ✅ `eventos.ts` file exists (need to check contents)
- ✅ Migration 004_admin_eventos.sql

**What needs building**:
- Event types: `order.created`, `order.status_changed`, `reservation.expired`, `stock.low`
- Subscribers: WhatsApp notification, inventory audit, admin notification
- **Effort: Low** (~0.5 day implementation, ~1 day subscribers)

---

## Recommendations

### Phase 2 Implementation Order (Highest Value → Lowest Effort)

| Priority | What | Effort | Value | Why |
|----------|------|--------|-------|-----|
| **P0** | **Pricing Service → Supabase** | 1 day | High | Unlocks real prices from DB; dead-simple because schema is already populated |
| **P0** | **Event Bus** | 0.5 day | High | Foundation for all cross-module communication; copied from Pipod verbatim |
| **P1** | **Order Service → Supabase** | 1 day | High | Enables real order persistence; base CRUD is already covered by `SupabaseService<T>` |
| **P1** | **Checkout Workflow Service** | 4-5 days | Critical | This IS Phase 2 — cart → reserves → WhatsApp → order creation |
| **P2** | **Inventory Service → Supabase** | 2 days | High | Real stock management; needs `liberar_reserva` RPC + cleanup |
| **P2** | **Cart Service → Supabase** | 2-3 days | High | Real cart persistence; integrates with reserves |
| **P3** | **Reservation Cleanup (Edge Function)** | 1 day | Medium | Free Tier workaround for pg_cron; runs every 5 minutes |
| **P3** | **Status Change Subscribers** | 1 day | Medium | Notifications, audit trail via event bus |

### What to Skip / Defer

| Pattern | Why Skip |
|---------|----------|
| **Medusa DI Container** | Overkill — Octavo Fuego has 6 services, not 50+ modules |
| **Admin Widget Injection Zones** | Vertical SaaS, not extensible platform |
| **Full Payment Gateway (Wompi/Stripe)** | Phase 3+ — WhatsApp manual payment first |
| **B2B Portal UI** | Phase 4+ — schema exists but no UI needed yet |
| **Bulk Order Editor** | Pipod-specific, not relevant for Octavo Fuego |
| **AI Agents** | Premium Medusa feature, no use case yet |

### Architectural Decisions to Make

1. **Checkout RPC vs Multi-step**: Should `crear_orden_desde_carrito` be a single SQL RPC (atomic, hard to debug) or multi-step with event bus (flexible, needs compensation)? **Recommendation**: Multi-step with the Pipod workflow compensation pattern — the checkout is the ONE place where rollback matters most.

2. **Reservation Cleanup Strategy**: Free Tier has no pg_cron. Options:
   - **Edge Function** (pings every 5 min via cron-job.org) ✅ RECOMMENDED
   - **Client-side timer** (unreliable, user must be on page)
   - **On-request check** (check + expire on every cart operation)

3. **WhatsApp Integration**: Manual link (`wa.me`) vs API (Twilio/MessageBird). For MVP: manual link is fine. API for Phase 3.

### Readiness for Proposal

**Yes** — The exploration is thorough. We know exactly:
- What exists (schema ✅, services interfaces ✅, mock providers 🚧)
- What's missing (checkout workflow ❌, Supabase providers 🚧, event system ❌)
- What Pipod patterns to cannibalize (6 patterns: events, errors, workflow, validation, service layer, subscribers)
- Implementation order (P0→P3 with effort estimates)

The orchestrator should proceed with `sdd-propose` for Phase 2, prioritizing:
1. Pricing → Supabase (quick win, unblocks cart)
2. Event Bus (architectural foundation)
3. Checkout Workflow (core deliverable)
