# Octavo Fuego - Wireframes y Arquitectura Visual
## Guía de Diseño UX/UI para Desarrollo

---

**Versión**: 1.0  
**Fecha**: Abril 2026  
**Estilo Visual**: Minimalista B&W + Tabaco + Ceniza  
**Referencia**: Elegancia chamánica, mística accesible

---

## 🎨 SISTEMA DE DISEÑO

### Paleta de Colores

| Nombre | Hex | Uso |
|--------|-----|-----|
| **Negro Puro** | `#000000` | Fondos principales, texto, misterio |
| **Blanco** | `#FFFFFF` | Texto sobre fondo oscuro, espacios |
| **Tabaco** | `#8B4513` | Acentos, CTAs, calidez, tierra |
| **Ceniza** | `#C0C0C0` | Textos secundarios, sutilezas, hover |
| **Humo** | `#2A2A2A` | Fondos secundarios, cards |
| **Papel** | `#F5F5F0` | Fondos claros (blog, contenido largo) |

### Tipografía

| Uso | Fuente | Peso | Tamaño |
|-----|--------|------|--------|
| **H1 - Hero** | Playfair Display | 700 | 64px (desktop) / 40px (mobile) |
| **H2 - Secciones** | Playfair Display | 600 | 48px / 32px |
| **H3 - Subtítulos** | Inter | 600 | 32px / 24px |
| **Body** | Inter | 400 | 18px / 16px |
| **Small/Caption** | Inter | 400 | 14px / 12px |
| **CTA** | Inter | 600 | 16px / 14px |

### Espaciado

```
--space-xs: 4px
--space-sm: 8px
--space-md: 16px
--space-lg: 32px
--space-xl: 64px
--space-2xl: 128px
```

### Componentes Base

#### Botones

```
PRIMARY (Tabaco):
- Background: #8B4513
- Text: #FFFFFF
- Padding: 16px 32px
- Border-radius: 0 (cuadrado)
- Hover: darken 10% + scale 1.02

SECONDARY (Outline):
- Background: transparent
- Border: 2px solid #FFFFFF
- Text: #FFFFFF
- Padding: 14px 30px
- Hover: Background #FFFFFF, Text #000000

GHOST:
- Background: transparent
- Text: #FFFFFF
- Padding: 12px 24px
- Hover: Text #C0C0C0
```

#### Cards de Producto

```
- Background: #2A2A2A
- Border: 1px solid #3A3A3A
- Border-radius: 0
- Padding: 0
- Image: aspect-ratio 1:1
- Hover: border-color #8B4513, shadow-lg
```

#### Inputs

```
- Background: transparent
- Border-bottom: 2px solid #C0C0C0
- Text: #FFFFFF
- Padding: 12px 0
- Focus: border-color #8B4513
- Placeholder: #C0C0C0
```

---

## 📱 WIREFRAMES DE PÁGINAS

### 1. HOMEPAGE

#### Estructura General

