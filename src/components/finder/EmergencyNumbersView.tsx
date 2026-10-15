import React, { useState } from 'react';
import {
  Phone,
  ShieldAlert,
  AlertTriangle,
  HeartPulse,
  LifeBuoy,
  Stethoscope,
  Copy,
  Check,
  Globe,
  Info,
  ExternalLink,
} from 'lucide-react';
import {
  EMERGENCY_REGIONS_DATA,
  EmergencyContact,
  RegionEmergencyData,
} from '../../data/emergencyContacts';

interface EmergencyNumbersViewProps {
  defaultRegionId?: string;
  compact?: boolean;
}

export const EmergencyNumbersView: React.FC<EmergencyNumbersViewProps> = ({
  defaultRegionId = 'us-ca',
  compact = false,
}) => {
  const [selectedRegionId, setSelectedRegionId] = useState(defaultRegionId);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [symptomFilter, setSymptomFilter] = useState<'all' | 'trauma' | 'poison' | 'crisis' | 'nurse'>('all');

  const currentRegion =
    EMERGENCY_REGIONS_DATA.find((r) => r.regionId === selectedRegionId) ||
    EMERGENCY_REGIONS_DATA[0];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredContacts = currentRegion.contacts.filter((c) => {
    if (symptomFilter === 'all') return true;
    if (symptomFilter === 'trauma') return c.category === 'emergency';
    if (symptomFilter === 'poison') return c.category === 'poison' || c.category === 'substance';
    if (symptomFilter === 'crisis') return c.category === 'crisis';
    if (symptomFilter === 'nurse') return c.category === 'nurse';
    return true;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'emergency':
        return <ShieldAlert className="w-5 h-5 text-red-600" />;
      case 'poison':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'crisis':
        return <HeartPulse className="w-5 h-5 text-purple-600" />;
      case 'nurse':
        return <Stethoscope className="w-5 h-5 text-blue-600" />;
      default:
        return <LifeBuoy className="w-5 h-5 text-emerald-600" />;
    }
  };

  const getCategoryBorder = (category: string) => {
    switch (category) {
      case 'emergency':
        return 'border-red-200 bg-red-50/40 hover:border-red-300';
      case 'poison':
        return 'border-amber-200 bg-amber-50/40 hover:border-amber-300';
      case 'crisis':
        return 'border-purple-200 bg-purple-50/40 hover:border-purple-300';
      case 'nurse':
        return 'border-blue-200 bg-blue-50/40 hover:border-blue-300';
      default:
        return 'border-emerald-200 bg-emerald-50/40 hover:border-emerald-300';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Bar: Region Selector & Symptom Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-slate-500 shrink-0" />
          <span className="text-xs font-bold text-slate-700 font-['Manrope']">Country / Region:</span>
          <select
            value={selectedRegionId}
            onChange={(e) => setSelectedRegionId(e.target.value)}
            className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {EMERGENCY_REGIONS_DATA.map((reg) => (
              <option key={reg.regionId} value={reg.regionId}>
                {reg.flag} {reg.regionName}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Triage Buttons */}
        <div className="flex items-center flex-wrap gap-1.5 text-xs">
          <span className="text-slate-400 text-xs font-semibold font-['Manrope'] whitespace-nowrap mr-0.5">Filter:</span>
          <button
            onClick={() => setSymptomFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-['Manrope'] font-semibold transition cursor-pointer whitespace-nowrap ${
              symptomFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSymptomFilter('trauma')}
            className={`px-2.5 py-1 rounded-lg font-['Manrope'] font-semibold transition cursor-pointer whitespace-nowrap ${
              symptomFilter === 'trauma'
                ? 'bg-red-600 text-white'
                : 'bg-white hover:bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            Trauma / 911
          </button>
          <button
            onClick={() => setSymptomFilter('poison')}
            className={`px-2.5 py-1 rounded-lg font-['Manrope'] font-semibold transition cursor-pointer whitespace-nowrap ${
              symptomFilter === 'poison'
                ? 'bg-amber-600 text-white'
                : 'bg-white hover:bg-amber-50 text-amber-800 border border-amber-200'
            }`}
          >
            Pill Overdose
          </button>
          <button
            onClick={() => setSymptomFilter('crisis')}
            className={`px-2.5 py-1 rounded-lg font-['Manrope'] font-semibold transition cursor-pointer whitespace-nowrap ${
              symptomFilter === 'crisis'
                ? 'bg-purple-600 text-white'
                : 'bg-white hover:bg-purple-50 text-purple-800 border border-purple-200'
            }`}
          >
            Mental Crisis (988)
          </button>
        </div>
      </div>

      {/* EMERGENCY NUMBERS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${getCategoryBorder(
              contact.category
            )}`}
          >
            <div>
              {/* Header: Category Badge + Availability */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/80 border border-slate-200/80 text-slate-700">
                  {getCategoryIcon(contact.category)}
                  <span>{contact.badge}</span>
                </span>
                <span className="text-[11px] font-medium text-slate-500 bg-white/60 px-2 py-0.5 rounded-md">
                  {contact.availability}
                </span>
              </div>

              {/* Contact Name & Phone Display */}
              <h4 className="text-base font-bold font-['Manrope'] text-slate-900 leading-snug">
                {contact.name}
              </h4>
              <p className="text-xs text-slate-600 font-['Inter'] mt-1 leading-relaxed">
                {contact.description}
              </p>
            </div>

            {/* Bottom Actions: Big Call Button + Copy */}
            <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between gap-2">
              <a
                href={`tel:${contact.rawPhone}`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-['Manrope'] font-bold text-sm shadow-xs transition active:scale-98"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Call {contact.number}</span>
              </a>

              <button
                onClick={() => handleCopy(contact.id, contact.number)}
                title="Copy phone number"
                className="p-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer shrink-0"
              >
                {copiedId === contact.id ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Clear Guidance Card */}
      <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-blue-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>When in doubt:</strong> If someone is unresponsive, choking, experiencing severe breathing difficulty, sudden speech slurring, or chest pressure, always dial <strong>{currentRegion.contacts[0]?.number || '911'}</strong> first. For accidental poisonings or medication overdoses where the person is conscious, call <strong>Poison Control ({currentRegion.contacts[1]?.number || '1-800-222-1222'})</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
