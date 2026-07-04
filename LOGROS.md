# Octavo Fuego — Historial de Logros

> Bitácora de sprints y fases completadas.
> Para tareas pendientes activas, ver [`PENDIENTES.md`](PENDIENTES.md).
> Para contexto persistente, buscar en Engram por `sdd/*`.

---

## 🗄️ SDD Archivado: design-refresh-airbnb-style (Abandonado — Julio 3, 2026)

> **SDD**: `.atl/sdd/design-refresh-airbnb-style/`
> **Estado**: ❌ ABANDONADO — Ya no se usa esta dirección de diseño
> **Completado**: 15/17 tareas

### Lo que se implementó (✅)
- Color tokens (Verde Botánico, Ceniza, Near-black)
- Sistema de sombras de 3 capas (`--shadow-card`, `--shadow-hover`)
- Border radius tokens (8px buttons, 20px cards, 14px badges, pill 20px)
- ProductCard restyled con hover lift
- Button restyled (primary/secondary)
- Navbar + Footer actualizados
- Homepage + Product detail page actualizados
- Micro-interactions (translateY, scale, transitions)

### Lo que NO se implementó (abandonado)
- CategoryPills component (horizontal scroll filters)
- Tienda index con pills y grid updates

### Por qué se abandonó
> El Visual Frontend Audit (`visual-frontend-audit`) identificó problemas más críticos que el refresh visual: i18n hardcodeado, accesibilidad WCAG, performance React, y lorem ipsum en 21 páginas. La dirección de "Airbnb style" fue reemplazada por priorización basada en el audit de findings reales del sitio.

### Archivos del SDD
- `.atl/sdd/design-refresh-airbnb-style/proposal.md`
- `.atl/sdd/design-refresh-airbnb-style/spec.md`
- `.atl/sdd/design-refresh-airbnb-style/design.md`
- `.atl/sdd/design-refresh-airbnb-style/tasks.md`

---

## 🎯 Visual Frontend Audit — Julio 3, 2026

> **SDD**: `visual-frontend-audit` — 8 explores + 4 sub-fases SEO (E1-E9)
> **Engram**: `sdd/visual-frontend-audit/e[1-9]-*` (explore + proposal por fase)
> **Skills nuevos**: impeccable, wcag-audit, web-quality-audit, vercel-react-best-practices, design-taste-frontend, emil-design-eng, tailwind-design-system, astro, i18n-localization, seo-audit, shadcn, find-skills + 4 complementarios
> **Skills on-demand**: 26 skills en `skills_master/web-pack/`

| Explore | Skill | Score | Hallazgos | Estado |
|---------|-------|-------|-----------|--------|
| E1 UI Visual Audit | impeccable | 12/20 | 18 issues (5 P1, 9 P2, 4 P3) | Proposal listo |
| E2 Accesibilidad WCAG | wcag-audit | A con gaps | 5 Critical, 5 High, 7 Medium | ✅ Implementado |
| E3 Web Quality | addyosmani | 55-75 | Perf 55, A11y 60, SEO 75, BP 65 | ✅ Implementado |
| E4 React Performance | vercel-react | ~150KB salvageable | 22 issues (3 Critical) | Proposal listo |
| E5 Design Taste + Craft | taste + emil | AI Slop Bajo-Medio | 7 hallazgos | ✅ Reemplazado por audit |
| E6 Tailwind + Tokens | tailwind-ds | Híbrido confuso | 10 issues (4 Critical) | ✅ Implementado |
| E7 Astro Best Practices | astro | SSG roto | 10 issues (2 Critical) | ✅ Implementado |
| E8 i18n / Locale | i18n | React islands sin i18n | 4 Critical, 2 High | ✅ Implementado |
| E9-P1 Technical SEO | seo-audit | Canonical roto | 5 Critical | Proposal listo |
| E9-P2 International SEO | seo-audit | Sitemap sin i18n | 3 Critical | Proposal listo |
| E9-P3 On-Page SEO | seo-audit | Brand duplicado | 3 Critical | Proposal listo |
| E9-P4 Content + Schema | seo-audit | Lorem ipsum, garbled | 3 Critical | Proposal listo |

---

## 🏛️ Architectural Decision Record — ADR v2 (Julio 3, 2026)

