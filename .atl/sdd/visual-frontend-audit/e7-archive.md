# Archive Report: E7 — Astro Best Practices

**Change**: E7 — Astro Best Practices
**Archived**: 2026-07-03
**Artifact Store**: Engram
**Verdict**: PASS — All tasks verified and complete.

---

## Artifact Traceability (Observation IDs)

| Artifact | Engram ID | Topic Key |
|----------|-----------|-----------|
| Audit/Exploration | #1737 | `sdd/visual-frontend-audit/e7-explore` |
| Proposal | #1776 | `sdd/visual-frontend-audit/e7-proposal` |
| Tasks | #1781 | `sdd/e7-astro-best-practices/tasks` |
| Apply-progress | #1784 | `sdd/e7-astro-best-practices/apply-progress` |
| Verify-report | #1785 | `sdd/e7-astro-best-practices/verify-report` |
| Archive-report | #1786 | `sdd/e7-astro-best-practices/archive-report` |

**Filesystem artifacts** also stored at:
- `.atl/sdd/visual-frontend-audit/e7-proposal.md`
- `.atl/sdd/visual-frontend-audit/e7-archive.md` (this report)

---

## What Was Done

5 independent PRs implemented against `develop`, ordered by dependency:

| PR | Description | Lines Changed | Files |
|----|-------------|--------------|-------|
| **PR1** | SSG Fix — Remove `export const prerender = false` from 19 public pages, add `getStaticPaths()` via shared helper | ~54 | 24 files |
| **PR2** | View Transitions — Add `ClientRouter` from `astro:transitions` to public `Layout.astro` | ~5 | 1 file |
| **PR3** | "use client" Cleanup — Remove Next.js-only directive from 12 TSX components | ~12 | 12 files |
| **PR4** | `client:load` → `client:idle` — Defer CartStore hydration on carrito page | ~1 | 1 file |
| **PR5** | `lucide-react` Removal — `npm uninstall`, clean package.json + lockfile | ~1 | 2 files |

**Total**: ~73 lines changed across 36 files.

---

## What Was Changed

| File | Action | What |
|------|--------|------|
| `src-astro/src/i18n/staticPaths.ts` | **Created** | Shared `getStaticPaths` helper with locale mapping |
| `src-astro/src/pages/[locale]/index.astro` | Modified | Added getStaticPaths, removed prerender=false |
| `src-astro/src/pages/[locale]/nosotros.astro` | Modified | Added getStaticPaths, removed prerender=false |
| `src-astro/src/pages/[locale]/contacto.astro` | Modified | Added getStaticPaths, removed prerender=false |
| `src-astro/src/pages/[locale]/faq.astro` | Modified | Added getStaticPaths, removed prerender=false |
| `src-astro/src/pages/[locale]/mayoristas.astro` | Modified | Added getStaticPaths, removed prerender=false |
| `src-astro/src/pages/[locale]/tienda/index.astro` | Modified | Added getStaticPaths, removed prerender=false |
| `src-astro/src/pages/[locale]/tienda/rape/[product].astro` | Modified | Added getStaticPaths with product mapping |
| `src-astro/src/pages/[locale]/tienda/[category].astro` | Modified | Added getStaticPaths, removed prerender=false |
| `src-astro/src/pages/[locale]/blog/index.astro` | Modified | Added getStaticPaths, removed prerender=false |
| `src-astro/src/pages/[locale]/blog/[slug].astro` | Modified | Added inline getStaticPaths for blog posts |
| + 6 more `[locale]/*.astro` pages | Modified | Same pattern |
| `src-astro/src/layouts/Layout.astro` | Modified | Added `import { ClientRouter }` + `<ClientRouter />` |
| `src-astro/src/components/**/*.tsx` (12 files) | Modified | Removed `"use client"` directive |
| `src-astro/src/pages/carrito/index.astro` | Modified | `client:load` → `client:idle` |
| `src-astro/src/i18n/en.json` | Modified | Added missing `mayoristas` translations |
| `src-astro/src/i18n/pt.json` | Modified | Added missing `mayoristas` translations |
| `src-astro/package.json` | Modified | Removed `lucide-react` dependency |
| `src-astro/package-lock.json` | Modified | Regenerated without lucide-react |

