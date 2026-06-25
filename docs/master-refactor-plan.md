# Master Refactor Plan — Award-Winning 3D Portfolio Experience
**Date:** 2026-06-13  
**Standard:** Oryzo.ai / Lusion / Active Theory  
**Stack:** Next.js 14 · React Three Fiber · GSAP ScrollTrigger · GLSL  
**Branch:** `feat/3d-rewrite`  
**Classification:** Creative Technology Production Roadmap

---

## Executive Summary

Nine phases. 34 discrete tasks. Each task is independently shippable and produces a visible improvement.

The central diagnosis across all prior audit documents: **the 3D scene is ambient decoration, not the storytelling medium.** Every improvement in this plan targets the gap between a site that has 3D running in the background and a site where 3D IS the experience. The fix is not technical — the technology is already correct. The fix is *directorial*: the scene must become responsive, the camera must be cinematographic, and the scroll must scrub a single coherent timeline.

The plan is ordered so that each phase delivers visible, self-contained improvement. Phases 1–3 fix the highest-severity defects. Phases 4–6 replace the core 3D subject and motion system. Phases 7–9 implement, optimize, and certify production quality.

---

## Reference Benchmark Breakdown

### oryzo.ai (Primary Reference)
- **Principle applied:** Single subject, extreme intimacy, scroll = object state  
- **Technical pattern:** Scroll progress (0→1) drives object rotation, position, and material simultaneously  
- **Visual principle:** Subject fills 55–70% viewport. Camera stays close. Object does the work.  
- **Motion principle:** `scrub: true` — scroll IS the timeline, not a trigger for it

### lusion.co
- **Principle applied:** Physics before choreography — objects have mass, not timelines  
- **Technical pattern:** Velocity-derived interaction feedback  
- **Visual principle:** Particles are the primary expressive medium, not backdrop  
- **Motion principle:** Silence as punctuation — stillness before major motion events

### activetheory.net
- **Principle applied:** Post-processing as a first-class design tool  
- **Technical pattern:** Bloom + vignette + chromatic aberration as intentional composition  
- **Visual principle:** Lighting creates mood before geometry does  
- **Motion principle:** Each section has its own motion personality — nothing is uniform

---

## Phase 1 — Website Audit & Baseline

**Goal:** Establish performance baselines and identify every visible defect before touching code.  
**Plugins:** chrome-devtools-mcp · frontend-design · core-3d-animation

---

### Task 1.1 — Performance Baseline Capture

**Objective:** Measure current FPS, memory, and render cost as a baseline for Phase 8 regression testing.

**Why current version feels amateur:** Unknown performance characteristics mean optimizations in later phases have no measurable success criteria. Sites that feel premium are always smooth. Any jank immediately breaks immersion.

**Expected visual improvement:** No direct visual improvement — this is a measurement task. Establishes the floor all subsequent phases must beat.

**Files to inspect:**
```
components/scene/SceneInner.jsx   — Canvas config (dpr, frameloop, antialias)
components/scene/ParticleField.jsx — 120-particle GLSL draw call
components/scene/DataPanels.jsx   — Html projection overhead per frame
```

**Estimated difficulty:** Low  
**Dependencies:** None  
**Plugin/MCP:** chrome-devtools-mcp

**Command sequence:**
```
1. chrome-devtools-mcp: navigate_page → http://localhost:3001
2. chrome-devtools-mcp: performance_start_trace
3. Scroll full page at normal speed (2× full scroll cycles)
4. chrome-devtools-mcp: performance_stop_trace
5. chrome-devtools-mcp: performance_analyze_insight
6. chrome-devtools-mcp: lighthouse_audit → record LCP, CLS, FID scores
```

**Validation method:** Screenshot of Performance panel showing FPS timeline. Record: min FPS, avg FPS, main thread blocking time, GPU memory.

**Success criteria:**
- Baseline documented in `docs/performance-baseline.md`
- FPS floor identified (expected: 45–60fps on desktop)
- Memory footprint recorded

**Impact score:** 3/10 (measurement only — enables all later optimization)

**Agent:** `claude-sonnet-4-6`  
*Rationale:* Automated tooling + metric capture — no creative judgment required  
If spawning an agent for this task, brief it with the full task context from this document. The agent **must** produce all required task fields §2–12: **Objective → Why Current Version Feels Amateur → Expected Visual Improvement → Files To Modify → Estimated Difficulty → Dependencies → Plugin/MCP → Command Sequence → Validation Method → Success Criteria → Impact Score.**

---

### Task 1.2 — Visual Defect Audit (DOM + Compositor)

**Objective:** Identify every visible layout, typography, and composition defect using live DOM inspection.

**Why current version feels amateur:** Five defects visible above the fold destroy the premium impression before the user reads a word:
1. Hero headline word-breaks "Systems" → "Syste / ms" due to `word-break: auto` on a `display: flex` container
2. `<Html>` DataPanels project into screen space overlapping the hero headline (two competing information layers in the same pixel zone)
3. `--muted-txt: #9a8f7a` body text fails WCAG AA contrast (3.2:1 vs. 4.5:1 requirement) — reads as faint, unpolished
4. Work section "VIEW CASE →" links use `href="#"` — destroys credibility on the section meant to prove competence
5. The navbar `EN | TH` toggle occupies 40×24px — well below 44×44px minimum touch target

**Expected visual improvement:** Fixing these five defects before any 3D work makes the page read as professionally crafted rather than "impressive tech + sloppy craft."

**Files to modify:**
```
components/sections/HeroSection.module.css     — headline word-break fix
components/scene/DataPanels.jsx                — schedule for removal (Phase 4)
styles/globals.css                             — muted-txt contrast fix
components/sections/WorkSection.jsx            — disable placeholder links
components/ui/NavBar.jsx                       — lang toggle touch target
components/ui/NavBar.module.css                — toggle sizing
```

**Estimated difficulty:** Low  
**Dependencies:** None  
**Plugin/MCP:** chrome-devtools-mcp (DOM snapshot) + frontend-design (contrast check)

**Command sequence:**
```
1. chrome-devtools-mcp: take_snapshot → analyze DOM layout of hero section
2. frontend-design skill: check contrast of #9a8f7a on #0a0a0a
3. chrome-devtools-mcp: evaluate_script → measure DataPanels projected positions vs. headline rect
4. Document all defects with pixel-level evidence
```

**Validation method:** After fixes, screenshot showing: (a) clean hero headline, (b) no DataPanel overlap, (c) passing contrast, (d) no live `href="#"` links.

**Success criteria:**
- Zero layout overlap on hero section
- All body text ≥ 4.5:1 contrast ratio
- No `href="#"` on visible interactive elements
- Lang toggle ≥ 44×44px

**Impact score:** 8/10 (removes the most visible quality signals before any 3D work)

**Agent:** `claude-sonnet-4-6`  
*Rationale:* Systematic DOM/contrast audit — well-defined checklist  
If spawning an agent for this task, brief it with the full task context from this document. The agent **must** produce all required task fields §2–12: **Objective → Why Current Version Feels Amateur → Expected Visual Improvement → Files To Modify → Estimated Difficulty → Dependencies → Plugin/MCP → Command Sequence → Validation Method → Success Criteria → Impact Score.**

---

### Task 1.3 — 3D Scene Geometry Analysis

**Objective:** Document every 3D element's current world-space position, size, and proportion relative to camera frustum.

**Why current version feels amateur:** The central 3D subject (`BoxGeometry(2,3,2)`) occupies only ~22% of viewport height at the hero camera position (`z=12, fov=60`). Oryzo's coaster occupies 55–70%. A subject that fills 22% of screen is a decorative element. A subject that fills 60% is a protagonist.

**Expected visual improvement:** No direct change — analysis reveals the scale relationships that must be redesigned in Phase 4.

**Files to inspect:**
```
components/scene/BuildingWireframe.jsx   — BoxGeometry(2,3,2), group at [0,-1.5,0]
components/scene/DataPanels.jsx          — 4× Html at [±2.5, 0.5–2.5, 0]
components/scene/ParticleField.jsx       — 120 particles, z ∈ [-3,+3]
lib/keyframes.js                         — all 8 camera positions
```

**Calculation to perform:**
```
Screen height fraction = (object_height) / (2 × camera_z × tan(fov/2))
Hero:        3 / (2 × 12 × tan(30°)) = 3/13.86 = 22%   ← too small
Target:      subject should fill 50–60% → needs height ≥ 7 units at z=10
Particle depth: z-range ±3 at camera z=12 → 2.5× parallax ratio (needs ≥10×)
```

**Plugin/MCP:** core-3d-animation (scene analysis)  
**Impact score:** 3/10 (analysis only)

**Agent:** `claude-sonnet-4-6`  
*Rationale:* Math-based geometry analysis — deterministic calculations  
If spawning an agent for this task, brief it with the full task context from this document. The agent **must** produce all required task fields §2–12: **Objective → Why Current Version Feels Amateur → Expected Visual Improvement → Files To Modify → Estimated Difficulty → Dependencies → Plugin/MCP → Command Sequence → Validation Method → Success Criteria → Impact Score.**

---

### Task 1.4 — Motion Inventory & Easing Audit

**Objective:** Catalog every animation in the codebase, its easing, duration, and the motion principle it violates.

**Why current version feels amateur:** The motion system has exactly one pattern — `expo.out` at `0.6–0.7s` — applied uniformly to seven sections with zero personality differentiation. When everything moves the same, nothing feels intentional. `useCinematicReveal` (the same hook for About, Skills, Work, Education, Certs, Contact) is the single biggest contributor to the generic feeling.

**Current motion inventory (from code analysis):**
| Component | Easing | Duration | Violation |
|-----------|--------|----------|-----------|
| Hero chars | `expo.out` | 0.6s | Mass-blind — "the" same as "Systems" |
| Section reveals | `expo.out` | 0.7s | Identical across all 7 sections |
| Camera rig | `power2.inOut` | 1.8s | Identical across all 8 transitions |
| Nav reveal | `cubic-bezier(0.16,1,0.3,1)` | 0.5s | Best on site — no violation |
| Card tilt enter | instant | — | No ease-in; enters faster than exits |
| Card tilt leave | `elastic.out(1,0.5)` | 0.6s | Best physics on site — keep |
| Node pulse | `sin(t*1.5)` | 4.2s period | Symmetrical sine — mechanical, not organic |
| Data panels float | `Float speed=1.5` | — | Too fast — anxious, not weightless |

