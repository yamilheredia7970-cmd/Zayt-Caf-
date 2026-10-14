// Approximate Elementor renderer: turns the template JSON into DOM + the handful of CSS rules Elementor
// generates for the controls we use, so we can exercise our own CSS/JS in a real browser.
// NOT Elementor: positioning/specificity details of real Elementor are only approximated.
// Used only by the tests in this folder: it lets us run zayt.css / zayt.js in a real browser without WordPress.
export function renderTemplate(tpl, imgBase) {
let rules = '';
const bp = { '': '', _tablet: '@media (max-width:1024px)', _mobile: '@media (max-width:767px)' };
const add = (sel, decls, suffix = '') => {
  if (!decls.length) return;
  const body = `${sel}{${decls.join(';')}}`;
  rules += bp[suffix] ? `${bp[suffix]}{${body}}\n` : body + '\n';
};
const dimCss = (d) => `${d.top || 0}px ${d.right || 0}px ${d.bottom || 0}px ${d.left || 0}px`;
const sz = (v) => (v ? `${v.size}${v.unit}` : '');

const FALLBACK = { 'Playfair Display': 'Georgia, serif', 'Plus Jakarta Sans': 'system-ui, -apple-system, sans-serif', Alexandria: '"Noto Sans Arabic", system-ui, sans-serif' };

function containerRules(n) {
  const s = n.settings; const sel = `body .elementor-element.elementor-element-${n.id}`;
  const inner = s.content_width === 'boxed' ? `${sel}>.e-con-inner` : sel;
  for (const suf of ['', '_tablet', '_mobile']) {
    const outer = []; const flex = [];
    if (s['padding' + suf]) outer.push(`padding:${dimCss(s['padding' + suf])}`);
    if (s['margin' + suf]) outer.push(`margin:${dimCss(s['margin' + suf])}`);
    if (s['min_height' + suf]) outer.push(`min-height:${sz(s['min_height' + suf])}`);
    if (s['width' + suf]) outer.push(`width:${sz(s['width' + suf])}`);
    if (s['flex_direction' + suf]) flex.push(`flex-direction:${s['flex_direction' + suf]}`);
    if (s['flex_gap' + suf]) flex.push(`gap:${s['flex_gap' + suf].row}px ${s['flex_gap' + suf].column}px`);
    if (!suf) {
      if (s.flex_justify_content) flex.push(`justify-content:${s.flex_justify_content}`);
      if (s.flex_align_items) flex.push(`align-items:${s.flex_align_items}`);
      if (s.flex_wrap) flex.push('flex-wrap:wrap');
      if (s.background_color) outer.push(`background:${s.background_color}`);
      if (s.border_border) outer.push(`border-style:solid;border-width:${dimCss(s.border_width)};border-color:${s.border_color}`);
      if (s.border_radius) outer.push(`border-radius:${s.border_radius.top}px`);
      if (s.box_shadow_box_shadow) { const b = s.box_shadow_box_shadow; outer.push(`box-shadow:${b.horizontal}px ${b.vertical}px ${b.blur}px ${b.spread}px ${b.color}`); }
      if (s.overflow) outer.push(`overflow:${s.overflow}`);
      if (s.content_width === 'boxed') flex.push(`max-width:${sz(s.boxed_width)}`);
    }
    add(sel, outer, suf); add(inner, flex, suf);
  }
}

function typoCss(s, p = 'typography_') {
  const out = {};
  for (const suf of ['', '_tablet', '_mobile']) {
    const d = [];
    if (!suf && s[p + 'font_family']) d.push(`font-family:"${s[p + 'font_family']}",${FALLBACK[s[p + 'font_family']] || 'sans-serif'}`);
    if (s[p + 'font_size' + suf]) d.push(`font-size:${sz(s[p + 'font_size' + suf])}`);
    if (!suf && s[p + 'font_weight']) d.push(`font-weight:${s[p + 'font_weight']}`);
    if (s[p + 'line_height' + suf]) d.push(`line-height:${s[p + 'line_height' + suf].size}`);
    if (s[p + 'letter_spacing' + suf]) d.push(`letter-spacing:${s[p + 'letter_spacing' + suf].size}px`);
    if (!suf && s[p + 'text_transform']) d.push(`text-transform:${s[p + 'text_transform']}`);
    if (!suf && s[p + 'font_style']) d.push(`font-style:${s[p + 'font_style']}`);
    out[suf] = d;
  }
  return out;
}

function render(n) {
  const s = n.settings;
  const classes = `${s.css_classes || ''} ${s._css_classes || ''}`.trim();
  const idAttr = (s._element_id ? ` id="${s._element_id}"` : '') + (s._title ? ` data-title="${String(s._title).replace(/"/g, '&quot;')}"` : '');
  if (n.elType === 'container') {
    containerRules(n);
    const tag = s.html_tag || 'div';
    const base = `e-con e-flex ${s.content_width === 'boxed' ? 'e-con-boxed' : 'e-con-full'} ${n.isInner ? 'e-child' : 'e-parent'} elementor-element elementor-element-${n.id} ${classes}`;
    const kids = n.elements.map(render).join('');
    return `<${tag} class="${base}"${idAttr}>${s.content_width === 'boxed' ? `<div class="e-con-inner">${kids}</div>` : kids}</${tag}>`;
  }
  const sel = `body .elementor-element.elementor-element-${n.id}`;
  const wcls = `elementor-element elementor-element-${n.id} elementor-widget elementor-widget-${n.widgetType} ${classes}`;
  for (const suf of ['', '_tablet', '_mobile']) {
    if (s['_margin' + suf]) add(sel, [`margin:${dimCss(s['_margin' + suf])}`], suf);
  }
  if (n.widgetType === 'heading') {
    const ty = typoCss(s); const tag = s.header_size || 'h2';
    for (const suf of Object.keys(ty)) add(`${sel} .elementor-heading-title`, ty[suf].concat(!suf && s.title_color ? [`color:${s.title_color}`] : []), suf);
    if (s.align) add(sel, [`text-align:${s.align}`]);
    let t = s.title; if (s.link) t = `<a href="${s.link.url}">${t}</a>`;
    return `<div class="${wcls}"${idAttr}><div class="elementor-widget-container"><${tag} class="elementor-heading-title">${t}</${tag}></div></div>`;
  }
  if (n.widgetType === 'text-editor') {
    const ty = typoCss(s);
    for (const suf of Object.keys(ty)) add(sel, ty[suf].concat(!suf && s.text_color ? [`color:${s.text_color}`] : []), suf);
    if (s.align) add(sel, [`text-align:${s.align}`]);
    return `<div class="${wcls}"${idAttr}><div class="elementor-widget-container">${s.editor}</div></div>`;
  }
  if (n.widgetType === 'button') {
    const ty = typoCss(s); const b = `${sel} .elementor-button`;
    for (const suf of Object.keys(ty)) add(b, ty[suf], suf);
    add(b, [`background:${s.background_color}`, `color:${s.button_text_color}`, `border-radius:${s.border_radius.top}px`, `padding:${dimCss(s.text_padding)}`, 'text-decoration:none']
      .concat(s.border_border ? [`border:1px solid ${s.border_color}`] : []));
    add(`${b}:hover`, [`background:${s.button_background_hover_color}`]);
    const icon = s.selected_icon ? `<span class="elementor-button-icon elementor-align-icon-${s.icon_align}"><i class="${s.selected_icon.value}" style="display:inline-block;width:1em;height:1em;background:currentColor;border-radius:50%;opacity:.8"></i></span>` : '';
    const gap = s.icon_indent ? `margin-inline:${s.icon_align === 'right' ? `${s.icon_indent.size}px 0` : `0 ${s.icon_indent.size}px`}` : '';
    add(`${sel} .elementor-button-icon`, gap ? [gap] : []);
    return `<div class="${wcls}"${idAttr}><div class="elementor-widget-container"><div class="elementor-button-wrapper"><a class="elementor-button elementor-button-link" href="${s.link.url}"${s.link.is_external ? ' target="_blank"' : ''}><span class="elementor-button-content-wrapper">${icon}<span class="elementor-button-text">${s.text}</span></span></a></div></div></div>`;
  }
  if (n.widgetType === 'image') {
    const url = imgBase + s.image.url.split('/').pop();
    return `<div class="${wcls}"${idAttr}><div class="elementor-widget-container"><img src="${url}" alt="${(s.image.alt || '').replace(/"/g, '&quot;')}"></div></div>`;
  }
  if (n.widgetType === 'html') {
    return `<div class="${wcls}"${idAttr}><div class="elementor-widget-container">${s.html}</div></div>`;
  }
  throw new Error('widget ' + n.widgetType);
}

const body = tpl.content.map(render).join('\n');
const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
/* what Hello Elementor + Elementor core contribute that can interfere (approximation) */
html{line-height:1.15}body{margin:0;font-family:Roboto,Arial,sans-serif;color:#333;font-size:16px}
a{color:#c36;text-decoration:none}p{margin-block:0 .9rem}h1,h2,h3,h4{margin-block:.5rem 1rem;line-height:1.2;font-weight:500}
img{height:auto;max-width:100%;border:none;border-radius:0;box-shadow:none}
.elementor-widget:not(:last-child){margin-block-end:20px}
.e-con{--display:flex;display:flex;flex-direction:column;position:relative;width:100%;box-sizing:border-box;min-width:0;padding:10px;gap:20px}
.e-con-boxed>.e-con-inner{display:flex;flex-direction:column;width:100%;margin-inline:auto;box-sizing:border-box;gap:20px}
.e-con-full>.e-con,.e-con-inner>.e-con{}
.elementor-widget{position:relative}
.elementor-widget-image img{display:block}
.elementor-widget-container{}
.elementor-button{fill:currentColor;line-height:1;text-align:center}
.elementor-button-content-wrapper{display:flex;justify-content:center;align-items:center}
</style>
<style>${rules}</style></head><body>${body}</body></html>`;
return page;

}
