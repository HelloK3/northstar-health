import type { Metadata } from "next";
import { Confirmation } from "@/components/booking/confirmation";
import { Container } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Appointment confirmed",
  robots: { index: false }, // personal pages shouldn't appear in search engines
};

/* CONFIRMATION (route: /appointments/confirmation?code=NS-XXXXXX) */
export default function ConfirmationPage() {
  return (
    <Container className="max-w-3xl py-10 sm:py-16">
      <Confirmation />
    </Container>
  );
}
