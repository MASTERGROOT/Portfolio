'use client';
import { useRef, useEffect } from 'react';
import { getZoneIndex } from '../lib/zones.js';

// Wheel deltas feed a target; progress eases toward it each frame for inertia.
const SENSITIVITY = 0.0009;
const EASE = 0.085;          // higher = snappier, lower = more glide
const EPSILON = 0.00005;     // stop lerping when close enough

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
      cancelAnimationFrame(raf);
    };
  }, []);

  // Expose target so programmatic jumps (dot nav) sync both refs.
  return { progress, zoneIndex, target };
}
