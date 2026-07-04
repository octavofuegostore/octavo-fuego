## Exploration: PaymentBanner Visual Issues — Dark Badge Opacity + Icon Visibility

### Current State

The PaymentBanner has two variants (`dark` and `light`). The dark variant is rendered inside the footer (`bg-[var(--color-footer-bg)]: #3D2E22`) and in the checkout page as `light`.

**Dark variant badge styling (PaymentBanner.astro:14-16):**
```css
bg-white/[0.08] backdrop-blur-sm border-white/10 hover:bg-white/[0.14]
```

**Dark variant container styling (line 12-13):**
```css
bg-white/5 border-white/10
```

17 payment SVGs exist in both `public/images/payment/dark/` and `public/images/payment/light/`.

### Issue 1: Badge Opacity — Investigation

**Footer background:** `#3D2E22` (dark brown, defined in `global.css:81`)

**Calculated contrast ratio for `bg-white/[0.08]` on `#3D2E22`: ~1.27:1**

This is catastrophically below WCAG AA minimum (3:1 for non-text UI components). The blended color is approximately `#4C3E34` — barely distinguishable from `#3D2E22`.

**Why it looks "opaco":**
1. **8% white is too transparent** — 92% of the footer bg shows through. At this opacity, the badge blends into the footer as a nearly invisible subtle shift.
2. **`backdrop-blur-sm` is a no-op** — The background behind the badge is a solid color (#3D2E22 or #463A2D for the container). There's nothing to blur. The blur only has an effect when there's an image, gradient, or pattern behind the element.
3. **`border-white/10` contributes** — At 10% opacity on dark brown, the border is almost as invisible as the background. The combined effect is a cards section that looks like it has no structure.
4. **Container `bg-white/5` also too subtle** — The outer container at 5% white (~#463A2D) also barely differentiates from the footer.

**How much opacity is needed for WCAG AA 3:1?**
- At 35% white opacity, the contrast ratio reaches ~3.02:1 — barely hitting AA.
- At 20% opacity: ~1.89:1
- At 15% opacity: ~1.59:1

**Pragmatic assessment:** 35% white would look washed out and break the dark sacred aesthetic. The better approach is to increase opacity enough to be **visibly distinct** (not necessarily WCAG AA for the background, since the badges are decorative containers, not essential UI).

### Issue 2: Icon Visibility — Investigation

#### SVG Fill Color Analysis

| Icon | Dark SVG Fills | Problem? |
|------|----------------|----------|
| **Visa** (control) | `fill="white"` (all paths) | ✅ Works |
| **Mastercard** (control) | `#F94D00`, `#EF0000`, `#FF9600` (warm/red tones) | ✅ Works — bright colors on dark |
| **Amex** | `#006FD4` (blue) + `fill="white"` | ❌ Blue structural paths low contrast on dark |
| **Diners Club** | `fill="white"` circles + `fill="#222"` text + 30% opacity circle | ❌ Multiple problems |
| **Discover** | `fill="white"` + orange gradient | ⚠️ White fills OK but path detail too complex |

**Amex (`public/images/payment/dark/amex.svg`):**
- Uses `fill="#006FD4"` (medium blue) for structural paths that define the logo shape
- Uses `fill="white"` for overlay/shadows
- The blue (`#006FD4`) on a dark brown background (`#3D2E22` or badge bg at `#4C3E34`) has insufficient contrast. The structural blue paths are what make the logo recognizable — without them, it's just white fragments.

**Diners Club (`public/images/payment/dark/diners.svg`):**
- **Only SVG in the entire payment directory using `fill="#222"`** (confirmed via grep)
- Near-black `#222` fill for the "D" letter is invisible on dark backgrounds
- Uses a 1000x250 viewBox (wrong aspect ratio — 4:1 instead of the normal 1:1 of all other icons)
- Uses `<text>` elements (font-size 45 for "D") instead of proper vector paths — text rendering is unreliable and tiny at badge scale
- Second circle at `opacity="0.3"` is effectively invisible
- At `max-h-6` (24px), the SVG scales to ~96px wide, but the "D" letter renders at ~4px — illegible

**Discover (`public/images/payment/dark/discover.svg`):**
- Uses `fill="white"` for all text/path elements — technically visible
- Central circle uses orange-to-yellow gradient — visible
- Problem: extremely detailed vector paths with tiny gaps and thin strokes that blur together at badge scale (24px height)

**Why local payment SVGs (PSE, Nequi, etc.) work fine:**
- PSE: Uses `fill="white"` radial gradient on outer circle + `#285CAA` (blue) and `#FDB718` (gold) inner paths — good contrast
- Nequi: Simple `fill="white"` path — clean white icon
- Bancolombia: `fill="white"` paths on a `fill="#1E1E1E"` circle — white on dark

### Affected Areas
- `src-astro/src/components/PaymentBanner.astro` — badge styling (lines 12-17), image source logic (line 80)
- `src-astro/public/images/payment/dark/amex.svg` — problematic blue fills
- `src-astro/public/images/payment/dark/diners.svg` — near-black fill, wrong aspect ratio, text elements
- `src-astro/public/images/payment/dark/discover.svg` — over-detailed paths for badge scale
- `src-astro/src/styles/global.css` — `--color-footer-bg: #3D2E22` (the root context)

### Approaches

1. **Increase badge opacity + redraw SVGs** — Recommended approach
   - PaymentBanner.astro: Change `bg-white/[0.08]` to `bg-white/[0.15]`, `border-white/10` to `border-white/20`, remove `backdrop-blur-sm`
   - Container: bump `bg-white/5` to `bg-white/8` or `bg-white/10`
   - Hover: bump from `hover:bg-white/[0.14]` to `hover:bg-white/[0.22]`
   - Amex dark SVG: replace `#006FD4` fills with `white` for all paths
   - Diners dark SVG: full rewrite — use proper vector paths at 1:1 viewBox, replace `#222` with `white`
   - Discover dark SVG: simplified vector paths, keep white fills
   - **Effort: Low** (SVG edits are quick, CSS changes are minimal)

2. **Use solid warm background instead of translucent** — Alternative
   - Replace `bg-white/[0.08]` with a warm solid like `bg-[#4A3A2E]` or similar derived from footer
   - More aligned with "Minimalist Sacred" dark aesthetic (earthy, warm)
   - Avoids the washed-out look of high white opacity
   - Still need SVG fixes for amex/diners/discover
   - **Pro**: Looks intentional and designed, not like faded white
   - **Con**: Slightly more CSS to set up, need to ensure solid bg is warm-toned
   - **Effort: Low**

3. **SVG-only fix + minimal CSS** — Minimal change
   - Fix just the 3 problematic SVGs (amex: all white; diners: rewrite; discover: simplify)
   - Bump badge opacity to `bg-white/[0.12]` as a lighter touch
   - Keep `backdrop-blur-sm` (doesn't hurt, even if no-op)
   - **Pro**: Less changes, focused on the reported issue
   - **Con**: Doesn't fully address the "opaco" badge appearance
   - **Effort: Low**

### Recommendation

**Approach 1 (increase badge opacity + redraw problem SVGs)** with the following specifics:

**CSS changes in PaymentBanner.astro:**
```diff
- const badgeStyle = variant === 'dark'
-   ? 'bg-white/[0.08] backdrop-blur-sm border-white/10 hover:bg-white/[0.14]'
-   : 'bg-white border-gray-200 hover:shadow-md hover:border-gray-300';
+ const badgeStyle = variant === 'dark'
+   ? 'bg-white/[0.15] border-white/20 hover:bg-white/[0.25]'
+   : 'bg-white border-gray-200 hover:shadow-md hover:border-gray-300';
```

And for the container:
```diff
- const containerBg = variant === 'dark' ? 'bg-white/5' : 'bg-papel/50';
+ const containerBg = variant === 'dark' ? 'bg-white/[0.08]' : 'bg-papel/50';
```

**SVG changes:**
- **Amex**: Replace ALL `fill="#006FD4"` with `fill="white"` (every instance). The logo structure is conveyed by path shapes, so white paths on dark bg will work.
- **Diners Club**: Complete rewrite. Replace the inline `<text>` and circles with proper SVG paths using `fill="white"`. Use a 1:1 viewBox like other icons. The light variant has a different design (colored circles + white text) — adapt that approach for dark.
- **Discover**: Simplify paths where possible, keep `fill="white"` and the orange gradient. No color changes needed — the paths are just too detailed.

### Risks
- **No risk to other variants** — Light variant is completely unaffected
- **SVG rewrite for diners** needs careful handling to preserve brand recognition at small sizes
- **Backdrop-blur-sm removal** is safe (it was a no-op) but ensure no one relies on it for glassmorphism effects elsewhere — it's only in PaymentBanner

### Ready for Proposal
**Yes** — The investigation is conclusive. The issues are well-understood:
1. Badge opacity at 8% gives ~1.27:1 contrast — invisible. Fix: `bg-white/[0.15]`.
2. Amex uses blue fills on dark bg. Fix: change to white fills.
3. Diners uses `#222` fill + text elements + wrong viewBox. Fix: full rewrite with white paths.
4. Discover paths too detailed. Fix: simplify.

The orchestrator should tell the user the problems are confirmed and specific, recommended fixes are ready for proposal phase, and the effort is Low across the board.
