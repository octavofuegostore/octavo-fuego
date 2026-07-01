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

## 🔥 Prioridades Inmediatas — Pre-Lanzamiento (Top 10)

> Análisis completo: [`01-estrategia/analisis-critico-pendientes-OF.md`](01-estrategia/analisis-critico-pendientes-OF.md)
> Principio rector: "Shippear rápido > elegancia técnica sin facturación." — §7 ARCHITECTURE.md
> Esfuerzo total Top 10: ~21 horas | No hacer: Medusa, monorepo, cross-domain (§7.2-§7.3 post-lanzamiento)

| # | Tarea | Esfuerzo | Impacto | Dónde |
|---|-------|----------|---------|-------|
| ✅ | ~~Precio/g visible en PDPs~~ — `PricingTable.astro:78` | - | - | → §3.6 |
| ✅ | ~~Mobile-First Phase 1~~ — 28/28 fixes (commits `2e79fe6..d06ab54`) | - | - | → §7.1 |
| 1 | **Google Search Console** + Microsoft Clarity + verificar indexación | 35min | 🔥🔥🔥🔥 | → §5 Testing |
| 2 | **Imágenes reales de los 5 rapés** (placeholder bobinsana → fotos reales en `assets/productos/rape/`) | 3h | 🔥🔥🔥🔥🔥 | → §3.6 |
| 3 | **Landing B2B: 14 fixes** (audit completo en `.atl/b2b-mayoristas-landing-audit.md`, 0 aplicados) | 2h | 🔥🔥🔥🔥 | → §3.10.1 |
| 4 | **3 páginas informacionales SEO** (/es/que-es-el-rape/, /es/como-usar-el-rape/, /es/rape-do-acre-origen/) | 6h | 🔥🔥🔥 | → §4 SEO Gaps |
| 5 | **H1 + meta descriptions alineadas** con arquitectura SEO (5 PDPs + homepage + landing B2B) | 2h | 🔥🔥🔥 | → §4 + §3.10.1 |
| 6 | **og:image social card (1200×630)** — infraestructura lista en `Layout.astro`, falta crear el archivo de imagen | 1h | 🔥🔥🔥 | → §3.6 |
| 7 | **Mobile-First Phase 2** — validación en device real + `clamp()` en headings (29/29 fixes) | 1.5h | 🔥🔥 | → §7.1 |
| 8 | **11 páginas SEO Trust Foundation** (nosotros, contacto, faq, envíos, términos, privacidad + 5 landings) | 12h | 🔥🔥🔥 | → §3.12 |
| 9 | **Test WhatsApp checkout end-to-end** — producto, cantidades, precio en iPhone + Android real | 30min | 🔥🔥🔥 | → §5 Testing |
| 10 | **Velocidad en 3G colombiano** — 70%+ tráfico mobile no es 5G. Medir con throttling. | 30min | 🔥🔥 | → §5 Testing |

### Menciones de honor
| # | Tarea | Esfuerzo | Dónde |
|---|-------|----------|-------|
| 11 | IndexNow Protocol (acelerar indexación Bing/Yandex) | 30min | → §4 SEO Pipod |
| ✅ | ~~Design system `--verde-botanico` → `--color-action-primary`~~ — 76 ocurrencias, 18 archivos (`db89858`) | - | → §Design System |
| 13 | FAQPage Schema en las 5 PDPs | 2h | → §4 SEO Pipod |
| 14 | Página "Nosotros" | 3h | → §3.12 Bloque A |
| 15 | hreflang cruzados CO↔EN | 1h | → §4 SEO Gaps |
| 16 | "Consejos o Pajé" — artículo #1 | 2h | → §Blog |

### Tareas detectadas que NO estaban en PENDIENTES.md
| # | Tarea | Prioridad |
|---|-------|-----------|
| 🆕 | **404 audit** — arquitectura SEO §10 prioridad 1 (arreglar 404s de páginas de producto) | 🔴 Alta |
| 🆕 | **Borrar directorio fantasma `ativos/octavo-fuego/`** — build artifacts sin .git | 🟢 Baja |

