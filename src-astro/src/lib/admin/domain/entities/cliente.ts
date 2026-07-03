// Pure domain entity — NO infra imports, NO Zod

export type RolCliente = 'admin' | 'b2b_client' | 'viewer'
export type EstadoCliente = 'retail' | 'pendiente' | 'aprobado' | 'rechazado'

export interface Cliente {
  id: string
  email: string
  nombreEmpresa: string | null
  telefono: string | null
  pais: string
  nitCnpj: string | null
  rol: RolCliente
  estado: EstadoCliente
  creadoEn: string
  actualizadoEn: string
}
