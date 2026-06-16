# Tasks: footer-bg-tabaco

## Phase 1: Foundation

- [ ] 1.1 Add `--color-footer-bg: #3D2E22` token to `:root` block in `src/styles/global.css`

## Phase 2: Footer.astro Updates

- [ ] 2.1 Update `<footer>` background: `bg-[var(--humo)]` → `bg-[var(--color-footer-bg)]` (line 15)
- [ ] 2.2 Replace `text-gray-400` with `text-[var(--color-text-on-dark)]` — tagline (line 23), nav links (lines 38, 43, 57, 62, 67, 72, 77), contact links (lines 91, 97), info rows (lines 102, 106) — 11 instances
- [ ] 2.3 Replace `text-gray-500` with `text-[var(--color-text-on-dark)]/70` — disclaimer (line 26), zone info (line 110), copyright (line 149), legal links (lines 153, 156) — 5 instances
- [ ] 2.4 Replace `hover:text-[var(--color-action-primary)]` with `hover:text-white` — nav links ×7, contact links ×2, social icons ×3, legal links ×2 — 14 instances total
- [ ] 2.5 Update bottom border: `border-gray-700` → `border-white/10` (line 147)

## Phase 3: Verification

- [ ] 3.1 Run `astro build` and confirm 34 pages, 0 errors

## Phase 4: Commit

- [ ] 4.1 Commit with conventional commit format: `[octavo-fuego] footer: tobacco-dark background with unified text tokens` and push to `develop`

---

## Acceptance Criteria

| Task | Criteria |
|------|----------|
| 1.1 | `--color-footer-bg: #3D2E22` present in `:root` of `global.css` |
| 2.1 | `<footer>` uses `bg-[var(--color-footer-bg)]` |
| 2.2 | Zero `text-gray-400` occurrences in `Footer.astro` |
| 2.3 | Zero `text-gray-500` occurrences in `Footer.astro` |
| 2.4 | Zero `hover:text-[var(--color-action-primary)]` occurrences in `Footer.astro`; 14 `hover:text-white` present |
| 2.5 | Bottom border uses `border-white/10` |
| 3.1 | `astro build` succeeds with 34 pages |
| 4.1 | Commit pushed to `develop` branch |

## Dependency Order

Phase 1 → Phase 2 → Phase 3 → Phase 4. Tasks within a phase are independent and may run in parallel.