# Tasks: Mobile-First Overhaul

## Phase 1: Critical (4 tasks, ~47 lines)

- [ ] 1.1 **Hamburger menu JS + drawer** (Fix #1) — `Navbar.astro` L88–93. Add `<script>` toggle on hamburger click; inject `<div id="mobile-menu">` after L93 with overlay + locale-nav links + body scroll-lock. `astro:page-load` guard. | 30min | Tap opens drawer, body locked
- [ ] 1.2 **WhatsApp CTA touch** (Fix #2) — `ProductCard.astro` L86. `opacity-0 group-hover:opacity-100` → `opacity-100 @media(hover:hover){opacity-0 group-hover:opacity-100}`. | 5min | CTA visible on touch, hover animation on desktop
- [ ] 1.3 **Safe-area 3 targets** (Fixes #3a–c, NAV) — `FloatingWhatsApp.astro` L21 `bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))]`; `Navbar.astro` L17 `top-[env(safe-area-inset-top,0px)]` + spacer L95; `Layout.astro` L87 body `style="padding-bottom:env(safe-area-inset-bottom,0px)"`. | 15min | iPhone X+ → buttons clear, navbar below notch
- [ ] 1.4 **Navbar collision ≤375px** (Fix #4) — `Navbar.astro` L21 logo `text-base sm:text-lg`, L77 icons `gap-1.5 sm:gap-3`. | 10min | 375px → no logo+icon overlap

## Phase 2: Touch & Input UX (9 tasks, ~54 lines)

- [ ] 2.1 **Global touch UX** (Fixes #7, #8) — `global.css` L148. `touch-action:manipulation`, `-webkit-tap-highlight-color:transparent` inside `body{}`. | 5min | iOS → no 300ms delay, no blue flash
- [ ] 2.2 **Overscroll lock** (Fix #9) — `global.css`: `html.overflow-hidden{overscroll-behavior:none}`. | 5min | Cart open + overscroll → no rubber-band
- [ ] 2.3 **Footer 44×44px** (Fixes #5a, #5b) — `Footer.astro` L59–101. Contact+social icons `w-11 h-11` with `p-2` on parent `<a>`. | 15min | Ruler → all footer links ≥44px
- [ ] 2.4 **Cart qty+delete 44×44px** (Fixes #5d, #5e) — `carrito/index.astro` L128/134 qty, L118 delete: `min-w-[44px] min-h-[44px]`. | 10min | Ruler → all ≥44px
- [ ] 2.5 **Checkout select + anti-zoom** (Fixes #5c, #10) — `CheckoutForm.tsx` L223 `h-8→h-11`; audit `input.tsx` L9, `CheckoutForm.tsx` L213 for `text-base md:text-sm`. | 15min | iOS focus → no zoom; select ≥44px
- [ ] 2.6 **QuickViewModal qty 44px** (Fix #5i) — `QuickViewModal.astro` L54/67 `min-w-[44px] min-h-[44px]`. | 5min | Ruler → qty buttons ≥44px
- [ ] 2.7 **Locale-aware redirects** (Fix #6) — `carrito/index.astro` L39/65/68. JS reads `pathname.split('/')[1]`, fallback `es`. Replace hardcoded `/es/tienda`. | 15min | `/en/carrito` links → `/en/tienda`
- [ ] 2.8 **Trust badges + cards ≤375px** (Fixes #5j, #5k) — `index.astro` L123/132/141 H3 `text-base sm:text-lg`; L159 gap `gap-3 sm:gap-4`. | 10min | iPhone SE → no overflow, cards breathe
- [ ] 2.9 ⚠️ **CartDrawer 44×44px (future)** (Fixes #5f–h) — `CartDrawer.tsx` L149–166 qty, L168–173 delete, L33–38 close: `min-w-[44px] min-h-[44px]`. Gate on activation (orphan). | 10min | When active → all ≥44px

## Phase 3: Layout & Navigation (8 tasks, ~54 lines)

- [ ] 3.1 **Cart badge nanostores** (Fix #11) — `Navbar.astro` L82. Remove `hidden`; add `<script>`: `cartCount.subscribe(count→{badge update; toggle hidden when 0})`. | 20min | Add item → badge; empty → hidden
- [ ] 3.2 **PricingTable grid** (Fix #12) — `PricingTable.astro` L53 `grid-cols-2 sm:grid-cols-3` (was 3). | 5min | 375px→2col, 640px+→3col
- [ ] 3.3 **Sticky checkout nav** (Fix #13) — `CheckoutForm.tsx` L374–394. Wrap in `sticky bottom-0 bg-white pt-4 border-t`; remove `mt-8 pt-6`. | 15min | Scroll → buttons stick at bottom
- [ ] 3.4 **Cart image sizing** (Fix #14) — `carrito/index.astro` L104–107 `w-20 sm:w-32` (was `w-full`). | 5min | Mobile→80px proportionate, desktop→128px
- [ ] 3.5 **Text-justify→left** (Fix #15) — `ProphecyContent.astro` L64/76/85/95/111 `text-left md:text-justify`. | 10min | Mobile → left-aligned, no rivers
- [ ] 3.6 **Snap-scroll grids** (Fix #16) — `tienda/index.astro` + `rape/index.astro`. Wrap in `flex overflow-x-auto snap-x gap-4 pb-4 md:grid md:grid-cols-2 lg:grid-cols-3`. Cards: `min-w-[280px] snap-center flex-shrink-0 md:min-w-0`. CategoryPills excluded (already done). | 25min | Mobile → swipe with snap, desktop → grid
- [ ] 3.7 **flex-col headers** (Fix #17) — `[product].astro` + audit. `flex-col sm:flex-row sm:justify-between gap-3`. | 15min | Mobile→stacked, tablet+→row
- [ ] 3.8 **Sticky weight column** (Fix #18) — `PricingTable.astro` L53–73 col-1: `sm:sticky sm:left-0 sm:z-10 sm:bg-white`. | 10min | iPad scroll → labels stay visible

## Phase 4: Polish & Consistency (7 tasks, ~52 lines)

- [ ] 4.1 **Blog light theme** (Fixes #19a, #19b) — `blog/index.astro` L80/112 `bg-humo→bg-papel/50 border-gray-200`. `blog/[slug].astro` L261/264/278 `prose-invert→prose`; audit `text-white→text-[var(--near-black)]`. | 20min | Blog → light bg, dark text
- [ ] 4.2 **Checkout light theme** (Fixes #19c, #19d) — `CheckoutForm.tsx` L144 `bg-humo/20 border-humo/30→bg-papel/50 border-gray-200`, L339 `bg-humo/20→bg-papel/50`. | 5min | Checkout → matches site theme
- [ ] 4.3 **Blog hero gradient** (Fix #20) — `blog/[slug].astro` L224 `from-black/80 via-black/40→/40 via-/20`. | 5min | Mobile → overlay subtle, text readable
- [ ] 4.4 **px→rem spacing** (Fix #21) — `global.css` L90–101. Convert `--shadow-*`/`--space-*` px→rem (`4px→0.25rem`). | 15min | `astro build` → no spacing regressions
- [ ] 4.5 **scrollbar-gutter** (Fix #22) — `global.css` L146. `scrollbar-gutter:stable` on `html{}`. | 5min | Drawer open/close → no CLS shift
- [ ] 4.6 ⚠️ **Modal + body lock (future)** (Fixes #23, #24) — `Layout.astro`: toggle `overflow-hidden` on `<body>` (cart state). `<dialog>`: `w-full sm:max-w-lg sm:rounded-lg`; footer `flex-col-reverse sm:flex-row`. Gates on CartDrawer activation. | 15min | Drawer open→body locked; dialog responsive
- [ ] 4.7 **data-breakpoint** (Fix #25) — `Layout.astro` `<head>`. 15-line `<script>`: sets `dataset.breakpoint='sm'|'md'|'lg'` on resize (640/768/1024). `astro:after-swap` guard. | 15min | 375px→`sm`, 1024px→`lg`

---

## Review Workload Forecast

| Phase | Tasks | Δ Lines | Running |
|-------|-------|---------|---------|
| 1 — Critical | 4 | ~47 | 47 |
| 2 — Touch UX | 9 | ~54 | 101 |
| 3 — Layout | 8 | ~54 | 155 |
| 4 — Polish | 7 | ~52 | 207 |

✅ **207 estimated lines** — within 400-line D1 budget. **Slack: ~193 lines**.

**Excluded**: CategoryPills snap-scroll (exists), Footer responsive grid (done).

**Future-gated** (CartDrawer orphan): 2.9, 4.6. ⚠️ CSS applied; JS deferred until activation.
