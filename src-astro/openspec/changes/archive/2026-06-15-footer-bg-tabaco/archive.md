# Archive Report: footer-bg-tabaco

## Change Summary

**Change**: `footer-bg-tabaco`
**Archived**: 2026-06-15
**Status**: Complete

## What Was Implemented

**Token added:**
- `--color-footer-bg: #3D2E22` in `global.css`

**Footer.astro changes:**
- Background: `bg-[var(--humo)]` → `bg-[var(--color-footer-bg)]`
- Body text: `text-gray-400` → `text-[var(--color-text-on-dark)]` (11 instances)
- Meta text: `text-gray-500` → `text-[var(--color-text-on-dark)]/70` (5 instances)
- Hover states: `hover:text-[var(--color-action-primary)]` → `hover:text-white` (14 instances)
- Bottom border: `border-gray-700` → `border-white/10`

## Files Changed

| File | Action |
|------|--------|
| `src/styles/global.css` | Modified — added `--color-footer-bg` token |
| `src/components/Footer.astro` | Modified — all styling updates above |

## Verification Results

- **Build**: `astro build` — 34 pages, 0 errors ✅
- **Commit**: `develop` branch ✅
- **All 8 acceptance criteria met**:
  - [x] `--color-footer-bg: #3D2E22` present in `:root` of `global.css`
  - [x] `<footer>` uses `bg-[var(--color-footer-bg)]`
  - [x] Zero `text-gray-400` occurrences in `Footer.astro`
  - [x] Zero `text-gray-500` occurrences in `Footer.astro`
  - [x] Zero `hover:text-[var(--color-action-primary)]` occurrences in `Footer.astro`; 14 `hover:text-white` present
  - [x] Bottom border uses `border-white/10`
  - [x] `astro build` succeeds with 34 pages
  - [x] Commit pushed to `develop` branch

## Design Notes

- `--color-text-on-dark` (#F2EFE8) gives 9.7:1 contrast on #3D2E22 — exceeds WCAG AA
- Separating `--color-footer-bg` from `--tabaco-base` follows single-responsibility principle: footer background and hover color can evolve independently
- Option B (solid tabaco-dark) chosen over gradient — cleaner, more brand-consistent

## Engram Artifacts

| Artifact | Observation ID |
|----------|----------------|
| Proposal | #457 |
| Tasks | #459 |

## Archive Contents

- `proposal.md` ✅
- `tasks.md` ✅

## SDD Cycle Complete

The change has been fully planned, implemented, verified, and archived.
Ready for the next change.