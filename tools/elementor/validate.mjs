#!/usr/bin/env node
// Static checks on the generated Elementor templates (does not need WordPress).
//   node tools/elementor/validate.mjs [elementor/templates]
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '../..');
const DIR = resolve(ROOT, process.argv[2] || 'elementor/templates');

// Control names accepted by Elementor core (Container + free widgets). Anything else is reported.
const COMMON = ['_element_id', '_css_classes', '_margin', '_margin_tablet', '_margin_mobile', '_padding', '_z_index', '_title'];
const TYPO = ['typography', 'font_family', 'font_size', 'font_weight', 'line_height', 'letter_spacing', 'text_transform', 'font_style'];
const typo = (p) => TYPO.flatMap((k) => [p + k, p + k + '_tablet', p + k + '_mobile']);
const R = (...ks) => ks.flatMap((k) => [k, k + '_tablet', k + '_mobile']);
const ALLOWED = {
  container: new Set([
    'content_width', 'boxed_width', ...R('flex_direction', 'flex_gap', 'padding', 'margin', 'min_height', 'width'),
    'flex_justify_content', 'flex_align_items', 'flex_wrap', 'background_background', 'background_color',
    'border_border', 'border_width', 'border_color', 'border_radius', 'box_shadow_box_shadow_type', 'box_shadow_box_shadow',
    'overflow', 'html_tag', 'css_classes', ...COMMON,
  ]),
  heading: new Set([...COMMON, 'title', 'header_size', 'title_color', 'link', ...R('align'), ...typo('typography_')]),
  'text-editor': new Set([...COMMON, 'editor', 'text_color', ...R('align'), ...typo('typography_')]),
  button: new Set([...COMMON, 'text', 'link', 'background_color', 'button_text_color', 'button_background_hover_color', 'hover_color',
    'border_radius', 'text_padding', 'border_border', 'border_width', 'border_color', 'button_hover_border_color',
    'selected_icon', 'icon_align', 'icon_indent', ...R('align'), ...typo('typography_')]),
  image: new Set([...COMMON, 'image', 'image_size', 'align']),
  html: new Set([...COMMON, 'html']),
};

const FILES = [
  { file: 'zayt-home-en.json', kind: 'single', lang: 'en' },
  { file: 'zayt-home-ar.json', kind: 'single', lang: 'ar' },
  { file: 'zayt-home-bilingual.json', kind: 'bilingual', assets: true },
  { file: 'zayt-home-bilingual.external-assets.json', kind: 'bilingual', assets: false },
];

let failures = 0;
const fail = (m) => { failures++; console.error('  ✗ ' + m); };
const css = readFileSync(join(HERE, 'zayt.css'), 'utf8');
const definedClasses = new Set([...css.matchAll(/\.(zayt-[\w-]+)/g)].map((m) => m[1]));
// JS / structure hooks that are intentionally not styled
const HOOKS = (c) => c === 'zayt-menu-item' || c === 'zayt-sec' || c.startsWith('zayt-cat-');

