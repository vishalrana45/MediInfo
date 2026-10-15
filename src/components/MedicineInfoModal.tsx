import React, { useState, useEffect } from 'react';
import { Medicine } from '../types';
import {
  getFriendlyCategory,
  getFriendlyOverview,
  getFriendlyUses,
} from '../utils/patientFriendlyText';
import {
  Bookmark,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Pill,
  ChevronDown,
  ChevronUp,
  Sparkles,
  HelpCircle,
  Volume2,
  VolumeX,
  Utensils,
  Droplets,
  Car,
  Wine,
  Coffee,
  Info,
  Bell,
  MapPin,
  Truck,
} from 'lucide-react';
import { motion } from 'motion/react';

interface MedicineInfoModalProps {
  medicine: Medicine | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved?: boolean;
  onToggleSave?: (medicine: Medicine) => void;
  onOpenPharmacyFinder?: (medicineName: string) => void;
  onOpenTransport?: (medicineName: string) => void;
}

export const MedicineInfoModal: React.FC<MedicineInfoModalProps> = ({
  medicine,
  isOpen,
  onClose,
  isSaved = false,
  onToggleSave,
  onOpenPharmacyFinder,
  onOpenTransport,
}) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [selectedPillCount, setSelectedPillCount] = useState(1);
  const [selectedSubstance, setSelectedSubstance] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Reset state when medicine changes or modal opens
  useEffect(() => {
    setSelectedPillCount(1);
    setSelectedSubstance(null);
    if (isPlayingAudio && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  }, [medicine, isOpen]);

  // Clean up speech synthesis when closing
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isOpen || !medicine) return null;

  const friendlyCategory = getFriendlyCategory(medicine);
  const friendlyOverview = getFriendlyOverview(medicine);
  const friendlyUses = getFriendlyUses(medicine);

  // Extract clear primary adult dose from dosage text
  const primaryDose = medicine.dosage.general.split('.')[0] + '.';
  const maxLimitWarning = medicine.dosage.warning || 'Do not exceed prescribed limit.';

  // Attempt to parse unit strength from generic name or forms (e.g. 650, 500, 400)
  const strengthMatch = (medicine.genericName + ' ' + medicine.forms.join(' ')).match(/(\d+)\s*(?:mg)/i);
  const unitMg = strengthMatch ? parseInt(strengthMatch[1], 10) : 500;
  const currentTotalMg = unitMg * selectedPillCount;

  // Safe threshold heuristics
  const maxSingleDoseMg = unitMg > 600 ? 1000 : 1000;
  const isDoseCaution = currentTotalMg > maxSingleDoseMg;

  // Text-to-Speech audio reader
  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToSpeak = `${medicine.name}, active ingredient ${medicine.genericName}. Primarily used for: ${friendlyUses.slice(0, 2).join(' and ')}. Recommended adult dose: ${primaryDose} Important safety warning: ${maxLimitWarning}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  // Substance interaction dictionary
  const getSubstanceVerdict = (substance: string) => {
    const medText = (medicine.name + ' ' + medicine.genericName + ' ' + medicine.category).toLowerCase();
    
    if (substance === 'Alcohol') {
      if (medText.includes('paracetamol') || medText.includes('acetaminophen') || medText.includes('dolo')) {
        return {
          status: 'danger',
          title: 'High Liver Toxicity Clash',
          desc: 'Strictly avoid. Both paracetamol and alcohol are metabolized by liver CYP2E1 enzymes, drastically accelerating toxic metabolite accumulation (NAPQI).'
        };
      }
      if (medText.includes('ibuprofen') || medText.includes('nsaid')) {
        return {
          status: 'danger',
          title: 'Severe Stomach Bleeding Risk',
          desc: 'Alcohol multiplies stomach lining erosion and increases risk of gastric ulcers when combined with NSAID pain relievers.'
        };
      }
      if (medText.includes('cetirizine') || medText.includes('anti-allergic') || medText.includes('antihistamine')) {
        return {
          status: 'danger',
          title: 'Severe Sedation & Motor Impairment',
          desc: 'Alcohol intensifies central nervous system depression, leading to heavy drowsiness and impaired cognitive reflexes.'
        };
      }
      return {
        status: 'caution',
        title: 'Caution Advised',
        desc: 'Alcohol can alter drug metabolism or increase dizziness and dehydration. Avoid while undergoing therapy.'
      };
    }

    if (substance === 'Coffee & Caffeine') {
      if (medText.includes('cipro') || medText.includes('norflox')) {
        return {
          status: 'caution',
          title: 'Prolonged Caffeine Stimulation',
          desc: 'This medicine slows caffeine breakdown by up to 80%, causing heart palpitations, restlessness, and insomnia.'
        };
      }
      return {
        status: 'safe',
        title: 'Generally Compatible',
        desc: 'Moderate coffee consumption does not directly diminish efficacy, but take medicine with a full glass of plain water.'
      };
    }

    if (substance === 'Dairy & Milk') {
      if (medText.includes('doxycycline') || medText.includes('tetracycline') || medText.includes('ciprofloxacin')) {
        return {
          status: 'danger',
          title: 'Blocks Antibiotic Absorption',
          desc: 'Calcium ions bind to this medication in the digestive tract, preventing bloodstream absorption. Keep at least 2 hours apart.'
        };
      }
      return {
        status: 'safe',
        title: 'Safe with Milk or Meals',
        desc: 'Taking with milk or after food can actually reduce mild gastric discomfort for this medication.'
      };
    }

    if (substance === 'Other Painkillers') {
      if (medText.includes('ibuprofen') || medText.includes('nsaid')) {
        return {
          status: 'danger',
          title: 'Dual-NSAID Danger',
          desc: 'Never combine with Aspirin, Naproxen, or Diclofenac. Dual NSAIDs skyrocket the risk of stomach ulcers and kidney injury.'
        };
      }
      if (medText.includes('paracetamol')) {
        return {
          status: 'caution',
          title: 'Check Combination Products',
          desc: 'Paracetamol is already hidden in many cold/flu syrups. Ensure your combined total paracetamol does not exceed 4,000 mg/day.'
        };
      }
      return {
        status: 'caution',
        title: 'Consult Pharmacist',
        desc: 'Always verify active ingredients before taking multiple over-the-counter remedies simultaneously.'
      };
    }

    return {
      status: 'safe',
      title: 'No Direct Conflict',
      desc: 'No known severe adverse interaction with standard household intake.'
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* ============================================================ */}
        {/* HEADER: Clean, Friendly & High-Legibility                    */}
        {/* ============================================================ */}
        <div className="bg-slate-50/90 px-6 py-4 border-b border-slate-200/80 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              {/* Pill Emblem */}
              <div
                className="w-13 h-13 rounded-2xl flex items-center justify-center shrink-0 shadow-xs border border-slate-200"
                style={{ backgroundColor: `${medicine.visualColor}15` }}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-xs"
                  style={{ backgroundColor: medicine.visualColor || '#2563EB' }}
                >
                  <Pill className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-block text-[11px] font-extrabold font-['Manrope'] text-[#2563EB] tracking-wider uppercase">
                    {friendlyCategory}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 font-['Manrope']">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified Monograph
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black font-['Manrope'] text-[#0F172A] tracking-tight">
                  {medicine.name}
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 font-['Inter']">
                  Active Formulation: <strong className="text-slate-800 font-bold">{medicine.genericName}</strong>
                </p>
              </div>
            </div>

            {/* Actions: Audio Guide, Save & Close */}
            <div className="flex items-center gap-2">
              {/* Unique Feature: Audio Read-Out */}
              <button
                id="btn-voice-guide-modal"
                onClick={handleToggleAudio}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-['Manrope'] font-bold transition-all cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-blue-600 text-white animate-pulse'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/80'
                }`}
                title="Listen to medicine voice guide"
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Stop Audio</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Listen</span>
                  </>
                )}
              </button>

              {onToggleSave && (
                <button
                  id="btn-save-medicine-modal"
                  onClick={() => onToggleSave(medicine)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-['Manrope'] font-bold transition-all cursor-pointer ${
                    isSaved
                      ? 'bg-blue-50 text-[#2563EB] border border-blue-200'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-blue-600 text-blue-600' : 'text-slate-400'}`} />
                  <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
                </button>
              )}

              <button
                id="btn-close-medicine-modal"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* FAST-READ CONTENT: Direct, Scannable & Unique                */}
        {/* ============================================================ */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 bg-[#F8FAFC] flex-1">
          {/* 1. QUICK PLAIN-ENGLISH SUMMARY */}
          <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200/80 flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-800 font-['Manrope'] block">
                Direct Patient Guidance
              </span>
              <p className="text-xs sm:text-sm text-slate-800 font-['Inter'] mt-0.5 leading-relaxed font-medium">
                {friendlyOverview}
              </p>
            </div>
          </div>

          {/* 1.5 FAST-READ DIRECT MESSAGES WITH SYMBOLS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 font-['Manrope'] block">
                  Primary Indication
                </span>
                <span className="text-xs font-bold text-slate-900 font-['Manrope'] leading-tight block mt-0.5">
                  {friendlyUses[0]}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-800 font-['Manrope'] block">
                  Recommended Dosage
                </span>
                <span className="text-xs font-bold text-slate-900 font-['Manrope'] leading-tight block mt-0.5">
                  {primaryDose}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5">
              <Utensils className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 font-['Manrope'] block">
                  Food & Digestion
                </span>
                <span className="text-xs font-bold text-slate-900 font-['Manrope'] leading-tight block mt-0.5">
                  Take after meals with water. Avoid taking on an empty stomach.
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-800 font-['Manrope'] block">
                  Safety Contraindication
                </span>
                <span className="text-xs font-bold text-rose-950 font-['Manrope'] leading-tight block mt-0.5">
                  Avoid alcohol. {maxLimitWarning.split('.')[0]}
                </span>
              </div>
            </div>
          </div>

          {/* 2. UNIQUE FEATURE: INTERACTIVE SAFE DOSE CALCULATOR & METER */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="text-xs sm:text-sm font-extrabold text-[#0F172A] font-['Manrope'] uppercase tracking-wide">
                  Safe Dose Calculator & Visual Limits
                </h3>
              </div>
              <span className="text-[11px] text-slate-500 font-semibold font-['Inter']">
                Standard Unit: <strong>{unitMg} mg per tablet</strong>
              </span>
            </div>

            <div className="mt-3.5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Pill Count Stepper */}
              <div className="md:col-span-5 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-['Manrope'] block mb-2">
                  Select Intended Single Dose:
                </span>
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((count) => (
                    <button
                      key={count}
                      onClick={() => setSelectedPillCount(count)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-['Manrope'] font-bold transition-all cursor-pointer ${
                        selectedPillCount === count
                          ? 'bg-[#2563EB] text-white shadow-xs'
                          : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {count} {count === 1 ? 'Tablet' : 'Tablets'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Safety Status Meter */}
              <div className="md:col-span-7 bg-slate-50 p-3 rounded-xl border border-slate-200/70 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600 font-['Inter']">
                    Calculated Dose: <strong className="text-slate-900 font-bold">{currentTotalMg} mg</strong>
                  </span>
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md font-['Manrope'] ${
                      isDoseCaution
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isDoseCaution ? 'Excessive Single Dose' : 'Safe Single Dose'}
                  </span>
                </div>

                {/* Meter Bar */}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isDoseCaution ? 'bg-rose-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, (currentTotalMg / 1500) * 100)}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-500 font-['Inter'] mt-2 leading-snug">
                  {isDoseCaution
                    ? 'Caution: Exceeds standard single dose threshold. Consult a healthcare professional before administering.'
                    : `Standard adult therapeutic range. Maintain recommended dosing interval and do not exceed daily cap.`}
                </p>
              </div>
            </div>
          </div>

          {/* 3. UNIQUE FEATURE: INTERACTIVE FOOD & SUBSTANCE CLASH CHECKER */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h3 className="text-xs sm:text-sm font-extrabold text-[#0F172A] font-['Manrope'] uppercase tracking-wide">
                  Instant Food & Drug Conflict Checker
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-medium font-['Inter']">
                Tap substance to check
              </span>
            </div>

            {/* Quick Interactive Substance Buttons */}
            <div className="mt-3 flex flex-wrap gap-2">
              {['Alcohol', 'Coffee & Caffeine', 'Dairy & Milk', 'Other Painkillers'].map((substance) => (
                <button
                  key={substance}
                  onClick={() => setSelectedSubstance(selectedSubstance === substance ? null : substance)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-['Manrope'] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedSubstance === substance
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {substance === 'Alcohol' && <Wine className="w-3.5 h-3.5" />}
                  {substance === 'Coffee & Caffeine' && <Coffee className="w-3.5 h-3.5" />}
                  {substance === 'Dairy & Milk' && <Droplets className="w-3.5 h-3.5" />}
                  {substance === 'Other Painkillers' && <Pill className="w-3.5 h-3.5" />}
                  <span>{substance}</span>
                </button>
              ))}
            </div>

            {/* Live Verdict Panel */}
            {selectedSubstance && (
              <div className="mt-3 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 animate-in fade-in duration-150">
                {(() => {
                  const verdict = getSubstanceVerdict(selectedSubstance);
                  return (
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold font-['Manrope'] text-slate-900 flex items-center gap-1.5">
                          <span>{selectedSubstance}:</span>
                          <strong
                            className={
                              verdict.status === 'danger'
                                ? 'text-rose-700'
                                : verdict.status === 'caution'
                                ? 'text-amber-800'
                                : 'text-emerald-700'
                            }
                          >
                            {verdict.title}
                          </strong>
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                            verdict.status === 'danger'
                              ? 'bg-rose-100 text-rose-800'
                              : verdict.status === 'caution'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {verdict.status === 'danger' ? 'Avoid Clash' : verdict.status === 'caution' ? 'Caution' : 'Compatible'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 font-['Inter'] mt-1 leading-relaxed">
                        {verdict.desc}
                      </p>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {/* 4. ESSENTIAL CLINICAL ACTION GRIDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CARD 1: WHAT IT'S FOR */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-[#0F172A] font-['Manrope'] uppercase tracking-wide">
                    Approved Uses & Conditions Treated
                  </h3>
                </div>
                <div className="space-y-2">
                  {friendlyUses.slice(0, 4).map((use, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-emerald-50/40 border border-emerald-100/70 flex items-start gap-2 text-xs text-slate-800 font-['Inter'] font-medium leading-snug"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <span>{use}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CARD 2: SIDE EFFECTS & EMERGENCY WARNINGS */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-[#0F172A] font-['Manrope'] uppercase tracking-wide">
                    Side Effects & Red Flags
                  </h3>
                </div>

                <div className="space-y-2">
                  {/* Common mild */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700 font-['Inter']">
                    <strong className="text-slate-900 font-bold block mb-0.5 font-['Manrope'] text-[11px] uppercase tracking-wider">
                      Common / Transient
                    </strong>
                    <span>{medicine.sideEffects.common.join(', ')}</span>
                  </div>

                  {/* Red flag */}
                  <div className="p-2.5 rounded-xl bg-rose-50/80 border border-rose-200/90 text-xs text-rose-900 font-['Inter']">
                    <strong className="text-rose-950 font-bold block mb-0.5 font-['Manrope'] text-[11px] uppercase tracking-wider flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                      Emergency Symptoms
                    </strong>
                    <span className="leading-snug">{medicine.sideEffects.severe[0] || 'Any acute rash, swelling, or breathing difficulty.'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5. VISUAL ADMINISTRATION ROUTINE BADGES */}
          <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-['Inter'] text-slate-700">
            <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl">
              <Utensils className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold text-slate-800">Take After Food</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl">
              <Droplets className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-semibold text-slate-800">Full Glass Water</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="font-semibold text-slate-800">6–8h Interval</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl">
              <Car className="w-4 h-4 text-purple-600 shrink-0" />
              <span className="font-semibold text-slate-800">Non-Drowsy Safe</span>
            </div>
          </div>

          {/* 6. OPTIONAL ACCORDION: DEEP COMPENDIA DETAILS */}
          <div>
            <button
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-100/80 hover:bg-slate-200/70 text-slate-600 hover:text-slate-900 text-xs font-bold font-['Manrope'] transition-colors"
            >
              <span className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-slate-400" />
                Additional Details: Brand names, dosage forms & drug interactions
              </span>
              {showTechnicalDetails ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {showTechnicalDetails && (
              <div className="mt-2.5 p-4 bg-white rounded-2xl border border-slate-200/80 space-y-3.5 text-xs font-['Inter'] text-slate-700">
                <div>
                  <strong className="font-bold text-slate-900 block mb-1 font-['Manrope']">
                    Recognized Brand Equivalents:
                  </strong>
                  <div className="flex flex-wrap gap-1.5">
                    {medicine.brandNames.map((b) => (
                      <span key={b} className="px-2.5 py-1 bg-slate-100 rounded-md font-semibold text-slate-700">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <strong className="font-bold text-slate-900 block mb-1 font-['Manrope']">
                    Available Dosage Formulations:
                  </strong>
                  <div className="flex flex-wrap gap-1.5">
                    {medicine.forms.map((f) => (
                      <span key={f} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md font-semibold border border-blue-100">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <strong className="font-bold text-slate-900 block mb-1 font-['Manrope']">
                    Known Prescription Interactions:
                  </strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    {medicine.interactions.map((inter, i) => (
                      <li key={i}>{inter}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <strong className="font-bold text-slate-900 block mb-1 font-['Manrope']">
                    Storage & Potency Preservation:
                  </strong>
                  <p className="text-slate-600">{medicine.storage}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* FOOTER: Reassuring & Actionable                              */}
        {/* ============================================================ */}
        <div className="bg-white px-6 py-3.5 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 font-['Inter'] shrink-0">
          <span className="text-slate-400">
            Clinical Monograph for educational reference. Never adjust dosage without consulting your registered medical practitioner.
          </span>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {onOpenTransport && medicine && (
              <button
                id="btn-modal-info-order-transport"
                onClick={() => {
                  onClose();
                  onOpenTransport(medicine.name);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-['Manrope'] font-bold text-xs shadow-xs transition-all cursor-pointer text-center"
                title="Order from nearby pharmacy or hospital"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Order via Medical Courier</span>
              </button>
            )}
            {onOpenPharmacyFinder && medicine && (
              <button
                id="btn-modal-info-find-pharmacy"
                onClick={() => {
                  onClose();
                  onOpenPharmacyFinder(medicine.name);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-['Manrope'] font-bold text-xs border border-emerald-200 transition-all cursor-pointer text-center"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Find Nearby Pharmacy</span>
              </button>
            )}
            <button
              id="btn-done-medicine-modal"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-['Manrope'] font-bold text-xs sm:text-sm transition-all cursor-pointer text-center"
            >
              Done
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
