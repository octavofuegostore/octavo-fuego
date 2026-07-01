-- ═══════════════════════════════════════════════════════════════════════════════
-- Octavo Fuego — Migration 005: Notificaciones
-- ═══════════════════════════════════════════════════════════════════════════════
-- Adds: notificaciones table for in-app notifications with polling
-- Run AFTER 002_admin_auth.sql
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────
-- NOTIFICACIONES
-- ─────────────────────────────────────────

create table notificaciones (
  id              uuid primary key default gen_random_uuid(),
  usuario_id      uuid references usuarios(id) on delete cascade not null,
  tipo            text not null,             -- 'nueva_orden', 'solicitud_b2b', 'pago_recibido', 'stock_bajo'
  titulo          text not null,             -- Título corto para el dropdown
  mensaje         text,                      -- Mensaje detallado (opcional)
  link            text,                      -- Ruta admin a la que lleva: /admin/ordenes/xxx
  leida           boolean default false,
  creado_en       timestamptz default now()
);

-- Index para consultar notificaciones no leídas por usuario
create index idx_notificaciones_usuario on notificaciones(usuario_id, leida, creado_en desc);
create index idx_notificaciones_tipo on notificaciones(tipo);

comment on table notificaciones is 'Notificaciones in-app para usuarios del admin';
comment on column notificaciones.link is 'Ruta relativa del admin: /admin/ordenes/{id}, /admin/clientes/b2b/solicitudes';

-- ─────────────────────────────────────────
-- Función: crear notificación
-- ─────────────────────────────────────────

create or replace function crear_notificacion(
  p_usuario_id uuid,
  p_tipo       text,
  p_titulo     text,
  p_mensaje    text default null,
  p_link       text default null
)
returns uuid as $$
declare
  v_id uuid;
begin
  insert into notificaciones (usuario_id, tipo, titulo, mensaje, link)
  values (p_usuario_id, p_tipo, p_titulo, p_mensaje, p_link)
  returning id into v_id;

  return v_id;
end;
$$ language plpgsql;

-- ─────────────────────────────────────────
-- Función: marcar notificación como leída
-- ─────────────────────────────────────────

create or replace function marcar_notificacion_leida(
  p_notificacion_id uuid
)
returns void as $$
begin
  update notificaciones
  set leida = true
  where id = p_notificacion_id;
end;
$$ language plpgsql;

-- ─────────────────────────────────────────
-- RLS: Usuario ve sus propias notificaciones
-- ─────────────────────────────────────────

alter table notificaciones enable row level security;

create policy "Usuario ve sus notificaciones"
  on notificaciones for select
  using (auth.uid() = usuario_id);

create policy "Usuario marca sus notificaciones"
  on notificaciones for update
  using (auth.uid() = usuario_id);

create policy "Sistema crea notificaciones (service role)"
  on notificaciones for insert
  with check (true);
