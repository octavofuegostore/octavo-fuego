-- ═══════════════════════════════════════════════════════════════════════════════
-- Octavo Fuego — L-Medusa Schema for Supabase
-- ═══════════════════════════════════════════════════════════════════════════════
-- Adapted from MedusaJS v2 architecture
-- Created: Junio 16, 2026
-- 
-- Instructions:
--   1. Run this in Supabase SQL Editor
--   2. All tables use UUID primary keys (Supabase default)
--   3. RLS policies should be added after table creation
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────
-- PRODUCTOS Y VARIANTES
-- ─────────────────────────────────────────

create table productos (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,        -- 'tisunu', 'pixuri', etc.
  nombre_es   text not null,
  nombre_en   text not null,
  nombre_pt   text not null,
  descripcion_es text,
  descripcion_en text,
  descripcion_pt text,
  activo      boolean default true,
  creado_en   timestamptz default now()
);

create table variantes (
  id          uuid primary key default gen_random_uuid(),
  producto_id uuid references productos(id),
  gramos      integer not null,            -- 10, 20, 30
  precio_cop  integer not null,            -- 35000, 70000, 100000
  precio_brl  numeric(10,2),
  precio_usd  numeric(10,2),
  sku         text unique not null,        -- 'TISUNU-20G'
  activo      boolean default true
);

-- ─────────────────────────────────────────
-- INVENTARIO (Lógica canibalizada de Medusa)
-- ─────────────────────────────────────────

-- Medusa: StockLocation
create table bodegas (
  id          uuid primary key default gen_random_uuid(),
  codigo      text unique not null,        -- 'BR-ACRE', 'CO-BOGOTA'
  nombre      text not null,
  pais        char(2) not null,            -- 'BR', 'CO'
  activa      boolean default true
);

-- Datos iniciales de bodegas
insert into bodegas (codigo, nombre, pais) values
  ('BR-ACRE',    'Fábrica Acre — Brasil',        'BR'),
  ('CO-BOGOTA',  'Distribución Bogotá — Colombia', 'CO');

-- Medusa: InventoryItem
create table items_inventario (
  id          uuid primary key default gen_random_uuid(),
  variante_id uuid references variantes(id),
  sku         text unique not null
);

-- Medusa: InventoryLevel
create table niveles_inventario (
  id              uuid primary key default gen_random_uuid(),
  item_id         uuid references items_inventario(id),
  bodega_id       uuid references bodegas(id),
  gramos_stock    integer not null default 0,   -- Stock real disponible
  gramos_reserva  integer not null default 0,   -- Reservados en checkout
  gramos_alerta   integer not null default 50,  -- Umbral de alerta
  unique(item_id, bodega_id)
);

-- Vista: gramos disponibles reales
create view gramos_disponibles as
  select
    ni.id,
    ni.item_id,
    ni.bodega_id,
    b.codigo as bodega_codigo,
    b.pais,
    v.gramos as gramos_variante,
    v.sku,
    p.slug as producto_slug,
    ni.gramos_stock - ni.gramos_reserva as gramos_disponibles,
    ni.gramos_stock,
    ni.gramos_reserva,
    ni.gramos_alerta,
    (ni.gramos_stock - ni.gramos_reserva) < ni.gramos_alerta as alerta_stock_bajo
  from niveles_inventario ni
  join items_inventario ii on ii.id = ni.item_id
  join variantes v on v.id = ii.variante_id
  join productos p on p.id = v.producto_id
  join bodegas b on b.id = ni.bodega_id;

-- Medusa: Reservation
create table reservas (
  id          uuid primary key default gen_random_uuid(),
  item_id     uuid references items_inventario(id),
  bodega_id   uuid references bodegas(id),
  gramos      integer not null,
  orden_id    uuid,                        -- null hasta confirmar pago
  estado      text default 'pendiente',    -- 'pendiente' | 'confirmada' | 'cancelada'
  expira_en   timestamptz default now() + interval '15 minutes',
  creado_en   timestamptz default now()
);

-- ─────────────────────────────────────────
-- TRANSFERENCIAS BR → CO
-- ─────────────────────────────────────────

create table transferencias (
  id              uuid primary key default gen_random_uuid(),
  item_id         uuid references items_inventario(id),
  bodega_origen   uuid references bodegas(id),
  bodega_destino  uuid references bodegas(id),
  gramos          integer not null,
  estado          text default 'en_transito', -- 'en_transito' | 'recibida'
  enviado_en      timestamptz default now(),
  recibido_en     timestamptz
);

-- ─────────────────────────────────────────
-- CLIENTES Y B2B (Lógica canibalizada de Medusa)
-- ─────────────────────────────────────────

