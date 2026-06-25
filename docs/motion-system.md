# Motion System — Goody Portfolio
**Role:** Motion Design Director  
**References:** oryzo.ai · lusion.co  
**Stack:** React Three Fiber · GSAP · CSS Modules  
**Date:** 2026-06-13

---

## Part I — Current Animation Audit

### Audit Method
Inspected live site at `localhost:3001`. Reviewed all source files: `useCinematicReveal.js`, `useMagneticTilt.js`, `CameraRig.jsx`, `BuildingWireframe.jsx`, `ParticleField.jsx`, `DataPanels.jsx`, and all eight section components. Captured screenshots at hero, about/skills, and work/contact scroll positions.

---

### 1 · Hero — Character Stagger

| Criterion | Current | Verdict |
|---|---|---|
| **Purpose** | Establish identity — headline builds letter by letter | ✓ Correct intent |
| **Timing** | `duration: 0.6`, `stagger: 0.03`, `delay: 0.3` | ✗ Uniform — every character is equal weight |
| **Weight** | `y: 40 → 0`, no mass variation | ✗ "Complex" and "Systems" have the same gravity as "Into" |
| **Anticipation** | None | ✗ Characters appear without preparation |
| **Follow-through** | None — snaps to rest | ✗ `expo.out` is crisp but mechanical |
| **Depth** | Pure vertical translation, no z-variation | ✗ The third dimension exists but does nothing here |

**Verdict:** Functional but generic. A GSAP character stagger using `expo.out` and `stagger: 0.03` is the default portfolio animation. The headline carries the entire hero's emotional weight and currently behaves like a loading spinner.

---

### 2 · NavBar — Scroll Reveal + Link Underlines

| Criterion | Current | Verdict |
|---|---|---|
| **Purpose** | Hide during hero fullscreen; reveal on scroll | ✓ Correct |
| **Timing** | `0.5s cubic-bezier(0.16, 1, 0.3, 1)` | ✓ Spring-like — the best easing on the site |
| **Weight** | All nav items appear simultaneously | ✗ Brand and links have no hierarchy relationship |
| **Anticipation** | None | ✗ Bar appears without preparing the viewer |
| **Follow-through** | The cubic-bezier approximates spring | ~ Acceptable but shallow |
| **Depth** | Flat slide from top — no blur dissolve | ✗ The glassmorphism background appears fully-formed |

**Link underlines:** `width: 0 → 100%` in `0.25s`. Competent. But a pure left-to-right line expansion has no personality. The gold line expanding under a nav item should feel like it belongs to the item — not like a progress bar.

---

### 3 · Section Reveals — `useCinematicReveal` (Seven Sections)

| Criterion | Current | Verdict |
|---|---|---|
| **Purpose** | Scroll-triggered entrance for each section | ✓ Correct intent |
| **Timing** | `duration: 0.7`, `stagger: 0.08` — identical across ALL sections | ✗ About, Experience, Skills, Work, Education, Certs, Contact all move the same |
| **Weight** | `scale: 0.85 → 1` — same scale ratio for a heading, a stat card, and a contact link | ✗ A single hook rules seven different content personalities |
| **Anticipation** | None | ✗ Sections appear immediately without build-up |
| **Follow-through** | `expo.out` — no spring, no overshoot | ✗ Content arrives, stops, done |
| **Depth** | `blur(4px) → blur(0)` is the only depth cue — it is the site's best current motion detail | ~ Worth keeping, needs to be section-specific |

**Primary Diagnosis:** One hook, seven sections, zero choreographic hierarchy. The monotony is the problem. When everything moves the same way, nothing feels intentional — the viewer's brain stops tracking the motion entirely. Premium motion design (Oryzo, Lusion) treats each section as a distinct scene. The Skills section should feel taxonomic; the Contact section should feel conclusive.

---

### 4 · Magnetic Tilt — `useMagneticTilt` (Cards + Tags)

