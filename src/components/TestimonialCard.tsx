import React from 'react';
import { Star } from 'lucide-react';
import { Language, Testimonial } from '../types';

interface TestimonialCardProps {
  testimonial: Testimonial;
  lang: Language;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, lang }) => {
  return (
    <article className="flex flex-col justify-between p-6 sm:p-8 rounded-xl bg-white border border-stone-200/80 shadow-xs">
      <div>
        {/* Star Rating */}
        <div className="flex items-center gap-1 mb-4" aria-label={`${testimonial.rating} out of 5 stars`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < testimonial.rating
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-stone-300'
              }`}
              aria-hidden="true"
            />
          ))}
        </div>

        {/* Quote Content */}
        <p className="font-display italic text-stone-800 text-base sm:text-lg leading-relaxed mb-6">
          “{testimonial.content[lang]}”
        </p>
      </div>

      {/* Attribution */}
      <footer className="pt-4 border-t border-stone-100 flex flex-col">
        <cite className="not-italic font-semibold text-stone-900 text-sm">
          {testimonial.name[lang]}
        </cite>
        <span className="text-xs text-stone-500 mt-0.5">
          {testimonial.role[lang]} ·{' '}
          <span className="text-[#9E471D] font-medium">{testimonial.source[lang]}</span>
        </span>
      </footer>
    </article>
  );
};
