/*
 * Formatting helpers built on the browser's built-in Intl API, which
 * handles locale-aware dates without a library.
 *
 * Dates are stored as "YYYY-MM-DD" strings. We build the Date from its parts
 * so it isn't shifted by time zones (new Date("2026-03-04") is read as UTC
 * midnight, which can show as the previous day in the US).
 */

function parseISODate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatLongDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(parseISODate(iso));
}

export function formatDayParts(iso: string) {
  const date = parseISODate(iso);
  return {
    weekday: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date),
    month: new Intl.DateTimeFormat("en-US", { month: "short" }).format(date),
    day: date.getDate(),
    full: new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(date),
  };
}

export function formatPhoneHref(phone: string) {
  return `tel:+1${phone.replace(/\D/g, "")}`;
}

export function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}
