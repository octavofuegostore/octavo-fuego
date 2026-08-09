/// <reference types="astro/client" />

interface ImportMetaEnv {
  /**
   * Google Search Console verification token — the `content` value of the
   * `<meta name="google-site-verification">` tag. Empty/absent = snippet
   * disabled (zero bytes shipped).
   */
  readonly PUBLIC_GSC_VERIFICATION?: string;
  /**
   * Microsoft Clarity project ID. Empty/absent = snippet disabled.
   */
  readonly PUBLIC_CLARITY_ID?: string;
  /**
   * Meta (Facebook) Pixel ID. Empty/absent = snippet disabled.
   */
  readonly PUBLIC_META_PIXEL_ID?: string;
  /**
   * Google Tag Manager container ID (GTM-XXXXXXX). Runtime driver for GA4:
   * when set, the GTM loader, dataLayer init, noscript iframe and event
   * wiring are emitted. Empty/absent = GTM/GA4 disabled (zero bytes shipped).
   */
  readonly PUBLIC_GTM_ID?: string;
  /**
   * GA4 measurement ID (G-XXXXXXX). Metadata for the manual GTM web-config
   * checklist only — drives no runtime script (GA4 lives inside the GTM
   * container). Empty/absent = ignored.
   */
  readonly PUBLIC_GA4_ID?: string;
  /**
   * TikTok Pixel ID. Drives the ttq base snippet + preconnect when set.
   * Empty/absent = snippet disabled (zero bytes shipped).
   */
  readonly PUBLIC_TIKTOK_PIXEL_ID?: string;
}
