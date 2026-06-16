# Proposal: Mobile-First Overhaul

## Intent

70%+ of traffic comes from Colombian mobile devices (iPhone 6–14, Android Chrome). **Three critical bugs** block core functionality: dead hamburger menu (tap does nothing — zero navigation), hover-only WhatsApp CTA (invisible on touch — zero purchases), and no safe-area-inset (FloatingWhatsApp hidden behind iPhone home indicator). **11 high-priority UX issues** compound the degradation: touch targets below 44×44px, 300ms tap delay, hardcoded locale URLs, navbar icon collision with logo, and layout failures on narrow viewports.

**Reference patterns:** Audited dashboardplan (Pipod — Next.js 14, optimized for iPhone/iPad) via SDD explore. 10 reusable mobile patterns extracted (snap-scroll cards, sheet navigation, 44px touch targets, CSS-first breakpoints, modal responsiveness, etc.). This proposal maps each octavo-fuego fix to a verified dashboardplan pattern.

**Foundation:** SDD explore of octavo-fuego's own codebase — 14 components audited, 16 issues found (3 Critical, 10 High, 3 Low), 7 fixable in 1 CSS line.

## Scope

### In Scope

- **Phase 1 — Critical Fixes (4):** Hamburger menu JS + mobile drawer, WhatsApp CTA always-visible on touch, safe-area-inset for FloatingWhatsApp + navbar + body, navbar icon collision with logo on ≤375px
- **Phase 2 — Touch & Input UX (6):** `touch-action: manipulation` global, `-webkit-tap-highlight-color: transparent`, 44×44px touch targets (footer icons, checkout selects, qty buttons, cart delete), `overscroll-behavior` on cart/checkout, anti-zoom iOS (`text-base md:text-sm` per component — not global)
- **Phase 3 — Layout & Navigation (8):** Cart badge nanostores binding, hardcoded URL → locale-aware redirects, PricingTable responsive grid (3→2→1) + sticky weight column, sticky checkout nav buttons, cart image sizing, snap-scroll on product grids, `flex-col sm:flex-row` in headers/action bars
- **Phase 4 — Polish & Consistency (8):** Blog dark-theme removal (→ light theme), text-justify → text-left on mobile, px→rem spacing audit, blog hero gradient reduction, `scrollbar-gutter: stable`, cart drawer body lock, `<dialog>` modal responsive (full-width mobile), `data-breakpoint` CSS-first breakpoint detection on `<html>`

### Out of Scope

- PWA/service-worker installation
- New mobile-specific navigation redesign (menu structure stays)
- Checkout form multi-step refactor beyond sticky nav
- Localization of blog content
- Full accessibility audit beyond touch-target sizing

## Dashboardplan Patterns Referenced

| Pattern # | Name | Source | Mapped to Fixes |
|-----------|------|--------|-----------------|
| 1 | `text-base md:text-sm` anti-zoom | dashboardplan `input.tsx` | Fix #10 (per component) |
| 2 | Sheet hamburger menu ≤768px | dashboardplan `admin/layout.tsx` | Fix #1 |
| 3 | Snap-scroll horizontal cards | dashboardplan grid component | Fix #16 |
| 4 | 44×44px minimum touch targets | dashboardplan icon buttons | Fixes #4a-4e |
| 5 | `flex-col sm:flex-row` headers | dashboardplan page headers | Fix #17 |
| 6 | Sticky table columns iPad | dashboardplan `ThSticky` | Fix #18 |
| 7 | Modal `w-full sm:max-w-lg sm:rounded-lg` | dashboardplan dialog | Fix #20 |
| 8 | `touch-action: manipulation` global | dashboardplan `global.css` | Fix #7 |
| 9 | Breakpoint CSS-first (`data-breakpoint`) | dashboardplan vanilla pattern | Fix #21 |
| 10 | `overscroll-behavior: none` on modals | dashboardplan layout | Fix #9 |

## Capabilities

### Modified Capabilities

- **ui**: Touch-input behavior, safe-area awareness, responsive breakpoint handling, modal/dialog responsiveness, navbar layout
- **ecommerce**: Cart badge visibility, locale-aware cart URLs, mobile cart/checkout layout, product grid snap-scroll

## Approach — 4 Phases

### Phase 1: Critical Fixes (CSS + vanilla JS, 1 session)

