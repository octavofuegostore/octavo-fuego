# SPEC: Octavo Fuego Ecommerce MVP

## 1. OVERVIEW

**Project**: Octavo Fuego - Ecommerce de Medicinas Ancestrales Amazónicas  
**Change**: tech-stack-setup  
**Mode**: engram (hybrid with filesystem)  
**Date**: Abril 2026

---

## 2. PURPOSE

Ecommerce MVP para Octavo Fuego: plataforma B2C/B2B para venta de Rapé do Acre, Sananga y Kuripes. El sitio debe transmitir una estética "Minimalist Sacred" con colores Negro/Blanco/Tabaco/Ceniza, tono de voz "Maestro-Contador de Historias", y soporte multi-idioma ES/EN/PT.

---

## 3. STACK REQUIREMENTS

### 3.1 Frontend Framework

| Req | Description |
|-----|-------------|
| MUST | Usar Astro 6.x como framework principal |
| MUST | Soporte View Transitions para navegación fluida |
| MUST | Renderizado estático por defecto (SSG) |
| MUST | Islands architecture para componentes interactivos |

### 3.2 Styling

| Req | Description |
|-----|-------------|
| MUST | TailwindCSS 4.x para estilos |
| MUST | Custom color tokens: Negro (#000), Blanco (#FFF), Tabaco (#8B4513), Ceniza (#C0C0C0), Humo (#2A2A2A), Papel (#F5F5F0) |
| SHOULD | shadcn/ui como base de componentes |
| SHOULD | Radix UI para primitivas accesibles |

### 3.3 Ecommerce Backend

| Req | Description |
|-----|-------------|
| MUST | Medusa.js 2.x como backend headless |
| MUST | PostgreSQL para base de datos |
| MUST | Gestión de productos con variantes (peso, etnia) |
| MUST | Gestión de inventario básico |

### 3.4 State Management

| Req | Description |
|-----|-------------|
| MUST | Nanostores para estado global del carrito |
| MUST | Persistencia en localStorage |
| MUST | Sincronización entre tabs |

### 3.5 Payments

| Req | Description |
|-----|-------------|
| MUST | Integración con Bold Payment Gateway |
| MUST | Soporte PSE, Nequi, Daviplata, tarjetas |
| MUST | Webhook para confirmación de pago |

---

## 4. FEATURE REQUIREMENTS

### 4.1 Homepage

| Req | Description |
|-----|-------------|
| MUST | Hero con logo centrado y tagline "Rapé do Acre · Sananga · Kuripe" |
| MUST | Sección profecía (storytelling) |
| MUST | Quiz "¿Cuál es tu intención hoy?" con 4 opciones |
| MUST | Grid de productos destacados |
| MUST | Trust badges: Autenticidad, Origen Verdeado, Pureza Ritual |
| MUST | Newsletter signup |

### 4.2 Navigation

| Req | Description |
|-----|-------------|
| MUST | Navbar fijo con logo y menú |
| MUST | Dropdown en "Tienda" (Rapé, Sananga, Kuripes, Accesorios) |
| MUST | Carrito con contador de items |
| MUST | Mobile: hamburger menu |
| MUST | Smooth scroll y backdrop blur en scroll |

### 4.3 Product Listing (PLP)

| Req | Description |
|-----|-------------|
| MUST | Grid de productos con imagen, nombre, precio |
| MUST | Filtros por categoría (Etnia, Tipo, Precio) |
| MUST | Quick View modal sin salir de página |
| MUST | Paginación |

### 4.4 Product Detail (PDP)

| Req | Description |
|-----|-------------|
| MUST | Galería de imágenes |
| MUST | Tabs: Descripción, Uso Ceremonial, La Etnia |
| MUST | Selector de cantidad |
| MUST | Botón "Añadir al Carrito" |
| MUST | Trust badges |

### 4.5 Cart

| Req | Description |
|-----|-------------|
| MUST | CartDrawer slide-out desde derecha |
| MUST | Mostrar items con imagen, nombre, cantidad, precio |
| MUST | Editar cantidad, eliminar items |
| MUST | Subtotal, total |
| MUST | Botón "Ir al Checkout" |

### 4.6 Checkout

| Req | Description |
|-----|-------------|
| MUST | 4 pasos: Info, Envío, Pago, Confirmación |
| MUST | Formulario con validación |
| MUST | Integración Bold Checkout |
| MUST | Página de éxito con CTA WhatsApp |

### 4.7 WhatsApp Floating Button

| Req | Description |
|-----|-------------|
| MUST | Botón verde (#25D366) flotante esquina inferior derecha |
| MUST | Animación cada 8 segundos |
| MUST | Enlace directo a WhatsApp |
| MUST | Tooltip "¿Necesitas ayuda?" |

---

## 5. i18n REQUIREMENTS

| Req | Description |
|-----|-------------|
| MUST | Idiomas: ES (default), EN, PT |
| MUST | Constantes de traducción en archivos JSON |
| MUST | URL structure: /es/, /en/, /pt/ o query params |
| MUST | Contenido de productos traducible |

---

## 6. SEO REQUIREMENTS

### 6.1 Schema Markup

| Req | Description |
|-----|-------------|
| MUST | Organization schema |
| MUST | LocalBusiness schema |
| MUST | Product schema con Offer |
| MUST | WebPage schema |
| MUST | BreadcrumbList schema |

### 6.2 Meta Tags

| Req | Description |
|-----|-------------|
| MUST | Title, description, canonical |
| MUST | Open Graph tags |
| MUST | Twitter Card tags |
| MUST | Sitemap.xml y robots.txt |

---

## 7. SCENARIOS

### Scenario: Añadir producto al carrito

- GIVEN El usuario está en PDP con producto
- WHEN Click en "Añadir al Carrito"
- THEN Producto aparece en CartDrawer
- AND Contador del navbar se actualiza
- AND Toast de confirmación aparece

### Scenario: Checkout con PSE

- GIVEN Usuario tiene items en carrito
- WHEN Completa formulario y selecciona PSE
- THEN Redirige a Bold Checkout
- WHEN Bold confirma pago
- THEN Página de éxito muestra
- AND Email de confirmación enviado

### Scenario: Cambio de idioma

- GIVEN Usuario está en homepage
- WHEN Click en selector EN
- THEN Página recarga con contenido en inglés
- AND URL cambia según estructura i18n

### Scenario: Quick View producto

- GIVEN Usuario está en PLP
- WHEN Click en "Vista rápida"
- THEN Modal muestra producto con cantidad y CTA
- WHEN Click "Añadir al Carrito"
- THEN Cierra modal y añade al carrito

---

## 8. OUT OF SCOPE (Post-MVP)

- Libro Sagrada Ciencia
- Club de suscripción
- Programa de afiliados
- Blog con MDX (Phase 9)
- Wishlist
- Dark/Light mode
