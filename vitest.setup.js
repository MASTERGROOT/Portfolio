// Vitest setup file
// Node.js v22+ exposes an experimental localStorage global that is undefined
// unless --localstorage-file is passed. jsdom provides its own localStorage,
// but on Node v22+ the undefined global shadows it. Polyfill here so tests
// that call localStorage.clear() / getItem / setItem work correctly.

// jsdom does not implement window.matchMedia — polyfill for component tests
if (typeof window !== 'undefined' && typeof window.matchMedia === 'undefined') {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

if (typeof localStorage === 'undefined' || localStorage === null) {
  const store = {};
  globalThis.localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); },
    get length() { return Object.keys(store).length; },
    key: (i) => Object.keys(store)[i] ?? null,
  };
}
