# Cinematic Camera Storyboard
**Portfolio — feat/3d-rewrite**  
Date: 2026-06-13

---

## 1. Current System Audit

### Architecture
`CameraRig.jsx` drives all camera movement via GSAP + ScrollTrigger. Eight KEYFRAMES in `lib/keyframes.js` define a position + lookAt target per section. Each ScrollTrigger fires on `top 60%` viewport crossing, calling `tweenTo(i)` which runs two parallel GSAP tweens (position → pos, target → lookAt).

### Weaknesses

| Issue | Impact |
|---|---|
| Identical easing on all 8 transitions (`power2.inOut`, 1.8s) | Every section feels the same weight — no emotional differentiation |
| On/off trigger only (enter + enterBack) | No parallax within a section; camera is static once it arrives |
| No FOV changes | Camera has one fixed perspective (60°) regardless of narrative context |
| No continuous scroll scrub | Camera can't advance within a section, only between them |
| Incoherent distance progression | KF3 Skills (z=13) is farther than KF0 Hero (z=12), breaking the rhythm |
| KF6 Certs at x=7 | Camera orbits so far right the building likely exits the left third of frame |
| KF7 Contact "pull back" comment is wrong | z=7 is closer than z=9, not a pull-back |
| Camera target barely varies | Most sections look at (0,1,0), making the actual lookAt irrelevant |

### Current KEYFRAMES (reference)

```
KF0 Hero:       pos(0,  6, 12)  lookAt(0,0,0)
KF1 About:      pos(2,  3,  9)  lookAt(0,1,0)
KF2 Experience: pos(5,  3,  9)  lookAt(0,1,0)
KF3 Skills:     pos(0,  7, 13)  lookAt(0,0,0)
KF4 Work:       pos(-3, 2,  9)  lookAt(0,1,0)
KF5 Education:  pos(3,  0,  8)  lookAt(0,1,0)
KF6 Certs:      pos(7,  2,  7)  lookAt(0,1,0)
KF7 Contact:    pos(1,  1,  7)  lookAt(0,0,0)
FOV: 60° (fixed, never changes)
```

---

## 2. Scene Reference Frame

The 3D world contains three layers of content:

```
y = +2.5  ┌─────────────────────────────────────┐  Data Panels (float)
y = +0.5  │  [-2.5,2.5,0]        [+2.5,2.5,0]  │  y: 0.5–2.5, x: ±2.5
          │  [-2.5,0.5,0]        [+2.5,0.5,0]  │
y =  0.0  ├──────── Building top ────────────────┤  (origin / world 0)
y = -1.5  │          Building center             │  group at (0,-1.5,0)
y = -3.0  └──────── Building base ───────────────┘  BoxGeometry(2,3,2)

Particles: scattered -5→+5 x,  -4→+4 y,  -3→+3 z
```

**Looking at (0, 0, 0):** frames the building top + panels  
**Looking at (0, 1.5, 0):** frames the data panels directly  
**Looking at (0, -1.5, 0):** frames the building center  
**Looking at (0, 2, 0):** full upward shot, panels dominant  

**Camera conventions used in this document:**
- `+X` = right, `-X` = left
- `+Y` = up, `-Y` = down  
- `+Z` = toward camera (closer), `-Z` = into scene (farther)
- Azimuth angle measured from +Z axis (0° = straight front)

---

## 3. Narrative Arc

The camera tells a single story across 8 sections:

```
ENTER THE WORLD → MEET THE PERSON → TRACE THE JOURNEY → SURVEY THE TOOLKIT
→ WITNESS THE IMPACT → TOUCH THE FOUNDATION → INSPECT THE CREDENTIALS → STEP BACK, CONNECT
```

This maps to an arc of **distance** and **height**:

```
Distance:  FAR ──── CLOSE ──── MID ──── VERY FAR ──── MID ──── MID ──── CLOSE ──── MID
Height:    HIGH ─── MID ────── MID ──── VERY HIGH ─── LOW ──── BELOW ── MID ─────── MID
Easing:    EXPO    SMOOTH     FLOWING   SNAP          STEADY   EARTHY   CRISP       WARM
```

---

## 4. Design Principles

1. **Every transition tells a sentence.** Movement = emotion. Pulling back = revelation. Pushing in = intimacy. Orbiting = perspective shift.
2. **FOV is a storytelling tool.** Wide (65°+) = context and scale. Telephoto (under 50°) = precision and intensity.
3. **Parallax lives inside sections.** The camera makes micro-movements as the user scrolls through a section, not just when entering it.
4. **Easing encodes character.** Hard sections (Skills, Certs) get decisive easing. Emotional sections (About, Education) get smooth easing.
5. **The path is continuous.** Each position flows logically to the next. No jarring teleports.

