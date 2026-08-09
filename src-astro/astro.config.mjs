// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import vercel from '@astrojs/vercel';

export default defineConfig({
  adapter: vercel(),
  site: 'https://octavofuego.com',
  integrations: [
    react(),
    icon({
      include: {
        solar: [
          // Footer
          'letter-bold-duotone',
          'chat-round-bold-duotone',
          'map-point-bold-duotone',
          'leaf-bold-duotone',
          // Footer (solid variants - max contrast)
          'letter-bold',
          'chat-round-bold',
          'map-point-bold',
          'leaf-bold',
          // Homepage Confianza
          'shield-bold-duotone',
          'cloud-waterdrop-bold-duotone',
          // Homepage Confianza (solid variants - max contrast)
          'shield-bold',
          'cloud-waterdrop-bold',
          // Homepage Intenciones
          'eye-bold-duotone',
          'lightning-bold-duotone',
          'heart-bold-duotone',
          'moon-bold-duotone',
          // Testimonials
          'star-bold-duotone',
          // Navbar / LanguageSwitcher
          'hamburger-menu-bold-duotone',
          'alt-arrow-down-bold-duotone',
          'global-bold-duotone',
          'bag-2-bold-duotone',
          // PaymentBanner
          'lock-bold',
          // Admin Sidebar
          'chart-square-bold',
          'box-bold',
          'cart-large-2-bold',
          'card-bold',
          'users-group-rounded-bold',
          'clipboard-list-bold',
          'settings-bold',
          'clock-circle-bold',
          'logout-2-bold',
        ],
        ph: [
          'instagram-logo-duotone',
          'facebook-logo-duotone',
          'whatsapp-logo-duotone',
          // Footer (solid variants - max contrast)
          'instagram-logo-fill',
          'facebook-logo-fill',
          'whatsapp-logo-fill',
        ],
      },
    }),
    sitemap({
      filter: (page) => {
        const url = new URL(page);
        const path = url.pathname;
        // Only list URLs that actually build as static files:
        // root home, cart, and locale-prefixed pages (/es|en|pt/*).
        // Root-level duplicates of [locale] pages (e.g. /faq, /tienda) are
        // SSR-only dead routes and must not be indexed.
        if (path === '/') return true;
        if (path === '/carrito' || path === '/carrito/') return true;
        return /^\/(es|en|pt)\//.test(path);
      },
      changefreq: 'weekly',
      priority: 0.7,
    })
  ],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'pt'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  redirects: {
    '/catalogo': '/tienda',
    '/catalogo/rape': '/tienda/rape',
    '/catalogo/tisunu': '/tienda/rape/tsunu',
    '/catalogo/pixuri': '/tienda/rape/pixuri',
    '/catalogo/parika': '/tienda/rape/parika',
    '/catalogo/cumaru-de-cheiro': '/tienda/rape/cumaru-de-cheiro',
    '/catalogo/vena-de-paje': '/tienda/rape/vena-de-paje',
    // i18n: prefixDefaultLocale:false no genera rutas root para [locale] dinámicas
    // Redirect explícito para que /tienda/rape/[slug] funcione sin /es/
    '/tienda/rape/tsunu': '/es/tienda/rape/tsunu',
    '/tienda/rape/pixuri': '/es/tienda/rape/pixuri',
    '/tienda/rape/parika': '/es/tienda/rape/parika',
    '/tienda/rape/cumaru-de-cheiro': '/es/tienda/rape/cumaru-de-cheiro',
    '/tienda/rape/vena-de-paje': '/es/tienda/rape/vena-de-paje',
    // Redirect slugs viejos → nuevos
    '/tienda/rape/tisunu': '/es/tienda/rape/tsunu',
    '/es/tienda/rape/tisunu': '/es/tienda/rape/tsunu',
    '/en/tienda/rape/tisunu': '/en/tienda/rape/tsunu',
    '/pt/tienda/rape/tisunu': '/pt/tienda/rape/tsunu',
  },
});
