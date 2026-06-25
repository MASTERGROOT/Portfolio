# Camera FOV + Per-Section Easing + Environment Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add FOV animation, per-section camera easing, and HDRI environment map to produce cinematographic camera movement and physically plausible glass reflections.

**Architecture:** Extend each KEYFRAME object with `fov`, `ease`, and `duration` fields; update `tweenTo()` in `CameraRig.jsx` to consume them; add `<Environment preset="city">` to `SceneInner.jsx` inside the existing `<Suspense>`. No new files — all changes are additive to existing code.

**Tech Stack:** React Three Fiber v8 · Three.js v0.167 · GSAP 3.12 · @react-three/drei v9 · Vitest 1.6

## Global Constraints

- `@react-three/postprocessing` **must stay at v2.x** — v3 crashes with R3F v8
- `@react-three/drei` already installed at v9.105.4 — `Environment` is included, no new packages needed
- All GSAP ease strings must be valid GSAP 3 eases (no `Circ`, use `power*` / `sine` / `expo`)
- `camera.updateProjectionMatrix()` must be called in `onUpdate` whenever `fov` is tweened
- `prefers-reduced-motion`: crane-shot skip in `CameraRig` already handles this — the per-section `tweenTo()` path is entered only after the guard, so no extra gate needed
- Run tests with: `npm test` (vitest run)
- Dev server: `npm run dev -- --port 3002`
- Branch: `feat/3d-rewrite`

---

## File Map

| File | Action | Reason |
|------|--------|--------|
| `lib/keyframes.js` | Modify | Add `fov`, `ease`, `duration` to all 8 KEYFRAME objects |
| `lib/keyframes.test.js` | Modify | Extend existing tests to assert new fields |
| `components/scene/CameraRig.jsx` | Modify | `tweenTo()` reads `fov`/`ease`/`duration` from keyframe; adds FOV tween |
| `components/scene/SceneInner.jsx` | Modify | Add `<Environment>` from drei inside `<Suspense>` |

---

## Task 1: Extend Keyframes with FOV, Ease, Duration

**Model:** `claude-haiku-4-5`
**Skills:** None required
**MCP / Plugins:** None
**Files:**
- Modify: `lib/keyframes.js`
- Modify: `lib/keyframes.test.js`

**Interfaces:**
- Produces: `KEYFRAMES[i].fov` (number, degrees), `KEYFRAMES[i].ease` (string), `KEYFRAMES[i].duration` (number, seconds)
- Consumed by: Task 2 (`CameraRig.jsx` → `tweenTo()`)

---

- [ ] **Step 1: Write failing tests for new keyframe fields**

Open `lib/keyframes.test.js` and add these two `it` blocks inside the existing `describe('camera keyframes', ...)`:

```js
it('each keyframe has fov as a number between 40 and 80', () => {
  KEYFRAMES.forEach((kf, i) => {
    expect(typeof kf.fov, `kf[${i}].fov type`).toBe('number');
    expect(kf.fov, `kf[${i}].fov range`).toBeGreaterThanOrEqual(40);
    expect(kf.fov, `kf[${i}].fov range`).toBeLessThanOrEqual(80);
  });
});

it('each keyframe has ease (string) and duration (positive number)', () => {
  KEYFRAMES.forEach((kf, i) => {
    expect(typeof kf.ease, `kf[${i}].ease type`).toBe('string');
    expect(kf.ease.length, `kf[${i}].ease non-empty`).toBeGreaterThan(0);
    expect(typeof kf.duration, `kf[${i}].duration type`).toBe('number');
    expect(kf.duration, `kf[${i}].duration positive`).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run tests — confirm new tests fail**

```bash
npm test
```

Expected: `FAIL` — "cannot read properties of undefined (reading 'fov')" or similar.

- [ ] **Step 3: Update `lib/keyframes.js` with all new fields**

Replace the entire file content:

```js
import * as THREE from 'three';

