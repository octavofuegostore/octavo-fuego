## Exploration: tienda-product-page-polish

### Current State

The product detail page at `src-astro/src/pages/[locale]/tienda/rape/[product].astro` uses a 2-column grid (image left, content right) with all content stacked vertically: variety tag → h1 → description → highlight quote → PricingTable → intensity badges → intent map → Testimonials → FAQ → RelatedProducts.

Reference project (Williamsburg/Lexington Store theme) uses a similar 2-column grid but with tabs below the fold (Details, Shipping, Returns, Reviews) and significantly smaller typography.

### Affected Areas

- `src-astro/src/pages/[locale]/tienda/rape/[product].astro` — Main product page: headings, layout, highlight quote, spacing, tabs
- `src-astro/src/components/product/PricingTable.astro` — Button styling, border-radius, selected state
- `src-astro/src/components/tienda/Testimonials.astro` — Card styling
- `src-astro/src/components/whatsapp/WhatsAppButton.astro` — Button styling consistency
- `src-astro/src/styles/global.css` — May need to adjust design tokens

### Issue Analysis

---

#### Issue 1: Font size too large

**Current (Octavo Fuego):**
```astro
<h1 class="font-display font-black text-4xl md:text-5xl lg:text-6xl tracking-tight ...">
```
= 2.25rem (36px) / 3rem (48px) / 3.75rem (60px)

**Reference (Williamsburg `displayMD`):**
```html
<h1 class="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-serif italic text-base-900">
```
= 1.5rem (24px) / 1.5rem (24px) / 1.875rem (30px) / 2.25rem (36px)

**Delta:** Our desktop heading (60px) is **67% larger** than Williamsburg's (36px). The font-black weight + 6xl size at desktop is disproportionate for a product page heading.

