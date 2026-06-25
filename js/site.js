(function () {
  /* mobile nav */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () { nav.classList.toggle('open'); });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); });
    });
  }

  /* nav dropdowns — click a top-level item to open its offerings */
  var dropdownItems = [].slice.call(document.querySelectorAll('.nav-item.has-dropdown'));
  if (dropdownItems.length) {
    var closeDropdowns = function (except) {
      dropdownItems.forEach(function (it) {
        if (it === except) return;
        it.classList.remove('open');
        var b = it.querySelector('.nav-sub'); if (b) b.setAttribute('aria-expanded', 'false');
      });
    };
    dropdownItems.forEach(function (it) {
      var btn = it.querySelector('.nav-sub');
      if (!btn) return;
      btn.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        var willOpen = !it.classList.contains('open');
        closeDropdowns(it);
        it.classList.toggle('open', willOpen);
        btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.nav-item.has-dropdown')) closeDropdowns(null);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDropdowns(null);
    });
  }

  /* homepage: hide the navbar on the hero, fade it in after scrolling down */
  var header = document.querySelector('.site-header');
  var heroHero = document.querySelector('.hero--centered');
  if (header && heroHero) {
    header.classList.add('nav-hidden');
    var navTicking = false;
    var syncNav = function () {
      if (window.scrollY > window.innerHeight * 0.6) header.classList.remove('nav-hidden');
      else header.classList.add('nav-hidden');
      navTicking = false;
    };
    window.addEventListener('scroll', function () {
      if (!navTicking) { window.requestAnimationFrame(syncNav); navTicking = true; }
    }, { passive: true });
    syncNav();
  }

  /* speaker 3D card carousel (homepage) — coverflow selector */
  var ccStage = document.getElementById('ccStage');
  if (ccStage) {
    var cards = [].slice.call(ccStage.querySelectorAll('.cc-card'));
    var n = cards.length;
    var carousel = document.getElementById('carousel');
    var ccRole = document.getElementById('ccRole');
    var ccName = document.getElementById('ccName');
    var ccBio = document.getElementById('ccBio');
    var ccLink = document.getElementById('ccLink');
    var active = 0, curStep = 150;
    var relPos = function (i) { var p = i - active; if (p > n / 2) p -= n; if (p < -n / 2) p += n; return p; };
    var scaleFor = function (abs) { return Math.max(0.55, 1 - abs * 0.13); };
    var layout = function () {
      curStep = Math.max(120, Math.min(250, ccStage.offsetWidth * 0.22));
      cards.forEach(function (card, i) {
        var pos = relPos(i), abs = Math.abs(pos), sign = pos < 0 ? -1 : 1, hidden = abs > 3;
        var ry = abs === 0 ? 0 : -sign * 45, sc = scaleFor(abs);
        card.style.transform = 'translate(-50%, -50%) translateX(' + (pos * curStep) + 'px) translateZ(' + (-abs * 150) + 'px) rotateY(' + ry + 'deg) scale(' + sc + ')';
        card.style.opacity = hidden ? 0 : (abs === 0 ? 1 : abs === 1 ? 0.9 : abs === 2 ? 0.5 : 0.18);
        card.style.zIndex = String(100 - abs);
        if (abs !== 0) card.classList.remove('is-hover');
        card.classList.toggle('is-active', pos === 0);
      });
      var a = cards[active];
      if (ccRole) ccRole.textContent = a.getAttribute('data-role');
      if (ccName) ccName.textContent = a.getAttribute('data-name');
      if (ccBio) ccBio.textContent = a.getAttribute('data-bio');
      if (ccLink) ccLink.setAttribute('href', a.getAttribute('href'));
    };
    var go = function (idx) { active = ((idx % n) + n) % n; layout(); };
    /* 3D transforms break native hit-testing, so resolve the figure under a screen-X manually */
    var cardAtX = function (clientX) {
      var r = ccStage.getBoundingClientRect();
      var relx = clientX - (r.left + r.width / 2);
      var best = -1, bestAbs = 99;
      cards.forEach(function (card, i) {
        var pos = relPos(i), abs = Math.abs(pos);
        if (abs > 3) return;
        var half = card.offsetWidth * scaleFor(abs) * 0.44;
        var c = pos * curStep;
        if (relx >= c - half && relx <= c + half && abs < bestAbs) { bestAbs = abs; best = i; }
      });
      return best;
    };
    carousel.addEventListener('click', function (e) {
      if (e.target.closest('.cc-nav')) return;
      var i = cardAtX(e.clientX);
      if (i < 0) return;
      if (i === active) { var h = cards[i].getAttribute('href'); if (h) window.location.href = h; }
      else go(i);
    });
    carousel.addEventListener('mousemove', function (e) {
      var i = cardAtX(e.clientX);
      cards.forEach(function (c, idx) { c.classList.toggle('is-hover', idx === i); });
      carousel.style.cursor = i >= 0 ? 'pointer' : '';
    });
    carousel.addEventListener('mouseleave', function () {
      cards.forEach(function (c) { c.classList.remove('is-hover'); });
    });
    var prev = document.getElementById('ccPrev'), next = document.getElementById('ccNext');
    if (prev) prev.addEventListener('click', function () { go(active - 1); });
    if (next) next.addEventListener('click', function () { go(active + 1); });
    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(active - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); go(active + 1); }
    });
    var sx = null;
    ccStage.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    ccStage.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1));
      sx = null;
    });
    window.addEventListener('resize', layout, { passive: true });
    layout();
  }

  /* scroll reveal — content animates in as it enters the viewport */
  (function () {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return;
    var sel = '.meta-row, .eyebrow, .section-title, .prose, .lead, h1, h2, h3, p, li, blockquote, figure, .btn, .btn-row, .dual-cta, .cta-card, .svc-card, .trio-cta, .cc-detail, .phase, .num-item, .team-card, .case-card, .result-card, .pullquote, .marquee-label';
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    var sections = [].slice.call(document.querySelectorAll('main > section'));
    sections.forEach(function (sec) {
      if (sec.classList.contains('hero')) return;
      var idx = 0;
      [].slice.call(sec.querySelectorAll(sel)).forEach(function (el) {
        if (el.closest('.cc-card')) return; /* carousel figures are JS-positioned */
        if (el.closest('[hidden]')) return; /* JS-toggled panels (quiz result, form confirm) reveal themselves */
        for (var p = el.parentElement; p && p !== sec; p = p.parentElement) {
          if (p.classList.contains('reveal')) return; /* already revealed by an ancestor block */
        }
        el.classList.add('reveal');
        el.style.transitionDelay = (Math.min(idx, 4) * 55) + 'ms';
        idx++;
        io.observe(el);
      });
    });
  })();

  /* FAQ accordion */
  document.querySelectorAll('.faq__q').forEach(function (q) {
    q.addEventListener('click', function () { q.closest('.faq__item').classList.toggle('open'); });
  });

  /* contact form — show confirmation (static demo) */
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.style.display = 'none';
      var c = document.getElementById('contactConfirm');
      if (c) { c.classList.add('show'); c.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    });
  }
})();
