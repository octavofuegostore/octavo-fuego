# Proposal: L-Medusa Complete Architecture — Phased Implementation

## Intent

Octavo Fuego needs a scalable backend system to process real multi-region sales. Currently, all orders are manual via WhatsApp, which doesn't scale and is error-prone. This proposal outlines a 4-phase implementation to build a production-ready ecommerce backend using MedusaJS patterns adapted to our specific needs (multi-region, multi-currency, wholesale + retail).

## Scope

### In Scope
- Phase 1: Foundation (Supabase setup, SQL schema, basic services)
- Phase 2: Core Ecommerce (Cart, checkout, orders, customers)
- Phase 3: Advanced Features (Payment gateways, automated checkout)
- Phase 4: Enterprise (Admin Panel, B2B Portal, analytics)

### Out of Scope
- Full MedusaJS server installation (we're canibalizing patterns, not using their server)
- Multi-domain Brazil (deferred to future)
- Advanced analytics and reporting (deferred)

## Capabilities

### Phase 1: Foundation (Week 1-2)

**New Capabilities:**
- `supabase-setup`: Supabase project initialization, environment configuration
- `inventory-service`: Basic inventory management with Supabase backend
- `pricing-service`: Multi-currency pricing with manual conversion

**Modified Capabilities:**
- None (fresh start)

### Phase 2: Core Ecommerce (Week 3-4)

**New Capabilities:**
- `cart-service`: Cart management with Supabase backend
- `checkout-workflow`: WhatsApp checkout + manual order creation
- `order-service`: Order management with status workflow
- `customer-service`: Customer management with Supabase Auth
- `multi-region`: Region detection and routing

**Modified Capabilities:**
- None (fresh start)

### Phase 3: Advanced Features (Week 5-6)

**New Capabilities:**
- `payment-gateways`: Wompi (CO) + Stripe (BR/EU/US) integration
- `automated-checkout`: Web checkout flow
- `inventory-reservations`: Auto-expiry with hybrid notification
- `order-automation`: Status transitions and notifications

**Modified Capabilities:**
- `cart-service`: Add payment collection support
- `order-service`: Add payment capture and fulfillment

### Phase 4: Enterprise (Week 7+)

**New Capabilities:**
- `admin-panel`: Alfred UI dashboard for inventory, orders, customers
- `b2b-portal`: Wholesale customer portal with special pricing
- `analytics`: Basic sales and inventory reporting

**Modified Capabilities:**
- None (fresh start)

## Approach

**Hybrid Supabase-First + MedusaJS Insights**

1. **Keep our DB schema** (already well-designed, maps to MedusaJS entities)
2. **Move business logic to Supabase RPC functions** (atomic, testable, RLS-protected)
3. **Adopt MedusaJS patterns selectively**:
   - ✅ `ensureInventoryLevels` → RPC function
   - ✅ `confirmInventory` → RPC function
   - ✅ Cart→Order conversion → RPC function
   - ✅ Price calculation → RPC function
   - ❌ MedusaService base class (overkill)
   - ❌ Awilix DI (not needed)
   - ❌ MikroORM entities (we use Supabase client)
   - ✅ Event system → Supabase Realtime + Edge Functions

## Affected Areas

### Phase 1
| Area | Impact | Description |
|------|--------|-------------|
| `supabase/migrations/001_initial_schema.sql` | Modified | Apply to Supabase |
| `src/lib/inventory/service.ts` | Modified | Supabase backend |
| `src/lib/pricing/service.ts` | Modified | Supabase backend |
| `.env` | New | Environment variables |

### Phase 2
| Area | Impact | Description |
|------|--------|-------------|
| `src/lib/cart/service.ts` | Modified | Supabase backend |
| `src/lib/orders/service.ts` | Modified | Supabase backend |
| `src/lib/customer/service.ts` | Modified | Supabase Auth |
| `src/lib/region/service.ts` | Modified | Multi-region detection |

### Phase 3
| Area | Impact | Description |
|------|--------|-------------|
| `src/lib/checkout/` | New | Checkout workflow |
| `src/lib/payments/` | New | Payment gateway integration |
| `src/lib/inventory/service.ts` | Modified | Reservation expiry (on-request check) |
| `supabase/functions/expire-reservations/` | New | Edge Function for nocturnal cleanup |

### Phase 4
| Area | Impact | Description |
|------|--------|-------------|
| `src/pages/admin/` | New | Admin Panel (Alfred UI) |
| `src/pages/es/mayoristas/portal/` | New | B2B Portal (Alfred UI) |
| `src/components/ui/alfred/` | New | Alfred UI components |

## Free Tier Constraints

**Supabase Free Tier limitations:**
- ❌ No pg_cron (scheduled database functions)
- ❌ No point-in-time recovery
- ❌ Limited logs (1 day)
- ❌ 500MB database limit
- ❌ 1GB storage limit

**Alternatives implemented:**
- Reservation expiry: Edge Function + on-request check (instead of pg_cron)
- Cleanup: Nocturnal Edge Function (instead of scheduled cron)
- Monitoring: Client-side logging + manual checks

## Upgrade Path: When You Pay for Supabase Pro ($25/mes)

### What Changes with Pro

| Feature | Free Tier | Pro Tier | Impact |
|---------|-----------|----------|--------|
| **pg_cron** | ❌ No | ✅ Yes | Auto-expiry cada 5 min en vez de Edge Function |
| **Database** | 500MB | 8GB | 16x más espacio para productos/órdenes |
| **Storage** | 1GB | 100GB | 100x más para imágenes de productos |
| **Edge Functions** | 500K/mes | 2M/mes | 4x más invocaciones |
| **Logs** | 1 día | 7 días | 7x más tiempo para debugging |
| **PITR** | ❌ No | ✅ Yes | Backups point-in-time recovery |
| **Connection Pooling** | Basic | Advanced | Mejor rendimiento bajo carga |
| **Custom Domains** | ❌ No | ✅ Yes | Para Edge Functions |

### Code Changes Required (Minimal)

**1. Reservation Expiry (Phase 3)**
```typescript
// Free Tier: Edge Function + on-request check
// Pro Tier: pg_cron scheduled job

-- pg_cron (Pro only)
SELECT cron.schedule(
  'expire-reservations',
  '*/5 * * * *',  -- cada 5 minutos
  $$UPDATE reservas 
    SET estado = 'expirada' 
    WHERE estado = 'activa' 
    AND created_at < NOW() - INTERVAL '15 minutes'$$
);
```

**2. Monitoring (Phase 4)**
```typescript
// Free Tier: Client-side logging
// Pro Tier: Supabase logs + pg_stat_statements

-- Query performance (Pro only)
SELECT query, calls, mean_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC;
```

**3. Backups (Phase 4)**
```typescript
// Free Tier: Manual exports
// Pro Tier: Point-in-time recovery

-- Automatic backups (Pro only)
-- No code change needed, just enable in dashboard
```

### Upgrade Checklist

When you're ready to upgrade ($25/mes):

- [ ] **Step 1**: Upgrade Supabase plan in dashboard
- [ ] **Step 2**: Enable pg_cron extension
- [ ] **Step 3**: Create scheduled job for reservation expiry
- [ ] **Step 4**: Remove Edge Function for nocturnal cleanup
- [ ] **Step 5**: Enable PITR in dashboard
- [ ] **Step 6**: Update monitoring to use Supabase logs
- [ ] **Step 7**: Test everything still works
- [ ] **Step 8**: Delete old Edge Function code

### When to Upgrade

**Upgrade when:**
- You have 100+ products (approaching 500MB limit)
- You have 1000+ orders/month (need better logging)
- You need reliable reservation expiry (not just on-request)
- You want peace of mind with backups
- You're doing $1000+/month in sales (can justify $25 cost)

**Don't upgrade yet if:**
- You're still in MVP phase
- You have <50 products
- You have <100 orders/month
- You're not doing $500+/month in sales

### Cost-Benefit Analysis

| Metric | Free Tier | Pro Tier |
|--------|-----------|----------|
| **Cost** | $0/mes | $25/mes |
| **Products** | Hasta 500 | Hasta 5,000+ |
| **Orders** | Hasta 1,000/mes | Hasta 10,000+/mes |
| **Reliability** | 99.9% | 99.99% |
| **Support** | Community | Priority |

**Break-even point**: Si estás haciendo $500+/mes en ventas, el $25 de Pro se paga solo con la mejor confiabilidad.

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Supabase RPC latency | Medium | Connection pooling, edge functions |
| Reservation expiry race conditions | Medium | On-request check + nocturnal cleanup (Free Tier) |
| Multi-currency precision loss | Low | Use `numeric(10,2)` not `float` |
| WhatsApp checkout reliability | High | Add retry logic, status polling |
| Data migration from localStorage | Medium | One-time migration script |
| Free Tier limits exceeded | Low | Monitor usage, upgrade path ready |

## Rollback Plan

### Phase 1
- Revert to localStorage-based services
- Keep Supabase schema for future use

### Phase 2
- Revert to WhatsApp-only checkout
- Disable web checkout features

### Phase 3
- Disable payment gateway integrations
- Revert to manual order creation

### Phase 4
- Disable Admin Panel and B2B Portal
- Revert to direct database access

## Dependencies

- Supabase account (free tier)
- Wompi account (CO payment gateway)
- Stripe account (BR/EU/US payment gateway)
- Alfred UI license (already purchased)
- Domain verification (Google Search Console)

## Success Criteria

### Phase 1
- [ ] Supabase project created and configured
- [ ] SQL schema applied successfully
- [ ] Inventory service working with Supabase backend
- [ ] Pricing service supporting COP, BRL, USD

### Phase 2
- [ ] Cart service persisting to Supabase
- [ ] WhatsApp checkout workflow functional
- [ ] Order service creating orders with status workflow
- [ ] Customer service integrated with Supabase Auth
- [ ] Multi-region detection working (CO, BR, EU, US)

### Phase 3
- [ ] Wompi payment gateway functional (CO)
- [ ] Stripe payment gateway functional (BR/EU/US)
- [ ] Automated checkout flow working
- [ ] Inventory reservations with 15-min expiry
- [ ] Order status automation

### Phase 4
- [ ] Admin Panel with Alfred UI functional
- [ ] B2B Portal with wholesale pricing functional
- [ ] Basic analytics and reporting

## Business Rules

### Reservations
- **Always maintain history**: Status changes (activa → expirada → confirmada), never delete records
- **Hybrid expiry**: Auto-release after 15 minutes + notify admin
- **Expired reservation blocks checkout**: Clear message to customer

### Currency
- **Manual conversion**: User updates `factores_conversion` table
- **Supported currencies**: COP, BRL, USD
- **Conversion factors**: BRL→USD (0.2020), COP→USD (0.00024), BRL→COP (833), USD→COP (4166)

### Checkout
- **MVP**: WhatsApp-only checkout
- **Future**: Web checkout infrastructure built in Phase 3
- **No partial payments**: MVP is full payment only

### Wholesale
- **Price**: $1,300 COP/g
- **MOQ**: 500g
- **Portal**: B2B Portal with special pricing

### Alfred UI
- **Purpose**: Internal back-office tool (Admin Panel + B2B Portal)
- **NOT for**: Public store (that's our custom UI)
- **License**: Single developer seat, private repository

## Implementation Order

1. **Inventory Service** (highest value, already has RPC functions)
2. **Pricing Service** (prices in DB, just need RPC)
3. **Cart Service** (needs Supabase Auth first)
4. **Order Service** (depends on Cart)
5. **Customer Service** (Supabase Auth integration)
6. **Checkout Workflow** (WhatsApp + manual)
7. **Payment Gateways** (Wompi + Stripe)
8. **Admin Panel** (Alfred UI)
9. **B2B Portal** (Alfred UI)
