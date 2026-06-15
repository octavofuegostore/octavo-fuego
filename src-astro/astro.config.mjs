// @tsCheck
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://octavofuego.com',
  integrations: [
    react(),
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
