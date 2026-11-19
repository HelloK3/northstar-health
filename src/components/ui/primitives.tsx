import type { ComponentProps, ReactNode } from "react";
import { TriangleAlert, CircleCheck, Info, CircleX } from "lucide-react";
import { cn } from "@/lib/cn";

/*
 * Small presentational building blocks used across the app.
 * Each one is a plain function that returns styled HTML, which keeps them
 * easy to read and to reuse.
 */

/* ---------- Container: centers content and applies page gutters ---------- */
export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)} {...props} />;
}

/* ---------- Card ---------- */
export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("rounded-card border border-ink-100 bg-white shadow-card", className)}
      {...props}
    />
  );
}

/* ---------- Badge ---------- */
type BadgeTone = "neutral" | "brand" | "success" | "warning" | "star";
const badgeTones: Record<BadgeTone, string> = {
  neutral: "bg-ink-100 text-ink-700",
  brand: "bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100",
  success: "bg-success-50 text-success-700",
  warning: "bg-warning-50 text-warning-700",
  star: "bg-star-100 text-star-700",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: ComponentProps<"span"> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold [&_svg]:size-3.5",
        badgeTones[tone],
        className,
      )}
      {...props}
    />
  );
}

/* ---------- Avatar: initials on a tinted circle (no real photos) ---------- */
const avatarTints = [
  "bg-brand-100 text-brand-800",
  "bg-star-100 text-star-700",
  "bg-success-50 text-success-700",
  "bg-ink-100 text-ink-800",
  "bg-[#ece8fb] text-[#4a3a8c]",
  "bg-[#fde8ef] text-[#8c2a4f]",
];

export function Avatar({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const initials = name
    .split(" ")
    .filter((part) => !part.endsWith("."))
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
  // Pick a tint from the name so the same person always gets the same color.
  const tint = avatarTints[[...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % avatarTints.length];
  const sizes = {
    sm: "size-10 text-sm",
    md: "size-14 text-lg",
    lg: "size-20 text-2xl",
    xl: "size-28 text-4xl",
  };
  return (
    <div
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-display font-semibold",
        tint,
        sizes[size],
        className,
      )}
    >
      {initials}
    </div>
  );
}

/* ---------- Skeleton: placeholder shapes shown while content loads ---------- */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("animate-shimmer rounded-md bg-ink-100", className)} />;
}

/* ---------- Alert ---------- */
type AlertTone = "info" | "success" | "warning" | "danger";
const alertStyles: Record<AlertTone, { box: string; icon: ReactNode }> = {
  info: { box: "bg-brand-50 text-brand-900 border-brand-100", icon: <Info /> },
  success: { box: "bg-success-50 text-success-700 border-success-700/20", icon: <CircleCheck /> },
  warning: { box: "bg-warning-50 text-warning-700 border-warning-700/20", icon: <TriangleAlert /> },
  danger: { box: "bg-danger-50 text-danger-700 border-danger-700/20", icon: <CircleX /> },
};

export function Alert({
  tone = "info",
  title,
  children,
  className,
  ...props
}: { tone?: AlertTone; title?: ReactNode } & ComponentProps<"div">) {
  const { box, icon } = alertStyles[tone];
  return (
    <div className={cn("flex gap-3 rounded-control border p-4 text-sm", box, className)} {...props}>
      <span className="mt-0.5 shrink-0 [&_svg]:size-5" aria-hidden="true">
        {icon}
      </span>
      <div className="space-y-1">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className="leading-relaxed">{children}</div>}
      </div>
    </div>
  );
}

/* ---------- EmptyState: shown when there's nothing to display ---------- */
export function EmptyState({
  icon,
  title,
  children,
  action,
  className,
}: {
  icon: ReactNode;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-card border border-dashed border-ink-200 bg-ink-50 px-6 py-14 text-center",
        className,
      )}
    >
      <div className="mb-4 grid size-14 place-items-center rounded-full bg-white text-brand-600 shadow-card [&_svg]:size-6" aria-hidden="true">
        {icon}
      </div>
      <h2 className="font-display text-xl font-semibold text-ink-900">{title}</h2>
      {children && <div className="mt-2 max-w-md text-ink-600">{children}</div>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/* ---------- Eyebrow + section heading ---------- */
export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow && <p className="mb-2 text-sm font-semibold tracking-wide text-brand-600 uppercase">{eyebrow}</p>}
      <Heading className="font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">{title}</Heading>
      {description && <p className="mt-3 text-lg text-ink-600">{description}</p>}
    </div>
  );
}