-- Medusa: CustomerGroup
create table grupos_clientes (
  id      uuid primary key default gen_random_uuid(),
  codigo  text unique not null,   -- 'retail', 'mayorista'
  nombre  text not null
);

-- Grupos iniciales
insert into grupos_clientes (codigo, nombre) values
  ('retail',     'Cliente Detal'),
  ('mayorista',  'Distribuidor Mayorista');

-- Medusa: Customer
create table clientes (
  id              uuid primary key default gen_random_uuid(),
  auth_id         uuid unique,             -- Supabase Auth UID
  email           text unique not null,
  nombre_empresa  text,
  telefono        text,
  pais            char(2),                 -- 'CO', 'BR', etc.
  nit_cnpj        text,
  grupo_id        uuid references grupos_clientes(id),
  b2b_estado      text default 'retail',   -- 'retail' | 'pendiente' | 'aprobado' | 'rechazado'
  volumen_mensual text,                    -- '500g-2kg', '2kg-10kg', '10kg+'
  aprobado_en     timestamptz,
  creado_en       timestamptz default now()
);

-- ─────────────────────────────────────────
-- PRECIOS POR GRUPO (Lógica canibalizada de Medusa)
-- ─────────────────────────────────────────

-- Medusa: PriceList
create table listas_precio (
  id          uuid primary key default gen_random_uuid(),
  grupo_id    uuid references grupos_clientes(id),
  variante_id uuid references variantes(id),
  precio_cop  integer,
  precio_brl  numeric(10,2),
  precio_usd  numeric(10,2),
  min_gramos  integer default 0,           -- MOQ: mínimo de compra en gramos
  unique(grupo_id, variante_id)
);
-- ─────────────────────────────────────────
-- REGIONES Y DETECCIÓN DE CLIENTE
-- ─────────────────────────────────────────

-- Regiones disponibles (CO, BR, EU, US)
create table regiones (
  id              uuid primary key default gen_random_uuid(),
  codigo          text unique not null,        -- 'CO', 'BR', 'EU', 'US'
  nombre          text not null,
  moneda          char(3) not null,            -- 'COP', 'BRL', 'USD'
  idioma          char(2) not null,            -- 'es', 'pt', 'en'
  gateway         text not null,               -- 'wompi', 'stripe'
  bodega_default  uuid references bodegas(id),
  activa          boolean default true
);

-- Reglas de envío por región
-- CO: solo envía a CO desde CO-BOGOTA
-- BR/EU/US: todo sale de BR-ACRE

-- Tasas de conversión (actualizables manualmente)
create table factores_conversion (
  id              uuid primary key default gen_random_uuid(),
  moneda_origen   char(3) not null,            -- 'BRL'
  moneda_destino  char(3) not null,            -- 'USD'
  factor          numeric(10,4) not null,      -- 0.2020 (1 BRL = 0.20 USD)
  actualizado_en  timestamptz default now(),
  unique(moneda_origen, moneda_destino)
);

-- Tarifas de envío por región
create table tarifas_envio (
  id              uuid primary key default gen_random_uuid(),
  region_id       uuid references regiones(id),
  min_gramos      integer not null,
  max_gramos      integer not null,
  tarifa_fija     integer not null,            -- COP o USD según moneda
  tarifa_por_gramo integer default 0,
  tiempo_estimado text                         -- '3-5 días hábiles', '7-14 días hábiles'
);

-- Datos iniciales de regiones
insert into regiones (codigo, nombre, moneda, idioma, gateway, bodega_default) values
  ('CO', 'Colombia', 'COP', 'es', 'wompi', (select id from bodegas where codigo = 'CO-BOGOTA')),
  ('BR', 'Brasil', 'BRL', 'pt', 'stripe', (select id from bodegas where codigo = 'BR-ACRE')),
  ('EU', 'Europa', 'USD', 'en', 'stripe', (select id from bodegas where codigo = 'BR-ACRE')),
  ('US', 'Estados Unidos', 'USD', 'en', 'stripe', (select id from bodegas where codigo = 'BR-ACRE'));

-- Tasas de conversión iniciales
insert into factores_conversion (moneda_origen, moneda_destino, factor) values
  ('BRL', 'USD', 0.2020),
  ('COP', 'USD', 0.00024),
  ('BRL', 'COP', 833.00),
  ('USD', 'COP', 4166.00);

