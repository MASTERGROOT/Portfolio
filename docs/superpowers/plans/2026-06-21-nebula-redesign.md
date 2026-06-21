# Nebula Fly-Through Redesign — Implementation Plan (Foundation)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace 8-section scroll-tween portfolio with a continuous camera fly-through along z=0→-160, 8 zone-specific 3D wireframe objects, and a minimal centered DOM overlay — delivering the full nebula experience with NodeGraph as the hero object.

**Architecture:** Single `useFlightProgress()` hook converts wheel events into a progress ref (0–1) shared between `CameraRig` (3D canvas) and `Overlay` (DOM). No GSAP, no ScrollTrigger, no React state re-renders on scroll. Seven new zone objects added in Plan 2; this plan wires the full experience with NodeGraph (zone 0) visible across all zones initially.

**Tech Stack:** Next.js 14 App Router (output: export), React Three Fiber v8, @react-three/drei v9, @react-three/postprocessing v2.19.1, Vitest + @testing-library/react, Playwright MCP for visual verification.

**Related spec:** `docs/superpowers/specs/2026-06-21-nebula-redesign-design.md`
**Plan 2 (Zone Objects):** BarChart, Bridge, NodeRing, BuildingA, BlueprintGrid, BuildingB — follow-on after this plan.

## Global Constraints

- `@react-three/postprocessing` must stay at **v2.19.1** — v3 breaks with R3F v8
- `<Environment>` in drei v9: prop is `environmentIntensity`, NOT `intensity`
- Background color: `#050505` — not `#0a0a0a`
- Wireframe bright: `#88CCFF` / dim: `#4499CC`
- Particle field: amber/gold warm tones — `#F59E0B`, `#FCD34D`, `#D97706`
- Camera z: `progress * -160` exactly — no easing, no GSAP
- No `<Html>` elements inside Canvas
- No React state updates on scroll — only refs + rAF
- Bilingual: `lib/LangContext.jsx` + `useLang()` — no new i18n system
- Bloom: `luminanceThreshold: 0.7, intensity: 0.3` — not the previous `0.6/0.4`
- Package manager: **npm** (use `npm install`, not yarn/pnpm)
- Node syntax: modern ESM is OK — vitest runs in ESM mode
- Dev server port: `npm run dev -- --port 3002`
- Build check: `npm run build` must pass (static Next.js export)
- Test command: `npm test` (vitest)

---

## File Map

| Status | File | Responsibility |
|--------|------|----------------|
| **Create** | `lib/zones.js` | Zone data — 8 zones with z-ranges + EN/TH text |
| **Create** | `lib/zones.test.js` | Unit tests for zones data + helper fns |
| **Create** | `hooks/useFlightProgress.js` | Wheel → progress ref + zone index |
| **Create** | `hooks/useFlightProgress.test.js` | Unit tests for hook |
| **Create** | `components/ui/Overlay.jsx` | Fixed DOM layer — label, title, sub, dot nav, progress |
| **Create** | `components/ui/Overlay.module.css` | Overlay styles |
| **Rewrite** | `components/scene/CameraRig.jsx` | progress ref → camera position, no GSAP |
| **Rewrite** | `components/scene/ParticleField.jsx` | Amber 2k + dust 8k, mouse repel |
| **Rewrite** | `components/scene/NodeGraph.jsx` | Cyan wireframe, static, slow rotate |
| **Modify** | `components/scene/SceneInner.jsx` | Receive flightProgress prop, cyan lights, Bloom 0.7/0.3 |
| **Modify** | `app/page.js` | useFlightProgress + Overlay, drop 8 sections + NavBar |
| **Modify** | `styles/globals.css` | #050505 bg, overflow:hidden, drop gold vars |
| **Modify** | `components/ui/LangToggle.module.css` | Nebula styling |
| **Delete** | `lib/keyframes.js` + `lib/keyframes.test.js` | Replaced by zones.js |
| **Delete** | `hooks/useCinematicReveal.js` + `.test.js` | No more scroll reveal |
| **Delete** | `hooks/useMagneticTilt.js` + `.test.js` | Unused |
| **Delete** | `hooks/useCursorWorld.js` | Unused (mouse handled in ParticleField) |
| **Delete** | `components/sections/*.jsx` + `*.module.css` (×8) | Replaced by Overlay |
| **Delete** | `components/ui/NavBar.jsx` + `.module.css` | Replaced by Overlay top nav |
| **Delete** | `components/sections/HeroSection.test.jsx` | Section deleted |
| **Rewrite** | `e2e/portfolio.test.js` | New selectors for overlay-based UX |

---

## Task 1: lib/zones.js — Zone Data

**Tools:**
- **Model:** claude-haiku-4-5-20251001 (pure data, mechanical)
- **Plugin/Skill:** none
- **MCP:** none

**Files:**
- Create: `lib/zones.js`
- Create: `lib/zones.test.js`

**Interfaces:**
- Produces: `ZONES` (array[8]), `TOTAL_DEPTH` (number 160), `getZoneIndex(progress: 0–1): 0–7`, `getZoneAtZ(cameraZ: 0 to -160): Zone`

---

- [ ] **Step 1: Write failing test**

