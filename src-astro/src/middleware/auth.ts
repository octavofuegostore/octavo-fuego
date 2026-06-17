/**
 * Auth middleware for admin routes.
 *
 * 1. Strips locale prefixes (`/en/`, `/pt/`) from admin and API paths
 *    so auth checks always run on canonical URLs.
 * 2. Reads the `of_admin_token` cookie and validates it via SHA-256.
 * 3. Skips auth for `/admin/login` and `/api/*`.
 * 4. Redirects unauthenticated requests to `/admin/login`.
 */

import type { MiddlewareHandler } from 'astro';
import { verifyToken } from '@/lib/auth';

const LOCALE_ADMIN_REGEX = /^\/(en|pt)\/(admin|api)/;

/**
 * Check if the request is for a protected admin route (excluding the login page).
 */
function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');
}

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { request, redirect, cookies } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  // ---------------------------------------------------------------------------
  // Step 1 — Strip locale prefix from admin / API paths
  // ---------------------------------------------------------------------------
  // Astro i18n config: defaultLocale 'es' (no prefix), 'en' and 'pt' are prefixed.
  // Redirect `/en/admin/*` and `/pt/admin/*` → `/admin/*` so auth checks and
  // redirects always land on canonical (es) paths.
  const localeMatch = pathname.match(LOCALE_ADMIN_REGEX);
  if (localeMatch) {
    const cleanPath = pathname.replace(/^\/(en|pt)/, '');
    return redirect(cleanPath, 302);
  }

  // ---------------------------------------------------------------------------
  // Step 2 — Skip auth for public entry points
  // ---------------------------------------------------------------------------
  if (pathname === '/admin/login' || pathname.startsWith('/api/')) {
    return next();
  }

  // ---------------------------------------------------------------------------
  // Step 3 — Enforce auth on /admin/*
  // ---------------------------------------------------------------------------
  if (isAdminRoute(pathname)) {
    const token = cookies.get('of_admin_token')?.value;
    const valid = await verifyToken(token);

    if (!valid) {
      return redirect('/admin/login', 302);
    }
  }

  return next();
};
