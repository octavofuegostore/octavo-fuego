/**
 * L-Medusa ↔ Admin type mapper.
 *
 * L-Medusa stores data in normalized form (niveles_inventario per bodega),
 * but the admin panel uses flat types (Producto.stockCO, stockBR).
 *
 * This mapper converts between the two representations so the admin UI
 * works with flat types while the backend uses normalized Supabase rows.
 */

import type { Cliente, Orden, Producto, Transaccion, SolicitudB2B, Pago, Evento, Notificacion } from '@/types/admin';

// ─── Mapper interface ─────────────────────────────────────────────────────────

export interface Mapper<TRow, TAdmin> {
  toAdmin(row: TRow): TAdmin
  toAdminList(rows: TRow[]): TAdmin[]
  toRow?(admin: TAdmin): Partial<TRow>
}

// ─── L-Medusa Row types (from the DB schema) ─────────────────────────────────

export interface LMProductoRow {
  id: string;
  slug: string;
  nombre_es: string;
  nombre_en: string;
  nombre_pt: string;
  descripcion_es: string | null;
  descripcion_en: string | null;
  descripcion_pt: string | null;
  tipo_venta: string; // 'retail' | 'both'
  activo: boolean;
}

export interface LMVarianteRow {
  id: string;
  producto_id: string;
  gramos: number;
  precio_cop: number;
  precio_brl: number | null;
  precio_usd: number | null;
  precio_cop_mayorista: number | null;
  precio_brl_mayorista: number | null;
  precio_usd_mayorista: number | null;
  sku: string;
  activo: boolean;
}

export interface LMNivelInventarioRow {
  item_id: string;
  bodega_id: string;
  gramos_stock: number;
  gramos_reserva: number;
  alerta_stock_bajo?: boolean;
}

export interface LMClienteRow {
  id: string;
  email: string;
  nombre_empresa: string | null;
  telefono: string | null;
  pais: string | null;
  grupo_id: string | null;
  b2b_estado: string;
  creado_en: string;
}

export interface LMOrdenRow {
  id: string;
  display_id: number;
  cliente_id: string | null;
  estado: string;
  total_cop: number | null;
  total_brl: number | null;
  total_usd: number | null;
  canal: string;
  bodega_id?: string | null;
  creado_en: string;
}

// ─── Mappers ─────────────────────────────────────────────────────────────────

// Cache: producto slug → nombre in each locale
function nombreProducto(
  row: LMProductoRow,
  locale: 'es' | 'en' | 'pt' = 'es',
): string {
  const key = `nombre_${locale}` as keyof LMProductoRow;
  return (row[key] as string) || row.nombre_es;
}

/**
 * Map L-Medusa producto + variantes + niveles_inventario to admin Producto.
 */
export function mapToAdminProducto(
  producto: LMProductoRow,
  variantes: LMVarianteRow[],
  niveles: LMNivelInventarioRow[],
  locale: 'es' | 'en' | 'pt' = 'es',
): Producto {
  // Take the smallest gramos variant for base pricing
  const baseVariant = variantes.reduce((min, v) =>
    v.gramos < min.gramos ? v : min,
  );

  // Sum stock per bodega
  const stockCO = niveles
    .filter((n) => n.bodega_id === 'CO-BOGOTA')
    .reduce((sum, n) => sum + n.gramos_stock - n.gramos_reserva, 0);

  const stockBR = niveles
    .filter((n) => n.bodega_id === 'BR-ACRE')
    .reduce((sum, n) => sum + n.gramos_stock - n.gramos_reserva, 0);

  const hasStock = stockCO > 0 || stockBR > 0;

  return {
    id: producto.id,
    name: nombreProducto(producto, locale),
    sku: baseVariant.sku,
    category: 'rapé', // L-Medusa doesn't have categories yet
    priceCOP: baseVariant.precio_cop,
    priceBRL: baseVariant.precio_brl || 0,
    priceUSD: baseVariant.precio_usd || 0,
    stockCO,
    stockBR,
    status:
      !producto.activo ? 'inactive' :
      !hasStock ? 'out_of_stock' :
      'active',
  };
}

/**
 * Map L-Medusa cliente row to admin Cliente.
 */
export function mapToAdminCliente(row: LMClienteRow): Cliente {
  return {
    id: row.id,
    name: row.nombre_empresa || row.email.split('@')[0],
    email: row.email,
    phone: row.telefono || '',
    location: (row.pais as Cliente['location']) || 'CO',
    type: row.b2b_estado === 'aprobado' ? 'wholesale' : 'retail',
    status: row.b2b_estado === 'rechazado' ? 'inactive' : 'active',
    totalOrders: 0, // Requires a separate query
    totalSpent: 0,
    currency: row.pais === 'BR' ? 'BRL' : 'COP',
    lastOrder: '',
  };
}

/**
 * Map L-Medusa orden row to admin Orden.
 */
export function mapToAdminOrden(row: LMOrdenRow): Orden {
  return {
    id: row.id,
    customer: { name: '', email: '', phone: '' }, // Requires client join
    items: [], // Requires items_orden join
    total: row.total_cop || row.total_brl || row.total_usd || 0,
    currency: row.total_cop ? 'COP' : row.total_brl ? 'BRL' : 'USD',
    status: row.estado as Orden['status'],
    channel: row.canal as Orden['channel'],
    location: (row.bodega_id as Orden['location']) || 'CO-BOGOTA',
    createdAt: row.creado_en,
    updatedAt: row.creado_en,
  };
}

