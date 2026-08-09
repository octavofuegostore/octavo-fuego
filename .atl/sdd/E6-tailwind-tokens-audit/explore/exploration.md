## Exploration: Tailwind & Design Tokens Audit

### Current State

The project uses a **hybrid token system**:

1. **`@theme` block** in `global.css` — defines Tailwind-compatible color tokens (`--color-tabaco`, `--color-humo`, `--color-papel`, `--color-ceniza`, `--color-white`, `--color-black`)
2. **`:root` custom properties** — functional tokens (`--color-action-primary`, `--color-surface-*`, `--color-text-*`, `--color-border-subtle`) plus legacy shorthands (`--near-black`, `--ceniza`, `--tabaco-base`, `--color-footer-bg`)
3. **Dual usage pattern** — some components use Tailwind utility classes (`bg-humo`, `text-tabaco`), others use `var()` references (`var(--color-action-primary)`), and some use both

---

### Issues Per Category

#### 1. Functional Token Adoption — Score: 4/10

| Token | Defined | Used in Templates | Verdict |
|-------|---------|-------------------|---------|
| `--color-action-primary` | ✅ | ~100+ hits | 🟢 Excellent |
| `--color-action-hover` | ✅ (`#5a4d3f`) | ~5 CTA buttons | 🟡 Underutilized |
| `--color-action-subtle` | ✅ (`#C4956A`) | 0 — only via `--color-border-subtle` alias | 🔴 Dead token (replaced by `--color-border-subtle`) |
| `--color-surface-base` | ✅ (`#ffffff`) | 0 | 🔴 Defined, NEVER used |
| `--color-surface-warm` | ✅ (`#F2EFE8`) | ~6 hits (Footer, terms) | 🟡 Low adoption |
| `--color-surface-dark` | ✅ (`#2A2A2A`) | 0 | 🔴 Defined, NEVER used |
| `--color-text-primary` | ✅ (`#1C1410`) | 0 | 🔴 Defined, NEVER used |
| `--color-text-secondary` | ✅ (`#8C8680`) | 0 | 🔴 Defined, NEVER used |
| `--color-text-on-action` | ✅ (`#F2EFE8`) | ~6 hits (product detail) | 🟡 Limited adoption |
| `--color-text-on-dark` | ✅ (`#F2EFE8`) | ~5 hits (Trust Badges, mayoristas) | 🟡 Limited adoption |
| `--color-border-subtle` | ✅ (`#C4956A`) | ~19 hits | 🟢 Good adoption |
| `--color-footer-bg` | ✅ (`#1A1A1A`) | **0** | 🔴 Dead token — Footer uses `--color-surface-warm` instead |

#### 2. Deprecated / Legacy Tokens — Score: 3/10

- **`--tabaco`** (deprecated → `--color-tabaco`): Used **extensively** via Tailwind classes `text-tabaco`, `bg-tabaco`, `border-tabaco` in AdminLayout.astro, Footer.astro, CartDrawer.tsx, Navbar.astro, and blog pages. **This is the #1 migration task.**
- **`--color-tabacco`** (misspelled alias): The alias is defined in `global.css` as deprecated, but **blog/index.astro** uses `hover:border-tabacco` (the misspelling).
- **`--tabaco-base`**: Internal base variable used directly as `var(--tabaco-base)` in **mayoristas.astro** (10 instances) **and** `[locale]/mayoristas.astro` (10 instances) — should use `--color-action-primary` instead.
- **`--verde-botanico`**: **Clean** — 0 occurrences. ✅

#### 3. Legacy `var()` Still Widespread — Score: 4/10

| Legacy Token | Functional Replacement | Usage Count |
|---|---|---|
| `var(--papel)` | `--color-surface-warm` | ~20 hits (HomeContent, ProductCard, FAQ, QuickReference, etc.) |
| `var(--ceniza)` | `--color-text-secondary` | 100+ hits (all public pages) |
| `var(--near-black)` | `--color-text-primary` | 100+ hits (all headings/body text) |
| `var(--humo)` | `--color-surface-dark` | 1 hit (SeoContentBlocks.astro) |

