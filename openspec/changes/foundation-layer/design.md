# Design: Foundation Layer — F1, F2, F3, F6

## Architecture Decisions

| # | Decision | Options | Choice | Rationale |
|---|----------|---------|--------|-----------|
| 1 | **Zod schema location** | Single file vs one-per-entity | **One per entity** (`src/lib/admin/schemas/*.ts`) | Matches existing `lib/{domain}/types.ts` pattern. Tree-shakeable. Each schema stays under 60 lines. |
| 2 | **Error naming** | English vs Spanish | **Spanish** (`ErrorValidacion`, `ErrorNoEncontrado`, `ErrorNegocio`) | Admin is ES-first. All existing `src/types/admin.ts` uses Spanish field names (`creado_en`, `estado`). Consistency > i18n purity. |
| 3 | **Validation layer** | Separate vs inside service | **Inside service, before DB call** | Pipod pattern: service validates → throws `ErrorValidacion` with field errors. No extra middleware needed. Single call site per operation. |
| 4 | **Supabase client** | Singleton vs factory | **Singleton for server, lazy singleton for browser** | Existing `src/lib/supabase.ts` already uses this pattern. Server: eager singleton. Browser: lazy init (must run in browser context). |

## F1 — Zod Schemas

### File Structure

```
src/lib/admin/schemas/
├── index.ts           # Re-exports all schemas + inferred types
├── producto.ts        # ProductoSchema + ProductoCreateSchema
├── orden.ts           # OrdenSchema + OrdenCreateSchema
├── cliente.ts         # ClienteSchema
├── inventario.ts      # InventarioSchema, MovimientoSchema
├── enums.ts           # Shared enums: CategoriaProducto, Moneda, EstadoOrden, Ubicacion
└── common.ts          # Shared primitives: uuid, slug, timestamp
```

### Enum Definitions (`enums.ts`)

```typescript
export const CategoriaProducto = z.enum(['rape', 'sananga', 'kuripe', 'b2b'])
export const Moneda = z.enum(['COP', 'BRL', 'USD'])
export const EstadoOrden = z.enum(['pendiente', 'confirmada', 'pagada', 'enviada', 'entregada', 'cancelada'])
export const UbicacionInventario = z.enum(['CO-BOGOTA', 'BR-ACRE'])
export const CanalOrden = z.enum(['whatsapp', 'web', 'manual'])
export const EstadoSolicitud = z.enum(['pendiente', 'aprobada', 'rechazada'])
export const MetodoPago = z.enum(['wompi_link', 'pix_qr', 'pix_copia_cola'])
```

### Key Schema: ProductoSchema

Maps to DB row `productos` + `variantes` + `niveles_inventario`. NOT the flat admin `Producto` type.

```typescript
export const VarianteSchema = z.object({
  id: z.string().uuid(),
  gramos: z.number().int().positive(),
  precio_cop: z.number().int().positive(),
  precio_brl: z.number().int().positive().nullable(),
  precio_usd: z.number().int().positive().nullable(),
  sku: z.string().min(1),
  activo: z.boolean(),
})

export const ProductoSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1).max(255),
  nombre_es: z.string().min(1).max(255),
  nombre_en: z.string().min(1).max(255),
  nombre_pt: z.string().min(1).max(255),
  descripcion_es: z.string().nullable(),
  descripcion_en: z.string().nullable(),
  descripcion_pt: z.string().nullable(),
  tipo_venta: z.enum(['retail', 'both']),
  activo: z.boolean(),
  creado_en: z.string().datetime(),
})

export const ProductoCreateSchema = ProductoSchema.omit({
  id: true, creado_en: true,
})
```

### Inferred Types

Each schema file exports `type Xxx = z.infer<typeof XxxSchema>`. These replace the manual `LM*Row` interfaces in `mapper.ts` — services import Zod-inferred types instead.

## F2 — Typed Errors

### File: `src/lib/admin/errors.ts`

Cannibalized from Pipod `lib/errors.ts` with Spanish naming.

