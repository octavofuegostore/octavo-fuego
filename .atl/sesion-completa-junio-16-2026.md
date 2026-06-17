# Octavo Fuego — Sesión Completa: Arquitectura Backend + Frontend

> **Fecha**: Junio 16, 2026
> **Estado**: ✅ APROBADO (pendiente ejecución por etapas)
> **Stack**: Astro 6.1.3 + TailwindCSS 4 + Supabase + L-Medusa + Alfred UI
> **Dominio**: www.octavofuego.com (Vercel, SSG estático)

---

## 📋 Resumen de Decisiones

| Decisión | Justificación |
|----------|---------------|
| **L-Medusa (no Medusa server)** | $0 costo, misma arquitectura, zero dependencia de servidor Medusa |
| **Supabase como DB** | PostgreSQL gratis, RLS, Studio admin, RPC functions |
| **Alfred UI para Admin/B2B** | Kit visual premium, layouts de dashboard, data tables |
| **Mock → Supabase → Medusa** | Progresión correcta: validar demanda antes de escalar |
| **1 unidad = 1 gramo** | Unidad de medida estándar para rapé |
| **2 bodegas** | Brasil (fábrica) + Colombia (distribución) |
| **3 idiomas** | es, en, pt (columnas dedicadas en productos) |
| **2 pasarelas** | Wompi (CO) + Stripe (BR), detección por país |
| **4 regiones** | CO, BR, EU, US — envíos desde CO solo a CO, internacional desde BR |
| **Pricing conversión** | Manual (usuario actualiza factores_conversion) |
| **Detección híbrida** | Auto por Accept-Language + confirmación usuario |
| **WhatsApp checkout** | MVP manual, automatizar después de validar demanda |
| **Navbar NO se toca** | 5 items óptimos para mobile |

---

## 🏗️ Arquitectura Completa

```
┌─────────────────────────────────────────────────────────────┐
│                    ASTRO SSR (Vercel)                       │
│  PDPs | Carrito | Checkout | Blog | Landing Pages          │
│  Admin Panel (Alfred UI) | B2B Portal                       │
├─────────────────────────────────────────────────────────────┤
│                    src/lib/services/                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │inventory │ │ cart     │ │ customer │ │ pricing  │      │
│  │service   │ │ service  │ │ service  │ │ service  │      │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘      │
│       │             │             │             │            │
│  ┌────┴─────┐ ┌────┴─────┐                                 │
│  │ orders   │ │ region   │                                 │
│  │ service  │ │ service  │                                 │
│  └────┬─────┘ └────┬─────┘                                 │
├───────┼─────────────┼───────────────────────────────────────┤
│              Supabase (PostgreSQL)                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │productos    │ │variantes    │ │bodegas       │           │
│  │items_inv.   │ │niveles_inv. │ │reservas      │           │
│  │carritos     │ │ordenes      │ │clientes      │           │
│  │listas_price │ │transferenc. │ │movimientos   │           │
│  │regiones     │ │factores_conv│ │tarifas_envio │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Esquema SQL Completo

### Tablas Principales

| Tabla | Descripción |
|-------|-------------|
| `productos` | 5 rapés con 3 idiomas (es, en, pt) |
| `variantes` | 10g, 20g, 30g por producto + precios COP/BRL/USD |
| `bodegas` | BR-ACRE (fábrica) + CO-BOGOTA (distribución) |
| `items_inventario` | 1 item por variante (1g = 1 unidad) |
| `niveles_inventario` | Stock por bodega (gramos_stock, gramos_reserva, gramos_alerta) |
| `reservas` | Temporales durante checkout (15 min TTL) |
| `transferencias` | Movimientos BR → CO |
| `grupos_clientes` | retail + mayorista |
| `clientes` | Auth Supabase + estado B2B |
| `listas_precio` | Precios por grupo (retail vs mayorista) |
| `carritos` | Carritos activos por cliente |
| `items_carrito` | Items del carrito con precio congelado |
| `ordenes` | display_id serial (#001, #002) + estados |
| `items_orden` | Items de la orden |
| `movimientos_inventario` | Auditoría completa de stock |
| `regiones` | Regiones: CO, BR, EU, US |
| `factores_conversion` | Tasas de conversión entre monedas |
| `tarifas_envio` | Tarifas por región y rango de gramos |

### Vista SQL: `gramos_disponibles`

```sql
create view gramos_disponibles as
  select
    ni.id,
    ni.item_id,
    ni.bodega_id,
    b.codigo as bodega_codigo,
    b.pais,
    v.gramos as gramos_variante,
    v.sku,
    p.slug as producto_slug,
    ni.gramos_stock - ni.gramos_reserva as gramos_disponibles,
    ni.gramos_stock,
    ni.gramos_reserva,
    ni.gramos_alerta,
    (ni.gramos_stock - ni.gramos_reserva) < ni.gramos_alerta as alerta_stock_bajo
  from niveles_inventario ni
  join items_inventario ii on ii.id = ni.item_id
  join variantes v on v.id = ii.variante_id
  join productos p on p.id = v.producto_id
  join bodegas b on b.id = ni.bodega_id;
