import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { NAV_LINKS, SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = NAV_LINKS.map((l) => ({ url: `${SITE.url}${l.href === "/" ? "" : l.href}` }));
  try {
    const [races, articles] = await Promise.all([
      prisma.race.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.article.findMany({ select: { slug: true, publishedAt: true } }),
    ]);
    return [
      ...pages,
      ...races.map((r) => ({ url: `${SITE.url}/races/${r.slug}`, lastModified: r.updatedAt })),
      ...articles.map((a) => ({ url: `${SITE.url}/news/${a.slug}`, lastModified: a.publishedAt })),
    ];
  } catch {
    return pages;
  }
}
