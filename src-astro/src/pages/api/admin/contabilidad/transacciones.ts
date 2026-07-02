import type { APIRoute } from 'astro'
import { supabase } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

export const prerender = false

async function getUser(cookies: { get: (n: string) => { value?: string } | undefined }) {
  const token = cookies.get('of_admin_token')?.value
  if (!token) return null
  return await verifyToken(token)
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const user = await getUser(cookies)
  if (!user) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 })
  }

  try {
    const body = await request.json()
    const { tipo, descripcion, categoria_id, monto, fecha, moneda, metodo_pago } = body

    // Validate required fields
    if (!tipo || !descripcion || !categoria_id || monto === undefined || !fecha) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos requeridos: tipo, descripcion, categoria_id, monto, fecha' }),
        { status: 400 },
      )
    }

    if (!['ingreso', 'egreso'].includes(tipo)) {
      return new Response(
        JSON.stringify({ error: 'El tipo debe ser "ingreso" o "egreso"' }),
        { status: 400 },
      )
    }

    if (typeof monto !== 'number' || monto <= 0) {
      return new Response(
        JSON.stringify({ error: 'El monto debe ser un número positivo' }),
        { status: 400 },
      )
    }

    const { data, error } = await supabase
      .from('transacciones')
      .insert({
        tipo,
        descripcion: descripcion.trim(),
        categoria_id,
        monto,
        fecha,
        moneda: moneda || 'COP',
        metodo_pago: metodo_pago || null,
      })
      .select()
      .single()

    if (error) {
      console.error('[API] Error creando transacción:', error)
      return new Response(
        JSON.stringify({ error: 'Error al crear la transacción' }),
        { status: 500 },
      )
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[API] Error en POST transacciones:', err)
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500 },
    )
  }
}
