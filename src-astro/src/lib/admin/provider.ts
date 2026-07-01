import { supabase } from '@/lib/supabase'
import { ProductoService } from '@/lib/admin/services/productos'
import { OrdenService } from '@/lib/admin/services/ordenes'
import { ClienteService } from '@/lib/admin/services/clientes'
import { PagoService } from '@/lib/admin/services/pagos'
import { eventBus } from '@/lib/admin/eventos'
import { setAdminUser, clearAdminUser } from '@/stores/admin'

export function crearServicios(bodegaId?: string) {
  return {
    productos: new ProductoService(supabase, bodegaId),
    ordenes: new OrdenService(supabase, bodegaId),
    clientes: new ClienteService(supabase, bodegaId),
    pagos: new PagoService(supabase, bodegaId),
  }
}

export type Servicios = ReturnType<typeof crearServicios>

export function initAdminSession(user: { id: string; email: string; nombre: string; role: 'admin' | 'b2b_client' | 'viewer' }): void {
  setAdminUser(user)
}

export function endAdminSession(): void {
  clearAdminUser()
}
