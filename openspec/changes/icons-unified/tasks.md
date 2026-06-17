# Tasks — icons-unified

**Change**: Migrate ALL site icons to Solar Bold-Duotone + Phosphor Duotone
**Previous phases**: proposal ✅, spec ✅, design ✅
**Status**: Tasks phase

---

## Priority 1 — Brand-critical (do first)

### Task 1.1: Testimonials.astro — Replace lucide-react Star
- [ ] Find `Testimonials.astro` component
- [ ] Remove `lucide-react` Star import
- [ ] Install/add `astro-icon` with Solar icon pack if not present
- [ ] Replace `<Star>` with `<SolarStarBoldDuotone />` or equivalent Solar BD component
- [ ] Verify icon renders correctly with proper size/color props

### Task 1.2: index.astro Confianza section — Replace Shield, Leaf, Droplets
- [ ] Locate Confianza section in `index.astro`
- [ ] Remove `lucide-react` imports: `Shield`, `Leaf`, `Droplets`
- [ ] Add Solar Bold-Duotone equivalents:
  - `Shield` → `SolarShieldBoldDuotone`
  - `Leaf` → `SolarLeafBoldDuotone`
  - `Droplets` → `SolarDropletBoldDuotone`
- [ ] Ensure all three icons render with consistent sizing and color

### Task 1.3: index.astro Intenciones section — Replace 5 inline SVGs
- [ ] Locate Intenciones section in `index.astro`
- [ ] Identify all 5 inline SVG icons in this section
- [ ] Replace each inline SVG with corresponding Solar Bold-Duotone component
- [ ] Verify visual consistency across all 5 icons

---

## Priority 2 — Brand-visible

### Task 2.1: Navbar.astro — Replace hamburger and chevron SVGs
- [ ] Locate Navbar component
- [ ] Find hamburger menu SVG and chevron down/up SVGs
- [ ] Replace with Solar Bold-Duotone equivalents:
  - Hamburger → `SolarHamburgerMenuBoldDuotone`
  - Chevron → `SolarAltArrowDownBoldDuotone` or similar
- [ ] Test mobile menu open/close behavior
- [ ] Verify dark mode rendering

### Task 2.2: LanguageSwitcher.astro — Replace globe and chevron SVGs
- [ ] Locate `LanguageSwitcher.astro` component
- [ ] Find globe SVG and chevron SVG
- [ ] Replace with Solar Bold-Duotone equivalents:
  - Globe → `SolarGlobalBoldDuotone`
  - Chevron → `SolarAltArrowDownBoldDuotone` or similar
- [ ] Test language dropdown open/close
- [ ] Verify icon visibility in both light and dark modes

---

## Priority 3 — Optional (only if time permits)

### Task 3.1: WhatsAppButton / FloatingWhatsApp — Replace inline SVG
- [ ] Locate `WhatsAppButton` or `FloatingWhatsApp` component
- [ ] Find inline WhatsApp SVG
- [ ] Replace with `PhosphorDuotone:ph-whatsapp-logo-duotone`
- [ ] Verify icon color matches brand accent

### Task 3.2: Cart/Checkout utility icons — Replace inline SVGs
- [ ] Locate Cart and/or Checkout components
- [ ] Identify inline SVG icons (bag, cart, etc.)
- [ ] Replace with Solar Bold-Duotone equivalents
- [ ] Only implement if Task 3.1 is complete and time permits

---

## Verification Tasks (run after ALL priorities)

### Task 4.1: Build verification
- [ ] Run `npm run build`
- [ ] Verify output shows **34 pages**
- [ ] Confirm **0 errors** in build output
- [ ] Fix any TypeScript or import errors before proceeding

### Task 4.2: Browser rendering check
- [ ] Open site in browser (dev server or preview)
- [ ] Navigate to each page affected by icon changes:
  - Homepage (index.astro) — Confianza and Intenciones sections
  - Any page with Testimonials component
  - Navbar (all pages)
  - Language switcher (all pages)
- [ ] Verify all icons render correctly (no missing icons, no broken SVGs)
- [ ] Test dark mode if applicable
- [ ] Confirm no console errors related to icons

---

## File Inventory (expected changes)

| File | Icons to Replace | Priority |
|------|------------------|----------|
| `Testimonials.astro` | lucide Star → Solar BD | P1 |
| `index.astro` (Confianza) | Shield, Leaf, Droplets → Solar BD | P1 |
| `index.astro` (Intenciones) | 5 inline SVGs → Solar BD | P1 |
| `Navbar.astro` | Hamburger, chevron SVGs → Solar BD | P2 |
| `LanguageSwitcher.astro` | Globe, chevron SVGs → Solar BD | P2 |
| `WhatsAppButton.astro` | Inline WhatsApp SVG → ph:whatsapp-logo-duotone | P3 |
| `Cart/Checkout.*` | Inline SVGs → Solar BD | P3 |

---

## Dependencies
- `astro-icon` package (or equivalent Solar icon integration)
- Solar Bold-Duotone icon set
- Phosphor Duotone icon set (for WhatsApp)

## Notes
- Solar Bold-Duotone icons provide the unified brand look
- Phosphor Duotone used only where Solar doesn't have an equivalent (WhatsApp)
- All icon replacements should maintain existing size/color props
- Dark mode compatibility must be verified for each replacement