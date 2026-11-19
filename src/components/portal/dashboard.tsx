"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendarPlus, CalendarX, FileText, Lock, LogOut, MessageSquare, Pill, Video } from "lucide-react";
import { getLocation } from "@/data/locations";
import { getProvider, providerName } from "@/data/providers";
import { getAppointments } from "@/lib/appointment-store";
import { formatTime } from "@/lib/availability";
import { endSession, getSession, type DemoSession } from "@/lib/demo-session";
import { formatDayParts } from "@/lib/format";
import type { Appointment } from "@/lib/types";
import { Button, ButtonLink } from "@/components/ui/button";
import { Avatar, Badge, Card, EmptyState, Skeleton } from "@/components/ui/primitives";

type State =
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "ready"; session: DemoSession; appointments: Appointment[] };

/* Sample portal content: static, fictional, and clearly placeholder. */
const messages = [
  { from: "Care team, Lakeside Family Clinic", subject: "Your flu shot is ready to schedule", unread: true },
  { from: "Dr. Amara Okafor", subject: "Following up on your lab results", unread: false },
];
const results = [
  { name: "Lipid panel", date: "Oct 2", status: "Normal" },
  { name: "Complete blood count", date: "Oct 2", status: "Normal" },
  { name: "Vitamin D", date: "Sep 14", status: "Reviewed" },
];

export function Dashboard() {
  const router = useRouter();
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const session = getSession();
    // Reading browser storage is an external system, so syncing it into state here is intended.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(session ? { status: "ready", session, appointments: getAppointments() } : { status: "signed-out" });
  }, []);

  if (state.status === "loading") {
    return (
      <div aria-busy="true" className="space-y-6">
        <p role="status" className="sr-only">Loading your portal…</p>
        <Skeleton className="h-10 w-72" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-64 rounded-card lg:col-span-2" />
          <Skeleton className="h-64 rounded-card" />
        </div>
      </div>
    );
  }

  if (state.status === "signed-out") {
    return (
      <EmptyState icon={<Lock />} title="Please sign in to see your portal" action={<ButtonLink href="/portal">Sign in</ButtonLink>}>
        <p>For your privacy, the portal is only available after you sign in.</p>
      </EmptyState>
    );
  }

  const { session, appointments } = state;
  const firstName = session.name.split(" ")[0];

  function signOut() {
    endSession();
    router.push("/portal");
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar name={session.name} size="md" />
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-900">
              Welcome back, {firstName}
            </h1>
            <p className="text-ink-600">Demo patient portal: all records are fictional.</p>
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={signOut}>
          <LogOut aria-hidden="true" /> Sign out
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ---------- Appointments ---------- */}
        <section aria-labelledby="appts-heading" className="lg:col-span-2">
          <Card className="h-full p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="appts-heading" className="font-display text-xl font-semibold text-ink-900">
                Upcoming appointments
              </h2>
              <ButtonLink href="/providers" size="sm" variant="ghost">
                <CalendarPlus aria-hidden="true" /> Book new
              </ButtonLink>
            </div>
            {appointments.length === 0 ? (
              <EmptyState
                className="mt-5 py-10"
                icon={<CalendarX />}
                title="No upcoming appointments"
                action={<ButtonLink href="/providers">Find a doctor</ButtonLink>}
              >
                <p>Appointments you book in this browser will show up here.</p>
              </EmptyState>
            ) : (
              <ul className="mt-5 divide-y divide-ink-100">
                {appointments.map((a) => {
                  const provider = getProvider(a.providerId);
                  const location = getLocation(a.locationId);
                  const day = formatDayParts(a.date);
                  return (
                    <li key={a.confirmationCode} className="flex gap-4 py-4 first:pt-0">
                      <div className="w-16 shrink-0 rounded-control bg-brand-50 py-2 text-center text-brand-800">
                        <p className="text-xs font-semibold uppercase">{day.month}</p>
                        <p className="font-display text-2xl font-semibold">{day.day}</p>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-ink-900">
                          {provider ? providerName(provider) : "Provider"} · {formatTime(a.time)}
                        </p>
                        <p className="text-sm text-ink-600">
                          {day.full} ·{" "}
                          {a.visitType === "telehealth" ? (
                            <span className="inline-flex items-center gap-1">
                              <Video className="size-3.5" aria-hidden="true" /> Video visit
                            </span>
                          ) : (
                            location?.name
                          )}
                        </p>
                        <p className="mt-1 text-xs text-ink-500">Confirmation {a.confirmationCode}</p>
                      </div>
                      <Link
                        href={`/appointments/confirmation?code=${a.confirmationCode}`}
                        className="self-center text-sm font-semibold text-brand-700 hover:underline"
                      >
                        Details<span className="sr-only"> for {day.full}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </section>

        {/* ---------- Messages ---------- */}
        <section aria-labelledby="msgs-heading">
          <Card className="h-full p-6">
            <h2 id="msgs-heading" className="flex items-center gap-2 font-display text-xl font-semibold text-ink-900">
              <MessageSquare className="size-5 text-brand-600" aria-hidden="true" /> Messages
            </h2>
            <ul className="mt-4 space-y-3">
              {messages.map((m) => (
                <li key={m.subject} className="rounded-control border border-ink-100 p-3">
                  <p className="flex items-center justify-between gap-2 text-sm text-ink-600">
                    {m.from}
                    {m.unread && <Badge tone="brand">New</Badge>}
                  </p>
                  <p className="mt-1 font-medium text-ink-900">{m.subject}</p>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        {/* ---------- Results ---------- */}
        <section aria-labelledby="results-heading" className="lg:col-span-2">
          <Card className="p-6">
            <h2 id="results-heading" className="flex items-center gap-2 font-display text-xl font-semibold text-ink-900">
              <FileText className="size-5 text-brand-600" aria-hidden="true" /> Recent test results
            </h2>
            <table className="mt-4 w-full text-left text-sm">
              <caption className="sr-only">Recent test results</caption>
              <thead className="text-ink-600">
                <tr className="border-b border-ink-100">
                  <th scope="col" className="py-2 font-medium">Test</th>
                  <th scope="col" className="py-2 font-medium">Date</th>
                  <th scope="col" className="py-2 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.name} className="border-b border-ink-100 last:border-0">
                    <td className="py-3 font-medium text-ink-900">{r.name}</td>
                    <td className="py-3 text-ink-700">{r.date}</td>
                    <td className="py-3 text-right">
                      <Badge tone={r.status === "Normal" ? "success" : "neutral"}>{r.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </section>

        {/* ---------- Prescriptions ---------- */}
        <section aria-labelledby="rx-heading">
          <Card className="h-full p-6">
            <h2 id="rx-heading" className="flex items-center gap-2 font-display text-xl font-semibold text-ink-900">
              <Pill className="size-5 text-brand-600" aria-hidden="true" /> Prescriptions
            </h2>
            <p className="mt-4 text-sm text-ink-700">You have no refills due in the next 30 days.</p>
          </Card>
        </section>
      </div>
    </div>
  );
}
