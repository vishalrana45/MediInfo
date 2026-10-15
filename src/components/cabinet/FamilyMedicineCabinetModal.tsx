import React, { useState, useMemo } from 'react';
import {
  X,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Snowflake,
  Sun,
  ShieldAlert,
  User,
  Trash2,
  Edit2,
  Calendar,
  Pill,
  Download,
  Share2,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Info,
  Thermometer,
  ShieldCheck,
  Check,
  Stethoscope,
  Activity,
  HeartPulse,
  Heart,
} from 'lucide-react';
import { FamilyMember, CabinetMedicine, StorageCondition } from '../../types';
import { useLanguage } from '../../services/i18n';
import { findMedicineByNameOrQuery } from '../../data/medicineDatabase';

interface FamilyMedicineCabinetModalProps {
  isOpen: boolean;
  onClose: () => void;
  familyMembers: FamilyMember[];
  medicines: CabinetMedicine[];
  onAddMedicine: (med: Omit<CabinetMedicine, 'id'>) => void;
  onUpdateMedicine: (med: CabinetMedicine) => void;
  onDeleteMedicine: (id: string) => void;
  onAddMember: (member: Omit<FamilyMember, 'id'>) => void;
  onOpenTransportFacility?: (medicineName?: string) => void;
  onOpenMonograph?: (medicineName: string) => void;
}

