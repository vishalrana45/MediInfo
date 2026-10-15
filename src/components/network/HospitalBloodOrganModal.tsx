import React, { useState, useEffect } from 'react';
import {
  X,
  Droplet,
  Heart,
  Activity,
  Hospital,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Phone,
  ArrowRight,
  Search,
  Filter,
  CheckCircle2,
  RefreshCw,
  Plus,
  Send,
  Navigation,
  Compass,
  FileText,
  BadgeAlert,
  Sparkles,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Truck,
  Timer,
  MapPin,
  LocateFixed,
} from 'lucide-react';
import {
  HospitalBloodInventory,
  HospitalOrganListing,
  InterHospitalTransferRequest,
  BloodGroup,
  BloodComponentType,
  OrganType,
  InterHospitalTransferUrgency,
  OrganDonorStatus,
} from '../../types';
import { useLanguage } from '../../services/i18n';
import { detectAccurateUserLocation, detectLocationViaTimezone } from '../../services/gpsLocationService';

interface HospitalBloodOrganModalProps {
  isOpen: boolean;
  onClose: () => void;
  bloodInventories: HospitalBloodInventory[];
  organListings: HospitalOrganListing[];
  transferRequests: InterHospitalTransferRequest[];
  onAddBloodUnits?: (hospitalId: string, group: BloodGroup, units: number, component: BloodComponentType) => void;
  onRegisterOrgan?: (organ: Omit<HospitalOrganListing, 'id' | 'coldIschemiaRemainingMinutes'>) => void;
  onRequestTransfer?: (transfer: Omit<InterHospitalTransferRequest, 'id' | 'initiatedAt'>) => void;
  defaultTab?: 'blood' | 'organs' | 'transfers' | 'manage';
}

const BLOOD_GROUPS: BloodGroup[] = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'Bombay_hh'];

const ORGAN_TYPES: { id: OrganType; label: string; maxCit: string; icon: string }[] = [
  { id: 'heart', label: 'Heart', maxCit: '4-6h max', icon: '❤️' },
  { id: 'lungs', label: 'Lungs', maxCit: '6-8h max', icon: '🫁' },
  { id: 'liver', label: 'Liver', maxCit: '8-12h max', icon: '🩸' },
  { id: 'kidney', label: 'Kidneys', maxCit: '24-36h max', icon: '🩺' },
  { id: 'pancreas', label: 'Pancreas', maxCit: '12-18h max', icon: '🧬' },
  { id: 'corneas', label: 'Corneas', maxCit: '14 days max', icon: '👁️' },
];

