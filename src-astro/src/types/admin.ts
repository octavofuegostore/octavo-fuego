// Admin module types for Octavo Fuego

export interface Cliente {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: 'CO' | 'BR';
  type: 'retail' | 'wholesale';
  status: 'active' | 'inactive';
  totalOrders: number;
  totalSpent: number;
  currency: string;
  lastOrder: string;
}

export interface Orden {
  id: string;
  customer: { name: string; email: string; phone: string };
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  channel: 'whatsapp' | 'web' | 'manual';
  location: 'CO-BOGOTA' | 'BR-ACRE';
  createdAt: string;
  updatedAt: string;
}

export interface Producto {
  id: string;
  name: string;
  sku: string;
  category: 'rapé' | 'sananga' | 'kuripe' | 'b2b';
  priceCOP: number;
  priceBRL: number;
  priceUSD: number;
  stockCO: number;
  stockBR: number;
  status: 'active' | 'inactive' | 'out_of_stock';
}

export interface Transaccion {
  id: string;
  descripcion: string;
  monto: number;
  tipo: 'ingreso' | 'egreso';
  categoria: string;
  fecha: string;
  estado: 'pending' | 'confirmed' | 'cancelled';
}

export interface KPI {
  label: string;
  value: number;
  previousValue?: number;
  trend?: 'up' | 'down' | 'neutral';
}

// ─── B2B / Solicitudes ─────────────────────────────────────────────────────────

export interface SolicitudB2B {
  id: string;
  cliente_id: string;
  nombre_empresa: string;
  nombre_contacto: string;
  email: string;
  telefono: string;
  tax_id: string;
  bodega_id: string;
  bodega_nombre?: string;
  notas: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  revisado_por: string | null;
  revision_notas: string | null;
  creado_en: string;
  revisado_en: string | null;
}

export interface SolicitudB2BDetail extends SolicitudB2B {
  cliente_nombre?: string;
  cliente_email?: string;
}

// ─── Eventos (Audit Trail) ─────────────────────────────────────────────────────

export interface Evento {
  id: string;
  bodega_id: string;
  tipo: string;
  payload: Record<string, unknown>;
  usuario_id: string | null;
  orden_id: string | null;
  creado_en: string;
}

// ─── Pagos ─────────────────────────────────────────────────────────────────────

export interface Pago {
  id: string;
  orden_id: string;
  bodega_id: string;
  metodo: 'wompi_link' | 'pix_qr' | 'pix_copia_cola';
  estado: 'pendiente' | 'procesando' | 'confirmado' | 'fallido' | 'reembolsado';
  monto: number;
  moneda: string;
  referencia_externa: string | null;
  metadata: Record<string, unknown>;
  creado_en: string;
  confirmado_en: string | null;
}

// ─── Notificaciones ────────────────────────────────────────────────────────────

export interface Notificacion {
  id: string;
  usuario_id: string;
  tipo: string;
  titulo: string;
  mensaje: string | null;
  link: string | null;
  leida: boolean;
  creado_en: string;
}
