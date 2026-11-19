import type { Metadata } from "next";
import { Dashboard } from "@/components/portal/dashboard";
import { Container } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Patient portal", robots: { index: false } };

export default function DashboardPage() {
  return (
    <div className="flex-1 bg-ink-50">
      <Container className="py-10">
        <Dashboard />
      </Container>
    </div>
  );
}
