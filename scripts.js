/* ============================================================
   THEME
============================================================ */
(function initTheme() {
  var html = document.documentElement;
  var toggles = [
    document.getElementById('theme-toggle'),
    document.getElementById('theme-toggle-mobile')
  ];
  var STORAGE_KEY = 'theme';
  var mqDark = window.matchMedia('(prefers-color-scheme: dark)');

  function getTheme() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return mqDark.matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    toggles.forEach(function (btn) {
      if (!btn) return;
      btn.setAttribute('aria-label', theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    });
  }

  function toggleTheme() {
    var current = html.getAttribute('data-theme') || getTheme();
    var next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  applyTheme(getTheme());

  toggles.forEach(function (btn) {
    if (btn) btn.addEventListener('click', toggleTheme);
  });

  mqDark.addEventListener('change', function (e) {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  window._themeVT = { toggle: toggleTheme };
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

  window._revealObserver = observer;
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

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = this.getAttribute('data-filter');
      var cards = document.querySelectorAll('.project-card');

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
   GITHUB PROJECTS
============================================================ */
(function initGitHubProjects() {
  var GITHUB_USER = 'jess-devs';
  var API_URL = 'https://api.github.com/users/' + GITHUB_USER + '/repos?sort=updated&per_page=20';
  var container = document.getElementById('projects-grid');
  if (!container) return;

  var BACKEND_KEYWORDS = ['java', 'python', 'csharp', 'c#', 'dotnet', '.net', 'backend',
    'api', 'cli', 'desktop', 'sqlite', 'sql', 'discord', 'bot', 'kotlin', 'go', 'rust'];
  var WEB_KEYWORDS = ['html', 'css', 'javascript', 'typescript', 'php', 'web', 'frontend',
    'landing', 'portfolio', 'ecommerce', 'website', 'vue', 'react', 'svelte'];

  function getCategory(repo) {
    var tokens = (repo.topics || []).concat([((repo.language) || '').toLowerCase()]);
    for (var i = 0; i < BACKEND_KEYWORDS.length; i++) {
      if (tokens.indexOf(BACKEND_KEYWORDS[i]) !== -1) return 'backend';
    }
    for (var j = 0; j < WEB_KEYWORDS.length; j++) {
      if (tokens.indexOf(WEB_KEYWORDS[j]) !== -1) return 'web';
    }
    return 'backend';
  }

  function getStatus(repo) {
    if (repo.archived) return { label: 'Archivado', mod: 'status-dot--archived' };
    var sixMonthsAgo = Date.now() - 6 * 30 * 24 * 60 * 60 * 1000;
    if (new Date(repo.pushed_at).getTime() > sixMonthsAgo) return { label: 'Activo', mod: '' };
    return { label: 'Concluido', mod: 'status-dot--concluded' };
  }

  function getTechs(repo) {
    var techs = repo.language ? [repo.language] : [];
    (repo.topics || []).forEach(function (t) {
      if (techs.length < 3 && t.toLowerCase() !== (repo.language || '').toLowerCase()) {
        techs.push(t);
      }
    });
    return techs.slice(0, 3);
  }

  function buildCard(repo, index) {
    var status = getStatus(repo);
    var delays = ['', ' reveal-delay-1', ' reveal-delay-2'];
    var card = document.createElement('div');
    card.className = 'project-card reveal' + delays[index % 3];
    card.setAttribute('data-category', getCategory(repo));

    var num = document.createElement('span');
    num.className = 'project-number';
    num.textContent = String(index + 1).padStart(2, '0');

    var title = document.createElement('h3');
    title.className = 'project-title';
    title.textContent = repo.name;

    var desc = document.createElement('p');
    desc.className = 'project-desc';
    desc.textContent = repo.description || 'Sin descripción.';

    var tech = document.createElement('div');
    tech.className = 'project-tech';
    getTechs(repo).forEach(function (t) {
      var span = document.createElement('span');
      span.textContent = t;
      tech.appendChild(span);
    });

    var footer = document.createElement('div');
    footer.className = 'project-footer';

    var statusDiv = document.createElement('div');
    statusDiv.className = 'project-status';
    var dot = document.createElement('div');
    dot.className = 'status-dot' + (status.mod ? ' ' + status.mod : '');
    statusDiv.appendChild(dot);
    statusDiv.appendChild(document.createTextNode(status.label));
    footer.appendChild(statusDiv);

    var url = repo.homepage || repo.html_url;
    if (url) {
      var link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.className = 'project-link-arrow';
      link.setAttribute('aria-label', 'Ver proyecto');
      link.textContent = '↗';
      footer.appendChild(link);
    }

    card.appendChild(num);
    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(tech);
    card.appendChild(footer);
    return card;
  }

  function showSkeleton() {
    container.innerHTML = '';
    for (var i = 0; i < 4; i++) {
      var sk = document.createElement('div');
      sk.className = 'project-card project-skeleton';
      sk.innerHTML =
        '<div class="sk-line sk-title"></div>' +
        '<div class="sk-line sk-desc"></div>' +
        '<div class="sk-line sk-desc sk-short"></div>' +
        '<div class="sk-line sk-tech"></div>';
      container.appendChild(sk);
    }
  }

  function showError() {
    container.innerHTML = '';
    var msg = document.createElement('p');
    msg.className = 'projects-load-error';
    msg.textContent = 'No se pudieron cargar los proyectos. ';
    var link = document.createElement('a');
    link.href = 'https://github.com/' + GITHUB_USER;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Ver en GitHub →';
    msg.appendChild(link);
    container.appendChild(msg);
  }

  showSkeleton();

  fetch(API_URL)
    .then(function (res) {
      if (!res.ok) throw new Error('GitHub API ' + res.status);
      return res.json();
    })
    .then(function (repos) {
      var filtered = repos.filter(function (r) {
        return !r.fork && r.name !== GITHUB_USER + '.github.io';
      });
      if (filtered.length === 0) { showError(); return; }

      container.innerHTML = '';
      filtered.slice(0, 8).forEach(function (repo, i) {
        container.appendChild(buildCard(repo, i));
      });

      if (window._revealObserver) {
        container.querySelectorAll('.reveal').forEach(function (el) {
          window._revealObserver.observe(el);
        });
      }
    })
    .catch(showError);
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
    setLoading(false);
    feedback.hidden = true;
    feedback.className = 'form-feedback';
    feedback.textContent = '';
    openBtn.focus();
  };

  const setLoading = (loading) => {
    submitBtn.disabled = loading;
    submitBtn.querySelector('.btn-text').hidden = loading;
    submitBtn.querySelector('.btn-loading').hidden = !loading;
  };

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && overlay.classList.contains('open')) close(); });

  window._modalVT = { open: open, close: close };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (submitBtn.disabled) return;

    setLoading(true);
    feedback.hidden = true;
    feedback.className = 'form-feedback';

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
    const captchaEl = form.querySelector('.h-captcha');
    const captchaErr = document.getElementById('error-captcha');
    const captchaLoaded = captchaEl && captchaEl.querySelector('iframe');

    if (!captchaLoaded) {
      captchaErr.textContent = 'El captcha aún está cargando. Espera un momento.';
      valid = false;
    } else if (!captchaResponse || !captchaResponse.value) {
      captchaErr.textContent = 'Por favor completa el captcha.';
      valid = false;
    } else {
      captchaErr.textContent = '';
    }

    if (!valid) {
      setLoading(false);
      return;
    }

    const data = Object.fromEntries(new FormData(form));

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const json = await res.json();

      if (json.success) {
        feedback.textContent = '¡Mensaje enviado! Te responderé pronto.';
        feedback.className = 'form-feedback success';
        feedback.hidden = false;
        form.reset();
        setTimeout(close, 2000);
      } else {
        throw new Error(json.message);
      }
    } catch (err) {
      feedback.textContent = err.name === 'AbortError'
        ? 'La solicitud tardó demasiado. Intenta de nuevo.'
        : 'Hubo un error al enviar. Intenta de nuevo.';
      feedback.className = 'form-feedback error';
      feedback.hidden = false;
      setLoading(false);
    }
  });
})();
