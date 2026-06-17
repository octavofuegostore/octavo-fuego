# SDD Proposal: Contabilidad Integration

## Intent

Integrar el módulo de contabilidad financiera en el admin panel de Octavo Fuego, portando la lógica de Contabilidad_pipod (Next.js) a Astro con React islands. El objetivo es tener un solo dashboard central con accounting unificado, sin aplicaciones separadas.

## Por qué un solo dashboard

| Factor | Apps separadas | Dashboard unificado |
|--------|---------------|-------------------|
| Login | 2 logins distintos | 1 solo login (ya implementado) |
| Auth | 2 sistemas de auth | Cookie `of_admin_token` existente |
| Supabase | Misma instancia, 2 config | 1 cliente, 1 config |
| Bridge (Órdenes → Transacciones) | API calls entre apps | Mismo runtime, directo |
| Deploy | 2 Vercel projects | 1 solo (octavofuego.com/admin) |
| UI | Inconsistente (Next.js vs Astro) | Design system unificado |
| Sidebar | 2 dashboards separados | 1 ítem más: "Contabilidad" |

## Scope

### In scope

| Feature | Descripción | Fuente |
|---------|-------------|--------|
| **Dashboard Contable** | KPIs: Ingresos, Egresos, Balance con formato COP | `useResumen.ts` |
| **Transacciones CRUD** | Crear, editar, eliminar transacciones con validación Zod | `useTransacciones.ts`, `useEditarTransaccion.ts` |
| **Lista paginada** | Paginación (20 items), filtro año/mes, búsqueda ILIKE | `usePaginatedTransactions.ts` |
| **Gráficas** | Barras (ingresos/egresos por categoría), área (evolución temporal), evolución mensual | `useGraficas.ts`, `useEvolucionMensual.ts` |
| **Informe Mensual** | KPIs del mes + gráfico + tabla detallada | `useInformeMensual.ts` |
| **Informe Anual** | KPIs anuales + gráfico de líneas + tabla mensual | `useInformeAnual.ts` |
| **Exportar CSV** | Exporta todas las transacciones como CSV | `useExportarExcel.ts` |
| **Exportar PDF** | Genera reporte PDF con tabla + totales | `useExportarPDF.ts` |
| **Bridge Órdenes → Transacciones** | Cuando orden cambia a `entregado`, auto-crear `cont_transaccion` de ingreso | Nuevo |
| **Sidebar** | Nuevo ítem "Contabilidad" en AdminLayout | `AdminLayout.astro` |

### Out of scope

| Feature | Razón |
|---------|-------|
| Estrategia IA (DeepSeek, costos, metas) | ~2000 líneas, no aplica al negocio de OF (cosméticos vs tech) |
| Asistente IA (chat flotante, voz) | Complejidad innecesaria para contabilidad básica |
| Gema Import (CSV batch) | Específico del negocio anterior |
| Plantillas recurrentes | Out of scope — MVP es transacciones manuales |
| Dashboard Radar chart | Recharts radar no es esencial para MVP |
| Multi-moneda (BRL, USD) | Fase 2 — MVP es solo COP |

## Architecture Decisions

### ADR-1: React Islands para módulo de contabilidad

**Decisión**: Usar React islands (`client:load`) para todos los componentes interactivos del módulo de contabilidad.

**Razón**:
- 14/17 hooks de Contabilidad_pipod son puro React + supabase-js — portable sin cambios
- Recharts ya está instalado y probado para gráficas (681 líneas listas)
- react-hook-form + zod para validación de formularios
- shadcn/ui (React) ya instalado en OF
- @astrojs/react ya está en astro.config.mjs

**Alternativa considerada**: Reescribir en Astro puro. Rechazada porque requeriría reimplementar gráficas en SVG puro, lógica de paginación client-side, y validación de formularios — ~3x el esfuerzo sin beneficio real.

### ADR-2: Service layer + API routes para Supabase

**Decisión**: Crear `src/lib/contabilidad/service.ts` que use el cliente Supabase existente, expuesto vía API routes de Astro.

**Razón**:
- El admin panel actual usa datos mock — necesitamos conectividad real
- La capa de servicio abstrae Supabase para que los hooks sean independientes
- API routes siguen el patrón ya establecido (`/api/auth/*`)

**Patrón**:
```
Hooks (React, client-side) → fetch → API routes (Astro) → service.ts → Supabase
```

### ADR-3: Categorías hardcodeadas (no en DB)

