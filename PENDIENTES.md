# Octavo Fuego — Pendientes / Estado del Proyecto

> Proyecto: Ecommerce de Medicinas Ancestrales
> Stack: Astro 6 + TailwindCSS 4 + shadcn/ui + Nanostores
> URL: www.octavofuego.com (Vercel)
> Branches: `main` (prod) ← `develop` (wip)

---

## 📊 Estado General

| Fase | Progreso | Status |
|------|----------|--------|
| 01 Estrategia | ██████████ 100% | ✅ Completado |
| 02 Diseño | ██████████ 100% | ✅ Completado |
| 03 Desarrollo (Core) | ██████████ 95% | 🔄 Casi listo |
| 04 Marketing/SEO | ████████░░ 60% | 🔄 En progreso |
| 05 Testing & Polish | ████░░░░░░ 30% | 🔄 Pendiente |
| 06 Lanzamiento | ██░░░░░░░░ 10% | ⏳ Pendiente |

---

## 🚀 Fase 1 — Estrategia ✅

- [x] Documento maestro con storytelling (Profecía del Octavo Fuego)
- [x] Business plan para inversores
- [x] Análisis competitivo (HAUX, Ancestrina, KatU)
- [x] Modelo de negocio definido (D2C + B2B + Contenido)
- [x] Pricing definido: Rapé $3.500/g, Sananga $500/g

---

## 🎨 Fase 2 — Diseño ✅

- [x] Wireframes de todas las páginas
- [x] Copy completo (3 idiomas: ES/EN/PT)
- [x] Design system visual (colores, tipografía, componentes)
- [x] Tono y voz definido: "Maestro-Contador de Historias"
- [x] Estética: Minimalist Sacred (blanco + sombras Airbnb)

---

## 💻 Fase 3 — Desarrollo

### 3.1 Setup del Proyecto ✅
- [x] Astro 6.1.3 con TailwindCSS 4
- [x] shadcn/ui + Radix UI
- [x] Nanostores para estado del carrito
- [x] i18n configurado (ES/EN/PT) con `[locale]` params
- [x] Vercel deploy configurado

### 3.2 Layout & Componentes ✅
- [x] Layout.astro con SEO meta tags
- [x] Navbar con dropdown (5 rapés) + LanguageSwitcher
- [x] Footer locale-aware (4 columnas)
- [x] FloatingWhatsApp (100% Astro, 0KB JS) ~~React~~
- [x] Componentes UI (Button, Card, Input, Badge, Tabs, Modal)

### 3.3 Sistema de Productos ✅
- [x] Data layer: 5 rapés × 3 idiomas (verbatim copy)
- [x] Precios: 10g/$35K, 20g/$70K, 30g/$100K
- [x] PricingTable con botones seleccionables
- [x] Mapa de intenciones (5 categorías)
- [x] Profecía completa (3 idiomas)
- [x] Glosario de términos

### 3.4 Páginas ✅
- [x] Homepage (Hero, Profecía, Quiz, Productos, Trust Badges)
- [x] Catálogo principal (`/catalogo`)
- [x] Categoría Rapé (`/catalogo/rape/`)
- [x] Detalle de producto (`/catalogo/rape/[product]`)
- [x] Profecía completa (`/profecia`)
- [x] Carrito de compras (`/carrito`)
- [x] Checkout (`/checkout`)
- [x] Blog listing + 4 posts

### 3.5 SEO ✅
- [x] OrganizationJsonLd.astro
- [x] ProductSchema.astro
- [x] BreadcrumbSchema.astro
- [x] Sitemap + robots.txt
- [x] Open Graph + Twitter Cards

### 3.6 Por Hacer 🔄
- [ ] Convertir WhatsAppButton.tsx → .astro (mismo fix que FloatingWhatsApp)
- [ ] Imágenes reales de los 5 rapés (placeholder actual)
- [ ] WhatsAppButton en PDP (actualmente solo FloatingWhatsApp global)

---

## 📈 Fase 4 — Marketing & SEO 🔄

### Blog
- [x] 4 post publicados (guía rapé, historia sananga, ceremonia, beneficios)
- [ ] 5+ posts SEO adicionales (editorial calendar)
- [ ] Categorías y tags en blog
- [ ] Newsletter signup funcional

### SEO
- [x] Meta tags + Schema markup
- [x] Sitemap generado
- [ ] Core Web Vitals optimizados
- [ ] Google Search Console configurado
- [ ] Indexación verificada

---

## 🧪 Fase 5 — Testing & Polish ⏳

- [ ] Test responsive (mobile-first)
- [ ] Test i18n (ES/EN/PT) — todas las páginas
- [ ] Test carrito (persistencia localStorage)
- [ ] Test checkout flow completo
- [ ] Test WhatsApp links
- [ ] Error boundaries
- [ ] Loading states
- [ ] Accesibilidad WCAG AA
- [ ] Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1)

---

