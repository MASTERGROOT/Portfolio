# Portfolio Visual Polish — Design Spec
**Date:** 2026-06-22
**Branch:** feat/3d-rewrite
**Status:** Approved
**Approach:** A — Focused Refinement (10 files edited, 6 files created, 0 new architecture)

---

## Goal

Upgrade the existing 3D fly-through from functional prototype to premium portfolio quality. The 3D fly-through concept is sound; the problems are: cyan/gold color conflict, weak bloom, no custom cursor, no loader, plain unanimated overlay, and no section content. This spec fixes all of those without touching camera logic, zone system, or test coverage.

---

## Section 1 — Design Tokens & Color System

Replace all cyan references with unified dark-gold palette.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#060504` | Canvas background (warm near-black) |
| `--gold` | `#F59E0B` | Primary accent, active states, glows |
| `--gold-lt` | `#FCD34D` | Highlights, node glow |
| `--gold-dk` | `#D97706` | Deep gold, node shells |
| `--text-pri` | `rgba(255,255,255,0.92)` | Primary text |
| `--text-muted` | `rgba(255,255,255,0.35)` | Labels, hints |
| `--glass-bg` | `rgba(6,5,4,0.88)` | Panel background |
| `--glass-border` | `rgba(245,158,11,0.18)` | Panel/nav borders |
| `--gold-glow` | `0 0 30px rgba(245,158,11,0.25)` | Glow shadow |

**Typography:**

| Role | Font | Weight |
|---|---|---|
| Hero/Zone title | Cormorant Garamond | 200 |
| Nav / Labels / Body | Montserrat | 400/500 |
| Thai fallback | Sarabun | 300/400 |
| Progress counter | monospace system | 200 |

---

## Section 2 — 3D Scene Unification

**NodeGraph** (`components/scene/NodeGraph.jsx`):

| Element | Old | New |
|---|---|---|
| Wire color | `0x88CCFF` cyan | `0xF59E0B` amber |
| Wire opacity | 0.58 | 0.40 |
| Node shell color | `0x88CCFF` | `0xD97706` deep gold |
| Node glow color | `0xCCE8FF` | `0xFCD34D` light gold |
| Node glow size | 0.65 | 0.55 |

**SceneInner lighting** (`components/scene/SceneInner.jsx`):

| Light | Old | New |
|---|---|---|
| Key | `#88CCFF` intensity 0.5 | `#FFB347` intensity 0.6 |
| Fill | `#4499CC` intensity 0.3 | `#FF8C00` intensity 0.25 |
| Rim | `#ffffff` intensity 0.8 | `#FFF8E7` intensity 0.7 |
| Background | `#050505` | `#060504` |

**ParticleField** (`components/scene/ParticleField.jsx`) — minor only:

- Core particle size: 0.55 → 0.50
- Dust opacity: 0.55 → 0.40

**Post-processing** (`SceneInner.jsx`):

| Effect | Old | New |
|---|---|---|
| Bloom intensity | 0.3 | 0.9 |
| Bloom luminanceThreshold | 0.7 | 0.55 |
| Bloom luminanceSmoothing | 0.025 | 0.9 |
| Vignette darkness | 0.6 | 0.75 |
| ChromaticAberration | none | Added — `[0,0]` default, spikes `[0.003,0.003]` for 300ms on each zone change |

ChromaticAberration offset stored in a `useRef([0,0])` inside `SceneInner`. A `useFrame` watches `flightProgress.zoneIndex.current` against a `prevZone` ref — on change, set offset to `[0.003, 0.003]` and schedule reset to `[0, 0]` after 300ms via `setTimeout`. Use `@react-three/postprocessing` `ChromaticAberration` component.

---

## Section 3 — Loader Screen

**New file:** `components/ui/Loader.jsx` + `Loader.module.css`

**Layout:**
```
┌─────────────────────────────────────────────┐
│                                             │
│         VIVITTHACHAI LAPRATTANATRAI         │  Cormorant 200, tracking 0.35em, white 0.85
│       BUSINESS ANALYST · ERP · DATA        │  Montserrat 400, 11px, tracking 0.5em, #F59E0B
│                                             │
│  087                                        │  monospace 200, 72px, white 0.12, bottom-left
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░│  1px gold progress bar, very bottom
└─────────────────────────────────────────────┘
```

**Animation sequence (total ~2.2s):**

