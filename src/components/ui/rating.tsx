import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Star rating display.
 * The stars are decorative (aria-hidden); screen readers get the real
 * information from the visually hidden text instead of "star star star...".
 */
export function Rating({
  value,
  count,
  className,
}: {
  value: number;
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1.5 text-sm", className)}>
      <span className="flex" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            className={cn(
              "size-4",
              value >= n - 0.25 ? "fill-star-400 text-star-400" : "fill-ink-100 text-ink-200",
            )}
          />
        ))}
      </span>
      <span className="font-semibold text-ink-900" aria-hidden="true">
        {value.toFixed(1)}
      </span>
      {count !== undefined && (
        <span className="text-ink-600" aria-hidden="true">
          ({count} reviews)
        </span>
      )}
      <span className="sr-only">
        Rated {value.toFixed(1)} out of 5{count !== undefined ? `, from ${count} patient reviews` : ""}
      </span>
    </div>
  );
}
