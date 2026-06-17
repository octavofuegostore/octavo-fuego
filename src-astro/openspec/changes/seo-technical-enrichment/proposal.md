# Proposal: SEO Technical Enrichment

## Intent

Consolidate SEO technical foundation after mobile-first overhaul. Eight mechanical, well-defined tasks — no editorial decisions, no new copy, no Medusa/monorepo involvement. All changes are additive or read-only audits.

## Scope

### In Scope
1. **@graph homepage** — WebPage + ItemList + Organization in single `<script>` on `[locale]/index.astro`
2. **OrganizationJsonLd enriched** — add `hasOfferCatalog` (5 rapés), `potentialAction` (WhatsApp), expand `knowsAbout`
3. **WholesaleStore JSON-LD** — schema on B2B landing `/es/mayoristas/` with `currenciesAccepted`, `areaServed`, `hasOfferCatalog`
4. **Internal linking audit** — verify 4 blog posts link to products/tienda. Report only.
5. **Hreflang region subtags** — upgrade `es`/`en`/`pt` to `es-CO`/`en-US`/`pt-BR` in Layout.astro, fix URL construction
6. **SEO Score Tracking** — add quantifiable metric to PROYECTO.md (5 categories: Content Quality, Technical SEO, Structured Data, Performance, Sitemap/Crawl)
7. **SEO directives verify** — audit robots.txt, hreflang, sitemap coverage. Report only.
8. **Move astro.config.mjs excerpt** — remove technical config snippet from B2B landing page, relocate to README.md

### Out of Scope
- New content, copy, or editorial decisions
- Medusa SSR, monorepo, `.com.br` domain
- Google Search Console setup
- Core Web Vitals optimization
- B2B landing page creation (task 3 adds schema component, not the page)

## Capabilities

### New Capabilities
- `seo-structured-data`: @graph consolidation, enriched Organization with OfferCatalog, WholesaleStore schema
- `seo-hreflang-regions`: hreflang tags with ISO region subtags (es-CO/en-US/pt-BR) on all indexed pages
- `seo-score-tracking`: quantifiable 5-category SEO scoring framework in PROYECTO.md

### Modified Capabilities
None — no existing spec-level behavior changes.

## Approach

**5 code changes + 3 audits.** Incremental, additive. Each task is self-contained.

| # | Task | Type | Key File |
|---|------|------|----------|
| 1 | @graph homepage | Code | `src/pages/[locale]/index.astro` + new `HomePageJsonLd.astro` |
| 2 | Organization enrichment | Code | `src/components/seo/OrganizationJsonLd.astro` |
| 3 | WholesaleStore schema | Code | New `WholesaleStoreJsonLd.astro` |
| 4 | Internal linking audit | Report | `src/pages/blog/[slug].astro` + blog/index |
| 5 | Hreflang regions | Code | `src/layouts/Layout.astro` |
| 6 | SEO score tracking | Code | `PROYECTO.md` |
| 7 | Directives audit | Report | `robots.txt.ts`, Layout.astro, sitemap config |
| 8 | Move config snippet | Code | README.md |

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/seo/` | Modified + New | OrganizationJsonLd enriched; new HomePageJsonLd, WholesaleStoreJsonLd |
| `src/layouts/Layout.astro` | Modified | Hreflang region subtags, URL construction fix |
| `src/pages/[locale]/index.astro` | Modified | Add @graph structured data |
| `PROYECTO.md` | Modified | Add SEO Score section |
| `README.md` | Modified | Absorb config snippet from B2B page |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Hreflang URL construction breaks on nested routes | Low | Regex-based locale prefix extraction, verified against all page types |
| Schema validation errors | Low | Validate against schema.org validator before merge |
| B2B landing page not yet in codebase (task 3) | Medium | Create JSON-LD component ready for future page; document integration point in ADR |

## Success Criteria

- [ ] Homepage serves single @graph script with Organization + WebPage + ItemList
- [ ] Organization JSON-LD passes Google Rich Results Test with OfferCatalog
- [ ] WholesaleStore component validates against schema.org
- [ ] All 4 blog posts audited for internal links; report generated
- [ ] Hreflang tags use region subtags on all 3 locales
- [ ] SEO Score section exists in PROYECTO.md with current scores
- [ ] robots.txt + sitemap verified across all pages
- [ ] astro.config.mjs snippet removed from B2B page, present in README.md
