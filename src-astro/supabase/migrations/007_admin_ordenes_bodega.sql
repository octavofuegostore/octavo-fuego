-- ═══════════════════════════════════════════════════════════════════════════════
-- Octavo Fuego — Migration 007: Multi-Bodega + RLS para Admin
-- ═══════════════════════════════════════════════════════════════════════════════
-- Adds: bodega_id on ordenes, RLS policies for multi-bodega access,
--       functions for admin dashboard queries
-- Run AFTER 006_admin_pagos.sql
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────
-- ORDENES: agregar bodega_id
-- ─────────────────────────────────────────

alter table ordenes
  add column bodega_id uuid references bodegas(id);

create index idx_ordenes_bodega on ordenes(bodega_id);

comment on column ordenes.bodega_id is 'Bodega a la que pertenece la orden — CO o BR. null hasta migrar datos.';

-- Actualizar órdenes existentes (seed data) — asignar bodega según región del cliente
-- Correr SOLO si hay datos. Si no hay órdenes, no hace nada.
do $$
begin
  if exists (select 1 from ordenes limit 1) then
    update ordenes o
    set bodega_id = r.bodega_default
    from clientes c
    left join regiones r on r.codigo = c.pais
    where o.cliente_id = c.id
    and o.bodega_id is null;
  end if;
end $$;

-- ─────────────────────────────────────────
-- CLIENTES: sync b2b_estado con solicitudes aprobadas
-- ─────────────────────────────────────────

-- Trigger: cuando se aprueba una solicitud B2B, actualizar el cliente
create or replace function aprobar_solicitud_b2b()
returns trigger as $$
begin
  if NEW.estado = 'aprobada' and OLD.estado = 'pendiente' then
    update clientes
    set b2b_estado = 'aprobado',
        grupo_id = (select id from grupos_clientes where codigo = 'mayorista'),
        aprobado_en = now()
    where id = NEW.cliente_id;
  end if;

  if NEW.estado = 'rechazada' and OLD.estado = 'pendiente' then
    update clientes
    set b2b_estado = 'rechazado'
    where id = NEW.cliente_id;
  end if;

  return NEW;
end;
$$ language plpgsql;

create trigger trg_solicitud_b2b_aprobada
  after update on solicitudes_b2b
  for each row
  when (OLD.estado = 'pendiente' and NEW.estado in ('aprobada', 'rechazada'))
  execute function aprobar_solicitud_b2b();

-- ─────────────────────────────────────────
-- RLS Multi-bodega para PRODUCTOS
-- ─────────────────────────────────────────

alter table productos enable row level security;

-- Admin ve todos
create policy "Admin ve todos los productos"
  on productos for select
  using (auth.uid() in (select id from usuarios where role = 'admin'));

-- Usuario b2b_client ve solo productos disponibles en su bodega
create policy "B2B client ve productos de su bodega"
  on productos for select
  using (
    auth.uid() in (
      select u.id from usuarios u
      where u.role = 'b2b_client'
      and (
        -- producto disponible_en contiene el código de la bodega del usuario
        u.bodega_id = any(
          select b2.id from bodegas b2
          where b2.codigo = any(productos.disponible_en)
          and b2.id = u.bodega_id
        )
      )
    )
  );

-- ─────────────────────────────────────────
-- RLS Multi-bodega para ÓRDENES
-- ─────────────────────────────────────────

alter table ordenes enable row level security;

-- Admin ve todas
create policy "Admin ve todas las órdenes"
  on ordenes for select
  using (auth.uid() in (select id from usuarios where role = 'admin'));

-- B2B client ve solo sus órdenes
create policy "B2B client ve sus órdenes"
  on ordenes for select
  using (
    ordenes.cliente_id in (
      select c2.id from clientes c2
      where c2.auth_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────
-- VISTA: Dashboard Stats por bodega
-- ─────────────────────────────────────────

create or replace view dashboard_stats as
select
  b.id as bodega_id,
  b.codigo as bodega_codigo,
  count(distinct o.id) as total_ordenes,
  coalesce(sum(o.total_cop), 0) as ingresos_cop,
  coalesce(sum(o.total_brl), 0) as ingresos_brl,
  coalesce(sum(o.total_usd), 0) as ingresos_usd,
  count(distinct o.id) filter (where o.estado = 'pendiente') as ordenes_pendientes,
  count(distinct p2.id) as total_productos,
  count(distinct v.id) as total_variantes,
  (
    select count(*)
    from niveles_inventario ni
    where ni.bodega_id = b.id
    and ni.gramos_stock - ni.gramos_reserva < ni.gramos_alerta
  ) as productos_stock_bajo
from bodegas b
left join ordenes o on o.bodega_id = b.id
left join productos p2 on b.codigo = any(p2.disponible_en)
left join variantes v on v.producto_id = p2.id
group by b.id, b.codigo;

comment on view dashboard_stats is 'Estadísticas del dashboard agregadas por bodega — para el admin panel';
