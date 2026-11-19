import { insurancePlans } from "@/data/providers";
import type { AppointmentRequest } from "@/lib/types";

/*
 * Form validation shared by the browser AND the server.
 *
 * The browser runs it to give instant, friendly feedback.
 * The server runs it again because anything sent from a browser can be
 * tampered with, so the server never trusts the client. Sharing one
 * function keeps both sides consistent.
 */

export type PatientErrors = Partial<Record<keyof AppointmentRequest["patient"] | "reason", string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validatePatient(
  patient: AppointmentRequest["patient"],
  reason: string,
  today: Date = new Date(),
): PatientErrors {
  const errors: PatientErrors = {};

  if (!patient.firstName.trim()) errors.firstName = "Enter the patient's first name.";
  if (!patient.lastName.trim()) errors.lastName = "Enter the patient's last name.";

  if (!patient.dateOfBirth) {
    errors.dateOfBirth = "Enter a date of birth.";
  } else {
    const dob = new Date(`${patient.dateOfBirth}T00:00:00`);
    if (Number.isNaN(dob.getTime()) || dob > today || dob.getFullYear() < 1900) {
      errors.dateOfBirth = "Enter a valid date of birth in the past.";
    }
  }

  if (!EMAIL.test(patient.email.trim())) errors.email = "Enter an email address like name@example.com.";

  const digits = patient.phone.replace(/\D/g, "");
  if (digits.length !== 10 && !(digits.length === 11 && digits.startsWith("1"))) {
    errors.phone = "Enter a 10-digit phone number, like (612) 555-0100.";
  }

  if (!(insurancePlans as readonly string[]).includes(patient.insurance)) {
    errors.insurance = "Choose an insurance plan, or select Self-pay.";
  }

  if (reason.length > 500) errors.reason = "Keep the reason for visit under 500 characters.";

  return errors;
}
