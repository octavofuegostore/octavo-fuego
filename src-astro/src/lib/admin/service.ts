/**
 * Admin service layer — async Supabase queries with mock fallback.
 *
 * When Supabase env vars are not configured, falls back to mock data.
 * All functions accept an optional `bodegaId` parameter for multi-warehouse.
 */

import { supabase } from '@/lib/supabase';
import type { Cliente, Orden, Producto, SolicitudB2B, Pago, Evento, Notificacion } from '@/types/admin';
import {
  mapToAdminCliente,
  mapToAdminOrden,
  mapToAdminProducto,
  mapToAdminSolicitud,
  mapToAdminEvento,
  mapToAdminPago,
  mapToAdminNotificacion,
} from './mapper';
import type {
  LMClienteRow, LMOrdenRow, LMProductoRow, LMVarianteRow, LMNivelInventarioRow,
  LMSolicitudB2BRow, LMEventoRow, LMPagoRow, LMNotificacionRow,
} from './mapper';

// ─── Constants ───────────────────────────────────────────────────────────────

const SUPABASE_CONFIGURED = !!(
  import.meta.env.PUBLIC_SUPABASE_URL &&
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY
);

// ─── Mock data (fallback when Supabase is not configured) ─────────────────────

const RAPES = ['Bobinsana', 'Kaxinawá', 'Nukini', 'Shawandawa', 'Katukina'] as const;
const SKU_PREFIXES = ['BOB', 'KAX', 'NUK', 'SHA', 'KAT'] as const;
const PESOS = [10, 20, 30] as const;
const PRECIO_COP = [35000, 70000, 100000] as const;
const PRECIO_BRL = [45, 89, 130] as const;
const PRECIO_USD = [9, 17, 25] as const;

const baseOrdenes: Orden[] = [
  { id: 'OF-2026-001', customer: { name: 'María García', email: 'maria@email.com', phone: '+57 300 123 4567' }, items: [{ name: 'Bobinsana Rapé 10g', quantity: 2, price: 35000 }], total: 70000, currency: 'COP', status: 'pending', channel: 'whatsapp', location: 'CO-BOGOTA', createdAt: '2026-06-16T10:30:00Z', updatedAt: '2026-06-16T10:30:00Z' },
  { id: 'OF-2026-002', customer: { name: 'João Silva', email: 'joao@email.com', phone: '+55 11 98765 4321' }, items: [{ name: 'Kaxinawá Rapé 20g', quantity: 1, price: 89 }], total: 89, currency: 'BRL', status: 'confirmed', channel: 'web', location: 'BR-ACRE', createdAt: '2026-06-15T14:20:00Z', updatedAt: '2026-06-15T15:00:00Z' },
  { id: 'OF-2026-003', customer: { name: 'Andrés López', email: 'andres@email.com', phone: '+57 310 987 6543' }, items: [{ name: 'Nukini Rapé 30g', quantity: 1, price: 100000 }], total: 100000, currency: 'COP', status: 'shipped', channel: 'whatsapp', location: 'CO-BOGOTA', createdAt: '2026-06-14T09:15:00Z', updatedAt: '2026-06-16T08:00:00Z' },
  { id: 'OF-2026-004', customer: { name: 'Ana Santos', email: 'ana@email.com', phone: '+55 21 91234 5678' }, items: [{ name: 'Shawandawa Rapé 10g', quantity: 2, price: 45 }], total: 90, currency: 'BRL', status: 'delivered', channel: 'web', location: 'BR-ACRE', createdAt: '2026-06-13T16:45:00Z', updatedAt: '2026-06-15T12:00:00Z' },
  { id: 'OF-2026-005', customer: { name: 'Lucas Fernandes', email: 'lucas@email.com', phone: '+55 21 91234 5679' }, items: [{ name: 'Katukina Rapé 20g', quantity: 2, price: 89 }], total: 178, currency: 'BRL', status: 'pending', channel: 'manual', location: 'BR-ACRE', createdAt: '2026-06-12T11:00:00Z', updatedAt: '2026-06-12T11:00:00Z' },
];

