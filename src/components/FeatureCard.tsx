import React from 'react';
import { Coffee, Croissant, Sparkles, HeartHandshake } from 'lucide-react';
import { FeatureItem, Language } from '../types';

interface FeatureCardProps {
  feature: FeatureItem;
  index: number;
  lang: Language;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ feature, index, lang }) => {
  const iconMap = {
    coffee: Coffee,
    croissant: Croissant,
    sparkles: Sparkles,
    'heart-handshake': HeartHandshake,
  };

  const IconComponent = iconMap[feature.iconName] || Coffee;
  const numLabel = `0${index + 1}.`;

  return (
    <div className="flex flex-col p-6 sm:p-8 rounded-xl bg-white border border-stone-200/80 shadow-xs hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-5">
        <div className="w-12 h-12 rounded-lg bg-[#FAF7F2] border border-stone-200/80 flex items-center justify-center text-[#9E471D]">
          <IconComponent className="w-6 h-6 stroke-[1.5]" aria-hidden="true" />
        </div>
        <span className="font-mono text-xs font-semibold text-stone-400 tracking-wider">
          {numLabel}
        </span>
      </div>

      <h3 className="font-display text-xl font-semibold text-stone-900 mb-2.5 leading-snug">
        {feature.title[lang]}
      </h3>

      <p className="text-stone-600 text-sm leading-relaxed">
        {feature.description[lang]}
      </p>
    </div>
  );
};
