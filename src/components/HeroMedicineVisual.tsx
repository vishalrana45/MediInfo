import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, CheckCircle2, AlertCircle, Scan, Sparkles } from 'lucide-react';

interface MedicinePreviewData {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  category: string;
  packageType: string;
  ndc: string;
  safeLimit: string;
  interactionStatus: string;
  colorTheme: string;
  badgeBg: string;
  badgeText: string;
  pillShape: 'caplet' | 'capsule' | 'round';
  pillColor: string;
  pillSubColor?: string;
  keyUse: string;
}

const PREVIEW_MEDS: MedicinePreviewData[] = [
  {
    id: 'paracetamol',
    name: 'Paracetamol IP',
    genericName: 'Acetaminophen 500 mg',
    dosage: '500 mg Film-Coated',
    category: 'Analgesic & Antipyretic',
    packageType: 'Blister Pack (10 Tablets)',
    ndc: 'NDC 50090-0024-1',
    safeLimit: 'Max 4,000 mg / 24 hrs',
    interactionStatus: 'No Severe Conflict Detected',
    colorTheme: 'from-blue-600 to-indigo-600',
    badgeBg: 'bg-blue-50 border-blue-200 text-blue-700',
    badgeText: 'PAIN & FEVER',
    pillShape: 'caplet',
    pillColor: '#F8FAFC',
    keyUse: 'Relief of headache, muscle aches, and fever reduction',
  },
  {
    id: 'amoxicillin',
    name: 'Amoxicillin Trihydrate',
    genericName: 'Amoxicillin 500 mg',
    dosage: '500 mg Capsule',
    category: 'Penicillin-Class Antibiotic',
    packageType: 'Unit Dose Blister (21 Capsules)',
    ndc: 'NDC 00093-3109-01',
    safeLimit: 'Take full course as prescribed',
    interactionStatus: 'Oral Contraceptives Caution',
    colorTheme: 'from-amber-600 to-orange-600',
    badgeBg: 'bg-amber-50 border-amber-200 text-amber-700',
    badgeText: 'ANTIBIOTIC',
    pillShape: 'capsule',
    pillColor: '#DC2626',
    pillSubColor: '#F59E0B',
    keyUse: 'Bacterial infections of the respiratory tract, ear, and throat',
  },
  {
    id: 'cetirizine',
    name: 'Cetirizine HCl',
    genericName: 'Cetirizine 10 mg',
    dosage: '10 mg Oral Tablet',
    category: 'Second-Gen Antihistamine',
    packageType: 'Blister Card (30 Tablets)',
    ndc: 'NDC 50580-726-30',
    safeLimit: 'Max 10 mg / 24 hrs (1 tablet)',
    interactionStatus: 'Avoid mixing with Sedatives',
    colorTheme: 'from-emerald-600 to-teal-600',
    badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    badgeText: 'ALLERGY RELIEF',
    pillShape: 'round',
    pillColor: '#FFFFFF',
    keyUse: '24-hour relief from seasonal allergic rhinitis, sneezing, and hives',
  },
];

export const HeroMedicineVisual: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const current = PREVIEW_MEDS[selectedIndex];

  return (
    <div className="relative w-full max-w-[540px] mx-auto select-none">
      {/* Ambient background glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-blue-100/60 via-indigo-50/40 to-slate-100/50 rounded-3xl blur-2xl -z-10" />

      {/* Main Inspection Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_12px_40px_-12px_rgba(15,23,42,0.1)] overflow-hidden">
        {/* Top Scanner HUD Bar */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-bold font-['Manrope'] tracking-wider uppercase text-slate-200">
              Optical Medicine Identifier
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold font-['Manrope'] border border-emerald-500/30">
            <Sparkles className="w-3 h-3" />
            <span>99.4% Match</span>
          </div>
        </div>

        {/* Realistic Packaging & Scanning Display */}
        <div className="p-6 sm:p-7 bg-gradient-to-b from-slate-50/70 to-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {/* Medicine Packaging Simulation Box */}
              <div className="relative p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-hidden">
                {/* Optical Reticle Target Corners */}
                <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-blue-500" />
                <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-blue-500" />
                <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-blue-500" />
                <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-blue-500" />

                {/* Packaging Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className={`inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border tracking-wider font-['Manrope'] ${current.badgeBg}`}>
                      {current.badgeText}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] font-['Manrope'] mt-1 tracking-tight">
                      {current.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-slate-500 font-['Inter']">
                      {current.genericName}
                    </p>
                  </div>

                  {/* Realistic Pill Graphic Indicator */}
                  <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0 shadow-inner">
                    {current.pillShape === 'caplet' && (
                      <div
                        className="w-11 h-5 rounded-full border border-slate-300 shadow-md relative flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(180deg, #FFFFFF 0%, #E2E8F0 100%)',
                        }}
                      >
                        {/* Score line */}
                        <div className="w-[1px] h-full bg-slate-300/80" />
                      </div>
                    )}
                    {current.pillShape === 'capsule' && (
                      <div className="w-11 h-5 rounded-full border border-slate-300 shadow-md flex overflow-hidden">
                        <div className="w-1/2 h-full bg-red-600" />
                        <div className="w-1/2 h-full bg-amber-400" />
                      </div>
                    )}
                    {current.pillShape === 'round' && (
                      <div
                        className="w-7 h-7 rounded-full border border-slate-300 shadow-md relative flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%)',
                        }}
                      >
                        <div className="w-full h-[1px] bg-slate-300/80" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Packaging Sub-Details */}
                <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] font-['Inter'] text-slate-500">
                  <div>
                    <span className="text-slate-400 font-medium">Packaging:</span>{' '}
                    <strong className="text-slate-700 font-semibold">{current.packageType}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 font-medium">Registry:</span>{' '}
                    <strong className="text-slate-700 font-semibold">{current.ndc}</strong>
                  </div>
                </div>
              </div>

              {/* Verified Clinical Parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 font-['Manrope'] block">
                      Daily Safe Limit
                    </span>
                    <span className="text-xs font-bold text-slate-800 font-['Inter'] truncate block">
                      {current.safeLimit}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-100 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 font-['Manrope'] block">
                      Interactions Status
                    </span>
                    <span className="text-xs font-bold text-slate-800 font-['Inter'] truncate block">
                      {current.interactionStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actionable Medical Usage note */}
              <p className="text-xs text-slate-500 font-['Inter'] bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 leading-relaxed">
                <strong className="text-slate-700 font-semibold font-['Manrope']">Key Indication: </strong>
                {current.keyUse}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Interactive Sample Picker Tabs */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-['Manrope'] hidden sm:inline">
            Interactive Samples:
          </span>
          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-end">
            {PREVIEW_MEDS.map((med, idx) => (
              <button
                key={med.id}
                onClick={() => setSelectedIndex(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-['Manrope'] transition-all cursor-pointer ${
                  selectedIndex === idx
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {med.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
