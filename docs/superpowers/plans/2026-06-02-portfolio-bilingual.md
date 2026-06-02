# Portfolio Website — Bilingual Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the single-file `design_handoff_portfolio/Goody Portfolio.html` into `index.html` + `style.css` + `script.js`, add full EN/TH bilingual support with a language toggle pill in the navbar, and copy the CV PDF to `assets/`.

**Architecture:** All CSS extracted verbatim to `style.css` with Sarabun font + toggle/lang-th additions. All JS extracted to `script.js` with `buildHeroLines()`, `setLang()`, and toggle click handler added. `index.html` wraps every visible text node in `<span data-en="..." data-th="...">` elements; JS sets `innerHTML` on page load and on toggle. Hero headline handled separately via `data-anim` / `data-anim-th` attributes because it builds per-character spans at runtime.

**Tech Stack:** Vanilla HTML5, CSS3 (custom properties, Grid, Flexbox), vanilla JS (ES5-compatible IIFE), Google Fonts CDN (Cormorant Garamond + Inter + Sarabun).

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `index.html` | Create | Full page HTML with bilingual data attributes |
| `style.css` | Create | All CSS from handoff + Sarabun + lang-th + toggle button styles |
| `script.js` | Create | All JS from handoff + buildHeroLines + setLang + toggle handler |
| `assets/Vivitthachai_Goody_CV.pdf` | Copy | Downloadable CV |
| `README.md` | Update | Project description, local run, GitHub Pages deploy |

Source reference (read-only, not served): `design_handoff_portfolio/Goody Portfolio.html`

---

## Key Design Decisions

**Bilingual mechanism:** `data-en` / `data-th` on every text-bearing element. `setLang(lang)` walks all `[data-en]` elements and sets `innerHTML` (not `innerText`, to preserve `<b>`/`<em>` markup in about/experience paragraphs). Attribute values that contain markup use `&lt;`/`&gt;` encoding.

**Hero headline exception:** The hero lines use JS to split text into per-character `<span class="char">` for the stagger animation. These use `data-anim` (EN) and `data-anim-th` (TH) attributes. `buildHeroLines(lang, animate)` rebuilds them — animated on initial load (EN only, respects `prefers-reduced-motion`), instant on language switch.

**lang-th font switch:** When TH is active, `body.classList.add('lang-th')`. CSS `.lang-th` switches body font to Sarabun, which covers both Thai script and Latin cleanly.

**localStorage persistence:** Key `'lang'`, default `'en'`.

---

## Task 1: Assets and empty file scaffold

**Files:**
- Create: `index.html`
- Create: `style.css`
- Create: `script.js`
- Create: `assets/` directory
- Copy: `design_handoff_portfolio/Vivitthachai_Goody_CV.pdf` → `assets/Vivitthachai_Goody_CV.pdf`

- [ ] **Step 1: Create directory and copy PDF**

```bash
mkdir -p assets
cp "design_handoff_portfolio/Vivitthachai_Goody_CV.pdf" assets/
```

- [ ] **Step 2: Create empty placeholder files**

```bash
touch index.html style.css script.js
```

- [ ] **Step 3: Commit scaffold**

```bash
git add assets/Vivitthachai_Goody_CV.pdf index.html style.css script.js
git commit -m "chore(scaffold): init file structure and copy CV PDF to assets"
```

---

## Task 2: style.css — extract CSS and add bilingual additions

**Files:**
- Write: `style.css`

All CSS is copied verbatim from lines 11–813 of `design_handoff_portfolio/Goody Portfolio.html` (everything inside `<style>…</style>`). Then append the following additions.

- [ ] **Step 1: Copy CSS from source**

Open `design_handoff_portfolio/Goody Portfolio.html`, select everything between `<style>` and `</style>` (lines 11–813), paste into `style.css`.

The Google Fonts `<link>` tag stays in `index.html` — do not copy it into the CSS file.

- [ ] **Step 2: Add Sarabun to the Google Fonts URL (done in index.html head — see Task 3)**

No CSS change needed; the font is loaded via `<link>` in `<head>`.

- [ ] **Step 3: Append lang-th and toggle button styles to end of style.css**

```css
/* ===== Bilingual: Thai font switch ===== */
body.lang-th {
  font-family: 'Sarabun', 'Inter', system-ui, sans-serif;
}
/* Keep serif headings legible in Thai — Sarabun handles fallback gracefully */
body.lang-th h1,
body.lang-th h2,
body.lang-th h3 {
  font-family: 'Sarabun', Georgia, serif;
  font-style: normal; /* italic glyphs don't exist in Thai */
}
body.lang-th .section-head em,
body.lang-th .contact-head em {
  font-style: normal;
}

/* ===== Language toggle pill ===== */
.lang-toggle {
  background: none;
  border: 1px solid var(--muted);
  border-radius: 100px;
  padding: 4px 12px;
  cursor: pointer;
  font-family: var(--sans);
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: border-color 0.35s var(--ease-soft);
  margin-left: 8px;
  color: var(--muted-txt);
}
.lang-toggle:hover { border-color: var(--gold-lt); }
.lt-sep { color: var(--muted); }
.lt-en,
.lt-th { transition: color 0.3s var(--ease-soft); }

/* Active language is gold, inactive is muted */
.lang-toggle[data-lang="en"] .lt-en { color: var(--gold-lt); }
.lang-toggle[data-lang="en"] .lt-th { color: var(--muted-txt); }
.lang-toggle[data-lang="th"] .lt-th { color: var(--gold-lt); }
.lang-toggle[data-lang="th"] .lt-en { color: var(--muted-txt); }
```

- [ ] **Step 4: Commit style.css**

```bash
git add style.css
git commit -m "feat(styles): extract CSS from handoff and add bilingual lang-th + toggle styles"
```

---

## Task 3: index.html — head, navbar, cursor glow div

**Files:**
- Write: `index.html` (head + opening body elements)

