/**
 * Supabase Client Singleton
 * For Octavo Fuego — L-Medusa backend
 *
 * Usage:
 *   import { supabase } from '@/lib/supabase';
 *
 *   const { data, error } = await supabase.from('productos').select('*');
 *
 * Note: This uses the SERVICE_KEY for server-side operations.
 * For client-side (browser), use PUBLIC_SUPABASE_ANON_KEY instead.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// ─── Server-side client (with service role key) ──────────────────────────────

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn(
    '⚠️ Supabase credentials not configured. Using mock data instead.'
  );
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseServiceKey || 'placeholder-key'
);

// ─── Client-side client (with anon key) ──────────────────────────────────────

let _clientSide: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (_clientSide) return _clientSide;

  const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

  _clientSide = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    anonKey || 'placeholder-key'
  );

  return _clientSide;
}

// ─── Type helpers ────────────────────────────────────────────────────────────

export type Database = {
  public: {
    Tables: {
      productos: {
        Row: {
          id: string;
          slug: string;
          nombre_es: string;
          nombre_en: string;
          nombre_pt: string;
          descripcion_es: string | null;
          descripcion_en: string | null;
          descripcion_pt: string | null;
          activo: boolean;
          creado_en: string;
        };
      };
      variantes: {
        Row: {
          id: string;
          producto_id: string;
          gramos: number;
          precio_cop: number;
          precio_brl: number | null;
          precio_usd: number | null;
          sku: string;
          activo: boolean;
        };
      };
      bodegas: {
        Row: {
          id: string;
          codigo: string;
          nombre: string;
          pais: string;
          activa: boolean;
        };
      };
      items_inventario: {
        Row: {
          id: string;
          variante_id: string;
          sku: string;
        };
      };
      niveles_inventario: {
        Row: {
          id: string;
          item_id: string;
          bodega_id: string;
          gramos_stock: number;
          gramos_reserva: number;
          gramos_alerta: number;
        };
      };
      reservas: {
        Row: {
          id: string;
          item_id: string;
          bodega_id: string;
          gramos: number;
          orden_id: string | null;
          estado: string;
          expira_en: string;
          creado_en: string;
        };
      };
      clientes: {
        Row: {
          id: string;
          auth_id: string | null;
          email: string;
          nombre_empresa: string | null;
          telefono: string | null;
          pais: string | null;
          nit_cnpj: string | null;
          grupo_id: string | null;
          b2b_estado: string;
          volumen_mensual: string | null;
          aprobado_en: string | null;
          creado_en: string;
        };
      };
      ordenes: {
        Row: {
          id: string;
          display_id: number;
          cliente_id: string | null;
          carrito_id: string | null;
          estado: string;
          total_cop: number | null;
          total_brl: number | null;
          total_usd: number | null;
          canal: string;
          notas: string | null;
          creado_en: string;
        };
      };
      movimientos_inventario: {
        Row: {
          id: string;
          item_id: string;
          bodega_id: string;
          tipo: string;
          gramos: number;
          referencia: string | null;
          notas: string | null;
          creado_en: string;
        };
      };
    };
    Views: {
      gramos_disponibles: {
        Row: {
          id: string;
          item_id: string;
          bodega_id: string;
          bodega_codigo: string;
          pais: string;
          gramos_variante: number;
          sku: string;
          producto_slug: string;
          gramos_disponibles: number;
          gramos_stock: number;
          gramos_reserva: number;
          gramos_alerta: number;
          alerta_stock_bajo: boolean;
        };
      };
    };
    Functions: {
      incrementar_reserva: {
        Args: { p_item_id: string; p_bodega_id: string; p_gramos: number };
        Returns: void;
      };
      confirmar_deduccion: {
        Args: { p_item_id: string; p_bodega_id: string; p_gramos: number };
        Returns: void;
      };
      ajustar_stock: {
        Args: { p_item_id: string; p_bodega_id: string; p_gramos: number };
        Returns: void;
      };
    };
  };
};
