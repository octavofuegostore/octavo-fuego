// Pure TS — NO infra imports
const DIVISAS_VALIDAS = ['COP', 'BRL', 'USD'] as const
export type CodigoDivisa = typeof DIVISAS_VALIDAS[number]

export class Divisa {
  constructor(readonly codigo: CodigoDivisa) {}

  esLocal(): boolean { return this.codigo === 'COP' }

  simbolo(): string {
    const map: Record<CodigoDivisa, string> = { COP: '$', BRL: 'R$', USD: '$' }
    return map[this.codigo]
  }

  equals(other: Divisa): boolean { return this.codigo === other.codigo }
}
