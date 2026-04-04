# Octavo Fuego - Especificaciones Técnicas Web
## Guía de Desarrollo, SEO y Performance

---

**Versión**: 1.0  
**Fecha**: Abril 2026  
**Stack Tecnológico**: Astro.js + Vite + TailwindCSS  
**Objetivo**: Ecommerce de alto performance con SEO optimizado

---

## 📋 ÍNDICE

1. [Stack Tecnológico](#stack-tecnológico)
2. [Arquitectura de la Web](#arquitectura-de-la-web)
3. [SEO Técnico](#seo-técnico)
4. [Schema Markup (Structured Data)](#schema-markup)
5. [Performance y Core Web Vitals](#performance)
6. [Analytics y Tracking](#analytics)
7. [Seguridad](#seguridad)
8. [Roadmap de Desarrollo](#roadmap-de-desarrollo)
9. [Checklist Pre-Launch](#checklist-pre-launch)

---

## 🛠 STACK TECNOLÓGICO

### Tecnologías Principales

| Capa | Tecnología | Versión | Justificación |
|------|------------|---------|---------------|
| **Framework** | Astro.js | Latest | Zero JS by default, perfecto para SEO y performance |
| **Build Tool** | Vite | Latest | Build rápido, HMR instantáneo |
| **CSS** | TailwindCSS | v3.x+ | Utility-first, bundle size optimizado |
| **CMS** | Contentful / MDX | - | Contenido editorial flexible |
| **Ecommerce** | Bold (pasarela de pagos) | - | Checkout multimodal nativo para Colombia |
| **Hosting** | Vercel / Netlify | - | Edge network, deploy automático |
| **CDN** | Cloudflare | - | Caché global, seguridad DDoS |

### Dependencias Clave

```json
{
  "dependencies": {
    "astro": "^4.x",
    "@astrojs/tailwind": "^5.x",
    "@astrojs/sitemap": "^3.x",
    "@astrojs/robots-txt": "^1.x",
    "@astrojs/partytown": "^2.x",
    "schema-dts": "^1.x",
    "astro-seo": "^0.8.x"
  }
}
```

### Pasarela de Pagos: Bold (Multimodal)

**Bold** es la pasarela de pagos principal elegida para Octavo Fuego por su enfoque multimodal nativo para el mercado colombiano:

| Método | Descripción | Caso de Uso |
|--------|-------------|-------------|
| **Bold Checkout** | Widget embebido en Astro.js | Compra directa en la web |
| **Bold Link** | Links de pago personalizados | WhatsApp, email, redes sociales |
| **Bold API** | Integración headless | Experiencia checkout nativa |
| **Bold Subscriptions** | Pagos recurrentes | Club Octavo Fuego (mensual) |

**Métodos de pago soportados**:
- Tarjetas de crédito/débito (Visa, Mastercard, Amex)
- PSE (Pagos en línea desde bancos colombianos)
- Efecty/Baloto (pago en efectivo en puntos físicos)
- Nequi/Daviplata (billeteras digitales)
- Wompi (integración futura)

**Por qué Bold (vs Shopify/Snipcart)**:
- ✅ Diseñado específicamente para Colombia
- ✅ Menores comisiones (2.99% + $900 COP vs 3.5%+ de Shopify)
- ✅ Sin costos mensuales fijos
- ✅ Soporte nativo PSE (crítico para Colombia)
- ✅ Integración simple con Astro.js (JS widget)
- ✅ Dashboard en español
- ✅ Liquidación rápida (2-3 días hábiles)

---

## 🏗 ARQUITECTURA DE LA WEB

### Estructura de URLs

```
/
├── /                  → Homepage
├── /productos/        → Listado de productos
│   ├── /productos/rape/          → Categoría Rapé
│   ├── /productos/sananga/       → Categoría Sananga
│   ├── /productos/accesorios/    → Categoría Accesorios
│   └── /productos/libros/        → Categoría Libros
├── /producto/
│   ├── /producto/rape-yawanawa-10g/     → Producto individual
│   ├── /producto/rape-huni-kuin-10g/    → Producto individual
│   ├── /producto/sananga-10ml/          → Producto individual
│   └── ...
├── /tienda/           → Tienda física (B2B)
├── /blog/             → Blog educativo
│   ├── /blog/historia-del-tabaco/
│   ├── /blog/guia-uso-rape/
│   └── ...
├── /sobre-nosotros/   → About / Historia
├── /profecia/         → Storytelling Octavo Fuego
├── /educacion/        → Ebooks y recursos
├── /contacto/         → Contacto + WhatsApp
├── /faq/              → Preguntas frecuentes
├── /envios/           → Política de envíos
├── /terminos/         → Términos y condiciones
└── /privacidad/       → Política de privacidad
```

### Estructura de Directorios

```
src/
├── components/           # Componentes reutilizables
│   ├── ui/              # Buttons, inputs, cards
│   ├── product/         # ProductCard, ProductGrid
│   ├── layout/          # Header, Footer, Navigation
│   └── seo/             # MetaTags, SchemaOrg
├── layouts/             # Layouts de página
│   ├── Layout.astro     # Layout principal
│   ├── ProductLayout.astro
│   └── BlogLayout.astro
├── pages/               # Rutas de la aplicación
│   ├── index.astro
│   ├── productos/
│   ├── producto/
│   ├── blog/
│   └── ...
├── content/             # Contenido MDX
│   ├── blog/
│   └── productos/
├── styles/              # Estilos globales
├── utils/               # Utilidades
│   ├── seo.ts          # Helpers SEO
│   ├── schema.ts       # Generadores Schema
│   └── helpers.ts
└── types/               # TypeScript types
public/
├── images/              # Imágenes optimizadas
│   ├── products/        # Fotos de productos (WebP)
│   ├── blog/           # Imágenes blog
│   └── meta/           # OG images, favicons
├── fonts/               # Fuentes locales
└── icons/               # SVG icons
```

---

## 🔍 SEO TÉCNICO

### 1. Meta Tags Obligatorios

#### Layout Base (`Layout.astro`)

```astro
---
export interface Props {
  title: string;
  description: string;
  image?: string;
  canonical?: string;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
}

const {
  title,
  description,
  image = '/images/meta/og-default.jpg',
  canonical = Astro.url.href,
  type = 'website',
  noindex = false
} = Astro.props;

const siteName = 'Octavo Fuego';
const fullTitle = title === siteName ? title : `${title} | ${siteName}`;
---

<head>
  <!-- Básicos -->
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{fullTitle}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />
  
  {noindex && <meta name="robots" content="noindex, nofollow" />}
  
  <!-- Open Graph -->
  <meta property="og:title" content={fullTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content={type} />
  <meta property="og:url" content={canonical} />
  <meta property="og:image" content={new URL(image, Astro.site)} />
  <meta property="og:site_name" content={siteName} />
  <meta property="og:locale" content="es_CO" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={fullTitle} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={new URL(image, Astro.site)} />
  
  <!-- Favicons -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  
  <!-- Preconnect -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
</head>
```

### 2. Configuración Astro SEO

#### `astro.config.mjs`

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';
import partytown from '@astrojs/partytown';

export default defineConfig({
  site: 'https://octavofuego.com',
  integrations: [
    tailwind(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es-CO'
        }
      }
    }),
    robotsTxt({
      sitemap: 'https://octavofuego.com/sitemap-index.xml',
      policy: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/admin', '/carrito', '/checkout']
        }
      ]
    }),
    partytown({
      config: {
        forward: ['dataLayer.push', 'fbq', 'gtag']
      }
    })
  ],
  build: {
    format: 'file'
  },
  compressHTML: true,
  prefetch: true
});
```

### 3. Optimización de Imágenes

#### Componente Optimizado (`Picture.astro`)

```astro
---
export interface Props {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'eager' | 'lazy';
  class?: string;
  sizes?: string;
}

const { 
  src, 
  alt, 
  width = 800, 
  height = 600,
  loading = 'lazy',
  class: className,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px'
} = Astro.props;
---

<picture>
  <source 
    srcset={`${src}?w=400&format=webp 400w, ${src}?w=800&format=webp 800w, ${src}?w=1200&format=webp 1200w`}
    sizes={sizes}
    type="image/webp"
  />
  <img
    src={`${src}?w=800`}
    alt={alt}
    width={width}
    height={height}
    loading={loading}
    decoding="async"
    class={className}
  />
</picture>
```

### 4. URLs Canónicas y Redirecciones

#### Middleware (`middleware.js`)

```javascript
export const onRequest = async (context, next) => {
  const url = new URL(context.request.url);
  
  // Redireccionar www a non-www
  if (url.hostname.startsWith('www.')) {
    url.hostname = url.hostname.slice(4);
    return Response.redirect(url.toString(), 301);
  }
  
  // Redireccionar HTTP a HTTPS
  if (url.protocol === 'http:') {
    url.protocol = 'https:';
    return Response.redirect(url.toString(), 301);
  }
  
  // Eliminar trailing slashes
  if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.slice(0, -1);
    return Response.redirect(url.toString(), 301);
  }
  
  return next();
};
```

### 5. Optimización de Performance

#### Configuración Vite

```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['lodash-es'],
          analytics: ['./src/utils/analytics.ts']
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['@astrojs/image']
  }
});
```

### 6. Content Security Policy

#### Headers (`public/_headers` para Netlify)

```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://analytics.google.com https://connect.facebook.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.shopify.com; frame-src https://www.youtube-nocookie.com;
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
```

---

## 📋 SCHEMA MARKUP (STRUCTURED DATA)

### Implementación Base

#### `src/utils/schema.ts`

```typescript
import type { Organization, WebSite, Product, Article, FAQPage, BreadcrumbList } from 'schema-dts';

