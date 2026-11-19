import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Award,
  CalendarPlus,
  Clock,
  GraduationCap,
  Languages,
  MapPin,
  Phone,
  ShieldCheck,
  Video,
} from "lucide-react";
import { getLocation } from "@/data/locations";
import { getProvider, providerName, providers } from "@/data/providers";
import { getSpecialty } from "@/data/specialties";
import { Breadcrumbs } from "@/components/page-header";
import { ProviderCard } from "@/components/provider-card";
import { SpecialtyIcon } from "@/components/specialty-icon";
import { ButtonLink } from "@/components/ui/button";
import { Avatar, Badge, Card, Container } from "@/components/ui/primitives";
import { Rating } from "@/components/ui/rating";
import { formatPhoneHref } from "@/lib/format";

/*
 * PROVIDER PROFILE (route: /providers/[id])
 *
 * [id] is a dynamic segment: one file serves every provider's page.
 * generateStaticParams lists every provider id, so Next.js builds all
 * 16 profile pages ahead of time and serves them as fast static HTML.
 */
export function generateStaticParams() {
  return providers.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/providers/[id]">): Promise<Metadata> {
  const provider = getProvider((await params).id);
  if (!provider) return { title: "Provider not found" };
  const specialty = getSpecialty(provider.specialty);
  return {
    title: `${providerName(provider)}, ${provider.credentials}: ${specialty?.name}`,
    description: provider.bio,
  };
}

