import React, { useState, useEffect } from 'react';
import {
  X,
  Truck,
  Snowflake,
  ShieldCheck,
  AlertTriangle,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  Activity,
  BatteryCharging,
  Compass,
  FileText,
  Navigation,
  Sparkles,
  QrCode,
  ArrowRight,
  Plus,
  Trash2,
  ShoppingBag,
  Hospital,
  Pill,
  Stethoscope,
  ChevronRight,
  Check,
  RefreshCw,
  Search,
  ExternalLink,
  PackageCheck,
  BadgeAlert
} from 'lucide-react';
import { MedicineTransportRequest, TransportPriority, TransportVehicleType, HealthcareFacility } from '../../types';
import { useLanguage } from '../../services/i18n';

interface TransportItem {
  id: string;
  name: string;
  category: 'chronic_rx' | 'emergency' | 'cold_chain' | 'antibiotics_acute' | 'pediatric_syrup';
  priceRupees: number;
  quantity: number;
  isColdRequired?: boolean;
  rxRequired?: boolean;
}

// Preset Quick Catalog of Essential & Prescription Medicines for Transport
const CATALOG_ITEMS: Omit<TransportItem, 'quantity'>[] = [
  // Emergency & Cardiac Medicines
  { id: 'cat-med-em1', name: 'Nitroglycerin Sublingual 0.5mg (Emergency Angina)', category: 'emergency', priceRupees: 110, isColdRequired: false, rxRequired: true },
  { id: 'cat-med-em2', name: 'Salbutamol Asthalin Inhaler (200 MDI)', category: 'emergency', priceRupees: 165, isColdRequired: false, rxRequired: true },
  { id: 'cat-med-em3', name: 'Sorbitrate 10mg Sublingual (Chest Pain)', category: 'emergency', priceRupees: 65, isColdRequired: false, rxRequired: true },
  { id: 'cat-med-em4', name: 'Disprin Soluble Aspirin 300mg (Emergency SOS)', category: 'emergency', priceRupees: 18, isColdRequired: false, rxRequired: false },
  { id: 'cat-med-em5', name: 'Budecort 200 Inhaler (Budesonide Respiratory)', category: 'emergency', priceRupees: 310, isColdRequired: false, rxRequired: true },
  { id: 'cat-med-em6', name: 'EpiPen Auto-Injector 0.3mg (Severe Anaphylaxis)', category: 'emergency', priceRupees: 4200, isColdRequired: true, rxRequired: true },

  // Cold-Chain Insulins & Injections (2-8°C)
  { id: 'cat-med-cc1', name: 'Lantus Insulin Solostar Pen (100 IU/ml Glargine)', category: 'cold_chain', priceRupees: 685, isColdRequired: true, rxRequired: true },
  { id: 'cat-med-cc2', name: 'Humalog Rapid Insulin Cartridge (100 IU/ml)', category: 'cold_chain', priceRupees: 590, isColdRequired: true, rxRequired: true },
  { id: 'cat-med-cc3', name: 'Mixtard 30/70 Insulin FlexPen 100 IU/ml', category: 'cold_chain', priceRupees: 460, isColdRequired: true, rxRequired: true },
  { id: 'cat-med-cc4', name: 'Tetanus Toxoid 0.5ml Sterile Ampoule', category: 'cold_chain', priceRupees: 35, isColdRequired: true, rxRequired: false },
  { id: 'cat-med-cc5', name: 'Hepatitis B Recombinant Vaccine (Adult Dose)', category: 'cold_chain', priceRupees: 280, isColdRequired: true, rxRequired: true },
  { id: 'cat-med-cc6', name: 'Tobramycin + Dexamethasone Sterile Eye Drops', category: 'cold_chain', priceRupees: 145, isColdRequired: true, rxRequired: true },

  // Chronic & Daily Rx Medicines
  { id: 'cat-med-rx1', name: 'Metformin 500mg SR Glycomet (30 Tablets)', category: 'chronic_rx', priceRupees: 65, isColdRequired: false, rxRequired: true },
  { id: 'cat-med-rx2', name: 'Telmisartan 40mg + Amlodipine 5mg (30 Tabs)', category: 'chronic_rx', priceRupees: 185, isColdRequired: false, rxRequired: true },
  { id: 'cat-med-rx3', name: 'Atorvastatin 20mg Lipitor (15 Tablets)', category: 'chronic_rx', priceRupees: 210, isColdRequired: false, rxRequired: true },
  { id: 'cat-med-rx4', name: 'Thyronorm 50mcg Levothyroxine (120 Tablets)', category: 'chronic_rx', priceRupees: 195, isColdRequired: false, rxRequired: true },
  { id: 'cat-med-rx5', name: 'Montair-LC (Montelukast + Levocetirizine - 15s)', category: 'chronic_rx', priceRupees: 245, isColdRequired: false, rxRequired: true },
  { id: 'cat-med-rx6', name: 'Pantoprazole 40mg + Domperidone (Pan-D 15s)', category: 'chronic_rx', priceRupees: 195, isColdRequired: false, rxRequired: true },

  // Antibiotics & Acute Medicines
  { id: 'cat-med-ab1', name: 'Augmentin 625 Duo (Amoxicillin + Clavulanate 10s)', category: 'antibiotics_acute', priceRupees: 205, isColdRequired: false, rxRequired: true },
  { id: 'cat-med-ab2', name: 'Paracetamol 650mg Dolo (15 Tablets)', category: 'antibiotics_acute', priceRupees: 32, isColdRequired: false, rxRequired: false },
  { id: 'cat-med-ab3', name: 'Azithromycin 500mg Azithral (5 Tablets)', category: 'antibiotics_acute', priceRupees: 130, isColdRequired: false, rxRequired: true },
  { id: 'cat-med-ab4', name: 'Cifran 500mg Ciprofloxacin (10 Tablets)', category: 'antibiotics_acute', priceRupees: 95, isColdRequired: false, rxRequired: true },
  { id: 'cat-med-ab5', name: 'Meftal-Spas Pain Relief (10 Tablets)', category: 'antibiotics_acute', priceRupees: 55, isColdRequired: false, rxRequired: false },

  // Pediatric & Syrups
  { id: 'cat-med-ped1', name: 'Calpol 250mg Paediatric Paracetamol Syrup (60ml)', category: 'pediatric_syrup', priceRupees: 48, isColdRequired: false, rxRequired: false },
  { id: 'cat-med-ped2', name: 'ORS Electrolyte Rehydration Powder (Pack of 5)', category: 'pediatric_syrup', priceRupees: 95, isColdRequired: false, rxRequired: false },
  { id: 'cat-med-ped3', name: 'Ascoril-LS Mucolytic Cough Expectorant (100ml)', category: 'pediatric_syrup', priceRupees: 125, isColdRequired: false, rxRequired: true },
  { id: 'cat-med-ped4', name: 'Zincovit Multivitamin Drops for Infants (15ml)', category: 'pediatric_syrup', priceRupees: 65, isColdRequired: false, rxRequired: false },
];