// Schema para la organización
export const getOrganizationSchema = (): Organization => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Octavo Fuego',
  alternateName: 'Octavo Fuego - Rapé do Acre',
  url: 'https://octavofuego.com',
  logo: {
    '@type': 'ImageObject',
    url: 'https://octavofuego.com/images/logo.png',
    width: 512,
    height: 512
  },
  description: 'Medicinas ancestrales amazónicas con propósito. Rapé do Acre, Sananga y Sangre de Drago.',
  foundingDate: '2026',
  founders: [
    {
      '@type': 'Person',
      name: 'Edison'
    }
  ],
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'CO',
    addressRegion: 'Bogotá D.C.',
    addressLocality: 'Bogotá'
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Ventas',
    telephone: '+57-XXX-XXX-XXXX',
    availableLanguage: ['Spanish'],
    areaServed: 'CO'
  },
  sameAs: [
    'https://instagram.com/octavofuego',
    'https://facebook.com/octavofuego'
  ]
});

// Schema para el website
export const getWebsiteSchema = (): WebSite => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Octavo Fuego',
  url: 'https://octavofuego.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://octavofuego.com/buscar?q={search_term_string}'
    },
    'query-input': 'required name=search_term_string'
  }
});

// Schema para productos
export const getProductSchema = (product: {
  name: string;
  description: string;
  image: string;
  sku: string;
  price: number;
  currency: string;
  availability: 'InStock' | 'OutOfStock';
  category: string;
  brand?: string;
  weight?: string;
}): Product => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.description,
  image: product.image,
  sku: product.sku,
  brand: {
    '@type': 'Brand',
    name: product.brand || 'Octavo Fuego'
  },
  category: product.category,
  weight: product.weight ? {
    '@type': 'QuantitativeValue',
    value: product.weight,
    unitCode: 'GRM'
  } : undefined,
  offers: {
    '@type': 'Offer',
    url: `https://octavofuego.com/producto/${product.sku}`,
    priceCurrency: product.currency,
    price: product.price.toString(),
    availability: `https://schema.org/${product.availability}`,
    priceValidUntil: '2027-12-31',
    seller: {
      '@type': 'Organization',
      name: 'Octavo Fuego'
    }
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '47'
  }
});

