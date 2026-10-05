import React, { useState } from 'react';
import { Menu, X, MessageCircle } from 'lucide-react';
import { Language } from '../types';
import { BRAND_CONFIG, NAV_LINKS, buildWhatsAppUrl } from '../data/content';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Button } from './Button';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  activeSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const brandName = currentLang === 'ar' ? BRAND_CONFIG.nameAr : BRAND_CONFIG.nameEn;
  const whatsappUrl = buildWhatsAppUrl(undefined, currentLang);
  const whatsappCtaText = currentLang === 'ar' ? 'اطلب عبر واتساب' : 'WhatsApp Order';

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#FAF7F2]/95 backdrop-blur-md border-b border-stone-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <a
          href="#home"
          className="flex items-center gap-2 text-stone-900 group shrink-0"
          aria-label={brandName}
        >
          <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 group-hover:text-[#9E471D] transition-colors">
            {brandName}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#9E471D] self-baseline mt-4" aria-hidden="true" />
        </a>

        {/* Zone 2: Navigation Links (Clean text links with hover underline) */}
        <nav
          className="hidden lg:flex items-center gap-8 text-sm font-medium text-stone-700"
          aria-label="Main Navigation"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                className={`py-1 relative transition-colors duration-150 ${
                  isActive
                    ? 'text-[#9E471D] font-semibold'
                    : 'hover:text-stone-900 text-stone-700'
                }`}
              >
                {link.label[currentLang]}
                {isActive && (
                  <span
                    className="absolute bottom-0 inset-x-0 h-0.5 bg-[#9E471D] rounded-full"
                    aria-hidden="true"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Actions (Language Switcher + WhatsApp CTA + Mobile Menu Button) */}
        <div className="flex items-center gap-3 shrink-0">
          <LanguageSwitcher
            currentLang={currentLang}
            onLanguageChange={onLanguageChange}
            className="hidden sm:inline-flex"
          />

          <Button
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            size="sm"
            className="hidden md:inline-flex shadow-xs text-xs font-semibold"
            icon={<MessageCircle className="w-4 h-4" />}
          >
            {whatsappCtaText}
          </Button>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 transition-colors focus-visible:outline-2 focus-visible:outline-[#9E471D]"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-[#FAF7F2] px-4 pt-4 pb-6 space-y-4 shadow-lg">
          <nav className="flex flex-col space-y-2" aria-label="Mobile Navigation">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={handleNavClick}
                  className={`px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-white text-[#9E471D] font-semibold shadow-xs'
                      : 'text-stone-800 hover:bg-white/60'
                  }`}
                >
                  {link.label[currentLang]}
                </a>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-stone-200/80 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                {currentLang === 'ar' ? 'اللغة' : 'Language'}
              </span>
              <LanguageSwitcher
                currentLang={currentLang}
                onLanguageChange={onLanguageChange}
              />
            </div>

            <Button
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="whatsapp"
              size="md"
              className="w-full justify-center text-sm font-semibold"
              icon={<MessageCircle className="w-4 h-4" />}
              onClick={handleNavClick}
            >
              {whatsappCtaText}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
