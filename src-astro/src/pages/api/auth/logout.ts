import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ cookies, request, redirect }) => {
  // CSRF validation: double-submit cookie pattern
  const csrfCookie = cookies.get('of_csrf')?.value;

  // Read CSRF from header (JS fetch) or form body (progressive enhancement)
  let csrfToken = request.headers.get('x-csrf-token') || '';
  if (!csrfToken) {
    try {
      const formData = await request.formData();
      csrfToken = (formData.get('_csrf') as string) || '';
    } catch {
      // Not a form POST — fall through
    }
  }

  if (csrfCookie && csrfToken && csrfCookie !== csrfToken) {
    return new Response(JSON.stringify({ error: 'CSRF token inválido' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Clear JWT token cookie
  cookies.set('of_admin_token', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });

  // Clear bodega cookie
  cookies.set('of_admin_bodega', '', {
    httpOnly: false,
    path: '/',
    maxAge: 0,
  });

  // Clear CSRF cookie
  cookies.set('of_csrf', '', {
    httpOnly: false,
    path: '/',
    maxAge: 0,
  });

  return redirect('/admin/login', 302);
};
