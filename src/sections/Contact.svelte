<script>
  import { langStore } from '../stores/lang.js';
  $: lang = $langStore;
  const content = {
    en: {
      heading: 'Let&rsquo;s Connect',
      subheading: 'Ready to Build <em>Something Together?</em>',
      body: 'Open to full-time roles, freelance projects, and ERP consulting engagements.',
      email: 'Send Email',
      download: 'Download CV',
      footer: '© 2026 <b>&ldquo;Goody&rdquo; Vivitthachai Laprattanatrai</b> · Bangkok, Thailand · Business Analyst &amp; ERP Implementation Specialist',
    },
    th: {
      heading: 'ติดต่อกัน',
      subheading: 'พร้อมสร้าง <em>สิ่งดีๆ ด้วยกันไหม?</em>',
      body: 'เปิดรับทั้งงานประจำ งาน freelance และงานที่ปรึกษา ERP',
      email: 'ส่งอีเมล',
      download: 'ดาวน์โหลด CV',
      footer: '© 2026 <b>&ldquo;Goody&rdquo; วิวิตถัชยา แลปรัตตนาตราย</b> · กรุงเทพฯ ประเทศไทย · นักวิเคราะห์ธุรกิจและผู้เชี่ยวชาญ ERP',
    },
  };
  $: t = content[lang] ?? content.en;
</script>

<section data-scene="7" class="scene scene-contact">
  <div class="scene-content">
    <h2 class="section-head">{t.heading}</h2>
    <h3 class="section-subheading">{@html t.subheading}</h3>
    <p class="body-text">{t.body}</p>
    <div class="contact-buttons">
      <a href="mailto:vivitthachaigood@hotmail.com" class="btn btn-fill">{t.email} <span class="arrow">→</span></a>
      <a href="https://www.linkedin.com/in/vivitthachai-laprattanatrai" target="_blank" rel="noopener noreferrer" class="btn btn-out">LinkedIn <span class="arrow">↗</span></a>
      <a href="assets/Vivitthachai_Goody_CV.pdf" download class="btn btn-out">{t.download} <span class="arrow">↓</span></a>
    </div>
    <footer>
      <p>{@html t.footer}</p>
    </footer>
  </div>
</section>

<style>
  .section-head { color: var(--gold); font-size: clamp(1.8rem, 4vw, 3rem); margin-bottom: 0.5rem; }
  .section-subheading { font-size: 1.25rem; color: var(--gold-lt); margin-bottom: 1.5rem; font-weight: 500; }
  .body-text { color: var(--white); font-size: 0.95rem; margin-bottom: 2rem; }
  .contact-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 4rem;
    flex-wrap: wrap;
  }
  .btn {
    display: inline-block;
    padding: 0.6rem 1.6rem;
    text-decoration: none;
    font-size: 0.8rem;
    letter-spacing: 0.1em;
    transition: background 0.2s, color 0.2s, border-color 0.2s;
  }
  .btn-fill {
    background: var(--gold);
    color: var(--dark);
    border: 1px solid var(--gold);
  }
  .btn-fill:hover {
    background: var(--gold-lt);
    border-color: var(--gold-lt);
  }
  .btn-out {
    border: 1px solid var(--gold);
    color: var(--gold);
  }
  .btn-out:hover {
    background: var(--gold);
    color: var(--dark);
  }
  footer {
    border-top: 1px solid var(--muted);
    padding-top: 2rem;
    font-size: 0.75rem;
    color: var(--muted-txt);
    max-width: 500px;
    margin: 0 auto;
  }
  footer b { color: var(--white); }
</style>
