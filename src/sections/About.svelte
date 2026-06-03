<script>
  import { langStore } from '../stores/lang.js';
  $: lang = $langStore;
  const content = {
    en: {
      heading: 'About',
      subheading: 'Where Civil Engineering Meets <em>Data</em>',
      body1: 'My path didn&rsquo;t start in spreadsheets &mdash; it started in <b>structures</b>. A Bachelor of Engineering in <em>Civil Engineering</em> from Kasetsart University taught me how complex systems hold together under pressure, and how a single overlooked detail cascades into real-world consequences.',
      body2: 'That systems thinking translated naturally into <b>ERP and business analysis</b>. At Builk One Group, I lead full-cycle implementations of <b>POJJAMAN ERP</b> for <b>10+ clients</b> across construction and project-based industries &mdash; owning every phase from requirements discovery through go-live and post-launch support across <b>8 modules</b>.',
      detail: '10+ Clients · 2+ Years Experience · 8 Modules',
    },
    th: {
      heading: 'เกี่ยวกับ',
      subheading: 'เมื่อวิศวกรรมโยธา พบกับ <em>ข้อมูล</em>',
      body1: 'เส้นทางของผมไม่ได้เริ่มจากตาราง Excel &mdash; แต่เริ่มจาก<b>โครงสร้าง</b> ปริญญาตรีวิศวกรรมศาสตร์สาขา<em>วิศวกรรมโยธา</em>จากมหาวิทยาลัยเกษตรศาสตร์ สอนให้ผมเข้าใจว่าระบบที่ซับซ้อนยึดโยงกันอยู่ได้อย่างไรภายใต้แรงกดดัน และรายละเอียดที่พลาดไปเพียงจุดเดียวอาจส่งผลกระทบต่อโลกจริงได้',
      body2: 'ความคิดเชิงระบบนั้นแปลงตัวเองเข้าสู่โลกของ<b>ERP และการวิเคราะห์ธุรกิจ</b>ได้อย่างเป็นธรรมชาติ ที่ Builk One Group ผมนำการ implement <b>POJJAMAN ERP</b> แบบครบวงจรให้กับลูกค้า<b>กว่า 10 ราย</b>ในอุตสาหกรรมก่อสร้างและงานโครงการ ดูแลทุกขั้นตอนตั้งแต่ discovery ไปจนถึง go-live และ support หลัง launch ครอบคลุม<b>8 โมดูล</b>',
      detail: 'ลูกค้า ERP 10+ ราย · ประสบการณ์ 2+ ปี · 8 โมดูล',
    },
  };
  $: t = content[lang] ?? content.en;
</script>

<section data-scene="1" class="scene scene-about">
  <div class="scene-content">
    <h2 class="section-head">{t.heading}</h2>
    <h3 class="section-subhead">{@html t.subheading}</h3>
    <p class="body-text">{@html t.body1}</p>
    <p class="body-text" style="margin-top: 1rem;">{@html t.body2}</p>
    <p class="detail-tag">{t.detail}</p>
  </div>
</section>

<style>
  .section-head { color: var(--gold); font-size: clamp(1.8rem, 4vw, 3rem); margin-bottom: 0.5rem; }
  .section-subhead { font-size: 1.2rem; color: var(--gold-lt); margin-bottom: 1.5rem; font-weight: 500; }
  .body-text { color: var(--white); font-size: 0.95rem; line-height: 1.75; max-width: 580px; margin: 0 auto; text-align: justify; }
  .detail-tag { margin-top: 2rem; color: var(--gold); font-size: 0.8rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; }
</style>