export const HospitalBloodOrganModal: React.FC<HospitalBloodOrganModalProps> = ({
  isOpen,
  onClose,
  bloodInventories,
  organListings,
  transferRequests,
  onAddBloodUnits,
  onRegisterOrgan,
  onRequestTransfer,
  defaultTab = 'blood',
}) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [activeTab, setActiveTab] = useState<'blood' | 'organs' | 'transfers' | 'manage'>(defaultTab);

  // Blood Filters
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('all');
  const [selectedComponent, setSelectedComponent] = useState<string>('all');
  const [searchHospitalQuery, setSearchHospitalQuery] = useState('');
  const [patientBloodGroup, setPatientBloodGroup] = useState<string>('');

  // Organ Filters
  const [selectedOrganType, setSelectedOrganType] = useState<string>('all');
  const [organBloodFilter, setOrganBloodFilter] = useState<string>('all');

  // Our Location & Distance Radar State
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>({ lat: 28.5284, lng: 77.2117 }); // Default: New Delhi Saket area
  const [userLocationName, setUserLocationName] = useState<string>('New Delhi (South / Saket AIIMS Radius)');
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);
  const [locationSuccessMsg, setLocationSuccessMsg] = useState<string>('');
  const [locationErrorMsg, setLocationErrorMsg] = useState<string>('');
  const [organDistanceFilter, setOrganDistanceFilter] = useState<'all' | '10' | '25' | '50' | '100'>('all');
  const [organSortBy, setOrganSortBy] = useState<'distance' | 'cit' | 'blood'>('distance');

  // Inter-Hospital Transfer Coordination State
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferType, setTransferType] = useState<'blood' | 'organ'>('blood');
  const [transferSourceHosp, setTransferSourceHosp] = useState('');
  const [transferDestHosp, setTransferDestHosp] = useState('');
  const [transferItemText, setTransferItemText] = useState('');
  const [transferUrgency, setTransferUrgency] = useState<InterHospitalTransferUrgency>('stat_immediate');
  const [transferDoctor, setTransferDoctor] = useState('');
  const [transferNotes, setTransferNotes] = useState('');
  const [transferSuccessMessage, setTransferSuccessMessage] = useState('');

  // Add Inventory State
  const [manageMode, setManageMode] = useState<'blood' | 'organ'>('blood');
  const [inputHospId, setInputHospId] = useState(bloodInventories[0]?.hospitalId || '');
  const [inputBloodGroup, setInputBloodGroup] = useState<BloodGroup>('O+');
  const [inputUnits, setInputUnits] = useState<number>(5);
  const [inputComponent, setInputComponent] = useState<BloodComponentType>('prbc');

  // New Organ Draft
  const [inputOrganType, setInputOrganType] = useState<OrganType>('kidney');
  const [inputOrganSubtype, setInputOrganSubtype] = useState('');
  const [inputDonorBlood, setInputDonorBlood] = useState<BloodGroup>('O+');
  const [inputDonorAge, setInputDonorAge] = useState<number>(28);
  const [inputDonorGender, setInputDonorGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [inputDonorStatus, setInputDonorStatus] = useState<OrganDonorStatus>('brain_dead_dbd');
  const [inputMaxHours, setInputMaxHours] = useState<number>(24);
  const [inputHla, setInputHla] = useState('');
  const [inputCoordName, setInputCoordName] = useState('');
  const [inputCoordPhone, setInputCoordPhone] = useState('');
  const [manageSuccessMsg, setManageSuccessMsg] = useState('');

  // Clock countdown simulation ticker
  const [ticker, setTicker] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setTicker((prev) => prev + 1);
    }, 60000); // update every minute
    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  // Aggregate metrics
  const totalBloodUnits = bloodInventories.reduce((acc, h) => {
    return acc + Object.values(h.bloodUnits).reduce((sum, item) => sum + item.units, 0);
  }, 0);

  const criticalBloodCount = bloodInventories.reduce((acc, h) => {
    return acc + Object.values(h.bloodUnits).filter((b) => b.status === 'critical').length;
  }, 0);

  const availableOrgansCount = organListings.filter((o) => o.status === 'available').length;
  const activeTransfersCount = transferRequests.filter((t) => t.status !== 'delivered').length;

  // Red Blood Cell Compatibility helper
  const getCompatibleBloodDonors = (recipient: string): BloodGroup[] => {
    switch (recipient) {
      case 'O-':
        return ['O-'];
      case 'O+':
        return ['O+', 'O-'];
      case 'A-':
        return ['A-', 'O-'];
      case 'A+':
        return ['A+', 'A-', 'O+', 'O-'];
      case 'B-':
        return ['B-', 'O-'];
      case 'B+':
        return ['B+', 'B-', 'O+', 'O-'];
      case 'AB-':
        return ['AB-', 'A-', 'B-', 'O-'];
      case 'AB+':
        return ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'];
      case 'Bombay_hh':
        return ['Bombay_hh'];
      default:
        return BLOOD_GROUPS;
    }
  };

  // Filtered Blood Inventories
  const filteredBloodInventories = bloodInventories.filter((h) => {
    if (searchHospitalQuery.trim()) {
      const q = searchHospitalQuery.toLowerCase();
      const matchName = h.hospitalName.toLowerCase().includes(q);
      const matchCity = h.city.toLowerCase().includes(q);
      if (!matchName && !matchCity) return false;
    }
    return true;
  });

  // Haversine formula to compute accurate distance between two GPS coordinates
  const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  };

  // Helper to get distance for an organ from current user location
  const getOrganDistance = (organ: HospitalOrganListing): number => {
    if (userCoords && organ.coordinates) {
      return calculateDistanceKm(userCoords.lat, userCoords.lng, organ.coordinates.lat, organ.coordinates.lng);
    }
    return organ.distanceKm || 5.0;
  };

  const handleDetectAccurateLocation = async () => {
    setIsDetectingLocation(true);
    setLocationErrorMsg('');
    setLocationSuccessMsg('');

    try {
      const result = await detectAccurateUserLocation();
      const coords = { lat: result.lat, lng: result.lng };
      setUserCoords(coords);
      setUserLocationName(result.city || result.formattedAddress);
      setIsDetectingLocation(false);

      const sourceLabel = result.source === 'gps' ? 'Live GPS' : 'Network';
      const accuracyText = result.accuracyMeters && result.accuracyMeters < 1000 ? ` (±${result.accuracyMeters}m)` : '';

      setLocationSuccessMsg(
        isHindi
          ? `${sourceLabel} स्थान लॉक: ${result.city}!`
          : `${sourceLabel} location locked: ${result.city}${accuracyText}!`
      );
      setTimeout(() => setLocationSuccessMsg(''), 5000);
    } catch (err) {
      console.warn('Geolocation error:', err);
      setIsDetectingLocation(false);
      const fallback = detectLocationViaTimezone();
      setUserCoords({ lat: fallback.lat, lng: fallback.lng });
      setUserLocationName(fallback.city);
      setLocationSuccessMsg(
        isHindi
          ? `स्थान लॉक: ${fallback.city}!`
          : `Location locked: ${fallback.city}!`
      );
      setTimeout(() => setLocationSuccessMsg(''), 5000);
    }
  };

  const handleSelectLocationPreset = (name: string, lat: number, lng: number) => {
    setUserCoords({ lat, lng });
    setUserLocationName(name);
    setLocationErrorMsg('');
    setLocationSuccessMsg(isHindi ? `स्थान बदला गया: ${name}` : `Location set to: ${name}`);
    setTimeout(() => setLocationSuccessMsg(''), 3000);
  };

  // Filtered & Sorted Organ Listings
  const filteredOrgans = organListings
    .filter((organ) => {
      if (selectedOrganType !== 'all' && organ.organType !== selectedOrganType) return false;
      if (organBloodFilter !== 'all' && organ.bloodGroup !== organBloodFilter) return false;
      if (organDistanceFilter !== 'all') {
        const maxDist = Number(organDistanceFilter);
        const dist = getOrganDistance(organ);
        if (dist > maxDist) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (organSortBy === 'distance') {
        return getOrganDistance(a) - getOrganDistance(b);
      }
      if (organSortBy === 'cit') {
        return a.coldIschemiaRemainingMinutes - b.coldIschemiaRemainingMinutes;
      }
      return a.bloodGroup.localeCompare(b.bloodGroup);
    });

  // Format Cold Ischemia Remaining Time
  const formatCitRemaining = (mins: number) => {
    if (mins <= 0) return { text: 'CIT Expired', isCritical: true, progressPercent: 0 };
    const hours = Math.floor(mins / 60);
    const m = mins % 60;
    const isCritical = hours < 2;
    return {
      text: hours > 0 ? `${hours}h ${m}m remaining` : `${m} mins left!`,
      isCritical,
      hours,
      mins: m,
    };
  };

  // Handle Transfer Submit
  const handleInitiateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferSourceHosp || !transferDestHosp || !transferItemText) {
      alert('Please fill source hospital, destination hospital, and item details.');
      return;
    }

    const newTransfer: Omit<InterHospitalTransferRequest, 'id' | 'initiatedAt'> = {
      transferType,
      itemDetails: transferItemText,
      sourceHospital: transferSourceHosp,
      destinationHospital: transferDestHosp,
      urgency: transferUrgency,
      status: transferUrgency === 'stat_immediate' ? 'green_corridor_active' : 'in_transit',
      ambulanceVehiclePlate: transferType === 'organ' ? 'DL-01-ORG-9988' : 'DL-04-BLD-1122',
      policeEscort: transferUrgency === 'stat_immediate',
      etaMinutes: transferUrgency === 'stat_immediate' ? 14 : 25,
      requesterDoctor: transferDoctor.trim() || 'Attending Surgeon / Desk',
      notes: transferNotes || 'Priority Inter-Hospital cold-chain dispatch.',
    };

    if (onRequestTransfer) {
      onRequestTransfer(newTransfer);
    }

    setTransferSuccessMessage(`Emergency transfer request for "${transferItemText}" registered successfully!`);
    setTimeout(() => {
      setTransferSuccessMessage('');
      setShowTransferModal(false);
      setActiveTab('transfers');
    }, 1500);
  };

  // Handle Add Blood Units
  const handleAddBloodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputHospId || inputUnits <= 0) return;
    if (onAddBloodUnits) {
      onAddBloodUnits(inputHospId, inputBloodGroup, inputUnits, inputComponent);
    }
    const hosp = bloodInventories.find((h) => h.hospitalId === inputHospId);
    setManageSuccessMsg(`Added ${inputUnits} units of ${inputBloodGroup} (${inputComponent.toUpperCase()}) to ${hosp?.hospitalName}!`);
    setTimeout(() => {
      setManageSuccessMsg('');
      setActiveTab('blood');
    }, 1500);
  };

  // Handle Register Organ Submit
  const handleRegisterOrganSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hosp = bloodInventories.find((h) => h.hospitalId === inputHospId);
    if (!hosp) return;

    if (onRegisterOrgan) {
      onRegisterOrgan({
        hospitalId: inputHospId,
        hospitalName: hosp.hospitalName,
        city: hosp.city,
        phone: hosp.phone,
        organType: inputOrganType,
        organSubtype: inputOrganSubtype.trim() || `${inputOrganType.toUpperCase()} Graft`,
        bloodGroup: inputDonorBlood,
        donorAge: inputDonorAge,
        donorGender: inputDonorGender,
        donorStatus: inputDonorStatus,
        harvestedAt: 'Just now',
        maxColdIschemiaHours: inputMaxHours,
        hlaTyping: inputHla.trim() || 'HLA testing in progress',
        status: 'available',
        transplantCoordinator: {
          name: inputCoordName.trim() || 'Transplant Duty Officer',
          contact: inputCoordPhone.trim() || hosp.phone,
        },
        greenCorridorEligible: true,
        notes: 'Newly harvested donor organ logged and registered on NOTTO inter-hospital network.',
      });
    }

    setManageSuccessMsg(`Donor ${inputOrganType.toUpperCase()} registered successfully and listed for matching!`);
    setTimeout(() => {
      setManageSuccessMsg('');
      setActiveTab('organs');
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/65 backdrop-blur-xs font-['Inter']"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="min-h-full flex items-center justify-center p-2 sm:p-4 md:p-6">
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[90vh] max-h-[860px] my-auto"
        >
        {/* ======================================================== */}
        {/* MODAL HEADER                                              */}
        {/* ======================================================== */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white shrink-0 relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-['Manrope'] tracking-tight text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" />
                <span>{isHindi ? 'अस्पताल रक्त एवं अंग रजिस्ट्री' : 'Hospital Blood & Organ Registry'}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isHindi
                  ? 'अस्पतालों में उपलब्ध ब्लड बैंक यूनिट और डोनर अंगों की लाइव स्थिति।'
                  : 'Real-time blood stock and donor organ availability across hospitals.'}
              </p>
            </div>

            {/* Quick Actions & Close Button */}
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => setShowTransferModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold font-['Manrope'] shadow-xs transition flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isHindi ? 'ट्रांसफर रिक्वेस्ट' : 'Request Transfer'}</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                aria-label="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="relative z-10 grid grid-cols-3 gap-2.5 mt-3 pt-3 border-t border-slate-800">
            <div className="bg-slate-800/80 rounded-xl p-2.5 flex items-center gap-2.5">
              <Droplet className="w-4 h-4 text-rose-400 shrink-0" />
              <div>
                <div className="text-sm font-bold font-['Manrope'] text-white">
                  {totalBloodUnits} <span className="text-xs font-normal text-slate-400">Units</span>
                </div>
                <div className="text-[10px] text-slate-400">Total Blood In Stock</div>
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-xl p-2.5 flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <div className="text-sm font-bold font-['Manrope'] text-white">
                  {criticalBloodCount} <span className="text-xs font-normal text-slate-400">Groups</span>
                </div>
                <div className="text-[10px] text-slate-400">Low Stock Alerts</div>
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-xl p-2.5 flex items-center gap-2.5">
              <Heart className="w-4 h-4 text-rose-400 shrink-0" />
              <div>
                <div className="text-sm font-bold font-['Manrope'] text-white">
                  {availableOrgansCount} <span className="text-xs font-normal text-slate-400">Organs</span>
                </div>
                <div className="text-[10px] text-slate-400">Donor Organs</div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs Switcher */}
          <div className="relative z-10 flex items-center gap-2 mt-3 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setActiveTab('blood')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-['Manrope'] transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'blood'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'bg-white/10 text-white hover:bg-white/15'
              }`}
            >
              <Droplet className="w-3.5 h-3.5 text-rose-500" />
              <span>{isHindi ? 'रक्त बैंक' : 'Blood Bank'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('organs')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-['Manrope'] transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'organs'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'bg-white/10 text-white hover:bg-white/15'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>{isHindi ? 'दाता अंग' : 'Donor Organs'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('transfers')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-['Manrope'] transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'transfers'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'bg-white/10 text-white hover:bg-white/15'
              }`}
            >
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isHindi ? 'ट्रांसफर' : 'Transfers'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('manage')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-['Manrope'] transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'manage'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'bg-white/10 text-white hover:bg-white/15'
              }`}
            >
              <Plus className="w-3.5 h-3.5 text-blue-500" />
              <span>{isHindi ? 'स्टॉक अपडेट' : 'Update Stock'}</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* MODAL BODY TABS                                           */}
        {/* ======================================================== */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 bg-slate-50/70">
          {/* ======================================================== */}
          {/* TAB 1: HOSPITAL BLOOD AVAILABILITY                       */}
          {/* ======================================================== */}
          {activeTab === 'blood' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Filter & Compatibility Bar */}
              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs space-y-4">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  {/* Search Hospital */}
                  <div className="relative w-full lg:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search hospital or area (e.g. AIIMS, Saket)..."
                      value={searchHospitalQuery}
                      onChange={(e) => setSearchHospitalQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-blue-600 bg-slate-50"
                    />
                  </div>

                  {/* Recipient Blood Group Quick Checker */}
                  <div className="flex items-center gap-2 w-full lg:w-auto">
                    <span className="text-xs font-bold font-['Manrope'] text-slate-700 whitespace-nowrap flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                      <span>{isHindi ? 'मरीज का ब्लड ग्रुप:' : 'Patient Blood Group:'}</span>
                    </span>
                    <select
                      value={patientBloodGroup}
                      onChange={(e) => setPatientBloodGroup(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50/50 text-blue-900 text-xs font-bold font-['Manrope'] focus:outline-blue-600"
                    >
                      <option value="">-- Check Compatibility --</option>
                      {BLOOD_GROUPS.map((bg) => (
                        <option key={bg} value={bg}>
                          {bg} {bg === 'Bombay_hh' ? '(Rare Bombay)' : ''}
                        </option>
                      ))}
                    </select>
                    {patientBloodGroup && (
                      <button
                        type="button"
                        onClick={() => setPatientBloodGroup('')}
                        className="text-xs text-slate-400 hover:text-slate-600"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* Compatibility Feedback Banner */}
                {patientBloodGroup && (
                  <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black flex items-center justify-center font-['Manrope']">
                        {patientBloodGroup}
                      </div>
                      <div>
                        <span className="font-extrabold text-indigo-950 font-['Manrope']">
                          Compatible Donors for {patientBloodGroup}:
                        </span>{' '}
                        <span className="text-indigo-800 font-semibold">
                          {getCompatibleBloodDonors(patientBloodGroup).join(', ')}
                        </span>
                      </div>
                    </div>
                    <div className="text-slate-600 text-[11px]">
                      {patientBloodGroup === 'O-'
                        ? '⚠️ Critical: O- Negative patients can ONLY receive O- blood.'
                        : patientBloodGroup === 'AB+'
                        ? '✅ Universal Red Cell Recipient: Can receive any blood group.'
                        : 'ABO matched transfusions recommended.'}
                    </div>
                  </div>
                )}

                {/* Blood Group Filter Pills */}
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 font-['Manrope'] flex items-center justify-between">
                    <span>Filter by Blood Group in Stock</span>
                    <span className="text-slate-400 lowercase font-normal">click to isolate specific blood group</span>
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold font-['Manrope']">
                    <button
                      type="button"
                      onClick={() => setSelectedBloodGroup('all')}
                      className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
                        selectedBloodGroup === 'all'
                          ? 'bg-slate-900 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      All Blood Groups
                    </button>
                    {BLOOD_GROUPS.map((bg) => {
                      const totalUnitsForGroup = bloodInventories.reduce(
                        (sum, h) => sum + (h.bloodUnits[bg]?.units || 0),
                        0
                      );
                      const isCritical = totalUnitsForGroup < 15;
                      return (
                        <button
                          key={bg}
                          type="button"
                          onClick={() => setSelectedBloodGroup(bg)}
                          className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                            selectedBloodGroup === bg
                              ? 'bg-rose-600 text-white shadow-2xs'
                              : isCritical
                              ? 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <span>{bg}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                              selectedBloodGroup === bg
                                ? 'bg-white/20 text-white'
                                : isCritical
                                ? 'bg-amber-200 text-amber-900'
                                : 'bg-slate-200 text-slate-800'
                            }`}
                          >
                            {totalUnitsForGroup}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Hospital Cards List */}
              <div className="space-y-4">
                {filteredBloodInventories.map((hosp) => {
                  const hospTotalUnits = Object.values(hosp.bloodUnits).reduce((sum, item) => sum + item.units, 0);

                  return (
                    <div
                      key={hosp.hospitalId}
                      className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-2xs hover:shadow-sm transition-all"
                    >
                      {/* Hospital Top Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base sm:text-lg font-black font-['Manrope'] text-slate-900">
                              {hosp.hospitalName}
                            </h3>
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-['Manrope']">
                              📍 {hosp.city} ({hosp.distanceKm} km away)
                            </span>
                            {hosp.emergencyTransferAvailable && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                                ⚡ Emergency Transfer Ready
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                            <span>{hosp.address}</span>
                            <span>•</span>
                            <span className="text-slate-600 font-medium">{hosp.lastUpdated}</span>
                          </p>
                        </div>

                        {/* Hospital Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={`tel:${hosp.phone}`}
                            className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center gap-1.5"
                            title="Call Blood Bank Desk"
                          >
                            <Phone className="w-3.5 h-3.5 text-blue-600" />
                            <span>{hosp.bloodBankHelpline.split(' ')[0]}</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => {
                              setTransferSourceHosp(hosp.hospitalName);
                              setTransferType('blood');
                              setTransferItemText(
                                selectedBloodGroup !== 'all'
                                  ? `4 Units ${selectedBloodGroup} PRBC`
                                  : 'Urgent Red Blood Cell Units'
                              );
                              setShowTransferModal(true);
                            }}
                            className="py-1.5 px-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs font-['Manrope'] transition shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Request Transfer</span>
                          </button>
                        </div>
                      </div>

                      {/* Rare Blood Notice if any */}
                      {hosp.rareBloodAvailable && hosp.rareBloodAvailable.length > 0 && (
                        <div className="mt-3 p-2.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-xs text-amber-900 flex items-center gap-2">
                          <BadgeAlert className="w-4 h-4 text-amber-600 shrink-0" />
                          <div>
                            <strong>Rare Blood Phenotypes in Reserve:</strong>{' '}
                            {hosp.rareBloodAvailable.join(' | ')}
                          </div>
                        </div>
                      )}

                      {/* Blood Stock Grid for this Hospital */}
                      <div className="mt-4">
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 font-['Manrope'] flex items-center justify-between">
                          <span>Units Available in Bank</span>
                          <span className="font-extrabold text-slate-900 font-['Manrope']">
                            Total: {hospTotalUnits} Units
                          </span>
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
                          {BLOOD_GROUPS.map((bg) => {
                            const stock = hosp.bloodUnits[bg];
                            const units = stock?.units || 0;
                            const isSelected = selectedBloodGroup === bg;
                            const isCompatibleWithPatient =
                              patientBloodGroup ? getCompatibleBloodDonors(patientBloodGroup).includes(bg) : false;

                            let statusColor = 'bg-slate-50 border-slate-200 text-slate-900';
                            let badgeColor = 'bg-slate-200 text-slate-800';

                            if (units >= 20) {
                              statusColor = 'bg-emerald-50/60 border-emerald-200 text-emerald-950';
                              badgeColor = 'bg-emerald-100 text-emerald-800';
                            } else if (units >= 10) {
                              statusColor = 'bg-blue-50/50 border-blue-200 text-blue-950';
                              badgeColor = 'bg-blue-100 text-blue-800';
                            } else if (units >= 5) {
                              statusColor = 'bg-amber-50/60 border-amber-200 text-amber-950';
                              badgeColor = 'bg-amber-100 text-amber-800';
                            } else {
                              statusColor = 'bg-rose-50/70 border-rose-300 text-rose-950';
                              badgeColor = 'bg-rose-100 text-rose-800';
                            }

                            return (
                              <div
                                key={bg}
                                onClick={() => setSelectedBloodGroup(selectedBloodGroup === bg ? 'all' : bg)}
                                className={`p-2.5 rounded-2xl border text-center transition cursor-pointer ${statusColor} ${
                                  isSelected ? 'ring-2 ring-rose-500 shadow-xs' : 'hover:border-slate-400'
                                } ${isCompatibleWithPatient ? 'ring-2 ring-indigo-500 ring-offset-1' : ''}`}
                                title={`${hosp.hospitalName} - ${bg}: ${units} units`}
                              >
                                <div className="text-xs font-black font-['Manrope'] truncate">
                                  {bg === 'Bombay_hh' ? 'Bombay' : bg}
                                </div>
                                <div className="text-lg font-black font-['Manrope'] my-0.5">{units}</div>
                                <div className="text-[10px] text-slate-500 font-medium">units</div>

                                {stock?.components && (
                                  <div className="mt-1 pt-1 border-t border-slate-200/60 text-[9px] text-slate-500 space-y-0.5">
                                    <div>PRBC: {stock.components.prbc}</div>
                                    <div>Plat: {stock.components.platelets}</div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: ORGAN AVAILABILITY & TRANSPLANT REGISTRY          */}
          {/* ======================================================== */}
          {activeTab === 'organs' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Organ Filter Bar */}
              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-extrabold font-['Manrope'] text-slate-900">
                      Live Organ Procurement & Allocation Registry (NOTTO / SOTTO Network)
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Transplant-ready cadaveric & living donor organs with real-time Cold Ischemia Time limits.
                    </p>
                  </div>

                  {/* Donor Blood Filter */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600 font-['Manrope']">Donor Blood:</span>
                    <select
                      value={organBloodFilter}
                      onChange={(e) => setOrganBloodFilter(e.target.value)}
                      className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold font-['Manrope'] bg-slate-50"
                    >
                      <option value="all">All Blood Groups</option>
                      {BLOOD_GROUPS.map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Organ Type Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold font-['Manrope']">
                  <button
                    type="button"
                    onClick={() => setSelectedOrganType('all')}
                    className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                      selectedOrganType === 'all'
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>All Organs</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-800 text-[10px]">
                      {organListings.length}
                    </span>
                  </button>

                  {ORGAN_TYPES.map((ot) => {
                    const count = organListings.filter((o) => o.organType === ot.id).length;
                    return (
                      <button
                        key={ot.id}
                        type="button"
                        onClick={() => setSelectedOrganType(ot.id)}
                        className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                          selectedOrganType === ot.id
                            ? 'bg-rose-600 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <span>{ot.icon}</span>
                        <span>{ot.label}</span>
                        <span className="text-[10px] opacity-75 font-normal">({ot.maxCit})</span>
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                            selectedOrganType === ot.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* OUR LOCATION & DISTANCE RADAR PANEL */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-5 text-white shadow-md border border-indigo-800/40 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold font-['Manrope'] mb-2">
                      <LocateFixed className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isHindi ? 'हमारा स्थान एवं निकटता रडार' : 'Our Location & Proximity Radar'}</span>
                      <span className="text-blue-400">|</span>
                      <span className="text-emerald-300 font-semibold">{userLocationName}</span>
                    </div>
                    <h4 className="text-base sm:text-lg font-black font-['Manrope'] tracking-tight text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{isHindi ? 'सटीक दूरी एवं ग्रीन कॉरिडोर एम्बुलेंस रूटिंग' : 'Live Distance & Green Corridor Ambulance Routing'}</span>
                    </h4>
                    <p className="text-xs text-blue-100/75 mt-1 max-w-xl">
                      {isHindi
                        ? 'अपने वर्तमान जीपीएस स्थान से डोनर अस्पताल की सटीक दूरी, पारगमन समय (Transit Time) और तुरंत गूगल मैप्स नेविगेशन प्राप्त करें।'
                        : 'Accurate real-time distance from your exact position to transplant OTs, calculating optimal cold-ischemia transit times.'}
                    </p>
                  </div>

                  {/* Detect GPS Button */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleDetectAccurateLocation}
                      disabled={isDetectingLocation}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 text-xs font-black font-['Manrope'] shadow-md transition cursor-pointer"
                    >
                      <LocateFixed className={`w-4 h-4 ${isDetectingLocation ? 'animate-spin' : ''}`} />
                      <span>
                        {isDetectingLocation
                          ? (isHindi ? 'जीपीएस लॉक हो रहा है...' : 'Pinpointing GPS...')
                          : (isHindi ? 'सटीक जीपीएस स्थान लें' : 'Detect My Exact Location')}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Quick Presets & Filter Options */}
                <div className="relative z-10 mt-4 pt-3.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                  {/* City Presets */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-blue-200 font-bold text-[11px] font-['Manrope']">{isHindi ? 'त्वरित स्थान:' : 'Quick Hubs:'}</span>
                    {[
                      { name: 'South Delhi (Saket / AIIMS)', lat: 28.5284, lng: 77.2117 },
                      { name: 'Gurugram (Medanta)', lat: 28.4395, lng: 77.0428 },
                      { name: 'Central Delhi (Gangaram)', lat: 28.6385, lng: 77.1895 },
                      { name: 'Okhla (Fortis / Apollo)', lat: 28.5603, lng: 77.2773 },
                      { name: 'Noida (Sector 62)', lat: 28.6280, lng: 77.3649 },
                      { name: 'Mumbai Central', lat: 18.9712, lng: 72.8197 },
                    ].map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => handleSelectLocationPreset(preset.name, preset.lat, preset.lng)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                          userLocationName.includes(preset.name.split(' ')[0])
                            ? 'bg-white text-slate-900 font-bold shadow-xs'
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        {preset.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>

                  {/* Radius & Sorting */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-blue-200 text-[11px] font-bold">Max Distance:</span>
                      <select
                        value={organDistanceFilter}
                        onChange={(e) => setOrganDistanceFilter(e.target.value as any)}
                        className="bg-white/10 text-white rounded-lg px-2.5 py-1 text-xs border border-white/20 font-bold"
                      >
                        <option value="all" className="text-slate-900">All Distances</option>
                        <option value="10" className="text-slate-900">&lt; 10 km (Fastest)</option>
                        <option value="25" className="text-slate-900">&lt; 25 km (Green Corridor)</option>
                        <option value="50" className="text-slate-900">&lt; 50 km</option>
                        <option value="100" className="text-slate-900">&lt; 100 km</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-blue-200 text-[11px] font-bold">Sort By:</span>
                      <select
                        value={organSortBy}
                        onChange={(e) => setOrganSortBy(e.target.value as any)}
                        className="bg-white/10 text-white rounded-lg px-2.5 py-1 text-xs border border-white/20 font-bold"
                      >
                        <option value="distance" className="text-slate-900">Nearest Hospital First</option>
                        <option value="cit" className="text-slate-900">Cold Ischemia Urgency</option>
                        <option value="blood" className="text-slate-900">Blood Group Match</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Status messages */}
                {locationSuccessMsg && (
                  <div className="relative z-10 mt-3 p-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{locationSuccessMsg}</span>
                  </div>
                )}
                {locationErrorMsg && (
                  <div className="relative z-10 mt-3 p-2 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs flex items-center gap-2 font-medium">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{locationErrorMsg}</span>
                  </div>
                )}
              </div>

              {/* Organ Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredOrgans.map((organ) => {
                  const cit = formatCitRemaining(organ.coldIschemiaRemainingMinutes);
                  const isHeartOrLung = organ.organType === 'heart' || organ.organType === 'lungs';
                  const dist = getOrganDistance(organ);
                  const greenCorridorEta = Math.max(6, Math.round(dist * 1.4));
                  const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userCoords?.lat || ''},${userCoords?.lng || ''}&destination=${organ.coordinates?.lat || encodeURIComponent(organ.hospitalName + ', ' + organ.city)},${organ.coordinates?.lng || ''}`;

                  return (
                    <div
                      key={organ.id}
                      className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        {/* Top Organ Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-2xl flex items-center justify-center shrink-0">
                              {organ.organType === 'heart'
                                ? '❤️'
                                : organ.organType === 'lungs'
                                ? '🫁'
                                : organ.organType === 'liver'
                                ? '🩸'
                                : organ.organType === 'kidney'
                                ? '🩺'
                                : organ.organType === 'pancreas'
                                ? '🧬'
                                : '👁️'}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[11px] font-black font-['Manrope']">
                                  {organ.bloodGroup} Blood Group
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-['Manrope'] ${
                                    organ.status === 'available'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {organ.status.replace(/_/g, ' ')}
                                </span>
                              </div>
                              <h4 className="text-base font-extrabold font-['Manrope'] text-slate-900 mt-1">
                                {organ.organSubtype || `${organ.organType.toUpperCase()} Graft`}
                              </h4>
                            </div>
                          </div>

                          {/* Cold Ischemia Countdown Badge */}
                          <div
                            className={`p-2 rounded-2xl border text-right shrink-0 ${
                              cit.isCritical
                                ? 'bg-rose-50 border-rose-300 text-rose-900'
                                : 'bg-slate-50 border-slate-200 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-1 text-[11px] font-bold font-['Manrope'] justify-end">
                              <Timer className={`w-3.5 h-3.5 ${cit.isCritical ? 'text-rose-600 animate-pulse' : 'text-slate-500'}`} />
                              <span>CIT Clock</span>
                            </div>
                            <div className="text-xs font-black font-['Manrope'] mt-0.5 text-rose-700">
                              {cit.text}
                            </div>
                            <div className="text-[10px] text-slate-500">Max: {organ.maxColdIschemiaHours}h</div>
                          </div>
                        </div>

                        {/* Donor Details, Accurate Hospital Address & Real-time Distance */}
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
                          <div className="flex items-start justify-between gap-2 text-slate-700">
                            <div className="min-w-0">
                              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                                <Hospital className="w-3.5 h-3.5 text-indigo-600" />
                                <span>Donor Hospital</span>
                              </div>
                              <div className="font-black text-slate-900 font-['Manrope'] text-sm mt-0.5">
                                {organ.hospitalName}
                              </div>
                              {organ.address && (
                                <div className="text-[11px] text-slate-500 flex items-start gap-1 mt-0.5">
                                  <MapPin className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
                                  <span className="line-clamp-1">{organ.address}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Accurate Distance & Green Corridor ETA */}
                          <div className="p-2.5 rounded-xl bg-emerald-50/90 border border-emerald-200/80 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 font-bold text-emerald-950 font-['Manrope']">
                              <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                              <span>📍 {dist} km from your location</span>
                            </div>
                            <div className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                              <Truck className="w-3 h-3 text-emerald-600" />
                              <span>ETA: ~{greenCorridorEta} mins (Corridor)</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-slate-200/60">
                            <span>Donor Profile:</span>
                            <span className="font-medium text-slate-800">
                              {organ.donorAge}y {organ.donorGender} •{' '}
                              {organ.donorStatus === 'brain_dead_dbd' ? 'Brain Dead (DBD)' : 'Circulatory Death (DCD)'}
                            </span>
                          </div>
                          {organ.hlaTyping && (
                            <div className="flex items-center justify-between text-slate-600">
                              <span>HLA Typing:</span>
                              <span className="font-mono text-[11px] font-semibold text-indigo-700">{organ.hlaTyping}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between text-slate-600">
                            <span>Harvested At:</span>
                            <span className="text-slate-800 font-medium">{organ.harvestedAt}</span>
                          </div>
                        </div>

                        {/* Clinical Notes */}
                        {organ.notes && (
                          <p className="text-xs text-slate-600 italic bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/70">
                            "{organ.notes}"
                          </p>
                        )}
                      </div>

                      {/* Action Bar */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div className="text-[11px] text-slate-500 truncate max-w-[160px]">
                          Coord: <strong>{organ.transplantCoordinator.name}</strong>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Map Directions */}
                          <a
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-1.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition flex items-center gap-1 border border-blue-200 cursor-pointer"
                            title="Open Directions in Google Maps"
                          >
                            <MapPin className="w-3 h-3 text-blue-600" />
                            <span>{isHindi ? 'रूट' : 'Route'}</span>
                          </a>

                          <a
                            href={`tel:${organ.transplantCoordinator.contact}`}
                            className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center gap-1"
                            title="Call Transplant Coordinator"
                          >
                            <Phone className="w-3 h-3 text-blue-600" />
                            <span>Call</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => {
                              setTransferSourceHosp(organ.hospitalName);
                              setTransferType('organ');
                              setTransferItemText(`${organ.organSubtype || organ.organType} (${organ.bloodGroup})`);
                              setTransferUrgency('stat_immediate');
                              setShowTransferModal(true);
                            }}
                            className="py-1.5 px-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs font-['Manrope'] transition shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Dispatch Green Corridor</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: EMERGENCY INTER-HOSPITAL TRANSFERS                */}
          {/* ======================================================== */}
          {activeTab === 'transfers' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base sm:text-lg font-black font-['Manrope'] text-slate-900 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-emerald-600" />
                    <span>Emergency Inter-Hospital Transport & Green Corridor Monitoring</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                    Dedicated cold-chain blood courier dispatch and police green corridors for organ transplantation between city hospitals.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowTransferModal(true)}
                  className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs font-['Manrope'] shadow-xs transition flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Initiate Emergency Transfer</span>
                </button>
              </div>

              {/* Transfers List */}
              <div className="space-y-4">
                {transferRequests.map((tr) => (
                  <div
                    key={tr.id}
                    className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4 hover:shadow-sm transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-black font-['Manrope'] ${
                            tr.transferType === 'organ'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {tr.transferType === 'organ' ? '🫀 ORGAN TRANSIT' : '🩸 BLOOD TRANSFER'}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-['Manrope'] ${
                            tr.status === 'green_corridor_active'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse'
                              : tr.status === 'in_transit'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {tr.status.replace(/_/g, ' ').toUpperCase()}
                        </span>
                        {tr.policeEscort && (
                          <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-black border border-indigo-200 flex items-center gap-1">
                            🚨 Police Escort Active
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-500 font-semibold">
                        ETA: <strong className="text-emerald-700 font-black font-['Manrope']">~{tr.etaMinutes} mins</strong>
                      </div>
                    </div>

                    {/* Route Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                        <span className="text-[10px] font-bold text-slate-500 uppercase font-['Manrope']">
                          Source Hospital
                        </span>
                        <div className="font-extrabold text-slate-900 font-['Manrope'] text-sm mt-0.5">
                          {tr.sourceHospital}
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                        <span className="text-[10px] font-bold text-slate-500 uppercase font-['Manrope']">
                          Destination Hospital
                        </span>
                        <div className="font-extrabold text-slate-900 font-['Manrope'] text-sm mt-0.5">
                          {tr.destinationHospital}
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                        <span className="text-[10px] font-bold text-slate-500 uppercase font-['Manrope']">
                          Items in Transit
                        </span>
                        <div className="font-extrabold text-rose-700 font-['Manrope'] text-sm mt-0.5">
                          {tr.itemDetails}
                        </div>
                      </div>
                    </div>

                    {/* Vehicle & Physician Note */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600 pt-1">
                      <div>
                        Vehicle: <strong className="font-mono">{tr.ambulanceVehiclePlate || 'Medical Ambulance'}</strong> •
                        Requester: <strong>{tr.requesterDoctor}</strong>
                      </div>
                      <div className="text-slate-500 italic">"{tr.notes}"</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: ADD / UPDATE HOSPITAL INVENTORY                    */}
          {/* ======================================================== */}
          {activeTab === 'manage' && (
            <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-5">
                <div>
                  <h3 className="text-lg font-black font-['Manrope'] text-slate-900">
                    Add or Update Hospital Inventory
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Log newly donated blood units or register a cadaveric/living donor organ available for inter-hospital allocation.
                  </p>
                </div>

                {manageSuccessMsg && (
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{manageSuccessMsg}</span>
                  </div>
                )}

                {/* Switcher: Blood or Organ */}
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setManageMode('blood')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold font-['Manrope'] transition cursor-pointer flex items-center justify-center gap-2 ${
                      manageMode === 'blood' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    <Droplet className="w-4 h-4" />
                    <span>Add Blood Units</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setManageMode('organ')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold font-['Manrope'] transition cursor-pointer flex items-center justify-center gap-2 ${
                      manageMode === 'organ' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    <Heart className="w-4 h-4" />
                    <span>Register Donor Organ</span>
                  </button>
                </div>

                {/* FORM A: ADD BLOOD UNITS */}
                {manageMode === 'blood' ? (
                  <form onSubmit={handleAddBloodSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Select Hospital *</label>
                      <select
                        value={inputHospId}
                        onChange={(e) => setInputHospId(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                        required
                      >
                        {bloodInventories.map((h) => (
                          <option key={h.hospitalId} value={h.hospitalId}>
                            {h.hospitalName} ({h.city})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Blood Group *</label>
                        <select
                          value={inputBloodGroup}
                          onChange={(e) => setInputBloodGroup(e.target.value as BloodGroup)}
                          className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-rose-700"
                        >
                          {BLOOD_GROUPS.map((bg) => (
                            <option key={bg} value={bg}>
                              {bg}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Component Type *</label>
                        <select
                          value={inputComponent}
                          onChange={(e) => setInputComponent(e.target.value as BloodComponentType)}
                          className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                        >
                          <option value="prbc">Packed Red Blood Cells (PRBC)</option>
                          <option value="platelets">Platelet Concentrate / SDP</option>
                          <option value="ffp">Fresh Frozen Plasma (FFP)</option>
                          <option value="whole_blood">Whole Blood</option>
                          <option value="cryoprecipitate">Cryoprecipitate</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Units to Add *</label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={inputUnits}
                          onChange={(e) => setInputUnits(Number(e.target.value))}
                          className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm font-['Manrope'] shadow-xs transition cursor-pointer active:scale-98"
                    >
                      Update Hospital Blood Stock
                    </button>
                  </form>
                ) : (
                  /* FORM B: REGISTER DONOR ORGAN */
                  <form onSubmit={handleRegisterOrganSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Donor Hospital *</label>
                      <select
                        value={inputHospId}
                        onChange={(e) => setInputHospId(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                        required
                      >
                        {bloodInventories.map((h) => (
                          <option key={h.hospitalId} value={h.hospitalId}>
                            {h.hospitalName} ({h.city})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Organ Type *</label>
                        <select
                          value={inputOrganType}
                          onChange={(e) => {
                            const ot = e.target.value as OrganType;
                            setInputOrganType(ot);
                            if (ot === 'heart') setInputMaxHours(5);
                            else if (ot === 'lungs') setInputMaxHours(8);
                            else if (ot === 'liver') setInputMaxHours(12);
                            else if (ot === 'kidney') setInputMaxHours(36);
                            else if (ot === 'pancreas') setInputMaxHours(18);
                            else if (ot === 'corneas') setInputMaxHours(336);
                          }}
                          className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                        >
                          {ORGAN_TYPES.map((ot) => (
                            <option key={ot.id} value={ot.id}>
                              {ot.icon} {ot.label} ({ot.maxCit})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Organ Subtype / Anatomical Details</label>
                        <input
                          type="text"
                          placeholder="e.g. Right Kidney, Single Artery"
                          value={inputOrganSubtype}
                          onChange={(e) => setInputOrganSubtype(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Donor Blood Group *</label>
                        <select
                          value={inputDonorBlood}
                          onChange={(e) => setInputDonorBlood(e.target.value as BloodGroup)}
                          className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                        >
                          {BLOOD_GROUPS.map((bg) => (
                            <option key={bg} value={bg}>
                              {bg}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Donor Age & Gender</label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="1"
                            max="90"
                            value={inputDonorAge}
                            onChange={(e) => setInputDonorAge(Number(e.target.value))}
                            className="w-16 p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                          />
                          <select
                            value={inputDonorGender}
                            onChange={(e) => setInputDonorGender(e.target.value as any)}
                            className="flex-1 p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Max Cold Ischemia (Hours)</label>
                        <input
                          type="number"
                          min="1"
                          max="400"
                          value={inputMaxHours}
                          onChange={(e) => setInputMaxHours(Number(e.target.value))}
                          className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">HLA Typing / Alleles</label>
                        <input
                          type="text"
                          placeholder="e.g. HLA-A*02, B*44, DRB1*04"
                          value={inputHla}
                          onChange={(e) => setInputHla(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Transplant Coordinator Phone *</label>
                        <input
                          type="text"
                          placeholder="e.g. +91 98111 22334"
                          value={inputCoordPhone}
                          onChange={(e) => setInputCoordPhone(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm font-['Manrope'] shadow-xs transition cursor-pointer active:scale-98"
                    >
                      Register Organ for Inter-Hospital Matching
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* MODAL FOOTER                                              */}
        {/* ======================================================== */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-500">
            <ShieldAlert className="w-4 h-4 text-emerald-600" />
            <span>
              Connected to National & State Organ & Blood Networks (e-RaktKosh / NOTTO Inter-Hospital Protocol).
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold font-['Manrope'] transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

      {/* ======================================================== */}
      {/* SUB-MODAL: INITIATE INTER-HOSPITAL EMERGENCY TRANSFER   */}
      {/* ======================================================== */}
      {showTransferModal && (
        <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold font-['Manrope'] text-slate-900">
                  Request Inter-Hospital Emergency Transfer
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTransferModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {transferSuccessMessage ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>{transferSuccessMessage}</span>
              </div>
            ) : (
              <form onSubmit={handleInitiateTransfer} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setTransferType('blood')}
                    className={`py-1.5 rounded-lg font-bold font-['Manrope'] transition ${
                      transferType === 'blood' ? 'bg-white text-rose-700 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    🩸 Blood Transfer
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransferType('organ')}
                    className={`py-1.5 rounded-lg font-bold font-['Manrope'] transition ${
                      transferType === 'organ' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    🫀 Organ Transfer
                  </button>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Source Hospital (Holding Units) *</label>
                  <input
                    type="text"
                    value={transferSourceHosp}
                    onChange={(e) => setTransferSourceHosp(e.target.value)}
                    placeholder="e.g. AIIMS Central Blood Bank"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Destination Hospital (Recipient OT) *</label>
                  <input
                    type="text"
                    value={transferDestHosp}
                    onChange={(e) => setTransferDestHosp(e.target.value)}
                    placeholder="e.g. Fortis Escorts Heart Institute (OT 3)"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Items / Units Details *</label>
                  <input
                    type="text"
                    value={transferItemText}
                    onChange={(e) => setTransferItemText(e.target.value)}
                    placeholder="e.g. 4 Units O- Negative PRBC or Donor Heart"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-rose-700"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Urgency Level *</label>
                    <select
                      value={transferUrgency}
                      onChange={(e) => setTransferUrgency(e.target.value as InterHospitalTransferUrgency)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                    >
                      <option value="stat_immediate">🚨 STAT Immediate (Green Corridor)</option>
                      <option value="urgent_within_2h">⚡ Urgent (Within 2 Hours)</option>
                      <option value="scheduled">📅 Scheduled Transport</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Requester Doctor / Unit</label>
                    <input
                      type="text"
                      value={transferDoctor}
                      onChange={(e) => setTransferDoctor(e.target.value)}
                      placeholder="e.g. Dr. Airan (Transplant Lead)"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Emergency Operational Notes</label>
                  <textarea
                    rows={2}
                    value={transferNotes}
                    onChange={(e) => setTransferNotes(e.target.value)}
                    placeholder="e.g. Patient on bypass. Coordinate with Traffic Police for Outer Ring Road green corridor."
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowTransferModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold font-['Manrope']"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black font-['Manrope'] shadow-xs"
                  >
                    Confirm & Dispatch
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