| # | Fix | File | Line | Change | Complexity | Pattern |
|---|-----|------|------|--------|------------|---------|
| 1 | Hamburger menu JS + mobile drawer | `Navbar.astro` | 88–91 | Add `<script>` with open/close toggle on button click. Insert mobile drawer `<div id="mobile-menu" class="hidden fixed inset-0 z-40 bg-white...">` with nav links after line 93. Anchor links to locale-aware `baseUrl`. | JS needed | Pattern 2: Sheet hamburger |
| 2 | WhatsApp CTA always-visible on touch | `ProductCard.astro` | 86 | Replace `opacity-0 group-hover:opacity-100` with `opacity-100 @media (hover: hover) { opacity-0 group-hover:opacity-100 }` | 1-line CSS | Adapted from Pattern 5 |
| 3 | Safe-area-inset: FloatingWhatsApp | `FloatingWhatsApp.astro` | 21 | `bottom-6` → `bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))]` | 1-line CSS | Pattern 7 dashboardplan: safe-area |
| 3b | Safe-area-inset: fixed navbar | `Navbar.astro` | 17 | `top-0` → `top-[env(safe-area-inset-top,0px)]`, add `pt-[env(safe-area-inset-top,0px)]` on spacer div line 95 | 2-line CSS | Pattern 7 |
| 3c | Safe-area-inset: body padding | `Layout.astro` | 87 | Add `style="padding-bottom: env(safe-area-inset-bottom,0px)"` on `<body>` | 1-line CSS | Pattern 7 |
| 4 | Navbar icon collision with logo on ≤375px | `Navbar.astro` | 21, 77 | **Logo text:** `text-xl md:text-2xl` → `text-base sm:text-lg md:text-2xl`. **Right icons:** `gap-3` → `gap-1.5 sm:gap-3`. Reduces icon cluster from ~140px → ~125px on 375px screens. | 2-line CSS | New (user-reported) |

### Phase 2: Touch & Input UX (CSS-only, 1 session)

| # | Fix | File | Line | Change | Complexity | Pattern |
|---|-----|------|------|--------|------------|---------|
| 5a | Footer social icons 44×44px | `Footer.astro` | 83–101 | `w-7 h-7` → `w-11 h-11` with `p-2` on parent `<a>` | 3-line CSS | Pattern 4: 44×44px |
| 5b | Footer contact icons 44×44px | `Footer.astro` | 59–80 | `w-7 h-7` → `w-11 h-11` with `p-2` on parent `<a>` | 3-line CSS | Pattern 4 |
| 5c | Checkout select touch target | `CheckoutForm.tsx` | 223 | `h-8` → `h-11` | 1-line CSS | Pattern 4 |
| 5d | Cart qty buttons touch target | `carrito/index.astro` | 128, 134 | `w-10 h-10` → `w-11 h-11 min-w-[44px] min-h-[44px]` | 1-line CSS | Pattern 4 |
| 5e | Cart delete button touch target | `carrito/index.astro` | 118 | Add `min-w-[44px] min-h-[44px]` to delete `<button>` | 1-line CSS | Pattern 4 |
| 5f | Cart drawer qty buttons 44×44px | `CartDrawer.tsx` | 149–166 | `w-8 h-8` → `w-11 h-11 min-w-[44px] min-h-[44px]` | 1-line CSS | Pattern 4 |
| 5g | Cart drawer delete button 44×44px | `CartDrawer.tsx` | 168–173 | `p-2` → `p-3 min-w-[44px] min-h-[44px]` | 1-line CSS | Pattern 4 |
| 5h | Cart drawer close button 44×44px | `CartDrawer.tsx` | 33–38 | `p-2` → `p-3 min-w-[44px] min-h-[44px]` | 1-line CSS | Pattern 4 |
| 6 | Hardcoded URL → locale-aware redirects | `carrito/index.astro` | 39, 65, 68 | Replace hardcoded `/es/tienda` paths with JS that reads `window.location.pathname` first segment as locale | JS needed | New (locale-aware) |
| 7 | `touch-action: manipulation` global | `global.css` | ~148 | Add `touch-action: manipulation` inside `body { ... }` block | 1-line CSS | Pattern 8: touch-action |
| 8 | `-webkit-tap-highlight-color: transparent` | `global.css` | ~148 | Add `-webkit-tap-highlight-color: transparent` inside `body { ... }` | 1-line CSS | Pattern 8-related |
| 9 | `overscroll-behavior` on cart/checkout | `global.css` | — | Add `html.overflow-hidden { overscroll-behavior: none }` rule (cart drawer toggles `overflow-hidden` on `<html>`) | 3-line CSS | Pattern 10: overscroll |
| 10 | Anti-zoom iOS: per-component `text-base` | `input.tsx`, `CheckoutForm.tsx` | input.tsx L9, CheckoutForm L213 | Ensure every input/select/textarea uses `text-base md:text-sm`. **NOT a global rule** — per-component granularity follows dashboardplan Pattern 1 exactly. | CSS audit | Pattern 1: text-base on inputs |

