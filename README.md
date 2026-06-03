# Goody — Personal Portfolio

Personal portfolio for Vivitthachai "Goody" Laprattanatrai — Business Analyst & ERP Implementation Specialist, Bangkok.

**Live:** https://mastergroot.github.io/Portfolio/

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | Svelte 4 |
| Build | Vite 5 |
| 3D / WebGL | Three.js 0.167 |
| Animation | GSAP 3.12 |
| Unit tests | Vitest |
| E2E tests | Playwright |
| Deploy | GitHub Actions → `gh-pages` branch → GitHub Pages |

---

## Running Locally

```bash
npm install
npm run dev
# → http://localhost:5173/Portfolio/
```

> Note: the base path is `/Portfolio/` (capital P) — matches the GitHub repo name.

---

## Running Tests

```bash
npm run test          # Vitest unit tests (watch mode)
npm run test -- --run # Vitest single run
npx playwright test   # E2E tests (requires dev server running)
```

Playwright needs an HTTP server — `file://` protocol is blocked. The dev server at `http://localhost:5173/Portfolio/` works.

---

## Building & Deploying

Every push to `main` triggers GitHub Actions (`.github/workflows/deploy.yml`):

1. `npm ci` → `npm run build` → outputs to `dist/`
2. `peaceiris/actions-gh-pages` deploys `dist/` to the `gh-pages` branch
3. GitHub Pages serves from `gh-pages` branch

**Manual deploy:** just `git push origin main`.

> GitHub Pages must be configured to serve from the `gh-pages` branch (not `main`). This is set in repo Settings → Pages → Source.

---

## Architecture

```
src/
├── main.js                   ← Svelte mount
├── App.svelte                ← root: ThreeCanvas + sections + LangToggle
├── ThreeCanvas.svelte        ← fixed WebGL canvas (z-index 0)
├── LangToggle.svelte         ← fixed bottom-right EN/TH button
├── global.css                ← shared styles, .scene-content glass panel
├── stores/
│   ├── lang.js               ← langStore (persists to localStorage)
│   └── scene.js              ← sceneStore (driven by IntersectionObserver)
├── lib/three/
│   ├── network.js            ← 16-node graph, buildNetwork(), setNodeHighlights()
│   ├── keyframes.js          ← 8 camera keyframes (one per scene)
│   ├── animate.js            ← GSAP camera transitions
│   └── materials.js          ← node/edge materials by type
└── sections/
    ├── Intro.svelte          ← scene 0 — hero (transparent, radial veil)
    ├── About.svelte          ← scene 1
    ├── Education.svelte      ← scene 2
    ├── Skills.svelte         ← scene 3
    ├── Work.svelte           ← scene 4
    ├── Experience.svelte     ← scene 5
    ├── Certifications.svelte ← scene 6
    └── Contact.svelte        ← scene 7
```

---

## Bilingual System

The site supports English and Thai. Toggle via the **EN / TH** button fixed at bottom-right. The choice persists in `localStorage`.

- `langStore` sets `body.lang-th` and `document.documentElement.lang`
- Thai font: Sarabun (loaded from Google Fonts)
- All text content lives in per-component `content = { en: {...}, th: {...} }` objects
- Use actual Unicode characters in strings (`'` `—`), **not** HTML entities (`&rsquo;` `&mdash;`) — plain Svelte `{variable}` interpolation does not parse entities. Use `{@html variable}` only when the string contains intentional HTML tags.

---

## Design System

- Background: `#0d0d0d` (Three.js scene + CSS `--dark`)
- Accent: `--gold: #c9a84c`, `--gold-lt: #e8c96d`
- Text: `--white: #f0ede6`, `--muted-txt: #888`
- Content panels: dark frosted glass (`background: rgba(6,6,6,0.87)`, `backdrop-filter: blur(14px)`) with gold corner brackets via CSS `::before`/`::after`
- Hero (scene 0): transparent panel, contrast via radial dark veil pseudo-element

---

## Assets

```
assets/
└── Vivitthachai_Goody_CV.pdf   ← CV download (linked from hero + contact)
```

---

## Docs

```
docs/superpowers/
├── specs/2026-06-03-portfolio-3d-redesign.md   ← full design spec
└── plans/2026-06-03-portfolio-3d-redesign.md   ← implementation plan
```
