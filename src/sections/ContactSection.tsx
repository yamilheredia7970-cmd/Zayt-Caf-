import React from 'react';
import { Mail, Phone, MessageCircle, Clock, MapPin } from 'lucide-react';
import { Language } from '../types';
import { BRAND_CONFIG, buildWhatsAppUrl, CONTACT_DATA } from '../data/content';
import { SectionHeading } from '../components/SectionHeading';
import { ContactForm } from '../components/ContactForm';
import { Button } from '../components/Button';

interface ContactSectionProps {
  lang: Language;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ lang }) => {
  const whatsappUrl = buildWhatsAppUrl(undefined, lang);

  const content = {
    kicker: lang === 'ar' ? 'تواصل معنا' : 'Get in Touch',
    title:
      lang === 'ar'
        ? 'نسعد دائماً باستقبال رسائلكم واستفساراتكم'
        : 'Connect with the Zayt Team',
    subtitle:
      lang === 'ar'
        ? 'سواء كنت ترغب بحجز طاولة لمجموعة، الاستفسار عن حبوب البن ومخبوزاتنا، أو التنسيق لفعالية خاصة، يسعدنا التحدث معك.'
        : 'Whether inquiring about large group gatherings, specialty coffee wholesale, or event hosting, our team is at your disposal.',
    whatsappDirectTitle:
      lang === 'ar' ? 'تفضل الرد الفوري عبر واتساب؟' : 'Prefer an instant reply via WhatsApp?',
    whatsappDirectDesc:
      lang === 'ar'
        ? 'فريق الباريستا والضيافة متواجد يومياً خلال ساعات العمل للرد على طلباتكم واستفساراتكم.'
        : 'Our hospitality and barista team is online throughout operating hours for quick orders and questions.',
    chatNow: lang === 'ar' ? 'محادثة مباشرة الآن' : 'Chat Directly Now',
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-white border-b border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker={content.kicker}
          title={content.title}
          subtitle={content.subtitle}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Direct channels and WhatsApp Callout (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            {/* Quick Contact Cards */}
            <div className="p-6 sm:p-7 rounded-xl bg-[#FAF7F2] border border-stone-200/80 shadow-xs space-y-5">
              <h3 className="font-display text-xl font-semibold text-stone-900">
                {lang === 'ar' ? 'بيانات التواصل المباشر' : 'Direct Channels'}
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#9E471D] shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs text-stone-500 font-medium">
                      {lang === 'ar' ? 'الهاتف' : 'Telephone'}
                    </span>
                    <a
                      href={`tel:${CONTACT_DATA.phone}`}
                      className="text-stone-900 font-semibold hover:text-[#9E471D] transition-colors"
                    >
                      {CONTACT_DATA.phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#9E471D] shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs text-stone-500 font-medium">
                      {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Inquiries'}
                    </span>
                    <a
                      href={`mailto:${CONTACT_DATA.email}`}
                      className="text-stone-900 font-semibold hover:text-[#9E471D] transition-colors"
                    >
                      {CONTACT_DATA.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#9E471D] shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs text-stone-500 font-medium">
                      {lang === 'ar' ? 'العنوان' : 'Address'}
                    </span>
                    <span className="text-stone-800">
                      {CONTACT_DATA.address[lang]}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#9E471D] shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs text-stone-500 font-medium">
                      {lang === 'ar' ? 'ساعات الخدمة' : 'Service Hours'}
                    </span>
                    <span className="text-stone-800">
                      07:30 AM – 11:30 PM (Daily)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Priority Card */}
            <div className="p-6 sm:p-7 rounded-xl bg-emerald-50/70 border border-emerald-200/80 shadow-xs">
              <div className="flex items-center gap-2.5 text-emerald-900 mb-2">
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
                <h4 className="font-semibold text-base">
                  {content.whatsappDirectTitle}
                </h4>
              </div>
              <p className="text-stone-600 text-xs sm:text-sm mb-4 leading-relaxed">
                {content.whatsappDirectDesc}
              </p>
              <Button
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="whatsapp"
                size="md"
                className="w-full"
                icon={<MessageCircle className="w-4 h-4" />}
              >
                {content.chatNow}
              </Button>
            </div>
          </div>

          {/* Right Column: Contact Form (lg:col-span-7) */}
          <div className="lg:col-span-7">
            <ContactForm lang={lang} />
          </div>
        </div>
      </div>
    </section>
  );
};
