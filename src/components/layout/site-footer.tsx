import Link from "next/link";
import { Container } from "@/components/ui/primitives";
import { Logo } from "./logo";

const columns = [
  {
    title: "Find care",
    links: [
      { href: "/providers", label: "Find a doctor" },
      { href: "/providers?telehealth=1", label: "Video visits" },
      { href: "/providers?newPatients=1", label: "Accepting new patients" },
      { href: "/locations", label: "Locations" },
    ],
  },
  {
    title: "Patients",
    links: [
      { href: "/portal", label: "Patient portal" },
      { href: "/#how-it-works", label: "How booking works" },
      { href: "/#specialties", label: "Specialties" },
    ],
  },
  {
    title: "About this project",
    links: [
      { href: "/design-system", label: "Design system" },
      { href: "/api/providers", label: "Provider API (JSON)" },
      { href: "/api/locations", label: "Locations API (JSON)" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-brand-950 text-brand-100">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-xs space-y-4">
          <Logo inverse />
          <p className="text-sm leading-relaxed text-brand-200">
            Care that points you in the right direction. Primary and specialty care across five locations.
          </p>
        </div>
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="text-sm font-semibold text-white">{col.title}</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-brand-200 hover:text-white hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-6 text-xs text-brand-200 sm:flex-row sm:justify-between">
          <p>
            <strong className="font-semibold text-white">Portfolio demo.</strong> Northstar Health is a fictional
            organization. All providers, locations, and data are invented. This is not medical advice.
          </p>
          <p>If you have a medical emergency, call 911.</p>
        </Container>
      </div>
    </footer>
  );
}