### Phase 3: Layout & Navigation (mixed CSS/JS, 1–2 sessions)

| # | Fix | File | Line | Change | Complexity | Pattern |
|---|-----|------|------|--------|------------|---------|
| 11 | Cart badge nanostores binding | `Navbar.astro` | 82 | Remove `hidden` class from badge span; add `<script>` subscribing to `cartStore` → update `textContent` + toggle `hidden` when count=0 | JS needed | New (nanostores) |
| 12 | PricingTable responsive grid | `PricingTable.astro` | 53 | `grid-cols-3` → `grid-cols-2 sm:grid-cols-3` — columns collapse gradually to prevent cramped buttons at 320px | 1-line CSS | New |
| 13 | Sticky checkout nav buttons | `CheckoutForm.tsx` | 374–394 | Wrap nav buttons in `<div class="sticky bottom-0 bg-white pt-4 border-t border-humo/30">` — remove existing `mt-8 pt-6 border-t` from flex container | 3-line HTML | Pattern 10: sticky |
| 14 | Cart item image sizing | `carrito/index.astro` | 104–107 | `w-full sm:w-32` → `w-20 sm:w-32` (reduce from full-width to constrained on mobile) | 2-line HTML | New |
| 15 | Text-justify → text-left on narrow screens | `ProphecyContent.astro` | 64, 76, 85, 95, 111 | Replace `text-justify` with `text-left md:text-justify` on all `<p>` elements | 5-line CSS | New (rivers fix) |
| 16 | Snap-scroll on product grids | `pages/[locale]/tienda/rape/index.astro`, `pages/[locale]/tienda/index.astro` | Product grid containers | Wrap product card grids in `flex overflow-x-auto pb-4 gap-4 snap-x md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:pb-0`. Cards: `min-w-[280px] md:min-w-0 snap-center flex-shrink-0` | 5-line HTML per page | Pattern 3: snap-scroll cards |
| 17 | `flex-col sm:flex-row` in all headers/action bars | PDP, cart header, checkout steps | Header containers | Audit and apply: `flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3` consistently across all page headers and action bars | CSS audit | Pattern 5: flex-col headers |
| 18 | Sticky weight column in PricingTable | `PricingTable.astro` | 53–73 | On iPad/tablet (`sm:`), make the first column (10g/20g/30g weight labels) sticky with `position: sticky; left: 0; z-index: 10; background: white` | 5-line CSS | Pattern 6: sticky columns |

### Phase 4: Polish & Consistency (CSS-only, ½ session)

