// Shared helpers for the browser tests. They need Playwright + Chromium:
//   PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs  CHROMIUM_PATH=/path/to/chrome  node tools/elementor/test/<file>.mjs
// WordPress/Elementor are NOT involved: harness.mjs approximates Elementor's DOM + control CSS (see its header).
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderTemplate } from './harness.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
export const ROOT = resolve(HERE, '../../..');
export const TEMPLATES = join(ROOT, 'elementor/templates');
const pw = await import(process.env.PLAYWRIGHT_MODULE || '/opt/node-tools/node_modules/playwright/index.mjs');

export const load = (name) => JSON.parse(readFileSync(join(TEMPLATES, name), 'utf8'));
export const clone = (x) => JSON.parse(JSON.stringify(x));

// Serves the rendered template at / and /ar/ (what snippet-ar-route.php does in WordPress) plus the images.
export async function startServer() {
  let html = '';
  const srv = createServer((req, res) => {
    const p = req.url.split('?')[0];
    if (p.startsWith('/img/')) {
      const f = join(ROOT, 'src/assets/images', p.slice(5));
      if (existsSync(f)) { res.writeHead(200, { 'content-type': 'image/jpeg' }); return res.end(readFileSync(f)); }
    }
    if (p === '/' || p === '/ar/' || p === '/ar') { res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); return res.end(html); }
    res.writeHead(404); res.end('not found');
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${srv.address().port}`;
  return {
    base,
    set(tpl, { extraHead = '' } = {}) { html = renderTemplate(tpl, '/img/').replace('</head>', `${extraHead}</head>`); },
    close: () => new Promise((r) => srv.close(r)),
  };
}

export async function launch() {
  return pw.chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
}

export function reporter() {
  let fails = 0;
  return {
    ok(cond, msg) { console.log(`  ${cond ? '✓' : '✗'} ${msg}`); if (!cond) fails++; },
    info(msg) { console.log(`  · ${msg}`); },
    section(msg) { console.log(`\n${msg}`); },
    done() { console.log(fails ? `\n${fails} FAILED` : '\nall checks passed'); return fails; },
  };
}

// --- template editing helpers (what an editor does in Elementor, done on the JSON) ---
export function walk(nodes, fn, parent = null) {
  for (const n of nodes) { fn(n, parent); walk(n.elements || [], fn, n); }
}
export function find(nodes, pred) { let out = null; walk(nodes, (n, p) => { if (!out && pred(n, p)) out = n; }); return out; }
export function findAll(nodes, pred) { const out = []; walk(nodes, (n) => { if (pred(n)) out.push(n); }); return out; }
export const cls = (n) => `${n.settings.css_classes || ''} ${n.settings._css_classes || ''}`;
export const topBy = (tpl, title) => tpl.content.find((n) => n.settings._title === title);
let seq = 0;
// like Elementor's "Duplicate": same settings, fresh ids
export function duplicate(node) {
  const c = clone(node);
  walk([c], (n) => { n.id = (0xa00000 + seq++).toString(16).padStart(7, '0'); });
  return c;
}
// CSS + JS exactly as the external-assets variant expects them to be loaded site-wide
export function siteWideAssets() {
  const css = readFileSync(join(ROOT, 'tools/elementor/zayt.css'), 'utf8');
  const js = readFileSync(join(ROOT, 'tools/elementor/zayt.js'), 'utf8');
  const cfg = { mode: 'bilingual', lang: 'en', paths: { en: '/', ar: '/ar/' }, sfx: { en: '', ar: '-ar' }, titles: { en: 'EN', ar: 'AR' } };
  return `<style>${css}</style><script>var ZAYT_CFG=${JSON.stringify(cfg)};${js}</script>`;
}