-- Tarifas de envío CO (local)
insert into tarifas_envio (region_id, min_gramos, max_gramos, tarifa_fija, tarifa_por_gramo, tiempo_estimado) values
  ((select id from regiones where codigo = 'CO'), 1, 500, 5000, 10, '3-5 días hábiles'),
  ((select id from regiones where codigo = 'CO'), 501, 2000, 8000, 5, '3-5 días hábiles'),
  ((select id from regiones where codigo = 'CO'), 2001, 99999, 12000, 0, '3-5 días hábiles');

-- Tarifas de envío BR (nacional)
insert into tarifas_envio (region_id, min_gramos, max_gramos, tarifa_fija, tarifa_por_gramo, tiempo_estimado) values
  ((select id from regiones where codigo = 'BR'), 1, 500, 25.00, 0.05, '3-7 días hábiles'),
  ((select id from regiones where codigo = 'BR'), 501, 2000, 40.00, 0.02, '3-7 días hábiles'),
  ((select id from regiones where codigo = 'BR'), 2001, 99999, 60.00, 0, '3-7 días hábiles');

-- Tarifas de envío EU/US (internacional desde BR)
insert into tarifas_envio (region_id, min_gramos, max_gramos, tarifa_fija, tarifa_por_gramo, tiempo_estimado) values
  ((select id from regiones where codigo = 'EU'), 1, 500, 25.00, 0.10, '7-14 días hábiles'),
  ((select id from regiones where codigo = 'EU'), 501, 2000, 35.00, 0.05, '7-14 días hábiles'),
  ((select id from regiones where codigo = 'US'), 1, 500, 25.00, 0.10, '7-14 días hábiles'),
  ((select id from regiones where codigo = 'US'), 501, 2000, 35.00, 0.05, '7-14 días hábiles');

-- ─────────────────────────────────────────
-- CARRITO (Lógica canibalizada de Medusa)
-- ─────────────────────────────────────────

create table carritos (
  id          uuid primary key default gen_random_uuid(),
  cliente_id  uuid references clientes(id),
  region_id   uuid references regiones(id),
  pais        char(2) not null default 'CO',
  moneda      char(3) not null default 'COP',
  estado      text default 'activo',       -- 'activo' | 'completado' | 'abandonado'
  creado_en   timestamptz default now(),
  actualizado timestamptz default now()
);

create table items_carrito (
  id          uuid primary key default gen_random_uuid(),
  carrito_id  uuid references carritos(id),
  variante_id uuid references variantes(id),
  gramos      integer not null,
  precio_unit integer not null,            -- Precio al momento de agregar
  reserva_id  uuid references reservas(id)
);

-- ─────────────────────────────────────────
-- ÓRDENES (Lógica canibalizada de Medusa)
-- ─────────────────────────────────────────

create table ordenes (
  id              uuid primary key default gen_random_uuid(),
  display_id      serial,                  -- #001, #002 — número visible al cliente
  cliente_id      uuid references clientes(id),
  carrito_id      uuid references carritos(id),
  estado          text default 'pendiente',
  -- 'pendiente' | 'pagado' | 'preparando' | 'enviado' | 'entregado' | 'cancelado'
  total_cop       integer,
  total_brl       numeric(10,2),
  total_usd       numeric(10,2),
  canal           text default 'whatsapp', -- 'whatsapp' | 'web'
  notas           text,
  creado_en       timestamptz default now()
);

create table items_orden (
  id          uuid primary key default gen_random_uuid(),
  orden_id    uuid references ordenes(id),
  variante_id uuid references variantes(id),
  gramos      integer not null,
  precio_unit integer not null,
  subtotal    integer not null
);

-- ─────────────────────────────────────────
-- MOVIMIENTOS — Auditoría completa
-- ─────────────────────────────────────────

create table movimientos_inventario (
  id          uuid primary key default gen_random_uuid(),
  item_id     uuid references items_inventario(id),
  bodega_id   uuid references bodegas(id),
  tipo        text not null,
  -- 'entrada' | 'venta' | 'reserva' | 'liberacion' | 'transferencia_salida' | 'transferencia_entrada' | 'ajuste'
  gramos      integer not null,            -- positivo = entrada, negativo = salida
  referencia  text,                        -- orden_id, transferencia_id, etc.
  notas       text,
  creado_en   timestamptz default now()
);


-- ═══════════════════════════════════════════════════════════════════════════════
-- RPC FUNCTIONS (para llamadas desde la app)
-- ═══════════════════════════════════════════════════════════════════════════════

-- Incrementar reserva de gramos
create or replace function incrementar_reserva(
  p_item_id uuid,
  p_bodega_id uuid,
  p_gramos integer
)
returns void as $$
begin
  update niveles_inventario
  set gramos_reserva = gramos_reserva + p_gramos
  where item_id = p_item_id and bodega_id = p_bodega_id;
