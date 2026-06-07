<script>
  import { langStore } from '../stores/lang.js';
  $: lang = $langStore;
  const content = {
    en: {
      heading: 'Skills',
      subheading: 'Full-Stack Business Intelligence',
      cat1: 'ERP & Implementation',
      cat2: 'Business Analysis',
      cat3: 'Data & Analytics',
      cat4: 'Tooling & Domain',
    },
    th: {
      heading: 'ทักษะ',
      subheading: 'ความสามารถวิเคราะห์ธุรกิจครบวงจร',
      cat1: 'ERP & การตั้งค่าระบบ',
      cat2: 'การวิเคราะห์ธุรกิจ',
      cat3: 'ข้อมูลและการวิเคราะห์',
      cat4: 'เครื่องมือและโดเมน',
    },
  };
  $: t = content[lang] ?? content.en;

  const skills = {
    cat1: [
      { en: 'POJJAMAN ERP', th: 'POJJAMAN ERP' },
      { en: '8-Module Configuration', th: 'การตั้งค่า 8 โมดูล' },
      { en: 'UAT', th: 'UAT (ทดสอบระบบ)' },
      { en: 'Go-live & Support', th: 'Go-live & การซัพพอร์ต' },
      { en: 'SOP Development', th: 'การพัฒนาคู่มือ SOP' },
    ],
    cat2: [
      { en: 'Requirements Gathering', th: 'การเก็บความต้องการ' },
      { en: 'AS-IS / TO-BE Mapping', th: 'การทำแผนผังกระบวนการ' },
      { en: 'Gap Analysis', th: 'การวิเคราะห์ช่องว่าง' },
      { en: 'Stakeholder Management', th: 'การจัดการผู้มีส่วนได้เสีย' },
      { en: 'Change Management', th: 'การบริหารการเปลี่ยนแปลง' },
    ],
    cat3: [
      { en: 'SQL', th: 'SQL' },
      { en: 'Python', th: 'Python' },
      { en: 'Power BI', th: 'Power BI' },
      { en: 'Excel (Advanced)', th: 'Excel ขั้นสูง' },
      { en: 'Dashboard Design', th: 'การออกแบบ Dashboard' },
    ],
    cat4: [
      { en: 'Xtra Report Designer', th: 'Xtra Report Designer' },
      { en: 'JIRA', th: 'JIRA' },
      { en: 'Confluence', th: 'Confluence' },
      { en: 'AutoCAD', th: 'AutoCAD' },
      { en: 'Finance Ops (AP/AR/Tax)', th: 'การเงิน (AP/AR/ภาษี)' },
    ],
  };
</script>

<section data-scene="3" class="scene scene-skills">
  <div class="scene-content">
    <h2 class="section-head">{t.heading}</h2>
    <h3 class="section-subheading">{t.subheading}</h3>
    <div class="skills-grid">
      <div class="skill-card">
        <div class="card-num">I</div>
        <h4>{t.cat1}</h4>
        <div class="tags-container">
          {#each skills.cat1 as sk}
            <span class="tag">{lang === 'th' ? sk.th : sk.en}</span>
          {/each}
        </div>
      </div>
      <div class="skill-card">
        <div class="card-num">II</div>
        <h4>{t.cat2}</h4>
        <div class="tags-container">
          {#each skills.cat2 as sk}
            <span class="tag">{lang === 'th' ? sk.th : sk.en}</span>
          {/each}
        </div>
      </div>
      <div class="skill-card">
        <div class="card-num">III</div>
        <h4>{t.cat3}</h4>
        <div class="tags-container">
          {#each skills.cat3 as sk}
            <span class="tag">{lang === 'th' ? sk.th : sk.en}</span>
          {/each}
        </div>
      </div>
      <div class="skill-card">
        <div class="card-num">IV</div>
        <h4>{t.cat4}</h4>
        <div class="tags-container">
          {#each skills.cat4 as sk}
            <span class="tag">{lang === 'th' ? sk.th : sk.en}</span>
          {/each}
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .section-head { color: var(--gold); font-size: clamp(1.8rem, 4vw, 3rem); margin-bottom: 0.5rem; }
  .section-subheading { font-size: 1.1rem; color: var(--muted-txt); margin-bottom: 2rem; letter-spacing: 0.1em; text-transform: uppercase; }
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    max-width: 750px;
    margin: 0 auto;
  }
  .skill-card {
    background: rgba(26, 26, 26, 0.6);
    border: 1px solid var(--muted);
    border-radius: 0.5rem;
    padding: 1.5rem;
    text-align: left;
    position: relative;
    transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
    cursor: default;
  }
  .skill-card:hover {
    transform: translateY(-6px);
    border-color: var(--gold-lt);
    box-shadow: 0 8px 32px rgba(212, 175, 55, 0.12);
  }
  .card-num {
    position: absolute;
    top: 1rem;
    right: 1.2rem;
    font-size: 1.1rem;
    color: rgba(201, 168, 76, 0.2);
    font-weight: 700;
  }
  .skill-card h4 { font-size: 1.05rem; color: var(--gold-lt); margin-bottom: 1rem; font-weight: 600; }
  .tags-container { display: flex; flex-wrap: wrap; gap: 0.5rem; }
  .tag {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--white);
    padding: 0.2rem 0.5rem;
    font-size: 0.75rem;
    border-radius: 0.25rem;
  }
  @media (max-width: 576px) {
    .skills-grid { grid-template-columns: 1fr; }
  }
</style>
