# Technical Design: L-Medusa Complete Architecture

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    OCTAVO FUEGO STACK                       │
├─────────────────────────────────────────────────────────────┤
│  Frontend: Astro 6.1.3 + TailwindCSS 4 + Alfred UI        │
│  Backend:  Astro SSR + Supabase PostgreSQL                 │
│  Auth:     Supabase Auth                                   │
│  Storage:  Supabase Storage (images)                       │
│  Payments: Wompi (CO) + Stripe (BR/EU/US)                  │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

```
User Request → Astro SSR → Supabase Client → PostgreSQL
                                    ↓
                              RPC Functions
                                    ↓
                              Business Logic
                                    ↓
                              Response → User
```

## Component Design

### Phase 1: Foundation

#### Supabase Client (src/lib/supabase.ts)
```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = import.meta.env.SUPABASE_URL
const supabaseKey = import.meta.env.SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)
```

#### Error Classes (src/lib/errors.ts)
```typescript
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

export class ReservationExpiredError extends Error {
  constructor(reservaId: number) {
    super(`Reserva ${reservaId} expirada`)
    this.name = 'ReservationExpiredError'
  }
}
```

#### Inventory Service (src/lib/inventory/supabase.ts)
```typescript
import { supabase } from '@/lib/supabase'
import { InsufficientStockError, ItemNotFoundError } from '@/lib/errors'

export class SupabaseInventoryService {
  async getStockByItem(itemInventarioId: number) {
    const { data, error } = await supabase
      .from('gramos_disponibles')
      .select('*')
      .eq('item_inventario_id', itemInventarioId)
      .single()
    
    if (error || !data) throw new ItemNotFoundError(itemInventarioId)
    
    return {
      item_inventario_id: itemInventarioId,
      gramos_stock: data.gramos_stock || 0,
      gramos_reservados: data.gramos_reservados || 0,
      gramos_disponibles: data.gramos_disponibles || 0
    }
  }

  async crearReserva(itemInventarioId: number, gramos: number, ordenId?: number) {
    // 1. Verify stock
    const stock = await this.getStockByItem(itemInventarioId)
    if (stock.gramos_disponibles < gramos) {
      throw new InsufficientStockError(itemInventarioId, stock.gramos_disponibles, gramos)
    }
    
    // 2. Create reservation
    const { data: reserva, error } = await supabase
      .from('reservas')
      .insert({
        item_inventario_id: itemInventarioId,
        orden_id: ordenId,
        gramos_reservados: gramos,
        estado: 'activa'
      })
      .select()
      .single()
    
    if (error) throw error
    
    // 3. RPC to increment reservation
    await supabase.rpc('incrementar_reserva', {
      p_item_inventario_id: itemInventarioId,
      p_gramos: gramos
    })
    
    return reserva
  }

  async ajustarStock(itemInventarioId: number, bodegaId: number, ajuste: number, motivo: string) {
    // RPC for atomic adjustment
    await supabase.rpc('ajustar_stock', {
      p_item_inventario_id: itemInventarioId,
      p_bodega_id: bodegaId,
      p_cantidad: ajuste,
      p_motivo: motivo
    })
    
    // Audit trail
    await supabase.from('movimientos_inventario').insert({
      item_inventario_id: itemInventarioId,
      bodega_id: bodegaId,
      tipo: ajuste > 0 ? 'entrada' : 'salida',
      gramos: Math.abs(ajuste),
      motivo
    })
  }
}
```

### Phase 2: Core Ecommerce

#### Cart Service (src/lib/cart/supabase.ts)
```typescript
import { supabase } from '@/lib/supabase'
import { InsufficientStockError } from '@/lib/errors'

export class SupabaseCartService {
  async crearCarrito(clienteId?: number) {
    const { data, error } = await supabase
      .from('carritos')
      .insert({ cliente_id: clienteId })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async agregarItem(carritoId: number, productoId: number, gramos: number, varianteId?: number) {
    // Check stock first
    const { data: stock } = await supabase
      .from('gramos_disponibles')
      .select('gramos_disponibles')
      .eq('item_inventario_id', productoId)
      .single()
    
    if (!stock || stock.gramos_disponibles < gramos) {
      throw new InsufficientStockError(productoId, stock?.gramos_disponibles || 0, gramos)
    }
    
    // Add item
    const { data, error } = await supabase
      .from('items_carrito')
      .insert({
        carrito_id: carritoId,
        producto_id: productoId,
        variante_id: varianteId,
        gramos
      })
      .select()
      .single()
    
    if (error) throw error
    
    // Create reservation
    await supabase.rpc('incrementar_reserva', {
      p_item_inventario_id: productoId,
      p_gramos: gramos
    })
    
    return data
  }
}
```

#### Order Service (src/lib/orders/supabase.ts)
```typescript
import { supabase } from '@/lib/supabase'

export class SupabaseOrdersService {
  async crearOrden(carritoId: number, datosCliente: any) {
    // Get cart items
    const { data: items } = await supabase
      .from('items_carrito')
      .select('*')
      .eq('carrito_id', carritoId)
    
    // Create order
    const { data: orden, error } = await supabase
      .from('ordenes')
      .insert({
        carrito_id: carritoId,
        cliente_id: datosCliente.clienteId,
        estado: 'pendiente',
        total: items?.reduce((sum, item) => sum + (item.precio_unitario * item.gramos), 0) || 0
      })
      .select()
      .single()
    
    if (error) throw error
    
    // Create order items
    await supabase.from('items_orden').insert(
      items?.map(item => ({
        orden_id: orden.id,
        producto_id: item.producto_id,
        variante_id: item.variante_id,
        gramos: item.gramos,
        precio_unitario: item.precio_unitario
      })) || []
    )
    
    return orden
  }

  async actualizarEstado(ordenId: number, nuevoEstado: string) {
    const { error } = await supabase
      .from('ordenes')
      .update({ estado: nuevoEstado })
      .eq('id', ordenId)
    
    if (error) throw error
    
    // Audit trail
    await supabase.from('movimientos_inventario').insert({
      orden_id: ordenId,
      tipo: 'cambio_estado',
      motivo: nuevoEstado
    })
  }
}
```