// ─── B2B Mappers ──────────────────────────────────────────────────────────────

export interface LMSolicitudB2BRow {
  id: string;
  cliente_id: string;
  nombre_empresa: string;
  nombre_contacto: string;
  email: string;
  telefono: string | null;
  tax_id: string | null;
  bodega_id: string;
  notas: string | null;
  estado: string;
  revisado_por: string | null;
  revision_notas: string | null;
  creado_en: string;
  revisado_en: string | null;
}

export function mapToAdminSolicitud(
  row: LMSolicitudB2BRow,
  bodegaNombre?: string,
): SolicitudB2B {
  return {
    id: row.id,
    cliente_id: row.cliente_id,
    nombre_empresa: row.nombre_empresa,
    nombre_contacto: row.nombre_contacto,
    email: row.email,
    telefono: row.telefono || '',
    tax_id: row.tax_id || '',
    bodega_id: row.bodega_id,
    bodega_nombre: bodegaNombre,
    notas: row.notas || '',
    estado: row.estado as SolicitudB2B['estado'],
    revisado_por: row.revisado_por,
    revision_notas: row.revision_notas,
    creado_en: row.creado_en,
    revisado_en: row.revisado_en,
  };
}

// ─── Evento Mapper ────────────────────────────────────────────────────────────

export interface LMEventoRow {
  id: string;
  bodega_id: string;
  tipo: string;
  payload: Record<string, unknown>;
  usuario_id: string | null;
  orden_id: string | null;
  creado_en: string;
}

export function mapToAdminEvento(row: LMEventoRow): Evento {
  return {
    id: row.id,
    bodega_id: row.bodega_id,
    tipo: row.tipo,
    payload: row.payload,
    usuario_id: row.usuario_id,
    orden_id: row.orden_id,
    creado_en: row.creado_en,
  };
}

// ─── Pago Mapper ──────────────────────────────────────────────────────────────

export interface LMPagoRow {
  id: string;
  orden_id: string;
  bodega_id: string;
  metodo: string;
  estado: string;
  monto: number;
  moneda: string;
  referencia_externa: string | null;
  metadata: Record<string, unknown>;
  creado_en: string;
  confirmado_en: string | null;
}

export function mapToAdminPago(row: LMPagoRow): Pago {
  return {
    id: row.id,
    orden_id: row.orden_id,
    bodega_id: row.bodega_id,
    metodo: row.metodo as Pago['metodo'],
    estado: row.estado as Pago['estado'],
    monto: row.monto,
    moneda: row.moneda,
    referencia_externa: row.referencia_externa,
    metadata: row.metadata,
    creado_en: row.creado_en,
    confirmado_en: row.confirmado_en,
  };
}

// ─── Notificación Mapper ──────────────────────────────────────────────────────

export interface LMNotificacionRow {
  id: string;
  usuario_id: string;
  tipo: string;
  titulo: string;
  mensaje: string | null;
  link: string | null;
  leida: boolean;
  creado_en: string;
}

export function mapToAdminNotificacion(row: LMNotificacionRow): Notificacion {
  return {
    id: row.id,
    usuario_id: row.usuario_id,
    tipo: row.tipo,
    titulo: row.titulo,
    mensaje: row.mensaje,
    link: row.link,
    leida: row.leida,
    creado_en: row.creado_en,
  };
}

// ─── Mapper Registry ──────────────────────────────────────────────────────────

export const ClienteMapper: Mapper<LMClienteRow, Cliente> = {
  toAdmin: mapToAdminCliente,
  toAdminList: (rows) => rows.map(mapToAdminCliente),
}

export const OrdenMapper: Mapper<LMOrdenRow, Orden> = {
  toAdmin: mapToAdminOrden,
  toAdminList: (rows) => rows.map(mapToAdminOrden),
}

export const EventoMapper: Mapper<LMEventoRow, Evento> = {
  toAdmin: mapToAdminEvento,
  toAdminList: (rows) => rows.map(mapToAdminEvento),
}

export const PagoMapper: Mapper<LMPagoRow, Pago> = {
  toAdmin: mapToAdminPago,
  toAdminList: (rows) => rows.map(mapToAdminPago),
}

export const NotificacionMapper: Mapper<LMNotificacionRow, Notificacion> = {
  toAdmin: mapToAdminNotificacion,
  toAdminList: (rows) => rows.map(mapToAdminNotificacion),
}

export const SolicitudB2BMapper: Mapper<LMSolicitudB2BRow, SolicitudB2B> = {
  toAdmin: mapToAdminSolicitud,
  toAdminList: (rows) => rows.map(r => mapToAdminSolicitud(r)),
}

export interface ProductoMapperContext {
  producto: LMProductoRow
  variantes: LMVarianteRow[]
  niveles: LMNivelInventarioRow[]
  locale?: 'es' | 'en' | 'pt'
}

export const ProductoMapper = {
  toAdmin(ctx: ProductoMapperContext): Producto {
    return mapToAdminProducto(ctx.producto, ctx.variantes, ctx.niveles, ctx.locale)
  },
  toAdminList(list: ProductoMapperContext[]): Producto[] {
    return list.map(ctx => this.toAdmin(ctx))
  },
}

export const MAPEADORES = {
  cliente: ClienteMapper,
  orden: OrdenMapper,
  producto: ProductoMapper,
  evento: EventoMapper,
  pago: PagoMapper,
  notificacion: NotificacionMapper,
  solicitudB2B: SolicitudB2BMapper,
} as const
