/**
 * Auth library — JWT-based authentication with Supabase.
 *
 * Uses jose for cross-runtime JWT (Edge, Node, Workers) and
 * bcryptjs for password verification against the `usuarios` table.
 *
 * The JWT payload includes: sub (user id), email, role, bodega_id.
 * Token is set as httpOnly cookie (`of_admin_token`).
 */

import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';

// ─── Types ───────────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'supervisor' | 'bodeguero';

export interface AuthUser {
  id: string;
  email: string;
  nombre: string;
  role: UserRole;
  bodega_id: string | null; // null = acceso global
}

export interface AuthPayload extends JWTPayload {
  email: string;
  role: UserRole;
  bodega_id: string | null;
  nombre: string;
}

// ─── Config ──────────────────────────────────────────────────────────────────

const JWT_SECRET_RAW = import.meta.env.JWT_SECRET || 'octavo-fuego-dev-secret-2026';
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_RAW);

const JWT_ISSUER = 'octavo-fuego';
const JWT_AUDIENCE = 'octavo-fuego-admin';
const JWT_EXPIRES_IN = '7d';

// Admin credentials can be overridden via env vars for production.
const ADMIN_EMAIL = import.meta.env.AUTH_ADMIN_EMAIL || 'admin@octavofuego.com';
const ADMIN_PASSWORD = import.meta.env.AUTH_ADMIN_PASSWORD || 'octavo2026';

export const COOKIE_CONFIG = {
  httpOnly: true,
  path: '/',
  sameSite: 'lax' as const,
  maxAge: 604800, // 7 days
};

// ─── JWT helpers ─────────────────────────────────────────────────────────────

/**
 * Sign a JWT for the authenticated user.
 */
export async function signJWT(user: AuthUser): Promise<string> {
  return new SignJWT({
    sub: user.id,
    email: user.email,
    role: user.role,
    bodega_id: user.bodega_id,
    nombre: user.nombre,
  } satisfies AuthPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(JWT_SECRET);
}

/**
 * Verify a JWT and return the decoded payload.
 * Returns null if the token is invalid or expired.
 */
export async function verifyJWT(token: string | undefined): Promise<AuthPayload | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });

    return payload as unknown as AuthPayload;
  } catch {
    return null;
  }
}

// ─── Auth helpers ────────────────────────────────────────────────────────────

/**
 * Authenticate a user by email and password against the `usuarios` table.
 *
 * @returns The auth user and JWT on success, or null on failure.
 */
export async function authenticateUser(
  email: string,
  password: string
): Promise<{ user: AuthUser; token: string } | null> {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, email, password_hash, nombre, role, bodega_id, activo')
      .eq('email', email)
      .single();

    if (error || !data) return null;
    if (!data.activo) return null;

    // Compare password with bcrypt hash from DB
    const valid = bcrypt.compareSync(password, data.password_hash);
    if (!valid) return null;

    const user: AuthUser = {
      id: data.id,
      email: data.email,
      nombre: data.nombre,
      role: data.role as UserRole,
      bodega_id: data.bodega_id,
    };

    const token = await signJWT(user);
    return { user, token };
  } catch {
    return null;
  }
}

// ─── Legacy SHA-256 fallback ─────────────────────────────────────────────────

/**
 * @deprecated Will be removed once JWT auth is stable.
 * Kept for backward compatibility during migration.
 */
export const CREDENTIALS = {
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
} as const;

function getTokenPayload(email: string): string {
  return `${email}:${JWT_ISSUER}:${JWT_AUDIENCE}:${JWT_SECRET_RAW}`;
}

/** @deprecated Use JWT-based auth instead. */
export function validateCredentials(email: string, password: string): boolean {
  if (
    email.length !== CREDENTIALS.email.length ||
    password.length !== CREDENTIALS.password.length
  ) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < CREDENTIALS.email.length; i++) {
    result |= email.charCodeAt(i) ^ CREDENTIALS.email.charCodeAt(i);
  }
  for (let i = 0; i < CREDENTIALS.password.length; i++) {
    result |= password.charCodeAt(i) ^ CREDENTIALS.password.charCodeAt(i);
  }

  return result === 0;
}

let _expectedToken: string | null = null;

async function getExpectedToken(): Promise<string> {
  if (!_expectedToken) {
    const encoder = new TextEncoder();
    const data = encoder.encode(getTokenPayload(ADMIN_EMAIL));
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    _expectedToken = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  return _expectedToken;
}

/** @deprecated Use verifyJWT instead. */
export async function verifyToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const expected = await getExpectedToken();
  if (token.length !== expected.length) return false;
  let result = 0;
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return result === 0;
}
