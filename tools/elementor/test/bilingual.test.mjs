// Behaviour of the single bilingual template (zayt-home-bilingual.json) in a real browser.
import { load, startServer, launch, reporter } from './lib.mjs';

const r = reporter();
const server = await startServer();
const browser = await launch();
const tpl = load('zayt-home-bilingual.json');
server.set(tpl);

const visibleCount = (p, sel) => p.evaluate((s) => [...document.querySelectorAll(s)].filter((e) => e.offsetParent !== null || getComputedStyle(e).position === 'fixed' && getComputedStyle(e).display !== 'none').length, sel);
const state = (p) => p.evaluate(() => ({ lang: document.documentElement.lang, dir: document.documentElement.dir, path: location.pathname, title: document.title, attr: document.documentElement.dataset.zaytLang }));
const errors = [];
const newPage = async (w = 1440, h = 900) => { const p = await browser.newPage({ viewport: { width: w, height: h } }); p.on('pageerror', (e) => errors.push(e.message)); return p; };

r.section('Language switch without reload');
let p = await newPage();
await p.goto(server.base + '/');
await p.evaluate(() => { window.__marker = 'same-document'; });
let s = await state(p);
r.ok(s.lang === 'en' && s.dir === 'ltr' && s.path === '/', `starts in EN at "/" (${JSON.stringify(s)})`);
r.ok(await visibleCount(p, '.zayt-l-en.zayt-header') === 1 && await visibleCount(p, '.zayt-l-ar.zayt-header') === 0, 'only the EN header is visible');
await p.click('.zayt-l-en [data-zayt-switch="ar"]');
s = await state(p);
r.ok(s.lang === 'ar' && s.dir === 'rtl' && s.path === '/ar/', `click → AR, URL /ar/ (${s.path})`);
r.ok(await p.evaluate(() => window.__marker) === 'same-document', 'document was NOT reloaded (marker survived)');
r.ok(await visibleCount(p, '.zayt-l-ar.zayt-header') === 1 && await visibleCount(p, '.zayt-l-en.zayt-header') === 0, 'only the AR header is visible');
r.ok(s.title === 'مقهى زيت — قهوة مختصة ومخبوزات حرفية', 'document title switches to Arabic');
await p.goBack();
s = await state(p);
r.ok(s.lang === 'en' && s.path === '/' && await p.evaluate(() => window.__marker) === 'same-document', 'Back button → EN, still no reload');
await p.goForward();
r.ok((await state(p)).lang === 'ar', 'Forward → AR');
await p.close();

r.section('Direct entry to /ar/ (what a shared link does)');
p = await newPage();
await p.goto(server.base + '/ar/', { waitUntil: 'domcontentloaded' });
s = await state(p);
r.ok(s.lang === 'ar' && s.dir === 'rtl', 'AR from first paint, no English flash');
r.ok(await visibleCount(p, '.zayt-l-en.zayt-sec') === 0, 'no EN block visible');
await p.close();

r.section('Anchors and scroll-spy per language');
p = await newPage();
await p.goto(server.base + '/ar/');
await p.click('.zayt-l-ar .zayt-nav a[href="#menu-ar"]');
await p.waitForTimeout(900);
let top = await p.evaluate(() => Math.round(document.getElementById('menu-ar').getBoundingClientRect().top));
r.ok(Math.abs(top) < 4, `AR nav "القائمة" scrolls to the visible AR menu (top=${top})`);
await p.evaluate(() => document.getElementById('about-ar').scrollIntoView({ behavior: 'instant' })); await p.waitForTimeout(300);
r.ok(await p.evaluate(() => document.querySelector('.zayt-l-ar .zayt-nav a.is-active')?.getAttribute('href')) === '#about-ar', 'scroll-spy highlights About in AR');
r.ok(await p.evaluate(() => { const ids = [...document.querySelectorAll('[id]')].map((e) => e.id); return ids.length === new Set(ids).size; }), 'no duplicate DOM ids on the page');
await p.close();