**Decisión**: Mantener las categorías como constantes en TypeScript, no en tabla de Supabase.

**Razón**:
- Contabilidad_pipod también las tiene hardcodeadas (la tabla `categorias` existe pero no se usa)
- Para un negocio pequeño como OF, las categorías cambian raramente
- Más simple, más rápido, sin migraciones adicionales
- Se pueden mover a Supabase en fase 2 si es necesario

### ADR-4: Bridge vía Database Trigger (no service code)

**Decisión**: Usar un trigger de PostgreSQL para crear `cont_transaccion` cuando una orden cambia a `entregado`.

**Razón**:
- Atómico — sucede en la misma transacción que el cambio de estado
- Sin race conditions — no depende de API calls
- Independiente del framework — funciona sin importar qué stack use OF
- Mismo patrón que `incrementar_reserva` y `confirmar_deduccion` (ya existen en el schema)

## Design System

### Componentes React Islands (client:load)

| Componente | Fuente | Complejidad | Notas |
|-----------|--------|------------|-------|
| `ContabilidadDashboard` | Port de `dashboard-cards.tsx` | Baja | 3 KPI cards: Ingresos, Egresos, Balance |
| `TransaccionForm` | Port de `transaccion-form.tsx` | Media | Categorías OF, medios de pago, validación Zod |
| `TransaccionTable` | Port de `transaction-table.tsx` | Alta (441 líneas) | Paginación, filtros, búsqueda, exportar |
| `GraficasContabilidad` | Port de `Graficas.tsx` | Muy alta (681 líneas) | Barras, área, evolución mensual |
| `InformesTabs` | Port de `reports-tabs.tsx` | Alta (539 líneas) | Tabs mensual/anual con KPIs + gráficos + tablas |
| `PaginationControls` | Port directo | Baja | Reutilizable |
| `FilterSelectors` | Port directo | Baja | Selectores año/mes |
| `KpiCard` | Port de `kpi-card.tsx` | Baja | Card individual con icono, título, valor, variación |

### Páginas Astro (.astro)

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/admin/contabilidad` | `ContabilidadDashboard` + `GraficasContabilidad` | Dashboard financiero con KPIs y gráficas |
| `/admin/contabilidad/transacciones` | `TransaccionForm` + `TransaccionTable` | Lista paginada + crear/editar transacciones |
| `/admin/contabilidad/informes` | `InformesTabs` | Informes mensuales y anuales |

### Sidebar Integration

**Diseño final**: Lista plana, sin headers de sección. Items ordenados por prioridad lógica. Dos submenús colapsables con 3 items cada uno para simetría visual.

```
🏠  Dashboard
📦  Órdenes
👥  Clientes
📊  Inventario          ▾        ← colapsable (3 subitems)
     Productos
     Stock
     Transferencias
💰  Contabilidad        ▾        ← colapsable (3 subitems)
     Dashboard                    ← KPIs: ingresos, egresos, balance
     Transacciones                ← CRUD + filtros + paginación
     Informes                     ← Mensual, Anual, Exportar PDF/CSV
⚙️   Configuración
────────────────────────────
👤  Josue Calderon
    Cerrar Sesión
```

**Lógica del orden:**
1. Dashboard — landing, lo primero que ve el admin
2. Órdenes — lo que está pasando ahora (ventas activas)
3. Clientes — quién compra
4. Inventario — qué vendemos (colapsable: 3 subpáginas)
5. Contabilidad — la plata (colapsable: 3 subpáginas)
6. Configuración — al final, se toca poco

**Sin secciones (headers de grupo).** Minimalist Sacred design. No sobreingeniería. La simetría de 3+3 subitems en los dos menús colapsables da balance visual natural.

## Categories (Cosméticos/Medicinas Ancestrales)

```typescript
export const CATEGORIAS_INGRESO = [
  {
    nombre: 'Venta Rapé',
    subcategorias: ['Tisunú', 'Pixuri', 'Pariká', 'Cumaru de Cheiro', 'Vena de Pajé'],
  },
  {
    nombre: 'Venta Sananga',
    subcategorias: ['Sananga 5ml', 'Sananga 10ml'],
  },
  {
    nombre: 'Venta Kuripe/Tepi',
    subcategorias: ['Kuripe Clásico', 'Kuripe Doble', 'Tepi'],
  },
  {
    nombre: 'Distribución B2B',
    subcategorias: ['Mayorista Colombia', 'Mayorista Brasil'],
  },
  {
    nombre: 'Servicios',
    subcategorias: ['Ceremonias', 'Consultas', 'Talleres'],
  },
];