// Schema para artículos de blog
export const getArticleSchema = (article: {
  title: string;
  description: string;
  image: string;
  publishDate: string;
  modifiedDate?: string;
  author: string;
  url: string;
}): Article => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.title,
  description: article.description,
  image: article.image,
  datePublished: article.publishDate,
  dateModified: article.modifiedDate || article.publishDate,
  author: {
    '@type': 'Person',
    name: article.author
  },
  publisher: {
    '@type': 'Organization',
    name: 'Octavo Fuego',
    logo: {
      '@type': 'ImageObject',
      url: 'https://octavofuego.com/images/logo.png'
    }
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': article.url
  }
});

// Schema para FAQ
export const getFAQSchema = (faqs: Array<{question: string; answer: string}>): FAQPage => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
});

// Schema para breadcrumbs
export const getBreadcrumbSchema = (items: Array<{name: string; url: string}>): BreadcrumbList => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url
  }))
});

// Schema para LocalBusiness (si hay tienda física)
export const getLocalBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: 'Octavo Fuego - Tienda',
  description: 'Tienda de medicinas ancestrales amazónicas',
  url: 'https://octavofuego.com/tienda',
  telephone: '+57-XXX-XXX-XXXX',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '[Dirección física]',
    addressLocality: 'Bogotá',
    addressRegion: 'Bogotá D.C.',
    postalCode: '[Código postal]',
    addressCountry: 'CO'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '4.60971',
    longitude: '-74.08175'
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '10:00',
      closes: '19:00'
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '10:00',
      closes: '14:00'
    }
  ],
  priceRange: '$$'
});
```

### Uso en Páginas

#### Ejemplo: Página de Producto

```astro
---
import { getProductSchema, getBreadcrumbSchema } from '../utils/schema';

