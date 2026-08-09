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
  /**
   * Google Tag Manager container ID (GTM-XXXXXXX). Runtime driver for the
   * GA4 + GTM slice: when set, the GTM loader, dataLayer init, noscript
   * iframe and event wiring are emitted. Empty/absent = zero bytes shipped.
   */
  gtmId?: string;
  /**
   * GA4 measurement ID (G-XXXXXXX). Metadata for the manual GTM web-config
   * checklist only — drives no runtime script in this slice (GA4 lives
   * inside the GTM container). Empty/absent = ignored.
   */
  ga4Id?: string;
  /**
   * TikTok Pixel ID. Runtime driver for the TikTok slice: when set, the ttq
   * base snippet + preconnect are emitted. Empty/absent = zero bytes shipped.
   */
  tiktokId?: string;
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
  if (nonEmpty(env.PUBLIC_GTM_ID)) {
    config.gtmId = env.PUBLIC_GTM_ID.trim();
  }
  if (nonEmpty(env.PUBLIC_GA4_ID)) {
    config.ga4Id = env.PUBLIC_GA4_ID.trim();
  }
  if (nonEmpty(env.PUBLIC_TIKTOK_PIXEL_ID)) {
    config.tiktokId = env.PUBLIC_TIKTOK_PIXEL_ID.trim();
  }

  return config;
}

/**
 * True when at least one measurement snippet should be rendered.
 *
 * Includes `gtmId` and `tiktokId` (they render loaders) but NOT `ga4Id` —
 * GA4 metadata alone must not claim the site is configured (it drives no
 * script).
 */
export function hasAnyMeasurement(config: MeasurementConfig): boolean {
  return Boolean(
    config.gscVerification ||
      config.clarityId ||
      config.metaPixelId ||
      config.gtmId ||
      config.tiktokId
  );
}
