import { locations } from "@/data/locations";

/* GET /api/locations: every Northstar facility as JSON. */
export async function GET() {
  return Response.json({ count: locations.length, results: locations });
}
