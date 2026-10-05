import React from 'react';
import { MessageCircle, Coffee } from 'lucide-react';
import { Language } from '../types';
import { buildWhatsAppUrl } from '../data/content';
import { Button } from '../components/Button';

interface CtaBannerSectionProps {
  lang: Language;
}

export const CtaBannerSection: React.FC<CtaBannerSectionProps> = ({ lang }) => {
  const whatsappUrl = buildWhatsAppUrl(undefined, lang);

  const content = {
    kicker:
      lang === 'ar' ? 'ابدأ طقس يومك مع زيت' : 'Begin Your Morning Ritual with Zayt',
    title:
      lang === 'ar'
        ? 'قهوة استثنائية ومخبوزات دافئة بانتظارك اليوم'
        : 'Exceptional Brews & Warm Viennoiserie Await You',
    description:
      lang === 'ar'
        ? 'اطلب مسبقاً للاستلام السريع أو تواصل معنا لحجز جلستك في التراس المظلل بأشجار الزيتون.'
        : 'Pre-order for express counter collection or message us to arrange reserved seating under our shaded olive trees.',
    ctaWhatsApp:
      lang === 'ar' ? 'تواصل واطلب عبر واتساب' : 'Pre-Order on WhatsApp',
    ctaMenu:
      lang === 'ar' ? 'تصفح الأصناف' : 'Browse All Items',
  };

  return (
    <section className="py-16 sm:py-20 bg-stone-900 text-stone-100 relative overflow-hidden">
      {/* Subtle background glow/radial accent without slop */}
      <div className="absolute top-0 inset-inline-end-0 -mt-16 -mr-16 w-96 h-96 rounded-full bg-[#9E471D]/15 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-800 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-stone-700">
          <Coffee className="w-3.5 h-3.5" />
          <span>{content.kicker}</span>
        </div>

        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white mb-5 text-balance">
          {content.title}
        </h2>

        <p className="text-stone-300 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed text-balance">
          {content.description}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
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

          <Button
            href="#menu"
            variant="outline"
            size="lg"
            className="w-full sm:w-auto text-stone-200 border-stone-700 hover:border-stone-500 hover:bg-stone-800"
          >
            {content.ctaMenu}
          </Button>
        </div>
      </div>
    </section>
  );
};