| # | Fix | File | Line | Change | Complexity | Pattern |
|---|-----|------|------|--------|------------|---------|
| 19a | Blog index light theme | `blog/index.astro` | 80, 112 | `bg-humo/20 border-humo` → `bg-papel/50 border-gray-200` | 2-line CSS | New |
| 19b | Blog post detail light theme | `blog/[slug].astro` | 261, 264, 278 | `prose-invert` → `prose`, `border-humo` → `border-gray-200`, `bg-humo/20` → `bg-papel/50`. **Audit all `text-white` classes** — replace with `text-[var(--near-black)]` where needed | 3-line CSS + audit | New |
| 19c | Checkout form light theme | `CheckoutForm.tsx` | 144 | `bg-humo/20 border-humo/30` → `bg-papel/50 border-gray-200` | 1-line CSS | New |
| 19d | Checkout confirmation light theme | `CheckoutForm.tsx` | 339 | `bg-humo/20` → `bg-papel/50` | 1-line CSS | New |
| 20 | Blog hero gradient reduction | `blog/[slug].astro` | 224 | `from-black/80 via-black/40` → `from-black/40 via-black/20` | 1-line CSS | New |
| 21 | Spacing px→rem audit | `global.css` | 90–101 | Replace px values in `--shadow-*` and `--space-*` with rem equivalents (`4px` → `0.25rem`, etc.) | Multi-line CSS | New |
| 22 | `scrollbar-gutter: stable` | `global.css` | ~146 | Add `scrollbar-gutter: stable` to `html { ... }` — prevents layout shift when cart drawer opens | 1-line CSS | New |
| 23 | Cart drawer body scroll lock | `Layout.astro` or cart page | — | Add `overflow-hidden` class toggle on `<body>` when cart drawer opens (subscribe to cart drawer state) | JS needed | New |
| 24 | Modal `<dialog>` responsive | All modal/dialog components | — | Use native HTML `<dialog>` with `w-full sm:max-w-lg sm:rounded-lg` pattern. Footer: `flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2` | CSS + HTML | Pattern 7: modal responsive |
| 25 | `data-breakpoint` CSS-first breakpoints | `Layout.astro` | `<head>` | Add inline `<script>` that sets `document.documentElement.dataset.breakpoint = 'sm' | 'md' | 'lg'` on resize. Enables CSS-only breakpoint queries without React `useEffect`. | ~15 lines JS | Pattern 9: breakpoints CSS-first |

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Hamburger menu | Vanilla JS `<script>` in Astro | No React island overhead; menu is static links, not interactive state. SSR-friendly. Pattern 2 from dashboardplan — their `<Sheet>` is React but we replace with vanilla equivalent. |
| WhatsApp CTA touch visibility | CSS `@media (hover: hover)` | Zero JS; browsers that support hover get the animation; touch devices get always-visible. Progressive enhancement. |
| Cart badge reactivity | Nanostores `subscribe()` in `<script>` | Cart store already uses nanostores (cartStore.ts); subscribe is 1KB pattern vs React island overhead. |
| Locale-aware redirects | Read `pathname` first segment in cart page `<script>` | Single Astro page serves all locales; no need for React. |
| Safe-area-inset | CSS `env()` | Standard iOS API. Works natively without JS. |
| Anti-zoom input sizing | Per-component `text-base md:text-sm` | Dashboardplan Pattern 1 — more granular than a global CSS rule. Avoids overriding intentional small text in non-input contexts. |
| Sticky checkout nav | CSS `position: sticky` | Pure CSS. No JS needed for sticky-on-scroll behavior. |
| Breakpoint detection | `data-breakpoint` attribute on `<html>` via 15-line inline script | Dashboardplan uses React `useEffect`/`useState` for this — Astro equivalent is vanilla JS. Enables `[data-breakpoint="sm"]` CSS selectors without framework dependency. |
| Snap-scroll product grids | CSS `flex overflow-x-auto snap-x` + Grid fallback at `md:` | Pattern 3 from dashboardplan. Progressive enhancement: mobile gets natural swipe, desktop gets standard grid. |
| Modal responsiveness | Native `<dialog>` element | 97%+ browser support. Avoids React island for simple modals. Dashboardplan uses Radix `<Dialog>` (React) — Astro alternative. |

## Files Affected

| File | Lines | Changes |
|------|-------|---------|
| `src/components/Navbar.astro` | 17, 21, 77, 82, 88–91, 95 | Safe-area, logo/icon sizing, cart badge, hamburger JS, mobile drawer |
| `src/components/product/ProductCard.astro` | 86 | WhatsApp CTA visibility |
| `src/components/ui/FloatingWhatsApp.astro` | 21 | Safe-area bottom |
| `src/components/Footer.astro` | 59–80, 83–101 | Touch targets (social + contact icons) |
| `src/components/product/PricingTable.astro` | 53–73 | Responsive grid + sticky weight column |
| `src/components/prophecy/ProphecyContent.astro` | 64, 76, 85, 95, 111 | Text-justify → text-left |
| `src/components/cart/CartDrawer.tsx` | 33–38, 149–173 | Touch targets (close, qty, delete) |
| `src/components/checkout/CheckoutForm.tsx` | 144, 223, 339, 374–394 | Theme, select target, sticky nav |
| `src/components/ui/input.tsx` | 9 | Verify `text-base` is present |
| `src/layouts/Layout.astro` | `<head>`, 87 | `data-breakpoint` script, safe-area body padding |
| `src/pages/carrito/index.astro` | 39, 65, 68, 104–107, 118, 128, 134 | Locale redirects, image sizing, touch targets |
| `src/pages/blog/index.astro` | 80, 112 | Theme |
| `src/pages/blog/[slug].astro` | 224, 261, 264, 278 | Theme, hero gradient |
| `src/pages/[locale]/tienda/index.astro` | Product grid | Snap-scroll wrapper |
| `src/pages/[locale]/tienda/rape/index.astro` | Product grid | Snap-scroll wrapper |
| `src/pages/[locale]/tienda/rape/[product].astro` | Header | `flex-col sm:flex-row` audit |
| `src/styles/global.css` | ~89–101, ~146–151 | touch-action, tap-highlight, scrollbar-gutter, overscroll, px→rem |

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Nanostores `subscribe()` in Astro `<script>` may not resolve import path | Med | Use inline `<script>` pattern already proven in `PricingTable.astro` and `carrito/index.astro` |
| `@media (hover: hover)` won't work on hybrid laptops (touch + pointer) | Low | Hybrid devices treat primary input as hover-capable; CTA still shows on hover. Worst case: users see the button (acceptable UX). |
| Safe-area-inset may shift layout unexpectedly | Low | Test on iPhone Simulator (Xcode) before deploy. Use `max()` to ensure minimum spacing. |
| Blog theme change may break `text-white` breadcrumbs from dark bg | Med | Audit all `text-white` classes in blog pages — replace with `text-[var(--near-black)]` where needed. |
| Cart URL locale detection may fail on edge-case paths | Low | Fallback to `'es'` if no valid locale prefix detected. Test with `/en/carrito`, `/pt/carrito`, `/carrito`. |
| `scrollbar-gutter: stable` may add visible gutter on Windows | Low | Only apply on `html`; Windows scrollbars are overlay by default in modern browsers. |
| Navbar logo text reduction may affect brand readability | Low | `text-base` = 16px on ≤375px. Still readable. Image logo remains visible as identifier. |
| `data-breakpoint` script may conflict with Astro View Transitions | Med | Guard with `astro:after-swap` event listener if View Transitions are enabled. |

