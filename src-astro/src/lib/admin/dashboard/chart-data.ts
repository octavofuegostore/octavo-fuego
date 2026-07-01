import type { Orden } from '@/types/admin'

export interface ChartDataPoint {
  label: string
  value: number
}

function filterByPeriod(ordenes: Orden[], period: string): Orden[] {
  const now = new Date()
  const cutoff = new Date(now)
  if (period === 'mes') cutoff.setMonth(now.getMonth() - 1)
  else if (period === 'trimestre') cutoff.setMonth(now.getMonth() - 3)
  else if (period === 'ano') cutoff.setFullYear(now.getFullYear() - 1)
  return ordenes.filter(o => new Date(o.createdAt) >= cutoff)
}

export function computeOrdenesPorEstado(ordenes: Orden[], period = 'mes'): ChartDataPoint[] {
  const filtered = filterByPeriod(ordenes, period)
  const counts: Record<string, number> = {}
  for (const o of filtered) {
    counts[o.status] = (counts[o.status] ?? 0) + 1
  }
  return Object.entries(counts).map(([label, value]) => ({ label, value }))
}

export function computeTendenciaIngresos(ordenes: Orden[], period = 'mes'): ChartDataPoint[] {
  const filtered = filterByPeriod(ordenes, period)
  const monthly: Record<string, number> = {}
  for (const o of filtered) {
    const key = new Date(o.createdAt).toLocaleString('es-CO', { month: 'short', year: '2-digit' })
    monthly[key] = (monthly[key] ?? 0) + o.total
  }
  return Object.entries(monthly).map(([label, value]) => ({ label, value }))
}

export function computeTopProductos(ordenes: Orden[], period = 'mes'): ChartDataPoint[] {
  const filtered = filterByPeriod(ordenes, period)
  const productCounts: Record<string, number> = {}
  for (const o of filtered) {
    for (const item of o.items) {
      productCounts[item.name] = (productCounts[item.name] ?? 0) + item.quantity
    }
  }
  return Object.entries(productCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([label, value]) => ({ label, value }))
}

export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount)
}
