# Design: Mobile-First Overhaul

## Technical Approach

Zero-dependency mobile hardening of the existing Astro 6.1.3 + TailwindCSS 4 stack. No new packages, no React islands. Three JS-driven features (hamburger sheet, cart badge, CSS-first breakpoints) use `<script>` blocks inside `.astro` files following the project's established pattern (PricingTable.astro, carrito/index.astro). All 25 fixes are CSS class swaps or isolated `<script>` additions — revertible per-phase via `git revert`.

---

## Architecture Decisions (12 validated)

### Decision 1: Hamburger Menu — Vanilla JS `<script>` in Astro

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Vanilla JS `<script>` block | Zero overhead, SSR-friendly, matches existing codebase patterns | **Chosen** |
| React island (`client:load`) | Hydration cost (~50KB JS), overkill for static link list | Rejected |
| CSS-only `:target` trick | Fragile URL state, breaks back button | Rejected |
| `<details>` element | Semantic but limited styling control, no scroll-lock | Rejected |

**Rationale**: The mobile menu is a static link list — no interactive state beyond open/close toggle. The codebase already uses vanilla JS scripts in Astro (PricingTable.astro line 114, carrito/index.astro line 78). Dashboardplan's `<Sheet>` is React but we replace with vanilla equivalent: a `<div id="mobile-menu">` injected after Navbar line 93, toggled via `classList.toggle('hidden')` on the hamburger button click. Body scroll-lock via `document.body.classList.toggle('overflow-hidden')`.

### Decision 2: WhatsApp CTA — CSS `@media (hover: hover)`

| Option | Tradeoff | Decision |
|--------|----------|----------|
| CSS `@media (hover: hover)` | Zero JS, progressive enhancement, 1-line change | **Chosen** |
| JS `matchMedia` listener | JS overhead, more code | Rejected |
| Always visible on all devices | Loses desktop hover animation | Rejected |

**Rationale**: ProductCard.astro line 86 uses `opacity-0 group-hover:opacity-100`. Replaced with `opacity-100 @media (hover: hover) { opacity-0 group-hover:opacity-100 }`. Browsers that support hover (desktop) get the animation; touch devices get always-visible CTA. Hybrid devices (laptops with touch) treat primary input as hover-capable — CTA still shows on hover. Worst case: users see the button (acceptable UX).

### Decision 3: Cart Badge — nanostores `subscribe()` in `<script>`

| Option | Tradeoff | Decision |
|--------|----------|-----------|
| nanostores `subscribe()` in Astro `<script>` | 1KB pattern, cart already uses nanostores, proven in codebase | **Chosen** |
| React island with `useStore()` | Hydration cost, unnecessary for a badge span | Rejected |
| CustomEvent from cartStore | Adds coupling, no existing event bus | Rejected |

**Rationale**: `cartStore.ts` exports `cartCount` atom. Navbar.astro line 82 already has a badge `<span>` with `hidden` class. Pattern: import cartStore in a `<script>` block, `cartCount.subscribe(count => { ... })` to update `textContent` and toggle `hidden`. This matches the existing `cartItems.subscribe(renderCart)` pattern in carrito/index.astro line 170. No React island needed.

### Decision 4: Locale-Aware Redirects — `pathname` first segment

| Option | Tradeoff | Decision |
|--------|----------|-----------|
| Read `pathname.split('/')[1]` with `es` fallback | Simple, 5-line JS, covers all Astro i18n routes | **Chosen** |
| Astro `Astro.url` in frontmatter | Static — can't change `window.location.href` from frontmatter | Rejected |
| Hardcoded `/es/tienda` (current) | Broken for `/en/carrito` and `/pt/carrito` visitors | Replaced |

**Rationale**: `window.location.pathname` first segment is always the locale (`es`, `en`, `pt`) due to Astro's i18n routing. Fallback to `'es'` if no valid prefix. Used in cart page empty-state and "Continue Shopping" buttons.

### Decision 5: Safe-Area-Insets — CSS `env()`