### Consolidación de secciones duplicadas
> Las secciones §3.7-§3.10, §4 SEO Cross-Domain se consolidan en §7.2 y §7.3 (canonicals). Cada tarea original está referenciada. No se pierde detalle.

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
- [ ] **Imágenes reales de los 5 rapés** (placeholder actual: `bobinsana-rape-2.webp`. Fotos reales existen en `assets/productos/rape/` — falta copiarlas a `public/` y mapear slugs a imágenes)
- [ ] **og:image social card real (1200×630)** — infraestructura lista en `Layout.astro`, falta crear el archivo de imagen y pasarlo desde el PDP
- [ ] **Página "Nosotros"** → Ver §3.12 Bloque A
- [ ] **11 páginas SEO** (6 trust foundation + 5 landings) → Ver §3.12 Bloque A y B

### 3.7 Monorepo + Medusa SSR ⏳ → Ver §7.2 Centralización
> **Nota:** Todas las tareas de esta sección están consolidadas en §7.2 Centralización Automatizada. El stack Medusa requiere facturación validada ("cuando WhatsApp colapse") y no es prioritario para el MVP. Las tareas detalladas de monorepo se preservan en §7.2 ### Monorepo Setup.

### 3.8 Carrito + API Routes ⏳ → Ver §7.2 Centralización
> **Nota:** Todas las tareas de esta sección están consolidadas en §7.2 Centralización Automatizada. El carrito actual en localStorage + nanostores funciona para el MVP. Las tareas detalladas se preservan en §7.2 ### Carrito + API Routes.

### 3.9 Checkout + Pasarelas Regionales ⏳ → Ver §7.2 Centralización
> **Nota:** Todas las tareas de esta sección están consolidadas en §7.2 Centralización Automatizada. El checkout actual via WhatsApp funciona para el MVP. Las tareas detalladas se preservan en §7.2 ### Checkout + Pasarelas.

### 3.10 B2B Mayorista ⏳ (ARCHITECTURE.md §7)

#### 3.10.1 Landing Page — `/es/mayoristas/` ([ver página](https://www.octavofuego.com/es/mayoristas/))
> Audit: Junio 16, 2026 — [`.atl/b2b-mayoristas-landing-audit.md`](.atl/b2b-mayoristas-landing-audit.md) | [Revisión completa](.atl/b2b-mayoristas-revision-completa.md) | Veredicto inicial: 9/10 → post-revisión: 14 mejoras pendientes

##### 🔴 Críticos
- [ ] **Eliminar "y Brasil" de meta description** — viola regla de oro §2 (hub CO solo habla a Colombia)
- [ ] **Agregar 4to pilar: Precio de Origen Sin Intermediarios** — la ventaja competitiva central (46% más barato) no se comunica en ninguna parte de la landing
- [ ] **H1 alineado con arquitectura SEO** → "Distribución Institucional de Rapé do Acre para Facilitadores y Distribuidores en Colombia"
- [ ] **Keywords alineadas** — 8 keywords del doc (4 primarias + 4 secundarias) vs 6 actuales (2 mal, 4 faltan)
- [ ] **Activar hreflang** — landing indexable sin hreflang cruzados CO↔EN↔BR
- [ ] **CTA más visible** — bloque destacado a mitad de página (posterior a "Variedades")

##### 🟡 Medios
- [ ] **Eliminar "Sananga" de meta** — se menciona en description pero NUNCA en el body (contenido fantasma)
- [ ] **FAQ Colombia solo operación CO** — actualmente mezcla pagos CO (transferencia) y BR (Pix) en misma página. El hub BR maneja su propia info.
- [ ] **Elevar Kuripes a sección propia** — actualmente es una nota al pie. La arquitectura §3.1 lo define como categoría.
- [ ] **FAQ tiempo urgente** — opción `URGENTE` en formulario para priorizar <12h (retiros programados)
- [ ] **Mínimo flexible 250g** — "prueba piloto B2B" para clientes retail que escalan a mayorista