- [ ] **Step 1: Write the `<head>` and `<body>` opening with cursor glow div**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Vivitthachai (Goody) — Business Analyst &amp; ERP Implementation Specialist</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Inter:wght@300;400;500;600;700&family=Sarabun:wght@300;400;500;600&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="style.css" />
</head>
<body>

<div id="cursor-glow"></div>
```

- [ ] **Step 2: Write the navbar with bilingual spans and lang toggle**

```html
<!-- NAV -->
<nav id="navbar">
  <a href="#hero" class="nav-logo">Goody<span>.</span></a>
  <div class="nav-links">
    <a href="#about"><b>01</b><span data-en="About" data-th="เกี่ยวกับ"></span></a>
    <a href="#skills"><b>02</b><span data-en="Skills" data-th="ทักษะ"></span></a>
    <a href="#projects"><b>03</b><span data-en="Work" data-th="ผลงาน"></span></a>
    <a href="#experience"><b>04</b><span data-en="Experience" data-th="ประสบการณ์"></span></a>
    <a href="#contact"><b>05</b><span data-en="Contact" data-th="ติดต่อ"></span></a>
    <button class="lang-toggle" id="lang-toggle" data-lang="en" aria-label="Switch language">
      <span class="lt-en">EN</span>
      <span class="lt-sep">|</span>
      <span class="lt-th">TH</span>
    </button>
  </div>
</nav>
```

Note: the nav-links `<a>` tags use `<b>` for the number and a `<span>` for the word. There is a space between `<b>` and `<span>` — match the original gap (the original used `<b>01</b>About` with no space but the CSS handles it via `margin-right: 5px` on `b`).

- [ ] **Step 3: Commit progress**

```bash
git add index.html
git commit -m "feat(html): add head, navbar with bilingual spans and lang toggle"
```

---

## Task 4: index.html — Hero section

**Files:**
- Write: `index.html` (append Hero section)

The hero headline uses `data-anim` (EN) and `data-anim-th` (TH) — JS rebuilds the character spans. All other hero text uses `data-en` / `data-th`.

- [ ] **Step 1: Append Hero section HTML**

```html
<!-- HERO -->
<section id="hero" data-screen-label="Hero">
  <div id="particles"></div>
  <!-- concentric rings (decorative) -->
  <div class="geo ring" style="width:560px;height:560px;top:50%;left:50%;margin:-280px 0 0 -280px;animation:spin 90s linear infinite;"></div>
  <div class="geo ring" style="width:820px;height:820px;top:50%;left:50%;margin:-410px 0 0 -410px;animation:spin 140s linear infinite reverse;"></div>
  <div class="geo ring" style="width:1120px;height:1120px;top:50%;left:50%;margin:-560px 0 0 -560px;border-color:rgba(212,160,23,0.05);animation:spin 200s linear infinite;"></div>

  <div class="wrap">
    <div class="hero-pre">
      <span data-en="Business Analyst" data-th="นักวิเคราะห์ธุรกิจ"></span><span class="sep">·</span><span data-en="ERP Implementation Specialist" data-th="ผู้เชี่ยวชาญ ERP"></span><span class="sep">·</span><span data-en="Data Analyst" data-th="นักวิเคราะห์ข้อมูล"></span>
    </div>
    <!-- data-anim = EN text for char animation; data-anim-th = TH text for lang switch -->
    <h1 class="hero-head">
      <span class="line" data-anim="Turning Complex Systems" data-anim-th="เปลี่ยนระบบที่ซับซ้อน"></span>
      <span class="line" data-anim="Into Measurable Impact" data-anim-th="ให้กลายเป็นผลลัพธ์ที่วัดได้"></span>
    </h1>
    <p class="hero-sub">
      <b><span data-en="&ldquo;Goody&rdquo; Vivitthachai Laprattanatrai" data-th="&ldquo;Goody&rdquo; Vivitthachai Laprattanatrai"></span></b><span data-en=" &mdash; Business Analyst &amp; ERP Implementation Specialist based in Bangkok, delivering full-cycle ERP rollouts for construction and project-based organizations." data-th=" &mdash; นักวิเคราะห์ธุรกิจและผู้เชี่ยวชาญ ERP ประจำกรุงเทพฯ ดูแลการ implement ERP แบบครบวงจรสำหรับองค์กรก่อสร้างและงานโครงการ"></span>
    </p>
    <div class="cta-row">
      <a href="#projects" class="btn btn-fill"><span data-en="View My Work" data-th="ดูผลงาน"></span> <span class="arrow">→</span></a>
      <a href="assets/Vivitthachai_Goody_CV.pdf" target="_blank" class="btn btn-out"><span data-en="Download CV" data-th="ดาวน์โหลด CV"></span> <span class="arrow">↓</span></a>
    </div>
  </div>

  <div class="scroll-ind">
    <span data-en="Scroll" data-th="เลื่อนลง"></span>
    <div class="scroll-line"></div>
  </div>
</section>

