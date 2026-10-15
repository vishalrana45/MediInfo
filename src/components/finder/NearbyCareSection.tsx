import React, { useState, useEffect, useMemo } from 'react';
import {
  Hospital,
  Pill,
  Activity,
  MapPin,
  Crosshair,
  Search,
  Clock,
  Phone,
  Navigation,
  ExternalLink,
  List,
  Radio,
  Check,
  Star,
  Sparkles,
  ArrowLeft,
  Columns2,
  X,
  AlertCircle,
  CheckCircle2,
  Compass,
  Truck,
} from 'lucide-react';
import { HealthcareFacility, FacilityType } from '../../types';
import {
  searchNearbyFacilities,
  getLiveGoogleMapsSearchUrl,
  POPULAR_LOCATION_PRESETS,
  resolveLocationFromQuery,
} from '../../services/nearbyCareService';
import { detectAccurateUserLocation, detectLocationViaTimezone } from '../../services/gpsLocationService';
import { useLanguage } from '../../services/i18n';
import { CareMapView } from './CareMapView';

interface NearbyCareSectionProps {
  initialType?: FacilityType | 'all';
  onOpenFullModal?: (type?: FacilityType | 'all', medicineName?: string) => void;
  onOpenTransport?: (facility?: HealthcareFacility, medicineName?: string) => void;
  activeMedicineFilter?: string;
  onBack?: () => void;
}

/**
 * Automatically detects initial location based on user timezone or regional preferences
 */
function detectInitialLocation(): { lat: number; lng: number; name: string } {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (
      tz.includes('Calcutta') ||
      tz.includes('Kolkata') ||
      tz.includes('India') ||
      tz.includes('Colombo') ||
      tz.includes('Kathmandu')
    ) {
      return { lat: 28.6139, lng: 77.209, name: 'Delhi NCR, India' };
    }
    if (tz.includes('London')) {
      return { lat: 51.5074, lng: -0.1278, name: 'London, UK' };
    }
    if (tz.includes('Dubai')) {
      return { lat: 25.2048, lng: 55.2708, name: 'Dubai, UAE' };
    }
    if (tz.includes('Singapore')) {
      return { lat: 1.3521, lng: 103.8198, name: 'Singapore' };
    }
    if (tz.includes('Los_Angeles')) {
      return { lat: 34.0522, lng: -118.2437, name: 'Los Angeles, CA' };
    }
    if (tz.includes('Chicago')) {
      return { lat: 41.8781, lng: -87.6298, name: 'Chicago, IL' };
    }
    if (tz.includes('Toronto')) {
      return { lat: 43.6532, lng: -79.3832, name: 'Toronto, ON' };
    }
  } catch {
    // fallback
  }
  // Default to Delhi NCR for Indian context
  return { lat: 28.6139, lng: 77.209, name: 'Delhi NCR, India' };
}

/**
 * Formats a raw phone string (e.g. "+1 (800) 555-0199") into an RFC 3966 compliant tel: URI.
 * RFC 3966 requires no spaces, parentheses, or dashes.
 */
function cleanTelUri(phone: string): string {
  const digitsOnly = phone.replace(/[^\d+]/g, '');
  return `tel:${digitsOnly}`;
}