| Criterion | Current | Verdict |
|---|---|---|
| **Purpose** | Tactile interaction — cards respond to pointer like physical objects | ✓ Correct, well-motivated |
| **Timing** | Enter: instant raw transform. Leave: `0.6s elastic.out(1, 0.5)` | ✗ Asymmetry is correct but wrong direction — the snap-in should have ease too |
| **Weight** | `±8deg` max tilt — same for stats cards (small) and work cards (large) | ✗ Large surface area should tilt less, not the same |
| **Anticipation** | None — card immediately tilts when cursor enters bounding box | ✗ Entering the hover zone should warm up slightly |
| **Follow-through** | Elastic on leave is the **best animation currently on the site** | ✓ Keep and strengthen |
| **Depth** | `perspective(600px)` — too tight for large cards, creates distortion | ✗ Should scale with element size |

---

### 5 · 3D Scene — Building Wireframe

| Criterion | Current | Verdict |
|---|---|---|
| **Purpose** | Architectural metaphor — "systems thinking" + brand gold | ✓ Strong conceptual anchor |
| **Timing** | Node pulse: `sin(t * 1.5)` ≈ 4.2s period | ✗ Mechanical sine wave — industrial, not refined |
| **Weight** | `amplitude: ±0.15` (15% scale swing) — all 8 nodes identical | ✗ Corner nodes pulsing in lockstep at the same magnitude removes hierarchy |
| **Anticipation** | None — pulse starts immediately, no awakening sequence | ✗ Building should initialize — come online |
| **Follow-through** | Sine wave is symmetrical — rise equals fall | ✗ Natural objects decelerate out of peaks; this does not |
| **Depth** | Floor grid is static, wireframe is static, only nodes animate | ✗ The building feels like a diagram, not a structure |

---

### 6 · 3D Scene — Camera Rig (8 Keyframes)

| Criterion | Current | Verdict |
|---|---|---|
| **Purpose** | Orbit the wireframe as user scrolls through sections — narrative motion | ✓ Ambitious, correct strategy |
| **Timing** | `duration: 1.8, ease: power2.inOut` — same for all 8 transitions | ✗ KF3→KF4 (wide pullback to left-orbit) needs different timing than KF1→KF2 (subtle shift) |
| **Weight** | All keyframe moves carry equal cinematic weight | ✗ Major revelations (Skills wide pullback) and micro-adjustments (About→Experience) feel the same |
| **Anticipation** | None — camera starts moving on `onEnter` immediately | ✗ A 1-frame lead easing-in would read as intent, not reaction |
| **Follow-through** | `power2.inOut` — decelerates to exact stop | ✗ Camera overshooting 5% and settling back reads as physical mass |
| **Depth** | Camera path is functional but narratively arbitrary | ✗ KF5 drops to y=0 — it reads as the camera falling, not descending with purpose |

**The camera should tell the story of the portfolio.** Right now it orbits. It should interpret — pushing in when content is concentrated (About, Contact), pulling back when content is expansive (Skills, Work overview).

---

### 7 · 3D Scene — Particle Field

| Criterion | Current | Verdict |
|---|---|---|
| **Purpose** | Atmosphere, depth, and cursor interactivity | ✓ Correct |
| **Timing** | Drift speeds `0.2–0.7 rad/s` — ambient, unrushed | ✓ Appropriate for luxury feel |
| **Weight** | 120 particles, uniform density, no scroll-depth variation | ✗ The field never changes density — intro and outro feel identical |
| **Anticipation** | Particles appear fully-formed immediately | ✗ No spawn sequence — no "awakening" |
| **Follow-through** | Cursor vortex uses inverse-square physics — pulls strongly close, fades far | ✓ The best physics-based motion on the site |
| **Depth** | Particles distributed in a flat 10×8×6 volume — z-range is too shallow relative to xy | ✗ Depth field is weak — all particles feel on the same plane |

---

### 8 · 3D Scene — Data Panels (Float)

| Criterion | Current | Verdict |
|---|---|---|
| **Purpose** | Display key stats as floating HUD elements in 3D space | ✓ Intent is right |
| **Timing** | `Float speed: 1.5` | ✗ Too fast — panels feel anxious, not weightless |
| **Weight** | `rotationIntensity: 0` — panels are perfectly flat | ✗ A panel floating in 3D space should have micro-tilt responding to camera angle |
| **Anticipation** | All four panels appear simultaneously at page load | ✗ No staggered introduction — they just exist |
| **Follow-through** | `floatIntensity: 0.3` — subtle vertical bob | ~ The bob is too fast and not differentiated between panels |
| **Depth** | All panels at z=0 — same depth plane | ✗ Four panels at the exact same z-depth flattens the spatial composition |