const product = {
  name: 'Rapé Yawanawa 10g',
  description: 'Rapé tradicional de la etnia Yawanawa del Acre, Brasil. Equilibrado y de fuerza media.',
  image: 'https://octavofuego.com/images/products/rape-yawanawa.jpg',
  sku: 'RAPE-YAW-10G',
  price: 75000,
  currency: 'COP',
  availability: 'InStock',
  category: 'Rapé',
  brand: 'Octavo Fuego',
  weight: '10'
};

const breadcrumbs = [
  { name: 'Inicio', url: 'https://octavofuego.com' },
  { name: 'Productos', url: 'https://octavofuego.com/productos' },
  { name: 'Rapé', url: 'https://octavofuego.com/productos/rape' },
  { name: product.name, url: Astro.url.href }
];

const productSchema = getProductSchema(product);
const breadcrumbSchema = getBreadcrumbSchema(breadcrumbs);
---

<script type="application/ld+json" set:html={JSON.stringify(productSchema)} />
<script type="application/ld+json" set:html={JSON.stringify(breadcrumbSchema)} />
```

---

## ⚡ PERFORMANCE Y CORE WEB VITALS

### Objetivos de Performance

| Métrica | Objetivo | Prioridad |
|---------|----------|-----------|
| **LCP** (Largest Contentful Paint) | < 2.5s | Alta |
| **FID** (First Input Delay) | < 100ms | Alta |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Alta |
| **FCP** (First Contentful Paint) | < 1.8s | Media |
| **TTFB** (Time to First Byte) | < 600ms | Media |
| **Speed Index** | < 3.4s | Media |

### Optimizaciones Implementadas

#### 1. Astro Islands (Hydration)

```astro
<!-- Componente interactivo solo donde se necesita -->
<AddToCartButton client:visible />
<ImageCarousel client:media="(min-width: 768px)" />
<SearchBox client:idle />
```

#### 2. Lazy Loading de Imágenes

```astro
<img 
  src="/images/product.webp" 
  alt="Rapé Yawanawa"
  loading="lazy"
  decoding="async"
  width="800"
  height="600"
/>
```

#### 3. Precarga de Recursos Críticos

```astro
<head>
  <!-- Preload fuentes críticas -->
  <link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin />
  
  <!-- Preconnect a dominios externos -->
  <link rel="preconnect" href="https://cdn.shopify.com" />
  
  <!-- Prefetch de páginas -->
  <link rel="prefetch" href="/productos" />
</head>
```

#### 4. Optimización de CSS

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif']
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
};
```

#### 5. Service Worker (Opcional para PWA)

```javascript
// public/sw.js
const CACHE_NAME = 'octavo-fuego-v1';
const urlsToCache = [
  '/',
  '/productos',
  '/styles/main.css',
  '/offline.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});
```