**Plugin/MCP:** core-3d-animation + animation-components  
**Impact score:** 4/10 (analysis only)

**Agent:** `claude-haiku-4-5`  
*Rationale:* Code cataloguing — read-only inventory of existing animations  
If spawning an agent for this task, brief it with the full task context from this document. The agent **must** produce all required task fields §2–12: **Objective → Why Current Version Feels Amateur → Expected Visual Improvement → Files To Modify → Estimated Difficulty → Dependencies → Plugin/MCP → Command Sequence → Validation Method → Success Criteria → Impact Score.**

---

### Task 1.5 — UX Engagement Audit

**Objective:** Identify every broken or missing engagement loop.

**Why current version feels amateur:** A portfolio's job is to create desire to collaborate, not just demonstrate competence. The current site has zero interactive 3D moments — the camera moves but the user doesn't control it. Oryzo feels alive because the product responds to your attention.

**Findings (from code + visual inspection):**
| Item | Status | Impact |
|------|--------|--------|
| `href="#"` on all Work cards | BROKEN | Trust destruction |
| No 3D interaction | MISSING | No reward for cursor presence |
| Bilingual toggle too small | WEAK | The site's most unique differentiator is 40px wide |
| CTA hover has glow | ✓ | Good |
| Cursor vortex on particles | ✓ | Best interactive element |
| No scroll progress indicator | MISSING | User has no sense of position in narrative |
| DataPanels overlap headline | BROKEN | Two competing focal points |

**Plugin/MCP:** chrome-devtools-mcp  
**Impact score:** 6/10 (defines the engagement improvements for Phase 6)

**Agent:** `claude-sonnet-4-6`  
*Rationale:* UX gap analysis — structured review against known criteria  
If spawning an agent for this task, brief it with the full task context from this document. The agent **must** produce all required task fields §2–12: **Objective → Why Current Version Feels Amateur → Expected Visual Improvement → Files To Modify → Estimated Difficulty → Dependencies → Plugin/MCP → Command Sequence → Validation Method → Success Criteria → Impact Score.**

---

## Phase 2 — Camera Choreography Redesign

**Goal:** Replace 8 arbitrary camera positions with 8 cinematographic shots, add FOV animation, and add per-section parallax.  
**Plugins:** core-3d-animation · extended-3d-scroll  
**Reference document:** `docs/camera-storyboard.md`

---

### Task 2.1 — FOV Animation System

**Objective:** Add `fov` as a first-class animated property to every keyframe transition.

**Why current version feels amateur:** `fov: 60` is fixed for the entire scroll journey. Real cinematographers change focal length — wide lenses create expansive establishing shots, telephoto creates compression and intimacy. The current camera has one lens for its entire 8-shot story. Oryzo uses FOV changes to signal "we're going in close now" vs. "look at the big picture."

**Expected visual improvement:**
- Skills (KF3) at `fov: 72°` — the full scene appears expansive, scannable like a dashboard
- Certs (KF6) at `fov: 44°` — the credential panel fills the frame with telephoto precision
- Contact (KF7) at `fov: 64°` — the composition opens after the tightest moment, communicating release

**The full FOV arc:**
```
KF0: 65° → KF1: 58° → KF2: 55° → KF3: 72° → KF4: 52° → KF5: 60° → KF6: 44° → KF7: 64°
```
The arc: WIDE (entering) → NARROW (meeting/professional) → WIDEST (overview) → NARROWING → TIGHTEST → OPENS (invitation)

**Files to modify:**
```
lib/keyframes.js           — add fov property to each KEYFRAME object
components/scene/CameraRig.jsx  — add GSAP tween for camera.fov + updateProjectionMatrix
```

**Estimated difficulty:** Low  
**Dependencies:** None  
**Plugin/MCP:** core-3d-animation

**Command sequence:**
```
1. Add fov field to each object in KEYFRAMES array
2. In CameraRig.jsx tweenTo(i): add gsap.to(camera, { fov: KEYFRAMES[i].fov, 
   onUpdate: () => camera.updateProjectionMatrix(), duration, ease })
3. Test by scrolling through all 8 sections
```

**Validation method:** Screenshot at KF3 (Skills) showing noticeably wider scene, screenshot at KF6 (Certs) showing telephoto compression.

**Success criteria:**
- FOV visibly different at Skills vs. Certs sections
- No projection matrix glitches (projection matrix updated every tween tick)
- No stutter — tween is smooth at 60fps

**Impact score:** 8/10

**Agent:** `claude-sonnet-4-6`  
*Rationale:* Well-defined config change — add fov field + one GSAP tween  
If spawning an agent for this task, brief it with the full task context from this document. The agent **must** produce all required task fields §2–12: **Objective → Why Current Version Feels Amateur → Expected Visual Improvement → Files To Modify → Estimated Difficulty → Dependencies → Plugin/MCP → Command Sequence → Validation Method → Success Criteria → Impact Score.**

---

### Task 2.2 — Per-Section Camera Easing Differentiation

**Objective:** Replace uniform `power2.inOut, 1.8s` with section-specific easing and duration from the storyboard.

**Why current version feels amateur:** Eight identical camera transitions mean the camera has no emotional vocabulary. The "stepping back to see the whole board" (Skills) and the "turning to face someone" (About) feel the same weight. Oryzo's camera feels like it has *intent* because its movements have character.

**The easing specification (from `docs/camera-storyboard.md`):**
| Section | Duration | Easing | Character |
|---------|----------|--------|-----------|
| Hero load | 2.4s | `expo.out` | Crane descent — dramatic arrival |
| About (KF1) | 1.8s | `power3.inOut` | Smooth, considered — meeting a person |
| Experience (KF2) | 2.2s | `sine.inOut` | Equal ease, flowing — arc sweep |
| Skills (KF3) | 1.6s | `power4.out` | Fast snap — board updated |
| Work (KF4) | 2.0s | `power2.inOut` | Balanced, professional |
| Education (KF5) | 2.0s | `power1.inOut` | Earthen, slow — deliberate |
| Certs (KF6) | 1.4s | `power3.out` | Snaps to attention |
| Contact (KF7) | 2.4s | `power2.out` | Slowest — landing home |

**Files to modify:**
```
lib/keyframes.js          — add ease and duration to each KEYFRAME object
components/scene/CameraRig.jsx  — read ease/duration from keyframe instead of hardcoded
```

**Estimated difficulty:** Low  
**Dependencies:** Task 2.1 (FOV system must be in place)  
**Plugin/MCP:** core-3d-animation

**Impact score:** 7/10

**Agent:** `claude-sonnet-4-6`  
*Rationale:* Config-driven easing swap — table of values into keyframe objects  
If spawning an agent for this task, brief it with the full task context from this document. The agent **must** produce all required task fields §2–12: **Objective → Why Current Version Feels Amateur → Expected Visual Improvement → Files To Modify → Estimated Difficulty → Dependencies → Plugin/MCP → Command Sequence → Validation Method → Success Criteria → Impact Score.**

---

### Task 2.3 — In-Section Parallax Scrub

**Objective:** Add a second ScrollTrigger per section that drives micro-camera movement *within* each section while the user scrolls through it.

**Why current version feels amateur:** The camera reaches its destination when the section enters, then freezes until the next section triggers. A static camera on a 3D scene for 600–800px of scroll feels inert. Oryzo's camera never fully stops — the object continues to reveal itself throughout the scroll.

**Expected visual improvement:** The camera appears to breathe and follow the user's reading. As the user scrolls the About section, the camera drifts gently rightward — the building "orbits" into a slightly different facet. Each section has a unique within-section motion that reinforces its content.

**Per-section parallax specification (from `docs/camera-storyboard.md`):**
```
Hero:       z drifts -1.5 over full hero scroll (slow approach never stops)
About:      x drifts +0.5 (rightward orbit — curious, attentive)
Experience: x drifts -1.5 (continues orbit past side)
Skills:     x sine ±0.4 (scanning pendulum — like reading a skills grid)
Work:       y rises +1.0 (slow upward reveal — results presented)
Education:  y rises +2.0 (emergence from foundation)
Certs:      y sine ±0.15 (scanning a credential top-to-bottom)
Contact:    x,y cursor-responsive ±0.5x, ±0.3y
```

**Files to modify:**
```
components/scene/CameraRig.jsx  — add second ScrollTrigger per section with scrub: 1
                                   targeting camera.position offset on top of keyframe target
```

**Architecture note:** Use two separate GSAP targets:
- `basePos` — the keyframe position (set by entry tween)
- `parallaxOffset` — the in-section scrub delta (set by scrub trigger)
- `useFrame`: `camera.position.set(basePos.x + parallaxOffset.x, ...)`

**Estimated difficulty:** Medium  
**Dependencies:** Tasks 2.1, 2.2  
**Plugin/MCP:** extended-3d-scroll + core-3d-animation

**Impact score:** 7/10

**Agent:** `claude-opus-4-7`  
*Rationale:* Two parallel ScrollTrigger systems must coexist without conflict — requires architectural reasoning  
If spawning an agent for this task, brief it with the full task context from this document. The agent **must** produce all required task fields §2–12: **Objective → Why Current Version Feels Amateur → Expected Visual Improvement → Files To Modify → Estimated Difficulty → Dependencies → Plugin/MCP → Command Sequence → Validation Method → Success Criteria → Impact Score.**

---

### Task 2.4 — Hero Page-Load Crane Shot

**Objective:** Camera does not start at KF0 — it arrives at KF0. Page load triggers a one-time cinematic descent from `[0, 12, 18]` to `[0, 7, 13]`.

**Why current version feels amateur:** The camera appears fully positioned at page load. There is no establishing shot. Oryzo's opening is a full-screen reveal that sets the scene before content appears. The hero should feel like a cinema curtain rising.

**Expected visual improvement:** On page load, the user sees a slightly wider, higher view of the scene. Over 2.4 seconds, the camera descends and pushes in with `expo.out`. The scene "arrives." This single animation — seen once per session — establishes that this is a cinematic experience, not a static page.

