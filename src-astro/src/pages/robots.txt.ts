import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const robotsTxt = `
User-agent: *
Allow: /

# Disallow checkout pages
Disallow: /checkout/
Disallow: /carrito/

# Sitemap
Sitemap: https://octavofuego.com/sitemap-index.xml

# Crawl delay for polite bots
Crawl-delay: 1
`.trim();

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
};
