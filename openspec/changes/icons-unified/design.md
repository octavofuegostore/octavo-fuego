# Design: icons-unified

## Context

**Change**: Migrate all site icons from inline SVGs and mixed icon libraries to **Solar Bold-Duotone** (primary) + **Phosphor Duotone** (WhatsApp only).

**Previous phases**: proposal ✅, spec ✅ — design needed to resolve icon names, size consistency, and file inventory.

---

## Technical Approach

Use **Iconify** via `@iconify/react` or `astro-icon` integration. All icons rendered as React/Astro components with `weight="BoldDuotone"` prop for Solar icons. Replace inline SVGs and `lucide-react` imports with consistent Iconify component imports.

**Icon source mapping**:
| Usage | Library | Icon Name |
|-------|---------|-----------|
| Brand/UI icons | Solar | `solar:{name}-bold-duotone` |
| Social (WhatsApp) | Phosphor | `ph:whatsapp-logo-duotone` |

---

## Icon Name Decisions

### Priority 1 — Brand-Critical

| Current | Replacement | Rationale |
|---------|-------------|-----------|
| `lucide-react` Star | `solar:star-bold-duotone` | Solar has equivalent |
| `lucide-react` Shield | `solar:shield-bold-duotone` | Solar has equivalent |
| `lucide-react` Leaf | `solar:leaf-bold-duotone` | Solar has equivalent |
| `lucide-react` Droplets | `solar:droplet-bold-duotone` | Solar has equivalent |
| 5x inline SVGs (Intenciones) | `solar:{category}-{name}-bold-duotone` | Map each to Solar equivalent |

### Priority 2 — Brand-Visible

| Current | Replacement | Rationale |
|---------|-------------|-----------|
| Inline SVG hamburger | `solar:hamburger-menu-bold-duotone` | Clear naming |
| Inline SVG chevron | `solar:alt-arrow-down-bold-duotone` | Consistent with Solar patterns |
| Inline SVG globe | `solar:global-bold-duotone` | Solar global icon |
| Inline SVG chevron (LanguageSwitcher) | `solar:alt-arrow-down-bold-duotone` | Same as Navbar |

### Priority 3 — Optional

| Current | Replacement | Rationale |
|---------|-------------|-----------|
| Inline SVG WhatsApp | `ph:whatsapp-logo-duotone` | Solar lacks WhatsApp; Phosphor is brand-allowed |
| Cart utility (bin, plus, minus) | `solar:trash-bin-bold-duotone`, `solar:add-circle-bold-duotone`, `solar:minus-circle-bold-duotone` | If time permits |

---

## Size Consistency Decisions

| Location | Current | Decision | New Value |
|----------|---------|----------|-----------|
| Footer social icons | `w-7 h-7` (28px) | Keep as-is | 28px |
| Homepage Intenciones icons | `w-6 h-6` (24px) | **Upgrade** to match footer | **28px** |
| Navbar icons | `w-4` / `w-6` mixed | **Standardize** to `w-5 h-5` | **20px** |
| Testimonials stars | `w-7 h-7` in wrapper | Keep as-is | 28px |

**Rationale**: Footer 28px is "confirmed good." Intenciones at 24px felt small; 28px creates visual harmony. Navbar icons are functional (not decorative) so 20px is appropriate for density.

---

## Social/Brand Icons Decision

**WhatsApp button**: Use `ph:whatsapp-logo-duotone` (Phosphor Duotone) — NOT Solar.

**Rationale**: 
1. Solar doesn't include brand logos (WhatsApp, Instagram, Facebook)
2. Phosphor is already approved for this project
3. Phosphor Duotone weight matches Solar Bold-Duotone aesthetic
4. Consistent with footer social icons approach

**Instagram/Facebook**: If needed in future, use `ph:instagram-logo-duotone` / `ph:facebook-logo-duotone`.

---

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/components/tienda/Testimonials.astro` | Modify | Replace `lucide-react` Star → `solar:star-bold-duotone` |
| `src/pages/[locale]/index.astro` | Modify | Replace `lucide-react` Shield, Leaf, Droplets + 5 inline SVGs |
| `src/components/layout/Navbar.astro` | Modify | Replace hamburger + chevron inline SVGs |
| `src/components/layout/LanguageSwitcher.astro` | Modify | Replace globe + chevron inline SVGs |
| `src/components/whatsapp/WhatsAppButton.astro` | Modify | Replace inline WhatsApp SVG → `ph:whatsapp-logo-duotone` |
| `src/components/cart/*.astro` (if exists) | Modify | Replace utility SVGs (optional, P3) |

---

## Implementation Pattern

### For Solar Icons in Astro

```astro
---
// Option A: Inline Iconify (if using astro-icon)
import { Icon } from 'astro-iconify';
---

<!-- Usage -->
<Icon name="solar:star-bold-duotone" class="w-7 h-7" />

<!-- Option B: Direct component (if using @solar-icons/react or iconify/react) -->
import { Star } from '@phosphor-icons/react';
// Note: For Astro SSR, use /ssr entry point
---

<Star weight="bold-duotone" class="w-7 h-7" />
```

### For Phosphor Icons in Astro

```astro
---
import { WhatsAppLogo } from '@phosphor-icons/react';
---

<WhatsAppLogo weight="duotone" class="w-7 h-7" />
```

---

## Open Questions

| # | Question | Recommendation |
|---|----------|----------------|
| 1 | Cart/Checkout utility icons — implement P3? | Yes, if Task 3.1 completes quickly |
| 2 | Any icons missing from Solar catalog? | Verify against [iconify.design](https://iconify.design/icon-sets/solar/) before implementation |
| 3 | Dark mode — icon color inheritance? | Use `currentColor` and inherit from parent; Solar BD icons respond correctly to CSS color vars |

---

## Migration / Rollout

No data migration required. This is a pure visual refactor.

**Phased approach**:
1. Install icon dependencies (Solar + Phosphor packages)
2. Replace P1 icons (Testimonials, Confianza, Intenciones)
3. Replace P2 icons (Navbar, LanguageSwitcher)  
4. Replace P3 icons (WhatsApp, Cart) — if time permits
5. Build verification (34 pages, 0 errors)
6. Browser rendering check

---

## Testing Strategy

| Layer | What | How |
|-------|------|-----|
| Build | 34 pages, 0 errors | `npm run build` |
| Visual | Icons render correctly | Browser DevTools inspection |
| Dark mode | Icon colors inherit correctly | Toggle dark mode, verify `currentColor` |
| Responsive | Navbar/LangSwitcher icons at 20px | 375px viewport check |

---

## Dependencies to Add

```json
{
  "@solar-icons/react": "latest",  // or @solar-icons/react/ssr for Astro
  "@phosphor-icons/react": "latest"
}
```

Or if using `astro-icon` + Iconify API:
```bash
npm install astro-icon @iconify/solar @iconify/phosphor
```