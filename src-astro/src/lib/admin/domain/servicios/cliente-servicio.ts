/**
 * ClienteService — hexagonal Port & Adapter
 *
 * Single-file pattern: Port (interface) + 2 adapters (Supabase, Mock).
 * The factory chooses the implementation at construction time — zero branching
 * inside CRUD methods (ADR v2, rule 10: zero branching en servicios).
 *
 * Usage:
 *   import { crearClienteServicio } from './cliente-servicio'
 *   const svc = crearClienteServicio()
 *   const clientes = await svc.listar()
 */

import { supabase } from '@/lib/supabase'
import { ErrorNoEncontrado, ErrorSupabase } from '@/lib/admin/errores'
import type { Cliente, EstadoCliente, RolCliente } from '@/lib/admin/domain/entities/cliente'

// ═══════════════════════════════════════════════════════════════════════════════
// Port
// ═══════════════════════════════════════════════════════════════════════════════

export interface IClienteServicio {
  listar(): Promise<Cliente[]>
  obtenerPorId(id: string): Promise<Cliente>
  crear(data: Partial<Cliente>): Promise<Cliente>
  actualizar(id: string, data: Partial<Cliente>): Promise<Cliente>
  eliminar(id: string): Promise<void>
  buscarPorEmail(email: string): Promise<Cliente | null>
}

// ═══════════════════════════════════════════════════════════════════════════════
// Adapter: Supabase (real implementation)
// ═══════════════════════════════════════════════════════════════════════════════

interface LMClienteRow {
  id: string
  email: string
  nombre_empresa: string | null
  telefono: string | null
  pais: string | null
  grupo_id: string | null
  b2b_estado: string
  nit_cnpj: string | null
  creado_en: string
}

export class SupabaseClienteServicio implements IClienteServicio {
  async listar(): Promise<Cliente[]> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('creado_en', { ascending: false })