| Option | Tradeoff | Decision |
|--------|----------|-----------|
| CSS `env(safe-area-inset-*)` | Native iOS API, zero JS, standard since iOS 11 | **Chosen** |
| JS `window.visualViewport` | Complex, doesn't cover notch | Rejected |
| Fixed `padding-top: 44px` | Wrong on devices without notch | Rejected |

**Rationale**: Three targets: (1) FloatingWhatsApp.astro `bottom-6` → `bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))]`, (2) Navbar.astro `top-0` → `top-[env(safe-area-inset-top,0px)]` plus spacer pt, (3) Layout.astro `<body>` inline `style="padding-bottom: env(safe-area-inset-bottom,0px)"`. `env()` returns 0 on non-notch devices — no breakage.

### Decision 6: Anti-Zoom Inputs — Per-Component `text-base md:text-sm`

| Option | Tradeoff | Decision |
|--------|----------|-----------|
| Per-component on every input/select/textarea | Granular, no side effects, matches dashboardplan Pattern 1 | **Chosen** |
| Global `input, select, textarea { font-size: 16px }` | Overrides intentional small text in non-input contexts | Rejected |

**Rationale**: iOS Safari zooms when an `<input>` has `font-size < 16px`. A global rule would force 16px on every input including layout/search non-form ones. Per-component audit targets: `input.tsx` line 9, `CheckoutForm.tsx` line 213, and any other form fields. The `text-base` (16px) class prevents zoom; `md:text-sm` reduces to 14px on desktop where zoom isn't triggered.

### Decision 7: Sticky Checkout Nav — CSS `position: sticky`

| Option | Tradeoff | Decision |
|--------|----------|-----------|
| CSS `position: sticky bottom-0` | Pure CSS, well-supported | **Chosen** |
| JS IntersectionObserver | More code, same result | Rejected |

**Rationale**: Wrap CheckoutForm.tsx nav buttons (lines 374-394) in a `<div class="sticky bottom-0 bg-white pt-4 border-t">`. No JS needed — `sticky` is supported in all modern mobile browsers.

### Decision 8: Breakpoint Detection — `data-breakpoint` CSS-First

| Option | Tradeoff | Decision |
|--------|----------|-----------|
| `data-breakpoint` on `<html>` via inline 15-line `<script>` | Enables `[data-breakpoint="sm"]` CSS selectors, zero framework dependency | **Chosen** |
| React `useEffect`/`useState` | Requires React island for a CSS concern | Rejected |
| CSS container queries | Good alternative, but TailwindCSS 4 has limited container query support in utility classes | Not chosen |

**Rationale**: Inline `<script>` in Layout.astro `<head>` sets `document.documentElement.dataset.breakpoint` to `'sm' | 'md' | 'lg'` on `resize`. Matches Tailwind breakpoints (640/768/1024). Dashboardplan uses React for this — Astro equivalent is vanilla JS. Enables CSS-only breakpoint queries without framework dependency.

### Decision 9: Snap-Scroll Product Grids — CSS Progressive

| Option | Tradeoff | Decision |
|--------|----------|-----------|
| `flex overflow-x-auto snap-x` on mobile, `grid` at `md:` | Natural swipe on mobile, standard grid on desktop, progressive enhancement | **Chosen** |
| JS carousel library | Adds dependency, heavier | Rejected |
| `grid` at all sizes | Cards too small at 320px | Rejected |

**Rationale**: Mobile: `flex overflow-x-auto pb-4 gap-4 snap-x` with cards `min-w-[280px] snap-center flex-shrink-0`. Desktop (`md:`): `grid grid-cols-2 lg:grid-cols-3 overflow-visible pb-0`. Cards reset to `min-w-0`. Pattern 3 from dashboardplan.

### Decision 10: Modal Responsiveness — Native `<dialog>`

| Option | Tradeoff | Decision |
|--------|----------|-----------|
| Native `<dialog>` element | 97%+ browser support, no JS library needed | **Chosen** |
| React island with Radix `<Dialog>` | Requires React, heavier | Rejected |

