export interface DoctorAppointment {
  id: string;
  doctorName: string;
  specialty: string;
  hospitalOrClinic: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  type: 'in_person' | 'video_consult' | 'routine_followup';
  status: 'upcoming' | 'completed' | 'cancelled';
  contactPhone?: string;
  reasonForVisit: string;
  roomOrToken?: string;
  notes?: string;
}

export interface ActiveTreatmentCondition {
  id: string;
  conditionName: string; // e.g. "Type 2 Diabetes Mellitus", "Hypertension Stage 1", "Bronchial Asthma"
  category: 'chronic' | 'acute' | 'post_surgery' | 'preventive';
  diagnosedDate: string; // YYYY-MM-DD
  treatingDoctor: string;
  status: 'active_treatment' | 'maintenance' | 'improving' | 'resolved';
  targetGoals: string; // e.g., "Keep HbA1c < 6.5%, Fasting BG < 110 mg/dL"
  currentMedications: string[]; // e.g., ["Metformin 500mg SR", "Glimepiride 1mg"]
  dietaryRestrictions: string[];
  severity: 'mild' | 'moderate' | 'high' | 'controlled';
  nextReviewDate?: string;
}

export interface MedicalRecordFile {
  id: string;
  title: string;
  category: 'Lab Report' | 'Prescription' | 'Discharge Summary' | 'Scan / X-Ray';
  doctorOrLab: string;
  date: string;
  summary: string;
}

export interface PatientProfileData {
  fullName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  abhaId?: string; // Ayushman Bharat Health Account ID / Health ID
  primaryPhone: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  allergies: string[];
  vitals: {
    bloodPressure: string; // e.g. "120/80 mmHg"
    heartRate: string; // e.g. "72 bpm"
    bloodGlucose: string; // e.g. "108 mg/dL (Fasting)"
    weightKg: number;
    heightCm: number;
    lastUpdated: string;
  };
  activeConditions: ActiveTreatmentCondition[];
  appointments: DoctorAppointment[];
  medicalRecords: MedicalRecordFile[];
}

