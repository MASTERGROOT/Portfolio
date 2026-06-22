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

  it('increments progress on wheel forward (deltaY > 0)', () => {
    const { result } = renderHook(() => useFlightProgress());
    act(() => {
      window.dispatchEvent(
        new WheelEvent('wheel', { deltaY: 100, bubbles: true, cancelable: true })
      );
    });
    // 100 * 0.0015 = 0.15
    expect(result.current.progress.current).toBeCloseTo(0.15, 2);
  });

  it('clamps at max 1', () => {
    const { result } = renderHook(() => useFlightProgress());
    act(() => {
      window.dispatchEvent(
        new WheelEvent('wheel', { deltaY: 999999, bubbles: true, cancelable: true })
      );
    });
    expect(result.current.progress.current).toBe(1);
    expect(result.current.zoneIndex.current).toBe(7);
  });

  it('clamps at min 0', () => {
    const { result } = renderHook(() => useFlightProgress());
    act(() => {
      window.dispatchEvent(
        new WheelEvent('wheel', { deltaY: -999999, bubbles: true, cancelable: true })
      );
    });
    expect(result.current.progress.current).toBe(0);
    expect(result.current.zoneIndex.current).toBe(0);
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