---

### Summary of Core Problems

1. **Choreographic monotony** — one hook, seven sections, zero personality variation
2. **No anticipation anywhere** — nothing on the site prepares for its motion; this is the primary tell of generic animation
3. **No exit animations** — content disappears on scroll-up without ceremony
4. **Camera path is functional, not narrative** — it orbits; it should interpret
5. **Building initialization is missing** — the 3D world appears fully active; it should wake up
6. **Particles lack scroll-depth response** — density, color temperature, and drift speed should vary by section
7. **Data panels break the 3D illusion** — HTML at a single z-plane with zero rotation defeats the depth model
8. **Hero stagger is mass-blind** — key structural words carry the same weight as articles and prepositions
9. **Tilt enters instantly, leaves elegantly** — the spring is backwards; entering a card should ease in
10. **No scroll progress feedback** — the ambient environment does not respond to how deep into the page the user is

---

## Part II — Motion Design Principles

### Identity
The portfolio's motion language expresses: **Analytical Precision meets Cultural Refinement.**  
Analytical = clean trajectories, deliberate timing, purposeful paths.  
Refined = elastic follow-through, breathing golds, nothing mechanical, slow is powerful.

### The Tempo Map
Every animation duration derives from a single base unit of **100ms**.

| Name | Duration | Use |
|---|---|---|
| Whisper | 200ms | Micro-feedback: hover state changes, toggle state |
| Phrase | 400ms | Standard interaction: button press, link hover |
| Sentence | 700ms | Content entrance: headings, paragraphs |
| Passage | 1200ms | Scene entrance: sections, major reveals |
| Chapter | 1800ms | Camera moves, hero build |
| Silence | — | Deliberate pause between cascading sequences |

Premium motion creates tension through **contrast in tempo** — a 200ms whisper followed by a 1800ms camera drift communicates more than two 700ms animations in sequence.

### The Easing Library
Replace all instances of `expo.out` with these purpose-built curves:

| Name | Curve | Use |
|---|---|---|
| **Reveal** | `cubic-bezier(0.16, 1, 0.3, 1)` | Content entering — strong spring-feel, overshoot |
| **Settle** | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Objects landing — mild spring, natural deceleration |
| **Cinematic** | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | Camera — sinusoidal, organic, no overshoot |
| **Whisper** | `cubic-bezier(0.0, 0.0, 0.2, 1)` | Fast-out, for micro-interactions |
| **Breathe** | `cubic-bezier(0.37, 0, 0.63, 1)` | Ambient loops — symmetrical sine, for background elements |

### Three Laws of This Motion Language
1. **Mass earns timing** — heavier elements move slower. A section heading takes longer than a skill tag.
2. **Depth earns blur** — elements further from the viewer blur more on entrance; closer elements are sharp.
3. **Stillness is earned** — the most important element on screen should be the last to stop moving.

---

## Part III — Section-by-Section Motion Direction

---

### NavBar

**Entrance animation**  
The bar does not appear as one unit. It decomposes into layers that sequence:  
1. The glassmorphism backdrop materializes — blur grows from `0 → 20px`, opacity `0 → 0.88`, duration: **400ms**, Cinematic ease.  
2. The brand name `Goody.` fades and slides from `x: -16px, opacity: 0` — duration: **500ms**, Reveal ease. Delay: 100ms after backdrop.  
3. Nav links cascade right-to-left — each link from `y: -8px, opacity: 0`, stagger: **60ms** per link (rightmost appears first, leftmost last), duration: **400ms**, Whisper ease.  
4. The gold bottom border grows from center outward — `scaleX: 0 → 1`, transform-origin: center, duration: **600ms**, Settle ease. Delay: 200ms.

The total entrance reads as: backdrop → identity → navigation → confirmation. Each layer has a clear semantic role.

**Exit animation**  
On scroll back above 55vh: reverse — links fade before brand, backdrop dissolves last. Duration halved (200ms each). The exit is faster than the entrance — the viewer already knows the nav exists.

**Scroll animation**  
Sticky — no scroll motion. The bar is fixed infrastructure.

