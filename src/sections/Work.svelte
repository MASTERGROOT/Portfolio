<script>
  import { langStore } from '../stores/lang.js';
  $: lang = $langStore;
  const content = {
    en: {
      heading: 'Selected Works',
      subheading: 'Work That Moved the Needle',
      viewCase: 'View Case',
    },
    th: {
      heading: 'ผลงานที่เลือกสรร',
      subheading: 'งานที่สร้างความเปลี่ยนแปลงจริง',
      viewCase: 'ดูรายละเอียด',
    },
  };
  $: t = content[lang] ?? content.en;

  const projects = [
    {
      num: '01',
      title: { en: 'POJJAMAN ERP Rollout', th: 'การ Rollout POJJAMAN ERP' },
      tags: { en: ['Construction', '8 Modules'], th: ['การก่อสร้าง', '8 โมดูล'] },
      desc: {
        en: 'Led full-cycle ERP implementation for 10+ construction & project-based clients &mdash; owning every phase from discovery through go-live and post-launch support.',
        th: 'นำการ implement ERP แบบครบวงจรให้กับลูกค้าในอุตสาหกรรมก่อสร้างกว่า 10 ราย ดูแลทุกขั้นตอนตั้งแต่ discovery จนถึง go-live และ post-launch support'
      }
    },
    {
      num: '02',
      title: { en: 'Centralized Data Architecture', th: 'สถาปัตยกรรมข้อมูลแบบรวมศูนย์' },
      tags: { en: ['Process Design', 'SOPs'], th: ['การออกแบบกระบวนการ', 'SOP'] },
      desc: {
        en: 'Consolidated all business processes into a single ERP database, producing SOPs and system flow diagrams adopted as permanent operational references.',
        th: 'รวมกระบวนการทางธุรกิจทั้งหมดเข้าสู่ฐานข้อมูล ERP เดียว พร้อมจัดทำ SOP และแผนผังระบบที่กลายเป็นเอกสารอ้างอิงถาวร'
      }
    },
    {
      num: '03',
      title: { en: 'AS-IS / TO-BE Process Mapping', th: 'การทำ Process Mapping AS-IS / TO-BE' },
      tags: { en: ['Workshops', 'Gap Analysis'], th: ['Workshop', 'Gap Analysis'] },
      desc: {
        en: 'Ran requirements workshops with C-level executives; delivered process documentation that became the configuration baseline for each deployment.',
        th: 'จัดทำ requirements workshops กับผู้บริหารระดับ C พร้อมส่งมอบเอกสารกระบวนการที่กลายเป็นพื้นฐานการตั้งค่าระบบในทุก deployment'
      }
    },
    {
      num: '04',
      title: { en: 'Steel Building Stability Analysis', th: 'การวิเคราะห์เสถียรภาพอาคารเหล็ก' },
      tags: { en: ['Graduate Research', 'STAAD Pro + ABAQUS'], th: ['วิจัยปริญญาตรี', 'STAAD Pro + ABAQUS'] },
      desc: {
        en: 'Modeled multi-story steel-frame stability and validated design-efficiency benchmarks against computational results &mdash; awarded a Graduate Project Award.',
        th: 'สร้างแบบจำลองเสถียรภาพโครงสร้างเหล็กหลายชั้นและตรวจสอบประสิทธิภาพการออกแบบด้วย STAAD Pro + ABAQUS — ได้รับรางวัล Graduate Project Award'
      }
    }
  ];
</script>

<section data-scene="4" class="scene scene-work">
  <div class="scene-content">
    <h2 class="section-head">{t.heading}</h2>
    <h3 class="section-subheading">{t.subheading}</h3>
    <div class="proj-grid">
      {#each projects as proj}
        <div class="proj-card">
          <div class="proj-top">
            <span class="proj-num">[ {proj.num} ]</span>
            <div class="proj-tags">
              {#each (lang === 'th' ? proj.tags.th : proj.tags.en) as tag}
                <span class="proj-tag">{tag}</span>
              {/each}
            </div>
          </div>
          <h4>{lang === 'th' ? proj.title.th : proj.title.en}</h4>
          <p class="proj-desc">{@html (lang === 'th' ? proj.desc.th : proj.desc.en)}</p>
          <a href="#" class="proj-link" aria-disabled="true" tabindex="-1">
            {t.viewCase} <span class="arrow">→</span>
          </a>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .section-head { color: var(--gold); font-size: clamp(1.8rem, 4vw, 3rem); margin-bottom: 0.5rem; }
  .section-subheading { font-size: 1.1rem; color: var(--muted-txt); margin-bottom: 2rem; letter-spacing: 0.1em; text-transform: uppercase; }
  .proj-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    max-width: 750px;
    margin: 0 auto;
  }
  .proj-card {
    background: rgba(26, 26, 26, 0.6);
    border: 1px solid var(--muted);
    border-radius: 0.5rem;
    padding: 1.5rem;
    text-align: left;
    display: flex;
    flex-direction: column;
  }
  .proj-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  .proj-num { font-size: 0.8rem; color: var(--gold-lt); font-family: monospace; }
  .proj-tags { display: flex; gap: 0.5rem; }
  .proj-tag {
    font-size: 0.7rem;
    color: var(--muted-txt);
    background: rgba(255, 255, 255, 0.03);
    padding: 0.1rem 0.4rem;
    border-radius: 0.2rem;
  }
  .proj-card h4 { font-size: 1.05rem; color: var(--white); margin-bottom: 0.75rem; }
  .proj-desc { font-size: 0.85rem; color: var(--muted-txt); line-height: 1.6; margin-bottom: 1.5rem; flex-grow: 1; text-align: justify; }
  .proj-link {
    font-size: 0.8rem;
    color: var(--gold);
    text-decoration: none;
    pointer-events: none;
    opacity: 0.5;
  }
  @media (max-width: 576px) {
    .proj-grid { grid-template-columns: 1fr; }
  }
</style>
