-- ═══════════════════════════════════════════════════════════════════════════════
-- Octavo Fuego — Migration 002: Admin Auth (JWT multi-user)
-- ═══════════════════════════════════════════════════════════════════════════════
-- Adds: usuarios table, RLS policies, indexes
-- Run AFTER 001_initial_schema.sql
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────
-- USUARIOS (Admin + B2B clients + Viewers)
-- ─────────────────────────────────────────

create table usuarios (
  id              uuid primary key default gen_random_uuid(),
  email           text unique not null,
  password_hash   text not null,               -- bcrypt hash
  nombre          text not null,
  role            text not null default 'viewer'
                  check (role in ('admin', 'b2b_client', 'viewer')),
  bodega_id       uuid references bodegas(id), -- null = todas las bodegas (admin/global)
  avatar_url      text,
  activo          boolean default true,
  ultimo_acceso   timestamptz,
  creado_en       timestamptz default now()
);

-- Index para búsqueda rápida por email
create index idx_usuarios_email on usuarios(email);
create index idx_usuarios_role on usuarios(role);
create index idx_usuarios_bodega on usuarios(bodega_id);

comment on table usuarios is 'Usuarios del admin panel — JWT auth con roles admin/b2b_client/viewer';
comment on column usuarios.role is 'admin: todo acceso | b2b_client: solo órdenes y catálogo propio | viewer: solo lectura';
comment on column usuarios.bodega_id is 'null = acceso global (admin), uuid = restringido a una bodega';

-- ─────────────────────────────────────────
-- RLS: Usuarios
-- ─────────────────────────────────────────

alter table usuarios enable row level security;

-- Admin puede ver todos los usuarios
create policy "Admin ve todos los usuarios"
  on usuarios for select
  using (auth.uid() in (select id from usuarios where role = 'admin'));

-- Cada usuario ve su propio perfil
create policy "Usuario ve su propio perfil"
  on usuarios for select
  using (auth.uid() = id);

-- Solo admin puede crear/editar usuarios
create policy "Admin puede crear usuarios"
  on usuarios for insert
  with check (auth.uid() in (select id from usuarios where role = 'admin'));

create policy "Admin puede editar usuarios"
  on usuarios for update
  using (auth.uid() in (select id from usuarios where role = 'admin'));

-- Nadie borra usuarios (desactivar con activo = false)
create policy "Nadie puede borrar usuarios"
  on usuarios for delete
  using (false);

-- ─────────────────────────────────────────
-- Función: verificar si un usuario tiene acceso a una bodega
-- ─────────────────────────────────────────

create or replace function usuario_accede_bodega(
  p_usuario_id uuid,
  p_bodega_id uuid
)
returns boolean as $$
declare
  v_role text;
  v_bodega_id uuid;
begin
  select role, bodega_id into v_role, v_bodega_id
  from usuarios where id = p_usuario_id;

  -- Admin tiene acceso global (bodega_id null)
  if v_role = 'admin' then
    return true;
  end if;

  -- Usuario con bodega específica
  return v_bodega_id = p_bodega_id;
end;
$$ language plpgsql stable;
