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

  if (!isFine) return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#050505',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      color: 'rgba(255,255,255,0.35)',
      fontSize: '11px',
      letterSpacing: '0.3em',
      textTransform: 'uppercase',
      fontFamily: 'Montserrat, system-ui, sans-serif',
      userSelect: 'none',
    }}>
      <span>GOODY VIVITTHACHAI</span>
      <span style={{ color: 'rgba(245,158,11,0.5)' }}>Best experienced on desktop</span>
    </div>
  );
  return <SceneInner {...props} />;
}
