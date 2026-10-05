// Builders for Elementor Free (Flexbox Container) template JSON.
// Control names follow Elementor core: containers use flex_justify_content / flex_align_items /
// html_tag / css_classes, widgets use _css_classes / _margin, buttons use text_padding /
// button_background_hover_color, links use is_external: "on", dimensions are string-valued.
import { createHash } from 'node:crypto';
import { ICONS } from './icons.mjs';

// ---------- ids (deterministic, 7-char hex like Elementor's own) ----------
let seed = 'zayt';
let counter = 0;
const used = new Set();
export function resetIds(s) { seed = s; counter = 0; used.clear(); }
export function nextId() {
  let id;
  do { id = createHash('sha1').update(`${seed}:${counter++}`).digest('hex').slice(0, 7); } while (used.has(id));
  used.add(id);
  return id;
}

// ---------- value helpers ----------
const SUFFIX = ['', '_tablet', '_mobile'];
export const px = (n) => ({ unit: 'px', size: n, sizes: [] });
export const pct = (n) => ({ unit: '%', size: n, sizes: [] });
export const em = (n) => ({ unit: 'em', size: n, sizes: [] });
export const dim = (t, r = t, b = t, l = r) => ({
  unit: 'px', top: String(t), right: String(r), bottom: String(b), left: String(l),
  isLinked: t === r && r === b && b === l,
});
export const gapv = (n) => ({ unit: 'px', size: n, column: String(n), row: String(n), isLinked: true });
const arr = (v) => (Array.isArray(v) ? v : [v]);

// Writes key / key_tablet / key_mobile. `null`/undefined entries inherit from the larger breakpoint.
function rs(target, key, vals, wrap = (v) => v) {
  if (vals === undefined || vals === null) return;
  arr(vals).forEach((v, i) => {
    if (v !== undefined && v !== null) target[key + SUFFIX[i]] = wrap(v);
  });
}

// ---------- icons (lucide, inline svg) ----------
export function icon(name, { size = 16, stroke = 2, cls = '', fill = 'none', color = 'currentColor' } = {}) {
  const inner = ICONS[name];
  if (!inner) throw new Error(`Unknown icon ${name}`);
  return `<svg class="zayt-ic ${cls}" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${inner}</svg>`;
}

// ---------- fonts ----------
export const FONTS = {
  en: { display: 'Playfair Display', body: 'Plus Jakarta Sans' },
  ar: { display: 'Alexandria', body: 'Alexandria' },
};
let LANG = 'en';
export function setLang(l) { LANG = l; }
const fam = (role) => (role === 'mono' ? 'ui-monospace' : FONTS[LANG][role || 'body']);

// ---------- typography ----------
// size/lh/ls may be [desktop, tablet, mobile]. ls is in em and is converted to px per breakpoint.
function typo(s, o, prefix = 'typography_') {
  s[prefix + 'typography'] = 'custom';
  if (o.family !== false && o.role !== 'mono') s[prefix + 'font_family'] = fam(o.role);
  if (o.size !== undefined) rs(s, prefix + 'font_size', o.size, px);
  // The source forces .font-display to weight 700 in RTL (Alexandria has no light display cut).
  if (o.weight !== undefined) s[prefix + 'font_weight'] = String(o.role === 'display' && LANG === 'ar' ? 700 : o.weight);
  if (o.lh !== undefined) rs(s, prefix + 'line_height', o.lh, em);
  if (o.ls !== undefined) {
    // em → px per breakpoint (Elementor's letter-spacing control is px), following each breakpoint's font size
    const sizes = arr(o.size), ls = arr(o.ls);
    const n = Math.max(sizes.length, ls.length);
    for (let i = 0; i < n; i++) {
      const v = ls[Math.min(i, ls.length - 1)];
      const fs = sizes[Math.min(i, sizes.length - 1)];
      if (v === null || v === undefined || fs === null || fs === undefined) continue;
      s[prefix + 'letter_spacing' + SUFFIX[i]] = px(+(v * fs).toFixed(2));
    }
  }
  if (o.transform) s[prefix + 'text_transform'] = o.transform;
  if (o.italic) s[prefix + 'font_style'] = 'italic';
}

