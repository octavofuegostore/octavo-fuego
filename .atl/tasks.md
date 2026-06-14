# Tasks: Octavo Fuego Ecommerce MVP

## Phase 1: Project Setup ✅

- [x] 1.1 Initialize Astro 6.x project with `npm create astro`
- [x] 1.2 Configure TailwindCSS 4.x with custom colors (Negro, Blanco, Tabaco, Ceniza, Humo, Papel)
- [x] 1.3 Install shadcn/ui + Radix UI
- [x] 1.4 Set up Nanostores for cart state
- [x] 1.5 Create folder structure: `src/{pages,components,layouts,i18n,constants,store,styles}`
- [x] 1.6 Configure Astro i18n (ES/EN/PT routes) ✨ UPDATED
- [x] 1.7 Remove Medusa.js dependency (use WhatsApp commerce model)

## Phase 2: Design System ✅

- [x] 2.1 Configure Tailwind with custom color tokens
- [x] 2.2 Create base Button component (Tabaco primary, ghost secondary)
- [x] 2.3 Create Card component (Humo background, Tabaco hover border)
- [x] 2.4 Create Input component (border-bottom only style)
- [x] 2.5 Create Badge component (trust badges, labels)
- [x] 2.6 Create Modal/Dialog component (Quick View)
- [x] 2.7 Create Tabs component (PDP: Descripción, Uso, Etnia)
- [x] 2.8 Create Dropdown component (Navbar)

## Phase 3: i18n Infrastructure ✅

- [x] 3.1 Create `src/i18n/es.json` with all copy (default)
- [x] 3.2 Create `src/i18n/en.json` with English translations
- [x] 3.3 Create `src/i18n/pt.json` with Portuguese translations
- [x] 3.4 Create `src/utils/i18n.ts` helper functions
- [x] 3.5 Create language switcher component (LanguageSwitcher.astro) ✨ UPDATED

## Phase 4: Layout Components ✅

- [x] 4.1 Create base Layout.astro with SEO meta tags
- [x] 4.2 Create Navbar with dropdown (5 rapés + Profecía, Blog, Nosotros, Contacto)
- [x] 4.3 Create Footer (4 columns: Productos, Nosotros, Ayuda, Conecta) - locale-aware
- [x] 4.4 Integrate FloatingWhatsApp component (pure Astro, 0KB JS) ✨ UPDATED
- [x] 4.5 Add Language Switcher to Navbar

## Phase 5: Homepage ✅

- [x] 5.1 Hero section (Logo centered, tagline "Rapé do Acre · Sananga · Kuripe", CTA)
- [x] 5.2 Profecía section (storytelling excerpt)
- [x] 5.3 Quiz "¿Cuál es tu intención hoy?" (5 options: Claridad, Energía, Bienestar, Protección, Conexión)
- [x] 5.4 Productos Destacados grid (3-4 products)
- [x] 5.5 Trust Badges section (Autenticidad, Origen Verdeado, Pureza Ritual)
- [x] 5.6 Newsletter signup section

## Phase 6: Product Pages ✅

- [x] 6.1 PLP: Product Listing Page with filters (Etnia, Tipo, Precio)
- [x] 6.2 PLP: Product card component (image, etnia, price, quick-add)
- [x] 6.3 PLP: Category pages (Rapé, Sananga, Kuripe)
- [x] 6.4 PDP: Product Detail Page with image gallery
- [x] 6.5 PDP: Tabs (Descripción, Uso Ceremonial, La Etnia)
- [x] 6.6 PDP: Price buttons (selectable 10g, 20g, 30g)
- [x] 6.7 Breadcrumb navigation (Inicio / Catálogo / Rapé / Product) ✨ UPDATED

## Phase 7: Cart & Checkout ✅

- [x] 7.1 Create `src/store/cartStore.ts` with Nanostores
- [x] 7.2 Create CartDrawer (slide-out from right, from Pipod)
- [x] 7.3 Create Cart page (full cart view)
- [x] 7.4 Create Checkout page (4 steps: Info, Envío, Pago, Listo)
- [x] 7.5 WhatsApp integration (no payment gateway - WhatsApp commerce model)

## Phase 8: SEO & Schema ✅

- [x] 8.1 Create OrganizationJsonLd.astro component
- [x] 8.2 Create ProductSchema.astro (offers, availability)
- [x] 8.3 Create BreadcrumbSchema.astro
- [x] 8.4 Add sitemap.xml and robots.txt
- [x] 8.5 Add Open Graph and Twitter Card meta tags

## Phase 9: Blog 🔄

- [x] 9.1 Set up MDX for blog posts
- [x] 9.2 Create blog listing page
- [x] 9.3 Create blog post template
- [ ] 9.4 Add first 5 SEO posts (from editorial calendar)

## Phase 10: Testing & Polish 🔄

- [ ] 10.1 Test responsive design (mobile-first)
- [ ] 10.2 Test cart persistence (localStorage)
- [ ] 10.3 Test i18n language switching
- [x] 10.4 Test WhatsApp floating button (pure Astro, 0KB JS)
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
