# Design: SEO Technical Enrichment

## Technical Approach

Incremental, additive changes to the Astro SSG site. All modifications follow existing patterns: zero-JS `.astro` components, `@id` cross-referencing between schemas, locale-aware routing via `[locale]` params. No new dependencies, no Medusa/monorepo involvement.

---

## Architecture Decisions

### Decision 1: @graph consolidation via `@id` references

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Merge all 3 schemas into one component | Tight coupling, harder to reuse Organization on other pages | ❌ |
| Keep existing OrganizationJsonLd global + add HomePageJsonLd with WebPage+ItemList that references `#organization` via `@id` | Two `<script>` tags on homepage (Google accepts this) | ✅ |
| Inline all 3 schemas in index.astro frontmatter | Violates component separation, bloats page | ❌ |

**Rationale**: OrganizationJsonLd already runs globally in `Layout.astro` with `@id: https://octavofuego.com/#organization`. ProductJsonLd and blog posts already reference it via `seller.@id` and `publisher.@id`. HomePageJsonLd adds WebPage + ItemList in a second `<script>` on the homepage only, referencing `mainEntity.@id: #organization`. This preserves the existing `@id` cross-reference graph without refactoring.

### Decision 2: Regex-based locale prefix extraction for hreflang

| Option | Tradeoff | Decision |
|--------|----------|----------|
| String `.replace('/en', '')` | Fails on nested routes containing "en"/"pt" as substring (e.g., `principiantes`, `beneficios`) | ❌ |
| Regex `^/\/(es|en|pt)(\/|$)` to extract prefix + remainder | Robust, handles all route depths | ✅ |

**Rationale**: Current code uses `pathname.replace('/en', '')` which would corrupt `/en/blog/beneficios-spiritus` (removes "en" from "beneficios"). New approach: `pathname.match(/^\/(es|en|pt)(\/.*)?$/i)` extracts locale + rest, then constructs alternates as `https://octavofuego.com/{targetLocale}{restPath}`.

### Decision 3: WholesaleStoreJsonLd as standalone async component

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Inline schema in future mayoristas page | Component not reusable, no separation | ❌ |
| Standalone `.astro` component ready for import | Follows existing SEO component pattern, forward-compatible | ✅ |

**Rationale**: The B2B page `/es/mayoristas/` does not yet exist. Creating `src/components/seo/WholesaleStoreJsonLd.astro` follows the same pattern as ProductJsonLd and BreadcrumbJsonLd. The component is import-ready for when the page is built. Uses `hasOfferCatalog` with the 5 rapés from `products.ts`.

### Decision 4: SEO Score table in PROYECTO.md

Add a 5-category table with `Categoría | Puntaje (0-100) | Actualizado` columns to PROYECTO.md §7 (SEO section). Uses existing markdown table pattern already present in the file. No automation — manual update by team.

### Decision 5: Config snippet relocation

No B2B landing page exists in the codebase. The `astro.config.mjs` content (sitemap config, i18n routing, redirects) is documented in a new "Configuración Técnica" section in `README.md`. This provides a non-code discoverable reference for developers.

---

## Data Flow

```
Layout.astro (global)
  ├── OrganizationJsonLd (all pages)  ── @id: #organization
  └── Hreflang tags (es-CO/en-US/pt-BR)

index.astro (homepage only)
  └── HomePageJsonLd  ── @graph: [WebPage → #organization, ItemList (5 rapés)]

mayoristas.astro (future)
  └── WholesaleStoreJsonLd  ── offers → #organization

ProductJsonLd.astro (PDPs)
  └── seller.@id → #organization  ← existing, unchanged

blog/[slug].astro
  └── publisher.@id → #organization  ← existing, unchanged
```

---

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/components/seo/HomePageJsonLd.astro` | Create | @graph with WebPage + ItemList (5 rapés), references `#organization` via `@id` |
| `src/components/seo/WholesaleStoreJsonLd.astro` | Create | WholesaleStore schema: currenciesAccepted, areaServed, hasOfferCatalog |
| `src/components/seo/OrganizationJsonLd.astro` | Modify | Add `hasOfferCatalog` (5 Offers), `potentialAction` (WhatsApp), expand `knowsAbout` |
| `src/layouts/Layout.astro` | Modify | Regex-based hreflang: `es-CO`, `en-US`, `pt-BR`; fix nested-route URL construction |
| `src/pages/[locale]/index.astro` | Modify | Import + render `HomePageJsonLd` |
| `PROYECTO.md` | Modify | Add SEO Score section (§7.1) with 5-category table |
| `README.md` | Modify | Add "Configuración Técnica" with astro.config.mjs documentation |

**Audits (no code changes)**:
| Audit | Method | Output |
|-------|--------|--------|
| Internal linking | Script/check: 4 blog posts → product/tienda links | Report |
| SEO directives | Manual: robots.txt 200 check, hreflang presence, sitemap locale coverage | Report |

---

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Hreflang URL construction | Test regex extraction with edge cases: root `/es`, nested `/en/blog/post`, `pt` in word |
| Integration | Schema validation | Validate @graph JSON-LD against schema.org validator |
| E2E | Hreflang cross-locale | Fetch all 3 locale URLs, verify 200 + self-referencing tags |
| Manual | SEO Score table | Visual verification in PROYECTO.md |

---

## Open Questions

- [ ] Should hreflang `x-default` point to `/` (root redirect) or `/es/`? Spec implies `es-CO` is default — confirm with stakeholder.
- [ ] WholesaleStore: `priceRange` field needs actual wholesale pricing data — defer to B2B page creation task.