**Object animation (link hover)**  
Replace the plain underline expansion. New behavior:  
- A 4px gold circle appears at the left edge of the link text — scale from 0, duration: **100ms**, Settle ease.  
- The underline line draws rightward from that circle — `width: 0 → 100%`, duration: **200ms**, Whisper ease, beginning 50ms after the dot appears.  
- The link text color shifts to `warm-white` — duration: **200ms**.  
- On leave: line retracts left-to-right (same direction it drew), then dot shrinks. The dot is the memory — it arrives first and leaves last.

**Camera animation**  
None. NavBar is a 2D overlay.

---

### Hero Section

**Entrance animation**  
The build sequence has five acts that flow without pause:

*Act I — The Role Label* (0ms)  
`letter-spacing: 0.48em → 0.28em` while `opacity: 0 → 1`. Duration: **600ms**, Cinematic ease. The contracting spacing creates a "focusing" sensation — text gathering itself.

*Act II — Line 1: "Turning Complex Systems"* (delay: 200ms)  
Character stagger, but **mass-weighted** — not uniform. Words are grouped: high-mass words ("Complex", "Systems") animate from `y: 80px`, low-mass words ("Turning", "Into") from `y: 35px`. Stagger: **0.022s** per character. Duration per char: **0.75s**, Reveal ease. The headline feels like it has gravitational hierarchy — the important words arrive with more effort.

*Act III — Line 2: "Into Measurable Impact"* (delay: 400ms after last char of Line 1)  
Same mass-weighted stagger. "Impact" — the final word — uses `y: 100px` and `duration: 0.9s` — it lands with maximum weight. The word "Impact" is the heaviest object in the entire hero.

*Act IV — Name + Divider* (delay: 150ms after "Impact" completes)  
Name fades and rises: `y: 14px, opacity: 0 → 1`, duration: **500ms**, Settle ease (mild spring).  
Divider: width draws from `0 → 2.5rem`, duration: **400ms**, Whisper ease, starting 80ms after name.

*Act V — Bio + CTAs + Scroll Hint* (staggered cascade)  
Bio text: three lines fade in with `y: 10px` offset, stagger: **120ms** per line, duration: **600ms**, Cinematic ease.  
Primary CTA: `scale: 0.92, opacity: 0 → 1`, duration: **500ms**, Settle ease (spring overshoot).  
Secondary CTA: same, delay: **100ms** after primary.  
Scroll hint: fades in last, then begins its infinite pulse loop.

**Exit animation**  
As the user scrolls past the hero, content layers exit at different parallax rates, creating perceived depth through velocity difference:  
- Role label and bio: `translateY(-30px)` while opacity fades to 0 — rate: 0.35  
- Headline: `translateY(-15px)` — rate: 0.15 (heavier — barely moves)  
- CTAs: `translateY(-50px)` — rate: 0.5 (lighter — moves quickly)  
- Scroll hint: `opacity → 0` immediately at first scroll event  
The 3D scene remains fixed — the hero text dissolves into it.

**Scroll animation**  
Parallax rates as described above. The differential between headline (slow) and CTAs (fast) creates the sensation of the headline being anchored, substantial, permanent.

**Object animation**  
CTA primary button: on hover, `translateY(-2px)` + gold glow expands. On click, brief `scale: 0.97` then `scale: 1.02` spring-back — a press impulse.  
CTA secondary button: on hover, border color warms to gold and background takes on a `rgba(gold, 0.06)` wash. No lift — secondary is lower-energy.

**Camera animation**  
KF0: `position [0, 6, 12]` looking at origin.  
On page load, camera does not start at KF0 — it arrives at KF0. It begins at `[0, 8, 16]` (further back, higher) and eases into KF0 over **2400ms**, Cinematic ease. This gives the scene an establishing shot quality — pulling into focus.  
During hero scroll, camera begins the transition to KF1 but only completes 30% of it — a suggestion of orbit rather than a cut.

---

### About Section

**Entrance animation**  
*Heading:* Split by word. Each word from `y: 36px, opacity: 0`. Stagger: **0.07s** per word. Duration: **650ms**, Reveal ease. This is slower than the hero (intentional — the user has arrived, there is no urgency).

