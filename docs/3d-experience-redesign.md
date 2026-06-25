# 3D Experience Redesign
**Date:** 2026-06-13  
**Current stack:** R3F + GSAP ScrollTrigger + custom GLSL  
**Reference:** https://oryzo.ai (Lusion)

---

## Part 1 — Forensic Analysis: Why It Feels Static

### 1.1 The Subject Never Changes State

This is the single most important finding. In the current implementation:

```
BuildingWireframe.jsx — BoxGeometry(2,3,2) with lineBasicMaterial
  useFrame: sine-wave scale on 8 corner nodes (±15% breathing)
  The box itself: completely static
```

The only "animation" in the subject is eight 6-polygon spheres pulsing in scale. The wireframe box renders identically from frame 0 to frame 100,000. There is nothing to discover, nothing to anticipate, nothing that changes meaning.

**Oryzo contrast:** The coaster rotates ~240° across the scroll journey. It lifts off the surface. It separates into sub-components. Every scroll beat reveals a new physical property of the same object. The user's attention is rewarded every 200–300px of scroll.

---

### 1.2 Object Rotation Is Entirely Absent (Which Is Also The Problem)

Counterintuitively, the problem is not overused rotation — it's that the **camera rotates as a substitute for object rotation**, which is cinematographically backwards.

Evidence from `CameraRig.jsx` keyframes:

```
KF0: pos[0,  6, 12]  → front overhead     (establishing)
KF1: pos[2,  3,  9]  → right drift         (arbitrary)
KF2: pos[5,  3,  9]  → further right       (arbitrary)
KF3: pos[0,  7, 13]  → back to center high (arbitrary)
KF4: pos[-3, 2,  9]  → left               (arbitrary)
KF5: pos[3,  0,  8]  → low right          (arbitrary)
KF6: pos[7,  2,  7]  → far right          (arbitrary)
KF7: pos[1,  1,  7]  → close front        (arbitrary)
```

The camera drifts through 8 positions over the scroll journey. None of these positions were chosen for visual intent — they are spatial explorations of a box that looks identical from every angle because `lineBasicMaterial` has no lighting response and no surface variation.

**Why camera-as-rotation fails:** When you rotate the camera around a static object, the object's *position on screen* changes but the object's *visual state* does not. There is no new information revealed. The user sees "the box from the left" instead of "the box from the right" but the box is identical — so the move communicates nothing.

When you rotate *the object* instead (or drive scroll-linked state changes), every increment of scroll reveals a new face, a new detail, a new relationship. The object earns its screen time.

---

### 1.3 Camera Is Underused: The Distance Problem

At `fov: 60` and camera z=12, a 3-unit-tall `BoxGeometry` occupies approximately **22% of viewport height**.

```
Screen height fraction ≈ (object height) / (2 × camera_z × tan(fov/2))
                       = 3 / (2 × 12 × tan(30°))
                       ≈ 3 / 13.86
                       ≈ 0.22 → 22%
```

Oryzo's coaster occupies **55–70% of viewport height** in its hero state. The size differential alone explains the premium feeling. A subject that fills 22% of screen reads as a decorative element. A subject that fills 60% reads as the protagonist.

The camera also never exploits FOV. `fov: 60` is the default. Oryzo likely uses a tighter FOV (40–50°) for telephoto compression in close-up shots and a wider FOV (70–80°) for establishing shots. This range creates the sense that the camera has *focal length*, not just position.

---

### 1.4 Depth Is Structurally Missing

The current depth architecture:

```
Background:  black void (#0a0a0a)
Midground:   particles z ∈ [-3, +3]     (6 unit spread)
Foreground:  box at z=0, camera at z=12
```

Problems:

**No layering.** In the camera frustum (z=7 to z=13), the parallax between the closest particle (z=+3, camera distance 4) and the farthest particle (z=-3, camera distance 10) is a ratio of 2.5×. This is barely perceptible. Oryzo creates depth by placing objects at radically different distances: the cutting mat extends into deep background, the coaster is at midground, the close-up details push into near-foreground. That's a 10–20× depth range, not 2.5×.

**No environmental context.** The box floats in void. There is no ground, no horizon, no surface to establish spatial reference. Scale is impossible to read without a reference object. Oryzo's cutting mat and scattered tools are not decoration — they are the depth cues and scale references that make the coaster feel real.

**No atmospheric falloff.** `THREE.Fog` is absent. Distance in real space attenuates contrast and saturation. Without fog, objects at z=-10 and z=+10 read at the same visual weight. This removes the perceptual sense of "near vs. far."