**Files to modify:**
```
components/scene/CameraRig.jsx  — useEffect on mount: gsap.fromTo(camera.position,
                                   { x:0, y:12, z:18 }, { x:0, y:7, z:13, duration:2.4, ease:'expo.out' })
                                   Also tween camera.fov from 70 → 65 simultaneously
```

**Estimated difficulty:** Low  
**Dependencies:** Task 2.1  
**Plugin/MCP:** core-3d-animation + authoring-motion

**Impact score:** 9/10 (First impression. Seen by every visitor. The most important 2.4 seconds of the experience.)

**Agent:** `claude-sonnet-4-6`  
*Rationale:* Small, self-contained GSAP fromTo on mount — well-specified  
If spawning an agent for this task, brief it with the full task context from this document. The agent **must** produce all required task fields §2–12: **Objective → Why Current Version Feels Amateur → Expected Visual Improvement → Files To Modify → Estimated Difficulty → Dependencies → Plugin/MCP → Command Sequence → Validation Method → Success Criteria → Impact Score.**

---

## Phase 3 — Motion Design System

**Goal:** Replace the single `useCinematicReveal` hook with a section-differentiated motion vocabulary.  
**Plugins:** authoring-motion · animation-components  
**Reference document:** `docs/motion-system.md`

---

### Task 3.1 — Hero Headline Mass-Weighting

**Objective:** Replace uniform character stagger with mass-weighted character animation where structural words carry more gravity than functional words.

**Why current version feels amateur:** Every character in "Turning Complex Systems Into Measurable Impact" animates from `y:40` with identical duration. The article "Into" and the power word "Impact" carry the same weight. This is typographically illiterate. Lusion's hero text feels like architecture — some words are load-bearing.

**The mass-weighting system:**
```
Word tier assignment:
  HEAVY  (y: 80px, duration: 0.9s): "Complex", "Systems", "Measurable", "Impact"
  MEDIUM (y: 50px, duration: 0.75s): "Turning", "Into"

Stagger: 0.022s per character (tighter than current 0.03s)
Easing: cubic-bezier(0.16, 1, 0.3, 1) — "Reveal" curve (replaces expo.out)

"Impact" — final word special treatment:
  y: 100px (heaviest drop), duration: 0.9s, delay: +100ms after other chars
  After landing: 80ms pause, then spring-overshoot settle
```

**The role label (pre-headline):**
```
letter-spacing animates: 0.48em → 0.28em while opacity: 0 → 1
Duration: 600ms, Cinematic ease
Purpose: text "focusing" — gathering itself before the headline detonates
```

**Files to modify:**
```
components/sections/HeroSection.jsx         — mass-tier assignment per word
components/sections/HeroSection.module.css  — add .char-heavy, .char-medium classes
```

**Estimated difficulty:** Medium  
**Dependencies:** None (independent of 3D changes)  
**Plugin/MCP:** authoring-motion + animation-components

**Impact score:** 8/10

**Agent:** `claude-opus-4-7`  
*Rationale:* Novel creative pattern: per-word mass-tier assignment + non-uniform stagger — requires nuanced timing judgment  
If spawning an agent for this task, brief it with the full task context from this document. The agent **must** produce all required task fields §2–12: **Objective → Why Current Version Feels Amateur → Expected Visual Improvement → Files To Modify → Estimated Difficulty → Dependencies → Plugin/MCP → Command Sequence → Validation Method → Success Criteria → Impact Score.**

---

### Task 3.2 — Section-Differentiated Reveal System

**Objective:** Replace `useCinematicReveal` (one hook, seven sections) with a parameterized reveal system where each section has distinct timing, direction, and personality.

**Why current version feels amateur:** The monotony of identical `scale:0.85, y:60, blur(4px)` for every section is the most significant contributor to the generic feel. When everything moves the same, the brain stops tracking motion as information and starts ignoring it as noise.

**The new reveal vocabulary (from `docs/motion-system.md`):**
| Section | Direction | From-state | Timing | Easing | Personality |
|---------|-----------|------------|--------|--------|-------------|
| About | Heading: word-split `y:36px`. Bio: `x:-18px`. Stats: `y:55px, rotateX(12deg)` | 650ms/700ms/800ms | Reveal/Cinematic/Settle | "Conversational" |
| Experience | Tag: letter-spacing. Roles: `x:-40px`, stagger 200ms | 400ms/700ms | Cinematic | "Chronological" |
| Skills | Category cascade `x:-14px`, then tags burst per-category | 600ms/500ms | Cinematic/Settle | "Taxonomic" |
| Work | Cards: `y:60px, rotateX(10deg)` — "falling onto table" | 850ms | Settle | "Substantial" |
| Education | Entries: `x:+36px` (right arrival — foundational lookback) | 700ms | Cinematic | "Grounded" |
| Certs | Row-by-row badge scale `0→1` with spring, stagger 120ms between rows | 800ms | Settle | "Achievement" |
| Contact | Word-by-word at 0.15s stagger, 900ms per word — slowest on the page | 900ms | Reveal | "Conclusive" |

**Architecture change:** `useCinematicReveal` becomes `useSectionReveal(variant)` where `variant` is one of the seven named personalities. The hook takes the variant config and generates the appropriate GSAP animation.

**Files to modify:**
```
hooks/useCinematicReveal.js → rename/extend to hooks/useSectionReveal.js
components/sections/*.jsx    — pass variant prop to hook
```

**Estimated difficulty:** Medium-High  
**Dependencies:** None  
**Plugin/MCP:** authoring-motion + animation-components

**Impact score:** 9/10 (fixes the monotony that is the most prominent generic signal)

**Agent:** `claude-opus-4-7`  
*Rationale:* Seven distinct section personalities — requires creative differentiation across every content type  
If spawning an agent for this task, brief it with the full task context from this document. The agent **must** produce all required task fields §2–12: **Objective → Why Current Version Feels Amateur → Expected Visual Improvement → Files To Modify → Estimated Difficulty → Dependencies → Plugin/MCP → Command Sequence → Validation Method → Success Criteria → Impact Score.**

---

### Task 3.3 — NavBar Layered Entrance Sequence

**Objective:** Decompose the NavBar entrance into four sequential layers: backdrop → brand → links → gold border.

**Why current version feels amateur:** The NavBar appears as a single unit sliding down. Premium sites decompose elements — each layer has a semantic role and arrives in the order it should be *read*, not simultaneously.

**The four-act entrance (from `docs/motion-system.md`):**
```
Act 1 (0ms):    Backdrop — blur 0→20px, opacity 0→0.88, 400ms Cinematic ease
Act 2 (+100ms): Brand "Goody." — x:-16px, opacity:0→1, 500ms Reveal ease  
Act 3 (+180ms): Nav links — right-to-left cascade, y:-8px, stagger:60ms, 400ms Whisper ease
Act 4 (+200ms): Gold border — scaleX:0→1 from center, 600ms Settle ease
```

**New link hover behavior:**
```
1. Gold 4px circle appears at left edge of text (scale 0→1, 100ms Settle)
2. Underline draws rightward from circle (width 0→100%, 200ms Whisper, starts 50ms after circle)
3. Text color shifts to warm-white (200ms)
On leave: line retracts in same direction → circle shrinks
The circle arrives first and leaves last — it is the "memory" of the interaction
```

**Files to modify:**
```
components/ui/NavBar.jsx         — decompose single reveal into 4-phase GSAP sequence
components/ui/NavBar.module.css  — add dot pseudo-element for link hover
```

**Estimated difficulty:** Medium  
**Dependencies:** None  
**Plugin/MCP:** animation-components + authoring-motion

**Impact score:** 6/10

**Agent:** `claude-sonnet-4-6`  
*Rationale:* Four-phase sequence well-specified in motion-system.md — execution task  
If spawning an agent for this task, brief it with the full task context from this document. The agent **must** produce all required task fields §2–12: **Objective → Why Current Version Feels Amateur → Expected Visual Improvement → Files To Modify → Estimated Difficulty → Dependencies → Plugin/MCP → Command Sequence → Validation Method → Success Criteria → Impact Score.**

---

### Task 3.4 — Magnetic Tilt Calibration

**Objective:** Fix the enter/leave asymmetry and calibrate tilt magnitude by element surface area.

**Why current version feels amateur:** Cards snap to tilt position instantly on cursor entry (no ease-in) but leave with a spring (`elastic.out`). This is backwards — entering should be an exploration (ease in), leaving should be a release (spring out). The spring on exit is the best animation on the site; the instant snap-in makes it feel like a bug followed by a feature.

**Fixes (from `docs/motion-system.md`):**
```
Enter: gsap.to(ref.current, { rotateX, rotateY, duration: 0.12, ease: 'power2.out' })
       (was: instant raw transform assignment)

Tilt magnitude by element type:
  Stat cards (small):   ±8°  (keep current)
  Work cards (large):   ±12° (increase — more expressive at larger scale)
  Cert badges:          ±6°  (smaller, more precious — less wild)

Perspective by element type:
  Stat cards:   perspective(600px)   (keep)
  Work cards:   perspective(900px)   (was 600px — reduces distortion on large surface)
  
Velocity sensitivity (new):
  Track cursor delta velocity (px/frame).
  tiltMagnitude = baseTilt × (1 + clamp(velocity/200, 0, 0.5))
  Fast cursor = deeper tilt. Slow cursor = subtle tilt.
  This is what Lusion means by "physics before choreography."
```

**Files to modify:**
```
hooks/useMagneticTilt.js   — add ease-in, velocity tracking, size parameter
components/sections/AboutSection.jsx  — pass 'stat' size param
components/sections/WorkSection.jsx   — pass 'work' size param
components/sections/CertificationsSection.jsx — pass 'cert' size param
```

**Estimated difficulty:** Low-Medium  
**Dependencies:** None  
**Plugin/MCP:** animation-components

**Impact score:** 5/10

**Agent:** `claude-sonnet-4-6`  
*Rationale:* Tilt calibration with velocity tracking — well-specified mechanics  
If spawning an agent for this task, brief it with the full task context from this document. The agent **must** produce all required task fields §2–12: **Objective → Why Current Version Feels Amateur → Expected Visual Improvement → Files To Modify → Estimated Difficulty → Dependencies → Plugin/MCP → Command Sequence → Validation Method → Success Criteria → Impact Score.**

