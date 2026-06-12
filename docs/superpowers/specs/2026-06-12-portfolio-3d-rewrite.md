# Portfolio 3D Rewrite — Design Spec

**Date:** 2026-06-12  
**Author:** Goody (Vivitthachai Laprattanatrai)  
**Status:** Approved for implementation

---

## 1. Vision

Rewrite the portfolio as a high-end, cinematic 3D experience using Next.js + React Three Fiber. A floating construction dashboard (building wireframe + data panels + particle field) fills the hero. The camera choreographs through 8 scroll keyframes, each orbiting to reveal the relevant section of the scene. Every section below the fold uses cinematic 3D push reveals + magnetic card tilt.

Reference feel: oryzo.ai — 3D centerpiece, scroll-driven camera, dark/minimal, dramatic.

---

## 2. Tech Stack

| Layer | Tool | Notes |
|---|---|---|
| Framework | **Next.js 14** (App Router) | Replaces Svelte/Vite |
| 3D renderer | **React Three Fiber** (`@react-three/fiber`) | Declarative Three.js |
| 3D helpers | **@react-three/drei** | Float, Html, Stars, useGLTF, OrbitControls |
| Scroll animation | **GSAP + ScrollTrigger** | Camera choreography + section reveals |
| UI animation | **Motion** (already installed pattern) | Card tilt, micro-interactions |
| Shaders | **GLSL** (custom ShaderMaterial) | Particle vortex + gold glow bloom |
| Styles | **CSS Modules** | Keep dark-gold design system tokens |
| Language | **JavaScript (ES Modules)** | Matches existing codebase; no TS migration needed |
| 3D models | **Spline → GLB** (deferred) | Procedural placeholder until ready |
| Deploy | **GitHub Pages** (static) | `output: 'export'` in `next.config.js`; `basePath: '/mastergroot.github.io'` if needed |

---

## 3. Scene Architecture

### 3.1 Hero 3D Scene

The R3F canvas is `position: fixed; inset: 0; z-index: 0` — full viewport background, all UI sits above it.

**Scene elements:**

```
<Canvas>
  <CameraRig />           ← GSAP ScrollTrigger drives camera.position + lookAt
  <ambientLight />
  <pointLight />          ← gold, pos (0, 5, 5)
  <BuildingWireframe />   ← procedural EdgesGeometry placeholder → swap .glb later
  <DataPanels />          ← drei/Float + Html overlays (ERP metrics, site data)
  <ParticleField />       ← custom GLSL ShaderMaterial, ~120 nodes, cursor vortex
  <ContactAccent />       ← smaller 30-node version, renders only near contact section
</Canvas>
```

### 3.2 Building Wireframe (Placeholder)

Until the Blender/Spline model is ready, build procedurally:
- `BoxGeometry(2, 3, 2)` → `EdgesGeometry` → `LineSegments` with gold `LineBasicMaterial`
- Add floor lines with `PlaneGeometry` + grid shader
- Corner node dots: `SphereGeometry(0.06)` with pulsing emissive gold material
- Swap path: `useGLTF('/models/building.glb')` — when model is ready, replace the procedural geometry with the loaded mesh. No other code changes required.

### 3.3 Floating Data Panels

Using `@react-three/drei`'s `<Float>` (gentle bobbing) + `<Html>` (DOM panel rendered in 3D space):

```
Panel 1 — ERP Modules: 8 (top-left of building)
Panel 2 — Projects Delivered: 10+ (top-right)
Panel 3 — Site Engineering: Q/C (bottom-left)
Panel 4 — Data Analytics: Google Certified (bottom-right)
```

Panels use glassmorphism styling (`rgba(212,175,55,0.06)`, gold border). On cursor proximity (<1.5 units), panels scale up slightly and glow brighter.

### 3.4 Particle Field — GLSL Shader

Custom `ShaderMaterial` with:

**Vertex shader:** Each particle position is displaced toward the cursor using a uniform `uMouse` (world-space vec3). Displacement formula:
```glsl
float dist = length(position - uMouse);
float strength = 1.0 / (dist * dist + 0.5);
pos += (uMouse - position) * strength * uVortexStrength;
```

**Fragment shader:** Circular point with gold color + distance-based glow:
```glsl
float d = length(gl_PointCoord - vec2(0.5));
float alpha = smoothstep(0.5, 0.1, d) * vAlpha;
gl_FragColor = vec4(uGoldColor, alpha);
```

~120 nodes. Autonomous slow drift (perlin noise on each node position). On cursor enter hero: `uVortexStrength` tweens from 0 → 0.8 via GSAP. On scroll out of hero: strength tweens to 0.

### 3.5 Camera Choreography

8 keyframes — one per section. GSAP ScrollTrigger scrubs `camera.position` and `lookAt` target smoothly between keyframes as user scrolls. Preserves current `keyframes.js` data, migrated to R3F `useFrame`.

