// Admin service layer — centralizes mock data for all admin pages
import type { Cliente, Orden, Producto } from '@/types/admin';

// ─── Mock data — exact copy from existing pages ─────────────────────────────

const baseOrdenes: Orden[] = [
  { id: 'OF-2026-001', customer: { name: 'María García', email: 'maria@email.com', phone: '+57 300 123 4567' }, items: [{ name: 'Cera de Ducha - Cacao', quantity: 2, price: 45000 }], total: 125000, currency: 'COP', status: 'pending', channel: 'whatsapp', location: 'CO-BOGOTA', createdAt: '2026-06-16T10:30:00Z', updatedAt: '2026-06-16T10:30:00Z' },
  { id: 'OF-2026-002', customer: { name: 'João Silva', email: 'joao@email.com', phone: '+55 11 98765 4321' }, items: [{ name: 'Sabonete Artesanal 75g', quantity: 3, price: 89 }], total: 267, currency: 'BRL', status: 'confirmed', channel: 'web', location: 'BR-ACRE', createdAt: '2026-06-15T14:20:00Z', updatedAt: '2026-06-15T15:00:00Z' },
  { id: 'OF-2026-003', customer: { name: 'Andrés López', email: 'andres@email.com', phone: '+57 310 987 6543' }, items: [{ name: 'Pack 3 Jabones', quantity: 1, price: 120000 }], total: 120000, currency: 'COP', status: 'shipped', channel: 'whatsapp', location: 'CO-BOGOTA', createdAt: '2026-06-14T09:15:00Z', updatedAt: '2026-06-16T08:00:00Z' },
  { id: 'OF-2026-004', customer: { name: 'Sarah Johnson', email: 'sarah@email.com', phone: '+1 555 123 4567' }, items: [{ name: 'Candle Collection', quantity: 1, price: 89 }], total: 89, currency: 'USD', status: 'delivered', channel: 'web', location: 'BR-ACRE', createdAt: '2026-06-13T16:45:00Z', updatedAt: '2026-06-15T12:00:00Z' },
  { id: 'OF-2026-005', customer: { name: 'Lucas Fernandes', email: 'lucas@email.com', phone: '+55 21 91234 5678' }, items: [{ name: 'Cera de Ducha 100g', quantity: 2, price: 89 }], total: 178, currency: 'BRL', status: 'pending', channel: 'manual', location: 'BR-ACRE', createdAt: '2026-06-12T11:00:00Z', updatedAt: '2026-06-12T11:00:00Z' },
];

const mockOrdenes: Orden[] = [
  ...baseOrdenes,
  ...Array.from({ length: 43 }, (_, i) => ({
    id: `OF-2026-${String(i + 6).padStart(3, '0')}`,
    customer: { name: `Cliente ${i + 6}`, email: `cliente${i + 6}@email.com`, phone: `+57 300 ${1000 + i}` },
    items: [{ name: 'Producto demo', quantity: 1, price: 50000 }],
    total: 50000 + Math.floor(Math.random() * 100000),
    currency: 'COP',
    status: (['pending', 'confirmed', 'shipped', 'delivered'] as const)[i % 4] as Orden['status'],
    channel: (['whatsapp', 'web', 'manual'] as const)[i % 3] as Orden['channel'],
    location: (i % 2 === 0 ? 'CO-BOGOTA' : 'BR-ACRE') as Orden['location'],
    createdAt: new Date(2026, 5, 1 + (i % 16)).toISOString(),
    updatedAt: new Date(2026, 5, 1 + (i % 16)).toISOString(),
  })),
];