---

### Task 3.5 — Tempo Map Implementation

**Objective:** Replace all ad-hoc duration values with the defined tempo map system.

**Why current version feels amateur:** Duration values across the codebase are arbitrary (`0.6`, `0.7`, `0.5`) with no underlying system. Premium sites have temporal rhythm — durations relate to each other mathematically so the pacing feels composed, not random.

**The tempo map (from `docs/motion-system.md`):**
```css
/* CSS custom properties for use in transitions */
--t-whisper:  200ms;   /* Micro-feedback: hover, toggle */
--t-phrase:   400ms;   /* Standard interaction: button, link */
--t-sentence: 700ms;   /* Content entrance: headings, paras */
--t-passage:  1200ms;  /* Scene entrance: sections */
--t-chapter:  1800ms;  /* Camera moves, hero build */
```

**Files to modify:**
```
styles/globals.css          — add tempo map CSS variables
hooks/useSectionReveal.js   — use --t-sentence, --t-passage
components/scene/CameraRig.jsx  — reference tempo map for camera durations
```

**Estimated difficulty:** Low  
**Dependencies:** Task 3.2  
**Plugin/MCP:** authoring-motion

**Impact score:** 4/10 (structural — enables consistent pacing across all later phases)

**Agent:** `claude-haiku-4-5`  
*Rationale:* CSS custom property addition — trivial file change  
If spawning an agent for this task, brief it with the full task context from this document. The agent **must** produce all required task fields §2–12: **Objective → Why Current Version Feels Amateur → Expected Visual Improvement → Files To Modify → Estimated Difficulty → Dependencies → Plugin/MCP → Command Sequence → Validation Method → Success Criteria → Impact Score.**

---

## Phase 4 — 3D Scene Composition Redesign

**Goal:** Replace the wireframe box + HTML panels with a glass node graph subject. Remove all `<Html>` from Canvas. Establish three depth layers.  
**Plugins:** core-3d-animation · frontend-design  
**Reference document:** `docs/3d-experience-redesign.md`

---

### Task 4.1 — Remove `<Html>` DataPanels — Move Stats to HTML

**Objective:** Eliminate all `@react-three/drei` `<Html>` elements from the Canvas. Move the stat data (ERP Modules, Projects Delivered, etc.) into the `HeroSection` HTML as a stats row.

**Why current version feels amateur:** `<Html>` in 3D space is the most significant architectural mistake in the scene. These panels:
1. Do not occlude 3D geometry (they pass through the wireframe)
2. Do not receive shadows or lighting
3. Project into screen space and overlap the hero headline
4. Render on every frame during camera movement causing DOM layout thrash

The Oryzo scene has zero DOM elements inside the Canvas. Everything visual is geometry, materials, and shaders.

**Expected visual improvement:** Immediate elimination of the hero headline overlap. The 3D scene becomes a clean, unobstructed environment. The stats move to a properly designed HTML element below the hero bio.

**Files to modify:**
```
components/scene/DataPanels.jsx  → DELETE (or convert to tombstone export)
components/scene/SceneInner.jsx  — remove <DataPanels /> import and usage
lib/content.js                   — stats data already exists (hero section)
components/sections/HeroSection.jsx  — add StatsRow component below bio
components/sections/HeroSection.module.css  — add .statsRow, .statItem styles
```

**Stat row design:**
```
Layout: horizontal flex row, 4 items, gap: 2rem
Each item: large number in Cormorant Garamond 28px gold, label in Montserrat 10px muted
Items: "8" ERP Modules | "10+" Projects | "Q/C" Certified | "2+" Years
Entrance: stagger fade-in as part of hero Act V sequence
```

**Estimated difficulty:** Low-Medium  
**Dependencies:** None  
**Plugin/MCP:** core-3d-animation + frontend-design

**Impact score:** 9/10 (removes the most visible structural defect)

**Agent:** `claude-sonnet-4-6`  
*Rationale:* Component deletion + stat row HTML creation — straightforward migration  
If spawning an agent for this task, brief it with the full task context from this document. The agent **must** produce all required task fields §2–12: **Objective → Why Current Version Feels Amateur → Expected Visual Improvement → Files To Modify → Estimated Difficulty → Dependencies → Plugin/MCP → Command Sequence → Validation Method → Success Criteria → Impact Score.**

---

### Task 4.2 — Three-Layer Depth Architecture

**Objective:** Restructure the particle system into three explicit depth layers creating 28 units of perceivable depth.

**Why current version feels amateur:** Current z-spread of ±3 units (6 total) at camera z=12 produces a 2.5× parallax ratio — barely perceptible as depth. Oryzo creates depth with 5+ visual planes (table surface, tools foreground, coaster midground, background wall, ambient dark). The current scene has one perceived depth plane.

**The three-layer specification:**
```
Layer A — Far Field (z: -25 to -8)
  Count: 200 particles
  Size: 0.5–2px (distance-attenuated)
  Opacity: 0.08–0.15
  Color: #1a1005 (dark amber — almost invisible)
  Purpose: Creates sense of infinite space behind subject

Layer B — Subject (z: -2 to +2)
  The Node Graph (Phase 4.3)
  Camera always looks here

Layer C — Near Field (z: +4 to +7)
  Count: 6 large particles
  Size: 4–8px
  Opacity: 0.25–0.35
  Color: #D4A017 with AdditiveBlending
  Purpose: Foreground bokeh haze — camera has optical depth
```

**Additionally:** Add `<fog attach="fog" color="#0a0a0a" near={15} far={35} />`  
Far particles at z=-25 become almost fully fogged — atmospheric perspective makes the space feel infinite.

**Files to modify:**
```
components/scene/ParticleField.jsx  — extend to accept layer config, spawn 3 particle groups
components/scene/SceneInner.jsx     — add <fog>, pass layer configs
```

**Estimated difficulty:** Medium  
**Dependencies:** Task 4.1  
**Plugin/MCP:** core-3d-animation

**Impact score:** 7/10

**Agent:** `claude-sonnet-4-6`  
*Rationale:* Extension of existing ParticleField with two additional spawn groups  
If spawning an agent for this task, brief it with the full task context from this document. The agent **must** produce all required task fields §2–12: **Objective → Why Current Version Feels Amateur → Expected Visual Improvement → Files To Modify → Estimated Difficulty → Dependencies → Plugin/MCP → Command Sequence → Validation Method → Success Criteria → Impact Score.**

---

### Task 4.3 — Node Graph — Core 3D Subject Replacement

**Objective:** Replace `BuildingWireframe` with a glass node graph that changes state in response to scroll progress.

