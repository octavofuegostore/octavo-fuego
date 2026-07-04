## Exploration: Small Payment Logos in Flex-Wrap Layout

### Current State
PaymentBanner.astro renders payment method logos in a `flex flex-wrap items-center justify-start gap-x-4 gap-y-3` layout. Each `<img>` tag has `class="max-h-10 max-w-20 w-auto object-contain hover:scale-105 transition-transform duration-200"`. This constrains each logo to max 40px height and 80px width while preserving aspect ratio. Square logos (Amex, Diners, MercadoPago, PSE) render at 40×40 (height-constrained). Wide logos (Visa, Discover, Mastercard, Bold) are width-constrained at 80px wide, rendering much shorter than 40px.

The core problem: credit card network SVGs have very wide viewBoxes (2.78:1 to 3.13:1 aspect ratio), so at the 80px max-width cap, they render only 26–37px tall. Square logos in the same row render at full 40px, creating visible height disparity.

### Affected Areas
- `src-astro/src/components/PaymentBanner.astro` — logo sizing constraints (line 74)
- `src-astro/public/images/payment/light/visa.svg` — viewBox "0 8 25 9" (2.78:1)
- `src-astro/public/images/payment/light/mastercard.svg` — viewBox "0 5 26 12" (2.17:1)
- `src-astro/public/images/payment/light/amex.svg` — viewBox "0 0 25 25" (1:1)
- `src-astro/public/images/payment/light/diners.svg` — viewBox "0 0 200 200" (1:1)
- `src-astro/public/images/payment/light/discover.svg` — viewBox "0 10 25 8" (3.13:1)

### Rendered Size Analysis

| Logo | viewBox | Ratio | At max-w-20 (80w) | At max-h-10 (40h) | Limiter | Renders As | Logo Content Height |
|------|---------|-------|-------------------|-------------------|---------|------------|-------------------|
| **Visa** | 0 8 25 9 | 25:9=2.78 | 80×29 | 111×40 | **max-width** | **80×29** | ~29px |
| **Mastercard** | 0 5 26 12 | 26:12=2.17 | 80×37 | 87×40 | **max-width** | **80×37** | ~37px |
| **Amex** | 0 0 25 25 | 25:25=1.00 | 80×80 | 40×40 | **max-height** | **40×40** | ~40px |
| **Diners** | 0 0 200 200 | 200:200=1.00 | 80×80 | 40×40 | **max-height** | **40×40** | ~40px |
| **Discover** | 0 10 25 8 | 25:8=3.13 | 80×26 | 125×40 | **max-width** | **80×26** | ~26px |
| Bold (ref) | 0 0 141 50 | 141:50=2.82 | 80×28 | 113×40 | max-width | 80×28 | ~28px |
| MercadoPago (ref) | 0 0 24 24 | 1:1 | 80×80 | 40×40 | max-height | 40×40 | ~40px |
| PSE (ref) | 5 4.5 16 16 | 1:1 | 80×80 | 40×40 | max-height | 40×40 | ~40px |

**Key Insight:** Wide logos (Visa, Mastercard, Discover, Bold) all hit the max-w-20=80px limit before max-h-10=40px. Their rendered heights range from 26px (Discover) to 37px (Mastercard). Square logos render at the full 40px. In an `items-center` row, the short logos float in the middle with ~7px empty space above and below, making them look even smaller.

Bold and MercadoPago look "hermoso" because: (a) MercadoPago is square and renders at 40×40 full height, (b) Bold has thick heavy lettering with strong gradient — high visual weight even at 28px. Visa (thin blue text) and Discover (thin orange outlines) have light visual weight at 29px and 26px respectively.

### Approaches

1. **Option B: Widen max-w to max-w-24 (96px)** — Single CSS change: `max-w-20` → `max-w-24`
   - Visa: 80×29 → **96×35** (+21% height)
   - Mastercard: 80×37 → **87×40** (hits height constraint, full 40px!)
   - Discover: 80×26 → **96×31** (+19% height, still width-constrained)
   - Amex/Diners: unchanged at 40×40
   - Bold: 80×28 → 96×34
   - Pros: One class change, helps 3/5 logos significantly, no file edits
   - Cons: Visa at 35px and Discover at 31px still shorter than square logos
   - Effort: **Low**

