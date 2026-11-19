"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent, type ReactNode } from "react";
import { LoaderCircle, Search, SlidersHorizontal } from "lucide-react";
import { locations } from "@/data/locations";
import { Button, ButtonLink } from "@/components/ui/button";
import { Checkbox, SelectField, TextField } from "@/components/ui/field";
import { cn } from "@/lib/cn";
import { countActiveFilters, searchableSpecialties, sortOptions, type ProviderFilters } from "@/lib/search";

/*
 * The interactive part of the search page: the filter sidebar and sort menu.
 * The results are passed in as `children` from the server, so this client
 * component handles only the controls while the server does the searching.
 *
 * Flow:  user changes a filter -> we build a new URL -> router.replace() ->
 *        the server re-renders the results for the new URL.
 */

type Props = {
  filters: ProviderFilters;
  languages: string[];
  children: ReactNode;
};

const FORM_ID = "provider-filters";

export function ProviderSearchShell({ filters, languages, children }: Props) {
  const router = useRouter();
  // useTransition tells us when a navigation is in progress (isPending),
  // so we can show a subtle "Updating" indicator.
  const [isPending, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);

  // The form fields are "controlled": their values live in React state.
  const [values, setValues] = useState(filters);

  // If the URL changes from somewhere else (e.g. "Clear all" or the back
  // button), reset the fields to match. This is React's recommended
  // "adjust state when a prop changes" pattern.
  const serialized = JSON.stringify(filters);
  const [syncedFrom, setSyncedFrom] = useState(serialized);
  if (syncedFrom !== serialized) {
    setSyncedFrom(serialized);
    setValues(filters);
  }

  function navigate(next: ProviderFilters) {
    // Only put non-empty values in the URL to keep it short and readable.
    const params = new URLSearchParams();
    if (next.q) params.set("q", next.q);
    if (next.specialty) params.set("specialty", next.specialty);
    if (next.location) params.set("location", next.location);
    if (next.language) params.set("language", next.language);
    if (next.newPatients) params.set("newPatients", "1");
    if (next.telehealth) params.set("telehealth", "1");
    if (next.sort !== "relevance") params.set("sort", next.sort);
    const query = params.toString();
    startTransition(() => {
      router.replace(query ? `/providers?${query}` : "/providers", { scroll: false });
    });
  }

  /** Update one field. Dropdowns and checkboxes apply immediately. */
  function update<K extends keyof ProviderFilters>(key: K, value: ProviderFilters[K], applyNow = true) {
    const next = { ...values, [key]: value };
    setValues(next);
    if (applyNow) navigate(next);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    // Without JavaScript the form still works as a normal GET request.
    // With JavaScript, we take over for a smoother, no-reload update.
    e.preventDefault();
    navigate(values);
    setMobileOpen(false);
  }

  const activeCount = countActiveFilters(values);

  return (
    <div className="grid gap-8 lg:grid-cols-[17.5rem_1fr]">
      {/* ---------- Filters ---------- */}
      <aside aria-label="Search filters">
        <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
          <Button
            variant="secondary"
            aria-expanded={mobileOpen}
            aria-controls={FORM_ID}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <SlidersHorizontal aria-hidden="true" />
            {mobileOpen ? "Hide filters" : "Show filters"}
            {activeCount > 0 && (
              <span className="rounded-full bg-brand-600 px-2 text-xs text-white">{activeCount}</span>
            )}
          </Button>
        </div>

        <form
          id={FORM_ID}
          action="/providers"
          method="get"
          role="search"
          onSubmit={onSubmit}
          className={cn(
            "space-y-5 rounded-card border border-ink-100 bg-white p-5 lg:sticky lg:top-24 lg:block",
            mobileOpen ? "block" : "hidden",
          )}
        >
          <div className="flex gap-2">
            <TextField
              name="q"
              label="Search"
              placeholder="Condition, specialty, or name"
              value={values.q}
              onChange={(e) => update("q", e.target.value, false)}
              wrapperClassName="flex-1"
              autoComplete="off"
            />
            <Button type="submit" className="mt-[1.6875rem] size-11 px-0" aria-label="Search">
              <Search aria-hidden="true" />
            </Button>
          </div>

          <SelectField
            name="specialty"
            label="Specialty"
            value={values.specialty}
            onChange={(e) => update("specialty", e.target.value)}
          >
            <option value="">All specialties</option>
            {searchableSpecialties.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </SelectField>

          <SelectField
            name="location"
            label="Location"
            value={values.location}
            onChange={(e) => update("location", e.target.value)}
          >
            <option value="">All locations</option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </SelectField>

          <SelectField
            name="language"
            label="Language spoken"
            value={values.language}
            onChange={(e) => update("language", e.target.value)}
          >
            <option value="">Any language</option>
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </SelectField>

          <fieldset className="space-y-3">
            <legend className="mb-3 text-sm font-semibold text-ink-800">Availability</legend>
            <Checkbox
              name="newPatients"
              value="1"
              label="Accepting new patients"
              checked={values.newPatients}
              onChange={(e) => update("newPatients", e.target.checked)}
            />
            <Checkbox
              name="telehealth"
              value="1"
              label="Offers video visits"
              checked={values.telehealth}
              onChange={(e) => update("telehealth", e.target.checked)}
            />
          </fieldset>

          <div className="flex items-center justify-between gap-3 border-t border-ink-100 pt-4">
            <ButtonLink href="/providers" variant="ghost" size="sm" scroll={false}>
              Clear all
            </ButtonLink>
            {/* Shown for no-JS users and on mobile, where filters apply on "Show results" */}
            <Button type="submit" size="sm">
              Show results
            </Button>
          </div>
        </form>
      </aside>

      {/* ---------- Results ---------- */}
      <div className="min-w-0">
        <div className="mb-5 flex flex-wrap items-center justify-end gap-3">
          {isPending && (
            <span className="mr-auto inline-flex items-center gap-2 text-sm text-ink-600" aria-hidden="true">
              <LoaderCircle className="size-4 animate-spin" /> Updating results…
            </span>
          )}
          <label htmlFor="sort" className="text-sm font-medium text-ink-700">
            Sort by
          </label>
          <select
            id="sort"
            name="sort"
            form={FORM_ID}
            value={values.sort}
            onChange={(e) => update("sort", e.target.value as ProviderFilters["sort"])}
            className="h-10 rounded-control border border-ink-300 bg-white px-3 text-sm text-ink-900 hover:border-ink-500"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        {children}
      </div>
    </div>
  );
}
