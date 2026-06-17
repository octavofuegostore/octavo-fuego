# L-Medusa + Supabase — Arquitectura Liviana para Octavo Fuego

> **Fecha**: Junio 16, 2026  
> **Estado**: ✅ APROBADO  
> **Proyecto**: Octavo Fuego — Ecommerce de Medicinas Ancestrales  
> **Stack**: Astro 6.1.3 + TailwindCSS 4 + shadcn/ui + Nanostores + WhatsApp checkout  
> **URL**: www.octavofuego.com (Vercel, SSG estático)  
> **Fase**: MVP de Acero — pre-lanzamiento

---

## 🎯 Resumen Ejecutivo

**Objetivo:** Implementar una versión liviana ("L-Medusa") de los servicios core de MedusaJS, ejecutándose sobre Supabase (PostgreSQL), evitando la sobrecarga de infraestructura del servidor MedusaJS completo durante la fase de validación de mercado.

**Por qué:** MedusaJS es el estado final (§7.2 Centralización), pero hoy no hay facturación validada. Montar Medusa completo ($50+/mes, 9 días de setup) es sobreingeniería. La solución: canibalizar la arquitectura y tipos de Medusa, reescribir sobre Supabase gratis, y tener la misma lógica core sin pagar infra.

**Resultado:** Mismo stack que Medusa, $0 costo. Cuando el negocio justifique $50/mes, migras a Medusa real en un fin de semana.

---

## 📐 Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    ASTRO SSR (Vercel)                       │
│  PDPs | Carrito | Checkout | Blog | Landing Pages          │
├─────────────────────────────────────────────────────────────┤
│                    src/lib/services/                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │inventory │ │ cart     │ │ customer │ │ pricing  │      │
│  │service   │ │ service  │ │ service  │ │ service  │      │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘      │
│       │             │             │             │            │
│       └─────────────┼─────────────┼─────────────┘            │
│                     │             │                          │
├─────────────────────┼─────────────┼──────────────────────────┤
│              Supabase (PostgreSQL) │                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │inventory    │ │carts        │ │customers     │            │
│  │levels       │ │cart_items   │ │groups        │            │
│  │reservations │ │orders       │ │addresses     │            │
│  └─────────────┘ └─────────────┘ └─────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 La Progresión Correcta

| Fase | Backend | Admin | Checkout | Costo |
|------|---------|-------|----------|-------|
| **Hoy → Mock** | JSON estático | ✖ Editás `mock-data.ts` | WhatsApp manual | **$0** |
| **Próximo → L-Medusa** | Supabase PostgreSQL | ✅ Studio gratis | WhatsApp manual | **$0** |
| **Futuro → Medusa** | Backend completo | ✅ Admin completo | ✅ Automático | ~$50/mes |

---

## 🗂️ Archivos a Crear

### Estructura de directorios

```
src-astro/src/lib/
├── inventory/
│   ├── types.ts          ← Interfaces Medusa-compatibles
│   ├── mock-data.ts      ← Datos hardcodeados (gramos reales)
│   ├── service.ts        ← Capa de servicio (mock/supabase switch)
│   └── index.ts          ← Export limpio
├── cart/
│   ├── types.ts          ← CartItem, CartState
│   ├── service.ts        ← addToCart, removeFromCart, etc.
│   └── index.ts
├── customer/
│   ├── types.ts          ← Customer, CustomerGroup, Address
│   ├── service.ts        ← Auth, registro, perfil
│   └── index.ts
├── pricing/
│   ├── types.ts          ← PriceTier, RegionPricing
│   ├── service.ts        ← Precios COP/BRL/USD
│   └── index.ts
├── orders/
│   ├── types.ts          ← Order, OrderItem, OrderStatus
│   ├── service.ts        ← Crear, actualizar, consultar
│   └── index.ts
├── region/
│   ├── types.ts          ← Region, ConversionFactor, TarifaEnvio
│   ├── service.ts        ← Detección región, conversión moneda, envío
│   └── index.ts
└── .env.example          ← Variables de entorno
```

---

## 📦 Cada Módulo en Detalle

### 1. Inventory (`src/lib/inventory/`)

**Qué hace:** Tracking de stock por gramos en 2 locaciones (Brasil fábrica + Colombia distribución).

**Tipos Medusa-compatibles:**

