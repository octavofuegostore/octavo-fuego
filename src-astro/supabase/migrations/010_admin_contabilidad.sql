-- ═══════════════════════════════════════════════════════════════════════════════
-- Octavo Fuego — Migration 010: Admin Contabilidad (Real Data)
-- ═══════════════════════════════════════════════════════════════════════════════
-- Adds: categorias_transaccion, subcategorias_transaccion, transacciones tables
-- with FK constraints and seed data from mock.ts.
-- Run AFTER 009_inventory_reservations_fix.sql
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────
-- CATEGORIAS DE TRANSACCION
-- ─────────────────────────────────────────

create table categorias_transaccion (
  id        uuid primary key default gen_random_uuid(),
  nombre    text not null,
  tipo      text not null check (tipo in ('ingreso', 'egreso')),
  activa    boolean default true,
  creado_en timestamptz default now()
);

comment on table categorias_transaccion is 'Categorías de transacciones financieras (ingreso/egreso)';

-- ─────────────────────────────────────────
-- SUBCATEGORIAS DE TRANSACCION
-- ─────────────────────────────────────────

create table subcategorias_transaccion (
  id           uuid primary key default gen_random_uuid(),
  categoria_id uuid references categorias_transaccion(id) on delete cascade not null,
  nombre       text not null,
  activa       boolean default true,
  creado_en    timestamptz default now()
);

comment on table subcategorias_transaccion is 'Subcategorías de transacciones financieras';

create index idx_subcategorias_categoria on subcategorias_transaccion(categoria_id);

-- ─────────────────────────────────────────
-- TRANSACCIONES
-- ─────────────────────────────────────────

create table transacciones (
  id             uuid primary key default gen_random_uuid(),
  fecha          date not null,
  descripcion    text not null,
  categoria_id   uuid references categorias_transaccion(id) on delete restrict not null,
  subcategoria_id uuid references subcategorias_transaccion(id) on delete set null,
  tipo           text not null check (tipo in ('ingreso', 'egreso')),
  monto          numeric(12,2) not null,
  moneda         char(3) default 'COP',
  metodo_pago    text,
  orden_id       uuid references ordenes(id) on delete set null,
  created_by     uuid references usuarios(id) on delete set null,
  creado_en      timestamptz default now()
);

comment on table transacciones is 'Registro de transacciones financieras del negocio';

create index idx_transacciones_fecha on transacciones(fecha);
create index idx_transacciones_categoria on transacciones(categoria_id);
create index idx_transacciones_tipo on transacciones(tipo);
create index idx_transacciones_orden on transacciones(orden_id);

-- ─────────────────────────────────────────
-- SEED DATA (from mock.ts)
-- ─────────────────────────────────────────

-- Ingreso categories
insert into categorias_transaccion (nombre, tipo) values
  ('Venta Rapé', 'ingreso'),
  ('Venta Sananga', 'ingreso'),
  ('Venta Kuripe/Tepi', 'ingreso'),
  ('Distribución B2B', 'ingreso'),
  ('Servicios', 'ingreso');

-- Egreso categories
insert into categorias_transaccion (nombre, tipo) values
  ('Amazonía / Comunidades', 'egreso'),
  ('Producción', 'egreso'),
  ('Logística y Envíos', 'egreso'),
  ('Marketing', 'egreso'),
  ('Infraestructura', 'egreso'),
  ('Nómina', 'egreso'),
  ('Impuestos', 'egreso'),
  ('Otros Egresos', 'egreso');

-- Subcategorias for Venta Rapé
insert into subcategorias_transaccion (categoria_id, nombre)
select id, 'Kaxinawá' from categorias_transaccion where nombre = 'Venta Rapé';
insert into subcategorias_transaccion (categoria_id, nombre)
select id, 'Nukini' from categorias_transaccion where nombre = 'Venta Rapé';
insert into subcategorias_transaccion (categoria_id, nombre)
select id, 'Apurinã' from categorias_transaccion where nombre = 'Venta Rapé';
insert into subcategorias_transaccion (categoria_id, nombre)
select id, 'Kuntanawa' from categorias_transaccion where nombre = 'Venta Rapé';
insert into subcategorias_transaccion (categoria_id, nombre)
select id, 'Katukina' from categorias_transaccion where nombre = 'Venta Rapé';