`lib/zones.test.js`:
```js
import { describe, it, expect } from 'vitest';
import { ZONES, TOTAL_DEPTH, getZoneIndex, getZoneAtZ } from './zones.js';

describe('ZONES', () => {
  it('exports exactly 8 zones', () => {
    expect(ZONES).toHaveLength(8);
  });

  it('each zone has index, zStart, zEnd, zMid, label/title/sub with en+th', () => {
    ZONES.forEach((z, i) => {
      expect(z.index, `zone ${i} index`).toBe(i);
      expect(typeof z.zStart).toBe('number');
      expect(typeof z.zEnd).toBe('number');
      expect(typeof z.zMid).toBe('number');
      ['label', 'title', 'sub'].forEach(key => {
        expect(typeof z[key].en, `zone ${i} ${key}.en`).toBe('string');
        expect(typeof z[key].th, `zone ${i} ${key}.th`).toBe('string');
        expect(z[key].en.length, `zone ${i} ${key}.en non-empty`).toBeGreaterThan(0);
        expect(z[key].th.length, `zone ${i} ${key}.th non-empty`).toBeGreaterThan(0);
      });
    });
  });

  it('zones cover full depth — first starts at 0, last ends at -TOTAL_DEPTH, no gaps', () => {
    expect(ZONES[0].zStart).toBe(0);
    expect(ZONES[7].zEnd).toBe(-TOTAL_DEPTH);
    for (let i = 1; i < 8; i++) {
      expect(ZONES[i].zStart, `gap between zone ${i-1} and ${i}`).toBe(ZONES[i-1].zEnd);
    }
  });

  it('each zMid is between zStart and zEnd (exclusive)', () => {
    ZONES.forEach((z, i) => {
      expect(z.zMid, `zone ${i} zMid`).toBeLessThan(z.zStart);
      expect(z.zMid, `zone ${i} zMid`).toBeGreaterThan(z.zEnd);
    });
  });
});

describe('getZoneIndex', () => {
  it('returns 0 at progress=0', () => expect(getZoneIndex(0)).toBe(0));
  it('returns 7 at progress=1', () => expect(getZoneIndex(1)).toBe(7));
  it('returns 7 at progress=0.999', () => expect(getZoneIndex(0.999)).toBe(7));
  it('maps progress=0.5 to zone 4', () => expect(getZoneIndex(0.5)).toBe(4));
  it('returns 0–7 for all progress values', () => {
    for (let p = 0; p <= 1; p += 0.1) {
      const idx = getZoneIndex(p);
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThanOrEqual(7);
    }
  });
});

describe('getZoneAtZ', () => {
  it('returns zone 0 at z=0', () => expect(getZoneAtZ(0).index).toBe(0));
  it('returns zone 7 at z=-160', () => expect(getZoneAtZ(-160).index).toBe(7));
  it('returns zone 2 at z=-45', () => expect(getZoneAtZ(-45).index).toBe(2));
});
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npm test -- lib/zones.test.js
```
Expected: FAIL — `Cannot find module './zones.js'`

- [ ] **Step 3: Write zones.js**

`lib/zones.js`:
```js
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

export function getZoneAtZ(cameraZ) {
  for (let i = 0; i < ZONES.length; i++) {
    if (cameraZ >= ZONES[i].zEnd) return ZONES[i];
  }
  return ZONES[7];
}
```

- [ ] **Step 4: Run test — verify it passes**

```bash
npm test -- lib/zones.test.js
```
Expected: PASS — all tests green

- [ ] **Step 5: Commit**

```bash
git add lib/zones.js lib/zones.test.js
git commit -m "feat(zones): add zone data map — 8 zones z=0→-160 with EN/TH text"
```

---

## Task 2: hooks/useFlightProgress.js — Wheel Input Hook

**Tools:**
- **Model:** claude-haiku-4-5-20251001 (clear spec, 1 file)
- **Plugin/Skill:** none
- **MCP:** none

**Files:**
- Create: `hooks/useFlightProgress.js`
- Create: `hooks/useFlightProgress.test.js`

**Interfaces:**
- Consumes: `getZoneIndex` from `lib/zones.js`
- Produces: `useFlightProgress(): { progress: MutableRefObject<number>, zoneIndex: MutableRefObject<number> }`
- `progress.current` ∈ [0, 1]; `zoneIndex.current` ∈ [0, 7]

---

- [ ] **Step 1: Write failing test**

`hooks/useFlightProgress.test.js`:
```js
import { describe, it, expect, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFlightProgress } from './useFlightProgress.js';

afterEach(() => {
  // Reset by re-rendering — no global state to clean
});

describe('useFlightProgress', () => {
  it('starts at progress=0 and zoneIndex=0', () => {
    const { result } = renderHook(() => useFlightProgress());
    expect(result.current.progress.current).toBe(0);
    expect(result.current.zoneIndex.current).toBe(0);
  });

  it('increments progress on wheel forward (deltaY > 0)', () => {
    const { result } = renderHook(() => useFlightProgress());
    act(() => {
      window.dispatchEvent(
        new WheelEvent('wheel', { deltaY: 100, bubbles: true, cancelable: true })
      );
    });
    // 100 * 0.0015 = 0.15
    expect(result.current.progress.current).toBeCloseTo(0.15, 2);
  });

  it('clamps at max 1', () => {
    const { result } = renderHook(() => useFlightProgress());
    act(() => {
      window.dispatchEvent(
        new WheelEvent('wheel', { deltaY: 999999, bubbles: true, cancelable: true })
      );
    });
    expect(result.current.progress.current).toBe(1);
    expect(result.current.zoneIndex.current).toBe(7);
  });

  it('clamps at min 0', () => {
    const { result } = renderHook(() => useFlightProgress());
    act(() => {
      window.dispatchEvent(
        new WheelEvent('wheel', { deltaY: -999999, bubbles: true, cancelable: true })
      );
    });
    expect(result.current.progress.current).toBe(0);
    expect(result.current.zoneIndex.current).toBe(0);
  });

  it('removes wheel listener on unmount', () => {
    const { unmount } = renderHook(() => useFlightProgress());
    // Dispatch after unmount — should not throw
    unmount();
    expect(() => {
      window.dispatchEvent(
        new WheelEvent('wheel', { deltaY: 100, bubbles: true, cancelable: true })
      );
    }).not.toThrow();
  });
});
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npm test -- hooks/useFlightProgress.test.js
```
Expected: FAIL — `Cannot find module './useFlightProgress.js'`

