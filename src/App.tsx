import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PrimaryScanner } from './components/PrimaryScanner';
import { MedicineSearchResultModal } from './components/MedicineSearchResultModal';
import { MedicineLibrarySection } from './components/MedicineLibrarySection';
import { ScanModal } from './components/ScanModal';
import { IdentificationResultModal } from './components/IdentificationResultModal';
import { MedicineInfoModal } from './components/MedicineInfoModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { SavedMedicinesDrawer } from './components/SavedMedicinesDrawer';
import { ProfileModal } from './components/ProfileModal';
import { SafetyModal } from './components/SafetyModal';
import { Footer } from './components/Footer';
import { MedicineReminderModal } from './components/reminders/MedicineReminderModal';
import { AddEditReminderModal } from './components/reminders/AddEditReminderModal';
import { DueDoseBanner } from './components/reminders/DueDoseBanner';
import { CareFinderModal } from './components/finder/CareFinderModal';
import { NearbyCareSection } from './components/finder/NearbyCareSection';
import { CareFinderOptionCard } from './components/finder/CareFinderOptionCard';
import { OrganDonorSectionCard } from './components/modules/OrganDonorSectionCard';
import { PrescriptionScannerCard } from './components/modules/PrescriptionScannerCard';
import { ClinicalFeatureOptionCards } from './components/modules/ClinicalFeatureOptionCards';
import { AIAssistantModal } from './components/assistant/AIAssistantModal';
import { FloatingAIAssistantButton } from './components/assistant/FloatingAIAssistantButton';
import { PrescriptionScannerModal } from './components/modules/PrescriptionScannerModal';
import { DrugInteractionCheckerModal } from './components/modules/DrugInteractionCheckerModal';
import { MedicineComparisonModal } from './components/modules/MedicineComparisonModal';
import { ClinicalMonographModal } from './components/modules/ClinicalMonographModal';
import { MultilingualModal } from './components/modules/MultilingualModal';
import { VoiceSearchModal } from './components/modules/VoiceSearchModal';
import { FamilyMedicineCabinetModal } from './components/cabinet/FamilyMedicineCabinetModal';
import { MedicineTransportModal } from './components/transport/MedicineTransportModal';
import { HospitalBloodOrganModal } from './components/network/HospitalBloodOrganModal';
import { FamilyHealthAndLogisticsCards } from './components/modules/FamilyHealthAndLogisticsCards';
import { DEFAULT_FAMILY_MEMBERS, DEFAULT_CABINET_MEDICINES } from './data/defaultFamilyCabinet';
import { DEFAULT_ACTIVE_TRANSPORT_REQUESTS } from './data/defaultMedicineTransport';
import {
  DEFAULT_HOSPITAL_BLOOD_INVENTORIES,
  DEFAULT_HOSPITAL_ORGAN_LISTINGS,
  DEFAULT_INTER_HOSPITAL_TRANSFERS,
} from './data/defaultBloodAndOrgans';
import { INITIAL_DEFAULT_REMINDERS } from './data/defaultReminders';
import { getTodayScheduledDoses, getLocalDateKey } from './utils/reminderHelpers';
import { playReminderChime, triggerDesktopNotification } from './utils/reminderAudio';
import { MEDICINES, findMedicineByNameOrQuery, searchMedicinesQuick } from './data/medicineDatabase';
import {
  Medicine,
  IdentificationResult,
  ScanHistoryItem,
  ActiveTab,
  MedicineReminder,
  DoseLog,
  FacilityType,
  HealthcareFacility,
  FamilyMember,
  CabinetMedicine,
  MedicineTransportRequest,
  HospitalBloodInventory,
  HospitalOrganListing,
  InterHospitalTransferRequest,
  BloodGroup,
  BloodComponentType,
} from './types';
import { Check, Bookmark, AlertCircle, ArrowLeft } from 'lucide-react';

