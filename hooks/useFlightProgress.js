'use client';
import { useRef, useEffect } from 'react';
import { getZoneIndex } from '../lib/zones.js';

const SENSITIVITY = 0.0015;

export function useFlightProgress() {
  const progress = useRef(0);
  const zoneIndex = useRef(0);

  useEffect(() => {
    function onWheel(e) {
      e.preventDefault();
      const next = Math.max(0, Math.min(1, progress.current + e.deltaY * SENSITIVITY));
      progress.current = next;
      zoneIndex.current = getZoneIndex(next);
    }
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  return { progress, zoneIndex };
}
