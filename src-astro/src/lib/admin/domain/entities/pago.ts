// Pure domain entity — NO infra imports, NO Zod
import type { CodigoDivisa } from '../value-objects/divisa'

export type EstadoPago = 'pendiente' | 'procesando' | 'confirmado' | 'fallido' | 'reembolsado'
export type MetodoPago = 'wompi_link' | 'pix_qr' | 'pix_copia_cola' | 'stripe' | 'transferencia'

export interface Pago {
  id: string
  ordenId: string
  monto: number
  divisa: CodigoDivisa
  metodo: MetodoPago
  codigoPasarela: string
  estado: EstadoPago
  metadata: Record<string, unknown>
  creadoEn: string
}
