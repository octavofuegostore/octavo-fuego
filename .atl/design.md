# DESIGN: Octavo Fuego Ecommerce MVP

## Fuentes de Inspiración

### 1. WakingHerbs.com (https://www.wakingherbs.com)
Referencia principal para estética "botanical/ethnobotanical shop".

**Navbar (MEGA-MENU):**
- Selectores de moneda ($ € £) - **NO usar** (solo COP)
- "€30.91 left to free shipping" - **NO usar** (intrusivo)
- Mega-menu organizado con RAPÉ TRIBES por letras (A-K, M-Z)
- Logo centrado
- Links en minúsculas: about, blog, FAQ's, contact us, Log in
- **ADOPTAR**: Mega-menu por tribus, estructura limpia

**Hero:**
- Imagen izquierda (NO derecha como tenemos ahora)
- Texto a la derecha
- Título serif grande
- Subtítulo descriptivo
- CTA button
- **ADOPTAR CON EDICIÓN**: Imagen a la izquierda

**Footer:**
- Logo + tagline: "Together we gather nature's most beautiful gifts."
- 4-5 columnas de links
- Badges de trust (Reviews.io, Comodo)
- Payment methods icons
- Newsletter input
- Social links (Facebook, Instagram)
- **ADOPTAR**: Badges de trust, estructura de columnas

**Product Page:**
- Precio muy grande y prominente
- Tabs simples (underline, no bordes)
- Imagen grande clickeable
- **ADOPTAR**: Precio más grande

### 2. Airbnb Design System
Ya integrado en el sistema actual:
- 3-layer shadow system
- White-first design
- Photography-first
- Generous whitespace

---

## 1. Visual Theme & Atmosphere

Inspirado en Waking Herbs + Airbnb: Marketplace botánico cálido con estética de herboristería premium. Fondo blanco puro donde los productos son protagonistas.

**Filosofía:** "Medicina ancestral para el alma moderna" — cada producto debe sentirse como un descubrimiento sagrado, no una transacción.

---

## 2. Color Palette & Roles

### Color Palette & Roles

#### Migration: Descriptive → Functional (Híbrido)

| Token Anterior | Token Nuevo | Valor | Notas |
|---------------|-------------|-------|-------|
| `--verde-botanico` | `--tabaco-base` | `#6d5e4d` | **Rename semántico** — "verde" era mentira |
| — | `--color-action-primary` | `var(--tabaco-base)` | **Functional** — botón CTA, accents |
| — | `--color-action-hover` | `#5a4d3f` | **Functional** — hover de primary |
| — | `--color-action-subtle` | `#C4956A` | **Functional** — borders accent |
| `--color-humo` | `--color-surface-dark` | `#2A2A2A` | Renombrado funcional |
| `--color-papel` | `--color-surface-warm` | `#F5F5F0` | Renombrado funcional |

#### Sistema Híbrido (Backwards Compatible)
```css
--tabaco-base: #6d5e4d;                    /* Base real — único nombre correcto */
--verde-botanico: var(--tabaco-base);     /* @deprecated alias — mantener 0 breaking changes */
--color-action-primary: var(--tabaco-base); /* Functional — usar en nuevo código */
```

#### Tokens Funcionales Completos
```css
/* Superficie */
--color-surface-base: #ffffff;
--color-surface-warm: #F2EFE8;
--color-surface-dark: #2A2A2A;

/* Section backgrounds */
--color-footer-bg: #3D2E22;          /* Footer, secciones oscuras */

/* Texto */
--color-text-primary: #1C1410;      /* Headings */
--color-text-secondary: #8C8680;    /* Meta, subtitles */
--color-text-on-action: #F2EFE8;    /* Sobre action-primary */
--color-text-on-dark: #F2EFE8;      /* Sobre superficies oscuras */

/* Borde */
--color-border-default: #C4956A;
--color-border-subtle: #E8E0D5;
```

### Migration Path
1. **Fase 1** (ahora): Rename semántico + aliases — 0 breaking changes ✅
2. **Fase 2** (post-launch): Find-replace `--verde-botanico` → `--color-action-primary` en componentes
3. **Fase 3** (post-launch): Eliminar `--verde-botanico` alias cuando todos los usages estén migrados

### Brand Colors (Legacy — mantener暂时的)
| Token | Hex | Uso | Status |
|-------|-----|-----|--------|
| `--white` | #ffffff | Fondo principal, cards | ✅ |
| `--negro` | #000000 | Headings principales | ✅ |
| `--near-black` | #222222 | Texto body (cálido) | ✅ |
| `--tabaco` | #8B4513 | Acento ocasional | ✅ |
| `--ceniza` | #7b8084 | Textos secundarios, metadata | ✅ |
| `--humo` | #2A2A2A | Footer, elementos oscuros | ✅ → usar `--color-surface-dark` |
| `--papel` | #F5F5F0 | Secciones contrastadas | ✅ → usar `--color-surface-warm` |
| `--verde-botanico` | #6d5e4d | Acento principal | ⚠️ **DEPRECATED** — usar `--color-action-primary` o `--tabaco-base` |

### Icon System
- **Librería**: `astro-icon` + `@iconify-json/solar` + `@iconify-json/ph`
- **Uso**: `import { Icon } from 'astro-icon/components'` → `<Icon name="solar:icon-bold" class="w-7 h-7" />`
- **NO USAR**: `lucide-react` (bug SSR en Astro — no forwardea `class` prop)
- **Solar NO tiene**: droplet, spark, bag, brand logos — verificar en Iconify antes de usar

