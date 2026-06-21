# Nebula Fly-Through Redesign — Design Spec

**Date:** 2026-06-21  
**Branch:** `feat/3d-rewrite`  
**Reference:** `/Users/goody/Downloads/nebula_v5.html`  
**Approach:** A — pure fly-through, minimal centered text overlay

---

## Concept

Camera starts at `z=0`, flies to `z=-160` across 8 section zones (last zone Contact ends at -160). Scroll wheel = raw camera z movement (1:1, no tweens, no lag). Each zone contains one 3D wireframe object specific to that section's content. A centered DOM overlay shows section label / title / subtitle that fades and changes on zone entry.

This replaces the current scroll-section paradigm (8 HTML sections + camera tweening between positions) with a single continuous 3D space the user navigates by flying through it.

---

## Color Palette

| Token | Value | Use |
|-------|-------|-----|
| `--bg` | `#050505` | Canvas + page background |
| `--wire-bright` | `#88CCFF` | Primary wireframe lines, node points |
| `--wire-dim` | `#4499CC` | Secondary wireframe, grid lines |
| `--particle-gold` | `#F59E0B` / `#FCD34D` | Ambient particle field (warm, nebula feel) |
| `--particle-dust` | `#78350F` / `#92400E` | Fine dust layer (very dim) |
| `--text-primary` | `rgba(255,255,255,0.92)` | Section titles |
| `--text-label` | `rgba(245,158,11,0.65)` | Section labels (gold, keeps brand warmth) |
| `--text-sub` | `rgba(255,255,255,0.20)` | Section subtitles |
| `--accent-gold` | `rgba(245,158,11,0.75)` | CTA, active dot nav |

---

## Zone Map

Camera travels from `z=0` to `z=-160`. Each zone has a midpoint where text is fully visible and a 3D object centred in that z-range.

| # | Section | z-range | z-midpoint | 3D Object |
|---|---------|---------|------------|-----------|
| 0 | Hero | 0 → -20 | -10 | ERP NodeGraph (cyan, simplified — no scroll state machine) |
| 1 | About | -20 → -35 | -27 | 3D bar chart (4×5 grid, heights = stat values) |
| 2 | Experience | -35 → -55 | -45 | Warren truss bridge (spans across z-axis) |
| 3 | Skills | -55 → -70 | -62 | Node ring clusters (3 rings, rotating) |
| 4 | Work | -70 → -90 | -80 | Building A wireframe (multi-floor, X-bracing) |
| 5 | Education | -90 → -105 | -97 | Blueprint grid plane (large horizontal grid) |
| 6 | Certs | -105 → -120 | -112 | Building B tower (tall, face diagonals) |
| 7 | Contact | -120 → -140 | -130 | Dispersing particles only — no wireframe structure |

---

## 3D Objects Specification

All objects use `LineSegments` + `LineBasicMaterial`. Node points use `Points` + `PointsMaterial` with a radial gradient canvas texture (same technique as nebula_v5.html).

### NodeGraph (Hero, z=-10)
- 24 icosahedron nodes, `IcosahedronGeometry(0.18, 1)` — reduced detail for wireframe look
- Reuse existing `lib/nodePositions.js` GRID_POSITIONS only — static positions, no chaos array, no scroll state machine, no lerp logic
- Material: `LineBasicMaterial({ color: 0x88CCFF, transparent: true, opacity: 0.58 })`
- Node points: `PointsMaterial` with nT texture, `color: 0xCCE8FF, opacity: 1`
- Slow auto-rotation: `group.rotation.y += 0.0007 * dt`
- Positioned at `[-2, 0, -10]`

### BarChart (About, z=-27)
- 4 rows × 5 columns of wireframe bars
- Heights represent: ERP modules (3.2), projects delivered (4.0), years experience (1.8), certifications (2.8), countries (1.5) — normalised to 0–4 range
- Axes + grid lines in `--wire-dim`, bars in `--wire-bright`
- Top vertex points of each bar: `PointsMaterial`, `color: 0xCCE8FF, size: 0.44`
- Positioned at `[16, -0.5, -27]`, `rotation.y = -0.35`
- Slow auto-rotation: `rotation.y -= 0.0005 * dt`

### Bridge (Experience, z=-45)
- Warren truss bridge: 18 units long, 9 panels, 3 units wide, 3 units tall
- Two truss faces + cross-members + diagonal floor bracing
- Spans along x-axis (perpendicular to camera travel)
- Positioned at `[0, -4.5, -45]`
- No rotation (bridge is static — structural integrity metaphor)

### NodeRing (Skills, z=-62)
- 3 concentric rings of nodes: inner (r=2, 8 nodes), mid (r=4, 12 nodes), outer (r=6, 16 nodes)
- Each ring rotates at different speed + axis: inner Y, mid X, outer Z
- Connected within each ring by line segments
- Positioned at `[0, 0, -62]`
- Rotation per frame: inner `+0.002`, mid `-0.0015`, outer `+0.001`

