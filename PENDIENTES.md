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

## 🟡 SEO + Assets — Pendientes

> **Engram**: `seo/bigschool-vs-skill-analysis` (#2549) — Comparativa SEO-BigSchool-AI.md vs seobuild-onpage skill. Recomendación: seobuild como primary methodology, BigSchool como PM layer.

### Fase A — Foundation (este mes) 🔴 Alta prioridad
- [ ] **GSC setup** — verificar propiedad en search.google.com para los 3 locales
- [ ] **3 páginas informativas** con estructura seobuild (500-token chunks, AI Nugget, Prove-It, Not For You):
  - `[locale]/que-es-el-rape` (Article schema listo)
  - `[locale]/como-usar-el-rape` (HowTo schema listo)
  - `[locale]/rape-do-acre-origen` (Article schema listo)
- [ ] **AI Nugget + Prove-It + Not For You** en 15 PDPs existentes
- [ ] **Fast-scan comparison table** en páginas de categoría/tienda

### Fase B — Content Engine (mes que viene) 🔴 Alta prioridad
- [ ] **Pillar page** (8k+ palabras, 500-token chunks, Original Research block)
- [ ] **4 blog posts** con metodología seobuild (quality gates)
- [ ] **Keyword research CSV** con seasonality (Google Ads — necesita tarjeta)
- [ ] **Content calendar** con 20% RAG targeting (zero-volume long-tail queries)
- [ ] **FAQPage schema** en home + tienda

### Fase C — Off-Page & Trust (mes 2-3) 🔴 Alta prioridad
- [ ] **Tributary Trust Protocol** — 4+ Tier 1 assets (Medium, LinkedIn, Reddit, Google Site)
- [ ] **GBP + Wikidata** — reclamar perfil + crear entrada Wikidata
- [ ] **Cloudflare Free delante de Vercel** — monitoreo de bots + Clarity AI Bot Activity ($0/mes)
- [ ] **Bing Webmaster Tools** — someter sitemap-index.xml para reforzar Copilot
- [ ] **Rich Results Test** por page type (Product, BlogPosting, BreadcrumbList, Organization, Person)

### Fase D — Expansión (mes 3-4) 🟡 Media prioridad
- [ ] **Hub EN** (portal mayorista B2B)
- [ ] **Hub BR** (contenido portugués)
- [ ] **Cross-check Google vs LLM** — checklist final
- [ ] **CrUX field data** — revisar cuando haya tráfico real (~28 días)

### 🟡 Monitoreo continuo
- [x] **Middleware logging para llms.txt** — ✅ Implementado (llmsLoggerHandler en auth.ts)
- [x] **OAI-SearchBot** en robots.txt — ✅ Implementado (Allow explícito antes de User-agent: *)
- [ ] **Prueba manual mensual** en ChatGPT/Perplexity/Claude — preguntar por Octavo Fuego
- [ ] **Reviews Schema UGC** — conectar a sistema de reseñas real cuando exista

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