**Rationale**: `<dialog>` with `w-full sm:max-w-lg sm:rounded-lg` pattern. Footer: `flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2` (primary action at bottom on mobile, right on desktop). Dashboardplan uses Radix `<Dialog>` (React) — Astro alternative.

### Decision 11: Touch Targets — 44×44px Minimum via CSS Classes

| Option | Tradeoff | Decision |
|--------|----------|-----------|
| `min-w-[44px] min-h-[44px]` with `p-2`/`p-3` on interactive elements | WCAG 2.5.5 compliant, pure CSS | **Chosen** |
| JS `touch-action` polyfill | Unnecessary, not a polyfill issue | Rejected |

**Rationale**: Icon-only buttons: `w-7 h-7` → `w-11 h-11` with `p-2` on parent `<a>`. Qty buttons: `w-10 h-10` → `w-11 h-11 min-w-[44px] min-h-[44px]`. Select inputs: `h-8` → `h-11`. Dashboardplan Pattern 4.

### Decision 12: Cart Drawer Body Lock & `scrollbar-gutter`

| Option | Tradeoff | Decision |
|--------|----------|-----------|
| `scrollbar-gutter: stable` on `<html>` + toggle `overflow-hidden` on `<body>` | Prevents CLS layout shift, standard pattern | **Chosen** |
| `padding-right` compensation JS | More code, fragile | Rejected |

**Rationale**: `scrollbar-gutter: stable` reserves scrollbar space on `<html>` — no layout shift when cart drawer opens. Body scroll-lock: subscribe to cart drawer state and toggle `overflow-hidden` on `<body>`.

---

## JS-Driven Feature Architectures

### Feature 1: Hamburger Menu → Mobile Sheet

```
┌─────────────────────────────────────────────────────────────┐
│ Navbar.astro                                                │
│                                                             │
│  <button id="hamburger-btn" aria-label="Menu">              │
│    ──click──→ document.getElementById('mobile-menu')        │
│              .classList.toggle('hidden')                    │
│              document.body.classList.toggle('overflow-hidden')
│                                                             │
│  <div id="mobile-menu" class="hidden fixed inset-0 z-40">   │
│    ├── Overlay (bg-black/50, closes on click)              │
│    ├── Panel (right-0, w-72, bg-white)                     │
│    │   ├── Close button (×)                                │
│    │   └── Nav links (locale-aware baseUrl)                │
│    └── </div>                                              │
└─────────────────────────────────────────────────────────────┘
```

**Pattern**: Vanilla JS toggle — zero framework overhead. The `<script>` block lives inside Navbar.astro (same file), uses `astro:page-load` event for View Transitions compatibility. All links use `baseUrl = /${locale}` for i18n awareness.

**Why vanilla over React island**: The menu is static — no reactive state, no data fetching, no useEffect cleanup. A React island would add ~50KB of hydration JS for a toggle that needs 15 lines of vanilla code. This follows the Dashboardplan `admin/layout.tsx` Sheet pattern conceptually (same UX) but implements it with the stack-appropriate approach.

### Feature 2: Cart Badge Reactivity Flow

```
┌──────────────────┐    subscribe()     ┌──────────────────┐
│  cartStore.ts    │ ─────────────────→ │  Navbar.astro     │
│                  │                    │  <script>         │
│  cartCount atom  │                    │                   │
│  (nanostores)    │                    │  cartCount.subscribe(
│                  │                    │    (count) => {   │
│  cartItems atom  │                    │      badge.textContent
│  (triggers       │                    │        = count    │
│   recalc)        │                    │      badge.classList
│                  │                    │        .toggle(   │
│                  │                    │        'hidden',  │
│                  │                    │        count===0) │
│                  │                    │    }              │
│                  │                    │  )                │
└──────────────────┘                    └──────────────────┘
         │                                      │
         │ addToCart() / removeFromCart()       │
         ▼                                      ▼
┌──────────────────┐                    ┌──────────────────┐
│  ProductCard /   │                    │  Badge <span>    │
│  PricingTable    │                    │  absolute -top-1 │
│  (call actions)  │                    │  bg-action-primary│
└──────────────────┘                    │  text-white      │
                                        │  hidden (when 0) │
                                        └──────────────────┘
```

