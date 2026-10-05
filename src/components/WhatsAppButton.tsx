import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Language } from '../types';
import { buildWhatsAppUrl } from '../data/content';

interface WhatsAppButtonProps {
  lang: Language;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppButtonProps> = ({ lang }) => {
  const url = buildWhatsAppUrl(undefined, lang);

  const label = lang === 'ar' ? 'اطلب أو احجز عبر واتساب' : 'Order or Reserve via WhatsApp';
  const quickText = lang === 'ar' ? 'تواصل معنا مباشرة' : 'Chat with Zayt';

  return (
    <div className="fixed bottom-6 inset-inline-end-6 z-40 flex items-center gap-3">
      {/* Subtle callout pill visible on tablet and desktop */}
      <span className="hidden sm:inline-flex items-center px-3.5 py-1.5 rounded-full bg-white text-stone-800 text-xs font-medium shadow-md border border-stone-200/80 pointer-events-none animate-pulse">
        {quickText}
      </span>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[#25D366] focus-visible:outline-offset-2"
        aria-label={label}
        title={label}
      >
        <MessageCircle className="w-7 h-7 text-white fill-white/20 stroke-[2.2]" />
      </a>
    </div>
  );
};
