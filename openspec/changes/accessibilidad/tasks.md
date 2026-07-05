# Tasks: Correcciones de Accesibilidad (a11y)

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~30-40 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | single-pr |

## Phase 1: ARIA Labels & Landmarks

- [x] 1.1 **Cart icon aria-label** — `Navbar.astro` (~89). Add `aria-label="Ver carrito de compras"` to `<a href="/carrito">`
- [x] 1.2 **LanguageSwitcher ARIA IDs duplicados** — `LanguageSwitcher.astro` + `Navbar.astro`. Add `suffix` prop; template IDs with `data-language-switcher` attribute; script rewritten to use `querySelectorAll('[data-language-switcher]')`. Navbar: mobile instance gets `suffix="-mobile"`.
- [ ] 1.3 **Consolidar**: verify no duplicate `id` violations via axe DevTools

## Phase 2: Heading Hierarchy

- [x] 2.1 **Footer h4→h2** — `Footer.astro` líneas 37, 56, 90. Changed 3 `<h4>` to `<h2>` (Productos, Ayuda, Conecta). Exact CSS classes preserved.
- [x] 2.2 **PaymentBanner h4→h2** — `PaymentBanner.astro` línea 65. Same fix for "Métodos de pago" heading.

## Phase 3: Color Contrast

- [x] 3.1 **Compra Protegida contraste** — `PaymentBanner.astro` ~82. Replaced `text-ceniza` with `text-[#4a4a4a]` (contrast ~7.5:1 on `--color-surface-warm`).
- [x] 3.2 **Token --ceniza insuficiente** — Evaluated: `--ceniza` (#6B6F73) on white bg = 4.88:1 ✅. Darkening globally risks contrast on darker surfaces. Decided: fix only specific instance (#3.1), keep global token unchanged.

## Phase 4: Alt Text Descriptivo

- [x] 4.1 **Productos alt text** — `[product].astro` (main image), `ProductCard.astro`, `RelatedProducts.astro`. Changed to `"Foto de Rapé {nombre}"` / `"Imagen de {nombre}"`.
- [x] 4.2 **Logo alt text** — `Navbar.astro`. Confirmed `alt="Octavo Fuego"` is sufficient as the primary site navigation link.
