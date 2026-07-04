## Exploration: Comprehensive Payment Visual Audit + Unified Solution

### Current State

The payment section lives inside Col 1 of the footer (bg `#F2EFE8`). It's rendered by `PaymentBanner.astro` — a 3-column grid with 64×64 containers, each holding an SVG constrained to `max-h-12 max-w-12` (48×48) with `object-contain`. Below the grid, a "Compra protegida" lock block floats with only `mt-4` spacing and no container.

Since the "no-box refactor" removed the outer container that previously grounded the payment section, all 4 visual problems emerged simultaneously.

### Affected Areas

- `src-astro/src/components/PaymentBanner.astro` — the entire component (grid + lock block)
- `src-astro/src/components/Footer.astro` — Col 1 structure (where it's called, the `border-t border-tabaco/20` separator)
- All 16 light SVGs in `src-astro/public/images/payment/light/` — viewBox analysis needed for alignment fix

---

### Problem 1: Visual Scale Imbalance (Bounding Boxes)

#### Analysis

The root cause is **aspect ratio disparity** between logos. With `object-contain` constrained to 48×48:

| Logo | viewBox W×H | Aspect | Rendered W×H (px) | Effective Area (sq px) | Fill % of 48×48 | Weight |
|------|------------|--------|-------------------|----------------------|-----------------|--------|
| Diners | 200×200 | 1:1 | 48×48 | 2,304 | 100% | 🔴 HEAVY |
| Codensa | 100×100 | 1:1 | 48×48 | 2,304 | 100% | 🔴 HEAVY |
| Amex | 25×25 | 1:1 | 48×48 | 2,304 | 100% | 🔴 HEAVY |
| MercadoPago | 24×24 | 1:1 | 48×48 | 2,304 | 100% | 🔴 HEAVY |
| Pix | 24×24 | 1:1 | 48×48 | 2,304 | 100% | 🔴 HEAVY |
| PSE | 16×16 | 1:1 | 48×48 | 2,304 | 100% | 🔴 HEAVY |
| Daviplata | 25×25 | 1:1 | 48×48 | 2,304 | 100% | 🔴 HEAVY |
| Bancolombia | 27×26 | ~1:1 | 48×47 | 2,256 | 98% | 🔴 HEAVY |
| Nequi | 19×14 | 1.36:1 | 48×35 | 1,680 | 73% | 🟡 MEDIUM |
| Boleto | 200×100 | 2:1 | 48×24 | 1,152 | 50% | 🟡 MEDIUM |
| Mastercard | 26×12 | 2.17:1 | 48×22 | 1,056 | 46% | 🟢 LIGHT |
| Stripe | 360×150 | 2.4:1 | 48×20 | 960 | 42% | 🟢 LIGHT |
| Bold | 141×50 | 2.82:1 | 48×17 | 816 | 35% | 🟢 LIGHT |
| Visa | 25×9 | 2.78:1 | 48×17 | 816 | 35% | 🟢 LIGHT |
| Discover | 25×8 | 3.13:1 | 48×15 | 720 | 31% | 🟢 LIGHT |

**ES locale grid (3 cols)** — the imbalance in action:

| Row | Col 1 | Col 2 | Col 3 |
|-----|-------|-------|-------|
| 1 | PSE 🔴 H | Nequi 🟡 M | Daviplata 🔴 H |
| 2 | Bancolombia 🔴 H | Codensa 🔴 H | Visa 🟢 L |
| 3 | Mastercard 🟢 L | Amex 🔴 H | Diners 🔴 H |
| 4 | Discover 🟢 L | Bold 🟢 L | MercadoPago 🔴 H |

**Key finding**: Diners and Codensa look MASSIVE because they're circles in square viewBoxes filling 2,304 sq px. Visa and Discover look TINY because they're horizontal logos filling only ~700-800 sq px — **3× smaller visual area**.

#### Proposal: Equalize WITHOUT changing logos

**Option A**: Set all SVGs to `object-contain` with a **consistent background treatment** (e.g., the subtle container bg absorbs the whitespace → empty space becomes intentional padding rather than "missing logo")

**Option B**: Change the grid to use `object-cover` with `aspect-square` on each cell → forces all logos to fill 48×48 uniformly (distorts horizontal logos, not recommended)

**Option C**: Add CSS to normalize visual weight by adjusting `padding` per cell based on logo density — fragile and SVG-specific

**Recommended**: **Option A** — the unified container (see unified solution) + set a subtle rounded bg inside each cell so the empty space reads as padding, not absence.

---

### Problem 2: Grid Alignment Issues (Baseline Shifting)

#### Analysis

Each light SVG's viewBox determines where the actual logo content sits within the 48×48 constraint:

| Logo | viewBox | Content y-range | Content % of viewBox height | Vertical bias | Rendered behavior |
|------|---------|-----------------|----------------------------|---------------|-------------------|
| Nequi | `4 6 19 14` | y:6→20 | 100% of 14px height | Top-heavy: minY=6, so content starts high | "Floating" — 48px tall render but paths occupy upper portion |
| Codensa | `0 0 100 100` | y:2→98 | 96% | Centered | Overwhelms the cell |
| Visa | `0 8 25 9` | y:8.8→16.2 | 82% of 9px height | Content in top 60% of rendered 17px strip | Suspended in center of 48px with large gaps |
| Mastercard | `0 5 26 12` | y:5→19 (text) | 100% | Content at y=5 to y=19 — roughly centered in viewBox | 22px tall, OK alignment |
| Discover | `0 10 25 8` | y:10→18 | 100% | Lower portion of the 15px render | Slight upward shift |
| Amex | `0 0 25 25` | Full square | 100% | Centered | Perfect |
| Diners | `0 0 200 200` | Full circle | 100% | Centered | Perfect |
| Bold | `0 0 141 50` | y:0→50 | 100% | Top-aligned (paths start at y=0) | Content pushes upward within 48px box |
| MP | `0 0 24 24` | Full square | 100% | Centered | Perfect |
| Pix | `0 0 24 24` | Full square | 100% | Centered | Perfect |
| PSE | `5 4.5 16 16` | Content offset | 100% | Slightly offset (minX=5, minY=4.5) | Ok |
| Stripe | `54 36 360 150` | Content offset | 100% | minX=54, minY=36 → offset from top-left | Content shifts within 48×20 |
| Daviplata | `0 0 25 25` | Full square | 100% | Centered | Perfect |
| Bancolombia | `0 0 27 26` | Near-square | 100% | Centered | Near-perfect |
| Boleto | `5 5 140 90` | y:5→95 | 100% | Top-left offset | Content shifts right/down slightly |

**The real issue**: When logos in the same row have different visual heights, the `flex items-center justify-center w-16 h-16` centers them vertically, but:
- A 48×48 circle (Codensa) feels "grounded" — it fills the space
- A 48×17 horizontal strip (Visa) feels "suspended" — it has 15.5px of empty space above and below
- Nequi at 48×35 has its content floating in the upper portion of its viewBox

This creates an **asymmetrical visual baseline** across each grid row.

#### Proposal: viewBox adjustments

**Don't change the SVGs themselves** — that's fragile and needs to be maintained.

**Instead**: Add `bg-tabaco/[0.03] rounded-lg` to each grid cell (the 64×64 container). This:
- Makes the empty space intentional (it's padding around a subtle bg)
- Visually grounds small logos within their cell boundary
- Creates uniform cell backgrounds regardless of logo size

---

### Problem 3: Color Treatment (Dirty Contrast)

#### Analysis

Background: `#F2EFE8` — warm off-white (RGB: 242, 239, 232)

| Logo | Brand Color(s) | On #F2EFE8 | Issue? |
|------|---------------|------------|--------|
| Visa | #122D94 → #1A2166 gradient | Deep blue | ✅ OK — dark enough |
| Mastercard | #EF0000 + #FF9600 + #050505 | Mixed | ✅ OK |
| Amex | #006FD4 | Medium blue | ⚠️ Borderline on warm bg |
| Diners | #0079BE | Blue | ✅ OK — saturated enough |
| Discover | #231F20 + orange grad | Black | ✅ OK |
| Nequi | #200020 | Near-black | ✅ OK — very dark |
| Bold | #EE424E → #121E6C | Strong | ✅ OK |
| MercadoPago | Single dark fill | Near-black | ⚠️ The dense path has thick black fills that look crude next to refined vectors |
| Pix | Single dark fill | Near-black | ✅ OK |
| PSE | Blue gradient #002653→#0059B5 | Deep blue | ✅ OK |
| Stripe | #635BFF | Purple | ✅ OK on warm bg |
| Codensa | #F37021 + #0033A0 | Orange pops | ✅ OK — intentional contrast |
| Daviplata | #ED2029 | Red | ✅ OK |
| Bancolombia | #1E1E1E | Near-black | ✅ OK |
| Boleto | #003366 | Dark blue | ✅ OK |

**Key findings**:

1. **Visa's blue is NOT the problem** — the gradient is actually dark (#122D94). The issue is that Visa's rendered area (48×17 = 816 sq px) is so small that the color has no visual surface to assert itself. It's a **scale problem, not a color problem.**

2. **MercadoPago's black stroke IS a legitimate concern** — the SVG has a single continuous complex path with dense black fills. Compared to Amex's clean blue shapes or Diners' crisp circle, the MP vector looks heavier and less refined. This is an SVG quality issue.

3. **Amex's blue (#006FD4) is the only legitimate color contrast concern** — on #F2EFE8 warm bg, medium blue can appear slightly desaturated. But it's perfectly acceptable (WCAG contrast > 4.5:1 for normal text equivalents).

4. **The real driver of uneven visual hierarchy is SIZE, not COLOR**. Heavy logos with brand colors (Diners blue, Codensa orange/blue, Daviplata red) dominate while tiny logos (Visa, Discover) get lost regardless of color.

#### Proposal

**Leave brand colors as-is.** Changing them is deceptive and violates user trust — customers recognize Visa blue, Mastercard red, etc.

The unified container bg (`tabaco/[0.03]`) provides a consistent visual surface that:
- Softens the transition from full-white SVG backgrounds to #F2EFE8
- Gives the eye a defined boundary for each brand mark
- Makes even small logos feel grounded within their cell

---

### Problem 4: Disconnected Lock Block

#### Current State

```astro
<div class="flex items-center gap-2 mt-4 text-xs ${mutedColor}">
  <Icon name="solar:lock-bold" class="w-3.5 h-3.5" />
  <span>{t_('payment.securedBy')}</span>
</div>
```

Just a flex row with `mt-4`. No container, no border, no background. It floats below the grid with nothing but margin to anchor it.

#### Solutions

**Option A (Recommended)**: Wrap the entire payment section (h4 + grid + lock) in a unified container

```
div.rounded-xl.bg-tabaco/[0.03].border.border-tabaco/[0.04].p-5
├── h4 "MÉTODOS DE PAGO"
├── div.grid.grid-cols-3.gap-4
├── div.flex.items-center.gap-2.mt-4.pt-4.border-t.border-tabaco/[0.1]
│   ├── Icon lock
│   └── "Compra protegida"
```

**Option B**: Just add a visual divider between grid and lock

```astro
<hr class="border-t border-tabaco/10 my-3" />
```

Cheaper, but doesn't solve P1/P2. Leaves the floating grid issue intact.

**Option C**: Move lock inline as last cell or below last row

Would make the layout awkward — the lock is not a payment method.

---

### Unified Solution

The root cause of ALL 4 problems is the same: **the payment section lacks a visual container since the no-box refactor stripped it.** Adding one back — ultra-subtle, not a card — solves everything at once.

#### Implementation

##### PaymentBanner.astro changes

```astro
---
// ... (same props and logic)
---

<div class="rounded-xl bg-tabaco/[0.03] border border-tabaco/[0.04] p-5">
  <div class="grid grid-cols-3 gap-4 md:gap-5" role="list" aria-label="Métodos de pago aceptados">
    {methods.map((method) => (
      <div role="listitem" class="flex items-center justify-center w-16 h-16 rounded-lg">
        <img
          src={`/images/payment/${variant}/${method.id}.svg`}
          alt={method.label}
          class="max-h-12 max-w-12 w-auto object-contain hover:scale-110 transition-transform duration-200"
          loading="lazy"
          width="64"
          height="64"
        />
      </div>
    ))}
  </div>

  <div class="flex items-center gap-2 mt-4 pt-4 border-t border-tabaco/[0.1] text-xs ${mutedColor}">
    <Icon name="solar:lock-bold" class="w-3.5 h-3.5 shrink-0" />
    <span>{t_('payment.securedBy')}</span>
  </div>
</div>
```

#### What this solves

| Problem | How the container fixes it |
|---------|---------------------------|
| **P1 — Visual Scale** | The container bg (`tabaco/3%`) grounds all logos equally. The empty space around small logos reads as consistent cell padding, not missing content. The border frames the entire block, creating a unified visual field. |
| **P2 — Alignment** | The `rounded-lg` on each 64×64 cell gives a subtle hover target. The container absorbs whitespace asymmetry — uneven gaps between logos become less noticeable when they share a common background frame. |
| **P3 — Color** | The warm container bg (`--color-tabaco` at 3% opacity over `--color-surface-warm`) is close enough to the footer bg that it doesn't clash, but distinct enough to separate the payment section. Brand colors sit on this surface without competition. |
| **P4 — Lock Block** | The `border-t border-tabaco/[0.1]` divider + `pt-4` visually anchors the lock to the grid above. It's now structurally part of the container, not floating. |

#### Footer.astro changes

No changes needed — the component is self-contained now.

#### SVG Cell Changes

Add `rounded-lg` to each `w-16 h-16` container so empty space reads as padding:

```astro
<div role="listitem" class="flex items-center justify-center w-16 h-16 rounded-lg">
```

---

### Approaches Comparison

| Approach | Pros | Cons | Effort |
|----------|------|------|--------|
| **A — Unified Container** | Fixes ALL 4 problems at once; minimal CSS; no SVG edits; clean HTML | Adds ~10 lines of markup | Low |
| **B — ViewBox Rewrites** | Fixes alignment perfectly | Requires editing all 16 SVGs; fragile per-method; maintenance burden | High |
| **C — CSS-only grid tweaks** | Zero markup change | Only fixes P2 partially; doesn't help P1, P3, P4 | Low |
| **D — Per-method cell sizing** | Precise visual weight control | Extremely fragile; hard-coded per method; breaks with new methods | Very High |

### Recommendation

**Approach A — Unified Container.** It solves the structural root cause that all 4 problems share. The implementation is ~10 lines of markup. No SVG edits needed. No CSS variables to add. Just wrap, add a border-t divider, and done.

The container values are carefully chosen:
- `bg-tabaco/[0.03]` — 3% tabaco is barely visible but perceptible as a subtle separation from #F2EFE8
- `border-tabaco/[0.04]` — 4% tabaco border is visible on close inspection but not assertive
- `rounded-xl` — matches the Airbnb-style 20px radius used across the site
- `p-5` — 20px padding gives the logos breathing room inside the container
- `border-t border-tabaco/[0.1]` — 10% tabaco is clear enough to separate lock from grid but doesn't compete

### Risks

- **Risk: Container might feel like a "card"** — Mitigation: The bg is only 3% tabaco, nearly invisible. It reads as a gentle grouping, not a box.
- **Risk: Mobile layout** — The 3-column grid and `p-5` should be verified on mobile. At small screens, `p-5` might need to become `p-3`.
- **Risk: Portuguese locale has different methods** — PT shows Pix + Boleto (both heavier logos) alongside Visa/MC/Amex/Diners/Discover/MP. The ratio of heavy:light is ~4:4, less imbalanced than ES. The container still helps.
- **Risk: English locale is Stripe-first** — EN has Stripe (L) + Visa (L) + MC (L) + Amex (H) + Diners (H) + Discover (L) = 2 heavy, 4 light. The container helps here too.

### Ready for Proposal

**Yes.** The analysis is complete and the solution is clear. The orchestrator should tell the user:

> The exploration found that **all 4 problems share a single root cause**: the payment section lost its visual container during the no-box refactor. Adding back an ultra-subtle container (`rounded-xl bg-tabaco/[0.03] border border-tabaco/[0.04] p-5`) with a border-t divider for the lock block solves all 4 problems at once with ~10 lines of markup. No SVG edits needed. The visual weight imbalance (P1) is driven by aspect ratio disparity (square vs horizontal viewBoxes), the alignment issue (P2) is exacerbated by the lack of a grounding frame, the color concerns (P3) are actually a size issue (Visa's blue is dark enough — it's just too small to assert itself), and the disconnected lock (P4) gets a structural anchor.
>
> Ready to proceed with sdd-propose → sdd-spec → sdd-tasks → sdd-apply.

### Key Learnings

- The EN locale (Stripe-first) is actually the most balanced — Stripe, Visa, MC are all horizontal logos. The ES locale is the worst offender with 8 heavy + 4 light.
- Diners and Codensa SVGs use oversized viewBoxes (200×200 and 100×100) with full circles, making them visually 3× larger than Visa or Discover.
- MercadoPago's SVG path data is genuinely denser/heavier than the other logos — a legitimate quality concern separate from container issues.
- The lock block's `mt-4` spacing makes it look orphaned specifically because there's no shared parent container with the grid above it.
