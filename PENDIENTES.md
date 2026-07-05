# Octavo Fuego — Pendientes / Estado del Proyecto

> Proyecto: Ecommerce de Medicinas Ancestrales
> Stack: Astro 6 + TailwindCSS 4 + shadcn/ui + Nanostores
> URL: www.octavofuego.com (Vercel)
> Branches: `main` (prod) ← `develop` (wip)

---

## 📊 Estado General

| Fase | Progreso | Status |
|------|----------|--------|
| 01 Estrategia | ██████████ 100% | ✅ Completado |
| 02 Diseño | ██████████ 100% | ✅ Completado |
| 03 Desarrollo (Core) | ██████████ 100% | ✅ Completado (v0.13.0 + JD) |
| 04 Marketing/SEO | ██████████ 100% | ✅ Completado (v0.12.0) |
| 05 Testing & Polish | ████████░░ 80% | 🔄 En progreso |
| 06 Lanzamiento | ██████████ 100% | ✅ Completado |
| 07 Monorepo + Medusa | █░░░░░░░░░ 0% | ⏳ Planificado |

---

## 🔴 Pasarelas de Pago — Pendiente Legal

- [ ] **T4.1 WhatsApp Provider**: guardar orden, copy honesto, clearCart() post-orden
- [ ] **T4.2 Bold Provider**: redirect + webhook (CO) — espera aprobación legal
- [ ] **T4.3 Stripe Provider**: Pix/Boleto (BR), card (INT) — espera aprobación legal
- [ ] **T4.4 Mercado Pago (CO+BR)**: opcional

---

## 🔴 Admin — Mock Data (CR-01, CR-02, CR-03)

- [ ] **CR-01: CustomerDetail ignora el ID** — datos hardcodeados, no usa `getClienteById()`
- [ ] **CR-02: OrderDetail ignora el ID** — datos hardcodeados, botones no modifican datos
- [ ] **CR-03: Mock data es de otro negocio** — contiene "Cera de Ducha", "Sabonete", etc. (24 productos vs 5 reales)

### 🟡 Admin — Warnings

- [ ] **W-04: Dashboard period selector no actualiza datos** — charts con datos estáticos
- [ ] **W-05: Supabase placeholder keys** — credenciales faltantes solo dan console.warn
- [ ] **W-06: Credenciales auth hardcodeadas** — email/password en source code
- [ ] **W-07: AdminLayout elementos decorativos** — search bar sin funcionalidad, badge "3" hardcodeado
- [ ] **W-08: Iniciales de usuario hardcodeadas** — "JD" en vez del usuario autenticado

### 🟢 Admin — Sugerencias

- [ ] **S-09: Sidebar usa SVG inline en vez de astro-icon** — inconsistente con tienda pública
- [ ] **S-10: Tipo Producto incluye categorías ajenas** — "Cera de Ducha/Sabonete" del mock data viejo
- [ ] **S-11: Tipo Cliente incluye regiones no operadas** — 'EU' y 'US' en tipos

---

## 🟡 SEO + Assets — Pendientes

- [ ] **og:image JPG real**: Reemplazar SVG temporal con JPG 1200×630 con foto de producto
- [ ] **Google Search Console**: Verificar propiedad en search.google.com
- [ ] **CrUX field data**: Revisar cuando haya tráfico real (~28 días)
- [ ] **Reviews Schema UGC**: Conectar a sistema de reseñas real cuando exista

---

## 🟢 Infraestructura

- [ ] **@astrojs/vercel i18n routing bug**: v10 no genera rutas root para [locale] dinámicos con `prefixDefaultLocale:false`. Fix actual: redirects manuales (PR #51). Evaluar si v11 lo resuelve.
- [ ] **Product page 404 en dev/preview server**: Las rutas `/tienda/rape/[slug]` funcionan en producción pero no en dev server. Bug de Astro 6.1.3.
- [ ] **Monorepo + Medusa Server**: Fase 7 del roadmap. Pendiente de planificar.

---

## 📋 Judgment Day — Postergados (v0.9.0+)

> Issues que no bloquean el funcionamiento actual. Revisar cuando haya data real y múltiples usuarios.

| # | Issue | Archivo | Cuándo revisar |
|---|-------|---------|----------------|
| 1 | N+1 queries en contabilidad (tablas vacías) | `contabilidad.ts`, `service.ts` | Cuando haya +100 transacciones |
| 2 | KpiCard color class no se aplica | `KpiCard.astro:29` | Cuando contabilidad tenga data real |
| 3 | NotificationDropdown circular import | `NotificationDropdown.astro` | Cuando se implementen notificaciones reales |
| 4 | Stats hardcodeadas en órdenes page | `ordenes/index.astro:41-54` | Cuando haya órdenes reales |
| 5 | Configuración mock save | `configuracion/index.astro` | Cuando haya settings que persistir |
| 6 | Legacy SHA-256 token path | `middleware/auth.ts` | Cuando haya multi-rol |
| 7 | `base.ts` CUD inconsistency | `base.ts:90,106,120` | Cuando se implementen tests |
| 8 | Resize listener leak en Layout | `Layout.astro:93-104` | Cuando se reporten issues de performance |
| 9 | EventTimeline path mismatch | `EventTimeline.astro` | Refactor general |
| 10 | CartStore React island redundante | `carrito/index.astro` | Post-lanzamiento |
| 11 | Imágenes placeholder compartidas | `data/products.ts` | Cuando se tengan fotos de producto |
| 12 | sitemap `lastmod` artificial | `astro.config.mjs` | Cuando haya contenido indexable |
| 13 | Ruta duplicada `pages/tienda/rape/[product].astro` | `pages/tienda/rape/` | Puede romper build con actualizaciones de Astro |
| 14 | Escape key listener stacking en View Transitions | `ReviewModal.astro` | Baja prioridad |
| 15 | Focus trap modal reseñas | `ReviewModal.astro` | Mejora WCAG, no blocker |
| 16 | Meta descriptions USD/BRL vs precios COP | `data/products.ts` | Decisión multi-mercado |
| 17 | og:image JPG real | `public/images/` | Temporal SVG. Reemplazar con asset gráfico. |
| 18 | Home text SEO — redacción definitiva | `HomeContent.astro` | Owner debe dar tono de marca final |
| 19 | Verificar SVGs payment icons en Vercel | `public/images/payment/` | Falso positivo de Lighthouse, verificado en local OK |
