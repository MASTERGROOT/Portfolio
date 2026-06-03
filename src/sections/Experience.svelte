<script>
  import { langStore } from '../stores/lang.js';
  $: lang = $langStore;
  const content = {
    en: {
      heading: 'Experience',
      subheading: 'Roles That Shaped the Method',
      cert1: 'Google Data Analytics Professional Certificate',
      cert2: 'TOEIC 790 · Professional Working Proficiency',
    },
    th: {
      heading: 'ประสบการณ์',
      subheading: 'ประสบการณ์ที่หล่อหลอมแนวทางการทำงาน',
      cert1: 'Google Data Analytics Professional Certificate',
      cert2: 'TOEIC 790 · ระดับใช้งานได้อย่างมืออาชีพ',
    },
  };
  $: t = content[lang] ?? content.en;

  const items = [
    {
      year: { en: 'Apr 2024 — Present', th: 'เม.ย. 2567 — ปัจจุบัน' },
      loc: { en: 'Builk One Group · POJJAMAN ERP · Bangkok', th: 'Builk One Group · POJJAMAN ERP · กรุงเทพฯ' },
      title: { en: 'Business Analyst', th: 'นักวิเคราะห์ธุรกิจ' },
      subtitle: { en: 'ERP Implementation', th: 'ผู้ Implement ERP' },
      desc: {
        en: 'Led full-cycle ERP implementation for 10+ clients in the construction and project-based sector, owning every phase from requirements discovery through go-live and post-launch support across 8 modules. Ran stakeholder workshops with C-level executives, delivered AS-IS/TO-BE documentation, and served as primary liaison between client operations and the development team.',
        th: 'นำการ implement ERP แบบครบวงจรให้กับลูกค้ากว่า 10 รายในอุตสาหกรรมก่อสร้างและงานโครงการ ดูแลทุกขั้นตอนตั้งแต่ discovery ไปจนถึง go-live และ post-launch support ครอบคลุม 8 โมดูล จัดทำ stakeholder workshops กับผู้บริหาร C-level ส่งมอบเอกสาร AS-IS/TO-BE และทำหน้าที่เป็นตัวกลางระหว่างฝ่าย operations ของลูกค้าและทีม development'
      }
    },
    {
      year: { en: 'May 2023 — Sep 2023', th: 'พ.ค. 2566 — ก.ย. 2566' },
      loc: { en: 'Busch Gardens Williamsburg · Virginia, USA', th: 'Busch Gardens Williamsburg · เวอร์จิเนีย สหรัฐอเมริกา' },
      title: { en: 'Ride Operator', th: 'Ride Operator' },
      subtitle: { en: 'Work & Travel', th: 'Work & Travel' },
      desc: {
        en: 'Operated ride control systems and enforced safety protocols in a high-volume, multilingual environment serving thousands of international guests daily — maintaining zero safety violations across a 5-month contract.',
        th: 'ควบคุมระบบ ride และบังคับใช้มาตรการความปลอดภัยในสภาพแวดล้อมที่ต้องรองรับนักท่องเที่ยวนับพันคนต่อวันจากหลากหลายภาษา — รักษาสถิติไม่มีการฝ่าฝืนกฎความปลอดภัยตลอด 5 เดือนของสัญญา'
      }
    },
    {
      year: { en: 'Apr 2022 — Jun 2022', th: 'เม.ย. 2565 — มิ.ย. 2565' },
      loc: { en: 'Visavapat Co., Ltd. · Bangkok, Thailand', th: 'บริษัท วิสาวภัทร จำกัด · กรุงเทพฯ ประเทศไทย' },
      title: { en: 'Site Engineer Intern', th: 'นักศึกษาฝึกงาน วิศวกรโยธา' },
      subtitle: { en: 'Civil', th: 'โยธา' },
      desc: {
        en: 'Supervised building construction workflow and quality control, coordinated with foreman teams, and performed material quantity take-offs, cost estimation, and shop-drawing review against engineering standards.',
        th: 'ควบคุมงานก่อสร้างและตรวจสอบคุณภาพ ประสานงานกับทีมโฟร์แมน ถอดแบบปริมาณวัสดุ ประมาณราคา และตรวจสอบ shop drawing ตามมาตรฐานวิศวกรรม'
      }
    }
  ];
</script>

<section data-scene="5" class="scene scene-experience">
  <div class="scene-content">
    <h2 class="section-head">{t.heading}</h2>
    <h3 class="section-subheading">{t.subheading}</h3>
    <div class="timeline">
      {#each items as item}
        <div class="timeline-item">
          <div class="timeline-meta">
            <span class="timeline-year">{lang === 'th' ? item.year.th : item.year.en}</span>
            <span class="timeline-loc">{lang === 'th' ? item.loc.th : item.loc.en}</span>
          </div>
          <div class="timeline-body">
            <h4>
              {lang === 'th' ? item.title.th : item.title.en}
              <span class="slash-sub">/ {lang === 'th' ? item.subtitle.th : item.subtitle.en}</span>
            </h4>
            <p>{lang === 'th' ? item.desc.th : item.desc.en}</p>
          </div>
        </div>
      {/each}
    </div>
    <div class="cert-row">
      <span class="cert-pill"><span class="dot"></span> {t.cert1}</span>
      <span class="cert-pill"><span class="dot"></span> {t.cert2}</span>
    </div>
  </div>
</section>

<style>
  .section-head { color: var(--gold); font-size: clamp(1.8rem, 4vw, 3rem); margin-bottom: 0.5rem; }
  .section-subheading { font-size: 1.1rem; color: var(--muted-txt); margin-bottom: 2rem; letter-spacing: 0.1em; text-transform: uppercase; }
  .timeline {
    max-width: 650px;
    margin: 0 auto;
    text-align: left;
    border-left: 1px solid var(--muted);
    padding-left: 1.5rem;
  }
  .timeline-item {
    position: relative;
    margin-bottom: 2rem;
  }
  .timeline-item::before {
    content: '';
    position: absolute;
    left: -1.85rem;
    top: 0.25rem;
    width: 0.6rem;
    height: 0.6rem;
    background: var(--gold);
    border-radius: 50%;
  }
  .timeline-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: var(--muted-txt);
    margin-bottom: 0.4rem;
  }
  .timeline-year { font-weight: 600; color: var(--gold-lt); }
  .timeline-body h4 { font-size: 1.05rem; color: var(--white); margin-bottom: 0.5rem; }
  .slash-sub { color: var(--gold-lt); font-weight: 400; font-style: italic; font-size: 0.9rem; }
  .timeline-body p { font-size: 0.85rem; color: var(--white); line-height: 1.6; text-align: justify; }
  .cert-row {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
    flex-wrap: wrap;
  }
  .cert-pill {
    background: rgba(26, 26, 26, 0.6);
    border: 1px solid var(--muted);
    padding: 0.4rem 0.8rem;
    font-size: 0.75rem;
    color: var(--white);
    border-radius: 0.25rem;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }
  .dot {
    width: 0.4rem;
    height: 0.4rem;
    background: var(--gold);
    border-radius: 50%;
    display: inline-block;
  }
  @media (max-width: 576px) {
    .timeline-meta { flex-direction: column; gap: 0.2rem; }
  }
</style>
