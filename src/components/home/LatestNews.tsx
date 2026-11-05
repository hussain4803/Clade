import type { ArticleSummary } from "@/lib/types";
import { ArticleCard } from "@/components/news/ArticleCard";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function LatestNews({ articles }: { articles: ArticleSummary[] }) {
  return (
    <section aria-labelledby="news-title" className="py-20 sm:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            id="news-title"
            index="03"
            eyebrow="Paddock news"
            title="Latest from the garage"
            description={<p>Race reports, technical deep-dives and stories from the pit lane. All articles are fictional sample content.</p>}
            action={
              <ButtonLink href="/news" variant="secondary">
                All news
              </ButtonLink>
            }
          />
        </Reveal>
        {articles.length ? (
          <ul className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {articles.map((a, i) => (
              <Reveal as="li" key={a.id} delay={i * 90} className={i === 2 ? "md:col-span-2 xl:col-span-1" : undefined}>
                <ArticleCard article={a} />
              </Reveal>
            ))}
          </ul>
        ) : (
          <p className="mt-12 text-steel">No articles yet — check back after race week.</p>
        )}
      </Container>
    </section>
  );
}
