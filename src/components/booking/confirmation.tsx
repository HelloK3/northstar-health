"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, CalendarX, MapPin, Printer, Video } from "lucide-react";
import { getLocation } from "@/data/locations";
import { getProvider, providerName } from "@/data/providers";
import { getAppointment } from "@/lib/appointment-store";
import { formatTime } from "@/lib/availability";
import { formatLongDate, formatPhoneHref } from "@/lib/format";
import type { Appointment } from "@/lib/types";
import { Button, ButtonLink } from "@/components/ui/button";
import { Alert, Card, EmptyState, Skeleton } from "@/components/ui/primitives";

/*
 * Reads the just-booked appointment from this browser's storage.
 * Storage only exists in the browser, so we read it in useEffect, which
 * runs after the page has loaded on the client, never on the server.
 */
type State = { status: "loading" } | { status: "missing" } | { status: "found"; appointment: Appointment };

const visitLabels = { "new-patient": "New patient visit", "follow-up": "Follow-up visit", telehealth: "Video visit" };

export function Confirmation() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    const appointment = code ? getAppointment(code) : undefined;
    // Reading browser storage is an external system, so syncing it into state here is intended.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(appointment ? { status: "found", appointment } : { status: "missing" });
  }, []);

  if (state.status === "loading") {
    return (
      <div aria-busy="true">
        <p role="status" className="sr-only">Loading your confirmation…</p>
        <Skeleton className="mx-auto size-16 rounded-full" />
        <Skeleton className="mx-auto mt-6 h-9 w-72" />
        <Skeleton className="mt-10 h-72 rounded-card" />
      </div>
    );
  }

  if (state.status === "missing") {
    return (
      <EmptyState
        icon={<CalendarX />}
        title="We couldn't find that confirmation"
        action={<ButtonLink href="/providers">Find a doctor</ButtonLink>}
      >
        <p>
          Confirmations are saved only in the browser where you booked. If you booked on another device, check
          your patient portal there.
        </p>
      </EmptyState>
    );
  }

  const a = state.appointment;
  const provider = getProvider(a.providerId);
  const location = getLocation(a.locationId);
  const isVideo = a.visitType === "telehealth";

  return (
    <div>
      <div className="text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-success-50 text-success-700">
          <CalendarCheck className="size-8" aria-hidden="true" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          You&apos;re booked, {a.patient.firstName}!
        </h1>
        <p className="mt-3 text-lg text-ink-600">
          A confirmation was sent to <strong className="font-semibold text-ink-800">{a.patient.email}</strong>{" "}
          <span className="text-sm">(not really, this is a demo)</span>.
        </p>
      </div>

      <Card className="mt-10 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 bg-brand-900 px-6 py-4 text-white">
          <span className="text-sm text-brand-200">Confirmation number</span>
          <span className="font-mono text-lg font-semibold tracking-wider">{a.confirmationCode}</span>
        </div>
        <dl className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
          <Detail label="When">
            {formatLongDate(a.date)}
            <br />
            {formatTime(a.time)}
          </Detail>
          <Detail label="With">
            {provider ? providerName(provider) : "Your provider"}
            <br />
            <span className="text-ink-600">{visitLabels[a.visitType]}</span>
          </Detail>
          <Detail label="Where">
            {isVideo ? (
              <span className="flex items-start gap-2">
                <Video className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden="true" />
                Video visit. Your link arrives by email 24 hours before.
              </span>
            ) : (
              location && (
                <span className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden="true" />
                  <span>
                    {location.name}
                    <br />
                    {location.address.street}, {location.address.city}, {location.address.state}
                  </span>
                </span>
              )
            )}
          </Detail>
          <Detail label="Patient">
            {a.patient.firstName} {a.patient.lastName}
            <br />
            <span className="text-ink-600">{a.patient.insurance}</span>
          </Detail>
        </dl>
      </Card>

      <Alert tone="info" title="Before your visit" className="mt-6">
        <ul className="list-disc space-y-1 pl-5">
          <li>{isVideo ? "Find a quiet, private spot with a good connection." : "Arrive 15 minutes early to check in."}</li>
          <li>Bring your insurance card and a list of current medications.</li>
          <li>
            Need to reschedule? Call{" "}
            {location ? (
              <a href={formatPhoneHref(location.phone)} className="font-semibold underline">
                {location.phone}
              </a>
            ) : (
              "the clinic"
            )}{" "}
            at least 24 hours ahead.
          </li>
        </ul>
      </Alert>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center print:hidden">
        <ButtonLink href="/portal/dashboard">View in patient portal</ButtonLink>
        <Button variant="secondary" onClick={() => window.print()}>
          <Printer aria-hidden="true" /> Print
        </Button>
        <ButtonLink href="/" variant="ghost">
          Back to home
        </ButtonLink>
      </div>
    </div>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-sm font-semibold tracking-wide text-ink-600 uppercase">{label}</dt>
      <dd className="mt-1 text-ink-900">{children}</dd>
    </div>
  );
}
