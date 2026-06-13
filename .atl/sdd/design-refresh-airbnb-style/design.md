# Design: design-refresh-airbnb-style

## Architecture

### Design System Structure
```
global.css (tokens)
    ↓
components/ (use tokens)
    ↓
pages/ (compose components)
```

### Token Application
1. All tokens defined in `:root` of global.css
2. Components reference CSS variables
3. No hardcoded colors in components

---

## Implementation Approach

### Step 1: Update global.css
```css
:root {
  /* Colors */
  --white: #ffffff;
  --negro: #000000;
  --near-black: #222222;
  --tabaco: #8B4513;
  --ceniza: #7b8084;
  --humo: #2A2A2A;
  --papel: #F5F5F0;
  --verde-botanico: #6d5e4d;
  
  /* Shadows */
  --shadow-card: 
    rgba(0,0,0,0.02) 0px 0px 0px 1px,
    rgba(0,0,0,0.04) 0px 2px 6px,
    rgba(0,0,0,0.1) 0px 4px 8px;
  --shadow-hover: rgba(0,0,0,0.08) 0px 4px 12px;
  
  /* Radius */
  --radius-button: 8px;
  --radius-card: 20px;
  --radius-badge: 14px;
  --radius-pill: 20px;
  
  /* Typography */
  --font-display: 'Playfair Display', serif;
  --font-body: 'Inter', sans-serif;
}
```

### Step 2: Component Updates

**ProductCard.astro**
- Apply --shadow-card to card container
- Set border-radius: var(--radius-card)
- Add hover: translateY(-4px)
- Product image: aspect-ratio 1/1

**Button.astro**
- Primary: bg var(--near-black), hover bg var(--verde-botanico)
- Secondary: border 1px solid var(--near-black), ghost style
- Border-radius: var(--radius-button)

**CategoryPills**
- Horizontal scroll container
- Each pill: var(--radius-pill)
- Active state: bg var(--verde-botanico)

### Step 3: Page Updates

**Homepage**
- Clean white sections
- 32px+ vertical spacing between sections
- Photography as hero

**Tienda index**
- Category pills bar below header
- 4-column product grid
- Product cards with shadows

---

## File Changes

| File | Action | Changes |
|------|--------|---------|
| src/styles/global.css | Modify | Tokens + shadows |
| src/components/product/ProductCard.astro | Modify | Shadows, radius, hover |
| src/components/ui/Button.astro | Modify | Colors, radius, hover |
| src/components/CategoryPills.astro | Create | Pills component |
| src/pages/tienda/index.astro | Modify | Add pills, update grid |
| src/pages/index.astro | Modify | Whitespace, shadows |
