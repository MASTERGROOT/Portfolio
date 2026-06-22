'use client';
import { useLang } from '../../lib/LangContext.jsx';
import styles from './LangToggle.module.css';

export function LangToggle() {
  const { lang, setLang } = useLang();
  const next = lang === 'en' ? 'th' : 'en';

  return (
    <button
      className={styles.pill}
      data-lang={lang}
      data-cursor="hover"
      aria-label={`Switch to ${next === 'th' ? 'Thai' : 'English'}`}
      onClick={() => setLang(next)}
    >
      <span className={lang === 'en' ? styles.active : styles.inactive}>EN</span>
      <span className={styles.divider}> | </span>
      <span className={lang === 'th' ? styles.active : styles.inactive}>TH</span>
    </button>
  );
}
