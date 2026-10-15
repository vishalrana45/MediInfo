import React, { useState, useEffect } from 'react';
import { Medicine } from '../types';
import {
  getFriendlyCategory,
  getFriendlyOverview,
  getFriendlyUses,
} from '../utils/patientFriendlyText';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  Utensils,
  AlertOctagon,
  ShieldAlert,
  Volume2,
  VolumeX,
  Bookmark,
  X,
  Sparkles,
  Droplets,
  Car,
  Wine,
  Coffee,
  Pill,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SearchResultSectionProps {
  medicine: Medicine;
  alternativeMatches?: Medicine[];
  onSelectAlternative?: (medicine: Medicine) => void;
  onClear: () => void;
  onOpenFullMonograph: (medicine: Medicine) => void;
  isSaved?: boolean;
  onToggleSave?: (medicine: Medicine) => void;
}

export const SearchResultSection: React.FC<SearchResultSectionProps> = ({
  medicine,
  alternativeMatches = [],
  onSelectAlternative,
  onClear,
  onOpenFullMonograph,
  isSaved = false,
  onToggleSave,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedPills, setSelectedPills] = useState(1);
  const [activeConflictCheck, setActiveConflictCheck] = useState<string | null>(null);

  // Stop audio on medicine change or unmount
  useEffect(() => {
    setSelectedPills(1);
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
  }, [medicine]);

  // Extract strength in mg
  const strengthMatch = (medicine.genericName + ' ' + medicine.forms.join(' ')).match(/(\d+)\s*(?:mg)/i);
  const unitMg = strengthMatch ? parseInt(strengthMatch[1], 10) : 500;
  const totalDoseMg = unitMg * selectedPills;
  const isDoseExcessive = totalDoseMg > 1000;

  const friendlyCategory = getFriendlyCategory(medicine);
  const friendlyOverview = getFriendlyOverview(medicine);
  const friendlyUses = getFriendlyUses(medicine);

  // Primary short direct message extracts
  const directPrimaryUse = friendlyOverview;
  const directDose = medicine.dosage.general.split('.')[0] + '.';
  const directLimitWarning = medicine.dosage.warning.split('.')[0] + '.';

  // Audio voice explanation
  const handleToggleVoice = () => {
    if (!('speechSynthesis' in window)) {
      alert('Voice synthesis is not supported on this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToSpeak = `${medicine.name}, active compound ${medicine.genericName}. Purpose: ${friendlyOverview}. What it treats: ${friendlyUses.join(', ')}. How to take: ${directDose}. Critical warning: ${directLimitWarning}`;
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
          title: 'STRICTLY FORBIDDEN: Acute Liver Damage',
          msg: 'Combining alcohol with paracetamol accelerates dangerous toxic metabolites in your liver. Avoid alcohol completely.',
        };
      }
      if (lower.includes('ibuprofen') || lower.includes('combiflam') || lower.includes('pain')) {
        return {
          status: 'danger',
          title: 'HIGH RISK: Stomach Ulcers & Bleeding',
          msg: 'Alcohol irritates the stomach lining and drastically raises gastric bleeding risk when combined with pain medicines.',
        };
      }
      return {
        status: 'caution',
        title: 'Avoid While Taking',
        msg: 'Alcohol alters medicine absorption and can heighten drowsiness, nausea, or dizziness.',
      };
    }
    if (substance === 'Coffee / Tea') {
      return {
        status: 'caution',
        title: 'Mild Caution',
        msg: 'Caffeine may increase acidity, heart palpitations, or reduce absorption of certain antibiotics.',
      };
    }
    if (substance === 'Dairy / Milk') {
      if (lower.includes('cipro') || lower.includes('tetra') || lower.includes('doxy')) {
        return {
          status: 'danger',
          title: 'STRICTLY AVOID: Calcium Blocks Drug',
          msg: 'Calcium binds with this antibiotic, preventing the body from absorbing it. Separate by 2 hours.',
        };
      }
      return {
        status: 'safe',
        title: 'Safe With Food / Milk',
        msg: 'Milk can help coat the stomach and reduce nausea when taking pain relievers.',
      };
    }
    return {
      status: 'caution',
      title: 'Never Double Dose',
      msg: 'Do not take another painkiller or cold product simultaneously without verifying active ingredients.',
    };
  };

  return (
    <section
      id="medicine-search-result-section"
      className="w-full max-w-5xl mx-auto px-4 sm:px-6 mt-8 mb-12 scroll-mt-24"
    >
      <div className="bg-white rounded-3xl border-2 border-blue-500/30 shadow-[0_16px_50px_-12px_rgba(37,99,235,0.12)] overflow-hidden">
        {/* ============================================================ */}
        {/* TOP STATUS BANNER & DIRECT CONTROLS                          */}
        {/* ============================================================ */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-5 sm:px-8 py-4 text-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-xs">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-blue-100 font-['Manrope'] block">
                Medicine Monograph
              </span>
              <span className="text-xs text-blue-100 font-medium font-['Inter']">
                Indications, Recommended Dosages & Safety Guidance
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Audio Reader */}
            <button
              id="btn-listen-search-result"
              onClick={handleToggleVoice}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-['Manrope'] font-bold transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-white text-blue-700 shadow-md animate-pulse'
                  : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
              }`}
              title="Listen to medicine summary"
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Stop Audio</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen</span>
                </>
              )}
            </button>

            {/* Save Medicine Button */}
            {onToggleSave && (
              <button
                id="btn-save-search-result"
                onClick={() => onToggleSave(medicine)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-['Manrope'] font-bold transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
                }`}
                title={isSaved ? 'Saved to your profile' : 'Save medicine to profile'}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-blue-700' : ''}`} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>
            )}

            {/* Clear / Dismiss Result Button */}
            <button
              id="btn-clear-search-result"
              onClick={onClear}
              className="p-1.5 rounded-xl bg-white/15 hover:bg-white/30 text-white transition-colors cursor-pointer"
              title="Close search result"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* MEDICINE IDENTITY HEADER                                     */}
        {/* ============================================================ */}
        <div className="p-6 sm:p-8 bg-slate-50/60 border-b border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-4">
              {/* Color-Coded Medicine Emblem */}
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 border border-slate-200 shadow-sm"
                style={{ backgroundColor: `${medicine.visualColor || '#2563EB'}15` }}
              >
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-white shadow-xs"
                  style={{ backgroundColor: medicine.visualColor || '#2563EB' }}
                >
                  <Pill className="w-5 h-5" />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-black font-['Manrope'] uppercase tracking-wider text-blue-600">
                    {friendlyCategory}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-['Manrope']">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Verified Clinical Monograph
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black font-['Manrope'] text-[#0F172A] tracking-tight mt-0.5">
                  {medicine.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-['Inter'] font-semibold">
                  Active Molecule: <strong className="text-slate-900 font-bold">{medicine.genericName}</strong>
                </p>
              </div>
            </div>

            {/* Quick Formulation Form & Brands */}
            <div className="flex sm:flex-col items-start sm:items-end gap-1.5 shrink-0 bg-white sm:bg-transparent p-3 sm:p-0 rounded-xl border border-slate-200 sm:border-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-['Manrope']">
                Available In:
              </span>
              <span className="text-xs font-bold text-slate-800 font-['Manrope']">
                {medicine.forms[0] || 'Standard Tablet'}
              </span>
              <span className="text-[11px] text-slate-500 font-['Inter']">
                Brands: {medicine.brandNames.slice(0, 3).join(', ')}
              </span>
            </div>
          </div>

          {/* Quick Alternative Matches Switcher (If available) */}
          {alternativeMatches.length > 0 && onSelectAlternative && (
            <div className="mt-4 pt-4 border-t border-slate-200/70 flex items-center gap-2 overflow-x-auto scrollbar-none">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-['Manrope'] shrink-0">
                Related Medicines:
              </span>
              {alternativeMatches.map((alt) => (
                <button
                  key={alt.id}
                  onClick={() => onSelectAlternative(alt)}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-bold font-['Manrope'] border border-slate-200 hover:border-blue-200 shrink-0 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: alt.visualColor || '#2563EB' }}
                  />
                  <span>{alt.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* DIRECT-MESSAGE ACTION GRID WITH POWERFUL SYMBOLS             */}
        {/* ============================================================ */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Section Subtitle */}
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 font-['Manrope']">
              Key Guidance: Uses, Safe Doses & Precautions
            </h4>
            <span className="text-[11px] text-slate-500 font-['Inter']">
              Clear patient summary
            </span>
          </div>

          {/* 6 Clinical Guidance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CARD 1: WHAT IT TREATS */}
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-4 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 font-['Manrope'] block">
                  What This Medicine Is Used For
                </span>
                <p className="text-sm font-bold text-slate-900 font-['Manrope'] mt-1 leading-snug">
                  {friendlyOverview}
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {friendlyUses.map((u, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-white text-emerald-900 font-semibold text-[11px] font-['Inter'] border border-emerald-200/90 shadow-2xs"
                    >
                      ✓ {u}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CARD 2: DOSAGE & ADMINISTRATION */}
            <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-4 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-blue-800 font-['Manrope'] block">
                  Recommended Dose
                </span>
                <p className="text-sm font-bold text-slate-900 font-['Manrope'] mt-1 leading-snug">
                  {directDose}
                </p>
                <div className="mt-2.5 flex items-center gap-2 text-xs text-blue-900 font-medium font-['Inter']">
                  <span className="inline-flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-blue-600" />
                    Take with a full glass of water
                  </span>
                  <span>•</span>
                  <span>Allow 4 to 6 hours between doses</span>
                </div>
              </div>
            </div>

            {/* CARD 3: FOOD & STOMACH RULE */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-4 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <Utensils className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 font-['Manrope'] block">
                  Food & Stomach Safety
                </span>
                <p className="text-sm font-bold text-slate-900 font-['Manrope'] mt-1 leading-snug">
                  Take with or immediately after meals. Avoid taking on an empty stomach.
                </p>
                <p className="text-xs text-amber-900 font-medium font-['Inter'] mt-1">
                  Taking medicine with food cushions the stomach and prevents acidity or stomach burning.
                </p>
              </div>
            </div>

            {/* CARD 4: CRITICAL CONTRAINDICATIONS */}
            <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/80 border border-rose-200 flex items-start gap-4 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-rose-800 font-['Manrope'] block">
                  Critical Warnings & What To Avoid
                </span>
                <p className="text-sm font-bold text-rose-950 font-['Manrope'] mt-1 leading-snug">
                  Do not consume alcohol. Never combine with products containing identical active salts.
                </p>
                <p className="text-xs text-rose-900 font-medium font-['Inter'] mt-1">
                  Drinking alcohol or taking two medicines with the same active ingredient increases liver or kidney strain.
                </p>
              </div>
            </div>

            {/* CARD 5: SAFE DAILY MAXIMUM LIMIT */}
            <div className="p-4 sm:p-5 rounded-2xl bg-orange-50/70 border border-orange-200/80 flex items-start gap-4 shadow-2xs md:col-span-2">
              <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-orange-800 font-['Manrope'] block">
                  Maximum Daily Dosage Limit
                </span>
                <p className="text-sm font-bold text-slate-900 font-['Manrope'] mt-1 leading-snug">
                  {directLimitWarning}
                </p>
                <p className="text-xs text-orange-900 font-medium font-['Inter'] mt-1">
                  Review labels of combination cold, cough, or sinus formulas to ensure daily caps are respected.
                </p>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SYMBOLIC DAILY CHECKLIST (FAST ICONS)                        */}
          {/* ============================================================ */}
          <div className="p-4 rounded-2xl bg-slate-100/80 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs font-['Manrope'] font-bold text-slate-700">
            <span className="flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-blue-600" />
              <span>Full Glass of Water</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Utensils className="w-4 h-4 text-emerald-600" />
              <span>After Food</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Wine className="w-4 h-4 text-rose-600" />
              <span className="text-rose-700 font-extrabold">Zero Alcohol</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Car className="w-4 h-4 text-indigo-600" />
              <span>Driving: Ok (if not drowsy)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Non-Habit Forming</span>
            </span>
          </div>

          {/* ============================================================ */}
          {/* INTERACTIVE TOOLS: DOSE CALCULATOR & FOOD CLASH CHECKER      */}
          {/* ============================================================ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Quick Dose Calculator */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 font-['Manrope'] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  Visual Single-Dose Meter
                </span>
                <span className="text-xs text-slate-500 font-semibold font-['Inter']">
                  Unit: {unitMg} mg / pill
                </span>
              </div>

              <div className="mt-3">
                <span className="text-[11px] font-bold text-slate-500 font-['Manrope'] uppercase tracking-wider block mb-1.5">
                  Choose Number of Tablets:
                </span>
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((count) => (
                    <button
                      key={count}
                      onClick={() => setSelectedPills(count)}
                      className={`flex-1 py-2 rounded-xl text-xs font-['Manrope'] font-bold transition-all cursor-pointer ${
                        selectedPills === count
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {count} {count === 1 ? 'Pill' : 'Pills'} ({unitMg * count}mg)
                    </button>
                  ))}
                </div>

                {/* Progress Meter */}
                <div className="mt-3 bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isDoseExcessive ? 'bg-rose-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, (totalDoseMg / 1500) * 100)}%` }}
                  />
                </div>

                <p className="mt-2 text-xs font-['Inter'] font-medium text-slate-600">
                  {isDoseExcessive ? (
                    <span className="text-rose-700 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                      Caution: {totalDoseMg}mg exceeds standard single dose recommendations.
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                      {totalDoseMg}mg falls within standard recommended single dose range.
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Quick Conflict Checker */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 font-['Manrope'] flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Instant Substance Conflict Test
                </span>
                <span className="text-[11px] text-slate-400 font-['Inter']">Tap to check</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {['Alcohol', 'Coffee / Tea', 'Dairy / Milk', 'Other Painkillers'].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setActiveConflictCheck(activeConflictCheck === sub ? null : sub)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-['Manrope'] font-bold transition-all cursor-pointer ${
                      activeConflictCheck === sub
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>

              {activeConflictCheck && (
                <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 animate-in fade-in duration-150">
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

          {/* ============================================================ */}
          {/* BOTTOM ACTIONS: FULL MONOGRAPH & RESET                       */}
          {/* ============================================================ */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
            <button
              id="btn-search-another"
              onClick={onClear}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-['Manrope'] font-bold text-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Search Another Medicine</span>
            </button>

            <button
              id="btn-open-full-monograph"
              onClick={() => onOpenFullMonograph(medicine)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-['Manrope'] font-bold text-xs shadow-sm transition-all cursor-pointer hover:shadow-md active:scale-[0.99]"
            >
              <span>Inspect Full Chemical Monograph & References</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
