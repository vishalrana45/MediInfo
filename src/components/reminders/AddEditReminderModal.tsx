import React, { useState } from 'react';
import { MedicineReminder, Medicine } from '../../types';
import { X, Clock, Plus, Trash2, Calendar, ShieldCheck, Check } from 'lucide-react';

interface AddEditReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reminder: MedicineReminder) => void;
  existingReminder?: MedicineReminder | null;
  initialMedicine?: Medicine | null;
}

export const AddEditReminderModal: React.FC<AddEditReminderModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingReminder,
  initialMedicine,
}) => {
  const [medicineName, setMedicineName] = useState(
    existingReminder?.medicineName || initialMedicine?.name || ''
  );
  const [genericName, setGenericName] = useState(
    existingReminder?.genericName || initialMedicine?.genericName || ''
  );
  const [dosageForm, setDosageForm] = useState(
    existingReminder?.dosageForm || initialMedicine?.forms[0] || 'Tablet'
  );
  const [instructions, setInstructions] = useState(
    existingReminder?.instructions || 'Take with a glass of water after food'
  );
  const [totalPills, setTotalPills] = useState<number | undefined>(
    existingReminder?.totalPills || 30
  );
  const [pillsRemaining, setPillsRemaining] = useState<number | undefined>(
    existingReminder?.pillsRemaining || 30
  );

  const [doseTimes, setDoseTimes] = useState(
    existingReminder?.doseTimes || [
      {
        id: 'slot-morning',
        time: '08:30',
        label: 'Morning',
        doseAmount: '1 Dose',
        mealRelation: 'after_meal' as const,
      },
      {
        id: 'slot-night',
        time: '20:30',
        label: 'Night',
        doseAmount: '1 Dose',
        mealRelation: 'after_meal' as const,
      },
    ]
  );

  if (!isOpen) return null;

  const handleAddSlot = () => {
    const newId = `slot-${Date.now()}`;
    setDoseTimes((prev) => [
      ...prev,
      {
        id: newId,
        time: '14:00',
        label: 'Afternoon',
        doseAmount: '1 Dose',
        mealRelation: 'after_meal',
      },
    ]);
  };

  const handleRemoveSlot = (id: string) => {
    if (doseTimes.length <= 1) return;
    setDoseTimes((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpdateSlot = (id: string, updates: Partial<(typeof doseTimes)[0]>) => {
    setDoseTimes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicineName.trim()) return;

    const reminder: MedicineReminder = {
      id: existingReminder?.id || `rem-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      medicineId: existingReminder?.medicineId || initialMedicine?.id,
      medicineName: medicineName.trim(),
      genericName: genericName.trim() || undefined,
      dosageForm: dosageForm.trim() || 'Tablet',
      category: existingReminder?.category || initialMedicine?.category,
      visualType: existingReminder?.visualType || 'tablet',
      visualColor: existingReminder?.visualColor || 'blue',
      pillColor: existingReminder?.pillColor || 'white',
      frequency: doseTimes.length === 1 ? 'daily' : 'twice_daily',
      doseTimes,
      startDate: existingReminder?.startDate || new Date().toISOString().split('T')[0],
      instructions: instructions.trim(),
      totalPills: Number(totalPills) || undefined,
      pillsRemaining: Number(pillsRemaining) || undefined,
      refillThreshold: 5,
      isActive: existingReminder ? existingReminder.isActive : true,
      createdAt: existingReminder?.createdAt || new Date().toISOString(),
    };

    onSave(reminder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-['Manrope'] font-bold text-slate-900 text-base">
                {existingReminder ? 'Edit Dose Reminder' : 'Set New Medicine Reminder'}
              </h3>
              <p className="text-xs text-slate-500">Scheduled alarms & dose adherence tracking</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Medicine Name *</label>
            <input
              type="text"
              required
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              placeholder="e.g. Metformin 500mg, Dolo 650"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Generic Name</label>
              <input
                type="text"
                value={genericName}
                onChange={(e) => setGenericName(e.target.value)}
                placeholder="Active salt composition"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-500 outline-none text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Dosage Form</label>
              <input
                type="text"
                value={dosageForm}
                onChange={(e) => setDosageForm(e.target.value)}
                placeholder="Tablet / Capsule / Syrup"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-500 outline-none text-slate-900"
              />
            </div>
          </div>

          {/* Daily Schedule Slots */}
          <div className="pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Daily Dose Timings</span>
              </label>
              <button
                type="button"
                onClick={handleAddSlot}
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Time Slot</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {doseTimes.map((slot, index) => (
                <div
                  key={slot.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center gap-2 justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                      {index + 1}
                    </span>
                    <input
                      type="time"
                      value={slot.time}
                      onChange={(e) => handleUpdateSlot(slot.id, { time: e.target.value })}
                      className="px-2 py-1 rounded-lg border border-slate-300 bg-white font-bold text-slate-800 text-xs"
                    />
                    <input
                      type="text"
                      value={slot.label}
                      onChange={(e) => handleUpdateSlot(slot.id, { label: e.target.value })}
                      placeholder="Slot label"
                      className="w-20 px-2 py-1 rounded-lg border border-slate-300 bg-white text-xs text-slate-700"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={slot.mealRelation}
                      onChange={(e) =>
                        handleUpdateSlot(slot.id, { mealRelation: e.target.value as any })
                      }
                      className="px-2 py-1 rounded-lg border border-slate-300 bg-white text-2xs text-slate-700"
                    >
                      <option value="after_meal">After Meal</option>
                      <option value="before_meal">Before Meal</option>
                      <option value="with_food">With Food</option>
                      <option value="empty_stomach">Empty Stomach</option>
                      <option value="anytime">Anytime</option>
                    </select>

                    {doseTimes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSlot(slot.id)}
                        className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Delete slot"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Instructions / Note</label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Take with warm water, avoid dairy"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-500 outline-none text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Total Stock</label>
              <input
                type="number"
                min="1"
                value={totalPills || ''}
                onChange={(e) => setTotalPills(Number(e.target.value))}
                placeholder="Pills/Units"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-500 outline-none text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Remaining</label>
              <input
                type="number"
                min="0"
                value={pillsRemaining || ''}
                onChange={(e) => setPillsRemaining(Number(e.target.value))}
                placeholder="Pills remaining"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-500 outline-none text-slate-900"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-['Manrope'] font-bold shadow-md transition active:scale-95 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Reminder</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
