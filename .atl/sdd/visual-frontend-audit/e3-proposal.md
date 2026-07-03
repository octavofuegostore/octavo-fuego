# Proposal: E3 — Web Quality

## Intent

Fix 12 critical/high findings from the Web Quality audit (Perf ~55, A11y ~60, SEO ~75, BP ~65) so the site ships at viable quality — target Perf 70+, A11y 80+, SEO 90+, BP 80+.

## Scope

### In Scope
- **PR1 — Performance + Core Web Vitals** (~100 lines): Remove `prerender = false` from public pages, `preload` Playfair Display, add width/height to hero LCP image
- **PR2 — Accessibility** (~150 lines): Skip-to-content link, `:focus-visible` styles, AdminLayout dynamic `lang`, `--color-ceniza` contrast fix (#7b8084 → darker for WCAG AA 4.5:1)
- **PR3 — SEO + Security + Content** (~130 lines): `robots noindex` on admin/cart/checkout, CSP headers in `astro.config.mjs`, fix blog garbled chars, replace Nosotros Lorem Ipsum, remove 47 console.* statements

### Out of Scope
- Full redesign or dark mode (covered by E1/E2)
- Animation system or chart components
- Medusa.js integration
- Performance beyond quick wins (code splitting, image CDN)

## Capabilities

None — pure technical remediation, no new capabilities introduced.

## Approach

**3 PRs force-chained against `develop`, ~380 lines total.**

```
develop → feature/visual-frontend-audit/
  ├── PR1: e3-perf-cwv        (~100 lines)
  ├── PR2: e3-a11y             (~150 lines)
  └── PR3: e3-seo-content      (~130 lines)
```

PR1 → PR2 → PR3 (sequential chain, no cross-dependencies).

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src-astro/src/layouts/Layout.astro` | Modified | prerender flag, skip-to-content, font preload |
| `src-astro/src/layouts/AdminLayout.astro` | Modified | Dynamic `lang` attribute |
| `src-astro/src/styles/global.css` | Modified | `:focus-visible`, contrast token |
| `src-astro/astro.config.mjs` | Modified | CSP headers |
| `src-astro/src/pages/[locale]/index.astro` | Modified | Hero img width/height |
| `src-astro/src/pages/[locale]/nosotros.mdx` | Modified | Lorem ipsum → real copy |
| `src-astro/src/content/blog/ceremonia-rape-amazonia.mdx` | Modified | Garbled chars fix |
| Admin/cart/checkout page files | Modified | `robots noindex` meta |
| `src-astro/src/**/*.tsx`, `*.astro` | Modified | console.* removal |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| `prerender = false` removal breaks dynamic routes | Low | Verify admin/dynamic pages still have explicit `prerender = false` |
| Contrast change rejected by designer | Med | Propose `#6B6F73` (same hue, darker) — validate visually |
| CSP blocks inline scripts at runtime | Med | Test in preview; use nonces or hashes for legitimate inline scripts |

## Rollback Plan

Per PR: `git revert -m 1 <merge-commit>`. PRs are atomic — each revert restores one concern fully.

## Dependencies

- Parent `visual-frontend-audit` chain runs PR structure (branch exists)
- Copy/content for Nosotros page needed from stakeholder

## Success Criteria

- [ ] Lighthouse Performance ≥ 70 (from ~55)
- [ ] Lighthouse Accessibility ≥ 80 (from ~60)
- [ ] Lighthouse SEO ≥ 90 (from ~75)
- [ ] Lighthouse Best Practices ≥ 80 (from ~65)
- [ ] Skip-to-content link visible on first Tab press
- [ ] `:focus-visible` ring visible on all interactive elements
- [ ] AdminLayout `lang` matches current locale (es/en/pt)
- [ ] `--color-ceniza` text passes WCAG AA contrast (≥4.5:1)
- [ ] Zero console.* statements in production build
- [ ] CSP header present in response (non-blocking on preview)
- [ ] All 12 E3 findings resolved
