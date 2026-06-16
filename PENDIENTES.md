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
| 03 Desarrollo (Core) | ██████████ 95% | 🔄 Casi listo |
| 04 Marketing/SEO | ████████░░ 80% | 🔄 En progreso |
| 05 Testing & Polish | ████░░░░░░ 30% | ⏳ Pendiente |
| 06 Lanzamiento | ██░░░░░░░░ 10% | ⏳ Pendiente |
| 07 Monorepo + Medusa | █░░░░░░░░░ 0% | ⏳ Planificado (3 fases progresivas) |

---

## 🚀 Fase 1 — Estrategia ✅

- [x] Documento maestro con storytelling (Profecía del Octavo Fuego)
- [x] Business plan para inversores
- [x] Análisis competitivo (HAUX, Ancestrina, KatU)
- [x] Modelo de negocio definido (D2C + B2B + Contenido)
- [x] Pricing definido: Rapé $3.500/g, Sananga $500/g

---

## 🎨 Fase 2 — Diseño ✅

- [x] Wireframes de todas las páginas
- [x] Copy completo (3 idiomas: ES/EN/PT)
- [x] Design system visual (colores, tipografía, componentes)
- [x] Tono y voz definido: "Maestro-Contador de Historias"
- [x] Estética: Minimalist Sacred (blanco + sombras Airbnb)

---

## 💻 Fase 3 — Desarrollo

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
- [x] Precios: 10g/$35K, 20g/$70K, 30g/$100K
- [x] PricingTable con botones seleccionables
- [x] Mapa de intenciones (5 categorías)
- [x] Profecía completa (3 idiomas)
- [x] Glosario de términos

### 3.4 Páginas ✅
- [x] Homepage (Hero, Profecía, Quiz, Productos, Trust Badges)
- [x] Catálogo principal (`/catalogo`)
- [x] Categoría Rapé (`/catalogo/rape/`)
- [x] Detalle de producto (`/catalogo/rape/[product]`)
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
- [ ] Imágenes reales de los 5 rapés (placeholder actual: bobinsana-rape-2.webp)
- [ ] og:image social card real (1200×630 — actualmente usa logo.png)
- [ ] WhatsAppButton en PDP (actualmente solo FloatingWhatsApp global)
- [ ] **Página "Nosotros"** — historia, sourcing de comunidades (Yawanawá, Nukini, Kaxinawá, Shanenawa), misión, equipo

### 3.7 Monorepo + Medusa SSR ⏳ (ARCHITECTURE.md §2-3)
- [ ] Setup `pnpm workspaces` — `pnpm-workspace.yaml` (`apps/*`, `packages/*`)
- [ ] Crear `apps/colombia` — migrar proyecto actual
- [ ] Crear `apps/brasil` — desde template Astro SSR
- [ ] Crear `packages/core` — componentes UI, stores y librerías compartidas
- [ ] Configurar `astro.config.mjs` con `output: 'server'` + `adapter: node({ mode: 'standalone' })`
- [ ] Cache headers `stale-while-revalidate` en páginas de catálogo
- [ ] Deploy MedusaJS v2 backend (`api.octavofuego.com`)

### 3.8 Carrito + API Routes ⏳ (ARCHITECTURE.md §4-5)
- [ ] Nano Stores cart (`packages/core/src/stores/cart.ts`) — `cartStore` atom
- [ ] `initCart()` con cookies — `packages/core/src/lib/cart.ts`
- [ ] Leer y persistir `cart_id` cookie en `Layout.astro` (HttpOnly, secure)
- [ ] Aislamiento de carritos por dominio (`PUBLIC_MEDUSA_REGION_ID`)
- [ ] `POST /api/cart/add` — proxy a Medusa (variant_id + quantity)
- [ ] `DELETE /api/cart/remove` — proxy a Medusa (line_id)

### 3.9 Checkout + Pasarelas Regionales ⏳ (ARCHITECTURE.md §6)
- [ ] `POST /api/checkout/create-payment` — Payment Collections Medusa v2
  - Shipping address → Add shipping method → Create payment sessions → Set provider
- [ ] `POST /api/checkout/complete` — `cart.complete()` → order
- [ ] `POST /api/webhooks/stripe` — Pix/Boleto asíncrono (Brasil)
- [ ] Variables de entorno por dominio:
  - Colombia: `PUBLIC_PAYMENT_PROVIDER=wompi`
  - Brasil: `PUBLIC_PAYMENT_PROVIDER=stripe` + `STRIPE_PRIVATE_KEY` + `STRIPE_WEBHOOK_SECRET`

