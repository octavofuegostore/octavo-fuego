# Exploration: Payment Logos Don't Look Equal

## Current State

PaymentBanner.astro renders 12 payment method logos in a `flex flex-wrap items-center` container. Each `<img>` has `class="max-h-12 max-w-24 w-auto object-contain"`, which constrains logos to a 48×96px bounding box. The `object-contain` preserves each SVG's intrinsic aspect ratio, so the actual rendered dimensions vary wildly depending on each SVG's `viewBox`.

## Affected Areas

- `src-astro/src/components/PaymentBanner.astro` — The flex-wrap container + img constraints
- `src-astro/public/images/payment/light/*.svg` — 12 SVGs for ES locale (and their dark counterparts)
- `src-astro/public/images/payment/dark/*.svg` — All have identical viewBoxes, same issue

## Rendered Size Analysis

At `max-h-12 (48px) max-w-24 (96px)` with `object-contain`, each logo's rendered size depends entirely on its viewBox aspect ratio (width/height). When ratio ≤ 2.0, height is the limiter (48px tall). When ratio > 2.0, width is the limiter (96px wide).

| # | Logo | viewBox | Ratio | Limiter | Rendered | Visual Area | Notes |
|---|------|---------|-------|---------|-----------|-------------|-------|
| 1 | **PSE** | `5 4.5 16 16` | 1.00:1 | max-h-12 | **48×48** | 2,304 px² | Circle + text, fills square |
| 2 | **Nequi** | `4 6 19 14` | 1.36:1 | max-h-12 | **65×48** | 3,120 px² | Thin text, mostly empty |
| 3 | **Daviplata** | `0 0 25 25` | 1.00:1 | max-h-12 | **48×48** | 2,304 px² | Red square logo |
| 4 | **Bancolombia** | `0 0 27 26` | 1.04:1 | max-h-12 | **50×48** | 2,400 px² | Abstract shape |
| 5 | **Codensa** | `0 0 100 100` | 1.00:1 | max-h-12 | **48×48** | 2,304 px² | Filled circle ← **heaviest visual** |
| 6 | **Visa** | `0 8 25 9` | 2.78:1 | max-w-24 | **96×35** | 3,360 px² | Thin text, wide strip |
| 7 | **Mastercard** | `0 5 26 12` | 2.17:1 | max-w-24 | **96×44** | 4,224 px² | Interlocked circles |
| 8 | **Amex** | `0 0 25 25` | 1.00:1 | max-h-12 | **48×48** | 2,304 px² | Text + box |
| 9 | **Diners** | `0 0 200 200` | 1.00:1 | max-h-12 | **48×48** | 2,304 px² | Filled circle ← **heaviest visual** |
| 10 | **Discover** | `0 10 25 8` | 3.13:1 | max-w-24 | **96×31** | 2,976 px² | Thinnest, lightest visual |
| 11 | **Bold** | `0 0 141 50` | 2.82:1 | max-w-24 | **96×34** | 3,264 px² | Gradient text |
| 12 | **MercadoPago** | `0 0 24 24` | 1.00:1 | max-h-12 | **48×48** | 2,304 px² | Logo in square |

## Root Cause

**Two fundamentally different visual groups emerge from the same CSS:**

**Group A — Height-constrained (8 logos):** PSE, Nequi, Daviplata, Bancolombia, Codensa, Amex, Diners, MercadoPago
- All render at **48px tall × 48-65px wide**
- Limited by `max-h-12` first
- Appear as **compact blocks** — especially Codensa and Diners which are filled circles

**Group B — Width-constrained (4 logos):** Visa, Mastercard, Discover, Bold
- All render at **96px wide × 31-44px tall**
- Limited by `max-w-24` first
- Appear as **horizontal strips** — especially Visa (35px) and Discover (31px)

**Why they don't look equal:**

1. **Different limiting dimension:** Half the logos are constrained by height, the other half by width. Same CSS produces opposite behaviors.
2. **Different heights:** Codensa/Diners at 48px tall sit next to Discover at 31px tall. The 17px difference is 35% — huge at this scale.
3. **Different visual weight:** Filled circles (Codensa, Diners) at 48×48 = 2,304 px² of SOLID COLOR vs thin text (Visa, Discover) at 96×31-35 = 3,000-3,360 px² but mostly EMPTY SPACE. Square logos visually dominate even when their area is technically smaller.
4. **`items-center` alignment:** Logos of different heights center vertically, so short logos have floating empty space above and below, while tall logos fill the row. Creates uneven rhythm.
5. **Wrapping inconsistency:** In a flex-wrap row, 48×48 squares and 96×31 strips have different "settling" behavior when wrapping — the 96px wide logos consume more horizontal space and can cause uneven row lengths.

## Approaches

### 1. **SVG viewBox normalization** (recommended)
Add vertical padding to the 4 wide SVG viewBoxes so all logos hit `max-h-12` first. This makes every logo render at 48px tall with proportional width (48-96px).

