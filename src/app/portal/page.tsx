import type { Metadata } from "next";
import { CalendarCheck, FileText, MessageSquare, Pill } from "lucide-react";
import { SignInForm } from "@/components/portal/sign-in-form";
import { Card, Container } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Patient portal sign in" };

const features = [
  { icon: CalendarCheck, text: "See and manage upcoming appointments" },
  { icon: MessageSquare, text: "Message your care team securely" },
  { icon: FileText, text: "Review test results and visit notes" },
  { icon: Pill, text: "Request prescription refills" },
];

export default function PortalPage() {
  return (
    <div className="flex-1 bg-ink-50">
      <Container className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-2">
        <div className="max-w-lg">
          <p className="text-sm font-semibold tracking-wide text-brand-600 uppercase">Patient portal</p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-ink-900">
            Your health, all in one place
          </h1>
          <ul className="mt-8 space-y-4">
            {features.map((f) => (
              <li key={f.text} className="flex items-center gap-3 text-ink-800">
                <span className="grid size-10 place-items-center rounded-full bg-white text-brand-600 shadow-card">
                  <f.icon className="size-5" aria-hidden="true" />
                </span>
                {f.text}
              </li>
            ))}
          </ul>
        </div>
        <Card className="mx-auto w-full max-w-md p-6 sm:p-8">
          <h2 className="mb-6 font-display text-2xl font-semibold text-ink-900">Sign in</h2>
          <SignInForm />
        </Card>
      </Container>
    </div>
  );
}