## Success Metrics

### Phase 1 — Critical Fixes
- [ ] Tapping hamburger icon on iOS Safari opens mobile navigation drawer with all links
- [ ] WhatsApp "Comprar" button is visible on ProductCard without hovering (touch device)
- [ ] FloatingWhatsApp button fully visible above iPhone X+ home indicator
- [ ] Fixed navbar doesn't overlap with iPhone notch/status bar
- [ ] Logo + right-side 3 icons don't collide on 375px iPhone SE

### Phase 2 — Touch & Input UX
- [ ] All interactive elements have ≥44×44px touch area (verified via browser DevTools ruler)
- [ ] 300ms tap delay eliminated on iOS (stopwatch test: button responds instantly)
- [ ] Cart page links redirect to locale-correct paths (`/en/carrito` → `/en/tienda`)
- [ ] Cart badge updates in real-time when items added/removed
- [ ] No blue highlight flash on button taps (iOS)
- [ ] Cart/checkout pages don't bounce past boundaries on overscroll
- [ ] iOS doesn't zoom when focusing form inputs

### Phase 3 — Layout & Navigation
- [ ] PricingTable: 1 column at 320px, 2 at 480px, 3 at 640px+
- [ ] PricingTable weight column sticky on iPad scrolling
- [ ] Checkout nav buttons sticky at bottom of viewport during scroll
- [ ] Cart item images proportional on mobile (not full-width squares)
- [ ] Prophecy text left-aligned on mobile (no justification rivers)
- [ ] Product grids swipe horizontally with snap points on mobile
- [ ] All page headers stack vertically on mobile, horizontally on tablet+

### Phase 4 — Polish & Consistency
- [ ] Blog pages match site's light theme (white bg, dark text)
- [ ] Blog hero overlay subtle, not crushing text
- [ ] Layout doesn't shift when cart drawer opens/closes
- [ ] Spacing tokens use rem consistently
- [ ] Checkout form matches light theme
- [ ] Modals full-width on mobile, centered on desktop
- [ ] `data-breakpoint` attribute correctly reflects viewport width

## Rollback Plan

All changes are CSS class swaps and isolated `<script>` additions. No database migrations, no API changes. Revert via `git revert` per phase:

1. `git revert <phase-1-commit>` — hamburger menu, WhatsApp CTA, safe-area, navbar collision
2. `git revert <phase-2-commit>` — touch targets, global CSS, locale redirects
3. `git revert <phase-3-commit>` — layout fixes, snap-scroll, sticky elements
4. `git revert <phase-4-commit>` — theme harmony, polish

Each phase ships as an independent commit. If Phase 2 breaks something, Phase 1's fixes are unaffected.

## Dependencies

- None externally. All fixes are self-contained within the Astro project.
- Nanostores already installed and used by `cartStore.ts`.
- No new npm packages required.
- Vanilla JS patterns are already used in the codebase (PricingTable.astro, cart page).
