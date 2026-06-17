# Specifications: L-Medusa Complete Architecture

## Phase 1: Foundation

### 1.1 Supabase Setup
**Purpose**: Initialize Supabase project and configure environment

**Requirements:**
- REQ-1.1.1: Create Supabase project (free tier)
- REQ-1.1.2: Configure environment variables (.env)
- REQ-1.1.3: Set up Supabase client singleton
- REQ-1.1.4: Verify connection

**Acceptance Criteria:**
- [ ] Supabase project created
- [ ] .env file configured with ANON_KEY and SERVICE_ROLE_KEY
- [ ] src/lib/supabase.ts working
- [ ] Connection test passes

### 1.2 SQL Schema
**Purpose**: Apply database schema to Supabase

**Requirements:**
- REQ-1.2.1: Apply 001_initial_schema.sql
- REQ-1.2.2: Verify 19 tables created
- REQ-1.2.3: Verify 3 views created (gramos_disponibles)
- REQ-1.2.4: Verify 3 RPC functions created

**Acceptance Criteria:**
- [ ] All tables created
- [ ] Views accessible
- [ ] RPC functions callable
- [ ] Seed data inserted

### 1.3 Error Classes
**Purpose**: Create typed error classes for business logic

**Requirements:**
- REQ-1.3.1: InsufficientStockError
- REQ-1.3.2: ItemNotFoundError
- REQ-1.3.3: ReservationExpiredError
- REQ-1.3.4: InvalidTransitionError

**Acceptance Criteria:**
- [ ] Error classes created in src/lib/errors.ts
- [ ] Each error has descriptive message
- [ ] Each error has context (item ID, quantity, etc.)

### 1.4 Inventory Service
**Purpose**: Implement inventory management with Supabase backend

**Requirements:**
- REQ-1.4.1: getStockByProduct(productoId) → stock info
- REQ-1.4.2: getStockByItem(itemInventarioId) → stock by location
- REQ-1.4.3: crearReserva(itemInventarioId, gramos, ordenId?) → reserva
- REQ-1.4.4: confirmarDeduccion(reservaId) → void
- REQ-1.4.5: ajustarStock(itemInventarioId, bodegaId, ajuste, motivo) → void
- REQ-1.4.6: verificarDisponibilidad(itemInventarioId, gramos) → boolean
- REQ-1.4.7: Use RPC functions for atomic operations

**Acceptance Criteria:**
- [ ] All methods working with Supabase
- [ ] RPC functions called correctly
- [ ] Audit trail (movimientos_inventario) created
- [ ] Error handling implemented

### 1.5 Pricing Service
**Purpose**: Implement multi-currency pricing with manual conversion

**Requirements:**
- REQ-1.5.1: getPrecioRetail(productoId, moneda) → precio
- REQ-1.5.2: getPrecioWholesale(productoId, moneda) → precio
- REQ-1.5.3: convertirMoneda(monto, monedaOrigen, monedaDestino) → monto
- REQ-1.5.4: getFactoresConversion() → factores
- REQ-1.5.5: Validar moneda soportada (COP, BRL, USD)

**Acceptance Criteria:**
- [ ] Prices returned in correct currency
- [ ] Conversion factors working
- [ ] Manual update of factores_conversion working
- [ ] Error handling for unsupported currencies

## Phase 2: Core Ecommerce

### 2.1 Cart Service
**Purpose**: Implement cart management with Supabase backend

**Requirements:**
- REQ-2.1.1: crearCarrito(clienteId?) → carrito
- REQ-2.1.2: agregarItem(carritoId, productoId, gramos, varianteId?) → item
- REQ-2.1.3: actualizarItem(carritoId, itemId, gramos) → item
- REQ-2.1.4: eliminarItem(carritoId, itemId) → void
- REQ-2.1.5: getCarrito(carritoId) → carrito completo
- REQ-2.1.6: limpiarCarrito(carritoId) → void
- REQ-2.1.7: Persist to Supabase (not localStorage)

**Acceptance Criteria:**
- [ ] Cart persisted in Supabase
- [ ] Items correctly added/updated/removed
- [ ] Stock verification on add
- [ ] Reservation created on add

### 2.2 Checkout Workflow
**Purpose**: Implement WhatsApp checkout + manual order creation

**Requirements:**
- REQ-2.2.1: iniciarCheckout(carritoId) → checkout session
- REQ-2.2.2: seleccionarRegion(regionId) → region config
- REQ-2.2.3: seleccionarMetodoPago(metodo) → pago config
- REQ-2.2.4: confirmarCheckout(carritoId, datosCliente) → orden
- REQ-2.2.5: Generate WhatsApp message with order details

**Acceptance Criteria:**
- [ ] Checkout flow working
- [ ] WhatsApp message generated
- [ ] Order created from cart
- [ ] Stock reserved correctly

### 2.3 Order Service
**Purpose**: Implement order management with status workflow

**Requirements:**
- REQ-2.3.1: crearOrden(carritoId, datosCliente) → orden
- REQ-2.3.2: getOrden(ordenId) → orden completa
- REQ-2.3.3: actualizarEstado(ordenId, nuevoEstado) → void
- REQ-2.3.4: getOrdenes(filtros) → lista de órdenes
- REQ-2.3.5: Status workflow: pendiente → confirmada → entregada

