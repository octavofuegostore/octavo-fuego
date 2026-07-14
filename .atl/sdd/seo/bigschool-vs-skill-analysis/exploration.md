# Exploration: BigSchool vs seobuild-onpage — SEO Methodology for Octavo Fuego

**Topic**: `seo/bigschool-vs-skill-analysis`
**Date**: July 13, 2026
**Primary**: SEO Senior Architect
**Goal**: Compare both methodologies, map against Octavo Fuego's current state, recommend a path forward.

---

## 1. Methodology Comparison Matrix

| Dimension | SEO-BigSchool-AI (6 Phases) | seobuild-onpage (GEO/SEO-AGI) | Overlap? | Conflict? |
|-----------|----------------------------|-------------------------------|----------|-----------|
| **Nature** | Process/project plan (sequential phases) | Content craft system + off-page trust architecture | Complementary — serve different roles | No |
| **Keyword Research** | Google Ads → Keyword Planner → Seasonality CSV | DataForSEO / Ahrefs / SEMRush → competitive intelligence | Partial | BigSchool requires Google Ads card; seobuild uses paid APIs |
| **Architecture** | SERP intent test → site hierarchy → traffic filter | Hub & spoke + Site-level entity dominance | High overlap on hierarchy and hub/spoke | No |
| **On-Page: Titles** | Keyword-rich, includes value prop | Entity-based, natural phrasing | Compatible | No |
| **On-Page: Meta desc** | Include H1 + 2 H2 keywords | EXACT MATCH keyword is over-optimization/spam | **NO** — direct contradiction | ⚠️ BigSchool says EMQ; seobuild says anti-EMQ |
| **On-Page: Headings** | Keywords in H2s | Entity-based headings, EMQ only in H1 if competitors do it | Compatible | No |
| **Schema markup** | Required per page type | Required per page type + RDFa inline | High overlap | seobuild adds RDFa |
| **CWV** | LCP < 2.5s, FID < 100ms, CLS < 0.1 | Not mentioned | BigSchool-only | No |
| **Content structure** | Standard blog/article format | **500-token chunk architecture**, QFO facets, AI Summary Nugget | **NO** — seobuild's core differentiator | No |
| **EEAT** | Author byline + internal links | Experience (original research), Expertise (hard numbers), Authority (citations), Trust (Not For You) | Partial | seobuild is far more detailed |
| **Quality gates** | None specified | Reddit Test, Prove-It, Not For You, Information Gain, QDD | **NO** — unique to seobuild | No |
| **Off-page / Trust** | Not covered | **Tributary Trust Protocol** (Tier 1 assets), Entity Consensus, Brand Footprint | **NO** — unique to seobuild | No |
| **AEO / LLM** | Google-centric, basic LLM cross-check | RAG targeting, zero-volume long-tail, citation strategy | Partial | seobuild far deeper |
| **Entity / KG** | Not covered | Entity optimization, Knowledge Graph signals, Deep Entity History | **NO** — unique to seobuild | No |
| **Seasonality** | 12-month sparklines per keyword | Not covered | BigSchool-only | No |
| **Traffic viability** | Discard DIY/tutorial-dominant SERPs | Not covered | BigSchool-only | No |
| **Verification** | Phase 6 report | `{{VERIFY}}` / `{{RESEARCH NEEDED}}` / `{{SOURCE NEEDED}}` tags | Partial | seobuild uses inline tags vs BigSchool uses pass/fail checklist |
| **Quality scorecard** | Not present | Mandatory 28-point scorecard at end of every page | **NO** — unique to seobuild | No |

### Direct Contradictions

| Rule | BigSchool says | seobuild says | Verdict |
|------|---------------|---------------|---------|
| Meta description | "Include H1 + at least 2 H2 keywords" | "Exact match keyword in meta description is a major over-optimization and spam signal" | **Follow seobuild** — entity-based, value-prop meta descs |
| H2 content | Keywords as H2s | Entity-based headings, never exact match | **Compatible** with nuance; prioritize entities |
| URL slugs | "Use primary keyword in slug" | "Streamline to feature target keyword, no filler words" | **Compatible** — same principle |
| Content approach | Standard article format | 500-token self-contained chunks with QFO | **seobuild is more advanced** |
| Off-page | No coverage | Tributary Trust Protocol | **seobuild essential for modern GEO** |

---

## 2. Octavo Fuego — Gap Analysis

### ✅ What's Already Done (From Both Methodologies)

