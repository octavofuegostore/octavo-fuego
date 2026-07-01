-- ═══════════════════════════════════════════════════════════════════════════════
-- Octavo Fuego — Migration 004: Event Bus (Audit Trail)
-- ═══════════════════════════════════════════════════════════════════════════════
-- Adds: eventos table for system audit trail with bodega_id prefix
-- Run AFTER 002_admin_auth.sql
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────
-- EVENTOS (Audit trail genérico)
-- ─────────────────────────────────────────

create table eventos (
  id              uuid primary key default gen_random_uuid(),
  bodega_id       uuid references bodegas(id),
  tipo            text not null,             -- 'orden:creada', 'orden:pagada', 'b2b:solicitud', 'stock:alterado', etc.
  payload         jsonb default '{}'::jsonb, -- datos contextuales del evento
  usuario_id      uuid references usuarios(id),
  orden_id        uuid references ordenes(id),
  creado_en       timestamptz default now()
);

-- Index para consultas de auditoría
create index idx_eventos_bodega on eventos(bodega_id);
create index idx_eventos_tipo on eventos(tipo);
create index idx_eventos_creado on eventos(creado_en desc);
create index idx_eventos_orden on eventos(orden_id);

comment on table eventos is 'Audit trail del sistema — todos los eventos importantes con bodega_id';
comment on column eventos.tipo is 'Namespace: evento:tipo — ej: orden:creada, b2b:solicitud, stock:alterado';
comment on column eventos.payload is 'Datos contextuales en JSON: { antes, despues, cantidad, etc }';

-- ─────────────────────────────────────────
-- Función helper: emitir evento
-- ─────────────────────────────────────────

create or replace function emitir_evento(
  p_bodega_id  uuid,
  p_tipo       text,
  p_payload    jsonb default '{}'::jsonb,
  p_usuario_id uuid default null,
  p_orden_id   uuid default null
)
returns uuid as $$
declare
  v_id uuid;
begin
  insert into eventos (bodega_id, tipo, payload, usuario_id, orden_id)
  values (p_bodega_id, p_tipo, p_payload, p_usuario_id, p_orden_id)
  returning id into v_id;

  return v_id;
end;
$$ language plpgsql;

-- ─────────────────────────────────────────
-- RLS: Solo admin puede leer eventos
-- ─────────────────────────────────────────

alter table eventos enable row level security;

create policy "Admin lee todos los eventos"
  on eventos for select
  using (auth.uid() in (select id from usuarios where role = 'admin'));

create policy "Sistema inserta eventos (service role)"
  on eventos for insert
  with check (true);                          -- service_role key puede insertar siempre
