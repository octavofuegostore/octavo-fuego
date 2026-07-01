# Octavo Fuego — Agent Instructions

## Project Identity
- **Repository**: Octavo Fuego — Rapé do Acre
- **Repo URL**: `https://github.com/octavofuegostore/octavo-fuego`
- **Active directory**: `/Users/calderonjosue_/clientes/activos/octavo-fuego/`
- **Git Author**: Josue Calderon - Navio Azul `<luisjosue1205@gmail.com>`
- **Deploy**: Vercel (pendiente)

## Stack
- **Framework**: Astro 6.1.3 (SSG + View Transitions)
- **UI**: React 19 (islands), shadcn/ui 4.x, TailwindCSS 4.x
- **State**: Nanostores (cartStore + localStorage sync)
- **Ecommerce**: Bold Payment Gateway (pendiente integración)
- **CMS**: Keystatic (Git-based, Astro Content Collections)
- **Backend**: Medusa.js 2.x (pendiente)
- **Icons**: `astro-icon` + `@iconify-json/solar` (Solar Bold-Duotone) + `@iconify-json/ph` (Phosphor Duotone)
- **Fonts**: Playfair Display (headings), Inter (body)

## Available Skills for This Project

| Skill | Trigger | Path |
|-------|---------|------|
| sdd-init | SDD initialization | `~/.config/opencode/skills/sdd-init/` |
| sdd-explore | Research & exploration | `~/.config/opencode/skills/sdd-explore/` |
| sdd-propose | Create proposals | `~/.config/opencode/skills/sdd-propose/` |
| sdd-spec | Write specs | `~/.config/opencode/skills/sdd-spec/` |
| sdd-design | Technical design | `~/.config/opencode/skills/sdd-design/` |
| sdd-tasks | Task breakdown | `~/.config/opencode/skills/sdd-tasks/` |
| sdd-apply | Implementation | `~/.config/opencode/skills/sdd-apply/` |
| sdd-verify | Verification | `~/.config/opencode/skills/sdd-verify/` |
| sdd-archive | Archive changes | `~/.config/opencode/skills/sdd-archive/` |
| branch-pr | PRs | `~/.config/opencode/skills/branch-pr/` |
| chained-pr | Stacked PRs | `~/.config/opencode/skills/chained-pr/` |
| work-unit-commits | Commit splitting | `~/.config/opencode/skills/work-unit-commits/` |
| react-19 | React patterns | `~/.config/opencode/skills/react-19/` |
| typescript | TS strict mode | `~/.config/opencode/skills/typescript/` |

## Project Structure
```
octavo-fuego/
├── AGENTS.md                  # This file
├── README.md                  # Project overview
├── tasks.md                   # Implementation tracking
├── .atl/                      # SDD artifacts
│   ├── design.md              # Technical design
│   ├── tasks.md               # Task checklist
│   ├── skill-registry.md      # Registered skills
│   ├── specs/                 # Specifications
│   │   ├── ecommerce-spec.md
│   │   └── ui-spec.md
│   ├── sdd/                   # SDD changes
│   │   └── design-refresh-airbnb-style/
│   └── archive/               # Closed changes
├── 01-estrategia/             # Business strategy
├── 02-diseno/                 # Design & copy
├── 03-desarrollo/             # Technical specs
├── 04-marketing/              # Marketing & SEO
├── 05-entrega/                # Delivery docs
└── src-astro/                 # Astro project root
    ├── astro.config.mjs
    ├── src/
    │   ├── components/        # UI, product, cart, checkout, seo, quiz
    │   ├── layouts/           # Layout.astro
    │   ├── pages/             # index, tienda, carrito, checkout, blog
    │   ├── stores/            # cartStore.ts (Nanostores)
    │   ├── i18n/              # es.json, en.json, pt.json
    │   ├── content/           # Keystatic blog/pages
    │   ├── styles/            # global.css
    │   └── lib/               # Utils
    └── dist/                  # Build output
```

## Commands
```bash
npm run dev      # localhost:4321
npm run build    # production build to dist/
npm run preview  # preview production build
```

## Code Conventions

