# Portfolio 3D Redesign — Design Spec

**Date:** 2026-06-03  
**Author:** Goody (Vivitthachai Laprattanatrai)  
**Status:** Approved — ready for implementation planning

---

## Overview

A Level 3 redesign of the personal portfolio at https://mastergroot.github.io. The current plain HTML/CSS/JS site is not touched. This is a greenfield Svelte + Three.js experience built alongside it, then deployed to replace it.

**Ambition:** Scroll-driven 3D experience — one persistent WebGL canvas, camera and node animations driven by scroll position, HTML content layered on top.

**Mood:** Dark Gold Evolved — current dark/gold palette, deepened with 3D lighting, volumetric glow, and metallic materials.

**Timeline estimate:** 4–6 weeks.

---

## Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Svelte + Vite (not SvelteKit) | Single-page, no routing needed; Vite for HMR |
| 3D | Three.js | Proven, good Svelte interop |
| Animation | GSAP | Smooth camera/material transitions |
| Build | Vite → `dist/` | Static output, no server |
| Deploy | GitHub Actions → `gh-pages` branch | Automatic on push to `main` |
| Audio | None | Keeps experience clean |

---

## Architecture

Two independent layers:

**Canvas layer** — `position: fixed`, full viewport, `z-index: 0`  
A single Three.js scene. Never scrolls. The Systems Network lives here permanently.

**Content layer** — `position: relative`, normal document flow, `z-index: 1`  
Eight Svelte section components that scroll over the canvas. Pure HTML — no CSS3DRenderer.

**Scroll → State bridge**  
`IntersectionObserver` watches each section at 50% threshold. On intersection, updates `sceneStore` with the active section index (0–7). `ThreeCanvas.svelte` subscribes to `sceneStore` and calls `animateToKeyframe(index)`.

### File Structure

```
src/
  App.svelte                ← mounts ThreeCanvas + 8 sections
  ThreeCanvas.svelte        ← Three.js renderer, loop, state machine
  sections/
    Intro.svelte
    About.svelte
    Education.svelte
    Skills.svelte
    Work.svelte
    Experience.svelte
    Certifications.svelte
    Contact.svelte
  stores/
    lang.js                 ← 'en' | 'th', persisted to localStorage
    scene.js                ← active section index (0–7)
  lib/three/
    network.js              ← Systems Network geometry + node management
    materials.js            ← gold/dark palette materials + shaders
    keyframes.js            ← per-section camera position + node targets
    animate.js              ← GSAP transition helpers
public/
  assets/
    Vivitthachai_Goody_CV.pdf
vite.config.js              ← base path set to repo name for GitHub Pages
```

### Data Flow

```
scroll → IntersectionObserver → sceneStore
                                     ↓
                             ThreeCanvas.svelte → animateToKeyframe()
                                                → GSAP → camera.position + node uniforms

langToggle click → langStore → all section components re-render text
                             → body class swap (lang-th → Sarabun font)
                             → localStorage.setItem('lang', value)
```

---

## 3D Centrepiece: Systems Network

An interconnected node graph representing Goody's professional ecosystem.

**Node types:**
- 1 central node — "BA / Goody" — always present
- ERP module nodes (SAP, Oracle, etc.)
- Client industry nodes (Manufacturing, Distribution, etc.)
- Skill cluster nodes (Analysis, ERP, PM, Tech, Communication)
- Education nodes (university, institutions)
- Certification nodes

**Edges:** Curved lines between related nodes. Animated particles travel along edges in the Intro scene to suggest live data flow.

**Materials:** Dark background, nodes use emissive gold `MeshStandardMaterial`. Active nodes increase emissive intensity. Edges are `Line` with a custom shader that accepts a `highlighted` uniform.

---

## Scene Keyframes

| # | Scene | Camera position | Node behaviour |
|---|---|---|---|
| 0 | Intro | Wide, slight top-down angle | All nodes lit; golden particles flow along edges |
| 1 | About | Zoom toward central node | Peripheral nodes dim; central node glows brighter |
| 2 | Education | Rotate to face edu cluster | Edu nodes light up; connecting lines draw in |
| 3 | Skills | Pull back, all clusters visible | Nodes re-colour by skill category |
| 4 | Work | Pan to company cluster | Company nodes activate sequentially |
| 5 | Experience | Low angle along chronological arc | Nodes arrange in arc; year labels appear |
| 6 | Certifications | Orbit view, looking inward | Cert nodes orbit central node on faint ring paths |
| 7 | Contact | Close-up on single contact node | All edges converge to contact node; steady pulse |

**Transition:** GSAP animates `camera.position` + `camera.lookAt` target + node material uniforms over 0.8s ease-in-out. No scroll hijacking — native scroll continues; IntersectionObserver fires the state change.

---

## Bilingual System

Same `data-en` / `data-th` pattern as current site, driven by Svelte reactive `langStore`.

- Section components read `langStore` and set `innerHTML` on `data-en`/`data-th` spans
- `body.lang-th` class swaps font to Sarabun (same as current site)
- TH toggle: small icon button in bottom-right corner — discoverable but not prominent
- `localStorage` key: `'lang'`, default `'en'`

Thai is an easter egg — unlabelled toggle, not advertised in the EN UI.

---

## Mobile Strategy

**Detection:** `window.matchMedia('(pointer: coarse), (max-width: 768px)').matches` — evaluated once at init, stored as `const isMobile`.

**If mobile:**
- Canvas renders static Intro keyframe (no GSAP scroll binding)
- Sections scroll normally over the frozen canvas
- `body.mobile` class adds CSS gradient overlays behind section text for legibility
- Skip `IntersectionObserver` scene switching
- All content and bilingual features remain fully functional

**If desktop:**
- Full scroll-driven experience as designed

---

## Build & Deploy

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [main]
jobs:
  deploy:
    steps:
      - checkout
      - setup Node 20
      - npm ci
      - npm run build          # Vite → dist/
      - peaceiris/actions-gh-pages@v3
          publish_dir: ./dist
          destination_branch: gh-pages
```

`vite.config.js`:
```js
export default {
  base: '/portfolio/',   // adjust to actual repo name
  plugins: [svelte()]
}
```

---

## Performance Targets

- First meaningful paint < 2s on desktop (3G throttled)
- Three.js canvas capped at 60fps with `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`
- Node count kept under 40 total to avoid draw-call overhead
- Draco compression on any imported geometry (if used)
- Lazy-load Three.js behind a dynamic import to keep initial bundle lean

---

## Out of Scope

- Audio
- SvelteKit routing
- Server-side rendering
- CMS or editable content
- Analytics (can be added post-launch as a separate task)
