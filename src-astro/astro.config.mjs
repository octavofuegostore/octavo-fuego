// @tsCheck
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://octavofuego.com',
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/checkout/') && !page.includes('/tienda'),
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
    '/tienda': '/es/catalogo',
    '/catalogo': '/es/catalogo',
    '/catalogo/rape': '/es/catalogo/rape',
    '/catalogo/tisunu': '/es/catalogo/rape/tisunu',
    '/catalogo/pixuri': '/es/catalogo/rape/pixuri',
    '/catalogo/parika': '/es/catalogo/rape/parika',
    '/catalogo/cumaru-de-cheiro': '/es/catalogo/rape/cumaru-de-cheiro',
    '/catalogo/vena-de-paje': '/es/catalogo/rape/vena-de-paje',
    '/profecia': '/es/profecia',
  },
});
