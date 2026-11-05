"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { NEWS_CATEGORIES, NEWS_CATEGORY_LABELS, NEWS_PAGE_SIZE, type NewsCategory } from "@/lib/site";
import type { ArticleSummary, Pagination } from "@/lib/types";
import { inputClasses } from "@/components/forms/fields";
import { Button } from "@/components/ui/Button";
import { AlertIcon, ChevronLeft, ChevronRight, CloseIcon, SearchIcon } from "@/components/ui/Icons";
import { ArticleCard, ArticleCardSkeleton } from "./ArticleCard";

export type NewsFilters = { q: string; category: NewsCategory | ""; page: number };

function toQuery(f: NewsFilters): string {
  const p = new URLSearchParams();
  if (f.q.trim()) p.set("q", f.q.trim());
  if (f.category) p.set("category", f.category);
  if (f.page > 1) p.set("page", String(f.page));
  return p.toString();
}

type Data = { items: ArticleSummary[]; pagination: Pagination };
type Loaded = { key: string; data: Data; error?: string };

/** Builds a compact page list such as [1, "…", 4, 5, 6, "…", 9]. */
function pageList(page: number, total: number): Array<number | "gap"> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, page - 1, page, page + 1].filter((n) => n >= 1 && n <= total));
  const sorted = [...set].sort((a, b) => a - b);
  const out: Array<number | "gap"> = [];
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1]! > 1) out.push("gap");
    out.push(n);
  });
  return out;
}

