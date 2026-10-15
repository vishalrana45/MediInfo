import React from 'react';
import { HealthcareFacility } from '../../types';
import {
  MapPin,
  Navigation,
  Phone,
  Clock,
  Star,
  ExternalLink,
  ShieldAlert,
  Pill,
  Hospital,
  Activity,
  CheckCircle2,
  Truck,
} from 'lucide-react';

interface CareFacilityCardProps {
  facility: HealthcareFacility;
  isSelected: boolean;
  onSelect: (facility: HealthcareFacility) => void;
  onOrderTransport?: (facility: HealthcareFacility) => void;
}

export const CareFacilityCard: React.FC<CareFacilityCardProps> = ({
  facility,
  isSelected,
  onSelect,
  onOrderTransport,
}) => {
  const isHospital = facility.type === 'hospital' || facility.type === 'emergency';
  const isPharmacy = facility.type === 'pharmacy';

  const typeConfig = isHospital
    ? {
        label: facility.is24Hours ? 'Hospital · 24/7 ER' : 'Hospital',
        badgeBg: 'bg-red-50 text-red-700 border-red-200',
        icon: Hospital,
        accentRing: 'ring-red-500',
      }
    : isPharmacy
    ? {
        label: facility.is24Hours ? 'Pharmacy · 24/7' : 'Pharmacy',
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: Pill,
        accentRing: 'ring-emerald-500',
      }
    : {
        label: 'Urgent Care Clinic',
        badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        icon: Activity,
        accentRing: 'ring-indigo-500',
      };

  const IconComponent = typeConfig.icon;

  return (
    <div
      onClick={() => onSelect(facility)}
      className={`relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-left ${
        isSelected
          ? `bg-white border-blue-500 shadow-md ring-2 ${typeConfig.accentRing}`
          : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
      }`}
    >
      {/* Top Header: Badge & Distance */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${typeConfig.badgeBg}`}
        >
          <IconComponent className="w-3.5 h-3.5" />
          <span>{typeConfig.label}</span>
        </span>

        {/* Distance & ETA */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md font-mono">
            {facility.distanceKm ?? 0.5} km
          </span>
          <span className="text-slate-400">·</span>
          <span>~{facility.estimatedDriveMinutes ?? 3} min drive</span>
        </div>
      </div>

      {/* Title & Rating */}
      <div className="mb-1.5">
        <h4 className="text-sm sm:text-base font-['Manrope'] font-bold text-slate-900 leading-snug">
          {facility.name}
        </h4>
        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
          <div className="flex items-center gap-1 text-amber-600 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{facility.rating?.toFixed(1) || '4.6'}</span>
          </div>
          <span className="text-slate-300">•</span>
          <span>({facility.userRatingsTotal || 350} reviews)</span>
          <span className="text-slate-300">•</span>
          <span
            className={`inline-flex items-center gap-1 font-medium ${
              facility.isOpenNow ? 'text-emerald-600' : 'text-slate-500'
            }`}
          >
            <Clock className="w-3 h-3" />
            {facility.is24Hours ? 'Open 24 Hours' : facility.isOpenNow ? 'Open Now' : 'Closed'}
          </span>
        </div>
      </div>

      {/* Address */}
      <p className="text-xs text-slate-600 flex items-start gap-1.5 my-2">
        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
        <span className="line-clamp-1">{facility.address}</span>
      </p>

      {/* Service Tags */}
      {facility.services && facility.services.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {facility.services.slice(0, 3).map((service, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-medium text-slate-600"
            >
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
              {service}
            </span>
          ))}
        </div>
      )}

      {/* Direct Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 mt-2">
        {/* Order & Deliver Transport Button */}
        {onOrderTransport && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOrderTransport(facility);
            }}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold font-['Manrope'] shadow-xs transition active:scale-95 cursor-pointer"
            title={`Order medicines & supplies from ${facility.name}`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>{isPharmacy ? 'Order Delivery' : 'Order Transport'}</span>
          </button>
        )}

        {/* Directions Button */}
        <a
          href={facility.googleMapsUri}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition active:scale-95"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Directions</span>
        </a>

        {/* Call Phone */}
        {facility.phone && (
          <a
            href={`tel:${facility.phone}`}
            onClick={(e) => e.stopPropagation()}
            title={`Call ${facility.name}`}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition active:scale-95"
          >
            <Phone className="w-4 h-4" />
          </a>
        )}

        {/* Website / Monograph */}
        {facility.website && (
          <a
            href={facility.website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="Open Website"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition active:scale-95"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
};
