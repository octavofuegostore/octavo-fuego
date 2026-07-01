-- ═══════════════════════════════════════════════════════════════════════════════
-- Octavo Fuego — Migration 009: Inventory Reservations Fix
-- ═══════════════════════════════════════════════════════════════════════════════
-- Adds: liberar_reserva RPC, FOR UPDATE on incrementar_reserva
-- Run AFTER 008_admin_seed.sql
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────
-- Fix: incrementar_reserva con FOR UPDATE
-- ─────────────────────────────────────────

create or replace function incrementar_reserva(
  p_item_id uuid,
  p_bodega_id uuid,
  p_gramos integer,
  p_orden_id uuid default null
) returns uuid as $$
declare
  v_disponible integer;
  v_reserva_id uuid;
begin
  select gramos_stock - gramos_reserva into v_disponible
  from niveles_inventario
  where id = p_item_id and bodega_id = p_bodega_id
  for update;

  if v_disponible < p_gramos then
    raise exception 'Stock insuficiente: disponible %, solicitado %', v_disponible, p_gramos;
  end if;

  insert into reservas (item_id, bodega_id, gramos, orden_id, estado)
  values (p_item_id, p_bodega_id, p_gramos, p_orden_id, 'pendiente')
  returning id into v_reserva_id;

  update niveles_inventario
  set gramos_reserva = gramos_reserva + p_gramos
  where id = p_item_id and bodega_id = p_bodega_id;

  return v_reserva_id;
end;
$$ language plpgsql;

-- ─────────────────────────────────────────
-- New: liberar_reserva
-- ─────────────────────────────────────────

create or replace function liberar_reserva(p_reserva_id uuid)
returns void as $$
declare
  v_item_id uuid;
  v_bodega_id uuid;
  v_gramos integer;
begin
  select item_id, bodega_id, gramos into v_item_id, v_bodega_id, v_gramos
  from reservas
  where id = p_reserva_id and estado = 'pendiente'
  for update;

  if not found then
    raise exception 'Reserva no encontrada o ya procesada: %', p_reserva_id;
  end if;

  update niveles_inventario
  set gramos_reserva = gramos_reserva - v_gramos
  where id = v_item_id and bodega_id = v_bodega_id;

  update reservas
  set estado = 'cancelada'
  where id = p_reserva_id;
end;
$$ language plpgsql;

-- ─────────────────────────────────────────
-- Confirmar reserva (convertir pendiente → confirmada)
-- ─────────────────────────────────────────

create or replace function confirmar_reserva(p_reserva_id uuid)
returns void as $$
declare
  v_item_id uuid;
  v_bodega_id uuid;
  v_gramos integer;
begin
  select item_id, bodega_id, gramos into v_item_id, v_bodega_id, v_gramos
  from reservas
  where id = p_reserva_id and estado = 'pendiente'
  for update;

  if not found then
    raise exception 'Reserva no encontrada o ya procesada: %', p_reserva_id;
  end if;

  update reservas
  set estado = 'confirmada'
  where id = p_reserva_id;

  -- Descontar del stock real (la reserva ya está en gramos_reserva)
  update niveles_inventario
  set gramos_stock = gramos_stock - v_gramos,
      gramos_reserva = gramos_reserva - v_gramos
  where id = v_item_id and bodega_id = v_bodega_id;
end;
$$ language plpgsql;
