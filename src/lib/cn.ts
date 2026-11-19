/**
 * cn ("class names") joins Tailwind class strings and skips empty values.
 *
 *   cn("px-4", isActive && "bg-brand-600", undefined)  ->  "px-4 bg-brand-600"
 *
 * It lets components accept an optional `className` prop and combine it
 * with their own default classes.
 */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
