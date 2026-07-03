import type { Monto } from '../value-objects/monto'

export interface ResultadoPago {
  exitoso: boolean
  codigoPasarela?: string
  urlPago?: string
  error?: string
}

export interface PagoGateway {
  cobrar(monto: Monto, metadata: Record<string, unknown>): Promise<ResultadoPago>
  reembolsar(codigoPasarela: string): Promise<{ exitoso: boolean }>
  consultar(codigoPasarela: string): Promise<{ estado: string }>
}
