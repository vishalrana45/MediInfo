import React from 'react';
import { Heart, Droplet, Hospital, ArrowRight } from 'lucide-react';
import { HospitalBloodInventory, HospitalOrganListing } from '../../types';
import { useLanguage } from '../../services/i18n';

interface OrganDonorSectionCardProps {
  bloodInventories?: HospitalBloodInventory[];
  organListings?: HospitalOrganListing[];
  onOpenBloodOrganModal: (tab?: 'blood' | 'organs' | 'transfers' | 'manage') => void;
}

export const OrganDonorSectionCard: React.FC<OrganDonorSectionCardProps> = ({
  bloodInventories = [],
  organListings = [],
  onOpenBloodOrganModal,
}) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const totalBloodUnits = bloodInventories.reduce((acc, h) => {
    return acc + Object.values(h.bloodUnits).reduce((sum, item) => sum + item.units, 0);
  }, 0);

  const availableOrgans = organListings.filter((o) => o.status === 'available');

  return (
    <section id="section-organ-donor-network" className="w-full max-w-7xl mx-auto px-4 sm:px-6 mt-6 mb-8 font-['Inter']">
      <div
        id="card-organ-donor-network-flagship"
        onClick={() => onOpenBloodOrganModal('organs')}
        className="relative overflow-hidden bg-white rounded-2xl border border-rose-100 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all cursor-pointer group"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Left: Icon, Title & 1-line summary */}
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100 group-hover:scale-105 transition-transform">
              <Heart className="w-6 h-6 fill-rose-600/20 text-rose-600" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-['Manrope'] text-slate-900">
                  {isHindi ? 'अस्पताल रक्त एवं अंग रजिस्ट्री' : 'Hospital Blood & Organ Registry'}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-100">
                  {isHindi ? 'लाइव' : 'Live'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                {isHindi
                  ? 'अस्पतालों में उपलब्ध ब्लड बैंक यूनिट और डोनर अंगों की लाइव स्थिति देखें।'
                  : 'Check real-time blood bank units and available donor organs across local hospitals.'}
              </p>
            </div>
          </div>

          {/* Right: Clean summary stats and single action */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-3.5 py-2 rounded-xl">
              <div className="text-left">
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Droplet className="w-3 h-3 text-rose-500" />
                  <span>{isHindi ? 'रक्त' : 'Blood'}</span>
                </div>
                <div className="text-sm font-bold text-slate-800">
                  {totalBloodUnits} <span className="text-xs font-normal text-slate-500">Units</span>
                </div>
              </div>

              <div className="h-6 w-px bg-slate-200" />

              <div className="text-left">
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-500" />
                  <span>{isHindi ? 'अंग' : 'Organs'}</span>
                </div>
                <div className="text-sm font-bold text-slate-800">
                  {availableOrgans.length} <span className="text-xs font-normal text-slate-500">Active</span>
                </div>
              </div>

              <div className="h-6 w-px bg-slate-200" />

              <div className="text-left">
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Hospital className="w-3 h-3 text-slate-500" />
                  <span>{isHindi ? 'अस्पताल' : 'Hospitals'}</span>
                </div>
                <div className="text-sm font-bold text-slate-800">
                  {bloodInventories.length}
                </div>
              </div>
            </div>

            <button
              id="btn-open-organ-donor-network"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenBloodOrganModal('organs');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-['Manrope'] font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <span>{isHindi ? 'रजिस्ट्री देखें' : 'View Registry'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
