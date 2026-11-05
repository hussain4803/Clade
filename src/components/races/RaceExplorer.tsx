"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { RACE_STATUS_LABELS, RACE_STATUSES, SERIES, SERIES_LABELS, type RaceStatus, type Series } from "@/lib/site";
import type { RaceSummary } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { inputClasses } from "@/components/forms/fields";
import { AlertIcon } from "@/components/ui/Icons";
import { RaceCard, RaceCardSkeleton } from "./RaceCard";

export type RaceFilters = {
  series: Series | "";
  status: RaceStatus | "";
  season: string;
  from: string;
  to: string;
  sort: "date_asc" | "date_desc";
};

export const DEFAULT_RACE_FILTERS: RaceFilters = { series: "", status: "", season: "", from: "", to: "", sort: "date_asc" };

export function filtersToQuery(f: RaceFilters): string {
  const p = new URLSearchParams();
  if (f.series) p.set("series", f.series);
  if (f.status) p.set("status", f.status);
  if (f.season) p.set("season", f.season);
  if (f.from) p.set("from", f.from);
  if (f.to) p.set("to", f.to);
  if (f.sort !== "date_asc") p.set("sort", f.sort);
  return p.toString();
}

/** Result of the most recent completed request, tagged with the request key it answers. */
type Loaded = { key: string; races: RaceSummary[]; error?: string };

function Chip({ pressed, onClick, children, tone = "blue" }: { pressed: boolean; onClick: () => void; children: React.ReactNode; tone?: "blue" | "orange" }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "label-tech min-h-11 border px-3.5 transition-colors sm:px-4",
        pressed
          ? tone === "blue"
            ? "border-apex-blue bg-apex-blue text-carbon"
            : "border-apex-orange bg-apex-orange text-carbon"
          : "border-line text-steel hover:border-line-strong hover:text-chalk",
      )}
    >
      {children}
    </button>
  );
}

