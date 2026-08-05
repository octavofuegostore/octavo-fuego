/**
 * Pure resolver for the env-gated measurement snippets.
 *
 * Kept outside the .astro template so the gating logic is unit-testable
 * without rendering Astro components. The component calls this with an
 * explicit env object built from `import.meta.env.PUBLIC_*` literals so
 * Vite's static env inlining keeps working (no dynamic `import.meta.env`
 * access).
 *
 * Design D5 (publish-superpowers): scripts only render when the matching
 * env var is present — no env var means zero bytes shipped.
 */

export interface MeasurementConfig {
  /** Google Search Console verification token (meta tag content). */
  gscVerification?: string;
  /** Microsoft Clarity project ID. */
  clarityId?: string;
  /** Meta (Facebook) Pixel ID. */
  metaPixelId?: string;
}

export type MeasurementEnv = Record<string, unknown>;

function nonEmpty(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function resolveMeasurementConfig(env: MeasurementEnv): MeasurementConfig {
  const config: MeasurementConfig = {};

  if (nonEmpty(env.PUBLIC_GSC_VERIFICATION)) {
    config.gscVerification = env.PUBLIC_GSC_VERIFICATION.trim();
  }
  if (nonEmpty(env.PUBLIC_CLARITY_ID)) {
    config.clarityId = env.PUBLIC_CLARITY_ID.trim();
  }
  if (nonEmpty(env.PUBLIC_META_PIXEL_ID)) {
    config.metaPixelId = env.PUBLIC_META_PIXEL_ID.trim();
  }

  return config;
}

/** True when at least one measurement snippet should be rendered. */
export function hasAnyMeasurement(config: MeasurementConfig): boolean {
  return Boolean(config.gscVerification || config.clarityId || config.metaPixelId);
}
