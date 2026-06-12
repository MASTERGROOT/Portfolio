'use client';
import { useLang }  from '../../lib/LangContext.jsx';
import { content }  from '../../lib/content.js';
import { useCinematicReveal } from '../../hooks/useCinematicReveal.js';
import { useMagneticTilt }    from '../../hooks/useMagneticTilt.js';
import styles from './AboutSection.module.css';

const STATS = ['stat1', 'stat2', 'stat3', 'stat4', 'stat5'];

function StatCard({ text }) {
  const { ref, onMouseMove, onMouseLeave } = useMagneticTilt();
  return (
    <div ref={ref} className={`${styles.stat} reveal-item`}
         onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      {text}
    </div>
  );
}

export function AboutSection() {
  const { lang } = useLang();
  const t = content.about[lang];
  const sectionRef = useCinematicReveal();

  return (
    <section id="about" ref={sectionRef} className={styles.section}>
      <p className={styles.tag}>{t.tag}</p>
      <h2 className={styles.heading}>{t.heading}</h2>
      <div className={styles.body}>
        <div className={styles.bio}>
          <p>{t.p1}</p>
          <p>{t.p2}</p>
          <p>{t.p3}</p>
        </div>
        <div className={styles.stats}>
          {STATS.map(k => <StatCard key={k} text={t[k]} />)}
        </div>
      </div>
    </section>
  );
}
