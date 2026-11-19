import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocation } from "@/data/locations";
import { getProvider, providerName, providers } from "@/data/providers";
import { BookingFlow } from "@/components/booking/booking-flow";
import { PageHeader } from "@/components/page-header";
import { Container } from "@/components/ui/primitives";

/* BOOKING (route: /providers/[id]/book). The page is static; the flow inside is interactive. */

export function generateStaticParams() {
  return providers.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/providers/[id]/book">): Promise<Metadata> {
  const provider = getProvider((await params).id);
  return { title: provider ? `Book with ${providerName(provider)}` : "Provider not found" };
}

export default async function BookPage({ params }: PageProps<"/providers/[id]/book">) {
  const provider = getProvider((await params).id);
  if (!provider) notFound();
  const name = providerName(provider);
  const locations = provider.locationIds.map(getLocation).filter((l) => l !== undefined);

  return (
    <>
      <PageHeader
        title={`Book with ${name}`}
        description="Four quick steps. Your choices are saved as you go."
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/providers", label: "Find a doctor" },
          { href: `/providers/${provider.id}`, label: name },
          { label: "Book" },
        ]}
      />
      <Container className="py-8 sm:py-10">
        <BookingFlow provider={provider} locations={locations} />
      </Container>
    </>
  );
}