### 3.10 B2B Mayorista ⏳ (ARCHITECTURE.md §7)
- [ ] `POST /api/auth/login` — cookie segura con `medusa_token` (HttpOnly) + `customer_group` flag
- [ ] `POST /api/b2b/register` — metadata `tax_id`, `company_name`, `b2b_status: pending`
- [ ] Webhook de notificación al admin en registro B2B
- [ ] Portal `/mayorista/estado.astro` — pending / approved / rejected
- [ ] Precios mayoristas desbloqueados por grupo de cliente en Medusa

---

## 📈 Fase 4 — Marketing & SEO 🔄

### Blog
- [x] 4 post publicados (guía rapé, historia sananga, ceremonia, beneficios)
- [ ] 5+ posts SEO adicionales (editorial calendar)
- [ ] Categorías y tags en blog
- [ ] Newsletter signup funcional

### SEO
- [x] Meta tags + Schema markup (100% cobertura — Organization, Product, Breadcrumb, BlogPosting, ItemList)
- [x] Hreflang tags ES/EN/PT
- [x] Sitemap generado
- [x] Auditoría SEO completa (5 críticos + 4 warnings corregidos)
- [ ] og:image social card (1200×630 — actualmente usa logo.png)
- [ ] Imágenes reales de productos para SEO
- [ ] Core Web Vitals optimizados
- [ ] Google Search Console configurado
- [ ] Indexación verificada
- [ ] Internal linking en blog (verificar que los 4 posts enlazan a productos/tienda)
- [ ] Keyword frontier analysis con datos reales de Search Console
- [ ] **Google Looker Studio** — dashboard consolidado (Search Console + GA4 + métricas de negocio)

### SEO — Features a importar de Pipod (astroecoomerce)

#### 🔴 Alto Impacto
- [ ] **IndexNow Protocol** — acelerar indexación en Bing/Yandex para 3 locales
  - `src/pages/api/index-now.ts` (port directo)
  - `public/<key>.txt`
  - `vercel.json` cron job
- [ ] **FAQPage Schema** — rich snippets en las 5 PDPs
  - Port `FAQPageSchema.astro` de pipod
  - FAQs por producto: qué es, cómo se usa, etnia, cantidad
- [ ] **SEO Score Tracking** — métrica cuantificable en PROYECTO.md
  - Categorías: Content Quality, Technical SEO, Structured Data, Performance, Sitemap/Crawl

#### 🟡 Medio Impacto
- [ ] **@graph Pattern en homepage** — un solo `<script>` con Organization + WebPage + ItemList
  - Referencia: `ServicePageSchema.astro` en pipod (6 entidades en @graph)
- [ ] **OrganizationJsonLd enriquecido** — `hasOfferCatalog` (5 rapés), `knowsAbout` keywords, `potentialAction` WhatsApp

#### 🟢 Bajo Esfuerzo
- [ ] **Geo keywords** — investigar si hay búsquedas tipo "comprar rapé Bogotá/Colombia" y agregar en metadata

### SEO Cross-Domain ⏳ (ARCHITECTURE.md §1, §3)
- [ ] Hreflang cross-domain dinámicos: `es-CO` ↔ `pt-BR` ↔ `en` (x-default)
  - Variables de entorno: `PUBLIC_DOMAIN_CO`, `PUBLIC_DOMAIN_BR`
  - Rutas unificadas: `/p/[product-slug]` en ambos dominios
- [ ] Redirecciones 301:
  - `octavofuego.com.co` → `octavofuego.com`
  - `octavofogo.com` → `octavofogo.com.br`
- [ ] Adquirir dominios: `octavofogo.com.br`, `octavofuego.com.co`
- [ ] Configurar DNS para apuntar a Vercel
- [ ] URLs de producto unificadas: `/p/[slug]` (mismo slug en CO y BR)

---

## 🧪 Fase 5 — Testing & Polish ⏳

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

## 🚀 Fase 6 — Lanzamiento ⏳

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

## 🏗️ Fase 7 — Arquitectura Progresiva (del MVP al Manifiesto) ⏳

> **Principio rector:** El manifiesto (`ARCHITECTURE.md`) es el plano del edificio de 20 pisos — referencia arquitectónica a largo plazo, NO lista de tareas para el sprint actual. Shippear rápido > elegancia técnica sin facturación.

