'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './Cursor.module.css';

export function Cursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const pos     = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const hover   = useRef(false);
  const [visible, setVisible] = useState(false);
  const rafRef  = useRef(null);

  useEffect(() => {
    function onMove(e) {
      pos.current = { x: e.clientX, y: e.clientY };
      hover.current = !!(e.target && typeof e.target.closest === 'function' && e.target.closest('[data-cursor="hover"]'));
      if (!visible) setVisible(true);
    }

    function onDown() {
      if (!dotRef.current) return;
      const { x, y } = pos.current;
      dotRef.current.style.transform = `translate(${x - 4}px, ${y - 4}px) scale(0.6)`;
      setTimeout(() => {
        if (!dotRef.current) return;
        dotRef.current.style.transform = `translate(${x - 4}px, ${y - 4}px) scale(1.2)`;
        setTimeout(() => {
          if (!dotRef.current) return;
          dotRef.current.style.transform = `translate(${x - 4}px, ${y - 4}px) scale(1)`;
        }, 75);
      }, 75);
    }

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
    };
  }, [visible]);

  useEffect(() => {
    function tick() {
      const { x, y } = pos.current;
      const r = ringPos.current;
      r.x += (x - r.x) * 0.12;
      r.y += (y - r.y) * 0.12;

      if (dotRef.current && !dotRef.current.dataset.clicking) {
        const scale = hover.current ? 0 : 1;
        dotRef.current.style.transform = `translate(${x - 4}px, ${y - 4}px) scale(${scale})`;
      }
      if (ringRef.current) {
        const size   = hover.current ? 42 : 28;
        const half   = size / 2;
        const bgFill = hover.current ? 'rgba(245,158,11,0.08)' : 'transparent';
        ringRef.current.style.transform  = `translate(${r.x - half}px, ${r.y - half}px) scale(${hover.current ? 1.5 : 1})`;
        ringRef.current.style.width      = `${size}px`;
        ringRef.current.style.height     = `${size}px`;
        ringRef.current.style.background = bgFill;
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  if (!visible) return null;

  return (
    <>
      <div ref={dotRef}  className={styles.dot}  data-cursor-dot  />
      <div ref={ringRef} className={styles.ring} data-cursor-ring />
    </>
  );
}