```typescript
const CODIGOS_ERROR = {
  VALIDACION: 'VALIDACION_ERROR',
  NO_ENCONTRADO: 'NO_ENCONTRADO',
  NEGOCIO: 'NEGOCIO_ERROR',
  NO_AUTORIZADO: 'NO_AUTORIZADO',
  INTERNO: 'INTERNO_ERROR',
} as const

export class ErrorAdmin extends Error {
  readonly codigo: string
  readonly statusHttp: number
  constructor(mensaje: string, statusHttp: number, codigo: string) {
    super(mensaje)
    this.name = 'ErrorAdmin'
    this.statusHttp = statusHttp
    this.codigo = codigo
    Object.setPrototypeOf(this, ErrorAdmin.prototype)
  }
}

export class ErrorValidacion extends ErrorAdmin {
  readonly erroresCampo?: Record<string, string[]>
  constructor(mensaje: string, erroresCampo?: Record<string, string[]>) {
    super(mensaje, 400, CODIGOS_ERROR.VALIDACION)
    this.name = 'ErrorValidacion'
    this.erroresCampo = erroresCampo
  }
}

export class ErrorNoEncontrado extends ErrorAdmin {
  constructor(entidad: string, id: string | number) {
    super(`${entidad} no encontrado: ${id}`, 404, CODIGOS_ERROR.NO_ENCONTRADO)
    this.name = 'ErrorNoEncontrado'
  }
}

export class ErrorNegocio extends ErrorAdmin {
  constructor(mensaje: string) {
    super(mensaje, 422, CODIGOS_ERROR.NEGOCIO)
    this.name = 'ErrorNegocio'
  }
}
```

### Usage Pattern in Services

```typescript
// Inside service method:
const result = ProductoSchema.safeParse(input)
if (!result.success) {
  throw new ErrorValidacion('Datos inválidos', flattenZodErrors(result.error))
}
```

## F3 — Service Base Class

### File: `src/lib/admin/services/base.ts`

```typescript
import { supabase } from '@/lib/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'
import { ErrorNoEncontrado, ErrorValidacion } from '../errors'

type WithId = { id: string }

export abstract class SupabaseService<T extends WithId> {
  protected readonly client: SupabaseClient
  protected readonly tabla: string

  constructor(tabla: string) {
    this.client = supabase
    this.tabla = tabla
  }

  async listar(filtros?: Record<string, unknown>, limite = 200): Promise<T[]> {
    let query = this.client.from(this.tabla).select('*')
    if (filtros) {
      for (const [key, value] of Object.entries(filtros)) {
        query = query.eq(key, value)
      }
    }
    const { data, error } = await query.limit(limite)
    if (error) throw new ErrorNoEncontrado(this.tabla, 'query')
    return (data ?? []) as T[]
  }

  async obtener(id: string): Promise<T> {
    const { data, error } = await this.client
      .from(this.tabla).select('*').eq('id', id).single()
    if (error || !data) throw new ErrorNoEncontrado(this.tabla, id)
    return data as T
  }

  async crear(datos: Omit<T, 'id' | 'creado_en'>): Promise<T> {
    const { data, error } = await this.client
      .from(this.tabla).insert(datos).select().single()
    if (error) throw new ErrorValidacion(error.message)
    return data as T
  }

  async actualizar(id: string, datos: Partial<T>): Promise<T> {
    const { data, error } = await this.client
      .from(this.tabla).update(datos).eq('id', id).select().single()
    if (error) throw new ErrorValidacion(error.message)
    return data as T
  }

  async eliminar(id: string): Promise<boolean> {
    const { error } = await this.client
      .from(this.tabla).delete().eq('id', id)
    if (error) throw new ErrorValidacion(error.message)
    return true
  }
}
```

### Domain Services

```
src/lib/admin/services/
├── base.ts              # SupabaseService<T>
├── producto.service.ts  # extends SupabaseService<ProductoRow>
├── orden.service.ts     # extends SupabaseService<OrdenRow>
├── cliente.service.ts   # extends SupabaseService<ClienteRow>
├── inventario.service.ts # extends SupabaseService<NivelInventarioRow>
├── b2b.service.ts       # extends SupabaseService<SolicitudB2BRow>
└── index.ts             # Re-exports all services
```

