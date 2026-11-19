import Link from "next/link";
import { useId } from "react";
import { ArrowRight, CalendarCheck, Clock, MapPin, ShieldCheck, UserRound, Video } from "lucide-react";
import { locations } from "@/data/locations";
import { providers } from "@/data/providers";
import { HeroSearch } from "@/components/home/hero-search";
import { ProviderCard } from "@/components/provider-card";
import { SpecialtyIcon } from "@/components/specialty-icon";
import { ButtonLink } from "@/components/ui/button";
import { Card, Container, SectionHeading } from "@/components/ui/primitives";
import { searchableSpecialties } from "@/lib/search";

/*
 * HOMEPAGE (route: /)
 * A Server Component: it runs at build time and ships plain HTML. It has no
 * interactivity of its own, so it needs no client-side JavaScript.
 */

const featured = [...providers]
  .filter((p) => p.acceptingNewPatients)
  .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
  .slice(0, 3);

const stats = [
  { value: providers.length, label: "board-certified providers" },
  { value: searchableSpecialties.length, label: "specialties" },
  { value: locations.length, label: "locations" },
  { value: providers.filter((p) => p.offersTelehealth).length, label: "offer video visits" },
];

const steps = [
  {
    icon: UserRound,
    title: "Find the right provider",
    body: "Search by condition, specialty, or name. Filter by location, language, and who's accepting new patients.",
  },
  {
    icon: CalendarCheck,
    title: "Pick a time that works",
    body: "See real-time openings for the next two weeks, in person or by video.",
  },
  {
    icon: ShieldCheck,
    title: "Get confirmed instantly",
    body: "Get a confirmation number and visit details right away, and see them in your patient portal.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden bg-brand-900 pb-28 text-white">
        <HeroBackdrop />
        <Container className="relative pt-16 sm:pt-24">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-brand-100 ring-1 ring-white/15">
              <Clock className="size-4" aria-hidden="true" /> Same-week appointments available
            </p>
            <h1 className="font-display text-4xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-6xl">
              Care that points you in the right direction.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-brand-100 sm:text-xl">
              Find a Northstar doctor, see who&apos;s available, and book in minutes, in person or by video.
            </p>
          </div>
        </Container>
      </section>

      <Container className="relative z-10 -mt-20">
        <HeroSearch />
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <span className="text-ink-600">Popular:</span>
          <Link href="/providers?telehealth=1" className="inline-flex items-center gap-1.5 font-medium text-brand-700 hover:underline">
            <Video className="size-4" aria-hidden="true" /> Video visits
          </Link>
          <Link href="/providers?newPatients=1&specialty=primary-care" className="font-medium text-brand-700 hover:underline">
            New-patient primary care
          </Link>
          <Link href="/providers?q=knee%20pain" className="font-medium text-brand-700 hover:underline">
            Knee pain
          </Link>
          <Link href="/providers?specialty=pediatrics" className="font-medium text-brand-700 hover:underline">
            Pediatricians
          </Link>
        </div>
      </Container>

      {/* ---------------- Stats ---------------- */}
      <Container className="mt-16">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-ink-100 bg-ink-100 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col bg-white px-6 py-6">
              <dt className="text-sm text-ink-600">{s.label}</dt>
              <dd className="order-first font-display text-4xl font-semibold text-brand-900">{s.value}</dd>
            </div>
          ))}
        </dl>
      </Container>

      {/* ---------------- Specialties ---------------- */}
      <section id="specialties" aria-labelledby="specialties-heading" className="scroll-mt-20 py-20">
        <Container>
          <SectionHeading
            eyebrow="Specialties"
            title={<span id="specialties-heading">Expert care for every part of life</span>}
            description="From annual checkups to specialist care, our teams work together so you don't have to coordinate it yourself."
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {searchableSpecialties.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/providers?specialty=${s.slug}`}
                  className="group flex h-full gap-4 rounded-card border border-ink-100 bg-white p-5 transition hover:border-brand-200 hover:shadow-card"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                    <SpecialtyIcon slug={s.slug} className="size-6" />
                  </span>
                  <span>
                    <span className="flex items-center gap-1 font-semibold text-ink-900">
                      {s.name}
                      <ArrowRight
                        className="size-4 text-brand-600 opacity-0 transition-opacity group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="mt-1 block text-sm text-ink-600">{s.description}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ---------------- How it works ---------------- */}
      <section id="how-it-works" aria-labelledby="how-heading" className="scroll-mt-20 bg-ink-50 py-20">
        <Container>
          <SectionHeading
            eyebrow="How it works"
            title={<span id="how-heading">Booking care shouldn&apos;t feel like a chore</span>}
          />
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <li key={step.title}>
                <Card className="h-full p-6">
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-full bg-brand-600 text-white">
                      <step.icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="font-display text-5xl font-semibold text-ink-100" aria-hidden="true">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-ink-900">{step.title}</h3>
                  <p className="mt-2 text-ink-600">{step.body}</p>
                </Card>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ---------------- Featured providers ---------------- */}
      <section aria-labelledby="featured-heading" className="py-20">
        <Container>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Meet our providers"
              title={<span id="featured-heading">Highly rated, and accepting new patients</span>}
            />
            <ButtonLink href="/providers?newPatients=1&sort=rating" variant="secondary" className="shrink-0">
              View all providers <ArrowRight aria-hidden="true" />
            </ButtonLink>
          </div>
          <ul className="mt-10 grid gap-4">
            {featured.map((p) => (
              <li key={p.id}>
                <ProviderCard provider={p} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ---------------- Locations ---------------- */}
      <section aria-labelledby="locations-heading" className="bg-ink-50 py-20">
        <Container>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Locations"
              title={<span id="locations-heading">Close to home, wherever home is</span>}
              description="Five locations across the region, most with on-site labs and free parking."
            />
            <ButtonLink href="/locations" variant="secondary" className="shrink-0">
              All locations <ArrowRight aria-hidden="true" />
            </ButtonLink>
          </div>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map((l) => (
              <li key={l.id}>
                <Link
                  href={`/locations/${l.id}`}
                  className="flex h-full flex-col rounded-card border border-ink-100 bg-white p-5 transition hover:border-brand-200 hover:shadow-card"
                >
                  <span className="text-xs font-semibold tracking-wide text-brand-600 uppercase">{l.type}</span>
                  <span className="mt-1 font-semibold text-ink-900">{l.name}</span>
                  <span className="mt-3 flex items-start gap-2 text-sm text-ink-600">
                    <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    {l.address.street}, {l.address.city}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ---------------- Portal CTA ---------------- */}
      <section aria-labelledby="portal-heading" className="py-20">
        <Container>
          <div className="relative overflow-hidden rounded-card bg-brand-800 px-6 py-12 text-white sm:px-12">
            <HeroBackdrop />
            <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <h2 id="portal-heading" className="font-display text-3xl font-semibold">
                  Your health, all in one place
                </h2>
                <p className="mt-3 text-brand-100">
                  See upcoming visits, message your care team, and review results in the Northstar patient portal.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/portal" variant="inverse" size="lg">
                  Sign in to the portal
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

/** Decorative star field drawn in SVG. aria-hidden keeps it out of screen readers. */
function HeroBackdrop() {
  // useId gives each copy of this SVG its own gradient id, so ids stay unique on the page
  const glowId = useId();
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1200 600"
    >
      <defs>
        <radialGradient id={glowId} cx="80%" cy="10%" r="70%">
          <stop offset="0%" stopColor="#1584a8" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#0a2540" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1200" height="600" fill={`url(#${glowId})`} />
      <g fill="#f4b740">
        <path d="M980 80 986 104 1010 110 986 116 980 140 974 116 950 110 974 104Z" opacity="0.9" />
      </g>
      <g fill="white">
        {[
          [120, 60, 1.5], [260, 140, 1], [420, 40, 1.2], [610, 110, 1], [760, 50, 1.6], [880, 200, 1],
          [1080, 260, 1.3], [1140, 90, 1], [690, 260, 0.8], [340, 300, 1], [1020, 380, 1.1], [180, 420, 0.9],
          [540, 470, 1], [820, 440, 1.4], [1110, 520, 1],
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} opacity={0.5} />
        ))}
      </g>
      <path d="M980 110 Q 760 260 420 600" stroke="white" strokeOpacity="0.08" strokeWidth="1.5" fill="none" />
    </svg>
  );
}
