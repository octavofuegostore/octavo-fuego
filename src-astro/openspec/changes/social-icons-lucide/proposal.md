# Proposal: social-icons-lucide

## Intent

Replace inconsistent inline SVG social icons (Instagram, Facebook, WhatsApp) in Footer.astro with Lucide React components to unify visual weight (strokeWidth=1.5), rendering style, and alignment. Contact icons above already use Lucide; social icons below are mismatched inline SVGs with mixed styles (Instagram outline, Facebook solid, WhatsApp heavy stroke).

## Scope

### In Scope
- Replace inline SVG for Instagram with `Lucide.Instagram` (`strokeWidth={1.5}`)
- Replace inline SVG for Facebook with `Lucide.Facebook` (`strokeWidth={1.5}`)
- Replace inline SVG for WhatsApp with `Lucide.WhatsApp` (`strokeWidth={1.5}`)
- Add `Instagram, Facebook, WhatsApp` to existing lucide-react import in Footer.astro
- Verify build: 34 pages, 0 errors

### Out of Scope
- Changes to contact icons (Mail, MessageCircle, MapPin, Leaf) — already Lucide
- Changes to icon sizing, color, or wrapper styles
- Changes to other components or pages

## Approach

1. Import `Instagram, Facebook, WhatsApp` from `lucide-react` alongside existing imports
2. Replace each inline `<svg>` block with equivalent `<Instagram|Facebook|WhatsApp>` component
3. Apply `strokeWidth={1.5}` and existing Tailwind classes (`w-6 h-6`) to all three
4. Run `astro build` to verify 34 pages, 0 errors

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/Footer.astro` | Modified | Replaces 3 inline SVGs with Lucide components |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Lucide icon shape differs from custom SVG | Low | Icons are standard brand icons; visual diff acceptable |
| Build error from React component usage in Astro | Low | Existing Lucide usage in same file confirms pattern works |

## Rollback Plan

Revert Footer.astro to previous state via git:
```bash
git checkout HEAD -- src/components/Footer.astro
```

## Dependencies

- `lucide-react` already installed and imported in Footer.astro

## Success Criteria

- [ ] Build completes: 34 pages, 0 errors
- [ ] Instagram, Facebook, WhatsApp render with `strokeWidth={1.5}`
- [ ] Visual consistency: all social icons same weight, same gap spacing
- [ ] No runtime console errors on footer render