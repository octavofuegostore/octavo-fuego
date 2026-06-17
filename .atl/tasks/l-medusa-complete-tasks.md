# Tasks: L-Medusa Complete Architecture

## Phase 1: Foundation (Week 1-2)

### Task 1.1: Create Supabase Project
**Description**: Create Supabase project and configure environment

**Acceptance Criteria:**
- [ ] Supabase project created (free tier)
- [ ] Project URL and keys obtained
- [ ] .env file configured

**Dependencies**: None
**Estimated Time**: 1 hour
**Files to Create/Modify**: `.env`

**Testing Requirements:**
- Verify connection with Supabase client
- Test API keys work

---

### Task 1.2: Apply SQL Schema
**Description**: Apply database schema to Supabase

**Acceptance Criteria:**
- [ ] 001_initial_schema.sql applied
- [ ] 19 tables created
- [ ] 3 views created
- [ ] 3 RPC functions created
- [ ] Seed data inserted

**Dependencies**: Task 1.1
**Estimated Time**: 2 hours
**Files to Create/Modify**: `supabase/migrations/001_initial_schema.sql`

**Testing Requirements:**
- Query each table
- Test RPC functions
- Verify views return data

---

### Task 1.3: Create Error Classes
**Description**: Create typed error classes for business logic

**Acceptance Criteria:**
- [ ] InsufficientStockError created
- [ ] ItemNotFoundError created
- [ ] ReservationExpiredError created
- [ ] InvalidTransitionError created

**Dependencies**: None
**Estimated Time**: 1 hour
**Files to Create/Modify**: `src/lib/errors.ts`

**Testing Requirements:**
- Instantiate each error
- Verify message format
- Test error handling

---

### Task 1.4: Implement Inventory Service
**Description**: Implement inventory management with Supabase backend

**Acceptance Criteria:**
- [ ] getStockByProduct() working
- [ ] getStockByItem() working
- [ ] crearReserva() working
- [ ] confirmarDeduccion() working
- [ ] ajustarStock() working
- [ ] verificarDisponibilidad() working
- [ ] RPC functions called correctly

**Dependencies**: Task 1.2, Task 1.3
**Estimated Time**: 8 hours
**Files to Create/Modify**: `src/lib/inventory/supabase.ts`

**Testing Requirements:**
- Test each method
- Test error cases
- Test RPC calls
- Test audit trail

---

### Task 1.5: Implement Pricing Service
**Description**: Implement multi-currency pricing with manual conversion

**Acceptance Criteria:**
- [ ] getPrecioRetail() working
- [ ] getPrecioWholesale() working
- [ ] convertirMoneda() working
- [ ] getFactoresConversion() working
- [ ] Currency validation working

**Dependencies**: Task 1.2
**Estimated Time**: 6 hours
**Files to Create/Modify**: `src/lib/pricing/supabase.ts`

**Testing Requirements:**
- Test each currency (COP, BRL, USD)
- Test conversion factors
- Test error cases

---

### Task 1.6: Test Phase 1
**Description**: Test all Phase 1 components

**Acceptance Criteria:**
- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing complete
- [ ] Documentation updated

**Dependencies**: Task 1.4, Task 1.5
**Estimated Time**: 4 hours
**Files to Create/Modify**: `tests/`

**Testing Requirements:**
- Run vitest
- Run playwright
- Manual testing

---

## Phase 2: Core Ecommerce (Week 3-4)

### Task 2.1: Implement Cart Service
**Description**: Implement cart management with Supabase backend

**Acceptance Criteria:**
- [ ] crearCarrito() working
- [ ] agregarItem() working
- [ ] actualizarItem() working
- [ ] eliminarItem() working
- [ ] getCarrito() working
- [ ] limpiarCarrito() working
- [ ] Supabase persistence working

**Dependencies**: Task 1.4
**Estimated Time**: 8 hours
**Files to Create/Modify**: `src/lib/cart/supabase.ts`

**Testing Requirements:**
- Test cart CRUD operations
- Test stock verification
- Test reservation creation

---

### Task 2.2: Implement Checkout Workflow
**Description**: Implement WhatsApp checkout + manual order creation

**Acceptance Criteria:**
- [ ] iniciarCheckout() working
- [ ] seleccionarRegion() working
- [ ] seleccionarMetodoPago() working
- [ ] confirmarCheckout() working
- [ ] WhatsApp message generated

