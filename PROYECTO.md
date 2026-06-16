# Octavo Fuego — Proyecto Completo

> **Single Source of Truth** — última actualización: Junio 15, 2026

---

## 1. Identidad

**Octavo Fuego** es un ecommerce de medicinas ancestrales amazónicas. Vendemos rapé del Acre brasileño directo de comunidades indígenas, con enfoque en comercio justo, transparencia de origen y contenido educativo.

### Propuesta de Valor
- Rapé 100% auténtico del Acre, Brasil
- Directo de comunidades tradicionales (Yawanawá, Nukini, Kaxinawá, Shanenawa)
- WhatsApp Commerce + Carrito digital
- Contenido educativo: blog, profecía, glosario

### Modelo de Negocio
- **D2C**: Venta directa al consumidor (Colombia, Latinoamérica)
- **B2B**: Wholesale a terapeutas y tiendas (500g+, $1.300/g)
- **Contenido**: Blog SEO + Guías educativas

---

## 2. Stack & Arquitectura

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | Astro (SSG) | 6.1.3 |
| UI | TailwindCSS + shadcn/ui + Radix | 4.x |
| Estado | Nanostores (carrito + localStorage) | — |
| i18n | Custom JSON (ES/EN/PT) + `[locale]` params | — |
| Iconos | astro-icon + Solar Bold + Phosphor | — |
| Deploy | Vercel (automático desde `main`) | — |
| SEO | Schema markup, sitemap, OG, robots.txt | — |

### Estructura del Proyecto

```
octavo-fuego/
├── PROYECTO.md                ← Este archivo (documento maestro)
├── README.md                  ← Overview rápido
├── PENDIENTES.md              ← Estado + design system extendido
├── AGENTS.md                  ← Instrucciones para AI agents
├── tasks.md                   ← Task tracking detallado
├── .atl/                      ← SDD artifacts
│   ├── design.md              ← Technical design
│   ├── specs/                 ← Specs (ecommerce, UI)
│   └── archive/               ← Closed changes
├── 01-estrategia/             ← Business docs
├── 02-diseno/                 ← Design & copy
├── 03-desarrollo/             ← Tech specs
├── 04-marketing/              ← SEO & marketing
├── 05-entrega/                ← Delivery docs
└── src-astro/                 ← Astro project root
    ├── astro.config.mjs
    ├── src/
    │   ├── components/        ← UI, product, cart, checkout, seo
    │   ├── data/              ← products.ts, prophecy.ts, glossary.ts
    │   ├── i18n/              ← es.json, en.json, pt.json
    │   ├── layouts/           ← Layout.astro
    │   ├── pages/             ← [locale]/*, carrito, checkout, blog
    │   ├── stores/            ← cartStore.ts (Nanostores)
    │   └── styles/            ← global.css
    └── dist/                  ← Build output
```

---

## 3. Productos

5 variedades de Rapé do Acre con precios unificados:

| # | Rapé | Etnia | Intención | Precio/g |
|---|------|-------|-----------|----------|
| 1 | Tisunú | Yawanawá | Energético — Reset Energético | $3.500 |
| 2 | Pixurí | Nukini | Medicinal — Bienestar Físico | $3.500 |
| 3 | Pariká | Kaxinawá | Espiritual — Conexión Espiritual | $3.500 |
| 4 | Cumarú de Cheiro | Yawanawá | Mixto — Protección | $3.500 |
| 5 | Vena de Pajé | Shanenawa | Mixto — Claridad Mental | $3.500 |

**Precios:** 10g $35.000 · 20g $70.000 · 30g $100.000 · Wholesale 500g+ $1.300/g

---

## 4. Sistema de Diseño

### Estética
- **Nombre:** Minimalist Sacred
- **Filosofía:** "Medicina ancestral para el alma moderna"
- **Inspiración:** Waking Herbs + Airbnb Design System
- **Principios:** Blanco-first, fotografía protagonista, sombras sutiles, espacios generosos

### Paleta de Colores

```css
/* Base */
--tabaco-base: #6d5e4d;                   /* Marrón tabaco - identidad */
--near-black: #222222;                     /* Texto principal */
--ceniza: #7b8084;                        /* Texto secundario */

/* Action tokens */
--color-action-primary: var(--tabaco-base); /* Botones CTA, accents */
--color-action-hover: #5a4d3f;              /* Hover (~15% darker) */
--color-action-subtle: #C4956A;             /* Bordes, highlights */

/* Surface tokens */
--color-surface-base: #ffffff;              /* White */
--color-surface-warm: #F2EFE8;             /* Cream cálido */
--color-surface-dark: #2A2A2A;             /* Gris oscuro */

/* Section backgrounds */
--color-footer-bg: #3D2E22;                /* Footer + secciones oscuras */

/* Text tokens */
--color-text-primary: #1C1410;             /* Headings */
--color-text-secondary: #8C8680;           /* Meta */
--color-text-on-dark: #F2EFE8;             /* Sobre fondos oscuros */
--color-text-on-action: #F2EFE8;           /* Sobre action-primary */

/* Semantic colors */
--whatsapp: #25D366;
--success: #22C55E;
--error: #EF4444;
--warning: #F59E0B;
```

