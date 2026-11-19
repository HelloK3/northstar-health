/*
 * TypeScript types describe the SHAPE of our data.
 * If a page tries to read `provider.phoneNumber` but the type says the field
 * is called `phone`, the editor flags it before the app ever runs.
 * Everything in this project is fictional demo data.
 */

export type Specialty = {
  slug: string;
  name: string;
  /** The title used for one doctor in this specialty, e.g. "Cardiologist" */
  practitioner: string;
  description: string;
  /** Common reasons people book, used in search matching */
  conditions: string[];
};

export type DayHours = { days: string; hours: string };

export type Location = {
  id: string;
  name: string;
  type: "Medical Center" | "Clinic" | "Specialty Center";
  description: string;
  address: { street: string; city: string; state: string; zip: string };
  phone: string;
  hours: DayHours[];
  services: string[];
  amenities: string[];
  /** Position on our illustrated (non-real) service-area map, 0–100 */
  mapPosition: { x: number; y: number };
};

export type VisitType = "new-patient" | "follow-up" | "telehealth";

export type Provider = {
  id: string;
  firstName: string;
  lastName: string;
  credentials: string;
  pronouns: string;
  specialty: string; // Specialty slug
  focusAreas: string[];
  languages: string[];
  locationIds: string[];
  acceptingNewPatients: boolean;
  offersTelehealth: boolean;
  rating: number;
  reviewCount: number;
  yearsExperience: number;
  bio: string;
  philosophy: string;
  education: { label: string; institution: string }[];
  boardCertifications: string[];
  insurance: string[];
};

export type TimeSlot = { time: string; label: string };
export type DayAvailability = { date: string; slots: TimeSlot[] };

export type AppointmentRequest = {
  providerId: string;
  locationId: string;
  visitType: VisitType;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm (24h)
  reason: string;
  patient: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    email: string;
    phone: string;
    insurance: string;
  };
};

export type Appointment = AppointmentRequest & {
  confirmationCode: string;
  createdAt: string;
};
