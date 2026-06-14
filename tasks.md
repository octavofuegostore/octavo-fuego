# Octavo Fuego - Implementation Tasks

## Project Status
- ✅ Phase 1: Project Setup (Astro 6, TailwindCSS 4, shadcn/ui, Nanostores)
- ✅ Phase 2: Design System Components
- ✅ Phase 3: i18n Infrastructure (es/en/pt)
- ✅ Phase 4: Layout Components (Navbar, Footer, FloatingWhatsApp)
- ✅ Phase 5: Homepage (Hero, Profecía, Quiz, Products, Trust Badges)
- ✅ Phase 6: Product Pages (PLP, PDP, Category Pages)
- ✅ Phase 7: Cart & Checkout (CartStore, CartDrawer, Checkout)
- ✅ Phase 8: SEO & Schema (JsonLd, Sitemap, Robots, OG Tags)
- 🔄 Phase 9: Blog (Posts exist, needs integration testing)
- 🔄 Phase 10: Testing & Polish (IN PROGRESS)

---

## Phase 1: Project Setup ✅
- [x] 1.1 Initialize Astro 6.x project
- [x] 1.2 Configure TailwindCSS 4.x with custom colors
- [x] 1.3 Install shadcn/ui + Radix UI
- [x] 1.4 Set up Nanostores for cart state
- [x] 1.5 Configure Astro i18n (ES/EN/PT routes)

## Phase 2: Design System ✅
- [x] 2.1 Button component (Tabaco primary, ghost secondary)
- [x] 2.2 Card component (Humo background, Tabaco hover)
- [x] 2.3 Input component (border-bottom style)
- [x] 2.4 Badge component (trust badges, labels)
- [x] 2.5 Modal/Dialog component
- [x] 2.6 Tabs component (PDP: Descripción, Uso, Etnia)
- [x] 2.7 Dropdown component (Navbar)

## Phase 3: i18n Infrastructure ✅
- [x] 3.1 Spanish translations (es.json)
- [x] 3.2 English translations (en.json)
- [x] 3.3 Portuguese translations (pt.json)
- [x] 3.4 i18n helper functions
- [x] 3.5 Language switcher component (LanguageSwitcher.astro)

## Phase 4: Layout Components ✅
- [x] 4.1 Layout.astro with SEO meta tags
- [x] 4.2 Navbar with dropdown (5 rapés + Profecía, Blog, Nosotros, Contacto)
- [x] 4.3 Footer (4 columns, locale-aware)
- [x] 4.4 FloatingWhatsApp (pure Astro, 0KB JS) ✨ UPDATED
- [x] 4.5 Language switcher in Navbar

## Phase 5: Homepage ✅
- [x] 5.1 Hero section (Logo, tagline, CTA)
- [x] 5.2 Profecía section (storytelling excerpt)
- [x] 5.3 Quiz "¿Cuál es tu intención hoy?" (5 options)
- [x] 5.4 Productos Destacados grid
- [x] 5.5 Trust Badges section
- [x] 5.6 Newsletter signup section

## Phase 6: Product Pages ✅
- [x] 6.1 PLP: Product Listing Page with filters
- [x] 6.2 PLP: Product card component
- [x] 6.3 PLP: Category pages (Rapé, Sananga, Kuripe)
- [x] 6.4 PDP: Product Detail Page with image gallery
- [x] 6.5 PDP: Tabs (Descripción, Uso Ceremonial, La Etnia)
- [x] 6.6 PDP: Price buttons (selectable 10g, 20g, 30g)
- [x] 6.7 Breadcrumb navigation (Inicio / Catálogo / Rapé / Product) ✨ FIXED

## Phase 7: Cart & Checkout ✅
- [x] 7.1 cartStore.ts with Nanostores
- [x] 7.2 CartDrawer (slide-out from right)
- [x] 7.3 Cart page (full cart view)
- [x] 7.4 Checkout page (4 steps: Info, Envío, Pago, Listo)

## Phase 8: SEO & Schema ✅
- [x] 8.1 OrganizationJsonLd.astro
- [x] 8.2 ProductSchema.astro
- [x] 8.3 BreadcrumbSchema.astro
- [x] 8.4 sitemap.xml and robots.txt
- [x] 8.5 Open Graph and Twitter Card meta tags

## Phase 9: Blog 🔄
- [x] 9.1 MDX setup for blog posts
- [x] 9.2 Blog listing page
- [x] 9.3 Blog post template
- [ ] 9.4 First 5 SEO posts (from editorial calendar)

## Phase 10: Testing & Polish 🔄
- [ ] 10.1 Test responsive design (mobile-first)
- [ ] 10.2 Test cart persistence (localStorage)
- [ ] 10.3 Test i18n language switching
- [x] 10.4 WhatsApp floating button (pure Astro, 0KB JS)
- [ ] 10.5 Verify Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- [ ] 10.6 Accessibility audit (WCAG AA)

---

## Recent Updates

### FloatingWhatsApp Conversion (2026-06-13)
- Converted from React (.tsx) to pure Astro (.astro)
- 0KB JavaScript in bundle
- Fixed "Cannot read properties of undefined (reading 'call')" error
- Identical visual appearance

### Breadcrumb Fix (2026-06-13)
- Updated product pages to show: Inicio / Catálogo / Rapé / [Product]
- Added Rapé category link between Catálogo and product name

---

## Dependencies

```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7 → Phase 8 → Phase 10
                                                              ↓
                                                           Phase 9
```

## Priority Order

1. ~~Setup + Design System (1, 2)~~ ✅
2. ~~Layout + Navbar + WhatsApp (4)~~ ✅
3. ~~Homepage with Quiz (5)~~ ✅
4. ~~Product pages (6)~~ ✅
5. ~~Cart + Checkout (7)~~ ✅
6. ~~i18n (3)~~ ✅
7. ~~SEO (8)~~ ✅
8. Blog integration (9)
9. Testing & Polish (10)