- [ ] **Step 3: Write useFlightProgress.js**

`hooks/useFlightProgress.js`:
```js
'use client';
import { useRef, useEffect } from 'react';
import { getZoneIndex } from '../lib/zones.js';

const SENSITIVITY = 0.0015;

export function useFlightProgress() {
  const progress = useRef(0);
  const zoneIndex = useRef(0);

  useEffect(() => {
    function onWheel(e) {
      e.preventDefault();
      const next = Math.max(0, Math.min(1, progress.current + e.deltaY * SENSITIVITY));
      progress.current = next;
      zoneIndex.current = getZoneIndex(next);
    }
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  return { progress, zoneIndex };
}
```

- [ ] **Step 4: Run test — verify it passes**

```bash
npm test -- hooks/useFlightProgress.test.js
```
Expected: PASS — 5/5 tests green

- [ ] **Step 5: Run full suite — no regressions**

```bash
npm test
```
Expected: all existing tests still pass (zones + useFlightProgress + content + LangContext + LangToggle + useCinematicReveal + useMagneticTilt + HeroSection)

- [ ] **Step 6: Commit**

```bash
git add hooks/useFlightProgress.js hooks/useFlightProgress.test.js
git commit -m "feat(hooks): add useFlightProgress — wheel event drives progress ref 0-1"
```

---

## Task 3: CameraRig.jsx — Rewrite (Progress Ref → Camera Position)

**Tools:**
- **Model:** claude-haiku-4-5-20251001 (exact math in spec, 1 file)
- **Plugin/Skill:** core-3d-animation:react-three-fiber-architect (for R3F useFrame patterns)
- **MCP:** mcp__plugin_playwright_playwright — visual smoke test after Task 7 wires it up
- **Dev server:** `npm run dev -- --port 3002`

**Files:**
- Rewrite: `components/scene/CameraRig.jsx`

**Interfaces:**
- Consumes: `flightProgress: { progress: MutableRefObject<number>, zoneIndex: MutableRefObject<number> }` — passed as prop
- Produces: nothing (mutates camera via useFrame, returns null)

**No unit test** — requires WebGL. Verified visually in Task 7.

---

- [ ] **Step 1: Rewrite CameraRig.jsx**

```jsx
'use client';
import { useFrame } from '@react-three/fiber';
import { TOTAL_DEPTH } from '../../lib/zones.js';

export function CameraRig({ flightProgress }) {
  useFrame(({ camera }) => {
    const p = flightProgress.progress.current;
    camera.position.z = -p * TOTAL_DEPTH;
    camera.position.y = Math.sin(p * Math.PI) * -2.5;
    camera.position.x = Math.sin(p * Math.PI * 2) * 1.5;
    camera.lookAt(
      camera.position.x * 0.5,
      camera.position.y * 0.5,
      camera.position.z - 10
    );
  });

  return null;
}
```

- [ ] **Step 2: Verify syntax**

```bash
node --check components/scene/CameraRig.jsx 2>/dev/null || echo "JSX — syntax check skipped (requires JSX transform)"
```
Visual read: confirm no typos, no leftover GSAP imports.

- [ ] **Step 3: Commit**

```bash
git add components/scene/CameraRig.jsx
git commit -m "refactor(camera): replace GSAP+ScrollTrigger with raw progress ref in useFrame"
```

---

## Task 4: ParticleField.jsx — Rewrite (Amber + Dust, Mouse Repel)

**Tools:**
- **Model:** claude-sonnet-4-6 (multi-system: two particle layers + mouse tracking + rAF math)
- **Plugin/Skill:** core-3d-animation:react-three-fiber-architect
- **MCP:** mcp__plugin_playwright_playwright — visual check in Task 7

**Files:**
- Rewrite: `components/scene/ParticleField.jsx`

**Interfaces:**
- Consumes: nothing (self-contained)
- Produces: `<ParticleField />` — R3F group with two `<points>` children

**No unit test** — particle math is GPU-side. Verified visually.

---

- [ ] **Step 1: Rewrite ParticleField.jsx**

Full replacement — remove all existing content:

