import React from 'react';
import { Globe } from 'lucide-react';
import { Language } from '../types';

interface LanguageSwitcherProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLang,
  onLanguageChange,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 p-1 rounded-full border border-stone-200/80 bg-stone-100/70 text-xs font-medium text-stone-700 ${className}`}
      role="group"
      aria-label="Language selection"
    >
      <Globe className="w-3.5 h-3.5 ms-1 text-stone-500" aria-hidden="true" />
      <button
        type="button"
        onClick={() => onLanguageChange('en')}
        className={`px-2.5 py-1 rounded-full transition-all duration-150 whitespace-nowrap ${
          currentLang === 'en'
            ? 'bg-white text-stone-900 font-semibold shadow-xs'
            : 'text-stone-600 hover:text-stone-900'
        }`}
        aria-pressed={currentLang === 'en'}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => onLanguageChange('ar')}
        className={`px-2.5 py-1 rounded-full transition-all duration-150 whitespace-nowrap ${
          currentLang === 'ar'
            ? 'bg-white text-stone-900 font-semibold shadow-xs'
            : 'text-stone-600 hover:text-stone-900'
        }`}
        aria-pressed={currentLang === 'ar'}
      >
        العربية
      </button>
    </div>
  );
};
