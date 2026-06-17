/**
 * Auth middleware for admin routes
 * Protects /admin/* routes by checking for authentication
 */

import type { MiddlewareHandler } from 'astro';

/**
 * Check if the request is for an admin route
 */
function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');
}

/**
 * Check if the user is authenticated
 * For now, this is a placeholder that always returns true
 * In production, this should check for a valid session token
 */
function isAuthenticated(_cookies: Map<string, string>): boolean {
  // TODO: Implement actual authentication check
  // This should verify the session token in cookies
  // For now, return true to allow access
  return true;
}

/**
 * Auth middleware
 */
export const onRequest: MiddlewareHandler = async ({ request, redirect }, next) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Skip auth for login page and API routes
  if (pathname === '/admin/login' || pathname.startsWith('/api/')) {
    return next();
  }

  // Check if this is an admin route
  if (isAdminRoute(pathname)) {
    // Get cookies from request
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = new Map(
      cookieHeader.split(';').map(cookie => {
        const [name, ...value] = cookie.trim().split('=');
        return [name, value.join('=')];
      })
    );

    // Check authentication
    if (!isAuthenticated(cookies)) {
      // Redirect to login page
      return redirect('/admin/login');
    }
  }

  return next();
};