```jsx
'use client';
import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const CORE_N = 2000;
const DUST_N = 8000;
const REPEL_R = 5;
const REPEL_M = 2.2;
const LERP_B  = 0.045;

const GOLD_COLS = [0xF59E0B, 0xFCD34D, 0xD97706, 0xFBBF24, 0xF97316].map(h => new THREE.Color(h));
const DUST_COLS = [0x78350F, 0x92400E, 0xFFFBEB, 0xD97706, 0xB45309].map(h => new THREE.Color(h));
const pickColor = arr => arr[Math.floor(Math.random() * arr.length)];

function makeRadialTex(size, stops) {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const r = size / 2;
  const g = ctx.createRadialGradient(r, r, 0, r, r, r);
  stops.forEach(([t, v]) => g.addColorStop(t, v));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

export function ParticleField() {
  const { camera } = useThree();
  const mouse = useRef({ nx: 0, ny: 0 });
  const coreGeoRef = useRef(null);
  const dustGeoRef = useRef(null);

  // Stable typed arrays — mutated in useFrame, never recreated
  const { cPos, cOrigin, cSpeed, cColor, dPos, dSpeed, dColor } = useMemo(() => {
    const cPos    = new Float32Array(CORE_N * 3);
    const cOrigin = new Float32Array(CORE_N * 3);
    const cSpeed  = new Float32Array(CORE_N);
    const cColor  = new Float32Array(CORE_N * 3);
    for (let i = 0; i < CORE_N; i++) {
      const x = (Math.random() - 0.5) * 52;
      const y = (Math.random() - 0.5) * 52;
      const z = -(Math.random() * 160 + 5);
      cPos[i*3] = cOrigin[i*3] = x;
      cPos[i*3+1] = cOrigin[i*3+1] = y;
      cPos[i*3+2] = cOrigin[i*3+2] = z;
      cSpeed[i] = 0.003 + Math.random() * 0.007;
      const c = pickColor(GOLD_COLS);
      cColor[i*3] = c.r; cColor[i*3+1] = c.g; cColor[i*3+2] = c.b;
    }

    const dPos   = new Float32Array(DUST_N * 3);
    const dSpeed = new Float32Array(DUST_N);
    const dColor = new Float32Array(DUST_N * 3);
    for (let i = 0; i < DUST_N; i++) {
      dPos[i*3]   = (Math.random() - 0.5) * 120;
      dPos[i*3+1] = (Math.random() - 0.5) * 120;
      dPos[i*3+2] = -(Math.random() * 160 + 5);
      dSpeed[i] = 0.001 + Math.random() * 0.003;
      const c = pickColor(DUST_COLS);
      dColor[i*3] = c.r * 0.35; dColor[i*3+1] = c.g * 0.35; dColor[i*3+2] = c.b * 0.35;
    }
    return { cPos, cOrigin, cSpeed, cColor, dPos, dSpeed, dColor };
  }, []);

  const goldTex = useMemo(() => makeRadialTex(128, [
    [0,    'rgba(255,210,100,1)'],
    [0.18, 'rgba(245,158,11,.85)'],
    [0.45, 'rgba(220,100,0,.3)'],
    [0.8,  'rgba(180,60,0,.04)'],
    [1,    'rgba(0,0,0,0)'],
  ]), []);

  const dustTex = useMemo(() => makeRadialTex(32, [
    [0,    'rgba(255,235,180,1)'],
    [0.1,  'rgba(255,210,120,.95)'],
    [0.28, 'rgba(240,160,60,.4)'],
    [1,    'rgba(0,0,0,0)'],
  ]), []);

  useEffect(() => {
    const onMove = e => {
      mouse.current.nx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.ny = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame((_, dt) => {
    const dtN = Math.min(dt * 60, 3); // normalize to 60 fps ticks

    // Project mouse to world space at depth=15 from camera
    const hH = Math.tan((camera.fov * Math.PI) / 360) * 15;
    const mwx = camera.position.x + mouse.current.nx * hH * camera.aspect;
    const mwy = camera.position.y + mouse.current.ny * hH;

    // Core layer — drift up + mouse repel
    for (let i = 0; i < CORE_N; i++) {
      cOrigin[i*3+1] += cSpeed[i] * dtN;
      if (cOrigin[i*3+1] > 26) cOrigin[i*3+1] = -26;

      const ox = cOrigin[i*3], oy = cOrigin[i*3+1];
      const dx = ox - mwx, dy = oy - mwy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < REPEL_R && dist > 0.01) {
        const f = (1 - dist / REPEL_R) * REPEL_M;
        cPos[i*3]   = ox + (dx / dist) * f;
        cPos[i*3+1] = oy + (dy / dist) * f;
      } else {
        cPos[i*3]   += (ox - cPos[i*3])   * LERP_B;
        cPos[i*3+1] += (oy - cPos[i*3+1]) * LERP_B;
      }
      cPos[i*3+2] = cOrigin[i*3+2];
    }
    if (coreGeoRef.current) coreGeoRef.current.attributes.position.needsUpdate = true;

    // Dust layer — drift up only, no repel
    for (let i = 0; i < DUST_N; i++) {
      dPos[i*3+1] += dSpeed[i] * dtN;
      if (dPos[i*3+1] > 60) dPos[i*3+1] = -60;
    }
    if (dustGeoRef.current) dustGeoRef.current.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      {/* Core amber particles */}
      <points>
        <bufferGeometry ref={coreGeoRef}>
          <bufferAttribute attach="attributes-position" args={[cPos, 3]} />
          <bufferAttribute attach="attributes-color"    args={[cColor, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.55}
          map={goldTex}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
        />
      </points>

      {/* Fine dust layer */}
      <points>
        <bufferGeometry ref={dustGeoRef}>
          <bufferAttribute attach="attributes-position" args={[dPos, 3]} />
          <bufferAttribute attach="attributes-color"    args={[dColor, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          map={dustTex}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          vertexColors
          transparent
          opacity={0.55}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/scene/ParticleField.jsx
git commit -m "refactor(particles): replace vortex with amber+dust two-layer, mouse repel"
```

