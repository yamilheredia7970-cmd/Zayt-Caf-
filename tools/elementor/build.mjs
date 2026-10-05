#!/usr/bin/env node
// Zayt Café → Elementor Free page templates (EN + AR).
//
//   node tools/elementor/build.mjs [--out elementor/templates] [--image-base-url URL] [--media-map file.json]
//                                  [--lang-urls en=/,ar=/ar/]
//
// Source of truth: src/data/content.ts (read directly) + the UI strings transcribed below from
// src/components/*.tsx and src/sections/*.tsx. No Elementor Pro widgets, no third-party plugin widgets.
import { readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  resetIds, setLang, px, dim, icon, heading, text, htmlw, image, button, box, SHADOW,
} from './lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '../..');

// ---------------------------------------------------------------- CLI
const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => (a.startsWith('--') ? [...acc, [a.slice(2), all[i + 1]]] : acc), []),
);
const OUT = resolve(ROOT, args.out || 'elementor/templates');
// TEMPORARY default: raw GitHub URLs so Elementor's importer can download the images into the Media Library
// (works only if the repo is public). Override with --image-base-url or --media-map.
const IMAGE_BASE = args['image-base-url'] || 'https://raw.githubusercontent.com/yamilheredia7970-cmd/Zayt-Caf-/main/src/assets/images/';
const MEDIA_MAP = args['media-map'] ? JSON.parse(readFileSync(resolve(args['media-map']), 'utf8')) : {};
const LANG_URLS = Object.fromEntries((args['lang-urls'] || 'en=/,ar=/ar/').split(',').map((p) => p.split('=')));

// ---------------------------------------------------------------- content from the React source
const imagesTs = readFileSync(join(ROOT, 'src/data/images.ts'), 'utf8');
const IMAGE_FILES = Object.fromEntries([...imagesTs.matchAll(/import (\w+) from '\.\.\/assets\/images\/([^']+)'/g)].map((m) => [m[1], m[2]]));

let contentSrc = readFileSync(join(ROOT, 'src/data/content.ts'), 'utf8')
  .replace(/import \{[^}]*\} from '\.\.\/types';\n/, '')
  .replace(/import \{ ASSET_IMAGES \} from '\.\/images';\n/, `const ASSET_IMAGES = ${JSON.stringify(Object.fromEntries(Object.keys(IMAGE_FILES).map((k) => [k, `img:${k}`])))};\n`);
const content = await import(`data:text/javascript;base64,${Buffer.from(stripTypeScriptTypes(contentSrc)).toString('base64')}`);
const { BRAND_CONFIG, NAV_LINKS, MENU_CATEGORIES, PRODUCTS, FEATURES, TESTIMONIALS, GALLERY_ITEMS, OPENING_HOURS, CONTACT_DATA, buildWhatsAppUrl } = content;

function img(ref) {
  const key = ref.replace(/^img:/, '');
  if (MEDIA_MAP[key]) return MEDIA_MAP[key];
  return { url: IMAGE_BASE + IMAGE_FILES[key], id: '' };
}

// ---------------------------------------------------------------- small helpers
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const BORDER = { color: 'rgba(231,229,228,0.8)' };
const SEC_BORDER = { w: dim(0, 0, 1, 0), color: 'rgba(231,229,228,0.7)' };
const css = readFileSync(join(HERE, 'zayt.css'), 'utf8');
const js = readFileSync(join(HERE, 'zayt.js'), 'utf8');