*Bio paragraphs:* Each paragraph from `x: -18px, opacity: 0`. Stagger: **180ms** per paragraph. Duration: **700ms**, Cinematic ease. The lateral entrance (from left) matches reading direction — text arrives as it would be written.

*Stat cards:* Diagonal cascade — top-left card enters first, bottom-right last. Each card from `y: 55px, rotateX(12deg), opacity: 0`. Stagger: diagonal order (TL → TR → BL → BR). Duration: **800ms**, Settle ease. The rotateX on entrance creates the illusion of cards falling flat onto a table surface.

**Exit animation**  
Section drifts upward: `y: -20px, opacity: 0.6` as it leaves viewport. Duration: **500ms**, Cinematic ease. The exit is gentle — the viewer is moving on, not leaving.

**Scroll animation**  
Stat cards have micro-parallax: bottom row moves 10% slower than top row during scroll-through, reinforcing the sense of depth across the grid.

**Object animation (stat cards)**  
*Hover enter:* GSAP eases to tilt position over **120ms** (not instantly). The card "notices" the cursor rather than snapping to attention.  
*Tilt range:* `±10deg` for stats cards (slightly more expressive than current `±8deg`).  
*During hover:* A soft inner glow appears — `box-shadow: inset 0 0 20px rgba(gold, 0.08)`.  
*Hover leave:* Keep `elastic.out(1.2, 0.4)` — the best animation on the site. Strengthen it slightly.

**Camera animation**  
KF1: `position [2, 3, 9]` — moved slightly right and closer. The camera observes the wireframe from a human-level angle, as if the viewer and the building are colleagues.  
Transition from KF0: duration **1800ms**, Cinematic ease. The camera descends from its high establishing position to a conversational level.

---

### Experience Section

**Entrance animation**  
*Tag:* Fade + letter-spacing contract (same pattern as hero role label, duration: **400ms**).

*Heading:* "Roles" — 5 characters stagger char-by-char at **0.04s**, fast, strong spring. "That Shaped the Method" — word-by-word stagger at **0.12s**, slower, Cinematic ease. The split tempo communicates: the label is quick (a caption), the meaning is deliberate (a statement).

*Timeline roles:* Each role card enters from `x: -40px, opacity: 0`. Stagger: **200ms** per role (significant gap — each role is a chapter, not a list item). Duration: **700ms**, Cinematic ease.  
Within each card: the period/year label appears **80ms before** the title. Time is shown before role — the timeline gives chronological context first.  
The gold timeline dot for each role scales from `0 → 1` on entrance, then emits a brief glow ring: `box-shadow` expands from `0 → 12px` and fades — a single pulse, not a loop. Arrival, not presence.

**Exit animation**  
Role cards translate `y: -15px` with `opacity: 0.7` as section exits — a gentle recession.

**Scroll animation**  
The timeline's vertical line draws in real-time as the user scrolls through the section. As each role comes into view, the line "reaches" that dot before the card animates — the line traces the journey, the card reveals the destination.

**Object animation**  
No magnetic tilt for experience roles — these are chronological facts, not interactive objects. Hovering a role card: the left gold border brightens from `rgba(gold, 0.4)` to `rgba(gold, 1.0)`. A subtle text-color shift to `warm-white`. The border is the interaction surface.

**Camera animation**  
KF2: `position [5, 3, 9]` — elevated, shifted right. This is an architectural overview angle — the camera "knows the whole building." Matches the Experience content: context of full systems delivery.  
Transition: **1800ms**, Cinematic ease.

---

### Skills Section

**Entrance animation**  
*Heading:* Per-word stagger, **0.09s**, strong Reveal ease — the heading lands with authority.

*Category headers* (ERP & Implementation, Business Analysis, etc.):  
Each from `x: -14px, opacity: 0`, stagger: **220ms** per category. Duration: **600ms**, Cinematic ease.  
The category header is followed by its tag cloud **150ms later** — header announces, tags populate.

*Tag clouds:* Tags within each category burst in together — internal stagger **0.04s** per tag, but all tags in the same category start at the same moment (category-synchronized). This reads as categorical structure — a burst per category rather than a single river of tags.  
Individual tags: `y: 16px, scale: 0.88, opacity: 0`. Duration: **500ms**, Settle ease.