**Problem**: The legacy and functional values are NOT identical:
- `--color-ceniza` (via `@theme`): `#6B6F73`
- `--color-text-secondary`: `#8C8680`
- Hardcoded `#5C6063` in Footer — **third gray value**
- `--near-black`: `#222222`
- `--color-text-primary`: `#1C1410`

#### 4. Hardcoded Hex Colors — Score: 5/10

| Hex | Location | Should Be |
|-----|----------|-----------|
| `#5C6063` | Footer.astro (4× — legal text, copyright) | A token (closest: `--ceniza` or `--color-text-secondary`) |
| `#25D366` | blog/[slug].astro, checkout (WhatsApp buttons, 4×) | Should use `--color-whatsapp` (already defined!) |
| `#333333` | HomeContent.astro (SEO text block) | `--color-text-primary` |
| `#4a4a4a` | PaymentBanner.astro | `--color-text-secondary` |
| `#fafafa` | Glossary.astro section background | `--color-surface-warm` |

#### 5. Tailwind Utility Gray Classes vs Tokens — Score: 4/10

The AdminLayout correctly uses Tailwind color tokens (`bg-humo`, `text-papel`, `bg-tabaco`). But **public pages heavily use raw gray utilities** without token equivalents:

- `border-gray-200` — ~30+ hits (table rows, dividers, cards)
- `border-gray-100` — row borders, subtle dividers
- `bg-gray-100` — progress bars, status badges, product card background
- `text-gray-300` — star ratings (ReviewModal)
- `hover:bg-gray-50` — dropdown items, hover states
- `hover:bg-gray-100` — button hover states

**No border functional token exists.** `--color-border-subtle` (`#C4956A`) is an accent border, not a generic gray border. Consider adding `--color-border-default: #E5E5E5` (the current `:root` uses `--border: #E5E5E5` for shadcn).

#### 6. Footer & Dark Sections — Score: 5/10

- **Footer**: Uses `bg-[var(--color-surface-warm)]` (light beige background). The `--color-footer-bg: #1A1A1A` token is **dead code**. This contradicts the archived ADR which specified `--color-footer-bg: #3D2E22` with a dark footer design.
- **Trust Badges** (HomeContent): Uses `bg-[var(--color-action-hover)]` (dark `#5a4d3f`) with `text-white` for headings and `var(--color-text-on-dark)` for body — ✅ **Correct pattern**.
- **SeoContentBlocks "not-for-you" box**: Uses `bg-[var(--humo)]` — should use `--color-surface-dark`.

---

### Summary Score

| Category | Score |
|----------|-------|
| 1. Functional Token Adoption | 4/10 |
| 2. Deprecated Token Cleanup | 3/10 |
| 3. Legacy var() Migration | 4/10 |
| 4. Hardcoded Hex Values | 5/10 |
| 5. Gray Classes vs Tokens | 4/10 |
| 6. Footer/Dark Sections | 5/10 |
| **Overall** | **4.2/10** |

### Affected Areas

- `src/styles/global.css` — Defines all tokens; dead tokens `--color-surface-base`, `--color-surface-dark`, `--color-text-primary`, `--color-text-secondary`, `--color-action-subtle`, `--color-footer-bg` need decisions
- `src/layouts/AdminLayout.astro` — Heavy `text-tabaco`/`bg-tabaco` usage (should migrate to `--color-action-primary`)
- `src/components/Footer.astro` — `text-tabaco` everywhere, hardcoded `#5C6063`, uses surface-warm instead of footer-bg
- `src/components/home/HomeContent.astro` — Trust Badges are correct, but SEO block has hardcoded `#333333`
- `src/pages/mayoristas.astro` / `[locale]/mayoristas.astro` — 10× `var(--tabaco-base)` direct usage
- `src/pages/blog/index.astro` — `hover:border-tabacco` misspelling
- `src/components/tienda/QuickReferenceTable.astro` — Good token usage overall, uses `var(--ceniza)` and `var(--near-black)` (legacy but consistent)
- `src/components/PaymentBanner.astro` — Hardcoded `#4a4a4a`

