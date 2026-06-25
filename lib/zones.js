export const TOTAL_DEPTH = 160;

export const ZONES = [
  {
    index: 0,
    zStart: 0,    zEnd: -20,   zMid: -10,
    label: { en: 'Business Analyst · ERP · Data',            th: 'นักวิเคราะห์ธุรกิจ · ERP · ข้อมูล' },
    title: { en: 'Goody Vivitthachai',                       th: 'วิวิธชัย ลาภรัตนไตร' },
    sub:   { en: 'Turning Complex Systems Into Measurable Impact', th: 'เปลี่ยนระบบซับซ้อนสู่ผลลัพธ์ที่วัดได้' },
  },
  {
    index: 1,
    zStart: -20,  zEnd: -35,   zMid: -27,
    label: { en: 'About Me',                                 th: 'เกี่ยวกับฉัน' },
    title: { en: 'About',                                    th: 'ประวัติ' },
    sub:   { en: 'Bangkok · 8 ERP Modules · 10+ ERP Clients · 2+ Years', th: 'กรุงเทพ · 8 โมดูล ERP · ลูกค้า 10+ ราย · 2+ ปี' },
  },
  {
    index: 2,
    zStart: -35,  zEnd: -55,   zMid: -45,
    label: { en: 'Experience',                               th: 'ประสบการณ์' },
    title: { en: 'Experience',                               th: 'ประสบการณ์' },
    sub:   { en: 'Builk One Group · POJJAMAN ERP · Construction', th: 'Builk One Group · POJJAMAN ERP · ก่อสร้าง' },
  },
  {
    index: 3,
    zStart: -55,  zEnd: -70,   zMid: -62,
    label: { en: 'Capabilities',                             th: 'ความสามารถ' },
    title: { en: 'Skills',                                   th: 'ทักษะ' },
    sub:   { en: 'ERP · Business Analysis · Data · Tooling',  th: 'ERP · วิเคราะห์ธุรกิจ · ข้อมูล · เครื่องมือ' },
  },
  {
    index: 4,
    zStart: -70,  zEnd: -90,   zMid: -80,
    label: { en: 'Selected Works',                           th: 'ผลงานที่เลือกสรร' },
    title: { en: 'Work',                                     th: 'ผลงาน' },
    sub:   { en: 'POJJAMAN ERP · Data Architecture · Process Mapping', th: 'POJJAMAN ERP · สถาปัตยกรรมข้อมูล · Process Mapping' },
  },
  {
    index: 5,
    zStart: -90,  zEnd: -105,  zMid: -97,
    label: { en: 'Education',                                th: 'การศึกษา' },
    title: { en: 'Education',                                th: 'การศึกษา' },
    sub:   { en: 'Kasetsart University · Civil Engineering', th: 'มหาวิทยาลัยเกษตรศาสตร์ · วิศวกรรมโยธา' },
  },
  {
    index: 6,
    zStart: -105, zEnd: -120,  zMid: -112,
    label: { en: 'Credentials',                              th: 'วุฒิบัตรและการรับรอง' },
    title: { en: 'Certified',                                th: 'การรับรอง' },
    sub:   { en: 'Google · freeCodeCamp · IBM',              th: 'Google · freeCodeCamp · IBM' },
  },
  {
    index: 7,
    zStart: -120, zEnd: -160,  zMid: -130,
    label: { en: "Let's Build Together",                     th: 'ร่วมสร้างด้วยกัน' },
    title: { en: 'Contact',                                  th: 'ติดต่อ' },
    sub:   { en: 'vivitthachaigood@gmail.com',               th: 'vivitthachaigood@gmail.com' },
  },
];

export function getZoneIndex(progress) {
  return Math.min(Math.floor(progress * 8), 7);
}

