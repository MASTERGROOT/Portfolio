'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useLang } from '../../lib/LangContext.jsx';
import { content } from '../../lib/content.js';
import styles from './HeroSection.module.css';

export function HeroSection() {
  const { lang } = useLang();
  const t = content.hero[lang];
  const headRef = useRef(null);

  useEffect(() => {
    if (!headRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const chars = headRef.current.querySelectorAll('.' + styles.char);
    gsap.fromTo(chars,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', stagger: 0.03, delay: 0.3 }
    );
  }, [lang]);

  function buildChars(text) {
    return text.split('').map((ch, i) => (
      <span key={i} className={styles.char} aria-hidden="true">{ch === ' ' ? ' ' : ch}</span>
    ));
  }

  return (
    <section id="hero" className={styles.hero}>
      <p className={styles.role}>{t.role}</p>
      <h1 ref={headRef} className={styles.headline}>
        <span className={styles.line}>
          <span className={styles.srOnly}>{t.line1}</span>
          {buildChars(t.line1)}
        </span>
        <span className={styles.line}>
          <span className={styles.srOnly}>{t.line2}</span>
          {buildChars(t.line2)}
        </span>
      </h1>
      <p className={styles.name}>{t.name}</p>
      <div className={styles.divider} />
      <p className={styles.bio}>{t.bio}</p>
      <div className={styles.ctas}>
        <a href="#work" className={styles.ctaPrimary}>{t.cta1}</a>
        <a href="/assets/Vivitthachai_Goody_CV.pdf" download className={styles.ctaSecondary}>{t.cta2}</a>
      </div>
      <div className={styles.scrollHint}>{t.scroll}</div>
    </section>
  );
}
