import type { Producto } from '../entities/producto'

export type CrearProductoDTO = Omit<Producto, 'id' | 'creadoEn' | 'actualizadoEn'>;

export interface ProductoRepositorio {
  listar(opts?: { bodegaId?: string; limit?: number }): Promise<Producto[]>
  obtenerPorId(id: string): Promise<Producto>
  crear(data: CrearProductoDTO): Promise<Producto>
  actualizar(id: string, data: Partial<Producto>): Promise<Producto>
  eliminar(id: string): Promise<void>
}
