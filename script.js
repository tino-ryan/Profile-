// ========================================
// PROFESSIONAL COMIC PORTFOLIO - JAVASCRIPT
// ========================================

console.log('🎨 Professional Comic Portfolio Loading...');

// ========================================
// SMOOTH SCROLL NAVIGATION
// ========================================
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-btn');
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  // Smooth scroll on nav click
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Close mobile menu
        mainNav.classList.remove('mobile-active');
        const icon = menuToggle.querySelector('i');
        icon.className = 'fas fa-bars';
        
        // Update active state
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('mobile-active');
    const icon = menuToggle.querySelector('i');
    icon.className = mainNav.classList.contains('mobile-active') ? 'fas fa-times' : 'fas fa-bars';
  });

  // Update active nav on scroll
  const sections = document.querySelectorAll('.comic-page');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// ========================================
// CONTACT MODAL FUNCTIONALITY
// ========================================
function initContactModal() {
  const modal = document.getElementById('contactModal');
  // ONLY "Get In Touch" buttons open the modal
  const modalBtns = [
    document.getElementById('heroContactBtn'),
    document.getElementById('contactModalBtn')
  ];
  const closeBtn = document.getElementById('modalClose');
  const overlay = modal.querySelector('.modal-overlay');
  const copyBtns = document.querySelectorAll('.copy-btn');

  // Open modal
  modalBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        createBurst('POW!', e.clientX, e.clientY);
      });
    }
  });

  // Close modal
  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  };

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  // Handle service buttons - they also open modal
  const serviceBtns = document.querySelectorAll('.service-btn');
  serviceBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      createBurst('HIRE ME!', e.clientX, e.clientY);
    });
  });

  // Copy functionality
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        btn.classList.add('copied');
        
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.classList.remove('copied');
        }, 2000);
      });
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// ========================================
// COMIC BURST EFFECTS
// ========================================
function createBurst(text, x, y) {
  const container = document.getElementById('burstContainer');
  const burst = document.createElement('div');
  burst.className = 'comic-burst';
  burst.textContent = text;
  burst.style.left = x + 'px';
  burst.style.top = y + 'px';
  
  // Random colors for variety
  const colors = ['var(--comic-yellow)', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f7b731'];
  burst.style.color = colors[Math.floor(Math.random() * colors.length)];
  
  container.appendChild(burst);
  
  setTimeout(() => burst.remove(), 800);
}

// ========================================
// SCROLLABLE TIMELINE INITIALIZATION
// ========================================
function initTimeline() {
  const DOC = {
    yellow: { tag: 'INCIDENT REPORT', stamp: 'FILED'    },
    green:  { tag: 'ACADEMIC RECORD', stamp: 'CERTIFIED' },
    blue:   { tag: 'EMPLOYMENT FILE', stamp: 'CLOSED'   },
    brown:  { tag: 'CASE FILE',       stamp: 'ARCHIVED' }
  };

  // Lane 1 = EDUCATION (above axis, top)
  // Lane 2 = WORK      (above axis, near axis)
  // Lane 3 = TUTORING  (below axis)
  const items = [
    {
      title: "SOFTWARE DEVELOPER",
      org: "Viatap, Johannesburg",
      date: "Feb 2026 – Present",
      start: "2026-02", end: "present", lane: 2, color: "yellow",
      short: "Software development & engineering",
      full: "Building software products and solutions at Viatap."
    },
    {
      title: "JUNIOR SOFTWARE DEVELOPER",
      org: "IAT Fusion, Johannesburg",
      date: "Aug 2025 – Dec 2025",
      start: "2025-08", end: "2025-12", lane: 2, color: "yellow",
      short: "Full-stack .NET & SQL Server apps, Agile SCRUM, CI/CD",
      full: `• Architect and develop production-grade full-stack apps using C#/.NET and SQL Server (SSMS)
• Collaborate in Agile SCRUM teams – user-centered, performant solutions
• Design REST APIs, authentication, query optimisation
• Debug, code-review, maintain CI/CD pipelines
• OOP & design patterns for scalable enterprise code`
    },
    {
      title: "PRIVATE TUTOR",
      org: "Newtons Academy, Johannesburg",
      date: "2024 – 2025",
      start: "2024-01", end: "2025-12", lane: 3, color: "blue",
      short: "Maths, Physics & IT for high-schoolers",
      full: "Delivered personalised tutoring in Mathematics, Physical Sciences and IT. Created tailored materials that boosted comprehension and exam results."
    },
    {
      title: "BSc COMPUTER SCIENCE",
      org: "University of the Witwatersrand",
      date: "2022 – 2025",
      start: "2022-09", end: "2025-06", lane: 1, color: "green",
      short: "Machine Learning, Software Design, Parallel Computing…",
      full: `Key Courses: Machine Learning, Software Design, Parallel Computing, Mobile Computing, Database Systems, Computer Networks

Technical Stack: Python, Java, C/C++, C#, React, React Native, SQL, Node.js, Express, Firebase, Azure

Supporting: Mathematics I & II, Economics I & II`
    },
    {
      title: "ASSISTANT TUTOR",
      org: "Gozho Maths Clinic, Johannesburg",
      date: "2021 – 2023",
      start: "2021-09", end: "2023-08", lane: 3, color: "brown",
      short: "Group sessions & lesson plans",
      full: "Facilitated group learning, developed lesson plans, mentored students in mathematical problem-solving."
    },
    {
      title: "NATIONAL SENIOR CERTIFICATE",
      org: "Masibambane College",
      date: "2021",
      start: "2021-01", end: "2021-12", lane: 1, color: "brown",
      short: "Matric – 5 Distinctions",
      full: "5 Distinctions including Mathematics (90%), Physical Sciences (87%), Life Sciences (90%)."
    }
  ];

  const PX_PER_MONTH = 30;
  const START_YEAR = 2021;
  const END_YEAR = 2027;

  function toMonths(d) {
    if (d === 'present') {
      const n = new Date();
      return Math.min((n.getFullYear() - START_YEAR) * 12 + n.getMonth(), (END_YEAR - START_YEAR) * 12);
    }
    const [y, m] = d.split('-').map(Number);
    return (y - START_YEAR) * 12 + (m - 1);
  }

  const timelineWidth = (END_YEAR - START_YEAR) * 12 * PX_PER_MONTH + 200;
  const timeline = document.querySelector('.timeline');
  timeline.style.minWidth = `${timelineWidth}px`;
  timeline.style.maxWidth = `${timelineWidth}px`;

  // Date markers — year labels large, mid-year labels smaller
  function addStamps() {
    const MON = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    const container = document.querySelector('.timeline');
    for (let y = START_YEAR; y <= END_YEAR; y++) {
      for (let m = 1; m <= 12; m += 6) {
        const months = (y - START_YEAR) * 12 + (m - 1);
        const x = months * PX_PER_MONTH;
        const isYear = m === 1;
        const stamp = document.createElement('div');
        stamp.className = isYear ? 'stamp stamp-year' : 'stamp stamp-mid';
        stamp.style.left = `${x}px`;
        stamp.textContent = isYear ? `${y}` : `${MON[m - 1]} '${String(y).slice(2)}`;
        container.appendChild(stamp);
      }
    }
  }

  addStamps();

  // Lane track labels (visible at left edge of timeline)
  const TRACK_LABELS = [
    { text: 'EDUCATION', top: '20px',  color: '#2d5016' },
    { text: 'WORK',      top: '200px', color: '#b91c1c' },
    { text: 'TUTORING',  top: '420px', color: '#1d4ed8' },
  ];
  TRACK_LABELS.forEach(l => {
    const el = document.createElement('div');
    el.className = 'lane-label';
    el.style.top = l.top;
    el.style.color = l.color;
    el.style.borderColor = l.color;
    el.textContent = l.text;
    timeline.appendChild(el);
  });

  // Render document-styled bubbles
  items.forEach(it => {
    const startPx = toMonths(it.start) * PX_PER_MONTH;
    const dur = toMonths(it.end) - toMonths(it.start);
    const width = Math.max(dur * PX_PER_MONTH, 100);
    const doc = DOC[it.color] || DOC.brown;

    const bub = document.createElement('div');
    // lanes 1 & 2 are above axis (tail down), lane 3 is below (tail up)
    const tail = it.lane <= 2 ? 'down' : 'up';
    bub.className = `bubble ${it.color} tail-${tail}`;
    bub.style.left = `${startPx}px`;
    bub.style.width = `${width}px`;
    bub.dataset.stamp = doc.stamp;

    bub.innerHTML = `
      <div class="doc-tag">${doc.tag}</div>
      <div class="title">${it.title}</div>
      <div class="date">${it.org} &bull; ${it.date}</div>
      <div class="short">${it.short}</div>
      <div class="full">${it.full}</div>
    `;

    bub.onclick = function(e) {
      const wasActive = this.classList.contains('active');
      document.querySelectorAll('.bubble').forEach(b => b.classList.remove('active'));
      if (!wasActive) {
        this.classList.add('active');
        const cont = document.querySelector('.timeline-wrapper');
        const center = this.offsetLeft - cont.clientWidth / 2 + this.offsetWidth / 2;
        cont.scrollTo({ left: center, behavior: 'smooth' });
        createBurst('POW!', e.clientX, e.clientY);
      }
    };

    document.getElementById(`lane${it.lane}`).appendChild(bub);
  });

  // Auto-scroll: slow back-and-forth, pauses on hover/touch
  const wrapper = document.querySelector('.timeline-wrapper');
  const maxScroll = timelineWidth - wrapper.clientWidth;
  let pos = 0;
  let direction = 1;
  let paused = false;
  let lastTime = null;
  const SPEED = 38; // px per second

  wrapper.addEventListener('mouseenter', () => { paused = true; });
  wrapper.addEventListener('mouseleave', () => { paused = false; pos = wrapper.scrollLeft; });
  wrapper.addEventListener('touchstart', () => { paused = true; }, { passive: true });
  wrapper.addEventListener('touchend',   () => { setTimeout(() => { paused = false; pos = wrapper.scrollLeft; }, 2000); });

  function autoScrollTick(now) {
    if (lastTime !== null && !paused) {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      pos += direction * SPEED * dt;
      if (pos >= maxScroll) { pos = maxScroll; direction = -1; }
      if (pos <= 0)         { pos = 0;         direction =  1; }
      wrapper.scrollLeft = pos;
    }
    lastTime = now;
    requestAnimationFrame(autoScrollTick);
  }

  setTimeout(() => requestAnimationFrame(autoScrollTick), 800);
}

// ========================================
// INITIALIZE ALL FEATURES
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎨 Initializing Professional Comic Portfolio...');
  
  // Initialize navigation
  initNavigation();
  
  // Initialize contact modal
  initContactModal();
  
  // Initialize timeline
  initTimeline();
  
  // Add burst effects to interactive elements
  const burstTriggers = document.querySelectorAll('.project-cover, .ability-card');
  burstTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const burstTexts = ['POW!', 'BAM!', 'ZAP!', 'BOOM!', 'WHAM!'];
      createBurst(burstTexts[Math.floor(Math.random() * burstTexts.length)], e.clientX, e.clientY);
    });
  });
  
  console.log('✅ Professional Comic Portfolio Ready!');
  console.log('💼 Full-Stack Developer • Data Scientist • Educator');
});