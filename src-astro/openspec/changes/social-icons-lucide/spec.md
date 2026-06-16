# Spec: social-icons-lucide

## Status

`completed`

---

## Overview

Replace 3 inconsistent inline SVG social icons (Instagram, Facebook, WhatsApp) in `Footer.astro` with consistent Phosphor React components.

---

## Context

- Previous problem: 3 inline SVGs with mixed styles (outline vs solid), different stroke weights, and misalignment
- Solution: Phosphor Icons (InstagramLogo, FacebookLogo, WhatsappLogo) with `weight="light"`

---

## Requirements

1. Install `phosphor-react` package
2. Replace Instagram SVG with `<InstagramLogo weight="light" class="w-6 h-6" color="currentColor" />`
3. Replace Facebook SVG with `<FacebookLogo weight="light" class="w-6 h-6" color="currentColor" />`
4. Replace WhatsApp SVG with `<WhatsappLogo weight="light" class="w-6 h-6" color="currentColor" />`
5. All 3 icons must share identical `class="w-6 h-6"` for consistent sizing
6. All 3 must use `weight="light"` for visual consistency
7. All 3 must use `color="currentColor"` for hover transitions
8. aria-label must be descriptive (e.g., "Ir a Instagram")

---

## Technical Notes

- Phosphor Icons use `weight` prop (not CSS stroke-width) to control line weight
- `weight="light"` ≈ 1.5px stroke — matches Leaf icon strokeWidth={1.5}
- No CSS `stroke-width` property used — Phosphor doesn't respond to it
- Import from 'phosphor-react' (not lucide-react for social icons)

---

## Files Affected

- `src/components/Footer.astro` — Replace 3 SVG blocks with Phosphor components

---

## Verification

1. Build produces 34 pages, 0 errors
2. All 3 social icons render with consistent weight and size
3. Hover transitions work via currentColor inheritance