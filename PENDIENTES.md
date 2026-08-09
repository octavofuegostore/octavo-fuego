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

- [x] **T4.1 WhatsApp Provider**: guardar orden, copy honesto, clearCart() post-orden
- [x] **T4.2 Bold Provider**: redirect + webhook (CO) — código listo (MockBoldAdapter default, espera aprobación legal para activar)
- [ ] **T4.3 Stripe Provider**: Pix/Boleto (BR), card (INT) — espera aprobación legal
- [ ] **T4.4 Mercado Pago (CO+BR)**: opcional

---

## ✅ COMPLETADO 12-13 Julio 2026

### ✅ CR-01/02: Admin routing bug — Links sin `/page`
> Fix: Añadido `/page` a 8 links en CustomerTableClient, OrderTableClient, pagos/[id], actividad/index, NotificationDropdown, pagos/index.astro, service.ts
> JD: Dual blind review → APPROVED por ambos jueces

### ✅ CR-03: Mock data cleanup — Datos de Pipod removidos
> 5 files modificados: ProductTableClient, ProductForm, service.ts, producto-servicio.ts, types/admin.ts
> Build: ✅ pasa

### ✅ W-04: Dashboard dinámico — API endpoint + date filters
> `GET /api/admin/dashboard?periodo=1m|3m|12m` con JWT auth + date filter en domain service
> Cliente JS: fetch reemplaza innerHTML de charts al cambiar período
> Build: ✅ pasa

### ✅ Cannibalización OF — 5 PRs completos
> **PR1**: Security headers (vercel.json) + Performance (content-visibility, fetchpriority)  
> **PR2**: llms.txt + llms-full.txt × 3 locales (es/en/pt) — 30 tests  
> **PR3**: BoldAdapter + MockBoldAdapter + factory (default: mock)  
> **PR4**: Webhook Bold HMAC + eventBus — 12 tests  
> **PR5**: Checkout Bold-first + WhatsApp fallback + i18n (15 keys × 3 locales)  
> Build: ✅ pasa en todos los PRs

### ✅ SEO Global Plan — Phase 1-2 código
> PersonJsonLd.astro + onpage-validator.ts + OrganizationJsonLd sameAs expandido  
> Blog routes expandidas a EN/PT (12 static paths) + Keystatic locale config  
> Meta titles/descriptions de 15 productos expandidos a 120-155 chars  
> Build: ✅ pasa

### ✅ Vitest setup — 33 tests
> vitest 4.1.10 + jsdom 29, 4 suites: utils, formatCurrency (13), i18n (10), cartStore (6)
> JD: APPROVED por ambos jueces

### ✅ og-image cleanup
> OgImage.astro + OGBrandedImage.astro eliminados (152 líneas de dead code)
> Default revertido a `/images/og-default.svg` (seguro, existe el archivo)
> JD: APPROVED por ambos jueces

### 🟡 Admin — Warnings (restantes)

- [ ] **W-05: Supabase placeholder keys** — credenciales faltantes solo dan console.warn
- [ ] **W-06: Credenciales auth hardcodeadas** — email/password en source code
- [ ] **W-07: AdminLayout elementos decorativos** — search bar sin funcionalidad, badge "3" hardcodeado
- [ ] **W-08: Iniciales de usuario hardcodeadas** — "JD" en vez del usuario autenticado

### 🟢 Admin — Sugerencias (restantes)

- [ ] **S-09: Sidebar usa SVG inline en vez de astro-icon** — inconsistente con tienda pública
- [ ] **S-11: Tipo Cliente incluye regiones no operadas** — 'EU' y 'US' en tipos

---

## ✅ COMPLETADO 13 Julio 2026 (Fixes post-auditorías)

### ✅ SEO Fase A — Foundation
- [x] **AI Nugget + Prove-It + Not For You** → código creado pero **REVERTido** (no gustó visual). Código guardado en SeoContentBlocks.astro para futuro tabs UI
- [x] **Fast-scan comparison table** → **REVERTIDO** a cards (se prefirió diseño anterior)
- [x] **FAQPage schema** en home + tienda (invisible, solo schema)
- [x] **Pillar page** 8k+ palabras (guia-completa-rape) con EN/PT locale-aware
- [x] **Blog drafts** 5 artículos ES + calidad seobuild
- [x] **llms.txt × 3 locales** expandidos (Products, Docs, Key Facts, Contact)
- [x] **Middleware logging** para llms.txt
- [x] **OAI-SearchBot** en robots.txt
- [x] **Schema Person** (Josué + Edison como coautores)
- [x] **Meta descriptions** 120-155 chars (tienda: 26→137, EN: 28→144, PT: 27→154)

