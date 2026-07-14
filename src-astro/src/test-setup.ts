import { vi } from 'vitest';

/**
 * Mock localStorage for jsdom environment.
 * JSDOM's localStorage throws SecurityError for opaque origins
 * in newer versions, so we provide a simple mock.
 */
const store = new Map<string, string>();

const localStorageMock: Storage = {
  getItem: vi.fn((key: string) => store.get(key) ?? null),
  setItem: vi.fn((key: string, value: string) => { store.set(key, value); }),
  removeItem: vi.fn((key: string) => { store.delete(key); }),
  clear: vi.fn(() => { store.clear(); }),
  key: vi.fn((index: number) => Array.from(store.keys())[index] ?? null),
  get length() { return store.size; },
};

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
});
