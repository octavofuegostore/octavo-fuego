import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ cookies, redirect }) => {
  cookies.set('of_admin_token', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });
  return redirect('/admin/login', 302);
};