**The particle shader z-attenuation:**
```glsl
gl_PointSize = aSize * (300.0 / -mvPosition.z);
```
This is correct perspective-correct sizing. But with z-spread of ±3, the size range at camera z=12 is:
- Nearest particle: `300 / (12-3)` = 33px
- Farthest particle: `300 / (12+3)` = 20px

A 13px range. Not enough to read as atmospheric depth.

---

### 1.5 Composition Is Weak: The Centering Problem

Every element in the scene is centered on the world origin [0,0,0]:

```
Box geometry:    center at [0, 0, 0]
Data panels:     symmetrically at [±2.5, y, 0]
Particles:       centered on [0, 0, 0]
Camera lookAt:   [0, 0, 0] or [0, 1, 0]
HTML content:    left-aligned at 7vw padding
```

The 3D world is center-aligned. The HTML world is left-aligned. These two alignment systems create a visual tension where neither anchors the other. The user's eye has no single focal point — it oscillates between the centered 3D and the left-aligned text.

**The result visible in screenshots:** The four `<Html>` DataPanels project into screen space and overlap the hero headline. Both the 3D panels ("8 ERP Modules", "Q/C") and the headline text ("Turning Complex Syste / ms / Into Measurable Impact") fight for the same screen territory without either "winning" the composition.

**Rule of thirds violation:** In Oryzo, the coaster occupies the right 60% of the viewport. The copy occupies the left 30-40%. These two zones don't overlap. The negative space between them is intentional — it is where the eye travels when reading.

---

### 1.6 No Scroll-Object Relationship

The current scroll model:

```
user scrolls → ScrollTrigger fires → GSAP tweens camera position
              ↑
              This is the only connection between scroll and 3D
```

The 3D scene has no awareness of *which section* the user is reading. The box does not change when Experience becomes visible. The particles don't respond when Skills is reached. Only the camera drifts.

**Oryzo's scroll model:**

```
user scrolls → scrub progress (0→1) → drives object rotation + position + material state
              ↑
              Scroll IS the timeline. Object state IS the narrative.
```

In Oryzo, scroll progress is a single normalized value (0–1) that drives multiple animation properties simultaneously: object rotation angle, camera distance, object Y-position (lift off surface), and text opacity. The 3D scene IS the scroll story.

---

## Part 2 — The Redesign

### Concept: The System That Assembles

The portfolio owner's story: civil engineer → business analyst → ERP specialist. The visual metaphor: **a system that begins in chaos and assembles into order**.

The central 3D subject: **A Node-Graph Structure** — 24 floating geometric nodes connected by glowing edges, initially scattered in chaotic cloud formation, that gradually assemble into a clean hierarchical grid as the user scrolls through the portfolio. By the Contact section, the graph is fully assembled and pulse-lit.

This metaphor is:
- Specific to the person (process mapping, system design, ERP module architecture)
- Visually dynamic (scroll-driven state change from chaos → order)
- Technically achievable with existing stack (no external models, just geometry + custom shaders)
- Not a generic "dark portfolio background"

---

### 2.1 Scene Architecture — Three Depth Layers

Replace the current single-depth scene with three explicit layers:

```
Layer A: FAR FIELD     z = -20 to -8    — atmospheric particles (200 count, low opacity)
Layer B: MID FIELD     z = -4 to +2     — the Node Graph (subject)
Layer C: NEAR FIELD    z = +4 to +8     — 3-4 large drifting particles (foreground haze)
```

This creates a 28-unit depth range (vs. current 6-unit range). The perspective difference between Layer A and Layer C at camera z=10 produces a 7× size ratio — visually legible depth.

**Remove:**
- `DataPanels.jsx` — all `<Html>` elements. Stats move into HTML sections.
- `ContactAccent.jsx` — duplicate of ParticleField at 30 nodes. Redundant.
- `gridHelper` — adds false spatial reference that conflicts with the void aesthetic.

---

### 2.2 The Node Graph — Scroll-Driven State Machine

The central subject replaces `BuildingWireframe`. It has **three discrete states** that scroll drives as a lerp:

#### State 0 — Chaos (scroll: 0 → 0.15, Hero section)
24 nodes scattered in a ±6 unit sphere. Edges invisible. Color: dim amber `#5a4010`. Camera: wide establishing.

