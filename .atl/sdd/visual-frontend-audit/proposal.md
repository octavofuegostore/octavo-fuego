# Proposal: Visual Frontend Audit — E1 Remediation

## Intent

Llevar el frontend de 12→16+/20 en el UI Visual Audit, eliminando los 5 hallazgos P1 y 8 P2 detectados por impeccable antes de escalar el diseño.

## Scope

### In Scope (5 PRs encadenados)
- **PR 1 — Token unify + contrast**: Reemplazar 100+ usos de legacy tokens (`--ceniza`, `--near-black`, `bg-humo`, `text-papel`) por funcionales, fijar contraste WCAG AA en secondary text, unificar radius (admin 16px→20px o `--radius-card`)
- **PR 2 — Eyebrow removal**: Reemplazar `.section-label` (text-xs uppercase tracking) en 7 componentes por natural heading o inline label
- **PR 3 — Accessibility harden**: Skip-to-content link, focus-visible en Navbar, hero image eager loading
- **PR 4 — Performance + icons**: Google Fonts con preconnect+swap, admin inline SVGs → astro-icon, hardcoded hex en OG images
- **PR 5 — Dark mode foundation**: Implementar `.dark` variant sobre functional tokens (sin diseño completo dark mode)

### Out of Scope
- Diseño completo dark mode (solo infraestructura técnica)
- Rediseño visual del admin (solo token/radius fixes)
- glassmorphism, gradient text (anti-patrones no urgentes)
- lucide-react removal (ya no se usa)

## Capabilities

None — puro refactor técnico, sin nuevas funcionalidades.

## Approach

**Force-chained PRs contra `develop`, 400 líneas máx por PR.**

```
develop → feature/visual-frontend-audit/
  ├── PR 1: 01-token-unify-contrast   (~350 lines)
  ├── PR 2: 02-eyebrow-removal         (~250 lines)
  ├── PR 3: 03-a11y-harden             (~300 lines)
  ├── PR 4: 04-perf-icons              (~200 lines)
  └── PR 5: 05-dark-mode-foundation    (~300 lines)
```

Dependencias: PR 5 necesita PR 1 (functional tokens listos). PR 2/3/4 no dependen entre sí, pero se encadenan para evitar conflictos en `global.css` y Layout.astro.

Cada PR se verifica con `$impeccable audit` antes de mergear.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/styles/global.css` | Modified | Tokens, contrast, radius, dark mode vars |
| `src/layouts/*.astro` | Modified | Legacy tokens, skip-to-content, font loading |
| `src/components/tienda/*.astro` | Modified | Eyebrow removal, tokens |
| `src/components/prophecy/*.astro` | Modified | Eyebrow removal |
| `src/pages/[locale]/*.astro` | Modified | Legacy tokens → functional |
| `src/data/prophecy.ts` | No change | Already 3-locale |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Token replacement misses edge case | Med | `$impeccable audit` post-PR |
| Eyebrow removal changes layout | Low | Visual diff + `--impeccable audit` |
| Dark mode foundation invisible (no toggle) | Low | Documentado, toggle en futuro PR |

## Rollback

Por PR: `git revert` del merge commit. Los PRs son atómicos y cada uno cabe en un `git revert -m 1`.

## Success Criteria

- [ ] `$impeccable audit` score ≥ 16/20 post-chain
- [ ] WCAG AA secondary text contrast (≥4.5:1)
- [ ] Cero usos de `--ceniza`, `--near-black`, `--humo` en source
- [ ] Cero `.section-label` eyebrow en components/
- [ ] Skip-to-content + focus-visible operativos
- [ ] `.dark` variant funcional con tokens (toggle no requerido)
