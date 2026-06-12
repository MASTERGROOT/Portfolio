'use client';
import { useLang } from '../../lib/LangContext.jsx';
import { content } from '../../lib/content.js';
import { useCinematicReveal } from '../../hooks/useCinematicReveal.js';
import { useMagneticTilt }    from '../../hooks/useMagneticTilt.js';
import styles from './CertificationsSection.module.css';

function CertCard({ item }) {
  const { ref, onMouseMove, onMouseLeave } = useMagneticTilt();
  return (
    <div ref={ref} className={`${styles.card} reveal-item`}
         onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <h3 className={styles.title}>{item.title}</h3>
      <p className={styles.issuer}>{item.issuer}</p>
      {item.status && <span className={styles.status}>{item.status}</span>}
    </div>
  );
}

export function CertificationsSection() {
  const { lang } = useLang();
  const t = content.certs[lang];
  const sectionRef = useCinematicReveal();

  return (
    <section id="certs" ref={sectionRef} className={styles.section}>
      <p className={styles.tag}>{t.tag}</p>
      <h2 className={styles.heading}>{t.heading}</h2>
      <div className={styles.grid}>
        {t.items.map((item, i) => <CertCard key={i} item={item} />)}
      </div>
    </section>
  );
}