<div class="divider"></div>
```

Also add this rule to `style.css` (the original used inline `<span>` for separators with a class; we now use `.sep`):

```css
/* hero-pre separator dots */
.hero-pre .sep { color: var(--muted-txt); margin: 0 10px; }
```

(The original used `.hero-pre span` for this, but our spans now carry data-en/data-th. `.sep` keeps the intent clear and avoids the selector collision.)

- [ ] **Step 2: Commit**

```bash
git add index.html style.css
git commit -m "feat(html): add hero section with bilingual data attributes"
```

---

## Task 5: index.html — About section

**Files:**
- Write: `index.html` (append About section)

The about body paragraphs contain `<b>` and `<em>` inline formatting. These are stored as HTML strings in the data attributes (tags encoded as `&lt;`/`&gt;`). JS uses `innerHTML` to set them.

- [ ] **Step 1: Append About section HTML**

```html
<!-- ABOUT -->
<section id="about" data-screen-label="About">
  <div class="blob" style="width:420px;height:420px;top:10%;right:-120px;background:rgba(212,160,23,0.07);"></div>
  <div class="wrap">
    <div class="about-grid">
      <div class="about-left reveal">
        <div class="big-num">01</div>
        <div class="label"><span data-en="About" data-th="เกี่ยวกับ"></span></div>
      </div>
      <div class="about-body">
        <h2 class="section-head reveal"><span data-en="Where Civil Engineering&lt;br /&gt;Meets &lt;em&gt;Data&lt;/em&gt;" data-th="เมื่อวิศวกรรมโยธา&lt;br /&gt;พบกับ &lt;em&gt;ข้อมูล&lt;/em&gt;"></span></h2>
        <p class="reveal d1" data-en="My path didn&rsquo;t start in spreadsheets &mdash; it started in &lt;b&gt;structures&lt;/b&gt;. A Bachelor of Engineering in &lt;em&gt;Civil Engineering&lt;/em&gt; from Kasetsart University taught me how complex systems hold together under pressure, and how a single overlooked detail cascades into real-world consequences." data-th="เส้นทางของผมไม่ได้เริ่มจากตาราง Excel &mdash; แต่เริ่มจาก&lt;b&gt;โครงสร้าง&lt;/b&gt; ปริญญาตรีวิศวกรรมศาสตร์สาขา&lt;em&gt;วิศวกรรมโยธา&lt;/em&gt;จากมหาวิทยาลัยเกษตรศาสตร์ สอนให้ผมเข้าใจว่าระบบที่ซับซ้อนยึดโยงกันอยู่ได้อย่างไรภายใต้แรงกดดัน และรายละเอียดที่พลาดไปเพียงจุดเดียวอาจส่งผลกระทบต่อโลกจริงได้"></p>
        <p class="reveal d2" data-en="That systems thinking translated naturally into &lt;b&gt;ERP and business analysis&lt;/b&gt;. At Builk One Group, I lead full-cycle implementations of &lt;b&gt;POJJAMAN ERP&lt;/b&gt; for &lt;b&gt;10+ clients&lt;/b&gt; across construction and project-based industries &mdash; owning every phase from requirements discovery through go-live and post-launch support across &lt;b&gt;8 modules&lt;/b&gt;." data-th="ความคิดเชิงระบบนั้นแปลงตัวเองเข้าสู่โลกของ&lt;b&gt;ERP และการวิเคราะห์ธุรกิจ&lt;/b&gt;ได้อย่างเป็นธรรมชาติ ที่ Builk One Group ผมนำการ implement &lt;b&gt;POJJAMAN ERP&lt;/b&gt; แบบครบวงจรให้กับลูกค้า&lt;b&gt;กว่า 10 ราย&lt;/b&gt;ในอุตสาหกรรมก่อสร้างและงานโครงการ ดูแลทุกขั้นตอนตั้งแต่ discovery ไปจนถึง go-live และ support หลัง launch ครอบคลุม&lt;b&gt;8 โมดูล&lt;/b&gt;"></p>
        <p class="reveal d3" data-en="I work at the intersection of &lt;b&gt;ERP, finance operations, and data analytics&lt;/b&gt; &mdash; running requirements workshops with C-level stakeholders, mapping AS-IS / TO-BE processes, and turning operational complexity into &lt;em&gt;measurable, repeatable impact&lt;/em&gt;." data-th="ผมทำงานอยู่ที่จุดตัดระหว่าง&lt;b&gt;ERP การเงิน และการวิเคราะห์ข้อมูล&lt;/b&gt; &mdash; จัดทำ workshops รวบรวมความต้องการจากผู้บริหาร C-level ทำแผนผัง AS-IS/TO-BE และเปลี่ยนความซับซ้อนของกระบวนการงานให้กลายเป็น&lt;em&gt;ผลลัพธ์ที่วัดได้และทำซ้ำได้&lt;/em&gt;"></p>
        <div class="pills reveal d4">
          <div class="pill"><b>10+</b> <span data-en="ERP Clients" data-th="ลูกค้า ERP"></span></div>
          <div class="pill"><b>2+</b> <span data-en="Years BA Experience" data-th="ปี ประสบการณ์ BA"></span></div>
          <div class="pill"><b>8</b> <span data-en="ERP Modules" data-th="ERP โมดูล"></span></div>
          <div class="pill"><span data-en="Bangkok, Thailand" data-th="กรุงเทพฯ ประเทศไทย"></span></div>
          <div class="pill"><span data-en="Open to Remote" data-th="พร้อมทำงาน Remote"></span></div>
        </div>
      </div>
    </div>
  </div>
</section>

<div class="divider"></div>
```

Note on `h2.section-head`: the span carries the heading HTML including `<em>`. The `innerHTML` assignment will render `<em>Data</em>` as a styled italic tag correctly. The heading already has `h2.section-head em { color: var(--gold-lt); }` in the CSS.

Note on `<p>` tags: `data-en` and `data-th` are placed directly on the `<p>` element. `setLang` sets `el.innerHTML` which fills the paragraph content. The `reveal` class and `d1–d4` delay classes remain on the `<p>` and are not affected by innerHTML assignment.

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat(html): add about section with bilingual data attributes"
```

---

## Task 6: index.html — Skills section

**Files:**
- Write: `index.html` (append Skills section)

- [ ] **Step 1: Append Skills section HTML**