| Capability | Source | Files |
|-----------|--------|-------|
| Schema: Organization + sameAs | ✅ | `OrganizationJsonLd.astro` |
| Schema: Product + hasVariant | ✅ | `ProductJsonLd.astro` |
| Schema: BreadcrumbList | ✅ | `BreadcrumbJsonLd.astro` |
| Schema: FAQPage (PDPs) | ✅ | `FAQPageJsonLd.astro` + `faqContent.ts` |
| Schema: Person | ✅ | `PersonJsonLd.astro` |
| Schema: ItemList (homepage) | ✅ | `GraphSchema.astro` |
| Schema: Article/BlogPosting | ✅ | Implemented per blog |
| Hreflang tags (es/en/pt, language-only) | ✅ | `Layout.astro` lines 45-74 |
| Canonical URLs (self-referencing per locale) | ✅ | `Layout.astro` line 63 |
| robots.txt + sitemap-index.xml | ✅ | `robots.txt.ts`, `@astrojs/sitemap` |
| Meta descriptions (120-155 chars) | ✅ | Throughout page frontmatter |
| OG tags + Twitter Cards | ✅ | `Layout.astro` lines 77-89 |
| Internal linking (hub/spoke in blog) | ✅ | Blog strategy doc |
| llms.txt × 3 locales | ✅ | `public/llms.txt` + EN/PT variants |
| Security headers (CSP, HSTS, X-Frame-Options) | ✅ | `vercel.json` |
| Performance: content-visibility, fetchpriority | ✅ | CSS + HTML attributes |
| Price per gram ($3.500/g) as differentiator | ✅ | In architecture doc defined |
| On-page SEO validator utility | ✅ | `src/lib/seo/onpage-validator.ts` |
| Redirects: /catalogo/ → /tienda/ | ✅ | `astro.config.mjs` |

### ❌ Missing from BigSchool

| # | Gap | Impact | Effort |
|---|-----|--------|--------|
| BS-1 | Google Ads account / Keyword Planner (card required) | 🔴 High — blocks keyword research | Medium |
| BS-2 | Keyword research CSV with 12-month seasonality | 🟡 Medium | Medium |
| BS-3 | Formal site hierarchy document (architecture.md) | 🟡 Medium | Low |
| BS-4 | Traffic viability filter applied per keyword group | 🟡 Medium | Low |
| BS-5 | EEAT author bylines on content | 🟢 Low | Low |
| BS-6 | JS rendering verification via Google URL Inspection | 🟡 Medium | Low |
| BS-7 | Google Search Console for all 3 locales | 🔴 High — blocks performance monitoring | Medium |
| BS-8 | Phase 6 formal verification report | 🟢 Low | Low |

### ❌ Missing from seobuild-onpage

| # | Gap | Impact | Effort |
|---|-----|--------|--------|
| SO-1 | **500-token chunk architecture** — current content not structured in QFO chunks | 🔴 High — limits LLM retrieval | High |
| SO-2 | **AI Summary Nugget** — 200-char fact-dense block at top of every page | 🟡 Medium | Low |
| SO-3 | **Fast-scan summary / decision matrix** on PDPs | 🟡 Medium | Low |
| SO-4 | **Prove-It section** with hard operational facts on content pages | 🟡 Medium | Medium |
| SO-5 | **Not For You block** — honest bad-fit scenarios | 🟡 Medium | Low |
| SO-6 | **Original Research / Data Experiment block** on content pages | 🔴 High — strongest EEAT differentiator | Medium |
| SO-7 | **HTML `<table>` comparison** — may be using bullet lists instead | 🟡 Medium | Low |
| SO-8 | **RDFa inline markup** — JSON-LD only currently | 🟢 Low | Low |
| SO-9 | **Verification tags** (`{{VERIFY}}`, `{{RESEARCH NEEDED}}`) | 🟡 Medium | Low |
| SO-10 | **Tributary Trust Protocol** — Tier 1 assets (Google Sites, Medium, Subreddit, LinkedIn) | 🔴 High — blocks KG inclusion | High |
| SO-11 | **Off-page brand footprint** — entity consensus on Facebook, Reddit, etc. | 🔴 High | High |
| SO-12 | **Reddit Test / Information Gain Test** applied to content | 🟡 Medium | Low (process) |
| SO-13 | **QDD vulnerability check** on target keywords | 🟢 Low | Low |
| SO-14 | **GBP optimization for conversational queries** | 🟡 Medium | Medium |
| SO-15 | **Forensic EMQ check** per keyword target | 🟢 Low | Low |
| SO-16 | **Site-level entity dominance** — hub + 5 spoke pages minimum | 🔴 High | High |
| SO-17 | **RAG targeting** — zero-volume long-tail content (20% of calendar) | 🟡 Medium | Medium |
| SO-18 | **Deep Entity History** on products (founding dates, origin stories, generational ownership) | 🟡 Medium | Low |

