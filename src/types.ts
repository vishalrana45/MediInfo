export type IdentificationStatus = 'identified' | 'uncertain' | 'blurry' | 'not_medicine';

export interface MedicineReference {
  source: string;
  type: string;
  url?: string;
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  brandNames: string[];
  forms: string[];
  visualType: 'bottle' | 'blister' | 'box' | 'tablet' | 'capsule';
  visualColor: string;
  pillColor?: string;
  overview: string;
  uses: string[];
  dosage: {
    general: string;
    warning: string;
    pediatric?: string;
  };
  sideEffects: {
    common: string[];
    severe: string[];
  };
  precautions: string[];
  interactions: string[];
  warnings: string[];
  storage: string;
  references: MedicineReference[];
  confidenceScore?: number;
  imprintText?: string;
}

export interface IdentificationResult {
  status: IdentificationStatus;
  medicine?: Medicine;
  confidence: 'high' | 'medium' | 'low' | 'unconfident';
  confidenceScore: number;
  isClear: boolean;
  uncertaintyReason?: string | null;
  visualDetails?: string;
  scannedImage?: string;
  timestamp: string;
}

export type ActiveTab = 'home' | 'scan' | 'search' | 'library' | 'finder';

export type MedicineInfoTab = 
  | 'overview' 
  | 'uses' 
  | 'dosage' 
  | 'sideEffects' 
  | 'precautions' 
  | 'interactions' 
  | 'warnings' 
  | 'storage' 
  | 'references';

export interface ScanHistoryItem {
  id: string;
  medicine: Medicine;
  timestamp: string;
  confidenceScore?: number;
  thumbnail?: string;
}

export type DoseMealRelation = 'before_meal' | 'with_meal' | 'after_meal' | 'empty_stomach' | 'anytime';

export type ReminderFrequency =
  | 'daily'
  | 'twice_daily'
  | 'three_times_daily'
  | 'four_times_daily'
  | 'specific_days'
  | 'as_needed';

export interface DoseTimeSlot {
  id: string;
  time: string; // "08:00", "13:00", "20:00" in 24h format
  label: string; // "Morning", "Noon", "Evening", "Bedtime", "Custom"
  doseAmount: string; // e.g. "1 Tablet (500mg)", "5 ml", "2 Puffs"
  mealRelation: DoseMealRelation;
}

export interface MedicineReminder {
  id: string;
  medicineId?: string;
  medicineName: string;
  genericName?: string;
  dosageForm: string; // "Tablet", "Capsule", "Syrup", etc.
  category?: string;
  visualType?: 'bottle' | 'blister' | 'box' | 'tablet' | 'capsule';
  visualColor?: string;
  pillColor?: string;
  frequency: ReminderFrequency;
  customDays?: number[]; // [1, 2, 3, 4, 5] (0 = Sunday, 6 = Saturday)
  doseTimes: DoseTimeSlot[];
  startDate: string; // "YYYY-MM-DD"
  durationDays?: number; // undefined = ongoing
  instructions?: string; // e.g., "Drink with warm water"
  totalPills?: number;
  pillsRemaining?: number;
  refillThreshold?: number;
  isActive: boolean;
  createdAt: string;
}

export interface DoseLog {
  id: string;
  reminderId: string;
  medicineName: string;
  slotId: string;
  scheduledTime: string; // "08:00"
  dateKey: string; // "YYYY-MM-DD"
  status: 'taken' | 'skipped' | 'snoozed';
  loggedAt: string; // ISO string
}

export interface ScheduledDoseItem {
  reminderId: string;
  slotId: string;
  medicineName: string;
  genericName?: string;
  dosageForm: string;
  visualType?: 'bottle' | 'blister' | 'box' | 'tablet' | 'capsule';
  visualColor?: string;
  pillColor?: string;
  time: string;
  label: string;
  doseAmount: string;
  mealRelation: DoseMealRelation;
  instructions?: string;
  status: 'pending' | 'due' | 'overdue' | 'taken' | 'skipped' | 'snoozed';
  loggedAt?: string;
  reminder: MedicineReminder;
}

export type FacilityType = 'hospital' | 'pharmacy' | 'clinic' | 'emergency';

export interface HealthcareFacility {
  id: string;
  name: string;
  type: FacilityType;
  address: string;
  lat: number;
  lng: number;
  rating?: number;
  userRatingsTotal?: number;
  isOpenNow?: boolean;
  is24Hours?: boolean;
  phone?: string;
  website?: string;
  googleMapsUri?: string;
  distanceKm?: number;
  distanceMiles?: number;
  estimatedDriveMinutes?: number;
  services?: string[];
  emergencyServices?: boolean;
}

// -------------------------------------------------------------
// Family Medicine Cabinet Types
// -------------------------------------------------------------
export interface FamilyMember {
  id: string;
  name: string;
  relation: string; // 'Self' | 'Parent' | 'Child' | 'Spouse' | 'Grandparent'
  age: number;
  bloodGroup: string;
  allergies: string[];
  chronicConditions: string[];
  avatarBg: string;
  notes?: string;
  emergencyContact?: string;
}

export type StorageCondition = 'room_temperature' | 'refrigerated_2_8' | 'protect_from_light' | 'cool_dry_place';

