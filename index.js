/* ============================================================
   TOUCH DEVICE — DISABLE CUSTOM CURSOR
============================================================ */
(function initTouchCursor() {
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.body.style.cursor = 'auto';
    var dot = document.getElementById('cursor-dot');
    var ring = document.getElementById('cursor-ring');
    if (dot) dot.style.display = 'none';
    if (ring) ring.style.display = 'none';
  }
})();

/* ============================================================
   HAMBURGER MENU
============================================================ */
(function initHamburger() {
  var hamburger = document.getElementById('nav-hamburger');
  var mobileNav = document.getElementById('mobile-nav');
  if (!hamburger || !mobileNav) return;

  function toggle() {
    var open = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggle);

  mobileNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  mobileNav.addEventListener('click', function (e) {
    if (e.target === mobileNav) {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
})();

/* ============================================================
   CURSOR
============================================================ */
(function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  if (!dot || !ring || dot.style.display === 'none') return;

  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;
  let animationId = null;

  function onMouseMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  }

  var RING_LERP = 0.15;

  function animateRing() {
    ringX += (mouseX - ringX) * RING_LERP;
    ringY += (mouseY - ringY) * RING_LERP;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    animationId = requestAnimationFrame(animateRing);
  }

  function onMouseEnterHoverable() {
    document.body.classList.add('cursor-hover');
  }

  function onMouseLeaveHoverable() {
    document.body.classList.remove('cursor-hover');
  }

  document.addEventListener('mousemove', onMouseMove);
  animateRing();

  document.querySelectorAll('a, button, .exp-tab, .skill-tag, .project-card').forEach(function (el) {
    el.addEventListener('mouseenter', onMouseEnterHoverable);
    el.addEventListener('mouseleave', onMouseLeaveHoverable);
  });
})();

/* ============================================================
   NAVBAR SCROLL
============================================================ */
(function initNavbar() {
  var navbar = document.getElementById('navbar');

  var SCROLL_THRESHOLD = 60;

  function onScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ============================================================
   SCROLL TO TOP
============================================================ */
(function initScrollTop() {
  var btn = document.getElementById('scrollTop');
  var mobileNav = document.getElementById('mobile-nav');

  function updateVisibility() {
    var navOpen = mobileNav && mobileNav.classList.contains('open');
    btn.classList.toggle('visible', !navOpen && window.scrollY > 400);
  }

  window.addEventListener('scroll', updateVisibility, { passive: true });

  if (mobileNav) {
    new MutationObserver(updateVisibility)
      .observe(mobileNav, { attributes: true, attributeFilter: ['class'] });
  }

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================================================
   ACTIVE SECTION — mobile nav highlight
============================================================ */
(function initActiveSection() {
  var mobileLinks = document.querySelectorAll('#mobile-nav a[href^="#"]');
  var inicioLink = document.querySelector('#mobile-nav .nav-inicio');
  var sections = [];

  mobileLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && href !== '#') {
      var section = document.querySelector(href);
      if (section) sections.push({ link: link, section: section });
    }
  });

  function setActive(activeLink) {
    mobileLinks.forEach(function (l) { l.classList.remove('active'); });
    if (activeLink) activeLink.classList.add('active');
  }

  function checkInicio() {
    if (window.scrollY < 100 && inicioLink) {
      setActive(inicioLink);
    }
  }

  window.addEventListener('scroll', checkInicio, { passive: true });

  if (sections.length > 0) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActive(entry.target._mobileNavLink);
        }
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

    sections.forEach(function (item) {
      item.section._mobileNavLink = item.link;
      observer.observe(item.section);
    });
  }

  checkInicio();
})();

/* ============================================================
   SCROLL REVEAL
============================================================ */
(function initScrollReveal() {
  var elements = document.querySelectorAll('.reveal');

  var REVEAL_THRESHOLD = 0.12;
  var REVEAL_ROOT_MARGIN = '0px 0px -40px 0px';

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: REVEAL_THRESHOLD, rootMargin: REVEAL_ROOT_MARGIN });

  elements.forEach(function (el) {
    observer.observe(el);
  });
})();

/* ============================================================
   SKILL BARS ANIMATION
============================================================ */
(function initSkillBars() {
  var SKILLBAR_THRESHOLD = 0.5;
  var bars = document.querySelectorAll('.skill-bar-fill');

  bars.forEach(function (bar) {
    var width = bar.dataset.width;
    if (width) bar.style.setProperty('--target-width', width);
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
      }
    });
  }, { threshold: SKILLBAR_THRESHOLD });

  bars.forEach(function (bar) {
    observer.observe(bar);
  });
})();

/* ============================================================
   EXPERIENCE TABS
============================================================ */
(function initExpTabs() {
  var tabs = document.querySelectorAll('.exp-tab');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var panelId = this.getAttribute('data-panel');

      document.querySelector('.exp-tab.active').classList.remove('active');
      document.querySelector('.experience-panel.active').classList.remove('active');

      this.classList.add('active');
      document.getElementById(panelId).classList.add('active');
    });
  });
})();

/* ============================================================
   PROJECT FILTER
============================================================ */
(function initProjectFilter() {
  var FILTER_FADE_MS = 300;
  var buttons = document.querySelectorAll('.filter-btn');
  var cards = document.querySelectorAll('.project-card');

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = this.getAttribute('data-filter');

      document.querySelector('.filter-btn.active').classList.remove('active');
      this.classList.add('active');

      cards.forEach(function (card) {
        var category = card.getAttribute('data-category') || '';
        if (filter === 'all' || category.indexOf(filter) !== -1) {
          card.style.display = '';
          card.style.opacity = '1';
          card.style.pointerEvents = '';
        } else {
          card.style.opacity = '0';
          card.style.pointerEvents = 'none';
          setTimeout(function () {
            if (card.style.opacity === '0') {
              card.style.display = 'none';
            }
          }, FILTER_FADE_MS);
        }
      });
    });
  });
})();

/* ============================================================
   SMOOTH ANCHOR SCROLL
============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (event) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      var target = document.querySelector(targetId);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
