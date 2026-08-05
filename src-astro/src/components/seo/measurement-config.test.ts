import { describe, expect, it } from 'vitest';
import { hasAnyMeasurement, resolveMeasurementConfig } from './measurement-config';

describe('resolveMeasurementConfig', () => {
  it('returns an empty config when no measurement env vars are set', () => {
    const config = resolveMeasurementConfig({});
    expect(config).toEqual({});
    expect(hasAnyMeasurement(config)).toBe(false);
  });

  it('treats blank and whitespace-only values as unset', () => {
    const config = resolveMeasurementConfig({
      PUBLIC_GSC_VERIFICATION: '   ',
      PUBLIC_CLARITY_ID: '',
      PUBLIC_META_PIXEL_ID: ' \n ',
    });
    expect(config).toEqual({});
    expect(hasAnyMeasurement(config)).toBe(false);
  });

  it('reads each id when present and trims surrounding whitespace', () => {
    const config = resolveMeasurementConfig({
      PUBLIC_GSC_VERIFICATION: ' abc123 ',
      PUBLIC_CLARITY_ID: 'clarity-project-42',
      PUBLIC_META_PIXEL_ID: '1234567890123456',
    });
    expect(config).toEqual({
      gscVerification: 'abc123',
      clarityId: 'clarity-project-42',
      metaPixelId: '1234567890123456',
    });
    expect(hasAnyMeasurement(config)).toBe(true);
  });

  it('allows partial configuration (only one snippet enabled)', () => {
    const config = resolveMeasurementConfig({ PUBLIC_CLARITY_ID: 'clarity-only' });
    expect(config).toEqual({ clarityId: 'clarity-only' });
    expect(hasAnyMeasurement(config)).toBe(true);
  });
});
