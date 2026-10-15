import React, { useState } from 'react';
import {
  X,
  Repeat,
  Check,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Utensils,
  Wine,
  Search,
  Plus,
  ArrowRight,
  Pill,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';
import { MEDICINES, searchMedicinesQuick, findMedicineByNameOrQuery } from '../../data/medicineDatabase';
import { Medicine } from '../../types';
import { useLanguage } from '../../services/i18n';

interface MedicineComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMedicine1?: string;
  initialMedicine2?: string;
  onViewMonograph?: (medicine: Medicine) => void;
}

export const MedicineComparisonModal: React.FC<MedicineComparisonModalProps> = ({
  isOpen,
  onClose,
  initialMedicine1 = 'Paracetamol',
  initialMedicine2 = 'Combiflam',
  onViewMonograph,
}) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [med1Name, setMed1Name] = useState(initialMedicine1);
  const [med2Name, setMed2Name] = useState(initialMedicine2);
  const [activeSearchSlot, setActiveSearchSlot] = useState<1 | 2 | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const med1 = findMedicineByNameOrQuery(med1Name) || MEDICINES[0];
  const med2 = findMedicineByNameOrQuery(med2Name) || MEDICINES[1];

  const searchResults = searchQuery.trim().length > 1 ? searchMedicinesQuick(searchQuery, 5) : [];

  const handleSelectMedicine = (slot: 1 | 2, name: string) => {
    if (slot === 1) setMed1Name(name);
    else setMed2Name(name);
    setActiveSearchSlot(null);
    setSearchQuery('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col font-['Inter']"
      >
        {/* Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-xs">
              <Repeat className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black font-['Manrope'] text-white">
                  {isHindi ? 'दवाइयों की तुलना एवं जेनरिक विकल्प' : 'Clinical Medicine Comparison & Bioequivalence'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-400/20 text-blue-300 border border-blue-400/40 text-[10px] font-bold font-['Manrope']">
                  Side-by-Side
                </span>
              </div>
              <p className="text-xs text-blue-100/90 font-medium">
                {isHindi
                  ? 'असर की गति, पेट की सुरक्षा, साइड इफेक्ट्स और लागत दक्षता की तुलना करें'
                  : 'Compare speed of relief, gastric safety, contraindications, and generic cost tiers'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0 space-y-6">
          {/* Quick Selection Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Slot 1 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-['Manrope']">
                  Option 1
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveSearchSlot(1);
                    setSearchQuery('');
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Change</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                  A
                </div>
                <div>
                  <h4 className="text-base font-extrabold font-['Manrope'] text-slate-900">{med1.name}</h4>
                  <p className="text-xs text-slate-500">{med1.genericName} • {med1.category}</p>
                </div>
              </div>

              {/* Slot 1 Dropdown */}
              {activeSearchSlot === 1 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl z-30 p-3">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search replacement medicine..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="max-h-40 overflow-y-auto divide-y divide-slate-100">
                    {searchResults.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleSelectMedicine(1, m.name)}
                        className="w-full py-2 px-2 text-left text-xs font-semibold text-slate-800 hover:bg-blue-50 flex items-center justify-between cursor-pointer"
                      >
                        <span>{m.name}</span>
                        <span className="text-[10px] text-slate-400">{m.category}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Slot 2 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-['Manrope']">
                  Option 2
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveSearchSlot(2);
                    setSearchQuery('');
                  }}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Change</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                  B
                </div>
                <div>
                  <h4 className="text-base font-extrabold font-['Manrope'] text-slate-900">{med2.name}</h4>
                  <p className="text-xs text-slate-500">{med2.genericName} • {med2.category}</p>
                </div>
              </div>

              {/* Slot 2 Dropdown */}
              {activeSearchSlot === 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl z-30 p-3">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search replacement medicine..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="max-h-40 overflow-y-auto divide-y divide-slate-100">
                    {searchResults.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleSelectMedicine(2, m.name)}
                        className="w-full py-2 px-2 text-left text-xs font-semibold text-slate-800 hover:bg-blue-50 flex items-center justify-between cursor-pointer"
                      >
                        <span>{m.name}</span>
                        <span className="text-[10px] text-slate-400">{m.category}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SIDE BY SIDE CLINICAL COMPARISON MATRIX */}
          <div className="border border-slate-200 rounded-3xl overflow-hidden shadow-xs divide-y divide-slate-200 text-xs sm:text-sm">
            {/* Row 1: Active Substance & Mechanism */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-white">
              <div className="p-3.5 sm:p-4 bg-slate-50 font-bold text-slate-800 flex items-center gap-2">
                <Pill className="w-4 h-4 text-blue-600" />
                <span>{isHindi ? 'सक्रिय घटक एवं समूह' : 'Active Generic & Class'}</span>
              </div>
              <div className="p-3.5 sm:p-4 text-slate-800">
                <span className="font-bold block text-slate-900">{med1.genericName}</span>
                <span className="text-xs text-slate-500">{med1.category}</span>
              </div>
              <div className="p-3.5 sm:p-4 text-slate-800">
                <span className="font-bold block text-slate-900">{med2.genericName}</span>
                <span className="text-xs text-slate-500">{med2.category}</span>
              </div>
            </div>

            {/* Row 2: Conditions Treated & Best For */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-white">
              <div className="p-3.5 sm:p-4 bg-slate-50 font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{isHindi ? 'प्रमुख उपयोग' : 'Primary Uses'}</span>
              </div>
              <div className="p-3.5 sm:p-4 text-slate-700">
                <div className="flex flex-wrap gap-1">
                  {med1.uses.slice(0, 3).map((u, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 text-[11px] font-semibold">
                      {u}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-3.5 sm:p-4 text-slate-700">
                <div className="flex flex-wrap gap-1">
                  {med2.uses.slice(0, 3).map((u, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 text-[11px] font-semibold">
                      {u}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 3: Speed of Action & Dosage Interval */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-white">
              <div className="p-3.5 sm:p-4 bg-slate-50 font-bold text-slate-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>{isHindi ? 'असर की गति व ख़ुराक' : 'Dosing & Timing'}</span>
              </div>
              <div className="p-3.5 sm:p-4 text-slate-700 leading-snug">
                <span className="font-semibold block text-slate-900">{med1.dosage.general}</span>
                <span className="text-[11px] text-slate-500 mt-1 block">Allow 4-6 hours between doses.</span>
              </div>
              <div className="p-3.5 sm:p-4 text-slate-700 leading-snug">
                <span className="font-semibold block text-slate-900">{med2.dosage.general}</span>
                <span className="text-[11px] text-slate-500 mt-1 block">Allow 6-8 hours between doses.</span>
              </div>
            </div>

            {/* Row 4: Stomach & Gastric Safety */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-white">
              <div className="p-3.5 sm:p-4 bg-slate-50 font-bold text-slate-800 flex items-center gap-2">
                <Utensils className="w-4 h-4 text-emerald-600" />
                <span>{isHindi ? 'पेट की सुरक्षा' : 'Stomach Tolerability'}</span>
              </div>
              <div className="p-3.5 sm:p-4 text-slate-700">
                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded">
                  <Check className="w-3.5 h-3.5" /> Gentle on empty stomach
                </span>
                <p className="text-[11px] text-slate-500 mt-1">Rarely causes gastric acidity.</p>
              </div>
              <div className="p-3.5 sm:p-4 text-slate-700">
                <span className="inline-flex items-center gap-1 text-amber-800 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded">
                  <AlertTriangle className="w-3.5 h-3.5" /> Must take AFTER food
                </span>
                <p className="text-[11px] text-slate-500 mt-1">Can cause heartburn or stomach ulcers if taken empty.</p>
              </div>
            </div>

            {/* Row 5: Alcohol Caution */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-white">
              <div className="p-3.5 sm:p-4 bg-slate-50 font-bold text-slate-800 flex items-center gap-2">
                <Wine className="w-4 h-4 text-rose-600" />
                <span>{isHindi ? 'शराब संबंधी नियम' : 'Alcohol Conflict'}</span>
              </div>
              <div className="p-3.5 sm:p-4 text-slate-700">
                <span className="text-xs font-bold text-rose-700">Strictly Avoid Alcohol</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Accelerates toxic byproduct accumulation in liver.</p>
              </div>
              <div className="p-3.5 sm:p-4 text-slate-700">
                <span className="text-xs font-bold text-rose-700">High Ulcer & Bleeding Risk</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Multiplies gastric irritation and bleeding.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons to View Monograph */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {onViewMonograph && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onViewMonograph(med1);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Monograph: {med1.name}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
              {onViewMonograph && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onViewMonograph(med2);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Monograph: {med2.name}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold font-['Manrope'] transition cursor-pointer"
            >
              Done Comparing
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