### Approaches

1. **Gradual Migration (Low risk, ~3 sprints)** — Create a token migration map, fix one category per sprint: (a) hardcoded hex → tokens, (b) legacy var() → functional tokens, (c) deprecated Tailwind classes
   - Pros: Low risk, team can work incrementally, no regressions
   - Cons: Token system stays messy for longer
   - Effort: Medium

2. **Batch Fix (Medium risk, ~1 sprint)** — Replace ALL legacy `var(--ceniza)` → `var(--color-text-secondary)` and `var(--papel)` → `var(--color-surface-warm)` across the entire codebase in one pass
   - Pros: Fast cleanup, single atomic change
   - Cons: **Values differ** — `#6B6F73` vs `#8C8680` and `#F5F5F0` vs `#F2EFE8`. Would cause visual drift. Requires design sign-off.
   - Effort: Medium

3. **Align Values First, Then Rename** — Step 1: Make `--color-text-secondary` = `#6B6F73` (match legacy `--ceniza`) and `--color-surface-warm` = `#F5F5F0` (match legacy `--papel`). Step 2: Mass-replace. Step 3: Eliminate legacy aliases.
   - Pros: Zero visual drift, can batch rename after alignment
   - Cons: Two-phase approach takes discipline
   - Effort: Medium

4. **Do Nothing / Document Only** — Accept the hybrid system, only enforce tokens for NEW code via code review
   - Pros: Zero dev time
   - Cons: Debt grows, inconsistency persists, harder to theme later
   - Effort: None

### Recommendation

**Approach 3 (Align Values First, Then Rename)** — It's the only option that gives zero visual drift AND a clean token system. Without aligning values first, any migration changes the look of the site.

Concrete plan:
1. **Align values**: Change `--color-text-secondary` from `#8C8680` → `#6B6F73` (match `--ceniza`), change `--color-surface-warm` from `#F2EFE8` → `#F5F5F0` (match `--papel`)
2. **Fix dead tokens**: Either remove `--color-footer-bg` or make the footer actually use it; remove `--color-surface-base`, `--color-surface-dark`, `--color-text-primary` if unused after alignment
3. **Mass-replace legacy `var()` references** with their functional equivalents (same value = safe rename)
4. **Fix hardcoded hex**: `#5C6063` → `--color-text-secondary`, `#25D366` → `--color-whatsapp`, `#333333` → `--color-text-primary`
5. **Deprecate Tailwind legacy classes**: Add code review rule: no new `text-tabaco`, `bg-tabaco`, `border-gray-*` in public components

### Risks

- **Visual drift**: Aligning `--color-text-secondary` from `#8C8680` to `#6B6F73` makes secondary text ~15% darker. This needs design validation.
- **Scope creep**: 40+ files affected across the entire codebase. The batch rename touches almost every `.astro` file.
- **`border-gray-*` replacements**: No functional token for generic borders exists, so those can't be migrated until a `--color-border-default` token is defined and approved.
- **AdminPanel uses `bg-humo`/`text-tabaco` Tailwind classes directly** — those map to `@theme` tokens (`--color-humo: #2A2A2A`, `--color-tabaco: #6d5e4d`), not functional tokens. To migrate admin to functional tokens, you'd need to add `--color-surface-dark: #2A2A2A` and update the Tailwind class references — but `--color-surface-dark` is already defined with the same value. It's just not used.

### Ready for Proposal

Yes. The orchestrator should propose E6 as a **two-phase cleanup**: align values first, then batch rename. Decision needed from design on the `--color-text-secondary` value change (`#8C8680` → `#6B6F73` — ~15% darker). Everything else is mechanical.