```html
<!-- SKILLS -->
<section id="skills" data-screen-label="Skills">
  <div class="blob" style="width:480px;height:480px;bottom:5%;left:-160px;background:rgba(212,160,23,0.06);"></div>
  <div class="wrap">
    <div class="head-block">
      <div class="label reveal"><span data-en="02 · Capabilities" data-th="02 · ความสามารถ"></span></div>
      <h2 class="section-head reveal d1"><span data-en="Full-Stack &lt;em&gt;Business Intelligence&lt;/em&gt;" data-th="ความสามารถ&lt;em&gt;วิเคราะห์ธุรกิจ&lt;/em&gt;แบบครบวงจร"></span></h2>
    </div>
    <div class="skill-grid">
      <div class="skill-card reveal" data-tilt>
        <div class="skill-idx">i.</div>
        <h3><span data-en="ERP &amp; Implementation" data-th="ERP และการ Implement"></span></h3>
        <div class="skill-tags">
          <span data-en="POJJAMAN ERP" data-th="POJJAMAN ERP"></span>
          <span data-en="8-Module Configuration" data-th="การตั้งค่า 8 โมดูล"></span>
          <span data-en="UAT" data-th="UAT"></span>
          <span data-en="Go-live &amp; Support" data-th="Go-live และ Support"></span>
          <span data-en="SOP Development" data-th="การพัฒนา SOP"></span>
        </div>
      </div>
      <div class="skill-card reveal d1" data-tilt>
        <div class="skill-idx">ii.</div>
        <h3><span data-en="Business Analysis" data-th="การวิเคราะห์ธุรกิจ"></span></h3>
        <div class="skill-tags">
          <span data-en="Requirements Gathering" data-th="การรวบรวมความต้องการ"></span>
          <span data-en="AS-IS / TO-BE Mapping" data-th="การทำ AS-IS / TO-BE"></span>
          <span data-en="Gap Analysis" data-th="Gap Analysis"></span>
          <span data-en="Stakeholder Management" data-th="การจัดการผู้มีส่วนได้เสีย"></span>
          <span data-en="Change Management" data-th="การบริหารการเปลี่ยนแปลง"></span>
        </div>
      </div>
      <div class="skill-card reveal d2" data-tilt>
        <div class="skill-idx">iii.</div>
        <h3><span data-en="Data &amp; Analytics" data-th="ข้อมูลและการวิเคราะห์"></span></h3>
        <div class="skill-tags">
          <span data-en="SQL" data-th="SQL"></span>
          <span data-en="Python" data-th="Python"></span>
          <span data-en="Power BI" data-th="Power BI"></span>
          <span data-en="Excel (Advanced)" data-th="Excel (ขั้นสูง)"></span>
          <span data-en="Dashboard Design" data-th="การออกแบบ Dashboard"></span>
        </div>
      </div>
      <div class="skill-card reveal d3" data-tilt>
        <div class="skill-idx">iv.</div>
        <h3><span data-en="Tooling &amp; Domain" data-th="เครื่องมือและความเชี่ยวชาญ"></span></h3>
        <div class="skill-tags">
          <span data-en="Xtra Report Designer" data-th="Xtra Report Designer"></span>
          <span data-en="JIRA" data-th="JIRA"></span>
          <span data-en="Confluence" data-th="Confluence"></span>
          <span data-en="AutoCAD" data-th="AutoCAD"></span>
          <span data-en="Finance Ops (AP/AR/Tax)" data-th="การเงิน (AP/AR/ภาษี)"></span>
        </div>
      </div>
    </div>
  </div>
</section>

<div class="divider"></div>
```

Note: `skill-tags span` elements carry `data-en`/`data-th` directly — they are the tags themselves. `setLang` will set `innerHTML` on each, which is safe for plain text strings.

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat(html): add skills section with bilingual data attributes"
```

---

## Task 7: index.html — Projects section

**Files:**
- Write: `index.html` (append Projects section)

- [ ] **Step 1: Append Projects section HTML**

```html
<!-- PROJECTS -->
<section id="projects" data-screen-label="Projects">
  <div class="blob" style="width:520px;height:520px;top:20%;right:-180px;background:rgba(212,160,23,0.05);"></div>
  <div class="wrap">
    <div class="head-block">
      <div class="label reveal"><span data-en="03 · Selected Works" data-th="03 · ผลงานที่เลือกสรร"></span></div>
      <h2 class="section-head reveal d1"><span data-en="Work That &lt;em&gt;Moved the Needle&lt;/em&gt;" data-th="งานที่ &lt;em&gt;สร้างความเปลี่ยนแปลงจริง&lt;/em&gt;"></span></h2>
    </div>
    <div class="proj-grid">
      <div class="proj-card reveal">
        <div class="proj-top"><div class="proj-num">[ 01 ]</div></div>
        <h3><span data-en="POJJAMAN ERP Rollout" data-th="การ Rollout POJJAMAN ERP"></span></h3>
        <div class="proj-tags">
          <span data-en="Construction" data-th="การก่อสร้าง"></span>
          <span data-en="8 Modules" data-th="8 โมดูล"></span>
        </div>
        <p class="proj-desc"><span data-en="Led full-cycle ERP implementation for 10+ construction &amp; project-based clients &mdash; owning every phase from discovery through go-live and post-launch support." data-th="นำการ implement ERP แบบครบวงจรให้กับลูกค้าในอุตสาหกรรมก่อสร้างกว่า 10 ราย ดูแลทุกขั้นตอนตั้งแต่ discovery จนถึง go-live และ post-launch support"></span></p>
        <a href="#" class="proj-link" aria-disabled="true"><span data-en="View Case" data-th="ดูรายละเอียด"></span> <span class="arrow">→</span></a>
      </div>
      <div class="proj-card reveal d1">
        <div class="proj-top"><div class="proj-num">[ 02 ]</div></div>
        <h3><span data-en="Centralized Data Architecture" data-th="สถาปัตยกรรมข้อมูลแบบรวมศูนย์"></span></h3>
        <div class="proj-tags">
          <span data-en="Process Design" data-th="การออกแบบกระบวนการ"></span>
          <span data-en="SOPs" data-th="SOP"></span>
        </div>
        <p class="proj-desc"><span data-en="Consolidated all business processes into a single ERP database, producing SOPs and system flow diagrams adopted as permanent operational references." data-th="รวมกระบวนการทางธุรกิจทั้งหมดเข้าสู่ฐานข้อมูล ERP เดียว พร้อมจัดทำ SOP และแผนผังระบบที่กลายเป็นเอกสารอ้างอิงถาวร"></span></p>
        <a href="#" class="proj-link" aria-disabled="true"><span data-en="View Case" data-th="ดูรายละเอียด"></span> <span class="arrow">→</span></a>
      </div>
      <div class="proj-card reveal d2">
        <div class="proj-top"><div class="proj-num">[ 03 ]</div></div>
        <h3><span data-en="AS-IS / TO-BE Process Mapping" data-th="การทำ Process Mapping AS-IS / TO-BE"></span></h3>
        <div class="proj-tags">
          <span data-en="Workshops" data-th="Workshop"></span>
          <span data-en="Gap Analysis" data-th="Gap Analysis"></span>
        </div>
        <p class="proj-desc"><span data-en="Ran requirements workshops with C-level executives; delivered process documentation that became the configuration baseline for each deployment." data-th="จัดทำ requirements workshops กับผู้บริหารระดับ C พร้อมส่งมอบเอกสารกระบวนการที่กลายเป็นพื้นฐานการตั้งค่าระบบในทุก deployment"></span></p>
        <a href="#" class="proj-link" aria-disabled="true"><span data-en="View Case" data-th="ดูรายละเอียด"></span> <span class="arrow">→</span></a>
      </div>
      <div class="proj-card reveal d3">
        <div class="proj-top"><div class="proj-num">[ 04 ]</div></div>
        <h3><span data-en="Steel Building Stability Analysis" data-th="การวิเคราะห์เสถียรภาพอาคารเหล็ก"></span></h3>
        <div class="proj-tags">
          <span data-en="Graduate Research" data-th="วิจัยปริญญาตรี"></span>
          <span data-en="STAAD Pro + ABAQUS" data-th="STAAD Pro + ABAQUS"></span>
        </div>
        <p class="proj-desc"><span data-en="Modeled multi-story steel-frame stability and validated design-efficiency benchmarks against computational results &mdash; awarded a Graduate Project Award." data-th="สร้างแบบจำลองเสถียรภาพโครงสร้างเหล็กหลายชั้นและตรวจสอบประสิทธิภาพการออกแบบด้วย STAAD Pro + ABAQUS — ได้รับรางวัล Graduate Project Award"></span></p>
        <a href="#" class="proj-link" aria-disabled="true"><span data-en="View Case" data-th="ดูรายละเอียด"></span> <span class="arrow">→</span></a>
      </div>
    </div>
  </div>
