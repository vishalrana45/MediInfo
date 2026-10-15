import React from 'react';
import { ScheduledDoseItem } from '../../types';
import { Bell, Check, Clock, X } from 'lucide-react';

interface DueDoseBannerProps {
  dueDoses: ScheduledDoseItem[];
  onTakeDose: (reminderId: string, slotId: string) => void;
  onSnoozeDose: (reminderId: string, slotId: string) => void;
  onOpenRemindersModal: () => void;
  onDismiss: (slotId: string) => void;
}

export const DueDoseBanner: React.FC<DueDoseBannerProps> = ({
  dueDoses,
  onTakeDose,
  onSnoozeDose,
  onOpenRemindersModal,
  onDismiss,
}) => {
  if (!dueDoses || dueDoses.length === 0) return null;

  const current = dueDoses[0];
  const remainingCount = dueDoses.length - 1;

  return (
    <div className="sticky top-20 z-35 px-4 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white shadow-md animate-in slide-in-from-top-2 duration-300">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 animate-pulse">
            <Bell className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-['Manrope'] font-extrabold text-sm tracking-wide">
                Medication Due Now: {current.medicineName}
              </span>
              <span className="text-2xs uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 font-bold">
                {current.time} • {current.label}
              </span>
            </div>
            <p className="text-xs text-blue-100 font-medium">
              Take {current.doseAmount} ({current.mealRelation.replace('-', ' ')})
              {remainingCount > 0 && ` • +${remainingCount} more dose waiting`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onTakeDose(current.reminderId, current.slotId)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold font-['Manrope'] shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark Taken</span>
          </button>

          <button
            type="button"
            onClick={() => onSnoozeDose(current.reminderId, current.slotId)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold font-['Manrope'] transition active:scale-95 cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Snooze</span>
          </button>

          <button
            type="button"
            onClick={onOpenRemindersModal}
            className="hidden sm:inline-flex text-xs text-blue-100 hover:text-white underline font-semibold cursor-pointer px-2"
          >
            View All
          </button>

          <button
            type="button"
            onClick={() => onDismiss(current.slotId)}
            className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
