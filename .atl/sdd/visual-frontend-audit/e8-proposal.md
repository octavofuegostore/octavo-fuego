# Proposal: E8 — i18n / Locale

## Intent

Fix hardcoded ES strings in cart, checkout, and mayoristas causing incorrect locale display (EN/PT users see ES text) and a runtime crash on `/en/mayoristas` and `/pt/mayoristas` (missing wholesale translations).

## Scope

### In Scope
- **PR1: mayoristas crash fix** (~50 lines): Add wholesale section translations to EN/PT JSON; fix `mayoristas.astro` to use `t()` for title/description/keywords.
- **PR2: CartDrawer i18n** (~120 lines): Migrate ~11 hardcoded ES strings to `t()`. Add locale subscription (nanostores) to React island.
- **PR3: CheckoutForm + OrderSummary i18n** (~230 lines): Migrate ~37 hardcoded ES strings (validation, labels, placeholders, step nav) to `t()`.

### Out of Scope
- Admin panel i18n (ES-only UI chrome — deferred)
- Blog locale content strategy (Keystatic ES-only — needs CMS-level solution)
- Sitemap hreflang config (already in E3 scope)

## Capabilities

None — i18n infrastructure exists (`t()` helper, 3-locale JSON). This fixes components that bypass it.

## Approach

3 PRs chained against `develop`. PR1 ships first (crash fix), then PR2 → PR3. Locale passed to React islands via nanostores store + `useStore`.

```
develop → feature/visual-frontend-audit/
  ├── PR1: 14-e8-mayoristas-crash      (~50 lines)
  ├── PR2: 15-e8-cart-i18n             (~120 lines)
  └── PR3: 16-e8-checkout-i18n         (~230 lines)
```

## Affected Areas

| Area | Impact | Lines |
|------|--------|-------|
| `src/i18n/en.json` | Modify: add mayoristas keys | ~15 |
| `src/i18n/pt.json` | Modify: add mayoristas keys | ~15 |
| `src/pages/[locale]/mayoristas.astro` | Modify: hardcoded → `t()` | ~10 |
| `src/components/cart/CartDrawer.tsx` | Modify: 11 strings → `t()` | ~120 |
| `src/components/checkout/CheckoutForm.tsx` | Modify: ~30 strings → `t()` | ~180 |
| `src/components/checkout/OrderSummary.tsx` | Modify: 7 strings → `t()` | ~50 |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Crash if JSON key missing after i18n swap | Low | Test all 3 locales in dev before merge |
| Locale subscription breaks cart state | Low | Unit test CartDrawer with each locale |
| Validation messages lose nuance in translation | Med | ES as source of truth; verify EN/PT manually |

## Rollback Plan

Per PR: `git revert -m 1 <merge-commit>`. PR1 revert re-exposes mayoristas crash. PR2/PR3 revert restores ES-only cart/checkout.

## Dependencies

- Parent `visual-frontend-audit` feature branch

## Success Criteria

- [ ] `/es/mayoristas`, `/en/mayoristas`, `/pt/mayoristas` render without crash
- [ ] CartDrawer shows locale-correct strings for ES/EN/PT
- [ ] CheckoutForm and OrderSummary show locale-correct strings for ES/EN/PT
- [ ] Zero hardcoded ES strings remain in CartDrawer, CheckoutForm, OrderSummary
- [ ] All 3 PRs under 400 lines each
- [ ] `npm run build` succeeds
