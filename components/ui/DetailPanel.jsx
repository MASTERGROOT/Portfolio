'use client';
import { useEffect, useRef, useState } from 'react';
import { useLang } from '../../lib/LangContext.jsx';
import { CONTENT } from '../../lib/content.js';
import styles from './DetailPanel.module.css';

export function DetailPanel({ zoneIndex, onClose }) {
  const { lang } = useLang();
  const panelRef  = useRef(null);
  const [closing, setClosing] = useState(false);
  const content   = CONTENT[zoneIndex];

  function handleClose() {
    setClosing(true);
    setTimeout(onClose, 280);
  }

  // Escape key + focus trap
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const focusable = panel.querySelectorAll('button, a[href], [tabindex="0"]');
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    first?.focus();

    function onKeyDown(e) {
      if (e.key === 'Escape') { handleClose(); return; }
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first?.focus();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      aria-hidden="true"
    >
      <div
        ref={panelRef}
        className={`${styles.panel} ${closing ? styles.closing : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={content.label[lang]}
        data-testid="detail-panel"
      >
        <div className={styles.header}>
          <span className={styles.headerLabel}>{content.label[lang]}</span>
          <button
            className={styles.closeBtn}
            onClick={handleClose}
            aria-label="Close panel"
            data-cursor="hover"
          >✕</button>
        </div>
        <div className={styles.divider} />
        <div className={styles.body}>
          <ZoneContent zoneIndex={zoneIndex} lang={lang} body={content.body} />
        </div>
      </div>
    </div>
  );
}

function ZoneContent({ zoneIndex, lang, body }) {
  switch (zoneIndex) {
    case 0: return <HeroContent lang={lang} body={body} />;
    case 1: return <AboutContent lang={lang} body={body} />;
    case 2: return <ExperienceContent lang={lang} body={body} />;
    case 3: return <SkillsContent lang={lang} body={body} />;
    case 4: return <WorkContent lang={lang} body={body} />;
    case 5: return <EducationContent lang={lang} body={body} />;
    case 6: return <CertsContent lang={lang} body={body} />;
    case 7: return <ContactContent lang={lang} body={body} />;
    default: return null;
  }
}

function HeroContent({ lang, body }) {
  return (
    <div className={styles.heroContent}>
      {body.ctaLinks.map((link) => (
        <a
          key={link.type}
          href={link.href}
          className={link.type === 'cv' ? styles.ctaPrimary : styles.ctaSecondary}
          target={link.type !== 'cv' && link.type !== 'email' ? '_blank' : undefined}
          rel="noopener noreferrer"
          data-cursor="hover"
        >
          {link.label[lang]}
        </a>
      ))}
    </div>
  );
}

function AboutContent({ lang, body }) {
  return (
    <div className={styles.aboutContent}>
      <div className={styles.statsRow}>
        {body.stats.map((s, i) => (
          <div key={i} className={styles.statCard}>
            <span className={styles.statValue}>{s.value[lang]}</span>
            <span className={styles.statLabel}>{s.label[lang]}</span>
          </div>
        ))}
      </div>
      <p className={styles.bio}>{body.bio[lang]}</p>
    </div>
  );
}

function ExperienceContent({ lang, body }) {
  return (
    <div className={styles.timeline}>
      {body.roles.map((role, i) => (
        <div key={i} className={styles.role}>
          <div className={styles.roleMeta}>
            <span className={styles.roleTitle}>{role.title[lang]}</span>
            <span className={styles.roleCompany}>{role.company[lang]}</span>
            <span className={styles.rolePeriod}>{role.period[lang]}</span>
          </div>
          <ul className={styles.bullets}>
            {role.bullets[lang].map((b, j) => (
              <li key={j}>{b}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function SkillsContent({ lang, body }) {
  return (
    <div className={styles.skillsContent}>
      {body.categories.map((cat, i) => (
        <div key={i} className={styles.skillCat}>
          <span className={styles.skillCatName}>{cat.name[lang]}</span>
          <div className={styles.chips}>
            {cat.skills.map((skill) => (
              <span key={skill} className={styles.chip}>{skill}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function WorkContent({ lang, body }) {
  return (
    <div className={styles.workContent}>
      {body.projects.map((proj, i) => (
        <div key={i} className={styles.projectCard}>
          <span className={styles.projectTitle}>{proj.title[lang]}</span>
          <p className={styles.projectDesc}>{proj.desc[lang]}</p>
          <div className={styles.chips}>
            {proj.tags.map((tag) => (
              <span key={tag} className={styles.chip}>{tag}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function EducationContent({ lang, body }) {
  const { degree } = body;
  return (
    <div className={styles.eduCard}>
      <span className={styles.eduInstitution}>{degree.institution[lang]}</span>
      <span className={styles.eduField}>{degree.field[lang]}</span>
      <span className={styles.eduLevel}>{degree.level[lang]}</span>
      {degree.year[lang] && <span className={styles.eduYear}>{degree.year[lang]}</span>}
      {degree.honors[lang] && <span className={styles.eduHonors}>{degree.honors[lang]}</span>}
    </div>
  );
}

function CertsContent({ lang, body }) {
  return (
    <div className={styles.certsContent}>
      {body.certs.map((cert, i) => (
        <div key={i} className={styles.certCard}>
          <span className={styles.certName}>{cert.name[lang]}</span>
          <span className={styles.certMeta}>{cert.issuer[lang]} · {cert.year[lang]}</span>
        </div>
      ))}
    </div>
  );
}

function ContactContent({ lang, body }) {
  return (
    <div className={styles.contactContent}>
      <a href={`mailto:${body.email}`} className={styles.emailLink} data-cursor="hover">
        {body.email}
      </a>
      <div className={styles.contactLinks}>
        <a href={body.linkedin} target="_blank" rel="noopener noreferrer" className={styles.ctaSecondary} data-cursor="hover">
          LinkedIn
        </a>
        <a href={body.cv} className={styles.ctaPrimary} data-cursor="hover">
          {lang === 'th' ? 'ดาวน์โหลด CV' : 'Download CV'}
        </a>
      </div>
      <span className={styles.statusPill}>
        {body.status[lang]}
      </span>
    </div>
  );
}
