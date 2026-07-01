export const TABLAS = {
  USUARIOS: 'usuarios',
  CLIENTES: 'clientes',
  PRODUCTOS: 'productos',
  VARIANTES: 'variantes',
  LISTAS_PRECIO: 'listas_precio',
  BODEGAS: 'bodegas',
  ITEMS_INVENTARIO: 'items_inventario',
  NIVELES_INVENTARIO: 'niveles_inventario',
  GRAMOS_DISPONIBLES: 'gramos_disponibles',
  RESERVAS: 'reservas',
  TRANSFERENCIAS: 'transferencias',
  MOVIMIENTOS_INVENTARIO: 'movimientos_inventario',
  ORDENES: 'ordenes',
  ORDEN_ITEMS: 'orden_items',
  PAGOS: 'pagos',
  EVENTOS: 'eventos',
  NOTIFICACIONES: 'notificaciones',
} as const

export type NombreTabla = (typeof TABLAS)[keyof typeof TABLAS]
