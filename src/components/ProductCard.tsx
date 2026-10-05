import React, { useState } from 'react';
import { MessageCircle, Coffee } from 'lucide-react';
import { Language, Product } from '../types';
import { buildWhatsAppUrl } from '../data/content';

interface ProductCardProps {
  product: Product;
  lang: Language;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  lang,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  const productName = product.name[lang];
  const productDesc = product.description[lang];
  const currencyLabel = product.currency[lang];
  const whatsappUrl = buildWhatsAppUrl(productName, lang);

  const badgeConfig = {
    popular: {
      bg: 'bg-amber-100/90 text-amber-900 border-amber-200/80',
    },
    chef: {
      bg: 'bg-emerald-100/90 text-emerald-900 border-emerald-200/80',
    },
    signature: {
      bg: 'bg-stone-900 text-stone-100 border-stone-800',
    },
    new: {
      bg: 'bg-orange-100/90 text-orange-900 border-orange-200/80',
    },
  };

  return (
    <article
      className={`group flex flex-col bg-white rounded-xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-1 ${className}`}
    >
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden shrink-0">
        {!imageError && product.image ? (
          <img
            src={product.image}
            alt={productName}
            loading="lazy"
            decoding="async"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-stone-100 text-stone-400">
            <Coffee className="w-10 h-10 mb-2 stroke-[1.25]" />
            <span className="text-xs uppercase tracking-wider text-stone-500 font-medium">
              Zayt Specialty
            </span>
          </div>
        )}

        {/* Badge - Single subtle tag if present */}
        {product.badge && (
          <div className="absolute top-3 inset-inline-start-3 z-10">
            <span
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border tracking-wide uppercase shadow-xs ${
                badgeConfig[product.badge.type || 'popular'].bg
              }`}
            >
              {product.badge[lang]}
            </span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between gap-4">
        <div>
          {/* Header Row: Title & Price */}
          <div className="flex items-baseline justify-between gap-3 mb-2">
            <h3 className="font-display text-lg sm:text-xl font-semibold text-stone-900 leading-snug">
              {productName}
            </h3>
            <span className="font-semibold text-stone-900 text-base sm:text-lg tabular-nums shrink-0">
              {product.price}{' '}
              <span className="text-xs font-normal text-stone-500 uppercase">
                {currencyLabel}
              </span>
            </span>
          </div>

          {/* Description */}
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
            {productDesc}
          </p>
        </div>

        {/* WhatsApp Order Action */}
        <div className="pt-3 border-t border-stone-100">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium bg-[#FAF7F2] hover:bg-[#25D366]/10 text-stone-800 hover:text-emerald-800 border border-stone-200/90 hover:border-emerald-300 transition-colors duration-150"
            aria-label={`${lang === 'ar' ? 'اطلب' : 'Order'} ${productName} ${
              lang === 'ar' ? 'عبر واتساب' : 'on WhatsApp'
            }`}
          >
            <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" aria-hidden="true" />
            <span className="truncate">
              {lang === 'ar' ? 'اطلب عبر واتساب' : 'Order on WhatsApp'}
            </span>
          </a>
        </div>
      </div>
    </article>
  );
};