</section>

<div class="divider"></div>
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat(html): add projects section with bilingual data attributes"
```

---

## Task 8: index.html — Experience section

**Files:**
- Write: `index.html` (append Experience section)

Timeline item descriptions are long paragraphs stored as `data-en`/`data-th` on `<p>` elements (plain text, no inline markup).

- [ ] **Step 1: Append Experience section HTML**

```html
<!-- EXPERIENCE -->
<section id="experience" data-screen-label="Experience">
  <div class="wrap">
    <div class="head-block">
      <div class="label reveal"><span data-en="04 · Experience" data-th="04 · ประสบการณ์"></span></div>
      <h2 class="section-head reveal d1"><span data-en="Roles That &lt;em&gt;Shaped the Method&lt;/em&gt;" data-th="ประสบการณ์ที่ &lt;em&gt;หล่อหลอมแนวทาง&lt;/em&gt;การทำงาน"></span></h2>
    </div>
    <div class="timeline">
      <div class="tl-item reveal">
        <div class="tl-meta">
          <span class="tl-year"><span data-en="Apr 2024 — Present" data-th="เม.ย. 2567 — ปัจจุบัน"></span></span>
          <span class="tl-loc"><span data-en="Builk One Group · POJJAMAN ERP · Bangkok, Thailand" data-th="Builk One Group · POJJAMAN ERP · กรุงเทพฯ ประเทศไทย"></span></span>
        </div>
        <h3><span data-en="Business Analyst" data-th="นักวิเคราะห์ธุรกิจ"></span> <span style="color:var(--gold-lt);font-style:italic;">/ <span data-en="ERP Implementation" data-th="ผู้ Implement ERP"></span></span></h3>
        <p data-en="Led full-cycle ERP implementation for 10+ clients in the construction and project-based sector, owning every phase from requirements discovery through go-live and post-launch support across 8 modules. Ran stakeholder workshops with C-level executives, delivered AS-IS/TO-BE documentation, and served as primary liaison between client operations and the development team." data-th="นำการ implement ERP แบบครบวงจรให้กับลูกค้ากว่า 10 รายในอุตสาหกรรมก่อสร้างและงานโครงการ ดูแลทุกขั้นตอนตั้งแต่ discovery ไปจนถึง go-live และ post-launch support ครอบคลุม 8 โมดูล จัดทำ stakeholder workshops กับผู้บริหาร C-level ส่งมอบเอกสาร AS-IS/TO-BE และทำหน้าที่เป็นตัวกลางระหว่างฝ่าย operations ของลูกค้าและทีม development"></p>
      </div>
      <div class="tl-item reveal d1">
        <div class="tl-meta">
          <span class="tl-year"><span data-en="May 2023 — Sep 2023" data-th="พ.ค. 2566 — ก.ย. 2566"></span></span>
          <span class="tl-loc"><span data-en="Busch Gardens Williamsburg · Virginia, USA" data-th="Busch Gardens Williamsburg · เวอร์จิเนีย สหรัฐอเมริกา"></span></span>
        </div>
        <h3><span data-en="Ride Operator" data-th="Ride Operator"></span> <span style="color:var(--gold-lt);font-style:italic;">/ <span data-en="Work &amp; Travel" data-th="Work &amp; Travel"></span></span></h3>
        <p data-en="Operated ride control systems and enforced safety protocols in a high-volume, multilingual environment serving thousands of international guests daily &mdash; maintaining zero safety violations across a 5-month contract." data-th="ควบคุมระบบ ride และบังคับใช้มาตรการความปลอดภัยในสภาพแวดล้อมที่ต้องรองรับนักท่องเที่ยวนับพันคนต่อวันจากหลากหลายภาษา — รักษาสถิติไม่มีการฝ่าฝืนกฎความปลอดภัยตลอด 5 เดือนของสัญญา"></p>
      </div>
      <div class="tl-item reveal d2">
        <div class="tl-meta">
          <span class="tl-year"><span data-en="Apr 2022 — Jun 2022" data-th="เม.ย. 2565 — มิ.ย. 2565"></span></span>
          <span class="tl-loc"><span data-en="Visavapat Co., Ltd. · Bangkok, Thailand" data-th="บริษัท วิสาวภัทร จำกัด · กรุงเทพฯ ประเทศไทย"></span></span>
        </div>
        <h3><span data-en="Site Engineer Intern" data-th="นักศึกษาฝึกงาน วิศวกรโยธา"></span> <span style="color:var(--gold-lt);font-style:italic;">/ <span data-en="Civil" data-th="โยธา"></span></span></h3>
        <p data-en="Supervised building construction workflow and quality control, coordinated with foreman teams, and performed material quantity take-offs, cost estimation, and shop-drawing review against engineering standards." data-th="ควบคุมงานก่อสร้างและตรวจสอบคุณภาพ ประสานงานกับทีมโฟร์แมน ถอดแบบปริมาณวัสดุ ประมาณราคา และตรวจสอบ shop drawing ตามมาตรฐานวิศวกรรม"></p>
      </div>
    </div>
    <div class="cert-inline reveal d3">
      <div class="cert-badge"><span class="dot"></span> <span data-en="Google Data Analytics Professional Certificate" data-th="Google Data Analytics Professional Certificate"></span></div>
      <div class="cert-badge"><span class="dot"></span> <span data-en="TOEIC 790 · Professional Working Proficiency" data-th="TOEIC 790 · ระดับใช้งานได้อย่างมืออาชีพ"></span></div>
    </div>
  </div>