### ❌ Cross-Cutting Project Gaps (From Both)

| # | Gap | Impact | Effort | Notes |
|---|-----|--------|--------|-------|
| PG-1 | **3 informational pages don't exist** (`/que-es-el-rape`, `/como-usar-el-rape`, `/rape-do-acre-origen`) | 🔴 High | Medium | Blocks full funnel — cold traffic has no landing |
| PG-2 | **Kuripe category + 2 products don't exist** | 🔴 High | Medium | −2 product SKUs, −1 category from architecture |
| PG-3 | **Blog: only 4 posts** (no pillar page, no hub/spoke) | 🔴 High | High | Content engine essential for organic growth |
| PG-4 | **No Google Search Console** (any locale) | 🔴 High | Low | Cannot measure or diagnose SEO performance |
| PG-5 | **No Google Ads account** (card not configured) | 🟡 Medium | Medium | Blocks Keyword Planner access |
| PG-6 | **Hub EN not built** | 🟡 Medium | High | Post-MVP, but blocks international traffic |
| PG-7 | **Hub BR not built** (domain not acquired) | 🟡 Medium | High | Post-MVP |
| PG-8 | **No Bing Webmaster Tools** | 🟢 Low | Low | Minor traffic share |
| PG-9 | **No Cloudflare in front of Vercel** | 🟡 Medium | Medium | Security + performance + CDN benefits |
| PG-10 | **Content roadmap not published** | 🟡 Medium | Low | Needed for team alignment |

---

## 3. Prioritized Action Plan

Ordered by impact × effort ratio (highest first). All tasks assume the existing SEO Transactional Architecture SDD is complete.

### Phase A: Foundation (This Month — High Impact, Low/Medium Effort)

| # | Task | Source | Effort | Depends On |
|---|------|--------|--------|------------|
| A1 | **Set up Google Search Console** for octavofuego.com (all 3 locales: es, en, pt) | BS-7 | Low | — |
| A2 | **Create `/es/que-es-el-rape/`** (informational page) with seobuild structure: AI Nugget → Fast-Scan → 500-token chunks → FAQ schema → Not For You | PG-1, BS-2 | Low | — |
| A3 | **Create `/es/como-usar-el-rape/`** (how-to page) — same seobuild structure | PG-1 | Low | A2 |
| A4 | **Create `/es/rape-do-acre-origen/`** (differentiation page) — same seobuild structure | PG-1 | Low | A2 |
| A5 | **Add AI Summary Nugget** (200-char fact block) to all existing PDPs + homepage | SO-2 | Low | — |
| A6 | **Add Prove-It section** to each PDP (hard facts per product: origin community, preparation process, fill rates) | SO-4 | Low | — |
| A7 | **Add Not For You block** to each PDP (e.g., "Not for you if you have severe nasal conditions, are pregnant, or..." ) | SO-5 | Low | — |
| A8 | **Build fast-scan comparison table** on /tienda/ page (HTML `<table>`: variety × intensity × price/gram × best for) | SO-7 | Low | — |
| A9 | **Apply Reddit Test + Information Gain Test** to all existing blog posts; rewrite thin sections | SO-12 | Low | — |
| A10 | **Set up Google Ads account** (placeholder card, no campaign) for Keyword Planner access | BS-1 | Medium | — |

### Phase B: Content Engine (Next Month — High Impact, Medium Effort)

| # | Task | Source | Effort | Depends On |
|---|------|--------|--------|------------|
| B1 | **Build pillar page: "Guía Completa del Rapé"** (8,000+ words) with 500-token chunk architecture, QFO facets, Original Research block, FAQPage schema | PG-3, SO-1, SO-6 | High | A2-A4 |
| B2 | **Create Kuripe category page** + 2 product pages with full schema + seobuild structure | PG-2 | Medium | — |
| B3 | **Create 4 spoke blog posts** linked from pillar: Yawanawa, Huni Kuin, Nukini, Kuntanawa | PG-3 | Medium | B1 |
| B4 | **Run keyword research** via Google Ads Planner (once account is set up) → seasonality CSV | BS-2 | Medium | A10 |
| B5 | **Build content calendar** with 20% RAG-targeting (zero-volume long-tail) + 80% searchable | SO-17 | Medium | B4 |
| B6 | **Add Original Research block** to 3 informational pages (e.g., "We analyzed 6 months of pricing data..." ) | SO-6 | Low | A2-A4 |

