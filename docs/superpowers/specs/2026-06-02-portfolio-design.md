# Portfolio Website — Design Spec
**Date:** 2026-06-02  
**Status:** Approved

---

## Overview

Single-page personal portfolio for Vivitthachai "Goody" Laprattanatrai, hosted on GitHub Pages at `mastergroot.github.io`. Plain HTML + CSS + vanilla JS. No build step, no frameworks, opens directly in browser.

The visual design comes from the Claude.ai/design handoff (`Goody Portfolio.html`) — cinematic dark-gold aesthetic. This spec adds **bilingual EN/TH support** on top of that design and defines the production file structure.

---

## File Structure

```
/                              ← repo root (GitHub Pages serves from here)
├── index.html
├── style.css
├── script.js
├── assets/
│   └── Vivitthachai_Goody_CV.pdf
├── docs/
│   └── superpowers/specs/     ← this file
└── README.md
```

Source of truth for all HTML/CSS design values: `design_handoff_portfolio/Goody Portfolio.html` (keep in repo for reference, not served).

---

## Design Tokens (from handoff — do not change)

| Token | Value |
|---|---|
| `--bg` | `#0a0a0a` |
| `--bg-warm` | `#0f0b06` |
| `--bg-warm-2` | `#120e07` |
| `--gold` | `#D4A017` |
| `--gold-lt` | `#F5C842` |
| `--warm-white` | `#F5F0E8` |
| `--muted` | `#4a3f2a` |
| `--muted-txt` | `#9a8f7a` |

**Fonts:** Cormorant Garamond (serif headings) + Inter (body/UI) + **Sarabun** (Thai script support) — all via Google Fonts CDN. Sarabun covers Latin too so it acts as the Thai-active body font without breaking the existing stack.

---

## Sections (DOM order)

0. Navbar (fixed)  
1. Hero  
2. About  
3. Skills / Capabilities  
4. Projects / Selected Works  
5. Experience  
6. Education  
7. Credentials  
8. Contact  
9. Footer  

Full layout, spacing, animation, and hover specs are in the handoff README. Recreate pixel-for-pixel.

---

## Bilingual Support

### Mechanism

Every visible text node is wrapped in a `<span>` carrying both languages:

```html
<span data-en="Turning Complex Systems" data-th="เปลี่ยนระบบที่ซับซ้อน"></span>
```

`innerText` is set from the active language on page load. The toggle swaps all elements.

```js
function setLang(lang) {
  document.querySelectorAll('[data-en]').forEach(el => {
    el.innerText = el.dataset[lang];
  });
  document.documentElement.lang = lang === 'th' ? 'th' : 'en';
  localStorage.setItem('lang', lang);
}
```

On load: read `localStorage.getItem('lang')` — default `'en'` if unset.

### Toggle Button

- Placed at the right end of the navbar links
- Pill style: `border: 1px solid var(--muted)`, `border-radius: 100px`, padding `4px 12px`
- Label: `EN | TH` — the active language segment is `var(--gold-lt)`, inactive is `var(--muted-txt)`
- Clicking the whole pill cycles EN → TH → EN

### Font Switching

When TH is active, `body` gains class `lang-th`. In CSS:

```css
body.lang-th {
  font-family: 'Sarabun', 'Inter', system-ui, sans-serif;
}
```

Cormorant Garamond headings keep their serif style in EN; in TH they gracefully fall back to Sarabun (Thai has no equivalent serif display font at this weight — acceptable).

---

## Thai Translations — Full Content

### Navbar
| EN | TH |
|---|---|
| Goody. | Goody. |
| 01 About | 01 เกี่ยวกับ |
| 02 Skills | 02 ทักษะ |
| 03 Work | 03 ผลงาน |
| 04 Experience | 04 ประสบการณ์ |
| 05 Contact | 05 ติดต่อ |

