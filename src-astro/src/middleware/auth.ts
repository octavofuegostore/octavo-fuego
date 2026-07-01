/**
 * Auth middleware for admin routes.
 *
 * Composed via sequence():
 * 1. localeHandler — strips /es|en|pt/ prefix from admin/api routes
 * 2. authHandler — verifies of_admin_token cookie, gates actions
 */

import { defineMiddleware, sequence } from 'astro:middleware'
import { getActionContext } from 'astro:actions'
import { verifyJWT, verifyToken } from '@/lib/auth'
import type { AuthPayload } from '@/lib/auth'

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
const PUBLIC_PREFIXES = ['/api/']

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

  // Enforce auth on /admin/*
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = cookies.get('of_admin_token')?.value

    // Try JWT verification first
    const payload = await verifyJWT(token)
    if (payload) {
      locals.user = payload
      return next()
    }

    // Fallback: legacy SHA-256 token
    const legacyValid = await verifyToken(token)
    if (!legacyValid) {
      return redirect('/admin/login', 302)
    }
  }

  return next()
})

export const onRequest = sequence(localeHandler, authHandler)