    if (error) throw new ErrorSupabase('Error al listar clientes', error)
    return ((data ?? []) as LMClienteRow[]).map((r) => this._mapear(r))
  }

  async obtenerPorId(id: string): Promise<Cliente> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code === 'PGRST116') throw new ErrorNoEncontrado('Cliente', id)
    if (error) throw new ErrorSupabase(`Error al obtener cliente ${id}`, error)

    return this._mapear(data as LMClienteRow)
  }

  async crear(data: Partial<Cliente>): Promise<Cliente> {
    const row: Record<string, unknown> = {}
    if (data.email !== undefined) row.email = data.email
    if (data.nombreEmpresa !== undefined) row.nombre_empresa = data.nombreEmpresa
    if (data.telefono !== undefined) row.telefono = data.telefono
    if (data.pais !== undefined) row.pais = data.pais
    if (data.nitCnpj !== undefined) row.nit_cnpj = data.nitCnpj
    if (data.rol !== undefined) row.b2b_estado = data.rol
    if (data.estado !== undefined) row.estado = data.estado

    const { data: result, error } = await supabase
      .from('clientes')
      .insert(row)
      .select()
      .single()

    if (error) throw new ErrorSupabase('Error al crear cliente', error)
    return this._mapear(result as LMClienteRow)
  }

  async actualizar(id: string, data: Partial<Cliente>): Promise<Cliente> {
    const row: Record<string, unknown> = {}
    if (data.email !== undefined) row.email = data.email
    if (data.nombreEmpresa !== undefined) row.nombre_empresa = data.nombreEmpresa
    if (data.telefono !== undefined) row.telefono = data.telefono
    if (data.pais !== undefined) row.pais = data.pais
    if (data.nitCnpj !== undefined) row.nit_cnpj = data.nitCnpj
    if (data.rol !== undefined) row.b2b_estado = data.rol
    if (data.estado !== undefined) row.estado = data.estado

    const { data: result, error } = await supabase
      .from('clientes')
      .update(row)
      .eq('id', id)
      .select()
      .single()

    if (error && error.code === 'PGRST116') throw new ErrorNoEncontrado('Cliente', id)
    if (error) throw new ErrorSupabase(`Error al actualizar cliente ${id}`, error)

    return this._mapear(result as LMClienteRow)
  }

  async eliminar(id: string): Promise<void> {
    const { error } = await supabase.from('clientes').delete().eq('id', id)
    if (error) throw new ErrorSupabase(`Error al eliminar cliente ${id}`, error)
  }

  async buscarPorEmail(email: string): Promise<Cliente | null> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .ilike('email', email)
      .maybeSingle()

    if (error) throw new ErrorSupabase(`Error al buscar cliente por email ${email}`, error)
    if (!data) return null

    return this._mapear(data as LMClienteRow)
  }

  // ── Private: map LM row to domain entity ──────────────────────────────────

  private _mapear(row: LMClienteRow): Cliente {
    return {
      id: row.id,
      email: row.email,
      nombreEmpresa: row.nombre_empresa,
      telefono: row.telefono,
      pais: row.pais ?? 'CO',
      nitCnpj: row.nit_cnpj ?? null,
      rol: row.b2b_estado === 'aprobado' ? 'b2b_client' : 'admin' as RolCliente,
      estado: row.b2b_estado === 'aprobado'
        ? 'aprobado'
        : row.b2b_estado === 'rechazado'
          ? 'rechazado'
          : 'pendiente' as EstadoCliente,
      creadoEn: row.creado_en,
      actualizadoEn: row.creado_en,
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Adapter: Mock (for development / no-Supabase environments)
// ═══════════════════════════════════════════════════════════════════════════════

export class MockClienteServicio implements IClienteServicio {
  private clientes: Cliente[] = [...MockClienteServicio._generarMock()]

  async listar(): Promise<Cliente[]> {
    return [...this.clientes]
  }

  async obtenerPorId(id: string): Promise<Cliente> {
    const cliente = this.clientes.find((c) => c.id === id)
    if (!cliente) throw new ErrorNoEncontrado('Cliente', id)
    return cliente
  }

  async crear(data: Partial<Cliente>): Promise<Cliente> {
    const now = new Date().toISOString()
    const cliente: Cliente = {
      id: crypto.randomUUID(),
      email: data.email ?? '',
      nombreEmpresa: data.nombreEmpresa ?? null,
      telefono: data.telefono ?? null,
      pais: data.pais ?? 'CO',
      nitCnpj: data.nitCnpj ?? null,
      rol: data.rol ?? 'b2b_client',
      estado: data.estado ?? 'pendiente',
      creadoEn: now,
      actualizadoEn: now,
    }
    this.clientes.push(cliente)
    return cliente
  }

  async actualizar(id: string, data: Partial<Cliente>): Promise<Cliente> {
    const idx = this.clientes.findIndex((c) => c.id === id)
    if (idx === -1) throw new ErrorNoEncontrado('Cliente', id)

    this.clientes[idx] = {
      ...this.clientes[idx],
      ...data,
      actualizadoEn: new Date().toISOString(),
    }
    return this.clientes[idx]
  }

  async eliminar(id: string): Promise<void> {
    const idx = this.clientes.findIndex((c) => c.id === id)
    if (idx === -1) throw new ErrorNoEncontrado('Cliente', id)
    this.clientes.splice(idx, 1)
  }

  async buscarPorEmail(email: string): Promise<Cliente | null> {
    return this.clientes.find((c) => c.email.toLowerCase() === email.toLowerCase()) ?? null
  }

  // ── Mock data ──────────────────────────────────────────────────────────────

  private static _generarMock(): Cliente[] {
    const now = new Date().toISOString()
    const yesterday = new Date(Date.now() - 86400000).toISOString()

    return [
      {
        id: 'MOCK-CLI-001',
        email: 'contacto@tiendanatura.com',
        nombreEmpresa: 'Tienda Natura Colombia',
        telefono: '+57 300 123 4567',
        pais: 'CO',
        nitCnpj: '900.123.456-7',
        rol: 'b2b_client',
        estado: 'aprobado',
        creadoEn: yesterday,
        actualizadoEn: yesterday,
      },
      {
        id: 'MOCK-CLI-002',
        email: 'lucia@example.com',
        nombreEmpresa: null,
        telefono: '+57 311 987 6543',
        pais: 'CO',
        nitCnpj: null,
        rol: 'admin',
        estado: 'retail',
        creadoEn: now,
        actualizadoEn: now,
      },
      {
        id: 'MOCK-CLI-003',
        email: 'contato@lojaacre.com.br',
        nombreEmpresa: 'Loja Acre Rupestre',
        telefono: '+55 68 99999 8888',
        pais: 'BR',
        nitCnpj: '12.345.678/0001-90',
        rol: 'b2b_client',
        estado: 'pendiente',
        creadoEn: now,
        actualizadoEn: now,
      },
    ]
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Factory
// ═══════════════════════════════════════════════════════════════════════════════

import { SUPABASE_CONFIGURED } from './config'

/**
 * Factory: returns MockClienteServicio when Supabase is not configured,
 * SupabaseClienteServicio otherwise. Zero branching inside the returned
 * instance — the decision is made once at construction time.
 */
export function crearClienteServicio(): IClienteServicio {
  return SUPABASE_CONFIGURED
    ? new SupabaseClienteServicio()
    : new MockClienteServicio()
}
