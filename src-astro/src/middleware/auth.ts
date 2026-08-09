/**
 * Auth middleware for admin routes.
 *
 * Composed via sequence():
 * 1. llmsLoggerHandler — logs /llms.txt requests (pass-through)
 * 2. localeHandler — strips /es|en|pt/ prefix from admin/api routes
 * 3. authHandler — verifies of_admin_token cookie, gates actions
 */

import { defineMiddleware, sequence } from 'astro:middleware'
import { getActionContext } from 'astro:actions'
import { verifyJWT } from '@/lib/auth'
import type { AuthPayload, UserRole } from '@/lib/auth'

// Extend Astro.Locals so TypeScript knows about `user`
declare global {
  namespace App {
    interface Locals {
      user?: AuthPayload
    }
  }
}

const LOCALE_ADMIN_REGEX = /^\/(es|en|pt)\/(admin|api)/
const PUBLIC_ROUTES = ['/admin/login']
const PUBLIC_PREFIXES = ['/api/auth/']

// ─── RBAC: role → allowed route prefixes ───────────────────────────────
const ROLE_ROUTES: Record<string, UserRole[]> = {
  '/admin/clientes': ['admin', 'supervisor', 'bodeguero'],
  '/admin/contabilidad': ['admin', 'supervisor'],
  '/admin/configuracion': ['admin'],
  '/admin/inventario': ['admin', 'supervisor', 'bodeguero'],
  '/admin/ordenes': ['admin', 'supervisor'],
  '/admin/pagos': ['admin', 'supervisor'],
  '/admin/actividad': ['admin', 'supervisor'],
}

function checkRouteAccess(pathname: string, role: UserRole): boolean {
  // Dashboard (/admin) is accessible to all authenticated users
  if (pathname === '/admin') return true

  for (const [routePrefix, allowedRoles] of Object.entries(ROLE_ROUTES)) {
    if (pathname.startsWith(routePrefix)) {
      return allowedRoles.includes(role)
    }
  }

  // If the route isn't explicitly listed, default to admin-only
  return role === 'admin'
}

/**
 * Pass-through logger for /llms.txt requests.
 * Logs bot traffic information without blocking the request.
 */
const llmsLoggerHandler = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url)
  if (url.pathname === '/llms.txt') {
    console.log('[llms-bot]', {
      url: context.request.url,
      ua: context.request.headers.get('user-agent'),
      ts: new Date().toISOString(),
    })
  }
  return next()
})

const localeHandler = defineMiddleware(async (context, next) => {
  const { redirect } = context
  const pathname = new URL(context.request.url).pathname

  // Strip locale prefix from admin / API paths
  const localeMatch = pathname.match(LOCALE_ADMIN_REGEX)
  if (localeMatch) {
    const cleanPath = pathname.replace(/^\/(es|en|pt)/, '')
    return redirect(cleanPath, 302)
  }

  return next()
})

const authHandler = defineMiddleware(async (context, next) => {
  const { request, redirect, cookies, locals } = context
  const pathname = new URL(request.url).pathname

  // Skip auth for public routes
  if (PUBLIC_ROUTES.includes(pathname) || PUBLIC_PREFIXES.some(p => pathname.startsWith(p))) {
    return next()
  }

  // Gate Astro Actions to authenticated users
  const { action } = getActionContext(context)
  if (action) {
    const token = cookies.get('of_admin_token')?.value
    const payload = await verifyJWT(token)
    if (!payload) {
      return new Response('Unauthorized', { status: 403 })
    }
    locals.user = payload
    return next()
  }

  // Enforce auth + RBAC on /admin/*
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = cookies.get('of_admin_token')?.value

    // Verify JWT token
    const payload = await verifyJWT(token)
    if (!payload) {
      return redirect('/admin/login', 302)
    }
    locals.user = payload

    // RBAC: check role-based access
    if (!checkRouteAccess(pathname, payload.role)) {
      return new Response(
        JSON.stringify({ error: 'No autorizado — permisos insuficientes para esta sección' }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }
  }

  return next()
})

export const onRequest = sequence(llmsLoggerHandler, localeHandler, authHandler)