```
[MVP de Acero] ──➔ [Centralización] ──➔ [Escala Élite]
   semanas              meses                 trimestres
```

### 7.1 MVP de Acero 🚀 (salida en semanas)
> **Stack:** Astro SSG (`output: 'static'`) + JSON estático + WhatsApp checkout
> **Objetivo:** Facturar. Validar demanda en Colombia y Brasil.

- [x] Astro 6.1.3 con 3 locales (ES/EN/PT)
- [x] 5 productos con precios COP
- [x] WhatsApp Commerce integrado
- [x] Schemas JSON-LD (100% cobertura)
- [x] SEO on-page (hreflang, sitemap, OG)
- [ ] **Página "Nosotros"** — historia, sourcing, misión
- [ ] **Google Looker Studio** — dashboard consolidado
- [ ] **Microsoft Clarity** — heatmaps, session recordings (gratis)
- [ ] Google Search Console + indexación
- [ ] Página "Nosotros" — historia, sourcing, equipo
- [ ] Subcarpetas `/es/` y `/pt/` sembrando autoridad desde día 1

### 7.2 Centralización Automatizada 🤖 (cuando WhatsApp colapse)
> **Stack:** Monodominio `octavofuego.com` + Medusa Cloud (Railway/Hosted) + Astro SSR
> **Objetivo:** Automatizar pagos B2C en CO y BR desde un solo sitio.

- [ ] Montar 1 instancia MedusaJS (managed — no sufrir con Linux)
- [ ] Migrar Astro a `output: 'server'` + adapter node
- [ ] Nano Stores cart con cookies (ver §3.8 para tareas detalladas)
- [ ] Proxy API routes a Medusa (`/api/cart/*`, `/api/checkout/*`)
- [ ] Wompi CO + Stripe BR (mismo dominio, region_id condicional)
- [ ] Inventario real en Medusa (stock control)
- [ ] **Fases 3.7–3.10** (30+ tareas) se activan acá

### 7.3 Escala Élite 🌎 (cuando Brasil justifique inversión)
> **Stack:** Monorepo dual-domain + `.com.br` + B2B automatizado
> **Objetivo:** Identidad local agresiva en Brasil. Mayoristas internacionales.

- [ ] Separar en monorepo (`apps/colombia`, `apps/brasil`, `packages/core`)
- [ ] Dominio `octavofogo.com.br` → producción local BRL
- [ ] Hreflang cross-domain (CO ↔ BR)
- [ ] B2B: flujo de aprobación automatizado (tax_id, company_name)
- [ ] Pasarelas locales: Pix + Boleto via Stripe Brasil
- [ ] **GitHub Actions:** `.github/workflows/check-builds.yml` — validar ambos apps antes de merge
  - Job `build-colombia` con env vars CO
  - Job `build-brasil` con env vars BR
  - Secrets: `MEDUSA_PROD_URL`
- [ ] **Vercel Proyecto 1 (Colombia):** Root `apps/colombia`, dominio `octavofuego.com`
- [ ] **Vercel Proyecto 2 (Brasil):** Root `apps/brasil`, dominio `octavofogo.com.br`
- [ ] Servidor MedusaJS v2 desplegado (`api.octavofuego.com`)
- [ ] Variables de entorno consolidadas en `.env.example` para ambos apps

> **ANTI-PATRÓN:** No activar esta fase antes de validar que el mercado BR responde al rapé. El flujo de caja real debe pagar la infraestructura.

---

## 🐛 Bugs Conocidos

| Bug | Estado | Notas |
|-----|--------|-------|
| FloatingWhatsApp runtime error | ✅ Fixed | Era React "call" — convertido a Astro puro |
| Breadcrumb sin categoría | ✅ Fixed | Ahora: Inicio / Catálogo / Rapé / Producto |
| WhatsAppButton.tsx → .astro | ✅ Fixed | Misma migración que FloatingWhatsApp |
| Lucide React SSR bug (class prop) | ✅ Fixed | Astro no forwardeaba `class` a SVGs internos → iconos renderizaban a 14px. Solución: migrar TODOS los iconos a `astro-icon` + Solar Bold-Duotone |

---

## 🎨 Design System — Iconografía

