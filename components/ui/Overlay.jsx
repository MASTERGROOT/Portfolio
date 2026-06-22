'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { animate } from 'motion/react';
import { useLang } from '../../lib/LangContext.jsx';
import { LangToggle } from './LangToggle.jsx';
import { ZONES, TOTAL_DEPTH } from '../../lib/zones.js';
import { DetailPanel } from './DetailPanel.jsx';
import styles from './Overlay.module.css';

export function Overlay({ flightProgress }) {
  const { lang } = useLang();
  const [zoneIdx, setZoneIdx]     = useState(0);
  const [zone, setZone]           = useState(ZONES[0]);
  const [textVisible, setVisible] = useState(true);
  const [hintVisible, setHint]    = useState(true);
  const [pct, setPct]             = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);
  const [tooltipIdx, setTooltip]  = useState(null);
  const prevZone  = useRef(0);
  const rafRef    = useRef(null);
  const hintRef   = useRef(true);
  const labelRef  = useRef(null);
  const titleRef  = useRef(null);
  const subRef    = useRef(null);

  const animateIn = useCallback(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const els = [labelRef.current, titleRef.current, subRef.current].filter(Boolean);
    els.forEach((el, i) => {
      animate(el, { opacity: [0, 1], y: [i === 1 ? 12 : 8, 0] }, {
        duration: i === 1 ? 0.5 : 0.4,
        delay: i * 0.05,
        ease: 'easeOut',
      });
    });
  }, []);

  const animateOut = useCallback((cb) => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { cb(); return; }
    const els = [labelRef.current, titleRef.current, subRef.current].filter(Boolean);
    Promise.all(
      els.map((el, i) =>
        animate(el, { opacity: [1, 0], y: [0, -10] }, {
          duration: 0.22,
          delay: i * 0.03,
          ease: 'easeIn',
        }).finished
      )
    ).then(cb);
  }, []);

  useEffect(() => {
    function tick() {
      const p  = flightProgress.progress.current;
      const zi = flightProgress.zoneIndex.current;
      setPct(Math.round(p * 100));

      if (zi !== prevZone.current) {
        const nextZi = zi;
        prevZone.current = zi;
        animateOut(() => {
          setZone(ZONES[nextZi]);
          setZoneIdx(nextZi);
          setVisible(true);
          requestAnimationFrame(animateIn);
        });
      }
      if (p > 0.01 && hintRef.current) {
        hintRef.current = false;
        setHint(false);
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [flightProgress, animateIn, animateOut]);

  function jumpToZone(i) {
    const mid = Math.abs(ZONES[i].zMid) / TOTAL_DEPTH;
    flightProgress.progress.current  = mid;
    flightProgress.zoneIndex.current = i;
  }

  return (
    <div className={styles.overlay} data-testid="overlay">
      {/* Top navigation */}
      <div className={styles.topnav}>
        <span className={styles.logo}>VIVITTHACHAI</span>
        <LangToggle />
      </div>

      {/* Centered section text — click opens detail panel */}
      <div
        className={styles.center}
        data-testid="zone-center"
        data-cursor="hover"
        onClick={() => setPanelOpen(true)}
        style={{ pointerEvents: 'all', cursor: 'none' }}
        aria-label={`Open ${zone.title[lang]} details`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setPanelOpen(true)}
      >
        <p ref={labelRef} className={styles.label}>{zone.label[lang]}</p>
        <h1
          ref={titleRef}
          className={`${styles.title} ${lang === 'th' ? styles.titleTh : ''}`}
          data-testid="zone-title"
        >
          {zone.title[lang]}
        </h1>
        <p ref={subRef} className={styles.sub}>{zone.sub[lang]}</p>
      </div>

      {/* Scroll hint */}
      {hintVisible && (
        <div className={styles.hint} aria-hidden="true">
          ↕ SCROLL TO FLY THROUGH · MOVE MOUSE TO REPEL
        </div>
      )}

      {/* Bottom bar — wordmark + progress line + counter */}
      <div className={styles.bottomBar} aria-hidden="true">
        <span className={styles.wordmark}>GOODY</span>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${pct}%` }} />
        </div>
        <span className={styles.progressNum}>{String(pct).padStart(3, '0')}%</span>
      </div>

      {/* Dot navigation */}
      <nav className={styles.dotnav} aria-label="Section navigation">
        {ZONES.map((z, i) => (
          <div key={i} className={styles.dotWrap}
            onMouseEnter={() => setTooltip(i)}
            onMouseLeave={() => setTooltip(null)}
          >
            {tooltipIdx === i && (
              <span className={styles.tooltip} aria-hidden="true">
                {z.title[lang]}
              </span>
            )}
            <button
              className={`${styles.dot} ${i === zoneIdx ? styles.dotActive : ''}`}
              onClick={() => jumpToZone(i)}
              data-cursor="hover"
              aria-label={z.title.en}
              aria-current={i === zoneIdx ? 'true' : undefined}
            />
          </div>
        ))}
      </nav>

      {/* Detail panel */}
      {panelOpen && (
        <DetailPanel
          zoneIndex={zoneIdx}
          onClose={() => setPanelOpen(false)}
        />
      )}
    </div>
  );
}
