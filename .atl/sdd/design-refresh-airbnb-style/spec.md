# Spec: design-refresh-airbnb-style

## 1. Color Palette

### Brand Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--white` | #ffffff | Fondo principal, cards |
| `--negro` | #000000 | Headings principales |
| `--near-black` | #222222 | Texto body (cálido) |
| `--tabaco` | #8B4513 | Acento secundario |
| `--ceniza` | #7b8084 | Textos secundarios, metadata |
| `--humo` | #2A2A2A | Footer, elementos oscuros |
| `--papel` | #F5F5F0 | Secciones contrastadas |
| `--verde-botanico` | #6d5e4d | Acento principal |

### Semantic
| Token | Hex | Usage |
|-------|-----|-------|
| `--whatsapp` | #25D366 | Botón WhatsApp |
| `--success` | #22C55E | Éxito |
| `--error` | #EF4444 | Error |
| `--warning` | #F59E0B | Warning |

### Text Scale
| Token | Hex | Usage |
|-------|-----|-------|
| `--text-primary` | #222222 | Body principal |
| `--text-secondary` | #6a6a6a | Descripciones |
| `--text-muted` | #7b8084 | Labels, hints |

---

## 2. Shadow System (3-Layer Airbnb)

```css
--shadow-card:
  rgba(0,0,0,0.02) 0px 0px 0px 1px,
  rgba(0,0,0,0.04) 0px 2px 6px,
  rgba(0,0,0,0.1) 0px 4px 8px;

--shadow-hover: rgba(0,0,0,0.08) 0px 4px 12px;
```

| Layer | Opacity | Use |
|-------|---------|-----|
| 1 | 0.02 | Ultra-subtle border |
| 2 | 0.04 | Soft ambient |
| 3 | 0.1 | Primary lift |

---

## 3. Border Radius

| Token | Value | Use |
|-------|-------|-----|
| `--radius-button` | 8px | Buttons |
| `--radius-card` | 20px | Cards |
| `--radius-badge` | 14px | Badges |
| `--radius-pill` | 20px | Pills/filters |

---

## 4. Typography

### Font Families
- **Display**: Playfair Display, serif
- **Body**: Inter, sans-serif

### Hierarchy
| Role | Font | Size | Weight | Line | Tracking |
|------|------|------|--------|-------|----------|
| H1 | Playfair | 56px | 700 | 1.1 | -0.02em |
| H2 | Playfair | 40px | 700 | 1.2 | -0.02em |
| H3 | Playfair | 24px | 600 | 1.3 | -0.01em |
| H4 | Inter | 18px | 600 | 1.4 | -0.44px |
| H5 | Inter | 12px | 500 | 1.5 | 0.05em |
| Body | Inter | 16px | 400 | 1.6 | normal |
| Small | Inter | 14px | 400 | 1.5 | normal |

---

## 5. Component Specifications

### Medicine Card
- Background: #ffffff
- Radius: 20px
- Shadow: --shadow-card
- Image: 1:1 ratio, top radius 20px
- Hover: translateY(-4px), 200ms ease-out

### Primary Button
- Background: #222222
- Text: #ffffff
- Radius: 8px
- Padding: 16px 32px
- Hover: background #6d5e4d

### Category Pills
- Background: #ffffff
- Border: 1px solid #e5e5e5
- Radius: 20px
- Padding: 8px 16px
- Active: background #6d5e4d, text #ffffff

### Input
- Background: #ffffff
- Border: 1px solid #e5e5e5
- Radius: 8px
- Focus: ring 2px #6d5e4d

---

## 6. Spacing (Base 8px)

| Token | Value |
|-------|-------|
| --space-1 | 4px |
| --space-2 | 8px |
| --space-4 | 16px |
| --space-6 | 24px |
| --space-8 | 32px |
| --space-12 | 48px |
| --space-16 | 64px |

---

## 7. Responsive Breakpoints

| Name | Width | Columns |
|------|-------|---------|
| Mobile | <640px | 1 |
| Tablet | 640-1024px | 2 |
| Desktop | 1024-1280px | 3-4 |
| Large | >1280px | 4 |

---

## 8. Micro-interactions

### Card Hover
```css
.card:hover {
  transform: translateY(-4px);
  transition: transform 200ms ease-out;
}
```

### Card Active
```css
.card:active {
  transform: scale(0.98);
}
```

### Button Hover
```css
.btn-primary:hover {
  background-color: #6d5e4d;
  transition: background-color 200ms ease-out;
}
```
