# Project Instructions

This file provides guidance to AI coding agents when working with code in this repository.

# Global Rules

All identity, response, code style, memory, and session protocols are defined in:
/Users/goody/AI/AGENTS.md — read it at session start.

# Plugin Loading
Claude Code is the single source of truth for plugin installation. At session start, load plugins silently using the bridge rules in `/Users/goody/AI/plugin-loading.md`.

Operational summary:
1. Read `~/.claude/plugins/installed_plugins.json`.
2. If `.claude/settings.json` exists in the current project root, read `enabledPlugins` and resolve each plugin's `installPath` from `installed_plugins.json`.
3. Also load user-scoped plugins from `installed_plugins.json`.
4. For each plugin `installPath`, read existing `AGENTS.md`, `skills/*/SKILL.md`, `commands/*.md`, `agents/*.md`, and `.mcp.json` according to `/Users/goody/AI/plugin-loading.md`.
5. Do not install, update, download, or report plugin loading unless asked.

# Skill Set

Shared global skills live in `/Users/goody/AI/skills/`; discover them from `/Users/goody/AI/skills/_index.md` and read the matching `SKILL.md` before use.

Currently indexed global skills:
- `handoff`
- `checkpoint`
- `distill`
- `wire-tool`
- `create-skill`
- `sync-memory`
- `memory-audit`
- `n8n-update-workflow`
- `goody-guidelines`
- `strategic-compact`
- `project-init`

Project plugins in `.claude/settings.json` may also provide skills, including setup, browser verification, frontend design, code review, simplification, feature development, security guidance, memory, CodeRabbit, and Claude instruction management.

## Project

Personal portfolio for Vivitthachai "Goody" Laprattanatrai — Business Analyst & ERP Implementation Specialist.

**Live:** https://mastergroot.github.io  
**Deploy:** `git push origin main` → GitHub Pages publishes from `main` root within ~1 min.

## Running Locally

No build step. Open `index.html` directly:

```bash
open index.html
```

## Architecture

Three files, no dependencies, no bundler:

| File | Purpose |
|---|---|
| `index.html` | Full page — every visible text node wrapped in a bilingual element |
| `style.css` | All styles; verbatim source extraction + bilingual additions at end |
| `script.js` | ES5 IIFE — bilingual toggle, hero animation, cursor glow, scroll effects |
| `assets/Vivitthachai_Goody_CV.pdf` | CV download, linked from hero CTA and contact section |

`docs/superpowers/` — spec and implementation plan; reference only.  
`docs/igloo-reverse-engineering.md` — igloo.inc full teardown; reference for future WebGL redesign.

## Bilingual System

**Pattern for all text nodes:**
```html
<span data-en="English" data-th="ภาษาไทย"></span>
```
Elements start empty in HTML. `setLang(lang)` fills them using `el.innerHTML` (not `innerText`) — this is intentional so embedded `<em>`, `<b>`, `<br>` in attribute values render as HTML.

**Hero headline is a different pattern** — uses `data-anim` / `data-anim-th` on `.line` spans, NOT `data-en`/`data-th`. `buildHeroLines(lang, animate)` builds per-character `<span class="char">` spans for the stagger animation. `setLang()` does not touch these elements.

**Thai font:** `body.lang-th` class switches the font stack to Sarabun. CSS suppresses italic on headings and `.section-head em` / `.contact-head em` because Thai has no italic form.

**Persistence:** `localStorage.getItem('lang')` — key `'lang'`, default `'en'`.

## CSS Conventions

- 2-space indentation throughout (matches verbatim extraction from `<style>` tag in source HTML)
- Bilingual additions are appended at the end of `style.css`, also 2-space indented
- CSS custom properties defined in `:root` — use `var(--gold-lt)`, `var(--muted)`, `var(--muted-txt)`, etc.

## JS Conventions

- ES5-compatible IIFE (`var`, no arrow functions, no template literals, no `const`/`let`)
- Null-guard all DOM queries: `var glow = document.getElementById('cursor-glow'); if (glow && ...) { ... }`
- Cursor glow and particle field only activate under `(pointer:fine)` and when `prefers-reduced-motion` is not set

Quick syntax check (no browser needed): `node --check script.js`

## Verification

The Playwright MCP plugin is installed. For full EN/TH toggle verification:

```bash
npx playwright test   # if a test file exists
# or drive via Playwright MCP in Claude Code
```

Key checks: EN mode renders, navbar scroll-reveals at 55% viewport height, TH toggle sets `body.lang-th` + `document.documentElement.lang='th'` + persists in localStorage, CV `<a>` hrefs resolve, mobile 375px layout holds.

> **Gotcha:** `#lang-toggle` is inside the navbar — always scroll past 55% viewport before clicking it in automated tests, or the navbar is hidden and the click is a no-op.

> **Gotcha:** Playwright MCP blocks `file://` protocol. Always start an HTTP server first: `python3 -m http.server 8767` (run from portfolio root), then navigate to `http://localhost:8767`.

## Accessibility Notes

- Disabled project links: `<a href="#" class="proj-link" aria-disabled="true" tabindex="-1">` — both attributes required; `tabindex="-1"` prevents keyboard focus on non-functional links.
- Language toggle: `<button id="lang-toggle" data-lang="en" aria-label="Switch language">` — `data-lang` drives CSS highlight via attribute selector.

## Parallax System

All parallax gated behind `if (!reduced)` (reuses the existing `var reduced` flag at top of IIFE).

**Hero rings:** adjust `style.top` via `calc(50% + Xpx)` — NOT `style.transform`. The rings already use `animation: spin` (CSS keyframes with `transform: rotate()`). Setting JS `transform` would override the spin. Changing `top` avoids the conflict.

**`#particles`:** extended to `top: -20%; bottom: -20%` (was `inset: 0`) to prevent a visible empty band at the top when `translateY` pushes the layer down during scroll.

**Hero elements:** use raw `scrollY`-based parallax (`sy * rate`).  
**Section blobs:** use viewport-offset formula: `((rect.top + rect.height/2) - vh/2) * rate` — not raw scrollY, otherwise offsets grow huge by the time user reaches lower sections.

**`data-parallax` attribute:** added to all `.blob` divs in HTML; rate values 0.18–0.22.

## Known Issues

- **Mobile TH hero text clips (375px):** Thai characters are denser than Latin at `font-size: clamp(2.8rem, 8.5vw, 7rem)`. Right edge clips slightly on narrow phones. Fix: lower the clamp floor under `body.lang-th .hero-head` for mobile. Not yet addressed.

## Memory & Sessions

- `.remember/` — session-scoped memory buffer (Remember plugin). Do not manually edit. Synthesize to `/Users/goody/AI/memory/` at session end using the `remember` skill.
- Persistent memory lives in `/Users/goody/AI/memory/proj-portfolio.md`.
