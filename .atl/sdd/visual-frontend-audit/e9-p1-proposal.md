# Proposal: E9-P1 — Technical SEO

## Intent
Fix 5 SEO defects breaking indexation, i18n visibility, and crawl efficiency — noindex missing on private pages, canonical stripping locale prefix, sitemap missing hreflang, admin exposed to crawlers, and public pages forced to SSR.

## Scope

### In Scope
- **PR1: noindex + canonical + robots.txt** (~200 lines): Add noindex to admin, cart, checkout via layouts. Fix Layout.astro canonical to preserve locale prefix. Update robots.txt to disallow /admin/.
- **PR2: prerender + sitemap i18n + IndexNow** (~200 lines): Set prerender on 20+ public pages. Configure `@astrojs/sitemap` i18n alternates (EN, PT, ES). Verify IndexNow ping.

### Out of Scope
- Meta descriptions, OG images, structured data, content strategy, performance/LCP

## Capabilities
### Modified Capabilities
- `ecommerce-spec` (`seo` section): noindex rules for auth/privacy pages (cart, checkout, admin), canonical i18n requirements, sitemap alternates requirement
- `ui-spec` (layout section): Layout.astro canonicalUrl must not override child page locale-aware canonicals

## Approach
Two sequential PRs under 200 lines each. PR1 first (foundational — fixes indexation gates), then PR2 (prerender + sitemap). Each independently verifiable via GSC and build test.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src-astro/src/layouts/Layout.astro` | Modified | Canonical: preserve locale prefix, don't override child canonicals |
| `src-astro/src/layouts/AdminLayout.astro` | Modified | Add `<meta name="robots" content="noindex">` |
| `src-astro/src/pages/carrito/` | Modified | Add noindex + canonical (defense in depth) |
| `src-astro/src/pages/checkout/` | Modified | Add noindex + canonical (defense in depth) |
| `src-astro/public/robots.txt.ts` | Modified | Disallow `/admin/` |
| `src-astro/astro.config.mjs` | Modified | Sitemap i18n config, prerender entries |
| `src-astro/src/content/pages/*` | Modified | Add `prerender: true` frontmatter |
| `src-astro/src/pages/` (static) | Modified | Add `export const prerender = true` |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Canonical change de-indexes EN/PT temporarily | Med | Submit updated sitemap + IndexNow immediately after deploy |
| SSG prerender breaks on API-dependent pages | Low | Audit each page individually; keep data-fetching pages on SSR |
| noindex on cart blocks Checkout flow in search | Low | Intentional — no SEO value; cart leaks PII via URL params |

## Rollback Plan
Revert each PR with `git revert <sha>`. PR1 restores old canonical/noindex instantly. PR2 rolls back prerender + sitemap config. Deploy sequentially — verify PR1 in production before starting PR2.

## Dependencies
- Astro 6 `output: 'hybrid'` allows per-page prerender override
- `@astrojs/sitemap` v3.7.2 i18n alternates config (verify xhtml:link support)

## Success Criteria
- [ ] GSC shows correct canonical URLs for EN/PT pages (no ES prefix stripping)
- [ ] No admin/cart/checkout pages indexed after re-crawl
- [ ] Sitemap contains `<xhtml:link rel="alternate">` for all i18n variants
- [ ] robots.txt disallows `/admin/`
- [ ] 20+ public pages serve static HTML (`npm run build` shows no `λ` for those pages)
- [ ] IndexNow ping succeeds on deploy