---

## 📊 ANALYTICS Y TRACKING

### Google Analytics 4

#### Configuración GTM

```javascript
// src/utils/gtag.ts
export const GA_TRACKING_ID = 'G-XXXXXXXXXX';

// Page view
export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
    page_location: window.location.href,
    page_title: document.title,
    send_page_view: true
  });
};

// Event tracking
export const event = ({
  action,
  category,
  label,
  value
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value
  });
};

// Eventos de ecommerce
export const trackAddToCart = (product: Product, quantity: number) => {
  window.gtag('event', 'add_to_cart', {
    currency: 'COP',
    value: product.price * quantity,
    items: [{
      item_id: product.sku,
      item_name: product.name,
      item_category: product.category,
      price: product.price,
      quantity: quantity
    }]
  });
};

export const trackPurchase = (transaction: Transaction) => {
  window.gtag('event', 'purchase', {
    transaction_id: transaction.id,
    value: transaction.total,
    currency: 'COP',
    items: transaction.items
  });
};
```

#### Eventos a Trackear

| Evento | Descripción | Parámetros |
|--------|-------------|------------|
| `page_view` | Vista de página | page_title, page_location |
| `view_item` | Ver producto | items, value |
| `add_to_cart` | Añadir al carrito | items, value |
| `remove_from_cart` | Remover del carrito | items |
| `begin_checkout` | Iniciar checkout | value, items |
| `purchase` | Compra completada | transaction_id, value, items |
| `search` | Búsqueda | search_term |
| `view_content` | Ver contenido | content_type, content_id |
| `contact` | Click en contacto | method (whatsapp, email) |

### Facebook Pixel

```javascript
// src/utils/fbq.ts
export const FB_PIXEL_ID = 'XXXXXXXXXX';

export const pageView = () => {
  window.fbq('track', 'PageView');
};

export const trackEvent = (name: string, options = {}) => {
  window.fbq('track', name, options);
};

// Eventos específicos
export const trackViewContent = (product: Product) => {
  window.fbq('track', 'ViewContent', {
    content_ids: [product.sku],
    content_type: 'product',
    value: product.price,
    currency: 'COP'
  });
};

export const trackAddToCart = (product: Product, quantity: number) => {
  window.fbq('track', 'AddToCart', {
    content_ids: [product.sku],
    content_type: 'product',
    value: product.price * quantity,
    currency: 'COP',
    num_items: quantity
  });
};

export const trackPurchase = (transaction: Transaction) => {
  window.fbq('track', 'Purchase', {
    content_ids: transaction.items.map(i => i.sku),
    content_type: 'product',
    value: transaction.total,
    currency: 'COP',
    num_items: transaction.items.length
  });
};
```

### Hotjar / Clarity

```javascript
// src/utils/hotjar.ts
export const initHotjar = () => {
  (function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:XXXXXXX,hjsv:6};
    a=o.getElementsByTagName('head')[0];
    r=o.createElement('script');r.async=1;
    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    a.appendChild(r);
  })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
};

// Tracking de eventos personalizados
export const trackEvent = (eventName: string) => {
  if (window.hj) {
    window.hj('event', eventName);
  }
};
```

---

## 🔒 SEGURIDAD

### Headers de Seguridad

```
# public/_headers (Netlify)
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### Formularios Protegidos

```typescript
// src/utils/forms.ts
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(1000),
  honeypot: z.string().max(0) // Anti-spam
});

export const validateContactForm = (data: unknown) => {
  return contactSchema.safeParse(data);
};

// Rate limiting simple
const submissionCache = new Map<string, number>();

export const checkRateLimit = (ip: string): boolean => {
  const lastSubmission = submissionCache.get(ip);
  const now = Date.now();
  
  if (lastSubmission && now - lastSubmission < 60000) { // 1 minuto
    return false;
  }
  
  submissionCache.set(ip, now);
  return true;
};
```

### Validación de Entradas

```astro
---
// Páginas con parámetros dinámicos
export function getStaticPaths() {
  const products = getAllProducts();
  return products.map(product => ({
    params: { slug: product.slug },
    props: { product }
  }));
}

