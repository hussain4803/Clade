import type { NextRequest } from "next/server";
import { jsonOk, serverError, validationError } from "@/lib/api";
import { listArticles } from "@/lib/news";
import { NEWS_CATEGORIES } from "@/lib/site";
import { newsQuerySchema, searchParamsToObject } from "@/lib/validation";

export const dynamic = "force-dynamic";

/** GET /api/news?q=&category=&page=&pageSize= */
export async function GET(request: NextRequest) {
  const parsed = newsQuerySchema.safeParse(searchParamsToObject(request.nextUrl.searchParams));
  if (!parsed.success) return validationError(parsed.error, "Invalid news query.");

  try {
    const { items, pagination } = await listArticles(parsed.data);
    return jsonOk(items, {
      meta: {
        ...pagination,
        q: parsed.data.q ?? null,
        category: parsed.data.category ?? null,
        categories: NEWS_CATEGORIES,
        sampleContent: true,
      },
    });
  } catch (err) {
    return serverError(err, "GET /api/news");
  }
}
