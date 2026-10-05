import React from 'react';
import { MapPin, Navigation, Car, Phone, Mail } from 'lucide-react';
import { Language } from '../types';
import { CONTACT_DATA, OPENING_HOURS } from '../data/content';
import { SectionHeading } from '../components/SectionHeading';
import { OpeningHours } from '../components/OpeningHours';
import { Button } from '../components/Button';

interface LocationSectionProps {
  lang: Language;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ lang }) => {
  const content = {
    kicker: lang === 'ar' ? 'الموقع وساعات الزيارة' : 'Visit & Opening Times',
    title:
      lang === 'ar'
        ? 'زورونا في حي السركال للفنون'
        : 'Find Us at Alserkal Arts District',
    subtitle:
      lang === 'ar'
        ? 'موقعنا في قلب المنطقة الإبداعية في دبي، مع مواقف سيارات مظللة وجلسات داخلية وخارجية هادئة.'
        : 'Situated in the creative heart of Dubai, surrounded by contemporary galleries, shaded courtyards, and artisanal ateliers.',
    getDirections: lang === 'ar' ? 'الاتجاهات عبر الخريطة' : 'Get Directions on Google Maps',
    parkingTitle: lang === 'ar' ? 'معلومات صف السيارات' : 'Valet & Parking',
  };

  return (
    <section id="location" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker={content.kicker}
          title={content.title}
          subtitle={content.subtitle}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Column 1: Info & Schedule (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Address Card */}
            <div className="p-6 sm:p-7 rounded-xl bg-white border border-stone-200/80 shadow-xs">
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-5 h-5 text-[#9E471D] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display text-lg font-semibold text-stone-900">
                    {CONTACT_DATA.brandName[lang]}
                  </h3>
                  <p className="text-sm text-stone-700 mt-1 leading-relaxed">
                    {CONTACT_DATA.address[lang]}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {CONTACT_DATA.neighborhood[lang]}
                  </p>
                </div>
              </div>

              {/* Contact mini-list */}
              <div className="pt-3 border-t border-stone-100 space-y-2 text-xs text-stone-600 mb-5">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <a href={`tel:${CONTACT_DATA.phone}`} className="hover:text-stone-900 transition-colors">
                    {CONTACT_DATA.phoneDisplay}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  <a href={`mailto:${CONTACT_DATA.email}`} className="hover:text-stone-900 transition-colors">
                    {CONTACT_DATA.email}
                  </a>
                </div>
              </div>

              <Button
                href={CONTACT_DATA.googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                size="sm"
                className="w-full"
                icon={<Navigation className="w-3.5 h-3.5" />}
              >
                {content.getDirections}
              </Button>
            </div>

            {/* Opening Hours Widget */}
            <OpeningHours hours={OPENING_HOURS} lang={lang} />

            {/* Parking Info Note */}
            <div className="p-4 rounded-xl bg-stone-100/70 border border-stone-200/80 flex items-start gap-3 text-xs text-stone-600">
              <Car className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 block font-medium mb-0.5">
                  {content.parkingTitle}
                </strong>
                <span>{CONTACT_DATA.parkingInfo[lang]}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Google Maps Embed Placeholder (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative w-full h-[360px] sm:h-[460px] lg:h-full min-h-[380px] rounded-xl overflow-hidden border border-stone-200/80 bg-stone-100 shadow-xs">
              <iframe
                title="Zayt Cafe Location Map"
                src={CONTACT_DATA.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale-[25%] contrast-[1.05]"
              />
              {/* Overlay Badge */}
              <div className="absolute top-4 inset-inline-start-4 pointer-events-none bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-lg border border-stone-200/90 shadow-xs text-xs">
                <span className="font-semibold text-stone-900 block">
                  {CONTACT_DATA.brandName[lang]}
                </span>
                <span className="text-stone-500 text-[11px]">
                  Alserkal Avenue, Al Quoz 1
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
