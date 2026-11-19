import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, MapPin, Phone } from "lucide-react";
import { locations } from "@/data/locations";
import { providers } from "@/data/providers";
import { ServiceMap } from "@/components/locations/service-map";
import { PageHeader } from "@/components/page-header";
import { Badge, Card, Container } from "@/components/ui/primitives";
import { formatPhoneHref, pluralize } from "@/lib/format";

export const metadata: Metadata = {
  title: "Locations",
  description: "Hours, services, and providers at every Northstar Health location.",
};

export default function LocationsPage() {
  return (
    <>
      <PageHeader
        title="Locations"
        description="Five locations across the region, with primary care close to home and specialists where you need them."
        crumbs={[{ href: "/", label: "Home" }, { label: "Locations" }]}
      />
      <Container className="grid gap-8 py-10 lg:grid-cols-[1fr_24rem]">
        <ul className="space-y-4">
          {locations.map((l) => {
            const count = providers.filter((p) => p.locationIds.includes(l.id)).length;
            return (
              <li key={l.id}>
                <Card className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold tracking-wide text-brand-600 uppercase">{l.type}</p>
                      <h2 className="mt-1 font-display text-2xl font-semibold text-ink-900">
                        <Link href={`/locations/${l.id}`} className="hover:text-brand-700 hover:underline">
                          {l.name}
                        </Link>
                      </h2>
                    </div>
                    <Badge tone="brand">{pluralize(count, "provider")}</Badge>
                  </div>
                  <p className="mt-3 text-ink-700">{l.description}</p>
                  <div className="mt-4 grid gap-3 text-sm text-ink-700 sm:grid-cols-3">
                    <p className="flex items-start gap-2">
                      <MapPin className="mt-0.5 size-4 shrink-0 text-ink-500" aria-hidden="true" />
                      <span>
                        {l.address.street}
                        <br />
                        {l.address.city}, {l.address.state} {l.address.zip}
                      </span>
                    </p>
                    <p className="flex items-start gap-2">
                      <Clock className="mt-0.5 size-4 shrink-0 text-ink-500" aria-hidden="true" />
                      <span>
                        {l.hours[0].days}
                        <br />
                        {l.hours[0].hours}
                      </span>
                    </p>
                    <a href={formatPhoneHref(l.phone)} className="flex items-start gap-2 hover:text-brand-700">
                      <Phone className="mt-0.5 size-4 shrink-0 text-ink-500" aria-hidden="true" />
                      {l.phone}
                    </a>
                  </div>
                  <ul className="mt-4 flex flex-wrap gap-2" aria-label="Services">
                    {l.services.map((s) => (
                      <li key={s}>
                        <Badge>{s}</Badge>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/locations/${l.id}`}
                    className="mt-5 inline-flex items-center gap-1.5 font-semibold text-brand-700 hover:underline"
                  >
                    Hours, services, and providers<span className="sr-only"> at {l.name}</span>
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Card>
              </li>
            );
          })}
        </ul>
        <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Service area map">
          <ServiceMap className="aspect-[10/7]" />
          <p className="mt-3 text-sm text-ink-600">Illustrated map. Locations and addresses are fictional.</p>
        </aside>
      </Container>
    </>
  );
}
