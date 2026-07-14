## Exploration: E10 — GEO/BigSchool Methodology Compliance

### Current State

Octavo Fuego implemented Phase A of SEO using the seobuild-onpage (seo-agi) methodology. The following components were implemented across 15 PDPs (5 products × 3 locales), tienda, home, blog, and llms.txt:

**Implemented:**
- AI Summary Nugget (≤200 chars, fact-dense block) on all 5 PDPs via `SeoContentBlocks.astro`
- Prove-It (2+ hard facts) on all 5 PDPs
- Not For You (honest bad-fit) on all 5 PDPs
- Fast-scan comparison table (QuickReferenceTable — HTML `<table>` 5 products × 7 columns)
- FAQPage schema on home (5 Q&A), tienda (4 Q&A), and PDPs (4 Q&A × 5 products × 3 locales)
- llms.txt + llms-full.txt for all 3 locales
- PersonJsonLd for both cofounders on blog/[slug].astro
- Blog drafts with quality scorecards (in content-collection `.md` files as HTML comments)
- ProductJsonLd, BreadcrumbList, Organization, BlogPosting, ItemList, WebPage, WebSite, Review schema markup

### Affected Areas

- `src-astro/src/components/seo/SeoContentBlocks.astro` — AI Summary Nugget, Prove-It, Not For You rendering
- `src-astro/src/pages/[locale]/tienda/rape/[product].astro` — PDP template (15 pages × 3 locales)
- `src-astro/src/components/tienda/QuickReferenceTable.astro` — Comparison table
- `src-astro/src/components/seo/FAQPageHomeJsonLd.astro` — Home FAQPage
- `src-astro/src/components/seo/FAQPageTiendaJsonLd.astro` — Tienda FAQPage
- `src-astro/src/components/seo/FAQPageJsonLd.astro` — PDP FAQPage
- `src-astro/src/components/seo/PersonJsonLd.astro` — Person schema
- `src-astro/src/pages/[locale]/blog/[slug].astro` — Blog detail (hardcoded posts + schema)
- `src-astro/src/content/blog/*.md` — Blog content collection drafts (5 posts)
- `src-astro/src/data/products.ts` — Product data (meta descriptions, page titles)
- `src-astro/src/lib/seo/llms.ts` — llms.txt generator
- `src-astro/src/pages/[locale]/nosotros.astro` — About page (missing Person schema for co-founders)

---

## seobuild-onpage Compliance Score: **6.0/10**

| # | Check | Score | Detail |
|---|-------|-------|--------|
| 1 | AI Summary Nugget (≤200 chars, first element) | 0.5/1 | ✓ Content correct, ✓ ≤200 chars, ❌ NOT positioned as first element on page (appears after H1, overview, tags grid) |
| 2 | Prove-It (2+ hard facts) | 1/1 | ✓ 4 facts per product (3 displayed), locale-aware |
| 3 | Not For You (honest bad-fit) | 1/1 | ✓ 3 scenarios per product, honest competitive-difficult language |
| 4 | Quality scorecard printed | 0/1 | ❌ Not on any rendered page. Only in MD comments of content-collection drafts |
| 5 | Fast-scan summary within first 200 words | 0.5/1 | ✓ QuickReferenceTable on tienda page, ✓ AI nugget serves as summary on PDPs — ❌ not within first 200 words on PDPs (nugget is deep in product info) |
| 6 | 500-token chunk architecture (question-based H2s, self-contained) | 0.5/1 | ✓ Content collection blog posts (5 MD files) — ❌ Hardcoded blog posts in [slug].astro lack question-based H2s; PDPs aren't structured as 500-token chunks (they're product pages, not content pages — acceptable gap) |
| 7 | FAQPage schema | 1/1 | ✓ Home (5 QA), Tienda (4 QA), PDPs (4 QA × 5 products × 3 locales) |
| 8 | BlogPosting schema with author | 1/1 | ✓ BlogPosting + PersonJsonLd for author on every blog page |
| 9 | Person schema for both co-founders | 0.5/1 | ✓ Both present on blog page — ❌ Not on "nosotros" (about) page; ❌ Edison Ramírez lacks social sameAs links |
| 10 | llms.txt + llms-full.txt | 1/1 | ✓ All 3 locales, includes products + blog + profecia |

---

## BigSchool Phase Compliance

### Phase 4 — On-Page Implementation

