import React, { useState } from 'react';
import { MedicineReminder, ScheduledDoseItem, DoseLog } from '../../types';
import {
  X,
  Bell,
  Plus,
  Clock,
  CheckCircle2,
  Calendar,
  Pill,
  Trash2,
  Edit2,
  Power,
  RotateCcw,
} from 'lucide-react';
import { formatTime24to12 } from '../../utils/reminderHelpers';

interface MedicineReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminders: MedicineReminder[];
  scheduledDoses: ScheduledDoseItem[];
  doseLogs: DoseLog[];
  onLogDose: (reminderId: string, slotId: string, status: 'taken' | 'skipped' | 'snoozed') => void;
  onToggleActive: (reminderId: string) => void;
  onDeleteReminder: (reminderId: string) => void;
  onOpenAddModal: () => void;
  onOpenEditModal: (reminder: MedicineReminder) => void;
}

export const MedicineReminderModal: React.FC<MedicineReminderModalProps> = ({
  isOpen,
  onClose,
  reminders,
  scheduledDoses,
  doseLogs,
  onLogDose,
  onToggleActive,
  onDeleteReminder,
  onOpenAddModal,
  onOpenEditModal,
}) => {
  const [activeTab, setActiveTab] = useState<'today' | 'schedules' | 'history'>('today');

  if (!isOpen) return null;

  const takenCount = scheduledDoses.filter((d) => d.status === 'taken').length;
  const totalCount = scheduledDoses.length;
  const adherencePercentage = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 100;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs font-['Inter']"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="min-h-full flex items-center justify-center p-3 sm:p-4">
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] my-auto flex flex-col border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-blue-50/80 to-indigo-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-['Manrope'] font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <span>Dose Reminders & Adherence</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                  {adherencePercentage}% Today
                </span>
              </h2>
              <p className="text-xs text-slate-600">
                Audio alerts, daily time slots, and smart pill inventory tracking
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-['Manrope'] font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Reminder</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="px-6 pt-3 border-b border-slate-200 flex items-center gap-4 bg-slate-50/50 text-xs font-bold font-['Manrope']">
          <button
            type="button"
            onClick={() => setActiveTab('today')}
            className={`pb-2.5 border-b-2 cursor-pointer transition ${
              activeTab === 'today'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Today's Schedule ({scheduledDoses.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('schedules')}
            className={`pb-2.5 border-b-2 cursor-pointer transition ${
              activeTab === 'schedules'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Active Medicines ({reminders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 border-b-2 cursor-pointer transition ${
              activeTab === 'history'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Adherence Logs ({doseLogs.length})
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0 space-y-3">
          {/* TAB 1: TODAY'S SCHEDULE */}
          {activeTab === 'today' && (
            <>
              {scheduledDoses.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 mx-auto flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h4 className="font-['Manrope'] font-bold text-slate-800 text-sm">
                    No medication scheduled for today
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Set up your first dosage reminder to get alarm chimes and track daily doses.
                  </p>
                  <button
                    type="button"
                    onClick={onOpenAddModal}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs hover:bg-blue-700 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Reminder Schedule</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {scheduledDoses.map((dose) => {
                    const isTaken = dose.status === 'taken';
                    const isDue = dose.status === 'due' || dose.status === 'overdue';

                    return (
                      <div
                        key={`${dose.reminderId}-${dose.slotId}`}
                        className={`p-4 rounded-2xl border transition-all flex flex-wrap items-center justify-between gap-3 ${
                          isTaken
                            ? 'bg-emerald-50/60 border-emerald-200 opacity-80'
                            : isDue
                            ? 'bg-blue-50/60 border-blue-300 ring-2 ring-blue-100'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                              isTaken
                                ? 'bg-emerald-600 text-white'
                                : isDue
                                ? 'bg-blue-600 text-white animate-pulse'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {isTaken ? <CheckCircle2 className="w-5 h-5" /> : <Pill className="w-5 h-5" />}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-['Manrope'] font-extrabold text-slate-900 text-sm">
                                {dose.medicineName}
                              </h4>
                              <span className="text-2xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                                {formatTime24to12(dose.time)}
                              </span>
                              {isDue && (
                                <span className="text-2xs font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-blue-600 text-white">
                                  Due Now
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {dose.doseAmount} • {dose.label} ({dose.mealRelation.replace('-', ' ')})
                            </p>
                            {dose.instructions && (
                              <p className="text-2xs text-slate-600 italic mt-0.5">
                                Note: {dose.instructions}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {!isTaken ? (
                            <>
                              <button
                                type="button"
                                onClick={() => onLogDose(dose.reminderId, dose.slotId, 'taken')}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-['Manrope'] shadow-xs transition active:scale-95 cursor-pointer"
                              >
                                Take Dose
                              </button>
                              <button
                                type="button"
                                onClick={() => onLogDose(dose.reminderId, dose.slotId, 'skipped')}
                                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition cursor-pointer"
                              >
                                Skip
                              </button>
                            </>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-lg">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Taken</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* TAB 2: ALL ACTIVE MEDICINES */}
          {activeTab === 'schedules' && (
            <div className="space-y-3">
              {reminders.map((rem) => (
                <div
                  key={rem.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-wrap items-center justify-between gap-3 ${
                    rem.isActive ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      <Pill className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-['Manrope'] font-bold text-slate-900 text-sm">
                          {rem.medicineName}
                        </h4>
                        <span className="text-2xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {rem.frequency.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {rem.doseTimes.map((s) => `${s.label} (${s.time})`).join(' • ')}
                      </p>
                      {typeof rem.pillsRemaining === 'number' && (
                        <p className="text-2xs text-slate-600 font-semibold mt-0.5">
                          Remaining Stock: {rem.pillsRemaining} {rem.dosageForm}s
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleActive(rem.id)}
                      className={`p-2 rounded-xl border transition cursor-pointer ${
                        rem.isActive
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-slate-100 text-slate-400 border-slate-200'
                      }`}
                      title={rem.isActive ? 'Pause Reminder' : 'Resume Reminder'}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenEditModal(rem)}
                      className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                      title="Edit Schedule"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteReminder(rem.id)}
                      className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="Delete Reminder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: LOGS & HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-2">
              {doseLogs.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No dose logs recorded yet. Taken doses will appear here.
                </div>
              ) : (
                doseLogs.slice(0, 15).map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800">{log.medicineName}</span>
                      <span className="text-slate-500 ml-2">Scheduled at {log.scheduledTime}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold uppercase text-2xs ${
                        log.status === 'taken'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.status === 'skipped'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
};
