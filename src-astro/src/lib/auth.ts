/**
 * Auth library — hardcoded credentials with SHA-256 token generation.
 *
 * Uses Web Crypto API (crypto.subtle) for cross-runtime compatibility
 * (Astro SSR, Vercel Edge, Cloudflare Workers, Node 22+).
 *
 * The token is derived from a fixed payload (email + secret, NOT the password),
 * so the expected hash is computed once and cached.
 */

export const CREDENTIALS = {
  email: 'admin@octavofuego.com',
  password: 'octavo2026',
} as const;

export const COOKIE_CONFIG = {
  httpOnly: true,
  path: '/',
  sameSite: 'lax' as const,
  maxAge: 604800,
};

const TOKEN_PAYLOAD = 'admin@octavofuego.com:octavo-fuego-admin-2026';

/**
 * Validate credentials using constant-time comparison
 * to prevent timing attacks (no early return on mismatch).
 */
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

/**
 * Generate the admin session token as a SHA-256 hex digest
 * of the fixed token payload (email + secret, NOT the password).
 *
 * @returns The hex-encoded SHA-256 hash as a string.
 */
export async function generateToken(): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(TOKEN_PAYLOAD);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

let _expectedToken: string | null = null;

async function getExpectedToken(): Promise<string> {
  if (!_expectedToken) {
    _expectedToken = await generateToken();
  }
  return _expectedToken;
}

/**
 * Verify a token against the expected SHA-256 hash using
 * constant-time comparison to prevent timing attacks.
 *
 * @param token - The token value to verify (from cookie or request).
 * @returns `true` if the token matches the expected hash.
 */
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
