# igloo.inc — Reverse Engineering Reference
> Analyzed: 2026-06-03 | Purpose: Inspiration for portfolio redesign

## The Core Idea

**Everything is rendered inside a single WebGL canvas. There is no HTML UI.**
Text, buttons, icons, numbers — all rendered via Three.js shaders.
The DOM has exactly 4 elements total. Zero CSS layouts. Zero DOM text nodes.

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | **Svelte** | Compiled, ~6KB runtime. Minimal overhead for canvas apps. |
| Build tool | **Vite** | Hashed chunks, code splitting, module preloading |
| 3D engine | **Three.js v165** | Full scene graph, materials, raycasting |
| Geometry compression | **Google Draco** (.drc via WASM) | Reduces mesh size by ~10x |
| Texture format | **KTX2 + Basis Universal** (via WASM) | Transcodes to optimal GPU format per device |
| Font rendering | **MSDF** in WebGL | Resolution-independent text inside Three.js |
| Audio | **Web Audio API** (off-thread Worker) | Spatial audio, 17 OGG tracks |
| Debug UI | **Tweakpane** | CSS present in bundle — accessible in dev mode |
| Font | **IBM Plex Mono** (Medium + Regular) | Self-hosted, no Google Fonts |

---

## DOM Structure (The Entire Page)

```html
<html class="en desktop mac chrome">   ← device/browser detected at load
<body>
  <div id="app">
    <div id="webgl">
      <div></div>   ← Three.js injects <canvas> here
    </div>
  </div>
</body>
```

Native scroll is completely **killed**:
```css
html, html body {
  overflow: hidden;
  touch-action: none;
}
```
Scroll wheel / touch → custom JS handler → drives a `float` uniform into shaders.

---

## JavaScript Bundle Layout

```
index-2eb69c09.js     6KB   ← Svelte shell + lazy-loads App3D
App3D-f554a111.js   413KB   ← Entire Three.js scene (monolithic)
audioworker.js       77KB   ← Web Audio off main thread
exrworker.js         28KB   ← HDR/EXR texture decoder
msdfworker.js         2KB   ← MSDF font atlas generator
bitmapworker.js       1KB   ← Off-thread bitmap decode
```

---

## 3D Scene Architecture

Two distinct scenes driven by a state machine:

### Scene 1 — Igloo Exterior (landing)
```
igloo.drc             217KB  Main igloo mesh
igloo_cage.drc          5KB  Selection wireframe overlay (hover state)
igloo_outline.drc      19KB  Silhouette outline
igloo/patch.drc         1KB  Individual numbered clickable panels
mountain.drc           12KB  Background mountains
ground.drc             19KB  Snow ground
intro_particles.drc     2KB  Particle burst on intro
smoke_trail.drc         4KB  Smoke particle trail
```

### Scene 2 — Interior / Projects
```
cube1.drc / cube2.drc / cube3.drc   High-poly cube props
floor.drc              39KB  Interior floor
ceilingsmoke.drc       13KB  Ceiling particle smoke
shattered_ring.drc     40KB  Floating broken ring prop
shattered_ring2.drc    43KB
```

### Portfolio Objects (rendered as 3D meshes)
```
pudgy.drc             30KB  Character model
overpass_logo.drc     14KB  Project logo geometry
abstractlogo.drc       7KB  Abstract logo
blurrytext.drc / blurrytext_cylinder.drc  3D blurry text props
```

---

## Texture Pipeline

**Format**: KTX2 → Basis Universal WASM → optimal GPU format
- ASTC on Apple Silicon / iOS
- BCn/DXT on desktop
- ETC2 on Android

### Key textures:

**PBR igloo scene:**
```
igloo_color.ktx2            521KB
igloo_exploded_color.ktx2   823KB  ← Second state: igloo breaks apart
mountain_color.ktx2         578KB
ground_color.ktx2           611KB
ground_glow.ktx2            209KB  ← Emissive glow map
ground_sansigloo_color.ktx2 614KB  ← Transition: ground without igloo
```

**PBR cube scene (high quality):**
```
cube1_normal.ktx2    1052KB  × 3 cubes (each has color, roughness, normal)
```

**Procedural / effect textures:**
```
scroll-datatexture.ktx2  1257KB  ← Scroll progress ENCODED as texture
frost-datatexture.ktx2    132KB  ← Ice frost overlay
wind_noise.ktx2            18KB
perlin-datatexture.ktx2     4KB
blue-8-128-rgb.ktx2        50KB  ← Blue noise (dithering)
bokeh.ktx2                 21KB  ← DoF bokeh kernel
caustics.ktx2               3KB  ← Water caustic light
```

**Volume textures (3D textures for raymarching):**
```
volumes/peachesbody_64.ktx2   817KB  ← 64³ voxels (volumetric body)
volumes/x_64.ktx2             311KB  ← 64³ voxels
volumes/medium_32.ktx2         45KB  ← 32³ voxels (clouds/smoke)
```

**UI — all WebGL, not DOM:**
```
ui/logo-datatexture.ktx2    "IGLOO" wordmark
ui/sound-datatexture.ktx2   Sound toggle
ui/arrow-datatexture.ktx2   Navigation arrow
ui/close-datatexture.ktx2   Close button
ui/visit-datatexture.ktx2   "Visit" link
fonts/IBMPlexMono-Medium-datatexture.ktx2  108KB  ← Font atlas
fonts/IBMPlexMono-Medium.json               2KB   ← Glyph metrics
```

