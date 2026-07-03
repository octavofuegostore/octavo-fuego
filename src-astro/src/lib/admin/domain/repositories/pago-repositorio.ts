import type { Pago } from '../entities/pago'

export interface PagoRepositorio {
  listar(opts?: { ordenId?: string; limit?: number }): Promise<Pago[]>
  obtenerPorId(id: string): Promise<Pago>
  crear(data: Partial<Pago>): Promise<Pago>
  actualizarEstado(id: string, estado: string): Promise<Pago>
}