```
KF 0 — Intro:    pos (0, 6, 12)  → full scene, particles active
KF 1 — About:    pos (2, 3, 9)   → closer, building centred
KF 2 — Education: pos (3, 0, 8)  → side angle
KF 3 — Skills:   pos (0, 7, 13)  → wide pull-back
KF 4 — Work:     pos (-3, 2, 9)  → orbit left, work cluster
KF 5 — Experience: pos (5, 3, 9) → elevated wide
KF 6 — Certs:    pos (7, 2, 7)   → orbit right
KF 7 — Contact:  pos (1, 1, 7)   → pull back, contact node visible
```

---

## 4. Section Reveals — Cinematic 3D Push

Replace current simple fade-in with a `useCinematicReveal` hook using IntersectionObserver + GSAP:

**Entry animation per section:**
- Start: `scale(0.85) translateY(60px) opacity(0) blur(4px)`
- End: `scale(1) translateY(0) opacity(1) blur(0)`
- Duration: 700ms, `cubic-bezier(0.16, 1, 0.3, 1)` (expo out)
- Cards within section stagger: 80ms delay per item (nth-child)

**Section heading:** arrives first (no delay)  
**Cards/items:** cascade in at 80ms intervals after heading

---

## 5. Magnetic Card Tilt

A `useMagneticTilt` hook applied to all cards (Work, Skills, Certs, Education):

```js
onMouseMove(e) {
  const { offsetX, offsetY, target } = e;
  const { width, height } = target.getBoundingClientRect();
  const rotateY = ((offsetX / width) - 0.5) * 16;   // max ±8°
  const rotateX = -((offsetY / height) - 0.5) * 16;
  card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  // Gold spotlight follows cursor via CSS custom property
  card.style.setProperty('--mx', (offsetX / width * 100) + '%');
  card.style.setProperty('--my', (offsetY / height * 100) + '%');
}

onMouseLeave() {
  gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
}
```

---

## 6. File Structure

```
/app
  layout.tsx         ← root layout, global CSS, fonts
  page.tsx           ← assembles all sections
/components
  /scene
    Scene.tsx        ← R3F Canvas wrapper
    CameraRig.tsx    ← GSAP ScrollTrigger camera controller
    BuildingWireframe.tsx  ← procedural geometry (→ useGLTF swap point)
    DataPanels.tsx   ← Float + Html panels
    ParticleField.tsx ← GLSL shader particles + cursor vortex
    ContactAccent.tsx ← mini particle scene for contact section
  /sections
    Intro.tsx        ← migrated from Intro.svelte
    About.tsx
    Experience.tsx
    Skills.tsx
    Work.tsx
    Education.tsx
    Certifications.tsx
    Contact.tsx
  /ui
    LangToggle.tsx   ← bilingual toggle
    NavBar.tsx
/hooks
  useMagneticTilt.ts
  useCinematicReveal.ts
  useCursorWorld.ts  ← maps mouse to 3D world coordinates for vortex
/lib
  keyframes.ts       ← camera keyframe data (migrated from keyframes.js)
  content.ts         ← all EN/TH bilingual strings
/shaders
  particle.vert.glsl
  particle.frag.glsl
/public
  /models
    building.glb     ← placeholder empty; swap with Spline/Meshy export
  /assets
    Vivitthachai_Goody_CV.pdf
```

---

## 7. Bilingual System

All EN/TH strings migrate from Svelte components into `/lib/content.ts` — a single typed object keyed by section and language. A React context `LangContext` provides `lang` + `setLang`. Components read `content[section][lang].fieldName`.

Thai font (Sarabun) and `lang-th` body class preserved exactly as current.

---

## 8. Performance & Degradation

- Three.js / R3F canvas: skip on `pointer: coarse` (mobile) — show static dark background instead
- `prefers-reduced-motion`: disable all GSAP animations, show static scene
- GLSL vortex: `uVortexStrength = 0` on mobile
- Magnetic tilt: skip on `pointer: coarse`
- `<Suspense>` around R3F Canvas with a dark fallback
- `next/dynamic` with `ssr: false` for the Canvas component (Three.js is browser-only)

---

## 9. Deferred (Phase 2)

- **Blender/Spline building model** — swap `BuildingWireframe.tsx` procedural geometry for `useGLTF('/models/building.glb')`. No other changes.
- **WebGL post-processing** — bloom pass via `@react-three/postprocessing` for gold glow
- **Mobile layout** — full mobile polish pass after desktop is complete

---

## 10. Out of Scope

- Backend / API routes
- CMS integration
- Authentication
- Any page other than the single-page portfolio

---

## 11. Success Criteria

- [ ] Camera smoothly choreographs through all 8 sections on scroll
- [ ] Cursor vortex pulls particles on desktop
- [ ] All sections reveal with cinematic 3D push
- [ ] All cards respond to magnetic tilt on hover
- [ ] EN/TH toggle works across all sections
- [ ] CV download link works
- [ ] Deploys to GitHub Pages via `next export`
- [ ] `prefers-reduced-motion` disables all animations
- [ ] Lighthouse performance ≥ 80 on desktop
