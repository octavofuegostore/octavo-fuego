import { z } from 'zod'

// ─── Ordenes ──────────────────────────────────────────────────────────────────

export const estadoOrdenSchema = z.enum([
  'pendiente', 'confirmada', 'pagada', 'preparando', 'enviada', 'entregada', 'cancelada',
], { errorMap: () => ({ message: 'Estado de orden no válido' }) })

export const canalOrdenSchema = z.enum(['whatsapp', 'web', 'manual'], {
  errorMap: () => ({ message: 'Canal no válido. Use: whatsapp, web o manual' }),
})

// ─── Productos ─────────────────────────────────────────────────────────────────

export const estadoProductoSchema = z.enum(['activo', 'inactivo', 'sin_stock'], {
  errorMap: () => ({ message: 'Estado de producto no válido' }),
})

// ─── B2B ───────────────────────────────────────────────────────────────────────

export const b2bEstadoSchema = z.enum(['retail', 'pendiente', 'aprobado', 'rechazado'], {
  errorMap: () => ({ message: 'Estado B2B no válido' }),
})

// ─── Roles ─────────────────────────────────────────────────────────────────────

export const roleSchema = z.enum(['admin', 'b2b_client', 'viewer'], {
  errorMap: () => ({ message: 'Rol no válido' }),
})

// ─── Pagos ─────────────────────────────────────────────────────────────────────

export const metodoPagoSchema = z.enum(['wompi_link', 'pix_qr', 'pix_copia_cola'], {
  errorMap: () => ({ message: 'Método de pago no válido' }),
})

export const estadoPagoSchema = z.enum(['pendiente', 'procesando', 'confirmado', 'fallido', 'reembolsado'], {
  errorMap: () => ({ message: 'Estado de pago no válido' }),
})

export const monedaSchema = z.enum(['COP', 'BRL', 'USD'], {
  errorMap: () => ({ message: 'Moneda no válida' }),
})
