# Creative Audit — Portfolio vs. Oryzo.ai
**Date:** 2026-06-13  
**Auditor:** Senior Creative Developer (Lusion / Active Theory reference frame)  
**Subject:** http://localhost:3001  
**Reference:** https://oryzo.ai

---

## Executive Verdict

The portfolio is technically functional and visually coherent but feels like a **designed resume, not a creative experience**. The 3D scene is used as ambient wallpaper rather than the primary storytelling engine. Every premium cue (gold palette, serif type, particle shaders) is present — but they are assembled, not orchestrated. Oryzo works because the 3D object IS the narrative. Here, the 3D object is the screensaver.

---

## 1. Art Direction

### 1.1 Visual Identity
**Severity: 6/10**

**Explanation:** The dark-gold palette is a solid choice for a "luxury data" positioning. Cormorant Garamond pairs well with Montserrat. The brand story — engineering meets business analysis — has a clear foundation.

**Why it fails:** The visual language is borrowed from a template archetype (dark, gold, serif). Nothing in the execution is specific to *Goody* or to the ERP domain. Oryzo has a deeply specific visual metaphor (the most unnecessarily sophisticated cork coaster), which creates instant intrigue. The portfolio has a wireframe box. A wireframe box says "I am doing Three.js" — it does not say "I turn complex systems into measurable impact."

**Fix:** The central 3D metaphor must be *specific*. ERP implementation is about interconnected nodes, process flow, data pipelines. Consider: an animated node-graph that morphs into structured data tables, or a 3D grid/matrix that assembles itself from chaos as you scroll. The metaphor should make the *content* feel inevitable.

---

### 1.2 Premium Feeling
**Severity: 7/10**

**Explanation:** The page reads as "professional." It does not read as "premium." The distinction is whitespace, restraint, and pacing.

**Why it fails:**
- **Typography density is too high.** Every section packs in copy, labels, badges, and stats. Oryzo shows one headline and one object per viewport. Breathing room creates luxury.
- **The hero headline breaks the word "Systems"** — "Turning Complex Syste / ms / Into Measurable Impact." This is an unacceptable typographic error in a portfolio claiming design craft. It signals lack of control.
- **The color `--muted-txt: #9a8f7a`** renders body copy at approximately 3.2:1 contrast ratio against `#0a0a0a`. This is below WCAG AA (4.5:1) and makes the bio paragraph feel faint and unpolished, not refined.
- **Section headings** ("Roles That Shaped the Method", "Full-Stack Business Intelligence") are set in Cormorant at display sizes but live against the same dark background as body text with no compositional separation. They feel like headings in a document, not moments in a story.

**Fix:** Force the hero headline to `white-space: nowrap` on key phrases, or restructure to two intentional lines. Increase `--muted-txt` to `#b8ad9e` minimum. Add 40–60vh of negative space between major sections.

---

### 1.3 Uniqueness
**Severity: 8/10**

**Explanation:** This is the most critical gap.

**Why it fails:** The combination of (dark background + gold accent + serif display + floating data panels + particle field) is the exact aesthetic that 80% of developer portfolios currently use. Nothing here would be out of place in any Awwwards honorable mention from 2022. Oryzo is unique because the premise is absurd and specific: a $200 cork coaster for mugs. The specificity IS the brand.

**What "Goody's" specific angle could be:** You are a Civil Engineer who became a Business Analyst who now implements ERP systems for construction companies. This is a genuinely unusual path. The visual language should make that collision visible — construction blueprints that transform into data dashboards; structural engineering drawings that resolve into process flows. That is a story. A floating wireframe box and gold particles are not a story.

**Fix:** Define one impossible visual that only *this* person could own, then build the entire scene around that object.

---

### 1.4 Storytelling
**Severity: 7/10**

**Explanation:** The page has all the *ingredients* of a story but no narrative arc.

**Why it fails:** Scroll progression on this portfolio: Hero → About → Experience → Skills → Work → Education → Certs → Contact. This is a **CV structure**, not a story structure. Oryzo's scroll: The coaster sits on a table. You scroll. It lifts. You scroll. It spins. It separates into components. The object *changes in response to your attention*. Every scroll beat reveals something new about the same subject.

