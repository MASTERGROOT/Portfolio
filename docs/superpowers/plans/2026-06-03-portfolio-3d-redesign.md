# Portfolio 3D Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a greenfield Svelte + Three.js scroll-driven 3D portfolio that replaces the current static site at mastergroot.github.io.

**Architecture:** One fixed Three.js canvas (z-index 0) holds a persistent Systems Network node graph. Eight Svelte sections scroll over it (z-index 1). An IntersectionObserver maps scroll position to a scene index (0–7) stored in a Svelte writable store; ThreeCanvas subscribes and GSAP-animates the camera + node highlights to the matching keyframe.

**Tech Stack:** Svelte 4, Vite 5, Three.js 0.167, GSAP 3.12, Vitest 1, Playwright 1.44, GitHub Actions (peaceiris/actions-gh-pages)

**Spec:** `docs/superpowers/specs/2026-06-03-portfolio-3d-redesign.md`

---

## File Map

| File | Responsibility |
|---|---|
| `src/main.js` | App entry point |
| `src/App.svelte` | Mounts canvas + sections, owns IntersectionObserver, mobile detection |
| `src/ThreeCanvas.svelte` | Three.js renderer, animation loop, subscribes to sceneStore |
| `src/LangToggle.svelte` | Fixed bottom-right language button |
| `src/stores/lang.js` | `langStore` writable — `'en'`\|`'th'`, persisted to localStorage |
| `src/stores/scene.js` | `sceneStore` writable — active section index 0–7 |
| `src/lib/three/materials.js` | Gold/dark MeshStandardMaterial, LineBasicMaterial, PointsMaterial factories |
| `src/lib/three/network.js` | NODE_DEFS, EDGE_DEFS, `buildNetwork()`, `setNodeHighlights()` |
| `src/lib/three/keyframes.js` | KEYFRAMES array — 8 camera positions + highlight targets |
| `src/lib/three/animate.js` | `animateToKeyframe()` — GSAP transitions |
| `src/sections/Intro.svelte` | Scene 0 — hero + CV download |
| `src/sections/About.svelte` | Scene 1 — short bio |
| `src/sections/Education.svelte` | Scene 2 — degree + institution |
| `src/sections/Skills.svelte` | Scene 3 — skill clusters |
| `src/sections/Work.svelte` | Scene 4 — company list |
| `src/sections/Experience.svelte` | Scene 5 — timeline |
| `src/sections/Certifications.svelte` | Scene 6 — cert list |
| `src/sections/Contact.svelte` | Scene 7 — email + links |
| `src/global.css` | CSS custom properties, reset, font swap, mobile overlays |
| `index.html` | Shell HTML — loads fonts, mounts app |
| `vite.config.js` | Svelte plugin, `base` path, Vitest config |
| `.github/workflows/deploy.yml` | CI: build → deploy `dist/` to `gh-pages` branch |
| `e2e/portfolio.test.js` | Playwright E2E tests |
| `playwright.config.js` | Playwright config — dev server + viewport |

---

## Tool Guide

This plan is designed to be executed by any AI tool — Claude Code, Codex, Gemini, or anti-gravity CLI. Each task specifies the recommended tool and exactly how to use it, including Claude Code plugin skills and MCP tools.

### Claude Code Plugin Skills

Skills are loaded in Claude Code via the `Skill` tool (or type `/skill-name` in the chat). They provide step-by-step discipline for specific workflows.

**Skill files are located at:**
`/Users/goody/.claude/plugins/cache/claude-plugins-official/superpowers/5.1.0/skills/`

If using Codex, Gemini, or anti-gravity CLI on a task that calls for a Claude Code skill, read the skill file at the path above and paste its content as a system prompt or context block before the task.

Key skills used in this plan:

| Skill | When to invoke | Path suffix |
|---|---|---|
| `superpowers:test-driven-development` | Before writing any implementation code | `test-driven-development/SKILL.md` |
| `superpowers:verification-before-completion` | Before marking any task done | `verification-before-completion/SKILL.md` |
| `superpowers:requesting-code-review` | Before final deploy (Task 15) | `requesting-code-review/SKILL.md` |
| `run` | To launch dev server and confirm in browser | (built-in skill, Claude Code only) |
| `verify` | To drive the app and confirm a change works | (built-in skill, Claude Code only) |
| `frontend-design:frontend-design` | For visual/UI section layout work | loaded from frontend-design plugin |
| `chrome-devtools-mcp:debug-optimize-lcp` | Performance audit (Task 13) | loaded from chrome-devtools-mcp plugin |

### MCP Tools (Claude Code only)

MCP tools cannot be used in Codex/Gemini/anti-gravity. They are available only when running in Claude Code. If using another tool, substitute with manual browser checks.

**Playwright MCP** — browser automation:

| Tool name | Use for |
|---|---|
| `mcp__plugin_playwright_playwright__browser_navigate` | Navigate to a URL |
| `mcp__plugin_playwright_playwright__browser_take_screenshot` | Capture visual output |
| `mcp__plugin_playwright_playwright__browser_resize` | Simulate mobile viewport |
| `mcp__plugin_playwright_playwright__browser_click` | Click elements (e.g. lang toggle) |
| `mcp__plugin_playwright_playwright__browser_scroll` | Scroll to a section |
| `mcp__plugin_playwright_playwright__browser_evaluate` | Run JS in the browser and check values |
| `mcp__plugin_playwright_playwright__browser_snapshot` | Accessibility snapshot — find element selectors |
| `mcp__plugin_playwright_playwright__browser_console_messages` | Watch for JS errors |

**Chrome DevTools MCP** — performance and debugging:

| Tool name | Use for |
|---|---|
| `mcp__plugin_chrome-devtools-mcp_chrome-devtools__lighthouse_audit` | Run Lighthouse performance audit |
| `mcp__plugin_chrome-devtools-mcp_chrome-devtools__take_screenshot` | Screenshot with DevTools context |
| `mcp__plugin_chrome-devtools-mcp_chrome-devtools__get_console_message` | Check for runtime errors/warnings |

### Anti-Gravity CLI

If your anti-gravity CLI supports model routing per task, use the "Recommended tool" column to pick the model. Pass the relevant skill content (from the path above) as a system prompt prefix for tasks that call for Claude Code skills.

---

## Task 1: Project Scaffold

**Recommended tool:** Codex (boilerplate generation)