### Hero
| EN | TH |
|---|---|
| BUSINESS ANALYST · ERP IMPLEMENTATION SPECIALIST · DATA ANALYST | นักวิเคราะห์ธุรกิจ · ผู้เชี่ยวชาญ ERP · นักวิเคราะห์ข้อมูล |
| Turning Complex Systems | เปลี่ยนระบบที่ซับซ้อน |
| Into Measurable Impact | ให้กลายเป็นผลลัพธ์ที่วัดได้ |
| "Goody" Vivitthachai Laprattanatrai | "Goody" Vivitthachai Laprattanatrai |
| Business Analyst & ERP Implementation Specialist based in Bangkok, delivering full-cycle ERP rollouts for construction and project-based organizations. | นักวิเคราะห์ธุรกิจและผู้เชี่ยวชาญ ERP ประจำกรุงเทพฯ ดูแลการ implement ERP แบบครบวงจรสำหรับองค์กรก่อสร้างและงานโครงการ |
| View My Work → | ดูผลงาน → |
| Download CV ↓ | ดาวน์โหลด CV ↓ |
| SCROLL | เลื่อนลง |

### About
| EN | TH |
|---|---|
| ABOUT | เกี่ยวกับ |
| Where Civil Engineering Meets Data | เมื่อวิศวกรรมโยธา พบกับข้อมูล |
| Para 1: I started in... (full bio para) | ผมเริ่มต้นจากวิศวกรรมโยธา — ฝึกฝนการคิดเชิงระบบ วิเคราะห์ข้อมูล และแก้ปัญหาที่ซับซ้อนในโลกจริง |
| Para 2: That foundation... | รากฐานนั้นพาผมมาสู่โลกของ ERP และการวิเคราะห์ธุรกิจ ที่ซึ่งทักษะทางวิศวกรรมกลายเป็นความได้เปรียบในการทำความเข้าใจกระบวนการและแปลงความต้องการให้เป็นระบบที่ใช้งานได้จริง |
| Para 3: Today I work... | ปัจจุบันผมทำงานที่ Builk One Group ดูแลการ implement POJJAMAN ERP ให้กับลูกค้าในอุตสาหกรรมก่อสร้างกว่า 10 ราย ครอบคลุม 8 โมดูล ตั้งแต่ช่วง discovery ไปจนถึง go-live และ post-launch support |
| 10+ ERP Clients | ลูกค้า ERP 10+ ราย |
| 2+ Years BA Experience | ประสบการณ์ BA 2+ ปี |
| 8 ERP Modules | ERP 8 โมดูล |
| Bangkok, Thailand | กรุงเทพฯ ประเทศไทย |
| Open to Remote | พร้อมทำงาน Remote |

### Skills
| EN | TH |
|---|---|
| CAPABILITIES | ความสามารถ |
| Full-Stack Business Intelligence | ความสามารถวิเคราะห์ธุรกิจแบบครบวงจร |
| ERP & Implementation | ERP และการ Implement |
| Business Analysis | การวิเคราะห์ธุรกิจ |
| Data & Analytics | ข้อมูลและการวิเคราะห์ |
| Tooling & Domain | เครื่องมือและความเชี่ยวชาญ |
| (all skill tag chips get data-en/data-th) | (แต่ละ tag มี data-th ตรงกัน) |

Skill tag translations:
| EN | TH |
|---|---|
| POJJAMAN ERP | POJJAMAN ERP |
| 8-Module Configuration | การตั้งค่า 8 โมดูล |
| UAT | UAT |
| Go-live & Support | Go-live และ Support |
| SOP Development | การพัฒนา SOP |
| Requirements Gathering | การรวบรวมความต้องการ |
| AS-IS / TO-BE Mapping | การทำ AS-IS / TO-BE |
| Gap Analysis | Gap Analysis |
| Stakeholder Management | การจัดการผู้มีส่วนได้เสีย |
| Change Management | การบริหารการเปลี่ยนแปลง |
| SQL | SQL |
| Python | Python |
| Power BI | Power BI |
| Excel (Advanced) | Excel (ขั้นสูง) |
| Dashboard Design | การออกแบบ Dashboard |
| Xtra Report Designer | Xtra Report Designer |
| JIRA | JIRA |
| Confluence | Confluence |
| AutoCAD | AutoCAD |
| Finance Ops (AP/AR/Tax) | การเงิน (AP/AR/ภาษี) |

