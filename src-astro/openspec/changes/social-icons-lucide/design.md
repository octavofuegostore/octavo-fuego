# Design: social-icons-lucide

## Status

`completed`

---

## Overview

Replace 3 inline SVG social icons with Phosphor Icons for visual consistency.

---

## Technical Decisions

### 1. Library Choice: Phosphor Icons

Lucide does NOT provide Instagram, Facebook, or WhatsApp icons. Phosphor Icons was chosen over alternatives:

| Library | Instagram | Facebook | WhatsApp | Decision |
|---------|-----------|----------|----------|----------|
| Lucide | ❌ | ❌ | ❌ | Not available |
| Phosphor | ✅ InstagramLogo | ✅ FacebookLogo | ✅ WhatsappLogo | **CHOSEN** |
| Tabler | ✅ IconBrandInstagram | ✅ IconBrandFacebook | ✅ IconBrandWhatsapp | Alternative |
| Bootstrap | ✅ bi-instagram | ✅ bi-facebook | ✅ bi-whatsapp | Too heavy |

### 2. Weight: `weight="light"`

- Matches the editorial fineness of the site
- Equivalent to ~1.5px stroke (same as Leaf icon)
- Phosphor reacts only to native `weight` prop, NOT CSS `stroke-width`

### 3. Import Statement

```astro
import { InstagramLogo, FacebookLogo, WhatsappLogo } from 'phosphor-react';
```

### 4. Icon Implementation

Each icon follows the pattern:
```astro
<IconName weight="light" class="w-6 h-6" color="currentColor" />
```

- `class="w-6 h-6"` — CSS size control for bounding box alignment
- `color="currentColor"` — inherits text color, enables CSS hover transitions
- `weight="light"` — line weight control (Phosphor-native, not CSS)

### 5. aria-label

Updated from generic ("Instagram") to descriptive ("Ir a Instagram") for accessibility.

---

## Implementation Notes

### CSS Rules for Phosphor Icons

1. **NEVER use CSS `stroke-width`** — Phosphor ignores it
2. **Use `weight` prop** — "thin", "light", "regular", "bold", etc.
3. **Use `color="currentColor"`** — enables CSS color inheritance and transitions
4. **Use CSS `class` for sizing** — `w-6 h-6` controls bounding box

### Files Changed

- `src/components/Footer.astro` — 1 file, 2 changes (import + 3 icon replacements)

---

## Verification

- ✅ Build: 34 pages, 0 errors
- ✅ All 3 social icons use identical sizing (w-6 h-6)
- ✅ All 3 use weight="light" for consistent stroke
- ✅ All 3 use currentColor for hover transitions
- ✅ aria-label is descriptive