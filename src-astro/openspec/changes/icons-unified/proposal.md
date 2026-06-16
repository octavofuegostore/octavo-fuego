# Proposal: icons-unified

## Intent

Unify ALL icons across the site under a single design system: **Solar Bold-Duotone** for UI icons and **Phosphor Duotone** for brand logos. The current state mixes lucide-react (broken in SSR) and inline SVGs of mixed style, producing inconsistent rendering and a broken star rating in Testimonials.astro.

## Scope

### In Scope
- Replace lucide-react `Star` in `Testimonials.astro` with `solar:star-stars-bold-duotone`
- Replace lucide-react `Shield`, `Leaf`, `Droplets` in homepage `index.astro` Confianza section with Solar Bold-Duotone equivalents
- Replace 5 inline SVGs in homepage `index.astro` Intenciones section with Solar Bold-Duotone equivalents
- Replace 3 inline SVGs in `Navbar.astro` (chevron, hamburger) with Solar Bold-Duotone
- Replace 2 inline SVGs in `LanguageSwitcher.astro` (globe, chevron) with Solar Bold-Duotone
- Replace inline WhatsApp SVG in `FloatingWhatsApp.astro` with Solar Bold-Duotone

### Out of Scope
- Utility icons in Cart/Checkout/Product pages (Priority 3 — deferred)
- Changes to Footer (already resolved per audit)
- Any CSS or design token changes

## Capabilities

### New Capabilities
- None — this is a refactor with no new behavior

### Modified Capabilities
- `icon-system`: Update icon library contract from mixed (lucide-react + inline SVG) to Solar Bold-Duotone + Phosphor Duotone

## Approach

1. Audit each affected file to map existing icon usage to Solar Bold-Duotone equivalents via `@iconify-json/solar`
2. Replace lucide-react imports (which lose `class` forwarding in Astro SSR) with `astro-icon` `<Icon>` components using `solar:*` set
3. Replace inline SVGs with equivalent `astro-icon` components — Solar icons use `currentColor` and duotone opacity, requiring no CSS changes
4. No build or deploy changes required; icons inherit text color from parent

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/tienda/Testimonials.astro` | Modified | Star rating: lucide → solar |
| `src/pages/[locale]/index.astro` | Modified | Confianza + Intenciones sections: lucide/inline → solar |
| `src/components/Navbar.astro` | Modified | Chevron, hamburger: inline SVG → solar |
| `src/components/LanguageSwitcher.astro` | Modified | Globe, chevron: inline SVG → solar |
| `src/components/ui/FloatingWhatsApp.astro` | Modified | WhatsApp logo: inline SVG → solar |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Solar icon not available for a specific shape | Low | Fall back to inline SVG matching Solar's 2px stroke style |
| SSR class-forwarding bug not fully resolved | Low | Verify `astro-icon` renders correctly via `astro build` |

## Rollback Plan

Revert each file to its pre-change state via `git checkout`. No schema, data migration, or deployment rollback needed — pure frontend refactor.

## Dependencies

- `@iconify-json/solar` (already installed)
- `@iconify-json/ph` (already installed)
- `astro-icon` (already installed)

## Success Criteria

- [ ] `astro build` completes with zero errors
- [ ] Testimonials star rating renders with duotone styling (not monochrome)
- [ ] All Solar icons inherit `currentColor` from parent elements
- [ ] No lucide-react imports remain in affected files
- [ ] No inline SVG tags remain in Navbar, LanguageSwitcher, or FloatingWhatsApp