export interface CabinetMedicine {
  id: string;
  memberId: string;
  memberName: string;
  medicineName: string;
  brandName?: string;
  genericName?: string;
  form: string; // 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Inhaler' | 'Drops'
  strength?: string; // '500mg', '10ml', etc.
  batchNumber?: string;
  expiryDate: string; // YYYY-MM-DD
  totalUnits: number;
  remainingUnits: number;
  unitLabel: string; // 'tablets', 'ml', 'puffs', 'capsules', 'vials'
  lowStockThreshold: number;
  storageCondition: StorageCondition;
  dosageSchedule: string; // e.g. "1 Tab after breakfast and dinner"
  prescribingDoctor?: string;
  treatedCondition?: string; // e.g. "Type-2 Diabetes", "Carnitine Deficiency", "Hypertension"
  isRxRequired: boolean;
  lastTakenAt?: string;
  notes?: string;
}

// -------------------------------------------------------------
// Medicine Transportation & Cold-Chain Logistics Types
// -------------------------------------------------------------
export type TransportPriority = 'emergency_critical' | 'express_coldchain' | 'scheduled_standard';

export type TransportVehicleType = 'coldbox_bike' | 'medical_ambulance_van' | 'standard_courier';

export type TransportStatus = 'order_confirmed' | 'packaging_cold_seal' | 'in_transit' | 'arriving' | 'delivered';

export interface ColdChainTelemetry {
  currentTempCelsius: number;
  targetMinTemp: number; // 2
  targetMaxTemp: number; // 8
  isColdChainIntact: boolean;
  containerSealStatus: 'sealed_intact' | 'breached';
  batteryPercent: number;
  humidityPercent: number;
  lastReadingTime: string;
  historyReadings: { time: string; temp: number }[];
}

export interface MedicineTransportRequest {
  id: string;
  trackingCode: string; // e.g. MED-CC-84920
  medicineNames: string[];
  priority: TransportPriority;
  vehicleType: TransportVehicleType;
  status: TransportStatus;
  originFacility: {
    name: string;
    address: string;
    phone: string;
    type?: 'pharmacy' | 'hospital' | 'clinic';
  };
  destinationAddress: {
    recipientName: string;
    address: string;
    phone: string;
  };
  courier: {
    name: string;
    phone: string;
    vehiclePlate: string;
    rating: number;
    completedTrips: number;
    photoUrl?: string;
  };
  coldChain: ColdChainTelemetry;
  etaMinutes: number;
  tamperSealCode: string;
  deliveryOtp: string;
  bookedAt: string;
  estimatedDeliveryTime: string;
  fareAmountRupees: number;
  originType?: 'pharmacy' | 'hospital' | 'clinic';
  itemsDetail?: { name: string; category: string; quantity: number; priceRupees?: number }[];
  notes?: string;
  rxRequired?: boolean;
}

// -------------------------------------------------------------
// Inter-Hospital Blood & Organ Availability Network Types
// -------------------------------------------------------------
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Bombay_hh';

export type BloodComponentType = 'whole_blood' | 'prbc' | 'platelets' | 'ffp' | 'cryoprecipitate';

export interface BloodStockItem {
  units: number;
  status: 'ample' | 'moderate' | 'low' | 'critical';
  components?: {
    prbc: number;
    platelets: number;
    ffp: number;
    cryoprecipitate?: number;
    whole_blood?: number;
  };
  lastDonationDate?: string;
}

export interface HospitalBloodInventory {
  hospitalId: string;
  hospitalName: string;
  city: string;
  address: string;
  phone: string;
  bloodBankHelpline: string;
  distanceKm: number;
  lastUpdated: string;
  bloodUnits: Record<BloodGroup, BloodStockItem>;
  rareBloodAvailable?: string[];
  emergencyTransferAvailable: boolean;
  coordinates?: { lat: number; lng: number };
}

export type OrganType = 'kidney' | 'liver' | 'heart' | 'lungs' | 'pancreas' | 'corneas' | 'bone_marrow' | 'skin_tissue';

export type OrganDonorStatus = 'brain_dead_dbd' | 'circulatory_death_dcd' | 'living_donor';

export type OrganAvailabilityStatus = 'available' | 'crossmatch_in_progress' | 'allocated_in_transit' | 'matched';

export interface HospitalOrganListing {
  id: string;
  hospitalId: string;
  hospitalName: string;
  city: string;
  phone: string;
  organType: OrganType;
  organSubtype?: string;
  bloodGroup: BloodGroup;
  donorAge: number;
  donorGender: 'Male' | 'Female' | 'Other';
  donorStatus: OrganDonorStatus;
  harvestedAt: string;
  maxColdIschemiaHours: number;
  coldIschemiaRemainingMinutes: number;
  hlaTyping?: string;
  status: OrganAvailabilityStatus;
  address?: string;
  coordinates?: { lat: number; lng: number };
  distanceKm?: number;
  transplantCoordinator: {
    name: string;
    contact: string;
  };
  greenCorridorEligible: boolean;
  notes?: string;
}

export type InterHospitalTransferUrgency = 'stat_immediate' | 'urgent_within_2h' | 'scheduled';

export type InterHospitalTransferStatus = 'requested' | 'approved' | 'green_corridor_active' | 'in_transit' | 'delivered';

export interface InterHospitalTransferRequest {
  id: string;
  transferType: 'blood' | 'organ';
  itemDetails: string;
  sourceHospital: string;
  destinationHospital: string;
  urgency: InterHospitalTransferUrgency;
  status: InterHospitalTransferStatus;
  ambulanceVehiclePlate?: string;
  policeEscort?: boolean;
  etaMinutes: number;
  initiatedAt: string;
  requesterDoctor: string;
  notes?: string;
}