### BuildingA (Work, z=-80)
- 4.5w × 4d × 13h, 7 floors, X-bracing every 2 floors
- Same geometry as nebula_v5.html BuildingA
- Positioned at `[-14, 0, -80]`, `rotation.y = 0.3`
- Slow auto-rotation: `rotation.y += 0.0006 * dt`

### BlueprintGrid (Education, z=-97)
- `GridHelper(55, 16, 0xAADDFF, 0x3388BB)`, `opacity: 0.16`
- Large horizontal plane suggesting academic foundation
- Positioned at `[0, -7, -97]`
- No rotation

### BuildingB (Certs, z=-112)
- 3.5w × 3.5d × 16h, 9 floors, face diagonals every 3 floors
- Same geometry as nebula_v5.html BuildingB
- Positioned at `[13, 0, -112]`, `rotation.y = -0.25`
- Slow auto-rotation: `rotation.y -= 0.0005 * dt`

### Contact zone (z=-130)
- No wireframe object
- Particle field only — disperses as camera approaches (density modulated by z proximity)

---

## Particle System

Two layers, same as nebula_v5.html:

**Layer 1 — Core (2000 particles):**
- Colors: `[0xF59E0B, 0xFCD34D, 0xD97706, 0xFBBF24, 0xF97316]` (warm gold/amber)
- z-spread: `-(random * 160 + 5)` — covers full flight path
- x/y spread: `±26`
- Size: `0.55`, blending: `AdditiveBlending`
- Drift: upward `+= size * dt`, wraps at `±26`
- Mouse repel: radius 5, magnitude 2.2, lerp back at 0.045

**Layer 2 — Fine dust (8000 particles):**
- Colors: `[0x78350F, 0x92400E, 0xFFFBEB, 0xD97706, 0xB45309]` at `0.35` brightness
- z-spread: `-(random * 160 + 5)`
- x/y spread: `±60`
- Size: `0.1`, opacity: `0.55`
- Drift: upward only, no mouse interaction

Both layers rendered in `ParticleField.jsx` with separate `BufferGeometry` instances.

---

## Camera System (`useFlightProgress.js` + `CameraRig.jsx`)

**`hooks/useFlightProgress.js`** — exports `useFlightProgress()`:
```js
// Returns { progress, cameraZ } where:
// progress: 0–1 (Hero=0, Contact=1)
// cameraZ: 0 to -160
```

Listens to `wheel` event (passive: false, `e.preventDefault()`). Updates a `useRef` — no React state — to avoid re-renders. Clamps `[0, 1]`.

**`CameraRig.jsx`** — reads progress ref each frame via `useFrame`:
```js
// camera.position.z = progress.current * -160
// camera.position.y = Math.sin(progress.current * Math.PI) * -2.5
// camera.position.x = Math.sin(progress.current * Math.PI * 2) * 1.5
// camera.lookAt(0, 0, camera.position.z - 10)  // always look forward
```

No GSAP. No ScrollTrigger. No keyframes. Pure math per frame.

Active zone index: `Math.min(Math.floor(progress * 8), 7)`.

---

## UI Overlay (`components/ui/Overlay.jsx`)

Single React component, `position: fixed, inset: 0, z-index: 10, pointer-events: none`.

**Sub-elements (all within Overlay):**

```
TopNav (pointer-events: all on children)
  ├── .logo — "GOODY" — 11px, 0.3em spacing, rgba(255,255,255,0.35)
  └── LangToggle — existing component, restyled to match nebula

CenterText (pointer-events: none)
  ├── .sec-lbl — section label — gold, 11px, 0.4em, uppercase
  ├── .sec-ttl — section title — clamp(3rem, 9vw, 6.5rem), weight 200, uppercase
  └── .sec-sub — subtitle — 11px, 0.3em, white 20%
  Transition: opacity 0→1 with 220ms fade-out before text swap

DotNav (pointer-events: all)
  ├── 8 buttons, right side, fixed
  └── active = gold (#F59E0B), 5px; inactive = white 20%, 4px

Progress
  └── bottom-left, monospace, "0%" → "100%"

ScrollHint
  └── bottom-center, "↕ SCROLL TO FLY THROUGH", fades to 0 after first scroll
```

**Section text data in `lib/zones.js`:**