const mockClientes: Cliente[] = [
  { id: '1', name: 'María García', email: 'maria@email.com', phone: '+57 300 123 4567', location: 'CO', type: 'retail', status: 'active', totalOrders: 5, totalSpent: 225000, currency: 'COP', lastOrder: '2026-06-16' },
  { id: '2', name: 'João Silva', email: 'joao@email.com', phone: '+55 11 98765 4321', location: 'BR', type: 'wholesale', status: 'active', totalOrders: 12, totalSpent: 106800, currency: 'BRL', lastOrder: '2026-06-15' },
  { id: '3', name: 'Andrés López', email: 'andres@email.com', phone: '+57 310 987 6543', location: 'CO', type: 'retail', status: 'active', totalOrders: 3, totalSpent: 360000, currency: 'COP', lastOrder: '2026-06-14' },
  { id: '4', name: 'Sarah Johnson', email: 'sarah@email.com', phone: '+1 555 123 4567', location: 'US', type: 'retail', status: 'active', totalOrders: 2, totalSpent: 17800, currency: 'USD', lastOrder: '2026-06-13' },
  { id: '5', name: 'Lucas Fernandes', email: 'lucas@email.com', phone: '+55 21 91234 5678', location: 'BR', type: 'wholesale', status: 'active', totalOrders: 8, totalSpent: 71200, currency: 'BRL', lastOrder: '2026-06-12' },
  ...Array.from({ length: 150 }, (_, i) => ({
    id: String(i + 6),
    name: `Cliente ${i + 6}`,
    email: `cliente${i + 6}@email.com`,
    phone: `+57 300 ${1000 + i}`,
    location: (['CO', 'BR', 'US', 'EU'] as const)[i % 4] as Cliente['location'],
    type: (i % 3 === 0 ? 'wholesale' : 'retail') as 'retail' | 'wholesale',
    status: (i % 10 === 0 ? 'inactive' : 'active') as 'active' | 'inactive',
    totalOrders: Math.floor(Math.random() * 20),
    totalSpent: Math.floor(Math.random() * 500000),
    currency: 'COP',
    lastOrder: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  })),
];

const mockProductos: Producto[] = [
  { id: '1', name: 'Cera de Ducha - Cacao', sku: 'CD-CA-100', category: 'Cera de Ducha', priceCOP: 45000, priceBRL: 89, priceUSD: 12, stockCO: 250, stockBR: 800, status: 'active' },
  { id: '2', name: 'Cera de Ducha - Vainilla', sku: 'CD-VA-100', category: 'Cera de Ducha', priceCOP: 45000, priceBRL: 89, priceUSD: 12, stockCO: 180, stockBR: 650, status: 'active' },
  { id: '3', name: 'Sabonete - Lavanda', sku: 'SL-75', category: 'Sabonete', priceCOP: 35000, priceBRL: 69, priceUSD: 9.5, stockCO: 400, stockBR: 15, status: 'active' },
  { id: '4', name: 'Sabonete - Avena', sku: 'SA-75', category: 'Sabonete', priceCOP: 35000, priceBRL: 69, priceUSD: 9.5, stockCO: 350, stockBR: 450, status: 'active' },
  { id: '5', name: 'Pack Regalo Premium', sku: 'PR-100', category: 'Packs', priceCOP: 120000, priceBRL: 239, priceUSD: 32, stockCO: 50, stockBR: 3, status: 'out_of_stock' },
  ...Array.from({ length: 19 }, (_, i) => ({
    id: String(i + 6),
    name: `Producto ${i + 6}`,
    sku: `SKU-${String(i + 6).padStart(3, '0')}`,
    category: ['Cera de Ducha', 'Sabonete', 'Packs', 'Accesorios'][i % 4],
    priceCOP: 30000 + Math.floor(Math.random() * 50000),
    priceBRL: 60 + Math.floor(Math.random() * 100),
    priceUSD: 8 + Math.floor(Math.random() * 15),
    stockCO: Math.floor(Math.random() * 500),
    stockBR: Math.floor(Math.random() * 500),
    status: (i % 5 === 0 ? 'inactive' : i % 7 === 0 ? 'out_of_stock' : 'active') as Producto['status'],
  })),
];

// ─── Service functions ───────────────────────────────────────────────────────

export function getOrdenes(): Orden[] {
  return mockOrdenes;
}

export function getClientes(): Cliente[] {
  return mockClientes;
}

export function getProductos(): Producto[] {
  return mockProductos;
}

export function getOrdenById(id: string): Orden | undefined {
  return mockOrdenes.find(o => o.id === id);
}

export function getClienteById(id: string): Cliente | undefined {
  return mockClientes.find(c => c.id === id);
}

export function getProductoById(id: string): Producto | undefined {
  return mockProductos.find(p => p.id === id);
}
