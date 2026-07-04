import type { APIRoute } from 'astro';
import { authenticateUser, signJWT, COOKIE_CONFIG } from '@/lib/auth';

export const prerender = false;

// ─── Rate limiting (in-memory, per IP) ───────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_ATTEMPTS) return false;
  entry.count++;
  return true;
}

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // ── Rate limit check ────────────────────────────────────────────
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('cf-connecting-ip') ||
      'unknown';
    if (!checkRateLimit(clientIp)) {
      return new Response(
        JSON.stringify({ error: 'Demasiados intentos. Intenta de nuevo en 15 minutos.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '900',
          },
        },
      );
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email y contraseña requeridos' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // Authenticate via Supabase usuarios table
    const result = await authenticateUser(email, password);

    if (!result) {
      return new Response(
        JSON.stringify({ error: 'Credenciales inválidas' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const { user, token } = result;

    // Set JWT as httpOnly cookie
    cookies.set('of_admin_token', token, COOKIE_CONFIG);

    // Set bodega_id cookie for the BodegaSwitcher (no httpOnly so JS can read it)
    cookies.set('of_admin_bodega', user.bodega_id || '', {
      httpOnly: false,
      path: '/',
      sameSite: 'lax',
      maxAge: 604800,
    });

    // Set CSRF token cookie (double-submit pattern)
    const csrfToken = crypto.randomUUID();
    cookies.set('of_csrf', csrfToken, {
      httpOnly: false,
      path: '/',
      sameSite: 'lax',
      maxAge: 604800,
    });

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          email: user.email,
          nombre: user.nombre,
          role: user.role,
        },
        csrfToken,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch {
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
};
