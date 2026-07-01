import { supabase } from '@/lib/supabase'
import type { TransaccionReal, CategoriaTransaccion, BarChartData, LineChartData } from '@/types/admin'

export interface ContabilidadKPIs {
  ingresosMes: number
  egresosMes: number
  balance: number
}

export class ContabilidadService {
  async obtenerKPIs(mes: number, año: number): Promise<ContabilidadKPIs> {
    const { data, error } = await supabase
      .from('transacciones')
      .select('tipo, monto')
      .gte('fecha', `${año}-${String(mes).padStart(2, '0')}-01`)
      .lt('fecha', `${año}-${String(mes + 1).padStart(2, '0')}-01`)

    if (error) {
      console.error('Error al obtener KPIs:', error)
      return { ingresosMes: 0, egresosMes: 0, balance: 0 }
    }

    const ingresosMes = (data ?? [])
      .filter(t => t.tipo === 'ingreso')
      .reduce((sum, t) => sum + Number(t.monto), 0)
    const egresosMes = (data ?? [])
      .filter(t => t.tipo === 'egreso')
      .reduce((sum, t) => sum + Number(t.monto), 0)

    return { ingresosMes, egresosMes, balance: ingresosMes - egresosMes }
  }

  async obtenerGraficaMensual(año: number): Promise<BarChartData[]> {
    const months: BarChartData[] = []
    const mesNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

    for (let i = 0; i < 12; i++) {
      const { data } = await supabase
        .from('transacciones')
        .select('tipo, monto')
        .gte('fecha', `${año}-${String(i + 1).padStart(2, '0')}-01`)
        .lt('fecha', `${año}-${String(i + 2).padStart(2, '0')}-01`)

      const ingreso = (data ?? [])
        .filter(t => t.tipo === 'ingreso')
        .reduce((sum, t) => sum + Number(t.monto), 0)
      const egreso = (data ?? [])
        .filter(t => t.tipo === 'egreso')
        .reduce((sum, t) => sum + Number(t.monto), 0)

      months.push({ label: mesNames[i], ingreso, egreso })
    }

    return months
  }

  async obtenerEvolucionAnual(): Promise<LineChartData[]> {
    const mesNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    const currentYear = new Date().getFullYear()
    const result: LineChartData[] = []

    // Get data for last 3 years, but only show current year's data
    for (let i = 0; i < 12; i++) {
      const { data } = await supabase
        .from('transacciones')
        .select('tipo, monto')
        .gte('fecha', `${currentYear}-${String(i + 1).padStart(2, '0')}-01`)
        .lt('fecha', `${currentYear}-${String(i + 2).padStart(2, '0')}-01`)

      const ingresos = (data ?? [])
        .filter(t => t.tipo === 'ingreso')
        .reduce((sum, t) => sum + Number(t.monto), 0)
      const egresos = (data ?? [])
        .filter(t => t.tipo === 'egreso')
        .reduce((sum, t) => sum + Number(t.monto), 0)

      result.push({ label: mesNames[i], value: ingresos - egresos })
    }

    return result
  }

  async listarTransacciones(
    page: number = 1,
    pageSize: number = 20,
    filters?: { tipo?: string; categoria?: string; fechaDesde?: string; fechaHasta?: string }
  ): Promise<{ data: TransaccionReal[]; total: number }> {
    let query = supabase
      .from('transacciones')
      .select('*, categorias_transaccion: categoria_id (nombre)', { count: 'exact' })

    if (filters?.tipo) {
      query = query.eq('tipo', filters.tipo.toLowerCase())
    }
    if (filters?.categoria) {
      const { data: cat } = await supabase
        .from('categorias_transaccion')
        .select('id')
        .ilike('nombre', filters.categoria)
        .single()
      if (cat) {
        query = query.eq('categoria_id', cat.id)
      }
    }
    if (filters?.fechaDesde) {
      query = query.gte('fecha', filters.fechaDesde)
    }
    if (filters?.fechaHasta) {
      query = query.lte('fecha', filters.fechaHasta)
    }

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.order('fecha', { ascending: false }).range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('Error al listar transacciones:', error)
      return { data: [], total: 0 }
    }

    // Map to TransaccionReal type
    const transacciones: TransaccionReal[] = (data ?? []).map(t => {
      const row = t as Record<string, unknown>
      return {
        id: row.id as string,
        fecha: row.fecha as string,
        descripcion: row.descripcion as string,
        categoria: (row.categorias_transaccion as { nombre?: string })?.nombre ?? 'Sin categoría',
        tipo: (row.tipo as string) === 'ingreso' ? 'Ingreso' : 'Egreso',
        monto: Number(row.monto),
        moneda: (row.moneda as string) ?? 'COP',
        metodo_pago: row.metodo_pago as string | undefined,
        orden_id: row.orden_id as string | undefined,
      }
    })

    return { data: transacciones, total: count ?? 0 }
  }

  async obtenerCategorias(): Promise<CategoriaTransaccion[]> {
    const { data: categorias, error } = await supabase
      .from('categorias_transaccion')
      .select('id, nombre, tipo')
      .eq('activa', true)
      .order('nombre')

    if (error) {
      console.error('Error al obtener categorías:', error)
      return []
    }

    // Get subcategorias for each
    const result: CategoriaTransaccion[] = []
    for (const cat of categorias ?? []) {
      const { data: subs } = await supabase
        .from('subcategorias_transaccion')
        .select('nombre')
        .eq('categoria_id', cat.id)
        .eq('activa', true)
        .order('nombre')

      result.push({
        id: cat.id,
        nombre: cat.nombre,
        tipo: cat.tipo,
        subcategorias: (subs ?? []).map(s => s.nombre),
      })
    }

    return result
  }
}
