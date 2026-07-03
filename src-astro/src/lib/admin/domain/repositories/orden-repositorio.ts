import type { Orden } from '../entities/orden'

export interface OrdenRepositorio {
  listar(opts?: { bodegaId?: string; estado?: string; limit?: number }): Promise<Orden[]>
  obtenerPorId(id: string): Promise<Orden>
  crear(data: Partial<Orden>): Promise<Orden>
  actualizarEstado(id: string, estado: string): Promise<Orden>
  eliminar(id: string): Promise<void>
}
