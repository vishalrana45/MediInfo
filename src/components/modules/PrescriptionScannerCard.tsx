import React from 'react';
import {
  FileText,
  Camera,
  ArrowRight,
  Sparkles,
  Upload,
  CheckCircle2,
  Stethoscope,
} from 'lucide-react';
import { useLanguage } from '../../services/i18n';

interface PrescriptionScannerCardProps {
  onOpenPrescriptionScanner: () => void;
}

export const PrescriptionScannerCard: React.FC<PrescriptionScannerCardProps> = ({
  onOpenPrescriptionScanner,
}) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  return (
    <section id="section-prescription-scanner" className="w-full max-w-7xl mx-auto px-4 sm:px-6 mt-6 mb-8 font-['Inter']">
      <div
        id="card-prescription-scanner-flagship"
        onClick={onOpenPrescriptionScanner}
        className="relative overflow-hidden bg-gradient-to-br from-white via-indigo-50/40 to-blue-50/40 rounded-2xl border border-indigo-200/90 p-6 sm:p-8 shadow-xs hover:shadow-md transition-all cursor-pointer group"
      >
        {/* Subtle Decorative Background Radar Glow */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-12 top-0 w-48 h-48 bg-blue-100/30 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left Column: Heading, Badges & Highlights */}
          <div className="space-y-3.5 max-w-2xl">
            {/* Live Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold font-['Manrope']">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              <span>{isHindi ? 'लाइव ओसीआर विज़न' : 'Live OCR Vision Engine'}</span>
              <span className="text-indigo-400 font-normal">|</span>
              <span className="text-indigo-700 font-semibold">
                {isHindi ? 'डॉक्टर पर्ची स्कैनर व अनुवादक' : 'Doctor Prescription Digitizer'}
              </span>
            </div>

            {/* Title & Description */}
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-['Manrope'] text-slate-900 tracking-tight flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
                  <FileText className="w-5 h-5 text-indigo-100" />
                </div>
                <span>
                  {isHindi
                    ? 'डॉक्टर की पर्ची (Prescription) स्कैन व ओसीआर'
                    : 'Scan Doctor Prescription & Digital OCR'}
                </span>
              </h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {isHindi
                  ? 'डॉक्टर की हस्तलिखित पर्ची की फोटो खींचें या अपलोड करें। एआई तुरंत दवाओं के नाम, खुराक (Dosage), भोजन के पहले/बाद का समय और ख़ास सावधानियाँ निकाल कर देगा।'
                  : 'Capture or upload handwritten prescriptions to instantly decipher doctor handwriting, extract all prescribed medicines, dosage schedules (morning/night), meal timings, and clinical precautions.'}
              </p>
            </div>

            {/* Interactive Feature Highlights */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-100/90 text-indigo-900 font-bold border border-indigo-200 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>{isHindi ? 'हस्तलिखित लिखावट पहचान' : 'Handwriting Decryption'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/90 border border-slate-200 text-slate-700 font-medium shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isHindi ? 'दवा व खुराक निष्कर्षण' : 'Medication Extraction'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/90 border border-slate-200 text-slate-700 font-medium shadow-2xs">
                <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                <span>{isHindi ? 'रोग व निदान सारांश' : 'Diagnosis & Advice'}</span>
              </span>
            </div>
          </div>

          {/* Right Column: CTA Button */}
          <div className="shrink-0 w-full lg:w-auto pt-2 lg:pt-0">
            <button
              id="btn-open-prescription-scanner-main"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenPrescriptionScanner();
              }}
              className="w-full lg:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-['Manrope'] font-bold text-sm shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-indigo-100" />
              <span>{isHindi ? 'पर्ची स्कैन करें' : 'Scan Prescription'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
