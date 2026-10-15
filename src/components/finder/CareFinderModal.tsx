import React, { useState, useEffect, useMemo } from 'react';
import { HealthcareFacility, FacilityType } from '../../types';
import {
  searchNearbyFacilities,
} from '../../services/nearbyCareService';
import { detectAccurateUserLocation, detectLocationViaTimezone } from '../../services/gpsLocationService';
import { CareMapView } from './CareMapView';
import { CareFacilityCard } from './CareFacilityCard';
import {
  X,
  MapPin,
  Hospital,
  Pill,
  Activity,
  PhoneCall,
  Navigation,
  Search,
  Crosshair,
  ShieldAlert,
  Clock,
  Sparkles,
  Map,
  List,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { EmergencyNumbersView } from './EmergencyNumbersView';

interface CareFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: FacilityType | 'all';
  initialMedicineName?: string;
  onOrderTransport?: (facility: HealthcareFacility) => void;
}

export const CareFinderModal: React.FC<CareFinderModalProps> = ({
  isOpen,
  onClose,
  initialType = 'all',
  initialMedicineName,
  onOrderTransport,
}) => {
  // Modal main tab: 'radar' (Map & List) vs 'emergency' (Hotlines)
  const [modalTab, setModalTab] = useState<'radar' | 'emergency'>('radar');

  // Current coordinates (defaults to NYC Midtown / Central Hub)
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number }>({
    lat: 40.758,
    lng: -73.9855,
  });
  const [locationName, setLocationName] = useState('New York, NY (Midtown)');
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Filters
  const [activeType, setActiveType] = useState<FacilityType | 'all'>(initialType);
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileViewTab, setMobileViewTab] = useState<'list' | 'map'>('list');

  // Facilities data
  const [facilities, setFacilities] = useState<HealthcareFacility[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<HealthcareFacility | null>(null);

  // Synchronize initialType if it changes when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialType) {
        setActiveType(initialType);
      }
      if (initialMedicineName) {
        setSearchQuery('');
      }
    }
  }, [isOpen, initialType, initialMedicineName]);

  // Request user GPS location with multi-tier fallback
  const handleRequestLocation = async () => {
    setIsLocating(true);
    setLocationError(null);

    try {
      const result = await detectAccurateUserLocation();
      setIsLocating(false);
      setCurrentLocation({ lat: result.lat, lng: result.lng });
      setLocationName(result.city || result.formattedAddress);
    } catch (error) {
      setIsLocating(false);
      console.warn('Geolocation error:', error);
      const fallback = detectLocationViaTimezone();
      setCurrentLocation({ lat: fallback.lat, lng: fallback.lng });
      setLocationName(fallback.city);
    }
  };

  // Fetch facilities whenever location, activeType, openNowOnly, or searchQuery changes
  useEffect(() => {
    let isCancelled = false;

    async function loadData() {
      setIsLoading(true);
      try {
        const results = await searchNearbyFacilities({
          lat: currentLocation.lat,
          lng: currentLocation.lng,
          typeFilter: activeType,
          openNowOnly,
          query: searchQuery,
        });

        if (!isCancelled) {
          setFacilities(results);
          if (results.length > 0 && !selectedFacility) {
            setSelectedFacility(results[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load nearby facilities:', err);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    if (isOpen) {
      loadData();
    }

    return () => {
      isCancelled = true;
    };
  }, [isOpen, currentLocation, activeType, openNowOnly, searchQuery]);

  if (!isOpen) return null;

  const hospitalCount = facilities.filter(
    (f) => f.type === 'hospital' || f.type === 'emergency'
  ).length;
  const pharmacyCount = facilities.filter((f) => f.type === 'pharmacy').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl h-[92vh] max-h-[880px] my-auto flex flex-col bg-[#F8FAFC] rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden font-['Inter']"
      >
        {/* ============================================================ */}
        {/* 1. TOP HEADER & CLOSE                                        */}
        {/* ============================================================ */}
        <div className="px-5 sm:px-8 py-4 bg-white border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center shadow-sm">
              <Hospital className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-['Manrope'] font-bold text-slate-900">
                  Nearby Hospitals & Pharmacies
                </h2>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Live Radar
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Instant emergency rooms, 24/7 pharmacies, and walk-in clinics near you.
              </p>
            </div>
          </div>

          {/* Header Action Tabs + Close Button */}
          <div className="flex items-center gap-3">
            <div className="flex items-center p-1 bg-slate-100 border border-slate-200 rounded-xl text-xs">
              <button
                onClick={() => setModalTab('radar')}
                className={`px-3 py-1.5 rounded-lg font-['Manrope'] font-bold transition cursor-pointer ${
                  modalTab === 'radar'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Care & Map
              </button>
              <button
                onClick={() => setModalTab('emergency')}
                className={`px-3 py-1.5 rounded-lg font-['Manrope'] font-bold transition cursor-pointer ${
                  modalTab === 'emergency'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-red-700'
                }`}
              >
                Emergency Numbers
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition active:scale-95 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. CRITICAL EMERGENCY BAR                                    */}
        {/* ============================================================ */}
        <div className="px-5 sm:px-8 py-2.5 bg-red-600 text-white flex flex-wrap items-center justify-between gap-2.5 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-200" />
            <span>
              <strong>Life-threatening emergency?</strong> Call <strong>911</strong> (US/CAN) or <strong>112</strong> (EU) immediately.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="tel:911"
              className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold transition"
            >
              Call 911
            </a>
            <a
              href="tel:18002221222"
              className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold transition"
              title="National Poison Help Line"
            >
              Poison Help: 1-800-222-1222
            </a>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. CONDITIONAL BODY: EMERGENCY NUMBERS VS RADAR VIEW         */}
        {/* ============================================================ */}
        {modalTab === 'emergency' ? (
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
            <EmergencyNumbersView defaultRegionId="us-ca" />
          </div>
        ) : (
          <>
            {/* Medicine Context Notification Banner (if opened from medicine lookup) */}
            {initialMedicineName && (
              <div className="px-5 sm:px-8 py-2 bg-blue-50 border-b border-blue-100 flex items-center justify-between text-xs text-blue-800">
                <div className="flex items-center gap-2">
                  <Pill className="w-4 h-4 text-blue-600" />
                  <span>
                    Looking for <strong>{initialMedicineName}</strong>? Showing nearby licensed pharmacies and drive-thru prescription refills.
                  </span>
                </div>
                <button
                  onClick={() => setActiveType('pharmacy')}
                  className="underline font-bold text-blue-700 hover:text-blue-900 ml-2 cursor-pointer"
                >
                  Filter Pharmacies Only
                </button>
              </div>
            )}

            {/* ============================================================ */}
            {/* 3. LOCATION SELECTOR & SEARCH BAR                            */}
            {/* ============================================================ */}
            <div className="px-5 sm:px-8 py-3 bg-white border-b border-slate-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Location Picker */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleRequestLocation}
              disabled={isLocating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold transition active:scale-95 disabled:opacity-50"
            >
              <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Locating...' : 'Use My GPS'}</span>
            </button>

            <span className="text-slate-300 hidden sm:inline">|</span>

            <div className="flex items-center gap-1.5 text-xs text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold">{locationName}</span>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by facility name, street, service..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Location Error Notice */}
        {locationError && (
          <div className="px-5 sm:px-8 py-1.5 bg-amber-50 border-b border-amber-200 text-amber-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{locationError}</span>
          </div>
        )}

        {/* ============================================================ */}
        {/* 4. FILTER TABS & MOBILE VIEW TOGGLE                          */}
        {/* ============================================================ */}
        <div className="px-5 sm:px-8 py-2.5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveType('all')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                activeType === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({facilities.length})
            </button>

            <button
              onClick={() => setActiveType('hospital')}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold transition ${
                activeType === 'hospital'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Hospital className="w-3 h-3" />
              <span>Hospitals & ER ({hospitalCount})</span>
            </button>

            <button
              onClick={() => setActiveType('pharmacy')}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold transition ${
                activeType === 'pharmacy'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Pill className="w-3 h-3" />
              <span>Pharmacies ({pharmacyCount})</span>
            </button>

            <button
              onClick={() => setActiveType('clinic')}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold transition ${
                activeType === 'clinic'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Activity className="w-3 h-3" />
              <span>Urgent Care</span>
            </button>

            <span className="text-slate-200">|</span>

            <button
              onClick={() => setOpenNowOnly(!openNowOnly)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium border transition ${
                openNowOnly
                  ? 'bg-amber-50 text-amber-800 border-amber-300 font-semibold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Clock className="w-3 h-3 text-amber-500" />
              <span>24/7 & Open Now Only</span>
            </button>
          </div>

          {/* Mobile Tab Toggle (List vs Map) */}
          <div className="flex md:hidden items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => setMobileViewTab('list')}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                mobileViewTab === 'list'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setMobileViewTab('map')}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                mobileViewTab === 'map'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Map</span>
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 5. MAIN CONTENT SPLIT VIEW (List + Interactive Map)          */}
        {/* ============================================================ */}
        <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
          {/* LEFT: Facilities List */}
          <div
            className={`w-full md:w-1/2 lg:w-5/12 overflow-y-auto p-4 sm:p-5 space-y-3 bg-[#F8FAFC] border-r border-slate-200/80 ${
              mobileViewTab === 'map' ? 'hidden md:block' : 'block'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1 px-1">
              <span>{facilities.length} healthcare facilities found</span>
              <span>Sorted by closest distance</span>
            </div>

            {isLoading ? (
              <div className="py-16 text-center text-slate-400 text-sm">
                <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mx-auto mb-2"></div>
                Locating open healthcare centers...
              </div>
            ) : facilities.length === 0 ? (
              <div className="py-16 text-center text-slate-500 text-sm bg-white rounded-2xl border border-dashed border-slate-200 p-8">
                <Hospital className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-700">No facilities found</p>
                <p className="text-xs text-slate-400 mt-1">
                  Try switching your location or clearing filters.
                </p>
              </div>
            ) : (
              facilities.map((facility) => (
                <CareFacilityCard
                  key={facility.id}
                  facility={facility}
                  isSelected={selectedFacility?.id === facility.id}
                  onSelect={(f) => {
                    setSelectedFacility(f);
                    // On mobile switch to map if clicked
                    if (window.innerWidth < 768) {
                      setMobileViewTab('map');
                    }
                  }}
                  onOrderTransport={(f) => {
                    onClose();
                    if (onOrderTransport) onOrderTransport(f);
                  }}
                />
              ))
            )}
          </div>

          {/* RIGHT: Interactive Google Map */}
          <div
            className={`w-full md:w-1/2 lg:w-7/12 p-4 flex flex-col bg-slate-100 ${
              mobileViewTab === 'list' ? 'hidden md:flex' : 'flex'
            }`}
          >
            <div className="flex-1 relative w-full h-full min-h-[360px] rounded-2xl overflow-hidden shadow-xs border border-slate-200">
              <CareMapView
                centerLat={currentLocation.lat}
                centerLng={currentLocation.lng}
                facilities={facilities}
                selectedFacility={selectedFacility}
                onSelectFacility={(f) => setSelectedFacility(f)}
                onRecenter={handleRequestLocation}
                isLocating={isLocating}
              />
            </div>

            {/* Selected Facility Detail Bar under the map */}
            {selectedFacility && (
              <div className="mt-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-150">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h5 className="text-xs sm:text-sm font-['Manrope'] font-bold text-slate-900 truncate">
                      {selectedFacility.name}
                    </h5>
                    <span className="text-[11px] font-mono font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                      {selectedFacility.distanceKm} km
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{selectedFacility.address}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={selectedFacility.googleMapsUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition active:scale-95"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Navigate</span>
                  </a>
                  {selectedFacility.phone && (
                    <a
                      href={`tel:${selectedFacility.phone}`}
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      title="Call facility"
                    >
                      <PhoneCall className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        </>
        )}

        {/* ============================================================ */}
        {/* 6. MODAL FOOTER & ATTRIBUTION                                */}
        {/* ============================================================ */}
        <div className="px-5 sm:px-8 py-3 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Powered by Google Maps Platform</span>
            <span className="text-slate-300">•</span>
            <span>Real-time location & distance accuracy</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400">
              Google Maps
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
