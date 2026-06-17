# Octavo Fuego — Agent Instructions

## Project Identity
- **Repository**: Octavo Fuego (Astro ecommerce + admin panel)
- **Active directory**: `/Users/calderonjosue_/clientes/activos/octavo-fuego/src-astro/`
- **Branch**: `develop` (work in progress)

## Stack
- **Framework**: Astro 6.1.3 (hybrid mode, Vercel adapter)
- **Language**: TypeScript (strict mode)
- **UI**: TailwindCSS 4, shadcn/ui (base-nova), Radix UI, React islands
- **State**: Nanostores (cart)
- **i18n**: 3 locales (`es`, `en`, `pt`), `prefixDefaultLocale: false`
- **Auth**: Hardcoded SHA-256 cookie (`of_admin_token`), `src/lib/auth.ts`
- **Charts**: Pure SVG inline (no Recharts yet for UI-only phase)
- **Icons**: astro-icon (Solar + Phosphor sets), lucide-react (admin)
- **Deploy**: Vercel (`@astrojs/vercel`, hybrid output)

## Project Structure
```
src-astro/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── dashboard/      # StatsCard, charts
│   │   │   ├── customers/      # CustomerTable
│   │   │   └── contabilidad/   # KpiCard, GraficaBarras, GraficaLíneas,
│   │   │                         TransaccionTable, InformesTabs, PaginationControls
│   │   ├── cart/               # CartDrawer (React island)
│   │   ├── checkout/           # CheckoutForm (Nanostores + Bold)
│   │   ├── Navbar.astro        # Public navbar (5 items)
│   │   ├── Footer.astro        # Locale-aware
│   │   └── ui/                 # shadcn/ui primitives
│   ├── layouts/
│   │   ├── Layout.astro        # Public layout
│   │   └── AdminLayout.astro   # Admin sidebar + header + logout
│   ├── lib/
│   │   ├── auth.ts             # SHA-256 auth (validateCredentials, generateToken, verifyToken)
│   │   ├── supabase.ts         # Supabase client
│   │   └── admin/contabilidad/mock.ts  # Mock data (Phase 1 UI-only)
│   ├── middleware/
│   │   └── auth.ts             # Locale redirect + cookie auth
│   ├── pages/
│   │   ├── [locale]/           # Public pages (tienda, profecia, etc.)
│   │   ├── admin/              # Admin panel
│   │   │   ├── index.astro     # Dashboard (prerender=false)
│   │   │   ├── login.astro     # Login (prerender=false, fetch-based)
│   │   │   ├── clientes/       # Customer management
│   │   │   ├── inventario/     # Inventory + stock + transfers
│   │   │   ├── ordenes/        # Orders
│   │   │   ├── contabilidad/   # Accounting (Dashboard, Transacciones, Informes)
│   │   │   └── configuracion/  # Settings
│   │   ├── api/auth/           # login.ts, logout.ts (prerender=false)
│   │   └── carrito/            # Cart page
│   ├── styles/
│   │   └── global.css          # Design tokens (CSS custom properties)
│   └── i18n/                   # es.json, en.json, pt.json
├── public/images/
├── ../.atl/proposals/           # SDD proposals (moved to repo root)
├── openspec/changes/           # SDD artifacts (optional)
└── package.json
```