**Exit animation**  
Tags fade in reverse — last category first, as if the taxonomy is being packed away. Duration: **400ms**.

**Scroll animation**  
At the Skills section, the camera has pulled to its widest position (KF3). On scrolling deeper into Skills, tags in the bottom categories should have a slight parallax downward — reinforcing that the content has depth and breadth.

**Object animation (skill tags)**  
*Hover:* Tag scales to `1.04`, gold glow appears (`box-shadow: 0 0 12px rgba(gold, 0.3)`), text warms to gold. Duration: **200ms**, Whisper ease.  
*Leave:* Returns to rest with **300ms** Settle ease.  
No magnetic tilt for tags — they are too small. The hover state should feel like a button acknowledgment, not a physical object.

**Camera animation**  
KF3: `position [0, 7, 13]` — direct overhead-pull-back. The widest, highest camera position on the entire journey. This is the "map view" — all possibilities visible, no one thing emphasized.  
Transition: The largest single camera move in the sequence. Duration: **2200ms** (break from the standard 1800ms), Cinematic ease. The viewer should feel the space opening.

---

### Work Section

**Entrance animation**  
*Heading:* Per-word, **0.08s** stagger, Reveal ease.

*Project cards:* "Cards falling onto the table." Each card from `y: 60px, rotateX(10deg), opacity: 0`. Stagger: **140ms** per card. Duration: **850ms**, Settle ease (spring on arrival).  
Each card's pills/tags: fade in **100ms after** the card lands — the card surface appears first, then its contents populate.  
The disabled CTA link: last to appear within each card, **60ms** after tags.

**Exit animation**  
Cards exit at differentiated parallax rates: left column exits faster than right column (or top row faster than bottom row). The differential should be ~15% speed variation — subtle but creates a sense that the cards exist at different depths.

**Scroll animation**  
During scroll-through, the grid has depth-layered parallax — each card subtly at a different z-plane based on its position.

**Object animation (project cards)**  
*Hover enter:* GSAP eases to tilt over **100ms**. Perspective: **900px** (wider than current 600px — less distortion on large cards). Max tilt: **±12deg** (heavier than stat cards).  
*During hover:* Gold inset border glow — `box-shadow: inset 0 0 0 1px rgba(gold, 0.4)`. The CTA `translateX(6px)` — a directional invitation.  
*Leave:* Elastic return, `elastic.out(1.3, 0.35)` — stronger spring than stats cards, proportional to their larger mass.

**Camera animation**  
KF4: `position [-3, 2, 9]` — orbits left. Camera positions itself on the opposite side from Skills — the Work section earns a unique vantage point.  
Transition: **1800ms**, Cinematic ease.

---

### Education Section

**Entrance animation**  
*Heading:* Word-by-word, **0.13s** stagger — deliberately slower than Skills and Work. The viewer has seen a lot; this pacing respects the depth of the content.

*Education entries:* Enter from `x: 36px, opacity: 0` — sliding from the right (unlike Experience which entered from the left). The directionality mirrors the content: Experience is chronological forward-travel (left-to-right), Education is foundational lookback (right arrival, as if from a different origin).  
Stagger: **180ms** per entry. Duration: **700ms**, Cinematic ease.

**Exit animation**  
Entries translate `y: -10px, opacity: 0.7` — minimal exit, this section is a foundation not a stage.

**Scroll animation**  
No parallax — Education should feel stable, grounded.

**Object animation**  
No tilt. Institutional entries are not interactive surfaces.  
Hover on an education entry: the institution name brightens to gold. Duration: **200ms**, Whisper ease.

**Camera animation**  
KF5: `position [3, 0, 8]` — ground-level side angle. Currently labeled "side angle" but currently drops to y=0 which reads as falling. Revise semantic intent: this is the camera crouching to look up at the structure — a perspective that implies the building's height was built over years.  
Transition: **1600ms**, Cinematic ease. This move is intentionally subdued — Education is quiet confidence.

---

### Certifications Section

**Entrance animation**  
*Heading:* Per-word, **0.09s** stagger, Reveal ease — aligned with Skills pacing (certifications are applied skills).