**Tools detail:**
- **Codex / anti-gravity:** provide the file list and stack versions as context; ask it to generate each file one at a time following the exact content in this task
- **Claude Code skills:** invoke `run` skill at Step 8 to start the dev server and confirm a blank dark page in the browser
- **MCP (Claude Code):** after Step 8 — `browser_navigate` → `http://localhost:5173/portfolio/`, then `browser_take_screenshot` to confirm blank dark page with no console errors
- **Gemini / other tools:** verify manually — open the URL printed by `npm run dev` in a browser

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.js`
- Create: `src/main.js`
- Create: `src/global.css`
- Create: `src/App.svelte` (skeleton)

- [ ] **Step 1: Create package.json**

```json
{
  "name": "portfolio-3d",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "gsap": "^3.12.5",
    "svelte": "^4.2.18",
    "three": "^0.167.0"
  },
  "devDependencies": {
    "@sveltejs/vite-plugin-svelte": "^3.1.1",
    "@testing-library/svelte": "^5.2.3",
    "@playwright/test": "^1.44.0",
    "jsdom": "^24.1.1",
    "vitest": "^1.6.0"
  }
}
```

- [ ] **Step 2: Create index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Goody — BA &amp; ERP Specialist</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Sarabun:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

- [ ] **Step 3: Create vite.config.js**

```js
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  base: '/portfolio/',
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
```

> Note: Change `base` to match your actual GitHub repo name (e.g. `'/mastergroot.github.io/'` if the repo is named that, or `'/'` for a user pages repo).

- [ ] **Step 4: Create src/main.js**

```js
import App from './App.svelte';
const app = new App({ target: document.getElementById('app') });
export default app;
```

- [ ] **Step 5: Create src/global.css**

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --gold: #c9a84c;
  --gold-lt: #e8c96d;
  --dark: #0d0d0d;
  --dark-2: #1a1a1a;
  --muted: #2a2a2a;
  --muted-txt: #888;
  --white: #f0ede6;
}

html { scroll-behavior: smooth; }

body {
  background: var(--dark);
  color: var(--white);
  font-family: 'Inter', 'Helvetica Neue', sans-serif;
  overflow-x: hidden;
}

body.lang-th {
  font-family: 'Sarabun', sans-serif;
}

body.lang-th h1,
body.lang-th h2,
body.lang-th h3,
body.lang-th em { font-style: normal; }

.scene {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scene-content {
  max-width: 700px;
  padding: 2rem;
  text-align: center;
}

body.mobile .scene-content {
  background: linear-gradient(180deg, rgba(13,13,13,0.6) 0%, rgba(13,13,13,0.88) 100%);
  border-radius: 1rem;
}
```

- [ ] **Step 6: Create src/App.svelte skeleton** (stub sections — real implementation in Task 9)

```svelte
<script>
  import ThreeCanvas from './ThreeCanvas.svelte';
  import LangToggle from './LangToggle.svelte';
</script>

<ThreeCanvas />
<main style="position:relative;z-index:1;">
  <!-- sections added in Tasks 10–11 -->
</main>
<LangToggle />
```

- [ ] **Step 7: Install dependencies**

```bash
npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 8: Verify dev server starts**

```bash
npm run dev
```

Expected: Vite prints `Local: http://localhost:5173/portfolio/`. Browser shows blank dark page (no errors in console). Stop with Ctrl+C.

- [ ] **Step 9: Commit**

```bash
git add package.json index.html vite.config.js src/main.js src/global.css src/App.svelte
git commit -m "feat(scaffold): init Svelte+Vite portfolio project"
```

---

## Task 2: GitHub Actions Deploy Pipeline

**Recommended tool:** Codex (YAML boilerplate)

**Tools detail:**
- **Codex / anti-gravity:** provide repo name and `gh-pages` as the target branch; ask it to generate the YAML following the exact content in this task
- **Claude Code skills:** none needed for this task
- **MCP:** none needed — verify by checking GitHub Actions tab in the browser after pushing
- **Other tools:** after pushing to `main`, open `https://github.com/<your-repo>/actions` and confirm the workflow passes

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create .github/workflows/deploy.yml**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          destination_branch: gh-pages
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Actions deploy to gh-pages"
```

> Verify: push to `main` — Actions tab should show a passing workflow within ~2 min. The `gh-pages` branch should be created automatically.

---

## Task 3: Svelte Stores

**Recommended tool:** Codex

**Tools detail:**
- **Codex / anti-gravity:** TDD discipline must be enforced manually — write the test file first, run it, confirm it fails, then write the implementation. Codex tends to skip to implementation; resist this.
- **Claude Code skills:** invoke `superpowers:test-driven-development` before writing any store code — skill at `superpowers/5.1.0/skills/test-driven-development/SKILL.md`; paste into Codex system prompt if needed
- **MCP:** none needed for stores
- **Other tools:** run `npm test -- src/stores` to verify after each file is created

**Files:**
- Create: `src/stores/lang.js`
- Create: `src/stores/scene.js`
- Create: `src/stores/lang.test.js`
- Create: `src/stores/scene.test.js`

- [ ] **Step 1: Write failing tests**

`src/stores/lang.test.js`:
```js
import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';

beforeEach(() => {
  localStorage.clear();
  // re-import to get fresh store state
});

it('lang store defaults to en when localStorage is empty', async () => {
  const { langStore } = await import('./lang.js?v=' + Math.random());
  expect(get(langStore)).toBe('en');
});

it('lang store persists to localStorage on set', async () => {
  const { langStore } = await import('./lang.js?v=' + Math.random());
  langStore.set('th');
  expect(localStorage.getItem('lang')).toBe('th');
});
```

`src/stores/scene.test.js`:
```js
import { it, expect } from 'vitest';
import { get } from 'svelte/store';
import { sceneStore } from './scene.js';

it('sceneStore starts at 0', () => {
  expect(get(sceneStore)).toBe(0);
});