### ✅ Security & Performance
- [x] **CSP enforce** (Report-Only → enforced, dedup _headers)
- [x] **Sitemap filter** (0 admin URLs, 97 públicas)
- [x] **OAI-SearchBot Disallow** /admin, /checkout, /carrito

### ✅ Admin Accesibilidad (3 fixes)
- [x] Search label con `<label class="sr-only">`
- [x] Quick-create dropdown: keyboard Enter/Space/Escape/Arrow
- [x] Sidebar inert en mobile (< 1024px, cerrada)

### ✅ Token Cleanup (0 cambio visual)
- [x] **Card.tsx** radius default agregado (rounded-[var(--radius-card)])
- [x] **--color-text-secondary** alineado a --ceniza (#6B6F73)
- [x] **text-tabaco** → text-[var(--color-action-primary)] (95 occs, 32 files)

## 🟡 SEO + Assets — Pendientes

> **Engram**: `seo/bigschool-vs-skill-analysis` (#2549)

### Código (puedo hacer ya)
- [ ] **Not For You en PDP** — pendiente decisión: ¿en tab FAQ o tab Uso? (el AI Nugget ya lo cubre la descripción del producto, Prove-It ya está en badges/texto)
- [ ] **5 islands admin** `client:load` → `client:idle` (ToasterClient, NotificationDropdown, 3 tables)
- [ ] **3 React componentes huérfanos** (CartDrawer.tsx, AddToCartButton.tsx, WhatsAppButton.tsx)
- [ ] **StatusBadge** raw Tailwind colors → functional tokens
- [ ] **12 páginas informativas** con ES hardcodeado para todos los locales (privacidad, terminos, nosotros, faq, envios, etc.)
- [ ] **Route conflicts** root vs `[locale]/` (16 páginas duplicadas)
- [ ] **`/en/carrito` y `/en/checkout`** dan 404

### Procesos (requieren acción humana)
- [ ] **GSC setup** — verificar propiedad en search.google.com
- [ ] **Imágenes reales de productos** — E5: lo más crítico del sitio hoy
- [ ] **Google Ads + Keyword Planner** — necesita tarjeta de crédito
- [ ] **Cloudflare Free delante de Vercel** — monitoreo de bots
- [ ] **Bing Webmaster Tools** — someter sitemap
- [ ] **Content roadmap** — 15-20 artículos, ≥5 por locale
- [ ] **GBP + Wikidata** — reclamar perfil
- [ ] **Tributary Trust** — 4+ Tier 1 assets (Medium, LinkedIn, Reddit)
- [ ] **Hub EN** (portal mayorista B2B)
- [ ] **Hub BR** (contenido portugués)

---

## 🟢 Infraestructura

- [ ] **@astrojs/vercel i18n routing bug**: v10 no genera rutas root para [locale] dinámicos con `prefixDefaultLocale:false`. Fix actual: redirects manuales (PR #51). Evaluar si v11 lo resuelve.
- [ ] **Product page 404 en dev/preview server**: Las rutas `/tienda/rape/[slug]` funcionan en producción pero no en dev server. Bug de Astro 6.1.3.
- [ ] **Monorepo + Medusa Server**: Fase 7 del roadmap. Pendiente de planificar.

> ⚠️ **Lección aprendida:** Tailwind 4 usa `@layer` directives que NO son compatibles con CSS inlinado (`<style>` inline o extractores como `@playform/inline`/beasties). El browser no parsea correctamente las reglas dentro de `@layer` cuando hay conflictos entre inline y external CSS. **No intentar inlining de CSS con Tailwind 4** hasta que Astro/Tailwind tengan soporte nativo para critical CSS extraction que maneje `@layer` correctamente.

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

## 🟢 Vanguardia / Estratégico

- [ ] **Redefinir locale EN como B2B/Wholesale**: Actualmente `/en/` replica la tienda B2C en inglés. Convertirlo en portal mayorista (precios bulk, registro B2B, sin carrito B2C). Implica replantear contenido, navegación y checkout para EN.
- [ ] **Rutas localizadas por idioma** (ej. `/en/shop/`, `/pt/loja/`): SEO benefit menor vs esfuerzo (~40+ archivos). Aplazar hasta que haya tráfico real o reestructuración B2B.
