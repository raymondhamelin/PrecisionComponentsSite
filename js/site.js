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
