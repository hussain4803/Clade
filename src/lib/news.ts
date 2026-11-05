import type { Article, Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import type { NewsCategory } from "./site";
import type { ArticleDetail, ArticleSummary, Pagination } from "./types";
import type { NewsQuery } from "./validation";

export function toArticleSummary(a: Article): ArticleSummary {
  return {
    id: a.id,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    category: a.category as NewsCategory,
    tags: a.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    author: a.author,
    coverImage: a.coverImage,
    coverAlt: a.coverAlt,
    readMinutes: a.readMinutes,
    featured: a.featured,
    publishedAt: a.publishedAt.toISOString(),
  };
}

export function buildNewsWhere(query: Partial<NewsQuery>): Prisma.ArticleWhereInput {
  const and: Prisma.ArticleWhereInput[] = [];
  if (query.category) and.push({ category: query.category });
  const terms = (query.q ?? "").split(/\s+/).filter(Boolean).slice(0, 6);
  // Every term must match at least one text field (SQLite LIKE is case-insensitive for ASCII).
  for (const term of terms) {
    and.push({
      OR: [
        { title: { contains: term } },
        { excerpt: { contains: term } },
        { body: { contains: term } },
        { tags: { contains: term } },
        { author: { contains: term } },
      ],
    });
  }
  return and.length ? { AND: and } : {};
}

export async function listArticles(
  query: Partial<NewsQuery> = {},
): Promise<{ items: ArticleSummary[]; pagination: Pagination }> {
  const pageSize = query.pageSize ?? 6;
  const where = buildNewsWhere(query);
  const total = await prisma.article.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, query.page ?? 1), totalPages);
  const rows = await prisma.article.findMany({
    where,
    orderBy: [{ publishedAt: "desc" }, { id: "asc" }],
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
  return { items: rows.map(toArticleSummary), pagination: { page, pageSize, total, totalPages } };
}

export async function getLatestArticles(count = 3): Promise<ArticleSummary[]> {
  const rows = await prisma.article.findMany({ orderBy: { publishedAt: "desc" }, take: count });
  return rows.map(toArticleSummary);
}

/** Finds an article by id or slug, with up to three related stories. */
export async function getArticle(idOrSlug: string): Promise<ArticleDetail | null> {
  const article = await prisma.article.findFirst({ where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] } });
  if (!article) return null;

  const sameCategory = await prisma.article.findMany({
    where: { category: article.category, id: { not: article.id } },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });
  let related = sameCategory;
  if (related.length < 3) {
    const fill = await prisma.article.findMany({
      where: { id: { notIn: [article.id, ...related.map((r) => r.id)] } },
      orderBy: { publishedAt: "desc" },
      take: 3 - related.length,
    });
    related = [...related, ...fill];
  }

  return {
    ...toArticleSummary(article),
    body: article.body,
    authorRole: article.authorRole,
    related: related.map(toArticleSummary),
  };
}