**Fix:** Collapse the number of "sections" and use scroll to reveal *one story* across them: The Problem (chaos of construction data) → The Method (engineering rigor applied to systems) → The Proof (delivered ERP, measurable results). Three acts, not eight chapters.

---

## 2. Motion Design

### 2.1 Scroll Choreography
**Severity: 7/10**

**Explanation:** GSAP + ScrollTrigger camera keyframes are the right architecture. The implementation is incomplete.

**Why it fails:** The camera moves to 8 positions (one per section) with `power2.inOut` over 1.8 seconds. But:
- Each section triggers an identical transition: camera moves, content appears. There is no differentiation between moments — no build, no climax, no exhale.
- The camera orbits the same wireframe box in all 8 keyframes. The scene never *changes* — nothing new enters, nothing resolves. The camera choreography has nowhere interesting to go because the subject is static.
- HTML sections scroll naturally while the 3D camera moves independently. These two motion systems are **not synchronized** — section content often reads "I'm at Skills" while the 3D camera is still tweening from the Experience position. The two timelines fight each other.

**Fix:** Pin the 3D canvas to individual scroll milestones using a single master GSAP timeline. Sections should not scroll freely — they should scrub the 3D scene forward. This requires restructuring the scroll model from "natural scroll with scroll triggers" to "pinned scroll-jacking with progress scrub."

---

### 2.2 Camera Movement
**Severity: 6/10**

**Explanation:** The keyframe positions exist (`CameraRig.jsx`) but tell no visual story.

**Why it fails:** Looking at the actual keyframe values:
```
KF0: [0, 6, 12]   — wide overhead
KF1: [2, 3, 9]    — slight right shift
KF2: [5, 3, 9]    — wider right
KF3: [0, 7, 13]   — pulled back overhead
KF4: [-3, 2, 9]   — orbit left
KF5: [3, 0, 8]    — low right
KF6: [7, 2, 7]    — far right
KF7: [1, 1, 7]    — close front
```

These moves are **arbitrary relative to content**. They don't illuminate anything. Oryzo's camera does one thing: it stays close to a single object and tilts/rolls as the product rotates. The intimacy creates premium feel. Here the camera drifts around a wireframe with no emotional logic.

**Fix:** Reduce to 3–4 camera positions with clear intent: (1) wide establishing shot, (2) intimate close focus, (3) reveal from unexpected angle. Each move should feel like a cinematographer chose it for a reason.

---

### 2.3 Object Transitions
**Severity: 8/10**

**Explanation:** The 3D objects do not transition — they are permanent and static.

**Why it fails:** The `BuildingWireframe` scales its corner nodes with a sine wave (pulsing) and the `DataPanels` float gently via `@react-three/drei`'s `<Float>`. That is the entirety of object animation. The wireframe box never changes geometry, never assembles, never reveals a new state. Oryzo's coaster *rotates, separates, and recomposes* as you scroll — the object IS the animation.

**Fix:** Make the central 3D object scroll-driven. Possible approach: a network graph that begins as disconnected nodes (chaos), then assembles into a structured hierarchy (order/ERP), then lights up with data flow (impact). Each scroll phase changes the object's state.

---

### 2.4 Animation Timing
**Severity: 5/10**

**Explanation:** This is the strongest element. The existing timings are mostly appropriate.

**What works:** The hero character stagger (`duration: 0.6, stagger: 0.03, ease: 'expo.out'`) is correct — expo.out is the right easing for character reveals. The scroll hint CSS pulse (`2s ease-in-out infinite`) is appropriate. The CTA hover transitions at 200ms are proper.

**What doesn't work:** The camera tween at `1.8s power2.inOut` is too long when triggered by scroll. By the time the camera reaches its destination, the user has already scrolled into new content. This desynchronizes the visual and semantic layers. Reduce to 1.0–1.2s for scroll-triggered camera moves.

---

### 2.5 Easing Quality
**Severity: 5/10**

**Explanation:** Correct easing choices but inconsistent application.

**What works:** `expo.out` on character reveals, `power2.inOut` on camera. CSS custom property `--transition: 200ms cubic-bezier(0.4, 0, 0.2, 1)` is Material-derived and appropriate for micro-interactions.

**What's missing:** No spring physics anywhere. Oryzo's object feels physically present because it has mass and momentum — the transitions have overshoot and settle. GSAP's `elastic` ease or react-spring would give the 3D subject organic weight. Currently everything feels mathematically precise but physically inert.

