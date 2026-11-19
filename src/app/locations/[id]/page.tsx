import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Accessibility, CalendarPlus, Check, Clock, MapPin, Phone } from "lucide-react";
import { getLocation, locations } from "@/data/locations";
import { providers } from "@/data/providers";
import { ServiceMap } from "@/components/locations/service-map";
import { PageHeader } from "@/components/page-header";
import { ProviderCard } from "@/components/provider-card";
import { ButtonLink } from "@/components/ui/button";
import { Card, Container } from "@/components/ui/primitives";
import { formatPhoneHref } from "@/lib/format";

export function generateStaticParams() {
  return locations.map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }: PageProps<"/locations/[id]">): Promise<Metadata> {
  const location = getLocation((await params).id);
  return location
    ? { title: location.name, description: location.description }
    : { title: "Location not found" };
}

export default async function LocationPage({ params }: PageProps<"/locations/[id]">) {
  const location = getLocation((await params).id);
  if (!location) notFound();
  const here = providers.filter((p) => p.locationIds.includes(location.id));
  const { address } = location;

  return (
    <>
      <PageHeader
        title={location.name}
        description={location.description}
        crumbs={[{ href: "/", label: "Home" }, { href: "/locations", label: "Locations" }, { label: location.name }]}
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href={`/providers?location=${location.id}`}>
            <CalendarPlus aria-hidden="true" /> Book at this location
          </ButtonLink>
          <ButtonLink href={formatPhoneHref(location.phone)} variant="secondary">
            <Phone aria-hidden="true" /> Call {location.phone}
          </ButtonLink>
        </div>
      </PageHeader>

      <Container className="grid gap-8 py-10 lg:grid-cols-[1fr_22rem]">
        <div className="min-w-0 space-y-8">
          <section aria-labelledby="services-heading" className="grid gap-6 sm:grid-cols-2">
            <Card className="p-6">
              <h2 id="services-heading" className="font-display text-xl font-semibold text-ink-900">
                Services
              </h2>
              <ul className="mt-4 space-y-2">
                {location.services.map((s) => (
                  <li key={s} className="flex items-center gap-2 text-ink-800">
                    <Check className="size-4 text-success-700" aria-hidden="true" /> {s}
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="p-6">
              <h2 className="font-display text-xl font-semibold text-ink-900">Amenities and access</h2>
              <ul className="mt-4 space-y-2">
                {location.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-ink-800">
                    <Accessibility className="size-4 text-brand-600" aria-hidden="true" /> {a}
                  </li>
                ))}
              </ul>
            </Card>
          </section>

          <section aria-labelledby="providers-heading">
            <h2 id="providers-heading" className="mb-4 font-display text-2xl font-semibold text-ink-900">
              Providers at {location.name}
            </h2>
            <ul className="space-y-4">
              {here.map((p) => (
                <li key={p.id}>
                  <ProviderCard provider={p} />
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start" aria-label="Address and hours">
          <ServiceMap highlight={location.id} className="aspect-[10/7]" />
          <Card className="p-6">
            <h2 className="flex items-center gap-2 font-semibold text-ink-900">
              <MapPin className="size-5 text-brand-600" aria-hidden="true" /> Address
            </h2>
            <address className="mt-2 text-ink-700 not-italic">
              {address.street}
              <br />
              {address.city}, {address.state} {address.zip}
            </address>
            <h2 className="mt-6 flex items-center gap-2 font-semibold text-ink-900">
              <Clock className="size-5 text-brand-600" aria-hidden="true" /> Hours
            </h2>
            <table className="mt-2 w-full text-sm">
              <caption className="sr-only">Opening hours</caption>
              <tbody>
                {location.hours.map((h) => (
                  <tr key={h.days} className="border-b border-ink-100 last:border-0">
                    <th scope="row" className="py-2 pr-3 text-left font-medium text-ink-800">
                      {h.days}
                    </th>
                    <td className={h.hours === "Closed" ? "py-2 text-right text-ink-600" : "py-2 text-right text-ink-900"}>
                      {h.hours}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </aside>
      </Container>
    </>
  );
}
