# Proposal: E9-P4 — Content Quality + Schema

## Intent

Fix shipping placeholder content, garbled blog text, and incorrect/missing schema markup across all locales before launch.

## Scope

### In Scope
- **PR1** (~380 lines): Replace lorem ipsum with real content in 7+ static pages × 3 locales (faq, nosotros, contacto, que-es-el-rape, rape-do-acre-origen, como-usar-el-rape, privacidad, terminos, envios)
- **PR2** (~250 lines): Fix blog garbled text — ceremonia-rape-amazonia (Cyrillic/Chinese chars, "amplify" ×11), historia-sananga (merged words), beneficios-spiritus (mixed EN/ES). Replace uniform product placeholder image (bobinsana-rape-2.webp across all 5 products)
- **PR3** (~400 lines): Schema corrections — Organization addressCountry "BR" → "CO", ProductJsonLd etnia empty string, FAQPage schema uses placeholder answers. Add missing schemas: SearchAction, Review (testimonials), WebPage (cart/checkout), CheckoutPage. Fix BlogPosting author type (Person, not Organization) and datePublished vs dateModified

### Out of Scope
- Blog content translation to EN/PT (content team scope)
- BlogPosting unique cover images (requires content creation)
- Bold payment integration

## Capabilities

### New Capabilities
None — all changes are content fixes and schema corrections within existing capabilities.

### Modified Capabilities
- `seo-schema-markup` (from ecommerce-spec §6.1): Organization addressCountry corrected, Product etnia populated, FAQPage answers reflect real content, new schema types added (SearchAction, Review, WebPage on cart/checkout, CheckoutPage)
- `blog-system`: Content quality fixes — garbled text removed, copy corrected

## Approach

3 PRs in parallel against `develop` (no chain dependency). PR1 edits `.mdoc` content files. PR2 patches blog `.mdx` and `src-astro/src/data/products.ts`. PR3 touches `src-astro/src/components/seo/*.astro`, PDP, product data, and adds new schema components. Each PR verified independently before merge.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src-astro/src/content/pages/**/*.mdoc` | Modified | lorem ipsum → real copy, 7+ pages × 3 locales |
| `src-astro/src/content/blog/*.mdx` | Modified | Garbled text cleanup (3 posts) |
| `src-astro/src/data/products.ts` | Modified | Unique image per product, etnia data |
| `src-astro/src/components/seo/OrganizationJsonLd.astro` | Modified | addressCountry fix |
| `src-astro/src/components/seo/ProductJsonLd.astro` | Modified | etnia populated |
| `src-astro/src/components/seo/FAQPageJsonLd.astro` | Modified | Answers sourced from real content |
| `src-astro/src/components/seo/` | New | SearchAction, Review, WebPage, CheckoutPage schema components |
| `src-astro/src/pages/[locale]/tienda/rape/[product].astro` | Modified | etnia prop wiring |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Content team rejects copy changes | Med | PR1 uses existing approved copy from Keystatic drafts where available; flag new content for review |
| Schema addressCountry change affects downstream | Low | No downstream consumers yet; all schema is SSG-rendered JSON-LD |
| Blog content patches miss edge-case characters | Low | Manual review + `grep` for non-Latin chars in all blog files post-fix |

## Rollback Plan

Per-PR revert: `git revert <merge-commit>` per PR. Schema additions are additive and safe to revert. Content changes are idempotent (old content preserved in git history).

## Dependencies

- Product images (PR2): requires sourcing unique images for each of 5 products
- FAQ real answers (PR1): requires sign-off from content/domain owner

## Success Criteria

- [ ] All 7+ static pages show real copy in ES locale (EN/PT at minimum remove lorem ipsum)
- [ ] No non-Latin characters or garbled text in any blog post
- [ ] Product images are unique per product (no duplicate bobinsana-rape-2.webp)
- [ ] Organization schema addressCountry displays "CO"
- [ ] ProductJsonLd etnia field is non-empty for all 5 products
- [ ] FAQPage schema answers match real page content
- [ ] SearchAction, Review, WebPage (cart/checkout), and CheckoutPage schemas present on their respective pages
- [ ] BlogPosting uses `author` of type `Person` and distinct `datePublished`/`dateModified`