##### 🟢 Bajos
- [ ] **Title alineado** → "Rapé por Mayor Colombia — Distribuidor Rapé do Acre | Octavo Fuego"
- [ ] **Mover `astro.config.mjs`** de la página pública → `README.md` interno
- [ ] **Schema.org WholesaleStore** — JSON-LD en `<head>` con `currenciesAccepted`, `areaServed`, `hasOfferCatalog`
- [ ] **Cobertura geográfica explícita** — el body no dice explícitamente que "territorio nacional" = Colombia

#### 3.10.2 Backend B2B → Ver §7.3 Escala Élite
> **Nota:** Todas las tareas de esta sección están consolidadas en §7.3 Escala Élite (B2B automatizado). El flujo B2B actual via formulario de contacto + approval manual funciona para el MVP.

### 3.11 Confianza — Privacidad + Presencia Google 🛡️
> Fuente: Engram `privacidad-confianza` (obs #525)

#### ✅ Completado (15 Jun 2026)
- [x] **Privacidad — dirección Bogotá removida** del Footer.astro
- [x] **confianzaFooter agregado** ("🌿 Directo de la Amazonía, con propósito") en Footer + i18n
- [x] **OrganizationJsonLd address simplificado** — array[2] → objeto único (solo fábrica BR)
- [x] **i18n keys** — eliminada `direccionTienda`, agregada `confianzaFooter` (es/en/pt)
- [x] **Testimonials.astro** componente creado con 3 testimonios, estrellas, avatares, i18n

#### 📋 Google Business Profile
- [ ] Configurar como "Área de Servicio" (NO tienda física)
- [ ] Nombre: "Octavo Fuego" — Categoría: Herbal Medicine / Wellness
- [ ] Áreas: Colombia + Brasil — 1 solo perfil, sin dirección visible
- [ ] Verificar dominio: octavofuego.com
- [ ] Solicitar primeras 5 reseñas a clientes reales
- [ ] Agregar link de reseña de Google en página de confirmación de compra

#### 🔜 Mejoras Futuras
- [ ] Reemplazar testimonios placeholder con quotes reales de clientes
- [ ] Avatar opcional (foto real) en componente Testimonials
- [ ] Ajustar confianzaFooter ("Hecho con propósito desde Acre, Brasil")
- [ ] Trustpilot (cuando facture +$5M/mes)
- [ ] Añadir productos: sananga, kuripe, accesorios
- [ ] Fotos reales de los 5 rapés (reemplazar placeholder)

### 3.12 SEO Transactional Trust Foundation 📋
> SDD Proposal: `seo-transactional-trust-foundation` (Jun 16, 2026)
> Engram: `sdd/seo-transactional-trust-foundation/proposal`

#### Bloque A: Trust Foundation (6 páginas, prioridad 🔴 primera)
- [ ] `/nosotros` — historia, comunidades (Yawanawá, Nukini, Kaxinawá, Shanenawa), misión, equipo
- [ ] `/contacto` — formulario + WhatsApp + email
- [ ] `/faq` — preguntas frecuentes
- [ ] `/envios` — política de envíos, tiempos, zonas
- [ ] `/terminos` — términos y condiciones
- [ ] `/privacidad` — política de privacidad

#### Bloque B: SEO Landing Pages (5 páginas, prioridad 🔴 segunda)
- [ ] `/es/guia-comprador-rape/` — transaccional pura (keywords: comprar rapé, dónde comprar rapé do acre)
- [ ] `/es/ceremonia-de-rape/` — alto volumen (keywords: ceremonia de rapé, ritual rapé)
- [ ] `/es/que-es-el-rape/` — informacional base (keywords: qué es el rapé, para qué sirve)
- [ ] `/es/como-usar-el-rape/` — middle funnel (keywords: cómo aplicar con kuripe, dosis primera vez)
- [ ] `/es/rape-do-acre-origen/` — diferenciación (keywords: rapé brasileño vs colombiano, etnias)

#### Bloque C: Wiring (prioridad 🟡 tercera)
- [ ] Footer: agregar sección Guías con las 5 landing pages
- [ ] Blog: crear categoría Guías y posts introductorios linkeando a las landings
- [ ] Homepage: bloque Explorar nuestras Guías (mitad inferior)
- [ ] Sitemap regenerado con las 11 nuevas URLs

### 3.13 L-Medusa Backend Layer ✅ (Jun 16, 2026)
> Arquitectura: `.atl/l-medusa-architecture.md` | `.atl/sesion-completa-junio-16-2026.md`
> Engram: `sdd/octavo-fuego/l-medusa-alfred-complete`

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
> SDD: `admin-auth-system` | Engram: `sdd/admin-auth-system/*`
> Commit: `f88b6b0` en develop (no push)

#### ✅ Completado
- [x] **Auth library** — `src/lib/auth.ts` (credenciales hardcodeadas, SHA-256 tokens, constant-time comparison)
- [x] **Middleware** — `src/middleware/auth.ts` (locale redirect /en|pt/admin → /admin, cookie verification, auth guard)
- [x] **API Login** — `POST /api/auth/login` (valida credenciales, setea cookie httpOnly, 400/401/500 JSON errors)
- [x] **API Logout** — `GET /api/auth/logout` (limpia cookie, redirect /admin/login)
- [x] **Login UI** — `login.astro` (fetch-based form, loading state, error display)
- [x] **Logout Button** — `AdminLayout.astro` (Cerrar Sesión en sidebar)
- [x] **Vercel Adapter** — `@astrojs/vercel` instalado para soporte de API routes en producción
- [x] **Prerender Fix** — `export const prerender = false` en API routes para server-side rendering

#### 📋 Pendiente
- [ ] **Phase 4: Tests** — unitarios (lib/auth, middleware) + E2E login flow (Playwright)

#### Credenciales (hardcoded)
```
Email:    admin@octavofuego.com
Password: octavo2026
```

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

## 📈 Fase 4 — Marketing & SEO 🔄

### Blog
- [x] 4 post publicados (guía rapé, historia sananga, ceremonia, beneficios)
- [ ] 5+ posts SEO adicionales (editorial calendar)
- [ ] Categorías y tags en blog
- [ ] Newsletter signup funcional

### Blog — Estrategia "Consejos o Pajé" 📹
> Fuente: [`.atl/estrategia-contenido-consejos-o-paje.md`](.atl/estrategia-contenido-consejos-o-paje.md)

- [ ] **Crear sección "Consejos o Pajé"** — blog de curaduría de videos de YouTube (chamanes, taitas, antropólogos)
- [ ] **Template de entrada:** video embebido (EMBED, no descarga) + resumen editorial (NO transcripción) + H2/H3 + blockquote + CTA sutil al catálogo
- [ ] **Artículo #1** — primer video curado con la estructura del template
- [ ] **Calendario editorial** — 1 entrada semanal para mantener dwell time y frescura de contenido
- [ ] **Keywords cola larga target:** "cómo soplar rapé noche", "significado ceniza Tisunú", "diferencia medicina Acre tabaco", "dosis rapé primera vez"

### SEO
- [x] Meta tags + Schema markup (100% cobertura — Organization, Product, Breadcrumb, BlogPosting, ItemList)
- [x] Hreflang tags ES/EN/PT
- [x] Sitemap generado
- [x] Auditoría SEO completa (5 críticos + 4 warnings corregidos)
- [x] Precio/g visible en PDP — `PricingTable.astro:78`
- [ ] **og:image social card (1200×630)** — infraestructura lista en `Layout.astro`, falta crear el archivo de imagen (actualmente usa logo.png)
- [ ] Imágenes reales de productos para SEO
- [ ] Core Web Vitals optimizados
- [ ] Google Search Console configurado
- [ ] Indexación verificada
- [ ] Internal linking en blog (verificar que los 4 posts enlazan a productos/tienda)
- [ ] Keyword frontier analysis con datos reales de Search Console
- [ ] **Google Looker Studio** — dashboard consolidado (Search Console + GA4 + métricas de negocio)

### SEO — Gaps vs Arquitectura SEO Transnacional 🔴
> Fuente: [`.atl/arquitectura-seo-extraccion-completa.md`](.atl/arquitectura-seo-extraccion-completa.md) — 11 gaps extraídos del doc maestro

#### 🔴 Alto Impacto (Semana 1-3)
- [x] **Precio/g visible en PDP** — `$3.500 COP/g` como elemento principal en `PricingTable.astro:78` + copy "20 gramos por el precio que otros cobran por 10" en TODAS las PDPs
- [ ] **Crear `/es/que-es-el-rape/`** — página informacional (qué es, para qué sirve, efectos)
- [ ] **Crear `/es/como-usar-el-rape/`** — página informacional (cómo aplicar, kuripe, ceremonial)
- [ ] **Crear `/es/rape-do-acre-origen/`** — página informacional (Brasil vs Colombia, empaque vacío)
- [ ] **Categoría Kuripe + 2 productos** — `/es/tienda/kuripe/`, kuripe-clasico, kuripe-doble
- [x] **URLs: decidir `/catalogo/` vs `/tienda/`** — ✅ YA MIGRADO. Código usa `/tienda/` en todos los componentes. Solo quedan 7 redirects legacy en `astro.config.mjs`. Ver [`03-desarrollo/plan-migracion-urls-OF.md`](03-desarrollo/plan-migracion-urls-OF.md)

#### 🟡 Medio Impacto (Semana 3 - Mes 2)
- [ ] **hreflang cruzados** — activar en Layout para todas las páginas indexadas (CO ↔ EN ↔ BR)
- [ ] **Hub EN** — `/en/` con catálogo completo en inglés (7 productos + wholesale)
- [ ] **Hub BR** — adquirir `octavofogo.com.br` + `/loja/` en portugués
- [ ] **Landing B2B** — corregir keywords (8 del doc) + H1 recomendado
- [ ] **Meta descriptions** — verificar que todas las páginas usan las del doc (con precio $3.500/g)

#### 🟢 Bajo Esfuerzo / Mes 3+
- [ ] **Blog** — 10 keywords cola larga ya definidas, 1 artículo semanal
- [ ] **Directivas SEO verify** — auditar robots/hreflang/sitemap en todas las páginas actuales
- [ ] **Login mayoristas** — `/es/mayoristas/portal/` (privado, noindex)

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

### SEO Cross-Domain ⏳ → Ver §7.3 Escala Élite
> **Nota:** Todas las tareas de esta sección están consolidadas en §7.3 Escala Élite (### Cross-Domain SEO). Requiere dominio `octavofogo.com.br` adquirido + DNS + Vercel multi-proyecto. No es prioritario hasta validar demanda BR.

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

##### 🔴 Críticos (bugs iOS/Safari) — ✅ 3/3 completados (SDD Phase 1-2)
- [x] **Anti-zoom en inputs** — `text-base md:text-sm` en todos los form fields
- [x] **Hamburger Sheet navigation ≤768px** — vanilla JS toggle + `transform: translateX()`, body scroll lock, locale-aware links
- [x] **Eliminar 300ms tap delay** — `touch-action: manipulation` en global.css

##### 🟡 UX Mobile-First — ✅ 9/10 completados (SDD Phase 2-4)
- [x] **Snap-scroll horizontal en product cards** — `flex overflow-x-auto snap-x md:grid md:grid-cols-N` en tienda + PDP
- [x] **Touch targets ≥44px** — iconos footer, qty buttons, nav links, cart, QuickViewModal, social icons
- [x] **Headers stacking** — `flex-col sm:flex-row` en action bars + QuickReferenceTable + IntensityProfile
- [x] **Modales full-width mobile** — `<dialog>` nativo con `w-full sm:max-w-lg sm:rounded-lg`
- [x] **PricingTable responsive** — `grid-cols-2 sm:grid-cols-3` con collapse progresivo
- [x] **Hero + Trust Badges** — `text-base sm:text-lg` en ≤375px
- [x] **Footer responsive** — 4→2→1 columnas (ya estaba)
- [x] **Carrito drawer** — CSS optimizado, componente futuro-gated (SDD Fix #23)
- [ ] **Tipografía responsive con `clamp()`** — reemplazar `text-5xl md:text-6xl` por `clamp()` en headings (SDD usó breakpoints fijos, `clamp()` es más fluido). ~5 líneas.
- [x] **Breakpoint detection CSS-first** — `data-breakpoint` en `<html>` via inline script

> **28/29 fixes aplicados (SDD mobile-first-overhaul, 4 commits).** Ver `openspec/changes/mobile-first-overhaul/` para detalle. Queda 1 fix cosmético (`clamp()` en headings) + tareas de validación mobile que requieren device real o setup externo:

| # | Tarea | Prioridad |
|---|-------|-----------|
| 📱 | **Test WhatsApp checkout end-to-end** — producto, cantidades, precio en iPhone + Android real | 🔴 Alta |
| 📱 | **Velocidad en 3G colombiano** — medir con throttling (DevTools), 70%+ tráfico no es 5G | 🟡 Media |
| 🎨 | **Footer icons mobile** — revertir `w-11 h-11` → `w-7 h-7` (íconos se ven muy grandes, el `p-2` ya da 44px de touch target) | 🟡 Media |

### 7.2 Centralización Automatizada 🤖 (cuando WhatsApp colapse)
> **Stack:** Monodominio `octavofuego.com` + Medusa Cloud (Railway/Hosted) + Astro SSR
> **Objetivo:** Automatizar pagos B2C en CO y BR desde un solo sitio.
> **Contexto:** Esta sección consolida §3.7 (Monorepo), §3.8 (Carrito), §3.9 (Checkout). No es prioritario para el MVP de Acero — se activa cuando WhatsApp sea el cuello de botella.

- [ ] **Medusa Core:** Montar 1 instancia MedusaJS v2 (managed — no sufrir con Linux)
- [ ] **SSR Migration:** Migrar Astro a `output: 'server'` + `adapter: node({ mode: 'standalone' })`
- [ ] **Inventario real:** Stock control en Medusa
- [ ] **Cache:** `stale-while-revalidate` en páginas de catálogo

#### Monorepo Setup (was §3.7)
- [ ] Setup `pnpm workspaces` — `pnpm-workspace.yaml` (`apps/*`, `packages/*`)
- [ ] Crear `apps/colombia` — migrar proyecto actual
- [ ] Crear `apps/brasil` — desde template Astro SSR
- [ ] Crear `packages/core` — componentes UI, stores y librerías compartidas
- [ ] Deploy MedusaJS v2 backend (`api.octavofuego.com`)

#### Carrito + API Routes (was §3.8)
- [ ] Nano Stores cart (`packages/core/src/stores/cart.ts`) — `cartStore` atom
- [ ] `initCart()` con cookies — `packages/core/src/lib/cart.ts`
- [ ] Leer y persistir `cart_id` cookie en `Layout.astro` (HttpOnly, secure)
- [ ] Aislamiento de carritos por dominio (`PUBLIC_MEDUSA_REGION_ID`)
- [ ] `POST /api/cart/add` — proxy a Medusa (variant_id + quantity)
- [ ] `DELETE /api/cart/remove` — proxy a Medusa (line_id)

#### Checkout + Pasarelas Regionales (was §3.9)
- [ ] `POST /api/checkout/create-payment` — Payment Collections Medusa v2 (Shipping → Method → Session → Provider)
- [ ] `POST /api/checkout/complete` — `cart.complete()` → order
- [ ] `POST /api/webhooks/stripe` — Pix/Boleto asíncrono (Brasil)
- [ ] Variables de entorno por dominio: CO → `wompi`, BR → `stripe` + `STRIPE_PRIVATE_KEY` + `STRIPE_WEBHOOK_SECRET`
- [ ] Wompi CO + Stripe BR (mismo dominio, region_id condicional)

### 7.3 Escala Élite 🌎 (cuando Brasil justifique inversión)
> **Stack:** Monorepo dual-domain + `.com.br` + B2B automatizado
> **Objetivo:** Identidad local agresiva en Brasil. Mayoristas internacionales.
> **Contexto:** Esta sección consolida §4 SEO Cross-Domain + §3.10.2 (Backend B2B). No activar antes de validar que BR responde. El flujo de caja real debe pagar la infraestructura.

#### Infraestructura Dual-Domain (Core)
- [ ] Separar en monorepo (`apps/colombia`, `apps/brasil`, `packages/core`)
- [ ] Dominio `octavofogo.com.br` → producción local BRL
- [ ] Hreflang cross-domain (CO ↔ BR)
- [ ] **GitHub Actions:** `.github/workflows/check-builds.yml` — validar ambos apps antes de merge (jobs CO + BR, secrets `MEDUSA_PROD_URL`)
- [ ] **Vercel Proyecto 1 (Colombia):** Root `apps/colombia`, dominio `octavofuego.com`
- [ ] **Vercel Proyecto 2 (Brasil):** Root `apps/brasil`, dominio `octavofogo.com.br`
- [ ] Servidor MedusaJS v2 desplegado (`api.octavofuego.com`)
- [ ] Variables de entorno consolidadas en `.env.example` para ambos apps

#### Cross-Domain SEO (was §4 SEO Cross-Domain)
- [ ] Hreflang cross-domain dinámicos: `es-CO` ↔ `pt-BR` ↔ `en` (x-default) con `PUBLIC_DOMAIN_CO`, `PUBLIC_DOMAIN_BR`
- [ ] Rutas unificadas: `/p/[product-slug]` en ambos dominios
- [ ] Redirecciones 301: `octavofuego.com.co` → `octavofuego.com`, `octavofogo.com` → `octavofogo.com.br`
- [ ] Adquirir dominios: `octavofogo.com.br`, `octavofuego.com.co`
- [ ] Configurar DNS para apuntar a Vercel

#### B2B Automatizado (was §3.10.2)
- [ ] `POST /api/auth/login` — cookie segura con `medusa_token` (HttpOnly) + `customer_group` flag
- [ ] `POST /api/b2b/register` — metadata `tax_id`, `company_name`, `b2b_status: pending`
- [ ] Webhook de notificación al admin en registro B2B
- [ ] Portal `/mayorista/estado.astro` — pending / approved / rejected
- [ ] Precios mayoristas desbloqueados por grupo de cliente en Medusa
- [ ] Pasarelas locales: Pix + Boleto via Stripe Brasil

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

*Actualizado: Julio 1, 2026*

---

## 🗄️ Deuda Técnica Diferida — Para Después del Sprint Actual

> Engram: `sdd/octavo-fuego/deuda-diferida` (obs #1238)
> Estas tareas están identificadas pero se postergan — no bloquean el sprint actual.

### 🔴 Alta Prioridad (agregar al próximo sprint)

- [ ] **Q18 — Pricing Engine (9 precios)** — `#1144` Service que centralice 3 presentaciones × 3 monedas. Sin esto no hay cálculos de orden reales.
- [ ] **Q31-34 — ProductForm + OrderForm React** — `#1149` `#1150` Formularios de creación/edición de productos y órdenes. El admin los necesita todos los días.
- [ ] **Q15 — Audit triggers + conectar timeline** — `#1143` Tabla audit_log existe en DB, triggers creados en migrations 004. Falta conectar UI de timeline en OrderDetail.

### 🟡 Media Prioridad

- [ ] **Q5 — GitHub Actions CI** — `#1140` Workflow typecheck + build en PRs. La build local funciona, pero no hay guardrail en equipo.
- [ ] **Q7-Q23 — Deploy hook + rebuild desde admin** — `#1140` `#1145` Botón "Publicar cambios" que gatille rebuild en Vercel.
- [ ] **Q8-Q10 — Zod + SupabaseService base** — `#1141` Clase base abstracta con errores tipados. Service actual es funcional pero difícil de escalar.
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

## 🧹 Limpieza (Jun 17, 2026)

- [x] **Detectado directorio fantasma** `ativos/octavo-fuego/` — build artifacts sin `.git` (solo `dist/`, `node_modules/`, `.astro/`). Proyecto real en `activos/octavo-fuego/`
- [x] **Borrar** `rm -rf /Users/calderonjosue_/clientes/ativos/octavo-fuego/`
- [x] **PENDIENTES.md auditado** — 2 items tachados (mobile 28/28, precio/g), Top 10 renumerado, 5 secciones actualizadas

---

## 🔍 Code Review — Admin + Infraestructura (Jun 17, 2026)

> Auditoría completa del panel admin (🟡 mock) + infraestructura (🟢 real).
> 2,512 líneas de admin pages, 537 infra, 130 services. 3 🔴 CRÍTICOS, 5 🟡 WARNINGS, 3 🟢 SUGERENCIAS.

### 🔴 CRÍTICOS

- [ ] **CR-01: CustomerDetail ignora el ID** — `CustomerDetail.astro:10` datos hardcodeados. Ignora `customerId` del parámetro URL. Siempre muestra "María García". No usa `getClienteById()` del service.
- [ ] **CR-02: OrderDetail ignora el ID** — `OrderDetail.astro:10` datos hardcodeados. Ignora `orderId`. Siempre muestra "OF-2026-001". Botones de estado (`Confirmar`, `Cancelar`, `Marcar como Enviada`) solo muestran toast y redirigen — no modifican datos.
- [ ] **CR-03: Mock data es de otro negocio** — `service.ts:6-69` contiene "Cera de Ducha", "Sabonete", "Packs Regalo". Nada que ver con rapé/sananga/kuripe. 24 productos mock vs 5 rapés reales en la tienda.

### 🟡 WARNINGS

- [ ] **W-04: Dashboard period selector no actualiza datos** — `admin/index.astro:58-100` los charts se renderizan con datos en `Astro.props` estáticos. El JS del selector cambia la UI (`hidden`/`visible`) pero los datos no se recalculan.
- [ ] **W-05: Supabase placeholder keys** — `supabase.ts:22-29` si no hay credenciales, solo `console.warn` y crea cliente con placeholder URL/key. Las queries fallan silenciosamente sin alerta clara.
- [ ] **W-06: Credenciales auth hardcodeadas** — `auth.ts:11-14` email y password en source code. Mover a env vars antes de producción. También `TOKEN_PAYLOAD` hardcodeado en `auth.ts:23`.
- [ ] **W-07: AdminLayout elementos decorativos** — Search bar (`AdminLayout.astro:286`) sin funcionalidad. Botón "Nuevo" (`:312`) sin click handler. Badge de notificaciones hardcodeado "3" (`:306`).
- [ ] **W-08: Iniciales de usuario hardcodeadas** — `AdminLayout.astro:251` "JD" para Josue Calderon. Debería venir del usuario autenticado.

### 🟢 SUGERENCIAS

- [ ] **S-09: Sidebar usa SVG inline en vez de astro-icon** — `AdminLayout.astro` usa `<svg>` inline en toda la navegación. La tienda pública usa `astro-icon` + Solar Bold. Inconsistente.
- [ ] **S-10: Tipo Producto incluye categorías ajenas** — `types/admin.ts:34` incluye categorías "Cera de Ducha/Sabonete" del mock data viejo. Los tipos deberían reflejar el catálogo real de rapé/sananga/kuripe.
- [ ] **S-11: Tipo Cliente incluye regiones no operadas** — `types/admin.ts:8` incluye 'EU' y 'US'. El negocio solo opera en Colombia (CO) y Brasil (BR).
