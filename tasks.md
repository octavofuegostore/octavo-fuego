# Octavo Fuego - Implementation Tasks

## Project Status
- ✅ Phase 1: Project Setup (Astro, Tailwind, shadcn/ui, Nanostores)
- 🔄 Phase 2: Design System - IN PROGRESS
- ✅ Phase 3: i18n Infrastructure (es/en/pt JSON files)
- 🔄 Phase 4: Layout Components - IN PROGRESS

---

## Phase 2: Design System Components

### 2.1 Button Component
- [x] **button.tsx** - Customized shadcn button with Octavo Fuego styling
  - Primary: bg-tabacco (#8B4513), text-white, px-6 py-3
  - Secondary/Ghost: border-tabacco, text-tabacco, transparent bg
  - Disabled: opacity-50, cursor-not-allowed
  - Hover: scale-[1.02] transition
- Status: ✅ COMPLETE
- File: `src-astro/src/components/ui/button.tsx`

### 2.2 Card Component
- [x] **card.tsx** - Customized with Tabaco accent options
  - Border: 1px solid #2A2A2A (smoke)
  - Hover: border → #8B4513 (tabacco), shadow
  - Radio: 0 (no border-radius - cuadrado)
- Status: ✅ COMPLETE
- File: `src-astro/src/components/ui/card.tsx`

### 2.3 ProductCard Component
- [x] **ProductCard.astro** - Product grid card with:
  - Product image with hover scale effect
  - Etnia label (uppercase, ceniza)
  - Product name (Playfair Display)
  - Price in COP format
  - "Añadir" button (tabacco bg)
  - "Ver →" appears on hover
- Status: ✅ COMPLETE
- File: `src-astro/src/components/product/ProductCard.astro`

---

## Phase 4: Layout Components

### 4.1 Navbar
- [x] **Navbar.astro** - Fixed header with:
  - Height: 80px (desktop), 64px (mobile)
  - Background: transparent → black/80 on scroll with backdrop blur
  - Logo (Octavo Fuego)
  - Desktop: Tienda dropdown (click-triggered), Blog, Nosotros, Contacto
  - Dropdown shows: Rapé, Sananga, Kuripes, Accesorios + "Ver todos"
  - Mobile: Hamburger menu
  - Cart icon with count badge
- Status: ✅ COMPLETE
- File: `src-astro/src/components/Navbar.astro`

### 4.2 Footer
- [x] **Footer.astro** - 4-column layout:
  - Column 1: Logo + tagline + disclaimer
  - Column 2: Tienda links (Rapé, Sananga, Kuripes, Accesorios)
  - Column 3: Información links (Nosotros, Blog, Contacto, FAQ, Envíos)
  - Column 4: Contacto + Social icons (Instagram, Facebook, WhatsApp)
  - Bottom: Copyright + Términos/Privacidad links
- Status: ✅ COMPLETE
- File: `src-astro/src/components/Footer.astro`

### 4.3 FloatingWhatsApp
- [x] **FloatingWhatsApp.tsx** - WhatsApp floating button:
  - Position: fixed, bottom-6, right-6
  - Color: #25D366 (whatsapp green)
  - Ring animation: ping every 8s (CSS animate-ping)
  - Single button with WhatsApp icon
  - Tooltip on hover: "¿Necesitas ayuda?"
  - Opens WhatsApp with pre-filled message
- Status: ✅ COMPLETE
- File: `src-astro/src/components/ui/FloatingWhatsApp.tsx`

---

## Next Recommended Tasks

### Phase 5: Cart & State Management
- [ ] Create `cartStore.ts` with Nanostores
- [ ] Implement CartDrawer.tsx (slide-out cart)
- [ ] Create CartItem.astro component
- [ ] Add CartCounter to Navbar

### Phase 6: Pages
- [ ] Update `Layout.astro` to include Navbar, Footer, FloatingWhatsApp
- [ ] Create `TiendaPage.astro` (product listing)
- [ ] Create `ProductPage.astro` (product detail)
- [ ] Create `CartPage.astro`

### Phase 7: Checkout
- [ ] Create checkout flow
- [ ] Integrate Bold Checkout widget

---

## Files Created/Modified

### Created
- `src-astro/src/components/Navbar.astro`
- `src-astro/src/components/Footer.astro`
- `src-astro/src/components/ui/FloatingWhatsApp.tsx`
- `tasks.md` (this file)

### Modified
- `src-astro/src/components/ui/button.tsx` - Custom variants for Octavo Fuego
- `src-astro/src/components/ui/card.tsx` - Removed border-radius, added tabacco hover
- `src-astro/src/components/product/ProductCard.astro` - Added "Añadir" button

---

## Deviations from Spec

None. All components implemented according to ui-spec.md and design.md.