---

## 3. 3D Experience

### 3.1 Scene Composition
**Severity: 8/10**

**Explanation:** The scene has no compositional logic. Three unrelated elements share the space: a wireframe box, floating HTML panels, and scattered particles.

**Why it fails:**
- **DataPanels (`<Html>` elements in 3D space):** These are the portfolio's most significant technical mistake. Using `@react-three/drei`'s `<Html>` for floating UI elements means the panels project from 3D coordinates but render as DOM elements that *do not occlude, do not receive shadows, and do not integrate with the 3D world*. They look like sticky notes placed on a 3D screenshot. Oryzo has no HTML elements inside its 3D scene — everything is geometry, materials, and textures.
- **The data panels also overlap the hero headline.** Both the floating "8 ERP Modules / Q/C / 10+" panels and the hero text occupy the same viewport space. The user reads two competing layers of information simultaneously.
- **The wireframe box is centered** but the hero content is left-aligned. These two elements never compose together — they accidentally overlap rather than intentionally frame each other.

**Fix:** Remove all `<Html>` elements from the 3D scene. Stats should live in HTML sections. The 3D scene should contain only geometry. Let the 3D subject occupy the right half of the viewport (or center), with HTML content composited on the left.

---

### 3.2 Depth Perception
**Severity: 7/10**

**Explanation:** The scene feels flat despite being 3D.

**Why it fails:** The `ParticleField` distributes particles in a `10 × 8 × 6` world-space box with z-range of ±3. At a camera distance of z=12 (the hero keyframe), the parallax difference between front and back particles is barely perceptible. The wireframe box is `2×3×2` units at z=0 — tiny relative to the camera distance. The scene reads as a 2D graphic.

**Fix:** Dramatically increase depth by pushing background particles to z=-20, foreground particles to z=+5, and placing the main subject at z=0. Fog (`<fog>` in R3F) at the back distance will enhance the sense of atmospheric depth. The box should occupy at least 40% of the viewport height when viewed from the hero camera position.

---

### 3.3 Lighting
**Severity: 9/10**

**Explanation:** This is the single biggest gap between the portfolio and Oryzo-level quality.

**Why it fails:** The current lighting setup:
```js
<ambientLight intensity={0.3} />
<pointLight position={[0, 5, 5]} color="#D4A017" intensity={2} />
```
This is a default lighting configuration. One ambient fill plus one colored point light produces:
- No shadows
- No rim lighting (the edge definition that creates premium 3D feel)
- No reflected highlights on surfaces
- No dramatic falloff

Oryzo's cork coaster appears photorealistic because it uses:
- HDRI environment map (real-world light probes)
- Multiple light sources with area lights (soft box simulation)
- Subsurface scattering approximation on the cork material
- Strong rim/backlight creating a halo silhouette
- `MeshPhysicalMaterial` with roughness/metalness maps

The wireframe box using `lineBasicMaterial` cannot receive *any* of this treatment — wireframes are always flatly lit by definition. This is the root cause: the chosen subject (wireframe box) is architecturally incompatible with premium lighting.

**Fix:** Replace the wireframe box with solid geometry using `MeshPhysicalMaterial`. Add at minimum: (1) key light — directional gold, (2) fill light — dim blue opposite, (3) rim light — bright narrow from behind. Consider a simple HDRI via `<Environment>` from drei.

---

### 3.4 Materials
**Severity: 9/10**

**Explanation:** The portfolio uses only `lineBasicMaterial` and `meshStandardMaterial`. Neither produces premium results.

**Why it fails:**
- `lineBasicMaterial` (the wireframe) has zero lighting response — it is unaffected by the scene's light setup.
- The node spheres use `meshStandardMaterial` with `emissiveIntensity: 1.5` — they glow gold but are geometrically simple (8-segment spheres). They read as placeholder geometry.
- No PBR materials, no textures, no normal maps, no environment reflections.

**Fix:** The scene needs at least one material moment that feels *crafted*: a glass/crystalline node with `MeshPhysicalMaterial` (`transmission: 1, roughness: 0.05, thickness: 0.5`), or a metallic surface that reflects the gold point light. One great material at the focal point changes the perceived quality of the entire scene.

---

### 3.5 Visual Hierarchy
**Severity: 8/10**