```

### RPC Functions

```sql
-- Incrementar reserva
create or replace function incrementar_reserva(p_item_id uuid, p_bodega_id uuid, p_gramos integer)
returns void as $$ ... $$ language plpgsql;

-- Confirmar deducción
create or replace function confirmar_deduccion(p_item_id uuid, p_bodega_id uuid, p_gramos integer)
returns void as $$ ... $$ language plpgsql;

-- Ajustar stock (transferencias)
create or replace function ajustar_stock(p_item_id uuid, p_bodega_id uuid, p_gramos integer)
returns void as $$ ... $$ language plpgsql;
```

### Datos Iniciales

| Producto | BR (fábrica) | CO (distribución) |
|----------|-------------|-------------------|
| Tisunú | 2000g | 500g |
| Pixurí | 1500g | 300g |
| Pariká | 1800g | 400g |
| Cumarú de Cheiro | 1200g | 250g |
| Vena de Pajé | 900g | 200g |

### Precios COP (Retail)

| Producto | 10g | 20g | 30g |
|----------|-----|-----|-----|
| Tisunú | $35,000 | $70,000 | $100,000 |
| Pixurí | $38,000 | $76,000 | $110,000 |
| Pariká | $32,000 | $64,000 | $95,000 |
| Cumarú de Cheiro | $40,000 | $80,000 | $115,000 |
| Vena de Pajé | $45,000 | $90,000 | $130,000 |

### Precios Mayoristas

- Precio base: $1,300 COP/g
- MOQ: 500g mínimo

### Reglas de Región

| Región | Bodega | Moneda | Gateway | Envío | Impuestos |
|--------|--------|--------|---------|-------|-----------|
| CO | CO-BOGOTA | COP | Wompi | Local CO | No calcula |
| BR | BR-ACRE | BRL | Stripe+Pix | Nacional BR | No calcula |
| EU | BR-ACRE | USD | Stripe | Internacional | No calcula |
| US | BR-ACRE | USD | Stripe | Internacional | No calcula |

### Factores de Conversión (Manuales)

| Origen | Destino | Factor |
|--------|---------|--------|
| BRL | USD | 0.2020 |
| COP | USD | 0.00024 |
| BRL | COP | 833.00 |
| USD | COP | 4166.00 |

### Tarifas de Envío

| Región | Rango | Tarifa Fija | Por Gramo | Tiempo |
|--------|-------|-------------|-----------|--------|
| CO | 1-500g | $5,000 COP | $10 COP/g | 3-5 días |
| CO | 501-2000g | $8,000 COP | $5 COP/g | 3-5 días |
| CO | 2001g+ | $12,000 COP | $0 | 3-5 días |
| BR | 1-500g | R$25 | R$0.05/g | 3-7 días |
| BR | 501-2000g | R$40 | R$0.02/g | 3-7 días |
| BR | 2001g+ | R$60 | $0 | 3-7 días |
| EU/US | 1-500g | $25 USD | $0.10/g | 7-14 días |
| EU/US | 501-2000g | $35 USD | $0.05/g | 7-14 días |

---

## 🖥️ Estructura de Archivos

```
src-astro/
├── src/
│   ├── lib/
│   │   ├── supabase.ts              ← Cliente singleton
│   │   ├── inventory/
│   │   │   ├── types.ts
│   │   │   ├── mock-data.ts
│   │   │   ├── service.ts
│   │   │   └── index.ts
│   │   ├── cart/
│   │   │   ├── types.ts
│   │   │   ├── service.ts
│   │   │   └── index.ts
│   │   ├── customer/
│   │   │   ├── types.ts
│   │   │   ├── service.ts
│   │   │   └── index.ts
│   │   ├── pricing/
│   │   │   ├── types.ts
│   │   │   ├── service.ts
│   │   │   └── index.ts
│   │   ├── orders/
│   │   │   ├── types.ts
│   │   │   ├── service.ts
│   │   │   └── index.ts
│   │   ├── region/
│   │   │   ├── types.ts
│   │   │   ├── service.ts
│   │   │   └── index.ts
│   │   └── index.ts                  ← Export unificado
│   ├── components/
│   │   └── ui/
│   │       └── alfred/               ← Componentes premium (privado)
│   └── pages/
│       ├── admin/
│       │   ├── index.astro           ← Dashboard (Alfred UI)
│       │   ├── inventario.astro      ← Stock BR + CO
│       │   ├── productos.astro       ← Editar precios/variantes
│       │   ├── mayoristas.astro      ← Aprobar/rechazar B2B
│       │   ├── ordenes.astro         ← Historial pedidos
│       │   └── transferencias.astro  ← Mover stock BR → CO
│       └── es/
│           └── mayoristas/
│               ├── index.astro       ← Landing pública
│               ├── registro.astro    ← Formulario (noindex)
│               └── portal/
│                   └── index.astro   ← Catálogo privado
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql    ← Schema completo
├── .atl/
│   ├── l-medusa-architecture.md      ← Plan arquitectura
│   └── proposals/
│       └── sdd-proposal-l-medusa-alfred.md
└── .env.example
```

---

## 🎨 Alfred UI — Integración

### Principe de Implementación
- Alfred: solo para interfaces privadas (Admin + B2B Portal)
- Componentes transferidos a `src/components/ui/alfred/`
- Todo convertido a **Astro SSR** (`prerender = false`)

### Mapeo de Vistas

| Ruta | Componente Alfred | Fuente de Datos |
|------|-------------------|-----------------|
| `/admin/index` | Dashboard / Analytics | Vistas agregadas de órdenes/clientes |
| `/admin/inventario` | Data Tables | Vista `gramos_disponibles` |
| `/admin/transferencias` | Forms / Settings | Tabla `transferencias` |
| `/admin/mayoristas` | User Management | Tabla `clientes` (b2b_estado) |
| `/es/mayoristas/portal` | E-commerce Grid | `getPrecioParaCliente()` |

### Ejemplo: Página Admin (SSR)

```astro
---
export const prerender = false;
import { supabase } from '../../lib/supabase';