export const DEFAULT_PATIENT_PROFILE: PatientProfileData = {
  fullName: 'Rajesh Sharma',
  age: 44,
  gender: 'Male',
  bloodGroup: 'B+',
  abhaId: '91-4829-0194-2849',
  primaryPhone: '+91 98765 43210',
  emergencyContact: {
    name: 'Sunita Sharma',
    relationship: 'Spouse',
    phone: '+91 98765 88990',
  },
  allergies: ['Penicillin / Amoxicillin (Hives)', 'Sulfa Drugs', 'Peanuts (Mild)'],
  vitals: {
    bloodPressure: '128/84 mmHg',
    heartRate: '74 bpm',
    bloodGlucose: '112 mg/dL (Fasting)',
    weightKg: 74,
    heightCm: 175,
    lastUpdated: 'Today, 08:30 AM',
  },
  activeConditions: [
    {
      id: 'cond-1',
      conditionName: 'Type 2 Diabetes Mellitus (Under Active Glycemic Control)',
      category: 'chronic',
      diagnosedDate: '2023-04-15',
      treatingDoctor: 'Dr. Ananya Sen, MD (Endocrinology)',
      status: 'active_treatment',
      targetGoals: 'Keep Fasting Blood Sugar < 110 mg/dL, HbA1c < 6.8%',
      currentMedications: ['Metformin 500mg SR (Twice Daily)', 'Teneligliptin 20mg (Morning)'],
      dietaryRestrictions: ['Low Glycemic Index diet', 'Avoid refined sugar & sweet beverages', 'High fiber meals'],
      severity: 'controlled',
      nextReviewDate: '2026-10-12',
    },
    {
      id: 'cond-2',
      conditionName: 'Primary Essential Hypertension (Stage 1)',
      category: 'chronic',
      diagnosedDate: '2022-11-20',
      treatingDoctor: 'Dr. Vivek Mehra, DM (Cardiology)',
      status: 'maintenance',
      targetGoals: 'Maintain resting Blood Pressure below 130/80 mmHg',
      currentMedications: ['Telmisartan 40mg (Morning before breakfast)'],
      dietaryRestrictions: ['Low sodium (<2g/day)', 'DASH diet principles', 'Daily 30 min brisk walk'],
      severity: 'controlled',
      nextReviewDate: '2026-10-25',
    },
    {
      id: 'cond-3',
      conditionName: 'Acute Allergic Rhinitis & Seasonal Bronchospasm',
      category: 'acute',
      diagnosedDate: '2026-09-18',
      treatingDoctor: 'Dr. Preeti Verma, MD (Pulmonology)',
      status: 'active_treatment',
      targetGoals: 'Relieve nasal congestion & nighttime dry coughing during weather shift',
      currentMedications: ['Montair LC (Montelukast + Levocetirizine - Night)', 'Salbutamol Inhaler (As needed)'],
      dietaryRestrictions: ['Avoid icy water & excessive dust exposure'],
      severity: 'moderate',
      nextReviewDate: '2026-09-28',
    },
  ],
  appointments: [
    {
      id: 'apt-1',
      doctorName: 'Dr. Ananya Sen',
      specialty: 'Endocrinologist & Diabetologist',
      hospitalOrClinic: 'Apollo Specialty Hospital / Room 304',
      date: '2026-09-28',
      time: '10:30 AM',
      type: 'in_person',
      status: 'upcoming',
      contactPhone: '+91 11 2692 5858',
      reasonForVisit: 'Quarterly HbA1c Review & Fasting Lipid Profile Evaluation',
      roomOrToken: 'Token #14 (OPD Block B)',
      notes: 'Please bring 10-day self-monitoring blood glucose log and fast for 10 hours before morning test.',
    },
    {
      id: 'apt-2',
      doctorName: 'Dr. Preeti Verma',
      specialty: 'Consultant Pulmonologist',
      hospitalOrClinic: 'Fortis Escorts Heart & Lung Institute',
      date: '2026-10-04',
      time: '04:15 PM',
      type: 'video_consult',
      status: 'upcoming',
      contactPhone: '+91 11 4713 5000',
      reasonForVisit: 'Follow-up for Seasonal Bronchospasm & Inhaler Technique Verification',
      roomOrToken: 'Video Link: meet.telehealth.med/dr-verma-98',
      notes: 'Tele-consultation reminder activated. Keep spirometry readings nearby.',
    },
    {
      id: 'apt-3',
      doctorName: 'Dr. Vivek Mehra',
      specialty: 'Senior Consultant Cardiologist',
      hospitalOrClinic: 'Max Super Speciality Hospital',
      date: '2026-08-15',
      time: '11:00 AM',
      type: 'in_person',
      status: 'completed',
      contactPhone: '+91 11 2651 5050',
      reasonForVisit: 'Routine 6-Month Hypertension & Echocardiogram Screening',
      roomOrToken: 'OPD Chamber 12',
      notes: 'Echocardiogram normal. Left ventricular ejection fraction 62%. Telmisartan continued at 40mg.',
    },
  ],
  medicalRecords: [
    {
      id: 'rec-1',
      title: 'Comprehensive Metabolic Panel & HbA1c Report',
      category: 'Lab Report',
      doctorOrLab: 'Dr. Lal PathLabs Central Reference Lab',
      date: '2026-09-15',
      summary: 'HbA1c: 6.7% (Fairly controlled), Fasting Blood Sugar: 108 mg/dL, Serum Creatinine: 0.9 mg/dL (Normal).',
    },
    {
      id: 'rec-2',
      title: 'Digital Rx: Diabetes & Hypertension Ongoing Regimen',
      category: 'Prescription',
      doctorOrLab: 'Apollo Clinics • Dr. Ananya Sen',
      date: '2026-08-20',
      summary: 'Rx valid for 90 days. Metformin 500mg SR #60 tabs, Telmisartan 40mg #30 tabs.',
    },
    {
      id: 'rec-3',
      title: '12-Lead Electrocardiogram (ECG) & Echo Summary',
      category: 'Scan / X-Ray',
      doctorOrLab: 'Max Heart Institute • Dr. Vivek Mehra',
      date: '2026-08-15',
      summary: 'Normal Sinus Rhythm at 72 bpm. No acute ST-T changes. Good LV systolic function.',
    },
  ],
};
