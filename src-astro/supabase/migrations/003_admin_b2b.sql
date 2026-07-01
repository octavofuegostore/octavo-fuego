-- ═══════════════════════════════════════════════════════════════════════════════
-- Octavo Fuego — Migration 003: B2B + Wholesale Catalog
-- ═══════════════════════════════════════════════════════════════════════════════
-- Adds: tipo_venta/disponible_en on productos, wholesale pricing on variantes,
--       solicitudes_b2b queue, RLS policies
-- Run AFTER 002_admin_auth.sql
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────
-- PRODUCTOS: tipo_venta + disponible_en
-- ─────────────────────────────────────────

alter table productos
  add column tipo_venta     text not null default 'b2c'
    check (tipo_venta in ('b2c', 'b2b', 'ambos')),
  add column disponible_en  text[] not null default '{CO,BR}'
    check (disponible_en <@ '{CO,BR}');

comment on column productos.tipo_venta is 'b2c: solo minorista | b2b: solo mayorista | ambos: ambos canales';
comment on column productos.disponible_en is 'Bodegas donde está disponible el producto: CO, BR';

-- ─────────────────────────────────────────
-- VARIANTES: precios mayoristas + cantidad mínima
-- ─────────────────────────────────────────

alter table variantes
  add column precio_mayorista_cop     integer,
  add column precio_mayorista_brl     numeric(10,2),
  add column precio_mayorista_usd     numeric(10,2),
  add column cantidad_minima_mayorista integer default 500;

comment on column variantes.precio_mayorista_cop is 'Precio por unidad en COP para clientes B2B';
comment on column variantes.precio_mayorista_brl is 'Precio por unidad en BRL para clientes B2B';
comment on column variantes.precio_mayorista_usd is 'Precio por unidad en USD para clientes B2B';
comment on column variantes.cantidad_minima_mayorista is 'Cantidad mínima de gramos para pedido B2B';

-- ─────────────────────────────────────────
-- SOLICITUDES B2B (Approval Queue)
-- ─────────────────────────────────────────

create table solicitudes_b2b (
  id              uuid primary key default gen_random_uuid(),
  cliente_id      uuid references clientes(id) on delete cascade,
  nombre_empresa  text not null,
  nombre_contacto text not null,
  email           text not null,
  telefono        text,
  tax_id          text,                      -- NIT (CO) / CNPJ (BR)
  bodega_id       uuid references bodegas(id) not null,
  notas           text,
  estado          text not null default 'pendiente'
                  check (estado in ('pendiente', 'aprobada', 'rechazada')),
  revisado_por    uuid references usuarios(id),
  revision_notas  text,
  creado_en       timestamptz default now(),
  revisado_en     timestamptz
);

create index idx_solicitudes_b2b_estado on solicitudes_b2b(estado);
create index idx_solicitudes_b2b_bodega on solicitudes_b2b(bodega_id);

comment on table solicitudes_b2b is 'Cola de aprobación de clientes B2B — pendiente → aprobada/rechazada';
comment on column solicitudes_b2b.tax_id is 'NIT para Colombia, CNPJ para Brasil';

-- ─────────────────────────────────────────
-- RLS: Solicitudes B2B
-- ─────────────────────────────────────────

alter table solicitudes_b2b enable row level security;

-- Admin puede ver todas
create policy "Admin ve todas las solicitudes B2B"
  on solicitudes_b2b for select
  using (auth.uid() in (select id from usuarios where role = 'admin'));

-- Admin puede crear/editar
create policy "Admin gestiona solicitudes B2B"
  on solicitudes_b2b for insert
  with check (auth.uid() in (select id from usuarios where role = 'admin'));

create policy "Admin actualiza solicitudes B2B"
  on solicitudes_b2b for update
  using (auth.uid() in (select id from usuarios where role = 'admin'));

-- Cliente B2B ve su propia solicitud
create policy "Cliente B2B ve su solicitud"
  on solicitudes_b2b for select
  using (auth.uid() = cliente_id);
