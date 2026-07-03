/**
 * ContabilidadService — hexagonal Port & Adapter
 *
 * Single-file pattern: Port (interface) + 2 adapters (Supabase, Mock).
 * The factory chooses the implementation at construction time — zero branching
 * inside CRUD methods (ADR v2, rule 10: zero branching en servicios).
 *
 * Usage:
 *   import { crearContabilidadServicio } from './contabilidad-servicio'
 *   const svc = crearContabilidadServicio()
 *   const kpis = await svc.obtenerKPIs(7, 2026)
 */

import { supabase } from '@/lib/supabase'
import { ErrorSupabase } from '@/lib/admin/errores'
import type { TransaccionReal, CategoriaTransaccion, BarChartData, LineChartData } from '@/types/admin'

// ═══════════════════════════════════════════════════════════════════════════════
// Types (no domain entity exists yet — defined here for now)
// ═══════════════════════════════════════════════════════════════════════════════

export interface ContabilidadKPIs {
  ingresosMes: number
  egresosMes: number
  balance: number
}

export interface GraficasData {
  mensual: BarChartData[]
  evolucion: LineChartData[]
}

// ═══════════════════════════════════════════════════════════════════════════════
// Port
// ═══════════════════════════════════════════════════════════════════════════════

export interface IContabilidadServicio {
  listarTransacciones(
    page?: number,
    pageSize?: number,
    filters?: { tipo?: string; categoria?: string; fechaDesde?: string; fechaHasta?: string },
  ): Promise<{ data: TransaccionReal[]; total: number }>
  obtenerKPIs(mes: number, año: number): Promise<ContabilidadKPIs>
  obtenerGraficas(año: number): Promise<GraficasData>
  obtenerCategorias(): Promise<CategoriaTransaccion[]>
}

// ═══════════════════════════════════════════════════════════════════════════════
// Adapter: Supabase (real implementation)
// ═══════════════════════════════════════════════════════════════════════════════

export class SupabaseContabilidadServicio implements IContabilidadServicio {
  async obtenerKPIs(mes: number, año: number): Promise<ContabilidadKPIs> {
    const { data, error } = await supabase
      .from('transacciones')
      .select('tipo, monto')
      .gte('fecha', new Date(año, mes - 1, 1).toISOString().split('T')[0])
      .lt('fecha', new Date(año, mes, 1).toISOString().split('T')[0])

    if (error) throw new ErrorSupabase('Error al obtener KPIs', error)

    const ingresosMes = (data ?? [])
      .filter((t: { tipo: string }) => t.tipo === 'ingreso')
      .reduce((sum: number, t: { monto: number }) => sum + Number(t.monto), 0)
    const egresosMes = (data ?? [])
      .filter((t: { tipo: string }) => t.tipo === 'egreso')
      .reduce((sum: number, t: { monto: number }) => sum + Number(t.monto), 0)

    return { ingresosMes, egresosMes, balance: ingresosMes - egresosMes }
  }

  async obtenerGraficas(año: number): Promise<GraficasData> {
    const { data, error } = await supabase
      .from('transacciones')
      .select('tipo, monto, fecha')
      .gte('fecha', `${año}-01-01`)
      .lt('fecha', `${año + 1}-01-01`)

    if (error) throw new ErrorSupabase('Error al obtener datos para gráficas', error)

    const mesNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

    // Bar chart data (ingresos vs egresos per month)
    const mensual: BarChartData[] = mesNames.map((label) => ({ label, ingreso: 0, egreso: 0 }))

    // Line chart data (net balance per month)
    const evolucion: LineChartData[] = mesNames.map((label) => ({ label, value: 0 }))

    for (const t of data ?? []) {
      const d = new Date(t.fecha)
      const mesIdx = d.getMonth()
      if (t.tipo === 'ingreso') {
        mensual[mesIdx].ingreso += Number(t.monto)
        evolucion[mesIdx].value += Number(t.monto)
      } else {
        mensual[mesIdx].egreso += Number(t.monto)
        evolucion[mesIdx].value -= Number(t.monto)
      }
    }

    return { mensual, evolucion }
  }