---

## Task 5: NodeGraph.jsx — Rewrite (Cyan Wireframe)

**Tools:**
- **Model:** claude-haiku-4-5-20251001 (clear spec, uses existing nodePositions.js)
- **Plugin/Skill:** core-3d-animation:react-three-fiber-architect
- **MCP:** mcp__plugin_playwright_playwright — visual check in Task 7

**Files:**
- Rewrite: `components/scene/NodeGraph.jsx`

**Interfaces:**
- Consumes: `GRID_POSITIONS` + `EDGES` from `lib/nodePositions.js`
- Produces: `<NodeGraph />` — R3F group at position `[-2, 0, -10]`

**No unit test** — geometry/material is GPU. Verified visually.

---

- [ ] **Step 1: Rewrite NodeGraph.jsx**

Full replacement — remove all existing content (state machine, GSAP, glass material, GLSL shaders):

```jsx
'use client';
import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GRID_POSITIONS, EDGES } from '../../lib/nodePositions.js';

const NODE_COUNT = GRID_POSITIONS.length; // 24

function makeNodeTex() {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0,    'rgba(255,255,255,1)');
  g.addColorStop(0.15, 'rgba(200,230,255,.95)');
  g.addColorStop(0.35, 'rgba(150,200,255,.6)');
  g.addColorStop(0.6,  'rgba(100,160,255,.15)');
  g.addColorStop(1,    'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

// Module-level singletons — created once, shared across renders
const WIRE_MAT = new THREE.LineBasicMaterial({
  color: 0x88CCFF,
  transparent: true,
  opacity: 0.58,
});
const nodeTex = makeNodeTex();

const DUMMY = new THREE.Object3D();

export function NodeGraph() {
  const groupRef = useRef(null);
  const meshRef  = useRef(null);

  const nodeGeo = useMemo(() => new THREE.IcosahedronGeometry(0.18, 1), []);

  const edgeGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(EDGES.length * 6);
    EDGES.forEach((edge, i) => {
      const a = GRID_POSITIONS[edge[0]];
      const b = GRID_POSITIONS[edge[1]];
      pos[i*6]   = a[0]; pos[i*6+1] = a[1]; pos[i*6+2] = a[2];
      pos[i*6+3] = b[0]; pos[i*6+4] = b[1]; pos[i*6+5] = b[2];
    });
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  const nodePointsPos = useMemo(() => {
    const pos = new Float32Array(NODE_COUNT * 3);
    GRID_POSITIONS.forEach((p, i) => {
      pos[i*3] = p[0]; pos[i*3+1] = p[1]; pos[i*3+2] = p[2];
    });
    return pos;
  }, []);

  useEffect(() => {
    if (!meshRef.current) return;
    GRID_POSITIONS.forEach((pos, i) => {
      DUMMY.position.set(pos[0], pos[1], pos[2]);
      DUMMY.updateMatrix();
      meshRef.current.setMatrixAt(i, DUMMY.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  useEffect(() => {
    return () => {
      nodeGeo.dispose();
      edgeGeo.dispose();
    };
  }, [nodeGeo, edgeGeo]);

  useFrame((_, dt) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0007 * Math.min(dt * 60, 3);
    }
  });

  return (
    <group ref={groupRef} position={[-2, 0, -10]}>
      {/* Wireframe node shells */}
      <instancedMesh ref={meshRef} args={[nodeGeo, undefined, NODE_COUNT]}>
        <meshBasicMaterial color={0x88CCFF} wireframe transparent opacity={0.6} />
      </instancedMesh>

      {/* Node glow points */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePointsPos, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.65}
          map={nodeTex}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          color={0xCCE8FF}
          transparent
          opacity={1}
          sizeAttenuation
        />
      </points>

      {/* Edges */}
      <lineSegments geometry={edgeGeo} material={WIRE_MAT} />
    </group>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/scene/NodeGraph.jsx
git commit -m "refactor(scene): rewrite NodeGraph as cyan wireframe — remove state machine + glass material"
```

---

## Task 6: Overlay.jsx + Overlay.module.css + LangToggle restyle

**Tools:**
- **Model:** claude-sonnet-4-6 (UI logic — rAF loop, zone text swap, dot nav jump)
- **Plugin/Skill:** ui-ux-pro-max (invoke before writing Overlay CSS)
- **MCP:** mcp__plugin_playwright_playwright — verify bilingual toggle + dot nav in Task 7

**Files:**
- Create: `components/ui/Overlay.jsx`
- Create: `components/ui/Overlay.module.css`
- Modify: `components/ui/LangToggle.module.css`

**Interfaces:**
- Consumes: `flightProgress: { progress: MutableRefObject<number>, zoneIndex: MutableRefObject<number> }` — prop
- Consumes: `useLang()` → `{ lang }` from `lib/LangContext.jsx`
- Consumes: `ZONES` from `lib/zones.js`
- Produces: `<Overlay flightProgress={...} />` — fixed DOM layer, z-index 10

---

- [ ] **Step 1: Write Overlay.jsx**

