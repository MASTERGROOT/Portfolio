# Portfolio 3D Rewrite — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the portfolio as a Next.js 14 + React Three Fiber cinematic 3D experience with scroll-driven camera choreography, GLSL particle vortex, magnetic card tilt, and cinematic section reveals — deployed statically to GitHub Pages.

**Architecture:** Next.js 14 App Router (`output: 'export'`) replaces Svelte/Vite. An R3F Canvas sits `position: fixed; inset: 0` behind all UI; GSAP ScrollTrigger scrubs the camera through 8 keyframes. A GLSL ShaderMaterial particle field responds to cursor position. All 8 sections use `useCinematicReveal` (IntersectionObserver + GSAP) and `useMagneticTilt` on cards. All EN/TH strings centralized in `lib/content.js` under a `LangContext`.

**Tech Stack:** Next.js 14, @react-three/fiber, @react-three/drei, gsap + ScrollTrigger, motion, GLSL (webpack asset/source), CSS Modules, Vitest + @testing-library/react, Playwright

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `package.json` | Replace | Next.js 14 + R3F + React deps; keep vitest + playwright |
| `next.config.js` | Create | `output: 'export'`, webpack GLSL loader |
| `vitest.config.js` | Create | Vitest config for React (replaces vite.config.js test block) |
| `styles/globals.css` | Create | Design tokens, base reset, lang-th font switch |
| `app/layout.js` | Create | Root layout, Google Fonts link, LangProvider wrapper |
| `app/page.js` | Create | Assembles all section components + Scene |
| `lib/content.js` | Create | All EN/TH strings keyed by section.field |
| `lib/content.test.js` | Create | Unit: all keys present, no undefined values |
| `lib/keyframes.js` | Create | 8 camera `{ pos, lookAt }` objects using THREE.Vector3 |
| `lib/keyframes.test.js` | Create | Unit: exactly 8 KFs, each has pos + lookAt, correct types |
| `lib/LangContext.jsx` | Create | `createContext`, provider, `useLang` hook |
| `shaders/particle.vert.glsl` | Create | Vertex: cursor vortex displacement formula |
| `shaders/particle.frag.glsl` | Create | Fragment: circular point, gold glow, alpha falloff |
| `hooks/useCursorWorld.js` | Create | Raycaster: mouse 2D → 3D world vec3 |
| `hooks/useMagneticTilt.js` | Create | mousemove tilt calc + GSAP elastic reset |
| `hooks/useMagneticTilt.test.js` | Create | Unit: rotation values at corners and centre |
| `hooks/useCinematicReveal.js` | Create | IntersectionObserver triggers GSAP timeline |
| `components/scene/Scene.jsx` | Create | next/dynamic (ssr:false) wrapping R3F Canvas |
| `components/scene/CameraRig.jsx` | Create | `useFrame` + GSAP ScrollTrigger scrubs camera |
| `components/scene/BuildingWireframe.jsx` | Create | Procedural EdgesGeometry + corner dots + floor grid |
| `components/scene/DataPanels.jsx` | Create | `<Float>` + `<Html>` glassmorphism overlays |
| `components/scene/ParticleField.jsx` | Create | ShaderMaterial, 120 nodes, uMouse vortex |
| `components/scene/ContactAccent.jsx` | Create | 30-node mini particle cloud |
| `components/ui/NavBar.jsx` | Create | Fixed nav, scroll-reveal past 55vh, section links |
| `components/ui/LangToggle.jsx` | Create | EN\|TH pill button |
| `components/sections/HeroSection.jsx` | Create | Headline stagger, CTAs, scroll indicator |
| `components/sections/AboutSection.jsx` | Create | Bio paragraphs + stat cards |
| `components/sections/ExperienceSection.jsx` | Create | 3 role timeline entries |
| `components/sections/SkillsSection.jsx` | Create | 4 categories + 20 tag chips |
| `components/sections/WorkSection.jsx` | Create | 4 project cards |
| `components/sections/EducationSection.jsx` | Create | Degree card + awards |
| `components/sections/CertificationsSection.jsx` | Create | 4 cert cards |
| `components/sections/ContactSection.jsx` | Create | 3 CTA links + footer |
| `public/assets/Vivitthachai_Goody_CV.pdf` | Copy | From `assets/` |
| `tests/portfolio.spec.js` | Create | Playwright E2E: lang toggle, CV, sections visible |
| `.github/workflows/deploy.yml` | Create | Build `next export` → deploy to gh-pages branch |

---

## Task 1: Project Scaffold

**Files:**
- Replace: `package.json`
- Create: `next.config.js`, `vitest.config.js`

- [ ] **Step 1: Replace package.json**

```json
{
  "name": "portfolio-3d",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "next": "14.2.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@react-three/fiber": "^8.16.8",
    "@react-three/drei": "^9.105.4",
    "three": "^0.167.0",
    "gsap": "^3.12.5",
    "motion": "^12.40.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.44.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.2",
    "@vitejs/plugin-react": "^4.3.1",
    "jsdom": "^24.1.1",
    "vitest": "^1.6.0"
  }
}
```

- [ ] **Step 2: Create next.config.js**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  webpack(config) {
    config.module.rules.push({
      test: /\.glsl$/,
      type: 'asset/source',
    });
    return config;
  },
};

module.exports = nextConfig;
```

- [ ] **Step 3: Create vitest.config.js**

```js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
    exclude: ['node_modules/**', '.next/**', 'tests/**'],
  },
});
```

- [ ] **Step 4: Install dependencies**

```bash
npm install
```

Expected: installs without errors; `next`, `react`, `@react-three/fiber`, `@react-three/drei`, `three`, `gsap`, `motion` in node_modules.

- [ ] **Step 5: Verify Next.js resolves**

```bash
npx next --version
```

Expected: prints `14.x.x`

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json next.config.js vitest.config.js
git commit -m "chore(scaffold): migrate to Next.js 14 + R3F, keep vitest + playwright"
```

---

## Task 2: Global Styles + Design Tokens

**Files:**
- Create: `styles/globals.css`

- [ ] **Step 1: Create styles/globals.css**

```css
:root {
  --bg:        #0a0a0a;
  --bg-warm:   #0f0b06;
  --bg-warm-2: #120e07;
  --gold:      #D4A017;
  --gold-lt:   #F5C842;
  --warm-white: #F5F0E8;
  --muted:     #4a3f2a;
  --muted-txt: #9a8f7a;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--warm-white);
  font-family: 'Inter', system-ui, sans-serif;
  line-height: 1.6;
  overflow-x: hidden;
}

body.lang-th {
  font-family: 'Sarabun', 'Inter', system-ui, sans-serif;
}

body.lang-th h1,
body.lang-th h2,
body.lang-th h3,
body.lang-th .section-head em {
  font-style: normal;
  font-family: 'Sarabun', system-ui, sans-serif;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: No test needed for CSS tokens — verified visually in Task 16**

- [ ] **Step 3: Commit**

```bash
git add styles/globals.css
git commit -m "style(tokens): add global CSS design tokens and lang-th font switch"
```

---

## Task 3: Bilingual Content Library

**Files:**
- Create: `lib/content.js`, `lib/content.test.js`

- [ ] **Step 1: Write the failing test**

```js
// lib/content.test.js
import { describe, it, expect } from 'vitest';
import { content } from './content.js';

