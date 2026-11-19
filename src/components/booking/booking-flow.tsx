"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  CalendarX,
  Check,
  LoaderCircle,
  MapPin,
  RotateCcw,
  UserRound,
  Video,
} from "lucide-react";
import { insurancePlans, providerName } from "@/data/providers";
import { getSpecialty } from "@/data/specialties";
import { saveAppointment } from "@/lib/appointment-store";
import { formatTime } from "@/lib/availability";
import { cn } from "@/lib/cn";
import { formatDayParts, formatLongDate } from "@/lib/format";
import type { Appointment, AppointmentRequest, DayAvailability, Location, Provider, VisitType } from "@/lib/types";
import { validatePatient, type PatientErrors } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Checkbox, SelectField, TextAreaField, TextField } from "@/components/ui/field";
import { Alert, Avatar, Card, Skeleton } from "@/components/ui/primitives";

/*
 * BOOKING FLOW: a four-step form.
 *
 *   1. Visit details   2. Date & time   3. Patient info   4. Review & confirm
 *
 * All answers live in React state in this one component, so moving between
 * steps never loses what the patient already entered. Each step validates
 * before letting the patient continue.
 *
 * Accessibility details worth mentioning in an interview:
 *   - Choices are real radio buttons, styled as cards. Keyboard arrow keys,
 *     screen readers, and form semantics all work for free.
 *   - When the step changes, focus moves to the new step's heading, so
 *     screen reader users hear where they are.
 *   - Errors are summarized at the top with links to each field, and
 *     each field announces its own error.
 */

const STEPS = ["Visit details", "Date & time", "Your information", "Review"] as const;

const VISIT_TYPES: { value: VisitType; label: string; description: string; icon: ReactNode }[] = [
  {
    value: "new-patient",
    label: "New patient visit",
    description: "First visit with this provider. Plan for about 45 minutes.",
    icon: <UserRound />,
  },
  {
    value: "follow-up",
    label: "Follow-up visit",
    description: "For returning patients. About 20 minutes.",
    icon: <CalendarDays />,
  },
  {
    value: "telehealth",
    label: "Video visit",
    description: "Meet from home on your phone or computer.",
    icon: <Video />,
  },
];

type Availability =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; days: DayAvailability[] };

const emptyPatient: AppointmentRequest["patient"] = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  email: "",
  phone: "",
  insurance: "",
};

