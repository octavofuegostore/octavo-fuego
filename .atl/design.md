# DESIGN: Octavo Fuego Ecommerce MVP

## Technical Approach

Nuevo proyecto ecommerce: Astro 6.x frontend + Medusa.js 2.x backend headless. Nanostores para estado del carrito con persistencia en localStorage. Integración Bold para pagos. UI con TailwindCSS + shadcn/ui adaptada al branding "Minimalist Sacred".

---

## Architecture Decisions

### Decision 1: Astro 6.x vs Next.js

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Astro 6.x | Zero JS default, mejor SEO, SSG nativo | ✅ Elegido |
| Next.js 14 | React requerido, más complejo para este caso | ❌ Descartado |

**Rationale**: Astro es más ligero y SEO-friendly. Para un ecommerce de contenido con mucho texto, es ideal.

### Decision 2: Medusa.js vs Shopify Hydrogen

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Medusa.js 2.x | Open source, customizable, sin comisiones de platform | ✅ Elegido |
| Shopify Hydrogen | Dependencia de Shopify, comisiones mensuales | ❌ Descartado |

**Rationale**: Menos costos, control total del checkout, integración más directa con Bold.

### Decision 3: Nanostores vs Context API

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Nanostores | Framework-agnostic, ~1.5KB, sync localStorage | ✅ Elegido |
| Zustand | Más popular pero orientado a React | Alternativa |
| Context API | Solo React, más código | ❌ Descartado |

**Rationale**: Tamaño mínimo, funciona con Astro islands, fácil de usar.

### Decision 4: Bold Checkout Widget vs API directa

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Bold Checkout Widget | Rápido de integrar, menos control | ✅ Elegido para MVP |
| Bold API directa | Más control pero más tiempo de desarrollo | Post-MVP |

**Rationale**: Velocidad de implementación. El widget es suficiente para el MVP.

### Decision 5: CMS para Blog/Contenido

| Option | Tradeoff | Decision |
|--------|----------|----------|
| **Keystatic** | Git-based, gratis, integrable con Astro Content Collections | ✅ Elegido |
| Sanity | Headless, $99/mes, más features | Alternativa Post-MVP |
| TinaCMS | Git-based, mejor UX para editores | Descartado |

**Rationale**: 
- Ecommerce (productos) → Medusa.js ya maneja esto
- Blog/Contenido → Keystatic con Astro Content Collections
- Keystatic es gratis, simple, y se integra perfectamente con Astro
- Navío Azul lo recomienda como default para este tipo de proyectos

**Rationale**: Ecommerce ya lo maneja Medusa.js. Solo necesitamos CMS para blog/posts y páginas de contenido. Keystatic es suficiente y económico.

---

## Data Flow

```
                    ┌─────────────────────────────────────────────────────┐
                    │                    NAVEGADOR                        │
                    │                                                     │
    Usuario ───────►│  ┌─────────┐    ┌─────────┐    ┌─────────┐      │
                    │  │  Astro   │───►│ Medusa  │───►│  Bold   │      │
                    │  │   SSR    │    │   API   │    │ Checkout│      │
                    │  └────┬─────┘    └─────────┘    └─────────┘      │
                    │       │                                          │
                    │       ▼                                          │
                    │  ┌─────────┐                                    │
                    │  │NanoStores│◄──── localStorage                 │
                    │  └─────────┘                                    │
                    └─────────────────────────────────────────────────────┘

Flujo Checkout:
1. Usuario añade producto → Nanostores actualiza → localStorage persiste
2. Usuario inicia checkout → Redirect a Bold Checkout Widget
3. Bold procesa pago (PSE/Tarjeta/Nequi)
4. Bold webhook → Medusa actualiza orden → Página de éxito
```

---

## File Structure

