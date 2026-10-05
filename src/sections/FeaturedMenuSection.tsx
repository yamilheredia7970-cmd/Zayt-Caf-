import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Language } from '../types';
import { PRODUCTS } from '../data/content';
import { SectionHeading } from '../components/SectionHeading';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/Button';

interface FeaturedMenuSectionProps {
  lang: Language;
}

export const FeaturedMenuSection: React.FC<FeaturedMenuSectionProps> = ({ lang }) => {
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const featuredItems = PRODUCTS.filter((p) => p.isFeatured).slice(0, 4);

  const content = {
    kicker: lang === 'ar' ? 'أصناف مميزة' : 'Signatures & Favorites',
    title:
      lang === 'ar'
        ? 'مختارات الموسم الأكثر طلباً'
        : 'Most Celebrated Creations',
    subtitle:
      lang === 'ar'
        ? 'أطباق ومشروبات ابتكرناها لتكون بصمة مقهى زيت، تُحضر يومياً بشغف وأجود المكونات الطبيعية.'
        : 'Our guest favorites that define the spirit of Zayt — from stone-ground pistachio latte to wild mountain zaatar sourdough.',
    viewAllCta: lang === 'ar' ? 'عرض القائمة الكاملة' : 'View Complete Menu',
  };

  return (
    <section className="py-16 sm:py-24 bg-stone-50/50 border-b border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker={content.kicker}
          title={content.title}
          subtitle={content.subtitle}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 mb-12">
          {featuredItems.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              lang={lang}
            />
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            href="#menu"
            variant="outline"
            size="md"
            icon={<ArrowIcon className="w-4 h-4" />}
          >
            {content.viewAllCta}
          </Button>
        </div>
      </div>
    </section>
  );
};