**Dependencies**: Task 2.1
**Estimated Time**: 6 hours
**Files to Create/Modify**: `src/lib/checkout/whatsapp.ts`

**Testing Requirements:**
- Test checkout flow
- Test WhatsApp message generation
- Test order creation

---

### Task 2.3: Implement Order Service
**Description**: Implement order management with status workflow

**Acceptance Criteria:**
- [ ] crearOrden() working
- [ ] getOrden() working
- [ ] actualizarEstado() working
- [ ] getOrdenes() working
- [ ] Status workflow working

**Dependencies**: Task 2.2
**Estimated Time**: 6 hours
**Files to Create/Modify**: `src/lib/orders/supabase.ts`

**Testing Requirements:**
- Test order creation
- Test status transitions
- Test audit trail

---

### Task 2.4: Implement Customer Service
**Description**: Implement customer management with Supabase Auth

**Acceptance Criteria:**
- [ ] crearCliente() working
- [ ] getCliente() working
- [ ] actualizarCliente() working
- [ ] getDirecciones() working
- [ ] Supabase Auth integration

**Dependencies**: Task 1.2
**Estimated Time**: 6 hours
**Files to Create/Modify**: `src/lib/customer/supabase.ts`

**Testing Requirements:**
- Test customer CRUD
- Test Supabase Auth
- Test address management

---

### Task 2.5: Implement Multi-Region
**Description**: Implement region detection and routing

**Acceptance Criteria:**
- [ ] detectarRegion() working
- [ ] getConfigRegion() working
- [ ] getMonedaRegion() working
- [ ] getMetodosPagoRegion() working
- [ ] Accept-Language detection working

**Dependencies**: Task 1.2
**Estimated Time**: 4 hours
**Files to Create/Modify**: `src/lib/region/service.ts`

**Testing Requirements:**
- Test auto-detection
- Test manual override
- Test currency routing

---

### Task 2.6: Test Phase 2
**Description**: Test all Phase 2 components

**Acceptance Criteria:**
- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing complete
- [ ] Documentation updated

**Dependencies**: Task 2.1-2.5
**Estimated Time**: 4 hours
**Files to Create/Modify**: `tests/`

**Testing Requirements:**
- Run vitest
- Run playwright
- Manual testing

---

## Phase 3: Advanced Features (Week 5-6)

### Task 3.1: Integrate Wompi Payment Gateway
**Description**: Integrate Wompi for CO payments

**Acceptance Criteria:**
- [ ] Wompi SDK installed
- [ ] Payment flow working
- [ ] Webhook handling working
- [ ] Refund handling working

**Dependencies**: Task 2.3
**Estimated Time**: 8 hours
**Files to Create/Modify**: `src/lib/payment/wompi.ts`

**Testing Requirements:**
- Test payment flow
- Test webhook handling
- Test refund handling

---

### Task 3.2: Integrate Stripe Payment Gateway
**Description**: Integrate Stripe for BR/EU/US payments

**Acceptance Criteria:**
- [ ] Stripe SDK installed
- [ ] Payment flow working
- [ ] Webhook handling working
- [ ] Refund handling working

**Dependencies**: Task 2.3
**Estimated Time**: 8 hours
**Files to Create/Modify**: `src/lib/payment/stripe.ts`

**Testing Requirements:**
- Test payment flow
- Test webhook handling
- Test refund handling

---

### Task 3.3: Implement Automated Checkout
**Description**: Implement web checkout flow

**Acceptance Criteria:**
- [ ] Checkout page created
- [ ] Address form working
- [ ] Payment selection working
- [ ] Order confirmation working
- [ ] Email confirmation working

**Dependencies**: Task 3.1, Task 3.2
**Estimated Time**: 8 hours
**Files to Create/Modify**: `src/pages/checkout.astro`

**Testing Requirements:**
- Test checkout flow
- Test form validation
- Test payment processing

---

### Task 3.4: Implement Inventory Reservations
**Description**: Implement auto-expiry with hybrid notification

**Acceptance Criteria:**
- [ ] Reservation expiry (15 min) working
- [ ] On-request check working
- [ ] Nocturnal cleanup Edge Function working
- [ ] Admin notification working
- [ ] Client-side countdown working

**Dependencies**: Task 1.4
**Estimated Time**: 6 hours
**Files to Create/Modify**: `supabase/functions/expire-reservations/`

**Testing Requirements:**
- Test reservation expiry
- Test on-request check
- Test Edge Function

