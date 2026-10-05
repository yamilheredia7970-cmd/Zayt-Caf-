import React from 'react';
import { Language } from '../types';
import { GALLERY_ITEMS } from '../data/content';
import { SectionHeading } from '../components/SectionHeading';

interface GallerySectionProps {
  lang: Language;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ lang }) => {
  const content = {
    kicker: lang === 'ar' ? 'معرض الصور' : 'Visual Atmosphere',
    title:
      lang === 'ar'
        ? 'لقطات من تفاصيل وحياة المقهى'
        : 'Moments of Craft & Ambiance',
    subtitle:
      lang === 'ar'
        ? 'جولة بصرية بين أركان مقهانا: ضوء الصباح الطبيعي، رائحة البن المحمص، والمخبوزات الذهبية الطازجة.'
        : 'An editorial window into daily life at Zayt — morning sunlight filtering through limestone, steaming cups, and golden viennoiserie.',
  };

  return (
    <section id="gallery" className="py-16 sm:py-24 bg-white border-b border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker={content.kicker}
          title={content.title}
          subtitle={content.subtitle}
        />

        {/* Editorial Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
          {/* Item 1 - Wide Hero Interior */}
          <div className="md:col-span-8 group relative rounded-xl overflow-hidden bg-stone-100 aspect-[16/10] border border-stone-200/80 shadow-xs">
            <img
              src={GALLERY_ITEMS[0].image}
              alt={GALLERY_ITEMS[0].alt[lang]}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
            <div className="absolute bottom-4 inset-inline-start-4 inset-inline-end-4 text-white">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300 block mb-0.5">
                {GALLERY_ITEMS[0].category[lang]}
              </span>
              <p className="font-display text-lg sm:text-xl font-semibold">
                {GALLERY_ITEMS[0].title[lang]}
              </p>
            </div>
          </div>

          {/* Item 2 - Square Pistachio Specialty */}
          <div className="md:col-span-4 group relative rounded-xl overflow-hidden bg-stone-100 aspect-square border border-stone-200/80 shadow-xs">
            <img
              src={GALLERY_ITEMS[1].image}
              alt={GALLERY_ITEMS[1].alt[lang]}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
            <div className="absolute bottom-4 inset-inline-start-4 inset-inline-end-4 text-white">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300 block mb-0.5">
                {GALLERY_ITEMS[1].category[lang]}
              </span>
              <p className="font-display text-base sm:text-lg font-semibold">
                {GALLERY_ITEMS[1].title[lang]}
              </p>
            </div>
          </div>

          {/* Item 3 - Square Bakery */}
          <div className="md:col-span-4 group relative rounded-xl overflow-hidden bg-stone-100 aspect-square border border-stone-200/80 shadow-xs">
            <img
              src={GALLERY_ITEMS[2].image}
              alt={GALLERY_ITEMS[2].alt[lang]}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
            <div className="absolute bottom-4 inset-inline-start-4 inset-inline-end-4 text-white">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300 block mb-0.5">
                {GALLERY_ITEMS[2].category[lang]}
              </span>
              <p className="font-display text-base sm:text-lg font-semibold">
                {GALLERY_ITEMS[2].title[lang]}
              </p>
            </div>
          </div>

          {/* Item 4 - Square Focaccia */}
          <div className="md:col-span-4 group relative rounded-xl overflow-hidden bg-stone-100 aspect-square border border-stone-200/80 shadow-xs">
            <img
              src={GALLERY_ITEMS[3].image}
              alt={GALLERY_ITEMS[3].alt[lang]}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
            <div className="absolute bottom-4 inset-inline-start-4 inset-inline-end-4 text-white">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300 block mb-0.5">
                {GALLERY_ITEMS[3].category[lang]}
              </span>
              <p className="font-display text-base sm:text-lg font-semibold">
                {GALLERY_ITEMS[3].title[lang]}
              </p>
            </div>
          </div>

          {/* Item 5 - Wide Outdoor Terrace */}
          <div className="md:col-span-4 group relative rounded-xl overflow-hidden bg-stone-100 aspect-square border border-stone-200/80 shadow-xs">
            <img
              src={GALLERY_ITEMS[4].image}
              alt={GALLERY_ITEMS[4].alt[lang]}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
            <div className="absolute bottom-4 inset-inline-start-4 inset-inline-end-4 text-white">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300 block mb-0.5">
                {GALLERY_ITEMS[4].category[lang]}
              </span>
              <p className="font-display text-base sm:text-lg font-semibold">
                {GALLERY_ITEMS[4].title[lang]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
