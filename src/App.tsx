import React, { useState, useEffect } from 'react';
import { Language } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './sections/HeroSection';
import { FeaturesSection } from './sections/FeaturesSection';
import { FeaturedMenuSection } from './sections/FeaturedMenuSection';
import { FullMenuSection } from './sections/FullMenuSection';
import { AboutSection } from './sections/AboutSection';
import { GallerySection } from './sections/GallerySection';
import { TestimonialsSection } from './sections/TestimonialsSection';
import { LocationSection } from './sections/LocationSection';
import { ContactSection } from './sections/ContactSection';
import { CtaBannerSection } from './sections/CtaBannerSection';
import { Footer } from './sections/Footer';
import { WhatsAppFloatingButton } from './components/WhatsAppButton';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [activeSection, setActiveSection] = useState<string>('home');

  // Sync dir and lang attributes on the document element whenever language switches
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Observer to highlight active navigation link
  useEffect(() => {
    const sectionIds = ['home', 'menu', 'about', 'gallery', 'location', 'contact'];
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const headerOffset = 120;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop - headerOffset;
          if (scrollY >= top) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#241F1C]">
      {/* 1. Header / Navbar */}
      <Navbar
        currentLang={lang}
        onLanguageChange={setLang}
        activeSection={activeSection}
      />

      {/* Main Semantic Landmark */}
      <main className="flex-1">
        {/* 2. Hero Section */}
        <HeroSection lang={lang} />

        {/* 3. Features / Four Pillars */}
        <FeaturesSection lang={lang} />

        {/* 4. Featured Menu Highlights */}
        <FeaturedMenuSection lang={lang} />

        {/* 5. Complete Categorized Menu */}
        <FullMenuSection lang={lang} />

        {/* 6. Brand Story & Craft */}
        <AboutSection lang={lang} />

        {/* 7. Curated Atmosphere Gallery */}
        <GallerySection lang={lang} />

        {/* 8. Testimonials & Critical Praise */}
        <TestimonialsSection lang={lang} />

        {/* 9. Location, Opening Hours & Map */}
        <LocationSection lang={lang} />

        {/* 10. Contact Inquiries & Direct Form */}
        <ContactSection lang={lang} />

        {/* 11. Final High-Conversion WhatsApp CTA Banner */}
        <CtaBannerSection lang={lang} />
      </main>

      {/* 12. Footer */}
      <Footer lang={lang} />

      {/* Floating Instant WhatsApp Button */}
      <WhatsAppFloatingButton lang={lang} />
    </div>
  );
}
