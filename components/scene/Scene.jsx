'use client';
import dynamic from 'next/dynamic';

// Three.js is browser-only — ssr:false prevents server-side import errors
const SceneInner = dynamic(
  () => import('./SceneInner.jsx').then(m => m.SceneInner),
  { ssr: false, loading: () => null }
);

// Guard: hide canvas on touch devices (pointer:coarse)
function useIsFinePointer() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: fine)').matches;
}

export function Scene(props) {
  const isFine = useIsFinePointer();
  if (!isFine) return null;
  return <SceneInner {...props} />;
}