### Phase C: Off-Page & Trust (Month 2-3 — High Impact, High Effort)

| # | Task | Source | Effort | Depends On |
|---|------|--------|--------|------------|
| C1 | **Deploy Tributary Trust Protocol**: Create 4+ Tier 1 assets (Google Site, Medium, LinkedIn article, Reddit post/Subreddit) around key brand entity | SO-10 | High | B1 |
| C2 | **Build off-page brand footprint**: GBP, Facebook Page, industry citations, press mentions | SO-11 | Medium | — |
| C3 | **Optimize GBP for conversational queries**: services as discrete items, Q&A pre-populated, bi-weekly posts | SO-14 | Medium | C2 |
| C4 | **Start site-level entity dominance**: ensure every page on domain reinforces rapé topic cluster | SO-16 | High | B1-B3 |
| C5 | **Apply 500-token chunk architecture** retroactively to flagship content (pillar page, top 5 PDPs) | SO-1 | High | B1 |
| C6 | **Add RDFa inline markup** on key entities in PDPs (product names, prices, quantities) | SO-8 | Low | — |

### Phase D: Expansion (Month 3-4 — Medium Impact, Medium Effort)

| # | Task | Source | Effort | Depends On |
|---|------|--------|--------|------------|
| D1 | **Build Hub EN** — /en/ home, /en/shop/, 7 products translated | PG-6 | High | C1 |
| D2 | **Acquire octavofogo.com.br domain + build Hub BR** | PG-7 | High | D1 |
| D3 | **Set up Cloudflare** in front of Vercel | PG-9 | Medium | — |
| D4 | **Run JS rendering verification** via Google URL Inspection on 3 key pages | BS-6 | Low | A1 |
| D5 | **Formal verification report** (Phase 6 from BigSchool) | BS-8 | Low | A1-B4 |

---

## 4. Recommendation

### Primary Methodology: **seobuild-onpage (SEO-AGI)**

Reasoning:
- **Modern GEO reality**: 95% of users use ChatGPT for initial research (BigSchool's own data). A methodology that doesn't optimize for LLM retrieval is building a house on sand. seobuild's 500-token chunks, RAG targeting, and citation strategy directly address this.
- **Quality gates are non-negotiable**: The Reddit Test, Prove-It, Not For You, and Information Gain filters are the difference between content that ranks and content that doesn't. BigSchool has nothing comparable.
- **Off-page trust is the new backlinks**: The Tributary Trust Protocol is the single most important strategic insight across both documents. Without Tier 1 entity corroboration, on-page perfection underperforms.
- **Entity + Knowledge Graph optimization** is where Google is heading. BigSchool barely touches it.

### Secondary: **BigSchool as Project Management Layer**

Use BigSchool's **phase sequencing** (2→3→4→5→6) as the project plan. Specifically:
- **Phase 2** (Keyword Research via Google Ads) — valuable for seasonality data that seobuild doesn't cover
- **Phase 3** (SERP intent validation) — good sanity check before building content
- **Phase 6** (Technical Assurance checklist + cross-check) — solid QA framework at the end

### What to Reject from BigSchool

- **Meta description with EMQ**: Follow seobuild — entity-based, value-prop descriptions. Exact match in meta description is a spam signal.
- **Google-exclusive focus**: BigSchool barely acknowledges AI Overviews or LLM citations. Must adapt for GEO.
- **No quality gates**: BigSchool's content phase lacks any quality filter. Must use seobuild's 5 quality gates.

### Summary: Integration Model

```
BigSchool Phases                seobuild Components
   2. Keyword Research  ──────  {Data Layer / Competitive Intelligence}
         │
   3. Architecture ──────────── {Hub & Spoke / Site Entity Dominance / EMQ Check}
         │
   4. On-Page ────────────────  {Schema markup + RDFa / CWV / Semantic HTML}
         │
   5. Content ────────────────  {500-token Chunks / QFO / AI Nugget / Prove-It / Not For You}
         │                          │
         │                     ┌────┘
         │                [Quality Gates: Reddit Test, Information Gain]
         │
   6. Technical Assurance ────  {Verification Tags / Scorecard}
         │
    [CROSS-CUTTING: Tributary Trust Protocol (runs parallel, starts Phase 5)]
```

### Ready for Proposal

**Yes** — this analysis is ready to drive the next phase. The orchestrator should present this to the user and propose an SDD change for Phase A (Foundation) implementation, starting with the 3 informational pages structured with seobuild-onpage methodology.
