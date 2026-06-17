// Admin module types for Octavo Fuego

export interface Cliente {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: 'CO' | 'BR' | 'EU' | 'US';
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
  category: string;
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