-- Subcategorias for Venta Sananga
insert into subcategorias_transaccion (categoria_id, nombre)
select id, 'Sananga 5ml' from categorias_transaccion where nombre = 'Venta Sananga';
insert into subcategorias_transaccion (categoria_id, nombre)
select id, 'Sananga 10ml' from categorias_transaccion where nombre = 'Venta Sananga';

-- Subcategorias for Venta Kuripe/Tepi
insert into subcategorias_transaccion (categoria_id, nombre)
select id, 'Kuripe Clásico' from categorias_transaccion where nombre = 'Venta Kuripe/Tepi';
insert into subcategorias_transaccion (categoria_id, nombre)
select id, 'Kuripe Doble' from categorias_transaccion where nombre = 'Venta Kuripe/Tepi';
insert into subcategorias_transaccion (categoria_id, nombre)
select id, 'Tepi' from categorias_transaccion where nombre = 'Venta Kuripe/Tepi';

-- Subcategorias for Distribución B2B
insert into subcategorias_transaccion (categoria_id, nombre)
select id, 'Mayorista Colombia' from categorias_transaccion where nombre = 'Distribución B2B';
insert into subcategorias_transaccion (categoria_id, nombre)
select id, 'Mayorista Brasil' from categorias_transaccion where nombre = 'Distribución B2B';

-- Subcategorias for Servicios
insert into subcategorias_transaccion (categoria_id, nombre)
select id, 'Ceremonias' from categorias_transaccion where nombre = 'Servicios';
insert into subcategorias_transaccion (categoria_id, nombre)
select id, 'Consultas' from categorias_transaccion where nombre = 'Servicios';
insert into subcategorias_transaccion (categoria_id, nombre)
select id, 'Talleres' from categorias_transaccion where nombre = 'Servicios';

-- Subcategorias for Amazonía / Comunidades
insert into subcategorias_transaccion (categoria_id, nombre)
select id, 'Yawanawá' from categorias_transaccion where nombre = 'Amazonía / Comunidades';
insert into subcategorias_transaccion (categoria_id, nombre)
select id, 'Nukini' from categorias_transaccion where nombre = 'Amazonía / Comunidades';
insert into subcategorias_transaccion (categoria_id, nombre)
select id, 'Kaxinawá' from categorias_transaccion where nombre = 'Amazonía / Comunidades';
insert into subcategorias_transaccion (categoria_id, nombre)
select id, 'Shanenawa' from categorias_transaccion where nombre = 'Amazonía / Comunidades';
insert into subcategorias_transaccion (categoria_id, nombre)
select id, 'Logística Acre' from categorias_transaccion where nombre = 'Amazonía / Comunidades';

-- Subcategorias for Producción
insert into subcategorias_transaccion (categoria_id, nombre)
select id, 'Materia Prima' from categorias_transaccion where nombre = 'Producción';
insert into subcategorias_transaccion (categoria_id, nombre)
select id, 'Envases y Etiquetas' from categorias_transaccion where nombre = 'Producción';
insert into subcategorias_transaccion (categoria_id, nombre)
select id, 'Herramientas' from categorias_transaccion where nombre = 'Producción';

-- Subcategorias for Logística y Envíos
insert into subcategorias_transaccion (categoria_id, nombre)
select id, 'Envíos Nacionales' from categorias_transaccion where nombre = 'Logística y Envíos';
insert into subcategorias_transaccion (categoria_id, nombre)
select id, 'Envíos Brasil' from categorias_transaccion where nombre = 'Logística y Envíos';
insert into subcategorias_transaccion (categoria_id, nombre)
select id, 'Envíos Internacionales' from categorias_transaccion where nombre = 'Logística y Envíos';

