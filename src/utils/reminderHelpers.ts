import { MedicineReminder, DoseLog, ScheduledDoseItem } from '../types';

export function getLocalDateKey(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatTime24to12(time24: string): string {
  if (!time24) return '';
  const [hStr, mStr] = time24.split(':');
  const hours = parseInt(hStr, 10);
  const minutes = mStr || '00';
  if (isNaN(hours)) return time24;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes} ${ampm}`;
}

export function getTodayScheduledDoses(
  reminders: MedicineReminder[],
  doseLogs: DoseLog[]
): ScheduledDoseItem[] {
  const today = new Date();
  const todayKey = getLocalDateKey(today);
  const currentDayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
  const nowMinutes = today.getHours() * 60 + today.getMinutes();

  const items: ScheduledDoseItem[] = [];

  for (const reminder of reminders) {
    if (!reminder.isActive) continue;

    // Check frequency suitability for today
    if (reminder.frequency === 'specific_days' && reminder.customDays && reminder.customDays.length > 0) {
      if (!reminder.customDays.includes(currentDayOfWeek)) {
        continue;
      }
    }

    for (const slot of reminder.doseTimes) {
      const [slotH, slotM] = slot.time.split(':').map((n) => parseInt(n, 10) || 0);
      const slotMinutes = slotH * 60 + slotM;

      // Find matching log for today
      const existingLog = doseLogs.find(
        (log) =>
          log.reminderId === reminder.id &&
          log.slotId === slot.id &&
          log.dateKey === todayKey
      );

      let status: ScheduledDoseItem['status'] = 'pending';

      if (existingLog) {
        status = existingLog.status;
      } else {
        const diff = nowMinutes - slotMinutes;
        if (diff > 60) {
          status = 'overdue';
        } else if (diff >= -15 && diff <= 60) {
          status = 'due';
        } else {
          status = 'pending';
        }
      }

      items.push({
        reminderId: reminder.id,
        slotId: slot.id,
        medicineName: reminder.medicineName,
        genericName: reminder.genericName,
        dosageForm: reminder.dosageForm,
        visualType: reminder.visualType,
        visualColor: reminder.visualColor,
        pillColor: reminder.pillColor,
        time: slot.time,
        label: slot.label,
        doseAmount: slot.doseAmount,
        mealRelation: slot.mealRelation,
        instructions: reminder.instructions,
        status,
        loggedAt: existingLog?.loggedAt,
        reminder,
      });
    }
  }

  // Sort chronologically by time
  return items.sort((a, b) => a.time.localeCompare(b.time));
}