```typescript
// StockLocation — 2 locaciones
interface StockLocation {
  id: string;           // "sloc_brazil_factory", "sloc_colombia_distribution"
  name: string;
  address: {
    city: string;
    country_code: string;
  };
}

// InventoryItem — 1 por cada variedad de rapé
interface InventoryItem {
  id: string;           // "iitem_tisunu", "iitem_pixuri", ...
  sku: string;          // "RAPE-TISUNU-001"
  title: string;
  requires_shipping: boolean;
}

// InventoryLevel — cuántos gramos hay en cada locación
interface InventoryLevel {
  inventory_item_id: string;
  location_id: string;
  stocked_quantity: number;   // gramos disponibles
  reserved_quantity: number;  // gramos reservados (checkout en progreso)
  incoming_quantity: number;  // gramos en camino (transferencia)
}

// Lo que expone el servicio
interface InventorySnapshot {
  slug: string;
  available_grams: number;  // stocked - reserved
  location: 'brazil_factory' | 'colombia_distribution';
  is_low_stock: boolean;  // < 50g → warning
}
```

**Métodos del servicio:**

| Método | Descripción |
|--------|-------------|
| `getAvailableGrams(slug, location)` | Cuántos gramos hay disponibles |
| `reserveGrams(slug, grams, location, cartId)` | Reservar temporalmente (previene oversell) |
| `confirmDeduction(slug, grams, location)` | Confirmar después del pago |
| `releaseReservation(reservationId)` | Liberar si abandonan checkout |
| `transferStock(slug, grams, from, to)` | Transferir entre locaciones |
| `getLowStockItems(threshold)` | Productos con < N gramos |

**Datos mock (gramos reales):**

| Producto | Brasil (fábrica) | Colombia (distribución) |
|----------|-----------------|------------------------|
| Tisunú | 2000g | 500g |
| Pixurí | 1500g | 300g |
| Pariká | 1800g | 400g |
| Cumarú de Cheiro | 1200g | 250g |
| Vena de Pajé | 900g | 200g |

---

### 2. Cart (`src/lib/cart/`)

**Qué hace:** Gestión de carrito con persistencia (localStorage → Supabase → cookies HttpOnly).

**Tipos:**

```typescript
interface CartItem {
  id: string;
  variantId: string;
  nombre: Record<Locale, string>;
  etnia: string;
  tipo: 'rape';
  precio: number; // COP
  cantidad: number;
  imagen: string;
  slug: string;
}

interface CartState {
  id: string | null;
  items: CartItem[];
  total: number;
  region_id: string;
}
```

**Métodos del servicio:**

| Método | Descripción |
|--------|-------------|
| `addToCart(item)` | Añadir producto |
| `removeFromCart(variantId)` | Eliminar producto |
| `updateQuantity(variantId, cantidad)` | Actualizar cantidad |
| `clearCart()` | Vaciar carrito |
| `getCartTotal()` | Total del carrito |
| `formatCOP(amount)` | Formatear pesos colombianos |

---

### 3. Customer (`src/lib/customer/`)

**Qué hace:** Auth de clientes, grupos B2B, direcciones.

**Tipos:**

```typescript
interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  groups: CustomerGroup[];
  metadata: Record<string, any>;
}

interface CustomerGroup {
  id: string;
  name: string;  // 'retail' | 'wholesale'
}

interface Address {
  id: string;
  customer_id: string;
  address_line_1: string;
  city: string;
  country_code: string;
  postal_code: string;
}
```

**Métodos del servicio:**

| Método | Descripción |
|--------|-------------|
| `register(email, password, data)` | Registro de cliente |
| `login(email, password)` | Login con JWT |
| `getProfile(token)` | Obtener perfil |
| `updateProfile(token, data)` | Actualizar perfil |
| `registerB2B(data)` | Registro mayorista (pending) |
| `approveB2B(customerId)` | Aprobar cuenta B2B |

---

### 4. Pricing (`src/lib/pricing/`)

**Qué hace:** Precios por grupo (retail/wholesale), por región (COP/BRL/USD), por producto.

**Tipos:**

```typescript
interface PriceTier {
  cantidad: number; // grams
  precio: number;   // COP
  label: string;    // "10g"
}

interface WholesalePricing {
  enabled: boolean;
  minGrams: number;
  pricePerGram: number;  // COP
}

interface ProductPricing {
  retail: PriceTier[];   // [10g/$35K, 20g/$70K, 30g/$100K]
  wholesale: WholesalePricing;
}
```

**Métodos del servicio:**

| Método | Descripción |
|--------|-------------|
| `getRetailPrice(slug, grams)` | Precio retail para X gramos |
| `getWholesalePrice(slug, grams)` | Precio mayorista para X gramos |
| `formatCOP(amount)` | Formatear COP |
| `formatBRL(amount)` | Formatear BRL |
| `formatUSD(amount)` | Formatear USD |

---

### 5. Orders (`src/lib/orders/`)

**Qué hace:** Órdenes, estados, historial.

**Tipos:**

```typescript
type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

interface Order {
  id: string;
  display_id: number;
  customer_id: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  currency_code: string;
  shipping_address: Address;
  created_at: string;
}

interface OrderItem {
  id: string;
  product_id: string;
  title: string;
  quantity: number;
  unit_price: number;
  total: number;
}
```