**Why current version feels amateur:** `BoxGeometry(2,3,2)` with `lineBasicMaterial` is:
- A template geometry (not specific to Goody's story)
- Architecturally incompatible with premium lighting (`lineBasicMaterial` ignores all lights)
- Statically identical from frame 0 to 100,000 (nothing to discover)
- 22% viewport height at hero position (too small to be a protagonist)

**The node graph concept:** The visual metaphor for a BA/ERP specialist is *systems thinking* — interconnected processes assembling from chaos into order. The graph begins as scattered nodes (complexity) and assembles into a structured hierarchy (the ERP system) as the user scrolls through the portfolio.

**Three scroll-driven states:**

*State 0 — Chaos (scroll 0 → 0.15):*
```
24 × IcosahedronGeometry(r=0.18)
Positions: random scatter on sphere of radius 6
Edges: invisible (opacity 0)
MeshPhysicalMaterial: { transmission: 0.9, roughness: 0.08, color: '#2a1a05', 
                         emissive: '#D4A017', emissiveIntensity: 0.3 }
```

*State 1 — Assembly (scroll 0.15 → 0.65):*
```
Nodes lerp from chaosPos[i] to gridPos[i] (4×3×2 structured hierarchy)
32 edges appear: opacity lerps 0 → 0.6 as node distances collapse
emissiveIntensity lerps 0.3 → 1.2
Color warms: lerp('#2a1a05', '#1a0f00')
```

*State 2 — Illuminated (scroll 0.65 → 1.0):*
```
Graph fully assembled. Data-flow pulse travels along edges (custom shader uniform uPulse)
emissiveIntensity lerps 1.2 → 2.5
Node color lerps #D4A017 → #F5E87A (warm gold-white)
Camera is at its closest position (Phase 2 KF4–KF7)
```

**The Assembly Reveal Moment (scroll ~0.35):**
```
Over 0.08 scroll units:
1. Camera pulls z: 14 → 7 (dramatic push-in)
2. Nodes snap to grid positions (lerp rate increases to 0.3/frame)
3. All 32 edges appear in rapid stagger (index-offset, 0.05 scroll units)
4. Bloom jumps: intensity 0.2 → 0.7 → settles to 0.4 (2-phase)
5. Gold pulse begins on assembled edges
This is the one irreversible "wow moment" in the experience.
```

**New files:**
```
components/scene/NodeGraph.jsx        — main component (replaces BuildingWireframe)
components/scene/NodeGraph.module.css — (none — pure 3D, no DOM)
shaders/edge.vert.glsl               — edge geometry shader
shaders/edge.frag.glsl               — data-flow pulse shader
lib/nodePositions.js                  — chaos and grid position arrays (pre-computed)
```

**Modified files:**
```
components/scene/SceneInner.jsx  — replace <BuildingWireframe/> with <NodeGraph progress={scrollProgress}/>
components/scene/BuildingWireframe.jsx → DELETE
```

**Estimated difficulty:** High  
**Dependencies:** Tasks 4.1, 4.2  
**Plugin/MCP:** core-3d-animation + feature-dev

**Impact score:** 10/10 (the single most impactful change in the entire plan)

**Agent:** `claude-opus-4-7`  
*Rationale:* Most complex task: new 3D subject, custom GLSL shaders, scroll-driven state machine, glass material — full creative + technical depth  
If spawning an agent for this task, brief it with the full task context from this document. The agent **must** produce all required task fields §2–12: **Objective → Why Current Version Feels Amateur → Expected Visual Improvement → Files To Modify → Estimated Difficulty → Dependencies → Plugin/MCP → Command Sequence → Validation Method → Success Criteria → Impact Score.**

---

### Task 4.4 — Viewport Composition — Left/Right Zone Split

**Objective:** Position the 3D subject to occupy the right 55% of the viewport, leaving the left 45% for HTML content with no overlap.

**Why current version feels amateur:** Both 3D (centered) and HTML (left-aligned at 7vw padding) try to own the center of the frame. The overlap creates visual noise. Oryzo's coaster owns the right 60% of viewport; copy owns the left 40%. The boundary between them has intentional negative space.

**Implementation:**
```
Camera position adjustment: shift camera x from 0 to +2.0 at hero position
  → 3D subject appears right-of-center in screen space
  
HTML sections: set max-width: 45vw for all section .heading and .body elements
  → content lives in the left zone

Negative space (~10% viewport width) between zones is intentional — eye can rest
```

**Files to modify:**
```
lib/keyframes.js — shift all x positions +2 (or adjust camera lookAt to shift right)
components/sections/*.module.css — cap content max-width to 45vw on desktop
```

**Estimated difficulty:** Low-Medium  
**Dependencies:** Task 4.3  
**Plugin/MCP:** frontend-design + core-3d-animation

**Impact score:** 7/10

**Agent:** `claude-sonnet-4-6`  
*Rationale:* CSS max-width + camera x offset — small, bounded change  
If spawning an agent for this task, brief it with the full task context from this document. The agent **must** produce all required task fields §2–12: **Objective → Why Current Version Feels Amateur → Expected Visual Improvement → Files To Modify → Estimated Difficulty → Dependencies → Plugin/MCP → Command Sequence → Validation Method → Success Criteria → Impact Score.**

---

## Phase 5 — Lighting & Materials

**Goal:** Implement three-point cinematic lighting rig, add environment map, upgrade to `MeshPhysicalMaterial`, add post-processing pipeline.  
**Plugin:** core-3d-animation

---

### Task 5.1 — Three-Point Lighting Rig

**Objective:** Replace the current single point light with a three-point cinematic lighting setup.

**Why current version feels amateur:** The current setup:
```js
<ambientLight intensity={0.3} />
<pointLight position={[0, 5, 5]} color="#D4A017" intensity={2} />
```
One ambient fill plus one gold point light produces: no shadows, no rim definition, no cool/warm contrast. Every surface reads at equal luminance — flat.

Oryzo's coaster appears to glow from within because it has: warm key from upper-right, cool blue fill from opposite side, white rim/backlight. The three-point triangle is the fundamental building block of product photography and film lighting.

**The lighting specification:**
```jsx
/* Key Light — warm gold, upper right front */
<directionalLight
  color="#F5C518"          /* Slightly warmer than brand gold */
  intensity={2.5}
  position={[5, 8, 6]}    /* Upper right front — traditional 3/4 position */
  castShadow={false}       /* Wireframe/glass subjects need no shadow */
/>

/* Fill Light — cool blue, lower left */
<directionalLight
  color="#1a2840"          /* Deep cool blue — creates warm/cool contrast */
  intensity={0.8}
  position={[-4, -2, 8]}  /* Lower left — opposite key */
/>

/* Rim Light — white, from behind */
<directionalLight
  color="#ffffff"
  intensity={1.8}
  position={[-2, 3, -8]}  /* Behind subject — creates halo/separation edge */
/>

/* Remove: ambientLight replaced by environment map (Task 5.2) */
/* Remove: original pointLight [0,5,5] */
```

**Why the rim light matters:** The backlight creates a bright edge that separates the subject from the dark background. This is why Oryzo's coaster appears to float. The glass material (Task 5.3) transmits the rim light through the nodes, creating the "trapped light" effect.

**Files to modify:**
```
components/scene/SceneInner.jsx  — replace lighting setup
```

**Estimated difficulty:** Low  
**Dependencies:** None (independent — benefits existing geometry)  
**Plugin/MCP:** core-3d-animation

**Impact score:** 9/10 (single line changes produce dramatic visual improvement)

**Agent:** `claude-haiku-4-5`  
*Rationale:* Three JSX light components replacing two — mechanical substitution  
If spawning an agent for this task, brief it with the full task context from this document. The agent **must** produce all required task fields §2–12: **Objective → Why Current Version Feels Amateur → Expected Visual Improvement → Files To Modify → Estimated Difficulty → Dependencies → Plugin/MCP → Command Sequence → Validation Method → Success Criteria → Impact Score.**

---

### Task 5.2 — Environment Map (HDRI IBL)

**Objective:** Add image-based lighting via `<Environment>` from drei for physically plausible reflections.

**Why current version feels amateur:** Directional lights illuminate surfaces but don't create *reflections*. Glass materials (`MeshPhysicalMaterial`) look lifeless without an environment map because they have nothing to reflect/refract. The HDRI makes node surfaces appear to exist in a real light environment, giving them optical presence.

**Implementation:**
```jsx
// In SceneInner.jsx, inside Suspense:
<Environment
  preset="city"
  background={false}    /* Don't show HDRI as background — just use for IBL */
  intensity={0.4}       /* Subtle — environmental accent, not primary light */
/>
```

**Notes:**
- The `city` preset provides a warm-cool urban HDRI that complements the gold/dark palette
- `background={false}` keeps the dark background — HDRI only affects material reflections
- `intensity={0.4}` is low by design — this supplements, doesn't dominate

**Files to modify:**
```
components/scene/SceneInner.jsx
package.json              — verify @react-three/drei includes Environment (it does)
```

**Estimated difficulty:** Low  
**Dependencies:** Task 5.1  
**Plugin/MCP:** core-3d-animation

**Impact score:** 7/10

**Agent:** `claude-haiku-4-5`  
*Rationale:* One JSX component addition inside Suspense — minimal context needed  
If spawning an agent for this task, brief it with the full task context from this document. The agent **must** produce all required task fields §2–12: **Objective → Why Current Version Feels Amateur → Expected Visual Improvement → Files To Modify → Estimated Difficulty → Dependencies → Plugin/MCP → Command Sequence → Validation Method → Success Criteria → Impact Score.**

---

### Task 5.3 — MeshPhysicalMaterial for Node Graph

**Objective:** Apply glass transmission material to node spheres.

**Why current version feels amateur:** The current node spheres use `meshStandardMaterial` with `emissive: '#D4A017'`. Standard material creates basic PBR shading but no refraction, no transmission, no internal glow. Glass material (`MeshPhysicalMaterial`) refracts the rim light through the node body, creating the "light trapped inside glass" quality that reads as precious and expensive.

**The material specification:**
```jsx
<meshPhysicalMaterial
  color="#1a0f00"              /* Dark amber base — gold shows through transmission */
  emissive="#D4A017"
  emissiveIntensity={scrollLerp(0.3, 2.5)}  /* Driven by scroll progress */
  transmission={0.85}         /* Glass refraction through body */
  roughness={0.08}             /* Near-mirror surface — crisp highlights */
  metalness={0.0}              /* Glass, not metal */
  thickness={0.4}              /* Controls internal refraction depth */
  ior={1.5}                    /* Standard glass refractive index */
  envMapIntensity={1.2}        /* Picks up HDRI reflections */
/>
```

**Files to modify:**
```
components/scene/NodeGraph.jsx  — material definition (new component from Task 4.3)
```

**Estimated difficulty:** Low (within NodeGraph component)  
**Dependencies:** Tasks 4.3, 5.1, 5.2  
**Plugin/MCP:** core-3d-animation

**Impact score:** 8/10

**Agent:** `claude-sonnet-4-6`  
*Rationale:* Material property object within NodeGraph — well-specified values  
If spawning an agent for this task, brief it with the full task context from this document. The agent **must** produce all required task fields §2–12: **Objective → Why Current Version Feels Amateur → Expected Visual Improvement → Files To Modify → Estimated Difficulty → Dependencies → Plugin/MCP → Command Sequence → Validation Method → Success Criteria → Impact Score.**

---

### Task 5.4 — Post-Processing Pipeline

**Objective:** Add `EffectComposer` with Bloom, Vignette, and Chromatic Aberration.

**Why current version feels amateur:** Zero post-processing is the clearest signal that a 3D scene was built by a developer, not a creative technologist. Post-processing is how film simulates the behavior of real optical lenses — and it's what makes the difference between "3D rendered in a browser" and "this could be a product video."

**The three-pass pipeline:**

*Bloom — emissive glow bleed:*
```jsx
<Bloom
  luminanceThreshold={0.6}    /* Only affects brightest gold emissive areas */
  luminanceSmoothing={0.025}
  intensity={0.4}             /* Subtle — glows, doesn't bloom the UI */
  mipmapBlur={true}           /* Eliminates banding artifacts */
/>
```

*Vignette — corner darkening:*
```jsx
<Vignette
  offset={0.15}
  darkness={0.6}
  eskil={false}
/>
```

*Chromatic Aberration — lens fringing:*
```jsx
<ChromaticAberration
  offset={[0.0008, 0.0005]}  /* Barely visible — subconscious quality signal */
/>
```

**Bloom intensity tied to scroll state:**
- Default: `intensity: 0.4`
- During Assembly Reveal (Task 4.3 wow moment): jumps to `0.7` then settles back — a bloom pulse that punctuates the reveal

**New dependencies:**
```
@react-three/postprocessing  — verify in package.json (already in stack per rewrite plan)
```

**Files to modify:**
```
components/scene/SceneInner.jsx  — wrap scene contents in <EffectComposer>
```

**Estimated difficulty:** Low  
**Dependencies:** Tasks 5.1, 5.2, 5.3  
**Plugin/MCP:** core-3d-animation

**Impact score:** 9/10 (highest single-line ROI in the entire plan — transforms rendered quality)

**Agent:** `claude-sonnet-4-6`  
*Rationale:* EffectComposer wrapper with three passes — well-documented API  
If spawning an agent for this task, brief it with the full task context from this document. The agent **must** produce all required task fields §2–12: **Objective → Why Current Version Feels Amateur → Expected Visual Improvement → Files To Modify → Estimated Difficulty → Dependencies → Plugin/MCP → Command Sequence → Validation Method → Success Criteria → Impact Score.**

---

## Phase 6 — Scroll Storytelling

**Goal:** Replace event-driven ScrollTrigger (on/off) with a single scroll progress timeline. Connect scene state to narrative chapters.  
**Plugins:** extended-3d-scroll · authoring-motion  
**Reference documents:** `docs/camera-storyboard.md` · `docs/3d-experience-redesign.md`

---

### Task 6.1 — Single Scroll Progress Driver

**Objective:** Expose a single normalized `scrollProgress` (0→1) value from a root GSAP ScrollTrigger that all scene components can read.

**Why current version feels amateur:** The current model has 8 independent ScrollTrigger instances, each asynchronously tweening the camera on `onEnter`. The camera is always 1.8 seconds behind where the user is. This is the opposite of Oryzo's model where scroll progress IS camera position — 1:1, zero delay.

**Implementation architecture:**
```jsx
// hooks/useScrollProgress.js  (new file)
export function useScrollProgress() {
  const progress = useRef(0);
  
  useEffect(() => {
    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: true,    // ← direct 1:1 binding — zero async lag
      onUpdate: (self) => {
        progress.current = self.progress;
      }
    });
  }, []);
  
  return progress;
}
```

**This ref is passed to:**
- `NodeGraph.jsx` — drives chaos→assembly→illuminated state
- `CameraRig.jsx` — drives section-level parallax offsets
- `ParticleField.jsx` — drives density/speed variation by scroll depth

**Files to create/modify:**
```
hooks/useScrollProgress.js      — NEW: root scroll progress provider
app/page.js                     — create scrollProgress ref, pass to Scene and sections
components/scene/SceneInner.jsx — accept and distribute scrollProgress
```

**Estimated difficulty:** Medium  
**Dependencies:** Tasks 4.3, 2.3  
**Plugin/MCP:** extended-3d-scroll + core-3d-animation

**Impact score:** 9/10 (architectural — makes all scroll-driven animation possible)

**Agent:** `claude-opus-4-7`  
*Rationale:* Architectural root: single scrub ScrollTrigger driving all scene state — all Phase 6 tasks depend on this  
If spawning an agent for this task, brief it with the full task context from this document. The agent **must** produce all required task fields §2–12: **Objective → Why Current Version Feels Amateur → Expected Visual Improvement → Files To Modify → Estimated Difficulty → Dependencies → Plugin/MCP → Command Sequence → Validation Method → Success Criteria → Impact Score.**

---

### Task 6.2 — Scroll Chapters Architecture

**Objective:** Define the narrative chapters of the scroll journey and map them to scene state transitions.

**Why current version feels amateur:** The scroll journey is eight identical sections. Each section triggers the same "camera moves, content appears" sequence. There is no sense of narrative arc — no act structure, no climax, no resolution.

**The three-act structure:**

*Act I — Arrival (scroll 0 → 0.30): Hero + About*
```
Visual theme: CHAOS
3D state: Scattered nodes, dim amber glow
Camera: Wide establishing, descends to human level
Emotional register: "Who is this person? Interesting."
Music analogy: Opening motif — statement of theme
```

*Act II — Revelation (scroll 0.30 → 0.70): Experience + Skills + Work*
```
Visual theme: ASSEMBLY → ORDER
3D state: Assembly begins (0.30) → reveal moment (0.35) → fully assembled (0.65)
Camera: Sweeps right, pulls back wide, dives left-low — three strong compositions
Emotional register: "This person has done real things."
Music analogy: Development — exploration of the theme
```

*Act III — Resolution (scroll 0.70 → 1.0): Education + Certs + Contact*
```
Visual theme: ILLUMINATED SYSTEM
3D state: Fully assembled, pulsing with data-flow edges, gold-white
Camera: Ground-level, precision focus, then opens wide for contact
Emotional register: "This is the person I want to work with."
Music analogy: Recapitulation — return with earned understanding
```

**Files to modify:**
```
hooks/useScrollProgress.js  — add chapter boundaries as exported constants
components/scene/NodeGraph.jsx  — use chapter boundaries for state transitions
lib/keyframes.js            — annotate keyframes with chapter membership
```

**Estimated difficulty:** Low (design/documentation task primarily)  
**Plugin/MCP:** extended-3d-scroll + authoring-motion

**Impact score:** 6/10 (structural — informs all other scroll tasks)

**Agent:** `claude-sonnet-4-6`  
*Rationale:* Constants + documentation — structural definitions, not implementation  
If spawning an agent for this task, brief it with the full task context from this document. The agent **must** produce all required task fields §2–12: **Objective → Why Current Version Feels Amateur → Expected Visual Improvement → Files To Modify → Estimated Difficulty → Dependencies → Plugin/MCP → Command Sequence → Validation Method → Success Criteria → Impact Score.**

---

### Task 6.3 — Particle Field Scroll-Depth Response

**Objective:** Make particle density, speed, and color temperature respond to scroll depth.

**Why current version feels amateur:** The particle field is identical at every scroll position. The scene does not exhale at Contact the way it breathes at Hero. Lusion's particle systems respond to the user's position — they're ambient indicators of where in the experience you are.

**The variation map (from `docs/motion-system.md`):**
```
Hero (0–0.15):    density=1.0, speed=1.0, glow=1.0, color='#D4A017'
About→Skills (0.15–0.45): density=1.2, speed=1.1, glow=1.0
Work (0.45–0.65): density=1.3 (peak), speed=0.9 (heavier), glow=1.2, slight warm shift
Education→Certs (0.65–0.85): density=0.85, speed=0.8, glow=0.9
Contact (0.85–1.0): density=0.4, speed=0.5, glow=0.7
```

The scene exhales as the portfolio concludes. The closing quiet is earned by the journey.

**Implementation:**
```glsl
// In particle.vert.glsl — add uScrollProgress uniform
uniform float uScrollProgress;
// Modulate aSpeed by scroll-depth factor
float depthFactor = mix(1.0, 0.5, smoothstep(0.85, 1.0, uScrollProgress));
pos.y += cos(uTime * aSpeed * 0.7 * depthFactor + seed * 3.14) * 0.1;
```

**Files to modify:**
```
components/scene/ParticleField.jsx  — add uScrollProgress uniform, pass from scrollProgress ref
shaders/particle.vert.glsl          — use uScrollProgress in drift calculation
```

**Estimated difficulty:** Medium  
**Dependencies:** Task 6.1  
**Plugin/MCP:** extended-3d-scroll + core-3d-animation

**Impact score:** 6/10

**Agent:** `claude-sonnet-4-6`  
*Rationale:* Uniform extension to existing shader — bounded GLSL change  
If spawning an agent for this task, brief it with the full task context from this document. The agent **must** produce all required task fields §2–12: **Objective → Why Current Version Feels Amateur → Expected Visual Improvement → Files To Modify → Estimated Difficulty → Dependencies → Plugin/MCP → Command Sequence → Validation Method → Success Criteria → Impact Score.**

---

### Task 6.4 — Building Initialization Sequence

**Objective:** The 3D scene should not appear fully-active at page load. It should wake up over the first 2400ms.

**Why current version feels amateur:** The scene loads fully formed — nodes pulsing, panels floating, particles drifting. There is no transition from "nothing" to "something." Oryzo's product appears with a considered entrance — the camera descends, the object materializes. The initialization IS the hero moment.

**Four-phase awakening (from `docs/motion-system.md`):**
```
Phase 1 (0–800ms):    Nodes scale from 0 with stagger — bottom 12 first, then top 12
                       scale: 0 → 1, stagger: 40ms per node, ease: power3.out

Phase 2 (400–1200ms): Edges draw in — opacity lerps 0 → 0.3
                       (edges aren't fully bright until assembly, but the structure appears)

Phase 3 (600–2000ms): Particles spawn progressively
                       uSpawnProgress uniform: 0 → 1 over 1400ms
                       Particles below their spawn threshold are invisible
                       The field fills as if assembling from nothing

Phase 4 (800–2400ms): emissive intensity on nodes rises 0 → 0.3 
                       The nodes "come online" — dim amber glow activates
```

**Files to modify:**
```
components/scene/NodeGraph.jsx    — add initialization sequence (useEffect on mount)
components/scene/ParticleField.jsx — add uSpawnProgress uniform
shaders/particle.vert.glsl        — use uSpawnProgress in particle visibility
```

**Estimated difficulty:** Medium  
**Dependencies:** Task 4.3  
**Plugin/MCP:** authoring-motion + core-3d-animation

**Impact score:** 8/10

**Agent:** `claude-opus-4-7`  
*Rationale:* Multi-phase GSAP sequence + shader spawn uniform — coordinates timing across 3D and DOM layers  
If spawning an agent for this task, brief it with the full task context from this document. The agent **must** produce all required task fields §2–12: **Objective → Why Current Version Feels Amateur → Expected Visual Improvement → Files To Modify → Estimated Difficulty → Dependencies → Plugin/MCP → Command Sequence → Validation Method → Success Criteria → Impact Score.**

---

## Phase 7 — Implementation

**Goal:** Translate all design specifications into production code, maintaining test coverage.  
**Plugins:** feature-dev · typescript-lsp

---

### Task 7.1 — Dependency Audit & Installation

**Objective:** Verify all required packages are available, install missing ones.

**Required packages (verify each exists in package.json):**
```
@react-three/fiber          ✓ exists
@react-three/drei           ✓ exists
@react-three/postprocessing — VERIFY (needed for Phase 5.4)
gsap                        ✓ exists
three                       ✓ exists
next                        ✓ exists
```

**Install if missing:**
```bash
npm install @react-three/postprocessing
```

**Estimated difficulty:** Low  
**Dependencies:** None  
**Plugin/MCP:** feature-dev

**Impact score:** 2/10 (prerequisite only)

**Agent:** `claude-haiku-4-5`  
*Rationale:* Package.json verification + one npm install command  
If spawning an agent for this task, brief it with the full task context from this document. The agent **must** produce all required task fields §2–12: **Objective → Why Current Version Feels Amateur → Expected Visual Improvement → Files To Modify → Estimated Difficulty → Dependencies → Plugin/MCP → Command Sequence → Validation Method → Success Criteria → Impact Score.**

---

### Task 7.2 — Phased File Modification Map

**Objective:** Document exact file-by-file changes in implementation order to prevent merge conflicts.

**Deletion list** (in order — no downstream dependencies):
```
1. components/scene/BuildingWireframe.jsx    → delete after NodeGraph replaces it
2. components/scene/DataPanels.jsx           → delete after stats moved to HTML (Task 4.1)
3. components/scene/DataPanels.module.css   → delete with DataPanels
4. components/scene/ContactAccent.jsx        → delete (duplicate ParticleField at 30 nodes)
```

**Creation list** (in order):
```
1. hooks/useScrollProgress.js               → Task 6.1
2. lib/nodePositions.js                     → Task 4.3 (chaos + grid coordinates)
3. components/scene/NodeGraph.jsx           → Task 4.3
4. shaders/edge.vert.glsl                  → Task 4.3
5. shaders/edge.frag.glsl                  → Task 4.3
6. hooks/useSectionReveal.js               → Task 3.2 (replaces useCinematicReveal)
```

**Modification list** (in dependency order):
```
Phase 1 deps → Phase 4 deps → Phase 5 deps → Phase 6 deps:

styles/globals.css                 — contrast fix, tempo map vars
components/ui/NavBar.jsx           — layered entrance, touch target
components/ui/NavBar.module.css    — link hover dot pattern
components/sections/HeroSection.jsx       — stats row, mass-weighted chars
components/sections/HeroSection.module.css — headline fix, stats row styles
components/sections/AboutSection.jsx      — useSectionReveal('about')
components/sections/ExperienceSection.jsx — useSectionReveal('experience')
components/sections/SkillsSection.jsx     — useSectionReveal('skills')
components/sections/WorkSection.jsx       — useSectionReveal('work'), remove href="#"
components/sections/EducationSection.jsx  — useSectionReveal('education')
components/sections/CertificationsSection.jsx — useSectionReveal('certs')
components/sections/ContactSection.jsx   — useSectionReveal('contact')
hooks/useMagneticTilt.js           — ease-in, velocity, size param
lib/keyframes.js                   — fov, ease, duration per keyframe
components/scene/SceneInner.jsx    — new lights, Environment, NodeGraph, fog, postprocessing
components/scene/CameraRig.jsx     — FOV tween, per-section easing, parallax scrub, crane shot
components/scene/ParticleField.jsx — 3-layer architecture, scroll-depth uniforms
shaders/particle.vert.glsl         — uScrollProgress, uSpawnProgress
app/page.js                        — scrollProgress ref distribution
```

**Estimated difficulty:** Low (planning only)  
**Plugin/MCP:** feature-dev

**Impact score:** 3/10 (prerequisite for clean implementation)

**Agent:** `claude-haiku-4-5`  
*Rationale:* Documentation task — no code production required  
If spawning an agent for this task, brief it with the full task context from this document. The agent **must** produce all required task fields §2–12: **Objective → Why Current Version Feels Amateur → Expected Visual Improvement → Files To Modify → Estimated Difficulty → Dependencies → Plugin/MCP → Command Sequence → Validation Method → Success Criteria → Impact Score.**

---

### Task 7.3 — Critical Path Implementation

**Objective:** Implement the highest-impact changes first so each commit produces a visible improvement.

**Recommended implementation order:**

**Commit 1 — Immediate visible fixes (2 hours):**
```
- Fix hero headline word break
- Raise --muted-txt contrast  
- Remove href="#" from Work cards
- Enlarge NavBar lang toggle touch target
Result: site reads as professionally crafted
```

**Commit 2 — Lighting (1 hour):**
```
- Replace ambientLight + pointLight with 3-point rig
- Add Environment (HDRI IBL)
Result: existing nodes look dramatically better immediately
```

**Commit 3 — Post-processing (2 hours):**
```
- Add EffectComposer + Bloom + Vignette + ChromaticAberration
Result: "rendered" quality appears — the single largest perceived quality jump
```

**Commit 4 — Camera FOV + easing (2 hours):**
```
- Add fov to keyframes
- Add per-section easing/duration
- Add hero crane shot on mount
Result: camera feels cinematic for the first time
```

**Commit 5 — Remove DataPanels, add stats to HTML (3 hours):**
```
- Delete DataPanels, ContactAccent
- Add StatsRow to HeroSection
Result: hero overlap eliminated, scene unobstructed
```

**Commit 6 — Scroll progress + particle depth (4 hours):**
```
- Implement useScrollProgress
- Restructure ParticleField to 3 layers
- Add fog
Result: depth becomes visible, scene has spatial atmosphere
```

**Commit 7 — NodeGraph (1 day):**
```
- Build NodeGraph with scroll-driven state machine
- Replace BuildingWireframe
- Add initialization sequence
Result: the scene becomes specific and narrative-driven
```

**Commit 8 — Motion system (1 day):**
```
- Implement useSectionReveal variants
- Mass-weighted hero headline
- NavBar layered entrance
- Magnetic tilt calibration
Result: every animation now has personality
```

**Commit 9 — Scroll storytelling (4 hours):**
```
- In-section parallax scrub
- Particle scroll-depth variation
- Assembly wow moment choreography
Result: scroll feels like cinema
```

**Estimated difficulty:** High (total execution)  
**Dependencies:** All prior phases  
**Plugin/MCP:** feature-dev + typescript-lsp

**Impact score:** 10/10

**Agent:** `claude-opus-4-7`  
*Rationale:* Orchestrates 9 sequential commits touching every layer of the stack — requires full system awareness  
If spawning an agent for this task, brief it with the full task context from this document. The agent **must** produce all required task fields §2–12: **Objective → Why Current Version Feels Amateur → Expected Visual Improvement → Files To Modify → Estimated Difficulty → Dependencies → Plugin/MCP → Command Sequence → Validation Method → Success Criteria → Impact Score.**

---

### Task 7.4 — Test Coverage Maintenance

**Objective:** Maintain existing 32 unit tests and 6 E2E tests. Add tests for new hooks.

**New tests required:**
```
hooks/useScrollProgress.test.js  — test progress normalization, cleanup
hooks/useSectionReveal.test.js   — test variant dispatch, reduced-motion gate
lib/nodePositions.test.js        — test chaos/grid position generation
```

**Tests that will fail after implementation (must be updated):**
```
Any snapshot tests referencing DataPanels or BuildingWireframe components
```

**Files to modify:**
```
Any test importing DataPanels.jsx or BuildingWireframe.jsx → update imports
```

**Plugin/MCP:** feature-dev (implementation) + playwright (E2E)

**Impact score:** 3/10 (quality gate — prevents regressions)

**Agent:** `claude-sonnet-4-6`  
*Rationale:* Unit + E2E test writing for new hooks — standard testing patterns  
If spawning an agent for this task, brief it with the full task context from this document. The agent **must** produce all required task fields §2–12: **Objective → Why Current Version Feels Amateur → Expected Visual Improvement → Files To Modify → Estimated Difficulty → Dependencies → Plugin/MCP → Command Sequence → Validation Method → Success Criteria → Impact Score.**

---

## Phase 8 — Optimization

**Goal:** Ensure 60fps sustained, reduce GPU memory, stop canvas rendering when idle.  
**Plugins:** chrome-devtools-mcp · code-simplifier

---

### Task 8.1 — Canvas Render Optimization

**Objective:** Switch to `frameloop="demand"` and manually invalidate on scroll/interaction events.

**Why current version is inefficient:** The Canvas renders at 60fps regardless of whether anything is moving. On a scroll-paused viewport, the scene renders 60 identical frames per second. With `frameloop="demand"`, the canvas only renders when `invalidate()` is called.

**Trigger points for `invalidate()`:**
```
- ScrollTrigger onUpdate callback
- mousemove event (for cursor vortex)
- window resize
- Any GSAP tween tick (via onUpdate)
```

**Additionally:**
```jsx
// Prevent 4K displays from rendering at native DPR
<Canvas dpr={[1, 1.5]} frameloop="demand">
```

**Files to modify:**
```
components/scene/SceneInner.jsx  — add frameloop="demand", dpr={[1,1.5]}
components/scene/ParticleField.jsx  — call invalidate() in useFrame
components/scene/CameraRig.jsx      — add invalidate() to tween onUpdate
```

**Estimated difficulty:** Low-Medium  
**Dependencies:** Task 7.3  
**Plugin/MCP:** chrome-devtools-mcp (before/after FPS measurement)

**Impact score:** 6/10 (battery life, thermal management, sustained smoothness)

**Agent:** `claude-sonnet-4-6`  
*Rationale:* frameloop + dpr config + invalidate() call sites — bounded optimization  
If spawning an agent for this task, brief it with the full task context from this document. The agent **must** produce all required task fields §2–12: **Objective → Why Current Version Feels Amateur → Expected Visual Improvement → Files To Modify → Estimated Difficulty → Dependencies → Plugin/MCP → Command Sequence → Validation Method → Success Criteria → Impact Score.**

---

### Task 8.2 — Geometry & Memory Optimization

**Objective:** Audit and minimize geometry complexity and memory allocations.

**Key optimizations:**
```
NodeGraph: 24 × IcosahedronGeometry(0.18, 2) — 2 detail level is sufficient (~40 tris/node)
           Use InstancedMesh for nodes (24 identical geometries → 1 draw call)
           
Edge geometry: LineSegments with pre-computed BufferGeometry
               ~32 edges × 2 vertices = 64 positions — trivial

ParticleField: 200+120+6 = 326 total particles — three separate Points calls
               Consider merging far-field into one call with opacity uniform threshold
               
Verify no GLSL shader recompilation on re-render:
  All shaders must be module-level constants (not created in component body)
```

**Files to modify:**
```
components/scene/NodeGraph.jsx    — InstancedMesh for nodes
components/scene/ParticleField.jsx — audit allocations in useMemo
shaders/*.glsl                    — verify module-level constants
```

**Estimated difficulty:** Medium  
**Plugin/MCP:** chrome-devtools-mcp (heap snapshot before/after)

**Impact score:** 5/10

**Agent:** `claude-sonnet-4-6`  
*Rationale:* InstancedMesh conversion + useMemo audit — standard R3F optimization patterns  
If spawning an agent for this task, brief it with the full task context from this document. The agent **must** produce all required task fields §2–12: **Objective → Why Current Version Feels Amateur → Expected Visual Improvement → Files To Modify → Estimated Difficulty → Dependencies → Plugin/MCP → Command Sequence → Validation Method → Success Criteria → Impact Score.**

---

### Task 8.3 — Performance Monitor Integration

**Objective:** Add `<PerformanceMonitor>` from drei for adaptive quality scaling in production.

**Implementation:**
```jsx
<PerformanceMonitor
  onDecline={() => setDpr(1)}          /* Reduce DPR if FPS drops */
  onIncline={() => setDpr(Math.min(window.devicePixelRatio, 1.5))}
>
  <SceneInner scrollProgress={scrollProgress} />
</PerformanceMonitor>
```

**Also add:** `<AdaptiveDpr pixelated />` which automatically handles DPR based on performance.

**Files to modify:**
```
components/scene/Scene.jsx or SceneInner.jsx  — add PerformanceMonitor wrapper
```

**Estimated difficulty:** Low  
**Plugin/MCP:** chrome-devtools-mcp

**Impact score:** 4/10 (defense against bad devices — ensures experience degrades gracefully)

**Agent:** `claude-haiku-4-5`  
*Rationale:* One PerformanceMonitor wrapper component addition  
If spawning an agent for this task, brief it with the full task context from this document. The agent **must** produce all required task fields §2–12: **Objective → Why Current Version Feels Amateur → Expected Visual Improvement → Files To Modify → Estimated Difficulty → Dependencies → Plugin/MCP → Command Sequence → Validation Method → Success Criteria → Impact Score.**

---

## Phase 9 — Quality Assurance

**Goal:** Verify production readiness: no regressions, performance gates pass, cross-browser smoke test.  
**Plugins:** code-review · coderabbit · playwright

---

### Task 9.1 — Code Review Pass

**Objective:** Review all Phase 4–6 implementation for correctness, security, and performance anti-patterns.

**Review checklist:**
```
□ No setState inside useFrame (React re-render in animation loop)
□ All Three.js objects created in useMemo or once (not per-render)
□ All GSAP timelines/ScrollTriggers cleaned up in useEffect return
□ No new THREE.Vector3() created in animation callbacks
□ All shader uniforms updated via ref.current.uniforms.X.value = Y (not recreated)
□ No console.error in production build
□ prefers-reduced-motion gate applied to all animations
□ pointer:fine gate applied to all cursor-interactive elements
□ No layout-triggering CSS properties in animation targets (no width/height transitions)
```

**Files to review (Phase 4–6 new/modified):**
```
components/scene/NodeGraph.jsx
shaders/edge.vert.glsl, edge.frag.glsl
hooks/useScrollProgress.js
hooks/useSectionReveal.js
components/scene/CameraRig.jsx (significant changes)
components/scene/ParticleField.jsx (significant changes)
```

**Plugin/MCP:** code-review + coderabbit  
**Impact score:** 4/10 (quality gate)

**Agent:** `claude-opus-4-7`  
*Rationale:* Deep code review requiring full system context — must reason across all Phase 4-6 changes simultaneously  
If spawning an agent for this task, brief it with the full task context from this document. The agent **must** produce all required task fields §2–12: **Objective → Why Current Version Feels Amateur → Expected Visual Improvement → Files To Modify → Estimated Difficulty → Dependencies → Plugin/MCP → Command Sequence → Validation Method → Success Criteria → Impact Score.**

---

### Task 9.2 — Regression Test Suite

**Objective:** Run all 32 unit tests + 6 E2E tests. Verify bilingual functionality unaffected.

**Critical regression scenarios:**
```
1. Hero section renders correctly in EN and TH modes
2. Navbar scroll reveal triggers at correct scroll position
3. Lang toggle persists to localStorage
4. CV download link resolves
5. Mobile (375px) layout does not overflow
6. prefers-reduced-motion disables all animations (scene renders static)
7. pointer:coarse (mobile) does not load the 3D canvas
8. All section IDs present in DOM (CameraRig depends on them for ScrollTrigger targets)
```

**Plugin/MCP:** playwright  

**Command sequence:**
```bash
npm run test           # 32 unit tests
npx playwright test    # 6 E2E tests
```

**Success criteria:**
- All 32 + 6 tests pass
- No new console errors in browser
- Lighthouse performance score ≥ 85

**Impact score:** 3/10 (quality gate — ensures nothing broken)

**Agent:** `claude-sonnet-4-6`  
*Rationale:* Test runner + results interpretation — straightforward QA execution  
If spawning an agent for this task, brief it with the full task context from this document. The agent **must** produce all required task fields §2–12: **Objective → Why Current Version Feels Amateur → Expected Visual Improvement → Files To Modify → Estimated Difficulty → Dependencies → Plugin/MCP → Command Sequence → Validation Method → Success Criteria → Impact Score.**

---

### Task 9.3 — Production Readiness Report

**Objective:** Compare performance against Phase 1.1 baseline. Document remaining known issues. Ship decision.

**Before/after comparison:**
| Metric | Phase 1 Baseline | Phase 9 Target |
|--------|-----------------|----------------|
| Min FPS | Record | ≥ 55fps |
| Avg FPS | Record | ≥ 58fps |
| GPU Memory | Record | ≤ 120% of baseline |
| LCP | Record | ≤ 2.5s |
| Subject viewport % | 22% | ≥ 50% |
| Depth planes | 1 | 3+ |
| FOV range | 60° (static) | 44°–72° (8 positions) |
| Post-processing passes | 0 | 3 |

**Known limitations to document:**
```
- NodeGraph assembly animation requires CSS painting timeline — may hit 60fps on low-end hardware
- MeshPhysicalMaterial transmission adds per-node refraction cost — monitor on mobile
- Three depth-layer particle system increases GPU draw calls from 1 to 3
```

**Plugin/MCP:** chrome-devtools-mcp (lighthouse_audit + performance_analyze_insight)

**Impact score:** 3/10 (documentation — enables informed ship decision)

**Agent:** `claude-sonnet-4-6`  
*Rationale:* Metrics comparison + written production readiness report  
If spawning an agent for this task, brief it with the full task context from this document. The agent **must** produce all required task fields §2–12: **Objective → Why Current Version Feels Amateur → Expected Visual Improvement → Files To Modify → Estimated Difficulty → Dependencies → Plugin/MCP → Command Sequence → Validation Method → Success Criteria → Impact Score.**

---

## Task Priority Matrix

Ordered by (Impact × Feasibility) / Effort:

| Rank | Task | Impact | Effort | Ratio |
|------|------|--------|--------|-------|
| 1 | 2.4 — Hero crane shot | 9 | Low | 9.0 |
| 2 | 5.1 — Three-point lighting | 9 | Low | 9.0 |
| 3 | 5.4 — Post-processing | 9 | Low | 9.0 |
| 4 | 1.2 — Visual defects (headline, links, contrast) | 8 | Low | 8.0 |
| 5 | 4.1 — Remove Html DataPanels | 9 | Med | 7.5 |
| 6 | 2.1 — FOV animation | 8 | Low | 8.0 |
| 7 | 3.2 — Section-differentiated reveals | 9 | Med-High | 6.0 |
| 8 | 6.1 — Scroll progress driver | 9 | Med | 7.5 |
| 9 | 4.3 — NodeGraph (new 3D subject) | 10 | High | 5.0 |
| 10 | 3.1 — Mass-weighted hero headline | 8 | Med | 6.7 |
| 11 | 5.2 — Environment map | 7 | Low | 7.0 |
| 12 | 5.3 — MeshPhysicalMaterial | 8 | Low | 8.0 |
| 13 | 6.4 — Scene initialization | 8 | Med | 6.7 |
| 14 | 4.2 — Three-layer depth | 7 | Med | 5.8 |
| 15 | 2.2 — Per-section camera easing | 7 | Low | 7.0 |

---

## Dependency Graph

```
Phase 1 (audit — no deps)
    ↓
Phase 2.1 (FOV) ← independent
Phase 2.2 (easing) ← 2.1
Phase 2.4 (crane shot) ← 2.1
Phase 3.1–3.5 (motion system) ← independent of 3D changes
    ↓
Phase 4.1 (remove DataPanels) ← independent
Phase 4.2 (depth layers) ← 4.1
Phase 4.3 (NodeGraph) ← 4.1, 4.2, 5.1, 5.2, 5.3
Phase 4.4 (layout zones) ← 4.3
    ↓
Phase 5.1 (lighting) ← independent (improves existing geometry)
Phase 5.2 (environment) ← 5.1
Phase 5.3 (material) ← 4.3, 5.1, 5.2
Phase 5.4 (post-processing) ← 5.1, 5.2, 5.3
    ↓
Phase 6.1 (scroll progress) ← 4.3
Phase 6.2 (chapters) ← 6.1
Phase 6.3 (particle scroll-depth) ← 6.1
Phase 6.4 (initialization) ← 4.3
    ↓
Phase 7 (implementation) ← all above
Phase 8 (optimization) ← 7
Phase 9 (QA) ← 8
```

---

## Definition of Done

The refactor is complete when:

1. **The subject occupies ≥ 50% of viewport height** at the hero camera position
2. **Scroll drives object state** — the node graph assembles in response to user scroll progress
3. **Camera has 8 distinct cinematographic positions** with differentiated FOV (44°–72°), easing, and duration
4. **Post-processing pipeline active** — Bloom, Vignette, ChromaticAberration running
5. **Zero `<Html>` elements inside the Canvas**
6. **Three depth layers** are perceptually distinct — fog confirms spatial depth
7. **One irreversible wow moment** exists at scroll ~35% (the assembly reveal)
8. **All 7 sections have distinct motion personalities** (useSectionReveal variants)
9. **Hero headline renders correctly** — no word breaks, no panel overlap
10. **Performance maintained** — ≥ 55fps sustained, ≤ 2.5s LCP
11. **All 38 tests pass** (32 unit + 6 E2E)
12. **Bilingual functionality unaffected**

---

*End of master refactor plan. This document is the single source of truth for the creative technology refactor. All implementation should be traceable to a named task in this plan.*
