import React from 'react';
import {
  Droplet,
  Heart,
  Truck,
  Activity,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Clock,
  Timer
} from 'lucide-react';
import { HospitalBloodInventory, HospitalOrganListing } from '../../types';
import { useLanguage } from '../../services/i18n';

interface HospitalBloodOrganCardProps {
  bloodInventories: HospitalBloodInventory[];
  organListings: HospitalOrganListing[];
  onOpenBloodOrganModal: (tab?: 'blood' | 'organs' | 'transfers' | 'manage') => void;
}

export const HospitalBloodOrganCard: React.FC<HospitalBloodOrganCardProps> = ({
  bloodInventories,
  organListings,
  onOpenBloodOrganModal,
}) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const totalBloodUnits = bloodInventories.reduce((acc, h) => {
    return acc + Object.values(h.bloodUnits).reduce((sum, item) => sum + item.units, 0);
  }, 0);

  const availableOrgans = organListings.filter((o) => o.status === 'available');

  const criticalHospitals = bloodInventories.filter((h) => {
    return (h.bloodUnits['O-']?.units || 0) < 10 || (h.bloodUnits['AB-']?.units || 0) < 5;
  });

  const nextExpiringOrgan = organListings.slice().sort((a, b) => a.coldIschemiaRemainingMinutes - b.coldIschemiaRemainingMinutes)[0];

  return (
    <div
      id="card-hospital-blood-organ-network"
      onClick={() => onOpenBloodOrganModal('blood')}
      className="group relative overflow-hidden bg-gradient-to-br from-white via-rose-50/30 to-amber-50/40 rounded-3xl border border-rose-200/90 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
    >
      <div className="space-y-4">
        {/* Top Pill Tag */}
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold font-['Manrope']">
            <Droplet className="w-3.5 h-3.5 text-rose-600 fill-rose-600/30" />
            <span>{isHindi ? 'अस्पताल रक्त एवं अंग नेटवर्क' : 'Hospital Blood & Organ Network'}</span>
            <span className="text-rose-300">|</span>
            <span className="text-rose-800 font-semibold">{bloodInventories.length} Hospitals Connected</span>
          </div>

          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Real-Time Sync</span>
          </span>
        </div>

        {/* Title & Desc */}
        <div>
          <h3 className="text-xl sm:text-2xl font-black font-['Manrope'] text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Heart className="w-5 h-5 fill-white/20" />
            </div>
            <span>{isHindi ? 'रक्त एवं अंग उपलब्धता ट्रैकर' : 'Blood & Organ Availability Registry'}</span>
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            {isHindi
              ? 'देखें पास और दूर के सभी अस्पतालों में कौन-सा ब्लड ग्रुप कितना उपलब्ध है, दुर्लभ बॉम्बे ग्रुप, और प्रत्यारोपण हेतु उपलब्ध किडनी, लिवर और हृदय।'
              : 'Live inter-hospital tracker for available blood units by blood group & component across hospitals, rare blood types, and available transplant organs with Cold Ischemia Time limits.'}
          </p>
        </div>

        {/* Live Metrics Snippet */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-2xl bg-white border border-rose-200/80 shadow-2xs space-y-1">
            <div className="text-[11px] font-bold text-slate-500 font-['Manrope'] flex items-center gap-1">
              <Droplet className="w-3 h-3 text-rose-600" />
              <span>Blood Units in Stock</span>
            </div>
            <div className="text-xl font-black font-['Manrope'] text-slate-900">
              {totalBloodUnits} <span className="text-xs font-semibold text-rose-600">Units</span>
            </div>
            <div className="text-[10px] text-slate-500 truncate">
              {criticalHospitals.length > 0 ? `⚠️ ${criticalHospitals.length} hosp short on O- / AB-` : 'All blood groups active'}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-rose-200/80 shadow-2xs space-y-1">
            <div className="text-[11px] font-bold text-slate-500 font-['Manrope'] flex items-center gap-1">
              <Heart className="w-3 h-3 text-rose-500" />
              <span>Available Organs</span>
            </div>
            <div className="text-xl font-black font-['Manrope'] text-slate-900">
              {availableOrgans.length} <span className="text-xs font-semibold text-cyan-600">Organs</span>
            </div>
            <div className="text-[10px] text-slate-500 truncate">
              {nextExpiringOrgan ? `Clock: ${nextExpiringOrgan.organType.toUpperCase()} CIT active` : 'Active matching'}
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-5 border-t border-rose-100 mt-5 flex items-center justify-between">
        <span className="text-xs text-rose-900 font-semibold font-['Manrope']">
          {isHindi ? 'अस्पतालों में उपलब्धता चेक करें' : 'Explore hospital inventory & request transfers'}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenBloodOrganModal('blood');
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-['Manrope'] font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
        >
          <span>{isHindi ? 'रक्त व अंग देखें' : 'View Blood & Organs'}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
