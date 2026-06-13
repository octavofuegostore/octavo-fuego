# Octavo Fuego — Agent Instructions

## Project Identity
- **Repository**: Octavo Fuego — Rapé do Acre
- **Active directory**: `/Users/calderonjosue_/clientes/activos/octavo-fuego/`
- **Deploy**: Vercel (pendiente)

## Stack
- **Framework**: Astro 6.1.3 (SSG + View Transitions)
- **UI**: React 19 (islands), shadcn/ui 4.x, TailwindCSS 4.x
- **State**: Nanostores (cartStore + localStorage sync)
- **Ecommerce**: Bold Payment Gateway (pendiente integración)
- **CMS**: Keystatic (Git-based, Astro Content Collections)
- **Backend**: Medusa.js 2.x (pendiente)
- **Icons**: lucide-react
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
- Colors: white, negro (#000), tabaco (#8B4513), ceniza (#7b8084), humo (#2A2A2A), papel (#F5F5F0), verde-botanico (#6d5e4d)
- Shadows: 3-layer Airbnb system (--shadow-card, --shadow-hover)
- Border radius: 0px default, 8px buttons, 20px cards, 14px badges
- Fonts: Playfair Display (display), Inter (body)

### State
- Nanostores for cart state
- localStorage persistence
- Use `@nanostores/react` in React components

### i18n
- ES (default), EN, PT via JSON files
- Helper: `src/i18n/index.ts` with `useTranslations()`, `t()`

### SEO
- Schema markup via Astro components
- sitemap.xml, robots.txt via @astrojs/sitemap
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

## Testing
```bash
# (pendiente configurar)
vitest           # unit
playwright       # e2e
```

## Git Conventions
- Commit format: `[octavo-fuego] <description>`
- Main branch: `main`
- No remote configured yet

## Engram
- Project: `octavo-fuego`
- SDD artifacts persisted under topic keys: `sdd/octavo-fuego/*`
- Skill registry cached in session
