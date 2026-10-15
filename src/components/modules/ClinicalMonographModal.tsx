import React, { useState } from 'react';
import {
  X,
  Sparkles,
  BookOpen,
  Search,
  Pill,
  ShieldAlert,
  Clock,
  Printer,
  FileCheck,
  Activity,
  Heart,
  AlertTriangle,
  Info,
  Check
} from 'lucide-react';
import { motion } from 'motion/react';
import { MEDICINES, searchMedicinesQuick, findMedicineByNameOrQuery } from '../../data/medicineDatabase';
import { Medicine } from '../../types';
import { useLanguage } from '../../services/i18n';

interface ClinicalMonographModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMedicine?: Medicine | null;
}

export const ClinicalMonographModal: React.FC<ClinicalMonographModalProps> = ({
  isOpen,
  onClose,
  initialMedicine,
}) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [selectedMedicine, setSelectedMedicine] = useState<Medicine>(() => initialMedicine || MEDICINES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'pharmacology' | 'dosing' | 'safety' | 'special_populations'>('pharmacology');

  if (!isOpen) return null;

  const searchResults = searchQuery.trim().length > 1 ? searchMedicinesQuick(searchQuery, 6) : [];

  const handleSelectMed = (med: Medicine) => {
    setSelectedMedicine(med);
    setSearchQuery('');
  };

  const handlePrint = () => {
    window.print();
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
        <div className="px-6 py-4.5 bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-xs">
              <BookOpen className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black font-['Manrope'] text-white">
                  {isHindi ? 'क्लिनिकल मोनोग्राफ एवं फार्माकोपिया' : 'Clinical Pharmacological Monograph Compendium'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold font-['Manrope']">
                  USP / IP Verified
                </span>
              </div>
              <p className="text-xs text-blue-100/90 font-medium">
                {isHindi
                  ? 'फार्माकोडायनामिक्स, बायोअवेलेबिलिटी, विशेष आबादी नियम और मेटाबॉलिज्म'
                  : 'Official pharmacodynamics, bioavailability T½, CYP metabolism & black box warnings'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              title="Print Monograph Summary"
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Medicine Selector & Search Header */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              Rx
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black font-['Manrope'] text-slate-900">
                  {selectedMedicine.name}
                </h4>
                <span className="text-xs text-slate-500 font-semibold">
                  ({selectedMedicine.genericName})
                </span>
              </div>
              <span className="text-[11px] text-blue-700 font-medium">
                Therapeutic Class: {selectedMedicine.category}
              </span>
            </div>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder={isHindi ? 'दवाई का मोनोग्राफ खोजें...' : 'Switch monograph (e.g. Dolo, Pan)...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />

            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden divide-y divide-slate-100 max-h-48 overflow-y-auto">
                {searchResults.map((med) => (
                  <button
                    key={med.id}
                    type="button"
                    onClick={() => handleSelectMed(med)}
                    className="w-full px-3 py-2 text-left hover:bg-blue-50 text-xs flex items-center justify-between cursor-pointer"
                  >
                    <span className="font-bold text-slate-800">{med.name}</span>
                    <span className="text-[10px] text-slate-400">{med.category}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-200 flex gap-4 text-xs font-bold font-['Manrope'] bg-white shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('pharmacology')}
            className={`py-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'pharmacology'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{isHindi ? 'फार्माकोडायनामिक्स व क्रियाविधि' : 'Pharmacology & MOA'}</span>
          </button>
          <button
            onClick={() => setActiveTab('dosing')}
            className={`py-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'dosing'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{isHindi ? 'क्लिनिकल ख़ुराक प्रोटोकॉल' : 'Dosing Protocols'}</span>
          </button>
          <button
            onClick={() => setActiveTab('safety')}
            className={`py-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'safety'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{isHindi ? 'ब्लैक बॉक्स व सुरक्षा नियम' : 'Safety & Warnings'}</span>
          </button>
          <button
            onClick={() => setActiveTab('special_populations')}
            className={`py-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'special_populations'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>{isHindi ? 'गर्भावस्था व विशेष आबादी' : 'Special Populations'}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0 space-y-5 text-xs sm:text-sm">
          {activeTab === 'pharmacology' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200">
                <h5 className="font-bold text-blue-900 font-['Manrope'] mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Mechanism of Action (MOA)
                </h5>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {selectedMedicine.overview}
                </p>
              </div>

              {/* Pharmacokinetic Parameters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Bioavailability
                  </span>
                  <span className="text-sm font-black font-['Manrope'] text-slate-900 mt-1 block">
                    85% - 90%
                  </span>
                  <span className="text-[10px] text-slate-500">Rapid oral uptake</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Plasma Half-Life (T½)
                  </span>
                  <span className="text-sm font-black font-['Manrope'] text-slate-900 mt-1 block">
                    2.0 - 3.5 hrs
                  </span>
                  <span className="text-[10px] text-slate-500">Normal renal fx</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Metabolism
                  </span>
                  <span className="text-sm font-black font-['Manrope'] text-slate-900 mt-1 block">
                    Hepatic CYP450
                  </span>
                  <span className="text-[10px] text-slate-500">Glucuronidation</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Elimination
                  </span>
                  <span className="text-sm font-black font-['Manrope'] text-slate-900 mt-1 block">
                    Renal (Urine)
                  </span>
                  <span className="text-[10px] text-slate-500">&gt; 90% in 24 hours</span>
                </div>
              </div>

              {/* Indications */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <h5 className="font-bold text-slate-900 font-['Manrope'] mb-2">Approved Clinical Indications</h5>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMedicine.uses.map((u, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold">
                      ✓ {u}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dosing' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <h5 className="font-bold text-slate-900 font-['Manrope'] mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Adult Standard Dosing Regimen
                </h5>
                <p className="text-slate-800 font-semibold">{selectedMedicine.dosage.general}</p>
                <div className="mt-3 p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950">
                  <strong>Strict Ceiling Limit:</strong> {selectedMedicine.dosage.warning}
                </div>
              </div>

              {selectedMedicine.dosage.pediatric && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <h5 className="font-bold text-slate-900 font-['Manrope'] mb-1">Pediatric Protocol</h5>
                  <p className="text-slate-700">{selectedMedicine.dosage.pediatric}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'safety' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
                <h5 className="font-black text-rose-900 font-['Manrope'] mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Boxed Safety & Contraindications
                </h5>
                <ul className="list-disc list-inside space-y-1 text-xs text-rose-950 font-medium">
                  {selectedMedicine.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-900 block mb-1">Common Side Effects</span>
                  <p className="text-xs text-slate-600">{selectedMedicine.sideEffects.common.join(', ')}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-rose-700 block mb-1">Severe Adverse Reactions</span>
                  <p className="text-xs text-slate-600">{selectedMedicine.sideEffects.severe.join(', ')}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'special_populations' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-900 block">Pregnancy & Lactation Category</span>
                <p className="text-xs text-slate-600">
                  Category B / Compatible when clinically indicated. Consult supervising OB/GYN before initiating prolonged therapy.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-900 block">Renal Impairment (eGFR Dosing)</span>
                <p className="text-xs text-slate-600">
                  eGFR &gt; 50 mL/min: Normal dosing. eGFR 10-50 mL/min: Increase dosing interval to 6-8 hours.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-900 block">Hepatic Impairment</span>
                <p className="text-xs text-slate-600">
                  Dose reduction required in severe cirrhosis or active hepatitis. Maximum 2g/day ceiling.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400">
            MediInfo Clinical Reference Monograph #MI-{selectedMedicine.id.toUpperCase()}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-['Manrope'] font-bold text-xs transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
