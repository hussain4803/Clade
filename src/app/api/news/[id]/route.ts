import { jsonError, jsonOk, serverError } from "@/lib/api";
import { getArticle } from "@/lib/news";

export const dynamic = "force-dynamic";

/** GET /api/news/:id — accepts an article id or slug. */
export async function GET(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!id || id.length > 160) return jsonError(400, "INVALID_ID", "A valid article id or slug is required.");
  try {
    const article = await getArticle(decodeURIComponent(id));
    if (!article) return jsonError(404, "NOT_FOUND", `No article found for "${id}".`);
    return jsonOk(article, { meta: { sampleContent: true } });
  } catch (err) {
    return serverError(err, "GET /api/news/[id]");
  }
}
