import React from 'react';
import { ArrowRight, ArrowLeft, MessageCircle, MapPin } from 'lucide-react';
import { Language } from '../types';
import { ASSET_IMAGES } from '../data/images';
import { BRAND_CONFIG, buildWhatsAppUrl } from '../data/content';
import { Button } from '../components/Button';

interface HeroSectionProps {
  lang: Language;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ lang }) => {
  const isRtl = lang === 'ar';
  const whatsappUrl = buildWhatsAppUrl(undefined, lang);

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const content = {
    kicker:
      lang === 'ar'
        ? 'مقهى ومخبز حرفي مختص — دبي'
        : 'Artisan Specialty Coffee & Bakery — Dubai',
    titleLine1:
      lang === 'ar'
        ? 'حيث تلتقي القهوة المختصة'
        : 'Where Specialty Coffee Meets',
    titleHighlight:
      lang === 'ar'
        ? 'بدفء البحر الأبيض المتوسط'
        : 'Mediterranean Warmth',
    description:
      lang === 'ar'
        ? 'محاصيل بن نادرة من مزارع حراز اليمنية وإثيوبيا، مخبوزات طازجة بالتخمير البطيء لمدة ٤٨ ساعة، ومعجنات عطرية بنكهات الهيل وزهر البرتقال وزيت الزيتون البكر.'
        : 'Single-origin rare roasts from Yemen and Ethiopia, slow-fermented 48-hour artisan sourdough, and regional botanicals woven into every cup and golden morning pastry.',
    ctaMenu: lang === 'ar' ? 'استكشف القائمة' : 'Explore Menu',
    ctaWhatsApp: lang === 'ar' ? 'اطلب عبر واتساب' : 'Order on WhatsApp',
    badge1: lang === 'ar' ? 'بن بمحاصيل نادرة' : 'Ethical Single Origins',
    badge2: lang === 'ar' ? 'مخبوزات طازجة يومياً' : '48h Slow-Fermented',
    badge3: lang === 'ar' ? 'حي السركال للفنون' : 'Alserkal Arts District',
    caption:
      lang === 'ar'
        ? 'مساحة هادئة مستوحاة من حجر الترافرتين وأشجار الزيتون'
        : 'Natural travertine arches, acoustic calm & shaded olive trees',
  };

  return (
    <section
      id="home"
      className="relative pt-8 pb-16 sm:pt-14 sm:pb-24 lg:pt-18 lg:pb-32 overflow-hidden border-b border-stone-200/70"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Content Column (Elementor Container 1) */}
          <div className="lg:col-span-7 flex flex-col items-start text-start">
            {/* Kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] border border-stone-200/90 text-stone-700 text-xs font-semibold uppercase tracking-wider mb-5">
              <span className="w-2 h-2 rounded-full bg-[#9E471D]" aria-hidden="true" />
              <span>{content.kicker}</span>
            </div>

            {/* H1 Heading */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-stone-900 leading-[1.12] text-balance mb-6">
              {content.titleLine1}{' '}
              <span className="text-[#9E471D] italic block sm:inline font-normal">
                {content.titleHighlight}
              </span>
            </h1>

            {/* Description */}
            <p className="text-stone-600 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mb-8">
              {content.description}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto mb-10">
              <Button
                href="#menu"
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
                icon={<ArrowIcon className="w-4 h-4" />}
              >
                {content.ctaMenu}
              </Button>

              <Button
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="whatsapp"
                size="lg"
                className="w-full sm:w-auto"
                icon={<MessageCircle className="w-5 h-5" />}
              >
                {content.ctaWhatsApp}
              </Button>
            </div>

            {/* Quiet Trust Markers (Zero-Pill discipline) */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-stone-500 pt-6 border-t border-stone-200/80 w-full">
              <div className="flex items-center gap-1.5 font-medium text-stone-700">
                <span className="text-[#9E471D] font-bold">✓</span>
                <span>{content.badge1}</span>
              </div>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <div className="flex items-center gap-1.5 font-medium text-stone-700">
                <span className="text-[#9E471D] font-bold">✓</span>
                <span>{content.badge2}</span>
              </div>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <div className="flex items-center gap-1.5 text-stone-600">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>{content.badge3}</span>
              </div>
            </div>
          </div>

          {/* Media Column (Elementor Container 2) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-stone-200/80 bg-stone-100 aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/5]">
              <img
                src={ASSET_IMAGES.heroInterior}
                alt="Zayt Café warm minimalist interior with travertine espresso counter and arched limestone architecture"
                className="w-full h-full object-cover object-center"
                loading="eager"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent" />

              {/* Media Floating Caption */}
              <div className="absolute bottom-4 inset-inline-start-4 inset-inline-end-4 p-4 rounded-xl bg-white/90 backdrop-blur-md border border-white/60 shadow-xs">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="block text-[11px] font-semibold text-[#9E471D] uppercase tracking-wider">
                      {BRAND_CONFIG.nameEn} · Al Quoz
                    </span>
                    <p className="text-xs sm:text-sm font-medium text-stone-900 mt-0.5">
                      {content.caption}
                    </p>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" title="Open Today" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
