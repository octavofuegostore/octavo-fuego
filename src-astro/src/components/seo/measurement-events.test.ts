import { describe, expect, it } from 'vitest';
import { EVENT_NAMES, pushEvent } from './measurement-events';

// PUBLIC_GTM_ID is unset in the test environment, so every helper must be a
// no-op: no window.dataLayer may be created or touched (R-G4 S2).
describe('measurement-events (PUBLIC_GTM_ID unset)', () => {
  it('does not create or touch window.dataLayer when GTM is not configured', () => {
    expect((window as unknown as { dataLayer?: unknown[] }).dataLayer).toBeUndefined();

    pushEvent(EVENT_NAMES.add_to_cart, {
      ecommerce: { currency: 'COP', value: 100, items: [] },
    });
    pushEvent(EVENT_NAMES.generate_lead, { value: 100, currency: 'COP', lead_source: 'whatsapp' });

    expect((window as unknown as { dataLayer?: unknown[] }).dataLayer).toBeUndefined();
  });

  it('defines the five-event WhatsApp-first catalog and excludes purchase', () => {
    expect(Object.values(EVENT_NAMES)).toEqual([
      'view_item',
      'add_to_cart',
      'begin_checkout',
      'whatsapp_click',
      'generate_lead',
    ]);
    expect((EVENT_NAMES as Record<string, string>).purchase).toBeUndefined();
  });
});
