// ==========================================================
// SITE.JS — shared behaviour for every page
// ==========================================================
(function () {
  'use strict';

  var WA_NUMBER = '27686567064';
  function waLink(text) {
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  // ---------- Mobile menu ----------
  var toggle = $('#menuToggle');
  var nav = $('#mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('mobile-active');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      var icon = toggle.querySelector('i');
      if (icon) icon.className = open ? 'fas fa-times' : 'fas fa-bars';
    });
  }

  // ---------- Modals (native <dialog>) ----------
  $all('[data-open]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var dlg = document.getElementById(btn.getAttribute('data-open'));
      if (!dlg || typeof dlg.showModal !== 'function') return; // falls back to href
      e.preventDefault();
      var pkg = btn.getAttribute('data-package');
      if (pkg) {
        var radio = dlg.querySelector('input[name="package"][value="' + pkg + '"]');
        if (radio) { radio.checked = true; radio.dispatchEvent(new Event('change', { bubbles: true })); }
      }
      dlg.showModal();
    });
  });
  $all('dialog.modal').forEach(function (dlg) {
    $all('[data-close]', dlg).forEach(function (b) {
      b.addEventListener('click', function () { dlg.close(); });
    });
    // click on the backdrop closes
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  });

  function checked(form, name) {
    var el = form.querySelector('input[name="' + name + '"]:checked');
    return el ? el.value : '';
  }
  function showError(form, msg) {
    var box = form.querySelector('.form-error');
    if (!box) return;
    box.textContent = msg || '';
    box.hidden = !msg;
    if (msg) box.focus && box.focus();
  }

  // ---------- Tutoring booking ----------
  var book = $('#bookForm');
  if (book) {
    var acct = book.querySelector('input[name="subjects"][value="Accounting"]');
    var acctNote = $('#acctNote');
    var rateEl = $('#bookRate');

    var updateBook = function () {
      var grade = checked(book, 'grade');
      var syl = checked(book, 'syllabus');
      // Accounting is CAPS only
      var ieb = syl === 'IEB';
      if (acct) {
        acct.disabled = ieb;
        if (ieb) acct.checked = false;
      }
      if (acctNote) acctNote.hidden = !ieb;
      var rate = grade === '12' ? 150 : 125;
      var n = $all('input[name="subjects"]:checked', book).length;
      rateEl.textContent = 'From R' + rate + '/hour' + (n > 1 ? ' per subject' : '');
    };
    book.addEventListener('change', function () { updateBook(); showError(book, ''); });
    updateBook();

    book.addEventListener('submit', function (e) {
      e.preventDefault();
      var subjects = $all('input[name="subjects"]:checked', book).map(function (i) { return i.value; });
      if (!subjects.length) { showError(book, 'Pick at least one subject.'); return; }
      var grade = checked(book, 'grade');
      var name = $('#bookName').value.trim();
      var when = $('#bookWhen').value.trim();
      var rate = grade === '12' ? 150 : 125;
      var lines = [
        "Hi Tino, I'd like to book tutoring with APEX.",
        name ? 'Student: ' + name : null,
        'Grade: ' + (grade === '12' ? 'Matric (Grade 12)' : 'Grade ' + grade),
        'Syllabus: ' + checked(book, 'syllabus'),
        'Subject' + (subjects.length > 1 ? 's: ' : ': ') + subjects.join(', '),
        'Where: ' + (checked(book, 'mode') === 'online' ? 'Online' : 'In person'),
        when ? 'Best times: ' + when : null,
        '(Website price: from R' + rate + '/hour per subject)'
      ].filter(Boolean);
      window.open(waLink(lines.join('\n')), '_blank', 'noopener');
    });
  }

  // ---------- Website / app quote ----------
  var quote = $('#quoteForm');
  if (quote) {
    quote.addEventListener('change', function () { showError(quote, ''); });
    quote.addEventListener('submit', function (e) {
      e.preventDefault();
      var pkg = checked(quote, 'package');
      var need = $('#quoteNeed').value.trim();
      if (!need) { showError(quote, 'Tell me a little about what you need.'); $('#quoteNeed').focus(); return; }
      var name = $('#quoteName').value.trim();
      var biz = $('#quoteBiz').value.trim();
      var lines = [
        "Hi Tino, I'd like to get a website or app.",
        'Package: ' + pkg,
        name ? 'Name: ' + name : null,
        biz ? 'Business: ' + biz : null,
        'What I need: ' + need,
        'Timeline: ' + checked(quote, 'timeline')
      ].filter(Boolean);
      window.open(waLink(lines.join('\n')), '_blank', 'noopener');
    });
  }

  // ---------- Project filters ----------
  var filters = $all('.pj-filter');
  if (filters.length) {
    var cards = $all('.pj-card');
    var empty = $('#pjEmpty');
    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var f = btn.getAttribute('data-filter');
        filters.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
        var shown = 0;
        cards.forEach(function (c) {
          var show = f === 'all' || (c.getAttribute('data-cats') || '').split(' ').indexOf(f) !== -1;
          c.hidden = !show;
          if (show) shown++;
        });
        if (empty) empty.hidden = shown > 0;
      });
    });
  }

  // ---------- Journey timeline (About page) ----------
  function createBurst(text, x, y) {
    var container = document.getElementById('burstContainer');
    if (!container) return;
    var burst = document.createElement('div');
    burst.className = 'comic-burst';
    burst.textContent = text;
    burst.style.left = x + 'px';
    burst.style.top = y + 'px';
    container.appendChild(burst);
    setTimeout(function () { burst.remove(); }, 800);
  }

  var timeline = $('.timeline');
  if (timeline) {
    var DOC = {
      yellow: { tag: 'EMPLOYMENT FILE', stamp: 'ACTIVE' },
      green:  { tag: 'ACADEMIC RECORD', stamp: 'CERTIFIED' },
      blue:   { tag: 'TUTORING FILE', stamp: 'CLOSED' },
      brown:  { tag: 'CASE FILE', stamp: 'ARCHIVED' }
    };
    var items = [
      { title: 'SOFTWARE DEVELOPER', org: 'Viatap, Johannesburg', date: 'Feb 2026 – Present', start: '2026-02', end: 'present', lane: 2, color: 'yellow',
        short: 'Software development & engineering', full: 'Building software products and solutions at Viatap.' },
      { title: 'JUNIOR SOFTWARE DEVELOPER', org: 'IAT Fusion, Johannesburg', date: 'Aug 2025 – Dec 2025', start: '2025-08', end: '2025-12', lane: 2, color: 'yellow',
        short: 'Full-stack .NET & SQL Server apps, Agile SCRUM, CI/CD',
        full: '• Built production full-stack apps with C#/.NET and SQL Server\n• Worked in Agile SCRUM teams\n• Designed REST APIs, authentication and query optimisation\n• Debugging, code review and CI/CD pipelines' },
      { title: 'PRIVATE TUTOR', org: 'Newtons Academy, Johannesburg', date: '2024 – 2025', start: '2024-01', end: '2025-12', lane: 3, color: 'blue',
        short: 'Maths, Physics & IT for high-schoolers',
        full: 'Personalised tutoring in Mathematics, Physical Sciences and IT, with tailored materials that improved understanding and exam results.' },
      { title: 'BSc COMPUTER SCIENCE', org: 'University of the Witwatersrand', date: '2022 – 2025', start: '2022-09', end: '2025-06', lane: 1, color: 'green',
        short: 'Machine Learning, Software Design, Parallel Computing…',
        full: 'Key courses: Machine Learning, Software Design, Parallel Computing, Mobile Computing, Database Systems, Computer Networks\n\nStack: Python, Java, C/C++, C#, React, React Native, SQL, Node.js, Express, Firebase, Azure\n\nSupporting: Mathematics I & II, Economics I & II' },
      { title: 'ASSISTANT TUTOR', org: 'Gozho Maths Clinic, Johannesburg', date: '2021 – 2023', start: '2021-09', end: '2023-08', lane: 3, color: 'brown',
        short: 'Group sessions & lesson plans', full: 'Ran group sessions, wrote lesson plans and mentored students in mathematical problem-solving.' },
      { title: 'NATIONAL SENIOR CERTIFICATE', org: 'Masibambane College', date: '2021', start: '2021-01', end: '2021-12', lane: 1, color: 'brown',
        short: 'Matric – 5 Distinctions', full: '5 distinctions including Mathematics (90%), Physical Sciences (87%) and Life Sciences (90%).' }
    ];
    var PX = 30, START = 2021, END = 2027;
    var toMonths = function (d) {
      if (d === 'present') {
        var n = new Date();
        return Math.min((n.getFullYear() - START) * 12 + n.getMonth(), (END - START) * 12);
      }
      var p = d.split('-').map(Number);
      return (p[0] - START) * 12 + (p[1] - 1);
    };
    var width = (END - START) * 12 * PX + 200;
    timeline.style.minWidth = width + 'px';
    timeline.style.maxWidth = width + 'px';

    var MON = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    for (var y = START; y <= END; y++) {
      for (var m = 1; m <= 12; m += 6) {
        var st = document.createElement('div');
        st.className = m === 1 ? 'stamp stamp-year' : 'stamp stamp-mid';
        st.style.left = (((y - START) * 12 + (m - 1)) * PX) + 'px';
        st.textContent = m === 1 ? String(y) : MON[m - 1] + " '" + String(y).slice(2);
        timeline.appendChild(st);
      }
    }
    [{ text: 'EDUCATION', top: '20px', color: '#2d5016' },
     { text: 'WORK', top: '200px', color: '#b91c1c' },
     { text: 'TUTORING', top: '420px', color: '#1d4ed8' }].forEach(function (l) {
      var el = document.createElement('div');
      el.className = 'lane-label';
      el.style.top = l.top; el.style.color = l.color; el.style.borderColor = l.color;
      el.textContent = l.text;
      timeline.appendChild(el);
    });

    var wrapper = $('.timeline-wrapper');
    items.forEach(function (it) {
      var startPx = toMonths(it.start) * PX;
      var w = Math.max((toMonths(it.end) - toMonths(it.start)) * PX, 100);
      var doc = DOC[it.color] || DOC.brown;
      var bub = document.createElement('div');
      bub.className = 'bubble ' + it.color + ' tail-' + (it.lane <= 2 ? 'down' : 'up');
      bub.style.left = startPx + 'px';
      bub.style.width = w + 'px';
      bub.dataset.stamp = doc.stamp;
      bub.setAttribute('tabindex', '0');
      bub.setAttribute('role', 'button');
      bub.innerHTML =
        '<div class="doc-tag">' + doc.tag + '</div>' +
        '<div class="title">' + it.title + '</div>' +
        '<div class="date">' + it.org + ' &bull; ' + it.date + '</div>' +
        '<div class="short">' + it.short + '</div>' +
        '<div class="full">' + it.full.replace(/\n/g, '<br>') + '</div>';
      var activate = function (e) {
        var was = bub.classList.contains('active');
        $all('.bubble').forEach(function (b) { b.classList.remove('active'); });
        if (!was) {
          bub.classList.add('active');
          wrapper.scrollTo({ left: bub.offsetLeft - wrapper.clientWidth / 2 + bub.offsetWidth / 2, behavior: 'smooth' });
          if (e && e.clientX) createBurst('POW!', e.clientX, e.clientY);
        }
      };
      bub.addEventListener('click', activate);
      bub.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); } });
      document.getElementById('lane' + it.lane).appendChild(bub);
    });

    // Gentle auto-scroll, paused on hover/touch and for reduced motion
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce && wrapper) {
      var pos = 0, dir = 1, paused = false, last = null, SPEED = 38;
      wrapper.addEventListener('mouseenter', function () { paused = true; });
      wrapper.addEventListener('mouseleave', function () { paused = false; pos = wrapper.scrollLeft; });
      wrapper.addEventListener('touchstart', function () { paused = true; }, { passive: true });
      wrapper.addEventListener('touchend', function () { setTimeout(function () { paused = false; pos = wrapper.scrollLeft; }, 2000); });
      wrapper.addEventListener('focusin', function () { paused = true; });
      var tick = function (now) {
        var max = width - wrapper.clientWidth;
        if (last !== null && !paused) {
          pos += dir * SPEED * Math.min((now - last) / 1000, 0.05);
          if (pos >= max) { pos = max; dir = -1; }
          if (pos <= 0) { pos = 0; dir = 1; }
          wrapper.scrollLeft = pos;
        }
        last = now;
        requestAnimationFrame(tick);
      };
      setTimeout(function () { requestAnimationFrame(tick); }, 800);
    }
  }
})();
