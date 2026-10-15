import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Pill, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  HeartPulse, 
  Layers, 
  Sparkles,
  ArrowRight,
  Clock,
  Thermometer,
  Brain,
  Stethoscope
} from 'lucide-react';
import { Medicine } from '../types';

interface KnowYourMedicineProps {
  onSelectSampleMedicine?: (medName: string) => void;
  onOpenInteractionChecker?: () => void;
  onOpenSafetyGuide?: () => void;
}

export const KnowYourMedicineSection: React.FC<KnowYourMedicineProps> = ({
  onSelectSampleMedicine,
  onOpenInteractionChecker,
  onOpenSafetyGuide,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'safety' | 'clinical' | 'interactions'>('all');

  const capabilities = [
    {
      id: 'dosage-safety',
      category: 'safety',
      icon: ShieldCheck,
      badge: 'Precise Dosage Safeguards',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      title: 'Clinical Dosage & Overdose Safeguards',
      description: 'MediInfo doesn\'t just name the pill—it calculates and highlights critical safe maximum daily allowances, weight-adjusted pediatric boundaries, and vital liver/kidney toxicity limits to protect against dangerous accidental overdose.',
      keyTakeaways: [
        'Adult daily therapeutic ceilings (e.g., 4000mg Paracetamol limit)',
        'Pediatric weight-adjusted mg/kg dosing formulas',
        'Specific clinical alerts for chronic renal or hepatic impairment'
      ],
      sampleQuery: 'Paracetamol',
      pillColor: '#2563EB',
    },
    {
      id: 'interactions-check',
      category: 'interactions',
      icon: AlertTriangle,
      badge: 'Multi-Drug Interactions',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      title: 'Cross-Medication Interaction Warnings',
      description: 'Find out if your medicine conflicts with blood thinners, hypertension prescriptions, alcohol, or other OTC remedies before swallowing. Prevent severe pharmacological clashes like dual NSAID stomach ulcers or bleeding risks.',
      keyTakeaways: [
        'Contraindications with anticoagulants (Warfarin, Aspirin)',
        'Hidden active ingredient compounding (e.g. cold flu syrups + Tylenol)',
        'Food & beverage clashes (grapefruit juice, alcohol, dairy)'
      ],
      sampleQuery: 'Ibuprofen',
      pillColor: '#EA580C',
    },
    {
      id: 'side-effects',
      category: 'clinical',
      icon: HeartPulse,
      badge: 'Two-Tier Side Effects',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      title: 'Common vs. Emergency Red-Flag Side Effects',
      description: 'Clearly distinguishes mild, expected transient symptoms (drowsiness, mild nausea) from critical adverse emergency indicators (angioedema, Stevens-Johnson syndrome, anaphylaxis) so you know when to call a doctor.',
      keyTakeaways: [
        'Expected common symptoms with management tips',
        'Emergency red-flag symptom recognition protocols',
        'Black-box regulatory warnings highlighted upfront'
      ],
      sampleQuery: 'Amoxicillin',
      pillColor: '#059669',
    },
    {
      id: 'indications-uses',
      category: 'clinical',
      icon: FileText,
      badge: 'Verified Clinical Uses',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      title: 'Evidence-Based Indications & Off-Label Uses',
      description: 'Understand exactly what a medication treats according to approved medical compendia—from acute bacterial infections and neuropathic pain to pediatric allergic rhinitis and chronic acid reflux.',
      keyTakeaways: [
        'Official FDA / WHO approved therapeutic indications',
        'Common secondary therapeutic applications',
        'Prescription vs. OTC distinction and guidance'
      ],
      sampleQuery: 'Cetirizine',
      pillColor: '#7C3AED',
    },
    {
      id: 'storage-preservation',
      category: 'safety',
      icon: Thermometer,
      badge: 'Stability & Storage Rules',
      badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      title: 'Physical Preservation & Potency Safeguards',
      description: 'Mishandling medicine in steamy bathrooms or warm cars destroys molecular efficacy. MediInfo specifies exact temperature zones, moisture sensitivity, light shields, and safe disposal instructions.',
      keyTakeaways: [
        'Strict thermal thresholds (e.g., store below 25°C / refrigerated)',
        'Blister foil integrity and moisture-barrier instructions',
        'Safe childproof containment and household disposal protocols'
      ],
      sampleQuery: 'Omeprazole',
      pillColor: '#0284C7',
    },
    {
      id: 'global-cross-reference',
      category: 'clinical',
      icon: Layers,
      badge: 'Authoritative Compendia',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      title: 'Cross-Referenced Against Global Standards',
      description: 'Every monograph is indexed against the FDA Orange Book, WHO Essential Medicines Formulary, and British National Formulary (BNF), providing healthcare-grade information with zero commercial bias or advertising.',
      keyTakeaways: [
        'U.S. FDA National Drug Code & OTC Monograph references',
        'World Health Organization Essential Medicines validation',
        'Independent, unbiased clinical guidance with zero ads'
      ],
      sampleQuery: 'Metformin',
      pillColor: '#475569',
    }
  ];

  const filteredCapabilities = activeTab === 'all' 
    ? capabilities 
    : capabilities.filter(c => c.category === activeTab);

  return (
    <section id="know-your-medicine-section" className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-18">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-[#2563EB] text-xs font-bold font-['Manrope'] mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>More Than Just An Identifier</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Manrope'] text-[#0F172A] tracking-tight">
          From Prescription to Protection.
        </h2>
        <p className="mt-3 text-base sm:text-lg text-[#64748B] font-['Inter'] leading-relaxed max-w-2xl mx-auto">
          Identification is only step one. MediInfo delivers a complete clinical intelligence ecosystem—analyzing dosages, dangerous drug interactions, prescription schedules, and verified safety guidelines.
        </p>

        {/* Filter Pills */}
        <div className="mt-6 inline-flex p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/70 gap-1 text-xs font-['Manrope'] font-bold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'all'
                ? 'bg-white text-[#2563EB] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Capabilities
          </button>
          <button
            onClick={() => setActiveTab('safety')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'safety'
                ? 'bg-white text-[#2563EB] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dosage & Safety
          </button>
          <button
            onClick={() => setActiveTab('interactions')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'interactions'
                ? 'bg-white text-[#2563EB] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Drug Interactions
          </button>
          <button
            onClick={() => setActiveTab('clinical')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'clinical'
                ? 'bg-white text-[#2563EB] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Clinical Formularies
          </button>
        </div>
      </div>

      {/* Grid of Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCapabilities.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] hover:shadow-[0_12px_32px_-6px_rgba(15,23,42,0.09)] hover:border-blue-200 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Header Icon + Category Badge */}
                <div className="flex items-center justify-between gap-2 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-center justify-center text-[#2563EB] group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border font-['Manrope'] ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold font-['Manrope'] text-[#0F172A] mb-2.5 group-hover:text-[#2563EB] transition-colors leading-snug">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#64748B] font-['Inter'] leading-relaxed mb-5">
                  {item.description}
                </p>

                {/* Key Takeaways Checklist */}
                <div className="space-y-2 pt-2 border-t border-slate-100 mb-6">
                  {item.keyTakeaways.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-['Inter']">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB] shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Quick-Action Link */}
              {onSelectSampleMedicine && (
                <button
                  onClick={() => onSelectSampleMedicine(item.sampleQuery)}
                  className="w-full pt-3 pb-1 border-t border-slate-100 flex items-center justify-between text-xs font-bold font-['Manrope'] text-[#2563EB] hover:text-blue-700 transition-colors"
                >
                  <span>See in {item.sampleQuery} profile</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive Clinical Safety Banner Card */}
      <div className="mt-8 bg-gradient-to-r from-blue-900 via-[#1E40AF] to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold mb-3">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Physician-Reviewed Architecture</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black font-['Manrope'] tracking-tight text-white leading-tight">
            Designed to prevent medication errors before they happen.
          </h3>
          <p className="mt-3 text-sm text-blue-100/90 font-['Inter'] leading-relaxed">
            Over 1.5 million preventable medication adverse reactions happen every year. MediInfo combines computer vision with clinical compendium intelligence to help patients, caregivers, and medical staff confirm what they are taking, why they are taking it, and how to stay safe.
          </p>
        </div>
      </div>
    </section>
  );
};