---

## 5. Section-by-Section Storyboard

---

### S0 — Hero: Cinematic World Reveal

**Narrative:** You're entering a system. The world drops into view from above.

| Parameter | Value |
|---|---|
| **Camera position** | `(0, 7, 13)` |
| **Camera target** | `(0, 0, 0)` |
| **FOV** | `65°` (wide, expansive) |
| **Entry from (page load)** | `(0, 12, 18)` |
| **Scroll range trigger** | Page load → settled after 2.4s |
| **Section parallax** | `z −0.3 per 100px scrolled` (slow push toward scene) |

**Entry transition:**
```
Easing:   expo.out
Duration: 2.4s
Movement: Crane down (y: 12→7) + Dolly in (z: 18→13)
Type:     Dolly + Crane combo — "descend into the world"
```

**FOV transition:**
```
Start FOV: 70° (at page load — feels cosmic, overwhelming)
End FOV:   65° (settled — still wide, but contained)
Duration:  2.4s, ease: expo.out
Purpose:   Slight tightening as we arrive reinforces the sense of "landing"
```

**Section parallax detail:**
- As user begins scrolling away from hero, camera drifts forward (z decreases)
- Max drift: −1.5 units over the full hero scroll distance
- Effect: the approach never fully stops; the user is already moving toward the next beat

**Visual purpose:** The building wireframe appears small in the center of frame. Particles surround it. The wide FOV and high angle say: *"Here is a world of systems. You're about to enter it."*

---

### S1 — About: The Meeting

**Narrative:** The camera descends and angles right — like turning to face someone across a table.

| Parameter | Value |
|---|---|
| **Camera position** | `(1.5, 2, 9)` |
| **Camera target** | `(0, 0.5, 0)` |
| **FOV** | `58°` (narrowed — intimate, direct) |
| **Scroll trigger** | `top 65% viewport` |
| **Scroll range** | Section progress 0%→100% |
| **Section parallax** | `x +0.3 per 100px` (slow rightward drift — orbiting to face) |

**Entry transition:**
```
From:     S0 position (0, 7, 13) FOV 65°
To:       (1.5, 2, 9) FOV 58°
Easing:   power3.inOut
Duration: 1.8s
Movement: Dolly in (z: 13→9) + Crane down (y: 7→2) + Orbit right (x: 0→1.5)
Type:     Dolly + Crane + Orbit — "walking up to meet someone"
```

**Section parallax detail:**
- x drifts from 1.5 → 2.0 over full section scroll
- Gives the impression the camera is gently circling, never quite settling — attentive, curious
- The target stays fixed at (0, 0.5, 0) so the building stays centered despite camera drift

**Visual purpose:** Building is now mid-frame, filling more of the view. Data panels visible on both sides. The narrowed FOV makes this feel like a conversation — like looking at someone, not a landscape.

---

### S2 — Experience: The Timeline Sweep

**Narrative:** The camera sweeps to the right side — like unrolling a timeline horizontally.

| Parameter | Value |
|---|---|
| **Camera position** | `(7, 3, 5)` |
| **Camera target** | `(0, 1, 0)` |
| **FOV** | `55°` (telephoto — professional, compressed like a film timeline) |
| **Scroll trigger** | `top 65% viewport` |
| **Scroll range** | Section progress 0%→100% |
| **Section parallax** | `x −0.5 per 100px` (continues the orbit, past the side) |

**Entry transition:**
```
From:     S1 position (~2, 2, 9) FOV 58°
To:       (7, 3, 5) FOV 55°
Easing:   sine.inOut
Duration: 2.2s
Movement: Wide orbit right (x: 2→7, z: 9→5) — camera arcs around the subject
Type:     Orbit — "sweeping past to show the side of a building = looking at a cross-section"
```

**Orbit path detail:**
- The camera doesn't move linearly — it arcs around the building
- Intermediate position at ~50% of tween: `(5, 3, 7)` — the arc passes through this point
- Achieved by using a GSAP `motionPath` or two-step tween for the arc

**Section parallax detail:**
- As user scrolls the section, x slowly decreases from 7 → 5.5
- Effect: camera continues its orbit, like the timeline is still unrolling
- The building rotates slightly into view — past to present

**Visual purpose:** Side-on view of the building. Right data panels are now closest to camera. The telephoto compression flattens depth — like a career timeline viewed from the side. The ERP and project stats face the viewer.

---

### S3 — Skills: The Dashboard Pull-Back