`components/ui/Overlay.jsx`:
```jsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { useLang } from '../../lib/LangContext.jsx';
import { LangToggle } from './LangToggle.jsx';
import { ZONES, TOTAL_DEPTH } from '../../lib/zones.js';
import styles from './Overlay.module.css';

export function Overlay({ flightProgress }) {
  const { lang } = useLang();
  const [zoneIdx, setZoneIdx]     = useState(0);
  const [zone, setZone]           = useState(ZONES[0]);
  const [textVisible, setVisible] = useState(true);
  const [hintVisible, setHint]    = useState(true);
  const [pct, setPct]             = useState(0);
  const prevZone = useRef(0);
  const rafRef   = useRef(null);

  useEffect(() => {
    function tick() {
      const p  = flightProgress.progress.current;
      const zi = flightProgress.zoneIndex.current;
      setPct(Math.round(p * 100));

      if (zi !== prevZone.current) {
        prevZone.current = zi;
        setVisible(false);
        setTimeout(() => {
          setZone(ZONES[zi]);
          setZoneIdx(zi);
          setVisible(true);
        }, 220);
      }
      if (p > 0.01) setHint(false);
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [flightProgress]);

  function jumpToZone(i) {
    const mid = Math.abs(ZONES[i].zMid) / TOTAL_DEPTH;
    flightProgress.progress.current  = mid;
    flightProgress.zoneIndex.current = i;
  }

  return (
    <div className={styles.overlay}>
      {/* Top navigation */}
      <div className={styles.topnav}>
        <span className={styles.logo}>GOODY</span>
        <LangToggle />
      </div>

      {/* Centered section text */}
      <div
        className={styles.center}
        style={{ opacity: textVisible ? 1 : 0 }}
        aria-live="polite"
      >
        <p className={styles.label}>{zone.label[lang]}</p>
        <h1 className={`${styles.title} ${lang === 'th' ? styles.titleTh : ''}`}>
          {zone.title[lang]}
        </h1>
        <p className={styles.sub}>{zone.sub[lang]}</p>
      </div>

      {/* Scroll hint — disappears after first scroll */}
      {hintVisible && (
        <div className={styles.hint} aria-hidden="true">
          ↕ SCROLL TO FLY THROUGH · MOVE MOUSE TO REPEL
        </div>
      )}

      {/* Progress counter */}
      <div className={styles.progress} aria-hidden="true">
        {String(pct).padStart(3, '0')}%
      </div>

      {/* Dot navigation */}
      <nav className={styles.dotnav} aria-label="Section navigation">
        {ZONES.map((z, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === zoneIdx ? styles.dotActive : ''}`}
            onClick={() => jumpToZone(i)}
            aria-label={z.title.en}
            aria-current={i === zoneIdx ? 'true' : undefined}
          />
        ))}
      </nav>
    </div>
  );
}
```

- [ ] **Step 2: Write Overlay.module.css**

`components/ui/Overlay.module.css`:
```css
.overlay {
  position: fixed;
  inset: 0;
  z-index: 10;
  pointer-events: none;
  font-family: 'Montserrat', system-ui, sans-serif;
}

/* Top nav bar */
.topnav {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  pointer-events: all;
}

.logo {
  font-size: 11px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  font-weight: 500;
  user-select: none;
}

/* Center text block */
.center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.label {
  font-size: 11px;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: rgba(245, 158, 11, 0.65);
  margin-bottom: 1.2rem;
  font-weight: 400;
}

.title {
  font-size: clamp(3rem, 9vw, 6.5rem);
  font-weight: 200;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.92);
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
  color: rgba(255, 255, 255, 0.20);
}

/* Scroll hint */
.hint {
  position: absolute;
  bottom: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.18);
  white-space: nowrap;
}

/* Progress counter */
.progress {
  position: absolute;
  bottom: 1.5rem;
  left: 2rem;
  font-size: 11px;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.22);
  font-family: monospace;
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

.dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.20);
  border: none;
  padding: 6px;
  box-sizing: content-box;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s;
}

.dot:hover {
  background: rgba(255, 255, 255, 0.45);
}

.dotActive {
  background: rgba(245, 158, 11, 0.9);
  transform: scale(1.4);
}
```

- [ ] **Step 3: Update LangToggle.module.css for nebula look**

Replace full content of `components/ui/LangToggle.module.css`:
```css
.pill {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 3px;
  padding: 4px 10px;
  cursor: pointer;
  font-size: 10px;
  letter-spacing: 0.25em;
  transition: border-color 0.2s;
}

.pill:hover {
  border-color: rgba(255, 255, 255, 0.35);
}

.active {
  color: rgba(245, 158, 11, 0.9);
  font-weight: 500;
}

.inactive {
  color: rgba(255, 255, 255, 0.30);
  font-weight: 400;
}

.divider {
  color: rgba(255, 255, 255, 0.15);
  margin: 0 2px;
}
```

- [ ] **Step 4: Commit**

```bash
git add components/ui/Overlay.jsx components/ui/Overlay.module.css components/ui/LangToggle.module.css
git commit -m "feat(ui): add Overlay component and restyle LangToggle for nebula theme"
```

---

## Task 7: Wire Everything — SceneInner + page.js + globals.css

**Tools:**
- **Model:** claude-sonnet-4-6 (multi-file integration, prop threading)
- **Plugin/Skill:** ui-ux-pro-max (palette check), core-3d-animation:react-three-fiber-architect (Canvas props)
- **MCP:** mcp__plugin_playwright_playwright — **full visual smoke test after wiring**
- **Dev server:** Start `npm run dev -- --port 3002` before Playwright checks

**Files:**
- Rewrite: `components/scene/SceneInner.jsx`
- Rewrite: `app/page.js`
- Modify: `styles/globals.css`

---

- [ ] **Step 1: Rewrite SceneInner.jsx**

```jsx
'use client';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { CameraRig }     from './CameraRig.jsx';
import { NodeGraph }     from './NodeGraph.jsx';
import { ParticleField } from './ParticleField.jsx';