export const NearbyCareSection: React.FC<NearbyCareSectionProps> = ({
  initialType,
  activeMedicineFilter,
  onOpenTransport,
  onBack,
}) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  // Main Tab: 'list' (rich grid), 'map' (interactive radar), or 'split' (side-by-side)
  const [activeTab, setActiveTab] = useState<'list' | 'map' | 'split'>('list');

  // Smart Initial Location based on user environment
  const initialLoc = useMemo(() => detectInitialLocation(), []);

  // Location state
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number }>({
    lat: initialLoc.lat,
    lng: initialLoc.lng,
  });
  const [locationName, setLocationName] = useState(initialLoc.name);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsNotice, setGpsNotice] = useState<{ type: 'info' | 'warning' | 'success'; text: string } | null>(null);

  // Filters
  const [activeType, setActiveType] = useState<FacilityType | 'all'>(initialType || 'all');
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState(activeMedicineFilter || '');

  // Facilities data
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<HealthcareFacility | null>(null);

  // Call / Clipboard feedback toast
  const [callFeedback, setCallFeedback] = useState<{ name: string; phone: string } | null>(null);

  // Sync initialType when changed from outside
  useEffect(() => {
    if (initialType) {
      setActiveType(initialType);
    }
  }, [initialType]);

  // Check if browser already granted geolocation permission on mount
  useEffect(() => {
    let isCancelled = false;
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((permission) => {
          if (permission.state === 'granted' && !isCancelled) {
            detectAccurateUserLocation()
              .then((result) => {
                if (!isCancelled) {
                  setCurrentLocation({ lat: result.lat, lng: result.lng });
                  setLocationName(result.city || result.formattedAddress);
                }
              })
              .catch(() => {});
          }
        })
        .catch(() => {});
    }
    return () => {
      isCancelled = true;
    };
  }, []);

  // Raw facilities for the current location
  const [rawFacilities, setRawFacilities] = useState<HealthcareFacility[]>([]);

  // Sync with prop medicine filter if changed
  useEffect(() => {
    if (activeMedicineFilter) {
      setSearchQuery(activeMedicineFilter);
      setActiveType('pharmacy');
    }
  }, [activeMedicineFilter]);

  // Request user GPS location with multi-tiered fallback (GPS -> IP Geolocation -> Timezone Hub)
  const handleRequestLocation = async () => {
    setIsLocating(true);
    setGpsNotice({
      type: 'info',
      text: isHindi ? 'सटीक जीपीएस स्थान खोजा जा रहा है...' : 'Pinpointing live GPS location...',
    });

    try {
      const result = await detectAccurateUserLocation();
      setIsLocating(false);
      setCurrentLocation({ lat: result.lat, lng: result.lng });
      setLocationName(result.city || result.formattedAddress);

      const sourceLabel = result.source === 'gps' ? 'Live GPS' : 'Network';
      const accuracyText = result.accuracyMeters && result.accuracyMeters < 1000 ? ` (±${result.accuracyMeters}m)` : '';

      setGpsNotice({
        type: 'success',
        text: isHindi
          ? `${sourceLabel} स्थान लॉक: ${result.city}! नजदीकी अस्पताल व दवाइयां लोड की गईं।`
          : `${sourceLabel} location locked: ${result.city}${accuracyText}! Verified care facilities loaded.`,
      });
      setTimeout(() => setGpsNotice(null), 6000);
    } catch (err) {
      setIsLocating(false);
      console.warn('Geolocation detection error:', err);
      const fallback = detectLocationViaTimezone();
      setCurrentLocation({ lat: fallback.lat, lng: fallback.lng });
      setLocationName(fallback.city);
      setGpsNotice({
        type: 'success',
        text: isHindi
          ? `क्षेत्रीय स्थान सेट: ${fallback.city}! नजदीकी अस्पताल व फार्मेसी लोड की गईं।`
          : `Location locked: ${fallback.city}! Verified care facilities loaded.`,
      });
      setTimeout(() => setGpsNotice(null), 5000);
    }
  };

  // Select city preset directly
  const handleSelectCityPreset = (preset: { name: string; lat: number; lng: number }) => {
    setCurrentLocation({ lat: preset.lat, lng: preset.lng });
    setLocationName(preset.name);
    setGpsNotice(null);
  };

  // Search input change handler with automatic city detection
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    const locMatch = resolveLocationFromQuery(val);
    if (locMatch) {
      setCurrentLocation({ lat: locMatch.lat, lng: locMatch.lng });
      setLocationName(locMatch.name);
      setGpsNotice(null);
    }
  };

  // Fetch all facilities for current location (guarantees pharmacies and hospitals are always cached)
  useEffect(() => {
    let isCancelled = false;

    async function loadData() {
      setIsLoading(true);
      try {
        const results = await searchNearbyFacilities({
          lat: currentLocation.lat,
          lng: currentLocation.lng,
          typeFilter: 'all',
          openNowOnly: false,
          query: '', // Fetch complete healthcare network for this location; client filters instantly
          targetMedicine: activeMedicineFilter,
        });

        if (!isCancelled) {
          setRawFacilities(results);
        }
      } catch (err) {
        console.error('Failed to load facilities:', err);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isCancelled = true;
    };
  }, [currentLocation, activeMedicineFilter]);

  // Client-filtered facilities based on category, 24/7, and search query
  const facilities = useMemo(() => {
    let list = rawFacilities;

    // 1. Filter by category
    if (activeType !== 'all') {
      if (activeType === 'emergency') {
        list = list.filter((f) => f.emergencyServices || f.type === 'emergency' || f.type === 'hospital' || f.is24Hours);
      } else if (activeType === 'hospital') {
        list = list.filter((f) => f.type === 'hospital' || f.type === 'emergency' || f.emergencyServices);
      } else {
        list = list.filter((f) => f.type === activeType);
      }
    }

    // 2. Filter by 24/7 Open Now
    if (openNowOnly) {
      list = list.filter((f) => f.isOpenNow || f.is24Hours);
    }

    // 3. Filter by search query (e.g. pharmacy, hospital, hos, apollo, fortis, medicine names)
    const cleanQ = searchQuery.trim().toLowerCase();
    const isCity = resolveLocationFromQuery(cleanQ);
    if (cleanQ && !isCity) {
      const terms = cleanQ
        .split(/[\s,+/&]+/)
        .map((t) => t.trim())
        .filter((t) => t.length > 0 && !['and', 'or', 'in', 'near', 'nearby', 'find', 'the', 'for', 'to', 'a', 'an', 'me'].includes(t));

      if (terms.length > 0) {
        list = list.filter((f) => {
          const nameLower = f.name.toLowerCase();
          const addressLower = f.address.toLowerCase();
          const servicesLower = (f.services || []).join(' ').toLowerCase();

          return terms.some((term) => {
            // Pharmacy terms
            if (term === 'pharmacy' || term === 'pharm' || term === 'chemist' || term === 'rx' || term === 'drugstore' || term === 'medicine') {
              if (f.type === 'pharmacy') return true;
            }
            // Hospital terms
            if (term === 'hospital' || term === 'hosp' || term === 'hos' || term === 'er' || term === 'emergency' || term === 'trauma') {
              if (f.type === 'hospital' || f.type === 'emergency' || f.emergencyServices) return true;
            }
            // Clinic terms
            if (term === 'clinic' || term === 'urgent' || term === 'doctor') {
              if (f.type === 'clinic') return true;
            }

            // General text match
            return (
              nameLower.includes(term) ||
              addressLower.includes(term) ||
              servicesLower.includes(term)
            );
          });
        });
      }
    }

    return list;
  }, [rawFacilities, activeType, openNowOnly, searchQuery]);

  // Keep selected facility in sync with filtered list
  useEffect(() => {
    if (facilities.length > 0) {
      setSelectedFacility((prev) => {
        if (prev && facilities.some((f) => f.id === prev.id)) {
          return prev;
        }
        return facilities[0];
      });
    } else {
      setSelectedFacility(null);
    }
  }, [facilities]);

  // Accurate category counts across all facilities in this area
  const counts = useMemo(() => {
    return {
      all: rawFacilities.length,
      pharmacy: rawFacilities.filter((f) => f.type === 'pharmacy').length,
      hospital: rawFacilities.filter((f) => f.type === 'hospital' || f.type === 'emergency' || f.emergencyServices).length,
      clinic: rawFacilities.filter((f) => f.type === 'clinic').length,
    };
  }, [rawFacilities]);

  // Reliable Call handler for both mobile & desktop preview
  const handleCallFacility = (e: React.MouseEvent, facility: HealthcareFacility) => {
    if (!facility.phone) return;

    // 1. Copy number to clipboard as a reliable backup
    try {
      navigator.clipboard?.writeText(facility.phone);
    } catch {
      // ignore
    }

    // 2. Show interactive feedback toast
    setCallFeedback({ name: facility.name, phone: facility.phone });
    setTimeout(() => {
      setCallFeedback(null);
    }, 3000);

    // 3. Trigger tel URI with cleaned digits
    const telUri = cleanTelUri(facility.phone);
    try {
      window.location.href = telUri;
    } catch {
      // fallback
    }
  };

  return (
    <section
      id="nearby-care-section"
      className="w-full mx-auto my-2 scroll-mt-20"
    >
      {/* Expansive Full Screen Container */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 md:p-8 border border-slate-200/90 shadow-sm relative w-full">
        {/* Call Feedback Notification Banner */}
        {callFeedback && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-full bg-emerald-600 text-white text-xs font-bold font-['Manrope'] shadow-xl flex items-center gap-2 animate-fade-in whitespace-nowrap">
            <Check className="w-4 h-4" />
            <span>Calling {callFeedback.phone} (Copied to clipboard)</span>
          </div>
        )}

        {/* Screen Header: Title, Status, and View Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-start gap-3">
            {onBack && (
              <button
                id="btn-finder-header-back"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onBack();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-['Manrope'] font-bold text-xs border border-slate-200 transition cursor-pointer shrink-0 active:scale-95 shadow-2xs mt-0.5"
                title="Back to Home Page"
              >
                <ArrowLeft className="w-4 h-4 text-blue-600" />
                <span>Back</span>
              </button>
            )}

            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 shadow-2xs">
              <MapPin className="w-5 h-5" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black font-['Manrope'] text-slate-900 leading-tight">
                  Nearby Hospitals & Pharmacies
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
                  {facilities.length} Open
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Near {locationName}</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-['Inter'] mt-1">
                Locate verified 24-hour pharmacies, emergency hospitals, and urgent care clinics with live directions and one-tap dialing
              </p>
            </div>
          </div>

          {/* View Switcher: List Grid / Radar Map / Split View */}
          <div className="flex items-center p-1 bg-slate-100 border border-slate-200 rounded-xl self-start lg:self-center shrink-0">
            <button
              onClick={() => setActiveTab('list')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold font-['Manrope'] transition cursor-pointer ${
                activeTab === 'list'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <List className="w-4 h-4" />
              <span>List Grid</span>
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold font-['Manrope'] transition cursor-pointer ${
                activeTab === 'map'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Radio className="w-4 h-4 text-blue-600" />
              <span>Interactive Map</span>
            </button>
            <button
              onClick={() => setActiveTab('split')}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold font-['Manrope'] transition cursor-pointer ${
                activeTab === 'split'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Columns2 className="w-4 h-4 text-emerald-600" />
              <span>Split View</span>
            </button>
          </div>
        </div>

        {/* Express Medical Transportation Facility Banner */}
        {onOpenTransport && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold font-['Manrope'] text-white flex items-center gap-2">
                  <span>Emergency & Express Medical Transportation</span>
                  <span className="text-[10px] font-bold bg-cyan-500/30 text-cyan-200 px-2 py-0.5 rounded-full border border-cyan-400/30">
                    15-30 Min Dispatch
                  </span>
                </h4>
                <p className="text-xs text-cyan-100/80 mt-0.5">
                  Order prescription medicines, surgical supplies, BP monitors & hospital essentials directly from nearby pharmacies and hospitals.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onOpenTransport()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-['Manrope'] font-black text-xs transition shadow-xs cursor-pointer shrink-0"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Book Medical Transport</span>
            </button>
          </div>
        )}

        {/* Controls: Search Bar & Filter Options */}
        <div className="py-4 space-y-3">
          {/* Row 1: Search Input + GPS Button + Google Maps Button */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pharmacy, hospital, city, zip, or medicine (e.g. Apollo, Fortis, CVS, Delhi, Paracetamol)..."
                className="w-full h-11 sm:h-12 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition shadow-2xs"
              />
            </div>

            <button
              id="btn-gps-locate"
              onClick={handleRequestLocation}
              disabled={isLocating}
              className="h-11 sm:h-12 inline-flex items-center gap-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-['Manrope'] font-bold text-xs sm:text-sm transition cursor-pointer shrink-0 disabled:opacity-50 shadow-xs active:scale-95"
              title="Use GPS location"
            >
              <Crosshair className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Locating...' : 'GPS Detect'}</span>
            </button>

            <a
              href={getLiveGoogleMapsSearchUrl(searchQuery || 'hospital pharmacy', locationName)}
              target="_blank"
              rel="noopener noreferrer"
              className="h-11 sm:h-12 inline-flex items-center gap-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-['Manrope'] font-bold text-xs sm:text-sm transition shrink-0 border border-slate-200 shadow-2xs"
              title="Open query in Google Maps"
            >
              <ExternalLink className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Google Maps</span>
              <span className="sm:hidden">Maps</span>
            </a>
          </div>

          {/* GPS Location Status / Notice Banner */}
          {gpsNotice && (
            <div
              className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs font-semibold animate-fade-in ${
                gpsNotice.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : gpsNotice.type === 'info'
                  ? 'bg-blue-50 border-blue-200 text-blue-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <div className="flex items-center gap-2">
                {gpsNotice.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : gpsNotice.type === 'info' ? (
                  <Crosshair className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                )}
                <span>{gpsNotice.text}</span>
              </div>
              <button
                onClick={() => setGpsNotice(null)}
                className="p-1 hover:bg-black/5 rounded-lg text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Quick City Presets Row */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>Cities:</span>
            </span>
            {POPULAR_LOCATION_PRESETS.slice(0, 9).map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectCityPreset(preset)}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition shrink-0 cursor-pointer ${
                  locationName.toLowerCase().includes(preset.name.split(',')[0].toLowerCase())
                    ? 'bg-blue-50 text-blue-700 border-blue-300 font-bold'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {preset.name.split(',')[0]}
              </button>
            ))}
          </div>

          {/* Row 2: Category Filter Pills + Open 24/7 Switch */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 text-xs sm:text-sm">
            <div className="flex flex-wrap items-center gap-2">
              {/* All */}
              <button
                onClick={() => setActiveType('all')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-['Manrope'] font-bold transition cursor-pointer border ${
                  activeType === 'all'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <span>All Facilities</span>
                <span className="text-xs opacity-80 font-mono">({counts.all})</span>
              </button>

              {/* Pharmacies */}
              <button
                onClick={() => setActiveType('pharmacy')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-['Manrope'] font-bold transition cursor-pointer border ${
                  activeType === 'pharmacy'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                    : 'bg-white hover:bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}
              >
                <Pill className="w-3.5 h-3.5" />
                <span>Pharmacies</span>
                <span className="text-xs opacity-80 font-mono">({counts.pharmacy})</span>
              </button>

              {/* Hospitals & ER */}
              <button
                onClick={() => setActiveType('hospital')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-['Manrope'] font-bold transition cursor-pointer border ${
                  activeType === 'hospital' || activeType === 'emergency'
                    ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                    : 'bg-white hover:bg-red-50 text-red-800 border-red-200'
                }`}
              >
                <Hospital className="w-3.5 h-3.5" />
                <span>Emergency & Hospitals</span>
                <span className="text-xs opacity-80 font-mono">({counts.hospital})</span>
              </button>

              {/* Urgent Care */}
              <button
                onClick={() => setActiveType('clinic')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-['Manrope'] font-bold transition cursor-pointer border ${
                  activeType === 'clinic'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                    : 'bg-white hover:bg-blue-50 text-blue-800 border-blue-200'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Urgent Care</span>
                <span className="text-xs opacity-80 font-mono">({counts.clinic})</span>
              </button>
            </div>

            {/* 24/7 Filter Switch */}
            <button
              onClick={() => setOpenNowOnly(!openNowOnly)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-['Manrope'] font-bold border transition cursor-pointer ${
                openNowOnly
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300 shadow-2xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>24/7 Open Only</span>
            </button>
          </div>
        </div>

        {/* Content Box: Expansive Proper Screen Views */}
        <div className="pt-3 border-t border-slate-100">
          {/* TAB 1: Rich Full List Grid View */}
          {activeTab === 'list' && (
            <div>
              {isLoading ? (
                <div className="py-16 text-center text-slate-500 space-y-3">
                  <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm font-medium">Finding nearby care locations...</p>
                </div>
              ) : facilities.length === 0 ? (
                <div className="py-16 text-center text-slate-500 space-y-2 max-w-md mx-auto">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <Pill className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-800">No matching facilities found</h4>
                  <p className="text-xs text-slate-500">
                    Try switching to "All Facilities" or resetting your search term
                  </p>
                  <button
                    onClick={() => {
                      setActiveType('all');
                      setOpenNowOnly(false);
                      setSearchQuery('');
                    }}
                    className="mt-3 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-bold font-['Manrope'] hover:bg-blue-700 transition shadow-xs cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {facilities.map((fac) => {
                    const isHospital = fac.type === 'hospital' || fac.type === 'emergency';
                    const isPharmacy = fac.type === 'pharmacy';

                    return (
                      <div
                        key={fac.id}
                        className="p-5 rounded-2xl border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition bg-white flex flex-col justify-between gap-4 group"
                      >
                        {/* Top: Facility Details */}
                        <div className="space-y-2.5">
                          {/* Type Header & Badges */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                  isHospital
                                    ? 'bg-red-100 text-red-700'
                                    : isPharmacy
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-blue-100 text-blue-700'
                                }`}
                              >
                                {isHospital ? (
                                  <Hospital className="w-4 h-4" />
                                ) : isPharmacy ? (
                                  <Pill className="w-4 h-4" />
                                ) : (
                                  <Activity className="w-4 h-4" />
                                )}
                              </div>
                              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-['Manrope']">
                                {isHospital ? 'Hospital' : isPharmacy ? 'Pharmacy' : 'Urgent Care'}
                              </span>
                            </div>

                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                isHospital
                                  ? 'bg-red-50 text-red-700 border border-red-200'
                                  : fac.is24Hours
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {isHospital ? '24/7 ER' : fac.is24Hours ? '24/7 Open' : 'Open Now'}
                            </span>
                          </div>

                          {/* Name */}
                          <div>
                            <h4 className="font-['Manrope'] font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                              {fac.name}
                            </h4>
                            <p className="text-slate-500 text-xs mt-1 flex items-start gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                              <span className="line-clamp-2">{fac.address}</span>
                            </p>
                          </div>

                          {/* Distance, Drive Time & Rating */}
                          <div className="flex items-center gap-2 text-xs text-slate-600 pt-1 flex-wrap">
                            <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                              {fac.distanceKm} km away
                            </span>
                            <span>·</span>
                            <span>~{fac.estimatedDriveMinutes} min drive</span>
                            {fac.rating && (
                              <>
                                <span>·</span>
                                <span className="inline-flex items-center gap-0.5 text-amber-600 font-semibold">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  {fac.rating}
                                </span>
                              </>
                            )}
                          </div>

                          {/* Phone number display */}
                          {fac.phone && (
                            <p className="text-xs text-slate-500 font-mono">
                              Contact: <span className="text-slate-700 font-semibold">{fac.phone}</span>
                            </p>
                          )}
                        </div>

                        {/* Action Buttons: Prominent Call, Transport & Directions */}
                        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                          {onOpenTransport && (
                            <button
                              type="button"
                              onClick={() => onOpenTransport(fac)}
                              className="flex-1 min-w-[130px] py-2.5 px-3 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-['Manrope'] font-bold text-xs transition cursor-pointer shadow-2xs active:scale-95 flex items-center justify-center gap-1.5"
                              title={`Order medicines & supplies from ${fac.name}`}
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>{isPharmacy ? 'Order Delivery' : 'Order Transport'}</span>
                            </button>
                          )}

                          {fac.phone && (
                            <a
                              href={cleanTelUri(fac.phone)}
                              target="_top"
                              onClick={(e) => handleCallFacility(e, fac)}
                              title={`Call ${fac.name} at ${fac.phone}`}
                              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-['Manrope'] font-bold text-xs transition cursor-pointer border border-slate-200 shadow-2xs active:scale-95 flex items-center justify-center gap-1.5"
                            >
                              <Phone className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Call</span>
                            </a>
                          )}

                          <a
                            href={fac.googleMapsUri || `https://www.google.com/maps/dir/?api=1&destination=${fac.lat},${fac.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-['Manrope'] font-bold text-xs transition shadow-xs active:scale-95 flex items-center justify-center gap-1.5"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                            <span>Directions</span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Full-Size Interactive Radar & Map View */}
          {activeTab === 'map' && (
            <div className="space-y-4">
              <div className="h-[540px] sm:h-[620px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative">
                <CareMapView
                  centerLat={currentLocation.lat}
                  centerLng={currentLocation.lng}
                  facilities={facilities}
                  selectedFacility={selectedFacility}
                  onSelectFacility={(fac) => setSelectedFacility(fac)}
                  onRecenter={() => setSelectedFacility(null)}
                  isLocating={isLocating}
                />
              </div>

              {selectedFacility && (
                <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Selected Location</span>
                      <span className="text-xs font-bold text-slate-500">· {selectedFacility.distanceKm} km away</span>
                    </div>
                    <h4 className="font-['Manrope'] font-bold text-slate-900 text-base sm:text-lg">
                      {selectedFacility.name}
                    </h4>
                    <p className="text-slate-500 text-xs sm:text-sm">
                      {selectedFacility.address} {selectedFacility.phone && `· ${selectedFacility.phone}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    {selectedFacility.phone && (
                      <a
                        href={cleanTelUri(selectedFacility.phone)}
                        target="_top"
                        onClick={(e) => handleCallFacility(e, selectedFacility)}
                        className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-['Manrope'] font-bold text-xs sm:text-sm hover:bg-slate-100 transition shadow-2xs flex items-center gap-1.5"
                      >
                        <Phone className="w-4 h-4 text-emerald-600" />
                        <span>Call</span>
                      </a>
                    )}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedFacility.lat},${selectedFacility.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-['Manrope'] font-bold text-xs sm:text-sm hover:bg-blue-700 transition shadow-xs flex items-center gap-1.5"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Directions</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Split View (List on Left, Map on Right) */}
          {activeTab === 'split' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Facilities Column */}
              <div className="lg:col-span-5 space-y-3 max-h-[640px] overflow-y-auto pr-2 scrollbar-thin">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider pb-1">
                  Click a facility to focus on radar ({facilities.length} available)
                </p>
                {facilities.map((fac) => {
                  const isHospital = fac.type === 'hospital' || fac.type === 'emergency';
                  const isPharmacy = fac.type === 'pharmacy';
                  const isSelected = selectedFacility?.id === fac.id;

                  return (
                    <div
                      key={fac.id}
                      onClick={() => setSelectedFacility(fac)}
                      className={`p-3.5 rounded-xl border transition cursor-pointer ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/50 shadow-xs ring-1 ring-blue-400'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h5 className="font-['Manrope'] font-bold text-slate-900 text-sm truncate">
                            {fac.name}
                          </h5>
                          <p className="text-xs text-slate-500 truncate mt-0.5">{fac.address}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1.5">
                            <span className="font-bold text-blue-600">{fac.distanceKm} km</span>
                            <span>·</span>
                            <span>~{fac.estimatedDriveMinutes} min drive</span>
                          </div>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                            isHospital
                              ? 'bg-red-100 text-red-800'
                              : fac.is24Hours
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {isHospital ? 'ER' : fac.is24Hours ? '24/7' : 'Open'}
                        </span>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-2">
                        {fac.phone && (
                          <a
                            href={cleanTelUri(fac.phone)}
                            target="_top"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCallFacility(e, fac);
                            }}
                            className="flex-1 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs text-center border border-slate-200 flex items-center justify-center gap-1"
                          >
                            <Phone className="w-3 h-3 text-emerald-600" />
                            <span>Call</span>
                          </a>
                        )}
                        <a
                          href={fac.googleMapsUri || `https://www.google.com/maps/dir/?api=1&destination=${fac.lat},${fac.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs text-center flex items-center justify-center gap-1"
                        >
                          <Navigation className="w-3 h-3" />
                          <span>Directions</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Live Map Column */}
              <div className="lg:col-span-7 h-[640px] sticky top-4 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
                <CareMapView
                  centerLat={currentLocation.lat}
                  centerLng={currentLocation.lng}
                  facilities={facilities}
                  selectedFacility={selectedFacility}
                  onSelectFacility={(fac) => setSelectedFacility(fac)}
                  onRecenter={() => setSelectedFacility(null)}
                  isLocating={isLocating}
                />
              </div>
            </div>
          )}
        </div>

        {/* Box Footer Meta Line */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="truncate">Showing verified healthcare locations near <strong>{locationName}</strong></span>
          </div>
          <a
            href={getLiveGoogleMapsSearchUrl(searchQuery || 'hospital pharmacy', locationName)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold shrink-0"
          >
            <span>Open in Google Maps Live</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
