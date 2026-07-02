import type { APIRoute } from 'astro'
import { supabase } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

export const prerender = false

export const GET: APIRoute = async ({ cookies }) => {
  // Verify admin auth
  const token = cookies.get('of_admin_token')?.value
  if (!token) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 })
  }
  const user = await verifyToken(token)
  if (!user) {
    return new Response(JSON.stringify({ error: 'Sesión inválida' }), { status: 401 }, { headers: { 'Content-Type': 'application/json' } })
  }

  const SUPABASE_CONFIGURED = !!(
    import.meta.env.PUBLIC_SUPABASE_URL &&
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY
  )

  if (!SUPABASE_CONFIGURED) {
    return new Response(JSON.stringify({ count: 0 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const { count } = await supabase
      .from('gramos_disponibles')
      .select('*', { count: 'exact', head: true })
      .eq('alerta_stock_bajo', true)

    return new Response(JSON.stringify({ count: count ?? 0 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch {
    return new Response(JSON.stringify({ count: 0 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