// Verified Presets for Nearby Pharmacies and Hospitals
const PRESET_PHARMACIES = [
  {
    name: 'Apollo Pharmacy 24/7 (Sector 14 Healthcare Hub)',
    address: 'Plot 14, Main Market, Sector 14',
    phone: '+91 11 4455 6677',
    distance: '0.6 km',
    type: 'pharmacy' as const,
  },
  {
    name: 'MedPlus Chemist & Druggist (Sector 8)',
    address: 'Shop 4, Commercial Complex, Sector 8',
    phone: '+91 11 4102 9900',
    distance: '1.2 km',
    type: 'pharmacy' as const,
  },
  {
    name: 'Wellness Forever 24-Hour Pharmacy',
    address: 'Ground Floor, Ring Road Corner',
    phone: '+91 11 2688 4400',
    distance: '1.8 km',
    type: 'pharmacy' as const,
  },
  {
    name: 'Guardian Pharmacy & Surgical Emporium',
    address: 'B-Block Market, Saket',
    phone: '+91 11 4987 1234',
    distance: '2.5 km',
    type: 'pharmacy' as const,
  },
];

const PRESET_HOSPITALS = [
  {
    name: 'Max Super Speciality Hospital Emergency Pharmacy',
    address: '1 Press Enclave Marg, Saket, New Delhi',
    phone: '+91 11 2651 5050',
    distance: '2.2 km',
    type: 'hospital' as const,
  },
  {
    name: 'Fortis Escorts Heart Institute OPD Dispensary',
    address: 'Okhla Road, Sukhdev Vihar, New Delhi',
    phone: '+91 11 4713 5000',
    distance: '3.5 km',
    type: 'hospital' as const,
  },
  {
    name: 'AIIMS Central OPD Pharmacy & Medicine Depot',
    address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi',
    phone: '+91 11 2658 8500',
    distance: '4.1 km',
    type: 'hospital' as const,
  },
  {
    name: 'Apollo Hospital Central Medical Supply Hub',
    address: 'Mathura Road, Sarita Vihar, New Delhi',
    phone: '+91 11 2692 5858',
    distance: '3.8 km',
    type: 'hospital' as const,
  },
];

interface MedicineTransportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRequests: MedicineTransportRequest[];
  onBookTransport: (req: Omit<MedicineTransportRequest, 'id'>) => void;
  prefillMedicineName?: string;
  prefillFacility?: HealthcareFacility;
}