-- Subcategorias for Marketing
insert into subcategorias_transaccion (categoria_id, nombre)
select id, 'Meta Ads' from categorias_transaccion where nombre = 'Marketing';
insert into subcategorias_transaccion (categoria_id, nombre)
select id, 'Google Ads' from categorias_transaccion where nombre = 'Marketing';
insert into subcategorias_transaccion (categoria_id, nombre)
select id, 'Contenido' from categorias_transaccion where nombre = 'Marketing';
insert into subcategorias_transaccion (categoria_id, nombre)
select id, 'Fotografía' from categorias_transaccion where nombre = 'Marketing';

-- Subcategorias for Infraestructura
insert into subcategorias_transaccion (categoria_id, nombre)
select id, 'Arriendo' from categorias_transaccion where nombre = 'Infraestructura';
insert into subcategorias_transaccion (categoria_id, nombre)
select id, 'Servicios' from categorias_transaccion where nombre = 'Infraestructura';
insert into subcategorias_transaccion (categoria_id, nombre)
select id, 'Software' from categorias_transaccion where nombre = 'Infraestructura';

-- Subcategorias for Nómina
insert into subcategorias_transaccion (categoria_id, nombre)
select id, 'Josue' from categorias_transaccion where nombre = 'Nómina';

-- Subcategorias for Impuestos
insert into subcategorias_transaccion (categoria_id, nombre)
select id, 'IVA' from categorias_transaccion where nombre = 'Impuestos';
insert into subcategorias_transaccion (categoria_id, nombre)
select id, 'Renta' from categorias_transaccion where nombre = 'Impuestos';

-- Subcategorias for Otros Egresos
insert into subcategorias_transaccion (categoria_id, nombre)
select id, 'Material Oficina' from categorias_transaccion where nombre = 'Otros Egresos';
insert into subcategorias_transaccion (categoria_id, nombre)
select id, 'Viajes' from categorias_transaccion where nombre = 'Otros Egresos';

-- ═══════════════════════════════════════════════════════════════════════════════
-- RLS
-- ═══════════════════════════════════════════════════════════════════════════════

alter table categorias_transaccion enable row level security;
alter table subcategorias_transaccion enable row level security;
alter table transacciones enable row level security;

-- Admin permissions: full access
create policy "Admin ve todas las categorias"
  on categorias_transaccion for select
  using (auth.uid() in (select id from usuarios where role = 'admin'));

create policy "Admin gestiona categorias"
  on categorias_transaccion for insert
  with check (auth.uid() in (select id from usuarios where role = 'admin'));

create policy "Admin actualiza categorias"
  on categorias_transaccion for update
  using (auth.uid() in (select id from usuarios where role = 'admin'));

create policy "Admin ve todas las subcategorias"
  on subcategorias_transaccion for select
  using (auth.uid() in (select id from usuarios where role = 'admin'));

create policy "Admin gestiona subcategorias"
  on subcategorias_transaccion for insert
  with check (auth.uid() in (select id from usuarios where role = 'admin'));

create policy "Admin actualiza subcategorias"
  on subcategorias_transaccion for update
  using (auth.uid() in (select id from usuarios where role = 'admin'));

create policy "Admin ve todas las transacciones"
  on transacciones for select
  using (auth.uid() in (select id from usuarios where role = 'admin'));

create policy "Admin crea transacciones"
  on transacciones for insert
  with check (auth.uid() in (select id from usuarios where role = 'admin'));

create policy "Admin actualiza transacciones"
  on transacciones for update
  using (auth.uid() in (select id from usuarios where role = 'admin'));

create policy "Admin elimina transacciones"
  on transacciones for delete
  using (auth.uid() in (select id from usuarios where role = 'admin'));