for (const { file, kind, lang, assets } of FILES) {
  const raw = readFileSync(join(DIR, file), 'utf8');
  const tpl = JSON.parse(raw);
  console.log(`\n${file}  (${Math.round(raw.length / 1024)} KB)`);

  for (const k of ['version', 'title', 'type', 'content']) if (!(k in tpl)) fail(`missing top-level "${k}"`);
  if (tpl.type !== 'page') fail('type must be "page"');

  const ids = new Set();
  const domIds = new Map();
  const counts = { container: 0, heading: 0, 'text-editor': 0, button: 0, image: 0, html: 0 };
  const usedClasses = new Set();
  const links = [];
  const walk = (n, depth) => {
    if (!/^[0-9a-f]{7}$/.test(n.id || '')) fail(`bad id "${n.id}"`);
    if (ids.has(n.id)) fail(`duplicate id ${n.id}`);
    ids.add(n.id);
    if (!Array.isArray(n.elements)) fail(`${n.id}: elements must be an array`);
    if (n.settings._element_id) {
      if (domIds.has(n.settings._element_id)) fail(`duplicate DOM id "${n.settings._element_id}"`);
      domIds.set(n.settings._element_id, n.id);
    }
    if (n.elType === 'container') {
      counts.container++;
      if (n.isInner !== (depth > 0)) fail(`${n.id}: isInner=${n.isInner} at depth ${depth}`);
      for (const k of Object.keys(n.settings)) if (!ALLOWED.container.has(k)) fail(`container ${n.id}: unknown setting "${k}"`);
      if (n.settings.html_tag && !['header', 'section', 'footer', 'main', 'article', 'aside', 'div'].includes(n.settings.html_tag)) fail(`${n.id}: bad html_tag`);
    } else if (n.elType === 'widget') {
      if (depth === 0) fail(`root-level widget ${n.id}`);
      if (n.elements.length) fail(`${n.id}: widget with children`);
      counts[n.widgetType] = (counts[n.widgetType] || 0) + 1;
      const allow = ALLOWED[n.widgetType];
      if (!allow) fail(`${n.id}: widget "${n.widgetType}" is not in the Elementor Free allow-list`);
      else for (const k of Object.keys(n.settings)) if (!allow.has(k)) fail(`${n.widgetType} ${n.id}: unknown setting "${k}"`);
      if (n.widgetType === 'button' || n.widgetType === 'heading') {
        const l = n.settings.link;
        if (l && typeof l.is_external === 'boolean') fail(`${n.id}: link.is_external must be "on"/"" not boolean`);
        if (l && l.url) links.push(l.url);
      }
      if (n.widgetType === 'image' && !/^https?:\/\//.test(n.settings.image.url)) fail(`${n.id}: image url not absolute`);
      if (n.widgetType === 'html') {
        // every label/for pair and every in-page link inside code widgets must resolve
        const h = n.settings.html;
        for (const m of h.matchAll(/href="(#[^"]+)"/g)) links.push(m[1]);
        const fors = [...h.matchAll(/for="([^"]+)"/g)].map((m) => m[1]);
        const idsInside = new Set([...h.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]));
        for (const f of fors) if (!idsInside.has(f)) fail(`${n.id}: label for="${f}" has no matching id`);
        for (const i of idsInside) { if (domIds.has('html:' + i)) fail(`duplicate DOM id "${i}" inside code widgets`); domIds.set('html:' + i, n.id); }
      }
    } else fail(`${n.id}: elType ${n.elType}`);
    for (const k of ['_css_classes', 'css_classes']) (n.settings[k] || '').split(/\s+/).filter(Boolean).forEach((c) => usedClasses.add(c));
    n.elements.forEach((c) => walk(c, depth + 1));
  };
  tpl.content.forEach((n) => walk(n, 0));

  // in-page anchors must point at an existing element id (so a missing/renamed section is caught)
  for (const l of links) if (l.startsWith('#') && l.length > 1 && !domIds.has(l.slice(1))) fail(`link ${l} has no target`);

  // classes referenced from HTML widgets / wrapper classes must exist in the shipped CSS
  for (const m of raw.matchAll(/class=\\"([^\\"]+)\\"/g)) m[1].split(/\s+/).forEach((c) => c.startsWith('zayt-') && usedClasses.add(c));
  const missing = [...usedClasses].filter((c) => c.startsWith('zayt-') && !definedClasses.has(c) && !HOOKS(c));
  if (missing.length) fail(`classes without CSS: ${missing.join(', ')}`);

  const stripCode = raw.replace(/<style[\s\S]*?<\/style>/, '').replace(/<script[\s\S]*?<\/script>/, '');
  if (/["'(]\/src\/assets|\.\.\/assets|undefined|\[object/.test(stripCode)) fail('found /src/assets, undefined or [object] in output');
  const ex = raw.match(/https?:\/\/[^"\\\s]+\.(jpg|png)/g) || [];
  if (!ex.length) fail('no image URLs');

  // modularity: every top-level block is labelled in the Navigator; the code widget exists exactly when expected
  tpl.content.forEach((n, i) => { if (!n.settings._title) fail(`top-level #${i} has no Navigator label (_title)`); });
  const codeWidgets = raw.split('id=\\"zayt-css\\"').length - 1;
  if (assets === true && codeWidgets !== 1) fail(`expected one embedded CSS block, found ${codeWidgets}`);
  if (assets === false && codeWidgets !== 0) fail('external-assets template must not embed CSS');
  if (kind === 'single' && !tpl.content.slice(1).every((n) => !/zayt-l-(en|ar)/.test(n.settings.css_classes))) fail('single-language page carries language-switch classes');

  if (kind === 'bilingual') {
    const body = tpl.content.slice(1);
    const lang_of = (n) => (/\bzayt-l-en\b/.test(n.settings.css_classes) ? 'en' : /\bzayt-l-ar\b/.test(n.settings.css_classes) ? 'ar' : null);
    if (body.some((n) => !lang_of(n))) fail('a top-level block has no language class');
    const en = body.filter((n) => lang_of(n) === 'en');
    const ar = body.filter((n) => lang_of(n) === 'ar');
    const shape = (n) => `${n.elType}:${n.widgetType || ''}[${(n.elements || []).map(shape).join(',')}]`;
    if (en.length !== ar.length) fail(`EN has ${en.length} blocks, AR has ${ar.length}`);
    else en.forEach((n, i) => {
      if (shape(n) !== shape(ar[i])) fail(`block ${i} (${n.settings._title}) differs structurally between EN and AR`);
      if (n.settings._title.replace(/^EN · /, '') !== ar[i].settings._title.replace(/^AR · /, '')) fail(`block ${i}: titles do not pair up`);
      if (!/\bzayt-rtl\b/.test(ar[i].settings.css_classes)) fail(`AR block ${i} is not RTL`);
    });
    // every anchor id of EN has its "-ar" twin
    for (const [id] of domIds) if (!id.startsWith('html:') && !id.endsWith('-ar') && !domIds.has(id + '-ar') && !domIds.has(id.replace(/-ar$/, ''))) fail(`anchor "${id}" has no counterpart`);
    console.log(`  language blocks: EN ${en.length} / AR ${ar.length}   (+1 shared code container)`);
  }
  const arabic = (raw.match(/[؀-ۿ]/g) || []).length;
  console.log(`  ids: ${ids.size} unique; DOM anchors: ${[...domIds.keys()].filter((k) => !k.startsWith('html:')).join(', ')}`);
  console.log(`  elements: ${JSON.stringify(counts)}; image URLs: ${new Set(ex).size} distinct; arabic chars: ${arabic}`);
  if (lang === 'ar' && arabic < 3000) fail('AR page has too little Arabic text');
  if (lang === 'en' && arabic > 800) fail('EN page contains too much Arabic');
}
console.log(failures ? `\n${failures} problem(s)` : '\nOK — all four templates valid');
process.exit(failures ? 1 : 0);