export function NewsExplorer({ initial, initialFilters }: { initial: Data; initialFilters: NewsFilters }) {
  const [filters, setFilters] = useState<NewsFilters>(initialFilters);
  const [searchInput, setSearchInput] = useState(initialFilters.q);
  const [attempt, setAttempt] = useState(0);
  const query = useMemo(() => toQuery(filters), [filters]);
  const requestKey = `${query}#${attempt}`;
  const [loaded, setLoaded] = useState<Loaded>(() => ({ key: requestKey, data: initial }));
  const resultsRef = useRef<HTMLDivElement>(null);

  // Debounce typing into the search box.
  useEffect(() => {
    const handle = window.setTimeout(() => {
      setFilters((f) => (f.q === searchInput ? f : { ...f, q: searchInput, page: 1 }));
    }, 300);
    return () => window.clearTimeout(handle);
  }, [searchInput]);

  // Keep the address bar shareable without triggering a navigation or full reload.
  useEffect(() => {
    const target = query ? `/news?${query}` : "/news";
    if (window.location.pathname + window.location.search !== target) window.history.replaceState(null, "", target);
  }, [query]);

  useEffect(() => {
    if (loaded.key === requestKey) return;
    const controller = new AbortController();

    const apiQuery = new URLSearchParams(query);
    apiQuery.set("pageSize", String(NEWS_PAGE_SIZE));
    fetch(`/api/news?${apiQuery.toString()}`, { signal: controller.signal, headers: { Accept: "application/json" } })
      .then(async (res) => {
        const json = (await res.json().catch(() => null)) as {
          success?: boolean;
          data?: ArticleSummary[];
          meta?: Pagination;
          error?: { message?: string };
        } | null;
        if (!res.ok || !json?.success || !json.data || !json.meta) throw new Error(json?.error?.message ?? `Request failed (${res.status})`);
        setLoaded({ key: requestKey, data: { items: json.data, pagination: json.meta } });
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setLoaded((prev) => ({ key: requestKey, data: prev.data, error: err instanceof Error ? err.message : "Could not load news." }));
      });
    return () => controller.abort();
    // loaded.key is intentionally read without being a dependency: it only guards against refetching.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey, query]);

  const goToPage = (page: number) => {
    setFilters((f) => ({ ...f, page }));
    resultsRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  };

  const setCategory = (category: NewsFilters["category"]) => setFilters((f) => ({ ...f, category, page: 1 }));
  const clearAll = () => {
    setSearchInput("");
    setFilters({ q: "", category: "", page: 1 });
  };

  const { items, pagination } = loaded.data;
  const loading = loaded.key !== requestKey;
  const error = !loading ? loaded.error : undefined;
  const hasFilters = !!(filters.q || filters.category);

  return (
    <div>
      <form
        role="search"
        aria-label="Search news"
        className="grid gap-5 border border-line bg-graphite p-4 sm:p-6"
        onSubmit={(e) => {
          e.preventDefault();
          setFilters((f) => ({ ...f, q: searchInput, page: 1 }));
        }}
      >
        <div>
          <label htmlFor="news-search" className="label-tech mb-2 block text-steel">
            Search articles
          </label>
          <div className="relative">
            <SearchIcon size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-steel" />
            <input
              id="news-search"
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Try “Le Mans”, “hybrid” or a driver name"
              maxLength={100}
              autoComplete="off"
              className={cn(inputClasses, "border-line-strong pl-12 pr-12 [&::-webkit-search-cancel-button]:hidden")}
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                aria-label="Clear search"
                className="absolute right-1 top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center text-steel hover:text-chalk"
              >
                <CloseIcon size={18} />
              </button>
            )}
          </div>
        </div>
        <fieldset>
          <legend className="label-tech mb-2 text-steel">Category</legend>
          <div className="flex flex-wrap gap-2">
            {(["", ...NEWS_CATEGORIES] as const).map((c) => {
              const pressed = filters.category === c;
              return (
                <button
                  key={c || "all"}
                  type="button"
                  aria-pressed={pressed}
                  onClick={() => setCategory(c)}
                  className={cn(
                    "label-tech min-h-11 border px-3.5 transition-colors sm:px-4",
                    pressed ? "border-apex-blue bg-apex-blue text-carbon" : "border-line text-steel hover:border-line-strong hover:text-chalk",
                  )}
                >
                  {c ? NEWS_CATEGORY_LABELS[c] : "All"}
                </button>
              );
            })}
          </div>
        </fieldset>
      </form>

      <div ref={resultsRef} className="scroll-mt-24">
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="label-tech text-steel" role="status" aria-live="polite">
            {loading
              ? "Searching…"
              : `${pagination.total} article${pagination.total === 1 ? "" : "s"}${filters.q ? ` matching “${filters.q}”` : ""}${
                  pagination.total ? ` · page ${pagination.page} of ${pagination.totalPages}` : ""
                }`}
          </p>
          <Button variant="ghost" size="sm" onClick={clearAll} disabled={!hasFilters}>
            Clear filters
          </Button>
        </div>

        {error && (
          <div className="mt-6 flex flex-col gap-3 border border-danger/40 bg-danger/10 p-4 text-sm text-[#ff9a9a] sm:flex-row sm:items-center sm:justify-between" role="alert">
            <p className="flex items-center gap-2">
              <AlertIcon size={18} /> Couldn&apos;t load articles: {error}
            </p>
            <Button variant="secondary" size="sm" onClick={() => setAttempt((a) => a + 1)}>
              Retry
            </Button>
          </div>
        )}

        <div className="mt-6" aria-busy={loading}>
          {loading ? (
            <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: NEWS_PAGE_SIZE }, (_, i) => (
                <li key={i}>
                  <ArticleCardSkeleton />
                </li>
              ))}
            </ul>
          ) : items.length ? (
            <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {items.map((a, i) => (
                <li key={a.id}>
                  <ArticleCard article={a} priority={i < 2} headingLevel="h2" />
                </li>
              ))}
            </ul>
          ) : (
            <div className="border border-dashed border-line-strong p-10 text-center">
              <p className="font-display text-xl font-semibold">No articles found</p>
              <p className="mt-2 text-sm text-steel">Try another search term or category.</p>
              <Button variant="secondary" size="sm" className="mt-5" onClick={clearAll}>
                Show all news
              </Button>
            </div>
          )}
        </div>

        {pagination.totalPages > 1 && (
          <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => goToPage(pagination.page - 1)}
              disabled={pagination.page <= 1 || loading}
              className="label-tech inline-flex min-h-11 items-center gap-1 border border-line px-3 text-steel transition-colors hover:border-line-strong hover:text-chalk disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={16} /> Prev
            </button>
            <ul className="flex flex-wrap items-center gap-2">
              {pageList(pagination.page, pagination.totalPages).map((p, i) =>
                p === "gap" ? (
                  <li key={`gap-${i}`} className="px-1 text-steel" aria-hidden="true">
                    …
                  </li>
                ) : (
                  <li key={p}>
                    <button
                      type="button"
                      onClick={() => goToPage(p)}
                      disabled={loading}
                      aria-current={p === pagination.page ? "page" : undefined}
                      aria-label={`Page ${p}`}
                      className={cn(
                        "inline-flex size-11 items-center justify-center border font-mono text-sm transition-colors",
                        p === pagination.page ? "border-apex-orange bg-apex-orange text-carbon" : "border-line text-steel hover:border-line-strong hover:text-chalk",
                      )}
                    >
                      {p}
                    </button>
                  </li>
                ),
              )}
            </ul>
            <button
              type="button"
              onClick={() => goToPage(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages || loading}
              className="label-tech inline-flex min-h-11 items-center gap-1 border border-line px-3 text-steel transition-colors hover:border-line-strong hover:text-chalk disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next <ChevronRight size={16} />
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