**Narrative:** Rapid pull-back to reveal the full system from above. Everything visible at once.

| Parameter | Value |
|---|---|
| **Camera position** | `(0, 10, 16)` |
| **Camera target** | `(0, −0.5, 0)` |
| **FOV** | `72°` (widest — maximum context, dashboard feel) |
| **Scroll trigger** | `top 60% viewport` |
| **Scroll range** | Section progress 0%→100% |
| **Section parallax** | `x sine wave ±0.4 over section` (scanning left-right) |

**Entry transition:**
```
From:     S2 position (~5.5, 3, 5) FOV 55°
To:       (0, 10, 16) FOV 72°
Easing:   power4.out
Duration: 1.6s
Movement: Dolly out (z: 5→16) + Crane up (y: 3→10) + Orbit back to center (x: 5.5→0)
Type:     Dolly-back + Crane + Orbit center — "stepping back to see the whole board"
```

**FOV change:** 55° → 72° — the FOV widens as the camera pulls back, accentuating the pull-out effect (like a zoom-reverse dolly shot). This makes the full scene feel expansive and scannable.

**Section parallax detail:**
- Camera x oscillates: `0 + sin(sectionProgress * π) * 0.4`
- Effect: a slow pendulum sweep from center-left to center-right
- Feels like scanning a dashboard or reading a skills matrix
- Maximum x deviation is ±0.4 — subtle, not disorienting

**Visual purpose:** The entire scene is visible. Building appears smaller, framed in the lower-center. All four data panels visible. Particles fill the frame. This is the "full toolkit" view — everything is on the table.

---

### S4 — Work: The Impact Shot

**Narrative:** Camera drops low and orbits left — a dramatic low-angle shot that makes the data panels tower above.

| Parameter | Value |
|---|---|
| **Camera position** | `(−3, 0.5, 8)` |
| **Camera target** | `(0, 2, 0)` |
| **FOV** | `52°` (compressed — powerful, controlled) |
| **Scroll trigger** | `top 65% viewport` |
| **Scroll range** | Section progress 0%→100% |
| **Section parallax** | `y +0.4 per 100px` (slow upward reveal as user reads) |

**Entry transition:**
```
From:     S3 position (0, 10, 16) FOV 72°
To:       (−3, 0.5, 8) FOV 52°
Easing:   power2.inOut
Duration: 2.0s
Movement: Orbit left (x: 0→−3) + Crane down (y: 10→0.5) + Dolly in (z: 16→8)
Type:     Orbit left + Crane down + Dolly — "diving down to see the result"
```

**FOV change:** 72° → 52° — tightening as we descend and approach. Adds psychological weight.

**Section parallax detail:**
- y rises from 0.5 → 1.5 over the section (camera slowly rises)
- Target stays at (0, 2, 0), so the angle decreases as y rises — building looks slightly less towering
- Effect: as you read each project card, the scene subtly "presents" it to you with a slow upward reveal

**Visual purpose:** Low angle = authority. Looking up at the data panels = "these are results that tower above." Left offset = the building fills the right of frame, leaving room for the 2D content on the left side. The compressed FOV makes outputs feel substantial.

---

### S5 — Education: The Foundation

**Narrative:** Camera descends below the building base — looking up from the ground. Civil engineering roots.

| Parameter | Value |
|---|---|
| **Camera position** | `(0, −2.5, 8)` |
| **Camera target** | `(0, 2, 0)` |
| **FOV** | `60°` (normal — grounded, unpretentious) |
| **Scroll trigger** | `top 65% viewport` |
| **Scroll range** | Section progress 0%→100% |
| **Section parallax** | `y +0.8 per 100px` (camera rises as user reads — emergence from foundation) |

**Entry transition:**
```
From:     S4 position (−3, 0.5, 8) FOV 52°
To:       (0, −2.5, 8) FOV 60°
Easing:   power1.inOut
Duration: 2.0s
Movement: Orbit back to center (x: −3→0) + Crane down (y: 0.5→−2.5)
Type:     Crane down + Orbit center — "sinking to the foundation"
```

**This is the deepest/lowest camera position in the journey.** The building appears to rise from the ground, with panels floating above. y=−2.5 places the camera below the building's base (which sits at y=−3).

**Section parallax detail:**
- y rises from −2.5 → −0.5 over full section scroll
- Target stays at (0, 2, 0)
- Effect: camera slowly rises from below ground level — "emerging" from the foundation
- As y rises, the angle of looking-up decreases — the building becomes less overwhelming, more familiar
- Metaphor: the foundation gave you the tools to rise

