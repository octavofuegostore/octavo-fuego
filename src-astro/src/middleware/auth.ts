/**
 * Auth middleware for admin routes.
 *
 * 1. Strips locale prefixes (`/en/`, `/pt/`) from admin and API paths
 *    so auth checks always run on canonical URLs.
 * 2. Reads the `of_admin_token` cookie and validates it via JWT (jose).
 * 3. Sets `context.locals.user` with decoded payload (email, role, bodega_id).
 * 4. Skips auth for `/admin/login` and `/api/*`.
 * 5. Redirects unauthenticated requests to `/admin/login`.
 */

import type { MiddlewareHandler } from 'astro';
import { verifyJWT, verifyToken } from '@/lib/auth';
import type { AuthPayload } from '@/lib/auth';

// Extend Astro.Locals so TypeScript knows about `user`
declare global {
  namespace App {
    interface Locals {
      user?: AuthPayload;
    }
  }
}

const LOCALE_ADMIN_REGEX = /^\/(es|en|pt)\/(admin|api)/;

/**
 * Check if the request is for a protected admin route (excluding the login page).
 */
function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');
}

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { request, redirect, cookies, locals } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  // ---------------------------------------------------------------------------
  // Step 1 — Strip locale prefix from admin / API paths
  // ---------------------------------------------------------------------------
  const localeMatch = pathname.match(LOCALE_ADMIN_REGEX);
  if (localeMatch) {
    const cleanPath = pathname.replace(/^\/(es|en|pt)/, '');
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

    // Try JWT verification first
    const payload = await verifyJWT(token);

    if (payload) {
      locals.user = payload;
      return next();
    }

    // Fallback: legacy SHA-256 token (for users who haven't logged in again)
    const legacyValid = await verifyToken(token);

    if (!legacyValid) {
      return redirect('/admin/login', 302);
    }
  }

  return next();
};