2. **Option E: Increase BOTH max-h-12 (48px) AND max-w-24 (96px)**
   - Visa: 80×29 → **96×35** (width-constrained, but taller absolute)
   - Mastercard: 80×37 → **96×44** (width-constrained, 44px!)
   - Discover: 80×26 → **96×31** (still width-constrained)
   - Amex: 40×40 → **48×48**
   - Diners: 40×40 → **48×48**
   - Bold: 80×28 → 96×34
   - Pros: Everything bigger, Amex/Diners grow 20% in both dimensions
   - Cons: Square logos now 48px (potentially too dominant vs width-constrained ones), Discover still at 31px
   - Effort: **Low** (two class changes)

3. **Option C: Loosen viewBoxes for Visa + Discover SVGs (make them squarer)**
   - Visa viewBox from "0 8 25 9" → "0 0 25 17" (adds vertical padding, ratio goes 2.78→1.47)
     - At max-w-20=80: height=80×17/25=54px > 40 → height-constrained → **59×40**
     - Logo goes from 29px → **40px tall!**
   - Discover viewBox from "0 10 25 8" → "0 0 25 17" (same treatment)
     - At max-w-20=80: height=80×17/25=54px > 40 → height-constrained → **59×40**
     - Logo goes from 26px → **40px tall!**
   - Pros: Visa and Discover become full-height at 40px without layout changes
   - Cons: Requires modifying SVG files (2 files), adds whitespace above/below logos, more vertical space per row
   - Effort: **Medium** (two SVG edits)

4. **Option A: Remove max-w constraint entirely** — `max-h-10` only
   - Visa: 111×40, Mastercard: 87×40, Discover: 125×40, Bold: 113×40
   - Pros: All logos render at full 40px height
   - Cons: Very wide logos dominate (Discover at 125px), Bold was previously described as "enorme", uneven visual weight
   - Effort: **Low**

5. **Option D: Increase only max-h to max-h-12 (48px)** — keep max-w-20
   - Visa: still 80×29 (no change! still width-constrained)
   - Discover: still 80×26 (no change!)
   - Only square logos grow (Amex/Diners → 48×48)
   - Pros: None for the wide logos
   - Cons: Doesn't solve the problem for the 3 worst offenders
   - Effort: **Low**

### Recommendation

**Primary: Option B** (`max-w-20` → `max-w-24`) — the best ROI change:
- Single CSS change, zero SVG edits
- Mastercard becomes height-constrained (full 40px)
- Visa gains 21% more height (29→35px)
- Discover gains 19% (26→31px)
- All other logos benefit proportionally

**If the user wants more:** combine **Option B + C** — widen the constraint AND edit Visa/Discover viewBoxes. This gets Visa and Discover to full 40px height while keeping everything within 96px max width.

**Exact code change (Option B):**
```
Line 74: class="max-h-10 max-w-20 w-auto object-contain hover:scale-105 transition-transform duration-200"
→         class="max-h-10 max-w-24 w-auto object-contain hover:scale-105 transition-transform duration-200"
```

### Risks
- **Wider logos on mobile**: At 96px with `gap-x-4`, mobile (320px) fits ~3 logos/row → 3 rows for the 11 es-locale logos. Acceptable vertical height.
- **Bold gets wider too**: Goes from 80×28 to 96×34 — more breathing room, but still within flex-wrap. Previously was "enorme" at 113px (no max-w), so 96px is a middle ground.
- **Option B alone doesn't fix Discover**: At 31px, Discover is still the shortest logo. If this is critical, pair with Option C for the Discover SVG.

### Ready for Proposal
**Yes** — Recommend Option B as the primary fix. If the user wants Discover to be taller too, recommend combining Option B + C (CSS change + edit Discover and Visa SVGs).
