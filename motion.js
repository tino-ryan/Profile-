// ==========================================================
// MOTION.JS — hero choreography, flying icon field, scroll
// reveals, count-ups and smooth modal closing.
// ==========================================================
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.__motionReady = true;
  if (reduce) { root.classList.remove('anim'); return; }
  root.classList.add('anim');

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $all = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var canAnimate = typeof Element.prototype.animate === 'function';
  var rand = function (a, b) { return a + Math.random() * (b - a); };

  // Run a one-off entrance, then hand the element back to CSS
  function pop(el, frames, opts) {
    if (!el) return;
    if (!canAnimate) { el.style.opacity = '1'; return; }
    var a = el.animate(frames, Object.assign({ fill: 'both' }, opts));
    a.onfinish = function () { el.style.opacity = '1'; a.cancel(); };
    return a;
  }

  // ======================================================== HERO
  var hero = $('.comic-cover');
  if (hero && canAnimate) {
    var small = window.matchMedia('(max-width: 640px)').matches;
    var fine = window.matchMedia('(pointer: fine)').matches;
    var city = $('.cover-city-bg', hero);
    var main = $('.cover-main', hero);
    var field = $('.cover-langs', hero);

    // --- Icon field --------------------------------------------------
    var ITEMS = [
      // left column
      { img: 'images/html.png',    x: 6,  y: 13, s: 70, d: 0.8 },
      { fa: 'fab fa-react',        x: 9,  y: 36, s: 58, d: 0.9,  bg: '#1a2912', fg: '#61dafb' },
      { img: 'images/android.png', x: 3,  y: 57, s: 54, d: 0.4 },
      { img: 'images/cpp.png',     x: 9,  y: 77, s: 60, d: 0.5 },
      // right column
      { fa: 'fab fa-js',           x: 94, y: 9,  s: 54, d: 0.5,  bg: '#f7df1e', fg: '#1a2912' },
      { img: 'images/css.png',     x: 90, y: 28, s: 64, d: 0.6 },
      { fa: 'fab fa-python',       x: 97, y: 49, s: 50, d: 0.65, bg: '#ffffff', fg: '#3572a5' },
      { img: 'images/express.png', x: 90, y: 72, s: 58, d: 0.7 },
      // maths (it's a tutor's site too)
      { math: 'π',  x: 72, y: 84, s: 48, d: 0.8 },
      { math: '√x', x: 27, y: 84, s: 44, d: 0.35 },
      { math: '∑',  x: 19, y: 58, s: 42, d: 0.55 },
      { math: 'x²', x: 82, y: 44, s: 42, d: 0.3 }
    ];
    var MOBILE = [
      { img: 'images/html.png', x: 7,  y: 8,  s: 36, d: 0.6 },
      { fa: 'fab fa-react',     x: 92, y: 7,  s: 34, d: 0.8, bg: '#1a2912', fg: '#61dafb' },
      { math: 'π',              x: 93, y: 30, s: 32, d: 0.5 },
      { fa: 'fab fa-js',        x: 6,  y: 31, s: 30, d: 0.4, bg: '#f7df1e', fg: '#1a2912' },
      { img: 'images/css.png',  x: 94, y: 56, s: 32, d: 0.7 },
      { math: '√x',             x: 5,  y: 56, s: 30, d: 0.5 }
    ];
    var list = small ? MOBILE : ITEMS;

    function makeFace(it) {
      if (it.img) {
        var im = document.createElement('img');
        im.src = it.img; im.alt = ''; im.draggable = false;
        return im;
      }
      var chip = document.createElement('span');
      if (it.math) { chip.className = 'fly-chip fly-chip--math'; chip.textContent = it.math; }
      else {
        chip.className = 'fly-chip';
        chip.style.setProperty('--chip-bg', it.bg); chip.style.setProperty('--chip-fg', it.fg);
        var i = document.createElement('i'); i.className = it.fa; chip.appendChild(i);
      }
      return chip;
    }

    var flies = [];
    if (field) {
      list.forEach(function (it, idx) {
        var fly = document.createElement('div');
        fly.className = 'fly';
        fly.style.left = it.x + '%';
        fly.style.top = it.y + '%';
        fly.style.setProperty('--size', it.s + 'px');
        fly.style.marginLeft = (-it.s / 2) + 'px';
        fly.style.marginTop = (-it.s / 2) + 'px';
        var zoom = document.createElement('div'); zoom.className = 'fly-zoom';
        var inner = document.createElement('div'); inner.className = 'fly-inner';
        inner.style.setProperty('--bob', rand(5, 9).toFixed(1) + 's');
        inner.style.setProperty('--bob-delay', (-rand(0, 6)).toFixed(1) + 's');
        inner.style.setProperty('--r1', rand(-14, -4).toFixed(0) + 'deg');
        inner.style.setProperty('--r2', rand(4, 14).toFixed(0) + 'deg');
        inner.appendChild(makeFace(it));
        zoom.appendChild(inner); fly.appendChild(zoom); field.appendChild(fly);
        flies.push({ el: fly, zoom: zoom, d: it.d, x: it.x, y: it.y, busy: true, idx: idx });
      });
    }

    // --- Intro sequence ---------------------------------------------
    if (city) city.animate([{ transform: 'scale(1.3)', filter: 'saturate(0.4) blur(3px)' }, { transform: 'scale(1)', filter: 'saturate(0.85) contrast(1.05)' }],
      { duration: 1700, easing: 'cubic-bezier(.2,.8,.2,1)' });

    // Split the name into letters and slam them in
    var letterEnd = 0;
    $all('.hero-name', hero).forEach(function (h, line) {
      var text = h.textContent.trim();
      h.textContent = '';
      h.setAttribute('aria-label', text);
      text.split('').forEach(function (ch, i) {
        var s = document.createElement('span');
        s.className = 'ltr'; s.textContent = ch; s.setAttribute('aria-hidden', 'true');
        h.appendChild(s);
        var delay = 150 + line * 260 + i * 48;
        letterEnd = Math.max(letterEnd, delay + 520);
        pop(s, [
          { opacity: 0, transform: 'translateY(-50px) scale(3.2) rotate(' + rand(-25, 25).toFixed(0) + 'deg)', filter: 'blur(8px)' },
          { opacity: 1, transform: 'translateY(4px) scale(0.92)', filter: 'blur(0)', offset: 0.7 },
          { opacity: 1, transform: 'none', filter: 'blur(0)' }
        ], { duration: 520, delay: delay, easing: 'cubic-bezier(.2,.9,.3,1)' });
      });
      setTimeout(function () { h.classList.add('is-pulsing'); }, letterEnd + 200);
    });

    var banner = $('.cover-banner', hero);
    pop(banner, [
      { opacity: 0, transform: 'rotate(-2deg) scaleX(0.05) scaleY(1.4)' },
      { opacity: 1, transform: 'rotate(-3deg) scaleX(1.08) scaleY(0.92)', offset: 0.65 },
      { opacity: 1, transform: 'rotate(-2deg)' }
    ], { duration: 520, delay: letterEnd - 150, easing: 'cubic-bezier(.2,.9,.3,1)' });

    $all('.hero-ctas .btn', hero).forEach(function (b, i) {
      pop(b, [
        { opacity: 0, transform: 'scale(0.2) rotate(' + (i ? 14 : -14) + 'deg)' },
        { opacity: 1, transform: 'scale(1.12) rotate(' + (i ? -3 : 3) + 'deg)', offset: 0.6 },
        { opacity: 1, transform: 'none' }
      ], { duration: 560, delay: letterEnd + 120 + i * 130, easing: 'cubic-bezier(.2,.9,.3,1)' });
    });
    $all('.stat-badge', hero).forEach(function (b, i) {
      pop(b, [
        { opacity: 0, transform: 'translateY(40px) scale(0.4)' },
        { opacity: 1, transform: 'translateY(-6px) scale(1.06)', offset: 0.7 },
        { opacity: 1, transform: 'none' }
      ], { duration: 520, delay: letterEnd + 380 + i * 90, easing: 'ease-out' });
    });
    pop($('.cover-bottom-bar', hero), [{ opacity: 0, transform: 'translateY(100%)' }, { opacity: 1, transform: 'none' }],
      { duration: 500, delay: letterEnd + 500, easing: 'cubic-bezier(.2,.8,.2,1)' });
    $all('.action-word', hero).forEach(function (w, i) {
      pop(w, [{ opacity: 0, transform: 'scale(0) rotate(-40deg)' }, { opacity: 1, transform: 'scale(1.3) rotate(8deg)', offset: 0.6 }, { opacity: 1, transform: 'none' }],
        { duration: 500, delay: letterEnd + 650 + i * 200, easing: 'ease-out' });
    });

    // Icons burst out from behind the name to their spots
    var rect = hero.getBoundingClientRect();
    flies.forEach(function (f, i) {
      var dx = (50 - f.x) / 100 * rect.width;
      var dy = (38 - f.y) / 100 * rect.height;
      var a = f.zoom.animate([
        { opacity: 0, transform: 'translate(' + dx + 'px,' + dy + 'px) scale(0.1) rotate(-90deg)', filter: 'blur(4px)' },
        { opacity: 1, transform: 'translate(0,0) scale(1.7) rotate(10deg)', filter: 'blur(0)', offset: 0.62 },
        { opacity: 1, transform: 'none', filter: 'blur(0)' }
      ], { duration: 950, delay: 350 + i * 70, easing: 'cubic-bezier(.2,.85,.3,1)', fill: 'backwards' });
      a.onfinish = function () { f.busy = false; };
    });

    // --- Every few seconds one icon zooms OUT of the page at you ------
    var heroVisible = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { heroVisible = es[0].isIntersecting; }, { threshold: 0.15 }).observe(hero);
    }
    function zoomOut() {
      var free = flies.filter(function (f) { return !f.busy; });
      if (free.length && heroVisible && !document.hidden) {
        var f = free[Math.floor(Math.random() * free.length)];
        f.busy = true;
        f.el.style.zIndex = '8';
        var spin = rand(-40, 40).toFixed(0);
        var out = f.zoom.animate([
          { opacity: 1, transform: 'none', filter: 'blur(0)' },
          { opacity: 1, transform: 'scale(1.35) rotate(' + (-spin / 4) + 'deg)', filter: 'blur(0)', offset: 0.18 },
          { opacity: 0, transform: 'scale(9) rotate(' + spin + 'deg)', filter: 'blur(10px)' }
        ], { duration: 900, easing: 'cubic-bezier(.55,0,.8,.4)', fill: 'forwards' });
        out.onfinish = function () {
          f.el.style.zIndex = '';
          var back = f.zoom.animate([
            { opacity: 0, transform: 'scale(0.02) rotate(180deg)', filter: 'blur(3px)' },
            { opacity: 1, transform: 'scale(1.3) rotate(-8deg)', filter: 'blur(0)', offset: 0.7 },
            { opacity: 1, transform: 'none', filter: 'blur(0)' }
          ], { duration: 800, delay: 450, easing: 'cubic-bezier(.2,.85,.3,1)', fill: 'backwards' });
          out.cancel();
          back.onfinish = function () { f.busy = false; };
        };
      }
      setTimeout(zoomOut, rand(2600, 4200));
    }
    setTimeout(zoomOut, 2600);

    // --- Mouse parallax (3D depth) + scroll parallax -----------------
    var tx = 0, ty = 0, cx = 0, cy = 0, scrollY = 0;
    if (fine) {
      hero.addEventListener('pointermove', function (e) {
        var r = hero.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      });
      hero.addEventListener('pointerleave', function () { tx = 0; ty = 0; });
    }
    window.addEventListener('scroll', function () { scrollY = window.scrollY; }, { passive: true });

    var introDone = false;
    setTimeout(function () { introDone = true; }, 1800);
    (function frame() {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      var h = hero.offsetHeight || 1;
      var sp = Math.min(scrollY / h, 1);
      if (scrollY < h + 100) {
        flies.forEach(function (f) {
          f.el.style.transform = 'translate3d(' + (cx * f.d * 38).toFixed(1) + 'px,' + (cy * f.d * 26 - sp * f.d * 160).toFixed(1) + 'px,0)';
        });
        if (main) {
          main.style.transform = 'translate3d(' + (-cx * 8).toFixed(1) + 'px,' + (sp * h * 0.28 - cy * 6).toFixed(1) + 'px,0)';
          main.style.opacity = String(1 - sp * 0.9);
        }
        if (city && introDone) city.style.transform = 'translate3d(' + (cx * -14).toFixed(1) + 'px,' + (sp * h * 0.4 + cy * -10).toFixed(1) + 'px,0) scale(1.06)';
      }
      requestAnimationFrame(frame);
    })();

    // --- Tap the hero: launch an icon straight at the viewer ----------
    var faces = ITEMS;
    var words = ['POW!', 'ZAP!', 'BAM!', 'BOOM!', 'WHAM!'];
    hero.addEventListener('click', function (e) {
      if (e.target.closest('a, button')) return;
      var r = hero.getBoundingClientRect();
      var it = faces[Math.floor(Math.random() * faces.length)];
      var wrap = document.createElement('div');
      wrap.className = 'launch';
      wrap.style.left = (e.clientX - r.left) + 'px';
      wrap.style.top = (e.clientY - r.top) + 'px';
      wrap.style.setProperty('--size', '60px');
      var face = makeFace(it);
      if (face.tagName === 'IMG') face.style.width = '60px';
      wrap.appendChild(face);
      hero.appendChild(wrap);
      var spin = rand(-60, 60).toFixed(0);
      wrap.animate([
        { opacity: 0, transform: 'scale(0.2)' },
        { opacity: 1, transform: 'scale(1.2) rotate(' + (-spin / 3) + 'deg)', offset: 0.25 },
        { opacity: 0, transform: 'scale(10) rotate(' + spin + 'deg)', filter: 'blur(12px)' }
      ], { duration: 950, easing: 'cubic-bezier(.5,0,.75,.3)' }).onfinish = function () { wrap.remove(); };

      var w = document.createElement('div');
      w.className = 'launch';
      w.textContent = words[Math.floor(Math.random() * words.length)];
      w.style.cssText += 'left:' + (e.clientX - r.left) + 'px;top:' + (e.clientY - r.top - 50) + 'px;font-family:Bangers,cursive;font-size:2.4rem;color:#ffd700;text-shadow:3px 3px 0 #1a2912,-2px -2px 0 #ff4757;letter-spacing:2px;';
      hero.appendChild(w);
      w.animate([
        { opacity: 0, transform: 'scale(0.3) rotate(-20deg)' },
        { opacity: 1, transform: 'scale(1.2) rotate(6deg)', offset: 0.35 },
        { opacity: 0, transform: 'translateY(-30px) scale(1)' }
      ], { duration: 800, easing: 'ease-out' }).onfinish = function () { w.remove(); };
    });
  }

  // ===================================================== SCROLL REVEALS
  var SEL = [
    '.section-title', '.title-underline', '.section-subtitle',
    '.intro', '.door', '.block-head', '.pj-card', '.tier', '.unsure',
    '.steps li', '.faq details', '.contact-strip', '.apex-sheet',
    '.skill', '.pj-cta', '.dossier', '.timeline-wrapper', '.more-row', '.swipe-hint'
  ].join(',');
  var targets = $all(SEL).filter(function (el) { return !el.closest('.comic-cover') && !el.closest('dialog'); });
  var groups = new Map();
  targets.forEach(function (el) {
    var p = el.parentElement;
    var n = groups.get(p) || 0;
    groups.set(p, n + 1);
    el.style.setProperty('--d', (Math.min(n, 5) * 0.09).toFixed(2) + 's');
    el.style.setProperty('--tilt', (n % 2 ? 0.8 : -0.8) + 'deg');
    el.classList.add('reveal');
  });

  function countUp(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode())) {
      var m = node.nodeValue.match(/R([\d,]+)/);
      if (!m) continue;
      var target = parseInt(m[1].replace(/,/g, ''), 10);
      var before = node.nodeValue.slice(0, m.index), after = node.nodeValue.slice(m.index + m[0].length);
      var t0 = null, dur = 750, tn = node;
      var fmt = function (n) { return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); };
      (function step(t) {
        if (t0 === null) t0 = t;
        var k = Math.min((t - t0) / dur, 1);
        var e = 1 - Math.pow(1 - k, 3);
        tn.nodeValue = before + 'R' + fmt(Math.round(target * e)) + after;
        if (k < 1) requestAnimationFrame(step);
      })(performance.now());
      break;
    }
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add('in');
        $all('.tier-price, .apex-amount', el).forEach(function (p) {
          setTimeout(function () { countUp(p); }, 250);
        });
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add('in'); });
  }

  // ===================================================== FILTER RE-DEAL
  $all('.pj-filter').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setTimeout(function () {
        var shown = $all('.pj-card').filter(function (c) { return !c.hidden; });
        shown.forEach(function (c, i) {
          c.classList.add('in');
          c.classList.remove('pj-show');
          void c.offsetWidth;
          c.style.setProperty('--d', (i * 0.05).toFixed(2) + 's');
          c.classList.add('pj-show');
        });
      }, 0);
    });
  });

  // ===================================================== SMOOTH MODAL CLOSE
  $all('dialog.modal').forEach(function (dlg) {
    var close = dlg.close.bind(dlg);
    dlg.close = function () {
      if (!dlg.open || dlg.classList.contains('closing')) return;
      dlg.classList.add('closing');
      setTimeout(function () { dlg.classList.remove('closing'); close(); }, 200);
    };
    dlg.addEventListener('cancel', function (e) { e.preventDefault(); dlg.close(); });
  });
})();