| Item | Status | Detail |
|------|--------|--------|
| T4.1 Slugs | ✅ **Compliant** | All slugs ≤60 chars, hyphens only, keyword-rich, resolve in architecture |
| T4.2 Heading hierarchy | ✅ **Compliant** | Exactly 1 H1 per page, no skipped levels (H1→H2→H3) |
| T4.3 Meta descriptions (120-155 chars) | ⚠️ **Pixurí PT gap** | 4/5 products compliant. Pixurí PT: **93 chars** — too short |
| T4.4 Schema markup | ✅ **Excellent** | Product, FAQPage, BreadcrumbList, BlogPosting, ItemList, WebPage, WebSite, Organization, Review, Person, AboutPage |
| T4.5 Internal linking | ✅ **Good** | Breadcrumbs, navbar, footer, cross-sell, blog→PDP links |
| T4.6 Core Web Vitals | ❓ **Not verified** | Requires PageSpeed Insights testing |

### Phase 5 — Content & EEAT

| Item | Status | Detail |
|------|--------|--------|
| T5.1 Discover blog topics | ✅ Done | 5 blog draft topics with keyword research |
| T5.2 Create EEAT content | ⚠️ **Partial** | Content collection MD files have quality scorecard comments, question-based H2s, internal links to PDPs — but hardcoded blog posts in [slug].astro are simpler, without question H2s or scorecards |

### Phase 6 — Technical Verification

| Item | Status | Detail |
|------|--------|--------|
| T6.1 JS Rendering | ❓ **Not verified** | Would require Google URL Inspection Tool |
| T6.2 Google vs LLM cross-check | ⚠️ **Partial** | Most shared items present; Person schema not on about page |

---

## Missing Items for Full Methodology Compliance

### Critical (blocks scoring above 7/10)
1. **Quality scorecard on every rendered page** — The seobuild skill's Section 14 rule is absolute: "If the scorecard is missing, the delivery is incomplete." Needs to be added to PDP templates, tienda, and all blog pages.
2. **AI Summary Nugget position** — Per the methodology, the nugget must be "the first element after frontmatter, above the H1." Currently it's positioned deep in the product info area (after H1, overview, tags).

### High Priority
3. **Fix Pixurí PT meta description** — Currently 93 chars, needs to be 120-155 chars
4. **Add PersonJsonLd for both co-founders on "nosotros" page** — Currently only on blog pages. The EEAT signal needs Person schema on the about page for both Josué Calderón and Edison Ramírez with social links
5. **Add Edison Ramírez social sameAs** — Only Josué has social profiles in his Person schema

### Medium Priority
6. **Question-based H2s for hardcoded blog posts** — The [slug].astro hardcoded posts (`guia-rape-principiantes`, `historia-sananga`, `ceremonia-rape-amazonia`, `beneficios-spiritus`) use topic headings, not question-based per 500-token chunk architecture
7. **Hub & Spoke internal linking architecture doc** — The BigSchool methodology expects a documented internal linking architecture. Currently organic but undocumented
8. **500-token chunk structure for PDP product sections** — While PDPs are transactional pages, the seobuild methodology expects self-contained, question-answering chunks even for product descriptions

### Low Priority
9. **Core Web Vitals verification** — Should be checked before launch
10. **JS rendering verification** — Should be checked via Google URL Inspection Tool

---

## Recommendations

1. **Add quality scorecard component** — Create a reusable `SeoScorecard.astro` component that renders the 14-point scorecard, add it to PDP, tienda, and blog page templates
2. **Reposition AI Summary Nugget** — Move it above the H1 as a `.ai-summary` div positioned before the `<h1>` tag in PDP template
3. **Fix Pixurí PT meta description** — Extend from current 93 chars to 120-155 chars
4. **Add Person schema to "nosotros" page** — Include both co-founders with full sameAs arrays
5. **Rewrite hardcoded blog posts with question-based H2s** — Align with content-collection post quality
6. **Document Hub & Spoke architecture** — Create/update internal linking doc per BigSchool Phase 4.5

### Effort Estimates

| Item | Effort | Impact |
|------|--------|--------|
| Quality scorecard component | Low | High (blocks all scorecard passes) |
| Reposition AI Nugget | Low | Medium |
| Fix Pixurí meta description | Trivial | Low |
| Person schema on nosotros | Low | Medium |
| Blog post rewrites | Medium | Medium |
| Hub & Spoke documentation | Low | Low |

---

### Ready for Proposal
**Yes** — The exploration found clear, actionable gaps. The orchestrator should tell the user:
- seobuild compliance score is **6.0/10** (not a failing grade but significant gaps)
- BigSchool Phase 4 compliance is **~85%** (only meta desc and schema placement gaps)
- The 2 critical fixes (quality scorecard + AI Nugget position) can be done in one session
- Recommend proceeding with a proposal for **E10-A: Quality Scorecard + AI Nugget Repositioning** as Phase 1, and **E10-B: Blog EEAT Hardening** as Phase 2
