import { connection } from "next/server";
import { getProvider } from "@/data/providers";
import { getAvailability } from "@/lib/availability";
import { simulateLatency } from "@/lib/latency";

/*
 * GET /api/providers/:id/availability
 * Returns the next 10 weekdays of open appointment times for one provider.
 *
 * `await connection()` tells Next.js this response depends on the moment
 * of the request ("today"), so it must not be pre-built at deploy time.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const provider = getProvider(id);
  if (!provider) {
    return Response.json({ error: "Provider not found." }, { status: 404 });
  }
  await simulateLatency(650);
  return Response.json({ providerId: id, days: getAvailability(id, new Date()) });
}
