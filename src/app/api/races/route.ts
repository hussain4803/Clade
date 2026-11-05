import type { NextRequest } from "next/server";
import { jsonOk, serverError, validationError } from "@/lib/api";
import { listRaces } from "@/lib/races";
import { raceQuerySchema, searchParamsToObject } from "@/lib/validation";

export const dynamic = "force-dynamic";

/**
 * GET /api/races
 * Query: series=WEC,IMSA · status=upcoming|live|completed · season=2027 · from/to=YYYY-MM-DD
 *        sort=date_asc|date_desc · limit=1..100
 */
export async function GET(request: NextRequest) {
  const parsed = raceQuerySchema.safeParse(searchParamsToObject(request.nextUrl.searchParams));
  if (!parsed.success) return validationError(parsed.error, "Invalid race filters.");

  try {
    const now = new Date();
    const races = await listRaces(parsed.data, now);
    return jsonOk(races, {
      meta: {
        count: races.length,
        filters: {
          series: parsed.data.series ?? null,
          status: parsed.data.status ?? null,
          season: parsed.data.season ?? null,
          from: parsed.data.from ?? null,
          to: parsed.data.to ?? null,
          sort: parsed.data.sort,
        },
        generatedAt: now.toISOString(),
      },
    });
  } catch (err) {
    return serverError(err, "GET /api/races");
  }
}