```
nodes: 24 × IcosahedronGeometry(r=0.18) with MeshPhysicalMaterial
       transmission: 0.9, roughness: 0.05, thickness: 0.4
       color: #2a1a05, emissive: #D4A017, emissiveIntensity: 0.3

chaos positions: random on sphere of radius 6
       stored as chaosPos[i] = THREE.Vector3 on sphere surface

scroll lerp: nodePos[i].lerp(chaosPos[i], 1 - progress)
```

#### State 1 — Assembly (scroll: 0.15 → 0.65, About → Skills)
Nodes migrate from scatter to a 4×3×2 hierarchical grid. Edges appear as they connect — `LineSegments` with opacity animated from 0 to 0.6 per connection as the distance between node pairs drops below threshold. Color: warm gold `#D4A017`.

```
grid positions: 4 columns × 3 rows × 2 depths
       gridPos[i] — 24 pre-calculated positions in structured layout

edge reveal: for each pair (i,j) where |gridPos[i] - gridPos[j]| < 2.5
       edgeOpacity[pair] lerps 0→0.6 as assembly progress crosses threshold
       ~32 edges total

emissiveIntensity: lerp 0.3 → 1.2 across scroll 0.15→0.65
```

#### State 2 — Illuminated (scroll: 0.65 → 1.0, Work → Contact)
Graph fully assembled. Edges pulse with data-flow light travelling along each connection — a `uPulse` uniform drives a moving glow along edge geometry. Node emissive goes gold-white. Camera closes in.

```
edge pulse shader:
  uTime drives a moving bright point along each edge (parametric t from 0→1)
  pulse = smoothstep(t - 0.1, t, uPulse) - smoothstep(t, t + 0.1, uPulse)
  multiple pulses offset by edge index for asynchronous flow

node emissiveIntensity: lerp 1.2 → 2.5
node color: lerp #D4A017 → #F5E87A (warmer, brighter at contact)
```

---

### 2.3 Camera Redesign — From Drift to Cinematography

**Remove all 8 arbitrary keyframes. Replace with 4 intentional shots.**

Each camera position is chosen for a specific visual purpose, not just a spatial location.

#### Shot 1 — The Establishing Wide (Hero)
```
position: [0, 3, 14]   fov: 72 (wide angle — spatial, expansive)
lookAt:   [0, 0, 0]
intent:   Show the full chaos field. Universe shot. Scale.
          The 24 scattered nodes fill ~60% of viewport.
          HTML content sits left. 3D chaos fills right.
```

Wide FOV (72°) creates a sense of space. The subject appears large even at z=14 because FOV compensates for distance. This is the cinematic "establishing shot" — you see the whole world before you enter it.

#### Shot 2 — The Close Inspection (About → Experience)
```
position: [2.5, 1.5, 7]   fov: 50 (telephoto — compression, intimacy)
lookAt:   [0, 0.5, 0]
intent:   As nodes begin assembling, camera pushes in.
          Telephoto compression makes the assembling nodes feel dense and interconnected.
          Camera offset right creates left-side negative space for HTML text.
duration: 1.2s ease: power3.inOut
```

The push from z=14 to z=7 while FOV drops 72→50 creates a "dolly zoom" sensation — the subject grows in the frame while the background compresses. This is a perceptually expensive shot that reads as cinematic even as a two-keyframe tween.

#### Shot 3 — The Reveal Angle (Skills → Work)
```
position: [-3, 4, 9]   fov: 55
lookAt:   [0.5, 0, 0]
intent:   Three-quarter high angle. The assembled grid becomes readable as structure.
          Camera slightly above and left — looking down at the system.
          This angle reads as "overview" / "control" — appropriate for Skills/Work.
duration: 1.4s ease: power2.inOut
```

The lookAt is offset from origin (`[0.5, 0, 0]`) — the subject is not dead-center, giving a compositional asymmetry that reads as directed rather than default.

#### Shot 4 — The Intimate Final (Education → Contact)
```
position: [0, 0, 5]   fov: 45 (tightest — maximum compression)
lookAt:   [0, 0.3, 0]
intent:   Camera at near-eye-level, very close. The fully-illuminated, pulsing graph
          fills the frame. Feeling: you are inside the system.
          The data-flow pulse edges are only visible at this proximity.
duration: 1.6s ease: power4.inOut
```

The tightest FOV (45°) creates the most telephoto compression. At z=5 with fov=45, the node cluster (~4 units diameter) fills ~80% of viewport height. This is the Oryzo close-up equivalent — the subject is overwhelming.

---

### 2.4 Lighting — Three-Point Cinematic Setup