</section>

<div class="divider"></div>
```

Note on `h3` inside timeline: the original used `<h3>Role <span>/ Subtitle</span></h3>` where `span` inherited italic+gold styling via `.tl-item h3 span`. We preserve that structure with nested bilingual spans inside each part.

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat(html): add experience section with bilingual data attributes"
```

---

## Task 9: index.html — Education and Credentials sections

**Files:**
- Write: `index.html` (append Education + Credentials sections)

- [ ] **Step 1: Append Education section HTML**

```html
<!-- EDUCATION -->
<section id="education" data-screen-label="Education">
  <div class="blob" style="width:440px;height:440px;top:10%;left:-150px;background:rgba(212,160,23,0.05);"></div>
  <div class="wrap">
    <div class="head-block">
      <div class="label reveal"><span data-en="05 · Education" data-th="05 · การศึกษา"></span></div>
      <h2 class="section-head reveal d1"><span data-en="Engineering &lt;em&gt;Foundations&lt;/em&gt;" data-th="รากฐาน &lt;em&gt;ทางวิศวกรรม&lt;/em&gt;"></span></h2>
    </div>
    <div class="edu-card reveal d1">
      <div class="edu-mark">CE</div>
      <div class="edu-body">
        <h3><span data-en="Bachelor of Engineering, Civil Engineering" data-th="วิศวกรรมศาสตรบัณฑิต สาขาวิศวกรรมโยธา"></span></h3>
        <div class="edu-school"><span data-en="Kasetsart University · 2019 — 2023" data-th="มหาวิทยาลัยเกษตรศาสตร์ · 2562 — 2566"></span></div>
        <p class="edu-desc" data-en="Graduate research on the &lt;em&gt;design for stability of steel buildings&lt;/em&gt; &mdash; modeled multi-story steel-frame structures in STAAD Pro and ABAQUS to validate design-efficiency benchmarks. The systems-thinking groundwork that later shaped my analytical approach to ERP and data." data-th="งานวิจัยปริญญาตรีว่าด้วย&lt;em&gt;การออกแบบเสถียรภาพของอาคารเหล็ก&lt;/em&gt; &mdash; สร้างแบบจำลองโครงเหล็กหลายชั้นใน STAAD Pro และ ABAQUS เพื่อตรวจสอบค่า benchmark ประสิทธิภาพการออกแบบ รากฐานความคิดเชิงระบบที่ต่อมาหล่อหลอมแนวทางวิเคราะห์ด้านข้อมูลและ ERP ของผม"></p>
        <div class="edu-stats">
          <div class="pill"><b><span data-en="GPA" data-th="เกรดเฉลี่ย"></span></b> 3.03 / 4.00</div>
          <div class="pill"><span data-en="Graduate Project Award · " data-th="รางวัลโครงงาน · "></span><b>2023</b></div>
        </div>
      </div>
    </div>
  </div>
</section>

<div class="divider"></div>
```

- [ ] **Step 2: Append Credentials section HTML**

