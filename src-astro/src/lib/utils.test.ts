import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn()', () => {
  it('returns a single class unchanged', () => {
    expect(cn('px-4')).toBe('px-4');
  });

  it('merges multiple classes', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2');
  });

  it('filters falsy values', () => {
    expect(cn('px-4', false && 'hidden', undefined, null, 0, 'py-2')).toBe('px-4 py-2');
  });

  it('resolves Tailwind conflicts via twMerge (last value wins)', () => {
    expect(cn('px-4', 'px-2')).toBe('px-2');
  });
});
