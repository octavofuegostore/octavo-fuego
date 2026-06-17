# Tareas Pendientes — Octavo Fuego

---

## 🔍 PRUEBA MANUAL PENDIENTE — TODO JUNTO

> Ejecutar: `npm run dev` → http://localhost:4321/admin → hacer login → probar todo.

### Auth & Login
- [ ] Login con credenciales correctas → entra al admin
- [ ] Login con credenciales incorrectas → muestra error
- [ ] Logout → redirige a login
- [ ] Acceso a `/admin` sin cookie → redirige a login

### Dashboard Principal (`/admin`)
- [ ] KPI cards muestran números
- [ ] Selector de período (Mes / Trimestre / Año) cambia los datos
- [ ] `GraficaLíneas` — tendencia de ingresos se renderiza
- [ ] `GraficaTorta` — órdenes por estado (Pendiente/Enviado/Entregado)
- [ ] `GraficaBarrasH` — top 5 productos con valores COP
- [ ] Cambiar período → los 3 gráficos se actualizan

### Órdenes (`/admin/ordenes`)
- [ ] Tabla renderiza órdenes mock
- [ ] Búsqueda filtra por nombre/email
- [ ] Filtro "Estado" (Todos/Pendiente/etc) cambia resultados
- [ ] Filtro "Canal" (Todos/Web/WhatsApp/Tienda) cambia resultados
- [ ] Filtro "Ubicación" (Todos/CO/BR/US/EU) cambia resultados
- [ ] Paginación: Anterior / Siguiente / número de página
- [ ] Click en "Ver" → navega a `/admin/ordenes/[id]`
- [ ] Click en "Confirmar" → toast + refreshTrigger actualiza la tabla
- [ ] Click en "Enviar" → toast + refreshTrigger actualiza la tabla
- [ ] Botón "Nueva Orden" → abre modal/formulario

### Clientes (`/admin/clientes`)
- [ ] Tabla renderiza clientes mock
- [ ] Búsqueda filtra por nombre/email
- [ ] Filtro "Ubicación" cambia resultados
- [ ] Filtro "Tipo" (Todos/Minorista/Mayorista) cambia resultados
- [ ] Paginación funciona
- [ ] Click en "Ver" → navega a `/admin/clientes/[id]`
- [ ] Click en "Editar" → abre modal con datos precargados
- [ ] Botón "Nuevo Cliente" → abre formulario vacío

### Inventario (`/admin/inventario`)
- [ ] Tabla renderiza productos mock
- [ ] Búsqueda filtra por nombre/categoría
- [ ] Filtro "Categoría" cambia resultados
- [ ] Filtro "Estado" (Todos/Activo/Agotado) cambia resultados
- [ ] Badges de stock: verde (>10), amarillo (1-10), rojo (0)
- [ ] Paginación funciona
- [ ] Botón "Nuevo Producto" → abre formulario

### Contabilidad (`/admin/contabilidad`)
- [ ] KPI cards muestran (Ingresos Totales, Egresos Totales, Ganancia Neta)
- [ ] `GraficaBarras` — barras ingreso/egreso por mes
- [ ] Selector de mes/año cambia los datos de la gráfica
- [ ] `GraficaTorta` — egresos por categoría (Materia Prima, Envíos, Marketing, Empaque)

### Transacciones (`/admin/contabilidad/transacciones`)
- [ ] Tabla de transacciones renderiza
- [ ] Búsqueda filtra
- [ ] Filtros (tipo, estado) funcionan
- [ ] Paginación funciona
- [ ] Botones de acciones (ver/editar) funcionan

### Informes (`/admin/contabilidad/informes`)
- [ ] Tabs Mensual / Anual funcionan
- [ ] Selector de período cambia datos
- [ ] `GraficaLíneas` — tendencia anual se renderiza
- [ ] Botón "Generar Informe" → genera PDF/CSV (mock)
- [ ] Botón "Exportar" → descarga archivo

### Sidebar & Navegación
- [ ] Sidebar muestra todas las secciones
- [ ] Submenu de Contabilidad se expande/colapsa
- [ ] Items activos tienen estilo visual
- [ ] Navegación entre secciones funciona sin recargar página

### Toasts & Notificaciones
- [ ] Al confirmar/enviar orden → toast aparece
- [ ] Al guardar cliente → toast aparece
- [ ] Al guardar producto → toast aparece

### Responsive (Mobile)
- [ ] Sidebar colapsable en móvil
- [ ] Tablas scroll horizontal en móvil
- [ ] Gráficos se adaptan al ancho

---

## ✅ COMPLETADO HOY — 17 Junio 2026

### ✅ React Islands Migration — Slices 1-3 (17 Junio 2026)

> **Engram**: `sdd/react-islands/*` (#619, #620, #621)
> **Commits**: `b9f105a` (Slice 1), `dc0aec2` (Slices 2-3)

- [x] **Slice 1**: OrderTable React island — search + 3 filtros + paginación + confirm/ship
- [x] **Slice 2**: CustomerTable React island — search + location/type filters + paginación
- [x] **Slice 3**: ProductTable React island — search + category/status + stock badges
- [x] `src/stores/adminStore.ts` — nanostores atoms
- [x] `src/components/ui/table.tsx` — shadcn-style Table primitives

### ✅ Admin Dashboard Charts (17 Junio 2026)

> **Engram**: `sdd/admin-dashboard-charts/*` (#629, #630)
> **Commit**: `bddbb0c`

- [x] `src/components/admin/charts/GraficaTorta.astro` — donut chart con leyenda y COP
- [x] `src/components/admin/charts/GraficaBarrasH.astro` — barras horizontales, labels truncadas
- [x] `src/lib/admin/dashboard/mockCharts.ts` — mock data para mes/trimestre/año
- [x] `/admin` — selector período + 3 gráficos (Línea + Torta + BarrasH)
- [x] `/admin/contabilidad` — GraficaTorta para egresos por categoría

### ✅ Architecture Refactors (17 Junio 2026)

> **Commit**: `638c452`

- [x] DRY: `src/lib/admin/formatters.ts` — `formatPrice()`, `formatDate()` shared
- [x] DRY: `src/lib/admin/usePagination.ts` — `getPageNumbers()` (antes duplicado 3x)
- [x] Tipo: `CartItem` unificado — `stores/cartStore.ts` → `lib/cart/types`
- [x] Deps: `phosphor-react` removido, `shadcn` → devDependencies
- [x] Estructura: `.atl/` unificado en raíz

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
| React Islands archive | `sdd/react-islands/archive-report` |
| Admin Dashboard Charts proposal | `sdd/admin-dashboard-charts/proposal` (#629) |
| Admin Dashboard Charts spec | `sdd/admin-dashboard-charts/spec` (#630) |
| Admin Dashboard Charts archive | `sdd/admin-dashboard-charts/archive-report` (#634) |
| Architecture audit | `architecture-audit-octavo-fuego` (ses_129ffbabbffe) |
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
