import Image from "next/image";
import Link from "next/link";
import { dateBadge, formatDateRange, ordinal } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { RaceSummary } from "@/lib/types";
import { SeriesBadge, StatusBadge } from "@/components/ui/Badge";
import { ArrowRight, PinIcon, TrophyIcon } from "@/components/ui/Icons";

export function RaceCard({ race }: { race: RaceSummary }) {
  const badge = dateBadge(race.startDate, race.timeZone);
  const finish = race.teamBestFinish;
  return (
    <article
      className={cn(
        "group relative grid overflow-hidden border bg-graphite transition-[border-color,transform] duration-300 focus-within:border-apex-blue hover:-translate-y-0.5 hover:border-line-strong sm:grid-cols-[6.5rem_minmax(0,1fr)] md:grid-cols-[6.5rem_minmax(0,1fr)_14rem]",
        race.status === "live" ? "border-danger/60" : "border-line",
      )}
    >
      <div className="flex items-center gap-3 border-b border-line bg-carbon/60 px-4 py-3 sm:flex-col sm:justify-center sm:gap-0 sm:border-b-0 sm:border-r sm:px-2 sm:py-5">
        <span className="font-mono text-3xl font-bold leading-none text-chalk sm:text-4xl">{badge.day}</span>
        <span className="label-tech text-apex-blue sm:mt-1">{badge.month}</span>
        <span className="label-tech text-[0.6rem] text-steel sm:mt-1">{badge.year}</span>
      </div>
      <div className="min-w-0 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <SeriesBadge series={race.series} />
          <StatusBadge status={race.status} />
          <span className="label-tech text-[0.62rem] text-steel">Rd {race.round} · {race.durationLabel}</span>
        </div>
        <h3 className="mt-3 font-display text-xl font-bold uppercase leading-tight sm:text-2xl">
          <Link href={`/races/${race.slug}`} className="outline-none after:absolute after:inset-0 after:content-[''] hover:text-apex-blue">
            {race.name} <span className="text-steel">{race.season}</span>
          </Link>
        </h3>
        <p className="mt-2 flex items-start gap-1.5 text-sm text-steel">
          <PinIcon size={16} className="mt-0.5 shrink-0" />
          <span>
            {race.circuitName} · {race.country}
          </span>
        </p>
        <p className="label-tech mt-2 text-[0.64rem] text-steel">{formatDateRange(race.startDate, race.endDate, race.timeZone)} · track time</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          {finish ? (
            <p className="label-tech inline-flex items-center gap-2 text-[0.66rem] text-chalk">
              <TrophyIcon size={16} className={finish.position <= 3 && finish.status === "CLASSIFIED" ? "text-apex-orange" : "text-steel"} />
              Best AVR finish: {finish.status === "CLASSIFIED" ? `${ordinal(finish.position)} (#${finish.carNumber})` : "DNF"}
              <span className="text-steel">· sample</span>
            </p>
          ) : (
            <p className="label-tech text-[0.66rem] text-steel">{race.status === "completed" ? "Results pending" : race.summary}</p>
          )}
          <span className="label-tech inline-flex items-center gap-1.5 text-apex-orange" aria-hidden="true">
            Details <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
      <div className="relative hidden md:block">
        <Image src={race.heroImage} alt="" fill sizes="224px" className="object-cover opacity-80 transition-opacity group-hover:opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-r from-graphite to-transparent" aria-hidden="true" />
      </div>
    </article>
  );
}

export function RaceCardSkeleton() {
  return (
    <div className="grid border border-line bg-graphite sm:grid-cols-[6.5rem_minmax(0,1fr)] md:grid-cols-[6.5rem_minmax(0,1fr)_14rem]" aria-hidden="true">
      <div className="flex gap-3 border-b border-line p-4 sm:flex-col sm:items-center sm:border-b-0 sm:border-r">
        <div className="skeleton h-9 w-12" />
        <div className="skeleton h-3 w-10" />
      </div>
      <div className="space-y-3 p-5">
        <div className="flex gap-2">
          <div className="skeleton h-6 w-16" />
          <div className="skeleton h-6 w-20" />
        </div>
        <div className="skeleton h-6 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-3 w-1/3" />
      </div>
      <div className="skeleton hidden md:block" />
    </div>
  );
}
