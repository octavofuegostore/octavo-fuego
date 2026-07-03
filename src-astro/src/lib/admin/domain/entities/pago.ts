// Pure domain entity — NO infra imports, NO Zod

export type EstadoPago = 'pendiente' | 'procesando' | 'confirmado' | 'fallido' | 'reembolsado'
export type MetodoPago = 'wompi' | 'stripe' | 'pix' | 'transferencia'

export interface Pago {
  id: string
  ordenId: string
  monto: number
  divisa: string
  metodo: MetodoPago
  codigoPasarela: string
  estado: EstadoPago
  metadata: Record<string, unknown>
  creadoEn: string
}
