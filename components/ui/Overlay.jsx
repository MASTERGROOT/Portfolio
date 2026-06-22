'use client';
import { useState, useEffect, useRef } from 'react';
import { useLang } from '../../lib/LangContext.jsx';
import { LangToggle } from './LangToggle.jsx';
import { ZONES, TOTAL_DEPTH } from '../../lib/zones.js';
import styles from './Overlay.module.css';

export function Overlay({ flightProgress }) {
  const { lang } = useLang();
  const [zoneIdx, setZoneIdx]     = useState(0);
  const [zone, setZone]           = useState(ZONES[0]);
  const [textVisible, setVisible] = useState(true);
  const [hintVisible, setHint]    = useState(true);
  const [pct, setPct]             = useState(0);
  const prevZone = useRef(0);
  const rafRef   = useRef(null);

  useEffect(() => {
    function tick() {
      const p  = flightProgress.progress.current;
      const zi = flightProgress.zoneIndex.current;
      setPct(Math.round(p * 100));

      if (zi !== prevZone.current) {
        prevZone.current = zi;
        setVisible(false);
        setTimeout(() => {
          setZone(ZONES[zi]);
          setZoneIdx(zi);
          setVisible(true);
        }, 220);
      }
      if (p > 0.01) setHint(false);
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [flightProgress]);

  function jumpToZone(i) {
    const mid = Math.abs(ZONES[i].zMid) / TOTAL_DEPTH;
    flightProgress.progress.current  = mid;
    flightProgress.zoneIndex.current = i;
  }

  return (
    <div className={styles.overlay} data-testid="overlay">
      {/* Top navigation */}
      <div className={styles.topnav}>
        <span className={styles.logo}>GOODY</span>
        <LangToggle />
      </div>

      {/* Centered section text */}
      <div
        className={styles.center}
        style={{ opacity: textVisible ? 1 : 0 }}
        aria-live="polite"
      >
        <p className={styles.label}>{zone.label[lang]}</p>
        <h1
          className={`${styles.title} ${lang === 'th' ? styles.titleTh : ''}`}
          data-testid="zone-title"
        >
          {zone.title[lang]}
        </h1>
        <p className={styles.sub}>{zone.sub[lang]}</p>
      </div>

      {/* Scroll hint — disappears after first scroll */}
      {hintVisible && (
        <div className={styles.hint} aria-hidden="true">
          ↕ SCROLL TO FLY THROUGH · MOVE MOUSE TO REPEL
        </div>
      )}

      {/* Progress counter */}
      <div className={styles.progress} aria-hidden="true" data-testid="progress">
        {String(pct).padStart(3, '0')}%
      </div>

      {/* Dot navigation */}
      <nav className={styles.dotnav} aria-label="Section navigation">
        {ZONES.map((z, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === zoneIdx ? styles.dotActive : ''}`}
            onClick={() => jumpToZone(i)}
            aria-label={z.title.en}
            aria-current={i === zoneIdx ? 'true' : undefined}
          />
        ))}
      </nav>
    </div>
  );
}
