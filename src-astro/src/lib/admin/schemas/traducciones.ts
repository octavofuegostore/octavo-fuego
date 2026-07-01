export const STATUS_LABELS: Record<string, { es: string; en: string; pt: string }> = {
  // estadosOrden
  'pendiente':   { es: 'Pendiente',   en: 'Pending',   pt: 'Pendente' },
  'confirmada':  { es: 'Confirmada',  en: 'Confirmed', pt: 'Confirmada' },
  'pagada':      { es: 'Pagada',      en: 'Paid',      pt: 'Paga' },
  'preparando':  { es: 'Preparando',  en: 'Preparing', pt: 'Preparando' },
  'enviada':     { es: 'Enviada',     en: 'Shipped',   pt: 'Enviada' },
  'entregada':   { es: 'Entregada',   en: 'Delivered', pt: 'Entregue' },
  'cancelada':   { es: 'Cancelada',   en: 'Cancelled', pt: 'Cancelada' },
  // estadosProducto
  'activo':      { es: 'Activo',      en: 'Active',    pt: 'Ativo' },
  'inactivo':    { es: 'Inactivo',    en: 'Inactive',  pt: 'Inativo' },
  'sin_stock':   { es: 'Sin stock',   en: 'Out of stock', pt: 'Sem estoque' },
  // b2b
  'aprobado':    { es: 'Aprobado',    en: 'Approved',  pt: 'Aprovado' },
  'rechazado':   { es: 'Rechazado',   en: 'Rejected',  pt: 'Rejeitado' },
  // estadosPago
  'procesando':  { es: 'Procesando',  en: 'Processing', pt: 'Processando' },
  'fallido':     { es: 'Fallido',     en: 'Failed',    pt: 'Falhou' },
  'reembolsado': { es: 'Reembolsado', en: 'Refunded',  pt: 'Reembolsado' },
}

export function getStatusLabel(value: string, locale: 'es' | 'en' | 'pt'): string {
  const entry = STATUS_LABELS[value]
  if (!entry) return value
  return entry[locale]
}

export type AllStatusValues =
  | 'pendiente' | 'confirmada' | 'pagada' | 'preparando' | 'enviada' | 'entregada' | 'cancelada'
  | 'activo' | 'inactivo' | 'sin_stock'
  | 'aprobado' | 'rechazado'
  | 'procesando' | 'fallido' | 'reembolsado'
