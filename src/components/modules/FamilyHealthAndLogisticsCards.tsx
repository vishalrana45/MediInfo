import React from 'react';
import {
  Users,
  Truck,
  Snowflake,
  ShieldCheck,
  AlertTriangle,
  Clock,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Pill,
} from 'lucide-react';
import {
  FamilyMember,
  CabinetMedicine,
  MedicineTransportRequest,
} from '../../types';
import { useLanguage } from '../../services/i18n';

interface FamilyHealthAndLogisticsCardsProps {
  familyMembers: FamilyMember[];
  cabinetMedicines: CabinetMedicine[];
  activeTransportRequests: MedicineTransportRequest[];
  onOpenCabinet: () => void;
  onOpenTransport: (medicineName?: string) => void;
}

export const FamilyHealthAndLogisticsCards: React.FC<FamilyHealthAndLogisticsCardsProps> = ({
  familyMembers,
  cabinetMedicines,
  activeTransportRequests,
  onOpenCabinet,
  onOpenTransport,
}) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  // Metrics
  const expiringSoonCount = cabinetMedicines.filter((m) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exp = new Date(m.expiryDate);
    exp.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 30;
  }).length;

  const expiredCount = cabinetMedicines.filter((m) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exp = new Date(m.expiryDate);
    exp.setHours(0, 0, 0, 0);
    return exp.getTime() < today.getTime();
  }).length;

  // Active transport
  const inTransitRequest = activeTransportRequests.find((r) => r.status === 'in_transit') || activeTransportRequests[0];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 mt-8 font-['Inter']">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* CARD 1: Family Medicine Cabinet */}
        <div
          id="card-family-medicine-cabinet"
          onClick={onOpenCabinet}
          className="group relative overflow-hidden bg-gradient-to-br from-white via-indigo-50/30 to-blue-50/40 rounded-3xl border border-indigo-200/80 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-4">
            {/* Top Pill Tag */}
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold font-['Manrope']">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                <span>{isHindi ? 'पारिवारिक स्वास्थ्य वॉल्ट' : 'Family Health & Expiry Vault'}</span>
                <span className="text-indigo-300">|</span>
                <span className="text-indigo-700 font-semibold">{familyMembers.length} Members</span>
              </div>

              {expiredCount > 0 ? (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold border border-rose-200 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-rose-600" />
                  <span>{expiredCount} Expired</span>
                </span>
              ) : expiringSoonCount > 0 ? (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-200 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-600" />
                  <span>{expiringSoonCount} Expiring</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>All Safe</span>
                </span>
              )}
            </div>

            {/* Title & Desc */}
            <div>
              <h3 className="text-xl sm:text-2xl font-black font-['Manrope'] text-slate-900 tracking-tight flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
                  <Pill className="w-5 h-5" />
                </div>
                <span>{isHindi ? 'पारिवारिक मेडिसिन कैबिनेट' : 'Family Medicine Cabinet'}</span>
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {isHindi
                  ? 'माता-पिता, बच्चों और बुजुर्गों की दवाइयाँ अलग-अलग ट्रैक करें। एक्सपायरी डेट चेतावनी और रेफ्रिजरेटर स्टोरेज निर्देश।'
                  : 'Track member-specific medicine inventories, automated 30-day expiration alarms, and refrigerated (2°C-8°C) storage rules.'}
              </p>
            </div>

            {/* Member Avatars Preview */}
            <div className="pt-1 flex flex-wrap items-center gap-2">
              {familyMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs"
                >
                  <div className={`w-4.5 h-4.5 rounded-full ${member.avatarBg} text-white text-[9px] flex items-center justify-center font-bold`}>
                    {member.name.charAt(0)}
                  </div>
                  <span>{member.name.split(' ')[0]}</span>
                </div>
              ))}
              <span className="text-[11px] text-slate-500 font-medium pl-1">
                • {cabinetMedicines.length} logged
              </span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-5 border-t border-indigo-100 mt-5 flex items-center justify-between">
            <span className="text-xs text-indigo-900 font-semibold font-['Manrope']">
              {isHindi ? 'दवाइयाँ प्रबंधित करें' : 'Family inventory'}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenCabinet();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-['Manrope'] font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
            >
              <span>{isHindi ? 'खोलें' : 'Open Vault'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* CARD 2: Medicine Transportation Facility (Strictly Medicine Transport) */}
        <div
          id="card-medicine-transport-facility"
          onClick={() => onOpenTransport()}
          className="group relative overflow-hidden bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/40 rounded-3xl border border-cyan-200/80 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-4">
            {/* Top Pill Tag */}
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs font-bold font-['Manrope']">
                <Truck className="w-3.5 h-3.5 text-cyan-600" />
                <span>{isHindi ? 'दवा परिवहन सुविधा' : 'Medicine Transport'}</span>
                <span className="text-cyan-300">|</span>
                <span className="text-cyan-800 font-semibold">15-30 Min Rapid</span>
              </div>

              {inTransitRequest && inTransitRequest.status === 'in_transit' && (
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-900 text-[11px] font-bold border border-cyan-300 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-600 animate-pulse" />
                  <span>In Transit</span>
                </span>
              )}
            </div>

            {/* Title & Desc */}
            <div>
              <h3 className="text-xl sm:text-2xl font-black font-['Manrope'] text-slate-900 tracking-tight flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-700 text-white flex items-center justify-center shadow-xs shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <span>{isHindi ? 'दवा परिवहन एवं त्वरित डिलीवरी' : 'Medicine Transport Facility'}</span>
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {isHindi
                  ? 'फार्मेसी और अस्पताल से जरूरी दवाइयां, प्रिस्क्रिप्शन और इमरजेंसी खुराक सीधे अपने घर मंगवाएं।'
                  : 'Fast courier transport dedicated to prescription medications, SOS pills, and refills directly from pharmacies & hospitals.'}
              </p>
            </div>

            {/* Live Active Dispatch Preview */}
            {inTransitRequest ? (
              <div className="p-3 rounded-2xl bg-white border border-cyan-200/90 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold">
                    Dispatch: <strong className="text-slate-900 font-['Manrope']">{inTransitRequest.trackingCode}</strong>
                  </span>
                  <span className="text-cyan-700 font-bold font-['Manrope']">
                    ~{inTransitRequest.etaMinutes} mins
                  </span>
                </div>
                <div className="text-xs text-slate-700 font-medium truncate">
                  Item: {inTransitRequest.medicineNames[0]}
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-white/80 border border-cyan-100 text-xs text-slate-500">
                ⚡ 24/7 Fast medical courier ready for dispatch.
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="pt-5 border-t border-cyan-100 mt-5 flex items-center justify-between">
            <span className="text-xs text-cyan-900 font-semibold font-['Manrope']">
              {isHindi ? 'दवाइयां ऑर्डर व ट्रैक करें' : 'Track or book transport'}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenTransport();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-['Manrope'] font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
            >
              <span>{isHindi ? 'परिवहन खोलें' : 'Transport'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