### Projects
| EN | TH |
|---|---|
| SELECTED WORKS | ผลงานที่เลือกสรร |
| Work That Moved the Needle | งานที่สร้างความเปลี่ยนแปลงจริง |
| POJJAMAN ERP Rollout | การ Rollout POJJAMAN ERP |
| Centralized Data Architecture | สถาปัตยกรรมข้อมูลแบบรวมศูนย์ |
| AS-IS / TO-BE Process Mapping | การทำ Process Mapping AS-IS / TO-BE |
| Steel Building Stability Analysis | การวิเคราะห์เสถียรภาพอาคารเหล็ก |
| Construction | การก่อสร้าง |
| 8 Modules | 8 โมดูล |
| Process Design | การออกแบบกระบวนการ |
| SOPs | SOP |
| Workshops | Workshop |
| Graduate Research | วิจัยปริญญาตรี |
| Led full-cycle ERP implementation for 10+ construction & project-based clients... | นำการ implement ERP แบบครบวงจรให้กับลูกค้าในอุตสาหกรรมก่อสร้างกว่า 10 ราย ดูแลทุกขั้นตอนตั้งแต่ discovery จนถึง go-live และ post-launch support |
| Consolidated all business processes into a single ERP database... | รวมกระบวนการทางธุรกิจทั้งหมดเข้าสู่ฐานข้อมูล ERP เดียว พร้อมจัดทำ SOP และแผนผังระบบที่กลายเป็นเอกสารอ้างอิงถาวร |
| Ran requirements workshops with C-level executives... | จัดทำ requirements workshops กับผู้บริหารระดับ C พร้อมส่งมอบเอกสารกระบวนการที่กลายเป็นพื้นฐานการตั้งค่าระบบในทุก deployment |
| Modeled multi-story steel-frame stability... | สร้างแบบจำลองเสถียรภาพโครงสร้างเหล็กหลายชั้นและตรวจสอบประสิทธิภาพการออกแบบด้วย STAAD Pro + ABAQUS — ได้รับรางวัล Graduate Project Award |
| View Case → | ดูรายละเอียด → |

### Experience
| EN | TH |
|---|---|
| EXPERIENCE | ประสบการณ์ |
| Roles That Shaped the Method | ประสบการณ์ที่หล่อหลอมแนวทางการทำงาน |
| Apr 2024 — Present | เม.ย. 2567 — ปัจจุบัน |
| Business Analyst / ERP Implementation | นักวิเคราะห์ธุรกิจ / ผู้ implement ERP |
| Builk One Group · POJJAMAN ERP · Bangkok | Builk One Group · POJJAMAN ERP · กรุงเทพฯ |
| (role description) | นำการ implement POJJAMAN ERP ให้กับลูกค้ากว่า 10 รายในอุตสาหกรรมก่อสร้าง ครอบคลุม 8 โมดูล จัดทำเอกสาร AS-IS/TO-BE ประสาน dev team และดูแลการ go-live |
| May 2023 — Sep 2023 | พ.ค. 2566 — ก.ย. 2566 |
| Ride Operator / Work & Travel | Ride Operator / Work & Travel |
| Busch Gardens Williamsburg · Virginia, USA | Busch Gardens Williamsburg · เวอร์จิเนีย สหรัฐอเมริกา |
| (role description) | ควบคุมระบบ ride ดูแลความปลอดภัย และสื่อสารกับนักท่องเที่ยว ไม่มีบันทึกการฝ่าฝืนตลอด 5 เดือนของสัญญา |
| Apr 2022 — Jun 2022 | เม.ย. 2565 — มิ.ย. 2565 |
| Site Engineer Intern / Civil | นักศึกษาฝึกงาน วิศวกรโยธา |
| Visavapat Co., Ltd. · Bangkok | บริษัท วิสาวภัทร จำกัด · กรุงเทพฯ |
| (role description) | ติดตามงานก่อสร้าง ควบคุมคุณภาพวัสดุ ถอดแบบ และตรวจสอบแบบก่อสร้าง |
| Google Data Analytics Professional Certificate | Google Data Analytics Professional Certificate |
| TOEIC 790 · Professional Working Proficiency | TOEIC 790 · ระดับใช้งานได้อย่างมืออาชีพ |

