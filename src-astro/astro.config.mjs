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
  ]
});
