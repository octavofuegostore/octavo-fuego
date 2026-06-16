# Apply Progress: Mobile-First Overhaul

**Change**: mobile-first-overhaul
**Mode**: Standard (no TDD configured)
**Completed**: 2026-06-16

---

## Phase 1: Critical Fixes ✅

**Commit**: `2e79fe6` — `fix(mobile): hamburger menu, safe-area, navbar collision (#1-4)`
**Files**: 4 changed, 74 insertions, 9 deletions
**Build**: ✅ 34 pages, 0 errors

- [x] 1.1 **Hamburger menu JS + drawer** (Fix #1) — `Navbar.astro`: Vanilla JS toggle with `astro:page-load` guard. Mobile drawer with overlay (bg-black/50), right panel (w-72 max-w-[85vw]), locale-aware nav links, LanguageSwitcher. Body scroll-lock on open, close on overlay/Escape/link click.
- [x] 1.2 **WhatsApp CTA touch** (Fix #2) — `ProductCard.astro`: `opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100`. Always visible on touch, hover animation on desktop.
- [x] 1.3 **Safe-area 3 targets** (Fixes #3a-c) — `FloatingWhatsApp.astro` bottom calc(), `Navbar.astro` top env(), `Layout.astro` body padding-bottom env().
- [x] 1.4 **Navbar collision ≤375px** (Fix #4) — `Navbar.astro`: logo text-base sm:text-lg, icon gap-1.5 sm:gap-3.

## Phase 2: Touch & Input UX ✅

**Commit**: `3a46b99` — `fix(mobile): touch targets, tap delay, anti-zoom (#5-13)`
**Files**: 7 changed, 48 insertions, 31 deletions
**Build**: ✅ 34 pages, 0 errors

- [x] 2.1 **Global touch UX** (Fixes #7, #8) — `global.css`: `touch-action: manipulation` + `-webkit-tap-highlight-color: transparent` on body.
- [x] 2.2 **Overscroll lock** (Fix #9) — `global.css`: `html.overflow-hidden { overscroll-behavior: none }`.
- [x] 2.3 **Footer 44×44px** (Fixes #5a, #5b) — `Footer.astro`: Contact+social icons w-11 h-11 with p-2 on parent `<a>`.
- [x] 2.4 **Cart qty+delete 44×44px** (Fixes #5d, #5e) — `carrito/index.astro`: qty buttons w-11 h-11 min-w/h-[44px], delete button min-w/h-[44px].
- [x] 2.5 **Checkout select + anti-zoom** (Fixes #5c, #10) — `CheckoutForm.tsx`: select h-11 + text-base md:text-sm; textarea text-base; `input.tsx` already has text-base.
- [x] 2.6 **QuickViewModal qty 44px** (Fix #5i) — `QuickViewModal.astro`: qty buttons w-11 h-11 min-w/h-[44px] (new audit fix).
- [x] 2.7 **Locale-aware redirects** (Fix #6) — `carrito/index.astro`: Dynamic locale detection from pathname; buttons use event listeners instead of hardcoded onclick.
- [x] 2.8 **Trust badges + cards ≤375px** (Fixes #5j, #5k) — `index.astro`: H3 text-base sm:text-lg, intention cards gap-3 sm:gap-4 (new audit fixes).
- [x] 2.9 ⚠️ **CartDrawer 44×44px** (Fixes #5f-h) — `CartDrawer.tsx`: qty/close/delete buttons w-11 h-11 min-w/h-[44px]. **Future-gated: component activation pending.**

## Phase 3: Layout & Navigation ✅

**Commit**: `2539b25` — `fix(mobile): layout, snap-scroll, sticky nav (#14-21)`
**Files**: 8 changed, 31 insertions, 12 deletions
**Build**: ✅ 34 pages, 0 errors

- [x] 3.1 **Cart badge nanostores** (Fix #11) — `Navbar.astro`: Dynamic import cartCount, subscribe to update badge text + toggle hidden. Removed static `hidden` from badge span.
- [x] 3.2 **PricingTable grid** (Fix #12) — `PricingTable.astro`: `grid-cols-3` → `grid-cols-2 sm:grid-cols-3`.
- [x] 3.3 **Sticky checkout nav** (Fix #13) — `CheckoutForm.tsx`: Wrapped nav buttons in `sticky bottom-0 bg-white pt-4 border-t`; removed mt-8 pt-6.
- [x] 3.4 **Cart image sizing** (Fix #14) — `carrito/index.astro`: `w-full sm:w-32` → `w-20 sm:w-32` (proportionate on mobile).
- [x] 3.5 **Text-justify→left** (Fix #15) — `ProphecyContent.astro`: All paragraphs `text-justify` → `text-left md:text-justify`.
- [x] 3.6 **Snap-scroll grids** (Fix #16) — `tienda/index.astro` + `rape/index.astro`: `flex overflow-x-auto snap-x` on mobile, `md:grid` on desktop. Cards wrapped in `min-w-[280px] snap-center`. CategoryPills skipped (already has snap-scroll).
- [x] 3.7 **flex-col headers** (Fix #17) — `[product].astro`: `flex-col sm:flex-row sm:items-center sm:justify-between gap-3`.
- [x] 3.8 **Sticky weight column** (Fix #18) — `PricingTable.astro`: First column `sm:sticky sm:left-0 sm:z-10 sm:bg-white`.

## Phase 4: Polish & Consistency ✅

**Commit**: `d6dc4be` — `fix(mobile): theme polish, breakpoints, spacing (#22-28)`
**Files**: 5 changed, 38 insertions, 23 deletions
**Build**: ✅ 34 pages, 0 errors

- [x] 4.1 **Blog light theme** (Fixes #19a, #19b) — `blog/index.astro`: `bg-humo/20 border-humo` → `bg-papel/50 border-gray-200`. `blog/[slug].astro`: `prose-invert` → `prose`, `border-humo` → `border-gray-200`, `bg-humo/20` → `bg-papel/50`.
- [x] 4.2 **Checkout light theme** (Fixes #19c, #19d) — `CheckoutForm.tsx`: `bg-humo/20` → `bg-papel/50`, confirmation text `text-white` → `text-[var(--near-black)]`.
- [x] 4.3 **Blog hero gradient** (Fix #20) — `blog/[slug].astro`: `from-black/80 via-black/40` → `from-black/40 via-black/20`.
- [x] 4.4 **px→rem spacing** (Fix #21) — `global.css`: `--shadow-*` and `--space-*` tokens converted (e.g. `4px` → `0.25rem`, `12px` → `0.75rem`).
- [x] 4.5 **scrollbar-gutter** (Fix #22) — `global.css`: `scrollbar-gutter: stable` on `html`.
- [x] 4.6 ⚠️ **Modal + body lock** (Fixes #23, #24) — `dialog.tsx` already has responsive patterns: `w-full`, `flex-col-reverse sm:flex-row sm:justify-end` in footer. Body lock CSS applied in Phase 1 (hamburger). **Future-gated: CartDrawer JS deferred until component activation.**
- [x] 4.7 **data-breakpoint** (Fix #25) — `Layout.astro`: 15-line inline script sets `document.documentElement.dataset.breakpoint` on resize (sm/md/lg at 640/768/1024). Guarded with `astro:after-swap`.

---

## Summary

| Phase | Commits | Files | +Δ | -Δ | Build |
|-------|---------|-------|-----|-----|-------|
| 1 — Critical | 1 | 4 | 74 | 9 | ✅ |
| 2 — Touch UX | 1 | 7 | 48 | 31 | ✅ |
| 3 — Layout | 1 | 8 | 31 | 12 | ✅ |
| 4 — Polish | 1 | 5 | 38 | 23 | ✅ |
| **Total** | **4** | **18** | **191** | **75** | ✅ |

### Future-Gated Items (CSS applied, JS deferred)
- 2.9: CartDrawer 44×44px touch targets — component is orphan/unused
- 4.6: CartDrawer body lock + dialog responsiveness — component activation required

### Deviations from Design
None significant. Implementation follows design decisions strictly.

### Issues Found
None. All 4 phases build clean with 34 pages, 0 errors.

### Status
**28/28 tasks complete.** Ready for verification and archive.
