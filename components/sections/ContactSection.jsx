'use client';
import { useLang } from '../../lib/LangContext.jsx';
import { content } from '../../lib/content.js';
import { useCinematicReveal } from '../../hooks/useCinematicReveal.js';
import styles from './ContactSection.module.css';

export function ContactSection() {
  const { lang } = useLang();
  const t = content.contact[lang];
  const f = content.footer[lang];
  const sectionRef = useCinematicReveal();

  return (
    <section id="contact" ref={sectionRef} className={styles.section}>
      <p className={styles.tag}>{t.tag}</p>
      <h2 className={styles.heading}>{t.heading}</h2>
      <p className={styles.desc}>{t.desc}</p>
      <div className={styles.links}>
        <a href="mailto:vivitthachaigood@gmail.com" className={`${styles.link} reveal-item`}>{t.email}</a>
        <a href="https://linkedin.com/in/vivitthachai" target="_blank" rel="noopener noreferrer" className={`${styles.link} reveal-item`}>{t.linkedin}</a>
        <a href="/assets/Vivitthachai_Goody_CV.pdf" download className={`${styles.link} reveal-item`}>{t.cv}</a>
      </div>
      <footer className={styles.footer}>{f.text}</footer>
    </section>
  );
}
