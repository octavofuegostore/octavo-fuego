# Skill Registry - Octavo Fuego
## Project: Ecommerce Website (Astro.js + TailwindCSS)

---

**Generated**: April 2026  
**Project**: octavo-fuego  
**Location**: ~/clientes/activos/octavo-fuego/  

---

## 🔧 Active Skills for This Project

### Core Development Stack

| Skill | Path | Trigger | Status |
|-------|------|---------|--------|
| **sdd-init** | `~/.config/opencode/skills/sdd-init/` | Initialize SDD context | ✅ Active |
| **sdd-explore** | `~/.config/opencode/skills/sdd-explore/` | Research & exploration | Ready |
| **sdd-propose** | `~/.config/opencode/skills/sdd-propose/` | Create change proposals | Ready |
| **sdd-spec** | `~/.config/opencode/skills/sdd-spec/` | Write specifications | Ready |
| **sdd-design** | `~/.config/opencode/skills/sdd-design/` | Technical design | Ready |
| **sdd-tasks** | `~/.config/opencode/skills/sdd-tasks/` | Task breakdown | Ready |
| **sdd-apply** | `~/.config/opencode/skills/sdd-apply/` | Implementation | Ready |
| **sdd-verify** | `~/.config/opencode/skills/sdd-verify/` | Verification | Ready |
| **sdd-archive** | `~/.config/opencode/skills/sdd-archive/` | Archive changes | Ready |

---

## 🛠 Tech Stack & Conventions

### Framework: Astro.js 4.x
- **Pattern**: Islands Architecture (Zero JS by default)
- **Templating**: `.astro` files with JSX-like syntax
- **Styling**: TailwindCSS utility classes
- **Content**: MDX for blog posts
- **Routing**: File-based routing

### Build System: Vite
- **Bundler**: Built into Astro
- **HMR**: Instant hot module replacement
- **Output**: Static site generation (SSG)

### Styling: TailwindCSS 3.x
- **Config**: `tailwind.config.js` with custom colors
- **Colors**: Black (#000), White (#FFF), Tabacco (#8B4513), Ash (#C0C0C0)
- **Fonts**: Playfair Display (serif), Inter (sans-serif)

### Ecommerce: Bold (Pasarela Multimodal)
- **Primary**: Bold Checkout (widget embebido)
- **Secondary**: Bold Link (links de pago para WhatsApp/redes)
- **Subscription**: Bold Subscriptions (Club Octavo Fuego)
- **Methods**: Tarjetas, PSE, Efecty/Baloto, Nequi/Daviplata
- **Approach**: Client-side hydration for cart + Bold SDK integration

### Hosting
- **Primary**: Vercel (recommended for Astro)
- **Alternative**: Netlify
- **CDN**: Cloudflare (DNS + caching)

---

## 📁 Project Structure

```
octavo-fuego/
├── .atl/
│   └── skill-registry.md         # This file
├── 01-estrategia/                # Business strategy (COMPLETE)
│   ├── octavo-fuego-master-document.md
│   ├── octavo-fuego-business-plan.md
│   ├── octavo-fuego-business-exploration.md
│   └── octavofuego_analisis_competitivo.md
├── 02-diseno/                    # Design & Copy (COMPLETE)
│   ├── octavo-fuego-copy.md
│   └── wireframes/
│       └── octavo-fuego-wireframes.md
├── 03-desarrollo/                # Technical specs (COMPLETE)
│   └── octavo-fuego-web-specs.md
├── 04-marketing/                 # Marketing strategy (COMPLETE)
│   └── seo/
│       └── octavo-fuego-seo-blog-strategy.md
├── 05-entrega/                   # Delivery docs (pending)
├── assets/                       # Project assets (pending)
│   ├── logo/
│   ├── fotos/
│   └── fuentes/
└── README.md
```

**Development workspace**: Create `src/` at root when starting development.

---

## 🎨 Design System Reference

### Color Palette
```css
--color-black: #000000;        /* Backgrounds, text */
--color-white: #FFFFFF;        /* Text on dark, backgrounds */
--color-tabacco: #8B4513;      /* CTAs, accents, warmth */
--color-ash: #C0C0C0;          /* Secondary text, hover */
--color-smoke: #2A2A2A;        /* Card backgrounds */
--color-paper: #F5F5F0;        /* Blog backgrounds */
```

### Typography
- **Headings**: Playfair Display (weights: 400, 600, 700)
- **Body**: Inter (weights: 400, 500, 600)
- **Scale**: H1 (64px/40px), H2 (48px/32px), H3 (32px/24px), Body (18px/16px)

### Components
- Buttons: Square corners (border-radius: 0), Tabacco primary
- Cards: Dark backgrounds (#2A2A2A), subtle borders
- Inputs: Transparent, bottom border only

---

## 🚀 SDD Workflow Commands

### Starting a Change
```
/sdd-new <change-name>          # Explore + propose new change
/sdd-continue [change]          # Continue existing change
/sdd-ff [change]                # Fast-forward: propose → spec → design → tasks
```

### Development Phases
```
/sdd-propose <change>           # Create/update proposal
/sdd-spec <change>              # Write specifications
/sdd-design <change>            # Create technical design
/sdd-tasks <change>             # Break down into tasks
/sdd-apply <change>             # Implement tasks
/sdd-verify <change>            # Verify implementation
/sdd-archive <change>           # Archive completed change
```

---

## 📋 Pre-Development Checklist

Before starting development, ensure:

- [ ] Astro.js project initialized
- [ ] TailwindCSS configured with custom colors
- [ ] Google Fonts (Playfair + Inter) loaded
- [ ] Project structure created (src/pages, src/components, etc.)
- [ ] Git repository initialized
- [ ] Vercel/Netlify project configured

---

## 🔗 Important References

### Documentation
- **Web Specs**: `03-desarrollo/octavo-fuego-web-specs.md`
- **Wireframes**: `02-diseno/wireframes/octavo-fuego-wireframes.md`
- **Copy**: `02-diseno/octavo-fuego-copy.md`
- **SEO Strategy**: `04-marketing/seo/octavo-fuego-seo-blog-strategy.md`

### External Resources
- [Astro Documentation](https://docs.astro.build)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Schema.org](https://schema.org) (for structured data)

---

## 📝 SDD Initialization Log

**Date**: April 2026  
**Mode**: Engram persistence  
**Engram ID**: #12  
**Topic Key**: sdd-init/octavo-fuego  

**Status**: ✅ Initialized and ready for development  
**Next**: Use `/sdd-new <change-name>` to start implementing features

---

*This registry is auto-generated. Update when adding new skills or changing conventions.*