**Pattern**: nanostores `subscribe()` inside inline `<script>`. Already proven in `carrito/index.astro` line 170 (`cartItems.subscribe(renderCart)`). No React island needed — the badge is a DOM text update, not a component tree.

**Important**: Badge starts `hidden` and only appears when `count > 0`. The `subscribe()` callback fires immediately on load (nanostores behavior), setting initial state correctly. No flash of unstyled content.

### Feature 3: Breakpoint Detection — CSS-First

```
┌──────────────────────────────────────────────────────────┐
│ Layout.astro <head>                                      │
│                                                          │
│  <script>                                                │
│    function setBreakpoint() {                            │
│      const w = window.innerWidth;                        │
│      document.documentElement.dataset.breakpoint =       │
│        w >= 1024 ? 'lg' : w >= 768 ? 'md' : 'sm';        │
│    }                                                     │
│    setBreakpoint();                                      │
│    window.addEventListener('resize', setBreakpoint);     │
│    // Guard for Astro View Transitions                   │
│    document.addEventListener('astro:after-swap',         │
│      setBreakpoint);                                     │
│  </script>                                               │
└──────────────────────────────────────────────────────────┘
                          │
                          ▼ sets data-breakpoint="sm|md|lg"
┌──────────────────────────────────────────────────────────┐
│ CSS anywhere:                                            │
│                                                          │
│  [data-breakpoint="sm"] .my-component { … }              │
│  [data-breakpoint="lg"] .my-component { … }              │
│                                                          │
│ Use case: show/hide elements based on actual viewport    │
│ without duplicating Tailwind responsive classes.         │
│ Particularly useful for JS that needs to query "am I     │
│ on mobile?" without listening to resize events itself.   │
└──────────────────────────────────────────────────────────┘
```

**Why CSS-first instead of JS `matchMedia` everywhere**: Centralized breakpoint attribute enables CSS-only queries (`[data-breakpoint]` selectors) AND JS reads (`document.documentElement.dataset.breakpoint`) from any script without duplicating `matchMedia` listeners. Single source of truth.

---

## CSS Architecture Decisions

### Anti-Zoom: Per-Component vs Global

**Decision**: Per-component `text-base md:text-sm` on inputs only.

**Why not global**: A global `input, select, textarea { font-size: 16px }` would force 16px on non-form inputs (search, navbar, filters, language switcher) — breaking intentional small text. The dashboardplan Pattern 1 applies `text-base` only to form components (`input.tsx`), not globally. This is more surgical and avoids side effects.

**Files to audit**: `input.tsx` (verify `text-base` present), `CheckoutForm.tsx` (add `text-base md:text-sm`), any other `.astro` with `<input>/<select>/<textarea>`.

### Safe-Area Strategy

