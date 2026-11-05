import { jsonError, jsonOk, serverError } from "@/lib/api";
import { getRace } from "@/lib/races";

export const dynamic = "force-dynamic";

/** GET /api/races/:id — accepts a race id or slug (e.g. le-mans-2027). */
export async function GET(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!id || id.length > 120) return jsonError(400, "INVALID_ID", "A valid race id or slug is required.");
  try {
    const race = await getRace(decodeURIComponent(id));
    if (!race) return jsonError(404, "NOT_FOUND", `No race found for "${id}".`);
    return jsonOk(race);
  } catch (err) {
    return serverError(err, "GET /api/races/[id]");
  }
}
