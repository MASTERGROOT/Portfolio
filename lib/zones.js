export const TOTAL_DEPTH = 160;

export const ZONES = [
  {
    index: 0,
    zStart: 0,    zEnd: -20,   zMid: -10,
    label: { en: 'Business Analyst · ERP · Data',            th: 'นักวิเคราะห์ธุรกิจ · ERP · ข้อมูล' },
    title: { en: 'Goody Vivitthachai',                       th: 'วิวิตถ์ชัย ลาภรัตนตระการ' },
    sub:   { en: 'Turning Complex Systems Into Measurable Impact', th: 'เปลี่ยนระบบซับซ้อนสู่ผลลัพธ์ที่วัดได้' },
  },
  {
    index: 1,
    zStart: -20,  zEnd: -35,   zMid: -27,
    label: { en: 'About Me',                                 th: 'เกี่ยวกับฉัน' },
    title: { en: 'About',                                    th: 'ประวัติ' },
    sub:   { en: 'Bangkok · 8 ERP Modules · 10+ Projects · 2+ Years', th: 'กรุงเทพ · 8 โมดูล ERP · 10+ โครงการ · 2+ ปี' },
  },
  {
    index: 2,
    zStart: -35,  zEnd: -55,   zMid: -45,
    label: { en: 'ERP Implementation',                       th: 'การติดตั้ง ERP' },
    title: { en: 'Experience',                               th: 'ประสบการณ์' },
    sub:   { en: 'Oracle NetSuite · SAP S/4HANA · Full-cycle rollouts', th: 'Oracle NetSuite · SAP S/4HANA · ติดตั้งครบวงจร' },
  },
  {
    index: 3,
    zStart: -55,  zEnd: -70,   zMid: -62,
    label: { en: 'Technical Skills',                         th: 'ทักษะเทคนิค' },
    title: { en: 'Skills',                                   th: 'ทักษะ' },
    sub:   { en: 'Data Analysis · ERP · Process Design · SQL', th: 'วิเคราะห์ข้อมูล · ERP · ออกแบบกระบวนการ · SQL' },
  },
  {
    index: 4,
    zStart: -70,  zEnd: -90,   zMid: -80,
    label: { en: 'Selected Projects',                        th: 'โครงการที่เลือก' },
    title: { en: 'Work',                                     th: 'ผลงาน' },
    sub:   { en: 'ERP Systems · Dashboards · Construction Tech', th: 'ระบบ ERP · แดชบอร์ด · เทคโนโลยีก่อสร้าง' },
  },
  {
    index: 5,
    zStart: -90,  zEnd: -105,  zMid: -97,
    label: { en: 'Academic Background',                      th: 'การศึกษา' },
    title: { en: 'Education',                                th: 'การศึกษา' },
    sub:   { en: 'Chulalongkorn University · Civil Engineering', th: 'จุฬาลงกรณ์มหาวิทยาลัย · วิศวกรรมโยธา' },
  },
  {
    index: 6,
    zStart: -105, zEnd: -120,  zMid: -112,
    label: { en: 'Certifications',                           th: 'ใบรับรอง' },
    title: { en: 'Certified',                                th: 'การรับรอง' },
    sub:   { en: 'Oracle NetSuite Admin · SAP S/4HANA',      th: 'Oracle NetSuite Admin · SAP S/4HANA' },
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

