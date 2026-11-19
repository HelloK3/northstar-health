import type { DayAvailability, TimeSlot } from "@/lib/types";

/*
 * Fake-but-realistic appointment availability.
 *
 * A real app would ask a scheduling system which times are free. Here we
 * GENERATE them, but deterministically: the same provider + date always
 * produces the same open slots. That way the server can double-check that a
 * requested time was really offered, just as a real backend would.
 */

const DAY_TEMPLATE = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
];

/** Turn a string into a repeatable number (a tiny "hash"). */
function hash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Format a Date as YYYY-MM-DD using its local calendar day. */
export function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** "13:30" -> "1:30 PM" */
export function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** Some days are "fully booked" so the calendar shows that state too. */
function isFullyBooked(providerId: string, isoDate: string) {
  return hash(`${providerId}|${isoDate}|booked`) % 100 < 15;
}

/** Open slots for one provider on one day (empty on weekends and fully booked days). */
export function slotsForDay(providerId: string, isoDate: string): TimeSlot[] {
  const [y, m, d] = isoDate.split("-").map(Number);
  const weekday = new Date(y, m - 1, d).getDay();
  if (Number.isNaN(weekday) || weekday === 0 || weekday === 6 || isFullyBooked(providerId, isoDate)) return [];
  return DAY_TEMPLATE.filter((time) => hash(`${providerId}|${isoDate}|${time}`) % 100 < 38).map((time) => ({
    time,
    label: formatTime(time),
  }));
}

/**
 * The next `count` weekdays starting tomorrow, each with its open slots.
 * Days with no openings are still returned (with an empty list) so the
 * calendar UI can show them as unavailable.
 */
export function getAvailability(providerId: string, from: Date, count = 10): DayAvailability[] {
  const days: DayAvailability[] = [];
  const cursor = new Date(from);
  cursor.setHours(12, 0, 0, 0); // noon avoids daylight-saving edge cases
  while (days.length < count) {
    cursor.setDate(cursor.getDate() + 1);
    const weekday = cursor.getDay();
    if (weekday === 0 || weekday === 6) continue; // skip weekends
    const date = toISODate(cursor);
    days.push({ date, slots: slotsForDay(providerId, date) });
  }
  return days;
}