export function RaceExplorer({ initialRaces, initialFilters, seasons }: { initialRaces: RaceSummary[]; initialFilters: RaceFilters; seasons: number[] }) {
  const [filters, setFilters] = useState<RaceFilters>(initialFilters);
  const [attempt, setAttempt] = useState(0);
  const query = useMemo(() => filtersToQuery(filters), [filters]);
  const requestKey = `${query}#${attempt}`;
  const [loaded, setLoaded] = useState<Loaded>(() => ({ key: requestKey, races: initialRaces }));
  const dateError = filters.from && filters.to && filters.from > filters.to ? "“From” must be on or before “To”." : undefined;

  // Keep the address bar shareable without triggering a navigation or full reload.
  useEffect(() => {
    const target = query ? `/races?${query}` : "/races";
    if (window.location.pathname + window.location.search !== target) window.history.replaceState(null, "", target);
  }, [query]);

  useEffect(() => {
    // Initial results were rendered on the server; only fetch when filters change.
    if (dateError || loaded.key === requestKey) return;
    const controller = new AbortController();

    fetch(`/api/races${query ? `?${query}` : ""}`, { signal: controller.signal, headers: { Accept: "application/json" } })
      .then(async (res) => {
        const json = (await res.json().catch(() => null)) as { success?: boolean; data?: RaceSummary[]; error?: { message?: string } } | null;
        if (!res.ok || !json?.success || !json.data) throw new Error(json?.error?.message ?? `Request failed (${res.status})`);
        setLoaded({ key: requestKey, races: json.data });
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setLoaded((prev) => ({ key: requestKey, races: prev.races, error: err instanceof Error ? err.message : "Could not load races." }));
      });
    return () => controller.abort();
    // loaded.key is intentionally read without being a dependency: it only guards against refetching.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey, query, dateError]);

  const update = useCallback(<K extends keyof RaceFilters>(key: K, value: RaceFilters[K]) => setFilters((f) => ({ ...f, [key]: value })), []);
  const isDefault = query === "";
  const races = loaded.races;
  const loading = !dateError && loaded.key !== requestKey;
  const error = !loading ? loaded.error : undefined;

  return (
    <div>
      <form
        role="search"
        aria-label="Filter races"
        onSubmit={(e) => e.preventDefault()}
        className="grid gap-6 border border-line bg-graphite p-4 sm:p-6 lg:grid-cols-[auto_auto_minmax(0,1fr)]"
      >
        <fieldset>
          <legend className="label-tech mb-2 text-steel">Series</legend>
          <div className="flex flex-wrap gap-2">
            <Chip pressed={filters.series === ""} onClick={() => update("series", "")}>
              All
            </Chip>
            {SERIES.map((s) => (
              <Chip key={s} pressed={filters.series === s} onClick={() => update("series", s)}>
                <span>{s}</span>
                <span className="sr-only"> — {SERIES_LABELS[s]}</span>
              </Chip>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="label-tech mb-2 text-steel">Status</legend>
          <div className="flex flex-wrap gap-2">
            <Chip tone="orange" pressed={filters.status === ""} onClick={() => update("status", "")}>
              All
            </Chip>
            {RACE_STATUSES.map((s) => (
              <Chip tone="orange" key={s} pressed={filters.status === s} onClick={() => update("status", s)}>
                {RACE_STATUS_LABELS[s]}
              </Chip>
            ))}
          </div>
        </fieldset>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div>
            <label htmlFor="race-season" className="label-tech mb-2 block text-steel">
              Season
            </label>
            <select id="race-season" value={filters.season} onChange={(e) => update("season", e.target.value)} className={cn(inputClasses, "border-line-strong")}>
              <option value="">All</option>
              {seasons.map((s) => (
                <option key={s} value={String(s)}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="race-sort" className="label-tech mb-2 block text-steel">
              Sort
            </label>
            <select id="race-sort" value={filters.sort} onChange={(e) => update("sort", e.target.value as RaceFilters["sort"])} className={cn(inputClasses, "border-line-strong")}>
              <option value="date_asc">Earliest first</option>
              <option value="date_desc">Latest first</option>
            </select>
          </div>
          <div>
            <label htmlFor="race-from" className="label-tech mb-2 block text-steel">
              From
            </label>
            <input
              id="race-from"
              type="date"
              value={filters.from}
              max={filters.to || undefined}
              onChange={(e) => update("from", e.target.value)}
              aria-invalid={dateError ? true : undefined}
              aria-describedby={dateError ? "race-date-error" : undefined}
              className={cn(inputClasses, "border-line-strong [color-scheme:dark]")}
            />
          </div>
          <div>
            <label htmlFor="race-to" className="label-tech mb-2 block text-steel">
              To
            </label>
            <input
              id="race-to"
              type="date"
              value={filters.to}
              min={filters.from || undefined}
              onChange={(e) => update("to", e.target.value)}
              aria-invalid={dateError ? true : undefined}
              aria-describedby={dateError ? "race-date-error" : undefined}
              className={cn(inputClasses, "border-line-strong [color-scheme:dark]")}
            />
          </div>
          {dateError && (
            <p id="race-date-error" className="col-span-full flex items-center gap-1.5 text-sm text-[#ff8a8a]">
              <AlertIcon size={16} /> {dateError}
            </p>
          )}
        </div>
      </form>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="label-tech text-steel" role="status" aria-live="polite">
          {loading ? "Updating calendar…" : `${races.length} race${races.length === 1 ? "" : "s"} found`}
        </p>
        <Button variant="ghost" size="sm" disabled={isDefault} onClick={() => setFilters(DEFAULT_RACE_FILTERS)}>
          Reset filters
        </Button>
      </div>

      {error && (
        <div className="mt-6 flex flex-col gap-3 border border-danger/40 bg-danger/10 p-4 text-sm text-[#ff9a9a] sm:flex-row sm:items-center sm:justify-between" role="alert">
          <p className="flex items-center gap-2">
            <AlertIcon size={18} /> Couldn&apos;t update the calendar: {error}
          </p>
          <Button variant="secondary" size="sm" onClick={() => setAttempt((a) => a + 1)}>
            Retry
          </Button>
        </div>
      )}

      <div className="mt-6" aria-busy={loading}>
        {loading ? (
          <ul className="space-y-4">
            {Array.from({ length: Math.min(Math.max(races.length, 3), 5) }, (_, i) => (
              <li key={i}>
                <RaceCardSkeleton />
              </li>
            ))}
          </ul>
        ) : races.length ? (
          <ul className="space-y-4">
            {races.map((r) => (
              <li key={r.id}>
                <RaceCard race={r} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="border border-dashed border-line-strong p-10 text-center">
            <p className="font-display text-xl font-semibold">No races match these filters</p>
            <p className="mt-2 text-sm text-steel">Try a different series, status or date range.</p>
            <Button variant="secondary" size="sm" className="mt-5" onClick={() => setFilters(DEFAULT_RACE_FILTERS)}>
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
