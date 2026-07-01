import type { APIRoute } from 'astro';
import { authenticateUser, validateCredentials, signJWT, COOKIE_CONFIG } from '@/lib/auth';
import type { AuthUser } from '@/lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
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

    // Try Supabase first (usuarios table with bcrypt)
    let result = await authenticateUser(email, password);

    // Fallback: hardcoded admin credentials (for dev / no Supabase)
    if (!result && validateCredentials(email, password)) {
      const user: AuthUser = {
        id: 'admin-hardcoded',
        email,
        nombre: 'Admin',
        role: 'admin',
        bodega_id: null,
      };
      const token = await signJWT(user);
      result = { user, token };
    }

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

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          email: user.email,
          nombre: user.nombre,
          role: user.role,
        },
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