end;
$$ language plpgsql;

-- Confirmar deducción de stock
create or replace function confirmar_deduccion(
  p_item_id uuid,
  p_bodega_id uuid,
  p_gramos integer
)
returns void as $$
begin
  update niveles_inventario
  set gramos_stock = gramos_stock - p_gramos,
      gramos_reserva = gramos_reserva - p_gramos
  where item_id = p_item_id and bodega_id = p_bodega_id;
end;
$$ language plpgsql;

-- Ajustar stock (para transferencias y ajustes manuales)
create or replace function ajustar_stock(
  p_item_id uuid,
  p_bodega_id uuid,
  p_gramos integer  -- positivo = entrada, negativo = salida
)
returns void as $$
begin
  update niveles_inventario
  set gramos_stock = gramos_stock + p_gramos
  where item_id = p_item_id and bodega_id = p_bodega_id;
end;
$$ language plpgsql;

-- ═══════════════════════════════════════════════════════════════════════════════
-- SEED DATA (productos, variantes, stock inicial)
-- ═══════════════════════════════════════════════════════════════════════════════

-- Productos
insert into productos (slug, nombre_es, nombre_en, nombre_pt, descripcion_es, descripcion_en, descripcion_pt) values
  ('tisunu', 'Tisunú', 'Tisunú', 'Tisunú', 'Rapé ancestral de tabaco + cumarú de la tradición Shipibo-Conibo', 'Ancestral rapé of tobacco + cumarú from the Shipibo-Conibo tradition', 'Rapé ancestral de tabaco + cumarú da tradição Shipibo-Conibo'),
  ('pixuri', 'Pixurí', 'Pixurí', 'Pixurí', 'Rapé de tabaco + jatobá de la medicina Huni Kuin', 'Rapé of tobacco + jatobá from Huni Kuin medicine', 'Rapé de tabaco + jatobá da medicina Huni Kuin'),
  ('parika', 'Pariká', 'Pariká', 'Pariká', 'Rapé de tabaco + pau ferro para claridad mental', 'Rapé of tobacco + pau ferro for mental clarity', 'Rapé de tabaco + pau ferro para clareza mental'),
  ('cumaru-de-cheiro', 'Cumarú de Cheiro', 'Cumarú de Cheiro', 'Cumarú de Cheiro', 'Rapé de tabaco + cumarú de Cheiro para conexión espiritual', 'Rapé of tobacco + cumarú de Cheiro for spiritual connection', 'Rapé de tabaco + cumarú de Cheiro para conexão espiritual'),
  ('vena-de-paje', 'Vena de Pajé', 'Vena de Pajé', 'Vena de Pajé', 'Rapé de tabaco + pajé para sanación profunda', 'Rapé of tobacco + pajé for deep healing', 'Rapé de tabaco + pajé para cura profunda');

-- Variantes (10g, 20g, 30g para cada producto)
insert into variantes (producto_id, gramos, precio_cop, precio_brl, precio_usd, sku) values
  -- Tisunú
  ((select id from productos where slug = 'tisunu'), 10, 35000, 42.00, 8.40, 'TISUNU-10G'),
  ((select id from productos where slug = 'tisunu'), 20, 70000, 84.00, 16.80, 'TISUNU-20G'),
  ((select id from productos where slug = 'tisunu'), 30, 100000, 120.00, 24.00, 'TISUNU-30G'),
  -- Pixurí
  ((select id from productos where slug = 'pixuri'), 10, 38000, 45.60, 9.12, 'PIXURI-10G'),
  ((select id from productos where slug = 'pixuri'), 20, 76000, 91.20, 18.24, 'PIXURI-20G'),
  ((select id from productos where slug = 'pixuri'), 30, 110000, 132.00, 26.40, 'PIXURI-30G'),
  -- Pariká
  ((select id from productos where slug = 'parika'), 10, 32000, 38.40, 7.68, 'PARIKA-10G'),
  ((select id from productos where slug = 'parika'), 20, 64000, 76.80, 15.36, 'PARIKA-20G'),
  ((select id from productos where slug = 'parika'), 30, 95000, 114.00, 22.80, 'PARIKA-30G'),
  -- Cumarú de Cheiro
  ((select id from productos where slug = 'cumaru-de-cheiro'), 10, 40000, 48.00, 9.60, 'CUMARU-10G'),
  ((select id from productos where slug = 'cumaru-de-cheiro'), 20, 80000, 96.00, 19.20, 'CUMARU-20G'),
  ((select id from productos where slug = 'cumaru-de-cheiro'), 30, 115000, 138.00, 27.60, 'CUMARU-30G'),
  -- Vena de Pajé
  ((select id from productos where slug = 'vena-de-paje'), 10, 45000, 54.00, 10.80, 'VENA-10G'),
  ((select id from productos where slug = 'vena-de-paje'), 20, 90000, 108.00, 21.60, 'VENA-20G'),
  ((select id from productos where slug = 'vena-de-paje'), 30, 130000, 156.00, 31.20, 'VENA-30G');

