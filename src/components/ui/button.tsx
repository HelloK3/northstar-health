import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/*
 * Button and ButtonLink share one set of styles.
 *
 * Accessibility rule of thumb:
 *   - Use <Button> when the click DOES something (submit, open, toggle).
 *   - Use <ButtonLink> when the click GOES somewhere (a new page).
 * Screen readers announce them differently, so picking the right element matters.
 */

type Variant = "primary" | "secondary" | "ghost" | "inverse";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-control font-semibold transition-colors " +
  "disabled:cursor-not-allowed disabled:opacity-60 [&_svg]:size-[1.1em] [&_svg]:shrink-0";

const variants: Record<Variant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800",
  secondary:
    "bg-white text-brand-700 ring-1 ring-inset ring-ink-200 hover:bg-brand-50 hover:ring-brand-200",
  ghost: "text-brand-700 hover:bg-brand-50",
  inverse: "bg-white text-brand-900 hover:bg-brand-50",
};

// Every size keeps a target of at least 40px tall. WCAG 2.2's minimum is 24px,
// but larger targets are friendlier, especially on touch screens.
const sizes: Record<Size, string> = {
  sm: "h-10 px-3.5 text-sm",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-13 px-6 text-base",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant; size?: Size };

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  // Default to type="button" so a button inside a form doesn't submit it by accident.
  return <button type={type} className={buttonStyles({ variant, size, className })} {...props} />;
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant; size?: Size };

export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonStyles({ variant, size, className })} {...props} />;
}
