/* Zayt Café — behaviour that Elementor Free has no widget for. Plain JS, no dependencies.
   Replaces: language switch, scroll-spy nav, mobile drawer, menu category filter, contact form, newsletter.
   Event delegation + a one-time init flag, so it is safe if Elementor re-renders the HTML widget.

   ZAYT_CFG (prepended by the build):
     mode  "single"    one language per page (language comes from the page itself)
           "bilingual" both languages on one page; <html data-zayt-lang> decides which is shown
     lang  initial language for "single"
     paths {en:"/", ar:"/ar/"}   URLs used for pushState / detection in "bilingual"
     sfx   {en:"", ar:"-ar"}     suffix of the DOM ids / anchors of each language
     titles                      <title> per language                                           */
(function () {
  var d = document;
  var root = d.documentElement;
  var C = window.ZAYT_CFG || { mode: 'single', lang: 'en', paths: { en: '/', ar: '/ar/' }, sfx: { en: '', ar: '' } };
  var SECTIONS = ['home', 'menu', 'about', 'gallery', 'location', 'contact'];

  function norm(p) { return (p || '/').replace(/\/+$/, '') || '/'; }
  function sfx(lang) { return (C.sfx && C.sfx[lang]) || ''; }
  function langFromPath() {
    if (C.mode !== 'bilingual') return C.lang;
    return norm(location.pathname) === norm(C.paths.ar) ? 'ar' : 'en';
  }
  function apply(lang) {
    // CSS (zayt.css) shows/hides the .zayt-l-en / .zayt-l-ar blocks from this attribute.
    root.setAttribute('data-zayt-lang', lang);
    root.setAttribute('lang', lang);
    root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    if (C.titles && C.titles[lang]) d.title = C.titles[lang];
  }

  var current = langFromPath();
  apply(current); // runs while the page is still being parsed, so there is no flash of the wrong language

  if (root.getAttribute('data-zayt-init')) return;
  root.setAttribute('data-zayt-init', '1');

  // ----- scroll-spy (same rule as App.tsx: last section whose top - 120px is above scrollY) -----
  function sectionKey() {
    var y = window.scrollY;
    for (var i = SECTIONS.length - 1; i >= 0; i--) {
      var el = d.getElementById(SECTIONS[i] + sfx(current));
      if (el && y >= el.getBoundingClientRect().top + y - 120) return SECTIONS[i];
    }
    return 'home';
  }
  function spy() {
    var key = sectionKey();
    d.querySelectorAll('.zayt-nav a, .zayt-drawer nav a').forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + key + sfx(current));
    });
  }
  window.addEventListener('scroll', spy, { passive: true });

  // ----- language switch (bilingual mode) -----
  function closeDrawers() {
    d.querySelectorAll('.zayt-drawer.is-open').forEach(function (dr) { dr.classList.remove('is-open'); });
    d.querySelectorAll('.zayt-burger').forEach(function (b) {
      b.setAttribute('aria-expanded', 'false');
      b.setAttribute('aria-label', b.getAttribute('data-label-open'));
    });
  }
  // Which section is at the top of the screen, and how far through it the reader is (0..1).
  function anchorAtTop() {
    for (var i = SECTIONS.length - 1; i >= 0; i--) {
      var el = d.getElementById(SECTIONS[i] + sfx(current));
      if (!el) continue;
      var r = el.getBoundingClientRect();
      if (r.top <= 1) return { key: SECTIONS[i], progress: Math.min(1, Math.max(0, -r.top / (r.height || 1))) };
    }
    return { key: 'home', progress: 0 };
  }
  function switchTo(lang, push) {
    if (lang === current) return;
    var at = anchorAtTop(); // the two languages have different section heights, so keep the same section and the same progress through it
    closeDrawers();
    current = lang;
    apply(lang);
    if (push) history.pushState({ zaytLang: lang }, '', C.paths[lang]);
    var to = d.getElementById(at.key + sfx(lang));
    var y = 0;
    if (to) { var r = to.getBoundingClientRect(); y = Math.max(0, r.top + window.scrollY + at.progress * r.height); }
    window.scrollTo({ top: y, behavior: 'instant' });
    spy();
  }
  window.addEventListener('popstate', function () { if (C.mode === 'bilingual') switchTo(langFromPath(), false); });

  d.addEventListener('click', function (e) {
    var sw = e.target.closest('[data-zayt-switch]');
    if (sw && C.mode === 'bilingual') {
      e.preventDefault();
      switchTo(sw.getAttribute('data-zayt-switch'), true);
      return;
    }

    // ----- mobile drawer (scoped to the header that contains the button) -----
    var burger = e.target.closest('.zayt-burger');
    if (burger) {
      var drawer = burger.closest('.zayt-header').querySelector('.zayt-drawer');
      var open = !drawer.classList.contains('is-open');
      drawer.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? burger.getAttribute('data-label-close') : burger.getAttribute('data-label-open'));
      return;
    }
    if (e.target.closest('.zayt-drawer a')) closeDrawers();

    // ----- menu category filter (scoped to the menu section that contains the bar) -----
    var cat = e.target.closest('[data-zayt-filter] button[data-cat]');
    if (cat) {
      var bar = cat.closest('[data-zayt-filter]');
      var slug = cat.getAttribute('data-cat');
      bar.querySelectorAll('button').forEach(function (btn) {
        var on = btn === cat;
        btn.classList.toggle('is-active', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      bar.closest('.zayt-sec').querySelectorAll('.zayt-menu-item').forEach(function (card) {
        card.style.display = slug === 'all' || card.classList.contains('zayt-cat-' + slug) ? '' : 'none';
      });
      return;
    }

    // ----- "send another message" -----
    if (e.target.closest('[data-zayt-again]')) {
      var f = e.target.closest('.zayt-form');
      if (f) f.classList.remove('is-done');
    }
  });

  // ----- contact form + newsletter (client-side only, like the React original) -----
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
      if (!form.elements['email'].value.trim()) return;
      form.closest('.zayt-news-wrap').classList.add('is-done');
    }
  });

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', spy); else spy();
})();