```js
export const ZONES = [
  { zStart: 0,    zEnd: -20,  label: { en: 'Business Analyst · ERP · Data',      th: 'นักวิเคราะห์ธุรกิจ · ERP · ข้อมูล' },
    title: { en: 'Goody Vivitthachai', th: 'วิวิตถ์ชัย ลาภรัตนตระการ' },
    sub:   { en: 'Turning Complex Systems Into Measurable Impact', th: 'เปลี่ยนระบบซับซ้อนสู่ผลลัพธ์ที่วัดได้' } },
  { zStart: -20,  zEnd: -35,  label: { en: 'About Me', th: 'เกี่ยวกับฉัน' },
    title: { en: 'About',     th: 'ประวัติ' },
    sub:   { en: 'Bangkok · 8 ERP Modules · 10+ Projects · 2+ Years', th: 'กรุงเทพ · 8 โมดูล ERP · 10+ โครงการ · 2+ ปี' } },
  { zStart: -35,  zEnd: -55,  label: { en: 'ERP Implementation', th: 'การติดตั้ง ERP' },
    title: { en: 'Experience', th: 'ประสบการณ์' },
    sub:   { en: 'Oracle NetSuite · SAP S/4HANA · Full-cycle rollouts', th: 'Oracle NetSuite · SAP S/4HANA · ติดตั้งครบวงจร' } },
  { zStart: -55,  zEnd: -70,  label: { en: 'Technical Skills', th: 'ทักษะเทคนิค' },
    title: { en: 'Skills',    th: 'ทักษะ' },
    sub:   { en: 'Data Analysis · ERP · Process Design · SQL', th: 'วิเคราะห์ข้อมูล · ERP · ออกแบบกระบวนการ · SQL' } },
  { zStart: -70,  zEnd: -90,  label: { en: 'Selected Projects', th: 'โครงการที่เลือก' },
    title: { en: 'Work',      th: 'ผลงาน' },
    sub:   { en: 'ERP Systems · Dashboards · Construction Tech', th: 'ระบบ ERP · แดชบอร์ด · เทคโนโลยีก่อสร้าง' } },
  { zStart: -90,  zEnd: -105, label: { en: 'Academic Background', th: 'การศึกษา' },
    title: { en: 'Education', th: 'การศึกษา' },
    sub:   { en: 'Chulalongkorn University · Civil Engineering', th: 'จุฬาลงกรณ์มหาวิทยาลัย · วิศวกรรมโยธา' } },
  { zStart: -105, zEnd: -120, label: { en: 'Certifications', th: 'ใบรับรอง' },
    title: { en: 'Certified', th: 'การรับรอง' },
    sub:   { en: 'Oracle NetSuite Admin · SAP S/4HANA', th: 'Oracle NetSuite Admin · SAP S/4HANA' } },
  { zStart: -120, zEnd: -160, label: { en: "Let's Build Together", th: 'ร่วมสร้างด้วยกัน' },
    title: { en: 'Contact',   th: 'ติดต่อ' },
    sub:   { en: 'vivitthachaigood@gmail.com', th: 'vivitthachaigood@gmail.com' } },
];
```

---

## Bilingual System

Reuse existing `LangContext` (`lib/LangContext.jsx`) + `useLang()` hook. `Overlay.jsx` reads `lang` from context and selects `zone.label[lang]`, `zone.title[lang]`, `zone.sub[lang]`.

`LangToggle` component restyled: top-right, same nebula aesthetic (11px, letter-spaced, uppercase).

---

## Files to Delete (current R3F components no longer needed)

```
components/sections/HeroSection.jsx + .module.css
components/sections/AboutSection.jsx + .module.css
components/sections/ExperienceSection.jsx + .module.css
components/sections/SkillsSection.jsx + .module.css
components/sections/WorkSection.jsx + .module.css
components/sections/EducationSection.jsx + .module.css
components/sections/CertificationsSection.jsx + .module.css
components/sections/ContactSection.jsx + .module.css
components/ui/NavBar.jsx + .module.css
components/ui/ScrollHint.jsx (if exists)
hooks/useCinematicReveal.js
lib/keyframes.js  (replaced by lib/zones.js)
```

Keep: `lib/LangContext.jsx`, `lib/content.js` (reference for TH text), `lib/nodePositions.js` (reused by NodeGraph), `components/ui/LangToggle.jsx` (restyled).

---

## What Stays the Same

- Next.js 14, `output: 'export'`, GitHub Actions deploy to `gh-pages`
- `@react-three/fiber` v8 + `@react-three/drei` v9
- `@react-three/postprocessing` v2.x (keep Bloom + Vignette for atmosphere — `luminanceThreshold: 0.7, intensity: 0.3` suits cyan wireframe; lower than current gold settings)
- Font: Montserrat (body) — Cormorant Garamond dropped (not needed for thin uppercase style)
- Vitest unit tests — update for new components
- Playwright E2E — update selectors for new overlay

---

## Definition of Done

1. Camera flies from Hero to Contact via scroll wheel — 1:1, no lag
2. All 8 zone 3D objects visible and recognisable while flying through
3. Centered text fades and updates on zone change (both EN and TH)
4. Dot nav (8 dots) — click jumps camera to zone midpoint
5. Mouse repels core particle layer
6. Scroll % updates bottom-left
7. Hint fades after first scroll
8. Bilingual toggle works — all overlay text switches instantly
9. No `<Html>` inside Canvas
10. Vitest tests pass (updated for new component tree)
11. `npm run build` succeeds (static export)
12. Deployed to GitHub Pages from `main`
