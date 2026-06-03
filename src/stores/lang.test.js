import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';

// Mock localStorage for test environment
const storageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = String(value); },
    clear: () => { store = {}; }
  };
})();

if (typeof window === 'undefined') {
  global.window = { localStorage: storageMock };
} else if (!window.localStorage) {
  Object.defineProperty(window, 'localStorage', { value: storageMock });
}
if (typeof localStorage === 'undefined') {
  global.localStorage = storageMock;
}

beforeEach(() => {
  localStorage.clear();
});

it('lang store defaults to en when localStorage is empty', async () => {
  const { langStore } = await import('./lang.js?v=' + Math.random());
  expect(get(langStore)).toBe('en');
});

it('lang store persists to localStorage on set', async () => {
  const { langStore } = await import('./lang.js?v=' + Math.random());
  langStore.set('th');
  expect(localStorage.getItem('lang')).toBe('th');
});
