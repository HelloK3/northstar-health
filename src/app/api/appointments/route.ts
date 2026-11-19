import { getProvider } from "@/data/providers";
import { slotsForDay, toISODate } from "@/lib/availability";
import { simulateLatency } from "@/lib/latency";
import type { Appointment, AppointmentRequest } from "@/lib/types";
import { validatePatient } from "@/lib/validation";

/*
 * POST /api/appointments
 * Validates a booking request and "creates" an appointment.
 *
 * Nothing is stored: this is a portfolio demo, and the confirmation is kept
 * in the visitor's own browser. The server still checks everything a real
 * backend would: that the provider exists, works at that location, offers
 * that visit type, that the time slot was really open, and that the
 * patient details are valid.
 */
export async function POST(request: Request) {
  let body: AppointmentRequest;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "The request body must be valid JSON." }, { status: 400 });
  }

  await simulateLatency(900);

  const provider = getProvider(body?.providerId);
  if (!provider) {
    return Response.json({ error: "We couldn't find that provider." }, { status: 404 });
  }
  if (!provider.locationIds.includes(body.locationId)) {
    return Response.json({ error: "This provider doesn't see patients at that location." }, { status: 422 });
  }
  if (body.visitType === "telehealth" && !provider.offersTelehealth) {
    return Response.json({ error: "This provider doesn't offer video visits." }, { status: 422 });
  }
  if (body.visitType === "new-patient" && !provider.acceptingNewPatients) {
    return Response.json({ error: "This provider isn't accepting new patients right now." }, { status: 422 });
  }
  // Dates are "YYYY-MM-DD" strings, which sort correctly as plain text.
  const isFuture = typeof body.date === "string" && body.date > toISODate(new Date());
  if (!isFuture || !slotsForDay(provider.id, body.date).some((s) => s.time === body.time)) {
    return Response.json(
      { error: "That time is no longer available. Please choose another time." },
      { status: 409 },
    );
  }

  const fieldErrors = validatePatient(body.patient, body.reason ?? "");
  if (Object.keys(fieldErrors).length > 0) {
    return Response.json({ error: "Please fix the highlighted fields.", fieldErrors }, { status: 422 });
  }

  const appointment: Appointment = {
    ...body,
    confirmationCode: `NS-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
    createdAt: new Date().toISOString(),
  };
  return Response.json({ appointment }, { status: 201 });
}