### Education
| EN | TH |
|---|---|
| EDUCATION | การศึกษา |
| Engineering Foundations | รากฐานทางวิศวกรรม |
| Bachelor of Engineering, Civil Engineering | วิศวกรรมศาสตรบัณฑิต สาขาวิศวกรรมโยธา |
| Kasetsart University · 2019 — 2023 | มหาวิทยาลัยเกษตรศาสตร์ · 2562 — 2566 |
| (education description) | ศึกษาด้านโครงสร้าง กลศาสตร์วัสดุ และการวิเคราะห์เชิงคำนวณ โครงงานปริญญาตรีเน้นการวิเคราะห์เสถียรภาพโครงเหล็กด้วย STAAD Pro และ ABAQUS |
| GPA 3.03 / 4.00 | เกรดเฉลี่ย 3.03 / 4.00 |
| Graduate Project Award · 2023 | รางวัลโครงงาน ปี 2566 |

### Credentials
| EN | TH |
|---|---|
| CREDENTIALS | วุฒิบัตรและการรับรอง |
| Certified to Deliver | ผ่านการรับรอง พร้อมส่งมอบ |
| Google Data Analytics | Google Data Analytics |
| Google · Professional Certificate | Google · Professional Certificate |
| Data Analysis with Python | การวิเคราะห์ข้อมูลด้วย Python |
| freeCodeCamp · Certified | freeCodeCamp · รับรองแล้ว |
| Scientific Computing with Python | Scientific Computing with Python |
| IBM AI Engineering | IBM AI Engineering |
| IBM · Coursera | IBM · Coursera |
| IBM Data Engineering | IBM Data Engineering |
| On-process | กำลังดำเนินการ |

### Contact
| EN | TH |
|---|---|
| LET'S CONNECT | ติดต่อกัน |
| Ready to Build Something Together? | พร้อมสร้างสิ่งดีๆ ด้วยกันไหม? |
| Open to full-time roles, freelance projects, and ERP consulting engagements. | เปิดรับทั้งงานประจำ งาน freelance และงานที่ปรึกษา ERP |
| Send Email → | ส่งอีเมล → |
| LinkedIn ↗ | LinkedIn ↗ |
| Download CV ↓ | ดาวน์โหลด CV ↓ |

### Footer
| EN | TH |
|---|---|
| © 2026 "Goody" Vivitthachai Laprattanatrai · Bangkok, Thailand · Business Analyst & ERP Implementation Specialist | © 2026 "Goody" Vivitthachai Laprattanatrai · กรุงเทพฯ ประเทศไทย · นักวิเคราะห์ธุรกิจและผู้เชี่ยวชาญ ERP |

---

## Constraints

- Zero npm/build dependencies. Google Fonts CDN only.
- Must open directly from `index.html` (no local server).
- `prefers-reduced-motion: reduce` must disable all animations.
- CV PDF at `assets/Vivitthachai_Goody_CV.pdf`; both "Download CV" buttons link to it.
- Language choice persists in `localStorage` key `'lang'`.
- All git commits: `type(scope): description` format.

---

## Out of Scope

- CMS, contact form backend, analytics
- React/Next.js/Astro migration (future decision)
- Project case study pages (Projects section is placeholder cards for now)
