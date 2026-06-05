# Swap Education/Experience Section Order Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Swap Education and Experience so Experience appears after About and Education appears after Work.

**Architecture:** One-line swap in `src/App.svelte`. Each section keeps its own `data-scene` value, so their Three.js camera keyframes are unchanged — visuals stay tied to content, not DOM position.

**Tech Stack:** Svelte, Vite, Three.js, Vitest, Playwright

---

### Task 1: Swap section order in App.svelte

**Files:**
- Modify: `src/App.svelte:42-45`

- [ ] **Step 1: Open `src/App.svelte` and locate the section block**

Current lines 40–47:
```svelte
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
```

- [ ] **Step 2: Swap `<Education />` and `<Experience />`**

Replace those lines so the block reads:
```svelte
<main>
  <Intro />
  <About />
  <Experience />
  <Skills />
  <Work />
  <Education />
  <Certifications />
  <Contact />
</main>
```

No other changes — imports, `data-scene` values, and keyframes are all untouched.

- [ ] **Step 3: Run the dev server and verify visually**

```bash
npm run dev
```

Open `http://localhost:5173/Portfolio/` and scroll through all sections. Confirm:
- Experience content appears before Skills
- Education content appears after Work
- The 3D background transitions correctly at each section (each section still triggers its own camera angle)

- [ ] **Step 4: Run unit tests**

```bash
npm test
```

Expected: all tests pass (no test references section DOM order directly).

- [ ] **Step 5: Commit**

```bash
git add src/App.svelte
git commit -m "feat(layout): swap Education and Experience section order"
```
