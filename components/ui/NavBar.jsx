'use client';
import { useEffect, useRef } from 'react';
import { useLang } from '../../lib/LangContext.jsx';
import { content }  from '../../lib/content.js';
import { LangToggle } from './LangToggle.jsx';
import styles from './NavBar.module.css';

const LINKS = ['about', 'experience', 'skills', 'work', 'contact'];

export function NavBar() {
  const { lang } = useLang();
  const t = content.nav[lang];
  const navRef = useRef(null);

  // Scroll-reveal: show navbar after scrolling past 55vh
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    function onScroll() {
      var past55 = window.scrollY > window.innerHeight * 0.55;
      nav.classList.toggle(styles.visible, past55);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav ref={navRef} className={styles.nav}>
      <a href="#hero" className={styles.brand}>{t.brand}</a>
      <ul className={styles.links}>
        {LINKS.map(key => (
          <li key={key}>
            <a href={`#${key}`} className={styles.link}>{t[key]}</a>
          </li>
        ))}
        <li><LangToggle /></li>
      </ul>
    </nav>
  );
}
