import React from 'react';
import {
  Repeat,
  Bell,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { useLanguage } from '../../services/i18n';

interface ClinicalFeatureOptionCardsProps {
  onOpenMedicineComparison: (med1?: string, med2?: string) => void;
  onOpenReminders: () => void;
  remindersCount?: number;
}

export const ClinicalFeatureOptionCards: React.FC<ClinicalFeatureOptionCardsProps> = ({
  onOpenMedicineComparison,
  onOpenReminders,
  remindersCount = 0,
}) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 mt-6 mb-16 font-['Inter']">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold font-['Manrope'] inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{isHindi ? 'क्लिनिकल टूल्स एवं रोगी सुरक्षा' : 'Clinical Health & Safety Tools'}</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-['Manrope'] text-slate-900 tracking-tight">
            {isHindi ? 'दवा तुलना एवं दैनिक रिमाइंडर' : 'Medicine Comparison & Daily Dose Reminders'}
          </h2>
        </div>
      </div>

      {/* 2-Column Grid for Comparison & Reminders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARD 1: Medicine Comparison & Bioequivalence */}
        <div
          id="card-option-medicine-comparison"
          onClick={() => onOpenMedicineComparison('Paracetamol', 'Combiflam')}
          className="relative overflow-hidden bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/40 rounded-2xl border border-cyan-200/80 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs font-bold font-['Manrope']">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              <span>{isHindi ? 'साइड-बाय-साइड तुलना' : 'Side-by-Side Comparison'}</span>
              <span className="text-cyan-400 font-normal">|</span>
              <span className="text-blue-700 font-semibold">{isHindi ? 'जेनेरिक बचत' : 'Bioequivalence & Cost'}</span>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-bold font-['Manrope'] text-slate-900 tracking-tight flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-xs shrink-0">
                  <Repeat className="w-4.5 h-4.5" />
                </div>
                <span>
                  {isHindi ? 'दवाइयों की सीधी तुलना व जेनेरिक विकल्प' : 'Medicine Comparison & Bioequivalence'}
                </span>
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {isHindi
                  ? 'दो दवाइयों की सामग्री, असर शुरू होने की गति, पेट पर प्रभाव और जेनेरिक विकल्पों के मूल्यों की तुलना करें।'
                  : 'Compare any two medications side-by-side on active therapeutic molecules, onset speed, gastric safety, and affordable generic alternatives.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenMedicineComparison('Paracetamol', 'Combiflam');
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-cyan-800 font-bold text-xs"
              >
                <span>Paracetamol vs Combiflam</span>
              </button>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/90 border border-slate-200 text-slate-600 text-xs">
                <span>Onset Speed (15-30m)</span>
              </span>
            </div>
          </div>

          <div className="pt-5 border-t border-cyan-100 mt-4 flex items-center justify-between">
            <span className="text-xs text-cyan-900 font-semibold font-['Manrope']">
              {isHindi ? 'बायोइक्विवेलेंस विश्लेषण' : 'Bioequivalence analytics'}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenMedicineComparison();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-['Manrope'] font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
            >
              <span>{isHindi ? 'दवाइयों की तुलना करें' : 'Compare Medicines'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* CARD 2: Dose Reminders & Adherence Tracker */}
        <div
          id="card-option-dose-reminders"
          onClick={onOpenReminders}
          className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/40 to-teal-50/40 rounded-2xl border border-blue-200/80 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold font-['Manrope']">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              <span>{isHindi ? 'दैनिक ख़ुराक अनुपालन' : 'Adherence Alarms'}</span>
              <span className="text-blue-400 font-normal">|</span>
              <span className="text-teal-700 font-semibold">{remindersCount} Active</span>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-bold font-['Manrope'] text-slate-900 tracking-tight flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
                  <Bell className="w-4.5 h-4.5" />
                </div>
                <span>
                  {isHindi ? 'स्मार्ट दवाई रिमाइंडर एवं डोज़ ट्रैकर' : 'Smart Dose Reminders & Adherence Tracker'}
                </span>
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {isHindi
                  ? 'सुबह, दोपहर व रात के भोजन के साथ समय पर दवाई लेने के अलार्म सेट करें ताकि कोई ख़ुराक छूटे या दोहरी न हो जाए।'
                  : 'Ensure zero missed doses with desktop alerts, morning/noon/night slots, meal relationship sync (before/after food), and adherence score logging.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 font-bold text-xs">
                <Clock className="w-3 h-3 text-blue-600" />
                <span>Meal Sync: Before/After Food</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 font-bold text-xs">
                <CheckCircle2 className="w-3 h-3 text-teal-600" />
                <span>Adherence Logs</span>
              </span>
            </div>
          </div>

          <div className="pt-5 border-t border-blue-100 mt-4 flex items-center justify-between">
            <span className="text-xs text-blue-900 font-semibold font-['Manrope']">
              {isHindi ? 'समय पर दवा, बेहतर स्वास्थ्य' : 'Live dose notifications'}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenReminders();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-['Manrope'] font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
            >
              <span>{isHindi ? 'रिमाइंडर खोलें' : 'Open Reminders'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
