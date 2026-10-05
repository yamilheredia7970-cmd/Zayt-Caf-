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
const COMMON = ['_element_id', '_css_classes', '_margin', '_margin_tablet', '_margin_mobile', '_padding', '_z_index'];
const TYPO = ['typography', 'font_family', 'font_size', 'font_weight', 'line_height', 'letter_spacing', 'text_transform', 'font_style'];
const typo = (p) => TYPO.flatMap((k) => [p + k, p + k + '_tablet', p + k + '_mobile']);
const R = (...ks) => ks.flatMap((k) => [k, k + '_tablet', k + '_mobile']);
const ALLOWED = {
  container: new Set([
    'content_width', 'boxed_width', ...R('flex_direction', 'flex_gap', 'padding', 'margin', 'min_height', 'width'),
    'flex_justify_content', 'flex_align_items', 'flex_wrap', 'background_background', 'background_color',
    'border_border', 'border_width', 'border_color', 'border_radius', 'box_shadow_box_shadow_type', 'box_shadow_box_shadow',
    'overflow', 'html_tag', 'css_classes', '_element_id', '_css_classes',
  ]),
  heading: new Set([...COMMON, 'title', 'header_size', 'title_color', 'link', ...R('align'), ...typo('typography_')]),
  'text-editor': new Set([...COMMON, 'editor', 'text_color', ...R('align'), ...typo('typography_')]),
  button: new Set([...COMMON, 'text', 'link', 'background_color', 'button_text_color', 'button_background_hover_color', 'hover_color',
    'border_radius', 'text_padding', 'border_border', 'border_width', 'border_color', 'button_hover_border_color',
    'selected_icon', 'icon_align', 'icon_indent', ...R('align'), ...typo('typography_')]),
  image: new Set([...COMMON, 'image', 'image_size', 'align']),
  html: new Set([...COMMON, 'html']),
};

let failures = 0;
const fail = (m) => { failures++; console.error('  ✗ ' + m); };
const css = readFileSync(join(HERE, 'zayt.css'), 'utf8');
const definedClasses = new Set([...css.matchAll(/\.(zayt-[\w-]+)/g)].map((m) => m[1]));

const stats = {};
for (const lang of ['en', 'ar']) {
  const file = join(DIR, `zayt-home-${lang}.json`);
  const raw = readFileSync(file, 'utf8');
  const tpl = JSON.parse(raw);
  console.log(`\n${lang.toUpperCase()}  ${file}`);

  for (const k of ['version', 'title', 'type', 'content']) if (!(k in tpl)) fail(`missing top-level "${k}"`);
  if (tpl.type !== 'page') fail('type must be "page"');

  const ids = new Set();
  const counts = { container: 0, heading: 0, 'text-editor': 0, button: 0, image: 0, html: 0 };
  const usedClasses = new Set();
  const walk = (n, depth, parent) => {
    if (!/^[0-9a-f]{7}$/.test(n.id || '')) fail(`bad id "${n.id}"`);
    if (ids.has(n.id)) fail(`duplicate id ${n.id}`);
    ids.add(n.id);
    if (!Array.isArray(n.elements)) fail(`${n.id}: elements must be an array`);
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
      if (n.widgetType === 'button' && n.settings.link) {
        const l = n.settings.link;
        if (typeof l.is_external === 'boolean') fail(`${n.id}: link.is_external must be "on"/"" not boolean`);
      }
      if (n.widgetType === 'image' && !/^https?:\/\//.test(n.settings.image.url)) fail(`${n.id}: image url not absolute`);
    } else fail(`${n.id}: elType ${n.elType}`);
    for (const k of ['_css_classes', 'css_classes']) (n.settings[k] || '').split(/\s+/).filter(Boolean).forEach((c) => usedClasses.add(c));
    n.elements.forEach((c) => walk(c, depth + 1, n));
  };
  tpl.content.forEach((n) => walk(n, 0, null));

  // classes referenced from HTML widgets / widget wrapper classes must exist in the shipped CSS
  for (const m of raw.matchAll(/class=\\"([^\\"]+)\\"/g)) m[1].split(/\s+/).forEach((c) => c.startsWith('zayt-') && usedClasses.add(c));
  // zayt-menu-item / zayt-cat-* are JS hooks (menu filter), not styled
  const missing = [...usedClasses].filter((c) => c.startsWith('zayt-') && !definedClasses.has(c) && c !== 'zayt-menu-item' && !c.startsWith('zayt-cat-'));
  if (missing.length) fail(`classes without CSS: ${missing.join(', ')}`);

  if (/["'(]\/src\/assets|\.\.\/assets|undefined|\[object/.test(raw.replace(/<style[\s\S]*?<\/style>/, '').replace(/<script[\s\S]*?<\/script>/, ''))) fail('found /src/assets, undefined or [object] in output');
  const ex = raw.match(/https?:\/\/[^"\\\s]+\.(jpg|png)/g) || [];
  if (!ex.length) fail('no image URLs');
  console.log(`  ids: ${ids.size} unique   elements: ${JSON.stringify(counts)}`);
  console.log(`  image URLs: ${[...new Set(ex)].length} distinct; first = ${ex[0]}`);
  const arabic = (raw.match(/[؀-ۿ]/g) || []).length;
  console.log(`  arabic characters: ${arabic}`);
  if (lang === 'ar' && arabic < 3000) fail('AR page has too little Arabic text');
  if (lang === 'en' && arabic > 800) fail('EN page contains too much Arabic');
  stats[lang] = { counts, ids: ids.size };
}
if (JSON.stringify(stats.en.counts) !== JSON.stringify(stats.ar.counts)) fail('EN and AR structures differ');
console.log(failures ? `\n${failures} problem(s)` : '\nOK — structure valid, EN/AR structurally identical');
process.exit(failures ? 1 : 0);
