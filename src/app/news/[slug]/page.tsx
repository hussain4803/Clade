import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { parseArticleBody } from "@/lib/article-body";
import { formatLongDate } from "@/lib/format";
import { getArticle } from "@/lib/news";
import { NEWS_CATEGORY_LABELS } from "@/lib/site";
import { ArticleCard } from "@/components/news/ArticleCard";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowLeft, InfoIcon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Article not found" };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: { type: "article", publishedTime: article.publishedAt, images: [{ url: article.coverImage, alt: article.coverAlt }] },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();
  const blocks = parseArticleBody(article.body);

  return (
    <>
      <article aria-labelledby="article-title">
        <header className="relative overflow-hidden border-b border-line">
          <div className="bg-grid absolute inset-0 -z-10 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden="true" />
          <Container className="max-w-5xl py-10 sm:py-14">
            <nav aria-label="Breadcrumb">
              <ol className="label-tech flex flex-wrap items-center gap-2 text-steel">
                <li>
                  <Link href="/news" className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-chalk">
                    <ArrowLeft size={16} /> All news
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href={`/news?category=${article.category}`} className="inline-flex min-h-11 items-center transition-colors hover:text-chalk">
                    {NEWS_CATEGORY_LABELS[article.category]}
                  </Link>
                </li>
              </ol>
            </nav>
            <div className="animate-fade-up">
              <p className="label-tech mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-steel">
                <span className="text-apex-blue">{NEWS_CATEGORY_LABELS[article.category]}</span>
                <span aria-hidden="true">·</span>
                <time dateTime={article.publishedAt}>{formatLongDate(article.publishedAt)}</time>
                <span aria-hidden="true">·</span>
                <span>{article.readMinutes} min read</span>
              </p>
              <h1 id="article-title" className="mt-4 text-display-md font-bold uppercase">
                {article.title}
              </h1>
              <p className="mt-5 text-lead text-steel">{article.excerpt}</p>
              <p className="mt-6 text-sm">
                <span className="text-chalk">{article.author}</span> <span className="text-steel">· {article.authorRole}</span>
              </p>
            </div>
          </Container>
        </header>

        <Container className="max-w-5xl">
          <div className="relative -mt-px aspect-[16/9] overflow-hidden border-x border-b border-line">
            <Image src={article.coverImage} alt={article.coverAlt} fill priority sizes="(min-width: 1024px) 1024px, 100vw" className="object-cover" />
            <span className="label-tech absolute bottom-3 left-3 bg-carbon/80 px-2 py-1 text-[0.58rem] text-steel">Illustration</span>
          </div>
        </Container>

        <Container className="max-w-3xl py-12 sm:py-16">
          <aside className="mb-10 flex items-start gap-3 border border-dashed border-apex-orange/60 bg-apex-orange/5 p-4 text-sm text-chalk" aria-label="Sample content notice">
            <InfoIcon size={20} className="mt-0.5 shrink-0 text-apex-orange" />
            <p>
              <strong className="font-semibold">Sample content.</strong> This article is fictional and was written for this demo site. People, quotes and results are invented.
            </p>
          </aside>
          <div className="space-y-6 text-[1.0625rem] leading-[1.8] text-chalk/90">
            {blocks.map((b, i) => {
              switch (b.type) {
                case "heading":
                  return (
                    <h2 key={i} className="pt-4 font-display text-2xl font-bold uppercase text-chalk">
                      {b.text}
                    </h2>
                  );
                case "quote":
                  return (
                    <figure key={i} className="my-8 border-l-4 border-apex-orange bg-graphite px-6 py-5">
                      <blockquote className="font-display text-xl font-medium leading-snug text-chalk">“{b.text}”</blockquote>
                      {b.cite && <figcaption className="label-tech mt-3 text-steel">— {b.cite}</figcaption>}
                    </figure>
                  );
                case "list":
                  return (
                    <ul key={i} className="space-y-2 border border-line bg-graphite/60 p-5">
                      {b.items.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-2.5 size-1.5 shrink-0 rotate-45 bg-apex-blue" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  );
                default:
                  return <p key={i}>{b.text}</p>;
              }
            })}
          </div>
          {article.tags.length > 0 && (
            <ul className="mt-10 flex flex-wrap gap-2" aria-label="Tags">
              {article.tags.map((t) => (
                <li key={t}>
                  <Link href={`/news?q=${encodeURIComponent(t)}`} className="label-tech inline-flex min-h-10 items-center border border-line px-3 text-steel transition-colors hover:border-apex-blue hover:text-chalk">
                    #{t}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-10">
            <ButtonLink href="/news" variant="secondary">
              Back to all news
            </ButtonLink>
          </div>
        </Container>
      </article>

      {article.related.length > 0 && (
        <section aria-labelledby="related-title" className="border-t border-line py-16">
          <Container>
            <h2 id="related-title" className="font-display text-display-sm font-bold uppercase">
              Keep reading
            </h2>
            <ul className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {article.related.map((a, i) => (
                <Reveal as="li" key={a.id} delay={i * 80}>
                  <ArticleCard article={a} />
                </Reveal>
              ))}
            </ul>
          </Container>
        </section>
      )}
    </>
  );
}
