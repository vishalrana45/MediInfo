import React, { useState, useEffect } from 'react';
import { Medicine } from '../types';
import {
  getFriendlyCategory,
  getFriendlyOverview,
  getFriendlyUses,
} from '../utils/patientFriendlyText';
import {
  CheckCircle2,
  Clock,
  Utensils,
  Volume2,
  VolumeX,
  Bookmark,
  Bell,
  X,
  Pill,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  Zap,
  Check,
  AlertTriangle,
  Info,
  Truck,
} from 'lucide-react';
import { motion } from 'motion/react';

interface MedicineSearchResultModalProps {
  medicine: Medicine | null;
  isOpen: boolean;
  onClose: () => void;
  alternativeMatches?: Medicine[];
  onSelectAlternative?: (medicine: Medicine) => void;
  onOpenFullMonograph: (medicine: Medicine) => void;
  isSaved?: boolean;
  onToggleSave?: (medicine: Medicine) => void;
  onOpenReminder?: (medicine: Medicine) => void;
  onOpenPharmacyFinder?: (medicineName: string) => void;
  onOpenAIAssistant?: (medicineName: string) => void;
  onOpenTransport?: (medicineName: string) => void;
}

export const MedicineSearchResultModal: React.FC<MedicineSearchResultModalProps> = ({
  medicine,
  isOpen,
  onClose,
  alternativeMatches = [],
  onSelectAlternative,
  onOpenFullMonograph,
  isSaved = false,
  onToggleSave,
  onOpenReminder,
  onOpenPharmacyFinder,
  onOpenAIAssistant,
  onOpenTransport,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeConflictCheck, setActiveConflictCheck] = useState<string | null>(null);

  // Keyboard escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset state and stop audio whenever medicine or modal state changes
  useEffect(() => {
    setActiveConflictCheck(null);
    if (isPlayingAudio && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [medicine, isOpen]);

  if (!isOpen || !medicine) return null;

  const friendlyCategory = getFriendlyCategory(medicine);
  const friendlyOverview = getFriendlyOverview(medicine);
  const friendlyUses = getFriendlyUses(medicine);

  // Extract clean plain-English dosage and limits
  const directDose = medicine.dosage.general.split('.')[0] + '.';
  const directLimitWarning = medicine.dosage.warning.split('.')[0] + '.';

  // Audio voice explanation
  const handleToggleVoice = () => {
    if (!('speechSynthesis' in window)) {
      alert('Voice synthesis is not supported on this device.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToSpeak = `${medicine.name}. Purpose: ${friendlyOverview}. Used for: ${friendlyUses.join(', ')}. How to take: ${directDose}. Warning: ${directLimitWarning}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  // Substance Conflict Evaluation
  const getSubstanceConflict = (substance: string) => {
    const lower = (medicine.name + ' ' + medicine.genericName + ' ' + medicine.category).toLowerCase();
    if (substance === 'Alcohol') {
      if (lower.includes('paracetamol') || lower.includes('dolo') || lower.includes('acetaminophen')) {
        return {
          status: 'danger',
          title: 'STRICTLY FORBIDDEN: High Liver Strain',
          msg: 'Never mix alcohol with paracetamol. Alcohol increases toxic liver byproduct accumulation.',
        };
      }
      if (lower.includes('ibuprofen') || lower.includes('combiflam') || lower.includes('pain') || lower.includes('flam')) {
        return {
          status: 'danger',
          title: 'AVOID: Stomach Bleeding Risk',
          msg: 'Alcohol irritates the stomach lining and increases ulcer and stomach acid bleeding risks.',
        };
      }
      return {
        status: 'caution',
        title: 'Avoid While Taking',
        msg: 'Alcohol increases drowsiness and interferes with how your body absorbs this medicine.',
      };
    }
    if (substance === 'Coffee / Tea') {
      return {
        status: 'caution',
        title: 'Mild Caution',
        msg: 'Caffeine may increase acidity or slightly reduce absorption of certain antibiotics. Drink with water.',
      };
    }
    if (substance === 'Milk / Food') {
      if (lower.includes('cipro') || lower.includes('tetra') || lower.includes('doxy')) {
        return {
          status: 'danger',
          title: 'Take 2 Hours Apart',
          msg: 'Calcium in milk binds to this antibiotic. Take this medicine with plain water, 2 hours away from milk.',
        };
      }
      return {
        status: 'safe',
        title: 'Recommended After Food',
        msg: 'Taking after food or milk coats the stomach and prevents nausea or heartburn.',
      };
    }
    return {
      status: 'caution',
      title: 'Do Not Combine',
      msg: 'Never take another similar pain or fever medicine at the same time to prevent unintended double dosing.',
    };
  };

  return (
    <div
      id="medicine-search-result-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-result-modal-title"
      >
        {/* Top Header Bar */}
        <div className="bg-[#1E293B] px-5 sm:px-7 py-3.5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 font-bold text-xs font-['Manrope']">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Patient Medicine Guide
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Voice Reader */}
            <button
              id="btn-listen-modal-voice"
              onClick={handleToggleVoice}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-['Manrope'] font-bold transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-blue-600 text-white shadow-sm animate-pulse'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title="Listen to plain-English guide"
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen</span>
                </>
              )}
            </button>

            {/* Remind Button */}
            {onOpenReminder && (
              <button
                id="btn-remind-modal-result"
                onClick={() => {
                  onClose();
                  onOpenReminder(medicine);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-['Manrope'] font-bold bg-blue-500/30 hover:bg-blue-500/50 text-white border border-blue-400/40 transition-all cursor-pointer"
                title="Set dose reminder"
              >
                <Bell className="w-3.5 h-3.5 text-blue-300" />
                <span className="hidden sm:inline">Set Reminder</span>
              </button>
            )}

            {/* Save Medicine Button */}
            {onToggleSave && (
              <button
                id="btn-save-modal-result"
                onClick={() => onToggleSave(medicine)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-['Manrope'] font-bold transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title={isSaved ? 'Saved to profile' : 'Save medicine'}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
                <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
              </button>
            )}

            {/* Close Button */}
            <button
              id="btn-close-search-result-modal"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5">
          {/* Medicine Title & Quick Identity */}
          <div className="flex items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-start sm:items-center gap-3.5">
              <div
                className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 border border-slate-200"
                style={{ backgroundColor: `${medicine.visualColor || '#2563EB'}12` }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs"
                  style={{ backgroundColor: medicine.visualColor || '#2563EB' }}
                >
                  <Pill className="w-5 h-5" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 font-['Manrope']">
                    {friendlyCategory}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500 font-['Inter']">
                    {medicine.forms[0] || 'Tablet'}
                  </span>
                </div>
                <h3
                  id="search-result-modal-title"
                  className="text-2xl sm:text-3xl font-black font-['Manrope'] text-[#0F172A] tracking-tight leading-tight mt-0.5"
                >
                  {medicine.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-['Inter'] mt-0.5">
                  Active Molecule: <strong className="text-slate-900 font-semibold">{medicine.genericName}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Alternative / Related Matches Switcher (If any) */}
          {alternativeMatches.length > 0 && onSelectAlternative && (
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-['Manrope'] shrink-0 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-500" />
                Related:
              </span>
              {alternativeMatches.slice(0, 4).map((alt) => (
                <button
                  key={alt.id}
                  onClick={() => onSelectAlternative(alt)}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-bold font-['Manrope'] border border-slate-200 shrink-0 transition-colors cursor-pointer"
                >
                  {alt.name}
                </button>
              ))}
            </div>
          )}

          {/* ============================================================ */}
          {/* SECTION 1: WHAT IS THIS MEDICINE USED FOR?                   */}
          {/* ============================================================ */}
          <div className="bg-emerald-50/70 rounded-2xl p-5 border border-emerald-200/80 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Check className="w-4 h-4 stroke-[2.5]" />
              </div>
              <h4 className="text-sm font-black uppercase tracking-wider text-emerald-950 font-['Manrope']">
                What Is This Medicine Used For?
              </h4>
            </div>

            {/* Clear, simple patient-friendly summary */}
            <div className="p-3.5 rounded-xl bg-white border border-emerald-200/90 shadow-2xs">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 font-['Manrope'] block mb-1">
                Simple Purpose & What It Does:
              </span>
              <p className="text-xs sm:text-sm text-slate-900 font-medium font-['Inter'] leading-relaxed">
                {friendlyOverview}
              </p>
            </div>

            {/* Exact condition bullets */}
            <div className="pt-2 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 font-['Manrope'] block">
                Common Symptoms & Conditions Treated:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {friendlyUses.map((useItem, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white border border-emerald-200/90 shadow-2xs flex items-start gap-2 text-xs font-['Inter']"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-slate-900 font-semibold leading-snug">{useItem}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SECTION 2: HOW TO TAKE IT SAFELY                             */}
          {/* ============================================================ */}
          <div className="bg-blue-50/60 rounded-2xl p-5 border border-blue-200/80 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Clock className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-black uppercase tracking-wider text-blue-950 font-['Manrope']">
                How & When To Take It
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-white border border-blue-200/90 shadow-2xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 font-['Manrope'] block">
                  Recommended Adult Dose
                </span>
                <p className="text-xs sm:text-sm text-slate-800 font-semibold font-['Inter'] mt-1 leading-snug">
                  {directDose}
                </p>
                <span className="text-[11px] text-slate-500 font-['Inter'] mt-1 block">
                  Allow 4 to 6 hours between doses.
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-blue-200/90 shadow-2xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 font-['Manrope'] flex items-center gap-1">
                  <Utensils className="w-3.5 h-3.5 text-blue-600" />
                  Food & Water
                </span>
                <p className="text-xs sm:text-sm text-slate-800 font-semibold font-['Inter'] mt-1 leading-snug">
                  Take with or after food with a full glass of water.
                </p>
                <span className="text-[11px] text-slate-500 font-['Inter'] mt-1 block">
                  Protects stomach lining against irritation or nausea.
                </span>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SECTION 3: IMPORTANT SAFETY RULES & SIDE EFFECTS             */}
          {/* ============================================================ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Safety Warning Card */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <h4 className="text-xs font-black uppercase tracking-wider font-['Manrope']">
                    Important Safety Rules
                  </h4>
                </div>
                <p className="text-xs text-amber-950 font-medium font-['Inter'] mt-2 leading-relaxed">
                  {directLimitWarning}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-amber-200/80 flex flex-wrap gap-2 text-[11px] font-semibold text-amber-900 font-['Inter']">
                <span className="px-2 py-0.5 rounded-md bg-amber-100 border border-amber-300">
                  🚫 Avoid Alcohol
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-100 border border-amber-300">
                  ✓ Take After Food
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-100 border border-amber-300">
                  ✓ Follow Daily Limits
                </span>
              </div>
            </div>

            {/* Side Effects Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-blue-600" />
                    <h4 className="text-xs font-black uppercase tracking-wider font-['Manrope']">
                      Common Side Effects
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    Usually Mild
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {medicine.sideEffects.common.slice(0, 3).map((eff, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-['Inter'] font-medium"
                    >
                      {eff}
                    </span>
                  ))}
                </div>
              </div>

              <p className="mt-3 text-[11px] text-slate-500 font-['Inter']">
                Most people experience zero or very mild effects when taken after food.
              </p>
            </div>
          </div>

          {/* Quick Clash Checker */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 font-['Manrope']">
                Quick Clash Check: Can I take this with...
              </span>
              <span className="text-[11px] text-slate-400 font-['Inter']">Tap to check</span>
            </div>

            <div className="mt-2.5 flex flex-wrap gap-2">
              {['Alcohol', 'Coffee / Tea', 'Milk / Food', 'Other Painkillers'].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveConflictCheck(activeConflictCheck === sub ? null : sub)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-['Manrope'] font-bold transition-all cursor-pointer ${
                    activeConflictCheck === sub
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {activeConflictCheck && (
              <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                {(() => {
                  const res = getSubstanceConflict(activeConflictCheck);
                  return (
                    <div>
                      <div className="flex items-center justify-between">
                        <strong className="text-xs font-['Manrope'] text-slate-900">
                          {activeConflictCheck}:
                        </strong>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                            res.status === 'danger'
                              ? 'bg-rose-100 text-rose-800'
                              : res.status === 'caution'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {res.title}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 font-['Inter'] mt-1 leading-snug">
                        {res.msg}
                      </p>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="px-5 sm:px-7 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0">
          <button
            id="btn-modal-close-action"
            onClick={onClose}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-['Manrope'] font-bold text-xs border border-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Search Another Medicine / Close</span>
          </button>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
            {onOpenTransport && medicine && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenTransport(medicine.name);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-['Manrope'] font-bold text-xs shadow-xs transition-all cursor-pointer"
                title="Order from nearby pharmacy or hospital"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Order Medicine Delivery</span>
              </button>
            )}

            <button
              id="btn-modal-open-monograph"
              onClick={() => {
                onClose();
                onOpenFullMonograph(medicine);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-['Manrope'] font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <span>View Full Monograph</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
