'use client';
import { useLang } from '../../lib/LangContext.jsx';
import { content } from '../../lib/content.js';
import { useCinematicReveal } from '../../hooks/useCinematicReveal.js';
import styles from './ExperienceSection.module.css';

export function ExperienceSection() {
  const { lang } = useLang();
  const t = content.experience[lang];
  const sectionRef = useCinematicReveal();

  return (
    <section id="experience" ref={sectionRef} className={styles.section}>
      <p className={styles.tag}>{t.tag}</p>
      <h2 className={styles.heading}>{t.heading}</h2>
      <div className={styles.roles}>
        {t.roles.map((role, i) => (
          <div key={i} className={`${styles.role} reveal-item`}>
            <p className={styles.period}>{role.period}</p>
            <h3 className={styles.title}>{role.title}</h3>
            <p className={styles.company}>{role.company}</p>
            <p className={styles.desc}>{role.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
