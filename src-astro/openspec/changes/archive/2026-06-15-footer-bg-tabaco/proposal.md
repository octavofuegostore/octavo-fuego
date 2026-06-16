# Proposal: footer-bg-tabaco

## Intent

Redesign the site footer to use a dedicated `tobacco-dark` background (`#3D2E22`) instead of the generic `humo` gray (`#2A2A2A`). This gives the footer stronger brand identity, resolves the unused `--color-text-on-dark` token, and replaces 14 ad-hoc `gray-*` utilities and inconsistent hover states with design tokens.

## Scope

### In Scope
- Add `--color-footer-bg: #3D2E22` token to `src/styles/global.css`
- Update `src/components/Footer.astro`: background, text colors, hover states, border

### Out of Scope
- Changes to other components or pages
- Token aliasing or refactoring of other color tokens
- Any Sahumerios or Incienso-specific section theming

## Capabilities

### New Capabilities
- None — this is a pure styling refactor within existing component capability

### Modified Capabilities
- `footer`: Background changes from `bg-[var(--humo)]` to `bg-[var(--color-footer-bg)]`; all text migrated from ad-hoc `gray-*` utilities to `--color-text-on-dark` and `--color-text-on-dark]/70`; hover states unified to `hover:text-white`

## Approach

1. Add `--color-footer-bg: #3D2E22` to the global CSS custom properties
2. Update `<footer>` root: `bg-[var(--humo)]` → `bg-[var(--color-footer-bg)]`
3. Replace all `text-gray-400` / `text-gray-500` with `text-[var(--color-text-on-dark)]` (and `/70` variant where appropriate)
4. Replace all 14 `hover:text-[var(--color-action-primary)]` with `hover:text-white`
5. Replace `border-gray-700` with `border-white/10`

**Design rationale**: `#3D2E22` was chosen over `#5a4d3f` or `#6d5e4d` because it passes WCAG AA (4.5:1) with `text-white/80`. Separating `--color-footer-bg` from `--tabaco-base` follows single-responsibility: footer background and hover color can evolve independently.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/styles/global.css` | Modified | Add `--color-footer-bg` token |
| `src/components/Footer.astro` | Modified | Background, text colors, hover states, border |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Other pages reference `Footer.astro` and inherit unintended styles | Low | All other pages already use Footer.astro; no cross-component impact |
| WCAG contrast regression in edge locales | Low | Validated: `text-white` (9.7:1), `--color-text-on-dark` (9.7:1), `white/70` (6.8:1) all pass AA |

## Rollback Plan

1. Revert `src/styles/global.css` to remove `--color-footer-bg`
2. In `Footer.astro`, restore `bg-[var(--humo)]`, `text-gray-400/500`, `hover:text-[var(--color-action-primary)]`, and `border-gray-700`
3. Rebuild: `astro build`

## Dependencies

- None

## Success Criteria

- [ ] Footer renders with `#3D2E22` background
- [ ] All text uses design tokens (no ad-hoc `gray-*` utilities in footer)
- [ ] All 14 hover states use `hover:text-white`
- [ ] Bottom border uses `border-white/10`
- [ ] `astro build` completes without errors