Replace the current (1 ambient + 1 point) with a three-point rig plus environment:

#### Key Light — Warm Gold (The Story Light)
```
type:      DirectionalLight
color:     #F5C518  (warm gold — slightly warmer than current gold)
intensity: 2.5
position:  [5, 8, 6]   (upper right front — traditional 3/4 key position)
castShadow: true (only on ground plane)
intent:    Illuminates node faces, creates strong highlights on glass material.
           This is the "hero" light that makes the nodes read as precious objects.
```

#### Fill Light — Cool Blue (The Space Light)
```
type:      DirectionalLight
color:     #1a2840  (deep cool blue)
intensity: 0.8
position:  [-4, -2, 8]  (lower left — opposite key)
intent:    Fills shadow side with cool color. Creates the warm/cool contrast that reads
           as cinematic (same principle as golden hour photography).
           Prevents node undersides from going pure black.
```

#### Rim Light — White Highlight (The Premium Edge)
```
type:      DirectionalLight
color:     #ffffff
intensity: 1.8
position:  [-2, 3, -8]  (behind the subject — backlight position)
intent:    Creates the bright edge/halo on nodes that separates subject from background.
           This is the single most impactful lighting change possible.
           The rim light is why Oryzo's coaster has that floating-in-space quality.
```

#### Environment Map — Subtle HDRI
```
component: <Environment preset="city" background={false} intensity={0.4} />
           (from @react-three/drei)
intent:    Provides reflective IBL on MeshPhysicalMaterial nodes.
           Nodes reflect the faint HDRI environment in their glass surfaces.
           This is free physical plausibility — one line of JSX.
```

**Before/after comparison:**

| Lighting state | Key light | Fill | Rim | Result |
|---|---|---|---|---|
| Current | 1× point [0,5,5] gold | ambient 0.3 | none | Flat, dim, undirected |
| Redesign | Directional [5,8,6] gold | Cool fill | White backlight | Cinematic, physical, premium |

---

### 2.5 Material Upgrade — One Great Surface

The breakthrough material decision: **glass transmission** on the primary nodes.

```js
// Current (lineBasicMaterial on box — no lighting response)
<lineBasicMaterial color="#F5C842" transparent opacity={0.7} />

// Redesign (MeshPhysicalMaterial — responds to all lights + HDRI)
<meshPhysicalMaterial
  color="#1a0f00"
  emissive="#D4A017"
  emissiveIntensity={scrollLerp(0.3, 2.0)}
  transmission={0.85}        // glass refraction
  roughness={0.08}           // near-mirror surface
  metalness={0.0}            // glass, not metal
  thickness={0.4}            // affects internal refraction
  ior={1.5}                  // glass refractive index
  envMapIntensity={1.2}      // picks up the HDRI reflections
/>
```

Why glass specifically: Glass nodes interact with all three point lights simultaneously (refraction, reflection, transmission), creating complex optical behavior that reads as expensive. The emissive underneath the transmission creates a "glowing from within" quality — the gold light trapped inside the glass, escaping at the edges.

**Edge material** (the connections between nodes):
```js
<lineBasicMaterial color="#D4A017" transparent opacity={edgeOpacity} linewidth={1} />
// Animated via scroll-driven opacity lerp
```

For the data-flow pulse effect (State 2), edges need a custom shader:
```glsl
// fragment — edge pulse shader
uniform float uTime;
uniform float uPulseOffset;  // per-edge offset 0–1
float t = fract(uTime * 0.4 + uPulseOffset);
float pulse = exp(-50.0 * pow(vUv.x - t, 2.0));  // Gaussian moving along edge
vec3 col = mix(vec3(0.83, 0.63, 0.09), vec3(1.0, 0.95, 0.6), pulse);
gl_FragColor = vec4(col, (0.3 + pulse * 0.7) * vOpacity);
```

---

### 2.6 Post-Processing Pipeline

The highest-impact technical upgrade. Current post-processing: none. Redesign adds three passes:

```
@react-three/postprocessing order:
1. Bloom         — emissive glow bleeding around gold nodes
2. Vignette      — darkens corners, focuses attention on center
3. ChromaticAberration (subtle) — slight color fringing on highlights, film quality
```

**Bloom settings:**
```
luminanceThreshold: 0.6    (only affects the brightest gold)
luminanceSmoothing: 0.025
intensity: 0.4             (subtle — should not bloom text, only nodes)
mipmapBlur: true           (reduces banding artifacts)
```