const adminToken = Astro.cookies.get('admin_token')?.value;
if (!adminToken) return Astro.redirect('/admin/login');

const { data: inventario } = await supabase
  .from('gramos_disponibles')
  .select('*')
  .order('bodega_codigo', { ascending: true });
---

<html lang="es">
  <head><meta name="robots" content="noindex, nofollow" /></head>
  <body class="bg-zinc-950 text-zinc-50 antialiased">
    <main class="max-w-7xl mx-auto px-4 py-8">
      <h1 class="text-xl font-semibold">Inventario Global</h1>
      <table class="w-full text-left border-collapse">
        <!-- ... -->
      </table>
    </main>
  </body>
</html>
```

### Reglas de Diseño
1. **Tablas**: Sin degradados, fondo `bg-zinc-900`, bordes `border-zinc-800`
2. **Gráficos**: En Fase 1, usar listados de texto limpio en vez de Chart.js
3. **Aislamiento**: Código Alfred en subdirectorio cerrado, no contaminar UI pública

### Licencia
- Repositorio GitHub: **Privado** permanente
- Código fuente: custodia exclusiva del desarrollador
- Producción: acceso vía Vercel compilado

---

## 🗓️ Etapas de Implementación

### Etapa 1: Fundación ($0, ~12h)
- [ ] Aplicar SQL schema a Supabase
- [ ] Crear `src/lib/supabase.ts`
- [ ] Implementar `inventory/service.ts`
- [ ] Implementar `pricing/service.ts`
- [ ] Cargar datos reales: productos, variantes, stock

### Etapa 2: Multi-Idioma ($0, ~8h)
- [ ] Validar columnas `nombre_es/en/pt` en productos
- [ ] Service `inventory`: diferenciar bodega BR vs CO
- [ ] Endpoint que devuelva producto en idioma solicitado

### Etapa 3: Precios y Pasarelas ($0, ~10h)
- [ ] Service `pricing`: detectar país y retornar gateway correcto
- [ ] Integración Wompi (CO) + Stripe (BR)
- [ ] Carrito con `region_id` para contexto de moneda

### Etapa 4: Checkout y Órdenes ($0, ~8h)
- [ ] Service `orders` con `display_id` serial
- [ ] Workflow de estados: pending → pagado → preparando → enviado → entregado
- [ ] WhatsApp checkout manual

### Etapa 5: Admin Panel (Alfred) ($0, ~12h)
- [ ] Rutas `/admin/*` con SSR + gatekeeper
- [ ] Dashboard principal con alertas
- [ ] Inventario: vista `gramos_disponibles`
- [ ] Mayoristas: aprobar/rechazar B2B
- [ ] Órdenes: historial y estados
- [ ] Transferencias: mover stock BR → CO

### Etapa 6: Portal Mayorista ($0, ~6h)
- [ ] Auth Supabase para clientes B2B
- [ ] Portal privado con precios mayoristas
- [ ] Validación MOQ (mínimo 500g)

### Fase 2: Cuando WhatsApp Colapse ($0-15/mes)
- [ ] Carrito automático (no WhatsApp)
- [ ] Integración Wompi/Stripe completa
- [ ] Checkout sin WhatsApp

### Fase 3: Escala (~$50/mes)
- [ ] Migrar a Medusa Cloud usando Supabase existente
- [ ] Admin de Medusa
- [ ] Multi-dominio Brasil (octavofogo.com.br)

---

## 📚 Archivos Creados en Sesión

| Archivo | Estado | Descripción |
|---------|--------|-------------|
| `.atl/l-medusa-architecture.md` | ✅ | Plan completo L-Medusa |
| `.atl/proposals/sdd-proposal-l-medusa-alfred.md` | ✅ | SDD Proposal |
| `supabase/migrations/001_initial_schema.sql` | ✅ | Schema SQL completo |
| `src/lib/supabase.ts` | ✅ | Cliente singleton |
| `src/lib/inventory/types.ts` | ✅ | Tipos inventory |
| `src/lib/inventory/mock-data.ts` | ✅ | Datos mock |
| `src/lib/inventory/service.ts` | ✅ | Servicio inventory |
| `src/lib/inventory/index.ts` | ✅ | Export inventory |
| `src/lib/cart/types.ts` | ✅ | Tipos cart |
| `src/lib/cart/service.ts` | ✅ | Servicio cart |
| `src/lib/cart/index.ts` | ✅ | Export cart |
| `src/lib/customer/types.ts` | ✅ | Tipos customer |
| `src/lib/customer/service.ts` | ✅ | Servicio customer |
| `src/lib/customer/index.ts` | ✅ | Export customer |
| `src/lib/pricing/types.ts` | ✅ | Tipos pricing |
| `src/lib/pricing/service.ts` | ✅ | Servicio pricing |
| `src/lib/pricing/index.ts` | ✅ | Export pricing |
| `src/lib/orders/types.ts` | ✅ | Tipos orders |
| `src/lib/orders/service.ts` | ✅ | Servicio orders |
| `src/lib/orders/index.ts` | ✅ | Export orders |
| `src/lib/region/types.ts` | ✅ | Tipos region |
| `src/lib/region/service.ts` | ✅ | Servicio region |
| `src/lib/region/index.ts` | ✅ | Export region |
| `src/lib/index.ts` | ✅ | Export unificado |
| `.env.example` | ✅ | Variables de entorno |

---

## 🔑 Engram Observations

| ID | Title | Type |
|----|-------|------|
| #525 | privacidad-confianza (3 bloques) | architecture |
| #526 | SDD proposal (seo-transactional-trust-foundation) | architecture |
| #527 | inventario mock (gramos × 2 locaciones) | architecture |
| #528 | session summary (sesión completa) | manual |
| #529 | archivos sincronizados | manual |
| #530 | archivos restaurados | bugfix |
| #531 | L-Medusa backend layer — 5 modules created | architecture |
| #533 | Complete session: L-Medusa + Alfred architecture + SQL schema | architecture |
| #535 | Added multi-region support (3 tables + region service) | architecture |

---

## ⚠️ Recordatorios

- **Alfred**: Repositorio PRIVADO, nunca exponer código fuente
- **Supabase**: Usar `SUPABASE_SERVICE_KEY` (sin PUBLIC_) para operaciones servidor
- **Medusa**: No es servidor, es fuente de lógica canibalizada
- **Progresión**: Mock ($0) → Supabase ($0) → Medusa (~$50/mes)
- **Navbar**: NO tocar, 5 items es óptimo
- **Path correcto**: `/Users/calderonjosue_/clientes/activos/octavo-fuego/src-astro/`

---

*Documento consolidado: Junio 16, 2026 — Sesión completa de arquitectura*
*Engram: `sdd/octavo-fuego/l-medusa-alfred-complete`*