r.section('Reading position is kept when switching');
p = await newPage();
await p.goto(server.base + '/');
const progress = (id) => p.evaluate((i) => { const r = document.getElementById(i).getBoundingClientRect(); return +(-r.top / r.height).toFixed(3); }, id);
await p.evaluate(() => { const e = document.getElementById('about'); window.scrollTo({ top: e.getBoundingClientRect().top + scrollY + e.offsetHeight * 0.4, behavior: 'instant' }); });
await p.waitForTimeout(200);
const before = await progress('about');
await p.click('.zayt-l-en [data-zayt-switch="ar"]');
await p.waitForTimeout(200);
const after = await progress('about-ar');
r.ok(Math.abs(before - after) <= 0.03, `reader stays in About, ${Math.round(before * 100)}% → ${Math.round(after * 100)}% through the section`);
await p.close();

r.section('Filter state is independent per language');
p = await newPage();
await p.goto(server.base + '/ar/');
await p.click('.zayt-l-ar .zayt-filter button[data-cat="bakery"]');
r.ok(await visibleCount(p, '.zayt-l-ar .zayt-menu-item') === 3, 'AR filter "bakery" → 3 cards');
await p.click('.zayt-l-ar [data-zayt-switch="en"]');
r.ok(await visibleCount(p, '.zayt-l-en .zayt-menu-item') === 19, 'EN menu untouched (19 cards)');
await p.click('.zayt-l-en .zayt-filter button[data-cat="pastries"]');
r.ok(await visibleCount(p, '.zayt-l-en .zayt-menu-item') === 3, 'EN filter "pastries" → 3 cards');
await p.click('.zayt-l-en [data-zayt-switch="ar"]');
r.ok(await visibleCount(p, '.zayt-l-ar .zayt-menu-item') === 3, 'AR filter kept its own state (still 3)');
await p.close();

r.section('Mobile drawer, form and newsletter are scoped to their language');
p = await newPage(390, 800);
await p.goto(server.base + '/ar/');
await p.click('.zayt-l-ar .zayt-burger');
r.ok(await p.isVisible('.zayt-l-ar .zayt-drawer') && !(await p.isVisible('.zayt-l-en .zayt-drawer')), 'AR drawer opens, EN drawer stays closed');
r.ok(await p.evaluate(() => [...document.querySelectorAll('.zayt-l-ar .zayt-drawer nav a')].every((a) => a.getAttribute('href').endsWith('-ar'))), 'AR drawer links point to AR anchors');
await p.click('.zayt-l-ar .zayt-drawer [data-zayt-switch="en"]');
r.ok((await state(p)).lang === 'en' && !(await p.isVisible('.zayt-l-en .zayt-drawer')), 'switching from inside the drawer works and closes it');
await p.evaluate(() => document.getElementById('contact').scrollIntoView({ behavior: 'instant' }));
await p.click('.zayt-l-en .zayt-form button[type=submit]');
r.ok(await p.evaluate(() => document.querySelectorAll('.zayt-l-en .zayt-form .err.is-on').length) === 3 && await p.evaluate(() => document.querySelectorAll('.zayt-l-ar .zayt-form .err.is-on').length) === 0, 'EN form errors do not leak into the AR form');
await p.fill('#contact-name', 'T'); await p.fill('#contact-email', 'a@b.co'); await p.fill('#contact-message', 'Hi');
await p.click('.zayt-l-en .zayt-form button[type=submit]'); await p.waitForTimeout(800);
r.ok(await p.evaluate(() => document.querySelector('.zayt-l-en .zayt-form').classList.contains('is-done')), 'EN form submits (labels bound to the EN ids)');
await p.close();

r.section('Editor view (Elementor adds body.elementor-editor-active)');
p = await newPage();
await p.goto(server.base + '/');
await p.evaluate(() => document.body.classList.add('elementor-editor-active'));
r.ok(await visibleCount(p, '.zayt-l-en.zayt-sec') > 0 && await visibleCount(p, '.zayt-l-ar.zayt-sec') > 0, 'both languages are visible so both can be edited');
r.ok(await p.evaluate(() => getComputedStyle(document.querySelector('.zayt-l-ar.zayt-header')).position) === 'relative', 'sticky is disabled in the editor (headers do not overlap)');
await p.close();

r.ok(errors.length === 0, `no JavaScript errors (${errors.join(' | ')})`);
await browser.close(); await server.close();
process.exit(r.done() ? 1 : 0);