function build(L) {
  const ar = L === 'ar';
  const t = (en, a) => (ar ? a : en);
  const rtl = ar ? ' zayt-rtl' : '';
  setLang(L);
  resetIds(`zayt-home-${L}`);
  const wa = (name) => buildWhatsAppUrl(name, L);

  // top-level section shell: outer container carries the full-bleed background, boxed inner = max-w-7xl
  // py = [desktop, tablet, mobile] vertical padding; pyB overrides the bottom when it differs (hero)
  const section = ({ id, bg, py, pyB = py, border = true, boxed = 1216, tag = 'section', cls = '', align, kids }) =>
    box({
      top: true, boxed, tag, id, cls: `zayt${rtl} ${cls}`.trim(), bg, align,
      border: border ? SEC_BORDER : undefined,
      pad: [[py[0], 32, pyB[0], 32], [py[1], 24, pyB[1], 24], [py[2], 16, pyB[2], 16]],
    }, kids);

  const PY = [96, 96, 64]; // py-16 sm:py-24 → [desktop, tablet, mobile]

  const sectionHead = (kicker, title, subtitle) => box({ cls: 'zayt-head' }, [
    heading(kicker, { tag: 'span', size: 12, weight: 600, lh: 1.333, ls: 0.05, transform: 'uppercase', color: '#9E471D', align: 'center', mb: 10 }),
    heading(title, { tag: 'h2', role: 'display', size: [48, 36, 30], weight: 600, lh: 1.15, ls: -0.025, color: '#1C1917', align: 'center', cls: 'zayt-display zayt-balance' }),
    subtitle && text(`<p>${esc(subtitle)}</p>`, { size: [18, 18, 16], lh: 1.625, color: '#57534E', align: 'center', mt: 16, cls: 'zayt-balance' }),
  ]);

  const card = (o, kids) => box({
    bg: '#FFFFFF', border: BORDER, radius: 12, shadow: SHADOW.xs,
    pad: [[28, 28, 28, 28], [28, 28, 28, 28], [24, 24, 24, 24]], ...o,
    cls: `zayt-card ${o.cls || ''}`.trim(),
  }, kids);
  const padCard = (a, b) => [[a, a, a, a], [a, a, a, a], [b, b, b, b]];

  // ================================================================ assets (CSS + JS + fonts)
  const assets = box({ top: true, cls: 'zayt-assets', gap: 0 }, [
    htmlw(
      `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` +
      `<link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">` +
      `<style id="zayt-css">\n${css}\n</style>\n<script id="zayt-js">\nvar ZAYT_LANG=${JSON.stringify(L)};\n${js}\n</script>`,
    ),
  ]);

  // ================================================================ header
  const navLinks = (cls) => NAV_LINKS.map((l) => `<a href="${l.href}">${esc(l.label[L])}</a>`).join('');
  const langSwitch = (extra = '') =>
    `<div class="zayt-lang ${extra}" role="group" aria-label="Language selection">${icon('globe', { size: 14 })}` +
    `<a href="${LANG_URLS.en}" hreflang="en" lang="en"${ar ? '' : ' class="is-current" aria-current="true"'}>English</a>` +
    `<a href="${LANG_URLS.ar}" hreflang="ar" lang="ar"${ar ? ' class="is-current" aria-current="true"' : ''}>العربية</a></div>`;
  const waGeneral = wa();
  const waCta = t('WhatsApp Order', 'اطلب عبر واتساب');

  const header = box({
    top: true, boxed: 1216, tag: 'header', cls: `zayt zayt-header${rtl}`, bg: 'rgba(250,247,242,0.95)',
    border: { w: dim(0, 0, 1, 0), color: 'rgba(231,229,228,0.8)' },
    pad: [[0, 32, 0, 32], [0, 24, 0, 24], [0, 16, 0, 16]],
    dir: 'row', justify: 'space-between', align: 'center', gap: 16,
  }, [
    heading(ar ? BRAND_CONFIG.nameAr : BRAND_CONFIG.nameEn, {
      tag: 'div', url: '#home', role: 'display', size: [30, 30, 24], weight: 700, lh: [1.2, 1.2, 1.333], ls: -0.025, color: '#1C1917', cls: 'zayt-brand zayt-display',
    }),
    htmlw(`<nav class="zayt-nav" aria-label="Main Navigation">${navLinks()}</nav>`),
    box({ cls: 'zayt-header-actions', dir: 'row', align: 'center', justify: 'flex-end', gap: 12 }, [
      htmlw(langSwitch()),
      button(waCta, { url: waGeneral, external: true, variant: 'whatsapp', size: 'sm', icon: 'fab fa-whatsapp', weight: 600, cls: 'zayt-header-wa' }),
      htmlw(
        `<button type="button" class="zayt-burger" aria-expanded="false" aria-label="Open Navigation Menu" data-label-open="Open Navigation Menu" data-label-close="Close Navigation Menu"><span class="i-open">${icon('menu', { size: 24 })}</span><span class="i-close">${icon('x', { size: 24 })}</span></button>` +
        `<div class="zayt-drawer"><nav aria-label="Mobile Navigation">${navLinks()}</nav><div class="zayt-drawer-foot"><div class="zayt-drawer-row"><span>${t('Language', 'اللغة')}</span>${langSwitch('zayt-lang--drawer')}</div>` +
        `<a class="zayt-hbtn zayt-hbtn--wa zayt-hbtn--md zayt-hbtn--full" href="${esc(waGeneral)}" target="_blank" rel="noopener noreferrer">${icon('message-circle', { size: 16 })}<span>${esc(waCta)}</span></a></div></div>`,
        { cls: 'zayt-burger-wrap' },
      ),
    ]),
  ]);

  // ================================================================ hero
  const heroCopy = {
    kicker: t('Artisan Specialty Coffee & Bakery — Dubai', 'مقهى ومخبز حرفي مختص — دبي'),
    l1: t('Where Specialty Coffee Meets', 'حيث تلتقي القهوة المختصة'),
    hl: t('Mediterranean Warmth', 'بدفء البحر الأبيض المتوسط'),
    desc: t(
      'Single-origin rare roasts from Yemen and Ethiopia, slow-fermented 48-hour artisan sourdough, and regional botanicals woven into every cup and golden morning pastry.',
      'محاصيل بن نادرة من مزارع حراز اليمنية وإثيوبيا، مخبوزات طازجة بالتخمير البطيء لمدة ٤٨ ساعة، ومعجنات عطرية بنكهات الهيل وزهر البرتقال وزيت الزيتون البكر.',
    ),
    ctaMenu: t('Explore Menu', 'استكشف القائمة'),
    ctaWa: t('Order on WhatsApp', 'اطلب عبر واتساب'),
    b1: t('Ethical Single Origins', 'بن بمحاصيل نادرة'),
    b2: t('48h Slow-Fermented', 'مخبوزات طازجة يومياً'),
    b3: t('Alserkal Arts District', 'حي السركال للفنون'),
    caption: t('Natural travertine arches, acoustic calm & shaded olive trees', 'مساحة هادئة مستوحاة من حجر الترافرتين وأشجار الزيتون'),
  };
  const heroImg = img('img:heroInterior');
  const hero = section({
    id: 'home', bg: undefined, border: true, py: [72, 56, 32], pyB: [128, 96, 64],
    kids: [box({ cls: 'zayt-g12', dir: 'row', dirT: 'column', dirM: 'column', align: 'center', gap: [56, 40, 40] }, [
      box({ cls: 'zayt-span-7', w: 58.33, wT: 100, wM: 100, align: 'flex-start' }, [
        htmlw(`<div class="zayt-pill"><i aria-hidden="true"></i><span>${esc(heroCopy.kicker)}</span></div>`, { mb: 20 }),
        heading(`${esc(heroCopy.l1)} <span class="zayt-hl">${esc(heroCopy.hl)}</span>`, {
          tag: 'h1', role: 'display', size: [60, 48, 36], weight: 600, lh: 1.12, ls: -0.025, color: '#1C1917', mb: 24, cls: 'zayt-display zayt-balance',
        }),
        text(`<p>${esc(heroCopy.desc)}</p>`, { size: [20, 18, 16], lh: 1.625, color: '#57534E', mb: 32, cls: 'zayt-mw-672' }),
        box({ dir: 'row', wrap: true, align: 'center', gap: 14, mar: [0, 0, 40, 0] }, [
          button(heroCopy.ctaMenu, { url: '#menu', size: 'lg', icon: ar ? 'fas fa-arrow-left' : 'fas fa-arrow-right', iconEnd: true, cls: 'zayt-full-xs' }),
          button(heroCopy.ctaWa, { url: waGeneral, external: true, variant: 'whatsapp', size: 'lg', icon: 'fab fa-whatsapp', cls: 'zayt-full-xs zayt-ic20' }),
        ]),
        htmlw(
          `<div class="zayt-trust"><span><b>✓</b><span>${esc(heroCopy.b1)}</span></span><span class="sep" aria-hidden="true">·</span>` +
          `<span><b>✓</b><span>${esc(heroCopy.b2)}</span></span><span class="sep" aria-hidden="true">·</span>` +
          `<span class="is-muted">${icon('map-pin', { size: 14 })}<span>${esc(heroCopy.b3)}</span></span></div>`,
          { cls: 'zayt-full-w' },
        ),
      ]),
      box({ cls: 'zayt-span-5', w: 41.67, wT: 100, wM: 100 }, [
        box({ cls: 'zayt-media zayt-media--hero', radius: 16, border: BORDER, shadow: SHADOW.lg, overflow: 'hidden', bg: '#F5F5F4' }, [
          image(heroImg, { alt: 'Zayt Café warm minimalist interior with travertine espresso counter and arched limestone architecture' }),
          htmlw(
            `<div class="zayt-hero-cap"><div><span class="k">${esc(BRAND_CONFIG.nameEn)} · Al Quoz</span><p>${esc(heroCopy.caption)}</p></div><i title="Open Today"></i></div>`,
            { cls: 'zayt-hero-cap-wrap' },
          ),
        ]),
      ]),
    ])],
  });

  // ================================================================ features
  const features = section({
    bg: '#FAF7F2', py: PY, kids: [
      sectionHead(
        t('Our Craft & Values', 'فلسفتنا في الجودة'),
        t('The Four Pillars of Zayt', 'أربعة أركان تصنع تجربة مقهى زيت'),
        t('From high-altitude micro-lots to slow-ferment hearth ovens, we honor the ritual of slow gathering and uncompromised ingredients.',
          'من مزارع البن المرتفعة إلى أفران التخمير البطيء، نلتزم بأعلى معايير الإتقان مع لمسة من الدفء والضيافة المتوسطية.'),
      ),
      box({ cls: 'zayt-cols zayt-cols--md2 zayt-cols--lg4', gap: 24 }, FEATURES.map((f, i) =>
        card({ pad: padCard(32, 24) }, [
          htmlw(`<div class="zayt-feat-top"><div class="zayt-feat-icon">${icon(f.iconName, { size: 24, stroke: 1.5 })}</div><span class="zayt-feat-num">0${i + 1}.</span></div>`, { mb: 20 }),
          heading(f.title[L], { tag: 'h3', role: 'display', size: 20, weight: 600, lh: 1.375, color: '#1C1917', mb: 10, cls: 'zayt-display' }),
          text(`<p>${esc(f.description[L])}</p>`, { size: 14, lh: 1.625, color: '#57534E' }),
        ]))),
    ],
  });

  // ================================================================ product card (featured + full menu)
  const BADGE_TYPES = ['popular', 'chef', 'signature', 'new'];
  const productCard = (p, extra = '') => {
    const name = p.name[L];
    const badge = p.badge
      ? htmlw(`<span class="zayt-badge zayt-badge--${BADGE_TYPES.includes(p.badge.type) ? p.badge.type : 'popular'}">${esc(p.badge[L])}</span>`, { cls: 'zayt-badge-wrap' })
      : null;
    return box({
      cls: `zayt-card zayt-product ${extra}`.trim(), bg: '#FFFFFF', border: BORDER, radius: 12, shadow: SHADOW.xs, overflow: 'hidden',
    }, [
      box({ cls: 'zayt-media' }, [image(img(p.image), { alt: name }), badge]),
      box({ cls: 'zayt-card-body', gap: 16, justify: 'space-between', pad: [[24, 24, 24, 24], [24, 24, 24, 24], [20, 20, 20, 20]] }, [
        box({ cls: 'zayt-card-top', gap: 8 }, [
          box({ cls: 'zayt-card-title', dir: 'row', align: 'baseline', justify: 'space-between', gap: 12 }, [
            heading(name, { tag: 'h3', role: 'display', size: [20, 20, 18], weight: 600, lh: 1.375, color: '#1C1917', cls: 'zayt-display' }),
            text(`<p>${p.price} <small>${esc(p.currency[L])}</small></p>`, { size: [18, 18, 16], weight: 600, lh: 1.556, color: '#1C1917', cls: 'zayt-price' }),
          ]),
          text(`<p>${esc(p.description[L])}</p>`, { size: [14, 14, 12], lh: 1.625, color: '#57534E', cls: 'zayt-clamp3' }),
        ]),
        box({ pad: [12, 0, 0, 0], border: { w: dim(1, 0, 0, 0), color: '#F5F5F4' } }, [
          button(t('Order on WhatsApp', 'اطلب عبر واتساب'), {
            url: wa(name), external: true, variant: 'ghostCard', size: 'sm', icon: 'fab fa-whatsapp', fs: [14, 14, 12], pad: [8, 14], full: true, cls: 'zayt-card-btn',
          }),
        ]),
      ]),
    ]);
  };

  // ================================================================ featured menu
  const featuredItems = PRODUCTS.filter((p) => p.isFeatured).slice(0, 4);
  const featured = section({
    bg: '#FAF9F6', py: PY, kids: [
      sectionHead(
        t('Signatures & Favorites', 'أصناف مميزة'),
        t('Most Celebrated Creations', 'مختارات الموسم الأكثر طلباً'),
        t('Our guest favorites that define the spirit of Zayt — from stone-ground pistachio latte to wild mountain zaatar sourdough.',
          'أطباق ومشروبات ابتكرناها لتكون بصمة مقهى زيت، تُحضر يومياً بشغف وأجود المكونات الطبيعية.'),
      ),
      box({ cls: 'zayt-cols zayt-cols--sm2 zayt-cols--lg4 zayt-gap-24-28', gap: 24, mar: [0, 0, 48, 0] }, featuredItems.map((p) => productCard(p))),
      box({ dir: 'row', justify: 'center' }, [
        button(t('View Complete Menu', 'عرض القائمة الكاملة'), { url: '#menu', variant: 'outline', size: 'md', icon: ar ? 'fas fa-arrow-left' : 'fas fa-arrow-right', iconEnd: true }),
      ]),
    ],
  });

  // ================================================================ full menu
  const filterBar =
    `<div class="zayt-filter" data-zayt-filter>` +
    MENU_CATEGORIES.map((c, i) => `<button type="button" data-cat="${c.id}" class="${i === 0 ? 'is-active' : ''}" aria-pressed="${i === 0}">${esc(c.label[L])}</button>`).join('') +
    `</div>`;
  const menu = section({
    id: 'menu', bg: '#FFFFFF', py: PY, kids: [
      sectionHead(
        t('The Artisan Menu', 'القائمة الحرفية'),
        t('Explore Our Food & Beverage Menu', 'استكشف أصناف المقهى والمخبز'),
        t('All items are crafted fresh in-house daily, using ethical micro-lot coffees, unbleached stoneground flours, and pure cultured butter.',
          'جميع أصنافنا تُحضر يومياً في مقهانا باستخدام أفضل حبوب البن المحمصة والدقيق غير المبيض والزبدة النقية.'),
      ),
      htmlw(filterBar),
      box({ cls: 'zayt-cols zayt-cols--sm2 zayt-cols--lg3 zayt-gap-24-28', gap: 24 },
        PRODUCTS.map((p) => productCard(p, `zayt-menu-item zayt-cat-${p.category}`))),
      box({
        bg: '#FAF7F2', border: BORDER, radius: 12, shadow: SHADOW.xs, mar: [56, 0, 0, 0],
        pad: padCard(32, 24), dir: 'row', dirT: 'row', dirM: 'column', align: 'center', justify: 'space-between', gap: 16,
      }, [
        box({ gap: 4 }, [
          heading(t('Catering & Custom Pre-Orders', 'طلبات الضيافة والمناسبات الخاصة'), { tag: 'h3', role: 'display', size: 18, weight: 600, lh: 1.556, color: '#1C1917', align: [null, null, 'center'], cls: 'zayt-display' }),
          text(`<p>${esc(t('Have specific dietary preferences or need to place a catering preorder?', 'هل لديك متطلبات غذائية خاصة أو ترغب بطلب مسبق لكميات كبيرة؟'))}</p>`, { size: [14, 14, 12], lh: 1.4286, color: '#57534E', align: [null, null, 'center'], cls: 'zayt-mw-576' }),
        ]),
        button(t('Inquire on WhatsApp for Special Orders', 'تواصل عبر واتساب للطلبات الخاصة'), { url: waGeneral, external: true, variant: 'whatsapp', size: 'md', icon: 'fab fa-whatsapp' }),
      ]),
    ],
  });

  // ================================================================ about
  const stat = (n, label) => box({ cls: 'zayt-stat', bg: '#FFFFFF', border: BORDER, radius: 12, shadow: SHADOW.xs, pad: [20, 20, 20, 20] }, [
    htmlw(`<b>${esc(n)}</b><span>${esc(label)}</span>`),
  ]);
  const aboutImg = (key, alt) => box({ cls: 'zayt-media zayt-ar-45', radius: 12, border: BORDER, shadow: SHADOW.xs, overflow: 'hidden', bg: '#F5F5F4' }, [image(img(key), { alt })]);
  const values = [
    ['leaf', t('Purity of Origin', 'نقاء المكونات'), t('Stoneground unbleached grains, grass-fed French butter, and wild mountain spices.', 'دقيق غير مبيض مطحون بالحجر، سمن حيواني نقي، وتوابل جبلية طبيعية.')],
    ['flame', t('Artisan Roasting', 'شغف التحميص'), t('Small-batch profile roasting tuned to express delicate fruit and floral notes.', 'تحميص دقيق على دفعات صغيرة لإبراز الهوية العطرية لكل محصول.')],
    ['heart-handshake', t('Soulful Hospitality', 'كرم الترحيب'), t('A warm sanctuary of natural travertine and shaded greenery designed to linger.', 'مساحة مريحة مصممة لتشعر وكأنك في بيتك مع كل زيارة.')],
  ];
  const about = section({
    id: 'about', bg: '#FAF7F2', py: PY, kids: [box({ cls: 'zayt-g12', dir: 'row', dirT: 'column', dirM: 'column', align: 'center', gap: [64, 48, 48] }, [
      box({ cls: 'zayt-span-6 zayt-about-imgs', w: 50, wT: 100, wM: 100, dir: 'row' }, [
        box({ cls: 'zayt-about-col' }, [
          aboutImg('img:cardamomPastry', 'Zayt artisan cardamom and saffron morning buns on handcrafted ceramic plate'),
          stat('48h', t('Cold Fermentation', 'تخمير بطيء للعجين')),
        ]),
        box({ cls: 'zayt-about-col zayt-about-col--b' }, [
          stat('100%', t('Direct-Trade Micro Lots', 'بن بمصدر مباشر ومسؤول')),
          aboutImg('img:zaatarFocaccia', 'Freshly baked focaccia with wild zaatar and cold-pressed extra virgin olive oil'),
        ]),
      ]),
      box({ cls: 'zayt-span-6', w: 50, wT: 100, wM: 100, align: 'flex-start' }, [
        heading(t('Our Story & Philosophy', 'قصتنا وفلسفتنا'), { tag: 'span', size: 12, weight: 600, lh: 1.333, ls: 0.05, transform: 'uppercase', color: '#9E471D', mb: 12 }),
        heading(t('Zayt: An Homage to Mediterranean Soil & Slow Gathering', 'زيت: تحية لتراث البحر المتوسط وكرم الضيافة'), {
          tag: 'h2', role: 'display', size: [36, 36, 30], weight: 600, lh: 1.18, ls: -0.025, color: '#1C1917', mb: 24, cls: 'zayt-display zayt-balance',
        }),
        box({ gap: 16, mar: [0, 0, 32, 0] }, [
          text(`<p>${esc(t(
            'The name Zayt (زيت) comes from the ancient olive tree and extra virgin olive oil — the lifeblood of Mediterranean and Levantine culture. It represents purity, nourishment, and the unspoken ritual of welcoming guests with genuine hospitality.',
            'استوحينا اسم "زيت" من الشجرة المباركة وزيت الزيتون البكر الذي يمثل شريان الحياة في بلاد الشام وحوض البحر الأبيض المتوسط — رمزاً للنقاء، والكرم، والغذاء الأصيل الذي يجمع الناس حول مائدة واحدة.',
          ))}</p>`, { size: [16, 16, 14], lh: 1.625, color: '#57534E' }),
          text(`<p>${esc(t(
            'We merge the exacting science of specialty coffee extraction with the unhurried patience of slow-fermented bakery. Here, every roast is deliberate, every loaf rests for 48 hours, and every pastry celebrates botanicals from Aleppo pepper to Damask rose.',
            'في مقهى زيت، نجمع بين الدقة العصرية للقهوة المختصة وأسرار المخبوزات الحرفية الكلاسيكية. نؤمن بأن فنجان القهوة ليس مجرد جرعة كافيين سريعة، بل هو لحظة حضور وهدوء وسط وتيرة المدينة المتسارعة.',
          ))}</p>`, { size: [16, 16, 14], lh: 1.625, color: '#57534E' }),
        ]),
        htmlw(`<div class="zayt-values">${values.map(([ic, ti, de]) => `<div>${icon(ic, { size: 20, stroke: 1.75 })}<h4>${esc(ti)}</h4><p>${esc(de)}</p></div>`).join('')}</div>`, { cls: 'zayt-full-w' }),
      ]),
    ])],
  });

  // ================================================================ gallery
  const gallery = section({
    id: 'gallery', bg: '#FFFFFF', py: PY, kids: [
      sectionHead(
        t('Visual Atmosphere', 'معرض الصور'),
        t('Moments of Craft & Ambiance', 'لقطات من تفاصيل وحياة المقهى'),
        t('An editorial window into daily life at Zayt — morning sunlight filtering through limestone, steaming cups, and golden viennoiserie.',
          'جولة بصرية بين أركان مقهانا: ضوء الصباح الطبيعي، رائحة البن المحمص، والمخبوزات الذهبية الطازجة.'),
      ),
      box({ cls: 'zayt-gallery zayt-gap-20-24', gap: 20 }, GALLERY_ITEMS.map((g, i) => box({
        cls: `zayt-gal zayt-media ${i === 0 ? 'zayt-gal-8 zayt-ar-1610' : 'zayt-gal-4 zayt-ar-11'}`, radius: 12, border: BORDER, shadow: SHADOW.xs, overflow: 'hidden', bg: '#F5F5F4',
      }, [
        image(img(g.image), { alt: g.alt[L] }),
        htmlw(`<div class="zayt-gal-cap ${i === 0 ? 'zayt-gal-cap--lg' : ''}"><span class="k">${esc(g.category[L])}</span><span class="t">${esc(g.title[L])}</span></div>`, { cls: 'zayt-gal-cap-wrap' }),
      ]))),
    ],
  });

  // ================================================================ testimonials
  const stars = (n) => `<div class="zayt-stars" role="img" aria-label="${n} out of 5 stars">${[0, 1, 2, 3, 4].map((i) =>
    i < n ? icon('star', { size: 16, fill: '#FBBF24', color: '#FBBF24' }) : icon('star', { size: 16, color: '#D6D3D1' })).join('')}</div>`;
  const testimonials = section({
    bg: '#FAF9F6', py: PY, kids: [
      sectionHead(
        t('Guest Reviews & Praise', 'آراء الضيوف والنقاد'),
        t('Words from Our Community', 'ماذا يقول رواد مقهى زيت عنا'),
        t('Reflections from food writers, specialty coffee Q-graders, and design professionals who make Zayt their daily retreat.',
          'انطباعات وتجارب كتاب التصميم، خبراء القهوة، وعشاق المخبوزات الحرفية الذين جعلوا من زيت وجهتهم المفضلة.'),
      ),
      box({ cls: 'zayt-cols zayt-cols--md3 zayt-gap-24-32', gap: 24 }, TESTIMONIALS.map((x) =>
        card({ pad: padCard(32, 24), justify: 'space-between' }, [
          box({}, [
            htmlw(stars(x.rating), { mb: 16 }),
            text(`<p>“${esc(x.content[L])}”</p>`, { role: 'display', size: [18, 18, 16], lh: 1.625, weight: 400, italic: true, color: '#292524', mb: 24, cls: 'zayt-display' }),
          ]),
          box({ pad: [16, 0, 0, 0], border: { w: dim(1, 0, 0, 0), color: '#F5F5F4' } }, [
            htmlw(`<div class="zayt-attr"><cite>${esc(x.name[L])}</cite><span>${esc(x.role[L])} · <em>${esc(x.source[L])}</em></span></div>`),
          ]),
        ]))),
    ],
  });

  // ================================================================ location
  const C = CONTACT_DATA;
  const hoursHtml =
    `<div class="zayt-hours-head">${icon('clock', { size: 20 })}<h3>${esc(t('Opening Hours', 'أوقات العمل والزيارة'))}</h3></div><ul>` +
    OPENING_HOURS.map((r) => `<li class="${r.isToday ? 'is-today' : ''}"><div class="d"><span>${esc(r.days[L])}</span>${r.isToday ? `<span class="zayt-today">${t('Today', 'اليوم')}</span>` : ''}</div><span class="h">${esc(r.hours[L])}</span></li>`).join('') +
    `</ul><p>${esc(t('Kitchen and bakery last orders are taken 60 minutes before closing.', 'المطبخ يقدم آخر طلبات الإفطار والمخبوزات قبل الإغلاق بساعة واحدة.'))}</p>`;
  const location = section({
    id: 'location', bg: '#FAF7F2', py: PY, kids: [
      sectionHead(
        t('Visit & Opening Times', 'الموقع وساعات الزيارة'),
        t('Find Us at Alserkal Arts District', 'زورونا في حي السركال للفنون'),
        t('Situated in the creative heart of Dubai, surrounded by contemporary galleries, shaded courtyards, and artisanal ateliers.',
          'موقعنا في قلب المنطقة الإبداعية في دبي، مع مواقف سيارات مظللة وجلسات داخلية وخارجية هادئة.'),
      ),
      box({ cls: 'zayt-g12', dir: 'row', dirT: 'column', dirM: 'column', gap: [40, 32, 32] }, [
        box({ cls: 'zayt-span-5', w: 41.67, wT: 100, wM: 100, gap: 24 }, [
          card({}, [
            htmlw(`<div class="zayt-addr-row">${icon('map-pin', { size: 20 })}<div><h3>${esc(C.brandName[L])}</h3><p>${esc(C.address[L])}</p><small>${esc(C.neighborhood[L])}</small></div></div>`, { mb: 16 }),
            htmlw(`<div class="zayt-mini"><div>${icon('phone', { size: 14 })}<a href="tel:${esc(C.phone)}">${esc(C.phoneDisplay)}</a></div><div>${icon('mail', { size: 14 })}<a href="mailto:${esc(C.email)}">${esc(C.email)}</a></div></div>`, { mb: 20 }),
            button(t('Get Directions on Google Maps', 'الاتجاهات عبر الخريطة'), { url: C.googleMapsDirectionsUrl, external: true, size: 'sm', icon: 'fas fa-location-arrow', iconEnd: true, full: true, weight: 500 }),
          ]),
          card({}, [htmlw(`<div class="zayt-hours">${hoursHtml}</div>`)]),
          box({ bg: 'rgba(245,245,244,0.7)', border: BORDER, radius: 12, pad: [16, 16, 16, 16] }, [
            htmlw(`<div class="zayt-parking">${icon('car', { size: 16 })}<div><strong>${esc(t('Valet & Parking', 'معلومات صف السيارات'))}</strong><span>${esc(C.parkingInfo[L])}</span></div></div>`),
          ]),
        ]),
        box({ cls: 'zayt-span-7 zayt-map-col', w: 58.33, wT: 100, wM: 100 }, [
          htmlw(
            `<div class="zayt-map"><iframe title="Zayt Cafe Location Map" src="${esc(C.googleMapsEmbedUrl)}" width="100%" height="100%" style="border:0" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>` +
            `<div class="zayt-map-badge"><b>${esc(C.brandName[L])}</b><span>Alserkal Avenue, Al Quoz 1</span></div></div>`,
          ),
        ]),
      ]),
    ],
  });

  // ================================================================ contact
  const F = {
    title: t('Send Us a Message', 'أرسل لنا رسالة'),
    sub: t('For general inquiries, private events, catering, or wholesale artisan bakery.', 'للاستفسارات العامة، الفعاليات الخاصة، أو طلبات الجملة لمخبوزاتنا وقهوتنا.'),
    name: t('Full Name', 'الاسم الكامل'), namePh: t('e.g. Layla Vance', 'مثال: أحمد المنصوري'),
    email: t('Email Address', 'البريد الإلكتروني'), phone: t('Phone Number', 'رقم الهاتف'),
    topic: t('Inquiry Topic', 'موضوع الاستفسار'),
    topics: [
      ['general', t('General Cafe Inquiry', 'استفسار عام عن المقهى')],
      ['reservation', t('Table or Gathering Reservation', 'حجز طاولة أو جلسة خاصة')],
      ['catering', t('Private Events & Catering', 'طلبات فعاليات وخدمات ضيافة')],
      ['wholesale', t('Wholesale Coffee Beans & Bakery', 'شراء محاصيل بن بالجملة')],
    ],
    message: t('Your Message', 'رسالتك'), messagePh: t('Tell us how we can assist you...', 'اكتب تفاصيل طلبك أو استفسارك هنا...'),
    submit: t('Send Message', 'إرسال الرسالة'), sending: t('Sending Message...', 'جارٍ الإرسال...'),
    okTitle: t('Message Sent Successfully', 'تم استلام رسالتك بنجاح'),
    okText: t('Thank you for reaching out to Zayt Café. Our team will get back to you shortly.', 'شكراً لتواصلك مع مقهى زيت. سيقوم فريقنا بالرد عليك عبر البريد أو الهاتف خلال ساعات العمل.'),
    again: t('Send Another Message', 'إرسال رسالة أخرى'),
    req: t('This field is required', 'هذا الحقل مطلوب'), badEmail: t('Please enter a valid email address', 'يرجى إدخال بريد إلكتروني صحيح'),
  };
  const errBox = (n) => `<p class="err" data-err="${n}">${icon('circle-alert', { size: 14 })}<span></span></p>`;
  const formHtml =
    `<div class="zayt-form"><form novalidate data-msg-required="${esc(F.req)}" data-msg-email="${esc(F.badEmail)}" data-msg-sending="${esc(F.sending)}">` +
    `<div><h3>${esc(F.title)}</h3><p class="sub">${esc(F.sub)}</p></div>` +
    `<div class="row first"><div><label for="contact-name">${esc(F.name)} <i>*</i></label><input id="contact-name" name="name" type="text" placeholder="${esc(F.namePh)}">${errBox('name')}</div>` +
    `<div><label for="contact-email">${esc(F.email)} <i>*</i></label><input id="contact-email" name="email" type="email" placeholder="name@example.com">${errBox('email')}</div></div>` +
    `<div class="row"><div><label for="contact-phone">${esc(F.phone)}</label><input id="contact-phone" name="phone" type="tel" placeholder="+971 50 123 4567"></div>` +
    `<div><label for="contact-topic">${esc(F.topic)}</label><select id="contact-topic" name="topic">${F.topics.map(([v, l]) => `<option value="${v}">${esc(l)}</option>`).join('')}</select></div></div>` +
    `<div><label for="contact-message">${esc(F.message)} <i>*</i></label><textarea id="contact-message" name="message" rows="4" placeholder="${esc(F.messagePh)}"></textarea>${errBox('message')}</div>` +
    `<div style="padding-top:8px"><button type="submit" class="zayt-hbtn zayt-hbtn--primary zayt-hbtn--md zayt-hbtn--full zayt-hbtn--sm-auto"><span>${esc(F.submit)}</span>${icon('send', { size: 16 })}</button></div></form>` +
    `<div class="zayt-success"><div class="ok">${icon('circle-check', { size: 32 })}</div><h3>${esc(F.okTitle)}</h3><p>${esc(F.okText)}</p>` +
    `<button type="button" class="zayt-hbtn zayt-hbtn--outline zayt-hbtn--sm" data-zayt-again>${esc(F.again)}</button></div></div>`;
  const chan = (ic, label, val) => `<div>${icon(ic, { size: 16 })}<div><small>${esc(label)}</small>${val}</div></div>`;
  const contact = section({
    id: 'contact', bg: '#FFFFFF', py: PY, kids: [
      sectionHead(
        t('Get in Touch', 'تواصل معنا'),
        t('Connect with the Zayt Team', 'نسعد دائماً باستقبال رسائلكم واستفساراتكم'),
        t('Whether inquiring about large group gatherings, specialty coffee wholesale, or event hosting, our team is at your disposal.',
          'سواء كنت ترغب بحجز طاولة لمجموعة، الاستفسار عن حبوب البن ومخبوزاتنا، أو التنسيق لفعالية خاصة، يسعدنا التحدث معك.'),
      ),
      box({ cls: 'zayt-g12', dir: 'row', dirT: 'column', dirM: 'column', gap: [48, 32, 32] }, [
        box({ cls: 'zayt-span-5', w: 41.67, wT: 100, wM: 100, justify: 'space-between', gap: 24 }, [
          card({ bg: '#FAF7F2', gap: 20 }, [
            heading(t('Direct Channels', 'بيانات التواصل المباشر'), { tag: 'h3', role: 'display', size: 20, weight: 600, lh: 1.4, color: '#1C1917', cls: 'zayt-display' }),
            htmlw(`<div class="zayt-chan">` +
              chan('phone', t('Telephone', 'الهاتف'), `<a href="tel:${esc(C.phone)}">${esc(C.phoneDisplay)}</a>`) +
              chan('mail', t('Email Inquiries', 'البريد الإلكتروني'), `<a href="mailto:${esc(C.email)}">${esc(C.email)}</a>`) +
              chan('map-pin', t('Address', 'العنوان'), `<span class="v">${esc(C.address[L])}</span>`) +
              chan('clock', t('Service Hours', 'ساعات الخدمة'), `<span class="v">07:30 AM – 11:30 PM (Daily)</span>`) + `</div>`),
          ]),
          box({ bg: 'rgba(236,253,245,0.7)', border: { color: 'rgba(167,243,208,0.8)' }, radius: 12, shadow: SHADOW.xs, pad: padCard(28, 24) }, [
            htmlw(`<div class="zayt-wa-title">${icon('message-circle', { size: 20 })}<h4>${esc(t('Prefer an instant reply via WhatsApp?', 'تفضل الرد الفوري عبر واتساب؟'))}</h4></div>`, { mb: 8 }),
            text(`<p>${esc(t('Our hospitality and barista team is online throughout operating hours for quick orders and questions.', 'فريق الباريستا والضيافة متواجد يومياً خلال ساعات العمل للرد على طلباتكم واستفساراتكم.'))}</p>`, { size: [14, 14, 12], lh: 1.625, color: '#57534E', mb: 16 }),
            button(t('Chat Directly Now', 'محادثة مباشرة الآن'), { url: waGeneral, external: true, variant: 'whatsapp', size: 'md', icon: 'fab fa-whatsapp', full: true }),
          ]),
        ]),
        box({ cls: 'zayt-span-7', w: 58.33, wT: 100, wM: 100 }, [
          card({ pad: padCard(32, 24) }, [htmlw(formHtml)]),
        ]),
      ]),
    ],
  });

  // ================================================================ CTA banner
  const cta = section({
    bg: '#1C1917', py: [80, 80, 64], border: false, boxed: 960, align: 'center', cls: 'zayt-cta', kids: [
      htmlw(`<div class="zayt-cta-pill">${icon('coffee', { size: 14 })}<span>${esc(t('Begin Your Morning Ritual with Zayt', 'ابدأ طقس يومك مع زيت'))}</span></div>`, { mb: 16 }),
      heading(t('Exceptional Brews & Warm Viennoiserie Await You', 'قهوة استثنائية ومخبوزات دافئة بانتظارك اليوم'), {
        tag: 'h2', role: 'display', size: [48, 36, 30], weight: 600, lh: [1, 1.111, 1.2], ls: -0.025, color: '#FFFFFF', align: 'center', mb: 20, cls: 'zayt-display zayt-balance',
      }),
      text(`<p>${esc(t('Pre-order for express counter collection or message us to arrange reserved seating under our shaded olive trees.', 'اطلب مسبقاً للاستلام السريع أو تواصل معنا لحجز جلستك في التراس المظلل بأشجار الزيتون.'))}</p>`, {
        size: [18, 18, 16], lh: 1.625, color: '#D6D3D1', align: 'center', mb: 32, cls: 'zayt-mw-672 zayt-balance',
      }),
      box({ dir: 'row', wrap: true, align: 'center', justify: 'center', gap: 16 }, [
        button(t('Pre-Order on WhatsApp', 'تواصل واطلب عبر واتساب'), { url: waGeneral, external: true, variant: 'whatsapp', size: 'lg', icon: 'fab fa-whatsapp', cls: 'zayt-full-xs zayt-ic20' }),
        button(t('Browse All Items', 'تصفح الأصناف'), { url: '#menu', variant: 'outlineDark', size: 'lg', cls: 'zayt-full-xs' }),
      ]),
    ],
  });

  // ================================================================ footer
  const fHead = (s, mb) => heading(s, { tag: 'h4', role: 'display', size: 16, weight: 600, lh: 1.5, color: '#FFFFFF', mb, cls: 'zayt-display' });
  const footer = box({
    top: true, boxed: 1216, tag: 'footer', cls: `zayt${rtl}`, bg: '#1C1816', border: { w: dim(1, 0, 0, 0), color: '#292524' },
    pad: [[64, 32, 48, 32], [64, 24, 48, 24], [64, 16, 48, 16]],
  }, [
    box({ cls: 'zayt-foot-grid', gap: [48, 40, 40], pad: [0, 0, 48, 0], border: { w: dim(0, 0, 1, 0), color: 'rgba(41,37,36,0.8)' } }, [
      box({ cls: 'zayt-span-4', align: 'flex-start' }, [
        htmlw(`<div class="zayt-fbrand"><b>${esc(ar ? BRAND_CONFIG.nameAr : BRAND_CONFIG.nameEn)}</b><i></i></div>`, { mb: 12 }),
        heading(ar ? BRAND_CONFIG.taglineAr : BRAND_CONFIG.taglineEn, { tag: 'p', size: 12, weight: 600, lh: 1.333, ls: 0.05, transform: 'uppercase', color: '#9E471D', mb: 16 }),
        text(`<p>${esc(t('Artisanal specialty coffeehouse and bakery uniting Levantine botanicals with slow sourdough craft.', 'مقهى ومخبز حرفي يمزج فنون القهوة المختصة بأصالة المخبوزات ونكهات بلاد الشام وحوض المتوسط.'))}</p>`, { size: [14, 14, 12], lh: 1.625, color: '#A8A29E', mb: 24, cls: 'zayt-mw-384' }),
        htmlw(`<div class="zayt-socials"><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Follow Zayt on Instagram">${icon('instagram', { size: 16 })}</a>` +
          `<a href="${esc(C.googleMapsDirectionsUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Location on Google Maps">${icon('map-pin', { size: 16 })}</a>` +
          `<a href="mailto:${esc(BRAND_CONFIG.email)}" aria-label="Email Zayt Cafe">${icon('mail', { size: 16 })}</a></div>`),
      ]),
      box({ cls: 'zayt-span-2' }, [
        fHead(t('Quick Navigation', 'روابط سريعة'), 16),
        htmlw(`<ul class="zayt-flinks">${NAV_LINKS.map((l) => `<li><a href="${l.href}">${esc(l.label[L])}</a></li>`).join('')}</ul>`),
      ]),
      box({ cls: 'zayt-span-3' }, [
        fHead(t('Opening Times', 'ساعات العمل'), 16),
        htmlw(`<ul class="zayt-fhours">${OPENING_HOURS.map((h) => `<li><span class="d">${esc(h.days[L])}</span><span class="h">${esc(h.hours[L])}</span></li>`).join('')}</ul>`),
      ]),
      box({ cls: 'zayt-span-3' }, [
        fHead(t('The Zayt Journal', 'نشرة زيت البريدية'), 12),
        text(`<p>${esc(t('Receive notes on rare micro-lot releases, seasonal viennoiserie, and community gatherings.', 'اشترك ليصلك جدول محاصيل البن الحصرية والوصفات الموسمية لمخبزنا.'))}</p>`, { size: 12, lh: 1.625, color: '#A8A29E', mb: 16 }),
        htmlw(
          `<div class="zayt-news-wrap"><form class="zayt-news"><input type="email" name="email" required placeholder="${esc(t('Enter your email address', 'أدخل بريدك الإلكتروني'))}">` +
          `<button type="submit"><span>${esc(t('Subscribe', 'اشتراك'))}</span>${icon(ar ? 'arrow-left' : 'arrow-right', { size: 14 })}</button></form>` +
          `<div class="zayt-news-ok">${icon('check', { size: 16 })}<span>${esc(t('Thank you for subscribing!', 'شكراً لاشتراكك في نشرتنا!'))}</span></div></div>`,
        ),
      ]),
    ]),
    box({ pad: [32, 0, 0, 0], dir: 'row', dirM: 'column', justify: 'space-between', align: 'center', gap: 16 }, [
      text(`<p>${esc(t('© 2026 Zayt Café. All rights reserved.', 'جميع الحقوق محفوظة لمقهى زيت © 2026'))}</p>`, { size: 12, lh: 1.333, color: '#78716C', align: [null, null, 'center'] }),
    ]),
  ]);

  // ================================================================ floating WhatsApp
  const floating = box({ top: true, cls: `zayt zayt-float${rtl}`, dir: 'row', align: 'center', gap: 12 }, [
    htmlw(
      `<span class="zayt-float-pill">${esc(t('Chat with Zayt', 'تواصل معنا مباشرة'))}</span>` +
      `<a class="zayt-float-btn" href="${esc(waGeneral)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(t('Order or Reserve via WhatsApp', 'اطلب أو احجز عبر واتساب'))}" title="${esc(t('Order or Reserve via WhatsApp', 'اطلب أو احجز عبر واتساب'))}">${icon('message-circle', { size: 28, stroke: 2.2, fill: 'rgba(255,255,255,0.2)', color: '#FFFFFF' })}</a>`,
    ),
  ]);

  return {
    title: `Zayt Café — Home (${L.toUpperCase()})`,
    type: 'page',
    version: '0.4',
    page_settings: { template: 'elementor_canvas', hide_title: 'yes' },
    content: [assets, header, hero, features, featured, menu, about, gallery, testimonials, location, contact, cta, footer, floating],
  };
}

// ---------------------------------------------------------------- write outputs
mkdirSync(OUT, { recursive: true });
for (const L of ['en', 'ar']) {
  const tpl = build(L);
  writeFileSync(join(OUT, `zayt-home-${L}.json`), JSON.stringify(tpl, null, 2) + '\n');
  console.log(`wrote zayt-home-${L}.json`);
}

// image manifest: what to upload to the Media Library and which key to map it to (--media-map)
function jpegSize(buf) {
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) break;
    const m = buf[i + 1];
    if (m === 0xc0 || m === 0xc2) return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return {};
}
const manifest = Object.entries(IMAGE_FILES).map(([key, file]) => {
  const path = join(ROOT, 'src/assets/images', file);
  return { key, sourceFile: `src/assets/images/${file}`, ...jpegSize(readFileSync(path)), bytes: statSync(path).size, importUrl: IMAGE_BASE + file };
});
writeFileSync(join(OUT, 'media-manifest.json'), JSON.stringify({
  note: 'Upload these files to the WordPress Media Library, then rebuild with --media-map to bind them: {"heroInterior":{"url":"https://…/file.jpg","id":123}, …}',
  images: manifest,
}, null, 2) + '\n');
console.log('wrote media-manifest.json');