### Phase 3: Advanced Features

#### Payment Router (src/lib/payment/router.ts)
```typescript
import { WompiGateway } from './wompi'
import { StripeGateway } from './stripe'

export class PaymentRouter {
  private wompi: WompiGateway
  private stripe: StripeGateway

  constructor() {
    this.wompi = new WompiGateway()
    this.stripe = new StripeGateway()
  }

  async processPayment(regionId: number, amount: number, currency: string, metadata: any) {
    // Route to correct gateway based on region
    switch (currency) {
      case 'COP':
        return await this.wompi.charge(amount, metadata)
      case 'BRL':
      case 'USD':
        return await this.stripe.charge(amount, currency, metadata)
      default:
        throw new Error(`Unsupported currency: ${currency}`)
    }
  }
}
```

#### Reservation Expiry (Edge Function)
```typescript
// supabase/functions/expire-reservations/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Expire reservations older than 15 minutes
  const { data, error } = await supabase
    .from('reservas')
    .update({ estado: 'expirada' })
    .eq('estado', 'activa')
    .lt('created_at', new Date(Date.now() - 15 * 60 * 1000).toISOString())
    .select()

  if (error) throw error

  // Release stock for expired reservations
  for (const reserva of data || []) {
    await supabase.rpc('confirmar_deduccion', {
      p_reserva_id: reserva.id
    })
  }

  return new Response(
    JSON.stringify({ expired: data?.length || 0 }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
```

### Phase 4: Enterprise

#### Admin Panel (src/pages/admin/index.astro)
```astro
---
import Layout from '@/layouts/Layout.astro'
import { supabase } from '@/lib/supabase'

// Get stats
const { data: ordenes } = await supabase
  .from('ordenes')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(10)

const { data: stock } = await supabase
  .from('gramos_disponibles')
  .select('*')
---

<Layout title="Admin Dashboard">
  <h1>Dashboard</h1>
  
  <section>
    <h2>Órdenes Recientes</h2>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Cliente</th>
          <th>Total</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        {ordenes?.map(orden => (
          <tr>
            <td>{orden.display_id}</td>
            <td>{orden.cliente_id}</td>
            <td>{orden.total}</td>
            <td>{orden.estado}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </section>
  
  <section>
    <h2>Stock Disponible</h2>
    <div class="grid">
      {stock?.map(item => (
        <div class="card">
          <h3>Item #{item.item_inventario_id}</h3>
          <p>Stock: {item.gramos_stock}g</p>
          <p>Reservado: {item.gramos_reservados}g</p>
          <p>Disponible: {item.gramos_disponibles}g</p>
        </div>
      ))}
    </div>
  </section>
</Layout>
```

## Database Design

### Existing Tables (19)
- productos, variantes, bodegas, items_inventario
- niveles_inventario, reservas, transferencias
- grupos_clientes, clientes, listas_precio
- carritos, items_carrito
- ordenes, items_orden
- movimientos_inventario
- regiones, factores_conversion, tarifas_envio

### Existing Views (3)
- gramos_disponibles (auto-calculates stock - reserved)

### Existing RPC Functions (3)
- incrementar_reserva
- confirmar_deduccion
- ajustar_stock

### New Tables (Phase 3)
- pagos (payment records)
- notificaciones (notification log)

## API Design

### Phase 1
- No new endpoints (services used directly)

### Phase 2
- POST /api/cart — Create cart
- POST /api/cart/items — Add item
- POST /api/checkout — Process checkout
- POST /api/orders — Create order

### Phase 3
- POST /api/payments/wompi — Process Wompi payment
- POST /api/payments/stripe — Process Stripe payment
- GET /api/reservations/check — Check reservation status

### Phase 4
- GET /api/admin/stats — Dashboard stats
- GET /api/admin/orders — List orders
- GET /api/admin/inventory — List inventory

## Security Design

### Row Level Security (RLS)
- All tables have RLS enabled
- Policies based on user role (admin, customer, wholesale)
- API routes validate authentication

### Authentication
- Supabase Auth for customer login
- Service role for admin operations
- JWT tokens for API access

## Performance Design

### Caching
- Redis for session data (future)
- CDN for static assets
- Browser caching for product images

### Optimization
- Database indexes on frequently queried columns
- Connection pooling for Supabase
- Lazy loading for admin dashboard

## Error Handling

### Recovery
- Automatic retry for failed payments
- Manual override for stuck orders
- Stock adjustment for edge cases

### Logging
- Supabase logs for database operations
- Client-side logging for errors
- Admin notifications for critical errors

## Free Tier Considerations

### Limitations
- No pg_cron (scheduled functions)
- 500MB database limit
- 1GB storage limit
- Limited edge function invocations

### Workarounds
- Edge Function for nocturnal cleanup (instead of pg_cron)
- On-request checks for reservation expiry
- Client-side timers for UI feedback
- Monitor database size, upgrade path ready
