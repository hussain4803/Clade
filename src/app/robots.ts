import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Demo site: discourage indexing of fictional content.
  return { rules: [{ userAgent: "*", disallow: "/" }], sitemap: `${SITE.url}/sitemap.xml` };
}
