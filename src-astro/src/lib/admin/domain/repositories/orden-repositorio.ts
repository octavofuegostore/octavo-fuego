import type { Orden } from '../entities/orden'

export type CrearOrdenDTO = Omit<Orden, 'id' | 'creadoEn' | 'actualizadoEn'>;

export interface OrdenRepositorio {
  listar(opts?: { bodegaId?: string; estado?: string; limit?: number; desde?: Date; hasta?: Date }): Promise<Orden[]>
  obtenerPorId(id: string): Promise<Orden>
  crear(data: CrearOrdenDTO): Promise<Orden>
  actualizarEstado(id: string, estado: string): Promise<Orden>
  eliminar(id: string): Promise<void>
}
