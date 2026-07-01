-- ═══════════════════════════════════════════════════════════════════════════════
-- Octavo Fuego — Migration 006: Pagos + Payment Columns
-- ═══════════════════════════════════════════════════════════════════════════════
-- Adds: pagos table, link_pago/qr_code columns on ordenes
-- Run AFTER 004_admin_eventos.sql
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────
-- ORDENES: agregar columnas de pago
-- ─────────────────────────────────────────

alter table ordenes
  add column link_pago      text,             -- URL de pago Wompi (CO)
  add column qr_code_pix    text,             -- URL imagen QR (BR)
  add column qr_code_text   text,             -- Código Pix copia-y-pega (BR)
  add column pagado_en      timestamptz,      -- Cuándo se confirmó el pago
  add column gateway        text              -- 'wompi' | 'stripe' | 'pix_efi'

  check (gateway in ('wompi', 'stripe', 'pix_efi', null));

comment on column ordenes.link_pago is 'Link de pago generado por Wompi (CO) — null si es BR';
comment on column ordenes.qr_code_pix is 'URL del QR code generado para Pix (BR) — null si es CO';
comment on column ordenes.qr_code_text is 'Texto copia-y-pega del código Pix para transferencia';
comment on column ordenes.gateway is 'Pasarela usada: wompi (CO), stripe (BR), pix_efi (BR)';

-- ─────────────────────────────────────────
-- PAGOS (Registro de transacciones)
-- ─────────────────────────────────────────

create table pagos (
  id                uuid primary key default gen_random_uuid(),
  orden_id          uuid references ordenes(id) on delete cascade not null,
  bodega_id         uuid references bodegas(id) not null,
  metodo            text not null             -- 'wompi_link' | 'pix_qr' | 'pix_copia_cola'
                    check (metodo in ('wompi_link', 'pix_qr', 'pix_copia_cola')),
  estado            text not null default 'pendiente'
                    check (estado in ('pendiente', 'procesando', 'confirmado', 'fallido', 'reembolsado')),
  monto             numeric(12,2) not null,
  moneda            char(3) not null,         -- 'COP', 'BRL'
  referencia_externa text,                    -- ID de transacción en el gateway: Wompi tx_id, Stripe pi_xxx, Efí uuid
  metadata          jsonb default '{}'::jsonb, -- Payload crudo del webhook del gateway
  creado_en         timestamptz default now(),
  confirmado_en     timestamptz,

  -- Un pago por orden por método (no duplicar)
  unique(orden_id, metodo)
);

create index idx_pagos_orden on pagos(orden_id);
create index idx_pagos_bodega on pagos(bodega_id);
create index idx_pagos_estado on pagos(estado);
create index idx_pagos_referencia on pagos(referencia_externa);

comment on table pagos is 'Registro de pagos — cada orden puede tener múltiples intentos';
comment on column pagos.referencia_externa is 'ID del gateway: Wompi transaction_id, Stripe payment_intent, Efí transaction_uuid';
comment on column pagos.metadata is 'Payload completo del webhook para debugging';

-- ─────────────────────────────────────────
-- RLS: Pagos
-- ─────────────────────────────────────────

alter table pagos enable row level security;

-- Admin ve todos los pagos
create policy "Admin ve todos los pagos"
  on pagos for select
  using (auth.uid() in (select id from usuarios where role = 'admin'));

-- Sistema inserta pagos (service role)
create policy "Sistema inserta pagos"
  on pagos for insert
  with check (true);

create policy "Sistema actualiza pagos"
  on pagos for update
  using (true);
