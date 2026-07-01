/**
 * Bodega cookie helpers for multi-warehouse support.
 *
 * The bodega selection is stored in a non-httpOnly cookie (`of_admin_bodega`)
 * so client-side JS (BodegaSwitcher) can read and set it.
 *
 * A value of '' or 'GLOBAL' means "all warehouses".
 */

import type { AstroCookies } from 'astro';

export type BodegaId = string; // 'CO-BOGOTA' | 'BR-ACRE' | etc.
export const BODEGA_GLOBAL = '';

export interface BodegaOption {
  id: BodegaId;
  codigo: string;
  nombre: string;
  pais: string;
}

/**
 * Known bodegas (hardcoded for now — will come from DB in Phase 1).
 */
export const BODEGAS: BodegaOption[] = [
  { id: 'CO-BOGOTA', codigo: 'CO-BOGOTA', nombre: 'Bogotá', pais: 'CO' },
  { id: 'BR-ACRE', codigo: 'BR-ACRE', nombre: 'Acre', pais: 'BR' },
];

/**
 * Read the currently selected bodega from cookies.
 * Returns `BODEGA_GLOBAL` ('') if no selection or "Todas las bodegas".
 */
export function getBodegaSeleccionada(cookies: AstroCookies): BodegaId {
  return cookies.get('of_admin_bodega')?.value || BODEGA_GLOBAL;
}

/**
 * Build a SQL filter clause for the selected bodega.
 * Returns an empty string for global access.
 */
export function filtroBodega(bodegaId: BodegaId): { bodega_id?: string } {
  if (!bodegaId || bodegaId === BODEGA_GLOBAL) return {};
  return { bodega_id: bodegaId };
}

/**
 * Resolve display info for a bodega ID.
 */
export function getBodegaInfo(bodegaId: BodegaId): BodegaOption | undefined {
  if (!bodegaId || bodegaId === BODEGA_GLOBAL) return undefined;
  return BODEGAS.find((b) => b.id === bodegaId || b.codigo === bodegaId);
}

/**
 * Check if a user has access to a specific bodega.
 * user.bodega_id = null means global access.
 */
export function userTieneAccesoABodega(
  userBodegaId: string | null | undefined,
  targetBodegaId: BodegaId,
): boolean {
  if (!userBodegaId) return true; // admin global
  return userBodegaId === targetBodegaId;
}
