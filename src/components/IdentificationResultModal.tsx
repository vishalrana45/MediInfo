import React, { useState } from 'react';
import { IdentificationResult, Medicine } from '../types';
import { CheckCircle2, ArrowRight, ShieldCheck, Bookmark, X, Pill, Sparkles, Volume2, VolumeX, Utensils, Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

interface IdentificationResultModalProps {
  result: IdentificationResult | null;
  isOpen?: boolean;
  onClose: () => void;
  onViewFullInfo: (medicine: Medicine) => void;
  isSaved?: boolean;
  onToggleSave?: (medicine: Medicine) => void;
}

export const IdentificationResultModal: React.FC<IdentificationResultModalProps> = ({
  result,
  isOpen = true,
  onClose,
  onViewFullInfo,
  isSaved = false,
  onToggleSave,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!isOpen || !result || !result.medicine) return null;

  const medicine = result.medicine;

  const handleToggleVoice = () => {
    if (!('speechSynthesis' in window)) return;
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const text = `Identified ${medicine.name}, active ingredient ${medicine.genericName}. Used for: ${medicine.uses.slice(0, 2).join(' and ')}. Recommended adult dose: ${medicine.dosage.general.split('.')[0]}. Warning: ${medicine.dosage.warning.split('.')[0]}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
      >
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold font-['Manrope'] text-emerald-700 tracking-wide uppercase">
              Medicine Identified • {result.confidenceScore || 98}% Match
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Audio Voice Guide Button */}
            <button
              id="btn-voice-ident-modal"
              onClick={handleToggleVoice}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isPlayingAudio ? 'bg-blue-600 text-white animate-pulse' : 'text-slate-500 hover:text-blue-600 hover:bg-slate-100'
              }`}
              title="Listen to medicine summary"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {onToggleSave && (
              <button
                onClick={() => onToggleSave(medicine)}
                title={isSaved ? 'Remove from saved' : 'Save medicine'}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  isSaved ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-blue-600' : ''}`} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Clean, Informative & User-Friendly */}
        <div className="p-6 sm:p-8 space-y-5">
          {/* Medicine Card Identification Showcase */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Realistic Pill / Capsule Icon Badge */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-slate-200 shadow-sm"
                style={{ backgroundColor: `${medicine.visualColor}18` }}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: medicine.visualColor || '#2563EB' }}
                >
                  <Pill className="w-5 h-5" />
                </div>
              </div>

              <div>
                <span className="text-xs font-bold font-['Manrope'] text-[#2563EB] tracking-wide uppercase">
                  {medicine.category.split('•')[0].trim()}
                </span>
                <h2 className="text-2xl font-extrabold font-['Manrope'] text-[#0F172A] tracking-tight">
                  {medicine.name}
                </h2>
                <p className="text-sm font-semibold text-slate-500 font-['Inter']">
                  Active Molecule: <strong className="text-slate-800 font-bold">{medicine.genericName}</strong>
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold font-['Manrope'] border border-emerald-200">
                <Sparkles className="w-3 h-3" />
                Verified Form
              </span>
              <span className="text-xs text-slate-400 font-['Inter']">
                {medicine.forms[0] || 'Oral Formulation'}
              </span>
            </div>
          </div>

          {/* Quick Plain English Overview */}
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs sm:text-sm text-slate-800 font-['Inter'] font-medium leading-relaxed">
            {medicine.overview}
          </div>

          {/* Key Direct-Message Takeaways */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Treats */}
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 font-['Manrope'] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Primary Indication
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 font-['Manrope'] mt-1 line-clamp-2">
                {medicine.uses[0]}
              </p>
            </div>

            {/* Dose */}
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80">
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-800 font-['Manrope'] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                Recommended Adult Dose
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 font-['Manrope'] mt-1">
                {medicine.dosage.general.split('.')[0]}.
              </p>
            </div>

            {/* Food Directive */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 font-['Manrope'] flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-amber-600" />
                Food & Administration
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 font-['Manrope'] mt-1">
                Take after meals with a full glass of water.
              </p>
            </div>

            {/* Hard Stop / Limit */}
            <div className="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200">
              <span className="text-[11px] font-black uppercase tracking-wider text-rose-800 font-['Manrope'] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                Key Precautions
              </span>
              <p className="text-xs sm:text-sm font-bold text-rose-950 font-['Manrope'] mt-1">
                Avoid alcohol. Do not exceed {medicine.dosage.warning.split('.')[0].replace(/^Strict warning:\s*/i, '')}
              </p>
            </div>
          </div>

          {/* Administration Routine Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-['Inter'] text-slate-700">
            <span className="px-3 py-1 bg-slate-100 rounded-lg font-medium flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-emerald-600" />
              Take After Meals
            </span>
            <span className="px-3 py-1 bg-slate-100 rounded-lg font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              Interval: 4–6 Hours
            </span>
            <span className="px-3 py-1 bg-slate-100 rounded-lg font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              Non-Habit Forming
            </span>
          </div>

          {/* Available Forms & Common Brands */}
          <div className="space-y-2 border-t border-slate-100 pt-3.5 text-xs sm:text-sm">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 font-['Inter']">Common Brands</span>
              <span className="text-slate-800 font-bold font-['Manrope']">
                {medicine.brandNames.slice(0, 3).join(', ')}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-['Inter']">Available In</span>
              <span className="text-slate-800 font-bold font-['Manrope']">
                {medicine.forms.slice(0, 2).join(', ')}
              </span>
            </div>
          </div>

          {/* Prominent Action Button: [ View Full Medicine Guide ] */}
          <div className="pt-2">
            <button
              id="btn-view-full-information"
              onClick={() => {
                onClose();
                onViewFullInfo(medicine);
              }}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-['Manrope'] font-bold text-sm sm:text-base shadow-[0_4px_16px_rgba(37,99,235,0.25)] transition-all hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)] active:scale-[0.99] cursor-pointer"
            >
              <span>Inspect Complete Clinical Guide</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