---

## Key Decisions Made

1. **Shared getStaticPaths helper** (`src/i18n/staticPaths.ts`): Instead of duplicating the locale/route logic across 17 pages, created a reusable exported helper that all `[locale]/*.astro` pages import. Reduces boilerplate and centralizes path generation.

2. **Inline getStaticPaths for blog [slug]**: The blog slug page needs to know the full list of posts at build time. Since the blog data object lives in that same file, `getStaticPaths()` was defined inline rather than in the shared helper. Variable hoisting in Astro frontmatter meant the blog data had to be defined before the function call.

3. **Admin/API routes explicitly excluded from SSG**: All 31 `export const prerender = false` instances remaining are exclusively in `admin/` and `api/` routes. Confirmed with regex scan.

4. **Mayoristas translations added**: The SSG conversion exposed a pre-existing bug where the `mayoristas` page path was missing from `en.json` and `pt.json` translation files. Added the missing entries as part of PR1 since the build error blocked SSG.

5. **ClientRouter in Layout.astro matched AdminLayout pattern**: Used the same import structure and placement that was already proven working in the admin layout.

---

## Deviations from Proposal

| Aspect | Proposed | Actual | Reason |
|--------|----------|--------|--------|
| Lines changed for PR1 | ~35 | ~54 | Added `getStaticPaths()` and shared helper was more complex than a simple prerender removal |
| Files for PR1 | 19 | 24 | Created new `staticPaths.ts` + fixed missing mayoristas translations in 2 i18n files |
| Total lines changed | ~55 | ~73 | SSG fix required more boilerplate than estimated |
| Total files changed | ~34 | 36 | Close to estimate; additional files from i18n fix |
| spec/design artifacts | Separate spec+design | Proposal only | Change was pure technical remediation — no new capabilities, no behavioral contracts needed |

---

## Issues Found During Implementation

1. **Pre-existing: Missing mayoristas translations** (blocker for SSG)
   - Severity: Medium (blocked SSG build)
   - The `mayoristas` page path was absent from `en.json` and `pt.json` translation files
   - When `getStaticPaths()` tried to build paths for all locales, the missing key caused a build error
   - Fix: Added the missing entries to both locale files

2. **Variable hoisting in Astro frontmatter**
   - Severity: Low (design constraint)
   - Blog `[slug].astro` has its data object defined inside frontmatter; the shared `getStaticPaths` helper can't reference it since the import happens before the data is defined
   - Fix: Defined `getStaticPaths()` inline in `[slug].astro` after the blog data

3. **lucide-react zero imports but still in package.json**
   - Severity: Low (hygiene)
   - `grep` confirmed zero source imports, but `lucide-react` was still a dependency
   - Only references found were inside `node_modules/shadcn/` (shadcn's own transitive dependency)
   - Fix: `npm uninstall lucide-react` removed it from package.json + regenerated lockfile

4. **CRITICAL issues during implementation/verification**: None

---

## Task Completion Summary

| Task | Status | Verify Evidence |
|------|--------|-----------------|
| PR1: SSG Fix | ✅ Complete | Build passes with static HTML per locale; zero prerender=false in public pages |
| PR2: View Transitions | ✅ Complete | ClientRouter import + component present in Layout.astro |
| PR3: use-client Cleanup | ✅ Complete | Zero `"use client"` directives in components/ directory |
| PR4: client:load → client:idle | ✅ Complete | CartStore on carrito page uses `client:idle` |
| PR5: lucide-react Removal | ✅ Complete | Removed from package.json; zero source imports |

**5/5 tasks complete. No stale unchecked tasks.**

---

## Verification Summary

- **Verdict**: PASS
- **Build**: `npm run build` completes in ~5s, all SSG pages pre-rendered
- **All 8 runtime checks**: ✅ PASS
- **CRITICAL issues**: None
- **WARNINGS**: None
- **SUGGESTIONS**: None

---

## Archive Notes

- Artifact store mode: `engram`
- No filesystem merge performed (engram-only mode)
- No filesystem archive move needed
- This report is persisted to both Engram (`sdd/e7-astro-best-practices/archive-report`) and this file
- The SDD cycle for E7 is complete and archived.
