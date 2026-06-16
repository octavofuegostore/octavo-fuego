// @tsCheck
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

export default defineConfig({
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
      filter: (page) => !page.includes('/checkout/'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
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
    '/': '/es/',
    '/catalogo': '/es/tienda',
    '/catalogo/rape': '/es/tienda/rape',
    '/catalogo/tisunu': '/es/tienda/rape/tisunu',
    '/catalogo/pixuri': '/es/tienda/rape/pixuri',
    '/catalogo/parika': '/es/tienda/rape/parika',
    '/catalogo/cumaru-de-cheiro': '/es/tienda/rape/cumaru-de-cheiro',
    '/catalogo/vena-de-paje': '/es/tienda/rape/vena-de-paje',
    '/profecia': '/es/profecia',
  },
});