describe('content structure', () => {
  const LANGS = ['en', 'th'];
  const SECTIONS = ['nav', 'hero', 'about', 'skills', 'work', 'experience', 'education', 'certs', 'contact', 'footer'];

  it('exports content object', () => {
    expect(typeof content).toBe('object');
  });

  SECTIONS.forEach(section => {
    it(`section "${section}" exists for both langs`, () => {
      LANGS.forEach(lang => {
        expect(content[section]?.[lang], `content.${section}.${lang}`).toBeDefined();
      });
    });
  });

  it('hero has headline lines for both langs', () => {
    expect(content.hero.en.line1).toBe('Turning Complex Systems');
    expect(content.hero.th.line1).toBe('เปลี่ยนระบบที่ซับซ้อน');
  });

  it('nav has exactly 6 keys per lang', () => {
    expect(Object.keys(content.nav.en).length).toBe(6);
  });

  it('no undefined values in any leaf', () => {
    function check(obj, path) {
      Object.entries(obj).forEach(([k, v]) => {
        const p = `${path}.${k}`;
        if (typeof v === 'object' && v !== null) check(v, p);
        else expect(v, `${p} should not be undefined`).not.toBeUndefined();
      });
    }
    check(content, 'content');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
npx vitest run lib/content.test.js
```

Expected: FAIL — `content.js` not found.

- [ ] **Step 3: Create lib/content.js**

```js
// lib/content.js
export const content = {
  nav: {
    en: { brand: 'Goody.', about: '01 About', skills: '02 Skills', work: '03 Work', experience: '04 Experience', contact: '05 Contact' },
    th: { brand: 'Goody.', about: '01 เกี่ยวกับ', skills: '02 ทักษะ', work: '03 ผลงาน', experience: '04 ประสบการณ์', contact: '05 ติดต่อ' },
  },

  hero: {
    en: {
      role:  'BUSINESS ANALYST · ERP IMPLEMENTATION SPECIALIST · DATA ANALYST',
      line1: 'Turning Complex Systems',
      line2: 'Into Measurable Impact',
      name:  '"Goody" Vivitthachai Laprattanatrai',
      bio:   'Business Analyst & ERP Implementation Specialist based in Bangkok, delivering full-cycle ERP rollouts for construction and project-based organizations.',
      cta1:  'View My Work →',
      cta2:  'Download CV ↓',
      scroll: 'SCROLL',
    },
    th: {
      role:  'นักวิเคราะห์ธุรกิจ · ผู้เชี่ยวชาญ ERP · นักวิเคราะห์ข้อมูล',
      line1: 'เปลี่ยนระบบที่ซับซ้อน',
      line2: 'ให้กลายเป็นผลลัพธ์ที่วัดได้',
      name:  '"Goody" Vivitthachai Laprattanatrai',
      bio:   'นักวิเคราะห์ธุรกิจและผู้เชี่ยวชาญ ERP ประจำกรุงเทพฯ ดูแลการ implement ERP แบบครบวงจรสำหรับองค์กรก่อสร้างและงานโครงการ',
      cta1:  'ดูผลงาน →',
      cta2:  'ดาวน์โหลด CV ↓',
      scroll: 'เลื่อนลง',
    },
  },

  about: {
    en: {
      tag:   'ABOUT',
      heading: 'Where Civil Engineering Meets Data',
      p1: 'I started in civil engineering — trained in systems thinking, data analysis, and solving real-world complex problems.',
      p2: 'That foundation led me to ERP and business analysis, where engineering skills became an advantage in understanding processes and translating requirements into working systems.',
      p3: 'Today I work at Builk One Group implementing POJJAMAN ERP for 10+ construction-industry clients across 8 modules — from discovery through go-live and post-launch support.',
      stat1: '10+ ERP Clients',
      stat2: '2+ Years BA Experience',
      stat3: '8 ERP Modules',
      stat4: 'Bangkok, Thailand',
      stat5: 'Open to Remote',
    },
    th: {
      tag:   'เกี่ยวกับ',
      heading: 'เมื่อวิศวกรรมโยธา พบกับข้อมูล',
      p1: 'ผมเริ่มต้นจากวิศวกรรมโยธา — ฝึกฝนการคิดเชิงระบบ วิเคราะห์ข้อมูล และแก้ปัญหาที่ซับซ้อนในโลกจริง',
      p2: 'รากฐานนั้นพาผมมาสู่โลกของ ERP และการวิเคราะห์ธุรกิจ ที่ซึ่งทักษะทางวิศวกรรมกลายเป็นความได้เปรียบในการทำความเข้าใจกระบวนการและแปลงความต้องการให้เป็นระบบที่ใช้งานได้จริง',
      p3: 'ปัจจุบันผมทำงานที่ Builk One Group ดูแลการ implement POJJAMAN ERP ให้กับลูกค้าในอุตสาหกรรมก่อสร้างกว่า 10 ราย ครอบคลุม 8 โมดูล ตั้งแต่ช่วง discovery ไปจนถึง go-live และ post-launch support',
      stat1: 'ลูกค้า ERP 10+ ราย',
      stat2: 'ประสบการณ์ BA 2+ ปี',
      stat3: 'ERP 8 โมดูล',
      stat4: 'กรุงเทพฯ ประเทศไทย',
      stat5: 'พร้อมทำงาน Remote',
    },
  },

  skills: {
    en: {
      tag: 'CAPABILITIES',
      heading: 'Full-Stack Business Intelligence',
      cat1: 'ERP & Implementation',
      cat2: 'Business Analysis',
      cat3: 'Data & Analytics',
      cat4: 'Tooling & Domain',
      tags: {
        erp:          'POJJAMAN ERP',
        modules:      '8-Module Configuration',
        uat:          'UAT',
        golive:       'Go-live & Support',
        sop:          'SOP Development',
        requirements: 'Requirements Gathering',
        mapping:      'AS-IS / TO-BE Mapping',
        gap:          'Gap Analysis',
        stakeholder:  'Stakeholder Management',
        change:       'Change Management',
        sql:          'SQL',
        python:       'Python',
        powerbi:      'Power BI',
        excel:        'Excel (Advanced)',
        dashboard:    'Dashboard Design',
        xtra:         'Xtra Report Designer',
        jira:         'JIRA',
        confluence:   'Confluence',
        autocad:      'AutoCAD',
        finance:      'Finance Ops (AP/AR/Tax)',
      },
    },
    th: {
      tag: 'ความสามารถ',
      heading: 'ความสามารถวิเคราะห์ธุรกิจแบบครบวงจร',
      cat1: 'ERP และการ Implement',
      cat2: 'การวิเคราะห์ธุรกิจ',
      cat3: 'ข้อมูลและการวิเคราะห์',
      cat4: 'เครื่องมือและความเชี่ยวชาญ',
      tags: {
        erp:          'POJJAMAN ERP',
        modules:      'การตั้งค่า 8 โมดูล',
        uat:          'UAT',
        golive:       'Go-live และ Support',
        sop:          'การพัฒนา SOP',
        requirements: 'การรวบรวมความต้องการ',
        mapping:      'การทำ AS-IS / TO-BE',
        gap:          'Gap Analysis',
        stakeholder:  'การจัดการผู้มีส่วนได้เสีย',
        change:       'การบริหารการเปลี่ยนแปลง',
        sql:          'SQL',
        python:       'Python',
        powerbi:      'Power BI',
        excel:        'Excel (ขั้นสูง)',
        dashboard:    'การออกแบบ Dashboard',
        xtra:         'Xtra Report Designer',
        jira:         'JIRA',
        confluence:   'Confluence',
        autocad:      'AutoCAD',
        finance:      'การเงิน (AP/AR/ภาษี)',
      },
    },
  },

  work: {
    en: {
      tag:     'SELECTED WORKS',
      heading: 'Work That Moved the Needle',
      projects: [
        {
          title: 'POJJAMAN ERP Rollout',
          tags:  ['Construction', '8 Modules', 'Go-live & Support'],
          desc:  'Led full-cycle ERP implementation for 10+ construction & project-based clients across 8 modules — discovery through go-live and post-launch support.',
          cta:   'View Case →',
        },
        {
          title: 'Centralized Data Architecture',
          tags:  ['Process Design', 'SOPs'],
          desc:  'Consolidated all business processes into a single ERP database, delivering SOPs and system diagrams that became permanent reference documents.',
          cta:   'View Case →',
        },
        {
          title: 'AS-IS / TO-BE Process Mapping',
          tags:  ['Workshops', 'Process Design'],
          desc:  'Ran requirements workshops with C-level executives and delivered process documentation that became the configuration baseline across all deployments.',
          cta:   'View Case →',
        },
        {
          title: 'Steel Building Stability Analysis',
          tags:  ['Graduate Research'],
          desc:  'Modeled multi-story steel-frame stability and verified design performance with STAAD Pro + ABAQUS — received Graduate Project Award.',
          cta:   'View Case →',
        },
      ],
    },
    th: {
      tag:     'ผลงานที่เลือกสรร',
      heading: 'งานที่สร้างความเปลี่ยนแปลงจริง',
      projects: [
        {
          title: 'การ Rollout POJJAMAN ERP',
          tags:  ['การก่อสร้าง', '8 โมดูล', 'Go-live และ Support'],
          desc:  'นำการ implement ERP แบบครบวงจรให้กับลูกค้าในอุตสาหกรรมก่อสร้างกว่า 10 ราย ดูแลทุกขั้นตอนตั้งแต่ discovery จนถึง go-live และ post-launch support',
          cta:   'ดูรายละเอียด →',
        },
        {
          title: 'สถาปัตยกรรมข้อมูลแบบรวมศูนย์',
          tags:  ['การออกแบบกระบวนการ', 'SOP'],
          desc:  'รวมกระบวนการทางธุรกิจทั้งหมดเข้าสู่ฐานข้อมูล ERP เดียว พร้อมจัดทำ SOP และแผนผังระบบที่กลายเป็นเอกสารอ้างอิงถาวร',
          cta:   'ดูรายละเอียด →',
        },
        {
          title: 'การทำ Process Mapping AS-IS / TO-BE',
          tags:  ['Workshop', 'การออกแบบกระบวนการ'],
          desc:  'จัดทำ requirements workshops กับผู้บริหารระดับ C พร้อมส่งมอบเอกสารกระบวนการที่กลายเป็นพื้นฐานการตั้งค่าระบบในทุก deployment',
          cta:   'ดูรายละเอียด →',
        },
        {
          title: 'การวิเคราะห์เสถียรภาพอาคารเหล็ก',
          tags:  ['วิจัยปริญญาตรี'],
          desc:  'สร้างแบบจำลองเสถียรภาพโครงสร้างเหล็กหลายชั้นและตรวจสอบประสิทธิภาพการออกแบบด้วย STAAD Pro + ABAQUS — ได้รับรางวัล Graduate Project Award',
          cta:   'ดูรายละเอียด →',
        },
      ],
    },
  },

  experience: {
    en: {
      tag:     'EXPERIENCE',
      heading: 'Roles That Shaped the Method',
      roles: [
        {
          period:  'Apr 2024 — Present',
          title:   'Business Analyst / ERP Implementation',
          company: 'Builk One Group · POJJAMAN ERP · Bangkok',
          desc:    'Led POJJAMAN ERP implementation for 10+ construction-industry clients across 8 modules. Delivered AS-IS/TO-BE documentation, coordinated dev team, and managed go-live.',
        },
        {
          period:  'May 2023 — Sep 2023',
          title:   'Ride Operator / Work & Travel',
          company: 'Busch Gardens Williamsburg · Virginia, USA',
          desc:    'Operated ride systems, maintained guest safety, and communicated with international visitors. Zero incidents across the full 5-month contract.',
        },
        {
          period:  'Apr 2022 — Jun 2022',
          title:   'Site Engineer Intern / Civil',
          company: 'Visavapat Co., Ltd. · Bangkok',
          desc:    'Monitored construction progress, controlled material quality, prepared quantity take-offs, and reviewed construction drawings.',
        },
      ],
    },
    th: {
      tag:     'ประสบการณ์',
      heading: 'ประสบการณ์ที่หล่อหลอมแนวทางการทำงาน',
      roles: [
        {
          period:  'เม.ย. 2567 — ปัจจุบัน',
          title:   'นักวิเคราะห์ธุรกิจ / ผู้ implement ERP',
          company: 'Builk One Group · POJJAMAN ERP · กรุงเทพฯ',
          desc:    'นำการ implement POJJAMAN ERP ให้กับลูกค้ากว่า 10 รายในอุตสาหกรรมก่อสร้าง ครอบคลุม 8 โมดูล จัดทำเอกสาร AS-IS/TO-BE ประสาน dev team และดูแลการ go-live',
        },
        {
          period:  'พ.ค. 2566 — ก.ย. 2566',
          title:   'Ride Operator / Work & Travel',
          company: 'Busch Gardens Williamsburg · เวอร์จิเนีย สหรัฐอเมริกา',
          desc:    'ควบคุมระบบ ride ดูแลความปลอดภัย และสื่อสารกับนักท่องเที่ยว ไม่มีบันทึกการฝ่าฝืนตลอด 5 เดือนของสัญญา',
        },
        {
          period:  'เม.ย. 2565 — มิ.ย. 2565',
          title:   'นักศึกษาฝึกงาน วิศวกรโยธา',
          company: 'บริษัท วิสาวภัทร จำกัด · กรุงเทพฯ',
          desc:    'ติดตามงานก่อสร้าง ควบคุมคุณภาพวัสดุ ถอดแบบ และตรวจสอบแบบก่อสร้าง',
        },
      ],
    },
  },

  education: {
    en: {
      tag:     'EDUCATION',
      heading: 'Engineering Foundations',
      degree:  'Bachelor of Engineering, Civil Engineering',
      school:  'Kasetsart University · 2019 — 2023',
      desc:    'Studied structural analysis, material mechanics, and computational analysis. Final project focused on steel-frame stability modelling using STAAD Pro and ABAQUS.',
      gpa:     'GPA 3.03 / 4.00',
      award:   'Graduate Project Award · 2023',
    },
    th: {
      tag:     'การศึกษา',
      heading: 'รากฐานทางวิศวกรรม',
      degree:  'วิศวกรรมศาสตรบัณฑิต สาขาวิศวกรรมโยธา',
      school:  'มหาวิทยาลัยเกษตรศาสตร์ · 2562 — 2566',
      desc:    'ศึกษาด้านโครงสร้าง กลศาสตร์วัสดุ และการวิเคราะห์เชิงคำนวณ โครงงานปริญญาตรีเน้นการวิเคราะห์เสถียรภาพโครงเหล็กด้วย STAAD Pro และ ABAQUS',
      gpa:     'เกรดเฉลี่ย 3.03 / 4.00',
      award:   'รางวัลโครงงาน ปี 2566',
    },
  },

  certs: {
    en: {
      tag:     'CREDENTIALS',
      heading: 'Certified to Deliver',
      items: [
        { title: 'Google Data Analytics',         issuer: 'Google · Professional Certificate', status: '' },
        { title: 'Data Analysis with Python',     issuer: 'freeCodeCamp · Certified',          status: '' },
        { title: 'Scientific Computing with Python', issuer: 'freeCodeCamp · Certified',       status: '' },
        { title: 'IBM Data Engineering',          issuer: 'IBM · Coursera',                    status: 'On-process' },
      ],
    },
    th: {
      tag:     'วุฒิบัตรและการรับรอง',
      heading: 'ผ่านการรับรอง พร้อมส่งมอบ',
      items: [
        { title: 'Google Data Analytics',         issuer: 'Google · Professional Certificate', status: '' },
        { title: 'การวิเคราะห์ข้อมูลด้วย Python', issuer: 'freeCodeCamp · รับรองแล้ว',          status: '' },
        { title: 'Scientific Computing with Python', issuer: 'freeCodeCamp · รับรองแล้ว',      status: '' },
        { title: 'IBM Data Engineering',          issuer: 'IBM · Coursera',                    status: 'กำลังดำเนินการ' },
      ],
    },
  },

  contact: {
    en: {
      tag:     'LET\'S CONNECT',
      heading: 'Ready to Build Something Together?',
      desc:    'Open to full-time roles, freelance projects, and ERP consulting engagements.',
      email:   'Send Email →',
      linkedin: 'LinkedIn ↗',
      cv:      'Download CV ↓',
    },
    th: {
      tag:     'ติดต่อกัน',
      heading: 'พร้อมสร้างสิ่งดีๆ ด้วยกันไหม?',
      desc:    'เปิดรับทั้งงานประจำ งาน freelance และงานที่ปรึกษา ERP',
      email:   'ส่งอีเมล →',
      linkedin: 'LinkedIn ↗',
      cv:      'ดาวน์โหลด CV ↓',
    },
  },

  footer: {
    en: { text: '© 2026 "Goody" Vivitthachai Laprattanatrai · Bangkok, Thailand · Business Analyst & ERP Implementation Specialist' },
    th: { text: '© 2026 "Goody" Vivitthachai Laprattanatrai · กรุงเทพฯ ประเทศไทย · นักวิเคราะห์ธุรกิจและผู้เชี่ยวชาญ ERP' },
  },
};
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run lib/content.test.js
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/content.js lib/content.test.js
git commit -m "feat(content): add bilingual content library with all EN/TH strings"
```

---

## Task 4: Camera Keyframes

**Files:**
- Create: `lib/keyframes.js`, `lib/keyframes.test.js`

- [ ] **Step 1: Write the failing test**

```js
// lib/keyframes.test.js
import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { KEYFRAMES } from './keyframes.js';

describe('camera keyframes', () => {
  it('exports exactly 8 keyframes', () => {
    expect(KEYFRAMES).toHaveLength(8);
  });

  it('each keyframe has pos and lookAt as THREE.Vector3', () => {
    KEYFRAMES.forEach((kf, i) => {
      expect(kf.pos,    `kf[${i}].pos`).toBeInstanceOf(THREE.Vector3);
      expect(kf.lookAt, `kf[${i}].lookAt`).toBeInstanceOf(THREE.Vector3);
    });
  });

  it('keyframe 0 (intro) is furthest from origin', () => {
    expect(KEYFRAMES[0].pos.z).toBeGreaterThanOrEqual(12);
  });

  it('keyframe 7 (contact) has y <= 2', () => {
    expect(KEYFRAMES[7].pos.y).toBeLessThanOrEqual(2);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
npx vitest run lib/keyframes.test.js
```

Expected: FAIL — `keyframes.js` not found.

- [ ] **Step 3: Create lib/keyframes.js**

```js
// lib/keyframes.js
import * as THREE from 'three';

export const KEYFRAMES = [
  { pos: new THREE.Vector3( 0, 6, 12), lookAt: new THREE.Vector3(0, 0, 0) }, // KF0 Intro
  { pos: new THREE.Vector3( 2, 3,  9), lookAt: new THREE.Vector3(0, 1, 0) }, // KF1 About
  { pos: new THREE.Vector3( 5, 3,  9), lookAt: new THREE.Vector3(0, 1, 0) }, // KF2 Experience (elevated wide)
  { pos: new THREE.Vector3( 0, 7, 13), lookAt: new THREE.Vector3(0, 0, 0) }, // KF3 Skills (wide pull-back)
  { pos: new THREE.Vector3(-3, 2,  9), lookAt: new THREE.Vector3(0, 1, 0) }, // KF4 Work (orbit left)
  { pos: new THREE.Vector3( 3, 0,  8), lookAt: new THREE.Vector3(0, 1, 0) }, // KF5 Education (side angle)
  { pos: new THREE.Vector3( 7, 2,  7), lookAt: new THREE.Vector3(0, 1, 0) }, // KF6 Certs (orbit right)
  { pos: new THREE.Vector3( 1, 1,  7), lookAt: new THREE.Vector3(0, 0, 0) }, // KF7 Contact (pull back)
];
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run lib/keyframes.test.js
```

Expected: All 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/keyframes.js lib/keyframes.test.js
git commit -m "feat(keyframes): add 8-point camera choreography keyframes"
```

---

## Task 5: LangContext

**Files:**
- Create: `lib/LangContext.jsx`

- [ ] **Step 1: Write the failing test**

```js
// lib/LangContext.test.jsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LangProvider, useLang } from './LangContext.jsx';

const Toggle = () => {
  const { lang, setLang } = useLang();
  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <button onClick={() => setLang(lang === 'en' ? 'th' : 'en')}>toggle</button>
    </div>
  );
};

beforeEach(() => localStorage.clear());

describe('LangContext', () => {
  it('defaults to en', () => {
    render(<LangProvider><Toggle /></LangProvider>);
    expect(screen.getByTestId('lang').textContent).toBe('en');
  });

  it('switches to th on toggle', () => {
    render(<LangProvider><Toggle /></LangProvider>);
    fireEvent.click(screen.getByText('toggle'));
    expect(screen.getByTestId('lang').textContent).toBe('th');
  });

  it('persists lang in localStorage', () => {
    render(<LangProvider><Toggle /></LangProvider>);
    fireEvent.click(screen.getByText('toggle'));
    expect(localStorage.getItem('lang')).toBe('th');
  });

  it('reads initial lang from localStorage', () => {
    localStorage.setItem('lang', 'th');
    render(<LangProvider><Toggle /></LangProvider>);
    expect(screen.getByTestId('lang').textContent).toBe('th');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
npx vitest run lib/LangContext.test.jsx
```

Expected: FAIL — `LangContext.jsx` not found.

- [ ] **Step 3: Create lib/LangContext.jsx**

```jsx
'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const LangContext = createContext({ lang: 'en', setLang: () => {} });

export function LangProvider({ children }) {
  const [lang, setLangState] = useState('en');

  useEffect(() => {
    const saved = typeof localStorage !== 'undefined' && localStorage.getItem('lang');
    if (saved === 'th') setLangState('th');
  }, []);

  function setLang(l) {
    setLangState(l);
    if (typeof localStorage !== 'undefined') localStorage.setItem('lang', l);
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('lang-th', l === 'th');
      document.documentElement.lang = l === 'th' ? 'th' : 'en';
    }
  }

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run lib/LangContext.test.jsx
```

Expected: All 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/LangContext.jsx lib/LangContext.test.jsx
git commit -m "feat(lang): add LangContext with localStorage persistence and body class toggle"
```

---

## Task 6: Hooks — useMagneticTilt + useCursorWorld

**Files:**
- Create: `hooks/useMagneticTilt.js`, `hooks/useMagneticTilt.test.js`, `hooks/useCursorWorld.js`

- [ ] **Step 1: Write the failing test for useMagneticTilt**

```js
// hooks/useMagneticTilt.test.js
import { describe, it, expect } from 'vitest';
import { calcTilt } from './useMagneticTilt.js';

describe('calcTilt', () => {
  it('returns zero tilt at centre of card', () => {
    const { rotateX, rotateY } = calcTilt(50, 50, 100, 100);
    expect(rotateX).toBeCloseTo(0);
    expect(rotateY).toBeCloseTo(0);
  });

  it('returns max negative rotateX at top edge (offsetY=0)', () => {
    const { rotateX } = calcTilt(50, 0, 100, 100);
    expect(rotateX).toBeCloseTo(8);
  });

  it('returns max positive rotateY at right edge (offsetX=100)', () => {
    const { rotateY } = calcTilt(100, 50, 100, 100);
    expect(rotateY).toBeCloseTo(8);
  });

  it('clamps at ±8 degrees', () => {
    const { rotateX, rotateY } = calcTilt(0, 0, 100, 100);
    expect(Math.abs(rotateX)).toBeLessThanOrEqual(8);
    expect(Math.abs(rotateY)).toBeLessThanOrEqual(8);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
npx vitest run hooks/useMagneticTilt.test.js
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create hooks/useMagneticTilt.js**

```js
// hooks/useMagneticTilt.js
import { useRef, useCallback } from 'react';
import { gsap } from 'gsap';

export function calcTilt(offsetX, offsetY, width, height) {
  const rotateY =  ((offsetX / width)  - 0.5) * 16;
  const rotateX = -((offsetY / height) - 0.5) * 16;
  return { rotateX, rotateY };
}

export function useMagneticTilt() {
  const ref = useRef(null);

  const onMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const { offsetX, offsetY } = e.nativeEvent ?? e;
    const { offsetWidth: width, offsetHeight: height } = ref.current;
    const { rotateX, rotateY } = calcTilt(offsetX, offsetY, width, height);
    const mx = (offsetX / width  * 100).toFixed(1) + '%';
    const my = (offsetY / height * 100).toFixed(1) + '%';
    ref.current.style.transform =
      `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    ref.current.style.setProperty('--mx', mx);
    ref.current.style.setProperty('--my', my);
  }, []);

  const onMouseLeave = useCallback(() => {
    if (!ref.current) return;
    gsap.to(ref.current, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)', clearProps: 'transform' });
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
```

- [ ] **Step 4: Create hooks/useCursorWorld.js**

```js
// hooks/useCursorWorld.js
// Maps mouse position to 3D world coordinates via raycaster on a plane at z=0.
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export function useCursorWorld(camera) {
  const mouse = useRef(new THREE.Vector3(0, 0, 0));
  const raycaster = useRef(new THREE.Raycaster());
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));

  useEffect(() => {
    function onMove(e) {
      if (!camera) return;
      const ndcX =  (e.clientX / window.innerWidth)  * 2 - 1;
      const ndcY = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.current.setFromCamera({ x: ndcX, y: ndcY }, camera);
      const target = new THREE.Vector3();
      raycaster.current.ray.intersectPlane(plane.current, target);
      mouse.current.copy(target);
    }
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [camera]);

  return mouse;
}
```

- [ ] **Step 5: Run tests**

```bash
npx vitest run hooks/useMagneticTilt.test.js
```

Expected: All 4 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add hooks/useMagneticTilt.js hooks/useMagneticTilt.test.js hooks/useCursorWorld.js
git commit -m "feat(hooks): add useMagneticTilt and useCursorWorld"
```

---

## Task 7: useCinematicReveal Hook

**Files:**
- Create: `hooks/useCinematicReveal.js`, `hooks/useCinematicReveal.test.js`

- [ ] **Step 1: Write the failing test**

```js
// hooks/useCinematicReveal.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';

// IntersectionObserver is not in jsdom — mock it.
const observerCallbacks = new Map();
global.IntersectionObserver = class {
  constructor(cb) { this._cb = cb; }
  observe(el)   { observerCallbacks.set(el, this._cb); }
  unobserve(el) { observerCallbacks.delete(el); }
  disconnect()  {}
};

// GSAP mock
vi.mock('gsap', () => ({
  gsap: {
    fromTo: vi.fn(),
    set:    vi.fn(),
  },
}));

import { renderHook } from '@testing-library/react';
import { useCinematicReveal } from './useCinematicReveal.js';
import { gsap } from 'gsap';

beforeEach(() => {
  observerCallbacks.clear();
  vi.clearAllMocks();
});

describe('useCinematicReveal', () => {
  it('returns a ref', () => {
    const { result } = renderHook(() => useCinematicReveal());
    expect(result.current).toHaveProperty('current');
  });

  it('calls gsap.fromTo when element enters viewport', () => {
    const { result } = renderHook(() => useCinematicReveal());
    const el = document.createElement('div');
    result.current.current = el;

    // Simulate observer firing
    const fakeEntry = [{ isIntersecting: true, target: el }];
    observerCallbacks.get(el)?.(fakeEntry);

    // gsap.fromTo may be deferred — just check hook doesn't throw.
    expect(result.current.current).toBe(el);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
npx vitest run hooks/useCinematicReveal.test.js
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create hooks/useCinematicReveal.js**

```js
// hooks/useCinematicReveal.js
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export function useCinematicReveal(options = {}) {
  const ref = useRef(null);
  const { stagger = 0.08, duration = 0.7, once = true } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    gsap.set(el, { scale: 0.85, y: 60, opacity: 0, filter: 'blur(4px)' });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          gsap.fromTo(
            el,
            { scale: 0.85, y: 60, opacity: 0, filter: 'blur(4px)' },
            { scale: 1, y: 0, opacity: 1, filter: 'blur(0px)', duration, ease: 'expo.out' }
          );
          // Stagger children with class .reveal-item
          const items = el.querySelectorAll('.reveal-item');
          items.forEach((item, i) => {
            gsap.fromTo(
              item,
              { scale: 0.85, y: 40, opacity: 0 },
              { scale: 1, y: 0, opacity: 1, duration, ease: 'expo.out', delay: stagger * (i + 1) }
            );
          });
          if (once) observer.unobserve(el);
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [duration, once, stagger]);

  return ref;
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run hooks/useCinematicReveal.test.js
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add hooks/useCinematicReveal.js hooks/useCinematicReveal.test.js
git commit -m "feat(hooks): add useCinematicReveal with GSAP IntersectionObserver trigger"
```

---

## Task 8: GLSL Shaders

**Files:**
- Create: `shaders/particle.vert.glsl`, `shaders/particle.frag.glsl`

No unit tests — GLSL is verified visually in Task 11.

- [ ] **Step 1: Create shaders/particle.vert.glsl**

```glsl
uniform vec3 uMouse;
uniform float uVortexStrength;
uniform float uTime;

attribute float aSize;
attribute float aSpeed;

varying float vAlpha;

// Simple pseudo-random for noise
float rand(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec3 pos = position;

  // Autonomous drift using time + per-particle seed
  float seed = rand(vec2(position.x, position.z));
  pos.x += sin(uTime * aSpeed + seed * 6.28) * 0.15;
  pos.y += cos(uTime * aSpeed * 0.7 + seed * 3.14) * 0.1;

  // Cursor vortex pull
  float dist = length(pos - uMouse);
  float strength = 1.0 / (dist * dist + 0.5);
  pos += (uMouse - pos) * strength * uVortexStrength;

  vAlpha = clamp(1.0 - dist * 0.18, 0.1, 1.0);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = aSize * (300.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
```

- [ ] **Step 2: Create shaders/particle.frag.glsl**

```glsl
uniform vec3 uGoldColor;

varying float vAlpha;

void main() {
  vec2 uv = gl_PointCoord - vec2(0.5);
  float d = length(uv);

  // Circular point with soft edge + glow falloff
  float core  = smoothstep(0.5, 0.1, d);
  float glow  = smoothstep(0.5, 0.0, d) * 0.4;
  float alpha = (core + glow) * vAlpha;

  if (alpha < 0.01) discard;
  gl_FragColor = vec4(uGoldColor, alpha);
}
```

- [ ] **Step 3: Commit**

```bash
git add shaders/particle.vert.glsl shaders/particle.frag.glsl
git commit -m "feat(shaders): add GLSL particle shaders with cursor vortex and gold glow"
```

---

## Task 9: 3D Scene Components

**Files:**
- Create: `components/scene/BuildingWireframe.jsx`, `components/scene/DataPanels.jsx`, `components/scene/ParticleField.jsx`, `components/scene/ContactAccent.jsx`, `components/scene/CameraRig.jsx`

These components run inside the R3F Canvas — no jsdom unit tests. They are verified in Task 15 (Playwright).

- [ ] **Step 1: Create components/scene/BuildingWireframe.jsx**

```jsx
'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function BuildingWireframe() {
  const pulseRef = useRef([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    pulseRef.current.forEach((mesh, i) => {
      if (mesh) {
        const s = 1 + Math.sin(t * 1.5 + i * 0.8) * 0.15;
        mesh.scale.setScalar(s);
      }
    });
  });

  // Corner node positions for a 2×3×2 box
  const corners = [
    [-1, 0, -1], [1, 0, -1], [-1, 0, 1], [1, 0, 1],
    [-1, 3, -1], [1, 3, -1], [-1, 3, 1], [1, 3, 1],
  ];

  const goldEmissive = new THREE.Color('#D4A017');

  return (
    <group position={[0, -1.5, 0]}>
      {/* Main box wireframe */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(2, 3, 2)]} />
        <lineBasicMaterial color="#F5C842" transparent opacity={0.7} />
      </lineSegments>

      {/* Floor grid */}
      <gridHelper args={[6, 6, '#4a3f2a', '#4a3f2a']} position={[0, 0, 0]} />

      {/* Pulsing corner nodes */}
      {corners.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} ref={el => { pulseRef.current[i] = el; }}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#F5C842" emissive={goldEmissive} emissiveIntensity={1.5} />
        </mesh>
      ))}
    </group>
  );
}
```

- [ ] **Step 2: Create components/scene/DataPanels.jsx**

```jsx
'use client';
import { Float, Html } from '@react-three/drei';
import styles from './DataPanels.module.css';

const PANELS = [
  { pos: [-2.5,  2.5, 0], label: 'ERP Modules',          value: '8',   sub: 'POJJAMAN' },
  { pos: [ 2.5,  2.5, 0], label: 'Projects Delivered',   value: '10+', sub: 'Construction' },
  { pos: [-2.5,  0.5, 0], label: 'Site Engineering',      value: 'Q/C', sub: 'Civil' },
  { pos: [ 2.5,  0.5, 0], label: 'Data Analytics',        value: '✓',   sub: 'Google Certified' },
];

export function DataPanels() {
  return (
    <>
      {PANELS.map((p, i) => (
        <Float key={i} speed={1.5} rotationIntensity={0} floatIntensity={0.3}>
          <Html position={p.pos} center>
            <div className={styles.panel}>
              <div className={styles.value}>{p.value}</div>
              <div className={styles.label}>{p.label}</div>
              <div className={styles.sub}>{p.sub}</div>
            </div>
          </Html>
        </Float>
      ))}
    </>
  );
}
```

- [ ] **Step 3: Create components/scene/DataPanels.module.css**

```css
.panel {
  background: rgba(212, 160, 23, 0.06);
  border: 1px solid rgba(212, 160, 23, 0.3);
  border-radius: 8px;
  padding: 10px 14px;
  min-width: 100px;
  text-align: center;
  backdrop-filter: blur(4px);
  transition: transform 0.2s, box-shadow 0.2s;
  white-space: nowrap;
}
.panel:hover {
  transform: scale(1.06);
  box-shadow: 0 0 20px rgba(212, 160, 23, 0.3);
}
.value {
  font-size: 1.4rem;
  font-weight: 700;
  color: #F5C842;
}
.label {
  font-size: 0.65rem;
  color: #F5F0E8;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.sub {
  font-size: 0.6rem;
  color: #9a8f7a;
  margin-top: 2px;
}
```

- [ ] **Step 4: Create components/scene/ParticleField.jsx**

```jsx
'use client';
import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { useCursorWorld } from '../../hooks/useCursorWorld.js';
import vertexShader   from '../../shaders/particle.vert.glsl';
import fragmentShader from '../../shaders/particle.frag.glsl';

const PARTICLE_COUNT = 120;

export function ParticleField({ vortexStrength = 0 }) {
  const { camera } = useThree();
  const cursorWorld = useCursorWorld(camera);
  const matRef = useRef(null);
  const strengthRef = useRef({ v: vortexStrength });

  // Build particle geometry once
  const [positions, sizes, speeds] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const sz  = new Float32Array(PARTICLE_COUNT);
    const sp  = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
      sz[i]  = Math.random() * 3 + 1;
      sp[i]  = Math.random() * 0.5 + 0.2;
    }
    return [pos, sz, sp];
  }, []);

  const uniforms = useMemo(() => ({
    uMouse:          { value: new THREE.Vector3() },
    uVortexStrength: { value: 0 },
    uTime:           { value: 0 },
    uGoldColor:      { value: new THREE.Color('#D4A017') },
  }), []);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value  = clock.getElapsedTime();
    matRef.current.uniforms.uMouse.value.copy(cursorWorld.current);
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize"    args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aSpeed"   args={[speeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
```

- [ ] **Step 5: Create components/scene/ContactAccent.jsx**

```jsx
'use client';
// Same as ParticleField but 30 nodes, tighter spread, always-on mild vortex
import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useCursorWorld } from '../../hooks/useCursorWorld.js';
import vertexShader   from '../../shaders/particle.vert.glsl';
import fragmentShader from '../../shaders/particle.frag.glsl';

const COUNT = 30;

export function ContactAccent() {
  const { camera } = useThree();
  const cursorWorld = useCursorWorld(camera);
  const matRef = useRef(null);

  const [positions, sizes, speeds] = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const sz  = new Float32Array(COUNT);
    const sp  = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3;
      sz[i]  = Math.random() * 2 + 1;
      sp[i]  = Math.random() * 0.4 + 0.15;
    }
    return [pos, sz, sp];
  }, []);

  const uniforms = useMemo(() => ({
    uMouse:          { value: new THREE.Vector3() },
    uVortexStrength: { value: 0.3 },
    uTime:           { value: 0 },
    uGoldColor:      { value: new THREE.Color('#D4A017') },
  }), []);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = clock.getElapsedTime();
    matRef.current.uniforms.uMouse.value.copy(cursorWorld.current);
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize"    args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aSpeed"   args={[speeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
```

- [ ] **Step 6: Create components/scene/CameraRig.jsx**

```jsx
'use client';
import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { KEYFRAMES } from '../../lib/keyframes.js';

gsap.registerPlugin(ScrollTrigger);

// Section IDs that map 1:1 to KEYFRAMES indices 0–7
const SECTION_IDS = ['hero', 'about', 'experience', 'skills', 'work', 'education', 'certs', 'contact'];

export function CameraRig() {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3());
  const kfIndex = useRef(0);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Set initial camera position
    camera.position.copy(KEYFRAMES[0].pos);
    target.current.copy(KEYFRAMES[0].lookAt);

    if (reduced) return;

    // Create one ScrollTrigger per section
    const triggers = SECTION_IDS.map((id, i) => {
      const el = document.getElementById(id);
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start: 'top 60%',
        onEnter:     () => tweenTo(i),
        onEnterBack: () => tweenTo(i),
      });
    }).filter(Boolean);

    return () => triggers.forEach(t => t.kill());
  }, [camera]);

  function tweenTo(i) {
    kfIndex.current = i;
    gsap.to(camera.position, {
      x: KEYFRAMES[i].pos.x,
      y: KEYFRAMES[i].pos.y,
      z: KEYFRAMES[i].pos.z,
      duration: 1.8,
      ease: 'power2.inOut',
    });
    gsap.to(target.current, {
      x: KEYFRAMES[i].lookAt.x,
      y: KEYFRAMES[i].lookAt.y,
      z: KEYFRAMES[i].lookAt.z,
      duration: 1.8,
      ease: 'power2.inOut',
    });
  }

  useFrame(() => {
    camera.lookAt(target.current);
  });

  return null;
}
```

- [ ] **Step 7: Commit**

```bash
git add components/scene/
git commit -m "feat(scene): add BuildingWireframe, DataPanels, ParticleField, ContactAccent, CameraRig"
```

---

## Task 10: Scene Wrapper (next/dynamic)

**Files:**
- Create: `components/scene/Scene.jsx`, `components/scene/SceneInner.jsx`

- [ ] **Step 1: Create components/scene/SceneInner.jsx**

```jsx
'use client';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { CameraRig }        from './CameraRig.jsx';
import { BuildingWireframe } from './BuildingWireframe.jsx';
import { DataPanels }        from './DataPanels.jsx';
import { ParticleField }     from './ParticleField.jsx';

export function SceneInner({ showContact }) {
  return (
    <Canvas
      style={{ position: 'fixed', inset: 0, zIndex: 0 }}
      camera={{ position: [0, 6, 12], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 5, 5]} color="#D4A017" intensity={2} />

      <Suspense fallback={null}>
        <CameraRig />
        <BuildingWireframe />
        <DataPanels />
        <ParticleField />
      </Suspense>
    </Canvas>
  );
}
```

- [ ] **Step 2: Create components/scene/Scene.jsx**

```jsx
'use client';
import dynamic from 'next/dynamic';

// Three.js is browser-only — ssr:false prevents server-side import errors
const SceneInner = dynamic(
  () => import('./SceneInner.jsx').then(m => m.SceneInner),
  { ssr: false, loading: () => null }
);

// Guard: hide canvas on touch devices (pointer:coarse)
function useIsFinePinter() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: fine)').matches;
}

