'use client';
import { useLang } from '../../lib/LangContext.jsx';
import { content } from '../../lib/content.js';
import { useCinematicReveal } from '../../hooks/useCinematicReveal.js';
import { useMagneticTilt }    from '../../hooks/useMagneticTilt.js';
import styles from './WorkSection.module.css';

function ProjectCard({ project }) {
  const { ref, onMouseMove, onMouseLeave } = useMagneticTilt();
  return (
    <div ref={ref} className={`${styles.card} reveal-item`}
         onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <div className={styles.pills}>{project.tags.map(tag => <span key={tag} className={styles.pill}>{tag}</span>)}</div>
      <h3 className={styles.title}>{project.title}</h3>
      <p className={styles.desc}>{project.desc}</p>
      <a href="#" className={styles.cta} aria-disabled="true" tabIndex={-1} onClick={(e) => e.preventDefault()}>{project.cta}</a>
    </div>
  );
}

export function WorkSection() {
  const { lang } = useLang();
  const t = content.work[lang];
  const sectionRef = useCinematicReveal();

  return (
    <section id="work" ref={sectionRef} className={styles.section}>
      <p className={styles.tag}>{t.tag}</p>
      <h2 className={styles.heading}>{t.heading}</h2>
      <div className={styles.grid}>
        {t.projects.map((p, i) => <ProjectCard key={i} project={p} />)}
      </div>
    </section>
  );
}