```html
<!-- CERTIFICATIONS -->
<section id="certs" data-screen-label="Certifications">
  <div class="blob" style="width:440px;height:440px;bottom:0;right:-140px;background:rgba(212,160,23,0.06);"></div>
  <div class="wrap">
    <div class="head-block">
      <div class="label reveal"><span data-en="06 · Credentials" data-th="06 · วุฒิบัตร"></span></div>
      <h2 class="section-head reveal d1"><span data-en="Certified to &lt;em&gt;Deliver&lt;/em&gt;" data-th="ผ่านการรับรอง &lt;em&gt;พร้อมส่งมอบ&lt;/em&gt;"></span></h2>
    </div>
    <div class="cert-grid">
      <div class="cert-card reveal">
        <div class="cert-icon">G</div>
        <div>
          <h3><span data-en="Google Data Analytics" data-th="Google Data Analytics"></span></h3>
          <div class="cert-meta"><span data-en="Google" data-th="Google"></span> · <b><span data-en="Professional Certificate" data-th="Professional Certificate"></span></b></div>
        </div>
      </div>
      <div class="cert-card reveal d1">
        <div class="cert-icon">Py</div>
        <div>
          <h3><span data-en="Data Analysis with Python" data-th="การวิเคราะห์ข้อมูลด้วย Python"></span></h3>
          <div class="cert-meta"><span data-en="freeCodeCamp" data-th="freeCodeCamp"></span> · <b><span data-en="Certified" data-th="รับรองแล้ว"></span></b></div>
        </div>
      </div>
      <div class="cert-card reveal d2">
        <div class="cert-icon">Sci</div>
        <div>
          <h3><span data-en="Scientific Computing with Python" data-th="Scientific Computing with Python"></span></h3>
          <div class="cert-meta"><span data-en="freeCodeCamp" data-th="freeCodeCamp"></span> · <b><span data-en="Certified" data-th="รับรองแล้ว"></span></b></div>
        </div>
      </div>
      <div class="cert-card in-progress reveal d3">
        <div class="cert-icon">AI</div>
        <div>
          <h3><span data-en="IBM AI Engineering" data-th="IBM AI Engineering"></span></h3>
          <div class="cert-meta"><span data-en="IBM · Coursera" data-th="IBM · Coursera"></span></div>
        </div>
        <span class="cert-status"><span class="ping"></span> <span data-en="On-process" data-th="กำลังดำเนินการ"></span></span>
      </div>
      <div class="cert-card in-progress reveal">
        <div class="cert-icon">DE</div>
        <div>
          <h3><span data-en="IBM Data Engineering" data-th="IBM Data Engineering"></span></h3>
          <div class="cert-meta"><span data-en="IBM · Coursera" data-th="IBM · Coursera"></span></div>
        </div>
        <span class="cert-status"><span class="ping"></span> <span data-en="On-process" data-th="กำลังดำเนินการ"></span></span>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat(html): add education and credentials sections with bilingual data attributes"
```

---

## Task 10: index.html — Contact, Footer, closing tags

**Files:**
- Write: `index.html` (append Contact, Footer, script tag, closing tags)

- [ ] **Step 1: Append Contact section, Footer, and script tag**

```html
<!-- CONTACT -->
<section id="contact" data-screen-label="Contact">
  <div class="geo ring" style="width:680px;height:680px;top:50%;left:50%;margin:-340px 0 0 -340px;animation:spin 120s linear infinite;"></div>
  <div class="wrap">
    <div class="contact-label-wrap"><div class="label reveal"><span data-en="07 · Let's Connect" data-th="07 · ติดต่อกัน"></span></div></div>
    <h2 class="contact-head reveal d1"><span data-en="Ready to Build &lt;em&gt;Something Together?&lt;/em&gt;" data-th="พร้อมสร้าง &lt;em&gt;สิ่งดีๆ ด้วยกันไหม?&lt;/em&gt;"></span></h2>
    <p class="contact-sub reveal d2"><span data-en="Open to full-time roles, freelance projects, and ERP consulting engagements." data-th="เปิดรับทั้งงานประจำ งาน freelance และงานที่ปรึกษา ERP"></span></p>
    <div class="contact-cta reveal d3">
      <a href="mailto:vivitthachaigood@hotmail.com" class="btn btn-fill"><span data-en="Send Email" data-th="ส่งอีเมล"></span> <span class="arrow">→</span></a>
      <a href="https://www.linkedin.com/in/vivitthachai-laprattanatrai" target="_blank" rel="noopener" class="btn btn-out">LinkedIn <span class="arrow">↗</span></a>
      <a href="assets/Vivitthachai_Goody_CV.pdf" target="_blank" class="btn btn-out"><span data-en="Download CV" data-th="ดาวน์โหลด CV"></span> <span class="arrow">↓</span></a>
    </div>
  </div>
</section>

<footer>© 2026 <b>&ldquo;Goody&rdquo; Vivitthachai Laprattanatrai</b> · <span data-en="Bangkok, Thailand · Business Analyst &amp; ERP Implementation Specialist" data-th="กรุงเทพฯ ประเทศไทย · นักวิเคราะห์ธุรกิจและผู้เชี่ยวชาญ ERP"></span></footer>

<script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat(html): add contact, footer and close index.html"
```

---

## Task 11: script.js — all JS with bilingual logic

**Files:**
- Write: `script.js`

The full JS is extracted from the source file (lines 1110–1214) with these additions:
1. `buildHeroLines(lang, animate)` replaces the inline hero animation block
2. `setLang(lang)` sets all `[data-en]` `innerHTML` + body class + toggle state + localStorage
3. `updateToggle(lang)` sets `data-lang` attribute on the toggle button
4. Toggle click handler
5. Init: read localStorage, call `setLang`, call `buildHeroLines`

- [ ] **Step 1: Write script.js**