function common(s, o) {
  if (o.id) { s._element_id = o.id; }
  if (o.cls) { s._css_classes = o.cls; s.css_classes = o.cls; }
  if (o.mt !== undefined || o.mb !== undefined || o.mx !== undefined) {
    const mt = arr(o.mt ?? 0), mb = arr(o.mb ?? 0);
    const n = Math.max(mt.length, mb.length);
    for (let i = 0; i < n; i++) {
      const t = mt[Math.min(i, mt.length - 1)], b = mb[Math.min(i, mb.length - 1)];
      s['_margin' + SUFFIX[i]] = dim(t, 0, b, 0);
    }
  }
}

function el(elType, settings, extra = {}) {
  return { id: nextId(), elType, settings, ...extra };
}

// ---------- widgets ----------
export function widget(widgetType, settings) {
  delete settings.css_classes; // widgets use _css_classes; containers use css_classes
  return { id: nextId(), elType: 'widget', widgetType, settings, elements: [] };
}

export function heading(text, o = {}) {
  const s = { title: text, header_size: o.tag || 'h2' };
  if (o.color) s.title_color = o.color;
  if (o.align) { rs(s, 'align', o.align); }
  typo(s, o);
  if (o.url) s.link = { url: o.url, is_external: '', nofollow: '', custom_attributes: '' };
  common(s, o);
  return widget('heading', s);
}

export function text(html, o = {}) {
  const s = { editor: html };
  if (o.color) s.text_color = o.color;
  if (o.align) rs(s, 'align', o.align);
  typo(s, o);
  common(s, o);
  return widget('text-editor', s);
}

export function htmlw(html, o = {}) {
  const s = { html };
  common(s, o);
  return widget('html', s);
}

export function image(img, o = {}) {
  const s = {
    image: { url: img.url, id: img.id || '', alt: o.alt || '', source: 'library' },
    image_size: 'full',
  };
  if (o.align) s.align = o.align;
  common(s, o);
  return widget('image', s);
}

const BTN = {
  primary:  { bg: '#9E471D', hover: '#853A15', color: '#FFFFFF', weight: 500 },
  whatsapp: { bg: '#25D366', hover: '#20BD5A', color: '#0C0A09', weight: 600 },
  outline:  { bg: 'rgba(0,0,0,0)', hover: 'rgba(245,245,244,0.6)', color: '#292524', weight: 500, border: '#D6D3D1', borderHover: '#A8A29E' },
  outlineDark: { bg: 'rgba(0,0,0,0)', hover: '#292524', color: '#E7E5E4', weight: 500, border: '#44403C', borderHover: '#78716C' },
  ghostCard: { bg: '#FAF7F2', hover: 'rgba(37,211,102,0.1)', color: '#292524', weight: 500, border: 'rgba(231,229,228,0.9)', borderHover: '#6EE7B7', hoverColor: '#065F46' },
};
const BTN_SIZE = {
  sm: { fs: 12, pad: [6, 14], lh: 1.333 },
  md: { fs: 14, pad: [10, 20], lh: 1.4286 },
  lg: { fs: 16, pad: [14, 24], lh: 1.5 },
};