function generarMockOrdenes(): Orden[] {
  return [
    ...baseOrdenes,
    ...Array.from({ length: 43 }, (_, i) => {
      const pesoIdx = i % 3;
      const rapeIdx = i % 5;
      const currency = i % 2 === 0 ? 'COP' as const : 'BRL' as const;
      const price = currency === 'COP' ? PRECIO_COP[pesoIdx] : PRECIO_BRL[pesoIdx];
      return {
        id: `OF-2026-${String(i + 6).padStart(3, '0')}`,
        customer: { name: `Cliente ${i + 6}`, email: `cliente${i + 6}@email.com`, phone: `+57 300 ${1000 + i}` },
        items: [{ name: `${RAPES[rapeIdx]} Rapé ${PESOS[pesoIdx]}g`, quantity: 1, price }],
        total: price + Math.floor(Math.random() * (currency === 'COP' ? 50000 : 50)),
        currency,
        status: (['pending', 'confirmed', 'shipped', 'delivered'] as const)[i % 4],
        channel: (['whatsapp', 'web', 'manual'] as const)[i % 3],
        location: (i % 2 === 0 ? 'CO-BOGOTA' : 'BR-ACRE') as Orden['location'],
        createdAt: new Date(2026, 5, 1 + (i % 16)).toISOString(),
        updatedAt: new Date(2026, 5, 1 + (i % 16)).toISOString(),
      };
    }),
  ];
}

function generarMockClientes(): Cliente[] {
  return [
    { id: '1', name: 'María García', email: 'maria@email.com', phone: '+57 300 123 4567', location: 'CO', type: 'retail', status: 'active', totalOrders: 5, totalSpent: 225000, currency: 'COP', lastOrder: '2026-06-16' },
    { id: '2', name: 'João Silva', email: 'joao@email.com', phone: '+55 11 98765 4321', location: 'BR', type: 'wholesale', status: 'active', totalOrders: 12, totalSpent: 106800, currency: 'BRL', lastOrder: '2026-06-15' },
    { id: '3', name: 'Andrés López', email: 'andres@email.com', phone: '+57 310 987 6543', location: 'CO', type: 'retail', status: 'active', totalOrders: 3, totalSpent: 360000, currency: 'COP', lastOrder: '2026-06-14' },
    { id: '4', name: 'Ana Santos', email: 'ana@email.com', phone: '+55 21 91234 5678', location: 'BR', type: 'retail', status: 'active', totalOrders: 2, totalSpent: 9000, currency: 'BRL', lastOrder: '2026-06-13' },
    { id: '5', name: 'Lucas Fernandes', email: 'lucas@email.com', phone: '+55 21 91234 5679', location: 'BR', type: 'wholesale', status: 'active', totalOrders: 8, totalSpent: 71200, currency: 'BRL', lastOrder: '2026-06-12' },
    ...Array.from({ length: 150 }, (_, i) => ({
      id: String(i + 6),
      name: `Cliente ${i + 6}`,
      email: `cliente${i + 6}@email.com`,
      phone: `+57 300 ${1000 + i}`,
      location: (i % 2 === 0 ? 'CO' : 'BR') as Cliente['location'],
      type: (i % 3 === 0 ? 'wholesale' : 'retail') as 'retail' | 'wholesale',
      status: (i % 10 === 0 ? 'inactive' : 'active') as 'active' | 'inactive',
      totalOrders: Math.floor(Math.random() * 20),
      totalSpent: Math.floor(Math.random() * 500000),
      currency: 'COP' as const,
      lastOrder: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    })),
  ];
}

