import { SupabaseClient } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { ErrorNoEncontrado, ErrorSupabase } from '@/lib/admin/errores'

const SUPABASE_CONFIGURED = !!(
  import.meta.env.PUBLIC_SUPABASE_URL &&
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY
)

export abstract class SupabaseService<T extends { id: string }> {
  protected supabase: SupabaseClient
  protected tableName: string
  protected bodegaId?: string

  constructor(supabase: SupabaseClient, tableName: string, bodegaId?: string) {
    this.supabase = supabase
    this.tableName = tableName
    this.bodegaId = bodegaId
  }

  protected get supabaseConfigurado(): boolean {
    return SUPABASE_CONFIGURED
  }

  protected async mockDelay(): Promise<void> {
    return new Promise(r => setTimeout(r, 50))
  }

  /** Build a base query, optionally scoped to bodega */
  protected baseQuery() {
    let query = this.supabase.from(this.tableName).select('*')
    if (this.bodegaId) {
      query = query.eq('bodega_id', this.bodegaId)
    }
    return query
  }

  /** Scope filter helper for raw SQL queries */
  protected buildScopeFilter(filter?: string) {
    if (!this.bodegaId) return { filter: '', values: [] }
    return {
      filter: `AND ${filter ?? 'bodega_id'} = $1`,
      values: [this.bodegaId],
    }
  }

  protected abstract generarMock(): T[]

  async listar(opts?: { bodegaId?: string; limit?: number }): Promise<T[]> {
    if (!this.supabaseConfigurado) {
      await this.mockDelay()
      return this.generarMock()
    }

    let query = this.baseQuery()
    if (opts?.bodegaId) {
      query = query.eq('bodega_id', opts.bodegaId)
    }

    query = query.order('creado_en', { ascending: false })
    if (opts?.limit) query = query.limit(opts.limit)

    const { data, error } = await query
    if (error) throw new ErrorSupabase(`Error al listar ${this.tableName}`, error)
    return (data ?? []) as T[]
  }

  async obtenerPorId(id: string, opts?: { bodegaId?: string }): Promise<T> {
    if (!this.supabaseConfigurado) {
      await this.mockDelay()
      const item = this.generarMock().find(m => m.id === id)
      if (!item) throw new ErrorNoEncontrado(this.tableName, id)
      return item
    }

    let query = this.baseQuery().eq('id', id)
    if (opts?.bodegaId) {
      query = query.eq('bodega_id', opts.bodegaId)
    }

    const { data, error } = await query.single()
    if (error && error.code === 'PGRST116') throw new ErrorNoEncontrado(this.tableName, id)
    if (error) throw new ErrorSupabase(`Error al obtener ${this.tableName}`, error)
    return data as T
  }

  async crear(data: Partial<T>): Promise<T> {
    if (!this.supabaseConfigurado) {
      await this.mockDelay()
      return { id: crypto.randomUUID(), ...data, creado_en: new Date().toISOString() } as T
    }

    const { data: result, error } = await supabase
      .from(this.tableName)
      .insert(data)
      .select()
      .single()

    if (error) throw new ErrorSupabase(`Error al crear ${this.tableName}`, error)
    return result as T
  }

  async actualizar(id: string, data: Partial<T>): Promise<T> {
    if (!this.supabaseConfigurado) {
      await this.mockDelay()
      return { ...this.generarMock().find(m => m.id === id), ...data } as T
    }

    const { data: result, error } = await supabase
      .from(this.tableName)
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error && error.code === 'PGRST116') throw new ErrorNoEncontrado(this.tableName, id)
    if (error) throw new ErrorSupabase(`Error al actualizar ${this.tableName}`, error)
    return result as T
  }

  async eliminar(id: string): Promise<void> {
    if (this.supabaseConfigurado) {
      const { error } = await supabase.from(this.tableName).delete().eq('id', id)
      if (error) throw new ErrorSupabase(`Error al eliminar ${this.tableName}`, error)
    }
  }
}