---

## MSDF Text Rendering (How text works in WebGL)

All site text is rendered using **Multi-channel Signed Distance Fields**:

1. Pre-generated texture atlas stores each glyph encoded as RGB distance fields
2. JSON file stores advance widths, kerning, UV coords per glyph
3. A Three.js `ShaderMaterial` reconstructs sharp edges at any scale via the MSDF formula in the fragment shader
4. Off-thread `msdfworker.js` handles atlas generation

**Result**: pixel-perfect, resolution-independent, zoom-safe text — entirely inside WebGL with zero DOM elements.

**Libraries to use**: `three-msdf-text` or `troika-three-text` (easier)

---

## The ASCII Loader (Clever CSS Trick)

The animated load bar uses **zero JavaScript** — pure CSS `content:` keyframes:

```css
.ascii:before {
  content: '----------';
  font-family: monospace;
  animation: head 5s infinite;
}

@keyframes head {
  0%  { content: '---===+++=' }
  1%  { content: '----===+++' }
  /* 100 keyframe steps cycling -, =, + characters */
}
```

Lesson: CSS `content:` can be animated inside `@keyframes`. Use this.

---

## Audio System (17 tracks)

```
music-highq.ogg   1.5MB  Background music
room.ogg           596KB  Room tone
wind.ogg           560KB  Wind ambience
igloo.ogg                  Igloo ambient

beeps.ogg / beeps2.ogg / beeps3.ogg  UI micro-interactions
click-project.ogg          Select sound
enter-project.ogg          Scene transition in
leave-project.ogg          Scene transition out
shard.ogg                  Ice breaking
particles.ogg              Particle burst
circles.ogg                Ring animation
manifesto.ogg              Section cue
logo.ogg                   Logo reveal
ui-long.ogg / ui-short.ogg Button feedback
project-text.ogg           Text typewriter sound
```

`audioworker.js` (77KB) handles mixing, spatial positioning, crossfading off the main thread.

---

## State Machine (Inferred)

```
LOAD
  └─ INTRO_PARTICLES (burst on entry)
       └─ IGLOO_EXTERIOR
             ├─ hover patch  → highlight + show number
             ├─ click patch  → ENTER_PROJECT
             │     ├─ igloo explodes (igloo_exploded_color.ktx2)
             │     └─ INTERIOR_SCENE
             │           ├─ cube props + character models
             │           └─ leave → igloo re-assembles
             └─ scroll/wheel → advance MANIFESTO text
```

---

## How to Build Something Like This

### Skill requirements by layer:

| What | Tools to learn |
|---|---|
| 3D scene | Three.js (start here) or OGL (lighter) |
| 3D models | Blender → export GLTF → compress with `gltf-pipeline` + Draco |
| Textures | Export as KTX2 using `ktx2-encoder` or Blender addon |
| Text in WebGL | `troika-three-text` (easiest) or `three-msdf-text` |
| Volumetric fog | `Data3DTexture` + custom GLSL raymarching shader |
| Custom scroll | `wheel` + `touchmove` listener → lerp a `uProgress` uniform |
| Spatial audio | Howler.js (easier) or raw Web Audio API |
| Framework | Svelte (best for canvas apps — tiny runtime) |
| Build | Vite |
| Post-processing | `postprocessing` npm package (Three.js compatible) |

### Progressive path (from your current site to this):

**Level 1** — Add a Three.js canvas behind your existing HTML  
→ `<canvas>` in `#hero`, render particles / floating geometry  

**Level 2** — Replace hero section entirely with a Three.js scene  
→ 3D text via `troika-three-text`, scroll drives a uniform  

**Level 3** — All sections scroll-driven in one canvas  
→ GSAP ScrollTrigger + Three.js, state machine between sections  

**Level 4** — Full igloo-style: entire DOM replaced by WebGL  
→ MSDF text, KTX2 textures, custom shaders for every material  

### The hardest part

**Custom GLSL shaders.** Every effect (ice, frost, bokeh, caustics, volume fog) is hand-written shader code. That's where ~80% of the visual quality lives. Study:
- `The Book of Shaders` (thebookofshaders.com)
- `ShaderToy` (shadertoy.com) — real examples
- Three.js `ShaderMaterial` docs

---

## Key Takeaways for Your Portfolio Redesign

1. **Self-host everything** — no Google Fonts CDN dependency (they do IBM Plex Mono locally)
2. **Kill native scroll** — custom wheel handler gives full cinematic control
3. **Encode scroll as texture** — `scroll-datatexture.ktx2` is a genius pattern: bake animation curves as a texture, sample them in shaders
4. **Device detection on `<html>`** — `class="desktop mac chrome"` lets CSS/JS branch without runtime checks
5. **Workers for everything heavy** — audio, texture decode, font atlas all off main thread
6. **Sound design matters** — 17 audio tracks make the experience feel alive; even subtle UI sounds change perception
7. **Two texture states** — `igloo_color.ktx2` + `igloo_exploded_color.ktx2` = cheap morph between states via lerp in shader
8. **Draco + KTX2** — the compression stack is non-negotiable for this asset volume; 217KB igloo mesh is remarkable