```
┌─────────────────────────────────────┐
│ iPhone X+ (notch + home indicator)  │
│                                     │
│ ┌─ env(safe-area-inset-top) ──────┐ │
│ │ Navbar.astro                    │ │
│ │ top-[env(safe-area-inset-top)]  │ │
│ │ pt-[env(safe-area-inset-top)]   │ │ ← spacer compensates
│ └─────────────────────────────────┘ │
│                                     │
│          (main content)             │
│                                     │
│ ┌─ env(safe-area-inset-bottom) ───┐ │
│ │ FloatingWhatsApp.astro          │ │
│ │ bottom-[calc(1.5rem+env(…))]    │ │ ← above home indicator
│ ├─────────────────────────────────┤ │
│ │ Layout.astro <body>             │ │
│ │ padding-bottom: env(…)           │ │ ← prevents content cutoff
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

Three-layer approach:
1. **Fixed navbar**: `top-[env(safe-area-inset-top,0px)]` — aligns below notch
2. **Floating CTA**: `bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))]` — above home indicator
3. **Body**: `padding-bottom: env(safe-area-inset-bottom,0px)` — prevents bottom content from being hidden behind indicator

`env()` returns 0 on devices without notch — no breakage.

### Touch Target Methodology (44px Minimum)

WCAG 2.5.5 requires ≥44×44px touch area. Methodology:

- **Icon-only `<a>` links** (footer social/contact): Wrap icon in `<a class="p-2">` (icon `w-7 h-7` = 28px + 8px padding each side = 44px)
- **Qty buttons** (cart, QuickViewModal, CartDrawer): `w-11 h-11 min-w-[44px] min-h-[44px]` (44px = 2.75rem)
- **Delete/close buttons**: `p-3 min-w-[44px] min-h-[44px]` (12px padding + 24px icon = 44px)
- **Select inputs**: `h-11` (44px = 2.75rem, was `h-8` = 32px)

### Responsive Grid Breakdown

**PricingTable.astro** (line 53): `grid-cols-3` → `grid-cols-2 sm:grid-cols-3`

| Viewport | Columns | Width | Rationale |
|----------|---------|-------|-----------|
| 320-639px | 2 | ~150px each | 3 cols would make buttons <100px — too cramped for "10g — $35,000 COP" labels |
| 640px+ | 3 | ~200px each | Full layout, weight column sticky on iPad |

Weight column (first child): `sm:sticky sm:left-0 sm:z-10 sm:bg-white` — follows dashboardplan Pattern 6 (ThSticky).

---

## Risk Assessment by Phase

### Phase 1 — Critical Fixes

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| Hamburger menu JS conflicts with Astro View Transitions | Medium | Low | Use `astro:page-load` event (already used in PricingTable.astro line 116) |
| Safe-area `env()` shifts navbar on devices without notch | Low | Low | `env()` returns 0 when unsupported; verify with `max()` fallback |
| Logo text reduction (`text-base`) affects brand readability on 375px | Low | Low | 16px is still readable; image logo remains visible |
| WhatsApp `@media (hover: hover)` on hybrid touch/laptop devices | Low | Low | CTA shows on hover for hybrid; always visible is acceptable UX |

### Phase 2 — Touch & Input UX

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| 44px touch targets break existing layouts | Medium | Medium | Each touch target change is scoped; test footer, cart, checkout individually |
| `overscroll-behavior: none` breaks scroll on non-iOS | Low | Low | Only applied when `.overflow-hidden` is active (cart drawer open) |
| Locale redirect JS fails on edge-case paths | Low | Low | Fallback to `'es'` if no valid locale prefix; test `/en/carrito`, `/pt/carrito`, `/carrito` |

### Phase 3 — Layout & Navigation

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| Nanostores `subscribe()` in Navbar.astro `<script>` fails to resolve import path | Medium | Low | Already proven pattern in carrito/index.astro line 79; use same import style |
| Snap-scroll `flex` conflicts with Astro View Transitions | Medium | Low | `astro:page-load` guard on any event listeners |
| Sticky checkout nav overlaps with safe-area on iPhone | Low | Low | `bottom-0` + safe-area body padding handles overlap |
| PricingTable 2-column at 320px still cramped | Low | Low | Buttons are ~150px wide at 2 cols — sufficient for text labels |

### Phase 4 — Polish & Consistency

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| Blog theme change breaks `text-white` breadcrumbs on dark backgrounds | Medium | Medium | Audit all `text-white` classes in blog; replace with `text-[var(--near-black)]` |
| `scrollbar-gutter: stable` adds visible gutter on Windows | Low | Low | Modern Windows browsers use overlay scrollbars by default |
| `data-breakpoint` script conflicts with View Transitions | Medium | Low | Guard with `astro:after-swap` listener |
| `px→rem` spacing audit introduces pixel-rounding regressions | Low | Low | Tailwind v4 `--spacing-*` tokens already use rem; only convert CSS custom properties in `:root` |

---

## File Changes

| File | Action | Phase | Description |
|------|--------|-------|-------------|
| `src/components/Navbar.astro` | Modify | P1, P3 | Hamburger JS + drawer, safe-area top, logo/icon sizing, cart badge, spacer |
| `src/components/product/ProductCard.astro` | Modify | P1 | WhatsApp CTA `@media (hover: hover)` |
| `src/components/ui/FloatingWhatsApp.astro` | Modify | P1 | Safe-area bottom |
| `src/layouts/Layout.astro` | Modify | P1, P4 | Safe-area body padding, `data-breakpoint` script |
| `src/styles/global.css` | Modify | P2, P4 | `touch-action`, `-webkit-tap-highlight-color`, `scrollbar-gutter`, `overscroll-behavior`, px→rem |
| `src/components/Footer.astro` | Modify | P2 | Touch targets (social + contact icons) |
| `src/components/checkout/CheckoutForm.tsx` | Modify | P2, P3, P4 | Select touch target, anti-zoom, sticky nav, light theme |
| `src/components/ui/input.tsx` | Modify | P2 | Verify `text-base` on inputs |
| `src/pages/carrito/index.astro` | Modify | P2, P3 | Locale redirects, touch targets, image sizing |
| `src/components/cart/CartDrawer.tsx` | Modify | P2 | Touch targets (qty, close, delete) — orphan component, future-proofed |
| `src/components/product/QuickViewModal.astro` | Modify | P2 | Touch targets (qty buttons) |
| `src/pages/[locale]/index.astro` | Modify | P2 | Trust badges overflow, intention cards gap |
| `src/components/product/PricingTable.astro` | Modify | P3 | Responsive grid + sticky weight column |
| `src/components/prophecy/ProphecyContent.astro` | Modify | P3 | Text-justify → text-left |
| `src/pages/[locale]/tienda/index.astro` | Modify | P3 | Snap-scroll product grid |
| `src/pages/[locale]/tienda/rape/index.astro` | Modify | P3 | Snap-scroll product grid |
| `src/pages/[locale]/tienda/rape/[product].astro` | Modify | P3 | Header `flex-col sm:flex-row` |
| `src/pages/blog/index.astro` | Modify | P4 | Light theme |
| `src/pages/blog/[slug].astro` | Modify | P4 | Light theme, hero gradient |

---

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Visual | Touch targets ≥44×44px | Browser DevTools ruler on each interactive element |
| Visual | Safe-area spacing on iPhone X+ | Xcode Simulator (iPhone 14 Pro, iPhone SE) |
| Functional | Hamburger menu opens/closes on tap | Manual tap test on iOS Safari + Android Chrome |
| Functional | Cart badge updates on add/remove | Manual: add item → badge appears; remove all → badge hidden |
| Functional | Locale redirects work for all 3 locales | Manual: visit `/en/carrito`, `/pt/carrito`, verify links |
| Visual | PricingTable columns at 320/480/640/1024px | Responsive Design Mode (Chrome DevTools) |
| Visual | Snap-scroll on product grids | Manual swipe on iOS/Android |
| Build | `astro build` succeeds with no errors | `npm run build` after each phase |

**Note**: Project has no test runner configured (`config.yaml testing.runner: null`). All verification is manual + visual + build-check.

---

## Migration / Rollout

No migration required. All changes are CSS class swaps and isolated `<script>` additions. Rollback via `git revert` per phase — each phase ships as an independent commit:

1. `git revert <phase-1-commit>` — hamburger, WhatsApp, safe-area, navbar collision
2. `git revert <phase-2-commit>` — touch targets, global CSS, locale redirects
3. `git revert <phase-3-commit>` — layout, snap-scroll, sticky elements
4. `git revert <phase-4-commit>` — theme, polish

No database changes, no API changes, no npm package additions.

---

## Open Questions

- [ ] Should `data-breakpoint` use exact Tailwind breakpoints (640/768/1024) or slightly different thresholds to match when Tailwind classes actually change? **Decision**: Use exact Tailwind breakpoints for consistency.
- [ ] Should CartDrawer.tsx (currently orphan/unused) be deleted or kept for future use? **Decision**: Keep and apply touch-target fixes — may be activated later. Spec says "optimizado para futuro uso (actualmente huérfano)".
- [ ] Should blog theme change be deferred to Phase 4 or done earlier if it blocks Phase 3 visual testing? **Decision**: Phase 4 as planned — blog is independent of layout/cart changes.
