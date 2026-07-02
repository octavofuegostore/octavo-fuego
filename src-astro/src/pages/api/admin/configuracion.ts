import type { APIRoute } from 'astro'
import { supabase } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

export const prerender = false

const SUPABASE_CONFIGURED = !!(
  import.meta.env.PUBLIC_SUPABASE_URL &&
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY
)

async function getUser(cookies: { get: (n: string) => { value?: string } | undefined }) {
  const token = cookies.get('of_admin_token')?.value
  if (!token) return null
  return await verifyToken(token)
}

const DEFAULTS: Record<string, string> = {
  nombre: 'Octavo Fuego',
  email: 'contacto@octavofuego.com',
  telefono: '+57 300 123 4567',
  moneda: 'COP',
  unidad: 'g',
  stock_min: '100',
  reserva_tiempo: '15',
  envio_costo: '8000',
  alertas_stock: 'true',
  checkout_whatsapp: 'true',
  modo_mayorista: 'false',
}

export const GET: APIRoute = async ({ cookies }) => {
  const user = await getUser(cookies)
  if (!user) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 })
  }

  if (!SUPABASE_CONFIGURED) {
    return new Response(JSON.stringify({ success: true, data: DEFAULTS }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const { data, error } = await supabase
      .from('configuracion')
      .select('clave, valor')

    if (error) {
      console.error('[API] Error fetching config:', error)
      // Return defaults if table doesn't exist
      return new Response(JSON.stringify({ success: true, data: DEFAULTS }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const config: Record<string, string> = { ...DEFAULTS }
    for (const row of data ?? []) {
      config[row.clave] = row.valor
    }

    return new Response(JSON.stringify({ success: true, data: config }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[API] Error in GET config:', err)
    return new Response(JSON.stringify({ success: true, data: DEFAULTS }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const user = await getUser(cookies)
  if (!user) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 })
  }

  if (!SUPABASE_CONFIGURED) {
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const body = await request.json()
    const entries = Object.entries(body).filter(([key]) => key in DEFAULTS)

    if (entries.length === 0) {
      return new Response(JSON.stringify({ error: 'No hay campos válidos' }), { status: 400 })
    }

    // Upsert each entry
    let saved = 0
    const errors: string[] = []
    for (const [clave, valor] of entries) {
      const { error } = await supabase
        .from('configuracion')
        .upsert({ clave, valor: String(valor) }, { onConflict: 'clave' })

      if (error) {
        console.error(`[API] Error saving config ${clave}:`, error)
        errors.push(clave)
      } else {
        saved++
      }
    }

    if (errors.length > 0) {
      return new Response(JSON.stringify({
        success: false,
        saved,
        errors,
        message: `${errors.length} de ${entries.length} campos fallaron al guardar`,
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true, saved }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[API] Error in POST config:', err)
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { status: 500 })
  }
}
