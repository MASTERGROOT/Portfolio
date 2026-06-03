# Goody — Personal Portfolio Website

Personal portfolio for Vivitthachai "Goody" Laprattanatrai — Business Analyst & ERP Implementation Specialist, Bangkok.

Live at: [mastergroot.github.io](https://mastergroot.github.io)

## Stack

Plain HTML + CSS + vanilla JS. No build step, no npm, no frameworks.
Google Fonts CDN (Cormorant Garamond, Inter, Sarabun).

## Running Locally

Open `index.html` directly in any browser — no server required.

```bash
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

## Deploying to GitHub Pages

1. Ensure the repo is named `mastergroot.github.io` (GitHub Pages user site).
2. Push all files to the `main` branch:
   ```bash
   git push origin main
   ```
3. In the repo → Settings → Pages → Source: `main` branch, `/ (root)`.
4. The site publishes at `https://mastergroot.github.io` within ~1 minute.

## File Structure

```
/
├── index.html                   ← full page
├── style.css                    ← all styles
├── script.js                    ← all JS (bilingual, animations)
├── assets/
│   └── Vivitthachai_Goody_CV.pdf
├── design_handoff_portfolio/    ← source reference (not served)
│   ├── Goody Portfolio.html
│   └── README.md
└── docs/superpowers/            ← spec + plan
```

## Bilingual Support

The site supports English and Thai. Click the **EN | TH** pill in the top-right navbar to toggle. The choice is saved in `localStorage`.