// o.icon = FontAwesome class (Elementor Free ships Font Awesome); o.iconEnd puts it after the text.
export function button(label, o = {}) {
  const v = BTN[o.variant || 'primary'];
  const z = BTN_SIZE[o.size || 'md'];
  const s = {
    text: label,
    link: { url: o.url || '#', is_external: o.external ? 'on' : '', nofollow: '', custom_attributes: '' },
    background_color: v.bg,
    button_text_color: v.color,
    button_background_hover_color: v.hover,
    hover_color: v.hoverColor || v.color,
    border_radius: dim(8),
    text_padding: dim(...(o.pad ?? z.pad)),
  };
  if (v.border) {
    s.border_border = 'solid';
    s.border_width = dim(1);
    s.border_color = v.border;
    s.button_hover_border_color = v.borderHover;
  }
  typo(s, { size: o.fs ?? z.fs, lh: z.lh, weight: o.weight || v.weight, role: 'body' });
  if (o.icon) {
    const lib = o.icon.startsWith('fab ') ? 'fa-brands' : o.icon.startsWith('far ') ? 'fa-regular' : 'fa-solid';
    s.selected_icon = { value: o.icon, library: lib };
    s.icon_align = o.iconEnd ? 'right' : 'left';
    s.icon_indent = { unit: 'px', size: o.size === 'sm' ? 6 : o.size === 'lg' ? 10 : 8, sizes: [] };
  }
  if (o.alignM) s.align_mobile = o.alignM;
  if (o.align) s.align = o.align;
  const cls = ['zayt-btn', o.iconEnd ? 'zayt-icon-end' : '', o.full ? 'zayt-full' : '', o.cls || ''].filter(Boolean).join(' ');
  common(s, { ...o, cls });
  return widget('button', s);
}

// ---------- containers ----------
// o: top, boxed(px), tag, id, cls, dir/dirT/dirM, gap, align, justify, wrap, pad, mar, bg, border, radius,
//    shadow, overflow, minH, w (percent or {unit,size}), grow
export function box(o = {}, kids = []) {
  const s = {};
  s.content_width = o.boxed ? 'boxed' : 'full';
  if (o.boxed) s.boxed_width = px(o.boxed);
  s.flex_direction = o.dir || 'column';
  if (o.dirT) s.flex_direction_tablet = o.dirT;
  if (o.dirM) s.flex_direction_mobile = o.dirM;
  if (o.justify) s.flex_justify_content = o.justify;
  if (o.align) s.flex_align_items = o.align;
  if (o.wrap) s.flex_wrap = 'wrap';
  // Elementor's kit gives every container 20px gap + 10px padding by default: always set explicitly.
  rs(s, 'flex_gap', o.gap ?? 0, gapv);
  const pad = o.pad ?? [0];
  arr(Array.isArray(pad[0]) ? pad : [pad]).forEach((p, i) => { if (p) s['padding' + SUFFIX[i]] = dim(...p); });
  if (o.mar) arr(Array.isArray(o.mar[0]) ? o.mar : [o.mar]).forEach((p, i) => { if (p) s['margin' + SUFFIX[i]] = dim(...p); });
  if (o.bg) { s.background_background = 'classic'; s.background_color = o.bg; }
  if (o.border) {
    s.border_border = 'solid';
    s.border_width = o.border.w || dim(1);
    s.border_color = o.border.color;
  }
  if (o.radius !== undefined) s.border_radius = dim(o.radius);
  if (o.shadow) {
    s.box_shadow_box_shadow_type = 'yes';
    s.box_shadow_box_shadow = o.shadow;
  }
  if (o.overflow) s.overflow = o.overflow;
  if (o.minH) rs(s, 'min_height', o.minH, px);
  if (o.w !== undefined) {
    s.width = typeof o.w === 'number' ? pct(o.w) : o.w;
    if (o.wT !== undefined) s.width_tablet = pct(o.wT);
    if (o.wM !== undefined) s.width_mobile = pct(o.wM);
  }
  if (o.tag) s.html_tag = o.tag;
  common(s, o);
  return {
    id: nextId(),
    elType: 'container',
    isInner: !o.top,
    settings: s,
    elements: kids.filter(Boolean),
  };
}

export const SHADOW = {
  xs: { horizontal: 0, vertical: 1, blur: 2, spread: 0, color: 'rgba(0,0,0,0.05)' },
  md: { horizontal: 0, vertical: 4, blur: 6, spread: -1, color: 'rgba(0,0,0,0.1)' },
  lg: { horizontal: 0, vertical: 10, blur: 15, spread: -3, color: 'rgba(0,0,0,0.1)' },
};