export const CATEGORIAS_EGRESO = [
  {
    nombre: 'Amazonía / Comunidades',
    subcategorias: ['Yawanawá', 'Nukini', 'Kaxinawá', 'Shanenawa', 'Logística Acre'],
  },
  {
    nombre: 'Producción',
    subcategorias: ['Materia Prima', 'Envases y Etiquetas', 'Herramientas'],
  },
  {
    nombre: 'Logística y Envíos',
    subcategorias: ['Envíos Nacionales', 'Envíos Brasil', 'Envíos Internacionales'],
  },
  {
    nombre: 'Marketing',
    subcategorias: ['Meta Ads', 'Google Ads', 'Contenido', 'Fotografía'],
  },
  {
    nombre: 'Infraestructura',
    subcategorias: ['Arriendo', 'Servicios', 'Software', 'Internet/Teléfono'],
  },
  {
    nombre: 'Nómina',
    subcategorias: ['Josue', 'Equipo'],
  },
  {
    nombre: 'Impuestos',
    subcategorias: ['IVA', 'Renta'],
  },
  {
    nombre: 'Otros Egresos',
    subcategorias: ['Material Oficina', 'Viajes', 'Imprevistos'],
  },
];

export const MEDIOS_PAGO = [
  'Nequi', 'Daviplata', 'Bancolombia', 'Davivienda', 'Efectivo',
  'Transferencia', 'PayPal', 'Wompi',
];

