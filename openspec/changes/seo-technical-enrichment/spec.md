# SEO Technical Enrichment Specification

## Purpose

Add structured data, hreflang regions, SEO scoring, and audits to the Octavo Fuego Astro site. Eight tasks: 5 code changes + 3 audits. No new content or editorial decisions.

---

## 1. SEO Structured Data

### REQ-1: @graph Homepage JSON-LD

The homepage `[locale]/index.astro` MUST serve a single `<script type="application/ld+json">` with `@graph` containing Organization, WebPage, and ItemList (5 rapé products).

**Scenarios:**
- **GIVEN** user visits homepage **WHEN** page renders **THEN** a single `@graph` JSON-LD script SHALL be present **AND** SHALL contain `@type: ["Organization", "WebPage", "ItemList"]`.
- **GIVEN** structured data validator (schema.org) **WHEN** testing homepage **THEN** zero errors SHALL be reported.
- **GIVEN** homepage loads **WHEN** ItemList renders **THEN** it SHALL list 5 rapé product entries with `url` and `name`.

### REQ-2: OrganizationJsonLd Enriched

The Organization JSON-LD component MUST include `hasOfferCatalog` (5 rapés), `potentialAction` (WhatsApp contact), and expanded `knowsAbout` array.

**Scenarios:**
- **GIVEN** any page using OrganizationJsonLd **WHEN** rendered **THEN** `hasOfferCatalog` SHALL contain 5 `Offer` items with `name` and `url`.
- **GIVEN** OrganizationJsonLd **WHEN** rendered **THEN** `potentialAction` SHALL include a `CommunicateAction` targeting WhatsApp.
- **GIVEN** OrganizationJsonLd **WHEN** rendered **THEN** `knowsAbout` SHALL include rapé, tobacco, medicina ancestral.

### REQ-3: WholesaleStore JSON-LD

A new `WholesaleStoreJsonLd.astro` component MUST provide schema.org `WholesaleStore` markup for the `/es/mayoristas/` B2B landing page.

**Scenarios:**
- **GIVEN** B2B landing page `/es/mayoristas/` **WHEN** rendered **THEN** `@type: WholesaleStore` JSON-LD SHALL be present.
- **GIVEN** WholesaleStore schema **WHEN** validated **THEN** SHALL include `currenciesAccepted`, `areaServed`, and `hasOfferCatalog`.

---

## 2. SEO Hreflang

### REQ-4: Hreflang Region Subtags

`Layout.astro` MUST generate hreflang tags using ISO region subtags: `es-CO`, `en-US`, `pt-BR` (upgraded from `es`, `en`, `pt`). URL construction MUST extract locale prefix correctly for all page types.

**Scenarios:**
- **GIVEN** any indexed page **WHEN** `<head>` renders **THEN** three `<link rel="alternate" hreflang="...">` tags SHALL be present with `es-CO`, `en-US`, `pt-BR`.
- **GIVEN** nested route `/blog/some-post` **WHEN** hreflang tags generated **THEN** URLs SHALL be `/es/blog/some-post`, `/en/blog/some-post`, `/pt/blog/some-post`.
- **GIVEN** hreflang validator **WHEN** checking cross-locale links **THEN** all three locale URLs SHALL return 200 and be self-referencing.

---

## 3. SEO Audits

### REQ-5: Internal Linking Audit

A read-only audit MUST verify that all 4 blog posts link to at least one product or `/tienda` page. Output SHALL be a report file.

**Scenarios:**
- **GIVEN** blog post files in `src/pages/blog/` **WHEN** audit runs **THEN** each post SHALL be checked for internal links to product/tienda URLs.
- **GIVEN** a blog post has zero product links **WHEN** audit runs **THEN** a warning SHALL be flagged in the report.

### REQ-6: SEO Directives Verify

An audit MUST verify: `robots.txt` serves correctly, hreflang tags appear on all indexed pages, sitemap covers all locales. Output SHALL be a report.

**Scenarios:**
- **GIVEN** `robots.txt` endpoint **WHEN** fetched **THEN** SHALL return 200 with correct `User-agent` and `Sitemap` directives.
- **GIVEN** sitemap generation **WHEN** built **THEN** all 3 locales SHALL have entries **AND** `<xhtml:link rel="alternate">` annotations SHALL be present.

---

## 4. SEO Score Tracking

### REQ-7: PROYECTO.md Score Framework

`PROYECTO.md` MUST include an SEO Score section with 5 categories: Content Quality, Technical SEO, Structured Data, Performance, Sitemap/Crawl. Each SHALL have a 0-100 score and last-updated date.

**Scenarios:**
- **GIVEN** PROYECTO.md **WHEN** opened **THEN** an "SEO Score" section SHALL exist with the 5 specified categories.
- **GIVEN** SEO Score table **WHEN** viewed **THEN** each category SHALL display a numeric score (0-100) and `_actualizado: YYYY-MM-DD`.

---

## 5. SEO Configuration

### REQ-8: Move astro.config.mjs Snippet

The `astro.config.mjs` technical snippet MUST be removed from the B2B landing page and relocated to `README.md` in a dedicated "Configuración Técnica" section.

**Scenarios:**
- **GIVEN** B2B landing page **WHEN** rendered **THEN** astro.config.mjs code block SHALL NOT be present.
- **GIVEN** README.md **WHEN** opened **THEN** a "Configuración Técnica" section SHALL contain the astro.config.mjs snippet.
