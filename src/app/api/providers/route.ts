import type { NextRequest } from "next/server";
import { parseFilters, searchProviders } from "@/lib/search";
import { simulateLatency } from "@/lib/latency";

/*
 * GET /api/providers?q=heart&specialty=cardiology&telehealth=1
 *
 * A "Route Handler" is a small backend endpoint inside a Next.js app.
 * The pages read data directly on the server, but these endpoints expose the
 * same data as JSON. That's how a mobile app or another team would use it,
 * and it's handy to open in the browser to see the raw data.
 */
export async function GET(request: NextRequest) {
  const filters = parseFilters(Object.fromEntries(request.nextUrl.searchParams));
  await simulateLatency(400);
  const results = searchProviders(filters);
  return Response.json({ count: results.length, filters, results });
}
