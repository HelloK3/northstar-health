import { SearchX } from "lucide-react";
import { getLocation } from "@/data/locations";
import { getSpecialty } from "@/data/specialties";
import { ProviderCard } from "@/components/provider-card";
import { ButtonLink } from "@/components/ui/button";
import { Card, EmptyState, Skeleton } from "@/components/ui/primitives";
import { pluralize } from "@/lib/format";
import { simulateLatency } from "@/lib/latency";
import { searchProviders, type ProviderFilters } from "@/lib/search";

/*
 * An async Server Component: it can `await` data directly.
 * While it waits, React shows the nearest <Suspense> fallback (the skeleton below).
 */
export async function ProviderResults({ filters }: { filters: ProviderFilters }) {
  await simulateLatency(600);
  const results = searchProviders(filters);
  const summary = describeFilters(filters);

  return (
    <section aria-labelledby="results-heading">
      {/* role="status" asks screen readers to announce the new result count */}
      <div role="status" className="mb-4">
        <h2 id="results-heading" className="text-lg font-semibold text-ink-900">
          {pluralize(results.length, "provider")}
          {summary && <span className="font-normal text-ink-600"> {summary}</span>}
        </h2>
      </div>

      {results.length === 0 ? (
        <EmptyState
          icon={<SearchX />}
          title="No providers match your search"
          action={
            <ButtonLink href="/providers" variant="secondary" scroll={false}>
              Clear all filters
            </ButtonLink>
          }
        >
          <p>Try removing a filter, checking your spelling, or searching for a broader term like a specialty.</p>
        </EmptyState>
      ) : (
        <ul className="space-y-4">
          {results.map((p) => (
            <li key={p.id}>
              <ProviderCard provider={p} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function describeFilters(f: ProviderFilters) {
  const parts: string[] = [];
  if (f.q) parts.push(`matching “${f.q}”`);
  if (f.specialty) parts.push(`in ${getSpecialty(f.specialty)?.name ?? f.specialty}`);
  if (f.location) parts.push(`at ${getLocation(f.location)?.name ?? f.location}`);
  if (f.language) parts.push(`who speak ${f.language}`);
  return parts.join(" ");
}

export function ResultsSkeleton() {
  return (
    <div>
      <p role="status" className="sr-only">
        Loading providers…
      </p>
      <Skeleton className="mb-5 h-6 w-48" />
      <div className="space-y-4">
        {[0, 1, 2].map((i) => (
          <Card key={i} className="flex gap-5 p-6">
            <Skeleton className="size-20 rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-6 w-56" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-64" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-36 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
