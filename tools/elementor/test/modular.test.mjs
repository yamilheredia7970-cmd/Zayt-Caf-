// "Can an editor change this page without breaking it?" Simulates Elementor editing on the template JSON
// (remove / reorder / duplicate sections, edit text and native controls) and measures what else moves.
import { load, clone, startServer, launch, reporter, find, findAll, topBy, cls, duplicate, siteWideAssets } from './lib.mjs';

const r = reporter();
const server = await startServer();
const browser = await launch();
const errors = [];

// heights of every visible top-level block, keyed by its Navigator label
async function measure(tpl, { path = '/', width = 1440, extraHead = '' } = {}) {
  server.set(tpl, { extraHead });
  const p = await browser.newPage({ viewport: { width, height: 900 } });
  p.on('pageerror', (e) => errors.push(e.message));
  await p.goto(server.base + path); await p.waitForTimeout(250);
  const out = await p.evaluate(() => Object.fromEntries([...document.querySelectorAll('body > [data-title]')]
    .filter((e) => getComputedStyle(e).display !== 'none').map((e) => [e.dataset.title, Math.round(e.getBoundingClientRect().height)])));
  return { p, h: out };
}
const same = (a, b, skip = []) => Object.keys(a).filter((k) => !skip.includes(k)).every((k) => Math.abs(a[k] - (b[k] ?? -999)) <= 1);
const diffKeys = (a, b) => Object.keys({ ...a, ...b }).filter((k) => Math.abs((a[k] ?? -999) - (b[k] ?? -999)) > 1);

const base = load('zayt-home-bilingual.json');
const en0 = (await measure(base, { path: '/' })); await en0.p.close();
const ar0 = (await measure(base, { path: '/ar/' })); await ar0.p.close();

r.section('1. The bilingual page lays out like the single-language pages');
for (const [lang, ref] of [['en', en0.h], ['ar', ar0.h]]) {
  const single = await measure(load(`zayt-home-${lang}.json`), { path: '/' }); await single.p.close();
  const strip = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k.replace(/^(EN|AR) · /, ''), v]));
  const a = strip(ref), b = strip(single.h);
  delete a['Zayt · CSS + JS + fonts (do not delete)']; delete b['Zayt · CSS + JS + fonts (do not delete)'];
  r.ok(same(a, b) && Object.keys(a).length === Object.keys(b).length, `${lang.toUpperCase()}: all ${Object.keys(a).length} blocks have the same height as in the stand-alone ${lang.toUpperCase()} template`);
}

r.section('2. External-assets variant (CSS/JS loaded site-wide) renders the same');
const ext = await measure(load('zayt-home-bilingual.external-assets.json'), { extraHead: siteWideAssets() });
const strip2 = (o) => { const c = { ...o }; delete c['Zayt · CSS + JS + fonts (do not delete)']; return c; };
r.ok(same(strip2(en0.h), strip2(ext.h)), 'identical block heights to the embedded variant');
r.ok(await ext.p.evaluate(() => !!document.querySelector('.zayt-header') && getComputedStyle(document.querySelector('.zayt-l-en.zayt-header')).position === 'sticky'), 'header is sticky with site-wide CSS');
await ext.p.close();

r.section('3. Delete any one block (EN): nothing else moves, language switch still works');
const enTitles = base.content.filter((n) => /^EN · /.test(n.settings._title)).map((n) => n.settings._title);
for (const t of enTitles) {
  const tpl = clone(base);
  tpl.content = tpl.content.filter((n) => n.settings._title !== t);
  const m = await measure(tpl);
  const unchanged = same({ ...en0.h, [t]: undefined }, m.h, [t]) ;
  const ar = await (async () => { await m.p.click('.zayt-l-en [data-zayt-switch="ar"]').catch(() => {}); return m.p.evaluate(() => document.documentElement.lang); })();
  // header removal has no switch to click — that is expected
  r.ok(unchanged && (t === 'EN · Header' || ar === 'ar'), `without "${t}": other blocks unchanged${t === 'EN · Header' ? '' : ', switch OK'}`);
  await m.p.close();
}

r.section('4. Reorder blocks');
{
  const tpl = clone(base);
  const i = tpl.content.findIndex((n) => n.settings._title === 'EN · Gallery'), j = tpl.content.findIndex((n) => n.settings._title === 'EN · Testimonials');
  [tpl.content[i], tpl.content[j]] = [tpl.content[j], tpl.content[i]];
  const m = await measure(tpl);
  const order = await m.p.evaluate(() => [...document.querySelectorAll('body > [data-title^="EN"]')].map((e) => e.dataset.title));
  r.ok(order.indexOf('EN · Testimonials') < order.indexOf('EN · Gallery'), 'Testimonials now renders before Gallery');
  r.ok(same(en0.h, m.h), 'every block keeps its height after the swap');
  await m.p.close();
}