export function BookingFlow({ provider, locations }: { provider: Provider; locations: Location[] }) {
  const router = useRouter();
  const name = providerName(provider);

  // ---------- State: one piece per answer ----------
  const [step, setStep] = useState(0);
  const [visitType, setVisitType] = useState<VisitType | "">("");
  const [locationId, setLocationId] = useState(locations[0]?.id ?? "");
  const [reason, setReason] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [patient, setPatient] = useState(emptyPatient);
  const [acknowledged, setAcknowledged] = useState(false);

  // Validation and request status
  const [stepError, setStepError] = useState("");
  const [patientErrors, setPatientErrors] = useState<PatientErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // ---------- Load availability from our API ----------
  const [availability, setAvailability] = useState<Availability>({ status: "loading" });
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    // AbortController cancels the request if the component unmounts first.
    const controller = new AbortController();
    fetch(`/api/providers/${provider.id}/availability`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
        return res.json() as Promise<{ days: DayAvailability[] }>;
      })
      .then(({ days }) => {
        setAvailability({ status: "ready", days });
        // Pre-select the first day that has openings
        setDate((current) => current || days.find((d) => d.slots.length > 0)?.date || "");
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        console.error(err);
        setAvailability({ status: "error", message: "We couldn't load available times." });
      });
    return () => controller.abort();
  }, [provider.id, reloadCount]);

  function retryAvailability() {
    setAvailability({ status: "loading" });
    setReloadCount((n) => n + 1);
  }

  // ---------- Focus management between steps ----------
  const headingRef = useRef<HTMLHeadingElement>(null);
  const hasMoved = useRef(false);
  useEffect(() => {
    if (!hasMoved.current) return; // don't steal focus on first page load
    headingRef.current?.focus();
    headingRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [step]);

  function goTo(next: number) {
    hasMoved.current = true;
    setStepError("");
    setSubmitError("");
    setStep(next);
  }

  // ---------- Step validation ----------
  function next(e: FormEvent) {
    e.preventDefault();
    if (step === 0) {
      if (!visitType) return setStepError("Choose a visit type to continue.");
      if (visitType !== "telehealth" && !locationId) return setStepError("Choose a location to continue.");
    }
    if (step === 1) {
      if (!date || !time) return setStepError("Choose a day and time to continue.");
    }
    if (step === 2) {
      const errors = validatePatient(patient, reason);
      setPatientErrors(errors);
      if (Object.keys(errors).length > 0) {
        setStepError("Please fix the errors below.");
        // Move focus to the error summary so it's announced
        requestAnimationFrame(() => document.getElementById("error-summary")?.focus());
        return;
      }
    }
    goTo(step + 1);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!acknowledged) return setStepError("Please confirm that you understand this is a demo.");
    setStepError("");
    setSubmitError("");
    setSubmitting(true);

    const request: AppointmentRequest = {
      providerId: provider.id,
      locationId,
      visitType: visitType as VisitType,
      date,
      time,
      reason: reason.trim(),
      patient,
    };

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
      const data = (await res.json()) as { appointment?: Appointment; error?: string; fieldErrors?: PatientErrors };

      if (!res.ok || !data.appointment) {
        if (res.status === 409) {
          // Slot was taken: send them back to pick another time.
          setTime("");
          goTo(1);
          setStepError(data.error ?? "That time is no longer available.");
          return;
        }
        if (data.fieldErrors) setPatientErrors(data.fieldErrors);
        setSubmitError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      saveAppointment(data.appointment);
      router.push(`/appointments/confirmation?code=${data.appointment.confirmationCode}`);
    } catch {
      setSubmitError("We couldn't reach the server. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const selectedLocation = locations.find((l) => l.id === locationId);
  const selectedDay = availability.status === "ready" ? availability.days.find((d) => d.date === date) : undefined;
  const patientFieldErrors = Object.entries(patientErrors).filter(([, msg]) => msg);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <div className="min-w-0">
        <Stepper current={step} />

        <Card className="mt-6 p-5 sm:p-8">
          <form onSubmit={step === 3 ? submit : next} noValidate>
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="scroll-mt-24 font-display text-2xl font-semibold text-ink-900 outline-none"
            >
              <span className="sr-only">
                Step {step + 1} of {STEPS.length}:{" "}
              </span>
              {STEPS[step]}
            </h2>

            {stepError && step !== 2 && (
              <Alert tone="danger" className="mt-5" role="alert">
                {stepError}
              </Alert>
            )}

            {/* ---------------- Step 1: Visit details ---------------- */}
            {step === 0 && (
              <div className="mt-6 space-y-8">
                <fieldset>
                  <legend className="mb-3 font-semibold text-ink-800">What kind of visit do you need?</legend>
                  <div className="grid gap-3">
                    {VISIT_TYPES.map((v) => {
                      const disabledReason =
                        v.value === "new-patient" && !provider.acceptingNewPatients
                          ? "Not accepting new patients right now"
                          : v.value === "telehealth" && !provider.offersTelehealth
                            ? "Not offered by this provider"
                            : "";
                      return (
                        <ChoiceCard
                          key={v.value}
                          name="visitType"
                          value={v.value}
                          checked={visitType === v.value}
                          onChange={() => setVisitType(v.value)}
                          disabled={Boolean(disabledReason)}
                          icon={v.icon}
                          title={v.label}
                          description={disabledReason || v.description}
                        />
                      );
                    })}
                  </div>
                </fieldset>

                {visitType === "telehealth" ? (
                  <Alert tone="info" title="You'll join from home">
                    We&apos;ll email a secure video link before your visit. No app download needed.
                  </Alert>
                ) : (
                  locations.length > 0 && (
                    <fieldset>
                      <legend className="mb-3 font-semibold text-ink-800">Where would you like to be seen?</legend>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {locations.map((l) => (
                          <ChoiceCard
                            key={l.id}
                            name="locationId"
                            value={l.id}
                            checked={locationId === l.id}
                            onChange={() => setLocationId(l.id)}
                            icon={<Building2 />}
                            title={l.name}
                            description={`${l.address.street}, ${l.address.city}`}
                          />
                        ))}
                      </div>
                    </fieldset>
                  )
                )}

                <TextAreaField
                  label="Reason for visit (optional)"
                  hint="A sentence or two helps your provider prepare. Please don't include sensitive details."
                  name="reason"
                  value={reason}
                  maxLength={500}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            )}

            {/* ---------------- Step 2: Date & time ---------------- */}
            {step === 1 && (
              <div className="mt-6">
                {availability.status === "loading" && <AvailabilitySkeleton />}

                {availability.status === "error" && (
                  <div className="space-y-4">
                    <Alert tone="danger" title={availability.message} role="alert">
                      This is usually temporary. Please try again.
                    </Alert>
                    <Button variant="secondary" onClick={retryAvailability}>
                      <RotateCcw aria-hidden="true" /> Try again
                    </Button>
                  </div>
                )}

                {availability.status === "ready" && (
                  <div className="space-y-8">
                    <fieldset>
                      <legend className="mb-3 font-semibold text-ink-800">Choose a day</legend>
                      <div className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pt-1 pb-3">
                        {availability.days.map((d) => {
                          const parts = formatDayParts(d.date);
                          const full = d.slots.length === 0;
                          return (
                            <label key={d.date} className="snap-start">
                              <input
                                type="radio"
                                name="date"
                                value={d.date}
                                checked={date === d.date}
                                disabled={full}
                                onChange={() => {
                                  setDate(d.date);
                                  setTime("");
                                }}
                                className="peer sr-only"
                                aria-label={`${parts.full}${full ? ", no openings" : `, ${d.slots.length} openings`}`}
                              />
                              <span
                                className={cn(
                                  "flex w-20 cursor-pointer flex-col items-center rounded-control border-2 border-ink-200 bg-white px-2 py-3 text-center transition",
                                  "peer-checked:border-brand-600 peer-checked:bg-brand-600 peer-checked:text-white",
                                  "peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-500",
                                  "peer-disabled:cursor-not-allowed peer-disabled:border-dashed peer-disabled:bg-ink-50 peer-disabled:text-ink-500",
                                  "hover:border-brand-500",
                                )}
                                aria-hidden="true"
                              >
                                <span className="text-xs font-semibold uppercase">{parts.weekday}</span>
                                <span className="font-display text-2xl font-semibold">{parts.day}</span>
                                <span className="text-xs">{full ? "Full" : parts.month}</span>
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>

                    {selectedDay && selectedDay.slots.length > 0 ? (
                      <fieldset>
                        <legend className="mb-3 font-semibold text-ink-800">
                          Available times on {formatDayParts(selectedDay.date).full}
                        </legend>
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                          {selectedDay.slots.map((slot) => (
                            <label key={slot.time}>
                              <input
                                type="radio"
                                name="time"
                                value={slot.time}
                                checked={time === slot.time}
                                onChange={() => setTime(slot.time)}
                                className="peer sr-only"
                              />
                              <span
                                className={cn(
                                  "flex h-11 cursor-pointer items-center justify-center rounded-control border border-ink-300 bg-white text-sm font-semibold text-brand-700 transition",
                                  "hover:border-brand-500 hover:bg-brand-50",
                                  "peer-checked:border-brand-600 peer-checked:bg-brand-600 peer-checked:text-white",
                                  "peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-500",
                                )}
                              >
                                {slot.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    ) : (
                      <div className="flex items-center gap-3 rounded-control bg-ink-50 p-4 text-ink-700">
                        <CalendarX className="size-5 shrink-0 text-ink-500" aria-hidden="true" />
                        <p>
                          {availability.days.some((d) => d.slots.length)
                            ? "Choose a day above to see available times."
                            : `No openings with Dr. ${provider.lastName} in the next two weeks. Call ${selectedLocation?.phone ?? "the clinic"} to join the waitlist.`}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ---------------- Step 3: Patient info ---------------- */}
            {step === 2 && (
              <div className="mt-6 space-y-6">
                {patientFieldErrors.length > 0 && (
                  <div
                    id="error-summary"
                    tabIndex={-1}
                    role="alert"
                    className="rounded-control border border-danger-700/30 bg-danger-50 p-4 text-danger-700 outline-none focus-visible:outline-3"
                  >
                    <p className="font-semibold">There {patientFieldErrors.length === 1 ? "is 1 problem" : `are ${patientFieldErrors.length} problems`} with your information:</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                      {patientFieldErrors.map(([field, message]) => (
                        <li key={field}>
                          <a href={`#patient-${field}`} className="underline">
                            {message}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Alert tone="warning" title="This is a demo">
                  Please use made-up details. Nothing you enter is sent anywhere except this demo&apos;s own server,
                  and nothing is stored.
                </Alert>

                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField
                    id="patient-firstName"
                    label="First name"
                    autoComplete="given-name"
                    required
                    value={patient.firstName}
                    error={patientErrors.firstName}
                    onChange={(e) => setPatient({ ...patient, firstName: e.target.value })}
                  />
                  <TextField
                    id="patient-lastName"
                    label="Last name"
                    autoComplete="family-name"
                    required
                    value={patient.lastName}
                    error={patientErrors.lastName}
                    onChange={(e) => setPatient({ ...patient, lastName: e.target.value })}
                  />
                  <TextField
                    id="patient-dateOfBirth"
                    label="Date of birth"
                    type="date"
                    autoComplete="bday"
                    required
                    value={patient.dateOfBirth}
                    error={patientErrors.dateOfBirth}
                    onChange={(e) => setPatient({ ...patient, dateOfBirth: e.target.value })}
                  />
                  <SelectField
                    id="patient-insurance"
                    label="Insurance"
                    required
                    value={patient.insurance}
                    error={patientErrors.insurance}
                    onChange={(e) => setPatient({ ...patient, insurance: e.target.value })}
                  >
                    <option value="">Select your plan</option>
                    {insurancePlans.map((plan) => (
                      <option key={plan} value={plan} disabled={!provider.insurance.includes(plan)}>
                        {plan}
                        {provider.insurance.includes(plan) ? "" : " (not accepted)"}
                      </option>
                    ))}
                  </SelectField>
                  <TextField
                    id="patient-email"
                    label="Email"
                    type="email"
                    autoComplete="email"
                    hint="We'll send your confirmation here."
                    required
                    value={patient.email}
                    error={patientErrors.email}
                    onChange={(e) => setPatient({ ...patient, email: e.target.value })}
                  />
                  <TextField
                    id="patient-phone"
                    label="Mobile phone"
                    type="tel"
                    autoComplete="tel-national"
                    hint="For appointment reminders."
                    required
                    value={patient.phone}
                    error={patientErrors.phone}
                    onChange={(e) => setPatient({ ...patient, phone: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* ---------------- Step 4: Review ---------------- */}
            {step === 3 && (
              <div className="mt-6 space-y-6">
                <dl className="divide-y divide-ink-100 rounded-control border border-ink-100">
                  <ReviewRow label="Provider" onEdit={undefined}>
                    {name}, {getSpecialty(provider.specialty)?.name}
                  </ReviewRow>
                  <ReviewRow label="Visit" onEdit={() => goTo(0)} editLabel="Edit visit details">
                    {VISIT_TYPES.find((v) => v.value === visitType)?.label}
                    {visitType === "telehealth" ? " (online)" : ` at ${selectedLocation?.name}`}
                    {reason && <span className="mt-1 block text-sm text-ink-600">“{reason}”</span>}
                  </ReviewRow>
                  <ReviewRow label="Date and time" onEdit={() => goTo(1)} editLabel="Edit date and time">
                    {date && formatLongDate(date)} at {time && formatTime(time)}
                  </ReviewRow>
                  <ReviewRow label="Patient" onEdit={() => goTo(2)} editLabel="Edit patient information">
                    {patient.firstName} {patient.lastName}
                    <span className="block text-sm text-ink-600">
                      {patient.email} · {patient.phone} · {patient.insurance}
                    </span>
                  </ReviewRow>
                </dl>

                <Checkbox
                  label="I understand this is a portfolio demo and no real appointment will be made."
                  checked={acknowledged}
                  onChange={(e) => setAcknowledged(e.target.checked)}
                />

                {submitError && (
                  <Alert tone="danger" title="We couldn't book your appointment" role="alert">
                    {submitError}
                  </Alert>
                )}
              </div>
            )}

            {/* ---------------- Navigation ---------------- */}
            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-ink-100 pt-6 sm:flex-row sm:justify-between">
              {step > 0 ? (
                <Button variant="ghost" onClick={() => goTo(step - 1)} disabled={submitting}>
                  <ArrowLeft aria-hidden="true" /> Back
                </Button>
              ) : (
                <span />
              )}
              {step < 3 ? (
                <Button type="submit" size="lg">
                  Continue <ArrowRight aria-hidden="true" />
                </Button>
              ) : (
                <Button type="submit" size="lg" disabled={submitting} aria-disabled={submitting}>
                  {submitting ? (
                    <>
                      <LoaderCircle className="animate-spin" aria-hidden="true" /> Booking…
                    </>
                  ) : (
                    <>
                      <Check aria-hidden="true" /> Confirm appointment
                    </>
                  )}
                </Button>
              )}
            </div>
            {/* Announces the submitting state to screen readers */}
            <p className="sr-only" role="status">
              {submitting ? "Booking your appointment, please wait." : ""}
            </p>
          </form>
        </Card>
      </div>

      {/* ---------------- Summary sidebar ---------------- */}
      <aside aria-label="Appointment summary" className="lg:sticky lg:top-24 lg:self-start">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Avatar name={`${provider.firstName} ${provider.lastName}`} size="md" />
            <div>
              <p className="font-semibold text-ink-900">{name}</p>
              <p className="text-sm text-brand-700">{getSpecialty(provider.specialty)?.name}</p>
            </div>
          </div>
          <ul className="mt-5 space-y-3 border-t border-ink-100 pt-5 text-sm">
            <SummaryItem icon={<UserRound />} label="Visit type">
              {VISIT_TYPES.find((v) => v.value === visitType)?.label}
            </SummaryItem>
            <SummaryItem icon={visitType === "telehealth" ? <Video /> : <MapPin />} label="Location">
              {visitType === "telehealth" ? "Video visit" : visitType ? selectedLocation?.name : undefined}
            </SummaryItem>
            <SummaryItem icon={<CalendarDays />} label="Date and time">
              {date && time ? `${formatDayParts(date).full}, ${formatTime(time)}` : undefined}
            </SummaryItem>
          </ul>
        </Card>
      </aside>
    </div>
  );
}

/* ---------------- Small pieces used above ---------------- */

function Stepper({ current }: { current: number }) {
  return (
    <nav aria-label="Booking progress">
      <ol className="grid grid-cols-4 gap-2">
        {STEPS.map((label, i) => {
          const state = i < current ? "done" : i === current ? "current" : "upcoming";
          return (
            <li key={label} aria-current={state === "current" ? "step" : undefined} className="flex flex-col gap-2">
              <span
                className={cn(
                  "h-1.5 rounded-full",
                  state === "upcoming" ? "bg-ink-100" : "bg-brand-600",
                )}
                aria-hidden="true"
              />
              <span
                className={cn(
                  "text-xs font-medium sm:text-sm",
                  state === "current" ? "text-brand-700" : state === "done" ? "text-ink-800" : "text-ink-500",
                )}
              >
                <span className="sr-only">
                  {state === "done" ? "Completed: " : state === "current" ? "Current: " : "Upcoming: "}
                </span>
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function ChoiceCard({
  name,
  value,
  checked,
  onChange,
  disabled,
  icon,
  title,
  description,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <label
      className={cn(
        "relative flex cursor-pointer gap-4 rounded-control border-2 p-4 transition",
        checked ? "border-brand-600 bg-brand-50" : "border-ink-200 bg-white hover:border-brand-500",
        disabled && "cursor-not-allowed border-dashed bg-ink-50 opacity-70 hover:border-ink-200",
        "has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand-500",
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only"
      />
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-full [&_svg]:size-5",
          checked ? "bg-brand-600 text-white" : "bg-ink-100 text-ink-700",
        )}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block font-semibold text-ink-900">{title}</span>
        <span className="block text-sm text-ink-600">{description}</span>
      </span>
      {checked && <Check className="absolute top-4 right-4 size-5 text-brand-600" aria-hidden="true" />}
    </label>
  );
}

function ReviewRow({
  label,
  children,
  onEdit,
  editLabel,
}: {
  label: string;
  children: ReactNode;
  onEdit?: () => void;
  editLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-1 p-4 sm:flex-row sm:items-start sm:gap-6">
      <dt className="w-32 shrink-0 text-sm font-medium text-ink-600">{label}</dt>
      <dd className="flex-1 text-ink-900">{children}</dd>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          aria-label={editLabel}
          className="self-start rounded text-sm font-semibold text-brand-700 hover:underline"
        >
          Edit
        </button>
      )}
    </div>
  );
}

function SummaryItem({ icon, label, children }: { icon: ReactNode; label: string; children?: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 text-ink-500 [&_svg]:size-4" aria-hidden="true">
        {icon}
      </span>
      <span>
        <span className="block text-ink-600">{label}</span>
        <span className={cn("block font-medium", children ? "text-ink-900" : "text-ink-500 italic")}>
          {children || "Not selected yet"}
        </span>
      </span>
    </li>
  );
}

function AvailabilitySkeleton() {
  return (
    <div aria-busy="true">
      <p role="status" className="sr-only">
        Loading available times…
      </p>
      <Skeleton className="mb-3 h-5 w-32" />
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 7 }, (_, i) => (
          <Skeleton key={i} className="h-21 w-20 shrink-0 rounded-control" />
        ))}
      </div>
      <Skeleton className="mt-8 mb-3 h-5 w-56" />
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {Array.from({ length: 10 }, (_, i) => (
          <Skeleton key={i} className="h-11 rounded-control" />
        ))}
      </div>
    </div>
  );
}
