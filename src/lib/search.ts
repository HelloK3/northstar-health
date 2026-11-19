import { providers } from "@/data/providers";
import { getSpecialty, specialties } from "@/data/specialties";
import type { Provider } from "@/lib/types";

/*
 * Provider search.
 *
 * The filters live in the URL (e.g. /providers?specialty=cardiology&telehealth=1).
 * Keeping state in the URL means results can be bookmarked and shared,
 * the back button works, and the page renders correctly on first load.
 */

export const sortOptions = [
  { value: "relevance", label: "Best match" },
  { value: "rating", label: "Highest rated" },
  { value: "experience", label: "Most experience" },
  { value: "name", label: "Last name (A–Z)" },
] as const;

export type SortKey = (typeof sortOptions)[number]["value"];

export type ProviderFilters = {
  q: string;
  specialty: string;
  location: string;
  language: string;
  newPatients: boolean;
  telehealth: boolean;
  sort: SortKey;
};

type RawParams = Record<string, string | string[] | undefined>;

/** Read a single string from the URL params, ignoring repeats or missing values. */
function first(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

/** Turn raw URL search params into a typed, validated filters object. */
export function parseFilters(params: RawParams): ProviderFilters {
  const sort = first(params.sort);
  return {
    q: first(params.q).slice(0, 80),
    specialty: first(params.specialty),
    location: first(params.location),
    language: first(params.language),
    newPatients: first(params.newPatients) === "1",
    telehealth: first(params.telehealth) === "1",
    sort: sortOptions.some((o) => o.value === sort) ? (sort as SortKey) : "relevance",
  };
}

/** How many filters (besides search text and sort) are active, for the "Filters (2)" label. */
export function countActiveFilters(f: ProviderFilters) {
  return [f.specialty, f.location, f.language, f.newPatients, f.telehealth].filter(Boolean).length;
}

/** Score how well a provider matches the search text (0 = no match). */
function matchScore(p: Provider, query: string) {
  if (!query) return 1;
  const q = query.toLowerCase();
  const specialty = getSpecialty(p.specialty);
  const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();

  let score = 0;
  if (fullName.includes(q) || p.lastName.toLowerCase().startsWith(q)) score += 10;
  if (specialty?.name.toLowerCase().includes(q) || specialty?.practitioner.toLowerCase().includes(q)) score += 6;
  if (p.focusAreas.some((a) => a.toLowerCase().includes(q))) score += 5;
  if (specialty?.conditions.some((c) => c.includes(q) || q.includes(c))) score += 4;
  if (p.languages.some((l) => l.toLowerCase() === q)) score += 3;
  return score;
}

export function searchProviders(f: ProviderFilters): Provider[] {
  const results = providers
    .map((p) => ({ p, score: matchScore(p, f.q) }))
    .filter(({ p, score }) => {
      if (score === 0) return false;
      if (f.specialty && p.specialty !== f.specialty) return false;
      if (f.location && !p.locationIds.includes(f.location)) return false;
      if (f.language && !p.languages.includes(f.language)) return false;
      if (f.newPatients && !p.acceptingNewPatients) return false;
      if (f.telehealth && !p.offersTelehealth) return false;
      return true;
    });

  const byName = (a: Provider, b: Provider) => a.lastName.localeCompare(b.lastName);
  results.sort((a, b) => {
    switch (f.sort) {
      case "rating":
        return b.p.rating - a.p.rating || b.p.reviewCount - a.p.reviewCount;
      case "experience":
        return b.p.yearsExperience - a.p.yearsExperience;
      case "name":
        return byName(a.p, b.p);
      default:
        // "Best match": text relevance first, then patients accepting, then rating
        return (
          b.score - a.score ||
          Number(b.p.acceptingNewPatients) - Number(a.p.acceptingNewPatients) ||
          b.p.rating - a.p.rating
        );
    }
  });

  return results.map(({ p }) => p);
}

/** Specialties that at least one provider practices, for filter dropdowns. */
export const searchableSpecialties = specialties.filter((s) => providers.some((p) => p.specialty === s.slug));
