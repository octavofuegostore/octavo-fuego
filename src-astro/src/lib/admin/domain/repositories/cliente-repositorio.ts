import type { Cliente } from '../entities/cliente'

export interface ClienteRepositorio {
  listar(opts?: { limit?: number }): Promise<Cliente[]>
  obtenerPorId(id: string): Promise<Cliente>
  obtenerPorEmail(email: string): Promise<Cliente | null>
  crear(data: Partial<Cliente>): Promise<Cliente>
  actualizar(id: string, data: Partial<Cliente>): Promise<Cliente>
  eliminar(id: string): Promise<void>
}