### Librerías de Iconos
| Librería | Uso | Notas |
|----------|-----|-------|
| **Solar Bold** | Iconos UI en secciones oscuras (footer, trust badges) | 1 capa, `currentColor` 100% |
| **Solar Bold-Duotone** | Iconos UI en secciones claras (hero, cards) | 2 capas con opacity |
| **Phosphor Fill** | Logos sociales en secciones oscuras | 1 capa, `currentColor` 100% |
| **Phosphor Duotone** | Logos sociales en secciones claras | 2 capas con opacity |
| **astro-icon** | Renderizado de iconos en Astro | Resuelve el bug SSR de `class` prop |

### Iconos Disponibles (Solar Bold - para fondos oscuros)
```
Footer:         letter-bold, chat-round-bold, map-point-bold, leaf-bold
Trust Badges:   shield-bold, cloud-waterdrop-bold, leaf-bold
```

### Iconos Disponibles (Solar Bold-Duotone - para fondos claros)
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

## 🔗 Deuda Técnica

| Deuda | Riesgo | Regla |
|-------|--------|-------|
| BRL pricing → schema coupling | Medio | Si se agrega pricing en BRL (mercado brasileño), actualizar `priceCurrency` en **ItemList** (2 páginas) + **ProductJsonLd** (1 componente) **en el mismo commit** — no después |

---

## 📁 Estructura del Proyecto

```
octavo-fuego/
├── ARCHITECTURE.md            ← Manifiesto de ingeniería (monorepo + Medusa SSR)
├── PENDIENTES.md              ← Este archivo
├── AGENTS.md                  ← Instrucciones para AI agents
├── PROYECTO.md                ← Single source of truth
├── tasks.md                   ← Task tracking detallado
├── README.md                  ← Documentación general
├── src-astro/                 ← Astro project root
│   ├── src/
│   │   ├── components/        # Navbar, Footer, FloatingWhatsApp, etc.
│   │   ├── data/              # products.ts, prophecy.ts, glossary.ts
│   │   ├── i18n/              # es.json, en.json, pt.json
│   │   ├── layouts/           # Layout.astro
│   │   ├── pages/             # [locale]/*, carrito, checkout, blog
│   │   ├── stores/            # cartStore.ts
│   │   └── styles/            # global.css
│   ├── public/
│   └── dist/
├── .atl/                      # SDD artifacts
├── 01-estrategia/             # Business docs
├── 02-diseno/                 # Design & copy
├── 03-desarrollo/             # Tech specs
├── 04-marketing/              # SEO & marketing
└── 05-entrega/                # Delivery
```

---

## 🔄 Últimos Commits

| Fecha | Commit | Rama | Descripción |
|-------|--------|------|-------------|
| Jun 15 | `44ec78d` | `main` | feat(seo): add ItemList schema to category pages, restore Organization address |
| Jun 15 | `8f17307` | `main` | fix(seo): OrganizationJsonLd — foundingDate 2026, knowsAbout desc, sameAs +WhatsApp |
| Jun 15 | `ba610f8` | `main` | fix(seo): improve JSON-LD schemas — @id, cross-refs, dates ISO |
| Jun 15 | `4a2ae13` | `main` | fix(seo): remove dead code, heading hierarchy, article schema, img dimensions |
| Jun 15 | `bbfcf32` | `main` | fix(seo): hreflang tags, schema import, fake rating removal, og-image |
| Jun 15 | `1966698` | `main` | docs: link PROYECTO, README, AGENTS with Engram topic keys |
| Jun 15 | `e2b8f26` | `main` | docs: create PROYECTO.md - single source of truth |
| Jun 15 | `fea5d43` | `main` | docs: update PENDIENTES, AGENTS, design.md - dark sections + icon system |
| Jun 15 | `f24e304` | `main` | fix(home): Trust Badges bg to --color-action-hover for visual hierarchy |
| Jun 15 | `8355265` | `main` | feat(home): dark tobacco background for Trust Badges section |
| Jun 15 | `38acc01` | `main` | feat(brand): update tagline to Rapé de Acre, Amazonía brasileira |
| Jun 15 | `065ff98` | `main` | fix(footer): replace duotone icons with solid variants for max contrast |
| Jun 15 | `9671908` | `main` | fix(footer): icon color text-white for max contrast on dark background |
| Jun 15 | `db89858` | `main` | migrate: --verde-botanico → --color-action-primary (76 occurrences, 18 files) |

---

## 📞 Contacto

- **GitHub**: `octavofuegostore/octavo-fuego`
- **Domain**: `www.octavofuego.com` (Vercel)
- **WhatsApp**: `+57 317 2137932`
- **Instagram**: `@octavofuego`

---

*Actualizado: Junio 15, 2026*