## Design System
- **Colors**: Negro (#000), Blanco (#FFF), Tabaco (#8B4513), Ceniza (#7b8084), Humo (#2A2A2A), Papel (#F5F5F0)
- **Typography**: Playfair Display (titles/h1), Inter (body)
- **Borders**: rounded-2xl (cards), rounded-xl (inputs), rounded-lg (buttons/sidebar)
- **Shadows**: shadow-card (cards)
- **Style**: Minimalist Sacred — white-first, clean spacing

## 🛒 Public Ecommerce (Tienda)

### Public Routes
- `/[locale]/` — Homepage (hero, quiz, productos, confianza, newsletter)
- `/[locale]/profecia` — Profecía de los Siete Fuegos
- `/[locale]/tienda` — Catálogo de rapés
- `/[locale]/tienda/rape/[product]` — Detalle de producto
- `/carrito` — Carrito (Nanostores + localStorage)
- `/checkout` — Checkout (WhatsApp-first)
- `/blog` — Blog listing
- `/blog/[slug]` — Post individual

### Cart & Checkout
- **Cart Store**: Nanostores (`cartStore`) + localStorage persistence
- **CartDrawer**: React island with item list, quantity controls, subtotal
- **Checkout**: WhatsApp-first — "Consultar por WhatsApp" opens pre-filled message with product details + price
- **Payment**: Via WhatsApp (transferencia, PSE, tarjeta). Bold integration planned for Fase 2.

### i18n — 3 Locales
- `prefixDefaultLocale: false` → ES at root (`/tienda`), EN at `/en/tienda`, PT at `/pt/tienda`
- `LanguageSwitcher` preserves current page across locales
- Translations: `src/i18n/{es,en,pt}.json`
- Helper: `useTranslations(locale)` / `t()` from `src/i18n/index.ts`

### Product Data
- Source: `src/data/products.ts` — 5 rapés × 3 idiomas (static TS, no CMS)
- Varieties: Kaxinawá, Nukini, Apurinã, Kuntanawa, Katukina
- Price tiers: 10g / 20g / 30g
- Future: Supabase-backed via L-Medusa (Fase 3)

### Key Components
| Component | Type | Description |
|-----------|------|-------------|
| Navbar.astro | Astro | 5 items + LanguageSwitcher + cart badge |
| Footer.astro | Astro | 4-column locale-aware footer |
| ProductCard.astro | Astro | Product card in catalog |
| PricingTable.astro | Astro | Price selector (10g/20g/30g) |
| CartDrawer.astro | React island | Cart with Nanostores |
| CheckoutForm.astro | React island | Multi-step checkout form |
| FloatingWhatsApp.astro | Astro (0KB JS) | WhatsApp CTA floating button |

## ⚠️ Constraints (Do NOT Violate)

| # | Constraint | Detail |
|---|------------|--------|
| 1 | **Navbar INMUTABLE** | 5 items exactos (Inicio, Tienda, Blog, Nosotros, Carrito). No agregar ni quitar ni renombrar. |
| 2 | **No Supabase Pro** | $0 budget. Free Tier only. pg_cron NOT available. Edge Functions with on-demand triggers. |
| 3 | **Build before commit** | Always run `npm run build` — 0 errors required before considering work done. |
| 4 | **SSR for admin only** | Admin pages → SSR (`prerender = false`). Public pages → SSG (static). Hybrid mode. |
| 5 | **Single admin** | Contabilidad runs INSIDE OF admin panel. NOT a separate app. |
| 6 | **No borrar de archivos .md** | En AGENTS.md, PENDIENTES.md, INDEX.md, README.md y cualquier .atl: **agregar y modificar SÍ, borrar NO sin confirmación explícita del usuario.** Las listas de tareas completadas, referencias engram y notas técnicas se preservan siempre. Solo se reorganizan o expanden. |

## 🛠️ Dev Server Lifecycle

```bash
# Kill Pipod dashboard on port 4321 first
lsof -ti:4321 | xargs kill -9 2>/dev/null

# Start Octavo Fuego (survives bash termination)
nohup npm run dev > /tmp/of-dev.log 2>&1 &

# Verify: wait for "Local: http://localhost:4321" in the log
tail -f /tmp/of-dev.log
```

## Admin Panel (Protected Routes)
- **Auth**: `POST /api/auth/login` → 200 `{success:true}` + `of_admin_token` cookie
- **Credentials**: `admin@octavofuego.com` / `octavo2026` (hardcoded, `src/lib/auth.ts:11-14`)
- **Cookie**: `of_admin_token`, SHA-256, httpOnly, path=/, sameSite=lax, maxAge=7d
- **Middleware**: Strips locale prefix `(es|en|pt)`, verifies cookie, redirects to `/admin/login`
- **Prerender**: ALL admin pages MUST have `export const prerender = false` (SSR for cookies)

## Auth System (Critical — Read Before Touching)

### Known Issue: Prerendered Pages Strip Headers
In `output: 'hybrid'` mode with Vite dev server, prerendered pages have `request.headers` completely empty.
**Fix**: Add `export const prerender = false;` as the first line of frontmatter in ALL admin `.astro` pages.

### Login Flow
```
1. User visits /admin/login
2. Form submits: fetch POST /api/auth/login with { email, password }
3. Server returns 200 { success: true } + sets of_admin_token cookie
4. Client JS: window.location.href = '/admin'
5. Middleware verifies cookie → OK → renders admin dashboard
```

### Middleware Flow
```
1. Strip /(es|en|pt)/ prefix from admin/api paths → 302 redirect
2. Skip auth for /admin/login and /api/*
3. Read of_admin_token cookie → verifyToken()
4. If invalid → 302 redirect to /admin/login
5. If valid → pass through (next())
```

## Key Decisions
- **Auth is hardcoded** — No Supabase Auth. Single user: admin@octavofuego.com / octavo2026
- **Everything in one admin** — Accounting integrated into OF admin, NOT separate app
- **UI-only Phase 1** — Contabilidad uses mock data, pure Astro + SVG. React islands for Phase 4+ (Supabase-backed)
- **Contabilidad sidebar**: Flat list, no section headers. After Clientes, before Configuración. 3 subitems (Dashboard, Transacciones, Informes)
- **Sidebar design**: Flat (unlike Pipod's grouped sections). OF is NOT Pipod.
- **Locale handling**: `prefixDefaultLocale: false` — Spanish at `/admin`, EN at `/en/admin`, PT at `/pt/admin`

## 📚 Documentation Map

| Doc | Path | Qué cubre |
|-----|------|-----------|
| Project Overview | `../../PROYECTO.md` | Identidad, roadmap, modelo de negocio |
| Architecture | `../../ARCHITECTURE.md` | Manifiesto técnico, 3 fases, monorepo |
| Full Index | `docs/INDEX.md` | Mapa de los 25 documentos principales |
| L-Medusa Architecture | `../.atl/l-medusa-architecture.md` | Backend Supabase-First |
| L-Medusa Specs | `../.atl/specs/l-medusa-complete-specs.md` | Requirements formales |
| SEO Strategy | `../.atl/arquitectura-seo-transnacional.md` | 3 mercados, keywords |
| Contabilidad Plan | `../.atl/proposals/contabilidad-integration-plan.md` | Integración contable |
| Session Jun 16 | `../.atl/sesion-completa-junio-16-2026.md` | Decisiones consolidadas |
| SDD Artifacts | `openspec/changes/` | Cambios implementados/verificados |

## Commands
| Command | Action |
|---------|--------|
| `npm run dev` | Start dev server (port 4321) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## Testing
```bash
npm run build     # Verify build passes (zero errors)
```

## Conventions
- **Frontmatter**: `prerender = false` as FIRST line in all admin pages
- **Components**: Default exports, typed Props interface
- **Path alias**: `@/*` maps to `./src/*`
- **Imports**: `@/lib/auth`, `@/components/admin/...`, `@/lib/admin/contabilidad/mock`
- **SVG in Astro**: SVG elements CANNOT use Tailwind classes — use `font-size="10"`, `fill="#7b8084"`, etc.
- **Commit format**: `[octavo-fuego] <description>`
- **Engram project**: `octavo-fuego`

## Git Conventions
- Work on `develop`, merge to `main` when ready
- Commit push only via user request

## Engram Reference
| Topic | Key |
|-------|-----|
| Admin auth system | `sdd/admin-auth-system/*` |
| Contabilidad integration plan | `../.atl/proposals/contabilidad-integration-plan.md` |
| Contabilidad UI module | `sdd/contabilidad-ui-module/*` |
| Login redirect loop fix | `bugfix/login-redirect-loop` |
