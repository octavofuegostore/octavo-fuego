import { Divisa } from './divisa'

export class Monto {
  constructor(readonly valor: number, readonly divisa: Divisa) {
    if (!Number.isFinite(valor) || valor < 0) throw new Error('Monto debe ser un número positivo')
  }

  sumar(other: Monto): Monto {
    if (!this.divisa.equals(other.divisa)) throw new Error('Divisa mismatch')
    return new Monto(this.valor + other.valor, this.divisa)
  }

  toString(): string { return `${this.divisa.simbolo()}${this.valor.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}` }
}