> **Engram:** `architecture/decision-record-v2` (#1702)
> **Stack:** Astro 6 + Supabase Free Tier + multi-pasarela multi-país
> **Context:** Stack modernization + Domain Layer + Multi-Pasarela (Wompi, Stripe, Pix)
> **Commits:** `XXXXXXX` | **Tag:** `v0.10.0` | **Build:** ✅ 0 errores

### 🔥 Tier 1 — Critical Blockers ✅ COMPLETADO
- [x] T1.1 `bcryptjs` → Web Crypto API (PBKDF2) — SDD auth-web-crypto-migration completo (3 PRs)
- [x] T1.2 `lucide-react` purgado → inline SVG en 4 archivos admin (~39MB liberados)
- [x] T1.3 `process.env` → `import.meta.env` en `index-now.ts`
- [x] T1.4 Timezone UTC rule documentada en AGENTS.md

### 🟠 Tier 2 — Domain Layer ✅ COMPLETADO
- [x] T2.1 Value Objects: Divisa, Monto, TasaCambio (pure TS, invariants, métodos)
- [x] T2.1 Domain Entities: Producto, Orden, Cliente, Pago (pure interfaces)
- [x] T2.2 Repository interfaces: 4 contratos en domain/repositories/
- [x] T2.3 PagoGateway port + Anti-Corruption Layer pattern
- [x] T2.4 EventBus 10/10: Promise.allSettled + registerHandler()
- [x] T2.5 Mapper bidireccional: MapperBidireccional<D,R> + ProductoDomainMapper
- [x] T2.6 ProductoServicio POC (port + mock + supabase + factory)

### 🟡 Tier 3 — Admin UX + Integración ✅ COMPLETADO
- [x] T3.1 Migrados 4 servicios: OrdenServicio, ClienteServicio, PagoServicio, ContabilidadServicio
- [x] T3.2 Cache wrapper SSR: conCache() con 5 min TTL
- [x] T3.3 URL State Pattern: SlidePanel + usePanel (popstate, back button, ?panel=)
- [x] T3.4 UI Components: EmptyState, Skeleton (4 variants), StatusBadge (9 estados)

### 🟢 Tier 4 — Primera Pasarela Real 🔶 PLANEADO (no ejecutado)
> SDD Proposal en `sdd/payment-gateway-wompi/proposal` (#1719)
- [ ] T4.1 WompiGateway (implementar PagoGateway port)
- [ ] T4.2 Integración con checkout (requiere credenciales Wompi)
- [ ] T4.3 Webhook handler POST /api/webhooks/wompi

### ❌ Decisiones NO tomadas (con causa en #1702)
- Event Sourcing puro, CQRS con bus de mensajes, Monorepo + Medusa Server, GraphQL

---

## 🏁 Sprint v0.10.0 — ADR v2 Stack Modernization + Domain Layer (Julio 3, 2026)

> **Tags:** `v0.10.0` | **Build:** ✅ 0 errores
> **Fuente:** Judgment Day PASS WITH WARNINGS (0 CRITICAL, 4 WARNING corregidos)

### ✅ Stack Modernization
| Tarea | Cambio | Archivos |
|-------|--------|----------|
| bcryptjs → Web Crypto PBKDF2 | SDD auth-web-crypto-migration (3 PRs) | auth.ts, middleware, login, 4 API routes, package.json |
| Purgar lucide-react 38MB | 8 iconos → inline SVG | 4 componentes admin |
| process.env → import.meta.env | index-now.ts Edge-safe | index-now.ts |
| Timezone UTC rule | Nueva architecture principle | AGENTS.md |

### ✅ Domain Layer (25+ archivos nuevos)
| Tarea | Descripción |
|-------|-------------|
| Value Objects | Divisa, Monto, TasaCambio (pure TS) |
| Domain Entities | Producto, Orden, Cliente, Pago |
| Repository Interfaces | 4 contratos en domain/repositories/ |
| PagoGateway port | Interfaz genérica Wompi/Stripe/Pix |
| EventBus 10/10 | Promise.allSettled + registerHandler |
| Mapper bidireccional | MapperBidireccional<D,R> |
| 5 servicios hexagonal | Port + Mock + Supabase + Factory |

### ✅ Admin UX
| Tarea | Archivos |
|-------|----------|
| Cache wrapper SSR | conCache() 5 min TTL |
| URL State Pattern | SlidePanel + usePanel |
| UI Components | EmptyState, Skeleton, StatusBadge |

---

## 🏁 Sprint v0.9.1 — JD Priority Fixes + Multi-User (Julio 1, 2026)

> **Tags:** `v0.9.1` | **Build:** ✅ 0 errores
> **Commits:** 55a8007

### Fixes aplicados
| Fix | Archivos | Cambio |
|-----|----------|--------|
| Redirects `/es/...` | `astro.config.mjs` | Eliminados targets a rutas que no existen |
| SEO JSON-LD URLs | 3 componentes SEO | URLs sin `/es/` |
| i18n Cart + Checkout | `carrito/`, `checkout/` | Locale-aware desde la URL |
| JWT secret requerido | `auth.ts` | Error si falta env var |
| API routes protegidas | `middleware/auth.ts` | Solo `/api/auth/` pública |
| bcrypt async | `auth.ts` | `compareSync` → `await compare` |
| Login con `astro:page-load` | `login.astro` | Funciona post-navegación |

### Segundo usuario admin
| Email | Contraseña |
|-------|-----------|
| `edison@octavofuego.com` | `octavo2026` |

---

## 🏁 Sprint v0.9.0 — Judgment Day Completo (Julio 1, 2026)

> **Tags:** `v0.7.1` | **Build:** ✅ 0 errores

### Schema bugs corregidos
| Bug | Fix |
|-----|-----|
| `alerta_stock_bajo` en `niveles_inventario` | Cambiado a `gramos_disponibles` view |
| `clientes.nombre` no existe | Cambiado a `nombre_empresa` |
| FK path productos→niveles | Verificado correcto |

---

## 🏁 Sprint v0.7.0 — Admin Hydration Fix (Julio 1, 2026)

> **Tags:** `v0.7.0` | **Build:** ✅ 0 errores

### AdminLayout — Sidebar
- Init guard con `data-ui-initialized` + event delegation
- Submenu toggles: 3 listeners → 1 (delegación)
- Duplicate fix en `$sidebarOpen.subscribe()`

### 12 páginas admin — `astro:page-load`
dashboard, ordenes, clientes, b2b, stock, pagos, contabilidad (3), actividad, configuracion

---

## 🏁 Sprint v0.6.1 — Blank Page Fix (Julio 1, 2026)

> **Tags:** `v0.6.1`

| Bug | Fix |
|-----|-----|
| `BodegaSwitcher` usaba `document.cookie` en SSR | `typeof document !== 'undefined'` guard |
| 9 iconos Solar Bold faltaban | Agregados a `astro.config.mjs` |

---

## 🏁 Sprint v0.6.0 — SEO Architecture Complete (Julio 1, 2026)

> **Tags:** `v0.6.0` | **PR:** #31

| Fase | Qué | Archivos |
|------|-----|----------|
| F0 | Fix blank dashboard (Supabase env check) | AdminLayout, index, mapper |
| F2 | FAQ Schema (6 preguntas × 5 prod × 3 locales) | FAQPageJsonLd, FAQSection |
| F5 | OG Branded SVG locale-aware | OGBrandedImage |
| F6 | hreflang + canonical (language-only) | Layout.astro |
| F7 | Visual breadcrumb ES + OG title | [product].astro |

---

## 🏁 Sprint v0.5.0 — SEO Transaccional (Julio 1, 2026)

> **Tags:** `v0.5.0` | **PR:** #30

| Tarea | Archivo | Cambio |
|-------|---------|--------|
| 1.1 Refactor props | ProductJsonLd | `precio: number` → `pricing: PriceGram[]` |
| 1.2 Schema | ProductJsonLd | `hasVariant` con 3 Offer entries |
| 1.3 Wiring | [product].astro | Pasar `pricing` array |
| 3.1 Title | [product].astro | "Comprar Rapé X — Rapé do Acre" (3 locales) |
| 3.2 Meta desc | [product].astro | "Desde COP 3.500/g." |

### Bug Fixes
- Status buttons `'pending'` → `'pendiente'`
- Script scope en page.astro
- API endpoint status.ts
- Branch cleanup: 21 branches eliminadas

---

## 🏁 Sprint v0.4.3 — Phase 2: Core Ecommerce (Julio 1, 2026)

> **Tags:** `v0.4.3` | **Commits:** 68e59fe | **Build:** ✅ 0 errores
> **Fuente:** Patrones Medusa + Pipod `runWorkflow()` compensation

### ✅ F43: PricingService → Supabase
| Tarea | Archivo | Cambio |
|-------|---------|--------|
| 43.1 | `lib/pricing/service.ts` | Lectura de variantes + listas_precio + factores_conversion |
| 43.2 | PriceTiers | getPriceTiers() multi-moneda con interpolación |

### ✅ F44: liberar_reserva + FOR UPDATE
| Tarea | Archivo | Cambio |
|-------|---------|--------|
| 44.1 | `migrations/009_...sql` | FOR UPDATE en incrementar_reserva (race condition fix) |
| 44.2 | `migrations/009_...sql` | liberar_reserva + confirmar_reserva RPCs |

### ✅ F45: runWorkflow Compensation
| Tarea | Archivo | Cambio |
|-------|---------|--------|
| 45.1 | `lib/checkout/workflow.ts` | runWorkflow() con compensate automático en reversa |
| 45.2 | `lib/checkout/index.ts` | Checkout service con reserva → WhatsApp → evento |

### ✅ F46: Cart Service Híbrido
| Tarea | Archivo | Cambio |
|-------|---------|--------|
| 46.1 | `lib/checkout/index.ts` | Validación stock + precios contra Supabase antes de checkout |

### ✅ F47: Checkout WhatsApp Flow
| Tarea | Archivo | Cambio |
|-------|---------|--------|
| 47.1 | `lib/checkout/index.ts` | Workflow completo: carrito → reserva → WhatsApp → confirmación |

### ✅ F48: ProductForm Price Editing
| Tarea | Archivo | Cambio |
|-------|---------|--------|
| 48.1 | `ProductForm.astro` | Tabla de variantes con precio_cop/precio_brl/precio_usd editables |
| 48.2 | `inventario/index.astro` | POST handler para guardar precios |

---

## 🏁 Sprint v0.4.2 — Astro 6 Improvements (Julio 1, 2026)

> **Tags:** `v0.4.2` | **PR:** #25

| Fase | Descripción |
|------|-------------|
| F40 | Astro Actions (defineAction + Zod validation) |
| F41 | View Transitions (ClientRouter + transition:persist + astro:page-load) |
| F42 | Middleware Composition (sequence + defineMiddleware + getActionContext) |

---

## 🏁 Sprint v0.4.0 — SDD F1-F33 Admin Service Layer (Julio 1, 2026)

> **Tags:** `v0.4.0` | **PRs:** #4 → #23 (chained)
> **Engram:** 133 artifacts SDD

### F1-F6: Foundation Layer
| Fase | Archivos |
|------|----------|
| F1 | Zod schemas en español + i18n STATUS_LABELS |
| F2 | ErrorApp + 4 subclases (Validacion, NoEncontrado, Autorizacion, Supabase) |
| F3 | SupabaseService abstract class con bodegaId |
| F4 | DB catalog con nombres corregidos |
| F5 | Query helpers: getGramosDisponibles, getNivelesInventario, getPreciosLista |
| F6 | Mapper<T,R> interface + MAPEADORES registry |

### F7-F13: Services + Admin Layer
| Fase | Descripción |
|------|-------------|
| F7 | ProductoService con batch queries (no N+1) |
| F8 | OrdenService con state machine validation |
| F9 | ClienteService + B2B solicitud management |
| F10 | PagoService con confirmarPago / marcarFallido |
| F11 | Admin stores: user, ui, notifications (Nanostores) |
| F12 | TypedEventBus con Supabase RPC persistence |
| F13 | crearServicios() factory + initAdminSession |

### F14-F33: Page Migration (20 páginas migradas)
Dashboard, Inventario, Stock, Órdenes (list + detail + state machine), Clientes, B2B, Pagos, Notificaciones, Configuración

---

## 🎨 Fase 2 — Diseño ✅

- [x] Wireframes de todas las páginas
- [x] Copy completo (3 idiomas: ES/EN/PT)
- [x] Design system visual (colores, tipografía, componentes)
- [x] Tono y voz definido: "Maestro-Contador de Historias"
- [x] Estética: Minimalist Sacred (blanco + sombras Airbnb)

---

## 💻 Fase 3 — Desarrollo (previo a v0.4.0)

### 3.1 Setup del Proyecto ✅
- [x] Astro 6.1.3 con TailwindCSS 4
- [x] shadcn/ui + Radix UI
- [x] Nanostores para estado del carrito
- [x] i18n configurado (ES/EN/PT) con `[locale]` params
- [x] Vercel deploy configurado

### 3.2 Layout & Componentes ✅
- [x] Layout.astro con SEO meta tags
- [x] Navbar con dropdown (5 rapés) + LanguageSwitcher
- [x] Footer locale-aware (4 columnas)
- [x] FloatingWhatsApp (100% Astro, 0KB JS) ~~React~~
- [x] Componentes UI (Button, Card, Input, Badge, Tabs, Modal)

### 3.3 Sistema de Productos ✅
- [x] Data layer: 5 rapés × 3 idiomas (verbatim copy)
- [x] Precios: 10g/$35K, 20g/$70K, 30g/$100K + precio/g visible
- [x] PricingTable con botones seleccionables
- [x] Mapa de intenciones (5 categorías)
- [x] Profecía completa (3 idiomas)
- [x] Glosario de términos

### 3.4 Páginas ✅
- [x] Homepage (Hero, Profecía, Quiz, Productos, Trust Badges)
- [x] Catálogo principal (`/es/tienda/` — migrate from `/catalogo/` ✅)
- [x] Categoría Rapé (`/es/tienda/rape/`)
- [x] Detalle de producto (`/es/tienda/rape/[product]`)
- [x] Profecía completa (`/profecia`)
- [x] Carrito de compras (`/carrito`)
- [x] Checkout (`/checkout`)
- [x] Blog listing + 4 posts

### 3.5 SEO ✅ (Audit + Fixes completados Junio 15, 2026)

#### Schemas (100% cobertura)
- [x] OrganizationJsonLd — logo, foundingDate 2026, knowsAbout+desc, sameAs +WhatsApp, address (ciudad/estado)
- [x] ProductJsonLd (×15) — @id, mainEntityOfPage, itemCondition NewCondition, additionalProperty, priceValidUntil, seller @id
- [x] BreadcrumbJsonLd (×15) — @id cross-referenced with Product
- [x] BlogPosting (×4) — Article schema en todos los posts del blog
- [x] ItemList (×6) — categoría rapé + catálogo principal en 3 locales

#### SEO Técnico
- [x] Hreflang tags para ES/EN/PT (antes faltaban)
- [x] og:image → logo.png (antes roto)
- [x] AggregateRating falso eliminado
- [x] Heading hierarchy corregida
- [x] Img width/height attributes agregados
- [x] Product images → placeholder bobinsana
- [x] Dead code removido: SeoLayout.astro, BaseSeo.astro
- [x] Sitemap + robots.txt
- [x] Open Graph + Twitter Cards

### 3.6 Por Hacer 🔄
- [x] Convertir WhatsAppButton.tsx → .astro (mismo fix que FloatingWhatsApp)
- [x] WhatsAppButton en PDP — integrado en `PricingTable.astro:86`
- [ ] **Imágenes reales de los 5 rapés** (placeholder: bobinsana-rape-2.webp)
- [x] ~~**og:image social card real (1200×630)**~~ ✅ og-default.svg existe en `public/images/`
- [ ] **Página "Nosotros"** → Ver §3.12 Bloque A
- [ ] **11 páginas SEO** (6 trust foundation + 5 landings)

### 3.13 L-Medusa Backend Layer ✅ (Jun 16, 2026)
> Arquitectura: `.atl/l-medusa-architecture.md` | Engram: `sdd/octavo-fuego/l-medusa-alfred-complete`

#### ✅ Completado
- [x] **SQL Schema completo** — `supabase/migrations/001_initial_schema.sql` (19 tablas, 3 vistas, 3 RPC functions, seed data)
- [x] **Cliente Supabase** — `src/lib/supabase.ts` (singleton con Database types)
- [x] **Servicio Inventory** — `src/lib/inventory/` (types, mock-data, service, index)
- [x] **Servicio Cart** — `src/lib/cart/` (types, service, index)
- [x] **Servicio Customer** — `src/lib/customer/` (types, service, index)
- [x] **Servicio Pricing** — `src/lib/pricing/` (types, service, index)
- [x] **Servicio Orders** — `src/lib/orders/` (types, service, index)
- [x] **Servicio Region** — `src/lib/region/` (types, service, index)
- [x] **Export unificado** — `src/lib/index.ts`
- [x] **Variables de entorno** — `.env.example`
- [x] **SDD Proposal** — `.atl/proposals/sdd-proposal-l-medusa-alfred.md`

#### 📋 Pendiente (Etapas)
- [ ] **Etapa 1:** Aplicar SQL schema a Supabase
- [ ] **Etapa 2:** Multi-idioma (validar columnas nombre_es/en/pt)
- [ ] **Etapa 3:** Precios y pasarelas (Wompi CO + Stripe BR)
- [ ] **Etapa 4:** Checkout y órdenes
- [ ] **Etapa 5:** Admin Panel (Alfred UI)
- [ ] **Etapa 6:** Portal Mayorista

### 3.14 Admin Auth System ✅ (Jun 17, 2026)
> SDD: `admin-auth-system` | Commit: `f88b6b0` en develop

#### ✅ Completado
- [x] **Auth library** — `src/lib/auth.ts` (credenciales hardcodeadas, SHA-256 tokens, constant-time comparison)
- [x] **Middleware** — `src/middleware/auth.ts` (locale redirect /en|pt/admin → /admin, cookie verification, auth guard)
- [x] **API Login** — `POST /api/auth/login` (valida credenciales, setea cookie httpOnly, 400/401/500 JSON errors)
- [x] **API Logout** — `GET /api/auth/logout` (limpia cookie, redirect /admin/login)
- [x] **Login UI** — `login.astro` (fetch-based form, loading state, error display)
- [x] **Logout Button** — `AdminLayout.astro` (Cerrar Sesión en sidebar)
- [x] **Vercel Adapter** — `@astrojs/vercel` instalado para soporte de API routes en producción
- [x] **Prerender Fix** — `export const prerender = false` en API routes para server-side rendering

#### Credenciales
```
Email:    admin@octavofuego.com
Password: octavo2026
```

### 3.15 SDD F1-F33 Admin Service Layer ✅ (Jul 1, 2026)
> **v0.4.0** — 20 PRs chained, 16 nuevos archivos, ~900 líneas

#### ✅ Foundation (F1-F6)
- [x] **F1 Zod Schemas** — 7 enums en español, traducciones.ts i18n (ES/EN/PT)
- [x] **F2 Typed Errors** — ErrorApp + 4 subclases con statusCode + severity
- [x] **F3 SupabaseService** — Base abstracta con bodegaId constructor + CRUD + mock fallback
- [x] **F4 DB Catalog** — TABLAS const con nombres corregidos (listas_precio, niveles_inventario, gramos_disponibles view)
- [x] **F5 Intermediate Helpers** — getNivelesInventario, getGramosDisponibles (view), getPreciosLista
- [x] **F6 Mapper Interface** — Mapper<T,R> + MAPEADORES registry + ProductoMapper con join context

#### ✅ Domain Services (F7-F10)
- [x] **F7 ProductosService** — Batch query (3 queries), variant CRUD, F1 Zod validation
- [x] **F8 OrdenesService** — State machine validation via F1 ActualizarEstadoSchema
- [x] **F9 ClientesService** — B2B solicitud management (aprobar/rechazar)
- [x] **F10 PagosService** — confirmarPago / marcarFallido

#### ✅ Admin Infrastructure (F11-F13)
- [x] **F11 AdminStore** — user.ts + ui.ts + notificaciones.ts (Nanostores)
- [x] **F12 TypedEventBus** — EventMap + emit con persistencia RPC + subscribe/unsubscribe
- [x] **F13 AdminProvider** — crearServicios() factory + Servicios type

#### ✅ Page Migration (F14-F33)
- [x] **F14 Dashboard** — Service wiring + RecentOrders/LowStock refactor a props
- [x] **F15 Productos List** — inventario/index.astro → svc.productos.listar()
- [x] **F16 Stock Page** — query a gramos_disponibles view
- [x] **F18-F19 Órdenes** — list + detail con POST handler for cambiarEstado
- [x] **F20 OrderStateMachine** — Nuevo componente stepper horizontal
- [x] **F21-F25 Clientes/Pagos** — 4 páginas migradas a service layer
- [x] **F27 EventTimeline** — Nuevo componente timeline vertical
- [x] **F29 Sidebar** — Wire a $sidebarOpen + $seccionActual stores

### 3.16 Astro 6 Improvements ✅ (Jul 1, 2026)
> Basado en documentación oficial de Astro consultada via `astro-docs` MCP

- [x] **F40 Astro Actions** — `src/actions/index.ts` con defineAction() + validación Zod
- [x] **F41 View Transitions** — `<ClientRouter />` + `transition:persist` + `astro:page-load`
- [x] **F42 Middleware Composition** — `sequence()` + `defineMiddleware()` + `getActionContext()`

### 3.17 Phase 2: Core Ecommerce ✅ (Jul 1, 2026)
> **v0.4.3** — Pricing, reservas, checkout workflow, cart híbrido, precios en admin

- [x] **F43 PricingService** — Supabase con variantes + listas_precio + factores conversión multi-moneda
- [x] **F44 Reservas RPC** — FOR UPDATE (race condition fix) + liberar_reserva + confirmar_reserva
- [x] **F45 runWorkflow** — Patrón de compensación Pipod (rollback automático en fallo)
- [x] **F46 Cart Híbrido** — Validación stock + precios contra Supabase antes de checkout
- [x] **F47 Checkout WhatsApp** — Workflow: cart → reserva → WhatsApp → confirmación → orden
- [x] **F48 Precios en Admin** — ProductForm con tabla de variantes + precios editables (COP/BRL/USD)

#### Reglas de Negocio
| Región | Bodega | Moneda | Gateway | Envío |
|--------|--------|--------|---------|-------|
| CO | CO-BOGOTA | COP | Wompi | Local CO |
| BR | BR-ACRE | BRL | Stripe+Pix | Nacional BR |
| EU | BR-ACRE | USD | Stripe | Internacional |
| US | BR-ACRE | USD | Stripe | Internacional |

#### Factores de Conversión (Manuales)
| Origen | Destino | Factor |
|--------|---------|--------|
| BRL | USD | 0.2020 |
| COP | USD | 0.00024 |
| BRL | COP | 833.00 |
| USD | COP | 4166.00 |

---

## 📋 Code Review — Admin + Infraestructura (Jun 17, 2026)

> 2,512 líneas admin, 537 infra, 130 services

### 🔴 CRÍTICOS corregidos
- CR-01: CustomerDetail ignora el ID → ✅ pendiente en PENDIENTES.md
- CR-02: OrderDetail ignora el ID → ✅ pendiente en PENDIENTES.md
- CR-03: Mock data de otro negocio → ✅ pendiente en PENDIENTES.md

### 🟡 WARNINGS identificados
- W-04 a W-08: Dashboard period selector, Supabase keys, credenciales hardcodeadas, AdminLayout decorativo, iniciales hardcodeadas → ver PENDIENTES.md

### 🟢 SUGERENCIAS
- S-09 a S-11: Sidebar SVG inline, tipos con categorías ajenas, regiones no operadas → ver PENDIENTES.md

---

## 🐛 Judgment Day — Bugs Postergados (Jun 17, 2026)

> Encontrados en Code Review del Jun 17. Clasificados por severidad.

### 🔴 CRÍTICOS — Postergados a v0.x
- **BUG-01:** `BodegaSwitcher` usa `document.cookie` en SSR → Blank page en producción
- **BUG-02:** `OrderTimeline` usa `new Date()` en componente → Inconsistencia en fechas
- **BUG-03:** Login con `astro:page-load` no disparaba re-render → Auth state stale

### 🟠 HIGH — Postergados a v0.x
- **BUG-04:** Notificaciones $notifications no se persisten en localStorage
- **BUG-05:** `SlidePanel` no maneja `Escape` key para cerrar
- **BUG-06:** Carrito con `count` 0 no muestra empty state en servidor
- **BUG-07:** Checkout POST sin CSRF token → Vulnerable a ataques
- **BUG-08:** i18n copy en компоненты React no funciona post-hydration

### 🟡 MEDIUM — Postergados a v0.x
- **BUG-09:** `formatCOP()` no usa Intl.NumberFormat para localization
- **BUG-10:** Imagen de producto con `loading="lazy"` causa layout shift
- **BUG-11:** Navbar mobile no tiene backdrop-filter blur
- **BUG-12:** FloatingWhatsApp button z-index compite con modales
- **BUG-13:** SEO hreflang en páginas blog no apunta a versión correcta

---

## 📉 Deuda Técnica Diferida (Jun 17, 2026)

### 🔶 Prioridad Alta
- **DEU-01:** Migrar `bcryptjs` a Web Crypto API (requiere `sdd-auth-web-crypto`)
- **DEU-02:** Agregar `import type` en 47 archivos (TypeScript strict mode)
- **DEU-03:** Purgar `lucide-react` 38MB → inline SVG o `astro-icon`

### 🟡 Prioridad Media
- **DEU-04:** `process.env` → `import.meta.env` en Edge runtimes (Vercel)
- **DEU-05:** Mover tipos de dominio a `src/types/domain/` (separar de DB)
- **DEU-06:** Agregar Zod schemas en API routes (validación runtime)
- **DEU-07:** Lazy loading de componentes Admin > 50KB

### 🟢 Prioridad Baja
- **DEU-08:** Extraer constantes magic numbers a `src/lib/constants.ts`
- **DEU-09:** Unificar formatting COP/BRL en `src/lib/currency/`
- **DEU-10:** Renombrar `src/lib/supabase.ts` → `src/lib/db/client.ts`

---

## 📁 Estructura de Archivos — Admin (Jun 12, 2026)

```
src-astro/src/
├── actions/             # Astro Actions (F40)
│   ├── index.ts
│   └── orders.ts
├── admin/               # Admin pages
│   ├── index.astro     # Dashboard
│   ├── ordenes/
│   │   ├── index.astro
│   │   └── [id].astro
│   ├── clientes/
│   │   ├── index.astro
│   │   └── [id].astro
│   ├── stock/
│   │   └── index.astro
│   └── ...
├── components/
│   └── admin/           # Admin UI components
│       ├── AdminLayout.astro
│       ├── Sidebar.astro
│       ├── OrderStateMachine.astro
│       ├── EventTimeline.astro
│       ├── EmptyState.astro
│       └── Skeleton.astro
├── db/
│   ├── catalog.ts       # Table + column names (F4)
│   ├── columnas.ts
│   ├── helpers.ts      # SQL helpers (F5)
│   └── tablas.ts
├── middleware/
│   └── auth.ts          # JWT + locale + admin guards
├── schemas/
│   └── index.ts        # Zod schemas (F1)
├── services/
│   ├── base.ts         # SupabaseService abstract (F3)
│   ├── mapper.ts       # Mapper registry (F6)
│   ├── ordenes.ts      # OrdenService (F8)
│   ├── productos.ts    # ProductoService (F7)
│   └── clientes.ts     # ClienteService (F9)
├── stores/
│   ├── admin/          # Nanostores admin (F11)
│   │   ├── user.ts
│   │   ├── ui.ts
│   │   └── notifications.ts
│   └── cartStore.ts    # Cart Nanostore
└── lib/
    ├── auth.ts         # Auth library (SHA-256)
    ├── eventos.ts      # TypedEventBus (F12)
    └── provider.ts     # Factory + init (F13)
```

---

## 🧹 Limpieza (Jun 17, 2026)

- [x] Directorio fantasma `ativos/octavo-fuego/` eliminado
- [x] PENDIENTES.md auditado y consolidado

---

## 📝 Commits Completos (Mayo-Junio 2026)

> Útiles para `git log --oneline` o `git bisect`

| Fecha | Commit | Rama | Descripción |
|-------|--------|------|-------------|
| Jul 01 | `68e59fe` | develop | **v0.4.3** — Phase 2 Core Ecommerce (pricing, reservas, checkout, precios admin) |
| Jul 01 | `2ffa6b0` | develop | feat: F45-F47 checkout workflow, cart service, WhatsApp flow |
| Jul 01 | `41b11d9` | develop | feat: F44 liberar_reserva + confirmar_reserva RPCs with FOR UPDATE |
| Jul 01 | `8b0249c` | develop | feat: F43 PricingService with Supabase (variantes + listas_precio) |
| Jul 01 | `f397893` | main | **v0.4.2** — Astro 6 improvements: Actions, View Transitions, Middleware |
| Jul 01 | `ee7c999` | develop | feat: F42 middleware composition with sequence + getActionContext |
| Jul 01 | `4bd0254` | develop | feat: F41 View Transitions with ClientRouter + persisted sidebar |
| Jul 01 | `55263ff` | develop | feat: F40 Astro Actions infrastructure |
| Jul 01 | `f397893` | main | **v0.4.0** — SDD F1-F33 foundation, services, admin migration |
| Jul 01 | `c087898` | develop | feat: SDD F1-F33 foundation, services, and page migration |
| Jul 01 | `0f8d44a` | feature/... | feat: F26-F33 cross-cutting (EventTimeline, sidebar store wiring) |
| Jul 01 | `d41a9f5` | feature/... | feat: F21-F25 client and payment pages migration |
| Jul 01 | `0bd93e9` | feature/... | feat: F20 OrderStateMachine component (NEW) |
| Jul 01 | `031fc9f` | feature/... | feat: F19 orden detail migration + POST handler |
| Jul 01 | `3ea3366` | feature/... | feat: F14 dashboard migration + RecentOrders/LowStock refactor |
| Jul 01 | `9a4dd30` | feature/... | feat: F12 typed event bus + F13 admin provider factory |
| Jul 01 | `09e6cc8` | feature/... | feat: F11 admin stores (user, ui, notifications) |
| Jul 01 | `ccf8c2b` | feature/... | feat: F10 PagosService with confirm/mark-failed operations |
| Jul 01 | `e06d060` | feature/... | feat: F9 ClientesService with B2B solicitud management |
| Jul 01 | `a379e25` | feature/... | feat: F7 ProductosService with batch queries and variants |
| Jul 01 | `ebc2cff` | feature/... | feat: F1 Zod schemas with Spanish enums and i18n status labels |
| Jun 15 | `44ec78d` | main | feat(seo): add ItemList schema to category pages, restore Organization address |
| Jun 15 | `8f17307` | main | fix(seo): OrganizationJsonLd — foundingDate 2026, knowsAbout desc, sameAs +WhatsApp |
| Jun 15 | `ba610f8` | main | fix(seo): improve JSON-LD schemas — @id, cross-refs, dates ISO |
| Jun 15 | `4a2ae13` | main | fix(seo): remove dead code, heading hierarchy, article schema, img dimensions |
| Jun 15 | `bbfcf32` | main | fix(seo): hreflang tags, schema import, fake rating removal, og-image |
| Jun 15 | `1966698` | main | docs: link PROYECTO, README, AGENTS with Engram topic keys |
| Jun 15 | `e2b8f26` | main | docs: create PROYECTO.md - single source of truth |
| Jun 15 | `fea5d43` | main | docs: update PENDIENTES, AGENTS, design.md - dark sections + icon system |
| Jun 15 | `f24e304` | main | fix(home): Trust Badges bg to --color-action-hover for visual hierarchy |
| Jun 15 | `8355265` | main | feat(home): dark tobacco background for Trust Badges section |
| Jun 15 | `38acc01` | main | feat(brand): update tagline to Rapé de Acre, Amazonía brasileira |
| Jun 15 | `065ff98` | main | fix(footer): replace duotone icons with solid variants for max contrast |
| Jun 15 | `9671908` | main | fix(footer): icon color text-white for max contrast on dark background |
| Jun 15 | `db89858` | main | migrate: --verde-botanico → --color-action-primary (76 occurrences, 18 files) |

---

## 👥 Contactos del Proyecto

| Rol | Nombre | Email | Nota |
|-----|--------|-------|------|
| Admin | Josue Calderon | `luisjosue1205@gmail.com` | Navio Azul |
| Admin | Edison | `edison@octavofuego.com` | `octavo2026` |
| Desarrollador | AI Assistant | — | OpenCode + Gentle AI |

---

## 🔗 Referencias

- **Repo:** https://github.com/octavofuegostore/octavo-fuego
- **Deploy:** Vercel (pendiente)
- **Base de datos:** Supabase (proyecto activo)
- **Pasarela de pago:** Wompi (pendiente integración)
- **Engram project:** `octavo-fuego`
- **Skill registry:** `skills/on-demand-registry` (#1725)

---

## 📹 Blog — Estrategia "Consejos o Pajé"

> Fuente: [`.atl/estrategia-contenido-consejos-o-paje.md`](.atl/estrategia-contenido-consejos-o-paje.md)

- [ ] **Crear sección "Consejos o Pajé"** — blog de curaduría de videos de YouTube (chamanes, taitas, antropólogos)
- [ ] **Template de entrada:** video embebido (EMBED, no descarga) + resumen editorial (NO transcripción) + H2/H3 + blockquote + CTA sutil al catálogo
- [ ] **Artículo #1** — primer video curado con la estructura del template
- [ ] **Calendario editorial** — 1 entrada semanal para mantener dwell time y frescura de contenido
- [ ] **Keywords cola larga target:** "cómo soplar rapé noche", "significado ceniza Tisunú", "diferencia medicina Acre tabaco", "dosis rapé primera vez"

---

## 🔍 SEO — Gaps vs Arquitectura SEO Transnacional

> Fuente: [`.atl/arquitectura-seo-extraccion-completa.md`](.atl/arquitectura-seo-extraccion-completa.md)

### 🔴 Alto Impacto (Semana 1-3)
- [x] **Precio/g visible en PDP** — `$3.500 COP/g` como elemento principal en `PricingTable.astro:78` + copy "20 gramos por el precio que otros cobran por 10" en TODAS las PDPs
- [ ] **Crear `/es/que-es-el-rape/`** — página informacional (qué es, para qué sirve, efectos)
- [ ] **Crear `/es/como-usar-el-rape/`** — página informacional (cómo aplicar, kuripe, ceremonial)
- [ ] **Crear `/es/rape-do-acre-origen/`** — página informacional (Brasil vs Colombia, empaque vacío)
- [ ] **Categoría Kuripe + 2 productos** — `/es/tienda/kuripe/`, kuripe-clasico, kuripe-doble
- [x] **URLs: decidir `/catalogo/` vs `/tienda/`** — ✅ YA MIGRADO. Código usa `/tienda/` en todos los componentes. Solo quedan 7 redirects legacy en `astro.config.mjs`.

### 🟡 Medio Impacto (Semana 3 - Mes 2)
- [ ] **hreflang cruzados** — activar en Layout para todas las páginas indexadas (CO ↔ EN ↔ BR)
- [ ] **Hub EN** — `/en/` con catálogo completo en inglés (7 productos + wholesale)
- [ ] **Hub BR** — adquirir `octavofogo.com.br` + `/loja/` en portugués
- [ ] **Landing B2B** — corregir keywords (8 del doc) + H1 recomendado
- [ ] **Meta descriptions** — verificar que todas las páginas usan las del doc (con precio $3.500/g)

### 🟢 Bajo Esfuerzo / Mes 3+
- [ ] **Blog** — 10 keywords cola larga ya definidas, 1 artículo semanal
- [ ] **Directivas SEO verify** — auditar robots/hreflang/sitemap en todas las páginas actuales
- [ ] **Login mayoristas** — `/es/mayoristas/portal/` (privado, noindex)

---

## 🧪 Fase 5 — Testing & Polish

- [ ] Test responsive (mobile-first)
- [ ] Test i18n (ES/EN/PT) — todas las páginas
- [ ] Test carrito (persistencia localStorage)
- [ ] Test checkout flow completo
- [ ] Test WhatsApp links
- [ ] Error boundaries
- [ ] Loading states
- [ ] Accesibilidad WCAG AA
- [ ] Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- [ ] **Microsoft Clarity** — heatmaps, session recordings, rage clicks (gratis)

---

## 🚀 Fase 6 — Lanzamiento

### Pre-lanzamiento
- [ ] Dominio www.octavofuego.com propagado
- [ ] SSL funcionando
- [ ] Analytics configurado
- [ ] Imágenes reales de productos
- [ ] Copy final revisado

### Post-lanzamiento
- [ ] Campaña redes sociales
- [ ] Prospección B2B (tiendas, terapeutas)
- [ ] Email marketing setup
- [ ] Sistema de reseñas
- [ ] Blog semanal

---

## 🏗️ Fase 7 — Arquitectura Progresiva (del MVP al Manifiesto)

> **Principio rector:** El manifiesto (`ARCHITECTURE.md`) es el plano del edificio de 20 pisos — referencia arquitectónica a largo plazo, NO lista de tareas para el sprint actual. Shippear rápido > elegancia técnica sin facturación.

```
[MVP de Acero] ──➔ [Centralización] ──➔ [Escala Élite]
   semanas              meses                 trimestres
```

### 7.1 MVP de Acero 🚀 (salida en semanas)
> **Stack:** Astro SSG (`output: 'static'`) + JSON estático + WhatsApp checkout
> **Objetivo:** Facturar. Validar demanda en Colombia y Brasil.

- [x] Astro 6.1.3 con 3 locales (ES/EN/PT)
- [x] 5 productos con precios COP + precio/g visible
- [x] WhatsApp Commerce integrado (FloatingWhatsApp global + WhatsAppButton en PDP)
- [x] Schemas JSON-LD (100% cobertura)
- [x] SEO on-page (hreflang, sitemap, OG, structured data)
- [x] Mobile-First 28/29 fixes (4 commits, falta `clamp()` en headings)
- [ ] **Página "Nosotros"** — historia, sourcing de comunidades (Yawanawá, Nukini, Kaxinawá, Shanenawa), misión, equipo
- [ ] **Google Search Console** + verificar indexación de 34 páginas
- [ ] **Google Looker Studio** — dashboard consolidado (Search Console + GA4)
- [ ] **Microsoft Clarity** — heatmaps, session recordings (gratis)
- [ ] Subcarpetas `/es/` y `/pt/` sembrando autoridad desde día 1

#### Optimización Mobile-First 📱 (condición de salida a producción)
> 70%+ del tráfico en Colombia es mobile. Patrones extraídos del SDD explore de dashboardplan (optimizado para iPhone/iPad).

##### 🔴 Críticos (bugs iOS/Safari) — ✅ 3/3 completados
- [x] **Anti-zoom en inputs** — `text-base md:text-sm` en todos los form fields
- [x] **Hamburger Sheet navigation ≤768px** — vanilla JS toggle + `transform: translateX()`, body scroll lock, locale-aware links
- [x] **Eliminar 300ms tap delay** — `touch-action: manipulation` en global.css

##### 🟡 UX Mobile-First — ✅ 9/10 completados
- [x] **Snap-scroll horizontal en product cards** — `flex overflow-x-auto snap-x md:grid md:grid-cols-N` en tienda + PDP
- [x] **Touch targets ≥44px** — iconos footer, qty buttons, nav links, cart, QuickViewModal, social icons
- [x] **Headers stacking** — `flex-col sm:flex-row` en action bars + QuickReferenceTable + IntensityProfile
- [x] **Modales full-width mobile** — `<dialog>` nativo con `w-full sm:max-w-lg sm:rounded-lg`
- [x] **PricingTable responsive** — `grid-cols-2 sm:grid-cols-3` con collapse progresivo
- [x] **Hero + Trust Badges** — `text-base sm:text-lg` en ≤375px
- [x] **Footer responsive** — 4→2→1 columnas (ya estaba)
- [x] **Carrito drawer** — CSS optimizado, componente futuro-gated (SDD Fix #23)
- [ ] **Tipografía responsive con `clamp()`** — reemplazar `text-5xl md:text-6xl` por `clamp()` en headings. ~5 líneas.
- [x] **Breakpoint detection CSS-first** — `data-breakpoint` en `<html>` via inline script

| # | Tarea | Prioridad |
|---|-------|-----------|
| 📱 | **Test WhatsApp checkout end-to-end** — producto, cantidades, precio en iPhone + Android real | 🔴 Alta |
| 📱 | **Velocidad en 3G colombiano** — medir con throttling (DevTools), 70%+ tráfico no es 5G | 🟡 Media |
| 🎨 | **Footer icons mobile** — revertir `w-11 h-11` → `w-7 h-7` (íconos se ven muy grandes) | 🟡 Media |

### 7.2 Centralización Automatizada 🤖 (cuando WhatsApp colapse)
> **Stack:** Monodominio `octavofuego.com` + Medusa Cloud (Railway/Hosted) + Astro SSR
> **Objetivo:** Automatizar pagos B2C en CO y BR desde un solo sitio.

- [ ] **Medusa Core:** Montar 1 instancia MedusaJS v2 (managed — no sufrir con Linux)
- [ ] **SSR Migration:** Migrar Astro a `output: 'server'` + `adapter: node({ mode: 'standalone' })`
- [ ] **Inventario real:** Stock control en Medusa
- [ ] **Cache:** `stale-while-revalidate` en páginas de catálogo

#### Monorepo Setup
- [ ] Setup `pnpm workspaces` — `pnpm-workspace.yaml` (`apps/*`, `packages/*`)
- [ ] Crear `apps/colombia` — migrar proyecto actual
- [ ] Crear `apps/brasil` — desde template Astro SSR
- [ ] Crear `packages/core` — componentes UI, stores y librerías compartidas
- [ ] Deploy MedusaJS v2 backend (`api.octavofuego.com`)

#### Carrito + API Routes
- [ ] Nano Stores cart (`packages/core/src/stores/cart.ts`) — `cartStore` atom
- [ ] `initCart()` con cookies — `packages/core/src/lib/cart.ts`
- [ ] Leer y persistir `cart_id` cookie en `Layout.astro` (HttpOnly, secure)
- [ ] Aislamiento de carritos por dominio (`PUBLIC_MEDUSA_REGION_ID`)
- [ ] `POST /api/cart/add` — proxy a Medusa (variant_id + quantity)
- [ ] `DELETE /api/cart/remove` — proxy a Medusa (line_id)

#### Checkout + Pasarelas Regionales
- [ ] `POST /api/checkout/create-payment` — Payment Collections Medusa v2
- [ ] `POST /api/checkout/complete` — `cart.complete()` → order
- [ ] `POST /api/webhooks/stripe` — Pix/Boleto asíncrono (Brasil)
- [ ] Variables de entorno por dominio: CO → `wompi`, BR → `stripe`
- [ ] Wompi CO + Stripe BR (mismo dominio, region_id condicional)

### 7.3 Escala Élite 🌎 (cuando Brasil justifique inversión)
> **Stack:** Monorepo dual-domain + `.com.br` + B2B automatizado
> **Objetivo:** Identidad local agresiva en Brasil. Mayoristas internacionales.

#### Infraestructura Dual-Domain
- [ ] Separar en monorepo (`apps/colombia`, `apps/brasil`, `packages/core`)
- [ ] Dominio `octavofogo.com.br` → producción local BRL
- [ ] Hreflang cross-domain (CO ↔ BR)
- [ ] **GitHub Actions:** `.github/workflows/check-builds.yml` — validar ambos apps
- [ ] **Vercel Proyecto 1 (Colombia):** Root `apps/colombia`, dominio `octavofuego.com`
- [ ] **Vercel Proyecto 2 (Brasil):** Root `apps/brasil`, dominio `octavofogo.com.br`
- [ ] Servidor MedusaJS v2 desplegado (`api.octavofuego.com`)

#### Cross-Domain SEO
- [ ] Hreflang cross-domain dinámicos: `es-CO` ↔ `pt-BR` ↔ `en` (x-default)
- [ ] Rutas unificadas: `/p/[product-slug]` en ambos dominios
- [ ] Redirecciones 301: `octavofuego.com.co` → `octavofuego.com`, `octavofogo.com` → `octavofogo.com.br`
- [ ] Adquirir dominios: `octavofogo.com.br`, `octavofuego.com.co`
- [ ] Configurar DNS para apuntar a Vercel

#### B2B Automatizado
- [ ] `POST /api/auth/login` — cookie segura con `medusa_token` (HttpOnly)
- [ ] `POST /api/b2b/register` — metadata `tax_id`, `company_name`, `b2b_status: pending`
- [ ] Webhook de notificación al admin en registro B2B
- [ ] Portal `/mayorista/estado.astro` — pending / approved / rejected
- [ ] Precios mayoristas desbloqueados por grupo de cliente en Medusa
- [ ] Pasarelas locales: Pix + Boleto via Stripe Brasil

> **ANTI-PATRÓN:** No activar esta fase antes de validar que el mercado BR responde al rapé. El flujo de caja real debe pagar la infraestructura.

---

## 🎨 Design System — Iconografía Completa

### Librerías de Iconos
| Librería | Uso | Notas |
|----------|-----|-------|
| **Solar Bold** | Iconos UI en secciones oscuras (footer, trust badges) | 1 capa, `currentColor` 100% |
| **Solar Bold-Duotone** | Iconos UI en secciones claras (hero, cards) | 2 capas con opacity |
| **Phosphor Fill** | Logos sociales en secciones oscuras | 1 capa, `currentColor` 100% |
| **Phosphor Duotone** | Logos sociales en secciones claras | 2 capas con opacity |
| **astro-icon** | Renderizado de iconos en Astro | Resuelve el bug SSR de `class` prop |

### Iconos Disponibles (Solar Bold - fondos oscuros)
```
Footer:         letter-bold, chat-round-bold, map-point-bold, leaf-bold
Trust Badges:   shield-bold, cloud-waterdrop-bold, leaf-bold
```

### Iconos Disponibles (Solar Bold-Duotone - fondos claros)
```
Confianza:      shield-bold-duotone, cloud-waterdrop-bold-duotone, leaf-bold-duotone
Intenciones:    eye-bold-duotone, lightning-bold-duotone, heart-bold-duotone, moon-bold-duotone
Navbar:         hamburger-menu-bold-duotone, alt-arrow-down-bold-duotone, bag-2-bold-duotone
LanguageSwitch: global-bold-duotone, alt-arrow-down-bold-duotone
Testimonials:   star-bold-duotone
```

### Iconos NO disponibles en Solar (usar Phosphor)
```
Instagram:  ph:instagram-logo-fill (oscuro) / ph:instagram-logo-duotone (claro)
Facebook:   ph:facebook-logo-fill (oscuro) / ph:facebook-logo-duotone (claro)
WhatsApp:   ph:whatsapp-logo-fill (oscuro) / ph:whatsapp-logo-duotone (claro)
```

### Errores comunes al buscar iconos en Solar
| Buscado | Error | Corrección |
|---------|-------|------------|
| `droplet-bold-duotone` | No existe | `cloud-waterdrop-bold-duotone` |
| `spark-bold-duotone` | No existe | `moon-bold-duotone` |
| `star-stars-bold-duotone` | No existe | `star-bold-duotone` |
| `bag-bold-duotone` | No existe | `bag-2-bold-duotone` |

---

## 🎨 Design System — Color Tokens (Híbrido)

### Sistema Migrado (Junio 15, 2026)
```
verde-botanico (#6d5e4d) → tabacco-base (#6d5e4d)     [rename semántico]
verde-botanico          → color-action-primary         [functional token]

tokens funcionales disponibles:
- --tabaco-base: #6d5e4d
- --color-action-primary: var(--tabaco-base)
- --color-action-hover: #5a4d3f
- --color-action-subtle: #C4956A
- --color-surface-base: #ffffff
- --color-surface-warm: #F2EFE8
- --color-surface-dark: #2A2A2A
- --color-text-primary: #1C1410
- --color-text-secondary: #8C8680
- --color-text-on-dark: #F2EFE8
- --color-footer-bg: #3D2E22        ← Fondo footer + secciones oscuras
```

### Dark Sections (Junio 15, 2026)
| Sección | Token | Hex | Iconos |
|---------|-------|-----|--------|
| Footer | `--color-footer-bg` | `#3D2E22` | sólidos white |
| Trust Badges | `--color-action-hover` | `#5a4d3f` | sólidos white |

### Migration Path
1. ✅ `--verde-botanico` → `--tabaco-base` (rename semántico)
2. ✅ Alias `--verde-botanico: var(--tabaco-base)` (0 breaking changes)
3. ⏳ Post-launch: find-replace `--verde-botanico` → `--color-action-primary` en componentes
4. ⏳ Post-launch: eliminar alias deprecated

---

## 📉 Deuda Técnica Diferida (Q18-Q38)

> Engram: `sdd/octavo-fuego/deuda-diferida` (obs #1238)

### 🔴 Alta Prioridad (agregar al próximo sprint)

- [ ] **Q18 — Pricing Engine (9 precios)** — `#1144` Service que centralice 3 presentaciones × 3 monedas. Sin esto no hay cálculos de orden reales.
- [ ] **Q31-34 — ProductForm + OrderForm React** — `#1149` `#1150` Formularios de creación/edición de productos y órdenes. Services listos (F7-F8), falta UI.
- [x] **Q15 — Audit triggers + conectar timeline** — `#1143` ✅ Event bus (F12) + EventTimeline (F27) creados.

### 🟡 Media Prioridad

- [ ] **Q5 — GitHub Actions CI** — `#1140` Workflow typecheck + build en PRs.
- [ ] **Q7-Q23 — Deploy hook + rebuild desde admin** — `#1140` `#1145` Botón "Publicar cambios" que gatille rebuild en Vercel.
- [x] **Q8-Q10 — Zod + SupabaseService base** — `#1141` ✅ Completado en SDD F1-F3.
- [ ] **Q28 — Alertas stock bajo en sidebar** — `#1147` Badge con count de productos con stock crítico.
- [ ] **Q16 — Tabla categorías en DB** — `#1143` Hoy hardcodeado, migrar a tabla relacional.
- [ ] **Q36 — Typed API Client (fetch+Zod)** — `#1151` Wrapper tipado sobre fetch.

### 🟢 Baja Prioridad (post-MVP)

- [ ] **Q37-Q38 — Testing (vitest + setup)** — `#1152` Configurar vitest, tests de PricingService y schemas.
- [ ] **Q20 — Tasa de cambio automática** — `#1144` API externa vs fija manual.
- [ ] **Q22 — Supabase Storage para imágenes** — `#1145` Hoy URLs externas, migrar a Storage.
- [ ] **Q24 — Integración Bold/Wompi/Pix real** — `#1146` Hoy link de pago manual.
- [ ] **Q33 — Delete suave (activo=false)** — `#1149` Hoy hard delete.

### 🔗 Referencias Engram

| Artifact | Obs ID | Descripción |
|----------|--------|-------------|
| Pricing Engine SDD | #1144 | Spec + design + tasks |
| Product Pages SDD | #1149 | ProductForm + tabla real |
| Orders+Customers SDD | #1150 | OrderForm + timeline |
| DB Schema II SDD | #1143 | Audit triggers + categorías |
| Infraestructura SDD | #1140 | CI/CD + deploy hooks |
| Foundation Core SDD | #1141 | Zod + errors + service base |
| Inventory Service SDD | #1147 | Alertas + stock bajo |
| API Client SDD | #1151 | Fetch+Zod wrapper |
| Testing SDD | #1152 | Vitest setup |
| 38 Preguntas Originales | #1134 | Decisiones pendientes originales |

---

## 🐛 Judgment Day — Postergados Completos (v0.9.0+)

> Issues identificados por JD que no bloquean el funcionamiento actual.

### 🔴 Postergados CRÍTICOS
| # | Issue | Archivo | Cuándo revisar |
|---|-------|---------|----------------|
| 1 | N+1 queries en contabilidad/service.ts | `contabilidad.ts`, `service.ts` | Cuando haya +100 transacciones |
| 2 | KpiCard color class no se aplica | `KpiCard.astro:29` | Cuando contabilidad tenga data real |
| 3 | NotificationDropdown circular import | `NotificationDropdown.astro` | Cuando se implementen notificaciones reales |

### 🟠 Postergados HIGH
| # | Issue | Archivo | Cuándo revisar |
|---|-------|---------|----------------|
| 4 | Stats hardcodeadas en órdenes page | `ordenes/index.astro:41-54` | Cuando haya órdenes reales |
| 5 | Configuración mock save | `configuracion/index.astro` | Cuando haya settings que persistir |
| 6 | Legacy SHA-256 token path | `middleware/auth.ts` | Cuando haya multi-rol |
| 7 | `base.ts` CUD inconsistency | `base.ts:90,106,120` | Cuando se implementen tests |

### 🟡 Postergados MEDIUM
| # | Issue | Archivo | Cuándo revisar |
|---|-------|---------|----------------|
| 8 | Resize listener leak en Layout | `Layout.astro:93-104` | Cuando se reporten issues de performance |
| 9 | EventTimeline path mismatch | `EventTimeline.astro` | Refactor general |
| 10 | CartStore React island redundante | `carrito/index.astro` | Post-lanzamiento |
| 11 | Imágenes placeholder compartidas | `data/products.ts` | Cuando se tengan fotos reales |
| 12 | sitemap `lastmod` artificial | `astro.config.mjs` | Cuando haya contenido indexable |

---

### ✅ E2 — UI/UX A11y (implementado Julio 3)
> 3 PRs, ~750 líneas en `chore/e2-ui-ux-a11y`
- PR1: Focus trap en CartDrawer + modales admin (ConfirmDialog, SlidePanel)
- PR2: Keyboard nav en LanguageSwitcher + Navbar dropdowns (Tab, Enter, Space, Arrow)
- PR3: Form a11y en CheckoutForm (htmlFor/id, aria-describedby, aria-live, radiogroup)

### ✅ PaymentBanner — Iconos de pago (Julio 3)
- 34 SVGs: 17 métodos × 2 variantes (dark=blanco para footer, light=color para checkout)
- Fuentes: Bold CDN (10), simpleicons (MP, Pix), Wikimedia (Stripe), seeklogo (Diners, Efecty), custom (Codensa, Boleto)
- Componente `PaymentBanner.astro` locale-aware, integrado en footer + checkout
- Stripe badge aparte como "secured by"

### 🟡 E5 — Checkout & Payment Architecture (Proposal, Julio 3)
> `sdd/e5-checkout-payment/proposal` (#1833)
- **Arquitectura:** PaymentProvider interface + mapeo locale→provider
- **Fase 1 (urgente):** WhatsApp Provider — guardar orden antes de confirmar, copy honesto, clearCart() post-orden
- **Fase 2 (espera legal):** Bold Provider (CO)
- **Fase 3 (espera legal):** Stripe Provider (BR Pix/Boleto + Intl card)
- **Fase 4 (opcional):** Mercado Pago (CO+BR)
*Última actualización: Julio 3, 2026*
