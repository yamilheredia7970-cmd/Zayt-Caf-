import React from 'react';
import { Sparkles, HeartHandshake, Leaf, Flame } from 'lucide-react';
import { Language } from '../types';
import { ASSET_IMAGES } from '../data/images';
import { SectionHeading } from '../components/SectionHeading';

interface AboutSectionProps {
  lang: Language;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ lang }) => {
  const content = {
    kicker: lang === 'ar' ? 'قصتنا وفلسفتنا' : 'Our Story & Philosophy',
    title:
      lang === 'ar'
        ? 'زيت: تحية لتراث البحر المتوسط وكرم الضيافة'
        : 'Zayt: An Homage to Mediterranean Soil & Slow Gathering',
    p1:
      lang === 'ar'
        ? 'استوحينا اسم "زيت" من الشجرة المباركة وزيت الزيتون البكر الذي يمثل شريان الحياة في بلاد الشام وحوض البحر الأبيض المتوسط — رمزاً للنقاء، والكرم، والغذاء الأصيل الذي يجمع الناس حول مائدة واحدة.'
        : 'The name Zayt (زيت) comes from the ancient olive tree and extra virgin olive oil — the lifeblood of Mediterranean and Levantine culture. It represents purity, nourishment, and the unspoken ritual of welcoming guests with genuine hospitality.',
    p2:
      lang === 'ar'
        ? 'في مقهى زيت، نجمع بين الدقة العصرية للقهوة المختصة وأسرار المخبوزات الحرفية الكلاسيكية. نؤمن بأن فنجان القهوة ليس مجرد جرعة كافيين سريعة، بل هو لحظة حضور وهدوء وسط وتيرة المدينة المتسارعة.'
        : 'We merge the exacting science of specialty coffee extraction with the unhurried patience of slow-fermented bakery. Here, every roast is deliberate, every loaf rests for 48 hours, and every pastry celebrates botanicals from Aleppo pepper to Damask rose.',
    stat1Number: '48h',
    stat1Label: lang === 'ar' ? 'تخمير بطيء للعجين' : 'Cold Fermentation',
    stat2Number: '100%',
    stat2Label: lang === 'ar' ? 'بن بمصدر مباشر ومسؤول' : 'Direct-Trade Micro Lots',
    stat3Number: '07:30',
    stat3Label: lang === 'ar' ? 'خبز طازج فجر كل يوم' : 'Dawn Hearth Baking',
  };

  const values = [
    {
      icon: Leaf,
      title: lang === 'ar' ? 'نقاء المكونات' : 'Purity of Origin',
      desc:
        lang === 'ar'
          ? 'دقيق غير مبيض مطحون بالحجر، سمن حيواني نقي، وتوابل جبلية طبيعية.'
          : 'Stoneground unbleached grains, grass-fed French butter, and wild mountain spices.',
    },
    {
      icon: Flame,
      title: lang === 'ar' ? 'شغف التحميص' : 'Artisan Roasting',
      desc:
        lang === 'ar'
          ? 'تحميص دقيق على دفعات صغيرة لإبراز الهوية العطرية لكل محصول.'
          : 'Small-batch profile roasting tuned to express delicate fruit and floral notes.',
    },
    {
      icon: HeartHandshake,
      title: lang === 'ar' ? 'كرم الترحيب' : 'Soulful Hospitality',
      desc:
        lang === 'ar'
          ? 'مساحة مريحة مصممة لتشعر وكأنك في بيتك مع كل زيارة.'
          : 'A warm sanctuary of natural travertine and shaded greenery designed to linger.',
    },
  ];

  return (
    <section id="about" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Images Grid Showcase (Left / Start Column) */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden shadow-xs border border-stone-200/80 aspect-[4/5] bg-stone-100">
                <img
                  src={ASSET_IMAGES.cardamomPastry}
                  alt="Zayt artisan cardamom and saffron morning buns on handcrafted ceramic plate"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="p-5 rounded-xl bg-white border border-stone-200/80 shadow-xs">
                <span className="font-mono text-2xl font-bold text-[#9E471D] tabular-nums block">
                  {content.stat1Number}
                </span>
                <span className="text-xs text-stone-600 font-medium">
                  {content.stat1Label}
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-6 sm:pt-10">
              <div className="p-5 rounded-xl bg-white border border-stone-200/80 shadow-xs">
                <span className="font-mono text-2xl font-bold text-[#9E471D] tabular-nums block">
                  {content.stat2Number}
                </span>
                <span className="text-xs text-stone-600 font-medium">
                  {content.stat2Label}
                </span>
              </div>
              <div className="rounded-xl overflow-hidden shadow-xs border border-stone-200/80 aspect-[4/5] bg-stone-100">
                <img
                  src={ASSET_IMAGES.zaatarFocaccia}
                  alt="Freshly baked focaccia with wild zaatar and cold-pressed extra virgin olive oil"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>

          {/* Narrative Content (Right / End Column) */}
          <div className="lg:col-span-6 flex flex-col items-start text-start">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#9E471D] mb-3">
              {content.kicker}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900 leading-[1.18] mb-6 text-balance">
              {content.title}
            </h2>

            <div className="space-y-4 text-stone-600 text-sm sm:text-base leading-relaxed mb-8">
              <p>{content.p1}</p>
              <p>{content.p2}</p>
            </div>

            {/* 3 Core Values */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full pt-6 border-t border-stone-200/80">
              {values.map((v, i) => {
                const Icon = v.icon;
                return (
                  <div key={i} className="flex flex-col">
                    <Icon className="w-5 h-5 text-[#9E471D] mb-2 stroke-[1.75]" />
                    <h4 className="font-display text-base font-semibold text-stone-900 mb-1">
                      {v.title}
                    </h4>
                    <p className="text-xs text-stone-600 leading-normal">
                      {v.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
