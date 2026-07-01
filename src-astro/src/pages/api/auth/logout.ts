import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ cookies, redirect }) => {
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

  return redirect('/admin/login', 302);
};
