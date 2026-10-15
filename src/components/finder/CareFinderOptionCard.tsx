import React from 'react';
import {
  MapPin,
  Hospital,
  Pill,
  Phone,
  ArrowRight,
  Navigation,
  Clock,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { FacilityType } from '../../types';
import { useLanguage } from '../../services/i18n';

interface CareFinderOptionCardProps {
  onOpenFinder: (type?: FacilityType | 'all') => void;
  onOpenTransport?: () => void;
}

export const CareFinderOptionCard: React.FC<CareFinderOptionCardProps> = ({
  onOpenFinder,
  onOpenTransport,
}) => {
  const { language, t } = useLanguage();
  const isHindi = language === 'hi';

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 mt-10 mb-12">
      <div
        id="card-care-finder-option"
        onClick={() => onOpenFinder('all')}
        className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-emerald-50/40 rounded-2xl border border-blue-200/80 p-6 sm:p-8 shadow-xs hover:shadow-md transition-all cursor-pointer group"
      >
        {/* Subtle Decorative Background Radar Glow */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-12 top-0 w-48 h-48 bg-emerald-100/40 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left Column: Heading, Badges & Highlights */}
          <div className="space-y-3.5 max-w-2xl">
            {/* Live Status Badge */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                onOpenFinder('all');
              }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-['Manrope']"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{isHindi ? 'लाइव स्वास्थ्य सेवा रडार' : 'Nearby Healthcare Radar'}</span>
              <span className="text-emerald-400 font-normal">|</span>
              <span className="text-emerald-700 font-semibold">{isHindi ? '24/7 नेटवर्क' : '24/7 Network'}</span>
            </div>

            {/* Title & Description */}
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-['Manrope'] text-slate-900 tracking-tight flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <span>
                  {isHindi
                    ? 'नज़दीकी अस्पताल व 24/7 मेडिकल स्टोर खोजें'
                    : 'Hospitals & 24/7 Pharmacies Finder'}
                </span>
              </h2>
              <p className="mt-2 text-sm text-slate-600 font-['Inter'] leading-relaxed">
                {isHindi
                  ? 'अपने वर्तमान स्थान के पास खुले मेडिकल स्टोर, आपातकालीन अस्पताल और क्लिनिक देखें। एक क्लिक में कॉल करें या मैप पर सीधा रास्ता पाएँ।'
                  : 'Discover verified emergency trauma centers, walk-in urgent care clinics, and 24-hour pharmacies near your live location with real-time radar mapping, one-tap calling, and turn-by-turn navigation.'}
              </p>
            </div>

            {/* Interactive Feature Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenFinder('pharmacy');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold shadow-2xs cursor-pointer transition active:scale-95"
              >
                <Pill className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isHindi ? '24/7 मेडिकल स्टोर' : 'Find 24/7 Pharmacies'}</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenFinder('hospital');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 font-bold shadow-2xs cursor-pointer transition active:scale-95"
              >
                <Hospital className="w-3.5 h-3.5 text-rose-600" />
                <span>{isHindi ? 'इमरजेंसी अस्पताल' : 'Find Emergency Hospitals'}</span>
              </button>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenFinder('all');
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/90 border border-slate-200 text-slate-700 font-medium shadow-2xs"
              >
                <Navigation className="w-3.5 h-3.5 text-blue-600" />
                <span>{isHindi ? 'लाइव दिशा-निर्देश' : 'Live Radar & Directions'}</span>
              </span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenFinder('all');
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/90 border border-slate-200 text-slate-700 font-medium shadow-2xs"
              >
                <Phone className="w-3.5 h-3.5 text-slate-600" />
                <span>{isHindi ? 'एक क्लिक में कॉल' : 'One-Tap Dialing'}</span>
              </span>
            </div>
          </div>

          {/* Right Column: CTA Button */}
          <div className="shrink-0 w-full lg:w-auto pt-2 lg:pt-0">
            <button
              id="btn-open-care-finder"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenFinder('all');
              }}
              className="w-full lg:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-['Manrope'] font-bold text-sm shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <span>{isHindi ? 'केयर फाइंडर खोलें' : 'Open Care Finder'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