export const KEYFRAMES = [
  // KF0 Intro — wide establishing, crane-shot landing zone
  { pos: new THREE.Vector3( 0, 6, 12), lookAt: new THREE.Vector3(0, 0, 0), fov: 65, ease: 'power2.inOut', duration: 1.8 },
  // KF1 About — human-level, considered arrival
  { pos: new THREE.Vector3( 2, 3,  9), lookAt: new THREE.Vector3(0, 1, 0), fov: 58, ease: 'power3.inOut', duration: 1.8 },
  // KF2 Experience — arc sweep, flowing transition
  { pos: new THREE.Vector3( 5, 3,  9), lookAt: new THREE.Vector3(0, 1, 0), fov: 55, ease: 'sine.inOut',   duration: 2.2 },
  // KF3 Skills — widest FOV, board snap
  { pos: new THREE.Vector3( 0, 7, 13), lookAt: new THREE.Vector3(0, 0, 0), fov: 72, ease: 'power4.out',   duration: 1.6 },
  // KF4 Work — balanced professional
  { pos: new THREE.Vector3(-3, 2,  9), lookAt: new THREE.Vector3(0, 1, 0), fov: 52, ease: 'power2.inOut', duration: 2.0 },
  // KF5 Education — earthen, deliberate
  { pos: new THREE.Vector3( 3, 0,  8), lookAt: new THREE.Vector3(0, 1, 0), fov: 60, ease: 'power1.inOut', duration: 2.0 },
  // KF6 Certs — telephoto precision, tightest FOV
  { pos: new THREE.Vector3( 7, 2,  7), lookAt: new THREE.Vector3(0, 1, 0), fov: 44, ease: 'power3.out',   duration: 1.4 },
  // KF7 Contact — opens wide after tightest moment
  { pos: new THREE.Vector3( 1, 1,  7), lookAt: new THREE.Vector3(0, 0, 0), fov: 64, ease: 'power2.out',   duration: 2.4 },
];
```

- [ ] **Step 4: Run tests — confirm all pass**

```bash
npm test
```

Expected: all tests pass (previously 4 tests + 2 new = 6 in keyframes suite).

- [ ] **Step 5: Commit**

```bash
git add lib/keyframes.js lib/keyframes.test.js
git commit -m "feat(camera): add fov, ease, duration to all 8 keyframes"
```

---

## Task 2: Wire FOV + Per-Section Easing in CameraRig

**Model:** `claude-sonnet-4-6`
**Skills:** `core-3d-animation:gsap-scrolltrigger` (reference if GSAP API questions arise)
**MCP / Plugins:** None
**Files:**
- Modify: `components/scene/CameraRig.jsx`

**Interfaces:**
- Consumes: `KEYFRAMES[i].fov` (number), `KEYFRAMES[i].ease` (string), `KEYFRAMES[i].duration` (number) — from Task 1
- Produces: `tweenTo(i)` that animates `camera.position`, `target.current`, and `camera.fov` using per-keyframe values

**No unit test for CameraRig** — it depends on a live WebGL context. Visual verification in Step 4.

---

- [ ] **Step 1: Update `tweenTo()` in `components/scene/CameraRig.jsx`**

Replace the existing `tweenTo` function (lines 50–65) with:

```js
function tweenTo(i) {
  const kf = KEYFRAMES[i];
  gsap.to(camera.position, {
    x: kf.pos.x,
    y: kf.pos.y,
    z: kf.pos.z,
    duration: kf.duration,
    ease: kf.ease,
  });
  gsap.to(target.current, {
    x: kf.lookAt.x,
    y: kf.lookAt.y,
    z: kf.lookAt.z,
    duration: kf.duration,
    ease: kf.ease,
  });
  gsap.to(camera, {
    fov: kf.fov,
    duration: kf.duration,
    ease: kf.ease,
    onUpdate: () => camera.updateProjectionMatrix(),
  });
}
```

- [ ] **Step 2: Run unit tests to catch any import/syntax regressions**

```bash
npm test
```

Expected: all tests pass (CameraRig has no unit tests — just confirm nothing else broke).

- [ ] **Step 3: Start dev server and visually verify FOV changes**

```bash
npm run dev -- --port 3002
```

Open `http://localhost:3002`. Scroll through sections and confirm:
- Skills section (KF3): scene noticeably **wider** than other sections (fov 72°)
- Certs section (KF6): scene noticeably **compressed / telephoto** (fov 44°)
- Contact section (KF7): FOV opens back up after Certs tightness
- Camera transitions feel slower on Experience (2.2s sine) vs Skills snap (1.6s power4.out)
- No visual glitches or projection matrix artifacts (no stretching/shearing mid-tween)

- [ ] **Step 4: Commit**

```bash
git add components/scene/CameraRig.jsx
git commit -m "feat(camera): per-section fov animation and easing differentiation"
```

---

## Task 3: Add HDRI Environment Map

**Model:** `claude-haiku-4-5`
**Skills:** `core-3d-animation:react-three-fiber` (reference for drei `<Environment>` API)
**MCP / Plugins:** `chrome-devtools-mcp` (optional — for visual before/after comparison)
**Files:**
- Modify: `components/scene/SceneInner.jsx`