**Métodos del servicio:**

| Método | Descripción |
|--------|-------------|
| `createOrder(cartId, data)` | Crear orden desde carrito |
| `getOrder(orderId)` | Consultar orden |
| `getCustomerOrders(customerId)` | Órdenes de un cliente |
| `updateStatus(orderId, status)` | Actualizar estado |

---

### 6. Region (`src/lib/region/`)

**Qué hace:** Detección de región, conversión de moneda, cálculo de envío.

**Reglas de Negocio:**

| Región | Bodega | Moneda | Gateway | Envío |
|--------|--------|--------|---------|-------|
| CO | CO-BOGOTA | COP | Wompi | Local CO |
| BR | BR-ACRE | BRL | Stripe+Pix | Nacional BR |
| EU | BR-ACRE | USD | Stripe | Internacional |
| US | BR-ACRE | USD | Stripe | Internacional |

**Tipos:**

```typescript
interface Region {
  id: string;
  codigo: string;        // 'CO', 'BR', 'EU', 'US'
  nombre: string;
  moneda: string;        // 'COP', 'BRL', 'USD'
  idioma: string;        // 'es', 'pt', 'en'
  gateway: string;       // 'wompi', 'stripe'
  bodega_default: string;
  activa: boolean;
}

interface ConversionFactor {
  id: string;
  moneda_origen: string;
  moneda_destino: string;
  factor: number;
  actualizado_en: string;
}

interface TarifaEnvio {
  id: string;
  region_id: string;
  min_gramos: number;
  max_gramos: number;
  tarifa_fija: number;
  tarifa_por_gramo: number;
  tiempo_estimado: string;
}
```

**Métodos del servicio:**

| Método | Descripción |
|--------|-------------|
| `getRegionByCodigo(codigo)` | Obtener región por código |
| `detectRegionFromHeaders(headers)` | Auto-detectar región por Accept-Language |
| `getConversionFactor(origen, destino)` | Obtener factor de conversión |
| `convertCurrency(amount, origen, destino)` | Convertir entre monedas |
| `getTarifaEnvio(regionId, gramos)` | Obtener tarifa de envío |
| `calcularEnvio(regionId, gramos)` | Calcular costo total de envío |

---

## 🔧 Variables de Entorno

```env
# Provider: 'mock' | 'supabase' | 'medusa'
PUBLIC_INVENTORY_PROVIDER=mock

# Supabase
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stock locations
PUBLIC_LOCATION_BRAZIL=sloc_brazil_factory
PUBLIC_LOCATION_COLOMBIA=sloc_colombia_distribution

# Low stock threshold (grams)
PUBLIC_LOW_STOCK_THRESHOLD=50

# Payment (eventual)
PUBLIC_PAYMENT_PROVIDER=wompi  # 'wompi' para CO, 'stripe' para BR

# Medusa (future)
MEDUSA_BACKEND_URL=
MEDUSA_API_KEY=
```

---

## ⚠️ Limitaciones de L-Medusa

| Limitación | Mitigación |
|-----------|-----------|
| Sin admin panel completo | Supabase Studio sirve como admin gratis |
| Sin checkout automático | WhatsApp checkout funciona para MVP |
| Sin pasarela de pago | Cuando factures +$50K/mes, agregas Wompi |
| Sin reservas automáticas | Reservas manuales via Supabase Studio |
| Sin webhooks de pago | Manual: actualizás estado cuando cobrás |
| Sin sync real-time | Suficiente para 5 productos y 100 clientes/mes |

---

## 🚀 Pasos de Implementación

### Fase 1: Mock (Hoy)
1. Crear `src/lib/inventory/` con tipos, mock-data, service, index
2. Crear `.env.example` con variables nuevas
3. Verificar build exitoso

### Fase 2: L-Medusa (Cuando quieras panel)
1. Crear tablas en Supabase (inventory_levels, carts, orders, customers)
2. Migrar mock-data → Supabase
3. Conectar service.ts a Supabase SDK

### Fase 3: Full Medusa (Cuando factures)
1. Deploy Medusa en Railway/Medusa Cloud
2. Exportar data de Supabase → Medusa
3. Cambiar PUBLIC_INVENTORY_PROVIDER=medusa
4. Configurar Wompi (CO) y Stripe (BR)

---

## 📚 Referencias

- [MedusaJS Documentation](https://docs.medusajs.com)
- [MedusaJS GitHub](https://github.com/medusajs/medusa)
- [Supabase Documentation](https://supabase.com/docs)
- [ARCHITECTURE.md](../ARCHITECTURE.md) — Manifiesto de ingeniería

---

*Documento creado: Junio 16, 2026 — SDD Explore agent*  
*Engram: `sdd/octavo-fuego/l-medusa-architecture`*