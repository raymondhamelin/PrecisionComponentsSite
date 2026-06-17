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

  /* ---- process horizontal stepper ---- */
  document.querySelectorAll('.pstep-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.pstep').forEach(function (s) { s.classList.remove('active'); });
      tab.closest('.pstep').classList.add('active');
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

  /* ---- testimonials slider (cite on top, ‹ › nav) ---- */
  var tLayout = document.querySelector('.t-layout');
  var dataEl = document.getElementById('testimonials-data');
  if (tLayout && dataEl) {
    var items = [];
    try { items = JSON.parse(dataEl.textContent); } catch (e) { items = []; }
    var citeEl = tLayout.querySelector('.t-cite');
    var quoteEl = tLayout.querySelector('.t-quote');
    var idx = 0, timer = null;

    function render() {
      var it = items[idx];
      citeEl.textContent = it.cite || '';
      quoteEl.textContent = '“' + it.quote + '”';
    }
    function go(i) { idx = (i + items.length) % items.length; render(); restart(); }
    function restart() { clearInterval(timer); timer = setInterval(function () { go(idx + 1); }, 7000); }

    var prev = tLayout.querySelector('.t-prev'), next = tLayout.querySelector('.t-next');
    if (prev) prev.addEventListener('click', function () { go(idx - 1); });
    if (next) next.addEventListener('click', function () { go(idx + 1); });
    if (items.length) { render(); restart(); }
  }

  /* ---- assets roster filter (topic + name search) ---- */
  var roster = document.getElementById('roster');
  var topicSel = document.getElementById('topic-filter');
  var search = document.getElementById('asset-search');
  if (roster && (topicSel || search)) {
    var figs = [].slice.call(roster.querySelectorAll('figure'));
    var empty = document.getElementById('roster-empty');
    function applyFilter() {
      var topic = topicSel ? topicSel.value : 'all';
      var q = (search ? search.value : '').trim().toLowerCase();
      var shown = 0;
      figs.forEach(function (fig) {
        var topics = fig.getAttribute('data-topics') || '';
        var name = fig.getAttribute('data-name') || '';
        var matchTopic = topic === 'all' || topics === 'all' || topics.split(' ').indexOf(topic) !== -1;
        var matchName = !q || name.indexOf(q) !== -1;
        var show = matchTopic && matchName;
        fig.style.display = show ? '' : 'none';
        if (show) shown++;
      });
      if (empty) empty.hidden = shown !== 0;
    }
    if (topicSel) topicSel.addEventListener('change', applyFilter);
    if (search) search.addEventListener('input', applyFilter);
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
