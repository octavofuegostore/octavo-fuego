import { Divisa } from './divisa'
import { Monto } from './monto'

export class TasaCambio {
  constructor(
    readonly origen: Divisa,
    readonly destino: Divisa,
    readonly factor: number,
  ) {
    if (!Number.isFinite(factor) || factor <= 0) throw new Error('Factor de cambio debe ser positivo')
  }

  aplicar(monto: Monto): Monto {
    if (!this.origen.equals(monto.divisa)) throw new Error('Origen mismatch')
    return new Monto(monto.valor * this.factor, this.destino)
  }
}
