/* Precision Components — interactions */
(function () {
  'use strict';

  /* ---- mobile nav ---- */
  var toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      document.body.classList.toggle('nav-open');
    });
    document.querySelectorAll('.site-nav a').forEach(function (a) {
      a.addEventListener('click', function () { document.body.classList.remove('nav-open'); });
    });
  }

  /* ---- services tabs ---- */
  var svcTabs = document.querySelectorAll('.svc-tab');
  if (svcTabs.length) {
    svcTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = tab.getAttribute('data-tab');
        document.querySelectorAll('.svc-tab').forEach(function (t) { t.classList.remove('active'); });
        document.querySelectorAll('.svc-panel').forEach(function (p) { p.classList.remove('active'); });
        tab.classList.add('active');
        var panel = document.getElementById('svc-' + target);
        if (panel) panel.classList.add('active');
      });
    });
  }

  /* ---- process accordion ---- */
  document.querySelectorAll('.acc-head').forEach(function (head) {
    head.addEventListener('click', function () {
      var item = head.closest('.acc-item');
      var alreadyOpen = item.classList.contains('open');
      document.querySelectorAll('.acc-item').forEach(function (i) { i.classList.remove('open'); });
      if (!alreadyOpen) item.classList.add('open');
    });
  });

  /* ---- about story tabs ---- */
  var storyTabs = document.querySelectorAll('.story-tab');
  if (storyTabs.length) {
    storyTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = tab.getAttribute('data-pane');
        document.querySelectorAll('.story-tab').forEach(function (t) { t.classList.remove('active'); });
        document.querySelectorAll('.story-body .pane').forEach(function (p) { p.classList.remove('active'); });
        tab.classList.add('active');
        var pane = document.getElementById('pane-' + target);
        if (pane) pane.classList.add('active');
      });
    });
  }

  /* ---- testimonials slider ---- */
  var slider = document.querySelector('.t-slider');
  if (slider) {
    var quotes = JSON.parse(slider.getAttribute('data-quotes') || '[]');
    var quoteEl = slider.querySelector('.t-quote span');
    var dotsWrap = slider.querySelector('.t-dots');
    var idx = 0, timer = null;

    quotes.forEach(function (_, i) {
      var d = document.createElement('button');
      d.className = 't-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Testimonial ' + (i + 1));
      d.addEventListener('click', function () { go(i); });
      dotsWrap.appendChild(d);
    });

    function render() {
      quoteEl.textContent = quotes[idx];
      dotsWrap.querySelectorAll('.t-dot').forEach(function (d, i) {
        d.classList.toggle('active', i === idx);
      });
    }
    function go(i) { idx = (i + quotes.length) % quotes.length; render(); restart(); }
    function restart() { clearInterval(timer); timer = setInterval(function () { go(idx + 1); }, 6500); }

    slider.querySelector('.t-prev').addEventListener('click', function () { go(idx - 1); });
    slider.querySelector('.t-next').addEventListener('click', function () { go(idx + 1); });
    if (quotes.length) { render(); restart(); }
  }

  /* ---- header: solidify on scroll for dark headers over hero ---- */
  var header = document.querySelector('.site-header');
  if (header && !header.classList.contains('is-light')) {
    var onScroll = function () {
      if (window.scrollY > 40) {
        header.style.background = 'rgba(33,32,31,0.92)';
        header.style.backdropFilter = 'blur(6px)';
        header.style.padding = '16px var(--pad)';
      } else {
        header.style.background = '';
        header.style.backdropFilter = '';
        header.style.padding = '';
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();
