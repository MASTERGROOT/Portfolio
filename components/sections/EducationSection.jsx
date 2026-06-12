'use client';
import { useLang } from '../../lib/LangContext.jsx';
import { content } from '../../lib/content.js';
import { useCinematicReveal } from '../../hooks/useCinematicReveal.js';
import { useMagneticTilt }    from '../../hooks/useMagneticTilt.js';
import styles from './EducationSection.module.css';

export function EducationSection() {
  const { lang } = useLang();
  const t = content.education[lang];
  const sectionRef = useCinematicReveal();
  const { ref, onMouseMove, onMouseLeave } = useMagneticTilt();

  return (
    <section id="education" ref={sectionRef} className={styles.section}>
      <p className={styles.tag}>{t.tag}</p>
      <h2 className={styles.heading}>{t.heading}</h2>
      <div ref={ref} className={`${styles.card} reveal-item`}
           onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
        <h3 className={styles.degree}>{t.degree}</h3>
        <p className={styles.school}>{t.school}</p>
        <p className={styles.desc}>{t.desc}</p>
        <div className={styles.meta}>
          <span className={styles.badge}>{t.gpa}</span>
          <span className={styles.badge}>{t.award}</span>
        </div>
      </div>
    </section>
  );
}
