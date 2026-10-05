/* Zayt Café — behaviour that Elementor Free has no widget for. Plain JS, no dependencies.
   Replaces: scroll-spy nav, mobile drawer, menu category filter, contact form validation, newsletter.
   Event delegation + a one-time init flag, so it is safe if Elementor re-renders the HTML widget. */
(function () {
  var d = document;
  var root = d.documentElement;
  // ZAYT_LANG is prepended by the build ("en" | "ar"). On a Polylang/WPML site WordPress sets dir itself.
  if (typeof ZAYT_LANG !== 'undefined' && ZAYT_LANG === 'ar') {
    root.setAttribute('dir', 'rtl');
    root.setAttribute('lang', 'ar');
  }
  if (root.getAttribute('data-zayt-init')) return;
  root.setAttribute('data-zayt-init', '1');

  // ----- mobile drawer -----
  d.addEventListener('click', function (e) {
    var burger = e.target.closest('.zayt-burger');
    var drawer = d.querySelector('.zayt-drawer');
    if (burger && drawer) {
      var open = !drawer.classList.contains('is-open');
      drawer.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? burger.getAttribute('data-label-close') : burger.getAttribute('data-label-open'));
      return;
    }
    if (drawer && e.target.closest('.zayt-drawer a')) {
      drawer.classList.remove('is-open');
      var b = d.querySelector('.zayt-burger');
      if (b) { b.setAttribute('aria-expanded', 'false'); b.setAttribute('aria-label', b.getAttribute('data-label-open')); }
    }

    // ----- menu category filter -----
    var cat = e.target.closest('[data-zayt-filter] button[data-cat]');
    if (cat) {
      var bar = cat.closest('[data-zayt-filter]');
      var slug = cat.getAttribute('data-cat');
      bar.querySelectorAll('button').forEach(function (btn) {
        var on = btn === cat;
        btn.classList.toggle('is-active', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      d.querySelectorAll('.zayt-menu-item').forEach(function (card) {
        var show = slug === 'all' || card.classList.contains('zayt-cat-' + slug);
        card.style.display = show ? '' : 'none';
      });
      return;
    }

    // ----- "send another message" -----
    if (e.target.closest('[data-zayt-again]')) {
      var f = e.target.closest('.zayt-form');
      if (f) f.classList.remove('is-done');
    }
  });

  // ----- contact form (client-side only, like the React original) -----
  d.addEventListener('submit', function (e) {
    var form = e.target;
    if (form.matches('.zayt-form form')) {
      e.preventDefault();
      var ok = true;
      var req = function (name, kind) {
        var inp = form.elements[name];
        var err = form.querySelector('[data-err="' + name + '"]');
        var v = (inp.value || '').trim();
        var msg = '';
        if (!v) msg = form.getAttribute('data-msg-required');
        else if (kind === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = form.getAttribute('data-msg-email');
        inp.classList.toggle('is-invalid', !!msg);
        inp.setAttribute('aria-invalid', msg ? 'true' : 'false');
        err.classList.toggle('is-on', !!msg);
        err.querySelector('span').textContent = msg;
        if (msg) ok = false;
      };
      req('name'); req('email', 'email'); req('message');
      if (!ok) return;
      var btn = form.querySelector('button[type="submit"]');
      var label = btn.querySelector('span');
      var idle = label.textContent;
      btn.disabled = true;
      label.textContent = form.getAttribute('data-msg-sending');
      setTimeout(function () {
        btn.disabled = false;
        label.textContent = idle;
        form.reset();
        form.closest('.zayt-form').classList.add('is-done');
      }, 600);
    } else if (form.matches('.zayt-news')) {
      e.preventDefault();
      var inp2 = form.elements['email'];
      if (!inp2.value.trim()) return;
      form.closest('.zayt-news-wrap').classList.add('is-done');
    }
  });

  // ----- scroll-spy (same rule as App.tsx: last section whose top - 120px is above scrollY) -----
  var ids = ['home', 'menu', 'about', 'gallery', 'location', 'contact'];
  function spy() {
    var y = window.scrollY, current = null;
    for (var i = ids.length - 1; i >= 0; i--) {
      var el = d.getElementById(ids[i]);
      if (el && y >= el.offsetTop - 120) { current = ids[i]; break; }
    }
    if (!current) current = 'home';
    d.querySelectorAll('.zayt-nav a, .zayt-drawer nav a').forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', spy, { passive: true });
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', spy); else spy();
})();