### Dark Sections

| Sección | Background | Texto body | Iconos |
|---------|-----------|-----------|--------|
| Footer | `--color-footer-bg` (#3D2E22) | `--color-text-on-dark` | sólido white |
| Trust Badges | `--color-action-hover` (#5a4d3f) | `--color-text-on-dark`/80 | sólido white |

Ritmo visual del homepage: `white → tabaco medio → cream → white → cream → tabaco oscuro`

### Tipografía
- **Display/Headings:** Playfair Display (serif)
- **Body/UI:** Inter (sans-serif)

### Iconografía

**Regla:** Fondo claro → DUOTONE / Fondo oscuro → SÓLIDO

**Fondo claro:**
- UI: Solar Bold-Duotone (letter, chat-round, map-point, shield, leaf, eye, lightning, heart, moon, star, etc.)
- Social: Phosphor Duotone (instagram-logo, facebook-logo, whatsapp-logo)

**Fondo oscuro:**
- UI: Solar Bold (letter-bold, chat-round-bold, map-point-bold, shield-bold, leaf-bold, cloud-waterdrop-bold)
- Social: Phosphor Fill (instagram-logo-fill, facebook-logo-fill, whatsapp-logo-fill)
- Todos con `text-white`

**NO USAR:** `lucide-react` (bug SSR en Astro — no forwardea `class` prop)
**Solar NO tiene:** droplet, spark, bag, logos de marca — verificar en Iconify

### Sombras (Airbnb 3-layer)

```css
--shadow-card: rgba(0,0,0,0.02) 0px 0px 0px 1px,
               rgba(0,0,0,0.04) 0px 2px 6px,
               rgba(0,0,0,0.1) 0px 4px 8px;
```

---

## 5. Páginas del Sitio

| Ruta | Página | Estado |
|------|--------|--------|
| `/` | Homepage (Hero, Trust Badges, Profecía, Intenciones, Productos) | ✅ |
| `/tienda/` | Catálogo principal | ✅ |
| `/tienda/rape/` | Categoría Rapé (5 productos) | ✅ |
| `/tienda/rape/[product]` | Detalle de producto (PDP) | ✅ |
| `/profecia/` | Profecía completa | ✅ |
| `/carrito/` | Carrito de compras | ✅ |
| `/checkout/` | Checkout (4 pasos) | ✅ |
| `/blog/` | Blog listing | ✅ |
| `/blog/[slug]` | Blog post | ✅ |

---

## 6. i18n

3 idiomas con routing `[locale]`:

| Locale | Archivo | Ruta | Status |
|--------|---------|------|--------|
| ES (default) | `es.json` | `/` (sin prefijo) | ✅ |
| EN | `en.json` | `/en/` | ✅ |
| PT | `pt.json` | `/pt/` | ✅ |

**Helper:** `src/i18n/index.ts` — `useTranslations()`, `t()`

---

## 7. SEO (Auditado + Corregido — Junio 15, 2026)

### Schema Coverage: 100%

| Schema | Páginas | Cantidad |
|--------|---------|----------|
| Organization | Todas (global) | 1 |
| Product | PDP rapé | 15 (5 productos × 3 locales) |
| BreadcrumbList | PDP rapé | 15 (5 productos × 3 locales) |
| BlogPosting (Article) | Blog posts | 4 |
| ItemList | `/tienda/rape/` + `/tienda/` | 6 (2 páginas × 3 locales) |

### Schema Details

**ProductJsonLd:**
- `@id` cross-referenced con Breadcrumb
- `mainEntityOfPage` → URL canónica del PDP
- `itemCondition`: `https://schema.org/NewCondition`
- `additionalProperty`: peso (10g/20g/30g), etnia, intención
- `priceValidUntil`: +1 año desde hoy
- `seller.@id` → OrganizationJsonLd
- `priceCurrency`: `COP` (único para todos los locales)

**OrganizationJsonLd:**
- `logo` → `/logo.png`
- `foundingDate`: `2026-03-28`
- `knowsAbout` con `description` (rapé, sananga, medicinas ancestrales)
- `sameAs`: Instagram, Facebook, WhatsApp
- `address`: ciudad/estado/país (sin calle, no verificable)

**ItemList:**
- `numberOfItems`: 5 (los 5 rapés)
- Cada item con `position`, `url`, `image`
- `priceCurrency`: `COP`

### SEO Técnico
- Hreflang tags ES/EN/PT (corregido — antes faltaban)
- og:image → `/logo.png` (corregido — antes roto)
- Heading hierarchy corregida
- Img width/height en todas las imágenes
- Sitemap.xml + robots.txt
- 404 page personalizada

### Pendiente
- Google Search Console + verificación de indexación
- Core Web Vitals optimizados (LCP < 2.5s)
- Imágenes reales de productos (placeholder actual: bobinsana-rape-2.webp)
- og:image social card real (1200×630)

---

## 8. Git Workflow

### Ramas
```
main     ← producción (merge solo con autorización)
  ↑
develop  ← desarrollo activo (push SIEMPRE aquí)
  ↑
feature/* ← features experimentales
```

### Reglas
1. Trabajar en **LOCAL** (`develop` o `feature/*`)
2. Push a `origin/develop` **SIEMPRE**
3. Merge a `main` **SOLO cuando el usuario autorice explícitamente**
4. Nunca force-push, nunca amend commits pusheados

### Commits
```
[octavo-fuego] <tipo>: <descripción en inglés>
```
Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

---

## 9. Roadmap

| Fase | Progreso | Status |
|------|----------|--------|
| 01 Estrategia | 100% | ✅ Completado |
| 02 Diseño | 100% | ✅ Completado |
| 03 Desarrollo (Core) | 95% | 🔄 Casi listo |
| 04 Marketing/SEO | 80% | 🔄 En progreso |
| 05 Testing & Polish | 30% | ⏳ Pendiente |
| 06 Lanzamiento | 10% | ⏳ Pendiente |
| 07 Arquitectura Progresiva | 0% | ⏳ Del MVP al Manifiesto (3 fases) |

### Arquitectura Progresiva (ARCHITECTURE.md §0)

```
[MVP de Acero] ──➔ [Centralización] ──➔ [Escala Élite]
   semanas              meses               trimestres
```

#### 7.1 MVP de Acero — Ya en marcha
- Astro SSG + JSON estático + WhatsApp checkout
- Validar demanda Colombia + Brasil. Facturar.

#### 7.2 Centralización — Cuando WhatsApp colapse
- Monodominio + Medusa Cloud + Astro SSR
- Automatizar pagos B2C en CO y BR

#### 7.3 Escala Élite — Cuando Brasil justifique inversión
- Monorepo dual-domain + `.com.br` + B2B automatizado
- Manifiesto completo (ARCHITECTURE.md §1-9)

### Por hacer (urgente)
- Imágenes reales de los 5 rapés
- Google Search Console + indexación
- Core Web Vitals optimizados (LCP < 2.5s)

### Post-lanzamiento
- Campaña redes sociales
- Prospección B2B
- Email marketing
- Sistema de reseñas
- Blog semanal

---

## 10. Links

| Recurso | URL |
|---------|-----|
| **Producción** | [www.octavofuego.com](https://www.octavofuego.com) |
| **GitHub** | [octavofuegostore/octavo-fuego](https://github.com/octavofuegostore/octavo-fuego) |
| **Instagram** | [@octavofuego](https://instagram.com/octavofuego) |
| **Facebook** | [@octavofuego](https://facebook.com/octavofuego) |
| **WhatsApp** | [+57 317 2137932](https://wa.me/573172137932) |
| **Email** | hola@octavofuego.com |

### Documentos Relacionados
| Documento | Propósito |
|-----------|-----------|
| `PROYECTO.md` | **← Este archivo** — Documento maestro |
| `ARCHITECTURE.md` | Manifiesto de ingeniería (monorepo + Medusa SSR) |
| `README.md` | Overview rápido |
| `PENDIENTES.md` | Estado detallado + design system extendido |
| `AGENTS.md` | Instrucciones para AI agents |
| `tasks.md` | Task tracking |
| `.atl/design.md` | Technical design document |
| `.atl/specs/ecommerce-spec.md` | Especificaciones ecommerce |
| `.atl/specs/ui-spec.md` | Especificaciones UI |

---

## 11. Memoria Persistente (Engram)

La memoria del proyecto persiste entre sesiones vía **Engram**. Buscar estas `topic_key` para recuperar contexto:

| Topic Key | Contenido |
|-----------|-----------|
| `docs/proyecto-md` | PROYECTO.md como single source of truth |
| `architecture/footer-design` | Footer redesign — Option B sólido tabaco-dark |
| `architecture/trust-badges-section-dark-background` | Trust Badges con fondo tabaco medio |
| `bug/solid-icons-replace-duotone-in-footer` | Duotone → sólido para máximo contraste |
| `debt/brl-currency-schema-coupling` | Deuda: si se agrega BRL → actualizar schema al mismo tiempo |
| `architecture/manifesto-v1` | Manifiesto de ingeniería — monorepo, Medusa SSR, B2B, CI/CD |
| `config/updated-md-docs-with-dark-sections` | Documentación actualizada post dark sections |
| `decision/sdd-proposal-footer-bg-tabaco-created` | SDD proposal para footer redesign |
| `sdd/footer-bg-tabaco/proposal` | Propuesta formal SDD |
| `sdd/footer-bg-tabaco/tasks` | Task breakdown SDD |
| `sdd/footer-bg-tabaco/archive-report` | Verificación y cierre SDD |

**Cómo recuperar contexto en una sesión nueva:**
```
mem_search(query: "docs/proyecto-md", project: "octavo-fuego")
mem_get_observation(id: <ID>)  ← contenido completo
```

---

*Documento maestro generado: Junio 15, 2026*
*Última actualización: Junio 15, 2026*
*Último commit en main: `44ec78d`*
