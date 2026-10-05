import React from 'react';
import { Language } from '../types';
import { TESTIMONIALS } from '../data/content';
import { SectionHeading } from '../components/SectionHeading';
import { TestimonialCard } from '../components/TestimonialCard';

interface TestimonialsSectionProps {
  lang: Language;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ lang }) => {
  const content = {
    kicker: lang === 'ar' ? 'آراء الضيوف والنقاد' : 'Guest Reviews & Praise',
    title:
      lang === 'ar'
        ? 'ماذا يقول رواد مقهى زيت عنا'
        : 'Words from Our Community',
    subtitle:
      lang === 'ar'
        ? 'انطباعات وتجارب كتاب التصميم، خبراء القهوة، وعشاق المخبوزات الحرفية الذين جعلوا من زيت وجهتهم المفضلة.'
        : 'Reflections from food writers, specialty coffee Q-graders, and design professionals who make Zayt their daily retreat.',
  };

  return (
    <section className="py-16 sm:py-24 bg-stone-50/60 border-b border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker={content.kicker}
          title={content.title}
          subtitle={content.subtitle}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {TESTIMONIALS.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              lang={lang}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