  async listarTransacciones(
    page: number = 1,
    pageSize: number = 20,
    filters?: { tipo?: string; categoria?: string; fechaDesde?: string; fechaHasta?: string },
  ): Promise<{ data: TransaccionReal[]; total: number }> {
    let query = supabase
      .from('transacciones')
      .select('*, categorias_transaccion: categoria_id (nombre)', { count: 'exact' })

    if (filters?.tipo) {
      query = query.eq('tipo', filters.tipo.toLowerCase())
    }
    if (filters?.categoria) {
      const { data: cat, error: catError } = await supabase
        .from('categorias_transaccion')
        .select('id')
        .ilike('nombre', filters.categoria)
        .maybeSingle()

      if (!catError && cat) {
        query = query.eq('categoria_id', cat.id)
      }
    }
    if (filters?.fechaDesde) {
      query = query.gte('fecha', filters.fechaDesde)
    }
    if (filters?.fechaHasta) {
      query = query.lt('fecha', filters.fechaHasta)
    }

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.order('fecha', { ascending: false }).range(from, to)

    const { data, error, count } = await query

    if (error) throw new ErrorSupabase('Error al listar transacciones', error)

    const transacciones: TransaccionReal[] = ((data ?? []) as Record<string, unknown>[]).map((row) => ({
      id: row.id as string,
      fecha: row.fecha as string,
      descripcion: row.descripcion as string,
      categoria: ((row.categorias_transaccion as { nombre?: string })?.nombre) ?? 'Sin categoría',
      tipo: ((row.tipo as string) === 'ingreso' ? 'Ingreso' : 'Egreso') as 'Ingreso' | 'Egreso',
      monto: Number(row.monto),
      moneda: (row.moneda as string) ?? 'COP',
      metodo_pago: row.metodo_pago as string | undefined,
      orden_id: row.orden_id as string | undefined,
    }))

    return { data: transacciones, total: count ?? 0 }
  }