export const MedicineTransportModal: React.FC<MedicineTransportModalProps> = ({
  isOpen,
  onClose,
  activeRequests,
  onBookTransport,
  prefillMedicineName,
  prefillFacility,
}) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [activeTab, setActiveTab] = useState<'track' | 'book'>('track');
  const [selectedRequestId, setSelectedRequestId] = useState<string>(activeRequests[0]?.id || '');

  // Facility Origin State
  const [originType, setOriginType] = useState<'pharmacy' | 'hospital'>('pharmacy');
  const [selectedOriginFacility, setSelectedOriginFacility] = useState(
    prefillFacility
      ? {
          name: prefillFacility.name,
          address: prefillFacility.address,
          phone: prefillFacility.phone || '+91 11 4455 6677',
          type: prefillFacility.type === 'hospital' || prefillFacility.type === 'emergency' ? 'hospital' : 'pharmacy',
        }
      : PRESET_PHARMACIES[0]
  );
  const [customOriginName, setCustomOriginName] = useState('');
  const [customOriginAddress, setCustomOriginAddress] = useState('');
  const [customOriginPhone, setCustomOriginPhone] = useState('');
  const [isUsingCustomOrigin, setIsUsingCustomOrigin] = useState(false);

  // Cart / Items to Order
  const [orderBasket, setOrderBasket] = useState<TransportItem[]>([]);
  const [catalogCategory, setCatalogCategory] = useState<'all' | 'chronic_rx' | 'emergency' | 'cold_chain' | 'antibiotics_acute' | 'pediatric_syrup'>('all');
  const [searchCatalogQuery, setSearchCatalogQuery] = useState('');

  // Custom Item Entry
  const [customItemName, setCustomItemName] = useState('');
  const [customItemCategory, setCustomItemCategory] = useState<'chronic_rx' | 'emergency' | 'cold_chain' | 'antibiotics_acute' | 'pediatric_syrup'>('chronic_rx');
  const [customItemPrice, setCustomItemPrice] = useState(150);

  // Booking Form Details
  const [bookPriority, setBookPriority] = useState<TransportPriority>('express_coldchain');
  const [bookVehicle, setBookVehicle] = useState<TransportVehicleType>('coldbox_bike');
  const [bookRecipientName, setBookRecipientName] = useState('Rajesh Sharma');
  const [bookRecipientPhone, setBookRecipientPhone] = useState('+91 98765 43210');
  const [bookDestination, setBookDestination] = useState('Flat 402, Lotus Greens Boulevard, Sector 12');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [hasPrescription, setHasPrescription] = useState(true);

  // Prefill handling
  useEffect(() => {
    if (prefillMedicineName) {
      const names = prefillMedicineName.includes(',')
        ? prefillMedicineName.split(',').map((s) => s.trim()).filter(Boolean)
        : [prefillMedicineName.trim()];

      const items: TransportItem[] = names.map((name, i) => {
        const match = CATALOG_ITEMS.find((c) => c.name.toLowerCase().includes(name.toLowerCase()));
        if (match) {
          return { ...match, quantity: 1 };
        }
        return {
          id: `item-${Date.now()}-${i}`,
          name,
          category: 'chronic_rx' as const,
          priceRupees: 180 + (i * 20),
          quantity: 1,
          isColdRequired:
            name.toLowerCase().includes('insulin') ||
            name.toLowerCase().includes('syrup') ||
            name.toLowerCase().includes('injection') ||
            name.toLowerCase().includes('drops'),
          rxRequired: true,
        };
      });

      if (items.length > 0) {
        setOrderBasket(items);
        setActiveTab('book');
      }
    }
  }, [prefillMedicineName]);

  useEffect(() => {
    if (prefillFacility) {
      const isHosp = prefillFacility.type === 'hospital' || prefillFacility.type === 'emergency';
      setOriginType(isHosp ? 'hospital' : 'pharmacy');
      setSelectedOriginFacility({
        name: prefillFacility.name,
        address: prefillFacility.address,
        phone: prefillFacility.phone || '+91 11 4455 6677',
        type: isHosp ? 'hospital' : 'pharmacy',
      });
      setActiveTab('book');
    }
  }, [prefillFacility]);

  // Selected request for live tracking
  const currentRequest = activeRequests.find((r) => r.id === selectedRequestId) || activeRequests[0];

  const [simulatedEta, setSimulatedEta] = useState<number>(currentRequest?.etaMinutes || 14);

  // Advance milestone simulation handler
  const [liveStatus, setLiveStatus] = useState<string>(currentRequest?.status || 'in_transit');

  useEffect(() => {
    if (currentRequest) {
      setLiveStatus(currentRequest.status);
    }
  }, [currentRequest]);

  if (!isOpen) return null;

  // Add item from catalog to basket
  const handleAddItemToBasket = (catalogItem: Omit<TransportItem, 'quantity'>) => {
    setOrderBasket((prev) => {
      const existing = prev.find((i) => i.name === catalogItem.name);
      if (existing) {
        return prev.map((i) => (i.name === catalogItem.name ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...catalogItem, quantity: 1 }];
    });
  };

  // Add custom typed item
  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customItemName.trim()) return;

    const newItem: TransportItem = {
      id: `custom-${Date.now()}`,
      name: customItemName.trim(),
      category: customItemCategory,
      priceRupees: Number(customItemPrice) || 120,
      quantity: 1,
      isColdRequired:
        customItemName.toLowerCase().includes('insulin') ||
        customItemName.toLowerCase().includes('vaccine') ||
        customItemName.toLowerCase().includes('injection') ||
        customItemCategory === 'cold_chain',
      rxRequired: customItemCategory === 'chronic_rx' || customItemCategory === 'emergency' || customItemCategory === 'cold_chain',
    };

    setOrderBasket((prev) => [...prev, newItem]);
    setCustomItemName('');
  };

  // Update quantity in basket
  const handleUpdateQuantity = (name: string, delta: number) => {
    setOrderBasket((prev) =>
      prev
        .map((i) => (i.name === name ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  // Remove item from basket
  const handleRemoveItem = (name: string) => {
    setOrderBasket((prev) => prev.filter((i) => i.name !== name));
  };

  // Calculate Subtotals
  const itemsSubtotal = orderBasket.reduce((sum, item) => sum + item.priceRupees * item.quantity, 0);
  const transportFare = bookPriority === 'emergency_critical' ? 299 : bookVehicle === 'medical_ambulance_van' ? 399 : 149;
  const grandTotal = itemsSubtotal + transportFare;

  // Submit Booking
  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderBasket.length === 0) return;

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const trackingCode = `MED-TR-${randomSuffix}`;
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    const originFacilityData = isUsingCustomOrigin
      ? {
          name: customOriginName || (originType === 'pharmacy' ? 'Local Neighborhood Chemist' : 'City General Hospital'),
          address: customOriginAddress || 'Healthcare District',
          phone: customOriginPhone || '+91 11 4455 6677',
          type: originType,
        }
      : selectedOriginFacility;

    const hasCold = orderBasket.some((i) => i.isColdRequired);

    const newReq: Omit<MedicineTransportRequest, 'id'> = {
      trackingCode,
      medicineNames: orderBasket.map((i) => `${i.name} (x${i.quantity})`),
      priority: bookPriority,
      vehicleType: bookVehicle,
      status: 'in_transit',
      originFacility: {
        name: originFacilityData.name,
        address: originFacilityData.address,
        phone: originFacilityData.phone,
        type: originFacilityData.type as 'pharmacy' | 'hospital' | 'clinic' | undefined,
      },
      destinationAddress: {
        recipientName: bookRecipientName.trim() || 'Patient',
        address: bookDestination.trim() || 'Home Address',
        phone: bookRecipientPhone.trim() || '+91 98765 43210',
      },
      courier: {
        name: bookVehicle === 'coldbox_bike' ? 'Mohit Rawat' : 'Arjun Kulkarni',
        phone: '+91 98123 45678',
        vehiclePlate: bookVehicle === 'coldbox_bike' ? 'DL-03-MED-8120' : 'DL-01-AMB-2200',
        rating: 4.96,
        completedTrips: 840,
      },
      coldChain: {
        currentTempCelsius: hasCold ? 4.1 : 21.0,
        targetMinTemp: hasCold ? 2.0 : 15.0,
        targetMaxTemp: hasCold ? 8.0 : 25.0,
        isColdChainIntact: true,
        containerSealStatus: 'sealed_intact',
        batteryPercent: 96,
        humidityPercent: 42,
        lastReadingTime: 'Just now (Live IoT Sensor)',
        historyReadings: [
          { time: '10:00', temp: 4.0 },
          { time: '10:10', temp: 4.1 },
          { time: '10:20', temp: 4.1 },
        ],
      },
      etaMinutes: bookPriority === 'emergency_critical' ? 18 : 25,
      tamperSealCode: `SEAL-${randomSuffix}-OK`,
      deliveryOtp: otp,
      bookedAt: 'Just now',
      estimatedDeliveryTime: 'Within 25 mins',
      fareAmountRupees: grandTotal,
      originType,
      itemsDetail: orderBasket.map((i) => ({
        name: i.name,
        category: i.category,
        quantity: i.quantity,
        priceRupees: i.priceRupees,
      })),
      notes: deliveryInstructions,
      rxRequired: orderBasket.some((i) => i.rxRequired),
    };

    onBookTransport(newReq);
    setActiveTab('track');
  };

  // Filter Catalog
  const filteredCatalog = CATALOG_ITEMS.filter((item) => {
    if (catalogCategory !== 'all' && item.category !== catalogCategory) return false;
    if (searchCatalogQuery.trim()) {
      return item.name.toLowerCase().includes(searchCatalogQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs font-['Inter']"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="min-h-full flex items-center justify-center p-2 sm:p-4 md:p-6">
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[90vh] max-h-[860px] my-auto"
        >
        {/* ======================================================== */}
        {/* MODAL HEADER                                              */}
        {/* ======================================================== */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white shrink-0 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-200 text-xs font-bold font-['Manrope'] mb-2">
                <Truck className="w-3.5 h-3.5 text-cyan-300" />
                <span>{isHindi ? 'दवा परिवहन एवं त्वरित डिलीवरी' : 'Medicine Transportation Facility'}</span>
                <span className="text-cyan-400">|</span>
                <span className="text-emerald-300">15-30 Min Rapid Dispatch</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-['Manrope'] tracking-tight text-white flex items-center gap-2.5">
                <PackageCheck className="w-6 h-6 text-cyan-400" />
                <span>{isHindi ? 'फार्मेसी और अस्पताल से दवा डिलीवरी' : 'Medicine Transport from Pharmacy & Hospitals'}</span>
              </h2>
              <p className="text-xs sm:text-sm text-cyan-100/80 mt-1 max-w-xl">
                {isHindi
                  ? 'प्रिस्क्रिप्शन दवाइयां, आपातकालीन और क्रॉनिक दवाएं पास की फार्मेसी या अस्पताल से सीधे अपने घर मंगवाएं।'
                  : 'Order prescription medicines, emergency SOS pills, and chronic refills with rapid courier delivery directly to your door.'}
              </p>
            </div>

            {/* Navigation Tabs Switcher & Close */}
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <div className="flex items-center bg-white/10 p-1 rounded-xl border border-white/15">
                <button
                  type="button"
                  onClick={() => setActiveTab('track')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-['Manrope'] transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'track' ? 'bg-cyan-500 text-slate-950 font-black shadow-xs' : 'text-cyan-200 hover:text-white'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'लाइव ट्रैकिंग' : 'Live Tracking'} ({activeRequests.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('book')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-['Manrope'] transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'book' ? 'bg-cyan-500 text-slate-950 font-black shadow-xs' : 'text-cyan-200 hover:text-white'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'नया ऑर्डर करें' : 'Order & Deliver'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                aria-label="Close transport modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: LIVE TRACKING & DISPATCH DETAILS                  */}
        {/* ======================================================== */}
        {activeTab === 'track' && (
          <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 bg-slate-50/70 space-y-5">
            {/* Request Selector if multiple */}
            {activeRequests.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {activeRequests.map((req) => (
                  <button
                    key={req.id}
                    type="button"
                    onClick={() => {
                      setSelectedRequestId(req.id);
                      setSimulatedEta(req.etaMinutes);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold font-['Manrope'] border transition whitespace-nowrap cursor-pointer ${
                      currentRequest?.id === req.id
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span>{req.trackingCode}</span>
                    <span className="text-[10px] opacity-75 font-normal">
                      ({req.status === 'delivered' ? 'Delivered' : `ETA ${req.etaMinutes}m`})
                    </span>
                  </button>
                ))}
              </div>
            )}

            {currentRequest ? (
              <div className="space-y-5">
                {/* 1. Live Dispatch & Route Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Status Banner */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-950 text-white border border-blue-800 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 font-['Manrope']">
                        Delivery Status
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        In Motion
                      </span>
                    </div>

                    <div className="text-2xl font-black font-['Manrope'] text-white">
                      {liveStatus === 'delivered'
                        ? 'Delivered'
                        : liveStatus === 'arriving'
                        ? 'Arriving Soon'
                        : 'On Route to You'}
                    </div>

                    <p className="text-xs text-cyan-100/90 mt-1">
                      ETA: ~<strong>{simulatedEta} Minutes</strong> • {currentRequest.courier.name}
                    </p>

                    <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="text-cyan-200">Delivery OTP:</span>
                      <span className="font-mono font-black text-sm bg-white/20 px-2 py-0.5 rounded-md text-white tracking-widest">
                        {currentRequest.deliveryOtp}
                      </span>
                    </div>
                  </div>

                  {/* Dispatch Route & Package Verification */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-semibold font-['Manrope']">Dispatch Route</span>
                        <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-[10px] font-bold">
                          Direct Transport
                        </span>
                      </div>

                      <div className="mt-2 space-y-1">
                        <div className="text-xs font-bold text-slate-800 truncate flex items-center gap-1.5">
                          <Hospital className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="truncate">{currentRequest.originFacility.name}</span>
                        </div>
                        <div className="text-xs text-slate-600 truncate flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{currentRequest.destinationAddress.address}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 pt-1 border-t border-slate-100">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Security Tamper Seal: {currentRequest.tamperSealCode}
                    </p>
                  </div>

                  {/* Courier & Vehicle */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-500 font-semibold">Medical Courier</span>
                        <span className="font-bold text-amber-600">★ {currentRequest.courier.rating}</span>
                      </div>
                      <h4 className="text-sm font-extrabold font-['Manrope'] text-slate-900">
                        {currentRequest.courier.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        {currentRequest.courier.vehiclePlate}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <a
                        href={`tel:${currentRequest.courier.phone}`}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center justify-center gap-1.5"
                      >
                        <Phone className="w-3 h-3 text-blue-600" />
                        <span>Call Driver</span>
                      </a>
                      <a
                        href={`tel:${currentRequest.originFacility.phone}`}
                        className="py-1.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs transition flex items-center gap-1"
                        title="Call Pharmacy / Hospital"
                      >
                        <Hospital className="w-3 h-3" />
                        <span>Facility</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* 2. Visual Delivery Milestone Stepper */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-['Manrope'] mb-4">
                    Live Transit Milestones
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
                    {[
                      { step: 1, title: 'Order Confirmed', desc: 'Received at Pharmacy / Hospital', active: true, done: true },
                      { step: 2, title: 'Verified & Packed', desc: 'Medical tamper seal applied', active: true, done: true },
                      { step: 3, title: 'Courier Dispatched', desc: 'In transit via GPS bike/van', active: liveStatus !== 'delivered', done: true },
                      { step: 4, title: 'Doorstep Handover', desc: 'Verify OTP at delivery', active: liveStatus === 'delivered', done: liveStatus === 'delivered' },
                    ].map((s) => (
                      <div
                        key={s.step}
                        className={`p-3 rounded-xl border text-xs ${
                          s.done
                            ? 'bg-blue-50/60 border-blue-200'
                            : 'bg-slate-50 border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-bold font-['Manrope'] text-slate-900">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                              s.done ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {s.done ? '✓' : s.step}
                          </span>
                          <span>{s.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 pl-7">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Origin & Destination Details Card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Origin Facility */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 font-['Manrope'] block">
                      Dispatched From ({currentRequest.originFacility.type === 'hospital' ? 'Hospital' : 'Pharmacy'})
                    </span>
                    <h5 className="text-sm font-extrabold font-['Manrope'] text-slate-900">
                      {currentRequest.originFacility.name}
                    </h5>
                    <p className="text-xs text-slate-500 flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{currentRequest.originFacility.address}</span>
                    </p>
                    <p className="text-xs text-slate-600 pt-1 font-mono">
                      Ph: {currentRequest.originFacility.phone}
                    </p>
                  </div>

                  {/* Destination Address */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 font-['Manrope'] block">
                      Delivery Destination (Patient Home)
                    </span>
                    <h5 className="text-sm font-extrabold font-['Manrope'] text-slate-900">
                      {currentRequest.destinationAddress.recipientName}
                    </h5>
                    <p className="text-xs text-slate-500 flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{currentRequest.destinationAddress.address}</span>
                    </p>
                    <p className="text-xs text-slate-600 pt-1 font-mono">
                      Contact: {currentRequest.destinationAddress.phone}
                    </p>
                  </div>
                </div>

                {/* 4. Ordered Items Breakdown */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-['Manrope'] mb-2">
                    Package Contents ({currentRequest.medicineNames.length} items)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {currentRequest.medicineNames.map((name, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800"
                      >
                        <Pill className="w-3.5 h-3.5 text-blue-600" />
                        <span>{name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-3">
                <Truck className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-base font-bold text-slate-800 font-['Manrope']">No Active Medical Dispatches</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  You do not have any ongoing deliveries. Order medicines, medical equipment, or emergency supplies from nearby pharmacies and hospitals.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('book')}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs font-['Manrope'] transition shadow-sm cursor-pointer"
                >
                  Create New Delivery Request
                </button>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: ORDER & BOOK MEDICAL TRANSPORT                     */}
        {/* ======================================================== */}
        {activeTab === 'book' && (
          <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 bg-slate-50/70">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* STEP 1: Select Pickup Source (Pharmacy vs Hospital) */}
              <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[11px] font-bold uppercase font-['Manrope']">
                      Step 1 • Pickup Facility
                    </span>
                    <h3 className="text-base font-extrabold font-['Manrope'] text-slate-900 mt-1">
                      Select Nearby Pharmacy or Hospital Origin
                    </h3>
                  </div>

                  {/* Toggle Pharmacy vs Hospital */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold font-['Manrope']">
                    <button
                      type="button"
                      onClick={() => {
                        setOriginType('pharmacy');
                        setIsUsingCustomOrigin(false);
                        setSelectedOriginFacility(PRESET_PHARMACIES[0]);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                        originType === 'pharmacy' && !isUsingCustomOrigin
                          ? 'bg-white text-emerald-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Pill className="w-3.5 h-3.5" />
                      <span>Nearby Pharmacy</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOriginType('hospital');
                        setIsUsingCustomOrigin(false);
                        setSelectedOriginFacility(PRESET_HOSPITALS[0]);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                        originType === 'hospital' && !isUsingCustomOrigin
                          ? 'bg-white text-red-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Hospital className="w-3.5 h-3.5" />
                      <span>Nearby Hospital</span>
                    </button>
                  </div>
                </div>

                {/* Preset Facility Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(originType === 'pharmacy' ? PRESET_PHARMACIES : PRESET_HOSPITALS).map((fac) => {
                    const isSelected = !isUsingCustomOrigin && selectedOriginFacility.name === fac.name;
                    return (
                      <div
                        key={fac.name}
                        onClick={() => {
                          setIsUsingCustomOrigin(false);
                          setSelectedOriginFacility(fac);
                        }}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                          isSelected
                            ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 shadow-2xs'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[11px] font-bold text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded">
                              {fac.distance} away
                            </span>
                            <span className="text-[10px] font-semibold text-emerald-700">Open 24/7 Verified</span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold font-['Manrope'] text-slate-900 mt-1.5 leading-snug">
                            {fac.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5 truncate">{fac.address}</p>
                        </div>
                        <div className="text-[11px] text-slate-600 font-mono">
                          Ph: {fac.phone}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Custom Facility Option Accordion */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setIsUsingCustomOrigin(!isUsingCustomOrigin)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Or enter a different local chemist / hospital branch</span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isUsingCustomOrigin ? 'rotate-90' : ''}`} />
                  </button>

                  {isUsingCustomOrigin && (
                    <div className="mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs animate-in fade-in">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Facility Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. Sanjeevani Medicos"
                          value={customOriginName}
                          onChange={(e) => setCustomOriginName(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Address / Landmark</label>
                        <input
                          type="text"
                          placeholder="e.g. Sector 12 Market"
                          value={customOriginAddress}
                          onChange={(e) => setCustomOriginAddress(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Facility Phone</label>
                        <input
                          type="text"
                          placeholder="e.g. +91 98111 22334"
                          value={customOriginPhone}
                          onChange={(e) => setCustomOriginPhone(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* STEP 2: Choose Medicines, Surgical Supplies & Hospital Items */}
              <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-bold uppercase font-['Manrope']">
                      Step 2 • Add Items
                    </span>
                    <h3 className="text-base font-extrabold font-['Manrope'] text-slate-900 mt-1">
                      What would you like to order & transport?
                    </h3>
                  </div>

                  {/* Search Catalog */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search catalog items..."
                      value={searchCatalogQuery}
                      onChange={(e) => setSearchCatalogQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-blue-600 bg-slate-50"
                    />
                  </div>
                </div>

                {/* Category Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold font-['Manrope']">
                  {[
                    { id: 'all', label: 'All Medicines' },
                    { id: 'emergency', label: 'Emergency & SOS' },
                    { id: 'cold_chain', label: 'Insulins & Injections' },
                    { id: 'chronic_rx', label: 'Chronic & Daily Rx' },
                    { id: 'antibiotics_acute', label: 'Antibiotics & Acute' },
                    { id: 'pediatric_syrup', label: 'Pediatric & Syrups' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCatalogCategory(cat.id as any)}
                      className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
                        catalogCategory === cat.id
                          ? 'bg-slate-900 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Catalog Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1">
                  {filteredCatalog.map((item) => {
                    const inBasket = orderBasket.find((i) => i.name === item.name);
                    return (
                      <div
                        key={item.id}
                        className="p-3 rounded-2xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 transition flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0 flex-1">
                          <h5 className="text-xs font-bold font-['Manrope'] text-slate-900 truncate">
                            {item.name}
                          </h5>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                            <span className="font-extrabold text-slate-800">₹{item.priceRupees}</span>
                          </div>
                        </div>

                        {inBasket ? (
                          <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-lg p-0.5">
                            <button
                              type="button"
                              onClick={() => handleUpdateQuantity(item.name, -1)}
                              className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold bg-white text-slate-700 shadow-2xs"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold text-blue-900 px-1">{inBasket.quantity}</span>
                            <button
                              type="button"
                              onClick={() => handleUpdateQuantity(item.name, 1)}
                              className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold bg-blue-600 text-white shadow-2xs"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAddItemToBasket(item)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-bold transition cursor-pointer shrink-0"
                          >
                            + Add
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Custom Item Input Box */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-600 block mb-1.5 font-['Manrope']">
                    Can't find your item? Enter any medicine, equipment or emergency supply:
                  </span>
                  <form onSubmit={handleAddCustomItem} className="flex flex-col sm:flex-row gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="e.g. Telmisartan 40mg, Augmentin 625, Insulin Glargine, Paracetamol..."
                      value={customItemName}
                      onChange={(e) => setCustomItemName(e.target.value)}
                      className="flex-1 p-2 rounded-xl border border-slate-200 bg-white"
                    />
                    <select
                      value={customItemCategory}
                      onChange={(e) => setCustomItemCategory(e.target.value as any)}
                      className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold"
                    >
                      <option value="chronic_rx">Chronic & Daily Rx</option>
                      <option value="emergency">Emergency & SOS</option>
                      <option value="cold_chain">Insulins & Injections</option>
                      <option value="antibiotics_acute">Antibiotics & Acute</option>
                      <option value="pediatric_syrup">Pediatric & Syrups</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Price (₹)"
                      value={customItemPrice}
                      onChange={(e) => setCustomItemPrice(Number(e.target.value))}
                      className="w-24 p-2 rounded-xl border border-slate-200 bg-white"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition cursor-pointer shrink-0"
                    >
                      + Add to Order
                    </button>
                  </form>
                </div>

                {/* CURRENT ORDER BASKET */}
                {orderBasket.length > 0 && (
                  <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold font-['Manrope'] text-blue-950 flex items-center gap-1.5">
                        <ShoppingBag className="w-4 h-4 text-blue-600" />
                        <span>Order Basket ({orderBasket.reduce((acc, i) => acc + i.quantity, 0)} Items)</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setOrderBasket([])}
                        className="text-[11px] text-rose-600 hover:underline font-semibold"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="divide-y divide-blue-100 max-h-40 overflow-y-auto">
                      {orderBasket.map((item) => (
                        <div key={item.id} className="py-2 flex items-center justify-between gap-2 text-xs">
                          <div className="min-w-0 flex-1">
                            <span className="font-bold text-slate-900">{item.name}</span>
                            <span className="text-[11px] text-slate-500 ml-2">₹{item.priceRupees} × {item.quantity}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">₹{item.priceRupees * item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.name)}
                              className="text-slate-400 hover:text-rose-600 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-blue-200/80 flex items-center justify-between text-xs font-bold text-blue-950">
                      <span>Items Subtotal:</span>
                      <span className="text-sm font-black font-['Manrope']">₹{itemsSubtotal}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 3: Delivery Speed & Medical Vehicle */}
              <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
                <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-800 text-[11px] font-bold uppercase font-['Manrope']">
                  Step 3 • Vehicle & Dispatch Priority
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'coldbox_bike',
                      title: 'Express Medical Bike',
                      time: '15 - 25 Mins',
                      cost: '₹149',
                      desc: 'Sealed active cold-box (2°C-8°C) for urgent medicines and surgical supplies',
                      icon: Truck,
                    },
                    {
                      id: 'medical_ambulance_van',
                      title: 'Medical Cargo Van',
                      time: '25 - 40 Mins',
                      cost: '₹299',
                      desc: 'For bulky equipment (BP machines, nebulizers, oxygen accessories, cartons)',
                      icon: Navigation,
                    },
                    {
                      id: 'standard_courier',
                      title: 'Hospital Patient Transit Cab',
                      time: 'Scheduled / Immediate',
                      cost: '₹599',
                      desc: 'Non-emergency escorted patient transit with wheelchair assistance',
                      icon: Hospital,
                    },
                  ].map((v) => (
                    <div
                      key={v.id}
                      onClick={() => setBookVehicle(v.id as any)}
                      className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-3 ${
                        bookVehicle === v.id
                          ? 'bg-cyan-50/70 border-cyan-600 ring-2 ring-cyan-600/20 shadow-2xs'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-extrabold font-['Manrope'] text-slate-900 text-xs sm:text-sm">
                            {v.title}
                          </h4>
                          <span className="font-black text-cyan-800 text-xs">{v.cost}</span>
                        </div>
                        <p className="text-[11px] font-bold text-cyan-600 mt-0.5">{v.time}</p>
                        <p className="text-[11px] text-slate-500 mt-1 leading-snug">{v.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* STEP 4: Destination Address & Submit Form */}
              <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[11px] font-bold uppercase font-['Manrope']">
                  Step 4 • Destination & Delivery Details
                </span>

                <form onSubmit={handleCreateBooking} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Patient / Recipient Name *</label>
                      <input
                        type="text"
                        required
                        value={bookRecipientName}
                        onChange={(e) => setBookRecipientName(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Contact Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={bookRecipientPhone}
                        onChange={(e) => setBookRecipientPhone(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Delivery Address *</label>
                    <input
                      type="text"
                      required
                      value={bookDestination}
                      onChange={(e) => setBookDestination(e.target.value)}
                      placeholder="e.g. Flat 402, Lotus Greens Boulevard, Sector 12"
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Delivery / Gate Instructions (Optional)</label>
                    <input
                      type="text"
                      value={deliveryInstructions}
                      onChange={(e) => setDeliveryInstructions(e.target.value)}
                      placeholder="e.g. Ring bell twice, deliver to caretaker at 4th floor"
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <input
                      type="checkbox"
                      id="check-rx-available"
                      checked={hasPrescription}
                      onChange={(e) => setHasPrescription(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <label htmlFor="check-rx-available" className="text-xs text-slate-700 cursor-pointer">
                      <strong>Prescription on File / Ready:</strong> I have a valid doctor's prescription for scheduled medicines and will display it to the delivery courier.
                    </label>
                  </div>

                  {/* Summary & Dispatch Action */}
                  <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="text-xs text-slate-500">
                        Items Subtotal: <strong>₹{itemsSubtotal}</strong> + Medical Transport: <strong>₹{transportFare}</strong>
                      </div>
                      <div className="text-lg font-black font-['Manrope'] text-slate-900 mt-0.5">
                        Total Amount: ₹{grandTotal} <span className="text-xs font-normal text-slate-500">(Pay on Delivery / UPI)</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={orderBasket.length === 0}
                      className={`inline-flex items-center justify-center gap-2 px-8 py-3 rounded-2xl font-bold font-['Manrope'] text-sm shadow-md transition active:scale-95 cursor-pointer ${
                        orderBasket.length > 0
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Truck className="w-4 h-4" />
                      <span>Dispatch Medical Courier</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL FOOTER                                              */}
        {/* ======================================================== */}
        <div className="p-4 sm:px-6 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>24/7 Verified Good Distribution Practices (GDP) & Sterile Chain of Custody Protocol.</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500 font-medium">
              Medical Logistics Helpline: <strong className="text-slate-900 font-mono">1800-419-MEDS</strong>
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold font-['Manrope'] transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};
