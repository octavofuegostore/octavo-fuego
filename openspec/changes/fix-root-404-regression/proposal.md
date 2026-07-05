# Proposal: Fix Root URL 404 Regression

## Intent

`https://octavofuego.com/` returns 404 because SSG produces `es/index.html`, `en/index.html`, `pt/index.html` but no root `index.html`. The canonical URL also incorrectly points to `/es/` for the default locale. Fix: extract the home page body into a shared component, render it at root, and strip the `/es/` prefix from the canonical.

## Scope

### In Scope
- Extract Hero + Trust Badges + ProphecyTeaser + Intentions + Productos section into `HomeContent.astro`
- Create root `index.astro` rendering `HomeContent` with locale='es'
- Update `[locale]/index.astro` to delegate to `HomeContent`
- Strip `/es/` prefix from canonical URL in `Layout.astro`

### Out of Scope
- `/en/`, `/pt/`, `/tienda`, `/profecia`, `/blog`, `/admin` — all unaffected
- Other locale-based canonical bugs (only default-locale path is wrong)
- Test or CI changes

## Capabilities

None. Pure refactor — no capability-level behavior change. Existing spec contracts unchanged.

## Approach

1. **Extract**: Move all inline body content from `[locale]/index.astro` (lines 79–206) into `src-astro/src/components/home/HomeContent.astro`. Component receives `locale: Locale` prop. Local data (`intentions`, `iconNames`, `homeTitles`, `homeDescriptions`) moves with it or stays as needed.
2. **Root page**: Create `src-astro/src/pages/index.astro` with static frontmatter, locale='es', renders `<HomeContent locale='es' />` inside `<Layout>`.
3. **Update [locale]/index.astro**: Replace inline body with `<HomeContent locale={locale_} />`.
4. **Fix canonical**: In `Layout.astro:31`, strip `/es/` prefix from `Astro.url.pathname` when the path starts with `/es/` — using the already-computed `matchedLocale` local variable.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src-astro/src/pages/[locale]/index.astro` | Modified | Inline body → `<HomeContent locale={locale_} />` |
| `src-astro/src/pages/index.astro` | New | Root page, renders HomeContent with locale='es' |
| `src-astro/src/components/home/HomeContent.astro` | New | Extracted home sections, locale-aware |
| `src-astro/src/layouts/Layout.astro:31` | Modified | Canonical strips `/es/` prefix for default locale |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Missing import in HomeContent | Low | Build fails — caught immediately |
| Root page missing Layout wrapper | Low | Review during verify |
| Canonical fix breaks hreflang | Low | ES hreflang already uses empty prefix (line 44), no overlap |

## Rollback Plan

Revert all 4 files: delete the 2 new files, restore `[locale]/index.astro` inline body, restore `Layout.astro:31` to original. Total revert: 1 commit.

## Dependencies

None. No new packages. No config changes.

## Success Criteria

- [ ] `npm run build` succeeds with 0 errors
- [ ] `dist/client/index.html` exists in build output
- [ ] `https://octavofuego.com/` returns 200 (not 404)
- [ ] Canonical on default locale is `https://octavofuego.com/` (not `/es/`)
- [ ] `/en/`, `/pt/` pages continue working with correct canonical prefixes
