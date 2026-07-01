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
      .gte('fecha', new Date(año, mes - 1, 1).toISOString().split('T')[0])
      .lt('fecha', new Date(año, mes, 1).toISOString().split('T')[0])

    if (error) {
      console.error('Error al obtener KPIs:', error)
      throw error
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
    const { data, error } = await supabase
      .from('transacciones')
      .select('tipo, monto, fecha')
      .gte('fecha', `${año}-01-01`)
      .lt('fecha', `${año + 1}-01-01`)

    if (error) throw error

    const mesNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    const months: BarChartData[] = mesNames.map(label => ({ label, ingreso: 0, egreso: 0 }))

    for (const t of data ?? []) {
      const d = new Date(t.fecha)
      const mesIdx = d.getMonth()
      if (t.tipo === 'ingreso') {
        months[mesIdx].ingreso += Number(t.monto)
      } else {
        months[mesIdx].egreso += Number(t.monto)
      }
    }

    return months
  }

  async obtenerEvolucionAnual(): Promise<LineChartData[]> {
    const currentYear = new Date().getFullYear()
    const { data, error } = await supabase
      .from('transacciones')
      .select('tipo, monto, fecha')
      .gte('fecha', `${currentYear}-01-01`)
      .lt('fecha', `${currentYear + 1}-01-01`)

    if (error) throw error

    const mesNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    const result: LineChartData[] = mesNames.map(label => ({ label, value: 0 }))

    for (const t of data ?? []) {
      const d = new Date(t.fecha)
      const mesIdx = d.getMonth()
      const delta = t.tipo === 'ingreso' ? Number(t.monto) : -Number(t.monto)
      result[mesIdx].value += delta
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
      const { data: cat, error: catError } = await supabase
        .from('categorias_transaccion')
        .select('id')
        .ilike('nombre', filters.categoria)
        .maybeSingle()
      if (catError) {
        console.error('Error al buscar categoría por filtro:', catError)
      } else if (cat) {
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

    if (error) {
      console.error('Error al listar transacciones:', error)
      throw error
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
    const { data: categorias, error: catError } = await supabase
      .from('categorias_transaccion')
      .select('id, nombre, tipo')
      .eq('activa', true)
      .order('nombre')

    if (catError) {
      console.error('Error al obtener categorías:', catError)
      throw catError
    }

    // Single query for all subcategorias, then group client-side
    const catIds = (categorias ?? []).map(c => c.id)
    const { data: subs, error: subsError } = await supabase
      .from('subcategorias_transaccion')
      .select('categoria_id, nombre')
      .eq('activa', true)
      .in('categoria_id', catIds.length > 0 ? catIds : [''])
      .order('nombre')

    if (subsError) {
      console.error('Error al obtener subcategorías:', subsError)
      throw subsError
    }

    const subsByCat = new Map<string, string[]>()
    for (const s of subs ?? []) {
      const list = subsByCat.get(s.categoria_id) ?? []
      list.push(s.nombre)
      subsByCat.set(s.categoria_id, list)
    }

    return (categorias ?? []).map(c => ({
      id: c.id,
      nombre: c.nombre,
      tipo: c.tipo,
      subcategorias: subsByCat.get(c.id) ?? [],
    }))
  }
}
