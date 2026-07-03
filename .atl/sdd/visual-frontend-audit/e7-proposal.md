# Proposal: E7 — Astro Best Practices

## Intent

Fix 5 SSG/View Transitions/hygiene issues from the Astro audit so public pages pre-build, transitions animate, and dead code is removed.

## Scope

### In Scope
- **PR1 — SSG misconfiguration** (~35 lines): Remove `export const prerender = false` from 17 public `[locale]/*` pages — only admin/API routes keep SSR.
- **PR2 — View Transitions** (~5 lines): Add `ClientRouter` from `astro:transitions` to public `Layout.astro` so `transition:name` on ProductCard/QuickViewModal actually animates.
- **PR3 — "use client" cleanup** (~12 lines): Strip the Next.js-only directive from 12 TSX components (zero effect in Astro islands).
- **PR4 — client:load → client:idle** (~1 line): Change `CartStore` on cart page to defer hydration until browser idle.
- **PR5 — lucide-react removal** (~1 line + npm uninstall): Remove unused dependency (zero imports confirmed in `src/`).

### Out of Scope
- Content Collections migration (needs schema + blog refactor — future sprint)
- View Transition animation tuning (fade presets, duration)
- Rewriting TSX islands as `.astro`

## Capabilities

None — pure technical remediation, no new capabilities introduced.

## Approach

5 independent PRs against `develop`. Order: SSG first (changes build output) → View Transitions → "use client" → client:load → lucide-react. No chain dependencies except SSG should merge first.

```
develop → feature/visual-frontend-audit/
  ├── PR1: 09-e7-ssg-fix          (~35 lines)
  ├── PR2: 10-e7-view-transitions  (~5 lines)
  ├── PR3: 11-e7-use-client        (~12 lines)
  ├── PR4: 12-e7-client-load       (~1 line)
  └── PR5: 13-e7-lucide-remove     (~1 line)
```

## Affected Areas

| Area | Impact | Lines |
|------|--------|-------|
| `src/pages/[locale]/*.astro` (×17) | Modify: remove prerender=false | ~34 |
| `src/pages/[locale]/blog/*.astro` (×2) | Modify: remove prerender=false | ~2 |
| `src/layouts/Layout.astro` | Modify: add ClientRouter | ~5 |
| `src/components/**/*.tsx` (×12) | Modify: remove "use client" | ~12 |
| `src/pages/carrito/index.astro` | Modify: client:load→client:idle | ~1 |
| `package.json` | Modify: remove lucide-react | ~1 |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Public page needs SSR after SSG change | Low | `npm run build` + smoke test all routes |
| lucide-react imported dynamically | Low | `rg` confirmed zero imports in src/ |

## Rollback Plan

Per PR: `git revert -m 1 <merge-commit>`. All 5 PRs are atomic. SSG revert first if build fails.

## Success Criteria

- [ ] `npm run build` pre-renders all public pages as static HTML
- [ ] View Transition animations play on product navigation
- [ ] Zero `"use client"` directives in `src/` source files
- [ ] `CartStore` hydrates on browser idle (not on load)
- [ ] `lucide-react` absent from `package.json` and `node_modules`
