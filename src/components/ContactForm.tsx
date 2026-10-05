import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { Language } from '../types';
import { Button } from './Button';

interface ContactFormProps {
  lang: Language;
  className?: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({ lang, className = '' }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    topic: 'general',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const t = {
    title: lang === 'ar' ? 'أرسل لنا رسالة' : 'Send Us a Message',
    subtitle:
      lang === 'ar'
        ? 'للاستفسارات العامة، الفعاليات الخاصة، أو طلبات الجملة لمخبوزاتنا وقهوتنا.'
        : 'For general inquiries, private events, catering, or wholesale artisan bakery.',
    name: lang === 'ar' ? 'الاسم الكامل' : 'Full Name',
    namePlaceholder: lang === 'ar' ? 'مثال: أحمد المنصوري' : 'e.g. Layla Vance',
    email: lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address',
    emailPlaceholder: lang === 'ar' ? 'name@example.com' : 'name@example.com',
    phone: lang === 'ar' ? 'رقم الهاتف' : 'Phone Number',
    phonePlaceholder: lang === 'ar' ? '+971 50 123 4567' : '+971 50 123 4567',
    topic: lang === 'ar' ? 'موضوع الاستفسار' : 'Inquiry Topic',
    topicGeneral: lang === 'ar' ? 'استفسار عام عن المقهى' : 'General Cafe Inquiry',
    topicReservation: lang === 'ar' ? 'حجز طاولة أو جلسة خاصة' : 'Table or Gathering Reservation',
    topicCatering: lang === 'ar' ? 'طلبات فعاليات وخدمات ضيافة' : 'Private Events & Catering',
    topicBeans: lang === 'ar' ? 'شراء محاصيل بن بالجملة' : 'Wholesale Coffee Beans & Bakery',
    message: lang === 'ar' ? 'رسالتك' : 'Your Message',
    messagePlaceholder:
      lang === 'ar'
        ? 'اكتب تفاصيل طلبك أو استفسارك هنا...'
        : 'Tell us how we can assist you...',
    submit: lang === 'ar' ? 'إرسال الرسالة' : 'Send Message',
    submitting: lang === 'ar' ? 'جارٍ الإرسال...' : 'Sending Message...',
    successTitle: lang === 'ar' ? 'تم استلام رسالتك بنجاح' : 'Message Sent Successfully',
    successText:
      lang === 'ar'
        ? 'شكراً لتواصلك مع مقهى زيت. سيقوم فريقنا بالرد عليك عبر البريد أو الهاتف خلال ساعات العمل.'
        : 'Thank you for reaching out to Zayt Café. Our team will get back to you shortly.',
    sendAnother: lang === 'ar' ? 'إرسال رسالة أخرى' : 'Send Another Message',
    errorRequired: lang === 'ar' ? 'هذا الحقل مطلوب' : 'This field is required',
    errorEmail: lang === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email address',
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = t.errorRequired;
    }

    if (!formData.email.trim()) {
      newErrors.email = t.errorRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.errorEmail;
    }

    if (!formData.message.trim()) {
      newErrors.message = t.errorRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate clean visual submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        topic: 'general',
        message: '',
      });
      setErrors({});
    }, 600);
  };

  return (
    <div className={`p-6 sm:p-8 rounded-xl bg-white border border-stone-200/80 shadow-xs ${className}`}>
      {isSuccess ? (
        <div className="py-8 text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-display text-2xl font-semibold text-stone-900 mb-2">
            {t.successTitle}
          </h3>
          <p className="text-stone-600 text-sm max-w-md leading-relaxed mb-6">
            {t.successText}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSuccess(false)}
          >
            {t.sendAnother}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <h3 className="font-display text-2xl font-semibold text-stone-900 mb-1">
              {t.title}
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm">
              {t.subtitle}
            </p>
          </div>

          {/* Name & Email Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label
                htmlFor="contact-name"
                className="block text-xs font-medium text-stone-800 mb-1.5"
              >
                {t.name} <span className="text-red-500">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t.namePlaceholder}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white placeholder-stone-400 transition-colors ${
                  errors.name
                    ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-stone-300 focus:border-[#9E471D] focus:ring-1 focus:ring-[#9E471D]'
                }`}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="block text-xs font-medium text-stone-800 mb-1.5"
              >
                {t.email} <span className="text-red-500">*</span>
              </label>
              <input
                id="contact-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder={t.emailPlaceholder}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white placeholder-stone-400 transition-colors ${
                  errors.email
                    ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-stone-300 focus:border-[#9E471D] focus:ring-1 focus:ring-[#9E471D]'
                }`}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>
          </div>

          {/* Phone & Topic Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="contact-phone"
                className="block text-xs font-medium text-stone-800 mb-1.5"
              >
                {t.phone}
              </label>
              <input
                id="contact-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder={t.phonePlaceholder}
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:border-[#9E471D] focus:ring-1 focus:ring-[#9E471D] text-sm bg-white placeholder-stone-400"
              />
            </div>

            <div>
              <label
                htmlFor="contact-topic"
                className="block text-xs font-medium text-stone-800 mb-1.5"
              >
                {t.topic}
              </label>
              <select
                id="contact-topic"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:border-[#9E471D] focus:ring-1 focus:ring-[#9E471D] text-sm bg-white text-stone-800"
              >
                <option value="general">{t.topicGeneral}</option>
                <option value="reservation">{t.topicReservation}</option>
                <option value="catering">{t.topicCatering}</option>
                <option value="wholesale">{t.topicBeans}</option>
              </select>
            </div>
          </div>

          {/* Message Textarea */}
          <div>
            <label
              htmlFor="contact-message"
              className="block text-xs font-medium text-stone-800 mb-1.5"
            >
              {t.message} <span className="text-red-500">*</span>
            </label>
            <textarea
              id="contact-message"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder={t.messagePlaceholder}
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white placeholder-stone-400 resize-none transition-colors ${
                errors.message
                  ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-stone-300 focus:border-[#9E471D] focus:ring-1 focus:ring-[#9E471D]'
              }`}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'message-error' : undefined}
            />
            {errors.message && (
              <p id="message-error" className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.message}</span>
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full sm:w-auto"
              disabled={isSubmitting}
              icon={<Send className="w-4 h-4" />}
            >
              {isSubmitting ? t.submitting : t.submit}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
