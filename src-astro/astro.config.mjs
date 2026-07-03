// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import vercel from '@astrojs/vercel';

// Security headers integration
function securityHeaders() {
  return {
    name: 'security-headers',
    hooks: {
      'astro:server:setup': ({ server }) => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.vercel.live; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://images.unsplash.com; connect-src 'self' https://*.supabase.co; frame-src 'none'; object-src 'none'");
          res.setHeader('X-Content-Type-Options', 'nosniff');
          res.setHeader('X-Frame-Options', 'DENY');
          res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
          next();
        });
      },
    },
  };
}

export default defineConfig({
  adapter: vercel(),
  site: 'https://octavofuego.com',
  integrations: [
    securityHeaders(),
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
    '/catalogo': '/tienda',
    '/catalogo/rape': '/tienda/rape',
    '/catalogo/tisunu': '/tienda/rape/tisunu',
    '/catalogo/pixuri': '/tienda/rape/pixuri',
    '/catalogo/parika': '/tienda/rape/parika',
    '/catalogo/cumaru-de-cheiro': '/tienda/rape/cumaru-de-cheiro',
    '/catalogo/vena-de-paje': '/tienda/rape/vena-de-paje',
  },
});