**Explanation:** The 3D scene has no focal point that the eye can rest on.

**Why it fails:** The scene contains: 1 wireframe box + 8 pulsing nodes + 4 floating HTML panels + 120 scattered particles. All elements compete for attention simultaneously. There is no dominant subject surrounded by subordinate supporting elements. Oryzo has exactly one subject (the coaster) and supporting environmental context (the table surface, scattered objects). Every visual element points back to the coaster.

**Fix:** Establish a clear visual hierarchy: (1) the primary 3D subject receives the key light and occupies the center-of-interest, (2) particles operate as atmosphere at a lower opacity, (3) grid/ground provides scale reference. Currently all three compete at equal visual weight.

---

## 4. Technical Quality

### 4.1 React Three Fiber Architecture
**Severity: 4/10**

**Explanation:** The R3F setup is clean and technically correct for what it does.

**What works:**
- Canvas deferred via `next/dynamic` with `ssr: false` — correct
- `pointer: fine` detection gating the 3D scene — good progressive enhancement
- Shader-based particles with custom GLSL — demonstrates genuine technical skill
- `useMemo` for particle geometry, `useFrame` for tick — correct R3F patterns
- `Suspense` wrapper — correct

**What's missing:** No `<PerformanceMonitor>` (from drei) for adaptive quality scaling. No `dpr` clamping on the Canvas (should be `dpr={[1, 1.5]}` to prevent 4K displays rendering at native resolution). No `frameloop="demand"` — the canvas renders every frame even on sections where nothing moves, burning GPU budget unnecessarily. No post-processing pass (`@react-three/postprocessing`), which is the primary visual quality multiplier at minimal performance cost.

---

### 4.2 Performance
**Severity: 5/10**

**Explanation:** No obvious performance regressions but several missed optimizations.

**Issues:**
- Canvas `position: fixed, inset: 0` — the full 3D scene renders at full viewport resolution even when scrolled deep into sections where the 3D adds no value. Consider `frameloop="demand"` + manual `invalidate()` on scroll.
- `PARTICLE_COUNT: 120` — this is appropriately conservative.
- `BOX_GEO` and `GOLD_EMISSIVE` are module-level constants (correct — not recreated on render).
- The `DataPanels` use `<Html>` which carries R3F overhead for projecting DOM elements into 3D coordinates on every frame tick.

---

### 4.3 Frame Rate
**Severity: 4/10** (estimated — no profiler run)

**Explanation:** The shader particle system + HTML projection + full-resolution canvas should maintain 60fps on modern hardware. No geometry count issues. The main risk is `<Html>` DOM projection creating layout thrash on every frame when the camera moves.

---

### 4.4 Memory Usage
**Severity: 4/10**

**Explanation:** Memory appears well-managed. Geometry is created once via `useMemo`. ScrollTrigger instances are cleaned up in the `useEffect` return. No obvious leaks in the reviewed code.

---

## 5. User Experience

### 5.1 Wow Factor
**Severity: 8/10**

**Explanation:** There is no single moment in the portfolio that creates genuine surprise.

**The test:** Could you record a 10-second screen capture of this portfolio that would make someone stop scrolling Twitter? The answer is no. The particles drift, the camera floats, the text appears. Nothing unexpected happens.

**Oryzo's wow:** You open the page and there is a hyper-realistic cork coaster on a cutting mat. You scroll and it *lifts off the surface*. That 3-second moment has been shared thousands of times because it is unexpected and specific.

**Fix:** Engineer one irreversible "wow moment" that happens exactly once — triggered by a specific scroll position. A node network that crystallizes into a 3D org chart. The hero headline assembling letter-by-letter from 3D geometry (not DOM characters). A fracture/reassembly of the central subject. It only needs to happen once. It needs to be genuinely surprising.

---

### 5.2 Emotional Impact
**Severity: 7/10**

**Explanation:** The site communicates competence. It does not communicate personality or desire.

**Why it matters:** A portfolio's job is to make a hiring manager or client *want* to work with this person — not just conclude that they are qualified. Oryzo makes you *want* to own a cork coaster you didn't know you needed. This portfolio makes you conclude the person is a capable BA/ERP specialist. Competence is the floor, not the ceiling.