**Fondos claros → DUOTONE:**
- Iconos UI: Solar Bold-Duotone (letter, chat-round, map-point, shield, cloud-waterdrop, leaf, eye, lightning, heart, moon, star, etc.)
- Logos sociales: Phosphor Duotone (instagram-logo, facebook-logo, whatsapp-logo)

**Fondos oscuros → SÓLIDO:**
- Iconos UI: Solar Bold (letter-bold, chat-round-bold, map-point-bold, leaf-bold, shield-bold, cloud-waterdrop-bold)
- Logos sociales: Phosphor Fill (instagram-logo-fill, facebook-logo-fill, whatsapp-logo-fill)
- Aplicar `text-white` para máximo contraste

### Dark Sections (Junio 2026)
| Sección | Background | Icon Color | Text |
|---------|-----------|------------|------|
| Footer | `--color-footer-bg` (#3D2E22) | white sólido | `--color-text-on-dark` |
| Trust Badges | `--color-action-hover` (#5a4d3f) | white sólido | `--color-text-on-dark`/80 |

### Semantic Colors
| Token | Hex | Uso |
|-------|-----|-----|
| `--whatsapp` | #25D366 | Botón WhatsApp |
| `--success` | #22C55E | Estados éxito |
| `--error` | #EF4444 | Estados error |
| `--warning` | #F59E0B | Estados warning |

---

## 3. Typography Rules

### Font Families
- **Display/Headings**: `Playfair Display`, serif — elegancia ancestral
- **Body/UI**: `Inter`, sans-serif — legibilidad moderna

### Hierarchy
| Role | Font | Size | Weight | Line Height | Letter Spacing |
|------|------|------|--------|-------------|----------------|
| H1 (Hero) | Playfair | 56px | 700 | 1.1 | -0.02em |
| H2 (Section) | Playfair | 40px | 700 | 1.2 | -0.02em |
| H3 (Card) | Playfair | 24px | 600 | 1.3 | -0.01em |
| H4 (Product) | Inter | 18px | 600 | 1.4 | -0.44px |
| H5 (Meta) | Inter | 12px | 500 | 1.5 | 0.05em |
| Body | Inter | 16px | 400 | 1.6 | normal |

---

## 4. Component Specifications

### Navbar (WAKING HERBS STYLE)
**Estructura:**
- Top bar: (sin selectores de moneda - solo COP)
- Logo: Centrado
- Mega-menu RAPÉ:
  - RAPÉ TRIBES A-K (Apurina, Arara, Huitoto, Kamanagua, etc.)
  - RAPÉ TRIBES M-Z (Nukini, Piaroa, Shawandawa, etc.)
  - HOME MADE BLENDS
  - amasing rapes
  - Master Rapé Collection
  - MAPACHO FREE
- Links: about, blog, FAQ's, contacto (minúsculas)
- Cart icon a la derecha

**Lo que NO usamos:**
- ❌ Selectores $ € £
- ❌ "left to free shipping"
- ❌ Mayúsculas en links

### Hero Section (EDITADO)
**Layout: IMAGEN IZQUIERDA (como Waking Herbs, NO derecha)**
```
[Imagen 50%] | [Texto 50%]
  Grande         H1 Título
  Bobinsana      Subtítulo
                 CTA button
```

### Medicine Card (Airbnb Style)
- Background: #ffffff
- Radius: 20px
- Shadow: 3-layer Airbnb system
- Image: 1:1 ratio

### Footer (WAKING HERBS STYLE)
- Logo + tagline: "Juntxs recolectamos los regalos más bellos de la naturaleza."
- 4 columnas:
  1. Productos (Rapé, Sananga, Kuripes)
  2. Información (Nosotros, Blog, FAQ, Contacto)
  3. Cuenta (Mi cuenta, Pedidos)
  4. Legal (Términos, Privacidad)
- Badges: Trust (reviews), Security (SSL)
- Payment icons
- Newsletter input
- Social: Facebook, Instagram

---

## 5. Shadow System (3-Layer Airbnb)

```css
--shadow-card:
  rgba(0,0,0,0.02) 0px 0px 0px 1px,
  rgba(0,0,0,0.04) 0px 2px 6px,
  rgba(0,0,0,0.1) 0px 4px 8px;
```

---

## 6. Border Radius

| Element | Radius |
|---------|--------|
| Buttons | 8px |
| Cards | 20px |
| Badges | 14px |
| Pills | 20px |

---

## 7. Responsive Breakpoints

| Name | Width | Columns |
|------|-------|---------|
| Mobile | <640px | 1 |
| Tablet | 640-1024px | 2 |
| Desktop | 1024-1280px | 3-4 |

---

## 8. To-Do (Próximos Cambios)

### Implementar después
- [ ] Mega-menu navbar estilo Waking Herbs
- [ ] Hero con imagen a la izquierda
- [ ] Footer estilo Waking Herbs con badges
- [ ] Precio más grande en PDP

---

## 9. Design Files Reference

**Imágenes de productos:**
- Rape: `/images/productos/rape/bobinsana-rape-2.webp`
- Kuripes: `/images/productos/kuripes/Hauxhaux_Kuripe_001_B.jpg`