| Time | Event |
|---|---|
| 0ms | bg `#060504` instant; name fades in (`opacity 0→0.85`, `translateY 8px→0`, 600ms ease-out) |
| 200ms | role label fades in (400ms ease-out) |
| 300ms | counter 000→100 over 1.5s easeInOut; gold bar fills left→right over 1.5s |
| 1800ms | counter hits 100, bar full |
| 1900ms | whole loader fades out (`opacity 1→0`, 300ms ease-in) |
| 2200ms | loader unmounts, 3D scene appears |

**Rules:**
- `prefers-reduced-motion`: skip animation, show 100% instantly, unmount after 400ms
- Mobile name: `clamp(1.1rem, 5vw, 2rem)`
- `page.js` renders `<Loader onComplete={() => setLoaded(true)} />` before 3D scene

---

## Section 4 — Custom Gold Cursor

**New file:** `components/ui/Cursor.jsx`

**Structure:** Two `position: fixed; pointer-events: none; z-index: 9999` divs.

- **Dot:** 8px solid `#F59E0B`, `border-radius: 50%`, follows cursor exactly
- **Ring:** 28px, `border: 1px solid rgba(245,158,11,0.5)`, `border-radius: 50%`, lerps to cursor position (factor 0.12/frame via rAF)

**States:**

| State | Dot | Ring |
|---|---|---|
| Default | 8px gold | 28px ring, lagged |
| Hover interactive | `scale(0)` | `scale(1.5)` + `background: rgba(245,158,11,0.08)` |
| Click | `scale(0.6→1.2→1)` 150ms | `scale(0.8→1)` 150ms |
| Over canvas | + `box-shadow: 0 0 8px rgba(245,158,11,0.7)` | unchanged |

**Implementation:**
- `body { cursor: none }` scoped to `@media (pointer: fine)` in `styles/globals.css`
- Interactive elements get `data-cursor="hover"` attribute: dot nav buttons, zone titles, panel close, LangToggle, detail panel CTAs
- `motion/react` `animate()` for state transitions

---

## Section 5 — Overlay Redesign

**File:** `components/ui/Overlay.jsx` + `Overlay.module.css`

**Top nav:**
- Logo: `VIVITTHACHAI` — Cormorant 200, 13px, tracking 0.4em, white 0.65
- LangToggle: glass pill — `rgba(6,5,4,0.6)` bg, `border: 1px solid rgba(245,158,11,0.2)`, gold active state

**Center text block:**

```
BUSINESS ANALYST · ERP · DATA       ← label: 10px Montserrat, tracking 0.5em, #F59E0B
                                      entrance: fadeUp (y:4px→0), opacity 0→1, 400ms ease-out, delay 80ms

    Goody Vivitthachai               ← title: Cormorant 200, clamp(3.5rem,10vw,7.5rem)
                                      entrance: fadeUp (y:12px→0), opacity 0→1, 500ms ease-out

Turning Complex Systems Into         ← sub: 11px Montserrat, white 0.22, tracking 0.3em
Measurable Impact                     entrance: fadeUp (y:8px→0), opacity 0→1, 350ms ease-out, delay 120ms
```

Zone transition:
1. Exit: all 3 lines `translateY 0→-10px` + `opacity 1→0`, 220ms ease-in, staggered 30ms
2. 220ms pause
3. Enter: new zone text `translateY +10px→0` + `opacity 0→1`, staggered 30ms between label/title/sub

**Center text click:** opens detail panel for current zone. Add `data-cursor="hover"` + `pointer-events: all`.

**Bottom progress bar:**
```
GOODY ────────────────── 087%
```
- Left: `GOODY`, Montserrat 400, 9px, tracking 0.4em, white 0.20
- Right: `087%`, monospace 200, 10px, white 0.18
- Between: `1px` gold line `rgba(245,158,11,0.25)`, width = `progress * 100%`, `transition: width 100ms linear`
- Position: `absolute; bottom: 1.5rem; left: 2rem; right: 2rem`

**Scroll hint:** add `@keyframes pulse` — `opacity 0.18→0.38→0.18`, 3s infinite.

**Dot navigation:**
- Magnetic: on cursor within 45px, dot translates toward cursor (max ±6px x/y), spring reset on mouse-out
- Active: `box-shadow: 0 0 10px rgba(245,158,11,0.8)`, scale 1.4, gold fill
- Hover tooltip: zone title in glass pill, slides from right (`translateX 8px→0`, 200ms ease-out)
- `data-cursor="hover"` on each dot

---

## Section 6 — Glassmorphic Detail Panels

**New file:** `components/ui/DetailPanel.jsx` + `DetailPanel.module.css`
**New file:** `lib/content.js` — all EN/TH panel strings