export function generarMockProductos(): Producto[] {
  const productos: Producto[] = [];
  RAPES.forEach((rape, rapeIdx) => {
    PESOS.forEach((peso, pesoIdx) => {
      productos.push({
        id: `${SKU_PREFIXES[rapeIdx]}-${peso}`,
        name: `${rape} Rapé ${peso}g`,
        sku: `${SKU_PREFIXES[rapeIdx]}-${peso}`,
        category: 'rapé',
        priceCOP: PRECIO_COP[pesoIdx],
        priceBRL: PRECIO_BRL[pesoIdx],
        priceUSD: PRECIO_USD[pesoIdx],
        stockCO: 100 + Math.floor(Math.random() * 200),
        stockBR: 100 + Math.floor(Math.random() * 200),
        status: 'active' as const,
      });
    });
  });
  return [
    ...productos,
    ...Array.from({ length: 5 }, (_, i) => ({
      id: `DEMO-${String(i + 1).padStart(3, '0')}`,
      name: `Producto demo ${i + 1}`,
      sku: `DEMO-${String(i + 1).padStart(3, '0')}`,
      category: 'rapé',
      priceCOP: 30000 + Math.floor(Math.random() * 50000),
      priceBRL: 60 + Math.floor(Math.random() * 100),
      priceUSD: 8 + Math.floor(Math.random() * 15),
      stockCO: Math.floor(Math.random() * 500),
      stockBR: Math.floor(Math.random() * 500),
      status: (i % 5 === 0 ? 'inactive' : i % 7 === 0 ? 'out_of_stock' : 'active') as Producto['status'],
    })),
  ];
}

// ─── Service functions ───────────────────────────────────────────────────────

export async function getOrdenes(bodegaId?: string): Promise<Orden[]> {
  if (!SUPABASE_CONFIGURED) return generarMockOrdenes();

  let query = supabase
    .from('ordenes')
    .select('*')
    .order('creado_en', { ascending: false });

  if (bodegaId) {
    query = query.eq('bodega_id', bodegaId);
  }

  const { data, error } = await query.limit(200);

  if (error) {
    console.error('[service] Error fetching ordenes:', error.message);
    return generarMockOrdenes();
  }

  return (data as LMOrdenRow[]).map(mapToAdminOrden);
}

export async function getClientes(bodegaId?: string): Promise<Cliente[]> {
  if (!SUPABASE_CONFIGURED) return generarMockClientes();

  let query = supabase
    .from('clientes')
    .select('*')
    .order('creado_en', { ascending: false });

  if (bodegaId) {
    // Filter by clients whose orders reference this bodega
    query = query.eq('ordenes.bodega_id', bodegaId);
  }

  const { data, error } = await query.limit(200);

  if (error) {
    console.error('[service] Error fetching clientes:', error.message);
    return generarMockClientes();
  }

  return (data as LMClienteRow[]).map(mapToAdminCliente);
}

export async function getProductos(bodegaId?: string): Promise<Producto[]> {
  if (!SUPABASE_CONFIGURED) return generarMockProductos();

  const { data: productos, error: prodError } = await supabase
    .from('productos')
    .select('*')
    .order('slug');

  if (prodError || !productos) {
    console.error('[service] Error fetching productos:', prodError?.message);
    return generarMockProductos();
  }

  // For each producto, get variantes and niveles_inventario
  const result: Producto[] = [];

  for (const prod of productos as LMProductoRow[]) {
    const { data: variantes } = await supabase
      .from('variantes')
      .select('*')
      .eq('producto_id', prod.id);

    let query = supabase
      .from('niveles_inventario')
      .select('*, alerta_stock_bajo')
      .in('item_id', (variantes || []).map((v: LMVarianteRow) => v.id));

    if (bodegaId) {
      query = query.eq('bodega_id', bodegaId);
    }

    const { data: niveles } = await query;

    result.push(
      mapToAdminProducto(
        prod,
        (variantes || []) as LMVarianteRow[],
        (niveles || []) as LMNivelInventarioRow[],
      ),
    );
  }

  return result;
}

export async function getOrdenById(id: string): Promise<Orden | undefined> {
  if (!SUPABASE_CONFIGURED) return generarMockOrdenes().find(o => o.id === id);

  const { data, error } = await supabase
    .from('ordenes')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return undefined;
  return mapToAdminOrden(data as LMOrdenRow);
}

export async function getClienteById(id: string): Promise<Cliente | undefined> {
  if (!SUPABASE_CONFIGURED) return generarMockClientes().find(c => c.id === id);

  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return undefined;
  return mapToAdminCliente(data as LMClienteRow);
}

