import React from 'react';
import { Clock } from 'lucide-react';
import { Language, OpeningHourRow } from '../types';

interface OpeningHoursProps {
  hours: OpeningHourRow[];
  lang: Language;
  className?: string;
}

export const OpeningHours: React.FC<OpeningHoursProps> = ({ hours, lang, className = '' }) => {
  return (
    <div className={`p-6 sm:p-7 rounded-xl bg-white border border-stone-200/80 shadow-xs ${className}`}>
      <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-stone-100">
        <Clock className="w-5 h-5 text-[#9E471D] shrink-0" aria-hidden="true" />
        <h3 className="font-display text-lg font-semibold text-stone-900">
          {lang === 'ar' ? 'أوقات العمل والزيارة' : 'Opening Hours'}
        </h3>
      </div>

      <ul className="space-y-3.5" role="list">
        {hours.map((row, index) => (
          <li
            key={index}
            className={`flex items-center justify-between text-sm py-1.5 px-2.5 rounded-md transition-colors ${
              row.isToday ? 'bg-[#FAF7F2] font-medium' : 'text-stone-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-stone-800">{row.days[lang]}</span>
              {row.isToday && (
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 tracking-wider">
                  {lang === 'ar' ? 'اليوم' : 'Today'}
                </span>
              )}
            </div>
            <span className="font-mono text-stone-900 tabular-nums">
              {row.hours[lang]}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-4 pt-3 border-t border-stone-100 text-xs text-stone-500 leading-relaxed">
        {lang === 'ar'
          ? 'المطبخ يقدم آخر طلبات الإفطار والمخبوزات قبل الإغلاق بساعة واحدة.'
          : 'Kitchen and bakery last orders are taken 60 minutes before closing.'}
      </p>
    </div>
  );
};