- **Pros**: Addresses root cause; works for both light/dark; no CSS changes needed; all logos become height-constrained
- **Cons**: Requires modifying 4 SVG files (both light and dark = 8 files); SVG may need re-download if brand updates
- **Effort**: Medium (8 SVG edits, one CSS tweak)

### 2. **Uniform grid with equal-height cells**
Wrap each logo in a fixed-size `<div>` with centered `object-contain`.

- **Pros**: Pure CSS; no SVG modification; all logos appear in equal-size frames
- **Cons**: Adds DOM nesting; doesn't actually make the LOGOS equal — just the containers; needs a container background to look coherent
- **Effort**: Low

### 3. **Single max constraint only — `max-h-10` with `max-w-full`**
Go back to height-only constraint. All logos render at 40px tall; widths vary.

- **Pros**: Simpler CSS
- **Cons**: Bold at 40×113px is nearly 3× the width of Diners at 40×40px; user already rejected this
- **Effort**: Low

### 4. **Fixed height + same max-width — `h-12 max-w-24` with no w-auto**
Force all img elements to 48px height even if shorter. `object-contain` still shrinks content.

- **Pros**: All image elements are exactly 48px tall
- **Cons**: Content within still renders at different sizes; empty space around short logos
- **Effort**: Low

### 5. **Remove `items-center` + add `items-end`**
Align logos to bottom of row (baseline alignment).

- **Pros**: Improves visual rhythm; text-based logos "sit" on a baseline
- **Cons**: Doesn't fix size inequality; just alignment
- **Effort**: Very low

### 6. **Marquee/scroll container**
Continuous horizontal scroll of logos.

- **Pros**: Premium feel; hides size differences in motion
- **Cons**: Adds JS/CSS complexity; worse accessibility; user may not want animated logos
- **Effort**: Medium

## Recommendation

**Apply Option 1 (SVG viewBox normalization) + Option 5 (`items-end` alignment) as a combined fix.**

The root cause is geometric: SVGs have aspect ratios from 1:1 to 3.13:1. No CSS-only solution can make a square and a 3:1 rectangle "look equal" — the math doesn't work. The fix must be applied at the SVG level.

**Specific viewBox changes:**

| Logo | Current viewBox | New viewBox | New ratio | New rendered size |
|------|----------------|-------------|-----------|-------------------|
| Visa | `0 8 25 9` | `0 6 25 13` | 1.92:1 | **92×48** (height-limited ✓) |
| Mastercard | `0 5 26 12` | `0 4 26 14` | 1.86:1 | **89×48** (height-limited ✓) |
| Discover | `0 10 25 8` | `0 7 25 14` | 1.79:1 | **86×48** (height-limited ✓) |
| Bold | `0 0 141 50` | `0 0 141 72` | 1.96:1 | **94×48** (height-limited ✓) |

**The math:** At `max-h-12` (48px), a logo is height-constrained when `aspect_ratio ≤ 2.0` (96/48). The new viewBox heights ensure ratio ≤ 2.0, making ALL 12 logos height-constrained at 48px with widths between 48-96px.

**Additional CSS:**
```diff
- class="flex flex-wrap items-center justify-start gap-x-4 gap-y-3"
+ class="flex flex-wrap items-end justify-start gap-x-4 gap-y-3"
```

This makes all logos align to bottom, like sitting on a typographic baseline. Combined with the viewBox fix, the varying widths (48-94px) will look natural — like words of different length in a sentence.

## Risks

- **SVG content shift**: Changing viewBox shifts the coordinate space. Must verify that paths don't clip. For Bold (viewBox `0 0 141 50` → `0 0 141 72`), the content will render in the top 70% of the box — it's a text logo so this is fine. For Visa/Discover/Mastercard (adding vertical padding), the content stays centered and won't clip.
- **Double work**: Both `light/` and `dark/` directories must be updated (8 files total).
- **Future re-downloads**: If SVGs are re-downloaded from brand sources, viewBox changes will be lost. Document this in a comment.
- **Stripe/boleto/pix locales**: For PT and EN locales, the logos included differ (Stripe, Pix, Boleto). Check those viewBoxes too. Stripe has a very wide viewBox (`54 36 360 150`, ratio 2.4:1) — may need similar treatment.
- **Build must pass**: After SVG edits, verify `npm run build` succeeds.

## Ready for Proposal

**Yes** — proceed to `sdd/logos-not-equal/propose`.
Tell the user: The root cause is geometric — 8 logos are height-constrained at 48×48-65px and 4 are width-constrained at 96×31-44px because their SVG viewBox aspect ratios range from 1:1 to 3.13:1. A CSS-only fix cannot solve this. The recommended solution is viewBox normalization on the 4 wide SVGs (Visa, Mastercard, Discover, Bold) plus switching `items-center` to `items-end` for baseline alignment.
