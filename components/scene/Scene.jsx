'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const SceneInner = dynamic(
  () => import('./SceneInner.jsx').then(m => m.SceneInner),
  { ssr: false, loading: () => null }
);

export function Scene(props) {
  const [isFine, setIsFine] = useState(false);

  useEffect(() => {
    setIsFine(window.matchMedia('(pointer: fine)').matches);
  }, []);

  if (!isFine) return null;
  return <SceneInner {...props} />;
}