---

### Task 3.5: Implement Order Automation
**Description**: Implement status transitions and notifications

**Acceptance Criteria:**
- [ ] Auto-confirm on payment working
- [ ] Auto-ship on confirmation working
- [ ] Auto-deliver on shipment working
- [ ] Customer notifications working
- [ ] Admin notifications working

**Dependencies**: Task 2.3, Task 3.1, Task 3.2
**Estimated Time**: 6 hours
**Files to Create/Modify**: `src/lib/orders/automation.ts`

**Testing Requirements:**
- Test status transitions
- Test notifications
- Test audit trail

---

### Task 3.6: Test Phase 3
**Description**: Test all Phase 3 components

**Acceptance Criteria:**
- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing complete
- [ ] Documentation updated

**Dependencies**: Task 3.1-3.5
**Estimated Time**: 4 hours
**Files to Create/Modify**: `tests/`

**Testing Requirements:**
- Run vitest
- Run playwright
- Manual testing

---

## Phase 4: Enterprise (Week 7+)

### Task 4.1: Create Admin Panel
**Description**: Create Alfred UI dashboard

**Acceptance Criteria:**
- [ ] Dashboard page created
- [ ] Inventory management working
- [ ] Order management working
- [ ] Customer management working
- [ ] Settings page working

**Dependencies**: Task 2.3, Task 1.4
**Estimated Time**: 12 hours
**Files to Create/Modify**: `src/pages/admin/*.astro`

**Testing Requirements:**
- Test each page
- Test CRUD operations
- Test responsive design

---

### Task 4.2: Create B2B Portal
**Description**: Create wholesale customer portal

**Acceptance Criteria:**
- [ ] Login page created
- [ ] Wholesale pricing display working
- [ ] MOQ validation working
- [ ] Order history working
- [ ] Bulk ordering working

**Dependencies**: Task 2.4, Task 1.5
**Estimated Time**: 8 hours
**Files to Create/Modify**: `src/pages/b2b/*.astro`

**Testing Requirements:**
- Test login flow
- Test pricing display
- Test MOQ validation

---

### Task 4.3: Implement Analytics
**Description**: Implement basic sales and inventory reporting

**Acceptance Criteria:**
- [ ] Sales dashboard working
- [ ] Inventory reports working
- [ ] Customer reports working
- [ ] Export functionality working

**Dependencies**: Task 2.3, Task 1.4
**Estimated Time**: 6 hours
**Files to Create/Modify**: `src/lib/analytics/service.ts`

**Testing Requirements:**
- Test data accuracy
- Test export functionality
- Test responsive design

---

### Task 4.4: Test Phase 4
**Description**: Test all Phase 4 components

**Acceptance Criteria:**
- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing complete
- [ ] Documentation updated

**Dependencies**: Task 4.1-4.3
**Estimated Time**: 4 hours
**Files to Create/Modify**: `tests/`

**Testing Requirements:**
- Run vitest
- Run playwright
- Manual testing

---

## Cross-Cutting Tasks

### Task CC.1: RLS Policies
**Description**: Implement Row Level Security policies

**Acceptance Criteria:**
- [ ] RLS enabled on all tables
- [ ] Policies for admin role
- [ ] Policies for customer role
- [ ] Policies for wholesale role

**Dependencies**: Task 1.2
**Estimated Time**: 4 hours
**Files to Create/Modify**: `supabase/migrations/002_rls_policies.sql`

**Testing Requirements:**
- Test each role
- Test access control
- Test edge cases

---

### Task CC.2: Database Indexes
**Description**: Optimize database performance with indexes

**Acceptance Criteria:**
- [ ] Indexes on frequently queried columns
- [ ] Composite indexes for complex queries
- [ ] Performance testing complete

**Dependencies**: Task 1.2
**Estimated Time**: 2 hours
**Files to Create/Modify**: `supabase/migrations/003_indexes.sql`

**Testing Requirements:**
- Test query performance
- Test index usage
- Test explain plans

---

### Task CC.3: Environment Variables
**Description**: Document all environment variables

**Acceptance Criteria:**
- [ ] .env.example created
- [ ] All variables documented
- [ ] Validation working

**Dependencies**: Task 1.1
**Estimated Time**: 1 hour
**Files to Create/Modify**: `.env.example`

**Testing Requirements:**
- Test variable validation
- Test missing variables
- Test invalid values
