# Tareas Pendientes — Octavo Fuego

---

## ✅ COMPLETADO: Admin Auth System (17 Junio 2026)

> **Engram**: `sdd/admin-auth-system/*`
> **Commit**: `f88b6b0` (develop)

- [x] SHA-256 auth library (`src/lib/auth.ts`) — constant-time comparison
- [x] Middleware entry point (`src/middleware.ts`)
- [x] Auth middleware (`src/middleware/auth.ts`) — locale redirect + cookie verification
- [x] API login endpoint (`POST /api/auth/login`) — 200 JSON + cookie
- [x] API logout endpoint (`GET /api/auth/logout`) — clear cookie
- [x] Login page (`login.astro`) — fetch-based form with loading/error states
- [x] AdminLayout logout button ("Cerrar Sesión")
- [x] Vercel adapter (`@astrojs/vercel`) for hybrid mode
- [x] `prerender = false` on all admin pages
- [x] Credentials: `admin@octavofuego.com` / `octavo2026`

---

## ✅ COMPLETADO: Bugfix — Login Redirect Loop (17 Junio 2026)

> **Engram**: `bugfix/login-redirect-loop`

### Root causes (3)
- [x] Login API devolvía 302 redirect — incompatible con `fetch({ redirect: 'manual' })`. Fix: `200 { success: true }` + redirect en JS
- [x] Middleware regex solo `(en|pt)` — `/es/admin` no matcheaba → 404. Fix: `(es|en|pt)`
- [x] Prerendered pages sin headers — `request.headers` vacío, cookies siempre `undefined`. Fix: `prerender = false` en 9 admin pages

---

## ✅ COMPLETADO: Contabilidad UI Module — Phase 1: Foundation (17 Junio 2026)

> **Engram**: `sdd/contabilidad-ui-module/*`

- [x] `src/lib/admin/contabilidad/mock.ts` — Transaccion interface + 7 mock items + graph data
- [x] `src/components/admin/contabilidad/KpiCard.astro` — KPI card with trend arrows
- [x] `src/components/admin/contabilidad/PaginationControls.astro` — Pagination with numbering

## ✅ COMPLETADO: Contabilidad UI Module — Phase 2: SVG Charts (17 Junio 2026)

- [x] `src/components/admin/contabilidad/GraficaBarras.astro` — Bar chart (ingreso/egreso), Y-axis grid, legend, responsive
- [x] `src/components/admin/contabilidad/GraficaLíneas.astro` — Line chart, polyline + circles, area fill, configurable colors

## ✅ COMPLETADO: Contabilidad UI Module — Phase 3: Composed Components (17 Junio 2026)

- [x] `src/components/admin/contabilidad/TransaccionTable.astro` — Search, filters, type badges, action buttons
- [x] `src/components/admin/contabilidad/InformesTabs.astro` — Mensual/Anual tabs, KpiCards + charts + table

## ✅ COMPLETADO: Contabilidad UI Module — Phase 4: Pages + Sidebar (17 Junio 2026)

- [x] `src/pages/admin/contabilidad/index.astro` — Dashboard with 3 KpiCards + bar chart
- [x] `src/pages/admin/contabilidad/transacciones.astro` — Transaction table + pagination
- [x] `src/pages/admin/contabilidad/informes.astro` — InformesTabs with all data
- [x] `src/layouts/AdminLayout.astro` — Contabilidad sidebar with collapsible submenu + JS toggle

---

## ✅ COMPLETADO: Admin UI Wiring — admin-ui-complete (17 Junio 2026)

