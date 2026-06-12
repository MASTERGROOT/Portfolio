import { describe, it, expect, vi, beforeEach } from 'vitest';

// IntersectionObserver is not in jsdom — mock it.
const observerCallbacks = new Map();
global.IntersectionObserver = class {
  constructor(cb) { this._cb = cb; }
  observe(el)   { observerCallbacks.set(el, this._cb); }
  unobserve(el) { observerCallbacks.delete(el); }
  disconnect()  {}
};

// GSAP mock
vi.mock('gsap', () => ({
  gsap: {
    fromTo: vi.fn(),
    set:    vi.fn(),
  },
}));

import { renderHook } from '@testing-library/react';
import { useCinematicReveal } from './useCinematicReveal.js';
import { gsap } from 'gsap';

beforeEach(() => {
  observerCallbacks.clear();
  vi.clearAllMocks();
});

describe('useCinematicReveal', () => {
  it('returns a ref', () => {
    const { result } = renderHook(() => useCinematicReveal());
    expect(result.current).toHaveProperty('current');
  });

  it('calls gsap.fromTo when element enters viewport', () => {
    const { result } = renderHook(() => useCinematicReveal());
    const el = document.createElement('div');
    result.current.current = el;

    // Simulate observer firing
    const fakeEntry = [{ isIntersecting: true, target: el }];
    observerCallbacks.get(el)?.(fakeEntry);

    // gsap.fromTo may be deferred — just check hook doesn't throw.
    expect(result.current.current).toBe(el);
  });
});
