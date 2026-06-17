/**
 * Astro middleware entry point.
 *
 * Chains all middleware handlers. Currently only auth is registered;
 * additional middleware can be added via `sequence()` from `astro:middleware`.
 */

export { onRequest } from './middleware/auth';
