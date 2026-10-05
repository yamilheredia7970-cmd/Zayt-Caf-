import React from 'react';
import { Language } from '../types';
import { FEATURES } from '../data/content';
import { SectionHeading } from '../components/SectionHeading';
import { FeatureCard } from '../components/FeatureCard';

interface FeaturesSectionProps {
  lang: Language;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ lang }) => {
  const content = {
    kicker: lang === 'ar' ? 'فلسفتنا في الجودة' : 'Our Craft & Values',
    title:
      lang === 'ar'
        ? 'أربعة أركان تصنع تجربة مقهى زيت'
        : 'The Four Pillars of Zayt',
    subtitle:
      lang === 'ar'
        ? 'من مزارع البن المرتفعة إلى أفران التخمير البطيء، نلتزم بأعلى معايير الإتقان مع لمسة من الدفء والضيافة المتوسطية.'
        : 'From high-altitude micro-lots to slow-ferment hearth ovens, we honor the ritual of slow gathering and uncompromised ingredients.',
  };

  return (
    <section className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker={content.kicker}
          title={content.title}
          subtitle={content.subtitle}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feat, idx) => (
            <FeatureCard
              key={feat.id}
              feature={feat}
              index={idx}
              lang={lang}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