Each domain service adds domain-specific methods beyond CRUD (e.g., `OrdenService.cambiarEstado()`, `InventarioService.transferir()`).

## F6 — Supabase Client

### Refine existing `src/lib/supabase.ts`

Current file already has dual pattern. Changes:
1. Add `Database` type import from generated types
2. Type the `createClient` calls with `Database` generic
3. Keep dummy proxy fallback

### New file: `src/lib/supabase-browser.ts`

Separate file for React islands. Uses `PUBLIC_SUPABASE_ANON_KEY` only.

```typescript
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

let _client: SupabaseClient<Database> | null = null

export function getSupabaseBrowser(): SupabaseClient<Database> {
  if (_client) return _client
  const url = import.meta.env.PUBLIC_SUPABASE_URL
  const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Supabase browser client: env vars not set')
  _client = createClient<Database>(url, key)
  return _client
}
```

### Generated Types: `src/types/database.types.ts`

Generated via `supabase gen types typescript --local > src/types/database.types.ts`. Prerequisite: DB migrations applied (F4/F5). Until then, manually define the type matching the existing `Database` type in `supabase.ts`.

## Data Flow

```
React Island (browser)
  └→ getSupabaseBrowser() → anon key → Supabase (RLS)
       └→ Zod input validation (browser-side, optional)

Astro Page (SSR)
  └→ supabase (server) → service_role key → Supabase (full access)
       └→ SupabaseService<T>.obtener/listar/crear
            └→ Zod validation (safeParse before DB call)
            └→ ErrorValidacion / ErrorNoEncontrado on failure
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/lib/admin/schemas/enums.ts` | Create | Shared Zod enums for OF domain |
| `src/lib/admin/schemas/common.ts` | Create | Shared Zod primitives (uuid, slug, timestamps) |
| `src/lib/admin/schemas/producto.ts` | Create | Producto + Variante schemas |
| `src/lib/admin/schemas/orden.ts` | Create | Orden + OrdenItem schemas |
| `src/lib/admin/schemas/cliente.ts` | Create | Cliente schema |
| `src/lib/admin/schemas/inventario.ts` | Create | Inventario + Movimiento schemas |
| `src/lib/admin/schemas/index.ts` | Create | Re-export all schemas + inferred types |
| `src/lib/admin/errors.ts` | Create | ErrorAdmin hierarchy (4 classes) |
| `src/lib/admin/services/base.ts` | Create | SupabaseService<T> abstract class |
| `src/lib/admin/services/producto.service.ts` | Create | Producto domain service |
| `src/lib/admin/services/orden.service.ts` | Create | Orden domain service |
| `src/lib/admin/services/cliente.service.ts` | Create | Cliente domain service |
| `src/lib/admin/services/inventario.service.ts` | Create | Inventario domain service |
| `src/lib/admin/services/b2b.service.ts` | Create | B2B solicitud domain service |
| `src/lib/admin/services/index.ts` | Create | Re-export all services |
| `src/lib/supabase.ts` | Modify | Add Database generic to createClient calls |
| `src/lib/supabase-browser.ts` | Create | Browser-only Supabase client with anon key |
| `src/types/database.types.ts` | Create | Generated/manual Supabase DB types |

## Testing Strategy

| Layer | What | Approach |
|-------|------|----------|
| Unit | Zod schemas validate sample data | Test each schema with valid + invalid inputs |
| Unit | Error classes throw correct HTTP codes | Instantiate each, assert statusHttp + codigo |
| Unit | SupabaseService<T> methods | Mock `supabase` client, assert queries + error handling |
| Integration | Domain services against real Supabase | Use Supabase local emulator or test project |
| Build | `npm run build` passes | Zero type errors, no SSR leaks |

## Migration / Rollout

No migration required. This is pure additive — new files only. Existing `src/lib/admin/service.ts` continues to work with mock fallback until F14+ replaces it with the new service layer.

## Open Questions

- [ ] Should `database.types.ts` be generated now (manually typed) or deferred until F4/F5 DB schema is applied? Recommendation: create minimal manual version now, regenerate after migrations.
- [ ] Should domain services export singleton instances or factory functions? Current `src/lib/index.ts` exports singletons — recommend matching that pattern.