```
octavo-fuego/
├── astro.config.mjs              # Astro config + integrations
├── keystatic.config.ts          # Keystatic CMS config
├── tailwind.config.js            # Tailwind + custom colors
├── src/
│   ├── content/
│   │   ├── blog/                    # Keystatic/Astro Content Collections
│   │   │   ├── guia-rape-principiantes.md
│   │   │   ├── historia-rape.md
│   │   │   └── ...
│   │   └── pages/                  # Páginas de contenido
│   │       ├── profecia.md
│   │       └── sobre-nosotros.md
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.astro           # Primary/Ghost/Disabled
│   │   │   ├── Card.astro             # Product card
│   │   │   ├── Input.astro            # Form input
│   │   │   ├── Badge.astro            # Trust badges
│   │   │   ├── Modal.tsx               # Quick View (React island)
│   │   │   ├── Tabs.tsx                # PDP tabs (React island)
│   │   │   └── Toast.tsx               # Notifications (React island)
│   │   ├── layout/
│   │   │   ├── Navbar.astro            # Fixed navbar + dropdown
│   │   │   ├── Footer.astro           # 4-column footer
│   │   │   └── Container.astro        # Max-width wrapper
│   │   ├── product/
│   │   │   ├── ProductCard.astro      # Grid card
│   │   │   ├── ProductGrid.astro      # PLP grid
│   │   │   ├── ProductGallery.astro   # PDP image gallery
│   │   │   └── QuickView.tsx          # Modal quick view
│   │   ├── cart/
│   │   │   ├── CartDrawer.tsx         # Slide-out cart (React island)
│   │   │   ├── CartItem.astro         # Item in cart
│   │   │   └── CartCounter.astro      # Navbar counter
│   │   ├── checkout/
│   │   │   ├── CheckoutForm.tsx        # 4-step form
│   │   │   └── OrderSummary.astro      # Sidebar summary
│   │   ├── quiz/
│   │   │   └── QuizSection.tsx        # "¿Cuál es tu intención?" (React)
│   │   ├── seo/
│   │   │   ├── JsonLd.astro           # Base schema component
│   │   │   ├── OrganizationSchema.astro
│   │   │   ├── ProductSchema.astro
│   │   │   └── BreadcrumbSchema.astro
│   │   └── FloatingWhatsApp.tsx      # WA button (already created)
│   │
│   ├── layouts/
│   │   ├── Layout.astro               # Base layout + head
│   │   ├── ProductLayout.astro       # PDP layout
│   │   └── CheckoutLayout.astro      # Checkout layout
│   │
│   ├── pages/
│   │   ├── index.astro               # Homepage
│   │   ├── tienda/
│   │   │   └── index.astro          # PLP
│   │   ├── producto/
│   │   │   └── [slug].astro         # PDP
│   │   ├── carrito/
│   │   │   └── index.astro          # Cart page
│   │   ├── checkout/
│   │   │   ├── index.astro          # Checkout
│   │   │   └── success.astro       # Order confirmation
│   │   ├── nosotros/
│   │   │   └── index.astro          # About page
│   │   └── contacto/
│   │       └── index.astro          # Contact page
│   │
│   ├── stores/
│   │   └── cartStore.ts             # Nanostores cart state
│   │
│   ├── i18n/
│   │   ├── es.json                  # Español (default)
│   │   ├── en.json                  # English
│   │   └── pt.json                  # Português
│   │
│   ├── utils/
│   │   ├── i18n.ts                 # Translation helpers
│   │   ├── formatCurrency.ts        # COP formatter
│   │   └── bold.ts                 # Bold checkout helpers
│   │
│   └── styles/
│       └── global.css              # Tailwind + custom properties
│
├── medusa/                          # Medusa.js backend (separate)
│   ├── src/
│   │   ├── api/
│   │   │   └── routes/
│   │   │       └── bold/
│   │   │           └── webhook.ts  # Bold webhook handler
│   │   └── models/
│   │       └── product.ts
│   └── medusa-config.js
│
└── public/
    ├── images/
    │   └── productos/              # Product images (downloaded)
    └── fonts/                      # Playfair Display, Inter
```

---

## Key Interfaces

### CartItem (Nanostores)

```typescript
interface CartItem {
  id: string;              // Product ID from Medusa
  variantId: string;        // Variant ID
  nombre: string;
  nombreEn: string;
  nombrePt: string;
  etnia: string;
  precio: number;          // COP
  cantidad: number;
  imagen: string;         // URL
  slug: string;
}
```

### Product (from Medusa)

```typescript
interface Product {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  variants: Variant[];
  metadata: {
    etnia: string;
    tipo: 'rape' | 'sananga' | 'kuripe' | 'accesorio';
  };
}

interface Variant {
  id: string;
  title: string;           // "10g", "30ml", etc.
  prices: { amount: number; currency: 'cop' }[];
  inventory: number;
}
```

### Translation Structure

```typescript
interface Translations {
  [key: string]: {
    [locale: string]: string
  }
}

// Usage: t('home.hero.title', 'es') → "Enciende tu Octavo Fuego"
```

---

## Testing Strategy

| Layer | What | How |
|-------|------|-----|
| Unit | Helpers: formatCurrency, i18n | Vitest |
| Unit | CartStore: add/remove/update | Vitest |
| Integration | API routes: /tienda, /producto/[slug] | Playwright |
| E2E | Checkout flow completo | Playwright |
| E2E | Quiz interaction | Playwright |
| Visual | Product cards, navbar, modals | Screenshot diff |

---

## Open Questions

- [ ] ¿Usar Medusa.js con datos mock para MVP o conectar desde el inicio?
- [ ] ¿Bold webhook necesita autenticación adicional?
- [ ] ¿Productos físicos o digitales (para calcular envío)?

---

## Next Step

Ready for sdd-tasks: crear breakdown de tareas de implementación.