> **Engram**: `sdd/admin-ui-complete/*` (#610, #611, #613)
> **Status**: ✅ Complete (39/39 tasks, build 0 errors)

- [x] `contabilidad/index.astro` — mes/año selectors + CSV export wired
- [x] `contabilidad/transacciones.astro` — filters, pagination, CRUD modal (rewrite)
- [x] `contabilidad/informes.astro` — date selectors, Generar button, PDF/CSV export (rewrite)
- [x] `inventario/index.astro` — ProductForm modal wired

---

## 📋 PENDIENTES — Master Plan 4 Fases

> **Nota**: Para una guía completa de documentos, ver [docs/INDEX.md](docs/INDEX.md).

### 🏗️ Foundation Phase 0 (NEXT — Fase 0 de 4)

> **Engram**: `sdd/admin-foundation-phase-0/proposal` (#617)

- [x] Unificar `.atl/` — consolidar en raíz del repo (hoy hay 2 directorios separados) ✅ (Jun 17, 2026)
- [ ] Crear `src/types/admin.ts` — interfaces: Cliente, Orden, Producto, Transaccion, KPI
- [ ] Crear `src/lib/admin/service.ts` — service layer con funciones tipadas (mock today, Supabase tomorrow)
- [ ] Refactor 9 páginas admin: `await service.getX()` en vez de arrays inline

### ⚛️ React Islands Migration (Fase 2 de 4 — Slice 1-3 completados ✅)

> **Engram**: `sdd/react-islands/*`, `sdd/react-islands-slice-3/*`

- [x] **Slice 1**: OrderTable React island (search + 3 filtros + paginación)
- [x] **Slice 2**: CustomerTable React island (search + location/type filters)
- [x] **Slice 3**: ProductTable React island (search + category/status + stock badges)
- [ ] **Slice 4**: contabilidad/informes.astro → React island
- [ ] **Slice 5**: contabilidad/transacciones.astro → React island  
- [ ] Forms create/edit → React islands (validación con Zod)
- [ ] ConfirmDialog delete → React island
- [ ] Date selectors → React island
- [ ] Mantener vanilla JS para: toggle switches, tab switching, tooltips

### ⚙️ Admin Panel — Mejoras restantes

- [ ] Mobile responsive sidebar (hamburger menu)
- [ ] Dark mode para admin pages
- [ ] Toast notifications (sonner) para todas las páginas admin
- [ ] Loading states / skeletons para todas las páginas
- [ ] Fotos/imágenes en productos

### 🗄️ Backend Integration (Fase 4 — Supabase)

> Depende de Foundation Phase 0. Service layer → Supabase real.

- [ ] Dashboard con datos reales de Supabase (vía service layer)
- [ ] CRUD de clientes conectado a Supabase
- [ ] CRUD de inventario/productos
- [ ] Gestión de órdenes (crear, editar, cambiar estado)

### 🛒 E-commerce Público (Fase 3 de 4)

- [ ] Conectar checkout a Supabase (crear pedido antes de redirigir a Bold)
- [ ] Página de confirmación post-compra
- [ ] Webhook de Bold → actualizar estado de pedido
- [ ] Email de confirmación al cliente (Brevo)
- [ ] Tracking de orden para cliente (página pública)
- [ ] Blog: implementar posts reales con MDX
- [ ] SEO: implementar hreflang con region subtags (es-CO/en-US/pt-BR)
- [ ] SEO: crear hubs EN/BR faltantes

### 💰 Contabilidad Backend (Fase 4 de 4)

> **Plan de referencia**: [contabilidad-integration-plan.md](../.atl/proposals/contabilidad-integration-plan.md)
> **Plan corto**: [contabilidad-integration.md](../.atl/proposals/contabilidad-integration.md)

**Fase 2: Supabase Integration**
- [ ] Crear tabla `cont_transaccion` en Supabase (migración SQL)
- [ ] Crear tabla `cont_categoria` con categorías de cosméticos/medicinas
- [ ] API CRUD: GET/POST/PATCH/DELETE `/api/contabilidad/transacciones`
- [ ] API KPIs: GET `/api/contabilidad/kpis`
- [ ] API gráficas: GET `/api/contabilidad/graficas`
- [ ] Reemplazar mock data por llamadas reales a Supabase (vía service layer general)

**Fase 3: Formularios React** (ver ⚛️ React Islands Migration arriba)
- [ ] Crear `TransaccionForm.tsx` (React island, Zod validation)
- [ ] Crear `EditarTransaccionModal.tsx`
- [ ] Integrar CurrencyInput para montos COP

**Fase 4: Bridge + Automatización**
- [ ] Trigger PostgreSQL: orden `entregada` → `cont_transaccion` automática
- [ ] Scheduler (pg_cron o edge function) para reportes mensuales
- [ ] Export CSV/PDF desde Informes

### 🚀 Deploy & DevOps
- [ ] Configurar Vercel deploy automático desde `main`
- [ ] Configurar dominio `octavofuego.com/admin`
- [ ] Variables de entorno en Vercel (Supabase keys)
- [ ] GitHub Actions para CI/CD

---

## 🔗 Referencia Rápida Engram

| Tema | Clave de búsqueda |
|------|------------------|
| Admin auth system | `sdd/admin-auth-system/proposal` |
| Login redirect loop fix | `bugfix/login-redirect-loop` |
| Contabilidad UI spec | `sdd/contabilidad-ui-module/spec` |
| Contabilidad UI design | `sdd/contabilidad-ui-module/design` |
| Contabilidad UI tasks | `sdd/contabilidad-ui-module/tasks` |
| Contabilidad UI apply progress | `sdd/contabilidad-ui-module/apply-progress` |
| Contabilidad integration plan | `Contabilidad Integration — SDD Proposal complete` |
| Admin UI complete (wiring) | `sdd/admin-ui-complete/proposal` (#610) |
| Admin UI tasks (39 tasks) | `sdd/admin-ui-complete/tasks` (#613) |
| Foundation Phase 0 proposal | `sdd/admin-foundation-phase-0/proposal` (#617) |
| Foundation checkpoint (mañana) | `sdd/admin-ui-complete/verify-checkpoint` (#618) |
| React Islands explore | `sdd/react-islands/explore` (#619) |
| React Islands proposal | `sdd/react-islands/proposal` (#620) |
| React Islands spec | `sdd/react-islands/spec` (#621) |
| React Islands tasks | `sdd/react-islands/tasks` |
| React Islands apply | `sdd/react-islands/apply-progress` |
| React Islands verify | `sdd/react-islands/verify-report` |
| Doc restructure (bifurcation) | `sdd/doc-restructure/proposal` (#602) |
| L-Medusa Architecture | `../.atl/l-medusa-architecture.md` |
| L-Medusa Specs | `../.atl/specs/l-medusa-complete-specs.md` |
| L-Medusa Design | `../.atl/design/l-medusa-complete-design.md` |
| Prerender fix discovery | `bugfix/login-redirect-loop` (3 root causes) |

---

## ⚠️ Notas Técnicas

### Prerender = false (CRÍTICO)
**TODAS las páginas de admin DEBEN tener `export const prerender = false`.** Si no, `request.headers` está vacío en el middleware y las cookies no se pueden leer → redirect loop.

### SVG en Astro
Los elementos SVG NO aceptan clases de Tailwind. Usar atributos inline:
- `font-size="10"` en vez de `class="text-xs"`
- `fill="#7b8084"` en vez de `class="text-ceniza"`
- `stroke="#E5E5E7"` para grid lines

### Locale Middleware
El regex de locale DEBE incluir `es`: `/^\/(es|en|pt)\/(admin|api)/`. No solo `(en|pt)`.
