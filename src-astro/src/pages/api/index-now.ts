export const prerender = false;

import type { APIRoute } from 'astro';

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || '8f4a2c1e9d7b3f5a';
const ALLOWED_DOMAIN = 'octavofuego.com';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return new Response(JSON.stringify({ error: 'url is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate URL belongs to our domain
    try {
      const parsed = new URL(url);
      if (!parsed.hostname.endsWith(ALLOWED_DOMAIN)) {
        return new Response(JSON.stringify({ error: 'URL must belong to octavofuego.com' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid URL' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Submit to IndexNow API
    const encodedUrl = encodeURIComponent(url);
    const indexNowUrl = `https://api.indexnow.org/indexnow?url=${encodedUrl}&key=${INDEXNOW_KEY}`;
    
    const response = await fetch(indexNowUrl, { method: 'GET' });
    
    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ 
        error: 'IndexNow submission failed', 
        details: errorText 
      }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const GET: APIRoute = () => {
  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
};