**Visual purpose:** The building towers above, filling the top of frame. The low angle echoes architectural photography of construction sites. Looking up from below = respect for foundations. The section content (degree, GPA, award) appears over a scene that literally shows structural foundations.

---

### S6 — Certifications: The Precision Focus

**Narrative:** Camera rises, orbits right, and zooms tight — focusing on a single panel like examining a credential under light.

| Parameter | Value |
|---|---|
| **Camera position** | `(3, 2.2, 5.5)` |
| **Camera target** | `(2.5, 2, 0)` |
| **FOV** | `44°` (telephoto — detail-oriented, precision instrument) |
| **Scroll trigger** | `top 60% viewport` |
| **Scroll range** | Section progress 0%→100% |
| **Section parallax** | `y sine oscillation ±0.15 over section` (scanning the panel top-to-bottom) |

**Entry transition:**
```
From:     S5 position (0, ~−0.5, 8) FOV 60°   [after parallax rise]
To:       (3, 2.2, 5.5) FOV 44°
Easing:   power3.out
Duration: 1.4s   ← faster, snaps to attention
Movement: Orbit right (x: 0→3) + Crane up (y: −0.5→2.2) + Dolly in (z: 8→5.5)
Type:     Orbit right + Crane up + Dolly — "rising to face the credential"
```

**FOV change:** 60° → 44° — the tightest FOV in the journey. Camera is also closest to a specific target. The combination of close distance + narrow FOV = telephoto compression = everything looks sharp and precisely framed.

**Section parallax detail:**
- y oscillates: `2.2 + sin(sectionProgress * π) * 0.15`
- Camera gently scans up-and-back-down on the panel
- Mimics the act of reading a certificate carefully

**Visual purpose:** The right-side data panel (Google Data Analytics, IBM Data Engineering) fills the frame. The building is in the background, slightly out of focus (if DOF post-processing is added). This section is about detail, accuracy, and credentials — the tightest frame reinforces that.

---

### S7 — Contact: The Open Horizon

**Narrative:** Camera pulls back, rises slightly, and centers — opening the composition to signal readiness and balance.

| Parameter | Value |
|---|---|
| **Camera position** | `(0, 3.5, 11)` |
| **Camera target** | `(0, 0.5, 0)` |
| **FOV** | `64°` (open, welcoming — slightly wider than telephoto) |
| **Scroll trigger** | `top 65% viewport` |
| **Section parallax** | Cursor-responsive micro-orbit (x ±0.5 with cursor X position) |

**Entry transition:**
```
From:     S6 position (3, 2.2, 5.5) FOV 44°
To:       (0, 3.5, 11) FOV 64°
Easing:   power2.out
Duration: 2.4s   ← slowest/most relaxed transition
Movement: Orbit back to center (x: 3→0) + Crane up (y: 2.2→3.5) + Dolly out (z: 5.5→11)
Type:     Orbit center + Crane + Dolly-back — "stepping back to invite"
```

**FOV change:** 44° → 64° — the widening is the most dramatic FOV change in the entire journey. After the tight Certs precision, the sudden opening of the frame communicates release, openness, possibility.

**Section parallax detail (cursor-responsive):**
- `camera.x = 0 + (cursorNormalizedX * 0.5)` — maps cursor X to camera X offset ±0.5
- `camera.y = 3.5 + (cursorNormalizedY * −0.3)` — subtle vertical reaction to cursor
- The scene responds to the visitor's mouse — the world turns to face them
- This is the "invitation" — the scene actively engages

**Visual purpose:** Full building + all four data panels visible in balanced frame. Centered composition = stability, completion. The cursor parallax makes the scene feel alive and responsive — appropriate for the one section asking the visitor to act.

---

## 6. Full Storyboard Summary

| # | Section | Position | Target | FOV | Duration | Easing | Movement Types |
|---|---|---|---|---|---|---|---|
| 0 | **Hero** | (0, 7, 13) | (0, 0, 0) | 65° | 2.4s | expo.out | Dolly-in, Crane-down |
| 1 | **About** | (1.5, 2, 9) | (0, 0.5, 0) | 58° | 1.8s | power3.inOut | Dolly-in, Crane-down, Orbit-right |
| 2 | **Experience** | (7, 3, 5) | (0, 1, 0) | 55° | 2.2s | sine.inOut | Orbit-right (arc) |
| 3 | **Skills** | (0, 10, 16) | (0, −0.5, 0) | 72° | 1.6s | power4.out | Dolly-back, Crane-up, Orbit-center |
| 4 | **Work** | (−3, 0.5, 8) | (0, 2, 0) | 52° | 2.0s | power2.inOut | Orbit-left, Crane-down, Dolly-in |
| 5 | **Education** | (0, −2.5, 8) | (0, 2, 0) | 60° | 2.0s | power1.inOut | Crane-down, Orbit-center |
| 6 | **Certs** | (3, 2.2, 5.5) | (2.5, 2, 0) | 44° | 1.4s | power3.out | Orbit-right, Crane-up, Dolly-in |
| 7 | **Contact** | (0, 3.5, 11) | (0, 0.5, 0) | 64° | 2.4s | power2.out | Orbit-center, Crane-up, Dolly-back |

