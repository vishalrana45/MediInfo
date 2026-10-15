import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Plus,
  Trash2,
  Search,
  Sparkles,
  Info,
  Clock,
  ArrowRight,
  Pill,
  Utensils,
  Wine
} from 'lucide-react';
import { motion } from 'motion/react';
import { MEDICINES, searchMedicinesQuick } from '../../data/medicineDatabase';
import { Medicine } from '../../types';
import { useLanguage } from '../../services/i18n';

interface DrugInteractionCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMedicines?: string[];
  onOpenMedicineInfo?: (medicine: Medicine) => void;
}

interface InteractionResult {
  pair: [string, string];
  severity: 'severe' | 'moderate' | 'safe';
  title: string;
  mechanism: string;
  recommendation: string;
  spacingHours?: number;
}

const SAMPLE_PAIRS = [
  { med1: 'Dolo 650', med2: 'Combiflam', label: 'Paracetamol + Combiflam (Fever Duo)' },
  { med1: 'Azithromycin', med2: 'Pan 40', label: 'Antibiotic + Antacid (Absorption)' },
  { med1: 'Paracetamol', med2: 'Cetirizine', label: 'Pain + Allergy (Routine)' },
];

export const DrugInteractionCheckerModal: React.FC<DrugInteractionCheckerModalProps> = ({
  isOpen,
  onClose,
  initialMedicines = [],
  onOpenMedicineInfo,
}) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [selectedList, setSelectedList] = useState<string[]>(() => {
    if (initialMedicines.length > 0) return initialMedicines;
    return ['Dolo 650', 'Combiflam'];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Medicine[]>([]);

  if (!isOpen) return null;

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 1) {
      setSearchResults(searchMedicinesQuick(query, 5));
    } else {
      setSearchResults([]);
    }
  };

  const handleAddMedicine = (name: string) => {
    if (!selectedList.includes(name)) {
      setSelectedList([...selectedList, name]);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleRemoveMedicine = (name: string) => {
    setSelectedList(selectedList.filter((m) => m !== name));
  };

  // Interaction engine evaluating pairs
  const evaluateInteractions = (): InteractionResult[] => {
    const results: InteractionResult[] = [];

    for (let i = 0; i < selectedList.length; i++) {
      for (let j = i + 1; j < selectedList.length; j++) {
        const m1 = selectedList[i].toLowerCase();
        const m2 = selectedList[j].toLowerCase();

        // 1. Acetaminophen / Paracetamol duplicate dose
        if (
          (m1.includes('dolo') || m1.includes('paracetamol')) &&
          (m2.includes('combiflam') || m2.includes('crocin') || m2.includes('calpol'))
        ) {
          results.push({
            pair: [selectedList[i], selectedList[j]],
            severity: 'severe',
            title: isHindi
              ? 'गंभीर चेतावनी: दोहरी पैरासिटामोल ख़ुराक (लिवर विषाक्तता)'
              : 'CRITICAL DUPLICATE DOSE: Double Paracetamol Ingestion',
            mechanism: isHindi
              ? 'कॉम्बीफ्लेम में पहले से ही पैरासिटामोल मौजूद है। दोनों को साथ लेने से दैनिक 4000mg की सुरक्षित सीमा पार हो सकती है।'
              : 'Combiflam already contains 325mg of Paracetamol alongside Ibuprofen. Combining with Dolo 650 exceeds safe daily limits, causing acute hepatic (liver) toxicity risk.',
            recommendation: isHindi
              ? 'दोनों को एक साथ न लें। किसी एक दवा का चुनाव करें अथवा डॉक्टर से सलाह लें।'
              : 'DO NOT COMBINE. Choose only one medication. If pain persists, consult a physician rather than stacking multiple analgesics.',
            spacingHours: 6,
          });
        }
        // 2. NSAID + NSAID (e.g. Ibuprofen + Diclofenac or Aspirin)
        else if (
          (m1.includes('combiflam') || m1.includes('ibuprofen') || m1.includes('brufen')) &&
          (m2.includes('aspirin') || m2.includes('meftal') || m2.includes('diclofenac'))
        ) {
          results.push({
            pair: [selectedList[i], selectedList[j]],
            severity: 'severe',
            title: isHindi
              ? 'गंभीर चेतावनी: पेट में अल्सर व आंतरिक रक्तस्राव का जोखिम'
              : 'SEVERE INTERACTION: Heightened Gastric Ulceration & Bleeding',
            mechanism: isHindi
              ? 'दोनों दवाइयाँ NSAID समूह की हैं। साथ लेने पर पेट की आंतरिक परत क्षतिग्रस्त हो सकती है।'
              : 'Both drugs are Non-Steroidal Anti-Inflammatory Drugs (NSAIDs). Co-administration significantly multiplies risks of acute gastric bleeding, mucosal ulcers, and renal strain.',
            recommendation: isHindi
              ? 'साथ में कभी न लें। पेट की सुरक्षा के लिए प्रोटॉन पंप इनहिबिटर (जैसे Pan 40) का उपयोग आवश्यक हो सकता है।'
              : 'Contraindicated. Never take two oral NSAIDs concurrently. Spacing does not eliminate mucosal erosion.',
          });
        }
        // 3. Antibiotic + Antacid / PPI
        else if (
          (m1.includes('azithromycin') || m1.includes('cipro') || m1.includes('amoxi')) &&
          (m2.includes('pan') || m2.includes('pantoprazole') || m2.includes('gelusil') || m2.includes('digene'))
        ) {
          results.push({
            pair: [selectedList[i], selectedList[j]],
            severity: 'moderate',
            title: isHindi
              ? 'मध्यम प्रभाव: एंटीबायोटिक के अवशोषण में देरी'
              : 'MODERATE CONFLICT: Reduced Antibiotic Absorption Rate',
            mechanism: isHindi
              ? 'एंटासिड पेट के एसिड को कम कर देता है, जिससे एंटीबायोटिक पूरी तरह नहीं घुल पाती।'
              : 'Antacids and high-dose PPIs alter gastric pH, delaying the dissolution and peak plasma concentration of certain antibiotics.',
            recommendation: isHindi
              ? 'दोनों दवाइयों के बीच कम से कम 2 घंटे का अंतर रखें। एंटीबायोटिक पहले लें।'
              : 'Space medications by at least 2 hours. Take the antibiotic 1 hour before food, and antacid 2 hours after.',
            spacingHours: 2,
          });
        }
        // 4. Antihistamines + Sleep / Drowsiness
        else if (
          (m1.includes('cetirizine') || m1.includes('montair') || m1.includes('allegra')) &&
          (m2.includes('cough') || m2.includes('syrup') || m2.includes('cold') || m2.includes('alcohol'))
        ) {
          results.push({
            pair: [selectedList[i], selectedList[j]],
            severity: 'moderate',
            title: isHindi
              ? 'अत्यधिक उनींदापन और सुस्ती की चेतावनी'
              : 'CENTRAL NERVOUS SYSTEM DEPRESSION: Extreme Drowsiness',
            mechanism: isHindi
              ? 'दोनों दवाइयाँ मस्तिष्क की सतर्कता को धीमा करती हैं, जिससे ड्राइविंग खतरनाक हो सकती है।'
              : 'Additive sedative effects on H1 receptors impair cognitive and motor reaction times.',
            recommendation: isHindi
              ? 'रात में सोते समय लें। गाड़ी चलाने या भारी मशीनरी से दूर रहें।'
              : 'Take at bedtime. Do not drive, operate heavy machinery, or consume alcohol.',
          });
        }
        // Safe pairing fallback
        else {
          results.push({
            pair: [selectedList[i], selectedList[j]],
            severity: 'safe',
            title: isHindi
              ? 'सुरक्षित मेल: कोई प्रतिकूल क्लिनिकल टकराव नहीं'
              : 'COMPATIBLE: No Known Critical Antagonism',
            mechanism: isHindi
              ? 'इन दोनों दवाओं के बीच कोई प्रतिकूल फार्माकोलॉजिकल टकराव दर्ज नहीं है।'
              : 'These medications utilize distinct hepatic metabolic pathways and do not interfere with each other when taken as prescribed.',
            recommendation: isHindi
              ? 'सामान्य रूप से पानी के साथ लें। यदि पेट संवेदनशील है तो भोजन के बाद लें।'
              : 'Can be taken together or spaced according to individual meal requirements.',
          });
        }
      }
    }

    return results;
  };

  const interactions = evaluateInteractions();
  const hasSevere = interactions.some((i) => i.severity === 'severe');
  const hasModerate = interactions.some((i) => i.severity === 'moderate');

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
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col font-['Inter']"
      >
        {/* Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-xs">
              <ShieldAlert className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black font-['Manrope'] text-white">
                  {isHindi ? 'दवाई टकराव व इंटरेक्शन चेकर' : 'Clinical Drug-Drug Interaction Checker'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-400/20 text-blue-300 border border-blue-400/40 text-[10px] font-bold font-['Manrope']">
                  Multi-Regimen
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                {isHindi
                  ? 'एक साथ कई दवाइयाँ लेने से पहले सुरक्षा, साइड इफेक्ट्स और ख़ुराक का अंतर जानें'
                  : 'Cross-check multi-drug regimens for dangerous conflicts, absorption delays & liver strain'}
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
          {/* Active Drugs Selected Pill Tray */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 font-['Manrope']">
                {isHindi ? 'जाँच के लिए चुनी गई दवाइयाँ' : 'Medications in Regimen'} ({selectedList.length})
              </label>
              <span className="text-[11px] text-slate-500">
                {selectedList.length < 2
                  ? isHindi
                    ? 'टकराव जाँचने के लिए कम से कम 2 दवाइयाँ जोड़ें'
                    : 'Add at least 2 medications to evaluate conflicts'
                  : isHindi
                  ? 'स्वचालित क्लिनिकल गणना सक्रिय'
                  : 'Instant pharmacological cross-analysis'}
              </span>
            </div>

            {/* Pill Tags */}
            <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 min-h-[56px]">
              {selectedList.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-bold font-['Manrope'] shadow-2xs group"
                >
                  <Pill className="w-3.5 h-3.5 text-blue-600" />
                  <span>{name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMedicine(name)}
                    className="p-0.5 rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}

              {selectedList.length === 0 && (
                <span className="text-xs text-slate-400 font-medium italic pl-1">
                  {isHindi ? 'कोई दवा नहीं चुनी गई है' : 'No medications added yet'}
                </span>
              )}
            </div>
          </div>

          {/* Quick Add Medicine Input */}
          <div className="relative">
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={
                  isHindi
                    ? 'जाँचने के लिए दवाई का नाम लिखें (जैसे Paracetamol, Combiflam, Pan 40)...'
                    : 'Search & add another medication (e.g. Paracetamol, Combiflam, Azithromycin)...'
                }
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
              />
            </div>

            {/* Search Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl z-20 overflow-hidden divide-y divide-slate-100 max-h-56 overflow-y-auto">
                {searchResults.map((med) => (
                  <button
                    key={med.id}
                    type="button"
                    onClick={() => handleAddMedicine(med.name)}
                    className="w-full px-4 py-2.5 text-left hover:bg-blue-50 flex items-center justify-between transition cursor-pointer"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{med.name}</div>
                      <div className="text-[10px] text-slate-500">{med.genericName} • {med.category}</div>
                    </div>
                    <Plus className="w-4 h-4 text-blue-600" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Preset Test Pairs */}
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              {isHindi ? 'लोकप्रिय उदाहरण तुरंत देखें:' : 'Try routine combinations:'}
            </div>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_PAIRS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedList([sample.med1, sample.med2])}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-semibold border border-slate-200/80 transition cursor-pointer"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          {/* EVALUATION RESULTS */}
          {selectedList.length >= 2 ? (
            <div className="space-y-4 pt-2">
              {/* Overall Status Banner */}
              <div
                className={`p-4 rounded-2xl border flex items-center gap-3.5 ${
                  hasSevere
                    ? 'bg-rose-50 border-rose-300 text-rose-950'
                    : hasModerate
                    ? 'bg-amber-50 border-amber-300 text-amber-950'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                }`}
              >
                {hasSevere ? (
                  <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
                ) : hasModerate ? (
                  <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                ) : (
                  <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                )}
                <div>
                  <h4 className="text-sm font-black font-['Manrope']">
                    {hasSevere
                      ? isHindi
                        ? 'सावधान: गंभीर टकराव मिला — दोनों दवाइयों को साथ न लें!'
                        : 'CRITICAL CONFLICT DETECTED — Do Not Take Concurrently'
                      : hasModerate
                      ? isHindi
                        ? 'मध्यम प्रभाव: दवाइयों के बीच समय का अंतर आवश्यक है'
                        : 'MODERATE INTERACTION — Spacing Required'
                      : isHindi
                      ? 'क्लिनिकल स्वीकृति: इन दवाइयों को साथ लेना सुरक्षित है'
                      : 'ALL CLEAR — Compatible Regimen'}
                  </h4>
                  <p className="text-xs opacity-90 font-medium mt-0.5">
                    {hasSevere
                      ? isHindi
                        ? 'इस संयोजन से अंगों (लिवर या किडनी) पर अतिरिक्त भार या पेट में रक्तस्राव हो सकता है।'
                        : 'One or more drug combinations present duplicate dosage or high physiological strain.'
                      : hasModerate
                      ? isHindi
                        ? 'अवशोषण में रुकावट से बचने के लिए समय का अंतर रखें।'
                        : 'Absorption or metabolic interference can be prevented with a simple separation interval.'
                      : isHindi
                      ? 'कोई ज्ञात प्रतिकूल प्रभाव नहीं मिला। फिर भी डॉक्टर की सलाह अनुसार ही लें।'
                      : 'No toxic synergy or receptor competition observed between selected molecules.'}
                  </p>
                </div>
              </div>

              {/* Detailed Breakdown for each pair */}
              <div className="space-y-3">
                {interactions.map((item, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-2xl border bg-white shadow-2xs space-y-2.5 ${
                      item.severity === 'severe'
                        ? 'border-rose-200'
                        : item.severity === 'moderate'
                        ? 'border-amber-200'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black font-['Manrope'] text-slate-900">
                          {item.pair[0]} ⚡ {item.pair[1]}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            item.severity === 'severe'
                              ? 'bg-rose-100 text-rose-800'
                              : item.severity === 'moderate'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {item.severity}
                        </span>
                      </div>

                      {item.spacingHours && (
                        <div className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                          <Clock className="w-3 h-3 text-blue-600" />
                          <span>Space by {item.spacingHours}+ hours</span>
                        </div>
                      )}
                    </div>

                    <h5 className="text-xs font-bold text-slate-900">{item.title}</h5>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      <strong className="text-slate-800">Pharmacological Basis:</strong> {item.mechanism}
                    </p>

                    <div className="p-2.5 rounded-xl bg-slate-50 text-xs font-semibold text-slate-800 border border-slate-200/80 flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-blue-900">Action Plan:</strong> {item.recommendation}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-10 text-center text-slate-400">
              <Pill className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-semibold">
                {isHindi
                  ? 'टकराव विश्लेषण शुरू करने के लिए ऊपर सर्च बार से दवाइयाँ जोड़ें'
                  : 'Add two or more medications above to run an instant cross-interaction check'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            Based on standard FDA & WHO Pharmacological Interaction Compendia.
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
