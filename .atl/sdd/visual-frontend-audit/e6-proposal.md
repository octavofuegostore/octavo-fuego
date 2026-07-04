# Proposal: E6 — Tailwind + Design Tokens

## Intent

Fix 4 critical token defects found in the Tailwind v4 audit that produce visible rendering bugs: undefined border color on public pages, nonexistent font heading, two conflicting browns, and duplicated spacing tokens with mismatched values.

## Scope

### In Scope

- **PR1 — Definition gaps + brown unification** (~200 lines)
  - Define `--color-border-subtle` in `@theme` (rendering black today)
  - Add `font-heading` alias or fix `card.tsx` to use `font-display`
  - Unify `--color-tabacco` (#8B4513) / `--tabaco-base` (#6d5e4d) to a single brown
  - Update all components using the deprecated brown
- **PR2 — Spacing dedup + shadow alignment** (~200 lines)
  - Remove `--space-*` from `:root` or align values with `--spacing-*` in `@theme`
  - Add 3rd shadow layer to match Airbnb system spec (only 2 exist today)

### Out of Scope

- OKLCH migration (deferred to design system v2)
- Dark mode `.dark` toggle implementation
- `Table.tsx` legacy `React.forwardRef` refactor
- General visual polish (covered by parent proposal PRs 2-6)

## Capabilities

None — pure token hygiene with zero new functionality. Existing `ui-spec` is accurate; only CSS definitions are corrected to match what the spec already describes.

## Approach

Two PRs chained after the parent proposal's PR1 (token unify + contrast) since they touch the same CSS variables. Run in E6-defined order (definitions first, cleanup second) to avoid conflicts on `global.css`.

```
develop → feature/visual-frontend-audit/
  ├── ... (parent PRs 1-6)
  ├── PR 7: 07-e6-token-defs       (~200 lines)
  └── PR 8: 08-e6-spacing-shadows  (~200 lines)
```

Each PR ≤ 400 lines. Revertable atomically.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src-astro/src/styles/global.css` | Modified | Add `--color-border-subtle`, `font-heading`, unify browns, dedup spacing, add 3rd shadow |
| `src-astro/src/components/ui/card.tsx` | Modified | Fix `font-heading` → `font-display` or add to `@theme` |
| Admin components using `bg-tabacco` | Modified | Migrate to unified brown token |
| Public templates with `text-papel`/`bg-humo` | Modified | Ensure consistency with unified palette |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Token rename misses component using old name | Low | `rg -r` exhaustive search before PR |
| Spacing realignment shifts layout silently | Low | Visual diff review per PR |
| `--color-border-subtle` fix changes expected black border to a defined color | Med | Confirm design intent: should subtle borders be near-white or `--color-action-subtle`? |

## Rollback Plan

Per PR: `git revert -m 1 <merge-commit>`. Both PRs are atomic — a single revert restores the previous state. If spacing changes cause layout shifts, revert PR2 only while keeping PR1.

## Dependencies

- Parent proposal PR1 must land first (establishes functional tokens that E6 aligns with)
- Design decision needed on `--color-border-subtle` value (propose `#C4956A` / `--color-action-subtle`)

## Success Criteria

- [ ] `grep -r 'color-tabacco\|--color-border-subtle\|font-heading' src-astro/` finds zero undefined references
- [ ] `--space-*` and `--spacing-*` no longer conflict (one source of truth)
- [ ] `--color-border-subtle` renders as a visible defined color on all public pages
- [ ] `--shadow-card`, `--shadow-hover`, `--shadow-raised` all defined and referenced
- [ ] `$impeccable audit` post-chain passes with zero token-level findings