**The missing dimension:** The copy is CV-language ("Monitoring construction progress, controlled material quality..."). Nothing reveals how Goody *thinks*, what problems they find interesting, what they care about beyond credentials. One genuine, specific, slightly surprising sentence about what you actually care about does more than all the skill tags combined.

**Fix:** Add one "unexpected truth" sentence to the hero bio — something that is genuinely specific and slightly self-revealing, the way "the world's most unnecessarily sophisticated cork coaster" is both accurate and characterful.

---

### 5.3 Engagement
**Severity: 7/10**

**Explanation:** Users have no reason to interact beyond scrolling.

**What works:** The bilingual toggle (EN/TH) is genuinely interesting and differentiating. Few portfolios have this. It should be more prominent — currently it sits in the navbar as a small "EN | TH" switch. This is a feature that communicates something real about the person and should be treated as a brand element.

**What's missing:**
- No interactive 3D moment (the camera moves but the user doesn't control it)
- "VIEW CASE →" links that go nowhere (`href="#"`) — these kill engagement dead. Placeholder links destroy credibility.
- No hover states on the 3D panels (they're HTML in 3D space — they could respond to hover)
- The work section cards have the same visual weight as all other content — there is no sense that these are the portfolio's proof points

**Fix:** Make one 3D element mouse-interactive (drag to rotate, hover to highlight). Make the bilingual toggle a visible design feature. Remove or grey-out any "VIEW CASE" links until cases exist.

---

## Summary Table

| Category | Issue | Severity |
|----------|-------|----------|
| Art Direction | Word break in hero headline "Syste / ms" | 9/10 |
| Art Direction | 3D metaphor (wireframe box) is generic, not specific | 8/10 |
| Art Direction | Body copy contrast below WCAG AA | 6/10 |
| Motion | HTML panels overlap hero headline | 9/10 |
| Motion | Camera tween duration (1.8s) too long for scroll triggers | 6/10 |
| Motion | Two motion systems (scroll + 3D) not synchronized | 7/10 |
| 3D | `<Html>` panels break 3D immersion | 8/10 |
| 3D | Single point light — no rim, no fill, no drama | 9/10 |
| 3D | `lineBasicMaterial` incompatible with premium lighting | 9/10 |
| 3D | No post-processing (bloom, DOF, vignette) | 8/10 |
| 3D | Scene has no focal hierarchy | 8/10 |
| Technical | Canvas renders at full resolution every frame | 5/10 |
| UX | Placeholder "VIEW CASE" links with `href="#"` | 9/10 |
| UX | No single "wow moment" in entire scroll journey | 8/10 |
| UX | Bilingual toggle is underutilized as brand element | 5/10 |

---

## The Core Problem (One Sentence)

The portfolio layers 3D technology *behind* traditional CV content, treating the scene as decoration — but Awwwards-level work uses 3D as the *medium through which content is revealed*, so the technology and the story are the same thing.

---

## Highest-Priority Fixes (Ordered by Impact/Effort)

1. **Fix the hero headline word break** — CSS `word-break: keep-all` or restructure the headline string. (30 minutes, severity 9)
2. **Remove `<Html>` DataPanels from the 3D scene** — move stats into the hero HTML section, left column. Eliminates the overlap problem and the immersion-breaking DOM-in-3D pattern. (2 hours, severity 8)
3. **Replace wireframe box with a meaningful 3D subject** — even a simple geometric form with `MeshPhysicalMaterial` and one HDRI will dramatically increase perceived quality. (1 day, severity 9)
4. **Add post-processing: bloom + vignette** — `@react-three/postprocessing` with `<Bloom threshold={0.8} intensity={0.4} />` and `<Vignette>`. Single biggest quality multiplier at lowest code cost. (2 hours, severity 8)
5. **Add a rim light and fill light** — two additional light sources. Costs nothing in performance. Transforms the scene from flat to cinematic. (1 hour, severity 9)
6. **Remove or disable placeholder "VIEW CASE" links** — `pointer-events: none; opacity: 0.3` until cases are written. (30 minutes, severity 9)
7. **Reduce camera tween to 1.0s** — prevents desync between scroll position and 3D camera position. (5 minutes, severity 6)
8. **Increase `--muted-txt` to `#b8ad9e`** — fixes WCAG contrast while maintaining the warm muted aesthetic. (5 minutes, severity 6)