**Panel shell:**
- Width: 380px desktop / 100vw mobile
- Height: 100vh, right edge pinned, `overflow-y: auto`
- BG: `rgba(6,5,4,0.88)` + `backdrop-filter: blur(24px) saturate(1.4)`
- Border-left: `1px solid rgba(245,158,11,0.18)`
- Entrance: `translateX(100%→0)`, 400ms `cubic-bezier(0.22,1,0.36,1)`
- Exit: `translateX(0→100%)`, 280ms ease-in
- Header: zone label (Montserrat 10px, tracking 0.4em) + ✕ close button
- Separator: `1px solid rgba(245,158,11,0.2)`
- Close triggers: ✕ button, Escape key, click outside panel

**Zone content:**

| Zone | Content |
|---|---|
| 0 Hero | Download CV (gold pill) + Email Me (outline pill) + LinkedIn, GitHub, Email links |
| 1 About | 3 stat cards (2+ YRS / 8 MODULES / 10+ PROJECTS) + 2-line bio |
| 2 Experience | Timeline: 2 roles — title, company, year range, 2 bullets each |
| 3 Skills | 4 category headers + skill chip tags |
| 4 Work | 3 project cards — title, 1-line desc, 2-3 tag chips |
| 5 Education | Chulalongkorn University card — degree, year, honors |
| 6 Certified | 2 cert cards — Oracle NetSuite Admin + SAP S/4HANA |
| 7 Contact | Email (large), LinkedIn, Download CV, "Available for freelance" status pill |

**Stat cards (Zone 1):**
- `border-radius: 12px`
- Border: `1px solid rgba(245,158,11,0.15)`, bg `rgba(245,158,11,0.04)`
- Number: Cormorant 200, 2.5rem, `#F59E0B`
- Label: Montserrat 400, 9px, tracking 0.4em, white 0.4

**Skill chips:**
- BG: `rgba(245,158,11,0.08)`, border `1px solid rgba(245,158,11,0.2)`, `border-radius: 4px`
- Text: Montserrat 400, 11px, white 0.7
- Hover: BG `rgba(245,158,11,0.15)`, border gold 0.4

---

## File Map

| File | Action | What changes |
|---|---|---|
| `styles/globals.css` | Edit | Design tokens, `cursor: none` for `pointer: fine` |
| `app/layout.js` | Edit | Fonts already loaded (Cormorant Garamond + Montserrat + Sarabun); add `<Cursor />` mount |
| `app/page.js` | Edit | Add Loader state gate, add Cursor component |
| `components/scene/SceneInner.jsx` | Edit | Lighting colors, Bloom params, add ChromaticAberration |
| `components/scene/NodeGraph.jsx` | Edit | Wire + node colors to gold |
| `components/scene/ParticleField.jsx` | Edit | Core size, dust opacity |
| `components/ui/Overlay.jsx` | Edit | Full redesign — new logo, animated text, bottom bar, magnetic dots, tooltip, click-to-open panel |
| `components/ui/Overlay.module.css` | Edit | All new styles |
| `components/ui/LangToggle.jsx` | Edit | Glass pill style |
| `components/ui/LangToggle.module.css` | Edit | Glass pill styles |
| `components/ui/Loader.jsx` | Create | Loader component |
| `components/ui/Loader.module.css` | Create | Loader styles |
| `components/ui/Cursor.jsx` | Create | Custom cursor component |
| `components/ui/DetailPanel.jsx` | Create | Glassmorphic panel |
| `components/ui/DetailPanel.module.css` | Create | Panel styles |
| `lib/content.js` | Create | All EN/TH panel content strings |

---

## Accessibility & Performance

- `prefers-reduced-motion`: disable all entrance/exit/cursor animations; Loader skips to 100%
- `@media (pointer: fine)` gates: custom cursor, magnetic dots
- Chromatic aberration spike: max 300ms, imperceptible on `prefers-reduced-motion`
- `backdrop-filter` has GPU cost — panel only mounts when open
- Touch targets: all dot nav buttons ≥ 44×44px (padding box)
- Focus states: panel close button, dot nav, LangToggle all have visible focus ring
- ARIA: `DetailPanel` uses `role="dialog"`, `aria-modal="true"`, focus trap on open

---

## Out of Scope

- Camera logic, zone system, useFlightProgress — untouched
- E2E tests — existing 34 tests stay green; new panel tests added separately
- GitHub Pages deploy pipeline — unchanged
- Scene geometry (NodeGraph mesh shape) — unchanged; color only
