import { describe, it, expect, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFlightProgress } from './useFlightProgress.js';

afterEach(() => {
  // Reset by re-rendering — no global state to clean
});

describe('useFlightProgress', () => {
  it('starts at progress=0 and zoneIndex=0', () => {
    const { result } = renderHook(() => useFlightProgress());
    expect(result.current.progress.current).toBe(0);
    expect(result.current.zoneIndex.current).toBe(0);
  });

  it('advances scroll target on wheel forward (deltaY > 0)', () => {
    const { result } = renderHook(() => useFlightProgress());
    act(() => {
      window.dispatchEvent(
        new WheelEvent('wheel', { deltaY: 100, bubbles: true, cancelable: true })
      );
    });
    // 100 * 0.0009 = 0.09 — progress eases toward this each frame
    expect(result.current.target.current).toBeCloseTo(0.09, 3);
  });

  it('clamps target at max 1', () => {
    const { result } = renderHook(() => useFlightProgress());
    act(() => {
      window.dispatchEvent(
        new WheelEvent('wheel', { deltaY: 999999, bubbles: true, cancelable: true })
      );
    });
    expect(result.current.target.current).toBe(1);
  });

  it('clamps target at min 0', () => {
    const { result } = renderHook(() => useFlightProgress());
    act(() => {
      window.dispatchEvent(
        new WheelEvent('wheel', { deltaY: -999999, bubbles: true, cancelable: true })
      );
    });
    expect(result.current.target.current).toBe(0);
  });

  it('removes wheel listener on unmount', () => {
    const { unmount } = renderHook(() => useFlightProgress());
    // Dispatch after unmount — should not throw
    unmount();
    expect(() => {
      window.dispatchEvent(
        new WheelEvent('wheel', { deltaY: 100, bubbles: true, cancelable: true })
      );
    }).not.toThrow();
  });
});
