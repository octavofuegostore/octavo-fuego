# Proposal: design-refresh-airbnb-style

## Intent
Refresh Octavo Fuego ecommerce design with Airbnb-inspired patterns: clean white canvas, 3-layer shadows, generous whitespace, consistent visual hierarchy.

## Scope
### In Scope
- Color tokens update (Verde Botánico #6d5e4d, Ceniza #7b8084, Near-black #222222)
- 3-layer shadow system for cards
- Border radius (20px cards, 8px buttons)
- Category pills (horizontal scroll)
- Typography with negative letter-spacing
- Micro-interactions (hover lifts, scale)

### Out of Scope
- Backend changes
- New features
- Data migrations

## Affected Areas
| Area | Impact |
|------|--------|
| src/styles/global.css | Modified |
| src/components/product/ProductCard.astro | Modified |
| src/components/ui/Button.astro | Modified |
| src/pages/tienda/index.astro | Modified |

## Risks
| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Shadow breaks existing components | Low | Test each component |
| Typography readability | Low | Verify line-height |

## Rollback Plan
Revert CSS changes from git. No data migration needed.

## Success Criteria
- [ ] Clean white design with Verde Botánico accents
- [ ] Consistent 3-layer shadows
- [ ] Category pills scroll horizontally
- [ ] Hover states work on all interactive elements