export default async function ProviderPage({ params }: PageProps<"/providers/[id]">) {
  const { id } = await params;
  const provider = getProvider(id);
  if (!provider) notFound(); // shows not-found.tsx and returns a 404 status

  const specialty = getSpecialty(provider.specialty);
  const name = providerName(provider);
  const providerLocations = provider.locationIds.map(getLocation).filter((l) => l !== undefined);
  const related = providers
    .filter((p) => p.specialty === provider.specialty && p.id !== provider.id)
    .slice(0, 2);

  return (
    <>
      <div className="border-b border-ink-100 bg-ink-50">
        <Container className="py-8 sm:py-10">
          <Breadcrumbs
            items={[
              { href: "/", label: "Home" },
              { href: "/providers", label: "Find a doctor" },
              { label: name },
            ]}
          />
          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-start">
            <Avatar name={`${provider.firstName} ${provider.lastName}`} size="xl" />
            <div className="space-y-3">
              <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
                {name}
                <span className="font-sans text-xl font-normal text-ink-600">, {provider.credentials}</span>
              </h1>
              <p className="flex flex-wrap items-center gap-x-2 text-lg font-medium text-brand-700">
                <SpecialtyIcon slug={provider.specialty} className="size-5" />
                {specialty?.practitioner}
                <span className="text-sm font-normal text-ink-600">· Pronouns: {provider.pronouns}</span>
              </p>
              <Rating value={provider.rating} count={provider.reviewCount} />
              <div className="flex flex-wrap gap-2">
                {provider.acceptingNewPatients ? (
                  <Badge tone="success">Accepting new patients</Badge>
                ) : (
                  <Badge tone="neutral">Current patients only</Badge>
                )}
                {provider.offersTelehealth && (
                  <Badge tone="brand">
                    <Video aria-hidden="true" /> Video visits
                  </Badge>
                )}
                <Badge tone="star">
                  <Award aria-hidden="true" /> {provider.yearsExperience} years experience
                </Badge>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="grid gap-8 py-10 lg:grid-cols-[1fr_22rem]">
        {/* ---------- Main column ---------- */}
        <div className="min-w-0 space-y-8">
          <Section title="About">
            <p className="text-lg leading-relaxed text-ink-700">{provider.bio}</p>
            <blockquote className="mt-5 border-l-4 border-star-400 bg-star-100/50 py-3 pr-4 pl-5 font-display text-lg text-ink-800 italic">
              “{provider.philosophy}”
            </blockquote>
          </Section>

          <Section title="Areas of focus">
            <ul className="flex flex-wrap gap-2">
              {provider.focusAreas.map((area) => (
                <li key={area} className="rounded-full border border-ink-200 bg-white px-3.5 py-1.5 text-sm text-ink-800">
                  {area}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Education and certifications">
            <dl className="grid gap-4 sm:grid-cols-2">
              {provider.education.map((e) => (
                <div key={e.label} className="flex gap-3">
                  <GraduationCap className="mt-0.5 size-5 shrink-0 text-brand-600" aria-hidden="true" />
                  <div>
                    <dt className="text-sm text-ink-600">{e.label}</dt>
                    <dd className="font-medium text-ink-900">{e.institution}</dd>
                  </div>
                </div>
              ))}
              <div className="flex gap-3">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand-600" aria-hidden="true" />
                <div>
                  <dt className="text-sm text-ink-600">Board certification</dt>
                  <dd className="font-medium text-ink-900">{provider.boardCertifications.join(", ")}</dd>
                </div>
              </div>
            </dl>
          </Section>

          <Section title="Insurance accepted">
            <ul className="grid gap-2 sm:grid-cols-2">
              {provider.insurance.map((plan) => (
                <li key={plan} className="flex items-center gap-2 text-ink-800">
                  <ShieldCheck className="size-4 text-success-700" aria-hidden="true" /> {plan}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-ink-600">
              Plans change often. Please confirm coverage with your insurer before your visit.
            </p>
          </Section>

          {related.length > 0 && (
            <section aria-labelledby="related-heading">
              <h2 id="related-heading" className="mb-4 font-display text-2xl font-semibold text-ink-900">
                Other {specialty?.name.toLowerCase()} providers
              </h2>
              <ul className="space-y-4">
                {related.map((p) => (
                  <li key={p.id}>
                    <ProviderCard provider={p} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* ---------- Sidebar ---------- */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start" aria-label="Booking and locations">
          <Card className="p-6">
            <h2 className="font-display text-xl font-semibold text-ink-900">Book an appointment</h2>
            <ul className="mt-4 space-y-2 text-sm text-ink-700">
              <li className="flex items-center gap-2">
                <Clock className="size-4 text-ink-500" aria-hidden="true" /> Openings in the next 2 weeks
              </li>
              {provider.offersTelehealth && (
                <li className="flex items-center gap-2">
                  <Video className="size-4 text-ink-500" aria-hidden="true" /> In-person or video visits
                </li>
              )}
              <li className="flex items-center gap-2">
                <Languages className="size-4 text-ink-500" aria-hidden="true" /> Speaks {provider.languages.join(", ")}
              </li>
            </ul>
            <ButtonLink href={`/providers/${provider.id}/book`} size="lg" className="mt-5 w-full">
              <CalendarPlus aria-hidden="true" /> Book online
            </ButtonLink>
            {!provider.acceptingNewPatients && (
              <p className="mt-3 text-sm text-ink-600">
                Dr. {provider.lastName} is seeing current patients only. New patients can book with another provider.
              </p>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="font-display text-xl font-semibold text-ink-900">
              {providerLocations.length > 1 ? "Locations" : "Location"}
            </h2>
            <ul className="mt-4 divide-y divide-ink-100">
              {providerLocations.map((loc) => (
                <li key={loc.id} className="py-4 first:pt-0 last:pb-0">
                  <Link href={`/locations/${loc.id}`} className="font-semibold text-brand-700 hover:underline">
                    {loc.name}
                  </Link>
                  <p className="mt-1 flex items-start gap-2 text-sm text-ink-700">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-ink-500" aria-hidden="true" />
                    <span>
                      {loc.address.street}
                      <br />
                      {loc.address.city}, {loc.address.state} {loc.address.zip}
                    </span>
                  </p>
                  <a
                    href={formatPhoneHref(loc.phone)}
                    className="mt-1 flex items-center gap-2 text-sm text-ink-700 hover:text-brand-700"
                  >
                    <Phone className="size-4 text-ink-500" aria-hidden="true" /> {loc.phone}
                  </a>
                </li>
              ))}
            </ul>
          </Card>
        </aside>
      </Container>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-card border border-ink-100 bg-white p-6 sm:p-8">
      <h2 className="mb-4 font-display text-2xl font-semibold text-ink-900">{title}</h2>
      {children}
    </section>
  );
}
