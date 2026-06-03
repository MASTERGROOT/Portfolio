<script>
  import { langStore } from '../stores/lang.js';
  $: lang = $langStore;
  const content = {
    en: {
      tagline: 'Business Analyst &amp; ERP Implementation Specialist',
      name: 'Goody',
      subname: 'Vivitthachai Laprattanatrai',
      detail: 'Business Analyst & ERP Implementation Specialist based in Bangkok, delivering full-cycle ERP rollouts for construction and project-based organizations.',
      cta: 'Download CV',
      scroll: 'Scroll to explore',
    },
    th: {
      tagline: 'นักวิเคราะห์ธุรกิจ &amp; ผู้เชี่ยวชาญระบบ ERP',
      name: 'กู้ดดี้',
      subname: 'วิวิตถัชยา แลปรัตตนาตราย',
      detail: 'นักวิเคราะห์ธุรกิจและผู้เชี่ยวชาญ ERP ประจำกรุงเทพฯ ดูแลการ implement ERP แบบครบวงจรสำหรับองค์กรก่อสร้างและงานโครงการ',
      cta: 'ดาวน์โหลด CV',
      scroll: 'เลื่อนเพื่อสำรวจ',
    },
  };
  $: t = content[lang] ?? content.en;
</script>

<section data-scene="0" class="scene scene-intro">
  <div class="scene-content">
    <p class="tagline">{@html t.tagline}</p>
    <h1 class="hero-name">{t.name}</h1>
    <p class="hero-subname">{t.subname}</p>
    <p class="hero-desc">{t.detail}</p>
    <div style="margin-top: 2rem;">
      <a href="assets/Vivitthachai_Goody_CV.pdf" download class="cta-btn">{t.cta}</a>
    </div>
    <p class="scroll-hint">{t.scroll}</p>
  </div>
</section>

<style>
  .scene-intro { background: transparent; }
  .tagline { color: var(--gold); font-size: 0.85rem; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 1rem; }
  .hero-name { font-size: clamp(3rem, 8vw, 6rem); font-weight: 700; color: var(--white); line-height: 1; }
  .hero-subname { color: var(--gold-lt); font-size: 1.1rem; margin: 0.5rem 0; font-weight: 500; }
  .hero-desc { color: var(--muted-txt); font-size: 0.95rem; line-height: 1.6; max-width: 540px; margin: 1rem auto 0; }
  .cta-btn {
    display: inline-block;
    border: 1px solid var(--gold);
    color: var(--gold);
    padding: 0.6rem 1.6rem;
    text-decoration: none;
    font-size: 0.8rem;
    letter-spacing: 0.1em;
    transition: background 0.2s, color 0.2s;
  }
  .cta-btn:hover { background: var(--gold); color: var(--dark); }
  .scroll-hint { margin-top: 2.5rem; color: var(--muted-txt); font-size: 0.75rem; letter-spacing: 0.1em; }
</style>
