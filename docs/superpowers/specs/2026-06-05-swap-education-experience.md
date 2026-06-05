# Spec: Swap Education and Experience Section Order

**Date:** 2026-06-05  
**Status:** Approved

## Goal

Move the Experience section to appear before Education in the page scroll order, while keeping each section's 3D visual theme intact.

## Current Order

Intro → About → **Education** → Skills → Work → **Experience** → Certifications → Contact

## Target Order

Intro → About → **Experience** → Skills → Work → **Education** → Certifications → Contact

## Design

**One file change: `src/App.svelte`**

Swap `<Education />` and `<Experience />` component tags in the template. No other files change.

- `Education.svelte` keeps `data-scene="2"` (uni cluster camera)
- `Experience.svelte` keeps `data-scene="5"` (work nodes camera)

Scene numbers fire out of order as you scroll (0→1→5→3→4→2→6→7). This is intentional — each section drives its own visual, so the out-of-order firing is correct behaviour.

## Files Changed

| File | Change |
|------|--------|
| `src/App.svelte` | Swap `<Education />` and `<Experience />` in template |

## Out of Scope

- No changes to `data-scene` values
- No changes to `keyframes.js`
- No changes to section content or styles
