import Link from "next/link";
import { ChevronRight, Languages, MapPin, Video } from "lucide-react";
import { getLocation } from "@/data/locations";
import { providerName } from "@/data/providers";
import { getSpecialty } from "@/data/specialties";
import type { Provider } from "@/lib/types";
import { ButtonLink } from "@/components/ui/button";
import { Avatar, Badge, Card } from "@/components/ui/primitives";
import { Rating } from "@/components/ui/rating";

/*
 * One provider in a list. Used on the homepage and in search results.
 *
 * The whole card is clickable through the name link, but the "Book" button
 * stays a separate, clearly labeled control. We don't wrap everything in one
 * giant link, because screen readers would read the whole card as the
 * link's name.
 */
export function ProviderCard({ provider, headingLevel = "h3" }: { provider: Provider; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  const specialty = getSpecialty(provider.specialty);
  const name = providerName(provider);
  const primaryLocation = getLocation(provider.locationIds[0]);
  const extraLocations = provider.locationIds.length - 1;

  return (
    <Card className="group relative flex flex-col gap-5 p-5 transition-shadow hover:shadow-raised sm:flex-row sm:p-6">
      <Avatar name={`${provider.firstName} ${provider.lastName}`} size="lg" />

      <div className="min-w-0 flex-1 space-y-3">
        <div>
          <Heading className="font-display text-xl font-semibold text-ink-900">
            <Link
              href={`/providers/${provider.id}`}
              className="after:absolute after:inset-0 after:rounded-card hover:text-brand-700 hover:underline"
            >
              {name}
              <span className="font-sans text-base font-normal text-ink-600">, {provider.credentials}</span>
            </Link>
          </Heading>
          <p className="font-medium text-brand-700">{specialty?.name}</p>
        </div>

        <Rating value={provider.rating} count={provider.reviewCount} />

        <ul className="space-y-1.5 text-sm text-ink-700">
          {primaryLocation && (
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-ink-500" aria-hidden="true" />
              <span>
                {primaryLocation.name}
                {extraLocations > 0 && <span className="text-ink-600"> + {extraLocations} more</span>}
              </span>
            </li>
          )}
          <li className="flex items-start gap-2">
            <Languages className="mt-0.5 size-4 shrink-0 text-ink-500" aria-hidden="true" />
            <span>
              <span className="sr-only">Languages: </span>
              {provider.languages.join(", ")}
            </span>
          </li>
        </ul>

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
        </div>
      </div>

      {/* `relative z-10` lifts the button above the card-wide link overlay */}
      <div className="relative z-10 flex items-end sm:items-start">
        <ButtonLink
          href={`/providers/${provider.id}/book`}
          size="sm"
          className="w-full sm:w-auto"
          aria-label={`Book an appointment with ${name}`}
        >
          Book <ChevronRight aria-hidden="true" />
        </ButtonLink>
      </div>
    </Card>
  );
}
