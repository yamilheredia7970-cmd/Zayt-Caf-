import React, { useState } from 'react';
import { Instagram, MapPin, Phone, Mail, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { Language } from '../types';
import { BRAND_CONFIG, NAV_LINKS, OPENING_HOURS } from '../data/content';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const brandName = lang === 'ar' ? BRAND_CONFIG.nameAr : BRAND_CONFIG.nameEn;
  const tagline = lang === 'ar' ? BRAND_CONFIG.taglineAr : BRAND_CONFIG.taglineEn;

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubmitted(true);
  };

  const content = {
    aboutText:
      lang === 'ar'
        ? 'مقهى ومخبز حرفي يمزج فنون القهوة المختصة بأصالة المخبوزات ونكهات بلاد الشام وحوض المتوسط.'
        : 'Artisanal specialty coffeehouse and bakery uniting Levantine botanicals with slow sourdough craft.',
    quickLinks: lang === 'ar' ? 'روابط سريعة' : 'Quick Navigation',
    hoursTitle: lang === 'ar' ? 'ساعات العمل' : 'Opening Times',
    newsletterTitle: lang === 'ar' ? 'نشرة زيت البريدية' : 'The Zayt Journal',
    newsletterDesc:
      lang === 'ar'
        ? 'اشترك ليصلك جدول محاصيل البن الحصرية والوصفات الموسمية لمخبزنا.'
        : 'Receive notes on rare micro-lot releases, seasonal viennoiserie, and community gatherings.',
    newsletterPlaceholder:
      lang === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email address',
    newsletterButton: lang === 'ar' ? 'اشتراك' : 'Subscribe',
    subscribedMsg:
      lang === 'ar' ? 'شكراً لاشتراكك في نشرتنا!' : 'Thank you for subscribing!',
    rights:
      lang === 'ar'
        ? 'جميع الحقوق محفوظة لمقهى زيت © 2026'
        : '© 2026 Zayt Café. All rights reserved.',
    designedFor:
      lang === 'ar'
        ? 'مبني بهيكلية جاهزة للتحويل إلى ووردبريس وإليمنتور'
        : 'Structured for WordPress & Elementor conversion',
  };

  return (
    <footer className="bg-[#1C1816] text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-Column Footer Grid (Elementor Container 4-cols) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-stone-800/80">
          {/* Col 1: Brand & Bio (lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col items-start text-start">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {brandName}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#9E471D] self-baseline mt-4" />
            </div>

            <p className="text-xs uppercase tracking-wider text-[#9E471D] font-semibold mb-4">
              {tagline}
            </p>

            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed mb-6 max-w-sm">
              {content.aboutText}
            </p>

            {/* Social handles */}
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800/90 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Follow Zayt on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={BRAND_CONFIG.addressEn}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800/90 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Location on Google Maps"
              >
                <MapPin className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${BRAND_CONFIG.email}`}
                className="w-9 h-9 rounded-full bg-stone-800/90 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Email Zayt Cafe"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links (lg:col-span-2) */}
          <div className="lg:col-span-2 text-start">
            <h4 className="font-display text-base font-semibold text-white mb-4">
              {content.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    className="text-stone-400 hover:text-white transition-colors"
                  >
                    {link.label[lang]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Hours Summary (lg:col-span-3) */}
          <div className="lg:col-span-3 text-start">
            <h4 className="font-display text-base font-semibold text-white mb-4">
              {content.hoursTitle}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-400">
              {OPENING_HOURS.map((h, i) => (
                <li key={i} className="flex flex-col">
                  <span className="text-stone-300 font-medium">{h.days[lang]}</span>
                  <span className="font-mono text-stone-400 tabular-nums text-xs">{h.hours[lang]}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Newsletter Subscription (lg:col-span-3) */}
          <div className="lg:col-span-3 text-start">
            <h4 className="font-display text-base font-semibold text-white mb-3">
              {content.newsletterTitle}
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed mb-4">
              {content.newsletterDesc}
            </p>

            {newsletterSubmitted ? (
              <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{content.subscribedMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder={content.newsletterPlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-lg text-xs bg-stone-800 border border-stone-700 text-white placeholder-stone-500 focus:outline-none focus:border-[#9E471D]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-[#9E471D] hover:bg-[#853A15] text-white transition-colors cursor-pointer"
                >
                  <span>{content.newsletterButton}</span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Subtle Architecture note */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 text-center sm:text-start">
          <p>{content.rights}</p>
          <p className="text-stone-600 text-[11px] font-mono">
            {content.designedFor}
          </p>
        </div>
      </div>
    </footer>
  );
};