export const FamilyMedicineCabinetModal: React.FC<FamilyMedicineCabinetModalProps> = ({
  isOpen,
  onClose,
  familyMembers,
  medicines,
  onAddMedicine,
  onUpdateMedicine,
  onDeleteMedicine,
  onAddMember,
  onOpenTransportFacility,
  onOpenMonograph,
}) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [viewMode, setViewMode] = useState<'inventory' | 'diagnoses'>('inventory');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'expiring' | 'low_stock' | 'refrigerated'>('all');
  const [isAddMedOpen, setIsAddMedOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isDisposalOpen, setIsDisposalOpen] = useState(false);
  const [copiedSchedule, setCopiedSchedule] = useState(false);

  // Form State for Add Medicine
  const [newMedMemberId, setNewMedMemberId] = useState(familyMembers[0]?.id || '');
  const [newMedName, setNewMedName] = useState('');
  const [newMedBrand, setNewMedBrand] = useState('');
  const [newMedCondition, setNewMedCondition] = useState('');
  const [newMedForm, setNewMedForm] = useState('Tablet');
  const [newMedStrength, setNewMedStrength] = useState('500mg');
  const [newMedBatch, setNewMedBatch] = useState('');
  const [newMedExpiry, setNewMedExpiry] = useState('2027-06-30');
  const [newMedTotal, setNewMedTotal] = useState(30);
  const [newMedRemaining, setNewMedRemaining] = useState(30);
  const [newMedUnit, setNewMedUnit] = useState('tablets');
  const [newMedStorage, setNewMedStorage] = useState<StorageCondition>('room_temperature');
  const [newMedSchedule, setNewMedSchedule] = useState('1 tablet daily after food');
  const [newMedDoctor, setNewMedDoctor] = useState('');

  // Form State for Add Member
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState('Parent');
  const [newMemberAge, setNewMemberAge] = useState(45);
  const [newMemberBlood, setNewMemberBlood] = useState('B+');
  const [newMemberAllergies, setNewMemberAllergies] = useState('');
  const [newMemberConditions, setNewMemberConditions] = useState('');

  if (!isOpen) return null;

  // Helper to calculate days to expiry
  const getExpiryInfo = (expiryDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expDate = new Date(expiryDateStr);
    expDate.setHours(0, 0, 0, 0);
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { status: 'expired', days: Math.abs(diffDays), label: isHindi ? `समाप्त (${Math.abs(diffDays)} दिन पहले)` : `Expired (${Math.abs(diffDays)}d ago)` };
    }
    if (diffDays <= 30) {
      return { status: 'expiring_soon', days: diffDays, label: isHindi ? `${diffDays} दिन में समाप्त` : `Expires in ${diffDays}d` };
    }
    return { status: 'good', days: diffDays, label: isHindi ? 'वैध (सुरक्षित)' : 'Active (Safe)' };
  };

  // Helper to get friendly pharmacological category / kind of medicine
  const getMedicineKind = (med: CabinetMedicine): string => {
    const match = findMedicineByNameOrQuery(med.medicineName);
    if (match?.category) return match.category;
    if (med.form === 'Injection') return 'Basal Insulin / Injectable';
    if (med.form === 'Inhaler') return 'Bronchodilator Inhaler';
    if (med.form === 'Syrup') return 'Pediatric Oral Liquid';
    if (med.treatedCondition?.toLowerCase().includes('diabetes')) return 'Anti-Diabetic Medication';
    if (med.treatedCondition?.toLowerCase().includes('hypertension') || med.treatedCondition?.toLowerCase().includes('blood pressure')) return 'Antihypertensive (Blood Pressure)';
    if (med.treatedCondition?.toLowerCase().includes('thyroid')) return 'Thyroid Hormone Supplement';
    if (med.treatedCondition?.toLowerCase().includes('asthma')) return 'Asthma Respiratory Care';
    if (med.treatedCondition?.toLowerCase().includes('allergy') || med.treatedCondition?.toLowerCase().includes('rhinitis')) return 'Antihistamine / Anti-Allergic';
    return `${med.form} Medication`;
  };

  // Filtered medicines
  const filteredMedicines = medicines.filter((med) => {
    // Member filter
    if (selectedMemberId !== 'all' && med.memberId !== selectedMemberId) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        med.medicineName.toLowerCase().includes(q) ||
        (med.brandName && med.brandName.toLowerCase().includes(q)) ||
        med.memberName.toLowerCase().includes(q) ||
        (med.treatedCondition && med.treatedCondition.toLowerCase().includes(q)) ||
        (med.genericName && med.genericName.toLowerCase().includes(q));
      if (!match) return false;
    }
    // Filter chip
    if (filterType === 'expiring') {
      const info = getExpiryInfo(med.expiryDate);
      return info.status === 'expired' || info.status === 'expiring_soon';
    }
    if (filterType === 'low_stock') {
      return med.remainingUnits <= med.lowStockThreshold;
    }
    if (filterType === 'refrigerated') {
      return med.storageCondition === 'refrigerated_2_8';
    }
    return true;
  });

  // Cabinet Statistics
  const totalCount = medicines.length;
  const expiredCount = medicines.filter((m) => getExpiryInfo(m.expiryDate).status === 'expired').length;
  const expiringSoonCount = medicines.filter((m) => getExpiryInfo(m.expiryDate).status === 'expiring_soon').length;
  const lowStockCount = medicines.filter((m) => m.remainingUnits <= m.lowStockThreshold).length;
  const coldChainCount = medicines.filter((m) => m.storageCondition === 'refrigerated_2_8').length;

  const handleTakeDose = (med: CabinetMedicine) => {
    if (med.remainingUnits <= 0) return;
    const now = new Date();
    const timeStr = `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    onUpdateMedicine({
      ...med,
      remainingUnits: med.remainingUnits - 1,
      lastTakenAt: timeStr,
    });
  };

  const handleRefillMedicine = (med: CabinetMedicine) => {
    onUpdateMedicine({
      ...med,
      remainingUnits: med.totalUnits,
    });
  };

  const handleMedNameInput = (nameVal: string) => {
    setNewMedName(nameVal);
    if (nameVal.trim().length >= 3) {
      const match = findMedicineByNameOrQuery(nameVal.trim());
      if (match) {
        // Auto-detect disease / condition treated
        const condition = match.uses?.[0] || match.category || match.overview.slice(0, 80);
        setNewMedCondition(condition);
        if (!newMedBrand && match.brandNames?.[0]) {
          setNewMedBrand(match.brandNames[0]);
        }
        if (match.forms?.[0]) {
          const formLower = match.forms[0].toLowerCase();
          if (formLower.includes('capsule')) setNewMedForm('Capsule');
          else if (formLower.includes('syrup')) {
            setNewMedForm('Syrup');
            setNewMedUnit('ml');
          } else if (formLower.includes('inhaler')) {
            setNewMedForm('Inhaler');
            setNewMedUnit('puffs');
          } else if (formLower.includes('injection') || formLower.includes('pen')) {
            setNewMedForm('Injection');
            setNewMedUnit('pens');
          } else {
            setNewMedForm('Tablet');
            setNewMedUnit('tablets');
          }
        }
      }
    }
  };

  const handleSaveNewMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim()) return;
    const member = familyMembers.find((m) => m.id === newMedMemberId) || familyMembers[0];

    // Ensure disease / treated condition is never empty
    let finalCondition = newMedCondition.trim();
    if (!finalCondition) {
      const match = findMedicineByNameOrQuery(newMedName.trim());
      finalCondition = match?.uses?.[0] || match?.category || 'Clinical Treatment & Health Maintenance';
    }

    onAddMedicine({
      memberId: member.id,
      memberName: member.name,
      medicineName: newMedName.trim(),
      brandName: newMedBrand.trim() || undefined,
      form: newMedForm,
      strength: newMedStrength.trim() || undefined,
      batchNumber: newMedBatch.trim() || undefined,
      expiryDate: newMedExpiry,
      totalUnits: Number(newMedTotal) || 30,
      remainingUnits: Number(newMedRemaining) || 30,
      unitLabel: newMedUnit,
      lowStockThreshold: Math.max(2, Math.round(Number(newMedTotal) * 0.2)),
      storageCondition: newMedStorage,
      dosageSchedule: newMedSchedule.trim() || 'As directed by doctor',
      prescribingDoctor: newMedDoctor.trim() || undefined,
      treatedCondition: finalCondition,
      isRxRequired: true,
      lastTakenAt: undefined,
    });

    setIsAddMedOpen(false);
    setNewMedName('');
    setNewMedBrand('');
    setNewMedCondition('');
  };

  const handleSaveNewMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    const bgColors = ['bg-blue-600', 'bg-emerald-600', 'bg-violet-600', 'bg-amber-600', 'bg-rose-600', 'bg-cyan-600'];
    const randomBg = bgColors[familyMembers.length % bgColors.length];

    onAddMember({
      name: newMemberName.trim(),
      relation: newMemberRelation,
      age: Number(newMemberAge) || 30,
      bloodGroup: newMemberBlood,
      allergies: newMemberAllergies ? newMemberAllergies.split(',').map((s) => s.trim()) : ['None recorded'],
      chronicConditions: newMemberConditions ? newMemberConditions.split(',').map((s) => s.trim()) : ['None'],
      avatarBg: randomBg,
      notes: '',
    });

    setIsAddMemberOpen(false);
    setNewMemberName('');
    setNewMemberAllergies('');
    setNewMemberConditions('');
  };

  const handleCopySchedule = () => {
    const lines = [
      `FAMILY MEDICINE CABINET SCHEDULE`,
      `Exported: ${new Date().toLocaleDateString()}`,
      `---------------------------------------`,
    ];
    medicines.forEach((m) => {
      lines.push(`• [${m.memberName}] ${m.medicineName} (${m.form})`);
      lines.push(`  Schedule: ${m.dosageSchedule}`);
      lines.push(`  Storage: ${m.storageCondition.replace(/_/g, ' ')} | Remaining: ${m.remainingUnits} ${m.unitLabel}`);
      lines.push(`  Expiry: ${m.expiryDate}`);
      lines.push(``);
    });
    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedSchedule(true);
    setTimeout(() => setCopiedSchedule(false), 3000);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm font-['Inter']"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="min-h-full flex items-center justify-center p-2 sm:p-4 md:p-6">
        <div
          className="bg-white w-full max-w-6xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[88vh] max-h-[850px] min-h-[480px] my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* COMPACT SLEEK MODAL HEADER */}
          <div className="px-5 py-3.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white shrink-0 relative overflow-hidden border-b border-white/10">
            <div className="relative z-10 flex items-center justify-between gap-3">
              {/* Left: Friendly Brand Title & Subtitle */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 text-blue-300 flex items-center justify-center font-bold shrink-0 shadow-xs">
                  <Pill className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-black font-['Manrope'] tracking-tight text-white truncate">
                      {isHindi ? 'पारिवारिक मेडिसिन कैबिनेट' : 'Family Medicine Cabinet'}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-[11px] font-bold">
                      {totalCount} {isHindi ? 'दवाइयाँ' : 'Meds'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 truncate hidden sm:block">
                    {isHindi
                      ? 'परिवार के सदस्यों की दवाइयाँ, ख़ुराक समय और एक्सपायरी डेट्स'
                      : 'Keep your family\'s prescriptions organized, track doses, and avoid expired pills.'}
                  </p>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  id="btn-add-medicine-header"
                  onClick={() => setIsAddMedOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-['Manrope'] shadow-xs transition active:scale-95 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'दवा जोड़ें' : 'Add Medicine'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAddMemberOpen(true)}
                  className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold font-['Manrope'] transition cursor-pointer"
                  title="Add Family Member Profile"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{isHindi ? '+ सदस्य' : '+ Member'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsDisposalOpen(true)}
                  className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition cursor-pointer"
                  title="Safe Medicine Disposal Guidelines"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-300" />
                  <span>{isHindi ? 'निपटान नियम' : 'Disposal'}</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer ml-1"
                  aria-label="Close Cabinet"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* UNIFIED USER-FRIENDLY TOOLBAR: Member Tabs + View Toggle + Search + Filter */}
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
            {/* Left: View Mode Toggle & Member Pills */}
            <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-0.5 scrollbar-thin">
              {/* 2-Way View Switcher */}
              <div className="flex items-center p-0.5 rounded-xl bg-slate-200/90 border border-slate-300/70 text-xs shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode('inventory')}
                  className={`px-2.5 py-1 rounded-lg font-bold font-['Manrope'] transition cursor-pointer flex items-center gap-1.5 text-xs ${
                    viewMode === 'inventory'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="View individual medicine inventory"
                >
                  <Pill className="w-3.5 h-3.5 text-blue-600" />
                  <span>{isHindi ? 'दवाइयाँ' : 'Meds'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('diagnoses')}
                  className={`px-2.5 py-1 rounded-lg font-bold font-['Manrope'] transition cursor-pointer flex items-center gap-1.5 text-xs ${
                    viewMode === 'diagnoses'
                      ? 'bg-white text-indigo-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="View which person has which disease and what medicines they take"
                >
                  <Activity className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{isHindi ? 'बीमारियाँ व उपचार' : 'Diseases & Regimens'}</span>
                </button>
              </div>

              <span className="w-px h-5 bg-slate-300 shrink-0 mx-0.5" />

              {/* Member Pills */}
              <button
                type="button"
                onClick={() => setSelectedMemberId('all')}
                className={`px-3 py-1 rounded-xl text-xs font-bold font-['Manrope'] transition whitespace-nowrap cursor-pointer ${
                  selectedMemberId === 'all'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {isHindi ? 'सभी' : 'All Family'}
              </button>

              {familyMembers.map((member) => {
                const memberMeds = medicines.filter((m) => m.memberId === member.id);
                const hasExpired = memberMeds.some((m) => getExpiryInfo(m.expiryDate).status === 'expired');
                const hasExpiring = memberMeds.some((m) => getExpiryInfo(m.expiryDate).status === 'expiring_soon');

                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => setSelectedMemberId(member.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold font-['Manrope'] transition whitespace-nowrap cursor-pointer ${
                      selectedMemberId === member.id
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full ${member.avatarBg} text-white text-[9px] flex items-center justify-center font-bold`}>
                      {member.name.charAt(0)}
                    </div>
                    <span>{member.name.split(' ')[0]}</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-slate-200/80 text-slate-800 text-[10px] font-black">
                      {memberMeds.length}
                    </span>
                    {hasExpired && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" title="Has expired medicine" />}
                    {hasExpiring && !hasExpired && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Has medicine expiring soon" />}
                  </button>
                );
              })}
            </div>

            {/* Right: Search Box & Simple Filters */}
            <div className="flex items-center gap-2 shrink-0 ml-auto">
              <div className="relative w-40 sm:w-52">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isHindi ? 'दवा या बीमारी खोजें...' : 'Search disease or med...'}
                  className="w-full pl-8 pr-2.5 py-1 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                />
              </div>

              {viewMode === 'inventory' && (
                <div className="flex items-center gap-1">
                  {[
                    { id: 'all', label: isHindi ? 'सभी' : 'All' },
                    { id: 'expiring', label: isHindi ? 'एक्सपायरी' : 'Expiry' },
                    { id: 'low_stock', label: isHindi ? 'कम स्टॉक' : 'Low Stock' },
                  ].map((chip) => (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => setFilterType(chip.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-['Manrope'] whitespace-nowrap transition cursor-pointer ${
                        filterType === chip.id
                          ? 'bg-slate-900 text-white'
                          : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* MEMBER CLINICAL INFO & DIAGNOSED CONDITIONS BANNER */}
          {selectedMemberId !== 'all' && (
            (() => {
              const member = familyMembers.find((m) => m.id === selectedMemberId);
              if (!member) return null;
              const memberMeds = medicines.filter((m) => m.memberId === member.id);

              return (
                <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/80 to-slate-50 border-b border-indigo-100 px-4 py-2.5 text-xs shrink-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-slate-900 font-['Manrope'] text-sm">
                          {member.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-200/90 text-slate-700 text-[10px] font-bold">
                          {member.relation} • {member.age} yrs • Blood: {member.bloodGroup}
                        </span>
                        {member.allergies.length > 0 && member.allergies[0] !== 'None' && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-200 flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3 text-rose-600" />
                            Allergic to: {member.allergies.join(', ')}
                          </span>
                        )}
                      </div>

                      {/* Prominent Diagnosed Diseases / Health Conditions */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                        <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1">
                          <Activity className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Diagnosed Disease:</span>
                        </span>
                        {member.chronicConditions && member.chronicConditions.length > 0 && member.chronicConditions[0] !== 'None' ? (
                          member.chronicConditions.map((cond, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-0.5 rounded-lg bg-indigo-100 text-indigo-950 font-extrabold text-xs border border-indigo-200 shadow-2xs flex items-center gap-1"
                            >
                              <HeartPulse className="w-3 h-3 text-indigo-600" />
                              <span>{cond}</span>
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-500 italic">No chronic disease recorded</span>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 shrink-0 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 font-bold text-slate-800 shadow-2xs">
                        {memberMeds.length} Prescribed Medications
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()
          )}

        {/* VIEW 1: Family Diagnoses & Medicines Overview */}
        {viewMode === 'diagnoses' && (
          <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 bg-slate-50/70 space-y-4">
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-indigo-100 shadow-2xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold font-['Manrope'] text-slate-900 text-sm sm:text-base">
                      {isHindi ? 'परिवार के रोग और दवाइयाँ' : 'Family Diseases & Prescribed Medicines'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isHindi
                        ? 'जानें परिवार के किस सदस्य को कौन सी बीमारी है और वे कौन सी दवा ले रहे हैं।'
                        : 'Overview of which person has which health condition and what medicines they are taking for it.'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddMemberOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-bold font-['Manrope'] border border-indigo-200 shrink-0 transition"
                >
                  {isHindi ? '+ सदस्य जोड़ें' : '+ Add Member'}
                </button>
              </div>

              {/* Loop through each member */}
              {(selectedMemberId === 'all'
                ? familyMembers
                : familyMembers.filter((m) => m.id === selectedMemberId)
              ).map((member) => {
                const memberMeds = medicines.filter((m) => m.memberId === member.id);
                const hasDiseases = member.chronicConditions && member.chronicConditions.length > 0 && member.chronicConditions[0] !== 'None';

                return (
                  <div
                    key={member.id}
                    className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3.5"
                  >
                    {/* Member Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl ${member.avatarBg} text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0`}>
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-black font-['Manrope'] text-slate-900 text-base">
                              {member.name}
                            </h4>
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                              {member.relation} • {member.age} yrs
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                              Blood: {member.bloodGroup}
                            </span>
                          </div>
                          {member.emergencyContact && (
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Emergency: <strong className="text-slate-800">{member.emergencyContact}</strong>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-center">
                        <button
                          type="button"
                          onClick={() => {
                            setNewMedMemberId(member.id);
                            setIsAddMedOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold font-['Manrope'] transition flex items-center gap-1 cursor-pointer border border-blue-200"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Medicine</span>
                        </button>
                      </div>
                    </div>

                    {/* Allergies Warning if any */}
                    {member.allergies.length > 0 && member.allergies[0] !== 'None' && (
                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>
                          <strong>Known Drug Allergies:</strong> {member.allergies.join(', ')}
                        </span>
                      </div>
                    )}

                    {/* Diagnosed Conditions & Prescribed Medicines */}
                    <div className="space-y-3">
                      <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 font-['Manrope']">
                        Diagnosed Health Conditions & Treatments
                      </h5>

                      {hasDiseases ? (
                        member.chronicConditions.map((condition, idx) => {
                          // Find medicines matching this condition
                          const condKeyword = condition.toLowerCase().split(' ')[0];
                          const matchedMeds = memberMeds.filter((m) =>
                            (m.treatedCondition && m.treatedCondition.toLowerCase().includes(condKeyword)) ||
                            (condition.toLowerCase().includes(m.treatedCondition?.toLowerCase().split(' ')[0] || ''))
                          );

                          return (
                            <div
                              key={idx}
                              className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/40 via-blue-50/30 to-white p-3.5 space-y-2.5"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0">
                                    <HeartPulse className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <div className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">
                                      Diagnosed Disease
                                    </div>
                                    <div className="font-extrabold text-slate-900 text-sm font-['Manrope']">
                                      {condition}
                                    </div>
                                  </div>
                                </div>
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white border border-indigo-200 text-indigo-900 shadow-2xs">
                                  {matchedMeds.length} {matchedMeds.length === 1 ? 'medicine' : 'medicines'} prescribed
                                </span>
                              </div>

                              {/* Medicines taking for this disease */}
                              {matchedMeds.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                  {matchedMeds.map((med) => (
                                    <div
                                      key={med.id}
                                      className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5"
                                    >
                                      <div className="flex items-start justify-between gap-1.5">
                                        <div className="min-w-0">
                                          <div className="font-bold text-slate-900 text-xs font-['Manrope'] truncate">
                                            {med.medicineName}
                                          </div>
                                          <div className="text-[10px] text-blue-700 font-semibold truncate">
                                            Kind: {getMedicineKind(med)} {med.brandName ? `• ${med.brandName}` : ''}
                                          </div>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => handleTakeDose(med)}
                                          disabled={med.remainingUnits <= 0}
                                          className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition flex items-center gap-1 shrink-0 cursor-pointer"
                                        >
                                          <Check className="w-3 h-3" />
                                          <span>Take</span>
                                        </button>
                                      </div>
                                      <div className="text-[11px] text-slate-600 flex items-center gap-1 truncate">
                                        <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                                        <span>{med.dosageSchedule}</span>
                                      </div>
                                      <div className="text-[10px] text-slate-500 flex items-center justify-between pt-0.5 border-t border-slate-100">
                                        <span>Stock: {med.remainingUnits}/{med.totalUnits} {med.unitLabel}</span>
                                        <span className="text-emerald-700 font-semibold">{med.expiryDate}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="p-2.5 rounded-xl bg-white/80 border border-dashed border-indigo-200 text-xs text-slate-500 flex items-center justify-between">
                                  <span>No prescription logged for {condition} yet.</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setNewMedMemberId(member.id);
                                      setNewMedCondition(condition);
                                      setIsAddMedOpen(true);
                                    }}
                                    className="text-xs font-bold text-indigo-700 hover:underline cursor-pointer"
                                  >
                                    + Add {condition} Medicine
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
                          No chronic diseases recorded for {member.name}.
                        </div>
                      )}

                      {/* Other Medicines / As-needed */}
                      {(() => {
                        const otherMeds = memberMeds.filter((m) => {
                          if (!hasDiseases) return true;
                          const matchesAny = member.chronicConditions.some((c) => {
                            const kw = c.toLowerCase().split(' ')[0];
                            return m.treatedCondition?.toLowerCase().includes(kw) || c.toLowerCase().includes(m.treatedCondition?.toLowerCase().split(' ')[0] || '');
                          });
                          return !matchesAny;
                        });

                        if (otherMeds.length === 0) return null;

                        return (
                          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 space-y-2">
                            <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                              <Pill className="w-3.5 h-3.5 text-blue-600" />
                              <span>Other General & SOS Prescriptions ({otherMeds.length})</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {otherMeds.map((med) => (
                                <div
                                  key={med.id}
                                  className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1"
                                >
                                  <div className="font-bold text-slate-900 text-xs truncate">
                                    {med.medicineName}
                                  </div>
                                  <div className="text-[11px] text-blue-800 font-semibold truncate">
                                    For: {med.treatedCondition || 'General Relief'}
                                  </div>
                                  <div className="text-[10px] text-slate-500">
                                    Kind: {getMedicineKind(med)} • {med.dosageSchedule}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 2: Medicine Inventory Grid */}
        {viewMode === 'inventory' && (
          <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 bg-slate-50/60">
            {filteredMedicines.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <Pill className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold font-['Manrope'] text-slate-900">
                  {isHindi ? 'कोई दवा नहीं मिली' : 'No medicines in this cabinet view'}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  {searchQuery || filterType !== 'all'
                    ? 'Try clearing the search query or changing your filter selection.'
                    : 'Add prescribed medicines to this family member profile to start monitoring expiry dates and stock levels.'}
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddMedOpen(true)}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold font-['Manrope'] shadow-xs hover:bg-blue-700 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'दवा जोड़ें' : 'Add First Medicine'}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {filteredMedicines.map((med) => {
                  const expInfo = getExpiryInfo(med.expiryDate);
                  const isExpired = expInfo.status === 'expired';
                  const isExpiringSoon = expInfo.status === 'expiring_soon';
                  const isLowStock = med.remainingUnits <= med.lowStockThreshold;
                  const stockPercent = Math.min(100, Math.round((med.remainingUnits / med.totalUnits) * 100));
                  const member = familyMembers.find((m) => m.id === med.memberId);

                  return (
                    <div
                      key={med.id}
                      className={`bg-white rounded-2xl border p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden ${
                        isExpired
                          ? 'border-rose-300 ring-1 ring-rose-300/40 bg-rose-50/10'
                          : isExpiringSoon
                          ? 'border-amber-300 ring-1 ring-amber-300/40 bg-amber-50/10'
                          : 'border-slate-200'
                      }`}
                    >
                      <div>
                        {/* Top Header: Member Pill & Expiry Status */}
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold font-['Manrope'] truncate">
                            {member && (
                              <div className={`w-3.5 h-3.5 rounded-full ${member.avatarBg} text-white text-[8px] flex items-center justify-center font-bold shrink-0`}>
                                {member.name.charAt(0)}
                              </div>
                            )}
                            <span className="truncate">{med.memberName}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-500 font-medium text-[10px]">{med.form}</span>
                          </div>

                          {/* Expiry Badge */}
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-['Manrope'] shrink-0 flex items-center gap-1 ${
                              isExpired
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : isExpiringSoon
                                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {isExpired && <AlertTriangle className="w-3 h-3 text-rose-600" />}
                            {isExpiringSoon && <Clock className="w-3 h-3 text-amber-600" />}
                            {expInfo.status === 'good' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                            <span>{expInfo.label}</span>
                          </span>
                        </div>

                        {/* Medicine Name & Strength */}
                        <div className="mb-2">
                          <h4 className="text-base font-extrabold font-['Manrope'] text-slate-900 leading-snug truncate">
                            {med.medicineName}
                          </h4>
                          <div className="text-xs text-slate-500 truncate mt-0.5">
                            {med.brandName ? (
                              <span>Brand: <strong className="text-blue-700 font-semibold">{med.brandName}</strong> {med.strength && `(${med.strength})`}</span>
                            ) : (
                              <span>Strength: {med.strength || 'Standard'}</span>
                            )}
                          </div>
                        </div>

                        {/* Prominent Treated Disease & Kind of Medicine */}
                        <div className="mb-2 p-2.5 rounded-xl bg-indigo-50/80 border border-indigo-200/80 space-y-1">
                          <div className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <HeartPulse className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                              <div className="min-w-0">
                                <span className="text-[9px] uppercase font-bold text-indigo-600 tracking-wider block">
                                  Disease / Condition Treated
                                </span>
                                <span className="font-extrabold text-slate-900 text-xs font-['Manrope'] truncate block">
                                  {med.treatedCondition ||
                                    findMedicineByNameOrQuery(med.medicineName)?.uses?.[0] ||
                                    findMedicineByNameOrQuery(med.medicineName)?.category ||
                                    'Clinical Condition'}
                                </span>
                              </div>
                            </div>
                            {onOpenMonograph && (
                              <button
                                type="button"
                                onClick={() => onOpenMonograph(med.medicineName)}
                                className="shrink-0 inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-indigo-100 hover:bg-indigo-200 text-indigo-900 text-[10px] font-bold font-['Manrope'] transition cursor-pointer"
                                title="View clinical facts"
                              >
                                <span>Details</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </button>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-600 pt-1 border-t border-indigo-100/90 flex items-center justify-between">
                            <span>Kind: <strong className="text-indigo-950 font-semibold">{getMedicineKind(med)}</strong></span>
                            {member && (
                              <span className="text-slate-500 truncate max-w-[120px]">For: {member.name.split(' ')[0]}</span>
                            )}
                          </div>
                        </div>

                        {/* Expired Urgent Safety Notice */}
                        {isExpired && (
                          <div className="mb-2 p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                              <span className="font-semibold text-[11px] truncate">Expired medication. Do not consume.</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setIsDisposalOpen(true)}
                              className="text-[10px] underline text-rose-700 font-bold shrink-0 hover:text-rose-900"
                            >
                              Safe Disposal
                            </button>
                          </div>
                        )}

                        {/* Daily Routine / Dosage Schedule */}
                        <div className="mb-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100 space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-slate-800 truncate flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{med.dosageSchedule}</span>
                            </span>
                          </div>
                          {med.lastTakenAt && (
                            <div className="text-[10px] text-blue-700 font-medium">
                              Last dose: {med.lastTakenAt}
                            </div>
                          )}
                        </div>

                        {/* Storage requirement (if cold-chain or light sensitive) */}
                        {med.storageCondition !== 'room_temperature' && (
                          <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1 rounded-lg bg-cyan-50 text-cyan-800 border border-cyan-200">
                            {med.storageCondition === 'refrigerated_2_8' && <Snowflake className="w-3 h-3 text-cyan-600" />}
                            {med.storageCondition === 'protect_from_light' && <Sun className="w-3 h-3 text-amber-600" />}
                            <span>
                              {med.storageCondition === 'refrigerated_2_8'
                                ? 'Cold Storage (Keep in refrigerator 2°C - 8°C)'
                                : 'Keep in dark, dry place away from sunlight'}
                            </span>
                          </div>
                        )}

                        {/* Stock Level Progress */}
                        <div className="space-y-1 mb-3 pt-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-600 font-medium">
                              Remaining: <strong className="text-slate-900 font-bold">{med.remainingUnits}</strong> of {med.totalUnits} {med.unitLabel}
                            </span>
                            {isLowStock ? (
                              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                                Low Stock Refill Needed
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-medium">{stockPercent}% remaining</span>
                            )}
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isLowStock ? 'bg-rose-500' : stockPercent < 40 ? 'bg-amber-500' : 'bg-blue-600'
                              }`}
                              style={{ width: `${stockPercent}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Bottom Action Options */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleTakeDose(med)}
                          disabled={med.remainingUnits <= 0 || isExpired}
                          className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold font-['Manrope'] transition cursor-pointer ${
                            isExpired || med.remainingUnits <= 0
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-2xs active:scale-95'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>{isHindi ? 'ख़ुराक ली (Log Dose)' : 'Take Dose'}</span>
                        </button>

                        {isLowStock && (
                          <button
                            type="button"
                            onClick={() => handleRefillMedicine(med)}
                            className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold font-['Manrope'] transition cursor-pointer border border-amber-200"
                            title="Restock units"
                          >
                            Restock
                          </button>
                        )}

                        {med.storageCondition === 'refrigerated_2_8' && onOpenTransportFacility && (
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onOpenTransportFacility(med.medicineName);
                            }}
                            className="px-2 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-cyan-200"
                            title="Order cold-chain transport delivery"
                          >
                            <Snowflake className="w-3.5 h-3.5 text-cyan-600" />
                            <span className="hidden sm:inline">Transport</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onDeleteMedicine(med.id)}
                          className="w-8 h-8 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition cursor-pointer shrink-0"
                          title="Delete from cabinet"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Modal Footer (Compact & Friendly) */}
        <div className="px-5 py-2.5 bg-white border-t border-slate-200 flex items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-600 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {isHindi
                ? `${medicines.length} दवाइयाँ सुरक्षित रूप से ट्रैक की जा रही हैं`
                : `${medicines.length} active medicines across ${familyMembers.length} family profiles`}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold font-['Manrope'] text-xs transition cursor-pointer shrink-0"
          >
            {isHindi ? 'बंद करें' : 'Done & Close'}
          </button>
        </div>
      </div>
    </div>

      {/* SUB-MODAL: Add Medicine Form */}
      {isAddMedOpen && (
        <div
          className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/80 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddMedOpen(false);
          }}
        >
          <div className="min-h-full flex items-center justify-center p-3 sm:p-4">
            <div
              className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh] my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-['Manrope']">{isHindi ? 'कैबिनेट में नई दवा जोड़ें' : 'Add Medicine to Family Cabinet'}</h3>
                  <p className="text-xs text-blue-100">Set expiry tracking, stock alarms, and storage conditions.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddMedOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

            <form onSubmit={handleSaveNewMedicine} className="p-5 overflow-y-auto flex-1 min-h-0 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Family Member Profile *</label>
                <select
                  value={newMedMemberId}
                  onChange={(e) => setNewMedMemberId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  {familyMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.relation})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Medicine Name / Molecule *</label>
                  <input
                    type="text"
                    required
                    value={newMedName}
                    onChange={(e) => handleMedNameInput(e.target.value)}
                    placeholder="e.g. Cartinex, Metformin, Dolo"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Brand Name (Optional)</label>
                  <input
                    type="text"
                    value={newMedBrand}
                    onChange={(e) => setNewMedBrand(e.target.value)}
                    placeholder="e.g. Cartinex 500, Glycomet, Calpol"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              {/* Disease / Medical Condition Treated Input */}
              <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-800 font-bold text-xs flex items-center gap-1.5">
                    <Stethoscope className="w-4 h-4 text-blue-600" />
                    <span>{isHindi ? 'उपचार की जाने वाली बीमारी / स्थिति' : 'Medical Condition / Disease Treated'}</span>
                  </label>
                  {newMedName.trim().length >= 3 && findMedicineByNameOrQuery(newMedName.trim()) && (
                    <span className="text-[10px] text-blue-700 font-bold bg-blue-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-2.5 h-2.5 text-blue-600" />
                      Auto-detected
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={newMedCondition}
                  onChange={(e) => setNewMedCondition(e.target.value)}
                  placeholder="e.g. Carnitine Deficiency & Muscle Fatigue, Type-2 Diabetes, High Fever"
                  className="w-full p-2.5 rounded-xl border border-blue-200 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-500 font-medium">Quick suggestions:</span>
                  {[
                    'Carnitine Deficiency & Fatigue',
                    'Type-2 Diabetes',
                    'Hypertension (BP)',
                    'Bacterial Infection',
                    'Fever & Pain Relief',
                    'Acid Reflux & GERD',
                  ].map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setNewMedCondition(sug)}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-white hover:bg-blue-100 text-blue-700 border border-blue-200 cursor-pointer font-medium"
                    >
                      + {sug}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Dosage Form</label>
                  <select
                    value={newMedForm}
                    onChange={(e) => setNewMedForm(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injection">Injection / Pen</option>
                    <option value="Inhaler">Inhaler</option>
                    <option value="Drops">Eye/Ear Drops</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Strength</label>
                  <input
                    type="text"
                    value={newMedStrength}
                    onChange={(e) => setNewMedStrength(e.target.value)}
                    placeholder="500mg, 100 IU"
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Batch No.</label>
                  <input
                    type="text"
                    value={newMedBatch}
                    onChange={(e) => setNewMedBatch(e.target.value)}
                    placeholder="e.g. BATCH-891"
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Expiry Date (YYYY-MM-DD) *</label>
                  <input
                    type="date"
                    required
                    value={newMedExpiry}
                    onChange={(e) => setNewMedExpiry(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Storage Condition</label>
                  <select
                    value={newMedStorage}
                    onChange={(e) => setNewMedStorage(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                  >
                    <option value="room_temperature">Room Temperature (&lt;25°C)</option>
                    <option value="refrigerated_2_8">Refrigerator Cold-Chain (2°C - 8°C)</option>
                    <option value="protect_from_light">Protect from Sunlight & Moisture</option>
                    <option value="cool_dry_place">Cool & Dry Place</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Total Pack Units</label>
                  <input
                    type="number"
                    min="1"
                    value={newMedTotal}
                    onChange={(e) => {
                      setNewMedTotal(Number(e.target.value));
                      setNewMedRemaining(Number(e.target.value));
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Units Remaining</label>
                  <input
                    type="number"
                    min="0"
                    value={newMedRemaining}
                    onChange={(e) => setNewMedRemaining(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Unit Label</label>
                  <select
                    value={newMedUnit}
                    onChange={(e) => setNewMedUnit(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="tablets">tablets</option>
                    <option value="capsules">capsules</option>
                    <option value="ml">ml (liquid)</option>
                    <option value="pens">insulin pens</option>
                    <option value="puffs">inhaler puffs</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Dosage Schedule / Instructions</label>
                <input
                  type="text"
                  value={newMedSchedule}
                  onChange={(e) => setNewMedSchedule(e.target.value)}
                  placeholder="e.g. 1 tablet twice daily after lunch and dinner"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Prescribing Doctor (Optional)</label>
                <input
                  type="text"
                  value={newMedDoctor}
                  onChange={(e) => setNewMedDoctor(e.target.value)}
                  placeholder="e.g. Dr. A. K. Verma"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddMedOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-xs cursor-pointer"
                >
                  Save to Cabinet
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      )}

      {/* SUB-MODAL: Add Member Form */}
      {isAddMemberOpen && (
        <div
          className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/80 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddMemberOpen(false);
          }}
        >
          <div className="min-h-full flex items-center justify-center p-3 sm:p-4">
            <div
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh] my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-['Manrope']">{isHindi ? 'नया परिवार सदस्य जोड़ें' : 'Add Family Member Profile'}</h3>
                  <p className="text-xs text-slate-300">Track allergies, conditions, and separate medicine vault.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddMemberOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveNewMember} className="p-5 overflow-y-auto flex-1 min-h-0 space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Relation</label>
                    <select
                      value={newMemberRelation}
                      onChange={(e) => setNewMemberRelation(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                    >
                      <option value="Self">Self</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Parent">Parent</option>
                      <option value="Grandparent">Grandparent</option>
                      <option value="Child">Child</option>
                      <option value="Sibling">Sibling</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Age (Years)</label>
                    <input
                      type="number"
                      min="0"
                      max="120"
                      value={newMemberAge}
                      onChange={(e) => setNewMemberAge(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Blood Group</label>
                  <select
                    value={newMemberBlood}
                    onChange={(e) => setNewMemberBlood(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
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

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Drug Allergies (Comma separated)</label>
                  <input
                    type="text"
                    value={newMemberAllergies}
                    onChange={(e) => setNewMemberAllergies(e.target.value)}
                    placeholder="e.g. Penicillin, Sulfa drugs"
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Chronic Conditions (Comma separated)</label>
                  <input
                    type="text"
                    value={newMemberConditions}
                    onChange={(e) => setNewMemberConditions(e.target.value)}
                    placeholder="e.g. Hypertension, Asthma"
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddMemberOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition shadow-xs cursor-pointer"
                  >
                    Create Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL: Safe Disposal Guidelines */}
      {isDisposalOpen && (
        <div
          className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/80 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsDisposalOpen(false);
          }}
        >
          <div className="min-h-full flex items-center justify-center p-3 sm:p-4">
            <div
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh] my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-700 to-amber-700 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                    <ShieldAlert className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-['Manrope']">{isHindi ? 'सुरक्षित दवा निपटान नियम' : 'FDA / WHO Safe Medicine Disposal'}</h3>
                    <p className="text-xs text-rose-100">Never consume expired medicines or harm the environment.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDisposalOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-3.5 text-xs text-slate-700 leading-relaxed overflow-y-auto flex-1 min-h-0">
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-2.5">
                  <span className="font-black text-blue-700 text-sm">1.</span>
                  <div>
                    <strong className="text-blue-900 block font-['Manrope']">Pharmacy Medicine Take-Back Dropboxes (Best)</strong>
                    Most major hospital pharmacies and authorized chemists offer safe medicine take-back bins for proper clinical incineration.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5">
                  <span className="font-black text-amber-700 text-sm">2.</span>
                  <div>
                    <strong className="text-amber-900 block font-['Manrope']">Household Trash Disposal (If Take-Back Unavailable)</strong>
                    Mix unused tablets or liquids with an unpalatable substance (used coffee grounds, cat litter, or dirt). Place inside a sealed plastic bag before putting in regular household garbage. Do not crush tablets.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5">
                  <span className="font-black text-rose-700 text-sm">3.</span>
                  <div>
                    <strong className="text-rose-900 block font-['Manrope']">Never Flush Antibiotics or Hormones into Sinks/Toilets</strong>
                    Flushing enters public waterways and creates dangerous antibiotic resistance in water reservoirs. Only specific emergency flush-list narcotics (e.g. Fentanyl patches) should ever be flushed.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                  <span className="font-black text-slate-700 text-sm">4.</span>
                  <div>
                    <strong className="text-slate-900 block font-['Manrope']">Scratch Out Personal Details on Prescription Bottles</strong>
                    Always peel off or cross out patient names, Rx numbers, and phone numbers with permanent black marker before recycling the plastic bottle.
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsDisposalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer"
                >
                  Understood
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
