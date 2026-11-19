"use client";

/*
 * "use client" marks this as a Client Component: its JavaScript is sent to
 * the browser so it can respond to clicks (opening the mobile menu).
 * Components without it are Server Components and send only HTML, which is
 * faster. We only add "use client" where interactivity is needed.
 */

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/primitives";
import { Logo } from "./logo";

const nav = [
  { href: "/providers", label: "Find a doctor" },
  { href: "/locations", label: "Locations" },
  { href: "/#specialties", label: "Specialties" },
  { href: "/design-system", label: "Design system" },
];

export function SiteHeader() {
  // useState stores a value that, when changed, re-renders the component.
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close the menu with Escape and return focus to the toggle button,
  // so keyboard users never lose their place.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href="/" aria-label="Northstar Health home" className="rounded-md" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-md px-3 py-2 text-[0.9375rem] font-medium text-ink-700 hover:bg-ink-50 hover:text-ink-900"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ButtonLink href="/portal" variant="ghost" size="sm">
            Patient portal
          </ButtonLink>
          <ButtonLink href="/providers" size="sm">
            Book an appointment
          </ButtonLink>
        </div>

        {/* Mobile menu toggle */}
        <button
          ref={buttonRef}
          type="button"
          className="-mr-2 grid size-11 place-items-center rounded-md text-ink-800 hover:bg-ink-50 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </Container>

      {/* Mobile menu panel */}
      <div id="mobile-menu" hidden={!open} className="border-t border-ink-100 bg-white lg:hidden">
        <Container className="py-4">
          <nav aria-label="Mobile">
            <ul className="flex flex-col">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-3 text-base font-medium text-ink-800 hover:bg-ink-50"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-4 grid gap-2 border-t border-ink-100 pt-4 sm:grid-cols-2">
            <ButtonLink href="/portal" variant="secondary" onClick={() => setOpen(false)}>
              Patient portal
            </ButtonLink>
            <ButtonLink href="/providers" onClick={() => setOpen(false)}>
              Book an appointment
            </ButtonLink>
          </div>
        </Container>
      </div>
    </header>
  );
}
