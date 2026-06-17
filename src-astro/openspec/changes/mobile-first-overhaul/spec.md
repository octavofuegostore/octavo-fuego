# Spec: mobile-first-overhaul

**Status**: `spec-draft` | **Domains**: ui, ecommerce | **Phases**: 4 | **Fixes**: 25

## ui — Requirements

| ID | Requirement | P | GIVEN→WHEN→THEN |
|----|-------------|---|-----------------|
| HMB | Hamburger drawer: vanilla JS toggle `<div id="mobile-menu">` at ≤768px, body scroll-lock | 1 | Tap → drawer with locale links |
| WAC | WhatsApp CTA: `@media(hover:hover)` gates opacity; touch sees always-visible | 1 | Touch → CTA opacity-100 |
| SAF | Safe-area: `env(safe-area-inset-*)` on navbar/WhatsApp/body | 1 | iPhone X+ → button visible, navbar clear |
| NIC | Logo `text-base sm:text-lg`, icons `gap-1.5 sm:gap-3` | 1 | 375px → no collision |
| TAM | `touch-action:manipulation` on body | 2 | iOS tap → no delay |
| THL | `-webkit-tap-highlight-color:transparent` | 2 | iOS tap → no flash |
| OVB | `overscroll-behavior:none` on `html.overflow-hidden` | 2 | Cart open + overscroll → no rubber-band |
| TT44 | 44×44px touch: footer `w-11 p-2`, cart/checkout/qty `min-w-[44px] min-h-[44px]`, select `h-11` | 2 | DevTools ruler → interactive ≥44px |
| TBO | Trust badges H3: `text-base sm:text-lg` | 2 | iPhone SE → fits without overflow |
| ICG | Intention cards: `gap-3 sm:gap-4` | 2 | 375px → cards don't squeeze |
| BLG | Blog light theme: `bg-papel/50 border-gray-200 prose` (was dark `bg-humo prose-invert`) | 4 | Blog page → light bg, dark text |
| BGH | Blog hero gradient: `from-black/40 via-black/20` (was /80+/40) | 4 | Mobile → overlay subtle, text readable |
| BRK | `data-breakpoint` on `<html>` via 15-line resize script | 4 | 375px → `sm`; 1024px → `lg` |
| MDL | `<dialog>`: `w-full sm:max-w-lg sm:rounded-lg`, footer `flex-col-reverse sm:flex-row` | 4 | Mobile → full-width; desktop → centered |
| NAV | Navbar: + `top-[env(safe-area-inset-top)]` (modifies existing fixed navbar) | 1 | Notch → navbar aligns below safe-area |
| AZM | Input anti-zoom: enforce `text-base md:text-sm` per-component (audit input.tsx, CheckoutForm.tsx) | 2 | iOS focus → no viewport zoom |
| SPX | Spacing px→rem: convert `--shadow-*`/`--space-*` tokens | 4 | Font-size change → spacing scales proportionally |
| SBG | `scrollbar-gutter:stable` on `<html>` | 4 | Drawer opens → no CLS layout shift |
| BSL | Body scroll-lock: toggle `overflow-hidden` when drawer opens | 4 | Drawer open → background doesn't scroll |

## ecommerce — Requirements

| ID | Requirement | P | GIVEN→WHEN→THEN |
|----|-------------|---|-----------------|
| CBD | Cart badge: vanilla JS subscribes nanostores `cartStore`, hides badge when 0 | 3 | Add → increments; empty → badge hidden |
| LCL | Locale-aware redirects: read `pathname[0]`, fallback `es` | 3 | `/en/carrito` → links to `/en/tienda` |
| SPS | Snap-scroll grids: mobile `flex overflow-x-auto snap-x min-w-[280px]`, md+ `grid grid-cols-2 lg:grid-cols-3` | 3 | Swipe PLP → cards snap-center |
| SKY | Sticky checkout nav: `sticky bottom-0 bg-white pt-4 border-t` | 3 | Scroll form → buttons stick at bottom |
| CIT | Cart images: `w-20 sm:w-32` (was `w-full sm:w-32`) | 3 | Mobile → 80px proportionate images |
| PTG | PricingTable: `grid-cols-2 sm:grid-cols-3`, col-1 `sticky left-0` (was `grid-cols-3`) | 3 | 375px→2cols; iPad→weight col sticky |
| PHH | Headers: `flex-col sm:flex-row sm:items-center sm:justify-between gap-3` (was row) | 3 | Mobile → title + actions stack vertically |
| PRO | Prophecy text: `text-left md:text-justify` on all `<p>` (was `text-justify`) | 3 | Mobile → left-aligned, no rivers |
| CDR | CartDrawer: 44×44px qty/close/delete buttons (was 32–40px; component orphan) | 2 | Future render → ≥44px touch targets |
| CHT | Checkout theme: `bg-papel/50 border-gray-200` (was `bg-humo/20 border-humo/30`) | 4 | Checkout → light theme match |

## Non-Functional

Touch ≥44px (WCAG 2.5.5). Vanilla JS for static UI (no React islands). CSS progressive: snap→grid, hover→touch. `aria-label` on hamburger. `scrollbar-gutter:stable` prevents CLS. Rollback per-phase via `git revert`.
