<script>
  import { langStore } from '../stores/lang.js';
  $: lang = $langStore;
  const content = {
    en: {
      heading: 'Education',
      subheading: 'Engineering Foundations',
      degree: 'Bachelor of Engineering, Civil Engineering',
      school: 'Kasetsart University · 2019 &mdash; 2023',
      body: 'Graduate research on the <em>design for stability of steel buildings</em> &mdash; modeled multi-story steel-frame structures in STAAD Pro and ABAQUS to validate design-efficiency benchmarks. This systems-thinking groundwork later shaped my analytical approach to ERP and data.',
      gpa: 'GPA 3.03 / 4.00',
      award: 'Graduate Project Award · 2023',
    },
    th: {
      heading: 'การศึกษา',
      subheading: 'รากฐานทางวิศวกรรม',
      degree: 'วิศวกรรมศาสตรบัณฑิต สาขาวิศวกรรมโยธา',
      school: 'มหาวิทยาลัยเกษตรศาสตร์ · 2562 &mdash; 2566',
      body: 'งานวิจัยปริญญาตรีว่าด้วย<em>การออกแบบเสถียรภาพของอาคารเหล็ก</em> &mdash; สร้างแบบจำลองโครงเหล็กหลายชั้นใน STAAD Pro และ ABAQUS เพื่อตรวจสอบค่า benchmark ประสิทธิภาพการออกแบบ รากฐานความคิดเชิงระบบที่ต่อมาหล่อหลอมแนวทางวิเคราะห์ด้านข้อมูลและ ERP ของผม',
      gpa: 'เกรดเฉลี่ย 3.03 / 4.00',
      award: 'รางวัลโครงงานดีเด่น · 2566',
    },
  };
  $: t = content[lang] ?? content.en;
</script>

<section data-scene="2" class="scene scene-education">
  <div class="scene-content">
    <h2 class="section-head">{t.heading}</h2>
    <h3 class="section-subheading">{@html t.subheading}</h3>
    <div class="edu-card">
      <div class="edu-mark">CE</div>
      <div class="edu-body">
        <h4>{t.degree}</h4>
        <div class="edu-school">{@html t.school}</div>
        <p class="edu-desc">{@html t.body}</p>
        <div class="edu-stats">
          <span class="stat-pill">{t.gpa}</span>
          <span class="stat-pill">{t.award}</span>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .section-head { color: var(--gold); font-size: clamp(1.8rem, 4vw, 3rem); margin-bottom: 0.5rem; }
  .section-subheading { font-size: 1.1rem; color: var(--muted-txt); margin-bottom: 2rem; letter-spacing: 0.1em; text-transform: uppercase; }
  .edu-card {
    background: rgba(26, 26, 26, 0.6);
    border: 1px solid var(--muted);
    border-radius: 0.5rem;
    padding: 2rem;
    max-width: 600px;
    margin: 0 auto;
    text-align: left;
    display: flex;
    gap: 1.5rem;
    align-items: flex-start;
  }
  .edu-mark {
    background: var(--gold);
    color: var(--dark);
    font-weight: 700;
    font-size: 1.2rem;
    width: 3.5rem;
    height: 3.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.25rem;
    flex-shrink: 0;
  }
  .edu-body h4 { font-size: 1.1rem; color: var(--white); margin-bottom: 0.25rem; }
  .edu-school { font-size: 0.85rem; color: var(--gold-lt); margin-bottom: 1rem; }
  .edu-desc { font-size: 0.9rem; color: var(--white); line-height: 1.6; margin-bottom: 1.5rem; text-align: justify; }
  .edu-stats { display: flex; gap: 0.75rem; flex-wrap: wrap; }
  .stat-pill {
    background: rgba(201, 168, 76, 0.1);
    border: 1px solid rgba(201, 168, 76, 0.3);
    color: var(--gold-lt);
    padding: 0.25rem 0.75rem;
    font-size: 0.8rem;
    border-radius: 1rem;
  }
  @media (max-width: 576px) {
    .edu-card { flex-direction: column; gap: 1rem; }
  }
</style>