export function SceneInner({ flightProgress }) {
  return (
    <Canvas
      style={{ position: 'fixed', inset: 0, zIndex: 0 }}
      camera={{ position: [0, 0, 0], fov: 75 }}
      gl={{ antialias: false, alpha: false }}
    >
      <color attach="background" args={['#050505']} />

      {/* Cyan-shifted lighting for wireframe */}
      <directionalLight color="#88CCFF" intensity={0.5} position={[5, 8, 6]} />
      <directionalLight color="#4499CC" intensity={0.3} position={[-4, -2, 8]} />
      <directionalLight color="#ffffff" intensity={0.8} position={[-2, 3, -8]} />

      <Suspense fallback={null}>
        <CameraRig flightProgress={flightProgress} />
        <NodeGraph />
        <ParticleField />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.7}
            luminanceSmoothing={0.025}
            intensity={0.3}
            mipmapBlur={true}
          />
          <Vignette offset={0.15} darkness={0.6} eskil={false} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
```

- [ ] **Step 2: Rewrite app/page.js**

```jsx
'use client';
import { Scene }   from '../components/scene/Scene.jsx';
import { Overlay } from '../components/ui/Overlay.jsx';
import { useFlightProgress } from '../hooks/useFlightProgress.js';

export default function Page() {
  const flightProgress = useFlightProgress();
  return (
    <>
      <Scene flightProgress={flightProgress} />
      <Overlay flightProgress={flightProgress} />
    </>
  );
}
```

- [ ] **Step 3: Update styles/globals.css**

Replace the `:root` block and `body` block. Keep `body.lang-th` and font-face lines. Remove gold vars and section-specific utilities:

Find and replace the `:root { ... }` block with:
```css
:root {
  --bg:         #050505;
  --wire-bright: #88CCFF;
  --wire-dim:   #4499CC;
  --gold:       rgba(245, 158, 11, 0.75);
  --text-main:  rgba(255, 255, 255, 0.92);
  --text-sub:   rgba(255, 255, 255, 0.20);
  --transition: 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

Find and replace the `body { ... }` block with:
```css
body {
  background: var(--bg);
  color: var(--text-main);
  font-family: 'Montserrat', system-ui, sans-serif;
  font-size: 16px;
  line-height: 1.7;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  touch-action: none;
}
```

Remove these utility classes entirely (they are dead code after sections are deleted):
- `.section-tag { ... }`
- `.gold-rule { ... }`
- `body.lang-th h1, body.lang-th h2, body.lang-th h3, body.lang-th .section-head em { ... }`

Keep `body.lang-th { font-family: ... }` intact.

- [ ] **Step 4: Run tests**

```bash
npm test
```
Expected: all passing (no imports from deleted files yet — that's Task 8)

- [ ] **Step 5: Start dev server + visual smoke test**

```bash
npm run dev -- --port 3002
```

Then use Playwright MCP to verify:

```
mcp__plugin_playwright_playwright__browser_navigate: http://localhost:3002
mcp__plugin_playwright_playwright__browser_take_screenshot: verify canvas + overlay visible
```

Check:
- Canvas visible at `#050505` background (near-black)
- Overlay renders: "GOODY" logo top-left, LangToggle top-right
- Center text shows "Goody Vivitthachai" + label + subtitle
- 8 dot nav buttons visible right side
- Progress shows "000%"
- Scroll hint visible at bottom

```
mcp__plugin_playwright_playwright__browser_evaluate:
  window.dispatchEvent(new WheelEvent('wheel', { deltaY: 500, bubbles: true }))
mcp__plugin_playwright_playwright__browser_take_screenshot
```

Check after scroll:
- Center text updated (different zone title)
- Progress counter > 0
- Scroll hint gone

```
# Test lang toggle
mcp__plugin_playwright_playwright__browser_click: LangToggle button
mcp__plugin_playwright_playwright__browser_take_screenshot
```

Check: center text switches to Thai.

- [ ] **Step 6: Build check**

```bash
npm run build
```
Expected: success — static export to `out/`

- [ ] **Step 7: Commit**

```bash
git add components/scene/SceneInner.jsx app/page.js styles/globals.css
git commit -m "feat(scene): wire nebula fly-through — SceneInner+page.js+globals for cyan theme"
```

---

## Task 8: Cleanup — Delete Old Files + Update Test Suite + E2E

**Tools:**
- **Model:** claude-haiku-4-5-20251001 (mechanical deletion + test rewrite)
- **Plugin/Skill:** none
- **MCP:** mcp__plugin_playwright_playwright — final E2E run after rewrite

**Files:**
- Delete: `lib/keyframes.js`, `lib/keyframes.test.js`
- Delete: `hooks/useCinematicReveal.js`, `hooks/useCinematicReveal.test.js`
- Delete: `hooks/useMagneticTilt.js`, `hooks/useMagneticTilt.test.js`
- Delete: `hooks/useCursorWorld.js`
- Delete: `components/sections/` (entire directory — 8 jsx + 8 module.css + 1 test)
- Delete: `components/ui/NavBar.jsx`, `components/ui/NavBar.module.css`
- Rewrite: `e2e/portfolio.test.js`

---

- [ ] **Step 1: Delete old hook + lib files**

```bash
rm lib/keyframes.js lib/keyframes.test.js
rm hooks/useCinematicReveal.js hooks/useCinematicReveal.test.js
rm hooks/useMagneticTilt.js hooks/useMagneticTilt.test.js
rm hooks/useCursorWorld.js
```

- [ ] **Step 2: Delete old section components**

```bash
rm -rf components/sections/
rm components/ui/NavBar.jsx components/ui/NavBar.module.css
```

- [ ] **Step 3: Run vitest — verify suite still passes**

```bash
npm test
```
Expected: PASS — zones + useFlightProgress + content + LangContext + LangToggle tests all green. Test count will be lower than 34 (deleted test files) — that's expected.

If any test fails with "Cannot find module" from a file we didn't touch, investigate before proceeding.

- [ ] **Step 4: Rewrite e2e/portfolio.test.js**

Replace full content:
```js
import { test, expect } from '@playwright/test';

// Requires: http server running at port 3002
// Run: npm run dev -- --port 3002
// Or: npm run build && npx serve out -p 3002

test('canvas and overlay both mount', async ({ page }) => {
  await page.goto('http://localhost:3002');
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.locator('[data-testid="overlay"]')).toBeVisible();
});

test('overlay shows zone 0 text on load', async ({ page }) => {
  await page.goto('http://localhost:3002');
  const title = page.locator('[data-testid="zone-title"]');
  await expect(title).toBeVisible();
  await expect(title).toContainText('Goody');
});

test('lang toggle switches to Thai', async ({ page }) => {
  await page.goto('http://localhost:3002');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.locator('button[aria-label="Switch to Thai"]').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'th');
  await expect(page.locator('body')).toHaveClass(/lang-th/);
});

test('lang persists after reload', async ({ page }) => {
  await page.goto('http://localhost:3002');
  await page.locator('button[aria-label="Switch to Thai"]').click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'th');
});

test('dot nav has 8 buttons', async ({ page }) => {
  await page.goto('http://localhost:3002');
  const dots = page.locator('nav[aria-label="Section navigation"] button');
  await expect(dots).toHaveCount(8);
});

test('scroll wheel advances progress counter', async ({ page }) => {
  await page.goto('http://localhost:3002');
  await page.waitForTimeout(500);
  const before = await page.locator('[data-testid="progress"]').textContent();
  await page.mouse.wheel(0, 3000);
  await page.waitForTimeout(300);
  const after = await page.locator('[data-testid="progress"]').textContent();
  expect(before).not.toBe(after);
});
```

- [ ] **Step 5: Add data-testid attributes to Overlay.jsx**

In `components/ui/Overlay.jsx`, add `data-testid` props that the new E2E tests reference:

```jsx
// On the root div:
<div className={styles.overlay} data-testid="overlay">

// On the .center div:
<div className={styles.center} data-testid="zone-text" style={{ opacity: textVisible ? 1 : 0 }} aria-live="polite">

// On h1:
<h1 className={...} data-testid="zone-title">

// On progress div:
<div className={styles.progress} data-testid="progress" aria-hidden="true">
```

- [ ] **Step 6: Run vitest one more time**

```bash
npm test
```
Expected: PASS — all remaining unit tests green

- [ ] **Step 7: Run E2E (with dev server running)**

Playwright E2E requires a running server. Start `npm run dev -- --port 3002` in background first, then:

```bash
npx playwright test e2e/portfolio.test.js --reporter=list
```

Expected: some tests may need adjustment based on actual render behavior. Debug via:
```bash
npx playwright test e2e/portfolio.test.js --debug
```

- [ ] **Step 8: Final build check**

```bash
npm run build
```
Expected: success

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: delete legacy sections+nav, rewrite E2E tests for fly-through overlay"
```

---

## Definition of Done

- [ ] Camera flies from Hero to Contact via scroll wheel — 1:1, no lag, no GSAP
- [ ] NodeGraph visible in cyan wireframe at zone 0 position
- [ ] Centered overlay text fades + updates on zone change (EN and TH)
- [ ] 8 dot nav buttons — click jumps to zone midpoint
- [ ] Mouse repels amber particle layer
- [ ] Progress counter (bottom-left) increments on scroll
- [ ] Scroll hint fades after first wheel event
- [ ] Bilingual toggle works — all overlay text switches
- [ ] No `<Html>` inside Canvas
- [ ] `npm test` passes (vitest)
- [ ] `npm run build` passes (static export)
- [ ] E2E: canvas + overlay mount, lang toggle, dot count verified

---

## Plan 2 (Follow-On): Zone Objects

After this plan merges, implement the remaining 6 zone-specific 3D objects in a separate plan:

| Task | Component | Zone | Z |
|------|-----------|------|---|
| 2.1 | `BarChart.jsx` | About | -27 |
| 2.2 | `Bridge.jsx` | Experience | -45 |
| 2.3 | `NodeRing.jsx` | Skills | -62 |
| 2.4 | `BuildingA.jsx` | Work | -80 |
| 2.5 | `BlueprintGrid.jsx` | Education | -97 |
| 2.6 | `BuildingB.jsx` | Certs | -112 |

Each task: create component in `components/scene/`, add to `SceneInner.jsx`, verify visually.
Spec in `docs/superpowers/specs/2026-06-21-nebula-redesign-design.md` §"3D Objects Specification".