  async obtenerCategorias(): Promise<CategoriaTransaccion[]> {
    const { data: categorias, error: catError } = await supabase
      .from('categorias_transaccion')
      .select('id, nombre, tipo')
      .eq('activa', true)
      .order('nombre')

    if (catError) throw new ErrorSupabase('Error al obtener categorías', catError)

    const catIds = (categorias ?? []).map((c: { id: string }) => c.id)
    const { data: subs, error: subsError } = await supabase
      .from('subcategorias_transaccion')
      .select('categoria_id, nombre')
      .eq('activa', true)
      .in('categoria_id', catIds.length > 0 ? catIds : [''])
      .order('nombre')

    if (subsError) throw new ErrorSupabase('Error al obtener subcategorías', subsError)

    const subsByCat = new Map<string, string[]>()
    for (const s of subs ?? []) {
      const list = subsByCat.get(s.categoria_id) ?? []
      list.push(s.nombre)
      subsByCat.set(s.categoria_id, list)
    }

    return (categorias ?? []).map((c: { id: string; nombre: string; tipo: string }) => ({
      id: c.id,
      nombre: c.nombre,
      tipo: c.tipo as 'ingreso' | 'egreso',
      subcategorias: subsByCat.get(c.id) ?? [],
    }))
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Adapter: Mock (for development / no-Supabase environments)
// ═══════════════════════════════════════════════════════════════════════════════

export class MockContabilidadServicio implements IContabilidadServicio {
  async obtenerKPIs(_mes: number, _año: number): Promise<ContabilidadKPIs> {
    return {
      ingresosMes: 12500000,
      egresosMes: 4800000,
      balance: 7700000,
    }
  }

  async obtenerGraficas(año: number): Promise<GraficasData> {
    const mesNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

    const ingresosBase = [8500000, 9200000, 7800000, 10500000, 11200000, 12500000]
    const egresosBase = [3200000, 3500000, 2800000, 4100000, 4500000, 4800000]

    const mensual: BarChartData[] = mesNames.map((label, i) => {
      // First 6 months use base data; rest extrapolates with small growth
      const factor = i < 6 ? 1 : 1 + (i - 5) * 0.08
      return {
        label,
        ingreso: Math.round((ingresosBase[Math.min(i, 5)] ?? 8500000) * factor),
        egreso: Math.round((egresosBase[Math.min(i, 5)] ?? 3200000) * factor),
      }
    })

    const evolucion: LineChartData[] = mensual.map((m, i) => ({
      label: m.label,
      value: i === 0
        ? m.ingreso - m.egreso
        : (mensual[i - 1].ingreso - mensual[i - 1].egreso) + (m.ingreso - m.egreso),
    }))

    return { mensual, evolucion }
  }

  async listarTransacciones(
    page: number = 1,
    pageSize: number = 20,
    _filters?: { tipo?: string; categoria?: string; fechaDesde?: string; fechaHasta?: string },
  ): Promise<{ data: TransaccionReal[]; total: number }> {
    const allTransacciones: TransaccionReal[] = MockContabilidadServicio._generarTransacciones()
    const filtered = allTransacciones

    const start = (page - 1) * pageSize
    const paged = filtered.slice(start, start + pageSize)

    return { data: paged, total: filtered.length }
  }

  async obtenerCategorias(): Promise<CategoriaTransaccion[]> {
    return [
      {
        id: 'MOCK-CAT-001',
        nombre: 'Ventas',
        tipo: 'ingreso',
        subcategorias: ['Ventas B2C', 'Ventas B2B', 'Ventas Mayoristas'],
      },
      {
        id: 'MOCK-CAT-002',
        nombre: 'Envios',
        tipo: 'ingreso',
        subcategorias: ['Envío Nacional', 'Envío Internacional'],
      },
      {
        id: 'MOCK-CAT-003',
        nombre: 'Proveedores',
        tipo: 'egreso',
        subcategorias: ['Tabaco', 'Materia Prima', 'Empaques'],
      },
      {
        id: 'MOCK-CAT-004',
        nombre: 'Operativos',
        tipo: 'egreso',
        subcategorias: ['Logística', 'Almacenamiento', 'Mantenimiento'],
      },
      {
        id: 'MOCK-CAT-005',
        nombre: 'Marketing',
        tipo: 'egreso',
        subcategorias: ['Redes Sociales', 'Google Ads', 'Influencers'],
      },
    ]
  }

  // ── Mock data ──────────────────────────────────────────────────────────────

  private static _generarTransacciones(): TransaccionReal[] {
    const transacciones: TransaccionReal[] = []
    const now = new Date()

    for (let i = 0; i < 25; i++) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const isIngreso = i % 3 !== 0
      const monto = isIngreso
        ? Math.round((150000 + Math.random() * 850000) / 1000) * 1000
        : Math.round((50000 + Math.random() * 300000) / 1000) * 1000

      transacciones.push({
        id: `MOCK-TRX-${String(i + 1).padStart(3, '0')}`,
        fecha: date.toISOString().split('T')[0],
        descripcion: isIngreso
          ? `Venta #${1000 + i}`
          : `Pago proveedor ${['Tabaco', 'Empaques', 'Logística'][i % 3]}`,
        categoria: isIngreso ? 'Ventas' : ['Proveedores', 'Operativos', 'Marketing'][i % 3],
        tipo: isIngreso ? 'Ingreso' : 'Egreso',
        monto,
        moneda: i % 5 === 0 ? 'BRL' : 'COP',
        metodo_pago: isIngreso ? 'transferencia' : 'pix',
        orden_id: isIngreso ? `MOCK-ORD-${String(1000 + i)}` : undefined,
      })
    }

    return transacciones
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Factory
// ═══════════════════════════════════════════════════════════════════════════════

import { SUPABASE_CONFIGURED } from './config'

/**
 * Factory: returns MockContabilidadServicio when Supabase is not configured,
 * SupabaseContabilidadServicio otherwise. Zero branching inside the returned
 * instance — the decision is made once at construction time.
 */
export function crearContabilidadServicio(): IContabilidadServicio {
  return SUPABASE_CONFIGURED
    ? new SupabaseContabilidadServicio()
    : new MockContabilidadServicio()
}