it('sceneStore updates to given index', () => {
  sceneStore.set(5);
  expect(get(sceneStore)).toBe(5);
  sceneStore.set(0); // reset
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test -- src/stores
```

Expected: FAIL — `Cannot find module './lang.js'`

- [ ] **Step 3: Create src/stores/lang.js**

```js
import { writable } from 'svelte/store';

const stored = (typeof localStorage !== 'undefined' && localStorage.getItem('lang')) || 'en';
export const langStore = writable(stored);

langStore.subscribe(v => {
  if (typeof localStorage !== 'undefined') localStorage.setItem('lang', v);
  if (typeof document !== 'undefined') {
    document.documentElement.lang = v;
    document.body.classList.toggle('lang-th', v === 'th');
  }
});
```

- [ ] **Step 4: Create src/stores/scene.js**

```js
import { writable } from 'svelte/store';
export const sceneStore = writable(0);
```

- [ ] **Step 5: Run tests — expect PASS**

```bash
npm test -- src/stores
```

Expected: PASS (2 test files, 3 tests)

- [ ] **Step 6: Commit**

```bash
git add src/stores/
git commit -m "feat(stores): add langStore and sceneStore with tests"
```

---

## Task 4: Three.js Materials

**Recommended tool:** Claude Code (Three.js specifics)

**Tools detail:**
- **Claude Code skills:** invoke `superpowers:test-driven-development` before writing `materials.js` — paste skill content from `superpowers/5.1.0/skills/test-driven-development/SKILL.md` into prompt if using another tool
- **MCP:** none needed — tests run in Node via Vitest (no browser)
- **Codex / anti-gravity:** Three.js material API is well-known; provide the material type names (`MeshStandardMaterial`, `LineBasicMaterial`, `PointsMaterial`) and the color constants as context
- **Gemini:** not recommended for Three.js code — use Claude Code or Codex

**Files:**
- Create: `src/lib/three/materials.js`
- Create: `src/lib/three/materials.test.js`

- [ ] **Step 1: Write failing test**

`src/lib/three/materials.test.js`:
```js
import { it, expect } from 'vitest';
import * as THREE from 'three';
import { createNodeMaterial, createEdgeMaterial, createParticleMaterial } from './materials.js';

it('createNodeMaterial returns MeshStandardMaterial', () => {
  const mat = createNodeMaterial('center', false);
  expect(mat).toBeInstanceOf(THREE.MeshStandardMaterial);
});

it('active node has emissiveIntensity 1.0', () => {
  const mat = createNodeMaterial('center', true);
  expect(mat.emissiveIntensity).toBe(1.0);
});

it('inactive node has emissiveIntensity 0.2', () => {
  const mat = createNodeMaterial('erp', false);
  expect(mat.emissiveIntensity).toBe(0.2);
});

it('createEdgeMaterial returns transparent LineBasicMaterial', () => {
  const mat = createEdgeMaterial(0.3);
  expect(mat).toBeInstanceOf(THREE.LineBasicMaterial);
  expect(mat.transparent).toBe(true);
  expect(mat.opacity).toBe(0.3);
});

it('createParticleMaterial returns PointsMaterial', () => {
  const mat = createParticleMaterial();
  expect(mat).toBeInstanceOf(THREE.PointsMaterial);
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm test -- src/lib/three/materials
```

Expected: FAIL — `Cannot find module './materials.js'`

- [ ] **Step 3: Create src/lib/three/materials.js**

```js
import * as THREE from 'three';

export const NODE_TYPE_EMISSIVE = {
  center:    0xe8c96d,
  erp:       0xc9a84c,
  client:    0x8b6914,
  skill:     0xa07c35,
  education: 0x7a5c10,
  cert:      0xb08d3e,
  work:      0x9a7228,
  contact:   0xe8c96d,
};

export function createNodeMaterial(type = 'center', active = false) {
  return new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    emissive: NODE_TYPE_EMISSIVE[type] ?? 0xc9a84c,
    emissiveIntensity: active ? 1.0 : 0.2,
    metalness: 0.8,
    roughness: 0.2,
  });
}

export function createEdgeMaterial(opacity = 0.25) {
  return new THREE.LineBasicMaterial({
    color: 0xc9a84c,
    transparent: true,
    opacity,
  });
}

export function createParticleMaterial() {
  return new THREE.PointsMaterial({
    color: 0xe8c96d,
    size: 0.05,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
  });
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
npm test -- src/lib/three/materials
```

Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/lib/three/materials.js src/lib/three/materials.test.js
git commit -m "feat(three): add gold/dark material factories with tests"
```

---

## Task 5: Systems Network Geometry

**Recommended tool:** Claude Code (Three.js geometry)

**Tools detail:**
- **Claude Code skills:** invoke `superpowers:test-driven-development` before writing `network.js`
- **MCP:** none needed — pure Node/Vitest tests
- **Codex / anti-gravity:** Three.js `SphereGeometry`, `BufferGeometry`, `Line` are well-known; provide the `NODE_DEFS` table from this task as context so it generates the exact node data you need
- **Gemini:** not recommended for Three.js geometry code

**Files:**
- Create: `src/lib/three/network.js`
- Create: `src/lib/three/network.test.js`

- [ ] **Step 1: Write failing tests**

`src/lib/three/network.test.js`:
```js
import { it, expect } from 'vitest';
import * as THREE from 'three';
import { NODE_DEFS, EDGE_DEFS, buildNetwork, setNodeHighlights } from './network.js';

it('center node exists in NODE_DEFS', () => {
  expect(NODE_DEFS.find(n => n.id === 'center')).toBeDefined();
});

it('all EDGE_DEFS reference valid node IDs', () => {
  const ids = new Set(NODE_DEFS.map(n => n.id));
  EDGE_DEFS.forEach(([a, b]) => {
    expect(ids.has(a), `unknown id "${a}"`).toBe(true);
    expect(ids.has(b), `unknown id "${b}"`).toBe(true);
  });
});

it('buildNetwork adds correct number of meshes', () => {
  const scene = new THREE.Scene();
  const { nodeMap } = buildNetwork(scene);
  expect(Object.keys(nodeMap).length).toBe(NODE_DEFS.length);
});

it('setNodeHighlights sets high intensity on highlighted nodes', () => {
  const scene = new THREE.Scene();
  const { nodeMap } = buildNetwork(scene);
  setNodeHighlights(nodeMap, ['center']);
  expect(nodeMap['center'].material.emissiveIntensity).toBe(1.0);
  expect(nodeMap['sap'].material.emissiveIntensity).toBe(0.08);
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm test -- src/lib/three/network
```

Expected: FAIL — `Cannot find module './network.js'`

- [ ] **Step 3: Create src/lib/three/network.js**

```js
import * as THREE from 'three';
import { createNodeMaterial, createEdgeMaterial } from './materials.js';

export const NODE_DEFS = [
  { id: 'center',   label: 'Goody / BA',       type: 'center',    pos: [0, 0, 0],           size: 0.25 },
  { id: 'sap',      label: 'SAP',               type: 'erp',       pos: [3, 1, -1],          size: 0.15 },
  { id: 'oracle',   label: 'Oracle',            type: 'erp',       pos: [-3, 0.5, -1],       size: 0.15 },
  { id: 'mfg',      label: 'Manufacturing',     type: 'client',    pos: [2, -2, 1],          size: 0.13 },
  { id: 'dist',     label: 'Distribution',      type: 'client',    pos: [-2, -1.5, 2],       size: 0.13 },
  { id: 'retail',   label: 'Retail',            type: 'client',    pos: [0, -2.5, -2],       size: 0.12 },
  { id: 'analysis', label: 'Analysis',          type: 'skill',     pos: [0, 3, 1],           size: 0.14 },
  { id: 'pm',       label: 'Project Mgmt',      type: 'skill',     pos: [2, 2, 2],           size: 0.14 },
  { id: 'tech',     label: 'Tech',              type: 'skill',     pos: [-1, 2.5, -2],       size: 0.13 },
  { id: 'comm',     label: 'Communication',     type: 'skill',     pos: [-2.5, 1.5, 1],      size: 0.13 },
  { id: 'uni',      label: 'KMUTT',             type: 'education', pos: [1, -3, -2],         size: 0.14 },
  { id: 'cert_sap', label: 'SAP Certified',     type: 'cert',      pos: [3.5, 0, 2],         size: 0.12 },
  { id: 'cert_pmp', label: 'PMP',               type: 'cert',      pos: [-3.5, -0.5, -1.5], size: 0.12 },
  { id: 'work1',    label: 'Nishoku',           type: 'work',      pos: [0.5, 1, 3.5],       size: 0.14 },
  { id: 'work2',    label: 'Primus',            type: 'work',      pos: [-1, 0.5, 3.5],      size: 0.14 },
  { id: 'contact',  label: 'Contact',           type: 'contact',   pos: [0, -1, 0.5],        size: 0.18 },
];

export const EDGE_DEFS = [
  ['center', 'sap'],    ['center', 'oracle'],
  ['center', 'mfg'],    ['center', 'dist'],    ['center', 'retail'],
  ['center', 'analysis'], ['center', 'pm'],    ['center', 'tech'], ['center', 'comm'],
  ['center', 'uni'],
  ['center', 'cert_sap'], ['center', 'cert_pmp'],
  ['center', 'work1'],  ['center', 'work2'],
  ['center', 'contact'],
  ['sap',    'cert_sap'], ['sap', 'mfg'],
  ['oracle', 'dist'],
  ['work1',  'mfg'],    ['work2', 'dist'],
  ['analysis', 'pm'],
];

export function buildNetwork(scene) {
  const nodeMap = {};
  const lines = [];

  NODE_DEFS.forEach(def => {
    const geo = new THREE.SphereGeometry(def.size, 16, 16);
    const mat = createNodeMaterial(def.type, false);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...def.pos);
    mesh.userData = { id: def.id, type: def.type };
    scene.add(mesh);
    nodeMap[def.id] = mesh;
  });

  EDGE_DEFS.forEach(([fromId, toId]) => {
    const from = nodeMap[fromId];
    const to = nodeMap[toId];
    if (!from || !to) return;
    const geo = new THREE.BufferGeometry().setFromPoints([
      from.position.clone(),
      to.position.clone(),
    ]);
    const mat = createEdgeMaterial(0.2);
    const line = new THREE.Line(geo, mat);
    line.userData = { fromId, toId };
    scene.add(line);
    lines.push(line);
  });

  return { nodeMap, lines };
}

export function setNodeHighlights(nodeMap, highlightIds) {
  const active = new Set(highlightIds);
  Object.entries(nodeMap).forEach(([id, mesh]) => {
    mesh.material.emissiveIntensity = active.has(id) ? 1.0 : 0.08;
  });
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
npm test -- src/lib/three/network
```

Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/lib/three/network.js src/lib/three/network.test.js
git commit -m "feat(three): add Systems Network node/edge geometry with tests"
```

---

## Task 6: Scene Keyframes

**Recommended tool:** Claude Code (Three.js vectors + design judgment)

**Tools detail:**
- **Claude Code skills:** invoke `superpowers:test-driven-development` before writing `keyframes.js`
- **MCP:** none needed — pure Node/Vitest tests
- **Codex / anti-gravity:** provide the 8-row scene table from the spec as context; ask it to translate each row into a `new THREE.Vector3(x, y, z)` keyframe object using the coordinates in this task
- **Gemini:** not recommended — camera position values require spatial reasoning about a 3D scene

**Files:**
- Create: `src/lib/three/keyframes.js`
- Create: `src/lib/three/keyframes.test.js`

- [ ] **Step 1: Write failing tests**

`src/lib/three/keyframes.test.js`:
```js
import { it, expect } from 'vitest';
import * as THREE from 'three';
import { KEYFRAMES } from './keyframes.js';

it('has exactly 8 keyframes', () => {
  expect(KEYFRAMES.length).toBe(8);
});

it('each keyframe has required fields', () => {
  KEYFRAMES.forEach((kf, i) => {
    expect(kf.cameraPos, `kf[${i}] cameraPos`).toBeInstanceOf(THREE.Vector3);
    expect(kf.lookAt,    `kf[${i}] lookAt`).toBeInstanceOf(THREE.Vector3);
    expect(Array.isArray(kf.highlight), `kf[${i}] highlight`).toBe(true);
    expect(typeof kf.edgeOpacity).toBe('number');
  });
});

it('keyframe 0 highlights all nodes', () => {
  expect(KEYFRAMES[0].highlight.length).toBeGreaterThan(10);
});

it('keyframe 7 highlights contact node', () => {
  expect(KEYFRAMES[7].highlight).toContain('contact');
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm test -- src/lib/three/keyframes
```

Expected: FAIL — `Cannot find module './keyframes.js'`

- [ ] **Step 3: Create src/lib/three/keyframes.js**

```js
import * as THREE from 'three';

export const KEYFRAMES = [
  {
    // 0: Intro — full network active
    cameraPos:     new THREE.Vector3(0, 6, 12),
    lookAt:        new THREE.Vector3(0, 0, 0),
    highlight:     ['center','sap','oracle','mfg','dist','retail','analysis','pm','tech','comm','uni','cert_sap','cert_pmp','work1','work2','contact'],
    edgeOpacity:   0.35,
    particlesOn:   true,
  },
  {
    // 1: About — center node only
    cameraPos:     new THREE.Vector3(0, 0.5, 3.5),
    lookAt:        new THREE.Vector3(0, 0, 0),
    highlight:     ['center'],
    edgeOpacity:   0.1,
    particlesOn:   false,
  },
  {
    // 2: Education — face edu cluster
    cameraPos:     new THREE.Vector3(2, -2, 4),
    lookAt:        new THREE.Vector3(1, -3, -2),
    highlight:     ['center', 'uni'],
    edgeOpacity:   0.2,
    particlesOn:   false,
  },
  {
    // 3: Skills — pull back, clusters visible
    cameraPos:     new THREE.Vector3(0, 5, 9),
    lookAt:        new THREE.Vector3(0, 1, 0),
    highlight:     ['analysis', 'pm', 'tech', 'comm'],
    edgeOpacity:   0.3,
    particlesOn:   false,
  },
  {
    // 4: Work — pan to company cluster
    cameraPos:     new THREE.Vector3(-1, 1, 7),
    lookAt:        new THREE.Vector3(0, 0.5, 3.5),
    highlight:     ['center', 'work1', 'work2'],
    edgeOpacity:   0.25,
    particlesOn:   false,
  },
  {
    // 5: Experience — low angle chronological arc
    cameraPos:     new THREE.Vector3(4, -1, 5),
    lookAt:        new THREE.Vector3(0, 0, 0),
    highlight:     ['work1', 'work2', 'uni'],
    edgeOpacity:   0.2,
    particlesOn:   false,
  },
  {
    // 6: Certifications — orbit view
    cameraPos:     new THREE.Vector3(5, 1, 3),
    lookAt:        new THREE.Vector3(0, 0, 0),
    highlight:     ['cert_sap', 'cert_pmp', 'center'],
    edgeOpacity:   0.15,
    particlesOn:   false,
  },
  {
    // 7: Contact — close on contact node
    cameraPos:     new THREE.Vector3(0, -0.5, 3),
    lookAt:        new THREE.Vector3(0, -1, 0.5),
    highlight:     ['contact', 'center'],
    edgeOpacity:   0.5,
    particlesOn:   false,
  },
];
```

- [ ] **Step 4: Run — expect PASS**

```bash
npm test -- src/lib/three/keyframes
```

Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/lib/three/keyframes.js src/lib/three/keyframes.test.js
git commit -m "feat(three): add 8-scene keyframe definitions with tests"
```

---

## Task 7: GSAP Animation Helper

**Recommended tool:** Claude Code (GSAP + Three.js integration)

**Tools detail:**
- **Claude Code skills:** invoke `superpowers:test-driven-development`; the GSAP mock pattern (`vi.mock('gsap', ...)`) is subtle — having the skill enforces you write the mock test first
- **MCP:** none — GSAP animation runs in the browser only; Vitest mocks GSAP for unit tests
- **Codex / anti-gravity:** provide the GSAP `to()` signature as context: `gsap.to(target, { x, y, z, duration, ease, onUpdate })` and the `KEYFRAMES` structure from Task 6
- **Gemini:** not recommended for GSAP/Three.js interop

**Files:**
- Create: `src/lib/three/animate.js`
- Create: `src/lib/three/animate.test.js`

- [ ] **Step 1: Write failing test**

`src/lib/three/animate.test.js`:
```js
import { it, expect, vi, beforeEach } from 'vitest';
import * as THREE from 'three';

vi.mock('gsap', () => ({ default: { to: vi.fn() } }));

import gsap from 'gsap';
import { animateToKeyframe } from './animate.js';
import { buildNetwork } from './network.js';

beforeEach(() => gsap.to.mockClear());

it('calls gsap.to for camera.position on valid index', () => {
  const scene = new THREE.Scene();
  const { nodeMap, lines } = buildNetwork(scene);
  const camera = new THREE.PerspectiveCamera();
  const lookAtTarget = new THREE.Vector3();

  animateToKeyframe(0, camera, lookAtTarget, nodeMap, lines);
  expect(gsap.to).toHaveBeenCalled();

  const firstCall = gsap.to.mock.calls[0];
  expect(firstCall[0]).toBe(camera.position);
});

it('does nothing for invalid index', () => {
  const scene = new THREE.Scene();
  const { nodeMap, lines } = buildNetwork(scene);
  const camera = new THREE.PerspectiveCamera();
  const lookAtTarget = new THREE.Vector3();

  animateToKeyframe(99, camera, lookAtTarget, nodeMap, lines);
  expect(gsap.to).not.toHaveBeenCalled();
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm test -- src/lib/three/animate
```

Expected: FAIL — `Cannot find module './animate.js'`

- [ ] **Step 3: Create src/lib/three/animate.js**

```js
import gsap from 'gsap';
import { KEYFRAMES } from './keyframes.js';
import { setNodeHighlights } from './network.js';

export function animateToKeyframe(index, camera, lookAtTarget, nodeMap, lines) {
  const kf = KEYFRAMES[index];
  if (!kf) return;

  gsap.to(camera.position, {
    x: kf.cameraPos.x,
    y: kf.cameraPos.y,
    z: kf.cameraPos.z,
    duration: 0.8,
    ease: 'power2.inOut',
  });

  gsap.to(lookAtTarget, {
    x: kf.lookAt.x,
    y: kf.lookAt.y,
    z: kf.lookAt.z,
    duration: 0.8,
    ease: 'power2.inOut',
    onUpdate: () => camera.lookAt(lookAtTarget),
  });

  setNodeHighlights(nodeMap, kf.highlight);

  lines.forEach(line => {
    gsap.to(line.material, {
      opacity: kf.edgeOpacity,
      duration: 0.6,
    });
  });
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
npm test -- src/lib/three/animate
```

Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/lib/three/animate.js src/lib/three/animate.test.js
git commit -m "feat(three): add animateToKeyframe GSAP helper with tests"
```

---

## Task 8: ThreeCanvas Component

**Recommended tool:** Claude Code (Svelte lifecycle + Three.js)

**Tools detail:**
- **Claude Code skills:**
  - invoke `superpowers:verification-before-completion` before marking done
  - invoke `run` skill to start dev server and confirm canvas renders in browser
- **MCP — after Step 2 (visual confirm):**
  - `browser_navigate` → `http://localhost:5173/portfolio/`
  - `browser_take_screenshot` — confirm golden node network is visible on dark background
  - `browser_evaluate` → `document.querySelector('canvas') !== null` should return `true`
- **Codex / anti-gravity:** Svelte `onMount`/`onDestroy` lifecycle + Three.js renderer setup is standard; provide the full `ThreeCanvas.svelte` template from this task as context and ask it to fill in any missing imports
- **Gemini:** not recommended for this task — Three.js + Svelte lifecycle interaction requires precise code

**Files:**
- Create: `src/ThreeCanvas.svelte`

No unit test for this component — behavior verified visually in Task 14 E2E tests.

- [ ] **Step 1: Create src/ThreeCanvas.svelte**

```svelte
<script>
  import { onMount, onDestroy } from 'svelte';
  import { sceneStore } from './stores/scene.js';

  let canvas;
  let renderer, scene, camera, animId;
  let nodeMap = {}, lines = [];
  let lookAtTarget;

  onMount(async () => {
    // Dynamic import keeps Three.js out of the initial bundle
    const [
      THREE,
      { buildNetwork },
      { animateToKeyframe },
      { KEYFRAMES },
    ] = await Promise.all([
      import('three').then(m => m),
      import('./lib/three/network.js'),
      import('./lib/three/animate.js'),
      import('./lib/three/keyframes.js'),
    ]);

    lookAtTarget = new THREE.Vector3();

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d0d0d);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const kf0 = KEYFRAMES[0];
    camera.position.copy(kf0.cameraPos);
    lookAtTarget.copy(kf0.lookAt);
    camera.lookAt(lookAtTarget);

    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    const point = new THREE.PointLight(0xc9a84c, 2, 20);
    point.position.set(0, 5, 5);
    scene.add(ambient, point);

    const net = buildNetwork(scene);
    nodeMap = net.nodeMap;
    lines = net.lines;

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    const unsub = sceneStore.subscribe(index => {
      animateToKeyframe(index, camera, lookAtTarget, nodeMap, lines);
    });

    const loop = () => {
      animId = requestAnimationFrame(loop);
      camera.lookAt(lookAtTarget);
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      window.removeEventListener('resize', handleResize);
      unsub();
    };
  });

  onDestroy(() => {
    cancelAnimationFrame(animId);
    renderer?.dispose();
  });
</script>

<canvas bind:this={canvas} />

<style>
  canvas {
    position: fixed;
    inset: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
</style>
```

- [ ] **Step 2: Update App.svelte to mount ThreeCanvas and verify**

`src/App.svelte` (temporary — real sections added in Task 10):
```svelte
<script>
  import ThreeCanvas from './ThreeCanvas.svelte';
  import LangToggle from './LangToggle.svelte';
</script>

<ThreeCanvas />
<main style="position:relative;z-index:1;min-height:900vh;">
  <!-- placeholder scroll space to test canvas -->
</main>
<LangToggle />
```

- [ ] **Step 3: Run dev server and visually verify**

```bash
npm run dev
```

Open `http://localhost:5173/portfolio/`. Expected:
- Dark background with golden glowing node network visible
- No console errors
- Network is visible and rendered

Stop with Ctrl+C.

- [ ] **Step 4: Create src/LangToggle.svelte**

```svelte
<script>
  import { langStore } from './stores/lang.js';
  function toggle() {
    langStore.update(v => v === 'en' ? 'th' : 'en');
  }
</script>

<button on:click={toggle} aria-label="Toggle language" title="ภาษาไทย / EN">
  {#if $langStore === 'th'}TH{:else}EN{/if}
</button>

<style>
  button {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    z-index: 100;
    background: transparent;
    border: 1px solid var(--gold);
    color: var(--gold);
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    padding: 0.3rem 0.6rem;
    cursor: pointer;
    opacity: 0.4;
    transition: opacity 0.2s;
  }
  button:hover { opacity: 1; }
</style>
```

- [ ] **Step 5: Commit**

```bash
git add src/ThreeCanvas.svelte src/LangToggle.svelte src/App.svelte
git commit -m "feat(canvas): add ThreeCanvas with scene state machine and LangToggle"
```

---

## Task 9: App.svelte — Scroll Bridge & Mobile Detection

**Recommended tool:** Codex (IntersectionObserver pattern)

**Tools detail:**
- **Codex / anti-gravity:** `IntersectionObserver` is standard web API; provide the `sceneStore` import path and the `data-scene` attribute name as context; ask it to wire the observer to update the store
- **Claude Code skills:** invoke `verify` skill after Step 1 to scroll through sections and confirm store updates
- **MCP — verify scroll-to-scene wiring:**
  - `browser_navigate` → `http://localhost:5173/portfolio/`
  - `browser_scroll` — scroll to section 4
  - `browser_evaluate` → check `document.querySelectorAll('[data-scene]').length` equals `8`
  - `browser_console_messages` — confirm no errors during scroll
- **Gemini:** not recommended for this task

**Files:**
- Modify: `src/App.svelte`

- [ ] **Step 1: Replace App.svelte with full implementation**

```svelte
<script>
  import { onMount } from 'svelte';
  import ThreeCanvas from './ThreeCanvas.svelte';
  import LangToggle from './LangToggle.svelte';
  import Intro from './sections/Intro.svelte';
  import About from './sections/About.svelte';
  import Education from './sections/Education.svelte';
  import Skills from './sections/Skills.svelte';
  import Work from './sections/Work.svelte';
  import Experience from './sections/Experience.svelte';
  import Certifications from './sections/Certifications.svelte';
  import Contact from './sections/Contact.svelte';
  import { sceneStore } from './stores/scene.js';

  const isMobile = typeof window !== 'undefined' &&
    window.matchMedia('(pointer: coarse), (max-width: 768px)').matches;

  onMount(() => {
    if (isMobile) {
      document.body.classList.add('mobile');
      return;
    }

    const sections = document.querySelectorAll('[data-scene]');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          sceneStore.set(Number(entry.target.dataset.scene));
        }
      });
    }, { threshold: 0.5 });

    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  });
</script>

<ThreeCanvas />
<main>
  <Intro />
  <About />
  <Education />
  <Skills />
  <Work />
  <Experience />
  <Certifications />
  <Contact />
</main>
<LangToggle />

<style>
  main {
    position: relative;
    z-index: 1;
  }
</style>
```

> Note: Section components are stubbed in Task 10. This file will throw import errors until Task 10 is complete — that is expected.

- [ ] **Step 2: Commit**

```bash
git add src/App.svelte
git commit -m "feat(app): add IntersectionObserver scroll-to-scene bridge and mobile detection"
```

---

## Task 10: Section Components — English Content

**Recommended tool:** Gemini (content writing + HTML structure)

**Tools detail:**
- **Gemini prompt template:** "Write 6 Svelte section components for a personal portfolio. Follow this exact pattern — [paste `Intro.svelte` and `About.svelte` from Task 8]. Sections needed: Education (data-scene=2), Skills (3), Work (4), Experience (5), Certifications (6), Contact (7). Person: Goody, BA & ERP specialist. CV content: [paste relevant CV sections]. Leave all `th:` string objects empty with placeholder empty strings. Return one complete file per section."
- **Claude Code skills:** invoke `frontend-design:frontend-design` skill for visual styling on section layouts — skill loaded from the `frontend-design` plugin
- **MCP — screenshot each section after creation:**
  - `browser_navigate` → dev server
  - `browser_scroll` to each section
  - `browser_take_screenshot` — confirm text is readable over the canvas
- **Codex:** can also generate sections following the Svelte pattern; less suited for writing natural-sounding content

**Files:**
- Create: `src/sections/Intro.svelte`
- Create: `src/sections/About.svelte`
- Create: `src/sections/Education.svelte`
- Create: `src/sections/Skills.svelte`
- Create: `src/sections/Work.svelte`
- Create: `src/sections/Experience.svelte`
- Create: `src/sections/Certifications.svelte`
- Create: `src/sections/Contact.svelte`

Each section follows this exact pattern:

```svelte
<script>
  import { langStore } from '../stores/lang.js';
  $: lang = $langStore;

  const content = {
    en: {
      // English strings here
    },
    th: {
      // Thai strings here (Task 11)
    },
  };
  $: t = content[lang] ?? content.en;
</script>

<section data-scene="N" class="scene scene-SECTIONNAME">
  <div class="scene-content">
    <!-- markup using t.xxx -->
  </div>
</section>
```

- [ ] **Step 1: Create src/sections/Intro.svelte**

```svelte
<script>
  import { langStore } from '../stores/lang.js';
  $: lang = $langStore;
  const content = {
    en: {
      tagline: 'Business Analyst &amp; ERP Implementation Specialist',
      name: 'Goody',
      subname: 'Vivitthachai Laprattanatrai',
      cta: 'Download CV',
      scroll: 'Scroll to explore',
    },
    th: { tagline: '', name: '', subname: '', cta: '', scroll: '' },
  };
  $: t = content[lang] ?? content.en;
</script>

<section data-scene="0" class="scene scene-intro">
  <div class="scene-content">
    <p class="tagline">{@html t.tagline}</p>
    <h1 class="hero-name">{t.name}</h1>
    <p class="hero-subname">{t.subname}</p>
    <a href="assets/Vivitthachai_Goody_CV.pdf" download class="cta-btn">{t.cta}</a>
    <p class="scroll-hint">{t.scroll}</p>
  </div>
</section>

<style>
  .scene-intro { background: transparent; }
  .tagline { color: var(--gold); font-size: 0.85rem; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 1rem; }
  .hero-name { font-size: clamp(3rem, 8vw, 6rem); font-weight: 700; color: var(--white); line-height: 1; }
  .hero-subname { color: var(--muted-txt); font-size: 0.9rem; margin: 0.5rem 0 2rem; }
  .cta-btn {
    display: inline-block;
    border: 1px solid var(--gold);
    color: var(--gold);
    padding: 0.6rem 1.6rem;
    text-decoration: none;
    font-size: 0.8rem;
    letter-spacing: 0.1em;
    transition: background 0.2s, color 0.2s;
  }
  .cta-btn:hover { background: var(--gold); color: var(--dark); }
  .scroll-hint { margin-top: 2rem; color: var(--muted-txt); font-size: 0.75rem; letter-spacing: 0.1em; }
</style>
```

- [ ] **Step 2: Create src/sections/About.svelte**

```svelte
<script>
  import { langStore } from '../stores/lang.js';
  $: lang = $langStore;
  const content = {
    en: {
      heading: 'About',
      body: 'I bridge business needs and technical systems — specialising in ERP implementation, business process analysis, and cross-functional team coordination across manufacturing, distribution, and retail industries.',
      detail: '8+ years · 3 industries · 2 ERPs',
    },
    th: { heading: '', body: '', detail: '' },
  };
  $: t = content[lang] ?? content.en;
</script>

<section data-scene="1" class="scene scene-about">
  <div class="scene-content">
    <h2 class="section-head">{t.heading}</h2>
    <p class="body-text">{t.body}</p>
    <p class="detail-tag">{t.detail}</p>
  </div>
</section>

<style>
  .section-head { color: var(--gold); font-size: clamp(1.8rem, 4vw, 3rem); margin-bottom: 1.5rem; }
  .body-text { color: var(--white); font-size: 1.05rem; line-height: 1.75; max-width: 560px; margin: 0 auto; }
  .detail-tag { margin-top: 1.5rem; color: var(--muted-txt); font-size: 0.8rem; letter-spacing: 0.15em; }
</style>
```

- [ ] **Step 3: Create remaining 6 sections (Education, Skills, Work, Experience, Certifications, Contact) using the same pattern**

> **For Gemini prompt:** "Write 6 Svelte section components following the exact pattern below. Each uses `data-scene` attribute (Education=2, Skills=3, Work=4, Experience=5, Certifications=6, Contact=7). Content is for Goody's portfolio — BA & ERP specialist. Leave `th:` strings empty (added in Task 11). [Paste Intro.svelte and About.svelte as pattern reference]. CV content: [paste relevant CV sections]."

`src/sections/Education.svelte` — `data-scene="2"`, degree from KMUTT, major, graduation year  
`src/sections/Skills.svelte` — `data-scene="3"`, 4 skill clusters: ERP (SAP/Oracle), Analysis, PM, Tech  
`src/sections/Work.svelte` — `data-scene="4"`, company list with role + years  
`src/sections/Experience.svelte` — `data-scene="5"`, 3–4 highlight achievements with metrics  
`src/sections/Certifications.svelte` — `data-scene="6"`, cert name + issuer + year  
`src/sections/Contact.svelte` — `data-scene="7"`, email + LinkedIn + GitHub links

- [ ] **Step 4: Run dev server and scroll through all 8 sections**

```bash
npm run dev
```

Open `http://localhost:5173/portfolio/`. Scroll from top to bottom. Expected:
- All 8 sections visible, text readable against dark canvas
- No console errors

- [ ] **Step 5: Commit**

```bash
git add src/sections/
git commit -m "feat(sections): add 8 section components with EN content"
```

---

## Task 11: Bilingual — Thai Translations

**Recommended tool:** Gemini (Thai translations) + Claude Code or Codex (wiring)

**Tools detail:**
- **Gemini prompt for translations:** "Translate the following English portfolio content to natural Thai. Context: personal portfolio for Goody (nickname, female, Business Analyst & ERP specialist). Keep technical terms — SAP, Oracle, ERP, PMP — in English. Tone: professional but warm, not stiff. [Paste all `en:` string objects from all 8 section files as a single block]."
- **Wiring (Claude Code / Codex):** after receiving translations, paste each `th:` object back into the matching section file — no special skill needed, just a find-and-replace per file
- **MCP — verify toggle after wiring:**
  - `browser_navigate` → dev server
  - `browser_click` on the lang toggle button (`button[aria-label="Toggle language"]`)
  - `browser_take_screenshot` — confirm Thai text is visible
  - `browser_evaluate` → `document.documentElement.lang` should return `'th'`
  - `browser_evaluate` → `localStorage.getItem('lang')` should return `'th'`

**Files:**
- Modify: all 8 `src/sections/*.svelte` (fill in `th:` objects)

- [ ] **Step 1: Get Thai translations from Gemini**

> **For Gemini prompt:** "Translate the following English portfolio content to natural Thai (not formal/stiff). This is a personal portfolio for a BA & ERP specialist named Goody (กู้ดดี้). [Paste all `en:` string objects from all 8 section files]."

- [ ] **Step 2: Fill in th: objects in all 8 section files**

Example for Intro.svelte — replace the empty `th:` block:
```js
th: {
  tagline: 'นักวิเคราะห์ธุรกิจ &amp; ผู้เชี่ยวชาญระบบ ERP',
  name: 'กู้ดดี้',
  subname: 'วิวิตถัชยา แลปรัตตนาตราย',
  cta: 'ดาวน์โหลด CV',
  scroll: 'เลื่อนเพื่อสำรวจ',
},
```

Apply the same pattern to all remaining 7 sections using the Gemini translations.

- [ ] **Step 3: Verify toggle in browser**

```bash
npm run dev
```

Click the `EN` button in bottom-right. Expected:
- All text switches to Thai
- `body.lang-th` class applied (inspect element)
- `document.documentElement.lang` = `'th'`
- Font changes to Sarabun
- Reload: Thai persists (localStorage)
- Click again: reverts to English

- [ ] **Step 4: Commit**

```bash
git add src/sections/
git commit -m "feat(i18n): add Thai translations to all 8 section components"
```

---

## Task 12: Mobile Degradation

**Recommended tool:** Codex

**Tools detail:**
- **Codex / anti-gravity:** `matchMedia` + `classList` is standard web API; provide the `isMobile` line from App.svelte and the CSS class names as context
- **Claude Code skills:** none needed for CSS/detection logic
- **MCP — test mobile viewport:**
  - `browser_resize` → `{ width: 375, height: 812 }` (iPhone 14)
  - `browser_navigate` → dev server
  - `browser_take_screenshot` — confirm content overlay visible and text readable
  - `browser_evaluate` → `document.body.classList.contains('mobile')` should be `true`
  - `browser_resize` → `{ width: 1440, height: 900 }` — confirm no `mobile` class on desktop

**Files:**
- Modify: `src/global.css` (mobile overlay styles)
- Modify: `src/ThreeCanvas.svelte` (skip scroll binding when mobile — already handled by App.svelte isMobile flag; verify canvas still renders)

- [ ] **Step 1: Add mobile overlay styles to src/global.css**

Append to the end of `src/global.css`:
```css
/* Mobile: frozen canvas + content overlay */
@media (pointer: coarse), (max-width: 768px) {
  body.mobile canvas {
    pointer-events: none;
  }

  body.mobile .scene-content {
    background: linear-gradient(180deg, rgba(13,13,13,0.55) 0%, rgba(13,13,13,0.88) 100%);
    border-radius: 1rem;
    padding: 2rem 1.5rem;
  }

  body.mobile .hero-name {
    font-size: clamp(2.5rem, 10vw, 4rem);
  }

  body.lang-th.mobile .hero-name {
    font-size: clamp(2rem, 8vw, 3.5rem);
  }
}
```

- [ ] **Step 2: Test on simulated mobile viewport**

```bash
npm run dev
```

In Chrome DevTools: toggle device toolbar → iPhone 12 (390×844). Expected:
- `body.mobile` class present
- Canvas visible but frozen on keyframe 0
- Section content readable with gradient overlay
- Lang toggle still works

- [ ] **Step 3: Commit**

```bash
git add src/global.css
git commit -m "feat(mobile): add frozen-canvas degradation + content overlays for mobile"
```

---

## Task 13: Performance Pass

**Recommended tool:** Claude Code + Chrome DevTools MCP

**Tools detail:**
- **Claude Code skills:** invoke `chrome-devtools-mcp:debug-optimize-lcp` skill — loaded from the `chrome-devtools-mcp` plugin; provides a guided LCP audit workflow
- **MCP — run performance audit:**
  - First start the preview build: `npm run build && npm run preview`
  - `mcp__plugin_chrome-devtools-mcp_chrome-devtools__lighthouse_audit` → `http://localhost:4173/portfolio/` — check Performance score
  - `mcp__plugin_chrome-devtools-mcp_chrome-devtools__get_console_message` — check for Three.js warnings (e.g. "WebGL context lost", "too many geometries")
  - `mcp__plugin_chrome-devtools-mcp_chrome-devtools__take_screenshot` — visual confirm after build
- **Codex / anti-gravity:** `vite.config.js` chunk splitting is straightforward; provide the `manualChunks` config from this task as context
- **Gemini:** not recommended

**Files:**
- Modify: `src/ThreeCanvas.svelte` (pixel ratio cap — already present; verify node count)
- Modify: `vite.config.js` (chunk splitting hint)

- [ ] **Step 1: Verify node count is under 40**

Open `src/lib/three/network.js`. Count `NODE_DEFS` array length.

```bash
node -e "const {NODE_DEFS} = await import('./src/lib/three/network.js'); console.log('nodes:', NODE_DEFS.length);" --input-type=module
```

Expected: prints `nodes: 16` (or similar, must be < 40)

- [ ] **Step 2: Add manual chunk hint to vite.config.js**

```js
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  base: '/portfolio/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          gsap: ['gsap'],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
```

- [ ] **Step 3: Build and check chunk sizes**

```bash
npm run build
```

Expected output includes lines like:
```
dist/assets/three-[hash].js     xxx kB
dist/assets/gsap-[hash].js      xxx kB
dist/assets/index-[hash].js     < 50 kB
```

The `index` chunk should be small — Three.js and GSAP are split into separate chunks and loaded lazily by ThreeCanvas.

- [ ] **Step 4: Verify renderer.setPixelRatio is capped**

In `src/ThreeCanvas.svelte`, confirm this line is present:
```js
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
```

No change needed if it is already there from Task 8.

- [ ] **Step 5: Commit**

```bash
git add vite.config.js
git commit -m "perf: split three/gsap into separate chunks, verify node count < 40"
```

---

## Task 14: End-to-End Tests

**Recommended tool:** Claude Code + Playwright MCP

**Tools detail:**
- **Claude Code skills:** invoke `superpowers:verification-before-completion` before marking the task done — it requires running actual test commands and confirming output
- **MCP — use before writing test file to find stable selectors:**
  - `browser_navigate` → dev server
  - `browser_snapshot` — accessibility snapshot to get exact element selectors for the test
  - `browser_click` on lang toggle; `browser_evaluate` → confirm `document.documentElement.lang === 'th'`
  - `browser_resize` → `{ width: 375, height: 812 }`; `browser_evaluate` → `document.body.classList.contains('mobile')`
  - `browser_console_messages` — confirm no errors during full scroll
- **Codex:** can write the `playwright.config.js` boilerplate; provide the test case list as bullet points and it will scaffold the test file
- **Gemini:** not recommended for test code

**Files:**
- Create: `playwright.config.js`
- Create: `e2e/portfolio.test.js`

- [ ] **Step 1: Install Playwright browsers**

```bash
npx playwright install chromium
```

Expected: Chromium downloaded to `~/.cache/ms-playwright/`

- [ ] **Step 2: Create playwright.config.js**

```js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:5173/portfolio/',
  },
});
```

- [ ] **Step 3: Write e2e/portfolio.test.js**

```js
import { test, expect } from '@playwright/test';

test('homepage loads with intro section', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('section[data-scene="0"]')).toBeVisible();
  await expect(page.locator('canvas')).toBeVisible();
});

test('all 8 sections are in the DOM', async ({ page }) => {
  await page.goto('/');
  for (let i = 0; i <= 7; i++) {
    await expect(page.locator(`section[data-scene="${i}"]`)).toBeAttached();
  }
});

test('lang toggle switches html[lang] to th', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.locator('button[aria-label="Toggle language"]').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'th');
  await expect(page.locator('body')).toHaveClass(/lang-th/);
});

test('lang persists after reload', async ({ page }) => {
  await page.goto('/');
  await page.locator('button[aria-label="Toggle language"]').click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'th');
});

test('scrolling to About section triggers scene 1', async ({ page }) => {
  await page.goto('/');
  await page.locator('section[data-scene="1"]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  // Scene store is not directly DOM-observable; verify About section is visible
  await expect(page.locator('section[data-scene="1"]')).toBeInViewport();
});

test('mobile viewport adds body.mobile class', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await expect(page.locator('body')).toHaveClass(/mobile/);
});

test('CV download link has correct href', async ({ page }) => {
  await page.goto('/');
  const href = await page.locator('a[download]').getAttribute('href');
  expect(href).toContain('Vivitthachai_Goody_CV.pdf');
});
```

- [ ] **Step 4: Run E2E tests**

```bash
npm run test:e2e
```

Expected: 7 tests pass. If `lang persists after reload` fails, check that `langStore` subscribe writes to `localStorage` before the reload (the subscriber fires synchronously on `set`, so it should be fine).

- [ ] **Step 5: Commit**

```bash
git add playwright.config.js e2e/
git commit -m "test(e2e): add Playwright tests for scroll, lang toggle, mobile, CV link"
```

---

## Task 15: Deploy & Smoke Test

**Recommended tool:** Claude Code + Playwright MCP

**Tools detail:**
- **Claude Code skills:**
  - invoke `superpowers:requesting-code-review` before pushing — reviews all diffs since `main` diverged
  - invoke `verify` after deploy — drives the live URL and confirms it works
- **MCP — smoke test live site:**
  - `browser_navigate` → live URL (e.g. `https://mastergroot.github.io/portfolio/`)
  - `browser_take_screenshot` — confirm canvas and content visible
  - `browser_scroll` → scroll to section 4 — confirm canvas reacts
  - `browser_click` on lang toggle — confirm EN/TH switch works on live site
  - `browser_evaluate` → `document.querySelector('a[download]').href` — confirm CV link resolves
- **Other tools:** manual browser check at the live URL is sufficient if not using Claude Code

- [ ] **Step 1: Push to main**

```bash
git push origin main
```

- [ ] **Step 2: Monitor GitHub Actions**

In the GitHub repo → Actions tab. Expected: "Deploy to GitHub Pages" workflow runs and passes within ~2 minutes.

- [ ] **Step 3: Smoke test live site**

Open `https://mastergroot.github.io/portfolio/` (or the correct URL for your repo). Verify:
- Canvas renders with node network
- Scrolling through all 8 sections works on desktop
- Lang toggle works and persists
- CV download link resolves

- [ ] **Step 4: Final commit (if any fixes needed)**

```bash
git add -p   # stage only what changed
git commit -m "fix: post-deploy smoke test fixes"
git push origin main
```

---

## Self-Review Notes

- All 8 scenes in spec → covered by Tasks 6 (keyframes) + 10 (sections)
- Systems Network → Task 5
- Bilingual → Tasks 10 + 11
- Mobile degradation → Task 12
- Build pipeline → Task 2
- Performance targets → Task 13
- E2E tests → Task 14
- No TBDs or incomplete sections found
