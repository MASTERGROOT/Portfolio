'use client';
import { useLang } from '../../lib/LangContext.jsx';
import { content } from '../../lib/content.js';
import { useCinematicReveal } from '../../hooks/useCinematicReveal.js';
import { useMagneticTilt }    from '../../hooks/useMagneticTilt.js';
import styles from './SkillsSection.module.css';

const CAT_KEYS = [
  { cat: 'cat1', tags: ['erp','modules','uat','golive'] },
  { cat: 'cat2', tags: ['sop','requirements','mapping','gap','stakeholder','change'] },
  { cat: 'cat3', tags: ['sql','python','powerbi','excel','dashboard','xtra'] },
  { cat: 'cat4', tags: ['jira','confluence','autocad','finance'] },
];

function TagCard({ text }) {
  const { ref, onMouseMove, onMouseLeave } = useMagneticTilt();
  return (
    <span ref={ref} className={`${styles.tag} reveal-item`}
          onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      {text}
    </span>
  );
}

export function SkillsSection() {
  const { lang } = useLang();
  const t = content.skills[lang];
  const sectionRef = useCinematicReveal();

  return (
    <section id="skills" ref={sectionRef} className={styles.section}>
      <p className={styles.sectionTag}>{t.tag}</p>
      <h2 className={styles.heading}>{t.heading}</h2>
      {CAT_KEYS.map(({ cat, tags }) => (
        <div key={cat} className={styles.category}>
          <h3 className={styles.catName}>{t[cat]}</h3>
          <div className={styles.tags}>
            {tags.map(k => <TagCard key={k} text={t.tags[k]} />)}
          </div>
        </div>
      ))}
    </section>
  );
}
