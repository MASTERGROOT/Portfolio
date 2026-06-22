export const CONTENT = [
  // Zone 0 — Hero
  {
    label: { en: 'Business Analyst · ERP · Data', th: 'นักวิเคราะห์ธุรกิจ · ERP · ข้อมูล' },
    title: { en: 'Goody Vivitthachai', th: 'วิวิตถ์ชัย ลาภรัตนตระการ' },
    sub:   { en: 'Turning Complex Systems Into Measurable Impact', th: 'เปลี่ยนระบบซับซ้อนสู่ผลลัพธ์ที่วัดได้' },
    body: {
      ctaLinks: [
        { type: 'cv',       label: { en: 'Download CV', th: 'ดาวน์โหลด CV' }, href: '/assets/Vivitthachai_Goody_CV.pdf' },
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
    sub:   { en: 'Bangkok · 8 ERP Modules · 10+ Projects · 2+ Years', th: 'กรุงเทพ · 8 โมดูล ERP · 10+ โครงการ · 2+ ปี' },
    body: {
      stats: [
        { value: { en: '2+',  th: '2+'  }, label: { en: 'YRS',     th: 'ปี'         } },
        { value: { en: '8',   th: '8'   }, label: { en: 'MODULES', th: 'โมดูล'      } },
        { value: { en: '10+', th: '10+' }, label: { en: 'PROJECTS', th: 'โครงการ'   } },
      ],
      bio: {
        en: 'Business Analyst and ERP Implementation Specialist based in Bangkok. Experienced in Oracle NetSuite and SAP S/4HANA full-cycle rollouts across construction, manufacturing, and services.',
        th: 'นักวิเคราะห์ธุรกิจและผู้เชี่ยวชาญด้านการติดตั้ง ERP ตั้งอยู่ในกรุงเทพฯ มีประสบการณ์ด้าน Oracle NetSuite และ SAP S/4HANA แบบครบวงจรในอุตสาหกรรมก่อสร้าง การผลิต และบริการ',
      },
    },
  },

  // Zone 2 — Experience
  {
    label: { en: 'ERP Implementation', th: 'การติดตั้ง ERP' },
    title: { en: 'Experience', th: 'ประสบการณ์' },
    sub:   { en: 'Oracle NetSuite · SAP S/4HANA · Full-cycle rollouts', th: 'Oracle NetSuite · SAP S/4HANA · ติดตั้งครบวงจร' },
    body: {
      roles: [
        {
          title:   { en: 'Business Analyst', th: 'นักวิเคราะห์ธุรกิจ' },
          company: { en: '[REPLACE: Company Name]', th: '[REPLACE: ชื่อบริษัท]' },
          period:  { en: '2023 – Present', th: '2566 – ปัจจุบัน' },
          bullets: {
            en: [
              'Led Oracle NetSuite full-cycle ERP implementation across 8 modules',
              'Designed process flows, conducted UAT, and trained 50+ end users',
            ],
            th: [
              'นำการติดตั้ง Oracle NetSuite แบบครบวงจร 8 โมดูล',
              'ออกแบบ process flows ทำ UAT และอบรมผู้ใช้งาน 50+ คน',
            ],
          },
        },
        {
          title:   { en: 'ERP Implementation Consultant', th: 'ที่ปรึกษาการติดตั้ง ERP' },
          company: { en: '[REPLACE: Company Name]', th: '[REPLACE: ชื่อบริษัท]' },
          period:  { en: '2022 – 2023', th: '2565 – 2566' },
          bullets: {
            en: [
              'Implemented SAP S/4HANA modules for manufacturing client',
              'Reduced manual reporting time by 40% through process automation',
            ],
            th: [
              'ติดตั้งโมดูล SAP S/4HANA สำหรับลูกค้าในอุตสาหกรรมการผลิต',
              'ลดเวลารายงานด้วยมือลง 40% ผ่านระบบอัตโนมัติ',
            ],
          },
        },
      ],
    },
  },

  // Zone 3 — Skills
  {
    label: { en: 'Technical Skills', th: 'ทักษะเทคนิค' },
    title: { en: 'Skills', th: 'ทักษะ' },
    sub:   { en: 'Data Analysis · ERP · Process Design · SQL', th: 'วิเคราะห์ข้อมูล · ERP · ออกแบบกระบวนการ · SQL' },
    body: {
      categories: [
        {
          name:   { en: 'ERP Systems', th: 'ระบบ ERP' },
          skills: ['Oracle NetSuite', 'SAP S/4HANA', 'SAP Business One'],
        },
        {
          name:   { en: 'Data & Analytics', th: 'ข้อมูลและการวิเคราะห์' },
          skills: ['SQL', 'Python', 'Power BI', 'Excel (Advanced)', 'Tableau'],
        },
        {
          name:   { en: 'Process & BA', th: 'กระบวนการและ BA' },
          skills: ['Business Process Modeling', 'UAT', 'Gap Analysis', 'BPMN', 'Agile'],
        },
        {
          name:   { en: 'Technical', th: 'เทคนิค' },
          skills: ['JavaScript', 'HTML/CSS', 'Bash', 'Git', 'Docker'],
        },
      ],
    },
  },

  // Zone 4 — Work
  {
    label: { en: 'Selected Projects', th: 'โครงการที่เลือก' },
    title: { en: 'Work', th: 'ผลงาน' },
    sub:   { en: 'ERP Systems · Dashboards · Construction Tech', th: 'ระบบ ERP · แดชบอร์ด · เทคโนโลยีก่อสร้าง' },
    body: {
      projects: [
        {
          title: { en: '[REPLACE: Project Name]', th: '[REPLACE: ชื่อโครงการ]' },
          desc:  { en: 'Oracle NetSuite full-cycle implementation — finance, inventory, and procurement modules.', th: 'ติดตั้ง Oracle NetSuite ครบวงจร — โมดูลการเงิน คลังสินค้า และการจัดซื้อ' },
          tags:  ['NetSuite', 'ERP', 'Finance'],
        },
        {
          title: { en: '[REPLACE: Project Name]', th: '[REPLACE: ชื่อโครงการ]' },
          desc:  { en: 'Executive Power BI dashboard consolidating multi-source operational KPIs in real-time.', th: 'แดชบอร์ด Power BI สำหรับผู้บริหาร รวม KPI ปฏิบัติการจากหลายแหล่งข้อมูลแบบ real-time' },
          tags:  ['Power BI', 'SQL', 'Data'],
        },
        {
          title: { en: '[REPLACE: Project Name]', th: '[REPLACE: ชื่อโครงการ]' },
          desc:  { en: 'Construction project management platform integrating ERP with site operations tracking.', th: 'แพลตฟอร์มบริหารโครงการก่อสร้างที่เชื่อมต่อ ERP กับการติดตามสถานที่ก่อสร้าง' },
          tags:  ['Construction', 'Integration', 'Tech'],
        },
      ],
    },
  },

  // Zone 5 — Education
  {
    label: { en: 'Academic Background', th: 'การศึกษา' },
    title: { en: 'Education', th: 'การศึกษา' },
    sub:   { en: 'Chulalongkorn University · Civil Engineering', th: 'จุฬาลงกรณ์มหาวิทยาลัย · วิศวกรรมโยธา' },
    body: {
      degree: {
        institution: { en: 'Chulalongkorn University', th: 'จุฬาลงกรณ์มหาวิทยาลัย' },
        field:       { en: 'Civil Engineering', th: 'วิศวกรรมโยธา' },
        level:       { en: "Bachelor's Degree", th: 'ปริญญาตรี' },
        year:        { en: '[REPLACE: Year]', th: '[REPLACE: ปี]' },
        honors:      { en: '[REPLACE: Honors or leave empty string]', th: '' },
      },
    },
  },

  // Zone 6 — Certifications
  {
    label: { en: 'Certifications', th: 'ใบรับรอง' },
    title: { en: 'Certified', th: 'การรับรอง' },
    sub:   { en: 'Oracle NetSuite Admin · SAP S/4HANA', th: 'Oracle NetSuite Admin · SAP S/4HANA' },
    body: {
      certs: [
        {
          name:   { en: 'Oracle NetSuite Administrator', th: 'Oracle NetSuite Administrator' },
          issuer: { en: 'Oracle', th: 'Oracle' },
          year:   { en: '[REPLACE: Year]', th: '[REPLACE: ปี]' },
        },
        {
          name:   { en: 'SAP Certified Application Associate — SAP S/4HANA', th: 'SAP Certified Application Associate — SAP S/4HANA' },
          issuer: { en: 'SAP', th: 'SAP' },
          year:   { en: '[REPLACE: Year]', th: '[REPLACE: ปี]' },
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
      cv:       '/assets/Vivitthachai_Goody_CV.pdf',
      status:   { en: 'Available for freelance', th: 'พร้อมรับงาน freelance' },
    },
  },
];
