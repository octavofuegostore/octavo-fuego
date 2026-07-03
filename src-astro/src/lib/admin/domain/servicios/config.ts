/**
 * Shared config for domain service factories.
 * Single source of truth for environment checks.
 */
export const SUPABASE_CONFIGURED =
  typeof import.meta.env.PUBLIC_SUPABASE_URL === 'string' &&
  import.meta.env.PUBLIC_SUPABASE_URL.length > 0 &&
  typeof import.meta.env.SUPABASE_SERVICE_ROLE_KEY === 'string' &&
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY.length > 0
