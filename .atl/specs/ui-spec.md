# SPEC: UI/UX Design System

## 1. PURPOSE

Sistema de diseño visual para Octavo Fuego - estética "Minimalist Sacred" que transmite: misterio, tierra, raíces, humo. Sin animaciones excesivas, sutil pero impactante.

---

## 2. COLOR SYSTEM

### 2.1 Primary Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `black` | #000000 | Fondos principales, texto |
| `white` | #FFFFFF | Texto sobre oscuro, fondos |
| `tabacco` | #8B4513 | CTAs, acentos, tierra |
| `ash` | #C0C0C0 | Textos secundarios |
| `smoke` | #2A2A2A | Cards, fondos suaves |
| `paper` | #F5F5F0 | Blog, contenido claro |

### 2.2 Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `success` | #22C55E | Confirmaciones |
| `error` | #EF4444 | Errores |
| `warning` | #F59E0B | Alertas |
| `whatsapp` | #25D366 | Botón flotante WhatsApp |

---

## 3. TYPOGRAPHY

### 3.1 Font Families

| Role | Font | Fallback |
|------|------|----------|
| Display/Headings | Playfair Display | serif |
| Body | Inter | sans-serif |

### 3.2 Type Scale

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 | 64px / 40px (mobile) | 700 | 1.1 |
| H2 | 48px / 32px (mobile) | 600 | 1.2 |
| H3 | 32px / 24px (mobile) | 600 | 1.3 |
| H4 | 24px / 20px (mobile) | 500 | 1.4 |
| Body | 18px / 16px (mobile) | 400 | 1.6 |
| Small | 14px | 400 | 1.5 |
| Caption | 12px | 400 | 1.4 |

---

## 4. SPACING SYSTEM

### 4.1 Base Unit: 4px

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | 4px |
| `space-2` | 8px | 8px |
| `space-3` | 16px | 16px |
| `space-4` | 24px | 24px |
| `space-6` | 32px | 32px |
| `space-8` | 48px | 48px |
| `space-12` | 64px | 64px |
| `space-16` | 96px | 96px |
| `space-24` | 128px | 128px |

---

## 5. COMPONENTS

### 5.1 Button

| Variant | Style |
|---------|-------|
| Primary | bg-tabacco, text-white, px-6 py-3 |
| Secondary/Ghost | border-tabacco, text-tabacco, transparent bg |
| Disabled | opacity-50, cursor-not-allowed |

### 5.2 Card (Product)

```
Borde: 1px solid #2A2A2A (smoke)
Hover: borde → #8B4513 (tabacco), sombra sutil
Radio: 0 (sin border-radius - cuadrado)
```

### 5.3 Input

```
Estilo: border-bottom only
Color: #C0C0C0 (ash)
Focus: border-bottom → #8B4513 (tabacco)
```

### 5.4 Modal/Dialog

```
Backdrop: black/50
Content: bg-white, shadow-xl
Close: X en esquina superior derecha
Animación: fade in 200ms
```

### 5.5 Tabs

```
Estilo: underline activo
Color activo: #8B4513 (tabacco)
Transición: opacity 200ms
```

---

## 6. ANIMATIONS

### 6.1 Allowed

| Animation | Usage | Duration |
|-----------|-------|----------|
| Fade in | Page load, modals | 200-400ms |
| Scroll reveal | Sections on scroll | 400ms ease-out |
| Hover scale | Buttons, cards | 1.02-1.05x, 300ms |
| Ring animation | WhatsApp button | 600ms |

### 6.2 Forbidden

- Parallax
- Bounce/elastic easing
- Continuous motion
- Complex choreography

---

## 7. LAYOUT SPECS

### 7.1 Container

```
Max width: 1280px
Padding: 24px (mobile), 48px (desktop)
Margin: auto (centrado)
```

### 7.2 Grid

```
Desktop: 12 columns, gap 24px
Tablet: 8 columns, gap 16px
Mobile: 4 columns, gap 12px
```

### 7.3 Navbar

```
Height: 80px (desktop), 64px (mobile)
Position: fixed
Background: transparent → white on scroll (backdrop blur)
```

---

## 8. MOBILE BREAKPOINTS

| Breakpoint | Width | Description |
|------------|-------|-------------|
| sm | 640px | Mobile landscape |
| md | 768px | Tablet |
| lg | 1024px | Desktop |
| xl | 1280px | Large desktop |

---

## 9. TRUST BADGES

| Badge | Icon | Text |
|-------|------|------|
| Autenticidad | 🔐 | "Origen certificado del Acre" |
| Origen Verdeado | 🌿 | "Cultivo sostenible" |
| Pureza Ritual | 💧 | "Empacado al vacío" |