**Recommendation:** Reduce to `text-3xl md:text-4xl lg:text-5xl` (30px → 36px → 48px) or even `text-2xl md:text-3xl lg:text-4xl` (24px → 30px → 36px) matching closer to displayMD. The `font-black` weight is fine (it's the signature), but the size needs recalibration. The reader can scroll to the hero on other pages for the big headline moment — product names should feel refined, not shouted.

---

#### Issue 2: Tabs format

**Current:** Everything inline — description, highlight, pricing, intensity, intent map all stacked with `gap-6`

**Reference (Williamsburg):** Tab navigation below the purchase button with 4 tabs: Details, Shipping, Returns, Reviews. Each tab section toggles visibility via a simple JS script (TabsScript.astro) adding/removing `hidden` class.

**The Williamsburg tab system (simplified):**
```html
<ul class="flex text-sm border-b gap-4 text-base-500 border-base-200">
  <li class="-mb-px">
    <button class="py-2 font-medium border-b-2 text-base-900 border-base-500" data-tab="tab1">Details</button>
  </li>
  <li class="-mb-px">
    <button class="py-2 font-medium" data-tab="shipping">Shipping</button>
  </li>
  ...
</ul>
<div class="py-4 text-left">
  <div id="tab1" class="tab-content">...</div>
  <div id="shipping" class="hidden tab-content">...</div>
</div>
```

The TabsScript listens for clicks on `#tab-section button[data-tab]`, toggles active classes, and shows/hides the matching `#${targetTab}` content.

**Approach for our page:** Move the description, highlight quote, and any content below PricingTable into organized tabs. Keep PricingTable + WhatsApp always visible (they're the purchase flow, non-negotiable). Structure could be:

- **Tab 1: Details** — Product description + highlight quote (subtle) + ingredients/origin info
- **Tab 2: Intensity** — The intensity badges (move from always-visible into Details tab or keep as a permanent section)
- **Tab 3: Shipping** — Shipping info (static text)
- **Tab 4: Reviews** — Testimonials component

The highlight quote could move inside the Details tab as a subtle lead-in, removing it from the always-visible flow. This would clean up the initial view significantly.

---

#### Issue 3: Highlight quote

**Current:**
```html
<div class="border-l-[4px] border-[var(--color-action-primary)] bg-[var(--color-surface-warm)] p-6 md:p-8">
  <p class="font-display font-bold text-lg md:text-xl ...">
```
4px solid left border + warm beige background + bold serif = visually heavy block that competes with the product name and pricing.

**Premium alternatives:**

| Approach | Class change | Effect |
|----------|-------------|--------|
| Thin border, no bg | `border-l-[2px] border-[var(--color-action-subtle)] p-4 md:p-6` | Subtle anchor, less visual weight |
| Decorative quote mark | Replace border with a large ✦ or " symbol via pseudo-element | Elegant, editorial feel |
| Italic serif, small | `font-display italic font-normal text-base md:text-lg border-l-[2px] border-[var(--color-action-subtle)] pl-4` | Light touch, reads as epigraph |
| Inline with description | Integrate highlight text into description paragraph with a `<span class="font-display italic text-[var(--color-action-primary)]">` | Cleanest, but loses visual separation |

**Recommendation:** Remove the background, reduce border to 2px, use the subtle action color (C4956A), and switch to italic serif with normal weight. It should read as a tasteful epigraph, not a callout box.

---

#### Issue 4: Pricing section

**Current PricingTable buttons:**
```html
<button class="border-2 rounded-[var(--radius-button)] py-4 px-3 ...">
```
- `border-2` — double border feels thick
- `rounded-[var(--radius-button)]` = 8px
- Selected: `bg-[var(--color-action-primary)] text-white`
- Inactive: `border-gray-200 bg-white`

**Reference (Williamsburg Button):**
```js
const baseClass = ["flex", "transition", "text-center", "rounded-full", ...];
// Variants: default → bg-base-800 text-white, accent → bg-accent-500 text-white, muted → text-base-950 bg-base-100
```
Pill-shaped buttons (`rounded-full`), softer states.

**Recommendation:** Two options:

1. **Pill buttons** — Change pricing buttons to `rounded-full` and reduce `border-2` to `border`. Consistency with a pill shape across all CTA elements (PricingTable, WhatsApp, Purchase) creates a more deliberate design system. However, pill buttons + Playfair Display serif can clash tonally — pills feel modern/tech, serif feels traditional/sacred.

2. **Keep 8px radius, refine styling** — Remove `border-2`, use `ring-1 ring-gray-200` instead for a lighter border. Selected state could use `ring-2 ring-[var(--color-action-primary)]` with a subtle bg tint instead of full solid fill. This is more aligned with the "Minimalist Sacred" aesthetic.

I lean toward **option 2** — the 8px radius matches the existing design system (`--radius-button: 8px`) and feels more editorial. The WhatsApp button should also be consistent (currently `rounded-lg` which is also 8px, so it's fine, but could use `rounded-[var(--radius-button)]` for token consistency).

---

#### Issue 5: Testimonials

**Current:**
```html
<div class="bg-[var(--papel)] rounded-[var(--radius-card)] p-6 border border-gray-100">
```
Beige background (#F5F5F0) + gray border + 20px radius.

**Premium alternatives:**

| Approach | Class change | Effect |
|----------|-------------|--------|
| Clean white cards | `bg-white rounded-[var(--radius-card)] p-6 border border-[var(--color-border-subtle)]` | Lighter feel, subtle tabaco border |
| No border, shadow | `bg-white rounded-[var(--radius-card)] p-6 shadow-[var(--shadow-card)]` | Floating card, premium Airbnb feel |
| Minimal border only | `bg-white border border-gray-100 rounded-[var(--radius-card)] p-6` | Cleanest, nearly invisible |
| Uncarded list | Remove cards entirely, just `border-b border-gray-100 py-6` for each testimonial | Editorial list, less heavy |

**Recommendation:** Remove the `bg-[var(--papel)]` (beige) and `border-gray-100` (gray border). Use clean white cards with a subtle `shadow-[var(--shadow-card)]` for a floating premium feel. The warm background is used too broadly across the page — testimonials should feel elevated, not like another beige block.

The star rating icons and quote styling could also be refined: slightly smaller stars, lighter yellow (or tabaco-colored), and less italic on the quote text.

---

#### Issue 6: Image spacing

**Current grid:** `grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16`

The image takes up a full 50% of the grid, and with `aspect-square`, it's a large square. On a 1200px viewport, that's roughly 540px × 540px.

**Williamsburg grid:** Same `grid grid-cols-1 lg:grid-cols-2 gap-12`, but the image gallery uses `col-span-7` with thumbnails at `col-span-1` (14% / 86% split within the image column).

**Observations:**
- The image being `aspect-square` is appropriate for product photos
- The issue may be that with only 1 image (many products), the left column has a large empty area below the image, while the right column is crammed with content
- The gap (`gap-16` = 64px on desktop) is generous but makes the image feel disconnected from the content

**Recommendations:**

1. **Narrower image column:** Change to `lg:grid-cols-[1fr_1.2fr]` giving content slightly more space (45%/55% split)

2. **Reduce gap:** `gap-8 lg:gap-10` instead of `gap-8 lg:gap-16`

3. **Max-height on image:** Add `max-h-[600px]` to the image container so it doesn't tower over short content on tall viewports

4. **Stack order on mobile:** Already correct (`order-first` / `order-last`), but could reduce image height on mobile with `max-h-[400px] sm:max-h-none`

---

### Approaches

#### Approach A: "Light Refinement" — Smaller heading + spacing fixes only
Minimal changes: resize the h1, reduce gap, lighten highlight quote border, clean up testimonial cards.

- **Effort:** Low
- **Impact:** Addresses issues 1, 3, 5, 6 partially
- **Does not address:** Tabs restructure, pricing button styling

#### Approach B: "Tabs Restructure" — Full content reorganization
Add tabs for product details below the pricing section, integrate highlight into tabs, full restructure of content hierarchy.

- **Effort:** Medium
- **Impact:** Addresses all 6 issues comprehensively
- **Requires:** New data fields for shipping/returns text (or hardcoded), tab script, layout reorder

#### Approach C: "Design System Alignment" — Williamsburg-inspired polish
Matches Williamsburg's typography scale, button styling, tabs architecture, and card design. Full visual alignment.

- **Effort:** Medium-High
- **Impact:** Most premium result
- **Risks:** May lose Octavo Fuego's identity (Playfair bold is a brand element, should keep it)

### Recommendation

**Approach B (Tabs Restructure)** combined with specific styling fixes from Approach A.

Specifically:

1. **Font size:** Change h1 to `text-3xl md:text-4xl lg:text-5xl` — keeps the brand's bold Playfair while reducing visual dominance.

2. **Highlight quote:** Remove `bg-[var(--color-surface-warm)]`, change to `border-l-[2px] border-[var(--color-action-subtle)] pl-5 md:pl-6`, use italic serif normal weight.

3. **Tabs:** Add tabbed section below PricingTable with: Details (description + integrated highlight + intensity), Shipping (new static content), Returns (new static content), Reviews (Testimonials). Use the same JS pattern as Williamsburg's TabsScript.

4. **Pricing buttons:** Keep 8px radius but remove `border-2`, use `ring-1 ring-gray-200` instead. Selected state: `ring-2 ring-[var(--color-action-primary)]` with subtle bg tint rather than full solid fill.

5. **Testimonials:** Remove bg-papel, remove border, add `shadow-[var(--shadow-card)]` for floating cards.

6. **Image spacing:** Change grid ratio to `lg:grid-cols-[1fr_1.1fr]`, reduce gap to `gap-8 lg:gap-12`, add `max-h-[600px]` on image container.

### Risks

- **Tabs hide content from crawlers** — Ensure tab content is server-rendered (not client-only) for SEO. The tab JS should only toggle visibility, not load content dynamically.
- **Shipping/Returns data doesn't exist** — We'd need to add static copy or new product data fields for shipping and returns info.
- **Testimonial star icons** — Currently using Solar Bold-Duotone with yellow-500. If we make them more subtle, need to check icon availability.
- **Highlight quote removal from hero** — If moved to Details tab, it loses prominence. This is intentional (user complaint was it doesn't look premium), but the client may have emotional attachment to it.
- **Playfair bold + refined styling tension** — Playfair Display at font-black is inherently bold. Reducing button border weight and making cards more subtle may contrast oddly with the heavy serif. Need to verify in browser.

### Ready for Proposal

Yes — all issues are well-understood and dependencies are clear. The proposal should prioritize the font size change (issue 1, lowest effort, highest impact) and highlight quote refinement (issue 3) as the quickest wins, then tackle tabs restructure (issue 2) as the main architectural change.
