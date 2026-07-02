import type { APIRoute } from 'astro'
import { supabase } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

export const prerender = false

async function getUser(cookies: { get: (n: string) => { value?: string } | undefined }) {
  const token = cookies.get('of_admin_token')?.value
  if (!token) return null
  return await verifyToken(token)
}

export const PUT: APIRoute = async ({ params, request, cookies }) => {
  const user = await getUser(cookies)
  if (!user) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 })
  }

  const { id } = params
  if (!id) {
    return new Response(JSON.stringify({ error: 'ID requerido' }), { status: 400 })
  }

  try {
    const body = await request.json()
    const updateData: Record<string, unknown> = {}

    // Only allow updating specific fields
    if (body.tipo !== undefined) {
      if (!['ingreso', 'egreso'].includes(body.tipo)) {
        return new Response(
          JSON.stringify({ error: 'El tipo debe ser "ingreso" o "egreso"' }),
          { status: 400 },
        )
      }
      updateData.tipo = body.tipo
    }
    if (body.descripcion !== undefined) {
      updateData.descripcion = body.descripcion.trim()
    }
    if (body.categoria_id !== undefined) {
      updateData.categoria_id = body.categoria_id
    }
    if (body.monto !== undefined) {
      if (typeof body.monto !== 'number' || body.monto <= 0) {
        return new Response(
          JSON.stringify({ error: 'El monto debe ser un número positivo' }),
          { status: 400 },
        )
      }
      updateData.monto = body.monto
    }
    if (body.fecha !== undefined) {
      updateData.fecha = body.fecha
    }
    if (body.moneda !== undefined) {
      updateData.moneda = body.moneda
    }
    if (body.metodo_pago !== undefined) {
      updateData.metodo_pago = body.metodo_pago || null
    }

    if (Object.keys(updateData).length === 0) {
      return new Response(
        JSON.stringify({ error: 'No hay campos para actualizar' }),
        { status: 400 },
      )
    }

    const { data, error } = await supabase
      .from('transacciones')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return new Response(
          JSON.stringify({ error: 'Transacción no encontrada' }),
          { status: 404 },
        )
      }
      console.error('[API] Error actualizando transacción:', error)
      return new Response(
        JSON.stringify({ error: 'Error al actualizar la transacción',  }),
        { status: 500 },
      )
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[API] Error en PUT transacciones:', err)
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500 },
    )
  }
}

export const DELETE: APIRoute = async ({ params, cookies }) => {
  const user = await getUser(cookies)
  if (!user) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 })
  }

  const { id } = params
  if (!id) {
    return new Response(JSON.stringify({ error: 'ID requerido' }), { status: 400 })
  }

  try {
    const { error } = await supabase
      .from('transacciones')
      .delete()
      .eq('id', id)
      .select('id')
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return new Response(
          JSON.stringify({ error: 'Transacción no encontrada' }),
          { status: 404 },
        )
      }
      console.error('[API] Error eliminando transacción:', error)
      return new Response(
        JSON.stringify({ error: 'Error al eliminar la transacción',  }),
        { status: 500 },
      )
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[API] Error en DELETE transacciones:', err)
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500 },
    )
  }
}