export async function getProductoById(id: string): Promise<Producto | undefined> {
  if (!SUPABASE_CONFIGURED) return generarMockProductos().find(p => p.id === id);

  const { data: prod, error: prodError } = await supabase
    .from('productos')
    .select('*')
    .eq('id', id)
    .single();

  if (prodError || !prod) return undefined;

  const { data: variantes } = await supabase
    .from('variantes')
    .select('*')
    .eq('producto_id', id);

  const { data: niveles } = await supabase
    .from('niveles_inventario')
    .select('*, alerta_stock_bajo')
    .in('item_id', (variantes || []).map((v: LMVarianteRow) => v.id));

  return mapToAdminProducto(
    prod as LMProductoRow,
    (variantes || []) as LMVarianteRow[],
    (niveles || []) as LMNivelInventarioRow[],
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// B2B — Solicitudes de aprobación mayorista
// ═══════════════════════════════════════════════════════════════════════════════

function generarMockSolicitudes(): SolicitudB2B[] {
  return [
    { id: '1', cliente_id: 'c1', nombre_empresa: 'Tienda Natural Bogotá', nombre_contacto: 'Carlos Méndez', email: 'carlos@tiendanatural.co', telefono: '+57 300 111 2233', tax_id: 'NIT 901.123.456-7', bodega_id: 'CO-BOGOTA', notas: 'Interesado en compras al por mayor de rapés', estado: 'pendiente', revisado_por: null, revision_notas: null, creado_en: '2026-06-14T09:00:00Z', revisado_en: null },
    { id: '2', cliente_id: 'c2', nombre_empresa: 'Ervanária do Acre', nombre_contacto: 'Pedro Alves', email: 'pedro@erbanaria.br', telefono: '+55 68 99999 8888', tax_id: 'CNPJ 12.345.678/0001-90', bodega_id: 'BR-ACRE', notas: 'Quiere distribuir en Rio Branco', estado: 'pendiente', revisado_por: null, revision_notas: null, creado_en: '2026-06-13T14:30:00Z', revisado_en: null },
    { id: '3', cliente_id: 'c3', nombre_empresa: 'Mercado Libre Colombia', nombre_contacto: 'Ana Martínez', email: 'ana@mercadolibre.co', telefono: '+57 310 444 5566', tax_id: 'NIT 890.987.654-3', bodega_id: 'CO-BOGOTA', notas: '', estado: 'aprobada', revisado_por: 'admin-uuid-1', revision_notas: 'Cliente verificado, aprobado para B2B', creado_en: '2026-06-10T11:00:00Z', revisado_en: '2026-06-11T09:00:00Z' },
    { id: '4', cliente_id: 'c4', nombre_empresa: 'Loja de Produtos Naturais', nombre_contacto: 'Luciana Santos', email: 'luciana@lojanatural.br', telefono: '+55 11 91234 5678', tax_id: 'CNPJ 98.765.432/0001-10', bodega_id: 'BR-ACRE', notas: 'Quiere comprar sabonetes y ceras', estado: 'rechazada', revisado_por: 'admin-uuid-1', revision_notas: 'Documentación incompleta', creado_en: '2026-06-08T16:00:00Z', revisado_en: '2026-06-09T10:00:00Z' },
    ...Array.from({ length: 8 }, (_, i) => ({
      id: String(i + 5),
      cliente_id: `c${i + 5}`,
      nombre_empresa: `Empresa ${i + 5}`,
      nombre_contacto: `Contacto ${i + 5}`,
      email: `contacto${i + 5}@empresa.com`,
      telefono: '+57 300 000 0000',
      tax_id: `NIT ${i + 5}.000.000-${i}`,
      bodega_id: (i % 2 === 0 ? 'CO-BOGOTA' : 'BR-ACRE') as SolicitudB2B['bodega_id'],
      notas: '',
      estado: (['pendiente', 'pendiente', 'aprobada'] as const)[i % 3] as SolicitudB2B['estado'],
      revisado_por: i % 3 === 0 ? null : 'admin-uuid-1',
      revision_notas: i % 3 === 0 ? null : 'Aprobado automáticamente',
      creado_en: new Date(2026, 5, 1 + i).toISOString(),
      revisado_en: i % 3 === 0 ? null : new Date(2026, 5, 2 + i).toISOString(),
    })),
  ];
}

export async function getSolicitudes(bodegaId?: string): Promise<SolicitudB2B[]> {
  if (!SUPABASE_CONFIGURED) return generarMockSolicitudes();

  let query = supabase.from('solicitudes_b2b').select('*, bodegas!inner(nombre)').order('creado_en', { ascending: false });

  if (bodegaId) query = query.eq('bodega_id', bodegaId);

  const { data, error } = await query.limit(100);
  if (error) { console.error('[service] Error fetching solicitudes:', error.message); return generarMockSolicitudes(); }

  return (data as LMSolicitudB2BRow[]).map((s) => mapToAdminSolicitud(s, (s as any).bodegas?.nombre));
}

export async function getSolicitudById(id: string): Promise<SolicitudB2B | undefined> {
  if (!SUPABASE_CONFIGURED) return generarMockSolicitudes().find(s => s.id === id);

  const { data, error } = await supabase.from('solicitudes_b2b').select('*, bodegas!inner(nombre)').eq('id', id).single();
  if (error || !data) return undefined;
  return mapToAdminSolicitud(data as LMSolicitudB2BRow, (data as any).bodegas?.nombre);
}

export async function aprobarSolicitud(id: string, usuarioId: string, notas?: string): Promise<boolean> {
  if (!SUPABASE_CONFIGURED) return true;

  const { error } = await supabase.rpc('aprobar_solicitud_b2b', {
    p_id: id,
    p_usuario_id: usuarioId,
    p_notas: notas || null,
  });

  if (error) { console.error('[service] Error approving solicitud:', error.message); return false; }
  return true;
}

export async function rechazarSolicitud(id: string, usuarioId: string, notas?: string): Promise<boolean> {
  if (!SUPABASE_CONFIGURED) return true;

  const { error } = await supabase.rpc('rechazar_solicitud_b2b', {
    p_id: id,
    p_usuario_id: usuarioId,
    p_notas: notas || null,
  });

  if (error) { console.error('[service] Error rejecting solicitud:', error.message); return false; }
  return true;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Eventos (Audit Trail)
// ═══════════════════════════════════════════════════════════════════════════════

function generarMockEventos(): Evento[] {
  const tipos = [
    'orden:creada', 'orden:pagada', 'orden:enviada',
    'b2b:solicitud:creada', 'b2b:solicitud:aprobada',
    'stock:actualizado', 'stock:bajo',
    'pago:recibido', 'pago:fallido',
  ];
  return Array.from({ length: 50 }, (_, i) => ({
    id: String(i + 1),
    bodega_id: (i % 2 === 0 ? 'CO-BOGOTA' : 'BR-ACRE') as Evento['bodega_id'],
    tipo: tipos[i % tipos.length],
    payload: { mock: true, index: i },
    usuario_id: i % 4 === 0 ? 'admin-uuid-1' : null,
    orden_id: i % 3 === 0 ? `OF-2026-${String(i + 1).padStart(3, '0')}` : null,
    creado_en: new Date(2026, 5, 15 - Math.floor(i / 3)).toISOString(),
  }));
}

export async function getEventos(bodegaId?: string, limit = 100): Promise<Evento[]> {
  if (!SUPABASE_CONFIGURED) return generarMockEventos();

  let query = supabase.from('eventos').select('*').order('creado_en', { ascending: false });
  if (bodegaId) query = query.eq('bodega_id', bodegaId);

  const { data, error } = await query.limit(limit);
  if (error) { console.error('[service] Error fetching eventos:', error.message); return generarMockEventos(); }
  return (data as LMEventoRow[]).map(mapToAdminEvento);
}

// ═══════════════════════════════════════════════════════════════════════════════
// Pagos
// ═══════════════════════════════════════════════════════════════════════════════

function generarMockPagos(): Pago[] {
  return Array.from({ length: 30 }, (_, i) => ({
    id: String(i + 1),
    orden_id: `OF-2026-${String(i + 1).padStart(3, '0')}`,
    bodega_id: (i % 2 === 0 ? 'CO-BOGOTA' : 'BR-ACRE') as Pago['bodega_id'],
    metodo: (i % 3 === 0 ? 'wompi_link' : i % 3 === 1 ? 'pix_qr' : 'pix_copia_cola') as Pago['metodo'],
    estado: (['pendiente', 'confirmado', 'fallido', 'reembolsado'] as const)[i % 4] as Pago['estado'],
    monto: Math.floor(Math.random() * 500000) + 10000,
    moneda: i % 2 === 0 ? 'COP' : 'BRL',
    referencia_externa: i % 2 === 0 ? `wompi_tx_${i}` : `pix_${i}`,
    metadata: { mock: true },
    creado_en: new Date(2026, 5, 1 + (i % 20)).toISOString(),
    confirmado_en: i % 4 === 0 ? null : new Date(2026, 5, 2 + (i % 20)).toISOString(),
  }));
}

export async function getPagos(bodegaId?: string): Promise<Pago[]> {
  if (!SUPABASE_CONFIGURED) return generarMockPagos();

  let query = supabase.from('pagos').select('*').order('creado_en', { ascending: false });
  if (bodegaId) query = query.eq('bodega_id', bodegaId);

  const { data, error } = await query.limit(200);
  if (error) { console.error('[service] Error fetching pagos:', error.message); return generarMockPagos(); }
  return (data as LMPagoRow[]).map(mapToAdminPago);
}

export async function getPagoById(id: string): Promise<Pago | undefined> {
  if (!SUPABASE_CONFIGURED) return generarMockPagos().find(p => p.id === id);

  const { data, error } = await supabase.from('pagos').select('*').eq('id', id).single();
  if (error || !data) return undefined;
  return mapToAdminPago(data as LMPagoRow);
}

// ═══════════════════════════════════════════════════════════════════════════════
// Notificaciones
// ═══════════════════════════════════════════════════════════════════════════════

function generarMockNotificaciones(): Notificacion[] {
  return [
    { id: '1', usuario_id: 'admin-uuid-1', tipo: 'nueva_orden', titulo: 'Nueva orden recibida', mensaje: 'OF-2026-001 — María García', link: '/admin/ordenes/OF-2026-001', leida: false, creado_en: '2026-06-16T10:30:00Z' },
    { id: '2', usuario_id: 'admin-uuid-1', tipo: 'solicitud_b2b', titulo: 'Solicitud B2B pendiente', mensaje: 'Tienda Natural Bogotá quiere ser mayorista', link: '/admin/clientes/b2b', leida: false, creado_en: '2026-06-16T09:00:00Z' },
    { id: '3', usuario_id: 'admin-uuid-1', tipo: 'stock_bajo', titulo: 'Stock bajo en BR-ACRE', mensaje: 'Nukini Rapé tiene solo 15g en BR-ACRE', link: '/admin/inventario/stock', leida: false, creado_en: '2026-06-16T08:00:00Z' },
    { id: '4', usuario_id: 'admin-uuid-1', tipo: 'pago_recibido', titulo: 'Pago confirmado', mensaje: 'OF-2026-002 — João Silva pagó R$ 267', link: '/admin/ordenes/OF-2026-002', leida: true, creado_en: '2026-06-15T15:00:00Z' },
    { id: '5', usuario_id: 'admin-uuid-1', tipo: 'nueva_orden', titulo: 'Orden enviada', mensaje: 'OF-2026-003 — Andrés López enviado', link: '/admin/ordenes/OF-2026-003', leida: true, creado_en: '2026-06-14T12:00:00Z' },
  ];
}

export async function getNotificaciones(usuarioId?: string): Promise<Notificacion[]> {
  if (!SUPABASE_CONFIGURED) return generarMockNotificaciones();

  let query = supabase.from('notificaciones').select('*').order('creado_en', { ascending: false });
  if (usuarioId) query = query.eq('usuario_id', usuarioId);

  const { data, error } = await query.limit(50);
  if (error) { console.error('[service] Error fetching notificaciones:', error.message); return generarMockNotificaciones(); }
  return (data as LMNotificacionRow[]).map(mapToAdminNotificacion);
}

export async function marcarNotificacionLeida(id: string): Promise<boolean> {
  if (!SUPABASE_CONFIGURED) return true;

  const { error } = await supabase.rpc('marcar_notificacion_leida', { p_notificacion_id: id });
  if (error) { console.error('[service] Error marking notification read:', error.message); return false; }
  return true;
}