export default function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [libraryQuery, setLibraryQuery] = useState('');

  // Modals & Drawers
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [pendingScanImage, setPendingScanImage] = useState<string | null>(null);
  const [identificationResult, setIdentificationResult] = useState<IdentificationResult | null>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [selectedMedicineForInfo, setSelectedMedicineForInfo] = useState<Medicine | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);

  // Modular Profile Capabilities state
  const [isPrescriptionScannerOpen, setIsPrescriptionScannerOpen] = useState(false);
  const [isInteractionCheckerOpen, setIsInteractionCheckerOpen] = useState(false);
  const [interactionMedicines, setInteractionMedicines] = useState<string[]>([]);
  const [isMedicineComparisonOpen, setIsMedicineComparisonOpen] = useState(false);
  const [comparisonPair, setComparisonPair] = useState<{ med1?: string; med2?: string }>({});
  const [isClinicalMonographOpen, setIsClinicalMonographOpen] = useState(false);
  const [monographMedicine, setMonographMedicine] = useState<Medicine | null>(null);
  const [isMultilingualOpen, setIsMultilingualOpen] = useState(false);
  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState(false);

  // Nearby Hospital and Pharmacy Finder state (Google Maps Platform)
  const [isCareFinderModalOpen, setIsCareFinderModalOpen] = useState(false);
  const [careFinderInitialType, setCareFinderInitialType] = useState<FacilityType | 'all'>('all');
  const [careFinderMedicineName, setCareFinderMedicineName] = useState<string | undefined>(undefined);

  const handleOpenCareFinder = (type: FacilityType | 'all' = 'all', medicineName?: string) => {
    setCareFinderInitialType(type);
    setCareFinderMedicineName(medicineName);
    setActiveTab('finder');
    try {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } catch {
      // ignore
    }
  };

  const handleScrollToCareFinderSection = () => {
    setActiveTab('finder');
    try {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } catch {
      // ignore
    }
  };

  const handleBackToHome = () => {
    setActiveTab('home');
    setCareFinderMedicineName(undefined);
    try {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } catch {
      // ignore
    }
  };

  // Dedicated Search Result Pop-up Modal state (Direct-message & symbols)
  const [activeSearchResult, setActiveSearchResult] = useState<Medicine | null>(null);
  const [alternativeMatches, setAlternativeMatches] = useState<Medicine[]>([]);
  const [isSearchResultModalOpen, setIsSearchResultModalOpen] = useState(false);

  // Multilingual & Accessible AI Voice Health Assistant state
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [assistantMedicineContext, setAssistantMedicineContext] = useState<string | undefined>(undefined);

  const handleOpenAIAssistant = (medicineContext?: string) => {
    setAssistantMedicineContext(medicineContext);
    setIsAIAssistantOpen(true);
  };

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Saved medicines persisted locally
  const [savedMedicines, setSavedMedicines] = useState<Medicine[]>(() => {
    try {
      const saved = localStorage.getItem('mina_saved_medicines');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read saved medicines from storage', e);
    }
    // Default with Paracetamol saved for great immediate discovery
    return [MEDICINES[0]];
  });

  // Scan history persisted locally
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>(() => {
    try {
      const hist = localStorage.getItem('mina_scan_history');
      if (hist) return JSON.parse(hist);
    } catch (e) {
      console.warn('Could not read scan history from storage', e);
    }
    return [
      {
        id: 'hist-1',
        medicine: MEDICINES[0],
        timestamp: 'Today, 10:14 AM',
        confidenceScore: 98,
      },
    ];
  });

  // Medicine Reminders & Dose Logs state (Persisted locally)
  const [reminders, setReminders] = useState<MedicineReminder[]>(() => {
    try {
      const saved = localStorage.getItem('mina_medicine_reminders');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read reminders from storage', e);
    }
    return INITIAL_DEFAULT_REMINDERS;
  });

  const [doseLogs, setDoseLogs] = useState<DoseLog[]>(() => {
    try {
      const saved = localStorage.getItem('mina_dose_logs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read dose logs from storage', e);
    }
    return [];
  });

  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isAddEditReminderModalOpen, setIsAddEditReminderModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<MedicineReminder | null>(null);
  const [medicineForNewReminder, setMedicineForNewReminder] = useState<Medicine | null>(null);
  const [dismissedDueSlotIds, setDismissedDueSlotIds] = useState<string[]>([]);
  const [lastChimedSlotId, setLastChimedSlotId] = useState<string | null>(null);

  // Persist state updates
  useEffect(() => {
    try {
      localStorage.setItem('mina_saved_medicines', JSON.stringify(savedMedicines));
    } catch (e) {
      console.warn('Could not write saved medicines', e);
    }
  }, [savedMedicines]);

  useEffect(() => {
    try {
      localStorage.setItem('mina_scan_history', JSON.stringify(scanHistory));
    } catch (e) {
      console.warn('Could not write scan history', e);
    }
  }, [scanHistory]);

  useEffect(() => {
    try {
      localStorage.setItem('mina_medicine_reminders', JSON.stringify(reminders));
    } catch (e) {
      console.warn('Could not write reminders to storage', e);
    }
  }, [reminders]);

  useEffect(() => {
    try {
      localStorage.setItem('mina_dose_logs', JSON.stringify(doseLogs));
    } catch (e) {
      console.warn('Could not write dose logs to storage', e);
    }
  }, [doseLogs]);

  // Family Medicine Cabinet state (Persisted locally)
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(() => {
    try {
      const saved = localStorage.getItem('mediinfo_family_members');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read family members from storage', e);
    }
    return DEFAULT_FAMILY_MEMBERS;
  });

  const [cabinetMedicines, setCabinetMedicines] = useState<CabinetMedicine[]>(() => {
    try {
      const saved = localStorage.getItem('mediinfo_cabinet_medicines');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read cabinet medicines from storage', e);
    }
    return DEFAULT_CABINET_MEDICINES;
  });

  const [isCabinetModalOpen, setIsCabinetModalOpen] = useState(false);

  // Medicine Cold-Chain Transport Facility state (Persisted locally)
  const [transportRequests, setTransportRequests] = useState<MedicineTransportRequest[]>(() => {
    try {
      const saved = localStorage.getItem('mediinfo_transport_requests');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read transport requests from storage', e);
    }
    return DEFAULT_ACTIVE_TRANSPORT_REQUESTS;
  });

  const [isTransportModalOpen, setIsTransportModalOpen] = useState(false);
  const [transportPrefillMedicine, setTransportPrefillMedicine] = useState<string | undefined>(undefined);
  const [transportPrefillFacility, setTransportPrefillFacility] = useState<HealthcareFacility | undefined>(undefined);

  const handleOpenTransport = (medicineName?: string, facility?: HealthcareFacility) => {
    setTransportPrefillMedicine(medicineName);
    setTransportPrefillFacility(facility);
    setIsTransportModalOpen(true);
  };

  useEffect(() => {
    try {
      localStorage.setItem('mediinfo_family_members', JSON.stringify(familyMembers));
    } catch (e) {
      console.warn('Failed to save family members', e);
    }
  }, [familyMembers]);

  useEffect(() => {
    try {
      localStorage.setItem('mediinfo_cabinet_medicines', JSON.stringify(cabinetMedicines));
    } catch (e) {
      console.warn('Failed to save cabinet medicines', e);
    }
  }, [cabinetMedicines]);

  useEffect(() => {
    try {
      localStorage.setItem('mediinfo_transport_requests', JSON.stringify(transportRequests));
    } catch (e) {
      console.warn('Failed to save transport requests', e);
    }
  }, [transportRequests]);

  const handleAddCabinetMedicine = (newMed: Omit<CabinetMedicine, 'id'>) => {
    const medWithId: CabinetMedicine = {
      ...newMed,
      id: `cab-${Date.now()}`,
    };
    setCabinetMedicines((prev) => [medWithId, ...prev]);
    showToast(`${newMed.medicineName} added to ${newMed.memberName}'s cabinet`);
  };

  const handleUpdateCabinetMedicine = (updatedMed: CabinetMedicine) => {
    setCabinetMedicines((prev) => prev.map((m) => (m.id === updatedMed.id ? updatedMed : m)));
  };

  const handleDeleteCabinetMedicine = (id: string) => {
    setCabinetMedicines((prev) => prev.filter((m) => m.id !== id));
    showToast('Medicine removed from cabinet', 'info');
  };

  const handleAddFamilyMember = (newMember: Omit<FamilyMember, 'id'>) => {
    const memberWithId: FamilyMember = {
      ...newMember,
      id: `member-${Date.now()}`,
    };
    setFamilyMembers((prev) => [...prev, memberWithId]);
    showToast(`Profile created for ${newMember.name}`);
  };

  const handleBookTransport = (newReq: Omit<MedicineTransportRequest, 'id'>) => {
    const reqWithId: MedicineTransportRequest = {
      ...newReq,
      id: `req-${Date.now()}`,
    };
    setTransportRequests((prev) => [reqWithId, ...prev]);
    showToast(`Medical dispatch confirmed! Tracking: ${newReq.trackingCode}`);
  };

  // Inter-Hospital Blood & Organ Availability Network state (Persisted locally)
  const [isBloodOrganModalOpen, setIsBloodOrganModalOpen] = useState(false);
  const [bloodOrganDefaultTab, setBloodOrganDefaultTab] = useState<'blood' | 'organs' | 'transfers' | 'manage'>('blood');

  const [bloodInventories, setBloodInventories] = useState<HospitalBloodInventory[]>(() => {
    try {
      const saved = localStorage.getItem('mediinfo_blood_inventories');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load blood inventories', e);
    }
    return DEFAULT_HOSPITAL_BLOOD_INVENTORIES;
  });

  const [organListings, setOrganListings] = useState<HospitalOrganListing[]>(() => {
    try {
      const saved = localStorage.getItem('mediinfo_organ_listings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load organ listings', e);
    }
    return DEFAULT_HOSPITAL_ORGAN_LISTINGS;
  });

  const [interHospitalTransfers, setInterHospitalTransfers] = useState<InterHospitalTransferRequest[]>(() => {
    try {
      const saved = localStorage.getItem('mediinfo_interhospital_transfers');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load inter-hospital transfers', e);
    }
    return DEFAULT_INTER_HOSPITAL_TRANSFERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('mediinfo_blood_inventories', JSON.stringify(bloodInventories));
    } catch (e) {
      console.warn('Failed to save blood inventories', e);
    }
  }, [bloodInventories]);

  useEffect(() => {
    try {
      localStorage.setItem('mediinfo_organ_listings', JSON.stringify(organListings));
    } catch (e) {
      console.warn('Failed to save organ listings', e);
    }
  }, [organListings]);

  useEffect(() => {
    try {
      localStorage.setItem('mediinfo_interhospital_transfers', JSON.stringify(interHospitalTransfers));
    } catch (e) {
      console.warn('Failed to save transfers', e);
    }
  }, [interHospitalTransfers]);

  const handleOpenBloodOrgan = (tab: 'blood' | 'organs' | 'transfers' | 'manage' = 'blood') => {
    setBloodOrganDefaultTab(tab);
    setIsBloodOrganModalOpen(true);
  };

  const handleAddBloodUnits = (hospitalId: string, group: BloodGroup, units: number, component: BloodComponentType) => {
    setBloodInventories((prev) =>
      prev.map((h) => {
        if (h.hospitalId !== hospitalId) return h;
        const currentGroup = h.bloodUnits[group] || { units: 0, status: 'low' };
        const newUnits = currentGroup.units + units;
        const newStatus = newUnits >= 20 ? 'ample' : newUnits >= 10 ? 'moderate' : newUnits >= 5 ? 'low' : 'critical';
        const currentComponents = currentGroup.components || { prbc: 0, platelets: 0, ffp: 0 };
        return {
          ...h,
          lastUpdated: 'Updated just now',
          bloodUnits: {
            ...h.bloodUnits,
            [group]: {
              ...currentGroup,
              units: newUnits,
              status: newStatus,
              components: {
                ...currentComponents,
                [component]: (currentComponents[component] || 0) + units,
              },
            },
          },
        };
      })
    );
    showToast(`Added ${units} units of ${group} to hospital blood stock`);
  };

  const handleRegisterOrgan = (newOrgan: Omit<HospitalOrganListing, 'id' | 'coldIschemiaRemainingMinutes'>) => {
    const organWithId: HospitalOrganListing = {
      ...newOrgan,
      id: `org-${Date.now()}`,
      coldIschemiaRemainingMinutes: newOrgan.maxColdIschemiaHours * 60 - 20,
    };
    setOrganListings((prev) => [organWithId, ...prev]);
    showToast(`Registered ${newOrgan.organType.toUpperCase()} on inter-hospital transplant registry`);
  };

  const handleRequestInterHospitalTransfer = (transfer: Omit<InterHospitalTransferRequest, 'id' | 'initiatedAt'>) => {
    const transferWithId: InterHospitalTransferRequest = {
      ...transfer,
      id: `xfer-${Date.now()}`,
      initiatedAt: 'Just now',
    };
    setInterHospitalTransfers((prev) => [transferWithId, ...prev]);
    showToast(`Emergency transfer dispatched: ${transfer.itemDetails}`);
  };

  // Real-time scheduled doses for today
  const scheduledToday = getTodayScheduledDoses(reminders, doseLogs);
  const dueDoses = scheduledToday.filter(
    (d) => (d.status === 'due' || d.status === 'overdue') && !dismissedDueSlotIds.includes(d.slotId)
  );
  const activeDueDose = dueDoses.length > 0 ? dueDoses[0] : null;

  // Background ticker checking for due doses and chiming
  useEffect(() => {
    if (!activeDueDose) return;

    if (lastChimedSlotId !== activeDueDose.slotId) {
      setLastChimedSlotId(activeDueDose.slotId);
      playReminderChime();
      triggerDesktopNotification(
        `Medicine Reminder: ${activeDueDose.medicineName}`,
        `Time to take ${activeDueDose.doseAmount} (${activeDueDose.mealRelation.replace('-', ' ')})`
      );
    }
  }, [activeDueDose, lastChimedSlotId]);

  // Reminder Management Handlers
  const handleSaveReminder = (reminder: MedicineReminder) => {
    setReminders((prev) => {
      const idx = prev.findIndex((r) => r.id === reminder.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = reminder;
        return next;
      }
      return [reminder, ...prev];
    });
    showToast(`Reminder saved for ${reminder.medicineName}`, 'success');
  };

  const handleOpenInteractionChecker = (medicineNames?: string[]) => {
    if (medicineNames && medicineNames.length > 0) {
      setInteractionMedicines(medicineNames);
    }
    setIsInteractionCheckerOpen(true);
  };

  const handleOpenMedicineComparison = (med1?: string, med2?: string) => {
    setComparisonPair({ med1, med2 });
    setIsMedicineComparisonOpen(true);
  };

  const handleOpenClinicalMonograph = (med?: Medicine | string) => {
    if (typeof med === 'string') {
      const found = findMedicineByNameOrQuery(med);
      setMonographMedicine(found || null);
    } else {
      setMonographMedicine(med || null);
    }
    setIsClinicalMonographOpen(true);
  };

  const handleAddPrescriptionToReminder = (medName: string, _frequency: string, instructions: string) => {
    const med = findMedicineByNameOrQuery(medName);
    const newRem: MedicineReminder = {
      id: `rem-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      medicineId: med?.id,
      medicineName: medName,
      genericName: med?.genericName,
      dosageForm: med?.forms[0] || 'Tablet',
      category: med?.category,
      visualType: med?.visualType || 'tablet',
      visualColor: med?.visualColor || 'blue',
      pillColor: med?.pillColor || 'white',
      frequency: 'twice_daily',
      doseTimes: [
        { id: `slot-m`, time: '09:00', label: 'Morning', doseAmount: '1 Tablet', mealRelation: 'after_meal' },
        { id: `slot-e`, time: '21:00', label: 'Night', doseAmount: '1 Tablet', mealRelation: 'after_meal' },
      ],
      startDate: new Date().toISOString().split('T')[0],
      durationDays: 5,
      instructions: instructions || 'Take after meals with water',
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    setReminders((prev) => [newRem, ...prev]);
    showToast(`Added ${medName} to Dose Reminders`, 'success');
  };

  const handleDeleteReminder = (reminderId: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== reminderId));
    showToast('Reminder schedule deleted', 'info');
  };

  const handleToggleReminderActive = (reminderId: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === reminderId ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const handleLogDose = (
    reminderId: string,
    slotId: string,
    status: 'taken' | 'skipped' | 'snoozed'
  ) => {
    const reminder = reminders.find((r) => r.id === reminderId);
    if (!reminder) return;

    const timePart = slotId.split('-')[1] || '08:00';
    const newLog: DoseLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      reminderId,
      slotId,
      dateKey: getLocalDateKey(),
      scheduledTime: timePart,
      loggedAt: new Date().toISOString(),
      status,
      medicineName: reminder.medicineName,
    };

    setDoseLogs((prev) => [newLog, ...prev]);

    if (status === 'taken') {
      playReminderChime();
      // Deduct pill if inventory tracked
      if (typeof reminder.pillsRemaining === 'number' && reminder.pillsRemaining > 0) {
        setReminders((prev) =>
          prev.map((r) =>
            r.id === reminderId
              ? { ...r, pillsRemaining: Math.max(0, (r.pillsRemaining ?? 1) - 1) }
              : r
          )
        );
      }
      showToast(`Logged dose for ${reminder.medicineName} as taken!`, 'success');
    } else if (status === 'skipped') {
      showToast(`Marked ${reminder.medicineName} dose as skipped`, 'info');
    } else if (status === 'snoozed') {
      showToast(`Snoozed ${reminder.medicineName} dose reminder`, 'info');
    }
  };

  const handleOpenAddReminderForMedicine = (med: Medicine) => {
    setEditingReminder(null);
    setMedicineForNewReminder(med);
    setIsAddEditReminderModalOpen(true);
  };

  const handleOpenEditReminder = (reminder: MedicineReminder) => {
    setMedicineForNewReminder(null);
    setEditingReminder(reminder);
    setIsAddEditReminderModalOpen(true);
  };

  // Toggle Save medicine
  const handleToggleSaveMedicine = (medicine: Medicine) => {
    const exists = savedMedicines.some((m) => m.id === medicine.id);
    if (exists) {
      setSavedMedicines((prev) => prev.filter((m) => m.id !== medicine.id));
      showToast(`Removed ${medicine.name} from saved items`, 'info');
    } else {
      setSavedMedicines((prev) => [medicine, ...prev]);
      showToast(`Saved ${medicine.name} to personal records`, 'success');
    }
  };

  const handleRemoveSavedMedicine = (medicineId: string) => {
    setSavedMedicines((prev) => prev.filter((m) => m.id !== medicineId));
    showToast('Item removed from saved list', 'info');
  };

  const handleClearHistory = () => {
    setScanHistory([]);
    showToast('Scan history cleared', 'info');
  };

  // Identification workflow handler
  const handleMedicineIdentified = (result: IdentificationResult) => {
    setIdentificationResult(result);
    setIsScanModalOpen(false);
    setIsResultModalOpen(true);

    // Append to scan history
    if (result.medicine) {
      const historyItem: ScanHistoryItem = {
        id: 'hist-' + Date.now(),
        medicine: result.medicine,
        timestamp: 'Just now',
        confidenceScore: result.confidenceScore || 98,
      };
      setScanHistory((prev) => [historyItem, ...prev]);
    }
  };

  // Direct manual name search or selection
  const handleSelectMedicineByName = async (name: string) => {
    const matched = findMedicineByNameOrQuery(name);
    if (matched) {
      setActiveSearchResult(matched);
      const others = searchMedicinesQuick(matched.genericName || name, 5).filter(
        (m) => m.id !== matched.id
      );
      setAlternativeMatches(others);
      setIsSearchResultModalOpen(true);

      // If smart generated profile, attempt live background enrichment via /api/identify
      if (matched.id.startsWith('smart-')) {
        try {
          const res = await fetch('/api/identify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: name }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data && data.name && Array.isArray(data.uses) && data.uses.length > 0) {
              setActiveSearchResult((prev) => {
                if (!prev || prev.id !== matched.id) return prev;
                return {
                  ...prev,
                  name: data.name || prev.name,
                  genericName: data.genericName || prev.genericName,
                  category: data.category || prev.category,
                  overview: data.overview || prev.overview,
                  uses: data.uses && data.uses.length > 0 ? data.uses : prev.uses,
                  dosage: data.dosage || prev.dosage,
                  sideEffects: data.sideEffects || prev.sideEffects,
                  precautions: data.precautions || prev.precautions,
                  warnings: data.warnings || prev.warnings,
                };
              });
            }
          }
        } catch {
          // Keep instant smart profile
        }
      }
    } else {
      // Switch to library search tab with query
      setLibraryQuery(name);
      setActiveTab('library');
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  // Handle direct file upload from primary scanner
  const handlePrimaryUploadImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPendingScanImage(dataUrl);
      setIsScanModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  // Open Full Information Modal from Result Modal
  const handleViewFullInfoFromResult = (medicine: Medicine) => {
    setIsResultModalOpen(false);
    setActiveSearchResult(medicine);
    const others = searchMedicinesQuick(medicine.genericName || medicine.name, 5).filter(
      (m) => m.id !== medicine.id
    );
    setAlternativeMatches(others);
    setIsSearchResultModalOpen(true);
  };

  const isCurrentMedicineSaved = (med: Medicine | null) => {
    if (!med) return false;
    return savedMedicines.some((m) => m.id === med.id);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-['Inter'] antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* ============================================================ */}
      {/* FLOATING TOP NAVIGATION                                      */}
      {/* ============================================================ */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'home') {
            handleBackToHome();
          } else {
            setActiveTab(tab);
            if (tab === 'search') {
              const scanner = document.getElementById('primary-scanner-card');
              if (scanner) {
                scanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const input = document.getElementById('scanner-search-input');
                input?.focus();
              }
            } else {
              try {
                window.scrollTo(0, 0);
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
              } catch {
                // ignore
              }
            }
          }
        }}
        onOpenHistory={() => setIsHistoryDrawerOpen(true)}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenReminders={() => setIsReminderModalOpen(true)}
        dueRemindersCount={dueDoses.length}
        cabinetCount={cabinetMedicines.length}
        historyCount={scanHistory.length}
        savedCount={savedMedicines.length}
      />

      {/* Floating Due Dose Banner */}
      <DueDoseBanner
        dueDoses={dueDoses}
        onTakeDose={(reminderId, slotId) => handleLogDose(reminderId, slotId, 'taken')}
        onSnoozeDose={(reminderId, slotId) => {
          handleLogDose(reminderId, slotId, 'snoozed');
          setDismissedDueSlotIds((prev) => [...prev, slotId]);
        }}
        onOpenRemindersModal={() => setIsReminderModalOpen(true)}
        onDismiss={(slotId) => setDismissedDueSlotIds((prev) => [...prev, slotId])}
      />

      {/* ============================================================ */}
      {/* MAIN VIEW CONTENT (Home / Library / Search)                  */}
      {/* ============================================================ */}
      <main className="flex-1 w-full">
        {activeTab === 'home' && (
          <>
            {/* 1. HERO SECTION (Vision & 3D Medicine Preview) */}
            <HeroSection />

            {/* 2. PILL IDENTIFICATION & MEDICINE LOOKUP SCANNER (AT TOP) */}
            <PrimaryScanner
              onOpenScanCamera={() => {
                setPendingScanImage(null);
                setIsScanModalOpen(true);
              }}
              onUploadImage={handlePrimaryUploadImage}
              onSearchMedicine={handleSelectMedicineByName}
              onSelectMedicineName={handleSelectMedicineByName}
            />

            {/* 3. NEARBY PHARMACY & HEALTHCARE RADAR */}
            <CareFinderOptionCard
              onOpenFinder={(type = 'all') => handleOpenCareFinder(type)}
              onOpenTransport={() => handleOpenTransport()}
            />

            {/* 4. ORGAN DONOR & HOSPITAL BLOOD NETWORK */}
            <OrganDonorSectionCard
              bloodInventories={bloodInventories}
              organListings={organListings}
              onOpenBloodOrganModal={(tab) => handleOpenBloodOrgan(tab)}
            />

            {/* 5. DOCTOR PRESCRIPTION SCANNER & DIGITAL OCR */}
            <PrescriptionScannerCard
              onOpenPrescriptionScanner={() => setIsPrescriptionScannerOpen(true)}
            />

            {/* 6. MEDICINE TRANSPORTATION & FAMILY HEALTH VAULT */}
            <FamilyHealthAndLogisticsCards
              familyMembers={familyMembers}
              cabinetMedicines={cabinetMedicines}
              activeTransportRequests={transportRequests}
              onOpenCabinet={() => setIsCabinetModalOpen(true)}
              onOpenTransport={(medName) => handleOpenTransport(medName)}
            />

            {/* 7. CLINICAL SAFETY & ADHERENCE TOOLS (Comparison, Reminders) */}
            <ClinicalFeatureOptionCards
              onOpenMedicineComparison={(m1, m2) => handleOpenMedicineComparison(m1, m2)}
              onOpenReminders={() => setIsReminderModalOpen(true)}
              remindersCount={reminders.length}
            />
          </>
        )}

        {/* CARE FINDER TAB VIEW (COMPLETE WORKING FEATURE) */}
        {activeTab === 'finder' && (
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-12">
            {/* Top Navigation Bar with Back Button */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
              <button
                id="btn-back-to-home-top"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleBackToHome();
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-['Manrope'] font-bold text-xs sm:text-sm border border-slate-200 shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer group"
              >
                <ArrowLeft className="w-4 h-4 text-blue-600 group-hover:-translate-x-0.5 transition-transform" />
                <span>Back to Home Page</span>
              </button>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleBackToHome();
                  }}
                  className="hover:text-blue-600 transition cursor-pointer"
                >
                  Home
                </button>
                <span>/</span>
                <span className="text-blue-600 font-bold">Nearby Care Finder</span>
              </div>
            </div>

            {/* Complete working of Nearby Care Section */}
            <NearbyCareSection
              initialType={careFinderInitialType}
              activeMedicineFilter={careFinderMedicineName}
              onOpenTransport={(fac, medName) => handleOpenTransport(medName, fac)}
            />
          </div>
        )}

        {/* LIBRARY TAB VIEW */}
        {activeTab === 'library' && (
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-12">
            <div className="mb-4">
              <button
                id="btn-back-to-home-library"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleBackToHome();
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-['Manrope'] font-bold text-xs sm:text-sm border border-slate-200 shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer group"
              >
                <ArrowLeft className="w-4 h-4 text-blue-600 group-hover:-translate-x-0.5 transition-transform" />
                <span>Back to Home Page</span>
              </button>
            </div>
            <MedicineLibrarySection
              medicines={MEDICINES}
              initialSearchQuery={libraryQuery}
              onSelectMedicine={(med) => {
                setActiveSearchResult(med);
                const others = searchMedicinesQuick(med.genericName || med.name, 5).filter(
                  (m) => m.id !== med.id
                );
                setAlternativeMatches(others);
                setIsSearchResultModalOpen(true);
              }}
            />
          </div>
        )}

        {/* SEARCH TAB VIEW */}
        {activeTab === 'search' && (
          <div className="pt-6">
            <PrimaryScanner
              onOpenScanCamera={() => setIsScanModalOpen(true)}
              onUploadImage={handlePrimaryUploadImage}
              onSearchMedicine={handleSelectMedicineByName}
              onSelectMedicineName={handleSelectMedicineByName}
            />
          </div>
        )}
      </main>

      {/* ============================================================ */}
      {/* FOOTER                                                       */}
      {/* ============================================================ */}
      <Footer
        onNavigateHome={handleBackToHome}
        onNavigateLibrary={() => {
          setActiveTab('library');
          try {
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
          } catch {
            // ignore
          }
        }}
        onOpenSafetyDisclaimer={() => setIsSafetyModalOpen(true)}
        onNavigateCareFinder={handleScrollToCareFinderSection}
        onNavigateSearch={() => {
          setActiveTab('home');
          setTimeout(() => {
            const scanner = document.getElementById('primary-scanner-card');
            scanner?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            const input = document.getElementById('scanner-search-input');
            input?.focus();
          }, 100);
        }}
        onOpenScanner={() => {
          setPendingScanImage(null);
          setIsScanModalOpen(true);
        }}
        onOpenReminders={() => setIsReminderModalOpen(true)}
        onOpenBloodOrgan={() => handleOpenBloodOrgan()}
        onOpenPrescriptionScanner={() => setIsPrescriptionScannerOpen(true)}
        onOpenTransport={() => handleOpenTransport()}
        onOpenCabinet={() => setIsCabinetModalOpen(true)}
        onOpenComparison={() => handleOpenMedicineComparison()}
      />

      {/* ============================================================ */}
      {/* MODALS & DRAWERS                                             */}
      {/* ============================================================ */}

      {/* 0. Dedicated Medicine Search Result Pop-up Modal */}
      <MedicineSearchResultModal
        medicine={activeSearchResult}
        isOpen={isSearchResultModalOpen}
        onClose={() => setIsSearchResultModalOpen(false)}
        alternativeMatches={alternativeMatches}
        onSelectAlternative={(med) => {
          setActiveSearchResult(med);
          const others = searchMedicinesQuick(med.genericName || med.name, 5).filter(
            (m) => m.id !== med.id
          );
          setAlternativeMatches(others);
        }}
        onOpenFullMonograph={(med) => {
          setSelectedMedicineForInfo(med);
          setIsInfoModalOpen(true);
        }}
        isSaved={isCurrentMedicineSaved(activeSearchResult)}
        onToggleSave={handleToggleSaveMedicine}
        onOpenReminder={handleOpenAddReminderForMedicine}
        onOpenPharmacyFinder={(medName) => handleOpenCareFinder('pharmacy', medName)}
        onOpenTransport={(medName) => handleOpenTransport(medName)}
        onOpenAIAssistant={handleOpenAIAssistant}
      />

      {/* 1. Camera / Photo Scanner Modal */}
      <ScanModal
        isOpen={isScanModalOpen}
        initialImage={pendingScanImage}
        onClose={() => {
          setIsScanModalOpen(false);
          setPendingScanImage(null);
        }}
        onIdentified={handleMedicineIdentified}
        onSearchManually={() => {
          setIsScanModalOpen(false);
          setPendingScanImage(null);
          setActiveTab('search');
        }}
      />

      {/* 2. Identification Result Modal */}
      <IdentificationResultModal
        result={identificationResult}
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        onViewFullInfo={handleViewFullInfoFromResult}
        isSaved={isCurrentMedicineSaved(identificationResult?.medicine || null)}
        onToggleSave={handleToggleSaveMedicine}
      />

      {/* 3. Comprehensive Medicine Information Modal */}
      <MedicineInfoModal
        medicine={selectedMedicineForInfo}
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        isSaved={isCurrentMedicineSaved(selectedMedicineForInfo)}
        onToggleSave={handleToggleSaveMedicine}
        onOpenPharmacyFinder={(medName) => handleOpenCareFinder('pharmacy', medName)}
        onOpenTransport={(medName) => handleOpenTransport(medName)}
      />

      {/* 4. Scan History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        history={scanHistory}
        onSelectMedicine={(med) => {
          setIsHistoryDrawerOpen(false);
          setActiveSearchResult(med);
          const others = searchMedicinesQuick(med.genericName || med.name, 5).filter(
            (m) => m.id !== med.id
          );
          setAlternativeMatches(others);
          setIsSearchResultModalOpen(true);
        }}
        onClearHistory={handleClearHistory}
      />

      {/* 5. Saved Medicines Drawer */}
      <SavedMedicinesDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedMedicines={savedMedicines}
        onSelectMedicine={(med) => {
          setIsSavedDrawerOpen(false);
          setActiveSearchResult(med);
          const others = searchMedicinesQuick(med.genericName || med.name, 5).filter(
            (m) => m.id !== med.id
          );
          setAlternativeMatches(others);
          setIsSearchResultModalOpen(true);
        }}
        onRemoveSaved={handleRemoveSavedMedicine}
      />

      {/* 6. Patient Profile & Personal Records Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        onOpenHistory={() => setIsHistoryDrawerOpen(true)}
        onOpenReminders={() => setIsReminderModalOpen(true)}
        remindersCount={reminders.length}
      />

      {/* 7. Clinical Safety & Policy Modal */}
      <SafetyModal
        isOpen={isSafetyModalOpen}
        onClose={() => setIsSafetyModalOpen(false)}
      />

      {/* 8. Medicine Reminder & Adherence Modal */}
      <MedicineReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        reminders={reminders}
        scheduledDoses={scheduledToday}
        doseLogs={doseLogs}
        onLogDose={handleLogDose}
        onToggleActive={handleToggleReminderActive}
        onDeleteReminder={handleDeleteReminder}
        onOpenAddModal={() => {
          setMedicineForNewReminder(null);
          setEditingReminder(null);
          setIsAddEditReminderModalOpen(true);
        }}
        onOpenEditModal={handleOpenEditReminder}
      />

      {/* 9. Add / Edit Reminder Modal */}
      <AddEditReminderModal
        isOpen={isAddEditReminderModalOpen}
        onClose={() => {
          setIsAddEditReminderModalOpen(false);
          setEditingReminder(null);
          setMedicineForNewReminder(null);
        }}
        onSave={handleSaveReminder}
        existingReminder={editingReminder}
        initialMedicine={medicineForNewReminder}
      />

      {/* 10. Nearby Hospital & Pharmacy Finder Modal (Google Maps Platform) */}
      <CareFinderModal
        isOpen={isCareFinderModalOpen}
        onClose={() => setIsCareFinderModalOpen(false)}
        initialType={careFinderInitialType}
        initialMedicineName={careFinderMedicineName}
        onOrderTransport={(fac) => handleOpenTransport(undefined, fac)}
      />

      {/* 11. Multilingual & Accessible AI Voice Assistant Modal */}
      <AIAssistantModal
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        initialMedicineContext={assistantMedicineContext}
      />

      {/* 12. Floating Quick AI Voice Assistant Button (accessible anywhere) */}
      <FloatingAIAssistantButton onOpen={() => handleOpenAIAssistant()} />

      {/* 13. Doctor Prescription Scanner Modal */}
      <PrescriptionScannerModal
        isOpen={isPrescriptionScannerOpen}
        onClose={() => setIsPrescriptionScannerOpen(false)}
        onViewMedicine={(med) => {
          setActiveSearchResult(med);
          setIsSearchResultModalOpen(true);
        }}
        onCheckInteractions={(names) => handleOpenInteractionChecker(names)}
        onOrderTransport={(names) => {
          setIsPrescriptionScannerOpen(false);
          handleOpenTransport(names.join(', '));
        }}
        onAddDoseReminder={(medName, slots, instructions) => {
          const newReminder: MedicineReminder = {
            id: `rem-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            medicineName: medName,
            dosageForm: 'Tablet',
            frequency:
              slots.length === 3
                ? 'three_times_daily'
                : slots.length === 2
                ? 'twice_daily'
                : slots.length === 4
                ? 'four_times_daily'
                : 'daily',
            doseTimes: slots,
            startDate: new Date().toISOString().split('T')[0],
            instructions: instructions || 'Take strictly as prescribed by your physician',
            isActive: true,
            createdAt: new Date().toISOString(),
          };
          handleSaveReminder(newReminder);
        }}
      />

      {/* 14. Drug-Drug Interaction Checker Modal */}
      <DrugInteractionCheckerModal
        isOpen={isInteractionCheckerOpen}
        onClose={() => setIsInteractionCheckerOpen(false)}
        initialMedicines={interactionMedicines}
        onOpenMedicineInfo={(med) => {
          setActiveSearchResult(med);
          setIsSearchResultModalOpen(true);
        }}
      />

      {/* 15. Medicine Comparison & Bioequivalence Modal */}
      <MedicineComparisonModal
        isOpen={isMedicineComparisonOpen}
        onClose={() => setIsMedicineComparisonOpen(false)}
        initialMedicine1={comparisonPair.med1 || 'Paracetamol'}
        initialMedicine2={comparisonPair.med2 || 'Combiflam'}
        onViewMonograph={(med) => handleOpenClinicalMonograph(med)}
      />

      {/* 16. Clinical Pharmacological Monograph Compendium Modal */}
      <ClinicalMonographModal
        isOpen={isClinicalMonographOpen}
        onClose={() => setIsClinicalMonographOpen(false)}
        initialMedicine={monographMedicine}
      />

      {/* 17. Multilingual & Dialect Voice Settings Modal */}
      <MultilingualModal
        isOpen={isMultilingualOpen}
        onClose={() => setIsMultilingualOpen(false)}
      />

      {/* 18. Hands-free Voice Medicine Search Modal */}
      <VoiceSearchModal
        isOpen={isVoiceSearchOpen}
        onClose={() => setIsVoiceSearchOpen(false)}
        onSelectMedicine={(med) => {
          setActiveSearchResult(med);
          setIsSearchResultModalOpen(true);
        }}
      />

      {/* 19. Family Medicine Cabinet & Expiry Tracker Modal */}
      <FamilyMedicineCabinetModal
        isOpen={isCabinetModalOpen}
        onClose={() => setIsCabinetModalOpen(false)}
        familyMembers={familyMembers}
        medicines={cabinetMedicines}
        onAddMedicine={handleAddCabinetMedicine}
        onUpdateMedicine={handleUpdateCabinetMedicine}
        onDeleteMedicine={handleDeleteCabinetMedicine}
        onAddMember={handleAddFamilyMember}
        onOpenTransportFacility={(medName) => {
          setTransportPrefillMedicine(medName);
          setIsTransportModalOpen(true);
        }}
        onOpenMonograph={(medName) => handleOpenClinicalMonograph(medName)}
      />

      {/* 20. Medical Cold-Chain Transportation Facility Modal */}
      <MedicineTransportModal
        isOpen={isTransportModalOpen}
        onClose={() => setIsTransportModalOpen(false)}
        activeRequests={transportRequests}
        onBookTransport={handleBookTransport}
        prefillMedicineName={transportPrefillMedicine}
        prefillFacility={transportPrefillFacility}
      />

      {/* 21. Inter-Hospital Blood & Organ Network Modal */}
      <HospitalBloodOrganModal
        isOpen={isBloodOrganModalOpen}
        onClose={() => setIsBloodOrganModalOpen(false)}
        bloodInventories={bloodInventories}
        organListings={organListings}
        transferRequests={interHospitalTransfers}
        onAddBloodUnits={handleAddBloodUnits}
        onRegisterOrgan={handleRegisterOrgan}
        onRequestTransfer={handleRequestInterHospitalTransfer}
        defaultTab={bloodOrganDefaultTab}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 text-white shadow-xl text-xs sm:text-sm font-['Manrope'] font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage.text}</span>
        </div>
      )}
    </div>
  );
}
