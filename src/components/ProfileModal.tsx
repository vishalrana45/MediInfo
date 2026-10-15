import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Shield,
  Bell,
  HeartPulse,
  Trash2,
  CheckCircle2,
  PhoneCall,
  Lock,
  Calendar,
  Stethoscope,
  Activity,
  Pill,
  AlertTriangle,
  Clock,
  Plus,
  Edit3,
  MapPin,
  Video,
  FileText,
  ChevronRight,
  Sparkles,
  Save,
  Check,
  Building2,
  TrendingUp,
  Apple,
  Search,
  Phone,
  CalendarCheck,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PatientProfileData,
  DoctorAppointment,
  ActiveTreatmentCondition,
  DEFAULT_PATIENT_PROFILE,
} from '../data/patientProfileData';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSaved: () => void;
  onOpenHistory: () => void;
  onOpenReminders?: () => void;
  remindersCount?: number;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenSaved,
  onOpenHistory,
  onOpenReminders,
  remindersCount = 0,
}) => {
  // Tab states
  const [activeTab, setActiveTab] = useState<'overview' | 'conditions' | 'appointments' | 'records' | 'settings'>('overview');

  // Profile state with localStorage persistence
  const [profile, setProfile] = useState<PatientProfileData>(() => {
    try {
      const saved = localStorage.getItem('mediinfo_patient_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_PATIENT_PROFILE;
  });

  // Edit Patient Info Modal / Sub-state
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editFormData, setEditFormData] = useState({
    fullName: profile.fullName,
    age: profile.age,
    gender: profile.gender,
    bloodGroup: profile.bloodGroup,
    primaryPhone: profile.primaryPhone,
    abhaId: profile.abhaId || '',
    emergencyContactName: profile.emergencyContact.name,
    emergencyContactPhone: profile.emergencyContact.phone,
    emergencyRelationship: profile.emergencyContact.relationship,
  });

  // Modal for adding a new appointment
  const [isAddingAppointment, setIsAddingAppointment] = useState(false);
  const [newAppointment, setNewAppointment] = useState<Partial<DoctorAppointment>>({
    doctorName: '',
    specialty: 'General Physician',
    hospitalOrClinic: '',
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    time: '10:00 AM',
    type: 'in_person',
    status: 'upcoming',
    reasonForVisit: '',
    roomOrToken: '',
    notes: '',
    contactPhone: '',
  });

  // Appointment management states
  const [appointmentFilter, setAppointmentFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [appointmentSearch, setAppointmentSearch] = useState('');
  const [appointmentToDelete, setAppointmentToDelete] = useState<DoctorAppointment | null>(null);
  const [appointmentFeedback, setAppointmentFeedback] = useState<string | null>(null);

  const showAppointmentToast = (msg: string) => {
    setAppointmentFeedback(msg);
    setTimeout(() => {
      setAppointmentFeedback(null);
    }, 3500);
  };

  // Modal for adding an active condition / disease treatment
  const [isAddingCondition, setIsAddingCondition] = useState(false);
  const [newCondition, setNewCondition] = useState<Partial<ActiveTreatmentCondition>>({
    conditionName: '',
    category: 'chronic',
    diagnosedDate: new Date().toISOString().split('T')[0],
    treatingDoctor: '',
    status: 'active_treatment',
    targetGoals: '',
    currentMedications: [],
    dietaryRestrictions: [],
    severity: 'controlled',
  });
  const [medInputText, setMedInputText] = useState('');
  const [dietInputText, setDietInputText] = useState('');

  // Cache cleared indicator
  const [cacheCleared, setCacheCleared] = useState(false);
  const [saveBanner, setSaveBanner] = useState(false);

  // Sync to local storage
  const saveProfileToStorage = (updated: PatientProfileData) => {
    setProfile(updated);
    try {
      localStorage.setItem('mediinfo_patient_profile', JSON.stringify(updated));
      setSaveBanner(true);
      setTimeout(() => setSaveBanner(false), 2500);
    } catch {}
  };

  if (!isOpen) return null;

  // Clear cache handler
  const handleClearCache = () => {
    try {
      localStorage.removeItem('mina_scan_history');
      localStorage.removeItem('mina_saved_medicines');
      setCacheCleared(true);
      setTimeout(() => setCacheCleared(false), 3000);
    } catch {}
  };

  // Reset to default sample patient profile
  const handleResetProfile = () => {
    saveProfileToStorage(DEFAULT_PATIENT_PROFILE);
    setEditFormData({
      fullName: DEFAULT_PATIENT_PROFILE.fullName,
      age: DEFAULT_PATIENT_PROFILE.age,
      gender: DEFAULT_PATIENT_PROFILE.gender,
      bloodGroup: DEFAULT_PATIENT_PROFILE.bloodGroup,
      primaryPhone: DEFAULT_PATIENT_PROFILE.primaryPhone,
      abhaId: DEFAULT_PATIENT_PROFILE.abhaId || '',
      emergencyContactName: DEFAULT_PATIENT_PROFILE.emergencyContact.name,
      emergencyContactPhone: DEFAULT_PATIENT_PROFILE.emergencyContact.phone,
      emergencyRelationship: DEFAULT_PATIENT_PROFILE.emergencyContact.relationship,
    });
  };

  // Save Patient Info
  const handleSaveInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: PatientProfileData = {
      ...profile,
      fullName: editFormData.fullName,
      age: Number(editFormData.age) || 40,
      gender: editFormData.gender as any,
      bloodGroup: editFormData.bloodGroup,
      primaryPhone: editFormData.primaryPhone,
      abhaId: editFormData.abhaId,
      emergencyContact: {
        name: editFormData.emergencyContactName,
        phone: editFormData.emergencyContactPhone,
        relationship: editFormData.emergencyRelationship,
      },
    };
    saveProfileToStorage(updated);
    setIsEditingInfo(false);
  };

  // Add Appointment
  const handleAddAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppointment.doctorName || !newAppointment.hospitalOrClinic) return;

    const item: DoctorAppointment = {
      id: `apt-${Date.now()}`,
      doctorName: newAppointment.doctorName,
      specialty: newAppointment.specialty || 'General Physician',
      hospitalOrClinic: newAppointment.hospitalOrClinic,
      date: newAppointment.date || new Date().toISOString().split('T')[0],
      time: newAppointment.time || '10:00 AM',
      type: newAppointment.type || 'in_person',
      status: 'upcoming',
      contactPhone: newAppointment.contactPhone || '',
      reasonForVisit: newAppointment.reasonForVisit || 'Follow-up Consultation',
      roomOrToken: newAppointment.roomOrToken || '',
      notes: newAppointment.notes || '',
    };

    const updated: PatientProfileData = {
      ...profile,
      appointments: [item, ...profile.appointments],
    };
    saveProfileToStorage(updated);
    setIsAddingAppointment(false);
    showAppointmentToast(`Appointment with ${item.doctorName} successfully scheduled!`);
    setNewAppointment({
      doctorName: '',
      specialty: 'General Physician',
      hospitalOrClinic: '',
      date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      time: '10:00 AM',
      type: 'in_person',
      status: 'upcoming',
      reasonForVisit: '',
      roomOrToken: '',
      notes: '',
      contactPhone: '',
    });
  };

  // Toggle or Delete Appointment
  const handleToggleAppointmentStatus = (id: string) => {
    const target = profile.appointments.find((a) => a.id === id);
    const nextStatus = target?.status === 'upcoming' ? 'completed' : 'upcoming';
    const updated: PatientProfileData = {
      ...profile,
      appointments: profile.appointments.map((a) =>
        a.id === id ? { ...a, status: nextStatus } : a
      ),
    };
    saveProfileToStorage(updated);
    if (target) {
      showAppointmentToast(
        nextStatus === 'completed'
          ? `Marked appointment with ${target.doctorName} as completed`
          : `Marked appointment with ${target.doctorName} as upcoming`
      );
    }
  };

  const handleDeleteAppointment = (id: string) => {
    const target = profile.appointments.find((a) => a.id === id);
    const updated: PatientProfileData = {
      ...profile,
      appointments: profile.appointments.filter((a) => a.id !== id),
    };
    saveProfileToStorage(updated);
    if (target) {
      showAppointmentToast(`Consultation with ${target.doctorName} has been deleted.`);
    }
  };

  // Add Condition
  const handleAddConditionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCondition.conditionName) return;

    const meds = medInputText
      ? medInputText.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
    const diets = dietInputText
      ? dietInputText.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const item: ActiveTreatmentCondition = {
      id: `cond-${Date.now()}`,
      conditionName: newCondition.conditionName,
      category: newCondition.category || 'chronic',
      diagnosedDate: newCondition.diagnosedDate || new Date().toISOString().split('T')[0],
      treatingDoctor: newCondition.treatingDoctor || 'Treating Physician',
      status: newCondition.status || 'active_treatment',
      targetGoals: newCondition.targetGoals || 'Maintain physiological clinical stability',
      currentMedications: meds.length > 0 ? meds : ['Under regular clinical review'],
      dietaryRestrictions: diets,
      severity: newCondition.severity || 'controlled',
      nextReviewDate: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
    };

    const updated: PatientProfileData = {
      ...profile,
      activeConditions: [item, ...profile.activeConditions],
    };
    saveProfileToStorage(updated);
    setIsAddingCondition(false);
    setNewCondition({
      conditionName: '',
      category: 'chronic',
      diagnosedDate: new Date().toISOString().split('T')[0],
      treatingDoctor: '',
      status: 'active_treatment',
      targetGoals: '',
      currentMedications: [],
      dietaryRestrictions: [],
      severity: 'controlled',
    });
    setMedInputText('');
    setDietInputText('');
  };

  const handleDeleteCondition = (id: string) => {
    const updated: PatientProfileData = {
      ...profile,
      activeConditions: profile.activeConditions.filter((c) => c.id !== id),
    };
    saveProfileToStorage(updated);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm overflow-y-auto font-['Inter']"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB] shadow-2xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black font-['Manrope'] text-[#0F172A]">
                  Patient Health Profile & Care Management
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                  <Shield className="w-3 h-3 text-emerald-600" />
                  Verified EHR
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                Active treatment conditions, doctor consultations, vital stats & emergency medical card
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close Profile"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 pb-2 border-b border-slate-200 bg-white overflow-x-auto shrink-0 scrollbar-none text-xs font-semibold font-['Manrope']">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-[#2563EB] text-white shadow-sm font-bold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Health Summary</span>
          </button>

          <button
            onClick={() => setActiveTab('conditions')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'conditions'
                ? 'bg-[#2563EB] text-white shadow-sm font-bold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Under Treatment ({profile.activeConditions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'appointments'
                ? 'bg-[#2563EB] text-white shadow-sm font-bold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Doctor Appointments ({profile.appointments.filter((a) => a.status === 'upcoming').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('records')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'records'
                ? 'bg-[#2563EB] text-white shadow-sm font-bold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Reports & Rx</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-[#2563EB] text-white shadow-sm font-bold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy & Storage</span>
          </button>
        </div>

        {/* Save confirmation toast */}
        {saveBanner && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-1.5 flex items-center gap-2 text-emerald-800 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Profile and health records updated successfully!</span>
          </div>
        )}

        {/* Appointment Feedback Toast */}
        {appointmentFeedback && (
          <div className="bg-blue-50 border-b border-blue-200 px-6 py-2 flex items-center justify-between text-blue-900 text-xs font-semibold animate-in fade-in">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{appointmentFeedback}</span>
            </div>
            <button
              onClick={() => setAppointmentFeedback(null)}
              className="text-blue-500 hover:text-blue-800 cursor-pointer p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 min-h-0 bg-slate-50/30">
          {/* ======================================================== */}
          {/* 1. OVERVIEW TAB                                           */}
          {/* ======================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Patient Identity Banner */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-extrabold font-['Manrope'] text-xl shadow-md shrink-0">
                    {profile.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base sm:text-lg font-black font-['Manrope'] text-[#0F172A]">
                        {profile.fullName}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold font-['Manrope']">
                        Blood: {profile.bloodGroup}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      {profile.age} Years • {profile.gender} • ABHA Health ID:{' '}
                      <span className="font-mono text-slate-700">{profile.abhaId}</span>
                    </p>
                    <p className="text-xs text-[#64748B]">
                      Primary: <span className="font-semibold text-slate-700">{profile.primaryPhone}</span> •
                      Emergency Contact: <span className="font-semibold text-slate-700">{profile.emergencyContact.name} ({profile.emergencyContact.relationship})</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditingInfo(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 text-xs font-bold font-['Manrope'] transition cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Demographics</span>
                </button>
              </div>

              {/* Vitals Grid */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] font-['Manrope'] flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-blue-600" />
                    <span>Recent Clinical Vitals</span>
                  </h4>
                  <span className="text-[11px] text-slate-500">Updated: {profile.vitals.lastUpdated}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                    <span className="text-[11px] text-slate-500 font-medium block">Blood Pressure</span>
                    <span className="text-base font-extrabold font-['Manrope'] text-slate-900 block mt-0.5">
                      {profile.vitals.bloodPressure}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
                      <Check className="w-3 h-3" /> Target Controlled
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                    <span className="text-[11px] text-slate-500 font-medium block">Resting Heart Rate</span>
                    <span className="text-base font-extrabold font-['Manrope'] text-slate-900 block mt-0.5">
                      {profile.vitals.heartRate}
                    </span>
                    <span className="text-[10px] text-blue-600 font-semibold mt-0.5 block">Normal Sinus</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                    <span className="text-[11px] text-slate-500 font-medium block">Blood Glucose</span>
                    <span className="text-base font-extrabold font-['Manrope'] text-slate-900 block mt-0.5">
                      {profile.vitals.bloodGlucose.split(' ')[0]} <span className="text-xs font-normal text-slate-500">mg/dL</span>
                    </span>
                    <span className="text-[10px] text-amber-700 font-semibold mt-0.5 block">Fasting Regimen</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                    <span className="text-[11px] text-slate-500 font-medium block">BMI / Weight</span>
                    <span className="text-base font-extrabold font-['Manrope'] text-slate-900 block mt-0.5">
                      {profile.vitals.weightKg} kg <span className="text-xs font-normal text-slate-500">({profile.vitals.heightCm} cm)</span>
                    </span>
                    <span className="text-[10px] text-slate-600 font-semibold mt-0.5 block">BMI: 24.2 (Normal)</span>
                  </div>
                </div>
              </div>

              {/* Critical Drug Allergies Alert Banner */}
              <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200/90 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-900 font-bold font-['Manrope'] text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Known Drug & Substance Allergies (Strict Contraindications)</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase bg-rose-200/60 text-rose-800 px-2 py-0.5 rounded-md">
                    Clinical Alert
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {profile.allergies.map((allergy, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-rose-300 text-rose-800 font-bold text-xs shadow-2xs"
                    >
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      {allergy}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-rose-700 leading-relaxed pt-1">
                  Any prescriptions containing Beta-lactam / Penicillin antibiotics or Sulfa derivatives must be flagged by pharmacists immediately.
                </p>
              </div>

              {/* ======================================================== */}
              {/* SCHEDULED DOCTOR APPOINTMENTS SECTION (OVERVIEW)          */}
              {/* ======================================================== */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] font-['Manrope']">
                          Scheduled Doctor Appointments
                        </h4>
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                          {profile.appointments.filter((a) => a.status === 'upcoming').length} Upcoming
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Manage your OPD consultations, specialist reviews, and clinical visits
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingAppointment(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-['Manrope'] font-bold text-xs transition cursor-pointer shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Schedule Consultation</span>
                    </button>
                    {profile.appointments.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setActiveTab('appointments')}
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold px-2 py-1 rounded-lg hover:bg-blue-50 transition cursor-pointer"
                      >
                        <span>View All ({profile.appointments.length})</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {profile.appointments.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-white border border-dashed border-slate-300 text-center space-y-2.5 shadow-2xs">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 font-['Manrope']">
                        No Doctor Appointments Scheduled
                      </p>
                      <p className="text-[11px] text-slate-500 max-w-sm mx-auto mt-0.5">
                        Schedule upcoming clinic visits, specialist checkups, or teleconsultations to keep all medical records synchronized.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddingAppointment(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition cursor-pointer border border-blue-200"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add First Consultation</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {profile.appointments.slice(0, 4).map((apt) => (
                      <div
                        key={apt.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                          apt.status === 'completed'
                            ? 'bg-slate-50/70 border-slate-200 opacity-80'
                            : 'bg-white border-blue-200/90 shadow-2xs hover:border-blue-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2.5">
                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                                  apt.type === 'video_consult'
                                    ? 'bg-purple-50 text-purple-600 border border-purple-200'
                                    : 'bg-blue-50 text-blue-600 border border-blue-200'
                                }`}
                              >
                                {apt.type === 'video_consult' ? (
                                  <Video className="w-4 h-4" />
                                ) : (
                                  <Building2 className="w-4 h-4" />
                                )}
                              </div>
                              <div>
                                <h5 className="text-xs sm:text-sm font-extrabold font-['Manrope'] text-slate-900 leading-snug">
                                  {apt.doctorName}
                                </h5>
                                <p className="text-[11px] font-semibold text-blue-600">
                                  {apt.specialty}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                                apt.status === 'completed'
                                  ? 'bg-slate-100 text-slate-600'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {apt.status === 'completed' ? 'Completed' : 'Upcoming'}
                            </span>
                          </div>

                          <div className="mt-3 space-y-1.5 text-[11px] text-slate-600">
                            <div className="flex items-center gap-1.5 font-bold text-slate-900 font-['Manrope']">
                              <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              <span>{apt.date}</span>
                              <span className="text-slate-400">•</span>
                              <Clock className="w-3 h-3 text-blue-600 shrink-0" />
                              <span>{apt.time}</span>
                            </div>

                            <div className="flex items-center gap-1.5 text-slate-600">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{apt.hospitalOrClinic}</span>
                              {apt.roomOrToken && (
                                <span className="bg-slate-100 text-slate-700 font-semibold px-1.5 py-0.2 rounded text-[10px] shrink-0">
                                  {apt.roomOrToken}
                                </span>
                              )}
                            </div>

                            {apt.reasonForVisit && (
                              <p className="text-slate-700 bg-slate-50 p-1.5 rounded-lg border border-slate-100 text-[11px] line-clamp-2">
                                <span className="font-semibold text-slate-900">Reason:</span> {apt.reasonForVisit}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleAppointmentStatus(apt.id)}
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition cursor-pointer font-['Manrope'] ${
                              apt.status === 'completed'
                                ? 'text-slate-600 bg-slate-100 hover:bg-slate-200'
                                : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                            }`}
                          >
                            {apt.status === 'completed' ? 'Mark Active' : 'Mark Completed'}
                          </button>

                          <div className="flex items-center gap-1">
                            {apt.contactPhone && (
                              <a
                                href={`tel:${apt.contactPhone}`}
                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title={`Call: ${apt.contactPhone}`}
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => setAppointmentToDelete(apt)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              title="Delete appointment"
                              aria-label="Delete appointment"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Navigation into Saved & Scan History */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] font-['Manrope'] mb-2.5">
                  Personal App Records
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {onOpenReminders && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenReminders();
                      }}
                      className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 hover:border-blue-400 hover:bg-blue-100/60 text-left transition-all group cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-blue-700 font-semibold">Active Schedules</span>
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                          {remindersCount}
                        </span>
                      </div>
                      <span className="text-sm font-bold font-['Manrope'] text-blue-950 group-hover:text-blue-700 flex items-center gap-1.5">
                        <Bell className="w-3.5 h-3.5 text-blue-600" />
                        Dose Reminders
                      </span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenSaved();
                    }}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 text-left transition-all group cursor-pointer shadow-2xs"
                  >
                    <span className="text-[11px] text-slate-500 block mb-1">Personal Archive</span>
                    <span className="text-sm font-bold font-['Manrope'] text-[#0F172A] group-hover:text-blue-600">
                      Saved Medicines
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenHistory();
                    }}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 text-left transition-all group cursor-pointer shadow-2xs"
                  >
                    <span className="text-[11px] text-slate-500 block mb-1">Past Identifications</span>
                    <span className="text-sm font-bold font-['Manrope'] text-[#0F172A] group-hover:text-blue-600">
                      Scan History
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 2. CONDITIONS UNDER TREATMENT TAB                         */}
          {/* ======================================================== */}
          {activeTab === 'conditions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold font-['Manrope'] text-[#0F172A]">
                    Active Diseases & Conditions Under Treatment
                  </h4>
                  <p className="text-xs text-[#64748B]">
                    Current diagnoses, therapy goals, treating doctors, and ongoing medication regimens
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingCondition(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-['Manrope'] font-bold text-xs transition cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Condition</span>
                </button>
              </div>

              {/* List of Active Conditions */}
              <div className="space-y-3.5">
                {profile.activeConditions.map((cond) => (
                  <div
                    key={cond.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="text-sm sm:text-base font-extrabold font-['Manrope'] text-[#0F172A]">
                            {cond.conditionName}
                          </h5>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-['Manrope'] uppercase ${
                              cond.status === 'active_treatment'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {cond.status === 'active_treatment' ? 'Active Therapy' : 'Maintenance'}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold uppercase">
                            {cond.severity}
                          </span>
                        </div>
                        <p className="text-xs text-[#64748B] mt-1 flex items-center gap-1.5">
                          <Stethoscope className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>Treating Doctor: <strong className="text-slate-800">{cond.treatingDoctor}</strong></span>
                          <span>• Diagnosed: {cond.diagnosedDate}</span>
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteCondition(cond.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Delete Condition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Target Goals */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900">Clinical Target Goal: </span>
                        {cond.targetGoals}
                      </div>
                    </div>

                    {/* Prescribed Medications */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Prescribed Medications for this Condition:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {cond.currentMedications.map((med, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold"
                          >
                            <Pill className="w-3 h-3 text-blue-600" />
                            {med}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Dietary / Lifestyle Rules */}
                    {cond.dietaryRestrictions && cond.dietaryRestrictions.length > 0 && (
                      <div className="pt-1 flex items-center gap-1.5 text-xs text-slate-600 flex-wrap">
                        <Apple className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="font-medium text-slate-700">Dietary Guidance:</span>
                        {cond.dietaryRestrictions.map((diet, i) => (
                          <span key={i} className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                            {diet}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 3. DOCTOR APPOINTMENTS TAB                                */}
          {/* ======================================================== */}
          {activeTab === 'appointments' && (() => {
            const upcomingCount = profile.appointments.filter((a) => a.status === 'upcoming').length;
            const completedCount = profile.appointments.filter((a) => a.status === 'completed').length;

            const filteredAppointments = profile.appointments.filter((apt) => {
              if (appointmentFilter === 'upcoming' && apt.status !== 'upcoming') return false;
              if (appointmentFilter === 'completed' && apt.status !== 'completed') return false;
              if (appointmentSearch.trim()) {
                const q = appointmentSearch.toLowerCase();
                const matchesDoctor = apt.doctorName.toLowerCase().includes(q);
                const matchesSpecialty = apt.specialty.toLowerCase().includes(q);
                const matchesHospital = apt.hospitalOrClinic.toLowerCase().includes(q);
                const matchesReason = apt.reasonForVisit.toLowerCase().includes(q);
                if (!matchesDoctor && !matchesSpecialty && !matchesHospital && !matchesReason) return false;
              }
              return true;
            });

            return (
              <div className="space-y-4">
                {/* Header & Quick Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-base font-extrabold font-['Manrope'] text-[#0F172A] flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>Doctor Appointments & Consultations</span>
                    </h4>
                    <p className="text-xs text-[#64748B]">
                      Manage scheduled in-person OPD visits, teleconsultations, hospital tokens, and follow-ups
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddingAppointment(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-['Manrope'] font-bold text-xs transition cursor-pointer shadow-sm shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Schedule Consultation</span>
                  </button>
                </div>

                {/* Stat Counters Banner */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div
                    onClick={() => setAppointmentFilter('all')}
                    className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                      appointmentFilter === 'all'
                        ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-500/20'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-[11px] font-semibold text-slate-500 block">Total Consultations</span>
                    <span className="text-lg font-black font-['Manrope'] text-slate-900 mt-0.5 block">
                      {profile.appointments.length}
                    </span>
                  </div>

                  <div
                    onClick={() => setAppointmentFilter('upcoming')}
                    className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                      appointmentFilter === 'upcoming'
                        ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-500/20'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-[11px] font-semibold text-blue-700 block">Upcoming Visits</span>
                    <span className="text-lg font-black font-['Manrope'] text-blue-600 mt-0.5 block">
                      {upcomingCount}
                    </span>
                  </div>

                  <div
                    onClick={() => setAppointmentFilter('completed')}
                    className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                      appointmentFilter === 'completed'
                        ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-[11px] font-semibold text-emerald-700 block">Completed</span>
                    <span className="text-lg font-black font-['Manrope'] text-emerald-600 mt-0.5 block">
                      {completedCount}
                    </span>
                  </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <div className="relative flex-1 w-full">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search appointments by doctor, clinic, specialty or reason..."
                      value={appointmentSearch}
                      onChange={(e) => setAppointmentSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-blue-600 text-slate-800 placeholder-slate-400"
                    />
                    {appointmentSearch && (
                      <button
                        onClick={() => setAppointmentSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setAppointmentFilter('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold font-['Manrope'] transition cursor-pointer flex-1 sm:flex-initial text-center ${
                        appointmentFilter === 'all'
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      All ({profile.appointments.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAppointmentFilter('upcoming')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold font-['Manrope'] transition cursor-pointer flex-1 sm:flex-initial text-center ${
                        appointmentFilter === 'upcoming'
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      Upcoming ({upcomingCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAppointmentFilter('completed')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold font-['Manrope'] transition cursor-pointer flex-1 sm:flex-initial text-center ${
                        appointmentFilter === 'completed'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      Completed ({completedCount})
                    </button>
                  </div>
                </div>

                {/* Appointments List */}
                <div className="space-y-3">
                  {filteredAppointments.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-white border border-dashed border-slate-300 text-center space-y-3 shadow-2xs">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-slate-800 font-['Manrope']">
                          {profile.appointments.length === 0
                            ? 'No Scheduled Appointments Found'
                            : 'No Appointments Matching Your Filter'}
                        </h5>
                        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                          {profile.appointments.length === 0
                            ? 'Add scheduled appointments with your cardiologist, endocrinologist, or GP to manage tokens and reminders.'
                            : 'Try adjusting your search query or reset the filter to view all scheduled medical consultations.'}
                        </p>
                      </div>
                      {profile.appointments.length === 0 ? (
                        <button
                          type="button"
                          onClick={() => setIsAddingAppointment(true)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer shadow-sm"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Schedule First Appointment</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setAppointmentFilter('all');
                            setAppointmentSearch('');
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                        >
                          <span>Clear Search & Filter</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    filteredAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                          apt.status === 'completed'
                            ? 'bg-slate-50/70 border-slate-200 opacity-80'
                            : 'bg-white border-blue-200/90 shadow-xs hover:border-blue-300'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex items-start gap-3.5">
                            <div
                              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                                apt.type === 'video_consult'
                                  ? 'bg-purple-50 border border-purple-200 text-purple-600'
                                  : 'bg-blue-50 border border-blue-200 text-blue-600'
                              }`}
                            >
                              {apt.type === 'video_consult' ? (
                                <Video className="w-5 h-5" />
                              ) : (
                                <Building2 className="w-5 h-5" />
                              )}
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h5 className="text-sm sm:text-base font-extrabold font-['Manrope'] text-[#0F172A]">
                                  {apt.doctorName}
                                </h5>
                                <span className="text-xs text-[#2563EB] font-bold font-['Manrope'] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                                  {apt.specialty}
                                </span>
                                <span
                                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                    apt.status === 'completed'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-blue-100 text-blue-800'
                                  }`}
                                >
                                  {apt.status === 'completed' ? 'Completed' : 'Upcoming'}
                                </span>
                                <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full capitalize">
                                  {apt.type === 'video_consult'
                                    ? 'Video Teleconsult'
                                    : apt.type === 'in_person'
                                    ? 'In-Person OPD'
                                    : 'Routine Follow-up'}
                                </span>
                              </div>

                              <p className="text-xs text-[#64748B] flex items-center gap-1.5 flex-wrap">
                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="font-medium text-slate-700">{apt.hospitalOrClinic}</span>
                                {apt.roomOrToken && (
                                  <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                                    {apt.roomOrToken}
                                  </span>
                                )}
                              </p>

                              {apt.contactPhone && (
                                <p className="text-xs text-blue-700 flex items-center gap-1.5">
                                  <Phone className="w-3 h-3 text-blue-600 shrink-0" />
                                  <a href={`tel:${apt.contactPhone}`} className="hover:underline font-medium">
                                    {apt.contactPhone}
                                  </a>
                                </p>
                              )}

                              <p className="text-xs text-slate-700 mt-1 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 leading-relaxed">
                                <strong className="text-slate-900 font-['Manrope']">Reason for Visit: </strong>{' '}
                                {apt.reasonForVisit}
                              </p>

                              {apt.notes && (
                                <p className="text-[11px] text-slate-600 italic bg-amber-50/60 border border-amber-200/60 p-2 rounded-lg">
                                  <strong className="text-amber-900 not-italic font-semibold">Special Instructions: </strong>
                                  {apt.notes}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Right Date / Time & Action Buttons */}
                          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                            <div className="text-left sm:text-right">
                              <div className="text-xs font-bold text-slate-900 font-['Manrope'] flex items-center sm:justify-end gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                                <span>{apt.date}</span>
                              </div>
                              <div className="text-xs text-blue-700 font-bold flex items-center sm:justify-end gap-1 mt-0.5">
                                <Clock className="w-3 h-3" />
                                <span>{apt.time}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mt-1 sm:mt-2">
                              <button
                                type="button"
                                onClick={() => handleToggleAppointmentStatus(apt.id)}
                                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold font-['Manrope'] transition cursor-pointer shadow-2xs ${
                                  apt.status === 'completed'
                                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                }`}
                              >
                                {apt.status === 'completed' ? 'Mark Active' : 'Mark Completed'}
                              </button>

                              <button
                                type="button"
                                onClick={() => setAppointmentToDelete(apt)}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer border border-transparent hover:border-rose-200"
                                title="Delete appointment"
                                aria-label="Delete appointment"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })()}

          {/* ======================================================== */}
          {/* 4. MEDICAL RECORDS & LAB REPORTS TAB                      */}
          {/* ======================================================== */}
          {activeTab === 'records' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-extrabold font-['Manrope'] text-[#0F172A]">
                  Diagnostic Reports, Lab Results & Prescriptions
                </h4>
                <p className="text-xs text-[#64748B]">
                  Clinically summarized electronic medical records attached to this profile
                </p>
              </div>

              <div className="space-y-3">
                {profile.medicalRecords.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-sm font-extrabold font-['Manrope'] text-slate-900">
                              {rec.title}
                            </h5>
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                              {rec.category}
                            </span>
                          </div>
                          <p className="text-xs text-[#64748B] mt-0.5">
                            {rec.doctorOrLab} • Date: {rec.date}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 leading-relaxed">
                      {rec.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 5. PRIVACY, SECURITY & STORAGE TAB                        */}
          {/* ======================================================== */}
          {activeTab === 'settings' && (
            <div className="space-y-5">
              {/* Emergency Medical Hotlines */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2.5">
                <div className="flex items-center gap-2 text-amber-900 font-bold font-['Manrope'] text-xs">
                  <HeartPulse className="w-4 h-4 text-amber-600" />
                  <span>Emergency Medical Reference Contacts</span>
                </div>
                <p className="text-xs text-amber-950 leading-relaxed">
                  In acute chest pain, anaphylaxis, or serious medication poisoning, immediately call emergency medical responders:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <a
                    href="tel:112"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-900 font-bold text-xs shadow-2xs hover:bg-amber-100 transition"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
                    <span>National Emergency: 112</span>
                  </a>
                  <a
                    href="tel:102"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-900 font-bold text-xs shadow-2xs hover:bg-amber-100 transition"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                    <span>Ambulance: 102 / 108</span>
                  </a>
                </div>
              </div>

              {/* Privacy & Client-Side Encryption Guarantee */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-900 font-bold font-['Manrope'] text-xs">
                    <Lock className="w-4 h-4 text-emerald-600" />
                    <span>On-Device Privacy & Data Encryption</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    100% Private EHR
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  All active conditions, appointments, and vitals are stored directly inside your browser's private local database. You retain full control over your health profile.
                </p>

                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={handleResetProfile}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Reset Sample Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClearCache}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-700 hover:text-rose-700 text-xs font-semibold transition cursor-pointer"
                  >
                    {cacheCleared ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Cleared!</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>Clear History & Cache</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400 font-['Inter']">
            MediInfo EHR • Confidential Clinical Record
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-['Manrope'] font-bold text-xs transition-colors cursor-pointer shadow-sm"
          >
            Done
          </button>
        </div>
      </motion.div>

      {/* ======================================================== */}
      {/* MODAL 1: EDIT DEMOGRAPHICS                                */}
      {/* ======================================================== */}
      {isEditingInfo && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-base font-extrabold font-['Manrope'] text-slate-900">
                Edit Patient Demographics
              </h4>
              <button
                type="button"
                onClick={() => setIsEditingInfo(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveInfoSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editFormData.fullName}
                  onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-blue-600"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    required
                    value={editFormData.age}
                    onChange={(e) => setEditFormData({ ...editFormData, age: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={editFormData.gender}
                    onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-blue-600"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={editFormData.bloodGroup}
                    onChange={(e) => setEditFormData({ ...editFormData, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-blue-600"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ABHA Health ID (Ayushman)</label>
                <input
                  type="text"
                  value={editFormData.abhaId}
                  onChange={(e) => setEditFormData({ ...editFormData, abhaId: e.target.value })}
                  placeholder="e.g. 91-4829-0194-2849"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-blue-600 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Phone</label>
                <input
                  type="text"
                  value={editFormData.primaryPhone}
                  onChange={(e) => setEditFormData({ ...editFormData, primaryPhone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Emergency Contact</label>
                  <input
                    type="text"
                    value={editFormData.emergencyContactName}
                    onChange={(e) => setEditFormData({ ...editFormData, emergencyContactName: e.target.value })}
                    placeholder="Name"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Emergency Phone</label>
                  <input
                    type="text"
                    value={editFormData.emergencyContactPhone}
                    onChange={(e) => setEditFormData({ ...editFormData, emergencyContactPhone: e.target.value })}
                    placeholder="Phone"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-blue-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditingInfo(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2563EB] text-white font-bold"
                >
                  Save Demographics
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: ADD DOCTOR APPOINTMENT                           */}
      {/* ======================================================== */}
      {isAddingAppointment && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold font-['Manrope'] text-slate-900">
                    Schedule Doctor Appointment
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Add upcoming hospital consult, OPD slot, or teleconsultation
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingAppointment(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAppointmentSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Doctor Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Ananya Sen, MD"
                  value={newAppointment.doctorName}
                  onChange={(e) => setNewAppointment({ ...newAppointment, doctorName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-blue-600 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Specialty</label>
                <input
                  type="text"
                  placeholder="e.g. Cardiologist, Endocrinologist, GP"
                  value={newAppointment.specialty}
                  onChange={(e) => setNewAppointment({ ...newAppointment, specialty: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-blue-600 text-slate-800 mb-1.5"
                />
                <div className="flex flex-wrap gap-1.5">
                  {['General Physician', 'Cardiologist', 'Endocrinologist', 'Pulmonologist', 'Dermatologist', 'Orthopedic'].map((spec) => (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => setNewAppointment({ ...newAppointment, specialty: spec })}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-[10px] font-semibold transition cursor-pointer"
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hospital / Clinic *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apollo Hospital OPD / Fortis"
                    value={newAppointment.hospitalOrClinic}
                    onChange={(e) => setNewAppointment({ ...newAppointment, hospitalOrClinic: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-blue-600 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Visit Type</label>
                  <select
                    value={newAppointment.type}
                    onChange={(e) => setNewAppointment({ ...newAppointment, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-blue-600 text-slate-800 bg-white"
                  >
                    <option value="in_person">In-Person OPD Visit</option>
                    <option value="video_consult">Video Teleconsultation</option>
                    <option value="routine_followup">Routine Follow-up</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-blue-600 text-slate-800 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10:30 AM"
                    value={newAppointment.time}
                    onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-blue-600 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Room or Token # / Video Link</label>
                  <input
                    type="text"
                    placeholder="e.g. Room 304 / Token #14"
                    value={newAppointment.roomOrToken}
                    onChange={(e) => setNewAppointment({ ...newAppointment, roomOrToken: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-blue-600 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Clinic Contact Phone</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 11 2692 5858"
                    value={newAppointment.contactPhone}
                    onChange={(e) => setNewAppointment({ ...newAppointment, contactPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-blue-600 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason for Visit</label>
                <input
                  type="text"
                  placeholder="e.g. Blood pressure monitoring, HbA1c review, symptom evaluation"
                  value={newAppointment.reasonForVisit}
                  onChange={(e) => setNewAppointment({ ...newAppointment, reasonForVisit: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-blue-600 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Special Clinical Instructions / Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Fast 10 hours prior to blood test, bring previous prescriptions and ECG report"
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-blue-600 text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingAppointment(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold cursor-pointer shadow-sm"
                >
                  Schedule Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2B: DELETE APPOINTMENT CONFIRMATION DIALOG          */}
      {/* ======================================================== */}
      {appointmentToDelete && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-extrabold font-['Manrope'] text-slate-900">
                  Delete Appointment?
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Are you sure you want to remove this medical consultation from your record?
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-900 text-sm font-['Manrope']">
                {appointmentToDelete.doctorName}
              </p>
              <p className="text-slate-600 font-medium">
                {appointmentToDelete.specialty} • {appointmentToDelete.hospitalOrClinic}
              </p>
              <div className="flex items-center gap-1.5 text-blue-700 font-semibold pt-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{appointmentToDelete.date} at {appointmentToDelete.time}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAppointmentToDelete(null)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                Keep Appointment
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDeleteAppointment(appointmentToDelete.id);
                  setAppointmentToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition cursor-pointer shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: ADD ACTIVE DISEASE / CONDITION UNDER TREATMENT    */}
      {/* ======================================================== */}
      {isAddingCondition && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-base font-extrabold font-['Manrope'] text-slate-900">
                Add Condition Under Treatment
              </h4>
              <button
                type="button"
                onClick={() => setIsAddingCondition(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddConditionSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Disease / Condition Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hypothyroidism, Asthma, Chronic Gastritis"
                  value={newCondition.conditionName}
                  onChange={(e) => setNewCondition({ ...newCondition, conditionName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Treating Doctor</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Verma"
                    value={newCondition.treatingDoctor}
                    onChange={(e) => setNewCondition({ ...newCondition, treatingDoctor: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Severity / Control</label>
                  <select
                    value={newCondition.severity}
                    onChange={(e) => setNewCondition({ ...newCondition, severity: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-blue-600"
                  >
                    <option value="controlled">Controlled</option>
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High Alert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Goal / Target</label>
                <input
                  type="text"
                  placeholder="e.g. Keep TSH levels between 1.5 - 2.5 mIU/L"
                  value={newCondition.targetGoals}
                  onChange={(e) => setNewCondition({ ...newCondition, targetGoals: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Prescribed Medicines (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Thyronorm 50mcg, Calcium D3"
                  value={medInputText}
                  onChange={(e) => setMedInputText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Dietary / Lifestyle Advice (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Take on empty stomach with warm water"
                  value={dietInputText}
                  onChange={(e) => setDietInputText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-blue-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddingCondition(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2563EB] text-white font-bold"
                >
                  Save Active Condition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileModal;
