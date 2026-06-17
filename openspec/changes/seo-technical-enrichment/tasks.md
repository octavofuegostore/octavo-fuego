# Tasks: SEO Technical Enrichment

> **Budget**: ~197 estimated lines changed (D1: 400-line review cap — 49% utilization)
> **Strategy**: 5 code changes + 3 audits. Additive, no refactors. Tasks 4.1 and 4.2 are report-only (0 diff lines).

---

## Phase 1: Structured Data Components

- [ ] **1.1** Enrich `src/components/seo/OrganizationJsonLd.astro` — add `hasOfferCatalog` (5 Offer items linking rapé products), `potentialAction` (CommunicateAction → WhatsApp), and expand `knowsAbout` array (`["rapé", "tabaco", "medicina ancestral"]`). Preserve existing `@id: #organization`. **(~26 lines)**
- [ ] **1.2** Create `src/components/seo/WholesaleStoreJsonLd.astro` — standalone `<script type="application/ld+json">` with `@type: WholesaleStore`, `currenciesAccepted: ["COP", "USD"]`, `areaServed: ["CO", "BR", "US"]`, and `hasOfferCatalog` referencing 5 rapés. Ready for future `/es/mayoristas/` import. **(~45 lines, new file)**
- [ ] **1.3** Create `src/components/seo/HomePageJsonLd.astro` — `@graph` containing WebPage (`mainEntity.@id: #organization`) + ItemList (5 rapé products with `url` and `name`). Wire into `src/pages/[locale]/index.astro` (import + `<HomePageJsonLd />` in `<head>`). **(~65 lines: ~60 new component + ~5 wiring)**

## Phase 2: Routing — Hreflang Region Subtags

- [ ] **2.1** Modify `src/layouts/Layout.astro` — replace string-based `.replace()` hreflang with regex extraction (`pathname.match(/^\/(es|en|pt)(\/.*)?$/i)`), swap locale tags `es→es-CO`, `en→en-US`, `pt→pt-BR`, and construct alternates as `https://octavofuego.com/{targetLocale}{restPath}`. Fixes substring corruption on words like "beneficios", "principiantes". **(~18 lines)**

## Phase 3: Documentation & Configuration

- [ ] **3.1** Add SEO Score section to `PROYECTO.md` (§7.1) — markdown table with columns `Categoría | Puntaje (0-100) | Actualizado` and 5 rows: Content Quality, Technical SEO, Structured Data, Performance, Sitemap/Crawl. Populate initial scores with realistic baselines. **(~18 lines)**
- [ ] **3.2** Add "Configuración Técnica" section to `README.md` — absorb `astro.config.mjs` snippet (sitemap config, i18n routing, redirects) previously documented on B2B landing page. If B2B page exists, remove the snippet from it. **(~25 lines)**

## Phase 4: Read-Only Audits

- [ ] **4.1** ⚠️ AUDIT-ONLY: Internal linking check — verify all 4 blog posts in `src/pages/blog/` contain ≥1 link to a product page or `/tienda`. Output report listing pass/fail per post with missing-link warnings. **No code changes.** **(~0 lines)**
- [ ] **4.2** ⚠️ AUDIT-ONLY: SEO directives verify — confirm `robots.txt` returns 200 with correct User-agent + Sitemap, hreflang tags present on all 3 indexed locales, sitemap covers all locales with `<xhtml:link rel="alternate">` annotations. Output verification report. **No code changes.** **(~0 lines)**

---

## Review Workload Forecast

| Phase | Tasks | Est. Lines | Review Budget (D1: 400) |
|-------|-------|-----------|--------------------------|
| 1. Structured Data | 1.1, 1.2, 1.3 | ~136 | 34% |
| 2. Hreflang Regions | 2.1 | ~18 | 5% |
| 3. Documentation | 3.1, 3.2 | ~43 | 11% |
| 4. Audits (report-only) | 4.1, 4.2 | 0 | 0% |
| **Total** | **8** | **~197** | **49%** |

> **Verdict**: ✅ Within budget (197/400). 51% headroom available.

## Files Touched (Summary)

| File | Action | Task | Est. Δ |
|------|--------|------|--------|
| `src/components/seo/OrganizationJsonLd.astro` | Modify | 1.1 | +26 |
| `src/components/seo/WholesaleStoreJsonLd.astro` | Create | 1.2 | +45 |
| `src/components/seo/HomePageJsonLd.astro` | Create | 1.3 | +60 |
| `src/pages/[locale]/index.astro` | Modify | 1.3 | +5 |
| `src/layouts/Layout.astro` | Modify | 2.1 | ~+18 |
| `PROYECTO.md` | Modify | 3.1 | +18 |
| `README.md` | Modify | 3.2 | +25 |

## Dependency Order

```
1.1 (Organization enrich) ──┐
1.2 (WholesaleStore)        ├── Phase 1 (parallel)
1.3 (HomePage @graph) ──────┘      │
                                    ▼
                            2.1 (Hreflang regions) ── Phase 2
                                    │
                                    ▼
                       3.1 + 3.2 (Docs) ── Phase 3 (parallel)
                                    │
                                    ▼
                       4.1 + 4.2 (Audits) ── Phase 4 (parallel, depends on 2.1 for hreflang verify)
```
