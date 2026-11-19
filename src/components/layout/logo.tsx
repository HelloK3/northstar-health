import { cn } from "@/lib/cn";

/** The Northstar mark: a four-point star with a north-pointing long ray. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("size-8", className)}>
      <rect width="32" height="32" rx="9" className="fill-brand-900" />
      <path
        d="M16 4.5 18.2 13.8 26 16 18.2 18.2 16 27.5 13.8 18.2 6 16 13.8 13.8Z"
        className="fill-star-400"
      />
      <circle cx="16" cy="16" r="1.6" className="fill-brand-900" />
    </svg>
  );
}

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span
        className={cn(
          "font-display text-xl font-semibold tracking-tight",
          inverse ? "text-white" : "text-brand-900",
        )}
      >
        Northstar <span className={inverse ? "text-brand-200" : "text-brand-600"}>Health</span>
      </span>
    </span>
  );
}
