import { supabase } from '@/lib/supabase'
import { ProductoService } from '@/lib/admin/services/productos'
import { OrdenService } from '@/lib/admin/services/ordenes'
import { ClienteService } from '@/lib/admin/services/clientes'
import { PagoService } from '@/lib/admin/services/pagos'
import { ContabilidadService } from '@/lib/admin/services/contabilidad'
import { eventBus } from '@/lib/admin/eventos'
import { setAdminUser, clearAdminUser } from '@/stores/admin'
// Domain services (hexagonal port-adapter pattern)
export { crearProductoServicio } from '@/lib/admin/domain/servicios/producto-servicio'
export type { IProductoServicio } from '@/lib/admin/domain/servicios/producto-servicio'
export { crearOrdenServicio } from '@/lib/admin/domain/servicios/orden-servicio'
export type { IOrdenServicio } from '@/lib/admin/domain/servicios/orden-servicio'
export { crearClienteServicio } from '@/lib/admin/domain/servicios/cliente-servicio'
export type { IClienteServicio } from '@/lib/admin/domain/servicios/cliente-servicio'
export { crearPagoServicio } from '@/lib/admin/domain/servicios/pago-servicio'
export type { IPagoServicio } from '@/lib/admin/domain/servicios/pago-servicio'
export { crearContabilidadServicio } from '@/lib/admin/domain/servicios/contabilidad-servicio'
export type { IContabilidadServicio } from '@/lib/admin/domain/servicios/contabilidad-servicio'


// ── SSR Cache ──────────────────────────────────────────────────────────────
const ssrCache = new Map<string, { data: unknown; expiresAt: number }>()
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

/**
 * Genera una key única para cache usando namespace + params.
 * Previene colisiones entre distintos servicios que usen el mismo key.
 */
export function cacheKey(namespace: string, params?: Record<string, unknown>): string {
  if (!params) return namespace
  const sorted = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&')
  return `${namespace}:${sorted}`
}

/**
 * Wraps an async SSR query with in-memory caching.
 * Cache resets on Vercel cold start (acceptable — warm instance is normal).
 * Usar con cacheKey() para evitar colisiones:
 * @example conCache(cacheKey('ordenes', { estado: 'pendiente', limit: 10 }), () => svc.ordenes.listar(...))
 */
export function conCache<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const hit = ssrCache.get(key)
  if (hit && Date.now() < hit.expiresAt) {
    return Promise.resolve(hit.data as T)
  }
  return fn().then(data => {
    ssrCache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS })
    return data
  })
}

/** Clears entire SSR cache (useful for manual invalidation) */
export function limpiarCache(): void {
  ssrCache.clear()
}

// ── Legacy service factory ──────────────────────────────────────────────────
export function crearServicios(bodegaId?: string) {
  return {
    productos: new ProductoService(supabase, bodegaId),
    ordenes: new OrdenService(supabase, bodegaId),
    clientes: new ClienteService(supabase, bodegaId),
    pagos: new PagoService(supabase, bodegaId),
    contabilidad: new ContabilidadService(),
  }
}

export type Servicios = ReturnType<typeof crearServicios>

export function initAdminSession(user: { id: string; email: string; nombre: string; role: 'admin' | 'b2b_client' | 'viewer' }): void {
  setAdminUser(user)
}

export function endAdminSession(): void {
  clearAdminUser()
}
