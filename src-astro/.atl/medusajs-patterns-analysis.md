# Análisis MedusaJS — Patrones para L-Medusa

**Fecha**: Junio 16, 2026
**Objetivo**: Extraer patrones de MedusaJS para mejorar nuestro L-Medusa backend

## 📋 Resumen Ejecutivo

MedusaJS usa una arquitectura **modular** con decoradores para transacciones, eventos e inyección de dependencias. Nosotros podemos adoptar los patrones **sin la complejidad** de su framework completo.

---

## 🏗️ Patrones Clave Extraídos

### 1. Service Pattern (con decoradores)

**MedusaJS:**
```typescript
export class InventoryModuleService
  extends MedusaService<{...}>({...})
  implements IInventoryService
{
  protected baseRepository_: DAL.RepositoryService
  protected readonly inventoryItemService_: ModulesSdkTypes.IMedusaInternalService

  constructor({baseRepository, inventoryItemService, ...}: InjectedDependencies) {
    super(...arguments)
    this.baseRepository_ = baseRepository
    this.inventoryItemService_ = inventoryItemService
  }
}
```

**Nuestra versión (simplificada):**
```typescript
export class SupabaseInventoryService {
  private supabase: SupabaseClient
  private mockInventory: MockInventoryItem[]

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }
}
```

**Aprendizaje:**
- Usamos composición en vez de herencia
- Inyección manual de dependencias (más simple que DI container)
- Separamos mock de implementación real

### 2. Reservation Pattern (Reservas de Inventario)

**MedusaJS:**
```typescript
async createReservationItems(input: CreateReservationItemInput[], context?: Context) {
  const inventoryLevels = await this.ensureInventoryLevels(input, {
    validateQuantityAtLocation: true
  })
  
  const created = await this.reservationItemService_.create(input, context)
  
  // Ajustar reserved_quantity
  await this.inventoryLevelService_.update(levelAdjustmentUpdates, context)
  
  return created
}
```

**Nuestra versión:**
```typescript
async crearReserva(
  itemInventarioId: number,
  gramos: number,
  ordenId?: number
): Promise<Reserva> {
  // 1. Verificar stock disponible
  const stock = await this.getStockByItem(itemInventarioId)
  if (stock.gramos_disponibles < gramos) {
    throw new Error('Stock insuficiente')
  }
  
  // 2. Crear reserva
  const { data: reserva } = await this.supabase
    .from('reservas')
    .insert({
      item_inventario_id: itemInventarioId,
      orden_id: ordenId,
      gramos_reservados: gramos,
      estado: 'activa'
    })
    .select()
    .single()
  
  // 3. RPC para incrementar reserva (transaccional)
  await this.supabase.rpc('incrementar_reserva', {
    p_item_inventario_id: itemInventarioId,
    p_gramos: gramos
  })
  
  return reserva
}
```

**Aprendizaje:**
- **Validar antes de reservar** (ensureInventoryLevels)
- **Usar RPC para operaciones transaccionales** (incrementar_reserva)
- **Manejar estado de reserva** (activa → confirmada → liberada)

### 3. Adjustment Pattern (Ajustes de Inventario)

**MedusaJS:**
```typescript
async adjustInventory(
  inventoryItemId: string,
  locationId: string,
  adjustment: BigNumberInput,
  context: Context
) {
  const [inventoryLevel] = await this.inventoryLevelService_.list({...})
  
  const result = await this.inventoryLevelService_.update({
    id: inventoryLevel.id,
    stocked_quantity: MathBN.add(inventoryLevel.stocked_quantity, adjustment)
  })
  
  return result
}
```

**Nuestra versión:**
```typescript
async ajustarStock(
  itemInventarioId: number,
  bodegaId: number,
  ajuste: number,
  motivo: 'compra' | 'venta' | 'transferencia' | 'ajuste'
): Promise<void> {
  // RPC para ajuste transaccional
  await this.supabase.rpc('ajustar_stock', {
    p_item_inventario_id: itemInventarioId,
    p_bodega_id: bodegaId,
    p_cantidad: ajuste,
    p_motivo: motivo
  })
  
  // Registrar movimiento (audit trail)
  await this.supabase.from('movimientos_inventario').insert({
    item_inventario_id: itemInventarioId,
    bodega_id: bodegaId,
    tipo: ajuste > 0 ? 'entrada' : 'salida',
    gramos: Math.abs(ajuste),
    motivo
  })
}
```

**Aprendizaje:**
- **RPC para atomicidad** (no se puede hacer en 2 queries)
- **Audit trail obligatorio** (movimientos_inventario)
- **Validar motivo** (trazabilidad)

### 4. Availability Check Pattern (Verificación de Disponibilidad)