### Astro Components
- `.astro` files for static/SSG content
- React islands for interactive components (.tsx)
- Default exports: `export default function ComponentName()`
- "use client" directive not needed (React islands run client-side automatically in Astro)

### TypeScript
- React components: type props explicitly
- Components use `{ children: React.ReactNode }` when needed
- Astro frontmatter: use `---` fences

### Styling
- TailwindCSS 4.x utility classes
- Custom CSS variables in `:root` of global.css
- **Colors**: Usar tokens funcionales (`--color-action-primary`, `--color-surface-*`, etc.) en nuevo código. Legacy tokens (`--humo`, `--papel`) siguen funcionando pero están deprecated.
- Shadows: 3-layer Airbnb system (--shadow-card, --shadow-hover)
- Border radius: 0px default, 8px buttons, 20px cards, 14px badges
- Fonts: Playfair Display (display), Inter (body)

### Semantic Colors
| Token | Hex | Uso |
|-------|-----|-----|
| `--whatsapp` | #25D366 | Botón WhatsApp |
| `--success` | #22C55E | Estados éxito |
| `--error` | #EF4444 | Estados error |
| `--warning` | #F59E0B | Estados warning |

### Icon System (OBLIGATORIO)
- **NUNCA usar `lucide-react`** — tiene bug SSR en Astro (no forwardea `class` prop)
- **SIEMPRE usar `astro-icon`** con Solar o Phosphor
- Sintaxis: `import { Icon } from 'astro-icon/components'` → `<Icon name="solar:icon-name-bold" class="w-7 h-7" />`

**Fondo claro → DUOTONE:**
- Iconos UI → Solar Bold-Duotone: `letter-bold-duotone`, `chat-round-bold-duotone`, `map-point-bold-duotone`, `shield-bold-duotone`, `cloud-waterdrop-bold-duotone`, `leaf-bold-duotone`, `eye-bold-duotone`, `lightning-bold-duotone`, `heart-bold-duotone`, `moon-bold-duotone`, `star-bold-duotone`
- Logos sociales → Phosphor Duotone: `instagram-logo-duotone`, `facebook-logo-duotone`, `whatsapp-logo-duotone`

**Fondo oscuro → SÓLIDO:**
- Iconos UI → Solar Bold: `letter-bold`, `chat-round-bold`, `map-point-bold`, `leaf-bold`, `shield-bold`, `cloud-waterdrop-bold`
- Logos sociales → Phosphor Fill: `instagram-logo-fill`, `facebook-logo-fill`, `whatsapp-logo-fill`
- Todos con `text-white` (máximo contraste)

- **Solar NO tiene logos de marca ni droplet/spark/bag** — verificar antes de usar
- Verificar nombres exactos en Iconify antes de implementar

### State
- Nanostores for cart state
- localStorage persistence
- Use `@nanostores/react` in React components

### i18n
- ES (default), EN, PT via JSON files
- Helper: `src/i18n/index.ts` with `useTranslations()`, `t()`

### SEO
- Schema markup via Astro components: Organization, Product (×15), BreadcrumbList (×15), BlogPosting/Article (×4), ItemList (×6)
- `priceCurrency`: `COP` — único para todos los locales. Si se agrega BRL, actualizar ItemList + ProductJsonLd en el mismo commit.
- sitemap.xml, robots.txt via @astrojs/sitemap
- Hreflang tags ES/EN/PT
- OpenGraph + Twitter Card meta tags

## Design System

### Voice & Tone
- **Persona**: Maestro-Contador de Historias
- **Tono**: Cálido, poético pero claro, respetuoso pero cercano
- **Perspectiva**: "Nosotros" (no "yo" ni "tú")

### Theme
- **Estética**: Minimalist Sacred — blanco puro, sombras sutiles, fotografía-first
- **Inspiración**: Waking Herbs + Airbnb Design System
- **Filosofía**: "Medicina ancestral para el alma moderna"