*Cert badges:* Dramatic stagger — each badge scales from `0, opacity: 0` with **Settle ease** (spring overshoot). Row-by-row entrance: all badges in row 1 start simultaneously (with internal stagger **0.06s**), then row 2 begins **120ms** after row 1 starts. This creates a visual "filling" of the grid from top to bottom.  
Provider label: fades in **50ms after** its badge.  
Status pill ("Certified" / "On-Process"): fades in last, **80ms after** label.

**Exit animation**  
Badges scale down slightly `(0.97)` and fade as section exits.

**Scroll animation**  
Camera orbits furthest right here (KF6) — the journey of the camera mirrors having traveled all the way around the building.

**Object animation (cert badges)**  
*Hover:* Scale to `1.06`, gold glow, and a shine sweep — a pseudo-element with a `linear-gradient(105deg, transparent, rgba(255,255,255,0.06), transparent)` translates from left to right across the badge in **400ms**. The shine happens once on hover entry (not on loop). It communicates achievement.  
*Leave:* Scale back to `1.0`, glow fades, duration: **300ms**, Settle ease.

**Camera animation**  
KF6: `position [7, 2, 7]` — furthest right orbit. The camera has traveled from center (Hero), moved slightly right (About), elevated (Experience), wide-back (Skills), left (Work), down-side (Education), and now far-right (Certs). The journey has orbited the building.  
Transition: **1800ms**, Cinematic ease.

---

### Contact Section

**Entrance animation**  
This is the conclusion. The pacing should be the slowest in the entire page.

*Heading:* "Ready to Build Something Together?" — word-by-word stagger at **0.15s** per word. Duration per word: **900ms**, Reveal ease. "Together?" — the final word — has an additional 100ms overshoot spring on arrival. The question mark is the last character to settle.

*Description paragraph:* Fade in as single block (no split), `y: 14px, opacity: 0`, duration: **800ms**, Cinematic ease. Delay: **400ms** after heading completes.

*Contact links (email, LinkedIn, CV):* Stagger from `y: 20px, opacity: 0`, stagger: **200ms** per link, duration: **700ms**, Settle ease. The email arrives first — most direct. LinkedIn second — social proof. CV last — the ask.

*Footer:* Fades in last, **0.8s**, Cinematic ease.

**Exit animation**  
None — this is the terminus. The page ends here.

**Scroll animation**  
At the Contact section, a full-page vignette darkens slightly — ambient darkness closing in, like a cinema screen before credits.

**Object animation (contact links)**  
*Hover:* The link text underline draws (same dot-to-line pattern as NavBar links). The link gets a `translateX(6px)` nudge — a directional indication that this link goes somewhere.  
*Leave:* Underline retracts, position springs back.

**Camera animation**  
KF7: `position [1, 1, 7]` — close, centered, slightly low. The camera returns near the origin but lower — looking up at the building from close proximity. The building is now understood; the viewer is inside the work.  
Transition from KF6: **2000ms** — the longest transition at the end, deliberately. The camera's slowest, most deliberate move is its last.  
**Scene finale:** As KF7 settles, building wireframe nodes reduce their pulse amplitude from `±0.15` to `±0.04` over **3000ms** — the structure "resting." Particle drift speed reduces by 40% at this scroll position. The scene quiets.

---

## Part IV — 3D Scene Ambient System

### Building Initialization Sequence
The building should not appear fully-active at page load. It should wake up.

**Phase 1 — Materialization (0–800ms):**  
Wireframe edges draw in — `lineDashOffset` animates from full-invisible to visible, traveling around the box geometry. The wireframe appears to be constructed edge-by-edge.

**Phase 2 — Node Activation (600–1400ms):**  
Corner nodes scale from 0 with stagger — bottom four first (400ms), then top four (400ms delay). The building "stands up" from its base.

**Phase 3 — Data Panel Entry (1000–2000ms):**  
Each panel materializes with stagger — `opacity: 0 → 1`, `Float` begins only after each panel is visible. Stagger: **200ms** per panel.

**Phase 4 — Particle Spawn (800–2400ms):**  
Particles spawn progressively — a `uSpawnProgress` uniform goes from 0 to 1 over 1600ms. Particles below their spawn threshold are invisible. The field fills in as if assembling.