**Interfaces:**
- Consumes: `@react-three/drei` (already installed at v9.105.4 — `Environment` is included)
- Produces: HDRI IBL active on scene; `NodeGraph` nodes pick up reflections via `envMapIntensity: 1.2` (already set in `NodeGraph.jsx`)

**No unit test** — environment map is a rendering-only change. Visual verification is the gate.

---

- [ ] **Step 1: Add `Environment` to the import in `SceneInner.jsx`**

At the top of `components/scene/SceneInner.jsx`, the file currently has no drei import. Add:

```js
import { Environment } from '@react-three/drei';
```

- [ ] **Step 2: Add `<Environment>` inside `<Suspense>` in `SceneInner.jsx`**

Inside the `<Suspense fallback={null}>` block, add `<Environment>` as the **first child** (before `<CameraRig />`):

```jsx
<Suspense fallback={null}>
  <Environment
    preset="city"
    background={false}
    intensity={0.4}
  />
  <CameraRig />
  <NodeGraph />
  <ParticleField />
  <EffectComposer>
    {/* existing passes unchanged */}
  </EffectComposer>
</Suspense>
```

Full updated file for reference:

```jsx
'use client';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Vector2 } from 'three';
import { Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { CameraRig }    from './CameraRig.jsx';
import { NodeGraph }    from './NodeGraph.jsx';
import { ParticleField } from './ParticleField.jsx';

export function SceneInner({ showContact }) {
  return (
    <Canvas
      style={{ position: 'fixed', inset: 0, zIndex: 0 }}
      camera={{ position: [0, 6, 12], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
    >
      {/* Key Light — warm gold, upper right front */}
      <directionalLight color="#F5C518" intensity={2.5} position={[5, 8, 6]} castShadow={false} />
      {/* Fill Light — cool blue, lower left */}
      <directionalLight color="#1a2840" intensity={0.8} position={[-4, -2, 8]} />
      {/* Rim Light — white, from behind */}
      <directionalLight color="#ffffff" intensity={1.8} position={[-2, 3, -8]} />

      <Suspense fallback={null}>
        <Environment preset="city" background={false} intensity={0.4} />
        <CameraRig />
        <NodeGraph />
        <ParticleField />
        <EffectComposer>
          <Bloom luminanceThreshold={0.6} luminanceSmoothing={0.025} intensity={0.4} mipmapBlur={true} />
          <Vignette offset={0.15} darkness={0.6} eskil={false} />
          <ChromaticAberration offset={new Vector2(0.0008, 0.0005)} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
```

- [ ] **Step 3: Run unit tests**

```bash
npm test
```

Expected: all tests pass (no SceneInner unit tests — confirm no regressions elsewhere).

- [ ] **Step 4: Visual verification — glass reflections on NodeGraph nodes**

With dev server running (`http://localhost:3002`), observe the NodeGraph nodes:

- Nodes should show **subtle environment reflections** — urban light colors visible in the glass surface
- Background remains **dark** (no HDRI skybox visible — `background={false}`)
- Gold emissive still dominant, HDRI reflection is a subtle accent
- Scroll to illuminated state (scroll ~70%+): nodes should appear richer, more optically present

- [ ] **Step 5: Commit**

```bash
git add components/scene/SceneInner.jsx
git commit -m "feat(scene): add HDRI environment map for glass reflections (city preset, intensity 0.4)"
```

---

## Self-Review

**Spec coverage check:**
- Task 2.1 (FOV animation): ✓ — keyframes.js gets fov; CameraRig.jsx tweens fov with updateProjectionMatrix
- Task 2.2 (Per-section easing): ✓ — keyframes.js gets ease + duration; tweenTo() reads both
- Task 5.2 (Environment map): ✓ — SceneInner.jsx gets `<Environment preset="city" background={false} intensity={0.4} />`
- Task 5.3 (MeshPhysicalMaterial): **already complete** in NodeGraph.jsx — confirmed before planning

**Placeholder scan:** None found. All steps have complete code.

**Type consistency:**
- `KEYFRAMES[i].fov` — number (defined Task 1, consumed Task 2) ✓
- `KEYFRAMES[i].ease` — string (defined Task 1, consumed Task 2) ✓
- `KEYFRAMES[i].duration` — number (defined Task 1, consumed Task 2) ✓
- `tweenTo(i)` signature unchanged ✓

**Dependency order:**
- Task 1 must complete before Task 2 (CameraRig reads keyframe fields)
- Task 3 is independent — can run in parallel with Task 1+2 if desired

---

*Plan covers master-refactor-plan.md Tasks 2.1, 2.2, and 5.2. Task 5.3 confirmed already complete in NodeGraph.jsx.*
