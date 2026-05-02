/* View Transition enhancements — Chrome 111+ / Safari 18+
   Falls back gracefully: scripts.js CSS transitions handle older browsers. */
(function () {
  if (!document.startViewTransition) return;
  initModalVT();
  initThemeVT();
  initFilterVT();
})();

/* ── Helpers ──────────────────────────────────────────────── */

function fadeRootVT(vt, duration) {
  vt.ready.then(function () {
    document.documentElement.animate(
      { opacity: [0, 1] },
      { duration: duration, easing: 'ease', pseudoElement: '::view-transition-new(root)' }
    );
    document.documentElement.animate(
      { opacity: [1, 0] },
      { duration: duration, easing: 'ease', pseudoElement: '::view-transition-old(root)' }
    );
  }).catch(function () {});
}

/* ── Modal ────────────────────────────────────────────────── */

function initModalVT() {
  var overlay = document.getElementById('contact-modal');
  var openBtn = document.getElementById('open-contact-modal');
  var closeBtn = document.getElementById('close-contact-modal');
  var panel = overlay && overlay.querySelector('.modal-panel');

  if (!overlay || !openBtn || !closeBtn || !panel) return;

  // VT handles the panel animation; suppress the CSS transition on it
  panel.style.transition = 'none';

  var transitioning = false;

  function startOpen() {
    if (transitioning || overlay.classList.contains('open')) return;
    transitioning = true;
    panel.style.viewTransitionName = 'modal-panel';
    var vt = document.startViewTransition(function () {
      if (window._modalVT) window._modalVT.open();
    });
    fadeRootVT(vt, 280);
    vt.finished.then(function () {
      panel.style.viewTransitionName = '';
      transitioning = false;
    }).catch(function () { transitioning = false; });
  }

  function startClose() {
    if (transitioning || !overlay.classList.contains('open')) return;
    transitioning = true;
    panel.style.viewTransitionName = 'modal-panel';
    var vt = document.startViewTransition(function () {
      if (window._modalVT) window._modalVT.close();
    });
    fadeRootVT(vt, 280);
    vt.finished.then(function () {
      panel.style.viewTransitionName = '';
      transitioning = false;
    }).catch(function () { transitioning = false; });
  }

  openBtn.addEventListener('click', function (e) {
    e.stopImmediatePropagation();
    startOpen();
  }, { capture: true });

  closeBtn.addEventListener('click', function (e) {
    e.stopImmediatePropagation();
    startClose();
  }, { capture: true });

  overlay.addEventListener('click', function (e) {
    if (e.target !== overlay) return;
    e.stopImmediatePropagation();
    startClose();
  }, { capture: true });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      e.stopImmediatePropagation();
      startClose();
    }
  }, { capture: true });
}

/* ── Theme toggle — circular clip-path reveal ─────────────── */

function initThemeVT() {
  var btns = document.querySelectorAll('.theme-toggle');
  if (!btns.length) return;

  btns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopImmediatePropagation();

      var x = e.clientX;
      var y = e.clientY;
      var maxR = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      var vt = document.startViewTransition(function () {
        if (window._themeVT) window._themeVT.toggle();
      });

      vt.ready.then(function () {
        document.documentElement.animate(
          {
            clipPath: [
              'circle(0px at ' + x + 'px ' + y + 'px)',
              'circle(' + maxR + 'px at ' + x + 'px ' + y + 'px)',
            ],
          },
          { duration: 500, easing: 'ease-out', pseudoElement: '::view-transition-new(root)' }
        );
      }).catch(function () {});
    }, { capture: true });
  });
}

/* ── Project filter ───────────────────────────────────────── */

function initFilterVT() {
  var btns = document.querySelectorAll('.filter-btn');
  if (!btns.length) return;

  btns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopImmediatePropagation();

      var filter = btn.dataset.filter;
      var cards = Array.from(document.querySelectorAll('.project-card'));

      var vt = document.startViewTransition(function () {
        var active = document.querySelector('.filter-btn.active');
        if (active) active.classList.remove('active');
        btn.classList.add('active');

        cards.forEach(function (card) {
          var show = filter === 'all' || (card.dataset.category || '').indexOf(filter) !== -1;
          card.style.display = show ? '' : 'none';
          card.style.opacity = show ? '1' : '0';
        });
      });

      fadeRootVT(vt, 220);
    }, { capture: true });
  });
}
