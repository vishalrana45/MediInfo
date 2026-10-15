import React from 'react';
import { Hero3DMedicineCanvas } from './Hero3DMedicineCanvas';
import { useLanguage } from '../services/i18n';

interface HeroSectionProps {
  onScrollToScanner?: () => void;
  onExploreLibrary?: () => void;
  onOpenAIAssistant?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = () => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  return (
    <section id="hero-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-8 pb-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* LEFT SIDE: Authoritative clinical guide + clear, quick understanding */}
        <div className="lg:col-span-6 flex flex-col justify-center text-left">
          {/* User-Centric Reassuring Eyebrow */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50/90 border border-blue-200 text-[11px] font-bold tracking-wider uppercase text-blue-700 font-['Manrope'] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              {isHindi
                ? 'सम्पूर्ण स्वास्थ्य सहायता • 24/7 इमरजेंसी नेटवर्क'
                : 'Healthcare Intelligence • 24/7 Emergency Ready'}
            </span>
          </div>

          {/* Gripping, truthful headline matching exact platform features */}
          <h1 className="text-3xl sm:text-4xl lg:text-[3.15rem] font-black font-['Manrope'] tracking-tight text-[#0F172A] leading-[1.15]">
            {isHindi ? (
              <>
                न दवा का संशय, न इलाज का इंतज़ार।{' '}
                <span className="block mt-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                  दवा स्कैनर, 24/7 अस्पताल रडार व 10-मिनट डिलीवरी।
                </span>
              </>
            ) : (
              <>
                Never Guess a Medicine. Never Wait for Care.{' '}
                <span className="block mt-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                  Pill Scanner, 24/7 Hospital Radar & 10-Min Delivery.
                </span>
              </>
            )}
          </h1>

          {/* Natural, human clinical description without buzzwords */}
          <p className="mt-4 text-base sm:text-lg text-[#475569] font-['Inter'] leading-relaxed max-w-xl">
            {isHindi
              ? 'कैमरे से तुरंत किसी भी गोली या डॉक्टर की पर्ची को पहचानें, नजदीकी 24/7 अस्पताल व लाइव ब्लड बैंक खोजें और 10 मिनट में दवाएं सीधे घर पाएं।'
              : 'Point your camera to identify tablets and doctor prescriptions, locate nearby 24/7 emergency hospitals and live blood banks, and get verified medicines delivered to your door in 10 minutes.'}
          </p>

          {/* Premium Quick Feature Highlights */}
          <div className="mt-5 flex flex-wrap items-center gap-2.5 text-xs font-semibold">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50/80 border border-blue-200/70 text-blue-800">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              {isHindi ? 'कैमरा पिल व पर्ची स्कैनर' : 'Camera Pill & Rx Scanner'}
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50/80 border border-emerald-200/70 text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {isHindi ? '24/7 अस्पताल व ब्लड रडार' : '24/7 Hospital & Blood Radar'}
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50/80 border border-indigo-200/70 text-indigo-800">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
              {isHindi ? '10-मिनट डोरस्टेप डिलीवरी' : '10-Min Doorstep Delivery'}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Real Three.js 3D Medicines */}
        <div className="lg:col-span-6 flex items-center justify-center">
          <Hero3DMedicineCanvas />
        </div>
      </div>
    </section>
  );
};
