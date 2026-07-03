/**
 * Auth library — JWT-based authentication with Supabase.
 *
 * Uses jose for cross-runtime JWT (Edge, Node, Workers) and
 * PBKDF2 (Web Crypto API) for password hashing/verification against
 * the `usuarios` table.
 *
 * The JWT payload includes: sub (user id), email, role, bodega_id.
 * Token is set as httpOnly cookie (`of_admin_token`).
 */

import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
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

const JWT_SECRET_RAW = import.meta.env.JWT_SECRET;
if (!JWT_SECRET_RAW) {
  throw new Error('FATAL: JWT_SECRET env var is required. Set it in .env or Vercel.');
}
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_RAW);

const JWT_ISSUER = 'octavo-fuego';
const JWT_AUDIENCE = 'octavo-fuego-admin';
const JWT_EXPIRES_IN = '7d';

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

// ─── PBKDF2 Password Hashing (Web Crypto API) ─────────────────────────────

const _encoder = new TextEncoder();

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function fromHex(hex: string): Uint8Array {
  const matches = hex.match(/.{1,2}/g);
  return new Uint8Array(matches ? matches.map((byte) => parseInt(byte, 16)) : []);
}

/**
 * Hash a password using PBKDF2 with Web Crypto API.
 *
 * Uses SHA-256, 600,000 iterations, random 16-byte salt, 32-byte derived key.
 * Returns self-describing format: `pbkdf2:sha256:600000:{saltHex}:{hashHex}`
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    _encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const hash = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 600_000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );
  return `pbkdf2:sha256:600000:${toHex(salt)}:${toHex(new Uint8Array(hash))}`;
}

/**
 * Verify a password against a stored PBKDF2 hash.
 * Parses the self-describing format and performs constant-time comparison.
 */
async function pbkdf2Verify(password: string, stored: string): Promise<boolean> {
  try {
    const parts = stored.split(':');
    if (parts.length !== 5) return false;
    if (parts[0] !== 'pbkdf2') return false;

    const iterations = parseInt(parts[2], 10);
    if (isNaN(iterations) || iterations <= 0) return false;

    const salt = fromHex(parts[3]);
    const expectedHash = fromHex(parts[4]);

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      _encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits']
    );
    const hash = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt,
        iterations,
        hash: 'SHA-256',
      },
      keyMaterial,
      256
    );

    const derivedBytes = new Uint8Array(hash);
    if (derivedBytes.length !== expectedHash.length) return false;

    // Constant-time comparison to prevent timing attacks
    let diff = 0;
    for (let i = 0; i < derivedBytes.length; i++) {
      diff |= derivedBytes[i] ^ expectedHash[i];
    }
    return diff === 0;
  } catch {
    return false;
  }
}

/**
 * Verify a password against a stored hash.
 *
 * - `pbkdf2:` prefix → Web Crypto PBKDF2 verification
 * - Unknown prefix → returns `{ valid: false }`
 */
export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  if (stored.startsWith('pbkdf2:')) {
    return pbkdf2Verify(password, stored);
  }
  return false;
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

    // Verify password using PBKDF2 (Web Crypto)
    if (!await verifyPassword(password, data.password_hash)) return null;

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