```
┌─────────────────────────────────────────┐
│  HEADER (fijo, transparente → solid)   │
│  [Logo]        [Nav]        [Cart 🛒]  │
├─────────────────────────────────────────┤
│                                         │
│  HERO SECTION                           │
│  ┌─────────────────────────────────┐   │
│  │  [Imagen full-width oscura]     │   │
│  │                                 │   │
│  │  "Enciende tu Octavo Fuego"     │   │
│  │  Subtítulo poético              │   │
│  │  [Descubrir la Medicina →]      │   │
│  │                                 │   │
│  │  [Scroll indicator ↓]           │   │
│  └─────────────────────────────────┘   │
│                                         │
│  PROFECÍA SECTION (bkg: black)          │
│  ┌─────────────────────────────────┐   │
│  │  "En tiempos del Séptimo..."    │   │
│  │  [Quote de la profecía]         │   │
│  │  [Leer la historia completa →]  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  PRODUCTOS DESTACADOS                   │
│  ┌─────────────────────────────────┐   │
│  │  [Card] [Card] [Card] [Card]    │   │
│  │  Producto 1  |  Producto 2...   │   │
│  │                                 │   │
│  │  [Ver todos los productos →]    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  LA HISTORIA (split 50/50)              │
│  ┌──────────────────┬──────────────┐   │
│  │                  │              │   │
│  │  [Imagen selva   │  "No solo    │   │
│  │   o ceremonia]   │   vendemos   │   │
│  │                  │   medicinas" │   │
│  │                  │              │   │
│  │                  │  [Conócenos] │   │
│  └──────────────────┴──────────────┘   │
│                                         │
│  COMUNIDAD (testimonios)                │
│  ┌─────────────────────────────────┐   │
│  │  "Lo que dice la tribu"         │   │
│  │                                 │   │
│  │  [Avatar] "El rapé cambió..."   │   │
│  │  [Avatar] "Calidad increíble"   │   │
│  │  [Avatar] "Servicio excepcional"│   │
│  └─────────────────────────────────┘   │
│                                         │
│  EDUCACIÓN (bkg: Humo #2A2A2A)          │
│  ┌─────────────────────────────────┐   │
│  │  Aprende con nosotros           │   │
│  │  [Blog post 1] [Blog post 2]    │   │
│  │  [Blog post 3]                  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  NEWSLETTER (bkg: Tabaco #8B4513)      │
│  ┌─────────────────────────────────┐   │
│  │  "Únete a la comunidad"         │   │
│  │  [Email input    ] [Suscribir]  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  FOOTER                                 │
│  ┌─────────────────────────────────┐   │
│  │  [Logo]                         │   │
│  │  Productos | Nosotros | Blog    │   │
│  │  IG | FB | WhatsApp             │   │
│  │  © 2026 Octavo Fuego            │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

#### Hero Section Detalle

```
┌──────────────────────────────────────────┐
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓                                    ▓▓▓▓│
│▓▓▓▓  ENCINDE TU                        ▓▓▓▓│
│▓▓▓▓  OCTAVO FUEGO                      ▓▓▓▓│
│▓▓▓▓                                    ▓▓▓▓│
│▓▓▓▓  Rapé do Acre - Medicinas          ▓▓▓▓│
│▓▓▓▓  ancestrales con propósito         ▓▓▓▓│
│▓▓▓▓                                    ▓▓▓▓│
│▓▓▓▓  [Descubrir la Medicina →]         ▓▓▓▓│
│▓▓▓▓                                    ▓▓▓▓│
│▓▓▓▓         ↓                          ▓▓▓▓│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
└──────────────────────────────────────────┘

Imagen: Fotografía de selva amazónica al amanecer o 
        ceremonia con humo, overlay negro 60% opacidad
