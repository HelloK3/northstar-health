import type { Metadata } from "next";
import { Suspense } from "react";
import { allLanguages } from "@/data/providers";
import { PageHeader } from "@/components/page-header";
import { ProviderSearchShell } from "@/components/search/provider-search-shell";
import { ProviderResults, ResultsSkeleton } from "@/components/search/results";
import { Container, Skeleton } from "@/components/ui/primitives";
import { parseFilters } from "@/lib/search";

export const metadata: Metadata = {
  title: "Find a doctor",
  description: "Search Northstar Health providers by condition, specialty, location, and language.",
};

/*
 * PROVIDER SEARCH (route: /providers)
 *
 * The page header is static and pre-built. Everything that depends on the
 * URL's search params is wrapped in <Suspense>, so the static part appears
 * instantly and the results stream in when ready.
 */
export default function ProvidersPage({ searchParams }: PageProps<"/providers">) {
  return (
    <>
      <PageHeader
        title="Find a doctor"
        description="Search by condition, specialty, or name, then narrow results by location, language, and availability."
        crumbs={[{ href: "/", label: "Home" }, { label: "Find a doctor" }]}
      />
      <Container className="py-8 sm:py-10">
        <Suspense fallback={<SearchSkeleton />}>
          <SearchArea searchParams={searchParams} />
        </Suspense>
      </Container>
    </>
  );
}

async function SearchArea({ searchParams }: { searchParams: PageProps<"/providers">["searchParams"] }) {
  const filters = parseFilters(await searchParams);
  return (
    <ProviderSearchShell filters={filters} languages={allLanguages()}>
      {/* A new `key` for each search makes React show the skeleton while new results load */}
      <Suspense key={JSON.stringify(filters)} fallback={<ResultsSkeleton />}>
        <ProviderResults filters={filters} />
      </Suspense>
    </ProviderSearchShell>
  );
}

function SearchSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[17.5rem_1fr]">
      <Skeleton className="hidden h-[30rem] rounded-card lg:block" />
      <ResultsSkeleton />
    </div>
  );
}
