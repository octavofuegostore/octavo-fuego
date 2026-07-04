import type { Cliente } from '../entities/cliente'

export type CrearClienteDTO = Omit<Cliente, 'id' | 'creadoEn' | 'actualizadoEn'>;

export interface ClienteRepositorio {
  listar(opts?: { limit?: number }): Promise<Cliente[]>
  obtenerPorId(id: string): Promise<Cliente>
  obtenerPorEmail(email: string): Promise<Cliente | null>
  crear(data: CrearClienteDTO): Promise<Cliente>
  actualizar(id: string, data: Partial<Cliente>): Promise<Cliente>
  eliminar(id: string): Promise<void>
}
