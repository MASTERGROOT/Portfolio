'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const SceneInner = dynamic(
  () => import('./SceneInner.jsx').then(m => m.SceneInner),
  { ssr: false, loading: () => null }
);

export function Scene(props) {
  const [isCoarse, setIsCoarse] = useState(false);

  useEffect(() => {
    setIsCoarse(!window.matchMedia('(pointer: fine)').matches);
  }, []);

  return <SceneInner {...props} isCoarse={isCoarse} />;
}
