export abstract class ErrorApp extends Error {
  abstract readonly statusCode: number
  abstract readonly severity: 'error' | 'warn' | 'info'
  readonly details?: Record<string, unknown>

  constructor(message: string, details?: Record<string, unknown>) {
    super(message)
    this.name = this.constructor.name
    this.details = details
  }
}

export class ErrorValidacion extends ErrorApp {
  readonly statusCode = 400
  readonly severity: 'warn' = 'warn'
  readonly field?: string

  constructor(message: string, field?: string, details?: Record<string, unknown>) {
    super(message, details)
    this.field = field
  }
}

export class ErrorNoEncontrado extends ErrorApp {
  readonly statusCode = 404
  readonly severity: 'info' = 'info'
  readonly entidad: string

  constructor(entidad: string, id: string) {
    super(`${entidad} con ID ${id} no encontrado`, { entidad, id })
    this.entidad = entidad
  }
}

export class ErrorAutorizacion extends ErrorApp {
  readonly statusCode = 403
  readonly severity: 'error' = 'error'
}

export class ErrorSupabase extends ErrorApp {
  readonly statusCode = 500
  readonly severity: 'error' = 'error'
  readonly cause: unknown

  constructor(message: string, cause: unknown) {
    super(message, { cause })
    this.cause = cause
  }
}
