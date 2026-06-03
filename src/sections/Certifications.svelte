<script>
  import { langStore } from '../stores/lang.js';
  $: lang = $langStore;
  const content = {
    en: {
      heading: 'Certifications',
      subheading: 'Certified to Deliver',
      metaCert: 'Certified',
      metaProg: 'On-process',
    },
    th: {
      heading: 'วุฒิบัตร',
      subheading: 'ผ่านการรับรองพร้อมส่งมอบ',
      metaCert: 'รับรองแล้ว',
      metaProg: 'กำลังดำเนินการ',
    },
  };
  $: t = content[lang] ?? content.en;

  const certs = [
    {
      icon: 'G',
      title: { en: 'Google Data Analytics', th: 'Google Data Analytics' },
      issuer: { en: 'Google', th: 'Google' },
      detail: { en: 'Professional Certificate', th: 'Professional Certificate' },
      progress: false,
    },
    {
      icon: 'Py',
      title: { en: 'Data Analysis with Python', th: 'การวิเคราะห์ข้อมูลด้วย Python' },
      issuer: { en: 'freeCodeCamp', th: 'freeCodeCamp' },
      detail: { en: 'Certified', th: 'รับรองแล้ว' },
      progress: false,
    },
    {
      icon: 'Sci',
      title: { en: 'Scientific Computing with Python', th: 'Scientific Computing with Python' },
      issuer: { en: 'freeCodeCamp', th: 'freeCodeCamp' },
      detail: { en: 'Certified', th: 'รับรองแล้ว' },
      progress: false,
    },
    {
      icon: 'AI',
      title: { en: 'IBM AI Engineering', th: 'IBM AI Engineering' },
      issuer: { en: 'IBM · Coursera', th: 'IBM · Coursera' },
      detail: { en: 'Professional Certificate', th: 'Professional Certificate' },
      progress: true,
    },
    {
      icon: 'DE',
      title: { en: 'IBM Data Engineering', th: 'IBM Data Engineering' },
      issuer: { en: 'IBM · Coursera', th: 'IBM · Coursera' },
      detail: { en: 'Professional Certificate', th: 'Professional Certificate' },
      progress: true,
    }
  ];
</script>

<section data-scene="6" class="scene scene-certs">
  <div class="scene-content">
    <h2 class="section-head">{t.heading}</h2>
    <h3 class="section-subheading">{t.subheading}</h3>
    <div class="cert-grid">
      {#each certs as cert}
        <div class="cert-card" class:in-progress={cert.progress}>
          <div class="cert-icon">{cert.icon}</div>
          <div class="cert-body">
            <h4>{lang === 'th' ? cert.title.th : cert.title.en}</h4>
            <p class="cert-meta">
              {lang === 'th' ? cert.issuer.th : cert.issuer.en} &middot;
              <b>{lang === 'th' ? cert.detail.th : cert.detail.en}</b>
            </p>
          </div>
          {#if cert.progress}
            <span class="status-badge">
              <span class="ping"></span>
              {t.metaProg}
            </span>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .section-head { color: var(--gold); font-size: clamp(1.8rem, 4vw, 3rem); margin-bottom: 0.5rem; }
  .section-subheading { font-size: 1.1rem; color: var(--muted-txt); margin-bottom: 2rem; letter-spacing: 0.1em; text-transform: uppercase; }
  .cert-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 600px;
    margin: 0 auto;
  }
  .cert-card {
    background: rgba(26, 26, 26, 0.6);
    border: 1px solid var(--muted);
    border-radius: 0.5rem;
    padding: 1.2rem 1.5rem;
    display: flex;
    align-items: center;
    text-align: left;
    gap: 1.5rem;
    position: relative;
  }
  .cert-card.in-progress {
    border-style: dashed;
    opacity: 0.85;
  }
  .cert-icon {
    background: var(--gold);
    color: var(--dark);
    font-weight: 700;
    width: 2.8rem;
    height: 2.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.25rem;
    flex-shrink: 0;
    font-size: 0.95rem;
  }
  .cert-body h4 { font-size: 1rem; color: var(--white); margin-bottom: 0.2rem; }
  .in-progress .cert-body { padding-right: 6rem; }
  .cert-meta { font-size: 0.8rem; color: var(--muted-txt); }
  .status-badge {
    position: absolute;
    top: 1rem;
    right: 1.5rem;
    font-size: 0.7rem;
    color: var(--gold-lt);
    background: rgba(201, 168, 76, 0.1);
    padding: 0.2rem 0.5rem;
    border-radius: 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
  .ping {
    width: 0.35rem;
    height: 0.35rem;
    background: var(--gold-lt);
    border-radius: 50%;
    animation: pulse 1.5s infinite;
  }
  @keyframes pulse {
    0% { transform: scale(0.95); opacity: 0.5; }
    50% { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(0.95); opacity: 0.5; }
  }
  @media (max-width: 576px) {
    .cert-card { flex-direction: column; text-align: center; gap: 1rem; padding-bottom: 3rem; }
    .status-badge { position: relative; right: auto; margin-top: 0.5rem; }
  }
</style>