**Vignette:**
```
offset: 0.15
darkness: 0.6
```

**Chromatic aberration:**
```
offset: [0.0008, 0.0005]  (barely visible — subconscious quality cue)
```

These three passes together consume ~2ms GPU on modern hardware and transform the perceived render quality by 3–4× because they approximate the optical behavior of real lenses.

---

### 2.7 Atmospheric Depth — Fog + Layer Separation

**Three-layer particle strategy:**

```
Layer A (far field): 200 particles, z: [-25, -8]
  size: 0.5–2px
  opacity: 0.08–0.15
  color: #1a1005 (very dark amber — almost invisible)
  purpose: creates sense of infinite space behind subject

Layer B (subject): node graph at z: [-2, +2]
  (described in 2.2)

Layer C (near field): 6 large particles, z: [+4, +7]
  size: 4–8px
  opacity: 0.25–0.35
  color: #D4A017 with additive blend
  purpose: foreground haze that blurs slightly behind bloom pass
           creates "bokeh" feel — camera has optical depth
```

**Fog:**
```jsx
<fog attach="fog" color="#0a0a0a" near={15} far={35} />
```
Far-field particles at z=-25 will be almost fully fogged. This creates the atmospheric perspective that makes 3D space feel infinite rather than a box.

**Canvas DPR:**
```jsx
<Canvas dpr={[1, 1.5]} frameloop="demand">
```
`frameloop="demand"` stops the render loop when nothing is animating. Only `invalidate()` on scroll and mouse events triggers redraws. This halves GPU usage on static sections.

---

### 2.8 Scroll Architecture Redesign

**Replace event-driven keyframes with a single scroll progress driver.**

Current model (multiple independent ScrollTrigger instances, each tweening camera):
```
section.hero    → tweenTo(0)
section.about   → tweenTo(1)
section.experience → tweenTo(2)
... etc
```

**Redesign model (single normalized scrub value 0→1):**
```
one ScrollTrigger pinned to the full document height
  scrub: true                  (ties directly to scroll position, no lag)
  start: "top top"
  end: "bottom bottom"

drives:
  progress: 0 → 1             (passed as uniform uProgress to graph shader)
  
camera follows progress via GSAP timeline:
  t.to(camera.position, { x:2.5, y:1.5, z:7,  ease:"none" }, 0.15)
  t.to(camera.position, { x:-3,  y:4,   z:9,  ease:"none" }, 0.40)
  t.to(camera.position, { x:0,   y:0,   z:5,  ease:"none" }, 0.65)

FOV also on timeline:
  t.to(camera, { fov: 50, onUpdate: ()=>camera.updateProjectionMatrix() }, 0.15)
  t.to(camera, { fov: 55, onUpdate: ()=>camera.updateProjectionMatrix() }, 0.40)
  t.to(camera, { fov: 45, onUpdate: ()=>camera.updateProjectionMatrix() }, 0.65)
```

The critical difference: `scrub: true` means scroll position directly drives animation progress. There is zero async delay — the scene responds at the exact scroll rate the user applies. This is what creates the "physical weight" feeling. The current `duration: 1.8s` tween means the scene is always catching up to where the user is.

---

### 2.9 Layout Composition — Removing the Conflict

The current viewport split:

```
Current:
┌────────────────────────────────────────────┐
│  [HTML TEXT: left-aligned]  [3D: CENTER]   │
│  Turning Complex Syste    [8 ERP Modules]  │
│  ms                       [Q/C]            │  ← OVERLAP
│  Into Measurable Impact   [10+ Delivered]  │
└────────────────────────────────────────────┘
```

**Redesign viewport split:**

```
Redesign:
┌────────────────────────────────────────────┐
│  [HTML: left 45%]          [3D: right 55%] │
│  Turning Complex Systems   [    NODE    ]   │
│  Into Measurable Impact    [    GRAPH   ]   │  ← NO OVERLAP
│  "Goody"                   [    3D      ]   │
└────────────────────────────────────────────┘
```

Achieved by:
1. Camera positioned slightly left of center: `position: [2, 1, 10]` — 3D subject appears right-of-center in screen space.
2. HTML content max-width: 45% of viewport.
3. No `<Html>` elements inside the Canvas — zero DOM-in-3D.

The 3D subject occupies its own visual zone. HTML text occupies its own zone. Negative space between them (≈10%) allows the eye to rest.

---

### 2.10 The One Wow Moment — Assembly Reveal

At scroll progress ~0.35 (the transition from About to Experience), trigger a simultaneous event:

1. **Camera pulls from z=14 to z=7** (dramatic zoom — takes ~0.08 scroll units / fast)
2. **All 24 nodes snap toward grid positions** (lerp rate increases sharply — like a magnetic snap)
3. **All 32 edges appear in a rapid stagger** (0 → 0.6 opacity in 0.05 scroll units, index-staggered)
4. **Bloom intensity jumps** from 0.2 to 0.7 for 0.02 scroll units then settles to 0.4
5. **Gold pulse begins** on the newly assembled edges

This creates a single irreversible "aha" moment: the chaotic particles become a system. It takes 300–400ms of scroll time to experience. It represents the moment engineering chaos becomes structured intelligence — which is exactly the portfolio's thesis.

---

## Part 3 — What to Remove Completely

| Component | Reason | Replacement |
|-----------|--------|-------------|
| `BuildingWireframe.jsx` | Generic box, unlit, no narrative | Node graph (new component) |
| `DataPanels.jsx` | DOM-in-3D, causes overlap | Stats in HTML hero section |
| `ContactAccent.jsx` | Duplicate of ParticleField | Far-field atmospheric layer |
| `gridHelper` | False reference, looks like template | Fog handles spatial grounding |
| `useMagneticTilt` on HTML cards | Cheap effect, low value | (keep — it's fine for cards) |

---

## Part 4 — Implementation Order (Highest Impact First)

The redesign is sequenced so each step delivers visible improvement independently:

**Step 1 — Lighting (2 hours, severity 9 impact)**  
Add fill + rim directional lights and `<Environment>` to existing SceneInner. The wireframe won't benefit much, but the existing node spheres will immediately look 3× better. Demonstrates the principle before replacing geometry.

**Step 2 — Post-processing (2 hours, severity 8 impact)**  
Add `EffectComposer` with Bloom + Vignette. The existing particles and nodes will glow correctly. The scene transforms from "flat graphics" to "rendered."

**Step 3 — Remove `<Html>` DataPanels, add stats to HTML (3 hours, severity 8 impact)**  
Eliminates overlap immediately. Move "8 ERP Modules", "10+ Projects", etc. into the HeroSection JSX as a stats row below the bio. The 3D scene becomes unobstructed.

**Step 4 — Replace wireframe box with Node Graph (1 day, severity 9 impact)**  
New `NodeGraph.jsx` component with `MeshPhysicalMaterial` nodes and `LineSegments` edges. Chaos positions → grid positions as scroll advances. This is the subject change that makes everything else matter.

**Step 5 — Scroll architecture redesign (1 day, severity 8 impact)**  
Refactor `CameraRig.jsx` to use a single `scrub: true` ScrollTrigger timeline instead of 8 independent triggers. Add the 4 camera shots with FOV animation.

**Step 6 — Three depth layers in ParticleField (3 hours, severity 6 impact)**  
Extend `ParticleField.jsx` to emit into three z-ranges. Add `<fog>`. Add 6 large near-field particles.

**Step 7 — Assembly reveal moment (3 hours, severity 9 impact)**  
The "wow" beat at progress=0.35. Requires Steps 4+5 to be in place. This is the moment that makes the experience shareable.

---

## Part 5 — Reference Comparison

### Why Oryzo Feels Premium (Annotated)

**Layout:** The coaster occupies 55-70% of viewport at all times. Scale creates presence.  
**Depth:** Cutting mat extends to screen edges. Tools scattered at different distances. 5+ depth planes.  
**Lighting:** Three-point: warm key from upper-right, blue fill from left, strong rim from behind. Classic product photography triangle.  
**Camera:** 3 shots across the entire journey. Each shot is intimate (FOV ~45-50). The object does the work.  
**Scroll model:** Scroll = object rotation + lift. 1:1 correspondence. No async delay.  
**Typography:** Two text blocks, max 15 words each. Everything else is empty space. The product breathes.  
**Material:** Cork texture with visible grain, physical roughness. One material. Perfect execution.

### What The Portfolio Has Right

- The GLSL particle shader with cursor vortex is technically excellent. Keep it, extend it.
- `MeshPhysicalMaterial` on node spheres already exists. It just needs the right geometry size and lighting.
- The content strategy (about, experience, skills, work) is strong. It doesn't need fewer sections — it needs the 3D scene to *respond* to those sections.
- The dark gold color system is well-executed and differentiated.
- Bilingual support is a genuine differentiator. Nothing in this redesign removes it.