export const ESTADOS_IVA = ['Exento', 'Incluido', 'Discriminado', 'N/A'];
```

## Database

### Nueva tabla: `cont_transacciones`

Port directo del schema de Contabilidad_pipod, limpio del contexto tech anterior:

```sql
CREATE TABLE cont_transacciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  fecha DATE NOT NULL,
  descripcion TEXT NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  sub_categoria VARCHAR(50) NOT NULL,
  monto DECIMAL(15, 2) NOT NULL CHECK (monto > 0),
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('Ingreso', 'Egreso')),
  medio_pago VARCHAR(50) NOT NULL,
  estado_iva VARCHAR(20) NOT NULL CHECK (estado_iva IN ('Exento', 'Incluido', 'Discriminado', 'N/A')),
  comentarios TEXT,
  es_automatico BOOLEAN DEFAULT false,
  orden_id UUID REFERENCES ordenes(id),         -- Bridge OF orders → cont_transaccion
  transaccion_padre_id UUID REFERENCES cont_transacciones(id),  -- Self-ref para splits
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cont_transacciones_fecha ON cont_transacciones(fecha DESC);
CREATE INDEX idx_cont_transacciones_tipo ON cont_transacciones(tipo);
CREATE INDEX idx_cont_transacciones_categoria ON cont_transacciones(categoria);
CREATE INDEX idx_cont_transacciones_auto ON cont_transacciones(es_automatico);
```

### Bridge Trigger: Órden completada → Transacción automática

```sql
CREATE OR REPLACE FUNCTION crear_transaccion_orden_entregada()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.estado = 'entregado' AND OLD.estado != 'entregado' THEN
    INSERT INTO cont_transacciones (
      user_id, fecha, descripcion, categoria, sub_categoria,
      monto, tipo, medio_pago, estado_iva, es_automatico, orden_id
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      CURRENT_DATE,
      'Orden ' || NEW.display_id || ' entregada',
      'Venta Rapé',
      'Tisunú',
      COALESCE(NEW.total_cop, NEW.total_brl, NEW.total_usd, 0),
      'Ingreso',
      'Wompi',
      'Exento',
      true,
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_orden_entregada
  AFTER UPDATE ON ordenes
  FOR EACH ROW
  EXECUTE FUNCTION crear_transaccion_orden_entregada();
```

## File Plan (21 archivos)

### Fase 1: Foundation — Database + Types (3 archivos)
1. **NEW** `supabase/migrations/002_contabilidad_schema.sql` — Tabla + trigger + índices
2. **NEW** `src/lib/contabilidad/types.ts` — `Transaccion`, `ContabilidadResumen`, `DashboardData`
3. **NEW** `src/lib/contabilidad/constants.ts` — Categorías, medios de pago, estados IVA

### Fase 2: Service Layer + API Routes (5 archivos)
4. **NEW** `src/lib/contabilidad/service.ts` — `getTransacciones()`, `createTransaccion()`, `updateTransaccion()`, `deleteTransaccion()`, `getResumen()`, `getGraficas()`, `getInformeMensual()`, `getInformeAnual()`
5. **NEW** `src/lib/contabilidad/index.ts` — Export unificado
6. **MODIFY** `src/lib/supabase.ts` — Agregar `cont_transacciones` al Database type
7. **NEW** `src/pages/api/contabilidad/transacciones.ts` — API route (GET, POST)
8. **NEW** `src/pages/api/contabilidad/transacciones/[id].ts` — API route (PUT, DELETE)

### Fase 3: React Islands — Componentes (8 archivos)
9. **NEW** `src/components/admin/contabilidad/KpiCard.tsx` — Card individual
10. **NEW** `src/components/admin/contabilidad/ContabilidadDashboard.tsx` — 3 KPIs
11. **NEW** `src/components/admin/contabilidad/TransaccionForm.tsx` — Form CRUD
12. **NEW** `src/components/admin/contabilidad/TransaccionTable.tsx` — Tabla paginada
13. **NEW** `src/components/admin/contabilidad/GraficasContabilidad.tsx` — Gráficas
14. **NEW** `src/components/admin/contabilidad/InformesTabs.tsx` — Tabs mensual/anual
15. **NEW** `src/components/admin/contabilidad/PaginationControls.tsx` — Paginación
16. **NEW** `src/components/admin/contabilidad/FilterSelectors.tsx` — Filtros

### Fase 4: Pages + Sidebar (3 archivos)
17. **NEW** `src/pages/admin/contabilidad/index.astro` — Dashboard contable
18. **NEW** `src/pages/admin/contabilidad/transacciones.astro` — CRUD transacciones
19. **NEW** `src/pages/admin/contabilidad/informes.astro` — Informes
20. **MODIFY** `src/layouts/AdminLayout.astro` — Agregar "Contabilidad" al sidebar

### Fase 5: Dependencies (npm)
21. Instalar: `recharts` (ya en OF), `react-hook-form`, `@hookform/resolvers`, `zod`, `lucide-react`

## Dependencies

| Dependencia | Ya instalada? | Uso |
|-------------|--------------|-----|
| recharts | ✅ (deps de OF) | Gráficas: barras, área, línea |
| react-hook-form | ❌ → instalar | Formulario de transacciones |
| @hookform/resolvers | ❌ → instalar | Validación Zod en forms |
| zod | ❌ → instalar | Schema validation |
| lucide-react | ❌ → instalar | Iconos para KPIs y tablas |
| @supabase/supabase-js | ✅ | Cliente Supabase |
| @astrojs/react | ✅ | React islands |

**Total nuevas dependencias**: 4 npm packages ligeros.

## Risks & Mitigation

| Riesgo | Severidad | Mitigación |
|--------|-----------|------------|
| **React islands + Astro context** | Baja | Contabilidad_pipod ya funciona con React puro. `client:load` es el único cambio necesario. |
| **Supabase table no existe en instancia OF** | Media | Crear migración SQL. El schema de OF ya tiene 7 tablas definidas — agregar 1 más es trivial. |
| **Categories mismatch** | Baja | Definidas como constantes TS. Si cambian, se actualizan en 1 archivo. |
| **Bridge trigger — user_id vacío** | Media | El trigger necesita saber qué user_id asignar. Se puede usar un UUID fijo para transacciones automáticas, o NULL + filtro por `es_automatico = true`. |
| **Peso de bundle React islands** | Baja | Solo el módulo de contabilidad carga Recharts + forms. El resto del admin sigue siendo HTML estático. |
| **Form validación en español** | Baja | Zod ya soporta mensajes de error. Se configuran en `validations.ts`. |

## Success Criteria

1. ✅ Admin puede ver dashboard contable en `/admin/contabilidad` con KPIs reales
2. ✅ Admin puede crear, editar y eliminar transacciones con formulario validado
3. ✅ Tabla de transacciones con paginación, filtros y búsqueda
4. ✅ Gráficas de barras y evolución temporal con datos de Supabase
5. ✅ Informe mensual y anual con KPIs + gráficos + tablas
6. ✅ Exportar a CSV y PDF funciona desde cualquier vista
7. ✅ Bridge automático: orden `entregada` → `cont_transaccion` creada
8. ✅ Sidebar muestra "Contabilidad" con submenú colapsable
9. ✅ Mismo login (cookie `of_admin_token`) protege todas las rutas
10. ✅ Build sin errores en producción (Vercel)
