import type { APIRoute } from 'astro'
import { verifyJWT } from '@/lib/auth'
import { crearOrdenServicio } from '@/lib/admin/domain/servicios/orden-servicio'
import {
  computeOrdenesPorEstado,
  computeTendenciaIngresos,
  computeTopProductos,
} from '@/lib/admin/dashboard/chart-data'

export const prerender = false

/**
 * Map a period query param (1m|3m|12m) to:
 *  - the chart-data period key
 *  - the Date cutoff (desde)
 */
function parsePeriodo(periodo: string | null): { chartPeriod: string; desde: Date; hasta: Date } | null {
  const now = new Date()
  const hasta = new Date(now)

  switch (periodo) {
    case '1m': {
      const desde = new Date(now)
      desde.setMonth(now.getMonth() - 1)
      return { chartPeriod: 'mes', desde, hasta }
    }
    case '3m': {
      const desde = new Date(now)
      desde.setMonth(now.getMonth() - 3)
      return { chartPeriod: 'trimestre', desde, hasta }
    }
    case '12m': {
      const desde = new Date(now)
      desde.setFullYear(now.getFullYear() - 1)
      return { chartPeriod: 'ano', desde, hasta }
    }
    default:
      return null
  }
}

/**
 * Adapt a domain Orden to the shape expected by chart-data functions.
 * Domain: creadoEn, estado, items[].nombre/cantidad
 * Chart:  createdAt, status, items[].name/quantity
 */
function adaptForCharts(orden: {
  creadoEn: string
  total: number
  estado: string
  items: Array<{ nombre: string; cantidad: number; precioUnit: number }>
}): {
  createdAt: string
  total: number
  status: string
  items: Array<{ name: string; quantity: number; price: number }>
} {
  return {
    createdAt: orden.creadoEn,
    total: orden.total,
    status: orden.estado,
    items: orden.items.map((i) => ({
      name: i.nombre,
      quantity: i.cantidad,
      price: i.precioUnit,
    })),
  }
}

/** Torta segment colors — matches the existing palette */
const TORTA_COLORS = [
  '#8B4513', '#C4956A', '#5A4D3F', '#3D2E22', '#6D5E4D', '#A0845C', '#E8D5B7',
]

export const GET: APIRoute = async ({ request, cookies }) => {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const token = cookies.get('of_admin_token')?.value
  const user = await verifyJWT(token)
  if (!user) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // ── Parse period ──────────────────────────────────────────────────────────
  const url = new URL(request.url)
  const periodo = url.searchParams.get('periodo') || '1m'
  const parsed = parsePeriodo(periodo)
  if (!parsed) {
    return new Response(
      JSON.stringify({ error: 'Periodo inválido. Use 1m, 3m, o 12m.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    )
  }

  // ── Fetch orders ─────────────────────────────────────────────────────────
  const ordenSvc = crearOrdenServicio()
  let ordenes: Array<{
    creadoEn: string
    total: number
    estado: string
    items: Array<{ nombre: string; cantidad: number; precioUnit: number }>
  }>

  try {
    ordenes = await ordenSvc.listar({ desde: parsed.desde, hasta: parsed.hasta })
  } catch (err) {
    console.error('[API /dashboard] Error fetching orders:', err)
    return new Response(
      JSON.stringify({ error: 'Error al obtener órdenes' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }

  // ── Compute chart data ────────────────────────────────────────────────────
  const adapted = ordenes.map(adaptForCharts)

  const revenue = computeTendenciaIngresos(adapted, parsed.chartPeriod)
  const orders = computeOrdenesPorEstado(adapted, parsed.chartPeriod)
  const products = computeTopProductos(adapted, parsed.chartPeriod)

  // Add colors to orders chart (torta segments)
  const ordersWithColors = orders.map((o, i) => ({
    ...o,
    color: TORTA_COLORS[i % TORTA_COLORS.length],
  }))

  return new Response(
    JSON.stringify({
      revenue,
      orders: ordersWithColors,
      products,
      meta: {
        totalOrders: adapted.length,
        chartPeriod: parsed.chartPeriod,
      },
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  )
}
