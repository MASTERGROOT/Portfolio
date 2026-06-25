export const CONTENT = [
  // Zone 0 — Hero
  {
    label: { en: 'Business Analyst · ERP · Data', th: 'นักวิเคราะห์ธุรกิจ · ERP · ข้อมูล' },
    title: { en: '"Goody" Vivitthachai', th: '"Goody" วิวิธชัย' },
    sub:   { en: 'Turning Complex Systems Into Measurable Impact', th: 'เปลี่ยนระบบซับซ้อนสู่ผลลัพธ์ที่วัดได้' },
    body: {
      ctaLinks: [
        { type: 'cv',       label: { en: 'Download CV', th: 'ดาวน์โหลด CV' }, href: '/Portfolio/assets/Vivitthachai_Goody_CV.pdf' },
        { type: 'email',    label: { en: 'Email Me', th: 'ส่งอีเมล' },         href: 'mailto:vivitthachaigood@gmail.com' },
        { type: 'linkedin', label: { en: 'LinkedIn', th: 'LinkedIn' },          href: 'https://linkedin.com/in/vivitthachai' },
        { type: 'github',   label: { en: 'GitHub', th: 'GitHub' },              href: 'https://github.com/mastergroot' },
      ],
    },
  },

  // Zone 1 — About
  {
    label: { en: 'About Me', th: 'เกี่ยวกับฉัน' },
    title: { en: 'About', th: 'ประวัติ' },
    sub:   { en: 'Bangkok · 8 ERP Modules · 10+ ERP Clients · 2+ Years', th: 'กรุงเทพ · 8 โมดูล ERP · ลูกค้า 10+ ราย · 2+ ปี' },
    body: {
      stats: [
        { value: { en: '10+', th: '10+' }, label: { en: 'ERP CLIENTS', th: 'ลูกค้า ERP' } },
        { value: { en: '2+',  th: '2+'  }, label: { en: 'YRS BA',      th: 'ปี BA'      } },
        { value: { en: '8',   th: '8'   }, label: { en: 'MODULES',     th: 'โมดูล'      } },
      ],
      bio: {
        en: 'I started in civil engineering — trained in systems thinking, data analysis, and solving real-world complex problems. That foundation led me to ERP and business analysis, where engineering skills became an advantage in understanding processes and translating requirements into working systems. Today I work at Builk One Group implementing POJJAMAN ERP for 10+ construction-industry clients across 8 modules — from discovery through go-live and post-launch support.',
        th: 'ผมเริ่มต้นจากวิศวกรรมโยธา — ฝึกฝนการคิดเชิงระบบ วิเคราะห์ข้อมูล และแก้ปัญหาที่ซับซ้อนในโลกจริง รากฐานนั้นพาผมมาสู่โลกของ ERP และการวิเคราะห์ธุรกิจ ที่ซึ่งทักษะทางวิศวกรรมกลายเป็นความได้เปรียบในการทำความเข้าใจกระบวนการและแปลงความต้องการให้เป็นระบบที่ใช้งานได้จริง ปัจจุบันผมทำงานที่ Builk One Group ดูแลการ implement POJJAMAN ERP ให้กับลูกค้าในอุตสาหกรรมก่อสร้างกว่า 10 ราย ครอบคลุม 8 โมดูล ตั้งแต่ discovery ไปจนถึง go-live และ post-launch support',
      },
    },
  },

  // Zone 2 — Experience
  {
    label: { en: 'Experience', th: 'ประสบการณ์' },
    title: { en: 'Experience', th: 'ประสบการณ์' },
    sub:   { en: 'Builk One Group · POJJAMAN ERP · Construction', th: 'Builk One Group · POJJAMAN ERP · ก่อสร้าง' },
    body: {
      roles: [
        {
          title:   { en: 'Business Analyst / ERP Implementation', th: 'นักวิเคราะห์ธุรกิจ / ผู้ implement ERP' },
          company: { en: 'Builk One Group · POJJAMAN ERP · Bangkok', th: 'Builk One Group · POJJAMAN ERP · กรุงเทพฯ' },
          period:  { en: 'Apr 2024 – Present', th: 'เม.ย. 2567 – ปัจจุบัน' },
          bullets: {
            en: [
              'Led POJJAMAN ERP implementation for 10+ construction-industry clients across 8 modules',
              'Delivered AS-IS / TO-BE documentation and coordinated the development team through go-live',
            ],
            th: [
              'นำการ implement POJJAMAN ERP ให้กับลูกค้ากว่า 10 รายในอุตสาหกรรมก่อสร้าง ครอบคลุม 8 โมดูล',
              'จัดทำเอกสาร AS-IS / TO-BE ประสาน dev team และดูแลการ go-live',
            ],
          },
        },
        {
          title:   { en: 'Ride Operator / Work & Travel', th: 'Ride Operator / Work & Travel' },
          company: { en: 'Busch Gardens Williamsburg · Virginia, USA', th: 'Busch Gardens Williamsburg · เวอร์จิเนีย สหรัฐอเมริกา' },
          period:  { en: 'May 2023 – Sep 2023', th: 'พ.ค. 2566 – ก.ย. 2566' },
          bullets: {
            en: [
              'Operated ride systems and maintained guest safety for international visitors',
              'Zero incidents across the full 5-month contract',
            ],
            th: [
              'ควบคุมระบบ ride และดูแลความปลอดภัยของนักท่องเที่ยวจากนานาชาติ',
              'ไม่มีบันทึกการฝ่าฝืนตลอด 5 เดือนของสัญญา',
            ],
          },
        },
        {
          title:   { en: 'Site Engineer Intern / Civil', th: 'นักศึกษาฝึกงาน วิศวกรโยธา' },
          company: { en: 'Visavapat Co., Ltd. · Bangkok', th: 'บริษัท วิสาวภัทร จำกัด · กรุงเทพฯ' },
          period:  { en: 'Apr 2022 – Jun 2022', th: 'เม.ย. 2565 – มิ.ย. 2565' },
          bullets: {
            en: [
              'Monitored construction progress and controlled material quality',
              'Prepared quantity take-offs and reviewed construction drawings',
            ],
            th: [
              'ติดตามงานก่อสร้างและควบคุมคุณภาพวัสดุ',
              'ถอดแบบและตรวจสอบแบบก่อสร้าง',
            ],
          },
        },
      ],
    },
  },

  // Zone 3 — Skills
  {
    label: { en: 'Capabilities', th: 'ความสามารถ' },
    title: { en: 'Skills', th: 'ทักษะ' },
    sub:   { en: 'ERP · Business Analysis · Data · Tooling', th: 'ERP · วิเคราะห์ธุรกิจ · ข้อมูล · เครื่องมือ' },
    body: {
      categories: [
        {
          name:   { en: 'ERP & Implementation', th: 'ERP และการ Implement' },
          skills: ['POJJAMAN ERP', '8-Module Configuration', 'UAT', 'Go-live & Support', 'SOP Development'],
        },
        {
          name:   { en: 'Business Analysis', th: 'การวิเคราะห์ธุรกิจ' },
          skills: ['Requirements Gathering', 'AS-IS / TO-BE Mapping', 'Gap Analysis', 'Stakeholder Management', 'Change Management'],
        },
        {
          name:   { en: 'Data & Analytics', th: 'ข้อมูลและการวิเคราะห์' },
          skills: ['SQL', 'Python', 'Power BI', 'Excel (Advanced)', 'Dashboard Design'],
        },
        {
          name:   { en: 'Tooling & Domain', th: 'เครื่องมือและความเชี่ยวชาญ' },
          skills: ['Xtra Report Designer', 'JIRA', 'Confluence', 'AutoCAD', 'Finance Ops (AP/AR/Tax)'],
        },
      ],
    },
  },

  // Zone 4 — Work
  {
    label: { en: 'Selected Works', th: 'ผลงานที่เลือกสรร' },
    title: { en: 'Work', th: 'ผลงาน' },
    sub:   { en: 'POJJAMAN ERP · Data Architecture · Process Mapping', th: 'POJJAMAN ERP · สถาปัตยกรรมข้อมูล · Process Mapping' },
    body: {
      projects: [
        {
          title: { en: 'POJJAMAN ERP Rollout', th: 'การ Rollout POJJAMAN ERP' },
          desc:  { en: 'Led full-cycle ERP implementation for 10+ construction & project-based clients across 8 modules — discovery through go-live and post-launch support.', th: 'นำการ implement ERP แบบครบวงจรให้กับลูกค้าในอุตสาหกรรมก่อสร้างกว่า 10 ราย ดูแลทุกขั้นตอนตั้งแต่ discovery จนถึง go-live และ post-launch support' },
          tags:  ['Construction', '8 Modules', 'Go-live'],
        },
        {
          title: { en: 'Centralized Data Architecture', th: 'สถาปัตยกรรมข้อมูลแบบรวมศูนย์' },
          desc:  { en: 'Consolidated all business processes into a single ERP database, delivering SOPs and system diagrams that became permanent reference documents.', th: 'รวมกระบวนการทางธุรกิจทั้งหมดเข้าสู่ฐานข้อมูล ERP เดียว พร้อมจัดทำ SOP และแผนผังระบบที่กลายเป็นเอกสารอ้างอิงถาวร' },
          tags:  ['Process Design', 'SOPs'],
        },
        {
          title: { en: 'AS-IS / TO-BE Process Mapping', th: 'การทำ Process Mapping AS-IS / TO-BE' },
          desc:  { en: 'Ran requirements workshops with C-level executives and delivered process documentation that became the configuration baseline across all deployments.', th: 'จัดทำ requirements workshops กับผู้บริหารระดับ C พร้อมส่งมอบเอกสารกระบวนการที่กลายเป็นพื้นฐานการตั้งค่าระบบใน deployment ทุกครั้ง' },
          tags:  ['Workshops', 'Process Design'],
        },
        {
          title: { en: 'Steel Building Stability Analysis', th: 'การวิเคราะห์เสถียรภาพอาคารเหล็ก' },
          desc:  { en: 'Modeled multi-story steel-frame stability and verified design performance with STAAD Pro + ABAQUS — received Graduate Project Award.', th: 'สร้างแบบจำลองเสถียรภาพโครงสร้างเหล็กหลายชั้นและตรวจสอบประสิทธิภาพการออกแบบด้วย STAAD Pro + ABAQUS — ได้รับรางวัล Graduate Project Award' },
          tags:  ['Graduate Research', 'STAAD Pro', 'ABAQUS'],
        },
      ],
    },
  },

  // Zone 5 — Education
  {
    label: { en: 'Education', th: 'การศึกษา' },
    title: { en: 'Education', th: 'การศึกษา' },
    sub:   { en: 'Kasetsart University · Civil Engineering', th: 'มหาวิทยาลัยเกษตรศาสตร์ · วิศวกรรมโยธา' },
    body: {
      degree: {
        institution: { en: 'Kasetsart University', th: 'มหาวิทยาลัยเกษตรศาสตร์' },
        field:       { en: 'Civil Engineering', th: 'วิศวกรรมโยธา' },
        level:       { en: 'Bachelor of Engineering', th: 'วิศวกรรมศาสตรบัณฑิต' },
        year:        { en: '2019 – 2023', th: '2562 – 2566' },
        honors:      { en: 'GPA 3.03 / 4.00 · Graduate Project Award 2023', th: 'เกรดเฉลี่ย 3.03 / 4.00 · รางวัลโครงงาน ปี 2566' },
      },
    },
  },

  // Zone 6 — Certifications
  {
    label: { en: 'Credentials', th: 'วุฒิบัตรและการรับรอง' },
    title: { en: 'Certified', th: 'การรับรอง' },
    sub:   { en: 'Google · freeCodeCamp · IBM', th: 'Google · freeCodeCamp · IBM' },
    body: {
      certs: [
        {
          name:   { en: 'Google Data Analytics', th: 'Google Data Analytics' },
          issuer: { en: 'Google', th: 'Google' },
          year:   { en: 'Professional Certificate', th: 'Professional Certificate' },
        },
        {
          name:   { en: 'Data Analysis with Python', th: 'การวิเคราะห์ข้อมูลด้วย Python' },
          issuer: { en: 'freeCodeCamp', th: 'freeCodeCamp' },
          year:   { en: 'Certified', th: 'รับรองแล้ว' },
        },
        {
          name:   { en: 'Scientific Computing with Python', th: 'Scientific Computing with Python' },
          issuer: { en: 'freeCodeCamp', th: 'freeCodeCamp' },
          year:   { en: 'Certified', th: 'รับรองแล้ว' },
        },
        {
          name:   { en: 'IBM Data Engineering', th: 'IBM Data Engineering' },
          issuer: { en: 'IBM · Coursera', th: 'IBM · Coursera' },
          year:   { en: 'On-process', th: 'กำลังดำเนินการ' },
        },
      ],
    },
  },

  // Zone 7 — Contact
  {
    label: { en: "Let's Build Together", th: 'ร่วมสร้างด้วยกัน' },
    title: { en: 'Contact', th: 'ติดต่อ' },
    sub:   { en: 'vivitthachaigood@gmail.com', th: 'vivitthachaigood@gmail.com' },
    body: {
      email:    'vivitthachaigood@gmail.com',
      linkedin: 'https://linkedin.com/in/vivitthachai',
      github:   'https://github.com/mastergroot',
      cv:       '/Portfolio/assets/Vivitthachai_Goody_CV.pdf',
      status:   { en: 'Open to full-time, freelance & ERP consulting', th: 'เปิดรับงานประจำ freelance และที่ปรึกษา ERP' },
    },
  },
];