```js
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===== Language ===== */
  var currentLang = localStorage.getItem('lang') || 'en';

  function updateToggle(lang) {
    var btn = document.getElementById('lang-toggle');
    if (btn) btn.setAttribute('data-lang', lang);
  }

  function setLang(lang) {
    /* swap all data-en / data-th text nodes */
    document.querySelectorAll('[data-en]').forEach(function (el) {
      el.innerHTML = lang === 'en' ? el.dataset.en : el.dataset.th;
    });
    /* font class for Thai script */
    if (lang === 'th') {
      document.body.classList.add('lang-th');
    } else {
      document.body.classList.remove('lang-th');
    }
    document.documentElement.lang = lang === 'th' ? 'th' : 'en';
    updateToggle(lang);
    localStorage.setItem('lang', lang);
  }

  /* ===== Hero headline: per-character stagger ===== */
  /* Extracted from inline logic; now supports both languages */
  function buildHeroLines(lang, animate) {
    var lines = document.querySelectorAll('.hero-head .line');
    var charDelay = 0.9;
    lines.forEach(function (line) {
      line.innerHTML = '';
      var text = lang === 'th'
        ? (line.getAttribute('data-anim-th') || '')
        : (line.getAttribute('data-anim') || '');
      var words = text.split(' ');
      words.forEach(function (word, wi) {
        var wspan = document.createElement('span');
        wspan.className = 'word';
        word.split('').forEach(function (ch) {
          var c = document.createElement('span');
          c.className = 'char';
          c.textContent = ch;
          if (!reduced && animate) {
            c.style.transition =
              'opacity 0.7s cubic-bezier(0.16,1,0.3,1) ' + charDelay + 's,' +
              'transform 0.7s cubic-bezier(0.16,1,0.3,1) ' + charDelay + 's';
            charDelay += 0.028;
          } else {
            c.style.opacity = '1';
            c.style.transform = 'none';
          }
          wspan.appendChild(c);
        });
        line.appendChild(wspan);
        if (wi < words.length - 1) line.appendChild(document.createTextNode(' '));
      });
    });
    if (!reduced && animate) {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          document.querySelectorAll('.hero-head .char').forEach(function (c) {
            c.style.opacity = '1';
            c.style.transform = 'translateY(0)';
          });
        });
      });
    }
  }

  /* ===== Lang toggle click ===== */
  var langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', function () {
      var next = currentLang === 'en' ? 'th' : 'en';
      currentLang = next;
      setLang(next);
      buildHeroLines(next, false); /* rebuild hero without animation on switch */
    });
  }

  /* ===== Init: apply stored language ===== */
  setLang(currentLang);
  /* build hero with animation only on first load in EN mode */
  buildHeroLines(currentLang, !reduced && currentLang === 'en');
  /* if starting in TH, still need to show hero text (no animation) */
  if (currentLang === 'th') {
    buildHeroLines('th', false);
  }

  /* ===== Cursor glow ===== */
  var glow = document.getElementById('cursor-glow');
  var gx = window.innerWidth / 2, gy = window.innerHeight / 2, cx = gx, cy = gy;
  if (!reduced && window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('mousemove', function (e) {
      gx = e.clientX; gy = e.clientY;
      glow.style.opacity = '1';
    });
    (function loop() {
      cx += (gx - cx) * 0.12;
      cy += (gy - cy) * 0.12;
      glow.style.transform = 'translate(' + cx + 'px,' + cy + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();
  }

  /* ===== Particle field (hero) ===== */
  var pf = document.getElementById('particles');
  if (pf && !reduced) {
    var N = window.innerWidth < 600 ? 18 : 38;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < N; i++) {
      var p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      var dur = 6 + Math.random() * 8;
      p.style.animation = 'floatDot ' + dur + 's ease-in-out ' + (Math.random() * 6) + 's infinite';
      p.style.opacity = (0.15 + Math.random() * 0.4).toFixed(2);
      var s = (1 + Math.random() * 2).toFixed(1);
      p.style.width = s + 'px'; p.style.height = s + 'px';
      frag.appendChild(p);
    }
    pf.appendChild(frag);
  }

  /* ===== Navbar show on scroll ===== */
  var nav = document.getElementById('navbar');
  function onScroll() {
    if (window.scrollY > window.innerHeight * 0.55) nav.classList.add('visible');
    else nav.classList.remove('visible');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ===== Reveal on scroll ===== */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  /* ===== Skill card spotlight follow ===== */
  document.querySelectorAll('.skill-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  });
})();
```

- [ ] **Step 2: Commit**

```bash
git add script.js
git commit -m "feat(js): extract script with bilingual setLang, buildHeroLines, and toggle handler"
```

---

## Task 12: Update README.md

**Files:**
- Write: `README.md`

- [ ] **Step 1: Write README.md**

```markdown
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
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs(readme): add project description, local run, and GitHub Pages deploy instructions"
```

---

## Task 13: Verify in browser

**Files:** None — read-only verification step.

- [ ] **Step 1: Open index.html in browser**

```bash
open index.html   # macOS
```

- [ ] **Step 2: EN mode checks**
  - Hero headline animates character-by-character ✓
  - Navbar appears after scrolling past hero ✓
  - All section headings, labels, pills, tags show English text ✓
  - Hover states on cards lift and border brightens ✓
  - Skill card spotlight follows cursor ✓
  - "Download CV" buttons link to `assets/Vivitthachai_Goody_CV.pdf` ✓

- [ ] **Step 3: Toggle to TH and check**
  - Click EN | TH pill → all visible text switches to Thai ✓
  - Hero headline rebuilds with Thai text (no char animation on switch) ✓
  - Body font switches to Sarabun (Thai script renders correctly) ✓
  - Reload page → TH persists (localStorage) ✓
  - Toggle back to EN → English text returns ✓

- [ ] **Step 4: Mobile check (DevTools responsive mode, 375px width)**
  - Skill/project/cert grids collapse to 1 column ✓
  - Nav links hidden below 480px, logo only ✓
  - CTA buttons stack full-width ✓

- [ ] **Step 5: Commit any fixes found during verification**

```bash
git add -p   # stage only verified fixes
git commit -m "fix(html): correct any issues found during browser verification"
```

---

## Self-Review — Spec Coverage

| Spec requirement | Covered by |
|---|---|
| Split into index.html + style.css + script.js | Tasks 1–3, 11–12 |
| Pixel-perfect visual design from handoff | Task 2 (verbatim CSS copy) |
| CV PDF at assets/ | Task 1 |
| Sarabun font for Thai | Task 2 + Task 3 (head link) |
| data-en / data-th on every visible text node | Tasks 3–10 |
| lang-th body class for font switch | Task 2 (CSS) + Task 11 (JS setLang) |
| Language toggle pill in navbar | Task 3 + Task 2 (CSS) + Task 11 (JS) |
| Hero headline bilingual (data-anim / data-anim-th) | Task 4 + Task 11 (buildHeroLines) |
| localStorage persistence | Task 11 (setLang + init) |
| prefers-reduced-motion support | Task 11 (preserved from original) |
| README with deploy instructions | Task 12 |
| CV links updated to assets/ path | Tasks 4, 10 |