r.section('5. Native edits in the Elementor panel');
{
  const tpl = clone(base);
  const hero = topBy(tpl, 'EN · Hero');
  find([hero], (n) => n.widgetType === 'heading' && n.settings.header_size === 'h1').settings.title = 'A completely different hero headline for the Dubai café';
  find([hero], (n) => n.widgetType === 'button').settings.link.url = '#gallery';  // the hero's first button
  const cta = topBy(tpl, 'EN · CTA banner'); cta.settings.background_color = '#0F3D2E';
  const feat = topBy(tpl, 'EN · Features'); feat.settings.padding.top = '160'; feat.settings.padding.bottom = '160';
  const m = await measure(tpl);
  r.ok(await m.p.evaluate(() => document.querySelector('.zayt-l-en h1').textContent.includes('completely different')), 'headline text edit shows up');
  r.ok(await m.p.evaluate(() => document.querySelector('[data-title="EN · Hero"] .elementor-button').getAttribute('href') === '#gallery'), 'button link edit shows up');
  r.ok(await m.p.evaluate(() => getComputedStyle(document.querySelector('.zayt-l-en.zayt-cta')).backgroundColor) === 'rgb(15, 61, 46)', 'section background colour edit shows up');
  r.ok(Math.abs((m.h['EN · Features'] - en0.h['EN · Features']) - 128) <= 1, `Features padding 96→160 px grows the section by exactly 128 px (+${m.h['EN · Features'] - en0.h['EN · Features']})`);
  const moved = diffKeys(en0.h, m.h);
  r.ok(moved.every((k) => ['EN · Hero', 'EN · Features'].includes(k)), `only the edited blocks changed height (${moved.join(', ')})`);
  await m.p.close();
  const a = await measure(tpl, { path: '/ar/' });
  r.ok(same(ar0.h, a.h), 'editing the EN blocks leaves the AR blocks untouched');
  await a.p.close();
}

r.section('6. Menu: add, duplicate and remove products');
{
  const tpl = clone(base);
  const menu = topBy(tpl, 'EN · Menu');
  const grid = find([menu], (n) => cls(n).includes('zayt-cols'));
  const cards = grid.elements;
  const pastry = cards.find((c) => cls(c).includes('zayt-cat-pastries'));
  const copy = duplicate(pastry); copy.settings._title = 'New product (copy)';
  find([copy], (n) => n.widgetType === 'heading').settings.title = 'New Saffron Croissant';
  grid.elements.push(copy);
  grid.elements.splice(0, 1); // delete the first card
  const m = await measure(tpl);
  const count = (sel) => m.p.evaluate((s) => [...document.querySelectorAll(s)].filter((e) => e.offsetParent !== null).length, sel);
  r.ok(await count('.zayt-l-en .zayt-menu-item') === 19, 'one removed + one duplicated → still 19 cards');
  await m.p.click('.zayt-l-en .zayt-filter button[data-cat="pastries"]');
  r.ok(await count('.zayt-l-en .zayt-menu-item') === 4, 'the duplicated card joins the "Pastries" filter (3 → 4) with no JS change');
  await m.p.click('.zayt-l-en .zayt-filter button[data-cat="all"]');
  const widths = await m.p.evaluate(() => [...document.querySelectorAll('.zayt-l-en .zayt-menu-item')].filter((e) => e.offsetParent !== null).map((e) => Math.round(e.getBoundingClientRect().width)));
  r.ok(Math.max(...widths) - Math.min(...widths) <= 1, `grid stays regular (all card widths ${widths[0]}px)`);
  await m.p.close();
}

r.section('7. Known fragility (documented, not failures)');
{
  const t1 = clone(base);
  const grid = find([topBy(t1, 'EN · Features')], (n) => cls(n).includes('zayt-cols'));
  grid.settings.css_classes = ''; grid.settings._css_classes = '';
  const m1 = await measure(t1);
  r.info(`removing the "zayt-cols…" classes from the Features grid changes: ${diffKeys(en0.h, m1.h).join(', ') || 'nothing'} (grid collapses to one column → +${(m1.h['EN · Features'] || 0) - en0.h['EN · Features']} px)`);
  await m1.p.close();
  const t2 = clone(base);
  t2.content = t2.content.filter((n) => !cls(n).includes('zayt-assets'));
  const m2 = await measure(t2);
  r.info(`deleting the embedded CSS+JS container: page height ${Object.values(m2.h).reduce((a, b) => a + b, 0)} px vs ${Object.values(en0.h).reduce((a, b) => a + b, 0)} px, header sticky = ${await m2.p.evaluate(() => getComputedStyle(document.querySelector('.zayt-l-en.zayt-header')).position)} (the external-assets variant avoids this)`);
  await m2.p.close();
}

r.section('8. Spacing controls that must work in the Elementor panel');
for (const [title, label] of [['EN · Features', 'Features grid'], ['EN · Featured menu', 'Featured products grid'], ['EN · Menu', 'Menu grid'], ['EN · Testimonials', 'Testimonials grid'], ['EN · Gallery', 'Gallery grid']]) {
  const t = clone(base);
  const g = find([topBy(t, title)], (n) => n.settings._title === `EN · ${label}`);
  g.settings.flex_gap = { unit: 'px', size: 80, column: '80', row: '80', isLinked: true };
  delete g.settings.flex_gap_tablet; delete g.settings.flex_gap_mobile;
  const colWidth = async (tpl) => { const m = await measure(tpl); const w = await m.p.evaluate((l) => Math.round(document.querySelector(`[data-title="EN · ${l}"] > .e-con`).getBoundingClientRect().width), label); await m.p.close(); return w; };
  const w0 = await colWidth(base), w1 = await colWidth(t);
  r.ok(w1 < w0, `"Gap" of the ${label} (24→80 px) reflows the cards (first card ${w0}px → ${w1}px)`);
}

r.ok(errors.length === 0, `no JavaScript errors across all scenarios (${errors.length})`);
await browser.close(); await server.close();
process.exit(r.done() ? 1 : 0);