---

### Particle Field — Scroll-Depth Variation
The particle field should respond to scroll depth as a second ambient layer:

| Scroll Region | Density | Drift Speed | Glow Radius |
|---|---|---|---|
| Hero | Full (120) | 1.0× | 1.0× |
| About → Skills | Expanding (+20%) | 1.1× | 1.0× |
| Work | Peak density | 0.9× (slower = heavier) | 1.2× |
| Education → Certs | Reducing | 0.8× | 0.9× |
| Contact | Minimum (40%) | 0.5× | 0.7× |

The field exhales as the viewer reaches the end. The closing quiet is earned by the journey.

---

### Camera Narrative Arc

The camera tells the story of a systems architect examining their own work:

| Keyframe | Section | Camera Meaning |
|---|---|---|
| KF0 | Hero | **The establishing shot.** Arrives from above — the full picture. |
| KF1 | About | **The introduction.** Camera descends to human level — a conversation. |
| KF2 | Experience | **The elevated view.** Steps back and up — "I can see the whole system." |
| KF3 | Skills | **The panorama.** Widest pull-back — all capabilities visible at once. |
| KF4 | Work | **The left orbit.** A new angle — "Here's what this looks like in practice." |
| KF5 | Education | **Ground level.** Looking up — the foundation supports what came after. |
| KF6 | Certs | **The far orbit.** Having traveled all the way around — full circumnavigation. |
| KF7 | Contact | **The return.** Close, centered, quiet — the camera comes home. |

---

## Part V — Global Motion Rules

### What Never Changes
- `prefers-reduced-motion: reduce` gate applies to all animations
- No animation loops on non-decorative elements
- All scroll-triggered animations fire only once (`once: true`) unless explicitly noted
- Cursor-interactive animations are gated behind `pointer: fine`

### What Should Be Consistent
- Gold glows always use `rgba(212, 160, 23, X)` — never white or blue
- Spring eases always use a positive overshoot — `elastic.out(1.X, 0.X)` with amplitude > 1
- Stagger direction always communicates reading order or spatial hierarchy (top→bottom, left→right, or diagonal TL→BR)
- Enter is always slower than exit (entry earns attention; exit is graceful release)

### Hierarchy of Motion
When multiple animations compete for attention on screen, this priority order applies:
1. Camera moves (highest dominance — they reframe the entire scene)
2. Section headings (anchor point of each section)
3. Interactive objects (respond to direct input — immediate)
4. Ambient scene (background — never competes with content)

---

## Part VI — Reference Translations

### From oryzo.ai
- **Scroll-synchronized camera**: Oryzo uses scroll progress (0–1) mapped to camera position rather than discrete `onEnter` triggers. The camera moves *with* scroll, not *on* scroll. Applied here: camera transitions should begin earlier (at `start: 'top 80%'`) and complete later (at `end: 'center center'`) — filling the scroll duration with motion rather than using it as a trigger.
- **Content hierarchy through scale**: Oryzo distinguishes primary, secondary, and tertiary content through different entrance scales. Applied here: headings at `scale: 0.9`, body text at `scale: 0.95`, decorative elements at `scale: 0.8`. Smaller starting scale = lower content tier.
- **Gold as temperature, not just color**: On oryzo.ai, warm tones intensify at points of emphasis. Applied here: the particle field's gold color temperature shifts slightly warmer (`#F0B429`) during Work and Contact — sections where the human stakes are highest.

### From lusion.co
- **Physics before choreography**: Lusion's objects move because they have mass and velocity, not because a timeline fired. Applied here: the magnetic tilt should derive from cursor velocity, not just cursor position — a fast-moving cursor creates a deeper tilt than a slow one at the same position.
- **The particle field as canvas, not backdrop**: Lusion uses particles as the primary expressive medium — the background IS the animation. Applied here: at the Contact section, the particle field should form a loose suggestion of converging toward the CTA — a directional current, not a random cloud.
- **Silence as design**: Lusion transitions frequently include frames of near-stillness before a major motion event. Applied here: the 400ms pause between hero text build and bio appearance. The 200ms gap between the final headline word and the name's arrival.

---

*End of Motion System Document.*  
*Next step: implementation plan via writing-plans skill.*