-- Items de inventario
insert into items_inventario (variante_id, sku) select id, sku from variantes;

-- Niveles de inventario (stock inicial en gramos)
insert into niveles_inventario (item_id, bodega_id, gramos_stock, gramos_reserva, gramos_alerta)
select
  ii.id,
  b.id,
  case
    when ii.sku like 'TISUNU%' then 2000
    when ii.sku like 'PIXURI%' then 1500
    when ii.sku like 'PARIKA%' then 1800
    when ii.sku like 'CUMARU%' then 1200
    when ii.sku like 'VENA%' then 900
    else 1000
  end,
  0,
  50
from items_inventario ii
cross join bodegas b
where b.codigo = 'BR-ACRE';

insert into niveles_inventario (item_id, bodega_id, gramos_stock, gramos_reserva, gramos_alerta)
select
  ii.id,
  b.id,
  case
    when ii.sku like 'TISUNU%' then 500
    when ii.sku like 'PIXURI%' then 300
    when ii.sku like 'PARIKA%' then 400
    when ii.sku like 'CUMARU%' then 250
    when ii.sku like 'VENA%' then 200
    else 300
  end,
  0,
  50
from items_inventario ii
cross join bodegas b
where b.codigo = 'CO-BOGOTA';

-- Precios mayoristas (1.300 COP/g desde 500g)
insert into listas_precio (grupo_id, variante_id, precio_cop, precio_brl, precio_usd, min_gramos)
select
  g.id,
  v.id,
  case
    when v.gramos = 10 then 13000
    when v.gramos = 20 then 26000
    when v.gramos = 30 then 39000
  end,
  case
    when v.gramos = 10 then 15.60
    when v.gramos = 20 then 31.20
    when v.gramos = 30 then 46.80
  end,
  case
    when v.gramos = 10 then 3.12
    when v.gramos = 20 then 6.24
    when v.gramos = 30 then 9.36
  end,
  500
from grupos_clientes g
cross join variantes v
where g.codigo = 'mayorista';

-- ═══════════════════════════════════════════════════════════════════════════════
-- COMENTARIOS
-- ═══════════════════════════════════════════════════════════════════════════════

comment on table productos is 'Productos de rapé — 5 variedades ancestrales';
comment on table variantes is 'Variantes por gramo: 10g, 20g, 30g';
comment on table bodegas is '2 bodegas: Fábrica Acre (BR) + Distribución Bogotá (CO)';
comment on table items_inventario is '1 item por variante (1 unidad = 1 gramo)';
comment on table niveles_inventario is 'Stock por bodega — Medusa InventoryLevel';
comment on table reservas is 'Reservas temporales durante checkout — expira en 15 min';
comment on table transferencias is 'Transferencias BR → CO';
comment on table grupos_clientes is 'retail | mayorista';
comment on table clientes is 'Clientes con auth Supabase y estado B2B';
comment on table listas_precio is 'Precios por grupo — retail vs mayorista';
comment on table carritos is 'Carritos activos de clientes';
comment on table items_carrito is 'Items del carrito con precio al momento de agregar';
comment on table ordenes is 'Órdenes con display_id serial (#001, #002)';
comment on table items_orden is 'Items de la orden con precio unitario congelado';
comment on table movimientos_inventario is 'Auditoría completa de movimientos de stock';
comment on table regiones is 'Regiones disponibles: CO, BR, EU, US';
comment on table factores_conversion is 'Tasas de conversión entre monedas (actualizables manualmente)';
comment on table tarifas_envio is 'Tarifas de envío por región y rango de gramos';

-- ═══════════════════════════════════════════════════════════════════════════════
-- RLS (Row Level Security) — Habilitar después de configurar policies
-- ═══════════════════════════════════════════════════════════════════════════════

-- Descomentar después de configurar RLS:
-- alter table productos enable row level security;
-- alter table variantes enable row level security;
-- alter table bodegas enable row level security;
-- alter table items_inventario enable row level security;
-- alter table niveles_inventario enable row level security;
-- alter table reservas enable row level security;
-- alter table clientes enable row level security;
-- alter table carritos enable row level security;
-- alter table ordenes enable row level security;