**Acceptance Criteria:**
- [ ] Orders created with display_id (#001, #002)
- [ ] Status transitions working
- [ ] Order history maintained
- [ ] Audit trail for status changes

### 2.4 Customer Service
**Purpose**: Implement customer management with Supabase Auth

**Requirements:**
- REQ-2.4.1: crearCliente(datos) → cliente
- REQ-2.4.2: getCliente(clienteId) → cliente
- REQ-2.4.3: actualizarCliente(clienteId, datos) → cliente
- REQ-2.4.4: getDirecciones(clienteId) → direcciones
- REQ-2.4.5: Integrated with Supabase Auth

**Acceptance Criteria:**
- [ ] Customer creation working
- [ ] Supabase Auth integration
- [ ] Address management working
- [ ] Customer groups (retail/wholesale)

### 2.5 Multi-Region
**Purpose**: Implement region detection and routing

**Requirements:**
- REQ-2.5.1: detectarRegion(request) → regionId
- REQ-2.5.2: getConfigRegion(regionId) → region config
- REQ-2.5.3: getMonedaRegion(regionId) → moneda
- REQ-2.5.4: getMetodosPagoRegion(regionId) → métodos
- REQ-2.5.5: Accept-Language header detection

**Acceptance Criteria:**
- [ ] Auto-detection working
- [ ] Manual override available
- [ ] Correct currency per region
- [ ] Correct payment methods per region

## Phase 3: Advanced Features

### 3.1 Payment Gateways
**Purpose**: Integrate Wompi (CO) + Stripe (BR/EU/US)

**Requirements:**
- REQ-3.1.1: Wompi integration (CO)
- REQ-3.1.2: Stripe integration (BR/EU/US)
- REQ-3.1.3: Payment router by region
- REQ-3.1.4: Payment status webhooks
- REQ-3.1.5: Refund handling

**Acceptance Criteria:**
- [ ] Wompi payments working for CO
- [ ] Stripe payments working for BR/EU/US
- [ ] Correct gateway selected per region
- [ ] Payment status updated in orders

### 3.2 Automated Checkout
**Purpose**: Implement web checkout flow

**Requirements:**
- REQ-3.2.1: Checkout page (Astro)
- REQ-3.2.2: Address form
- REQ-3.2.3: Payment selection
- REQ-3.2.4: Order confirmation
- REQ-3.2.5: Email confirmation

**Acceptance Criteria:**
- [ ] Web checkout working
- [ ] Form validation
- [ ] Payment processing
- [ ] Order creation

### 3.3 Inventory Reservations
**Purpose**: Implement auto-expiry with hybrid notification

**Requirements:**
- REQ-3.3.1: Reservation expiry (15 min)
- REQ-3.3.2: On-request check at checkout
- REQ-3.3.3: Nocturnal cleanup (Edge Function)
- REQ-3.3.4: Admin notification on expiry
- REQ-3.3.5: Client-side countdown (cosmetic)

**Free Tier Implementation:**
- No pg_cron available
- Use Edge Function for nocturnal cleanup
- On-request check at checkout time
- Client-side timer for UI feedback

**Acceptance Criteria:**
- [ ] Reservations expire after 15 min
- [ ] On-request check working
- [ ] Nocturnal cleanup running
- [ ] Admin notified on expiry

### 3.4 Order Automation
**Purpose**: Implement status transitions and notifications

**Requirements:**
- REQ-3.4.1: Auto-confirm on payment
- REQ-3.4.2: Auto-ship on confirmation
- REQ-3.4.3: Auto-deliver on shipment
- REQ-3.4.4: Customer notifications
- REQ-3.4.5: Admin notifications

**Acceptance Criteria:**
- [ ] Status transitions automated
- [ ] Notifications working
- [ ] Email/SMS integration
- [ ] Audit trail complete

## Phase 4: Enterprise

### 4.1 Admin Panel
**Purpose**: Create Alfred UI dashboard

**Requirements:**
- REQ-4.1.1: Dashboard page
- REQ-4.1.2: Inventory management
- REQ-4.1.3: Order management
- REQ-4.1.4: Customer management
- REQ-4.1.5: Settings page

**Acceptance Criteria:**
- [ ] Alfred UI components working
- [ ] CRUD operations functional
- [ ] Real-time updates
- [ ] Responsive design

### 4.2 B2B Portal
**Purpose**: Create wholesale customer portal

**Requirements:**
- REQ-4.2.1: Login page
- REQ-4.2.2: Wholesale pricing display
- REQ-4.2.3: MOQ validation (500g)
- REQ-4.2.4: Order history
- REQ-4.2.5: Bulk ordering

**Acceptance Criteria:**
- [ ] Wholesale customers can login
- [ ] Special pricing displayed
- [ ] MOQ enforced
- [ ] Order history accessible

### 4.3 Analytics
**Purpose**: Implement basic sales and inventory reporting

**Requirements:**
- REQ-4.3.1: Sales dashboard
- REQ-4.3.2: Inventory reports
- REQ-4.3.3: Customer reports
- REQ-4.3.4: Export functionality

**Acceptance Criteria:**
- [ ] Sales data displayed
- [ ] Inventory levels visible
- [ ] Customer metrics shown
- [ ] Export to CSV working
