# Proposal: Tienda CRO Visual Polish

## Intent

Current product page buries price behind 3 selectable buttons and uses visually heavy tag pills that compete with the CTA. Visitors must scan to find what they pay. Apply CRO principles from Williamsburg analysis: price prominence, reduced noise near CTA, substantial related products, and social proof via real avatars.

## Scope

### In Scope
1. Replace tag pills with simple text links (reduce visual noise)
2. Add standalone price display between h1 and description
3. Enlarge Related Products cards (500px images, subtle bg, tighter gap)
4. Add Gravatar avatar support to Testimonials (initials fallback)
5. WhatsApp CTA: subtle visual weight increase

### Out of Scope
- Review modal redesign (separate change)
- Backend/data changes
- Analytics or A/B testing infrastructure
- New review collection system

## Capabilities

### New Capabilities
None — all changes are visual refinements, no new spec-level contracts.

### Modified Capabilities
None — no existing spec requirements change.

## Approach

| # | Change | File | CRO Principle |
|---|--------|------|---------------|
| 1 | Tags: `rounded-full` + bg → `text-xs font-medium capitalize` text links with hover color | `[product].astro` | Reduce visual noise near CTA |
| 2 | Standalone price: render mid-tier price (`$70.000 COP`) in Playfair italic accent after h1 | `[product].astro` | Price prominence, anchoring |
| 3 | Related: image 500px, `.papel` bg on card, `gap-3`, `p-4` padding, shadow-hover | `RelatedProducts.astro` | Substantial products → add-to-cart |
| 4 | Gravatar: `<img src="https://www.gravatar.com/avatar/${md5(email)}?d=blank&s=40" />` with initials fallback | `Testimonials.astro` | Real faces → trust → conversion |
| 5 | CTA: add `text-base py-3` to WhatsAppButton buy variant (was text-sm) | WhatsAppButton pass | CTA weight → action |

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src-astro/src/pages/[locale]/tienda/rape/[product].astro` | Modified | Tags styling + standalone price insertion |
| `src-astro/src/components/product/RelatedProducts.astro` | Modified | Card size, bg, gap, padding |
| `src-astro/src/components/tienda/Testimonials.astro` | Modified | Gravatar URL logic + email-based avatar |
| `src-astro/src/components/product/PricingTable.astro` | Modified | WhatsAppButton size prop |
| `src-astro/src/components/whatsapp/WhatsAppButton.astro` | Modified | Accept optional `size` prop for CTA weight |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Gravatar adds HTTP request per review | Low | `loading="lazy"`, `d=blank` (no fallback image), initials render synchronously |
| Larger related images shift layout | Low | `aspect-square` container constrains layout; grid stays stable |

## Rollback Plan

Revert each file individually via `git checkout` — no data migration, no backend dependency. Single PR, full revert in one command.

## Dependencies

- Gravatar: external service (no API key, purely URL-based). If Gravatar is unreachable, initials fallback shows.

## Success Criteria

- [ ] Price is visible above the fold without scrolling on desktop/mobile
- [ ] Tags render as text links (no bg pills) — measurable via DOM check
- [ ] Related product images render at 500px width
- [ ] Testimonials show Gravatar photos when email hash is available, initials otherwise
- [ ] `astro build` passes with zero errors
