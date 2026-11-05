import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";
import { NEWS_CATEGORY_LABELS } from "@/lib/site";
import type { ArticleSummary } from "@/lib/types";
import { ArrowRight } from "@/components/ui/Icons";

export function ArticleCard({ article, priority = false, className, headingLevel = "h3" }: { article: ArticleSummary; priority?: boolean; className?: string; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  const href = `/news/${article.slug}`;
  return (
    <article className={cn("group relative flex h-full flex-col border border-line bg-graphite transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-line-strong", className)}>
      <div className="relative aspect-[16/9] overflow-hidden bg-carbon">
        <Image
          src={article.coverImage}
          alt={article.coverAlt}
          fill
          priority={priority}
          sizes="(min-width: 1280px) 400px, (min-width: 768px) 45vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-graphite/80 to-transparent" aria-hidden="true" />
        <span className="label-tech absolute left-3 top-3 bg-carbon/85 px-2 py-1 text-apex-blue backdrop-blur">
          {NEWS_CATEGORY_LABELS[article.category]}
        </span>
        <span className="label-tech absolute right-3 top-3 border border-dashed border-apex-orange/60 bg-carbon/80 px-2 py-1 text-[0.6rem] text-apex-orange">
          Sample
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="label-tech flex flex-wrap items-center gap-x-3 gap-y-1 text-steel">
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
          <span aria-hidden="true">·</span>
          <span>{article.readMinutes} min read</span>
        </p>
        <H className="mt-3 font-display text-xl font-semibold leading-snug text-chalk">
          <Link href={href} className="outline-none transition-colors hover:text-apex-blue focus-visible:underline focus-visible:decoration-apex-blue focus-visible:underline-offset-4">
            {article.title}
          </Link>
        </H>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-steel">{article.excerpt}</p>
        <div className="mt-auto pt-5">
          <Link
            href={href}
            aria-label={`Read more: ${article.title}`}
            className="label-tech inline-flex min-h-11 items-center gap-2 text-apex-orange transition-colors hover:text-chalk"
          >
            Read More
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function ArticleCardSkeleton() {
  return (
    <div className="flex h-full flex-col border border-line bg-graphite" aria-hidden="true">
      <div className="skeleton aspect-[16/9]" />
      <div className="space-y-3 p-5 sm:p-6">
        <div className="skeleton h-3 w-1/3" />
        <div className="skeleton h-5 w-11/12" />
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-5/6" />
        <div className="skeleton mt-6 h-3 w-24" />
      </div>
    </div>
  );
}
