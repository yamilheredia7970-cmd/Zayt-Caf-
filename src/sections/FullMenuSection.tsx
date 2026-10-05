import React, { useState } from 'react';
import { Language, ProductCategory } from '../types';
import { MENU_CATEGORIES, PRODUCTS, buildWhatsAppUrl } from '../data/content';
import { SectionHeading } from '../components/SectionHeading';
import { ProductCard } from '../components/ProductCard';
import { MessageCircle } from 'lucide-react';
import { Button } from '../components/Button';

interface FullMenuSectionProps {
  lang: Language;
}

export const FullMenuSection: React.FC<FullMenuSectionProps> = ({ lang }) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');

  const content = {
    kicker: lang === 'ar' ? 'القائمة الحرفية' : 'The Artisan Menu',
    title:
      lang === 'ar'
        ? 'استكشف أصناف المقهى والمخبز'
        : 'Explore Our Food & Beverage Menu',
    subtitle:
      lang === 'ar'
        ? 'جميع أصنافنا تُحضر يومياً في مقهانا باستخدام أفضل حبوب البن المحمصة والدقيق غير المبيض والزبدة النقية.'
        : 'All items are crafted fresh in-house daily, using ethical micro-lot coffees, unbleached stoneground flours, and pure cultured butter.',
    customOrderNotice:
      lang === 'ar'
        ? 'هل لديك متطلبات غذائية خاصة أو ترغب بطلب مسبق لكميات كبيرة؟'
        : 'Have specific dietary preferences or need to place a catering preorder?',
    contactWhatsApp:
      lang === 'ar' ? 'تواصل عبر واتساب للطلبات الخاصة' : 'Inquire on WhatsApp for Special Orders',
  };

  const filteredProducts =
    selectedCategory === 'all'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === selectedCategory);

  const customOrderUrl = buildWhatsAppUrl(undefined, lang);

  return (
    <section id="menu" className="py-16 sm:py-24 bg-white border-b border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker={content.kicker}
          title={content.title}
          subtitle={content.subtitle}
        />

        {/* Category Segmented Controls (Interactive Filter Bar) */}
        <div className="flex items-center justify-start lg:justify-center overflow-x-auto pb-4 mb-10 sm:mb-12 no-scrollbar gap-1.5 p-1.5 bg-stone-100/80 rounded-xl border border-stone-200/80 max-w-full">
          {MENU_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-white text-stone-900 font-semibold shadow-xs border border-stone-200/60'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-white/40'
                }`}
                aria-pressed={isActive}
              >
                {cat.label[lang]}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              lang={lang}
            />
          ))}
        </div>

        {/* Dietary / Special Catering Prompt */}
        <div className="mt-14 p-6 sm:p-8 rounded-xl bg-[#FAF7F2] border border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-start">
          <div>
            <h3 className="font-display text-lg font-semibold text-stone-900">
              {lang === 'ar' ? 'طلبات الضيافة والمناسبات الخاصة' : 'Catering & Custom Pre-Orders'}
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-xl">
              {content.customOrderNotice}
            </p>
          </div>
          <Button
            href={customOrderUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            size="md"
            icon={<MessageCircle className="w-4 h-4" />}
          >
            {content.contactWhatsApp}
          </Button>
        </div>
      </div>
    </section>
  );
};