const { product } = Astro.props;

// Validación de existencia
if (!product) {
  return Astro.redirect('/404');
}
---
```

---

## 🗓 ROADMAP DE DESARROLLO

### Fase 1: Fundación (Semanas 1-4)

| Semana | Tarea | Entregable | Responsable |
|--------|-------|------------|-------------|
| 1 | Setup proyecto Astro + Tailwind | Repo funcional | Dev |
| 1 | Configuración SEO base | Meta tags, robots, sitemap | Dev |
| 2 | Layout base + navegación | Header, footer, rutas | Dev |
| 2 | Páginas estáticas core | Home, About, Contacto | Dev |
| 3 | Páginas de producto | Listado + detalle | Dev |
| 3 | Integración ecommerce | Shopify/Snipcart | Dev |
| 4 | Blog + MDX | Sistema de posts | Dev |
| 4 | Optimización imágenes | WebP, lazy loading | Dev |

### Fase 2: SEO y Contenido (Semanas 5-8)

| Semana | Tarea | Entregable |
|--------|-------|------------|
| 5 | Schema markup | JSON-LD productos, articles |
| 5 | Breadcrumbs | Navegación estructurada |
| 6 | Internal linking | Links contextuales automáticos |
| 6 | OG images dinámicas | Imágenes compartibles |
| 7 | Analytics setup | GA4, Pixel, Hotjar |
| 7 | Event tracking | Ecommerce tracking |
| 8 | Performance audit | Core Web Vitals optimizados |
| 8 | Accessibility audit | WCAG 2.1 AA |

### Fase 3: Features Avanzadas (Semanas 9-12)

| Semana | Tarea | Entregable |
|--------|-------|------------|
| 9 | Búsqueda | Búsqueda instantánea (Fuse.js) |
| 9 | Filtros | Filtros de productos |
| 10 | Wishlist | Lista de favoritos |
| 10 | Reviews | Sistema de reseñas |
| 11 | Newsletter | Formularios + integración |
| 11 | Chat/ WhatsApp | Widget de contacto |
| 12 | PWA features | Service worker, manifest |
| 12 | Testing final | QA completo |

### Milestones

| Fecha | Milestone | Criterios de Éxito |
|-------|-----------|-------------------|
| Semana 4 | MVP funcional | Home + productos + checkout |
| Semana 8 | SEO-ready | 90+ en Lighthouse SEO |
| Semana 12 | Launch ready | Performance 90+, sin bugs críticos |

---

## ✅ CHECKLIST PRE-LAUNCH

### SEO Técnico

- [ ] Meta tags únicos en todas las páginas
- [ ] URLs canónicas configuradas
- [ ] Sitemap.xml generado y enviado a Google
- [ ] Robots.txt optimizado
- [ ] Schema markup implementado (Product, Article, Breadcrumb)
- [ ] OG tags configurados para todas las páginas
- [ ] Imágenes con alt text descriptivo
- [ ] Internal links funcionando
- [ ] No broken links (validar con Screaming Frog)
- [ ] Páginas 404 personalizada
- [ ] Redirecciones 301 configuradas

### Performance

- [ ] Lighthouse Performance > 90
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Imágenes en WebP
- [ ] Lazy loading implementado
- [ ] CSS crítico inline
- [ ] JavaScript minificado
- [ ] Gzip/Brotli activado
- [ ] CDN configurado

### Analytics

- [ ] GA4 instalado y funcionando
- [ ] Facebook Pixel instalado
- [ ] Eventos de ecommerce configurados
- [ ] Goals/Conversions definidos
- [ ] Funnels de conversión creados
- [ ] Dashboard de KPIs listo

### Seguridad

- [ ] HTTPS forzado
- [ ] Headers de seguridad configurados
- [ ] CSP implementado
- [ ] Formularios protegidos
- [ ] Rate limiting activo
- [ ] .env variables no expuestas
- [ ] Dependencias auditadas (`npm audit`)

### Funcionalidad

- [ ] Checkout funciona end-to-end
- [ ] Pagos procesan correctamente
- [ ] Emails de confirmación llegan
- [ ] WhatsApp Business integrado
- [ ] Formularios envían datos
- [ ] Búsqueda funciona
- [ ] Filtros de productos funcionan
- [ ] Mobile responsive (testear en iOS/Android)
- [ ] Cross-browser testing (Chrome, Safari, Firefox)

### Contenido

- [ ] Todos los productos cargados
- [ ] Imágenes de productos optimizadas
- [ ] Descripciones únicas y optimizadas SEO
- [ ] Precios actualizados
- [ ] Stock actualizado
- [ ] Políticas legales publicadas
- [ ] FAQ completa
- [ ] Blog con 3+ posts iniciales

### Pre-Launch

- [ ] DNS configurado correctamente
- [ ] Dominio apuntando al servidor
- [ ] SSL certificate activo
- [ ] Backups configurados
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Error tracking (Sentry)
- [ ] Google Search Console verificado
- [ ] Sitemap enviado a GSC

---

## 🛠 HERRAMIENTAS RECOMENDADAS

### Desarrollo

| Herramienta | Uso |
|-------------|-----|
| VS Code | Editor de código |
| Chrome DevTools | Debugging, Lighthouse |
| Postman | Testing APIs |
| Git + GitHub | Version control |

### SEO y Performance

| Herramienta | Uso |
|-------------|-----|
| Google Search Console | Indexación, keywords |
| Google Analytics 4 | Analytics |
| Google PageSpeed Insights | Performance audit |
| GTmetrix | Performance detallado |
| Screaming Frog | Crawl SEO |
| Ahrefs / SEMrush | Keywords, backlinks |
| Schema.org Validator | Validar structured data |

### Testing

| Herramienta | Uso |
|-------------|-----|
| Lighthouse | Performance, SEO, A11y |
| WAVE | Accessibility testing |
| BrowserStack | Cross-browser testing |
| WebPageTest | Performance avanzado |

### Monitoreo

| Herramienta | Uso |
|-------------|-----|
| Vercel Analytics | Web Vitals |
| Sentry | Error tracking |
| UptimeRobot | Uptime monitoring |
| Hotjar / Microsoft Clarity | Heatmaps, recordings |

---

## 📚 RECURSOS Y REFERENCIAS

### Documentación Oficial

- [Astro Docs](https://docs.astro.build)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Schema.org](https://schema.org)
- [Google Search Central](https://developers.google.com/search)
- [Web.dev](https://web.dev)

### Recursos Útiles

- [Astro SEO Best Practices](https://astro.build/blog/seo/)
- [Core Web Vitals Guide](https://web.dev/vitals/)
- [Ecommerce SEO Checklist](https://moz.com/blog/ecommerce-seo-checklist)
- [Schema Markup for Ecommerce](https://developers.google.com/search/docs/appearance/structured-data/product)

---

**Documento creado**: Abril 2026  
**Versión**: 1.0  
**Próxima revisión**: Post-launch (Semana 13)  
**Responsable**: Dev Lead / Marketing Digital

---

## 📝 NOTAS DE IMPLEMENTACIÓN

### Keywords Prioritarias por Página

| Página | Keyword Principal | Keywords Secundarias |
|--------|-------------------|---------------------|
| Home | rapé colombia | medicina ancestral, tabaco sagrado |
| /productos/rape/ | comprar rapé | rapé do acre, rapé yawanawa |
| /producto/rape-yawanawa/ | rapé yawanawa 10g | rapé brasil, rapé etnia yawanawa |
| /blog/guia-uso-rape/ | cómo usar rapé | guía rapé, aplicación rapé |
| /sobre-nosotros/ | octavo fuego | historia octavo fuego, profecía |

### Páginas a Noindex

- /carrito
- /checkout
- /gracias (página post-compra)
- /buscar (resultados de búsqueda)
- /cuenta/* (área de cliente)

### Páginas Prioritarias para Indexación

1. Homepage
2. Páginas de categoría (/productos/rape/, /productos/sananga/)
3. Páginas de producto (todas)
4. Posts de blog
5. Páginas informativas (/sobre-nosotros/, /profecia/, /faq/)

---

*"Una web rápida, bien estructurada y optimizada para SEO es la base de un ecommerce exitoso en el nicho espiritual."*