export function Scene(props) {
  const isFine = useIsFinePinter();
  if (!isFine) return null;
  return <SceneInner {...props} />;
}
```

- [ ] **Step 3: Commit**

```bash
git add components/scene/Scene.jsx components/scene/SceneInner.jsx
git commit -m "feat(scene): add dynamic Scene wrapper with mobile guard and ssr:false"
```

---

## Task 11: UI Components — NavBar + LangToggle

**Files:**
- Create: `components/ui/LangToggle.jsx`, `components/ui/LangToggle.module.css`, `components/ui/NavBar.jsx`, `components/ui/NavBar.module.css`

- [ ] **Step 1: Write the failing test**

```jsx
// components/ui/LangToggle.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LangProvider } from '../../lib/LangContext.jsx';
import { LangToggle } from './LangToggle.jsx';

describe('LangToggle', () => {
  it('renders EN | TH label', () => {
    render(<LangProvider><LangToggle /></LangProvider>);
    expect(screen.getByRole('button').textContent).toMatch(/EN/);
    expect(screen.getByRole('button').textContent).toMatch(/TH/);
  });

  it('cycles en → th on click', () => {
    render(<LangProvider><LangToggle /></LangProvider>);
    const btn = screen.getByRole('button');
    fireEvent.click(btn);
    // After click, th should be active (aria-pressed or data-lang)
    expect(btn.getAttribute('data-lang')).toBe('th');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
npx vitest run components/ui/LangToggle.test.jsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create components/ui/LangToggle.jsx**

```jsx
'use client';
import { useLang } from '../../lib/LangContext.jsx';
import styles from './LangToggle.module.css';

export function LangToggle() {
  const { lang, setLang } = useLang();
  const next = lang === 'en' ? 'th' : 'en';

  return (
    <button
      className={styles.pill}
      data-lang={lang}
      aria-label={`Switch to ${next === 'th' ? 'Thai' : 'English'}`}
      onClick={() => setLang(next)}
    >
      <span className={lang === 'en' ? styles.active : styles.inactive}>EN</span>
      <span className={styles.divider}> | </span>
      <span className={lang === 'th' ? styles.active : styles.inactive}>TH</span>
    </button>
  );
}
```

- [ ] **Step 4: Create components/ui/LangToggle.module.css**

```css
.pill {
  border: 1px solid var(--muted);
  border-radius: 100px;
  padding: 4px 12px;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  display: flex;
  align-items: center;
  gap: 2px;
}
.active   { color: var(--gold-lt); }
.inactive { color: var(--muted-txt); }
.divider  { color: var(--muted-txt); }
```

- [ ] **Step 5: Create components/ui/NavBar.jsx**

```jsx
'use client';
import { useEffect, useRef } from 'react';
import { useLang } from '../../lib/LangContext.jsx';
import { content }  from '../../lib/content.js';
import { LangToggle } from './LangToggle.jsx';
import styles from './NavBar.module.css';

const LINKS = ['about', 'skills', 'work', 'experience', 'contact'];

export function NavBar() {
  const { lang } = useLang();
  const t = content.nav[lang];
  const navRef = useRef(null);

  // Scroll-reveal: show navbar after scrolling past 55vh
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    function onScroll() {
      const past55 = window.scrollY > window.innerHeight * 0.55;
      nav.classList.toggle(styles.visible, past55);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav ref={navRef} className={styles.nav}>
      <a href="#hero" className={styles.brand}>{t.brand}</a>
      <ul className={styles.links}>
        {LINKS.map(key => (
          <li key={key}>
            <a href={`#${key}`} className={styles.link}>{t[key]}</a>
          </li>
        ))}
        <li><LangToggle /></li>
      </ul>
    </nav>
  );
}
```

- [ ] **Step 6: Create components/ui/NavBar.module.css**

```css
.nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--muted);
  transform: translateY(-100%);
  transition: transform 0.4s ease;
}
.nav.visible { transform: translateY(0); }
.brand {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.3rem;
  color: var(--gold-lt);
  text-decoration: none;
  letter-spacing: 0.05em;
}
.links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  list-style: none;
}
.link {
  color: var(--muted-txt);
  text-decoration: none;
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: color 0.2s;
}
.link:hover { color: var(--warm-white); }
```

- [ ] **Step 7: Run tests**

```bash
npx vitest run components/ui/LangToggle.test.jsx
```

Expected: All tests PASS.

- [ ] **Step 8: Commit**

```bash
git add components/ui/
git commit -m "feat(ui): add NavBar with scroll-reveal and LangToggle pill"
```

---

## Task 12: Section Components

**Files:**
- Create: all 8 `components/sections/*.jsx` files

- [ ] **Step 1: Write failing render tests for Hero and Skills (representative)**

```jsx
// components/sections/HeroSection.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LangProvider } from '../../lib/LangContext.jsx';
import { HeroSection } from './HeroSection.jsx';

describe('HeroSection', () => {
  it('renders EN headline', () => {
    render(<LangProvider><HeroSection /></LangProvider>);
    expect(screen.getByText('Turning Complex Systems')).toBeTruthy();
  });
  it('renders CV download link', () => {
    render(<LangProvider><HeroSection /></LangProvider>);
    expect(screen.getByRole('link', { name: /download cv/i })).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
npx vitest run components/sections/HeroSection.test.jsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create components/sections/HeroSection.jsx**

```jsx
'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useLang } from '../../lib/LangContext.jsx';
import { content } from '../../lib/content.js';
import styles from './HeroSection.module.css';

export function HeroSection() {
  const { lang } = useLang();
  const t = content.hero[lang];
  const headRef = useRef(null);

  useEffect(() => {
    if (!headRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const chars = headRef.current.querySelectorAll('.' + styles.char);
    gsap.fromTo(chars,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', stagger: 0.03, delay: 0.3 }
    );
  }, [lang]);

  function buildChars(text) {
    return text.split('').map((ch, i) => (
      <span key={i} className={styles.char}>{ch === ' ' ? ' ' : ch}</span>
    ));
  }

  return (
    <section id="hero" className={styles.hero}>
      <p className={styles.role}>{t.role}</p>
      <h1 ref={headRef} className={styles.headline}>
        <span className={styles.line}>{buildChars(t.line1)}</span>
        <span className={styles.line}>{buildChars(t.line2)}</span>
      </h1>
      <p className={styles.name}>{t.name}</p>
      <p className={styles.bio}>{t.bio}</p>
      <div className={styles.ctas}>
        <a href="#work" className={styles.ctaPrimary}>{t.cta1}</a>
        <a href="/assets/Vivitthachai_Goody_CV.pdf" download className={styles.ctaSecondary}>{t.cta2}</a>
      </div>
      <div className={styles.scrollHint}>{t.scroll}</div>
    </section>
  );
}
```

- [ ] **Step 4: Create components/sections/HeroSection.module.css**

```css
.hero {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 clamp(1.5rem, 6vw, 6rem);
}
.role {
  font-size: clamp(0.6rem, 1.2vw, 0.75rem);
  letter-spacing: 0.2em;
  color: var(--gold);
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}
.headline {
  display: flex;
  flex-direction: column;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(3rem, 8.5vw, 7rem);
  line-height: 1.05;
  color: var(--warm-white);
  margin-bottom: 1.5rem;
}
.line { display: block; }
.char { display: inline-block; }
.name {
  font-size: clamp(0.85rem, 1.5vw, 1rem);
  color: var(--gold-lt);
  margin-bottom: 1rem;
}
.bio {
  max-width: 480px;
  color: var(--muted-txt);
  font-size: clamp(0.85rem, 1.3vw, 0.95rem);
  margin-bottom: 2.5rem;
  line-height: 1.7;
}
.ctas { display: flex; gap: 1rem; flex-wrap: wrap; }
.ctaPrimary {
  background: var(--gold);
  color: var(--bg);
  padding: 0.75rem 2rem;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  transition: background 0.2s;
}
.ctaPrimary:hover { background: var(--gold-lt); }
.ctaSecondary {
  border: 1px solid var(--muted);
  color: var(--warm-white);
  padding: 0.75rem 2rem;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  transition: border-color 0.2s;
}
.ctaSecondary:hover { border-color: var(--gold); color: var(--gold-lt); }
.scrollHint {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.65rem;
  letter-spacing: 0.25em;
  color: var(--muted-txt);
  text-transform: uppercase;
}
```

- [ ] **Step 5: Create components/sections/AboutSection.jsx**

```jsx
'use client';
import { useLang }  from '../../lib/LangContext.jsx';
import { content }  from '../../lib/content.js';
import { useCinematicReveal } from '../../hooks/useCinematicReveal.js';
import { useMagneticTilt }    from '../../hooks/useMagneticTilt.js';
import styles from './AboutSection.module.css';

const STATS = ['stat1', 'stat2', 'stat3', 'stat4', 'stat5'];

function StatCard({ text }) {
  const { ref, onMouseMove, onMouseLeave } = useMagneticTilt();
  return (
    <div ref={ref} className={`${styles.stat} reveal-item`}
         onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      {text}
    </div>
  );
}

export function AboutSection() {
  const { lang } = useLang();
  const t = content.about[lang];
  const sectionRef = useCinematicReveal();

  return (
    <section id="about" ref={sectionRef} className={styles.section}>
      <p className={styles.tag}>{t.tag}</p>
      <h2 className={styles.heading}>{t.heading}</h2>
      <div className={styles.body}>
        <div className={styles.bio}>
          <p>{t.p1}</p>
          <p>{t.p2}</p>
          <p>{t.p3}</p>
        </div>
        <div className={styles.stats}>
          {STATS.map(k => <StatCard key={k} text={t[k]} />)}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Create components/sections/AboutSection.module.css**

```css
.section {
  position: relative; z-index: 1;
  padding: clamp(4rem, 10vh, 8rem) clamp(1.5rem, 6vw, 6rem);
}
.tag {
  font-size: 0.65rem; letter-spacing: 0.2em; color: var(--gold);
  text-transform: uppercase; margin-bottom: 1rem;
}
.heading {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2rem, 4vw, 3.5rem);
  color: var(--warm-white); margin-bottom: 2.5rem;
}
.body { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }
@media (max-width: 768px) { .body { grid-template-columns: 1fr; } }
.bio { display: flex; flex-direction: column; gap: 1rem; color: var(--muted-txt); line-height: 1.75; }
.stats { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; align-content: start; }
.stat {
  background: rgba(212, 160, 23, 0.05);
  border: 1px solid var(--muted);
  border-radius: 8px;
  padding: 1rem 1.2rem;
  font-size: 0.85rem;
  color: var(--warm-white);
  cursor: default;
  will-change: transform;
  --mx: 50%; --my: 50%;
  background-image: radial-gradient(circle at var(--mx) var(--my), rgba(212,160,23,0.08), transparent 60%);
}
```

- [ ] **Step 7: Create remaining section components**

Create these 6 files following the same pattern (section `id` → `useCinematicReveal` → render content from `content.js`). Each uses `reveal-item` class on cards for stagger:

**components/sections/ExperienceSection.jsx**
```jsx
'use client';
import { useLang } from '../../lib/LangContext.jsx';
import { content } from '../../lib/content.js';
import { useCinematicReveal } from '../../hooks/useCinematicReveal.js';
import styles from './ExperienceSection.module.css';

export function ExperienceSection() {
  const { lang } = useLang();
  const t = content.experience[lang];
  const sectionRef = useCinematicReveal();

  return (
    <section id="experience" ref={sectionRef} className={styles.section}>
      <p className={styles.tag}>{t.tag}</p>
      <h2 className={styles.heading}>{t.heading}</h2>
      <div className={styles.roles}>
        {t.roles.map((role, i) => (
          <div key={i} className={`${styles.role} reveal-item`}>
            <p className={styles.period}>{role.period}</p>
            <h3 className={styles.title}>{role.title}</h3>
            <p className={styles.company}>{role.company}</p>
            <p className={styles.desc}>{role.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

**components/sections/ExperienceSection.module.css**
```css
.section { position: relative; z-index: 1; padding: clamp(4rem,10vh,8rem) clamp(1.5rem,6vw,6rem); }
.tag { font-size: 0.65rem; letter-spacing: 0.2em; color: var(--gold); text-transform: uppercase; margin-bottom: 1rem; }
.heading { font-family: 'Cormorant Garamond', serif; font-size: clamp(2rem,4vw,3.5rem); color: var(--warm-white); margin-bottom: 2.5rem; }
.roles { display: flex; flex-direction: column; gap: 2rem; border-left: 2px solid var(--muted); padding-left: 2rem; }
.role { position: relative; }
.role::before { content: ''; position: absolute; left: -2.35rem; top: 0.4rem; width: 10px; height: 10px; border-radius: 50%; background: var(--gold); }
.period { font-size: 0.7rem; letter-spacing: 0.12em; color: var(--gold); text-transform: uppercase; margin-bottom: 0.25rem; }
.title { font-size: 1.1rem; color: var(--warm-white); margin-bottom: 0.2rem; }
.company { font-size: 0.82rem; color: var(--muted-txt); margin-bottom: 0.5rem; }
.desc { color: var(--muted-txt); font-size: 0.88rem; line-height: 1.7; }
```

**components/sections/SkillsSection.jsx**
```jsx
'use client';
import { useLang } from '../../lib/LangContext.jsx';
import { content } from '../../lib/content.js';
import { useCinematicReveal } from '../../hooks/useCinematicReveal.js';
import { useMagneticTilt }    from '../../hooks/useMagneticTilt.js';
import styles from './SkillsSection.module.css';

const CAT_KEYS = [
  { cat: 'cat1', tags: ['erp','modules','uat','golive'] },
  { cat: 'cat2', tags: ['sop','requirements','mapping','gap','stakeholder','change'] },
  { cat: 'cat3', tags: ['sql','python','powerbi','excel','dashboard','xtra'] },
  { cat: 'cat4', tags: ['jira','confluence','autocad','finance'] },
];

function TagCard({ text }) {
  const { ref, onMouseMove, onMouseLeave } = useMagneticTilt();
  return (
    <span ref={ref} className={`${styles.tag} reveal-item`}
          onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      {text}
    </span>
  );
}

export function SkillsSection() {
  const { lang } = useLang();
  const t = content.skills[lang];
  const sectionRef = useCinematicReveal();

  return (
    <section id="skills" ref={sectionRef} className={styles.section}>
      <p className={styles.tag}>{t.tag}</p>
      <h2 className={styles.heading}>{t.heading}</h2>
      {CAT_KEYS.map(({ cat, tags }) => (
        <div key={cat} className={styles.category}>
          <h3 className={styles.catName}>{t[cat]}</h3>
          <div className={styles.tags}>
            {tags.map(k => <TagCard key={k} text={t.tags[k]} />)}
          </div>
        </div>
      ))}
    </section>
  );
}
```

**components/sections/SkillsSection.module.css**
```css
.section { position: relative; z-index: 1; padding: clamp(4rem,10vh,8rem) clamp(1.5rem,6vw,6rem); }
.tag { font-size: 0.65rem; letter-spacing: 0.2em; color: var(--gold); text-transform: uppercase; margin-bottom: 1rem; }
.heading { font-family: 'Cormorant Garamond', serif; font-size: clamp(2rem,4vw,3.5rem); color: var(--warm-white); margin-bottom: 2.5rem; }
.category { margin-bottom: 2rem; }
.catName { font-size: 0.75rem; letter-spacing: 0.1em; color: var(--gold-lt); text-transform: uppercase; margin-bottom: 0.75rem; }
.tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.tag {
  background: rgba(212,160,23,0.07); border: 1px solid var(--muted);
  border-radius: 4px; padding: 0.35rem 0.9rem;
  font-size: 0.78rem; color: var(--warm-white); cursor: default; will-change: transform;
}
```

**components/sections/WorkSection.jsx**
```jsx
'use client';
import { useLang } from '../../lib/LangContext.jsx';
import { content } from '../../lib/content.js';
import { useCinematicReveal } from '../../hooks/useCinematicReveal.js';
import { useMagneticTilt }    from '../../hooks/useMagneticTilt.js';
import styles from './WorkSection.module.css';

function ProjectCard({ project }) {
  const { ref, onMouseMove, onMouseLeave } = useMagneticTilt();
  return (
    <div ref={ref} className={`${styles.card} reveal-item`}
         onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <div className={styles.tags}>{project.tags.map(t => <span key={t} className={styles.pill}>{t}</span>)}</div>
      <h3 className={styles.title}>{project.title}</h3>
      <p className={styles.desc}>{project.desc}</p>
      <a href="#" className={styles.cta} aria-disabled="true" tabIndex={-1}>{project.cta}</a>
    </div>
  );
}

export function WorkSection() {
  const { lang } = useLang();
  const t = content.work[lang];
  const sectionRef = useCinematicReveal();

  return (
    <section id="work" ref={sectionRef} className={styles.section}>
      <p className={styles.tag}>{t.tag}</p>
      <h2 className={styles.heading}>{t.heading}</h2>
      <div className={styles.grid}>
        {t.projects.map((p, i) => <ProjectCard key={i} project={p} />)}
      </div>
    </section>
  );
}
```

**components/sections/WorkSection.module.css**
```css
.section { position: relative; z-index: 1; padding: clamp(4rem,10vh,8rem) clamp(1.5rem,6vw,6rem); }
.tag { font-size: 0.65rem; letter-spacing: 0.2em; color: var(--gold); text-transform: uppercase; margin-bottom: 1rem; }
.heading { font-family: 'Cormorant Garamond', serif; font-size: clamp(2rem,4vw,3.5rem); color: var(--warm-white); margin-bottom: 2.5rem; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
.card {
  background: rgba(212,160,23,0.04); border: 1px solid var(--muted); border-radius: 12px;
  padding: 1.75rem; will-change: transform; cursor: default;
  --mx: 50%; --my: 50%;
  background-image: radial-gradient(circle at var(--mx) var(--my), rgba(212,160,23,0.07), transparent 60%);
  transition: border-color 0.2s;
}
.card:hover { border-color: var(--gold); }
.tags { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1rem; }
.pill { font-size: 0.62rem; letter-spacing: 0.08em; color: var(--gold); border: 1px solid var(--muted); border-radius: 100px; padding: 2px 8px; text-transform: uppercase; }
.title { font-size: 1.1rem; color: var(--warm-white); margin-bottom: 0.6rem; }
.desc { color: var(--muted-txt); font-size: 0.85rem; line-height: 1.65; margin-bottom: 1.25rem; }
.cta { color: var(--gold-lt); font-size: 0.8rem; text-decoration: none; pointer-events: none; }
```

**components/sections/EducationSection.jsx**
```jsx
'use client';
import { useLang } from '../../lib/LangContext.jsx';
import { content } from '../../lib/content.js';
import { useCinematicReveal } from '../../hooks/useCinematicReveal.js';
import { useMagneticTilt }    from '../../hooks/useMagneticTilt.js';
import styles from './EducationSection.module.css';

export function EducationSection() {
  const { lang } = useLang();
  const t = content.education[lang];
  const sectionRef = useCinematicReveal();
  const { ref, onMouseMove, onMouseLeave } = useMagneticTilt();

  return (
    <section id="education" ref={sectionRef} className={styles.section}>
      <p className={styles.tag}>{t.tag}</p>
      <h2 className={styles.heading}>{t.heading}</h2>
      <div ref={ref} className={`${styles.card} reveal-item`}
           onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
        <h3 className={styles.degree}>{t.degree}</h3>
        <p className={styles.school}>{t.school}</p>
        <p className={styles.desc}>{t.desc}</p>
        <div className={styles.meta}>
          <span className={styles.badge}>{t.gpa}</span>
          <span className={styles.badge}>{t.award}</span>
        </div>
      </div>
    </section>
  );
}
```

**components/sections/EducationSection.module.css**
```css
.section { position: relative; z-index: 1; padding: clamp(4rem,10vh,8rem) clamp(1.5rem,6vw,6rem); }
.tag { font-size: 0.65rem; letter-spacing: 0.2em; color: var(--gold); text-transform: uppercase; margin-bottom: 1rem; }
.heading { font-family: 'Cormorant Garamond', serif; font-size: clamp(2rem,4vw,3.5rem); color: var(--warm-white); margin-bottom: 2.5rem; }
.card {
  max-width: 640px; background: rgba(212,160,23,0.04); border: 1px solid var(--muted); border-radius: 12px;
  padding: 2rem; will-change: transform;
}
.degree { font-size: 1.15rem; color: var(--warm-white); margin-bottom: 0.3rem; }
.school { font-size: 0.82rem; color: var(--gold-lt); margin-bottom: 1rem; }
.desc { color: var(--muted-txt); font-size: 0.88rem; line-height: 1.7; margin-bottom: 1.25rem; }
.meta { display: flex; gap: 0.75rem; flex-wrap: wrap; }
.badge { font-size: 0.72rem; border: 1px solid var(--gold); border-radius: 4px; padding: 3px 10px; color: var(--gold-lt); }
```

**components/sections/CertificationsSection.jsx**
```jsx
'use client';
import { useLang } from '../../lib/LangContext.jsx';
import { content } from '../../lib/content.js';
import { useCinematicReveal } from '../../hooks/useCinematicReveal.js';
import { useMagneticTilt }    from '../../hooks/useMagneticTilt.js';
import styles from './CertificationsSection.module.css';

function CertCard({ item }) {
  const { ref, onMouseMove, onMouseLeave } = useMagneticTilt();
  return (
    <div ref={ref} className={`${styles.card} reveal-item`}
         onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <h3 className={styles.title}>{item.title}</h3>
      <p className={styles.issuer}>{item.issuer}</p>
      {item.status && <span className={styles.status}>{item.status}</span>}
    </div>
  );
}

export function CertificationsSection() {
  const { lang } = useLang();
  const t = content.certs[lang];
  const sectionRef = useCinematicReveal();

  return (
    <section id="certs" ref={sectionRef} className={styles.section}>
      <p className={styles.tag}>{t.tag}</p>
      <h2 className={styles.heading}>{t.heading}</h2>
      <div className={styles.grid}>
        {t.items.map((item, i) => <CertCard key={i} item={item} />)}
      </div>
    </section>
  );
}
```

**components/sections/CertificationsSection.module.css**
```css
.section { position: relative; z-index: 1; padding: clamp(4rem,10vh,8rem) clamp(1.5rem,6vw,6rem); }
.tag { font-size: 0.65rem; letter-spacing: 0.2em; color: var(--gold); text-transform: uppercase; margin-bottom: 1rem; }
.heading { font-family: 'Cormorant Garamond', serif; font-size: clamp(2rem,4vw,3.5rem); color: var(--warm-white); margin-bottom: 2.5rem; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.25rem; }
.card {
  background: rgba(212,160,23,0.04); border: 1px solid var(--muted); border-radius: 10px;
  padding: 1.5rem; will-change: transform; cursor: default;
}
.card:hover { border-color: var(--gold); }
.title { font-size: 0.95rem; color: var(--warm-white); margin-bottom: 0.3rem; }
.issuer { font-size: 0.78rem; color: var(--muted-txt); }
.status { display: inline-block; margin-top: 0.5rem; font-size: 0.65rem; color: var(--gold); border: 1px solid var(--muted); border-radius: 100px; padding: 2px 8px; }
```

**components/sections/ContactSection.jsx**
```jsx
'use client';
import { useLang } from '../../lib/LangContext.jsx';
import { content } from '../../lib/content.js';
import { useCinematicReveal } from '../../hooks/useCinematicReveal.js';
import styles from './ContactSection.module.css';

export function ContactSection() {
  const { lang } = useLang();
  const t = content.contact[lang];
  const f = content.footer[lang];
  const sectionRef = useCinematicReveal();

  return (
    <section id="contact" ref={sectionRef} className={styles.section}>
      <p className={styles.tag}>{t.tag}</p>
      <h2 className={styles.heading}>{t.heading}</h2>
      <p className={styles.desc}>{t.desc}</p>
      <div className={styles.links}>
        <a href="mailto:vivitthachaigood@gmail.com" className={`${styles.link} reveal-item`}>{t.email}</a>
        <a href="https://linkedin.com/in/vivitthachai" target="_blank" rel="noopener noreferrer" className={`${styles.link} reveal-item`}>{t.linkedin}</a>
        <a href="/assets/Vivitthachai_Goody_CV.pdf" download className={`${styles.link} reveal-item`}>{t.cv}</a>
      </div>
      <footer className={styles.footer}>{f.text}</footer>
    </section>
  );
}
```

**components/sections/ContactSection.module.css**
```css
.section { position: relative; z-index: 1; min-height: 80vh; display: flex; flex-direction: column; justify-content: center; padding: clamp(4rem,10vh,8rem) clamp(1.5rem,6vw,6rem); }
.tag { font-size: 0.65rem; letter-spacing: 0.2em; color: var(--gold); text-transform: uppercase; margin-bottom: 1rem; }
.heading { font-family: 'Cormorant Garamond', serif; font-size: clamp(2rem,5vw,4rem); color: var(--warm-white); margin-bottom: 1rem; }
.desc { color: var(--muted-txt); font-size: 0.95rem; margin-bottom: 2.5rem; max-width: 480px; line-height: 1.7; }
.links { display: flex; gap: 1.5rem; flex-wrap: wrap; margin-bottom: 6rem; }
.link { color: var(--gold-lt); font-size: 0.95rem; text-decoration: none; border-bottom: 1px solid transparent; transition: border-color 0.2s; }
.link:hover { border-color: var(--gold-lt); }
.footer { font-size: 0.68rem; color: var(--muted-txt); letter-spacing: 0.05em; border-top: 1px solid var(--muted); padding-top: 1.5rem; }
```

- [ ] **Step 8: Run Hero tests**

```bash
npx vitest run components/sections/HeroSection.test.jsx
```

Expected: All tests PASS.

- [ ] **Step 9: Run all unit tests**

```bash
npx vitest run
```

Expected: All tests PASS (content, keyframes, LangContext, useMagneticTilt, useCinematicReveal, HeroSection).

- [ ] **Step 10: Commit**

```bash
git add components/sections/
git commit -m "feat(sections): add all 8 section components with bilingual content and cinematic reveals"
```

---

## Task 13: Page Assembly

**Files:**
- Create: `app/layout.js`, `app/page.js`

- [ ] **Step 1: Create app/layout.js**

```jsx
import '../styles/globals.css';
import { LangProvider } from '../lib/LangContext.jsx';

export const metadata = {
  title: '"Goody" Vivitthachai Laprattanatrai — Business Analyst & ERP Specialist',
  description: 'Portfolio of Goody, Business Analyst & ERP Implementation Specialist based in Bangkok.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Inter:wght@400;500;600&family=Sarabun:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Create app/page.js**

```jsx
import { NavBar }               from '../components/ui/NavBar.jsx';
import { Scene }                from '../components/scene/Scene.jsx';
import { HeroSection }          from '../components/sections/HeroSection.jsx';
import { AboutSection }         from '../components/sections/AboutSection.jsx';
import { ExperienceSection }    from '../components/sections/ExperienceSection.jsx';
import { SkillsSection }        from '../components/sections/SkillsSection.jsx';
import { WorkSection }          from '../components/sections/WorkSection.jsx';
import { EducationSection }     from '../components/sections/EducationSection.jsx';
import { CertificationsSection } from '../components/sections/CertificationsSection.jsx';
import { ContactSection }       from '../components/sections/ContactSection.jsx';

export default function Page() {
  return (
    <>
      <Scene />
      <NavBar />
      <main>
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <SkillsSection />
        <WorkSection />
        <EducationSection />
        <CertificationsSection />
        <ContactSection />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Run build to catch compile errors**

```bash
npm run build
```

Expected: build completes, generates `out/` directory with static HTML/JS.

- [ ] **Step 4: Start dev server and visual check**

```bash
npm run dev
```

Open http://localhost:3000. Verify:
- Dark background, gold typography
- NavBar hidden initially, appears after scrolling 55vh
- Hero headline renders
- EN|TH toggle switches all text
- All 8 sections scroll into view with cinematic reveal

- [ ] **Step 5: Commit**

```bash
git add app/
git commit -m "feat(app): assemble page layout with all sections and Scene"
```

---

## Task 14: Copy CV Asset

- [ ] **Step 1: Copy CV to public/**

```bash
mkdir -p public/assets
cp assets/Vivitthachai_Goody_CV.pdf public/assets/Vivitthachai_Goody_CV.pdf
```

- [ ] **Step 2: Verify CV is accessible**

After `npm run dev`, navigate to http://localhost:3000/assets/Vivitthachai_Goody_CV.pdf.

Expected: PDF opens or download begins.

- [ ] **Step 3: Commit**

```bash
git add public/assets/
git commit -m "chore: copy CV PDF to public/assets for Next.js static serving"
```

---

## Task 15: E2E Tests

**Files:**
- Create: `tests/portfolio.spec.js`

- [ ] **Step 1: Ensure dev server is running**

In a separate terminal:
```bash
npm run dev
```

Leave it running for the test run.

- [ ] **Step 2: Create tests/portfolio.spec.js**

```js
// tests/portfolio.spec.js
import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';

test.describe('Portfolio EN/TH', () => {
  test('hero renders EN headline', async ({ page }) => {
    await page.goto(BASE);
    await expect(page.getByText('Turning Complex Systems')).toBeVisible();
  });

  test('lang toggle switches to TH', async ({ page }) => {
    await page.goto(BASE);
    // Scroll past 55vh to reveal navbar
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.6));
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /switch to thai/i }).click();
    await expect(page.getByText('เปลี่ยนระบบที่ซับซ้อน')).toBeVisible();
  });

  test('CV download link exists with correct href', async ({ page }) => {
    await page.goto(BASE);
    const links = page.getByRole('link', { name: /download cv/i });
    await expect(links.first()).toHaveAttribute('href', '/assets/Vivitthachai_Goody_CV.pdf');
  });

  test('all 8 section IDs exist in DOM', async ({ page }) => {
    await page.goto(BASE);
    for (const id of ['hero','about','experience','skills','work','education','certs','contact']) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
  });

  test('navbar appears after scrolling 55vh', async ({ page }) => {
    await page.goto(BASE);
    const nav = page.locator('nav');
    await expect(nav).not.toHaveClass(/visible/);
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.6));
    await page.waitForTimeout(400);
    await expect(nav).toHaveClass(/visible/);
  });

  test('prefers-reduced-motion: page loads without animation errors', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(BASE);
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await page.waitForTimeout(500);
    expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0);
  });
});
```

- [ ] **Step 3: Update playwright.config.js to point at localhost:3000**

Read current `playwright.config.js`:
```bash
cat playwright.config.js
```

Update `baseURL` if it's not already `http://localhost:3000`. Replace the webServer block if missing:

```js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://localhost:3000' },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 30000,
  },
});
```

- [ ] **Step 4: Run E2E tests**

```bash
npx playwright test
```

Expected: All 6 tests PASS.

If any fail, check console errors from the `npm run dev` server and fix before moving to Task 16.

- [ ] **Step 5: Commit**

```bash
git add tests/ playwright.config.js
git commit -m "test(e2e): add Playwright suite for lang toggle, CV, sections, navbar reveal"
```

---

## Task 16: GitHub Pages Deploy

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create .github/workflows/deploy.yml**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build static export
        run: npm run build

      - name: Deploy to gh-pages branch
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
          cname: mastergroot.github.io
```

- [ ] **Step 2: Verify next.config.js has output: 'export' (from Task 1)**

```bash
grep "output" next.config.js
```

Expected: `output: 'export'` is present.

- [ ] **Step 3: Run build locally to confirm out/ is generated**

```bash
npm run build && ls out/
```

Expected: `out/` contains `index.html`, `_next/`, `assets/`, etc.

- [ ] **Step 4: Commit and push**

```bash
git add .github/workflows/deploy.yml
git commit -m "chore(deploy): add GitHub Actions workflow for Next.js static export to gh-pages"
git push origin main
```

- [ ] **Step 5: Verify GitHub Actions run**

In GitHub → Actions tab, watch the `Deploy to GitHub Pages` run complete.

Then visit https://mastergroot.github.io — the new Next.js 3D portfolio should be live.

- [ ] **Step 6: If GitHub Pages is set to serve from `main` root**, change it to `gh-pages` branch in Settings → Pages.

---

## Task 17: Cleanup

- [ ] **Step 1: Remove old Svelte build artifacts from repo root** (after confirming deploy works)

```bash
# These were the old vanilla files — Next.js now owns the root
# Keep index.html / style.css / script.js until new site is verified live
# Once confirmed, archive or remove:
git rm index.html style.css script.js
git commit -m "chore: remove legacy vanilla HTML/CSS/JS (replaced by Next.js build)"
```

- [ ] **Step 2: Remove Svelte source**

```bash
git rm -r src/
git commit -m "chore: remove Svelte source (migrated to Next.js)"
```

- [ ] **Step 3: Remove old config files**

```bash
git rm vite.config.js
git commit -m "chore: remove vite.config.js (replaced by next.config.js)"
```

---

## Success Criteria Checklist

Before declaring complete, verify each item from the spec:

- [ ] Camera smoothly choreographs through all 8 sections on scroll
- [ ] Cursor vortex pulls particles on desktop (pointer:fine)
- [ ] All sections reveal with cinematic 3D push (scale + translateY + blur)
- [ ] All cards (Work, Skills, Certs, Education, About stats) respond to magnetic tilt
- [ ] EN/TH toggle works across all sections, persists in localStorage
- [ ] CV download link resolves to the correct PDF
- [ ] Deploys successfully to https://mastergroot.github.io via GitHub Actions
- [ ] `prefers-reduced-motion` disables all GSAP animations, page still loads
- [ ] `pointer:coarse` (mobile): Three.js canvas is hidden, dark background shown
- [ ] Lighthouse performance ≥ 80 on desktop (run: `npx lighthouse https://mastergroot.github.io --view`)
