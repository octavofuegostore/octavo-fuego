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
}