Tipografía: H1 - Playfair Display 64px, peso 700, blanco
Subtítulo: Inter 20px, peso 400, ceniza (#C0C0C0)
CTA: Botón Primary (Tabaco), flecha derecha icon
```

---

### 2. PÁGINA DE PRODUCTO

#### Estructura

```
┌─────────────────────────────────────────┐
│  HEADER                                 │
├─────────────────────────────────────────┤
│                                         │
│  BREADCRUMBS                            │
│  Inicio > Productos > Rapé > Yawanawa  │
│                                         │
│  PRODUCTO (2 columnas desktop)          │
│  ┌──────────────────┬────────────────┐ │
│  │                  │                │ │
│  │  [Imagen         │  RAPÉ          │ │
│  │   principal]     │  YAWANAWA 10G  │ │
│  │                  │                │ │
│  │  [Thumbs] [T] [T]│  ★★★★★ 4.8    │ │
│  │                  │                │ │
│  │                  │  $75.000 COP   │ │
│  │                  │                │ │
│  │                  │  Variedad de   │ │
│  │                  │  la etnia      │ │
│  │                  │  Yawanawa del  │ │
│  │                  │  Acre, Brasil. │ │
│  │                  │  Equilibrado   │ │
│  │                  │  y de fuerza   │ │
│  │                  │  media.        │ │
│  │                  │                │ │
│  │                  │  Cantidad: [-]1[+]│ │
│  │                  │                │ │
│  │                  │  [Añadir al    │ │
│  │                  │   Carrito]     │ │
│  │                  │                │ │
│  │                  │  ✓ Envío gratis│ │
│  │                  │  ✓ Empaque al  │ │
│  │                  │    vacío       │ │
│  │                  │  ✓ Incluye guía│ │
│  │                  │    de uso      │ │
│  └──────────────────┴────────────────┘ │
│                                         │
│  TABS (Descripción | Uso | Etnia)       │
│  ┌─────────────────────────────────┐   │
│  │  CONTENIDO DEL TAB ACTIVO       │   │
│  │  [Texto descriptivo detallado]  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  PRODUCTOS RELACIONADOS                 │
│  ┌─────────────────────────────────┐   │
│  │  También te puede interesar     │   │
│  │  [Card] [Card] [Card]           │   │
│  └─────────────────────────────────┘   │
│                                         │
│  FOOTER                                 │
└─────────────────────────────────────────┘
```

#### Detalle de Tabs

```
┌─────────────────────────────────────────┐
│  [Descripción] [Uso Ceremonial] [Etnia] │
│  ─────────────                           │
│                                         │
│  DESCRIPCIÓN                            │
│                                         │
│  El Rapé Yawanawa es preparado por la   │
│  etnia Yawanawa del estado de Acre,     │
│  Brasil, siguiendo tradiciones          │
│  ancestrales transmitidas de generación │
│  en generación...                       │
│                                         │
│  Características:                       │
│  • Color: Marrón claro                  │
│  • Textura: Fina y homogénea            │
│  • Aroma: Terroso, notas de tabaco      │
│  • Intensidad: Media                    │
│                                         │
│  Ingredientes: Tabaco Mapacho, ceniza   │
│  de cascara de coco, Tsunu (opcional)   │
│                                         │
└─────────────────────────────────────────┘
```

---

### 3. LISTADO DE PRODUCTOS

#### Estructura

```
┌─────────────────────────────────────────┐
│  HEADER                                 │
├─────────────────────────────────────────┤
│                                         │
│  TÍTULO DE CATEGORÍA                    │
│  "Rapé del Acre"                        │
│  12 productos                           │
│                                         │
│  FILTROS Y ORDENAMIENTO                 │
│  [Etnia ▼] [Intensidad ▼] [Precio ▼]   │
│                                         │
│  GRID DE PRODUCTOS                      │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ │
│  │[Img]   │ │[Img]   │ │[Img]   │ │[Img]   │ │
│  │        │ │        │ │        │ │        │ │
│  │Rapé    │ │Rapé    │ │Rapé    │ │Rapé    │ │
│  │Yawanawa│ │Huni    │ │Nukini  │ │Kuntan- │ │
│  │        │ │Kuin    │ │        │ │ awa    │ │
│  │$75.000 │ │$80.000 │ │$85.000 │ │$80.000 │ │
│  │[Ver →] │ │[Ver →] │ │[Ver →] │ │[Ver →] │ │
│  └────────┘ └────────┘ └────────┘ └────────┘ │
│                                         │
│  PAGINACIÓN                             │
│  [<] 1  2  3  ...  12 [>]              │
│                                         │
│  FOOTER                                 │
└─────────────────────────────────────────┘
```

---

### 4. PÁGINA DE BLOG / ARTÍCULO

#### Estructura Lista de Posts

```
┌─────────────────────────────────────────┐
│  HEADER                                 │
├─────────────────────────────────────────┤
│                                         │
│  BLOG (bkg: Papel #F5F5F0)              │
│                                         │
│  "Historias del tabaco"                 │
│                                         │
│  CATEGORÍAS                             │
│  [Todas] [Historia] [Uso] [Etnias]     │
│                                         │
│  POSTS DESTACADOS                       │
│  ┌─────────────────────────────────┐   │
│  │  [Imagen grande]                │   │
│  │  Historia del Tabaco            │   │
│  │  Categoría: Historia | 10 min   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  LISTADO DE POSTS (3 cols)              │
│  ┌────────┐ ┌────────┐ ┌────────┐      │
│  │[Img]   │ │[Img]   │ │[Img]   │      │
│  │        │ │        │ │        │      │
│  │Título  │ │Título  │ │Título  │      │
│  │Extracto│ │Extracto│ │Extracto│      │
│  │Leer →  │ │Leer →  │ │Leer →  │      │
│  └────────┘ └────────┘ └────────┘      │
│                                         │
│  FOOTER                                 │
└─────────────────────────────────────────┘
```

#### Estructura Post Individual

```
┌─────────────────────────────────────────┐
│  HEADER (dark)                          │
├─────────────────────────────────────────┤
│                                         │
│  HERO DEL POST                          │
│  ┌─────────────────────────────────┐   │
│  │  [Imagen full-width]            │   │
│  │                                 │   │
│  │  TÍTULO DEL ARTÍCULO            │   │
│  │  Por [Autor] | [Fecha] | 8 min │   │
│  └─────────────────────────────────┘   │
│                                         │
│  CONTENIDO (bkg: Papel #F5F5F0)         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │  [Contenido del artículo        │   │
│  │   con tipografía legible,       │   │
│  │   interlineado 1.8,             │   │
│  │   imágenes, quotes, etc]        │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  AUTOR (bkg: Humo #2A2A2A)              │
│  ┌─────────────────────────────────┐   │
│  │  [Avatar] [Nombre]              │   │
│  │  Bio del autor...               │   │
│  └─────────────────────────────────┘   │
│                                         │
│  POSTS RELACIONADOS                     │
│  ┌─────────────────────────────────┐   │
│  │  También te puede interesar     │   │
│  │  [Card] [Card] [Card]           │   │
│  └─────────────────────────────────┘   │
│                                         │
│  NEWSLETTER                             │
│  ┌─────────────────────────────────┐   │
│  │  Recibe más historias...        │   │
│  │  [Email ] [Suscribir]           │   │
│  └─────────────────────────────────┘   │
│                                         │
│  FOOTER                                 │
└─────────────────────────────────────────┘
```

---

### 5. PÁGINA SOBRE NOSOTROS

#### Estructura

```
┌─────────────────────────────────────────┐
│  HEADER                                 │
├─────────────────────────────────────────┤
│                                         │
│  HERO                                   │
│  ┌─────────────────────────────────┐   │
│  │  SOBRE NOSOTROS                 │   │
│  │  "Más que una tienda,           │   │
│  │   una misión"                   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  HISTORIA (split)                       │
│  ┌──────────────────┬──────────────┐   │
│  │                  │              │   │
│  │  [Imagen         │  Cómo nació  │   │
│  │   equipo o       │  Octavo Fuego│   │
│  │   ceremonia]     │              │   │
│  │                  │  Texto...    │   │
│  │                  │              │   │
│  └──────────────────┴──────────────┘   │
│                                         │
│  LA PROFECÍA (full-width)               │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │  "En tiempos del Séptimo        │   │
│  │   Fuego..."                     │   │
│  │                                 │   │
│  │  [Texto completo de la          │   │
│  │   profecía con tipografía       │   │
│  │   especial]                     │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  PROCESO (timeline vertical)            │
│  ┌─────────────────────────────────┐   │
│  │  1. Origen en el Acre           │   │
│  │  2. Alquimia del rapé           │   │
│  │  3. Empaque ceremonial          │   │
│  │  4. Entrega con propósito       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  VALORES (grid 2x2)                     │
│  ┌──────────────┐ ┌──────────────┐     │
│  │ [Icon]       │ │ [Icon]       │     │
│  │ Respeto      │ │ Transparencia│     │
│  │ Ancestral    │ │              │     │
│  └──────────────┘ └──────────────┘     │
│  ┌──────────────┐ ┌──────────────┐     │
│  │ [Icon]       │ │ [Icon]       │     │
│  │ Comunidad    │ │ Calidad      │     │
│  │              │ │              │     │
│  └──────────────┘ └──────────────┘     │
│                                         │
│  EQUIPO                                 │
│  ┌─────────────────────────────────┐   │
│  │  [Foto] [Foto]                  │   │
│  │  Edison   [Otro]                │   │
│  │  Fundador Colaborador           │   │
│  └─────────────────────────────────┘   │
│                                         │
│  CTA FINAL                              │
│  ┌─────────────────────────────────┐   │
│  │  "Únete a la comunidad"         │   │
│  │  [Explorar Productos →]         │   │
│  └─────────────────────────────────┘   │
│                                         │
│  FOOTER                                 │
└─────────────────────────────────────────┘
```

---

### 6. PÁGINA DE CONTACTO

#### Estructura

```
┌─────────────────────────────────────────┐
│  HEADER                                 │
├─────────────────────────────────────────┤
│                                         │
│  TÍTULO                                 │
│  "Hablemos"                             │
│                                         │
│  DOS COLUMNAS                           │
│  ┌──────────────────┬──────────────┐   │
│  │                  │              │   │
│  │  ESCRÍBENOS      │  WhatsApp    │   │
│  │                  │  [Icono]     │   │
│  │  [Nombre        ]│  +57 XXX     │   │
│  │                  │  XXX XXXX    │   │
│  │  [Email         ]│              │   │
│  │                  │  [Escribir   │   │
│  │  [Asunto        ]│   por WA →]  │   │
│  │                  │              │   │
│  │  [Mensaje       ]│  Horario     │   │
│  │                  │  L-V: 9am-6pm│   │
│  │  [Enviar Mensaje]│              │   │
│  │                  │              │   │
│  └──────────────────┴──────────────┘   │
│                                         │
│  FAQ RÁPIDO                             │
│  ┌─────────────────────────────────┐   │
│  │  ¿Cuánto tarda el envío?        │   │
│  │  ¿Hacen envíos internacionales? │   │
│  │  ¿Cómo uso el rapé?             │   │
│  └─────────────────────────────────┘   │
│                                         │
│  FOOTER                                 │
└─────────────────────────────────────────┘
```

---

## 🎯 COMPONENTES REUTILIZABLES

### Card de Producto

```
┌──────────────────────┐
│  [Imagen 1:1]        │
│                      │
├──────────────────────┤
│  RAPÉ YAWANAWA       │
│  10g                 │
│                      │
│  ★★★★★ (47)         │
│                      │
│  $75.000 COP         │
│                      │
│  [Ver Producto →]    │
└──────────────────────┘

- Background: #2A2A2A
- Border: 1px solid #3A3A3A
- Hover: border-color #8B4513
- Transition: all 0.3s ease
```

### Card de Blog

```
┌──────────────────────┐
│  [Imagen 16:9]       │
│                      │
├──────────────────────┤
│  HISTORIA            │
│  Historia del Tabaco │
│  en la Amazonía      │
│                      │
│  Hace cientos de     │
│  años, en lo profundo│
│  de la selva...      │
│                      │
│  8 min de lectura →  │
└──────────────────────┘

- Background: #FFFFFF
- Shadow: 0 2px 8px rgba(0,0,0,0.1)
- Hover: shadow-lg, translateY(-4px)
```

### Testimonial Card

```
┌──────────────────────┐
│                      │
│  "El rapé de Octavo  │
│   Fuego cambió mi    │
│   práctica           │
│   meditativa.        │
│   Calidad            │
│   excepcional."      │
│                      │
│  ─────────────────   │
│                      │
│  [Avatar] María G.   │
│  Bogotá              │
│                      │
└──────────────────────┘

- Background: #2A2A2A
- Border-left: 3px solid #8B4513
- Quote marks: decorative, Tabaco color
```

### Newsletter Box

```
┌─────────────────────────────────────┐
│  (background: #8B4513)              │
│                                     │
│   ÚNETE A LA COMUNIDAD              │
│                                     │
│   Recibe historias del tabaco,      │
│   guías de uso y ofertas especiales │
│                                     │
│   [Email                     ]      │
│        [Suscribirme →]              │
│                                     │
│   Sin spam. Puedes darte de baja    │
│   en cualquier momento.             │
│                                     │
└─────────────────────────────────────┘
```

---

## 📱 RESPONSIVE BREAKPOINTS

### Desktop (> 1024px)
- Grid productos: 4 columnas
- Split layouts: 50/50
- Nav completa visible
- Tipografía tamaño completo

### Tablet (768px - 1024px)
- Grid productos: 3 columnas
- Split layouts: 40/60
- Nav colapsada en hamburger
- Tipografía -10%

### Mobile (< 768px)
- Grid productos: 2 columnas (portrait), 1 columna (pequeño)
- Split layouts: apilados vertical
- Nav hamburger
- Tipografía -20%
- CTAs full-width

---

## 🎨 ESTADOS DE INTERACCIÓN

### Hover States

```css
/* Botón Primary */
.btn-primary:hover {
  background: #6B340F; /* darken 10% */
  transform: scale(1.02);
  transition: all 0.3s ease;
}

/* Card Producto */
.product-card:hover {
  border-color: #8B4513;
  box-shadow: 0 8px 24px rgba(139, 69, 19, 0.2);
  transform: translateY(-4px);
}

/* Links */
a:hover {
  color: #8B4513;
  transition: color 0.2s ease;
}

/* Imágenes */
img:hover {
  transform: scale(1.05);
  transition: transform 0.5s ease;
}
```

### Focus States (Accesibilidad)

```css
/* Focus visible */
:focus-visible {
  outline: 2px solid #8B4513;
  outline-offset: 2px;
}

/* Inputs */
input:focus {
  border-bottom-color: #8B4513;
}
```

---

## 📦 ASSETS NECESARIOS

### Imágenes

| Asset | Dimensiones | Formato | Uso |
|-------|-------------|---------|-----|
| hero-homepage | 1920x1080 | WebP | Hero principal |
| profecia-bg | 1920x800 | WebP | Sección profecía |
| product-placeholder | 800x800 | WebP | Productos sin foto |
| blog-featured | 1200x600 | WebP | Posts destacados |
| avatar-default | 200x200 | WebP | Testimonios |
| about-team | 800x600 | WebP | Página nosotros |

### Iconos (SVG)

- Shopping cart
- Search
- Menu (hamburger)
- Arrow right/left
- Star (rating)
- WhatsApp
- Instagram
- Facebook
- Email
- Checkmark
- Plus/Minus (cantidad)
- Close (X)
- Chevron down

### Fuentes

- **Playfair Display**: Google Fonts (weights: 400, 600, 700)
- **Inter**: Google Fonts (weights: 400, 500, 600)

---

## ✨ ANIMACIONES Y MICROINTERACCIONES

### Scroll Reveal

```javascript
// Elementos aparecen al hacer scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal-visible');
    }
  });
});

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
```

```css
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
}

.reveal-visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Counter Animation

```javascript
// Números que suben (ej: testimonios, ventas)
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  
  const timer = setInterval(() => {
    start += increment;
    element.textContent = Math.floor(start);
    if (start >= target) clearInterval(timer);
  }, 16);
}
```

### Smooth Scroll

```css
html {
  scroll-behavior: smooth;
}
```

---

## 🚀 CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: Setup (Semana 1)
- [ ] Variables CSS definidas
- [ ] Tipografías cargadas
- [ ] Componentes base creados
- [ ] Layouts principales estructurados

### Fase 2: Páginas Core (Semana 2)
- [ ] Homepage completa
- [ ] Página de producto
- [ ] Listado de productos
- [ ] Blog listado y detalle

### Fase 3: Páginas Informativas (Semana 3)
- [ ] Sobre nosotros
- [ ] Contacto
- [ ] FAQ
- [ ] Términos y privacidad

### Fase 4: Polish (Semana 4)
- [ ] Animaciones implementadas
- [ ] Responsive testing
- [ ] Accesibilidad audit
- [ ] Performance optimization

---

**Documento creado**: Abril 2026  
**Versión**: 1.0  
**Próxima actualización**: Post-MVP
