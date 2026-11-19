import type { Metadata } from "next";
import { ArrowRight, CalendarPlus, Inbox, Video } from "lucide-react";
import { providers } from "@/data/providers";
import { PageHeader } from "@/components/page-header";
import { ProviderCard } from "@/components/provider-card";
import { Button, ButtonLink } from "@/components/ui/button";
import { Checkbox, SelectField, TextAreaField, TextField } from "@/components/ui/field";
import { Alert, Avatar, Badge, Card, Container, EmptyState, Skeleton } from "@/components/ui/primitives";
import { Rating } from "@/components/ui/rating";

export const metadata: Metadata = {
  title: "Design system",
  description: "The tokens and components that make up the Northstar Health interface.",
};

/*
 * DESIGN SYSTEM (route: /design-system)
 * A living style guide. It renders the REAL components, so it can never
 * drift out of date the way a static style-guide document can.
 */

const palettes = [
  { name: "Brand", tokens: ["brand-950", "brand-900", "brand-800", "brand-700", "brand-600", "brand-500", "brand-200", "brand-100", "brand-50"] },
  { name: "Ink (neutrals)", tokens: ["ink-950", "ink-900", "ink-800", "ink-700", "ink-600", "ink-500", "ink-300", "ink-200", "ink-100", "ink-50"] },
  { name: "Accent & feedback", tokens: ["star-400", "star-700", "star-100", "success-700", "success-50", "warning-700", "warning-50", "danger-700", "danger-50"] },
];

const typeScale = [
  { label: "Display / 6xl", className: "font-display text-6xl font-semibold tracking-tight", sample: "Northstar" },
  { label: "Heading 1 / 4xl", className: "font-display text-4xl font-semibold tracking-tight", sample: "Find a doctor" },
  { label: "Heading 2 / 2xl", className: "font-display text-2xl font-semibold", sample: "Areas of focus" },
  { label: "Body large / lg", className: "text-lg", sample: "Care that points you in the right direction." },
  { label: "Body / base", className: "text-base", sample: "Search by condition, specialty, or name." },
  { label: "Small / sm", className: "text-sm text-ink-600", sample: "Plans change often. Please confirm coverage." },
];

export default function DesignSystemPage() {
  return (
    <>
      <PageHeader
        title="Design system"
        description="Tokens and components behind the Northstar interface. Every example on this page is the real, production component."
        crumbs={[{ href: "/", label: "Home" }, { label: "Design system" }]}
      />
      <Container className="space-y-16 py-12">
        <Block title="Principles">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Calm and clear", "Healthcare is stressful. Generous spacing, one primary action per view, and plain language keep people oriented."],
              ["Accessible by default", "Built to WCAG 2.2 AA: 4.5:1 text contrast, visible focus, labeled controls, and large touch targets."],
              ["Trust through honesty", "Every state is designed (loading, empty, and error), so people always know what's happening."],
            ].map(([t, d]) => (
              <Card key={t} className="p-6">
                <h3 className="font-semibold text-ink-900">{t}</h3>
                <p className="mt-2 text-sm text-ink-600">{d}</p>
              </Card>
            ))}
          </div>
        </Block>

        <Block title="Color" description="Defined once as CSS variables in globals.css and exposed as Tailwind utilities.">
          <div className="space-y-8">
            {palettes.map((p) => (
              <div key={p.name}>
                <h3 className="mb-3 text-sm font-semibold text-ink-800">{p.name}</h3>
                <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-10">
                  {p.tokens.map((t) => (
                    <li key={t}>
                      <div
                        className="h-14 rounded-control border border-ink-900/10"
                        style={{ background: `var(--color-${t})` }}
                      />
                      <p className="mt-1.5 font-mono text-xs text-ink-700">{t}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Typography" description="Source Serif 4 for headings brings warmth; Inter for interface text keeps things legible.">
          <div className="divide-y divide-ink-100 rounded-card border border-ink-100">
            {typeScale.map((t) => (
              <div key={t.label} className="flex flex-col gap-1 p-5 md:flex-row md:items-baseline md:gap-8">
                <p className="w-40 shrink-0 font-mono text-xs text-ink-600">{t.label}</p>
                <p className={`${t.className} min-w-0 break-words text-ink-900`}>{t.sample}</p>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Buttons" description="Buttons do things; button-styled links go places. All sizes are at least 40px tall.">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button disabled>Disabled</Button>
            <ButtonLink href="/providers">
              <CalendarPlus aria-hidden="true" /> With icon
            </ButtonLink>
            <Button size="sm">Small</Button>
            <Button size="lg">
              Large <ArrowRight aria-hidden="true" />
            </Button>
            <span className="rounded-control bg-brand-900 p-2">
              <Button variant="inverse">Inverse</Button>
            </span>
          </div>
        </Block>

        <Block title="Form fields" description="Visible labels, hint text, and errors connected with aria-describedby.">
          <div className="grid gap-6 md:grid-cols-2">
            <TextField label="Default" placeholder="Placeholder text" />
            <TextField label="With hint" hint="We'll send your confirmation here." type="email" />
            <TextField label="With error" defaultValue="jordan@" error="Enter an email address like name@example.com." />
            <SelectField label="Select" defaultValue="">
              <option value="">Choose an option</option>
              <option>Option one</option>
            </SelectField>
            <TextAreaField label="Text area" wrapperClassName="md:col-span-2" />
            <Checkbox label="Checkbox" description="Optional supporting text explains the choice." />
          </div>
        </Block>

        <Block title="Badges, avatars, and ratings">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>Neutral</Badge>
            <Badge tone="brand">
              <Video aria-hidden="true" /> Brand
            </Badge>
            <Badge tone="success">Success</Badge>
            <Badge tone="warning">Warning</Badge>
            <Badge tone="star">Star</Badge>
            <Avatar name="Amara Okafor" size="sm" />
            <Avatar name="Mei-Lin Chen" size="md" />
            <Avatar name="Thomas Novak" size="lg" />
            <Rating value={4.8} count={212} />
          </div>
        </Block>

        <Block title="Alerts">
          <div className="grid gap-3 md:grid-cols-2">
            <Alert tone="info" title="Information">Neutral, helpful context.</Alert>
            <Alert tone="success" title="Success">Something completed as expected.</Alert>
            <Alert tone="warning" title="Warning">Something to be careful about.</Alert>
            <Alert tone="danger" title="Error">Something went wrong and needs attention.</Alert>
          </div>
        </Block>

        <Block title="States" description="Loading and empty states are part of the design, not an afterthought.">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="flex gap-5 p-6">
              <Skeleton className="size-20 rounded-full" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-56" />
              </div>
            </Card>
            <EmptyState icon={<Inbox />} title="Nothing here yet" className="py-8">
              <p>Explain why it&apos;s empty and what to do next.</p>
            </EmptyState>
          </div>
        </Block>

        <Block title="Composite: provider card">
          <ProviderCard provider={providers[0]} />
        </Block>
      </Container>
    </>
  );
}

function Block({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-6 border-b border-ink-100 pb-3">
        <h2 className="font-display text-2xl font-semibold text-ink-900">{title}</h2>
        {description && <p className="mt-1 text-ink-600">{description}</p>}
      </div>
      {children}
    </section>
  );
}
