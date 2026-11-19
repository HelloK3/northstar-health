import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/primitives";

type Crumb = { href?: string; label: string };

/** Breadcrumbs: a "you are here" trail. The current page has aria-current="page". */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-ink-600">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="size-4 text-ink-300" aria-hidden="true" />}
            {item.href ? (
              <Link href={item.href} className="hover:text-brand-700 hover:underline">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-ink-800">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** The title band at the top of inner pages. */
export function PageHeader({
  title,
  description,
  crumbs,
  children,
}: {
  title: ReactNode;
  description?: ReactNode;
  crumbs?: Crumb[];
  children?: ReactNode;
}) {
  return (
    <div className="border-b border-ink-100 bg-ink-50">
      <Container className="py-8 sm:py-10">
        {crumbs && <Breadcrumbs items={crumbs} />}
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-lg text-ink-600">{description}</p>}
        {children}
      </Container>
    </div>
  );
}
