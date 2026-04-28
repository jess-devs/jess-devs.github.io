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
      document.documentElement.style.overflow = '';
    });
  });

  mobileNav.addEventListener('click', function (e) {
    if (e.target === mobileNav) {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.documentElement.style.overflow = '';
    }
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

/* ============================================================
   CONTACT MODAL
============================================================ */
(() => {
  const overlay = document.getElementById('contact-modal');
  const openBtn = document.getElementById('open-contact-modal');
  const closeBtn = document.getElementById('close-contact-modal');
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const feedback = document.getElementById('form-feedback');

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setFieldError(groupEl, errorEl, msg) {
    if (msg) {
      groupEl.classList.add('error');
      errorEl.textContent = msg;
    } else {
      groupEl.classList.remove('error');
      errorEl.textContent = '';
    }
  }

  function clearFieldError(input) {
    const group = input.closest('.form-group');
    if (group) {
      group.classList.remove('error');
      const err = group.querySelector('.field-error');
      if (err) err.textContent = '';
    }
  }

  form.querySelectorAll('input, textarea').forEach(function (field) {
    field.addEventListener('input', function () { clearFieldError(this); });
  });

  const FOCUSABLE = 'button:not([disabled]), input:not([disabled]):not([type="hidden"]):not([type="checkbox"]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  const trapFocus = (e) => {
    if (e.key !== 'Tab') return;
    const focusable = [...overlay.querySelectorAll(FOCUSABLE)];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const open = () => {
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    const firstInput = overlay.querySelector('input:not([type="hidden"]):not([type="checkbox"]), textarea');
    if (firstInput) firstInput.focus();
    overlay.addEventListener('keydown', trapFocus);
  };

  const close = () => {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    overlay.removeEventListener('keydown', trapFocus);
    openBtn.focus();
  };

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && overlay.classList.contains('open')) close(); });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const subjectInput = form.querySelector('#from-subject');
    const emailInput = form.querySelector('#from-email');
    const messageInput = form.querySelector('#message');
    const subjectGroup = subjectInput.closest('.form-group');
    const emailGroup = emailInput.closest('.form-group');
    const messageGroup = messageInput.closest('.form-group');
    const subjectErr = document.getElementById('error-subject');
    const emailErr = document.getElementById('error-email');
    const messageErr = document.getElementById('error-message');

    let valid = true;
    setFieldError(subjectGroup, subjectErr, subjectInput.value.trim() ? '' : 'El asunto es obligatorio.');
    if (!subjectInput.value.trim()) valid = false;

    if (!emailInput.value.trim()) {
      setFieldError(emailGroup, emailErr, 'El correo es obligatorio.');
      valid = false;
    } else if (!EMAIL_RE.test(emailInput.value.trim())) {
      setFieldError(emailGroup, emailErr, 'Ingresa un correo válido.');
      valid = false;
    } else {
      setFieldError(emailGroup, emailErr, '');
    }

    setFieldError(messageGroup, messageErr, messageInput.value.trim() ? '' : 'El mensaje es obligatorio.');
    if (!messageInput.value.trim()) valid = false;

    const captchaResponse = form.querySelector('[name="h-captcha-response"]');
    const captchaErr = document.getElementById('error-captcha');
    if (!captchaResponse || !captchaResponse.value) {
      captchaErr.textContent = 'Por favor completa el captcha.';
      valid = false;
    } else {
      captchaErr.textContent = '';
    }

    if (!valid) return;

    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').hidden = true;
    submitBtn.querySelector('.btn-loading').hidden = false;
    feedback.hidden = true;
    feedback.className = 'form-feedback';

    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (json.success) {
        feedback.textContent = '¡Mensaje enviado! Te responderé pronto.';
        feedback.className = 'form-feedback success';
        form.reset();
      } else {
        throw new Error(json.message);
      }
    } catch {
      feedback.textContent = 'Hubo un error al enviar. Intenta de nuevo.';
      feedback.className = 'form-feedback error';
    } finally {
      feedback.hidden = false;
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-text').hidden = false;
      submitBtn.querySelector('.btn-loading').hidden = true;
    }
  });
})();
