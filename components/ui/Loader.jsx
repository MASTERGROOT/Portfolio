'use client';
import { useEffect, useState, useRef } from 'react';
import { animate } from 'motion/react';
import styles from './Loader.module.css';

export function Loader({ onComplete }) {
  const [count, setCount] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    const reduced = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      const t = setTimeout(() => { if (!doneRef.current) { doneRef.current = true; onComplete(); } }, 400);
      return () => clearTimeout(t);
    }

    // Fallback: fire onComplete after full animation duration in case animate()
    // cannot run (e.g., test environments where RAF is not driven by fake timers).
    // doneRef prevents double-calling when the real onComplete fires first.
    const fallbackDelay = 300 + 1500 + 100 + 400; // delay + duration + pause + fade = 2300ms
    const fallback = setTimeout(() => {
      setFadingOut(true);
      if (!doneRef.current) { doneRef.current = true; onComplete(); }
    }, fallbackDelay);

    const controls = animate(0, 100, {
      duration: 1.5,
      delay: 0.3,
      ease: [0.4, 0, 0.6, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => {
        setTimeout(() => setFadingOut(true), 100);
        setTimeout(() => { if (!doneRef.current) { doneRef.current = true; onComplete(); } }, 400);
      },
    });

    return () => { controls.stop(); clearTimeout(fallback); };
  }, [onComplete]);

  return (
    <div className={`${styles.loader} ${fadingOut ? styles.fadingOut : ''}`}>
      <div className={styles.center}>
        <p className={styles.name} data-testid="loader-name">
          VIVITTHACHAI LAPRATTANATRAI
        </p>
        <p className={styles.role} data-testid="loader-role">
          BUSINESS ANALYST · ERP · DATA
        </p>
      </div>
      <p className={styles.counter}>{String(count).padStart(3, '0')}</p>
      <div className={styles.barTrack}>
        <div className={styles.bar} style={{ width: `${count}%` }} />
      </div>
    </div>
  );
}
