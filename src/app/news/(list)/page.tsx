import type { Metadata } from "next";
import { listArticles } from "@/lib/news";
import { NEWS_PAGE_SIZE } from "@/lib/site";
import { newsQuerySchema, searchParamsToObject } from "@/lib/validation";
import { NewsExplorer, type NewsFilters } from "@/components/news/NewsExplorer";
import { SampleBadge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "News",
  description: "Race reports, technical features and paddock stories from Apex Velocita Racing. All articles are fictional sample content.",
};

export const dynamic = "force-dynamic";

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function NewsPage({ searchParams }: PageProps) {
  const parsed = newsQuerySchema.safeParse(searchParamsToObject(await searchParams));
  const query = parsed.success ? { ...parsed.data, pageSize: NEWS_PAGE_SIZE } : { page: 1, pageSize: NEWS_PAGE_SIZE };
  const { items, pagination } = await listArticles(query);
  const initialFilters: NewsFilters = {
    q: parsed.success ? (parsed.data.q ?? "") : "",
    category: parsed.success ? (parsed.data.category ?? "") : "",
    page: pagination.page,
  };

  return (
    <>
      <PageHero
        eyebrow="Paddock news"
        title={
          <>
            Stories from the <span className="text-apex-blue">pit lane</span>
          </>
        }
        description={<p>Race reports, technical deep-dives and behind-the-scenes features from a season of endurance racing.</p>}
      >
        <div className="mt-6">
          <SampleBadge label="All articles are sample content" />
        </div>
      </PageHero>
      <section aria-label="News articles" className="py-14 sm:py-16">
        <Container>
          {!parsed.success && (
            <p className="mb-4 border border-apex-orange/40 bg-apex-orange/10 p-3 text-sm text-apex-orange" role="status">
              Some search options in the link were invalid and have been reset.
            </p>
          )}
          <NewsExplorer initial={{ items, pagination }} initialFilters={initialFilters} />
        </Container>
      </section>
    </>
  );
}
