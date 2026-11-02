(function () {
  'use strict';

  // Footer year
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Mobile menu
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      nav.classList.toggle('active', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open', 'active');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Contact form
  var form = document.getElementById('contactForm');
  var msg = document.getElementById('formMessage');
  if (!form) return;

  function show(text, ok) {
    if (!msg) return;
    msg.textContent = text;
    msg.style.color = ok ? '#1f7a3f' : '#b3261e';
    msg.style.fontWeight = '600';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var key = form.querySelector('[name="access_key"]');
    if (!key || !key.value || key.value.indexOf('YOUR_') === 0) {
      show('The form is not configured yet. Please email us directly.', false);
      return;
    }

    var btn = form.querySelector('button[type="submit"]');
    var original = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
    show('', true);

    fetch(form.action, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    })
      .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
      .then(function (r) {
        if (r.ok && r.data.success) {
          form.reset();
          show('Thank you! Your inquiry was sent. We will get back to you soon.', true);
        } else {
          show('Something went wrong. Please try again or email jonvandermark@gmail.com.', false);
        }
      })
      .catch(function () {
        show('Network error. Please try again or email jonvandermark@gmail.com.', false);
      })
      .finally(function () {
        if (btn) { btn.disabled = false; btn.textContent = original; }
      });
  });
})();