### Color Palette (CSS Variables)
| Token | Hex | Uso | Status |
|-------|-----|-----|--------|
| `--white` | #ffffff | Fondo principal | ✅ |
| `--negro` | #000000 | Headings | ✅ |
| `--near-black` | #222222 | Texto body | ✅ |
| `--tabaco` | #8B4513 | Acento ocasional | ✅ |
| `--ceniza` | #7b8084 | Textos secundarios | ✅ |
| `--humo` | #2A2A2A | Footer | ✅ → usar `--color-surface-dark` |
| `--papel` | #F5F5F0 | Secciones contrastadas | ✅ → usar `--color-surface-warm` |
| `--color-action-primary` | #6d5e4d | Acento principal | ✅ Token activo |

### Functional Token System (Híbrido)
```css
/* Base semánticamente correcto */
--tabaco-base: #6d5e4d;

/* Action tokens (token activo) */
--color-action-primary: var(--tabaco-base);
--color-action-hover: #5a4d3f;
--color-action-subtle: #C4956A;

/* Surface tokens */
--color-surface-base: #ffffff;
--color-surface-warm: #F2EFE8;
--color-surface-dark: #2A2A2A;

/* Section backgrounds */
--color-footer-bg: #3D2E22;           /* Footer + secciones oscuras */

/* Text tokens */
--color-text-primary: #1C1410;
--color-text-secondary: #8C8680;
--color-text-on-action: #F2EFE8;
--color-text-on-dark: #F2EFE8;

/* Border tokens */
--color-border-default: #C4956A;
--color-border-subtle: #E8E0D5;
```

**Migration path:**
1. Nuevo código usa `--color-action-primary`
2. Post-launch: eliminar el alias deprecated de global.css

## Work Decomposition (OBLIGATORIO)

Todo trabajo que involucre múltiples cambios se desglosa con esta estructura granular:

**Formato:** `{Fase}.{Grupo}.{Tarea}`

```
Fase 1: Fix Critical Bugs
  1.1 CustomerDetail
    1.1.1 Conexión real a service.getClienteById()
    1.1.2 Reemplazar data mock con props dinámicas
    1.1.3 Mostrar órdenes reales del cliente
  1.2 OrderDetail
    1.2.1 ...
```

**Reglas:**
- Cada `X.Y.Z` es una unidad atómica — se implementa, verifica y commitea independientemente
- Las tareas se ejecutan en orden numérico estricto (dependencias respetadas)
- Una tarea `X.Y.Z` no depende de nada fuera de lo ya implementado en `X.Y.Z-1`
- Siempre que se delega a un sub-agente, se pasa la tarea exacta con su contexto mínimo necesario (archivos involucrados, no el proyecto entero)
- Esto aplica tanto a SDD como a trabajo directo (no-SDD)

## Testing
```bash
# (pendiente configurar)
vitest           # unit
playwright       # e2e
```

## Git Conventions
- Commit format: `[octavo-fuego] <description>`
- Branch strategy: `main` (producción) ← `develop` (desarrollo) ← `feature/*`
- **Git Workflow** (OBLIGATORIO):
  1. Trabajar en LOCAL (`develop` o `feature/*`)
  2. Push a `origin/develop` SIEMPRE
  3. **Merge a `main` SOLO cuando el usuario autorice explícitamente**
  4. Nunca mergear a `main` sin autorización, sin importar la urgencia
- Remote: `origin` → `https://github.com/octavofuegostore/octavo-fuego`
- Author: Josue Calderon - Navio Azul `<luisjosue1205@gmail.com>`

## Engram
- Project: `octavo-fuego`
- **Documento maestro**: `PROYECTO.md` + `mem_search("docs/proyecto-md", project: "octavo-fuego")`
- SDD artifacts persisted under topic keys: `sdd/octavo-fuego/*`
- Skill registry cached in session

### Key Topic Keys
| Topic Key | What |
|-----------|------|
| `docs/proyecto-md` | PROYECTO.md single source of truth |
| `architecture/footer-design` | Footer design decisions |
| `architecture/trust-badges-section-dark-background` | Trust Badges design |
| `debt/brl-currency-schema-coupling` | Deuda: si se agrega BRL → actualizar schema al mismo tiempo |
| `sdd/footer-bg-tabaco/*` | SDD cycle completo |
