import type { Appointment } from "@/lib/types";

/*
 * Booked appointments are saved in the visitor's own browser (localStorage),
 * not on a server. This is a demo, so there's no database and no real
 * patient data ever leaves the device.
 *
 * localStorage can be unavailable (private browsing, blocked storage), so
 * every read and write is wrapped in try/catch and fails gracefully.
 */

const KEY = "northstar:appointments";

export function getAppointments(): Appointment[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveAppointment(appointment: Appointment) {
  try {
    const next = [appointment, ...getAppointments()].slice(0, 20);
    window.localStorage.setItem(KEY, JSON.stringify(next));
    return true;
  } catch {
    return false;
  }
}

export function getAppointment(code: string) {
  return getAppointments().find((a) => a.confirmationCode === code);
}

export function clearAppointments() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* nothing to clear */
  }
}
