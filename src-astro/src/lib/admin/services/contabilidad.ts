/**
 * LEGACY — Re-exported from domain service (Port & Adapter).
 *
 * All logic now lives in `domain/servicios/contabilidad-servicio.ts`.
 * This file exists for backward compatibility only.
 *
 * @deprecated Import from `@/lib/admin/domain/servicios/contabilidad-servicio` directly.
 *   - Use `crearContabilidadServicio()` instead of `new ContabilidadService()`
 */

export {
  ContabilidadKPIs,
  GraficasData,
  IContabilidadServicio,
  SupabaseContabilidadServicio,
  MockContabilidadServicio,
  crearContabilidadServicio,
} from '../domain/servicios/contabilidad-servicio'

/** @deprecated Use `crearContabilidadServicio()` from domain service */
export const ContabilidadService = SupabaseContabilidadServicio