## 🚀 Fase 6 — Lanzamiento ⏳

### Pre-lanzamiento
- [ ] Dominio www.octavofuego.com propagado
- [ ] SSL funcionando
- [ ] Analytics configurado
- [ ] Imágenes reales de productos
- [ ] Copy final revisado

### Post-lanzamiento
- [ ] Campaña redes sociales
- [ ] Prospección B2B (tiendas, terapeutas)
- [ ] Email marketing setup
- [ ] Sistema de reseñas
- [ ] Blog semanal

---

## 🐛 Bugs Conocidos

| Bug | Estado | Notas |
|-----|--------|-------|
| FloatingWhatsApp runtime error | ✅ Fixed | Era React "call" — convertido a Astro puro |
| Breadcrumb sin categoría | ✅ Fixed | Ahora: Inicio / Catálogo / Rapé / Producto |
| WhatsAppButton.tsx → .astro | ✅ Fixed | Misma migración que FloatingWhatsApp |
| Lucide React SSR bug (class prop) | ✅ Fixed | Astro no forwardeaba `class` a SVGs internos → iconos renderizaban a 14px. Solución: migrar TODOS los iconos a `astro-icon` + Solar Bold-Duotone |

---

## 🎨 Design System — Iconografía

### Librerías de Iconos
| Librería | Uso | Notas |
|----------|-----|-------|
| **Solar Bold-Duotone** | Iconos UI (Mail, Chat, Map, Leaf, Shield, etc.) | Efecto duotone con `currentColor` + opacity |
| **Phosphor Duotone** | Logos sociales (Instagram, Facebook, WhatsApp) | Solar no tiene logos de marca |
| **astro-icon** | Renderizado de iconos en Astro | Resuelve el bug SSR de `class` prop |

### Iconos Disponibles (Solar Bold-Duotone)
```
Footer:         letter, chat-round, map-point, leaf
Confianza:      shield, cloud-waterdrop, leaf
Intenciones:    eye, lightning, heart, shield, moon
Navbar:         hamburger-menu, alt-arrow-down, bag-2, global
LanguageSwitch: global, alt-arrow-down
Testimonials:   star
```

### Iconos NO disponibles en Solar (usar Phosphor Duotone)
```
Instagram:  ph:instagram-logo-duotone
Facebook:   ph:facebook-logo-duotone
WhatsApp:   ph:whatsapp-logo-duotone
```

### Errores comunes al buscar iconos en Solar
| Buscado | Error | Corrección |
|---------|-------|------------|
| `droplet-bold-duotone` | No existe | `cloud-waterdrop-bold-duotone` |
| `spark-bold-duotone` | No existe | `moon-bold-duotone` |
| `star-stars-bold-duotone` | No existe | `star-bold-duotone` |
| `bag-bold-duotone` | No existe | `bag-2-bold-duotone` |

---

## 📁 Estructura del Proyecto

```
octavo-fuego/
├── PENDIENTES.md              ← Este archivo
├── AGENTS.md                  ← Instrucciones para AI agents
├── tasks.md                   ← Task tracking detallado
├── README.md                  ← Documentación general
├── src-astro/                 ← Astro project root
│   ├── src/
│   │   ├── components/        # Navbar, Footer, FloatingWhatsApp, etc.
│   │   ├── data/              # products.ts, prophecy.ts, glossary.ts
│   │   ├── i18n/              # es.json, en.json, pt.json
│   │   ├── layouts/           # Layout.astro
│   │   ├── pages/             # [locale]/*, carrito, checkout, blog
│   │   ├── stores/            # cartStore.ts
│   │   └── styles/            # global.css
│   ├── public/
│   └── dist/
├── .atl/                      # SDD artifacts
├── 01-estrategia/             # Business docs
├── 02-diseno/                 # Design & copy
├── 03-desarrollo/             # Tech specs
├── 04-marketing/              # SEO & marketing
└── 05-entrega/                # Delivery
```

---

## 🔄 Últimos Commits

| Fecha | Commit | Rama | Descripción |
|-------|--------|------|-------------|
| Jun 15 | `aadaea9` | `main`/`develop` | Migrate all site icons to Solar Bold-Duotone |
| Jun 13 | `f05ec36` | `develop` | Git workflow rule (push develop, merge main solo con autorización) |
| Jun 13 | `c3ca86e` | `main`/`develop` | SDD cycle: i18n, productos, WhatsApp commerce, breadcrumb fix |
| Jun 13 | `cb7aca1` | `main` | Fix vercel.json location |
| Jun 13 | `e3caa60` | `main` | Update AGENTS.md with repo URL, branches |

---

## 📞 Contacto

- **GitHub**: `octavofuegostore/octavo-fuego`
- **Domain**: `www.octavofuego.com` (Vercel)
- **WhatsApp**: `+57 317 2137932`
- **Instagram**: `@octavofuego`

---

*Actualizado: Junio 15, 2026*