**MedusaJS:**
```typescript
async confirmInventory(
  inventoryItemId: string,
  locationIds: string[],
  quantity: BigNumberInput
): Promise<boolean> {
  const availableQuantity = await this.retrieveAvailableQuantity(
    inventoryItemId,
    locationIds
  )
  return MathBN.gte(availableQuantity, quantity)
}
```

**Nuestra versión:**
```typescript
async verificarDisponibilidad(
  itemInventarioId: number,
  gramos: number
): Promise<boolean> {
  const stock = await this.getStockByItem(itemInventarioId)
  return stock.gramos_disponibles >= gramos
}

async getStockByItem(itemInventarioId: number) {
  const { data } = await this.supabase
    .from('gramos_disponibles')
    .select('*')
    .eq('item_inventario_id', itemInventarioId)
    .single()
  
  return {
    item_inventario_id: itemInventarioId,
    gramos_stock: data?.gramos_stock || 0,
    gramos_reservados: data?.gramos_reservados || 0,
    gramos_disponibles: data?.gramos_disponibles || 0
  }
}
```

**Aprendizaje:**
- **Vista materializada** (gramos_disponibles) para performance
- **Separar stock total de disponible** (reservas)
- **Método simple de verificación** (confirmInventory)

### 5. Error Handling Pattern

**MedusaJS:**
```typescript
throw new MedusaError(
  MedusaError.Types.NOT_FOUND,
  `Inventory level for item ${inventoryItemId} and location ${locationId} not found`
)

throw new MedusaError(
  MedusaError.Types.NOT_ALLOWED,
  `Not enough stock available for item ${inventoryItemId} at location ${locationId}`
)
```

**Nuestra versión:**
```typescript
// Tipos de error personalizados
export class InsufficientStockError extends Error {
  constructor(itemInventarioId: number, gramosDisponibles: number, gramosSolicitados: number) {
    super(`Stock insuficiente: ${gramosDisponibles}g disponibles, ${gramosSolicitados}g solicitados`)
    this.name = 'InsufficientStockError'
  }
}

export class ItemNotFoundError extends Error {
  constructor(itemInventarioId: number) {
    super(`Item de inventario ${itemInventarioId} no encontrado`)
    this.name = 'ItemNotFoundError'
  }
}

// Uso
if (stock.gramos_disponibles < gramos) {
  throw new InsufficientStockError(itemInventarioId, stock.gramos_disponibles, gramos)
}
```

**Aprendizaje:**
- **Tipos de error específicos** (no genéricos)
- **Contexto en el error** (qué item, cuánto stock)
- **Nombre del error** para manejo en UI

---

## 🎯 Mejoras para Nuestro L-Medusa

### Basado en el análisis de MedusaJS:

| Área | Nuestro estado actual | Mejora propuesta |
|------|----------------------|------------------|
| **Transacciones** | RPC individuales | Wrapping de múltiples operaciones |
| **Tipos** | Interfaces básicas | DTOs tipados con validación |
| **Errores** | throw Error genérico | Clases de error específicas |
| **Audit** | Movimientos separados | Integrado en cada operación |
| **Performance** | Queries individuales | Vistas materializadas |
| **Testing** | Mock básico | Mock con edge cases |

### Prioridad de implementación:

1. **Inmediato** (esta semana):
   - Tipos de error específicos
   - Vista materializada `gramos_disponibles`
   - RPC `incrementar_reserva`, `confirmar_deduccion`, `ajustar_stock`

2. **Corto plazo** (próxima semana):
   - Audit trail completo
   - Validaciones de stock antes de reserva
   - Manejo de concurrency

3. **Mediano plazo** (próximas semanas):
   - Testing con edge cases
   - Performance optimization
   - Monitoring de stock

---

## 📚 Patrones que NO adoptamos

| Patrón MedusaJS | Por qué no |
|-----------------|------------|
| **MedusaService base class** | Demasiada complejidad para nuestro caso |
| **Awilix DI Container** | Overkill para 6 services simples |
| **Workflows** | No necesitamos orchestration compleja |
| **Event Bus** | No tenemos eventos asíncronos aún |
| **Module Joiner** | No cruzamos módulos |

---

## ✅ Checklist de Mejoras

- [ ] Crear tipos de error específicos
- [ ] Implementar vista `gramos_disponibles` en Supabase
- [ ] Crear RPC functions (incrementar_reserva, etc.)
- [ ] Agregar audit trail en todas las operaciones
- [ ] Testing con edge cases (stock 0, concurrente, etc.)
- [ ] Documentación de patrones adoptados

---

**Conclusión**: MedusaJS tiene patrones excelentes que podemos adoptar **sin su complejidad**. El más valioso es el **Reservation Pattern** con RPC transaccional — es exactamente lo que necesitamos para manejar stock real.
