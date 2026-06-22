# Portfolio Visual Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the 3D portfolio fly-through from functional prototype to premium dark-gold cinematic experience — loader, custom cursor, animated overlay, glassmorphic detail panels.

**Architecture:** Focused refinement — no camera/zone/test changes. Add 6 new files, edit 10 existing. Each task is independently testable. Execution order matters: tokens → 3D scene → data → loader → cursor → LangToggle → overlay → panel.

**Tech Stack:** Next.js 14 App Router, React Three Fiber, @react-three/postprocessing, motion/react, CSS Modules, Vitest + @testing-library/react

## Global Constraints

- All colors: use tokens from `styles/globals.css` (`--gold`, `--bg`, etc.) — never hardcode hex in components
- All animations: gate behind `window.matchMedia('(prefers-reduced-motion: reduce)').matches`
- Custom cursor and magnetic dots: gate behind `@media (pointer: fine)` — touch devices unaffected
- Font family: Cormorant Garamond (headings) / Montserrat (UI/body) — already loaded in `app/layout.js`
- Thai font: Sarabun — already loaded; apply via `body.lang-th` class
- `motion/react` imports: always from `'motion/react'`, never `'framer-motion'`
- Test runner: `npm test` (Vitest); E2E excluded from unit runs
- No changes to: `hooks/useFlightProgress.js`, `lib/zones.js`, `lib/LangContext.jsx`, `components/scene/CameraRig.jsx`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `styles/globals.css` | Edit | Replace cyan tokens with gold system, add cursor:none |
| `app/layout.js` | Edit | Mount `<Cursor />` globally |
| `app/page.js` | Edit | Loader gate — show 3D only after loader completes |
| `components/scene/SceneInner.jsx` | Edit | Warm lighting, bloom upgrade, ChromaticAberration |
| `components/scene/NodeGraph.jsx` | Edit | Wire + node colors → gold |
| `components/scene/ParticleField.jsx` | Edit | Core size + dust opacity tweak |
| `components/ui/LangToggle.jsx` | Edit | Add `data-cursor="hover"` |
| `components/ui/LangToggle.module.css` | Edit | Glass pill style |
| `components/ui/Overlay.jsx` | Edit | New logo, animated text, bottom bar, magnetic dots, tooltip, panel trigger |
| `components/ui/Overlay.module.css` | Edit | Full redesign |
| `components/ui/Loader.jsx` | Create | Animated loader — name, counter, gold bar |
| `components/ui/Loader.module.css` | Create | Loader styles |
| `components/ui/Cursor.jsx` | Create | Custom gold cursor — dot + lagged ring |
| `components/ui/DetailPanel.jsx` | Create | Glassmorphic slide-in panel per zone |
| `components/ui/DetailPanel.module.css` | Create | Panel styles |
| `lib/content.js` | Create | All EN/TH panel content strings for 8 zones |

---

## Task 1: Design Tokens

> **Agent model:** `claude-haiku-4-5-20251001`
> **Plugin:** `ui-ux-pro-max` (token reference — no invocation needed, use spec values)
> **MCP:** none

**Files:**
- Modify: `styles/globals.css`

**Interfaces:**
- Produces: CSS custom properties used by every other task — `--bg`, `--gold`, `--gold-lt`, `--gold-dk`, `--text-pri`, `--text-muted`, `--glass-bg`, `--glass-border`, `--gold-glow`

- [ ] **Step 1: Replace globals.css `:root` block**

Replace the entire `:root { ... }` block with:

```css
:root {
  --bg:           #060504;
  --gold:         #F59E0B;
  --gold-lt:      #FCD34D;
  --gold-dk:      #D97706;
  --text-pri:     rgba(255, 255, 255, 0.92);
  --text-muted:   rgba(255, 255, 255, 0.35);
  --glass-bg:     rgba(6, 5, 4, 0.88);
  --glass-border: rgba(245, 158, 11, 0.18);
  --gold-glow:    0 0 30px rgba(245, 158, 11, 0.25);
  --transition:   200ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

- [ ] **Step 2: Update body background**

Change `background: var(--bg);` — already uses the token, no change needed.
Change `color: var(--text-main)` → `color: var(--text-pri)` in the `body` rule.

- [ ] **Step 3: Add cursor:none scoped to pointer:fine**

Add after the `body` block:

```css
@media (pointer: fine) {
  body { cursor: none; }
}
```

- [ ] **Step 4: Verify no broken references**

Run: `npm test`
Expected: all existing tests pass (no CSS token assertions in unit tests, so this is a smoke check).

- [ ] **Step 5: Commit**

```bash
git add styles/globals.css
git commit -m "style: replace cyan tokens with dark-gold design system"
```

---

## Task 2: 3D Scene Unification

> **Agent model:** `claude-opus-4-8`
> **Plugin:** `core-3d-animation:react-three-fiber-architect` — invoke before editing R3F files to get patterns for `useFrame`, postprocessing, and ref-based effect mutation
> **MCP:** `mcp__ide__getDiagnostics` — run after each file edit to catch JSX/import errors

**Files:**
- Modify: `components/scene/NodeGraph.jsx`
- Modify: `components/scene/SceneInner.jsx`
- Modify: `components/scene/ParticleField.jsx`

**Interfaces:**
- Consumes: `--gold (#F59E0B)`, `--gold-lt (#FCD34D)`, `--gold-dk (#D97706)` from Task 1
- Consumes: `flightProgress.zoneIndex` (ref, integer 0-7) from `useFlightProgress`
- Produces: visually unified gold 3D scene; `ChromaticAberration` spikes on zone change

- [ ] **Step 1: Update NodeGraph colors**

In `components/scene/NodeGraph.jsx`, change the module-level constants:

```js
// Line ~19: change WIRE_MAT color
const WIRE_MAT = new THREE.LineBasicMaterial({
  color: 0xF59E0B,   // was 0x88CCFF
  transparent: true,
  opacity: 0.40,     // was 0.58
});
```

In the `instancedMesh` JSX (~line 72), change `meshBasicMaterial`:
```jsx
<meshBasicMaterial color={0xD97706} wireframe transparent opacity={0.6} />
```

In the `pointsMaterial` JSX (~line 83), change color:
```jsx
<pointsMaterial
  size={0.55}
  map={nodeTex}
  blending={THREE.AdditiveBlending}
  depthWrite={false}
  color={0xFCD34D}   // was 0xCCE8FF
  transparent
  opacity={1}
  sizeAttenuation
/>
```

Also update `makeNodeTex` gradient stops to warm gold (replace the rgba values in the radial gradient):
```js
function makeNodeTex() {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0,    'rgba(255, 210, 100, 1)');
  g.addColorStop(0.15, 'rgba(245, 158, 11, .95)');
  g.addColorStop(0.35, 'rgba(220, 120, 0, .6)');
  g.addColorStop(0.6,  'rgba(180, 80, 0, .15)');
  g.addColorStop(1,    'rgba(0, 0, 0, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}
```

- [ ] **Step 2: Run diagnostics on NodeGraph**

Run MCP tool `mcp__ide__getDiagnostics` on `components/scene/NodeGraph.jsx`.
Expected: 0 errors.

- [ ] **Step 3: Update SceneInner — background + lighting**

In `components/scene/SceneInner.jsx`, change the color attach and all three directionalLight elements:

```jsx
<color attach="background" args={['#060504']} />   {/* was #050505 */}

<directionalLight color="#FFB347" intensity={0.6} position={[5, 8, 6]} />    {/* warm amber key */}
<directionalLight color="#FF8C00" intensity={0.25} position={[-4, -2, 8]} /> {/* orange fill */}
<directionalLight color="#FFF8E7" intensity={0.7} position={[-2, 3, -8]} />  {/* warm white rim */}
```

- [ ] **Step 4: Update SceneInner — Bloom parameters**

Replace the `<Bloom>` element:

```jsx
<Bloom
  luminanceThreshold={0.55}
  luminanceSmoothing={0.9}
  intensity={0.9}
  mipmapBlur={true}
/>
```

Replace the `<Vignette>` element:

```jsx
<Vignette offset={0.15} darkness={0.75} eskil={false} />
```

- [ ] **Step 5: Add ChromaticAberration to SceneInner**

Add imports at top of file:

```jsx
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { useMemo, useRef } from 'react';
import { Vector2 } from 'three';
import { useFrame } from '@react-three/fiber';
```

Add `ZoneWatcher` component (place before `SceneInner` export):

```jsx
function ZoneWatcher({ flightProgress, caOffset }) {
  const prevZone = useRef(0);
  const timeoutRef = useRef(null);

  useFrame(() => {
    const zi = flightProgress.zoneIndex.current;
    if (zi !== prevZone.current) {
      prevZone.current = zi;
      caOffset.set(0.003, 0.003);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => caOffset.set(0, 0), 300);
    }
  });

  return null;
}
```

Inside `SceneInner` function body, add before return:

```jsx
const caOffset = useMemo(() => new Vector2(0, 0), []);
```

Inside the `<Canvas>` JSX, add `ZoneWatcher` and `ChromaticAberration` — final Canvas structure:

```jsx
<Canvas
  style={{ position: 'fixed', inset: 0, zIndex: 0 }}
  camera={{ position: [0, 0, 0], fov: 75 }}
  gl={{ antialias: false, alpha: false }}
>
  <color attach="background" args={['#060504']} />

  <directionalLight color="#FFB347" intensity={0.6} position={[5, 8, 6]} />
  <directionalLight color="#FF8C00" intensity={0.25} position={[-4, -2, 8]} />
  <directionalLight color="#FFF8E7" intensity={0.7} position={[-2, 3, -8]} />

  <Suspense fallback={null}>
    <CameraRig flightProgress={flightProgress} />
    <NodeGraph />
    <ParticleField />
    <ZoneWatcher flightProgress={flightProgress} caOffset={caOffset} />
    <EffectComposer>
      <Bloom
        luminanceThreshold={0.55}
        luminanceSmoothing={0.9}
        intensity={0.9}
        mipmapBlur={true}
      />
      <Vignette offset={0.15} darkness={0.75} eskil={false} />
      <ChromaticAberration offset={caOffset} />
    </EffectComposer>
  </Suspense>
</Canvas>
```

- [ ] **Step 6: Update ParticleField minor tweaks**

In `components/scene/ParticleField.jsx`, change the core `pointsMaterial size` (line ~108):
```jsx
size={0.50}   // was 0.55
```

Change dust layer `pointsMaterial opacity` (line ~124):
```jsx
opacity={0.40}   // was 0.55
```

- [ ] **Step 7: Run diagnostics on all 3 files**

Run `mcp__ide__getDiagnostics` on `components/scene/SceneInner.jsx`.
Expected: 0 errors. If `ChromaticAberration` import not found, check postprocessing package exports.

Run `npm test` — expected: all 34 tests pass (scene components have no unit tests, smoke check only).

- [ ] **Step 8: Commit**

```bash
git add components/scene/NodeGraph.jsx components/scene/SceneInner.jsx components/scene/ParticleField.jsx
git commit -m "feat(scene): unify to dark-gold — node/wire colors, warm lighting, bloom+CA upgrade"
```

---

## Task 3: Content Data

> **Agent model:** `claude-haiku-4-5-20251001`
> **Plugin:** none
> **MCP:** none
> **Note:** Review EN/TH strings with Goody before shipping — company names and project details marked `[REPLACE]` must be updated.

**Files:**
- Create: `lib/content.js`
- Create: `lib/content.test.js`

**Interfaces:**
- Produces: `CONTENT` array (length 8), each element has `{ label, title, sub, body }` — `body` is zone-specific object

- [ ] **Step 1: Write the failing test**

Create `lib/content.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { CONTENT } from './content.js';

describe('CONTENT', () => {
  it('has exactly 8 zones', () => {
    expect(CONTENT).toHaveLength(8);
  });

  it('every zone has en+th label, title, sub', () => {
    CONTENT.forEach((zone, i) => {
      expect(zone.label.en, `zone ${i} label.en`).toBeTruthy();
      expect(zone.label.th, `zone ${i} label.th`).toBeTruthy();
      expect(zone.title.en, `zone ${i} title.en`).toBeTruthy();
      expect(zone.title.th, `zone ${i} title.th`).toBeTruthy();
    });
  });

  it('zone 0 has ctaLinks array', () => {
    expect(Array.isArray(CONTENT[0].body.ctaLinks)).toBe(true);
    expect(CONTENT[0].body.ctaLinks.length).toBeGreaterThan(0);
  });

  it('zone 1 has stats array with 3 items', () => {
    expect(CONTENT[1].body.stats).toHaveLength(3);
    CONTENT[1].body.stats.forEach(s => {
      expect(s.value.en).toBeTruthy();
      expect(s.label.en).toBeTruthy();
    });
  });

  it('zone 2 has roles array', () => {
    expect(Array.isArray(CONTENT[2].body.roles)).toBe(true);
  });

  it('zone 7 contact has email', () => {
    expect(CONTENT[7].body.email).toBe('vivitthachaigood@gmail.com');
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

Run: `npm test -- lib/content.test.js`
Expected: FAIL — `Cannot find module './content.js'`

- [ ] **Step 3: Create lib/content.js**

```js
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
```

- [ ] **Step 4: Run test — expect PASS**

Run: `npm test -- lib/content.test.js`
Expected: 6 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/content.js lib/content.test.js
git commit -m "feat(data): add lib/content.js — all 8 zone EN/TH panel strings"
```

---

## Task 4: Loader Component

> **Agent model:** `claude-sonnet-4-6`
> **Plugin:** `motion-framer` — invoke before writing animation code; use `animate()` from `motion/react` for counter and fade sequences
> **MCP:** `mcp__magic__21st_magic_component_builder` — use to generate initial Loader markup/styles, then refine to match spec exactly

**Files:**
- Create: `components/ui/Loader.jsx`
- Create: `components/ui/Loader.module.css`
- Modify: `app/page.js`

**Interfaces:**
- Consumes: nothing from previous tasks at runtime
- Produces: `<Loader onComplete={fn} />` — calls `onComplete` after animation (~2.2s); skips to done in reduced-motion

- [ ] **Step 1: Write failing test**

Create `components/ui/Loader.test.jsx`:

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { Loader } from './Loader.jsx';

describe('Loader', () => {
  it('renders name and role text', () => {
    render(<Loader onComplete={() => {}} />);
    expect(screen.getByTestId('loader-name')).toBeDefined();
    expect(screen.getByTestId('loader-role')).toBeDefined();
  });

  it('calls onComplete', async () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    render(<Loader onComplete={onComplete} />);
    await act(() => vi.advanceTimersByTime(3000));
    expect(onComplete).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

Run: `npm test -- components/ui/Loader.test.jsx`
Expected: FAIL — `Cannot find module './Loader.jsx'`

- [ ] **Step 3: Create Loader.jsx**

```jsx
'use client';
import { useEffect, useState, useRef } from 'react';
import { animate } from 'motion/react';
import styles from './Loader.module.css';

export function Loader({ onComplete }) {
  const [count, setCount] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    const reduced = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      const t = setTimeout(() => { if (!doneRef.current) { doneRef.current = true; onComplete(); } }, 400);
      return () => clearTimeout(t);
    }

    const controls = animate(0, 100, {
      duration: 1.5,
      delay: 0.3,
      ease: [0.4, 0, 0.6, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => {
        setTimeout(() => setFadingOut(true), 100);
        setTimeout(() => { if (!doneRef.current) { doneRef.current = true; onComplete(); } }, 400);
      },
    });

    return () => controls.stop();
  }, [onComplete]);

  return (
    <div className={`${styles.loader} ${fadingOut ? styles.fadingOut : ''}`}>
      <div className={styles.center}>
        <p className={styles.name} data-testid="loader-name">
          VIVITTHACHAI LAPRATTANATRAI
        </p>
        <p className={styles.role} data-testid="loader-role">
          BUSINESS ANALYST · ERP · DATA
        </p>
      </div>
      <p className={styles.counter}>{String(count).padStart(3, '0')}</p>
      <div className={styles.barTrack}>
        <div className={styles.bar} style={{ width: `${count}%` }} />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create Loader.module.css**

```css
.loader {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: #060504;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease-in;
}

.fadingOut {
  opacity: 0;
  pointer-events: none;
}

.center {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.name {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 200;
  font-size: clamp(1.1rem, 4vw, 2rem);
  letter-spacing: 0.35em;
  color: rgba(255, 255, 255, 0.85);
  animation: fadeUp 0.6s ease-out forwards;
}

.role {
  font-family: 'Montserrat', sans-serif;
  font-weight: 400;
  font-size: 11px;
  letter-spacing: 0.5em;
  color: var(--gold);
  animation: fadeUp 0.4s ease-out 0.2s both;
}

.counter {
  position: absolute;
  bottom: 2.5rem;
  left: 2rem;
  font-family: monospace;
  font-weight: 200;
  font-size: 4.5rem;
  line-height: 1;
  color: rgba(255, 255, 255, 0.12);
  user-select: none;
}

.barTrack {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(245, 158, 11, 0.12);
}

.bar {
  height: 100%;
  background: var(--gold);
  transition: width 50ms linear;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .name, .role { animation: none; opacity: 1; }
}
```

- [ ] **Step 5: Update app/page.js to gate on loader**

```jsx
'use client';
import { useState } from 'react';
import { Scene }   from '../components/scene/Scene.jsx';
import { Overlay } from '../components/ui/Overlay.jsx';
import { Loader }  from '../components/ui/Loader.jsx';
import { useFlightProgress } from '../hooks/useFlightProgress.js';

export default function Page() {
  const [loaded, setLoaded] = useState(false);
  const flightProgress = useFlightProgress();

  return (
    <>
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}
      {loaded && (
        <>
          <Scene flightProgress={flightProgress} />
          <Overlay flightProgress={flightProgress} />
        </>
      )}
    </>
  );
}
```

- [ ] **Step 6: Run tests — expect PASS**

Run: `npm test -- components/ui/Loader.test.jsx`
Expected: 2 tests pass.

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 7: Commit**

```bash
git add components/ui/Loader.jsx components/ui/Loader.module.css components/ui/Loader.test.jsx app/page.js
git commit -m "feat(ui): add Loader component — EverSwap-style counter + gold progress bar"
```

---

## Task 5: Custom Gold Cursor

> **Agent model:** `claude-sonnet-4-6`
> **Plugin:** `motion-framer` — invoke before writing cursor state transitions; use `animate()` from `motion/react` for click pulse
> **MCP:** `mcp__magic__21st_magic_component_builder` — use to scaffold initial cursor markup, then adjust to match spec

**Files:**
- Create: `components/ui/Cursor.jsx`
- Modify: `app/layout.js`

**Interfaces:**
- Consumes: `data-cursor="hover"` attribute on interactive elements (dot nav, zone title, panel close, LangToggle, CTAs)
- Produces: global `<Cursor />` — two fixed divs (dot + ring), pointer:fine only

- [ ] **Step 1: Write failing test**

Create `components/ui/Cursor.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Cursor } from './Cursor.jsx';

describe('Cursor', () => {
  it('renders dot and ring after mousemove', async () => {
    const { container } = render(<Cursor />);
    // Before any mousemove, cursor is hidden
    const dot = container.querySelector('[data-cursor-dot]');
    expect(dot).toBeNull();
    // Trigger mousemove
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
    // After mousemove, cursor elements should appear
    await new Promise(r => setTimeout(r, 50));
    expect(container.querySelector('[data-cursor-dot]')).toBeDefined();
    expect(container.querySelector('[data-cursor-ring]')).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

Run: `npm test -- components/ui/Cursor.test.jsx`
Expected: FAIL — `Cannot find module './Cursor.jsx'`

- [ ] **Step 3: Create Cursor.jsx**

```jsx
'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './Cursor.module.css';

export function Cursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const pos     = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const hover   = useRef(false);
  const [visible, setVisible] = useState(false);
  const rafRef  = useRef(null);

  useEffect(() => {
    function onMove(e) {
      pos.current = { x: e.clientX, y: e.clientY };
      hover.current = !!e.target.closest('[data-cursor="hover"]');
      if (!visible) setVisible(true);
    }

    function onDown() {
      if (!dotRef.current) return;
      const { x, y } = pos.current;
      dotRef.current.style.transform = `translate(${x - 4}px, ${y - 4}px) scale(0.6)`;
      setTimeout(() => {
        if (!dotRef.current) return;
        dotRef.current.style.transform = `translate(${x - 4}px, ${y - 4}px) scale(1.2)`;
        setTimeout(() => {
          if (!dotRef.current) return;
          dotRef.current.style.transform = `translate(${x - 4}px, ${y - 4}px) scale(1)`;
        }, 75);
      }, 75);
    }

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
    };
  }, [visible]);

  useEffect(() => {
    function tick() {
      const { x, y } = pos.current;
      const r = ringPos.current;
      r.x += (x - r.x) * 0.12;
      r.y += (y - r.y) * 0.12;

      if (dotRef.current && !dotRef.current.dataset.clicking) {
        const scale = hover.current ? 0 : 1;
        dotRef.current.style.transform = `translate(${x - 4}px, ${y - 4}px) scale(${scale})`;
      }
      if (ringRef.current) {
        const size   = hover.current ? 42 : 28;
        const half   = size / 2;
        const bgFill = hover.current ? 'rgba(245,158,11,0.08)' : 'transparent';
        ringRef.current.style.transform  = `translate(${r.x - half}px, ${r.y - half}px) scale(${hover.current ? 1.5 : 1})`;
        ringRef.current.style.width      = `${size}px`;
        ringRef.current.style.height     = `${size}px`;
        ringRef.current.style.background = bgFill;
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  if (!visible) return null;

  return (
    <>
      <div ref={dotRef}  className={styles.dot}  data-cursor-dot  />
      <div ref={ringRef} className={styles.ring} data-cursor-ring />
    </>
  );
}
```

Create `components/ui/Cursor.module.css`:

```css
.dot {
  position: fixed;
  top: 0; left: 0;
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--gold);
  pointer-events: none;
  z-index: 9999;
  transition: transform 0.08s ease, opacity 0.15s ease;
  will-change: transform;
}

.ring {
  position: fixed;
  top: 0; left: 0;
  width: 28px; height: 28px;
  border-radius: 50%;
  border: 1px solid rgba(245, 158, 11, 0.5);
  pointer-events: none;
  z-index: 9998;
  transition: width 0.2s ease, height 0.2s ease, background 0.2s ease;
  will-change: transform;
}

@media (pointer: coarse) {
  .dot, .ring { display: none; }
}
```

- [ ] **Step 4: Mount Cursor in layout.js**

Add `import { Cursor } from '../components/ui/Cursor.jsx';` to `app/layout.js`.

Add `<Cursor />` inside the `<body>` tag, before `<LangProvider>`:

```jsx
<body>
  <Cursor />
  <LangProvider>{children}</LangProvider>
</body>
```

- [ ] **Step 5: Run test — expect PASS**

Run: `npm test -- components/ui/Cursor.test.jsx`
Expected: 1 test passes.

Run: `npm test` — all tests pass.

- [ ] **Step 6: Commit**

```bash
git add components/ui/Cursor.jsx components/ui/Cursor.module.css components/ui/Cursor.test.jsx app/layout.js
git commit -m "feat(ui): add custom gold cursor — dot + lagged ring, hover/click states"
```

---

## Task 6: LangToggle Glass Pill

> **Agent model:** `claude-haiku-4-5-20251001`
> **Plugin:** `ui-ux-pro-max` — reference glass pill style (token: `--glass-bg`, `--glass-border`)
> **MCP:** `mcp__magic__21st_magic_component_refiner` — use to refine the glass pill CSS to match spec values exactly

**Files:**
- Modify: `components/ui/LangToggle.jsx`
- Modify: `components/ui/LangToggle.module.css`

**Interfaces:**
- Consumes: `--glass-bg`, `--glass-border`, `--gold` tokens from Task 1
- Produces: glass pill LangToggle with `data-cursor="hover"` for custom cursor detection

- [ ] **Step 1: Add data-cursor attribute to LangToggle button**

In `components/ui/LangToggle.jsx`, add `data-cursor="hover"` to the `<button>`:

```jsx
<button
  className={styles.pill}
  data-lang={lang}
  data-cursor="hover"
  aria-label={`Switch to ${next === 'th' ? 'Thai' : 'English'}`}
  onClick={() => setLang(next)}
>
```

- [ ] **Step 2: Replace LangToggle.module.css**

```css
.pill {
  background: rgba(6, 5, 4, 0.60);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(245, 158, 11, 0.20);
  border-radius: 20px;
  padding: 5px 12px;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  letter-spacing: 0.3em;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.pill:hover {
  border-color: rgba(245, 158, 11, 0.45);
  background: rgba(6, 5, 4, 0.80);
}

.pill:focus-visible {
  outline: 1px solid var(--gold);
  outline-offset: 2px;
}

.active {
  color: var(--gold);
  font-weight: 500;
}

.inactive {
  color: rgba(255, 255, 255, 0.30);
  font-weight: 400;
}

.divider {
  color: rgba(245, 158, 11, 0.20);
  margin: 0 3px;
}
```

- [ ] **Step 3: Run existing LangToggle tests — expect PASS**

Run: `npm test -- components/ui/LangToggle.test.jsx`
Expected: 2 tests pass — existing behavior unchanged.

- [ ] **Step 4: Commit**

```bash
git add components/ui/LangToggle.jsx components/ui/LangToggle.module.css
git commit -m "style(ui): LangToggle → glass pill with gold border"
```

---

## Task 7: Overlay Redesign

> **Agent model:** `claude-opus-4-8`
> **Plugin:** `motion-framer` — invoke before writing zone transition animations; use `animate()` from `motion/react` for text enter/exit sequences. Also invoke `frontend-design` for overlay layout patterns.
> **MCP:** `mcp__magic__21st_magic_component_refiner` — use to refine the center text block and bottom bar CSS. `mcp__ide__getDiagnostics` — run after full edit.

**Files:**
- Modify: `components/ui/Overlay.jsx`
- Modify: `components/ui/Overlay.module.css`

**⚠ Execution order:** Complete Task 8 (DetailPanel) before Task 7 — Overlay imports `DetailPanel.jsx`.

**Interfaces:**
- Consumes: `ZONES` from `lib/zones.js` — dot nav tooltip text
- Consumes: `flightProgress.progress` and `flightProgress.zoneIndex` refs
- Consumes: `<DetailPanel>` from Task 8
- Produces: `panelOpen` state, zone click → panel open

- [ ] **Step 1: Write overlay tests**

Create `components/ui/Overlay.test.jsx`:

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LangProvider } from '../../lib/LangContext.jsx';
import { Overlay } from './Overlay.jsx';

function makeProgress(p = 0, zi = 0) {
  return {
    progress:  { current: p },
    zoneIndex: { current: zi },
  };
}

function renderOverlay(p = 0, zi = 0) {
  return render(
    <LangProvider>
      <Overlay flightProgress={makeProgress(p, zi)} />
    </LangProvider>
  );
}

describe('Overlay', () => {
  it('renders VIVITTHACHAI logo', () => {
    renderOverlay();
    expect(screen.getByText('VIVITTHACHAI')).toBeDefined();
  });

  it('renders zone title from ZONES', () => {
    renderOverlay(0, 0);
    expect(screen.getByTestId('zone-title')).toBeDefined();
  });

  it('renders dot nav with 8 dots', () => {
    renderOverlay();
    const nav = screen.getByRole('navigation', { name: /section/i });
    expect(nav.querySelectorAll('button').length).toBe(8);
  });

  it('center text block is clickable (has role=button)', () => {
    renderOverlay();
    const center = screen.getByTestId('zone-center');
    expect(center.getAttribute('role')).toBe('button');
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

Run: `npm test -- components/ui/Overlay.test.jsx`
Expected: FAIL — missing imports (`CONTENT`, `DetailPanel`).

- [ ] **Step 3: Rewrite Overlay.jsx**

```jsx
'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { animate } from 'motion/react';
import { useLang } from '../../lib/LangContext.jsx';
import { LangToggle } from './LangToggle.jsx';
import { ZONES, TOTAL_DEPTH } from '../../lib/zones.js';
import { DetailPanel } from './DetailPanel.jsx';
import styles from './Overlay.module.css';

export function Overlay({ flightProgress }) {
  const { lang } = useLang();
  const [zoneIdx, setZoneIdx]     = useState(0);
  const [zone, setZone]           = useState(ZONES[0]);
  const [textVisible, setVisible] = useState(true);
  const [hintVisible, setHint]    = useState(true);
  const [pct, setPct]             = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);
  const [tooltipIdx, setTooltip]  = useState(null);
  const prevZone  = useRef(0);
  const rafRef    = useRef(null);
  const hintRef   = useRef(true);
  const labelRef  = useRef(null);
  const titleRef  = useRef(null);
  const subRef    = useRef(null);

  const animateIn = useCallback(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const els = [labelRef.current, titleRef.current, subRef.current].filter(Boolean);
    els.forEach((el, i) => {
      animate(el, { opacity: [0, 1], y: [i === 1 ? 12 : 8, 0] }, {
        duration: i === 1 ? 0.5 : 0.4,
        delay: i * 0.05,
        ease: 'easeOut',
      });
    });
  }, []);

  const animateOut = useCallback((cb) => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { cb(); return; }
    const els = [labelRef.current, titleRef.current, subRef.current].filter(Boolean);
    Promise.all(
      els.map((el, i) =>
        animate(el, { opacity: [1, 0], y: [0, -10] }, {
          duration: 0.22,
          delay: i * 0.03,
          ease: 'easeIn',
        }).finished
      )
    ).then(cb);
  }, []);

  useEffect(() => {
    function tick() {
      const p  = flightProgress.progress.current;
      const zi = flightProgress.zoneIndex.current;
      setPct(Math.round(p * 100));

      if (zi !== prevZone.current) {
        const nextZi = zi;
        prevZone.current = zi;
        animateOut(() => {
          setZone(ZONES[nextZi]);
          setZoneIdx(nextZi);
          setVisible(true);
          requestAnimationFrame(animateIn);
        });
      }
      if (p > 0.01 && hintRef.current) {
        hintRef.current = false;
        setHint(false);
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [flightProgress, animateIn, animateOut]);

  function jumpToZone(i) {
    const mid = Math.abs(ZONES[i].zMid) / TOTAL_DEPTH;
    flightProgress.progress.current  = mid;
    flightProgress.zoneIndex.current = i;
  }

  return (
    <div className={styles.overlay} data-testid="overlay">
      {/* Top navigation */}
      <div className={styles.topnav}>
        <span className={styles.logo}>VIVITTHACHAI</span>
        <LangToggle />
      </div>

      {/* Centered section text — click opens detail panel */}
      <div
        className={styles.center}
        data-testid="zone-center"
        data-cursor="hover"
        onClick={() => setPanelOpen(true)}
        style={{ pointerEvents: 'all', cursor: 'none' }}
        aria-label={`Open ${zone.title[lang]} details`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setPanelOpen(true)}
      >
        <p ref={labelRef} className={styles.label}>{zone.label[lang]}</p>
        <h1
          ref={titleRef}
          className={`${styles.title} ${lang === 'th' ? styles.titleTh : ''}`}
          data-testid="zone-title"
        >
          {zone.title[lang]}
        </h1>
        <p ref={subRef} className={styles.sub}>{zone.sub[lang]}</p>
      </div>

      {/* Scroll hint */}
      {hintVisible && (
        <div className={styles.hint} aria-hidden="true">
          ↕ SCROLL TO FLY THROUGH · MOVE MOUSE TO REPEL
        </div>
      )}

      {/* Bottom bar — wordmark + progress line + counter */}
      <div className={styles.bottomBar} aria-hidden="true">
        <span className={styles.wordmark}>GOODY</span>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${pct}%` }} />
        </div>
        <span className={styles.progressNum}>{String(pct).padStart(3, '0')}%</span>
      </div>

      {/* Dot navigation */}
      <nav className={styles.dotnav} aria-label="Section navigation">
        {ZONES.map((z, i) => (
          <div key={i} className={styles.dotWrap}
            onMouseEnter={() => setTooltip(i)}
            onMouseLeave={() => setTooltip(null)}
          >
            {tooltipIdx === i && (
              <span className={styles.tooltip} aria-hidden="true">
                {z.title[lang]}
              </span>
            )}
            <button
              className={`${styles.dot} ${i === zoneIdx ? styles.dotActive : ''}`}
              onClick={() => jumpToZone(i)}
              data-cursor="hover"
              aria-label={z.title.en}
              aria-current={i === zoneIdx ? 'true' : undefined}
            />
          </div>
        ))}
      </nav>

      {/* Detail panel */}
      {panelOpen && (
        <DetailPanel
          zoneIndex={zoneIdx}
          onClose={() => setPanelOpen(false)}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 4: Rewrite Overlay.module.css**

```css
.overlay {
  position: fixed;
  inset: 0;
  z-index: 10;
  pointer-events: none;
  font-family: 'Montserrat', system-ui, sans-serif;
}

/* Top nav */
.topnav {
  position: absolute;
  top: 0; left: 0; right: 0;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  pointer-events: all;
}

.logo {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 200;
  font-size: 13px;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.65);
  user-select: none;
}

/* Center text */
.center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  pointer-events: none;
}

.label {
  font-size: 10px;
  letter-spacing: 0.5em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 1.2rem;
  font-weight: 400;
}

.title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(3.5rem, 10vw, 7.5rem);
  font-weight: 200;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-pri);
  line-height: 1;
  margin: 0;
}

.titleTh {
  font-family: 'Sarabun', system-ui, sans-serif;
  font-style: normal;
}

.sub {
  margin-top: 1.5rem;
  font-size: 11px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.22);
}

/* Scroll hint */
.hint {
  position: absolute;
  bottom: 5rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.18);
  white-space: nowrap;
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.18; }
  50%       { opacity: 0.38; }
}

/* Bottom bar */
.bottomBar {
  position: absolute;
  bottom: 1.5rem;
  left: 2rem; right: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.wordmark {
  font-size: 9px;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.20);
  white-space: nowrap;
  flex-shrink: 0;
}

.progressTrack {
  flex: 1;
  height: 1px;
  background: rgba(245, 158, 11, 0.12);
  position: relative;
}

.progressFill {
  height: 100%;
  background: rgba(245, 158, 11, 0.35);
  transition: width 100ms linear;
}

.progressNum {
  font-family: monospace;
  font-size: 10px;
  font-weight: 200;
  color: rgba(255, 255, 255, 0.18);
  white-space: nowrap;
  flex-shrink: 0;
}

/* Dot navigation */
.dotnav {
  position: absolute;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 14px;
  pointer-events: all;
}

.dotWrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.tooltip {
  position: absolute;
  right: calc(100% + 10px);
  font-size: 9px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.60);
  background: var(--glass-bg);
  backdrop-filter: blur(8px);
  border: 1px solid var(--glass-border);
  padding: 4px 10px;
  border-radius: 20px;
  white-space: nowrap;
  animation: tooltipIn 0.2s ease-out forwards;
  pointer-events: none;
}

@keyframes tooltipIn {
  from { opacity: 0; transform: translateX(8px); }
  to   { opacity: 1; transform: translateX(0); }
}

.dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.20);
  border: none;
  padding: 7px;
  box-sizing: content-box;
  cursor: none;
  transition: background 0.3s, box-shadow 0.3s, transform 0.3s;
}

.dot:hover {
  background: rgba(255, 255, 255, 0.45);
}

.dot:focus-visible {
  outline: 1px solid var(--gold);
  outline-offset: 3px;
}

.dotActive {
  background: var(--gold);
  transform: scale(1.4);
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.8);
}

@media (prefers-reduced-motion: reduce) {
  .hint { animation: none; opacity: 0.25; }
  .tooltip { animation: none; }
}
```

- [ ] **Step 5: Run tests — expect PASS**

Run: `npm test -- components/ui/Overlay.test.jsx`
Expected: 4 tests pass.

Run: `npm test` — all tests pass.

- [ ] **Step 6: Commit**

```bash
git add components/ui/Overlay.jsx components/ui/Overlay.module.css components/ui/Overlay.test.jsx
git commit -m "feat(ui): redesign Overlay — gold typography, animated zone text, bottom bar, dot tooltips"
```

---

## Task 8: Glassmorphic Detail Panel

> **Agent model:** `claude-opus-4-8`
> **Plugin:** `motion-framer` — invoke before writing slide-in/out animation; use CSS animation for panel entrance (avoids R3F context conflict). Invoke `frontend-design` for focus trap and accessibility patterns.
> **MCP:** `mcp__magic__21st_magic_component_builder` — generate initial panel shell (glassmorphic card, close button, section header). `mcp__ide__getDiagnostics` — run after complete file.

**Files:**
- Create: `components/ui/DetailPanel.jsx`
- Create: `components/ui/DetailPanel.module.css`

**Interfaces:**
- Consumes: `CONTENT[zoneIndex]` from `lib/content.js` (Task 3)
- Consumes: `{ lang }` from `useLang()`
- Consumes: `zoneIndex: number`, `onClose: () => void` props
- Produces: `data-testid="detail-panel"` element (required by Overlay test in Task 7)

- [ ] **Step 1: Write failing test**

Create `components/ui/DetailPanel.test.jsx`:

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LangProvider } from '../../lib/LangContext.jsx';
import { DetailPanel } from './DetailPanel.jsx';

function renderPanel(zoneIndex = 0, onClose = vi.fn()) {
  return render(
    <LangProvider>
      <DetailPanel zoneIndex={zoneIndex} onClose={onClose} />
    </LangProvider>
  );
}

describe('DetailPanel', () => {
  it('renders panel element', () => {
    renderPanel(0);
    expect(screen.getByTestId('detail-panel')).toBeDefined();
  });

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn();
    renderPanel(0, onClose);
    fireEvent.click(screen.getByLabelText('Close panel'));
    // Allow close animation timeout
    setTimeout(() => expect(onClose).toHaveBeenCalledTimes(1), 350);
  });

  it('calls onClose when Escape pressed', () => {
    const onClose = vi.fn();
    renderPanel(0, onClose);
    fireEvent.keyDown(window, { key: 'Escape' });
    setTimeout(() => expect(onClose).toHaveBeenCalledTimes(1), 350);
  });

  it('renders content for each zone without throwing', () => {
    for (let i = 0; i < 8; i++) {
      const { unmount } = renderPanel(i);
      expect(screen.getAllByTestId('detail-panel').length).toBeGreaterThan(0);
      unmount();
    }
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

Run: `npm test -- components/ui/DetailPanel.test.jsx`
Expected: FAIL — `Cannot find module './DetailPanel.jsx'`

- [ ] **Step 3: Create DetailPanel.jsx**

```jsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { useLang } from '../../lib/LangContext.jsx';
import { CONTENT } from '../../lib/content.js';
import styles from './DetailPanel.module.css';

export function DetailPanel({ zoneIndex, onClose }) {
  const { lang } = useLang();
  const panelRef  = useRef(null);
  const [closing, setClosing] = useState(false);
  const content   = CONTENT[zoneIndex];

  function handleClose() {
    setClosing(true);
    setTimeout(onClose, 280);
  }

  // Escape key + focus trap
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const focusable = panel.querySelectorAll('button, a[href], [tabindex="0"]');
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    first?.focus();

    function onKeyDown(e) {
      if (e.key === 'Escape') { handleClose(); return; }
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first?.focus();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      aria-hidden="true"
    >
      <div
        ref={panelRef}
        className={`${styles.panel} ${closing ? styles.closing : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={content.label[lang]}
        data-testid="detail-panel"
      >
        <div className={styles.header}>
          <span className={styles.headerLabel}>{content.label[lang]}</span>
          <button
            className={styles.closeBtn}
            onClick={handleClose}
            aria-label="Close panel"
            data-cursor="hover"
          >✕</button>
        </div>
        <div className={styles.divider} />
        <div className={styles.body}>
          <ZoneContent zoneIndex={zoneIndex} lang={lang} body={content.body} />
        </div>
      </div>
    </div>
  );
}

function ZoneContent({ zoneIndex, lang, body }) {
  switch (zoneIndex) {
    case 0: return <HeroContent lang={lang} body={body} />;
    case 1: return <AboutContent lang={lang} body={body} />;
    case 2: return <ExperienceContent lang={lang} body={body} />;
    case 3: return <SkillsContent lang={lang} body={body} />;
    case 4: return <WorkContent lang={lang} body={body} />;
    case 5: return <EducationContent lang={lang} body={body} />;
    case 6: return <CertsContent lang={lang} body={body} />;
    case 7: return <ContactContent lang={lang} body={body} />;
    default: return null;
  }
}

function HeroContent({ lang, body }) {
  return (
    <div className={styles.heroContent}>
      {body.ctaLinks.map((link) => (
        <a
          key={link.type}
          href={link.href}
          className={link.type === 'cv' ? styles.ctaPrimary : styles.ctaSecondary}
          target={link.type !== 'cv' && link.type !== 'email' ? '_blank' : undefined}
          rel="noopener noreferrer"
          data-cursor="hover"
        >
          {link.label[lang]}
        </a>
      ))}
    </div>
  );
}

function AboutContent({ lang, body }) {
  return (
    <div className={styles.aboutContent}>
      <div className={styles.statsRow}>
        {body.stats.map((s, i) => (
          <div key={i} className={styles.statCard}>
            <span className={styles.statValue}>{s.value[lang]}</span>
            <span className={styles.statLabel}>{s.label[lang]}</span>
          </div>
        ))}
      </div>
      <p className={styles.bio}>{body.bio[lang]}</p>
    </div>
  );
}

function ExperienceContent({ lang, body }) {
  return (
    <div className={styles.timeline}>
      {body.roles.map((role, i) => (
        <div key={i} className={styles.role}>
          <div className={styles.roleMeta}>
            <span className={styles.roleTitle}>{role.title[lang]}</span>
            <span className={styles.roleCompany}>{role.company[lang]}</span>
            <span className={styles.rolePeriod}>{role.period[lang]}</span>
          </div>
          <ul className={styles.bullets}>
            {role.bullets[lang].map((b, j) => (
              <li key={j}>{b}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function SkillsContent({ lang, body }) {
  return (
    <div className={styles.skillsContent}>
      {body.categories.map((cat, i) => (
        <div key={i} className={styles.skillCat}>
          <span className={styles.skillCatName}>{cat.name[lang]}</span>
          <div className={styles.chips}>
            {cat.skills.map((skill) => (
              <span key={skill} className={styles.chip}>{skill}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function WorkContent({ lang, body }) {
  return (
    <div className={styles.workContent}>
      {body.projects.map((proj, i) => (
        <div key={i} className={styles.projectCard}>
          <span className={styles.projectTitle}>{proj.title[lang]}</span>
          <p className={styles.projectDesc}>{proj.desc[lang]}</p>
          <div className={styles.chips}>
            {proj.tags.map((tag) => (
              <span key={tag} className={styles.chip}>{tag}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function EducationContent({ lang, body }) {
  const { degree } = body;
  return (
    <div className={styles.eduCard}>
      <span className={styles.eduInstitution}>{degree.institution[lang]}</span>
      <span className={styles.eduField}>{degree.field[lang]}</span>
      <span className={styles.eduLevel}>{degree.level[lang]}</span>
      {degree.year[lang] && <span className={styles.eduYear}>{degree.year[lang]}</span>}
      {degree.honors[lang] && <span className={styles.eduHonors}>{degree.honors[lang]}</span>}
    </div>
  );
}

function CertsContent({ lang, body }) {
  return (
    <div className={styles.certsContent}>
      {body.certs.map((cert, i) => (
        <div key={i} className={styles.certCard}>
          <span className={styles.certName}>{cert.name[lang]}</span>
          <span className={styles.certMeta}>{cert.issuer[lang]} · {cert.year[lang]}</span>
        </div>
      ))}
    </div>
  );
}

function ContactContent({ lang, body }) {
  return (
    <div className={styles.contactContent}>
      <a href={`mailto:${body.email}`} className={styles.emailLink} data-cursor="hover">
        {body.email}
      </a>
      <div className={styles.contactLinks}>
        <a href={body.linkedin} target="_blank" rel="noopener noreferrer" className={styles.ctaSecondary} data-cursor="hover">
          LinkedIn
        </a>
        <a href={body.cv} className={styles.ctaPrimary} data-cursor="hover">
          {lang === 'th' ? 'ดาวน์โหลด CV' : 'Download CV'}
        </a>
      </div>
      <span className={styles.statusPill}>
        {body.status[lang]}
      </span>
    </div>
  );
}
```

- [ ] **Step 4: Create DetailPanel.module.css**

```css
/* Backdrop */
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  pointer-events: all;
}

/* Panel */
.panel {
  position: fixed;
  top: 0; right: 0; bottom: 0;
  width: 380px;
  background: rgba(6, 5, 4, 0.88);
  backdrop-filter: blur(24px) saturate(1.4);
  -webkit-backdrop-filter: blur(24px) saturate(1.4);
  border-left: 1px solid rgba(245, 158, 11, 0.18);
  display: flex;
  flex-direction: column;
  animation: slideIn 400ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
  overflow: hidden;
}

.closing {
  animation: slideOut 280ms ease-in forwards;
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
}

@keyframes slideOut {
  from { transform: translateX(0); }
  to   { transform: translateX(100%); }
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 1rem;
  flex-shrink: 0;
}

.headerLabel {
  font-size: 10px;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.closeBtn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.40);
  font-size: 14px;
  cursor: none;
  padding: 4px 8px;
  transition: color 0.2s;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.closeBtn:hover { color: var(--gold); }
.closeBtn:focus-visible { outline: 1px solid var(--gold); border-radius: 4px; }

.divider {
  height: 1px;
  background: rgba(245, 158, 11, 0.15);
  margin: 0 1.5rem;
  flex-shrink: 0;
}

/* Body */
.body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(245, 158, 11, 0.2) transparent;
}

/* Hero */
.heroContent {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 1rem;
}

/* About */
.aboutContent { display: flex; flex-direction: column; gap: 1.5rem; padding-top: 0.5rem; }

.statsRow {
  display: flex;
  gap: 0.75rem;
}

.statCard {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  padding: 1.2rem 1rem;
  border: 1px solid rgba(245, 158, 11, 0.15);
  background: rgba(245, 158, 11, 0.04);
  border-radius: 12px;
}

.statValue {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 200;
  font-size: 2.2rem;
  color: var(--gold);
  line-height: 1;
}

.statLabel {
  font-size: 9px;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.40);
}

.bio {
  font-size: 13px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.60);
}

/* Experience timeline */
.timeline { display: flex; flex-direction: column; gap: 2rem; padding-top: 0.5rem; }

.role { display: flex; flex-direction: column; gap: 0.75rem; }

.roleMeta { display: flex; flex-direction: column; gap: 0.2rem; }

.roleTitle {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 300;
  font-size: 1.2rem;
  color: var(--text-pri);
  letter-spacing: 0.05em;
}

.roleCompany {
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gold);
}

.rolePeriod {
  font-size: 11px;
  color: var(--text-muted);
  letter-spacing: 0.1em;
}

.bullets {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.bullets li {
  font-size: 12px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.55);
  padding-left: 1rem;
  position: relative;
}

.bullets li::before {
  content: '—';
  position: absolute;
  left: 0;
  color: rgba(245, 158, 11, 0.4);
}

/* Skills */
.skillsContent { display: flex; flex-direction: column; gap: 1.5rem; padding-top: 0.5rem; }

.skillCat { display: flex; flex-direction: column; gap: 0.6rem; }

.skillCatName {
  font-size: 9px;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--gold);
}

/* Work */
.workContent { display: flex; flex-direction: column; gap: 1.5rem; padding-top: 0.5rem; }

.projectCard {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid rgba(245, 158, 11, 0.10);
  border-radius: 8px;
  background: rgba(245, 158, 11, 0.02);
}

.projectTitle {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 300;
  font-size: 1.1rem;
  color: var(--text-pri);
}

.projectDesc {
  font-size: 12px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.50);
}

/* Education */
.eduCard {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.5rem;
  border: 1px solid rgba(245, 158, 11, 0.15);
  border-radius: 12px;
  background: rgba(245, 158, 11, 0.03);
  margin-top: 0.5rem;
}

.eduInstitution {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 300;
  font-size: 1.3rem;
  color: var(--text-pri);
}

.eduField {
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gold);
}

.eduLevel, .eduYear, .eduHonors {
  font-size: 11px;
  color: var(--text-muted);
  letter-spacing: 0.1em;
}

/* Certs */
.certsContent { display: flex; flex-direction: column; gap: 1rem; padding-top: 0.5rem; }

.certCard {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 1rem 1.2rem;
  border: 1px solid rgba(245, 158, 11, 0.15);
  border-radius: 8px;
  background: rgba(245, 158, 11, 0.03);
}

.certName {
  font-size: 13px;
  color: var(--text-pri);
  line-height: 1.4;
}

.certMeta {
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gold);
}

/* Contact */
.contactContent {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-top: 1rem;
  align-items: flex-start;
}

.emailLink {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 200;
  font-size: 1.1rem;
  color: var(--text-pri);
  text-decoration: none;
  letter-spacing: 0.05em;
  border-bottom: 1px solid rgba(245, 158, 11, 0.25);
  padding-bottom: 2px;
  transition: border-color 0.2s;
}

.emailLink:hover { border-color: var(--gold); }

.contactLinks {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.statusPill {
  font-size: 10px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--gold);
  border: 1px solid rgba(245, 158, 11, 0.25);
  border-radius: 20px;
  padding: 5px 14px;
}

/* Shared: chips */
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.chip {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.70);
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.20);
  border-radius: 4px;
  padding: 3px 8px;
  transition: background 0.2s, border-color 0.2s;
  cursor: default;
}

.chip:hover {
  background: rgba(245, 158, 11, 0.15);
  border-color: rgba(245, 158, 11, 0.40);
}

/* Shared: CTA buttons */
.ctaPrimary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  background: var(--gold);
  color: #060504;
  border-radius: 4px;
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  text-decoration: none;
  transition: background 0.2s;
  min-height: 44px;
}

.ctaPrimary:hover { background: var(--gold-lt); }

.ctaSecondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  background: transparent;
  color: var(--gold);
  border: 1px solid rgba(245, 158, 11, 0.35);
  border-radius: 4px;
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  text-decoration: none;
  transition: border-color 0.2s, background 0.2s;
  min-height: 44px;
}

.ctaSecondary:hover {
  border-color: var(--gold);
  background: rgba(245, 158, 11, 0.06);
}

/* Mobile */
@media (max-width: 480px) {
  .panel { width: 100vw; }
}

@media (prefers-reduced-motion: reduce) {
  .panel, .closing { animation: none; }
  .closing { transform: translateX(100%); }
}
```

- [ ] **Step 5: Run tests — expect PASS**

Run: `npm test -- components/ui/DetailPanel.test.jsx`
Expected: 4 tests pass.

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add components/ui/DetailPanel.jsx components/ui/DetailPanel.module.css components/ui/DetailPanel.test.jsx
git commit -m "feat(ui): add glassmorphic DetailPanel — 8-zone content, slide-in, focus trap"
```

---

## Final Verification

> **Agent model:** `claude-sonnet-4-6`
> **Plugin:** `verify` skill — invoke to run dev server and visually confirm all zones
> **MCP:** `mcp__plugin_chrome-devtools-mcp_chrome-devtools__take_screenshot` + `mcp__plugin_chrome-devtools-mcp_chrome-devtools__navigate_page`

- [ ] Run `npm test` — all tests pass (target: 34+ tests)
- [ ] Run `npm run dev` — server starts on localhost:3000
- [ ] Navigate to localhost:3000 in Chrome DevTools MCP — verify loader plays
- [ ] Scroll through all 8 zones — verify gold node graph, amber particles, zone text animations
- [ ] Click zone title at Zone 0 — verify DetailPanel slides in from right
- [ ] Click dot nav — verify magnetic tooltip and panel opens
- [ ] Press Escape — verify panel closes
- [ ] Toggle EN/TH — verify glass pill style and Thai content in panel
- [ ] Check mobile (375px via emulate) — verify panel is full-width, cursor hidden
- [ ] `npm run build` — no build errors
