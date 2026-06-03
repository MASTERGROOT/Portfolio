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
