'use client';
import { useRef, useEffect } from 'react';
import { getZoneIndex } from '../lib/zones.js';

// Wheel deltas feed a target; progress eases toward it each frame for inertia.
const SENSITIVITY       = 0.0009;
const TOUCH_SENSITIVITY = 0.003;
const EASE    = 0.085;
const EPSILON = 0.00005;

export function useFlightProgress() {
  const progress  = useRef(0);
  const zoneIndex = useRef(0);
  const target    = useRef(0);

  useEffect(() => {
    function onWheel(e) {
      if (e.target instanceof Element && e.target.closest('[data-panel-scroll]')) return;
      e.preventDefault();
      target.current = Math.max(0, Math.min(1, target.current + e.deltaY * SENSITIVITY));
    }
    window.addEventListener('wheel', onWheel, { passive: false });

    let touchLastY = 0;
    function onTouchStart(e) {
      touchLastY = e.touches[0].clientY;
    }
    function onTouchMove(e) {
      if (e.target instanceof Element && e.target.closest('[data-panel-scroll]')) return;
      e.preventDefault();
      const dy = touchLastY - e.touches[0].clientY;
      touchLastY = e.touches[0].clientY;
      target.current = Math.max(0, Math.min(1, target.current + dy * TOUCH_SENSITIVITY));
    }
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });

    let raf;
    function tick() {
      const diff = target.current - progress.current;
      if (Math.abs(diff) > EPSILON) {
        progress.current += diff * EASE;
      } else {
        progress.current = target.current;
      }
      zoneIndex.current = getZoneIndex(progress.current);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Expose target so programmatic jumps (dot nav) sync both refs.
  return { progress, zoneIndex, target };
}
