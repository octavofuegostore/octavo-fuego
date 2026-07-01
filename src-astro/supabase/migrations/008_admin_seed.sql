-- ═══════════════════════════════════════════════════════════════════════════════
-- Octavo Fuego — Migration 008: Admin Seed Data
-- ═══════════════════════════════════════════════════════════════════════════════
-- Creates: admin user, test B2B client, sample notification
-- Run AFTER 007_admin_ordenes_bodega.sql
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────
-- Admin user
-- ═══════════════════════════════════════════════════════════════════════════════
-- IMPORTANTE: Reemplazar PASSWORD_HASH por un hash bcrypt real.
-- Generar en: https://bcrypt-generator.com/ (costo 10)
-- Email: admin@octavofuego.com
-- Password (default): octavo2026

insert into usuarios (email, password_hash, nombre, role, bodega_id, activo)
values (
  'admin@octavofuego.com',
  crypt('octavo2026', gen_salt('bf', 10)),
  'Josue Calderon',
  'admin',
  null,   -- null = acceso global (todas las bodegas)
  true
);

-- ⚠️ CAMBIAR LA CONTRASEÑA después del primer login.
--    Credenciales default: admin@octavofuego.com / octavo2026

-- ─────────────────────────────────────────
-- Nota: gramos_disponibles es una VIEW (creada en 001).
-- Los índices en las tablas subyacentes (niveles_inventario, items_inventario, etc.)
-- ya cubren las consultas del admin. No se pueden crear índices directos sobre vistas.

-- ─────────────────────────────────────────
-- Verificación: las bodegas existen
-- ─────────────────────────────────────────

do $$
begin
  if not exists (select 1 from bodegas where codigo in ('BR-ACRE', 'CO-BOGOTA')) then
    raise exception 'Bodegas no encontradas. Correr 001_initial_schema.sql primero.';
  end if;
end $$;

-- ─────────────────────────────────────────
-- Fin de migraciones
-- ═══════════════════════════════════════════════════════════════════════════════
-- Orden de ejecución:
--   001_initial_schema.sql  → Schema L-Medusa completo + seed data
--   002_admin_auth.sql      → Usuarios + RLS
--   003_admin_b2b.sql       → B2B + wholesale catalog
--   004_admin_eventos.sql   → Event bus
--   005_admin_notificaciones.sql → Notificaciones
--   006_admin_pagos.sql     → Pagos + payment columns
--   007_admin_ordenes_bodega.sql → bodega_id en ordenes + RLS + dashboard view
--   008_admin_seed.sql      → Admin user + índices