---

## 7. Transition Curves Reference

| Easing | Character | Sections Used |
|---|---|---|
| `expo.out` | Explosive energy that instantly decelerates — dramatic reveal | Hero load |
| `power4.out` | Fast snap that locks into place — "board just updated" | Skills |
| `power3.out` | Sharp arrival, clean stop — professional decisiveness | Certs |
| `power3.inOut` | Smooth through the middle, controlled start and end — personal, considered | About |
| `power2.inOut` | Balanced, neutral — confident professional movement | Work |
| `power2.out` | Warm deceleration — landing softly | Contact |
| `sine.inOut` | Equal ease in and out — flowing, time-lapse feel | Experience |
| `power1.inOut` | Linear-ish, slow and deliberate — earthen, grounded | Education |

---

## 8. Parallax Delta Map

Each section's in-section micro-movement, expressed as camera offset per full section scroll:

| Section | Axis | Behavior | Max Offset |
|---|---|---|---|
| Hero | z | Slow push forward | −1.5 |
| About | x | Rightward drift (orbiting) | +0.5 |
| Experience | x | Continue orbit past side | −1.5 |
| Skills | x | Left-right pendulum scan | ±0.4 (sine) |
| Work | y | Slow upward reveal | +1.0 |
| Education | y | Rise from foundation | +2.0 |
| Certs | y | Top-to-bottom panel scan | ±0.15 (sine) |
| Contact | x, y | Cursor-responsive orbit | ±0.5 x, ±0.3 y |

---

## 9. FOV Arc

FOV changes serve as "focus transitions" — compressing or opening the viewer's perspective to match emotional context:

```
65°                                                            64°
 │            58°    55°                                  ↑
 │                                        60°           /
 │                          72°        /      ↓       /
 │                         ╱  ╲     /             52°
 │                        ╱    ╲  /                  ╲  44°
 │                       ╱      ╲                     ╲  ╲
HERO → ABOUT → EXPERIENCE → SKILLS → WORK → EDUCATION → CERTS → CONTACT
 ↑           ↓            ↑        ↓↓↓         ↑↑          ↓↓         ↑
WIDE       NARROW        NARROW   WIDEST     NARROWING   RETURNS   TIGHTEST  OPENS
```

- **72° Skills** is the widest moment — everything visible, scanning the full toolkit
- **44° Certs** is the tightest moment — maximum precision, credentials under glass
- The FOV arc creates a macro rhythm of "open → compress → open → compress → open"

---

## 10. Implementation Notes

### CameraRig changes required

1. **Add `fov` property to each KEYFRAME** — GSAP tween `camera.fov` then call `camera.updateProjectionMatrix()` after each frame
2. **Replace discrete ScrollTrigger (enter/leave) with scrub-enabled triggers** — `scrub: true` for in-section parallax
3. **Two-phase tween for Experience orbit** — use a GSAP `motionPath` or two sequential tweens to arc around the building rather than moving linearly
4. **Cursor-responsive parallax for Contact** — on `mousemove`, apply a lerped offset to camera.x and camera.y on top of the keyframe position
5. **Separate GSAP timeline for page-load Hero descent** — this fires once on mount, not on scroll
6. **Reduce motion compliance** — all parallax and FOV changes should respect `prefers-reduced-motion`

### ScrollTrigger architecture

Replace current `onEnter`/`onEnterBack` pattern with:
```
Section entry trigger:  start: "top 65%", end: "bottom 35%"
  → fires tweenTo(i) with section-specific easing + duration + FOV
Scrub trigger (nested): start: "top 80%", end: "bottom 20%", scrub: 1
  → drives in-section parallax offsets on top of the keyframe position
```

### Performance considerations

- FOV changes require `camera.updateProjectionMatrix()` every frame during tween — GSAP `onUpdate` callback
- Cursor parallax for Contact should lerp with factor ~0.05 (smooth) not snap
- Scrub triggers and tween triggers should not conflict — use separate GSAP contexts

---

*End of storyboard. Implementation plan to follow.*
