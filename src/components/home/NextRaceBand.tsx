import Link from "next/link";
import { formatDateRange, formatTime, formatZone } from "@/lib/format";
import type { RaceSummary } from "@/lib/types";
import { Countdown } from "@/components/races/Countdown";
import { SeriesBadge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { CalendarIcon, PinIcon } from "@/components/ui/Icons";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export function NextRaceBand({ race, now }: { race: RaceSummary | null; now: number }) {
  return (
    <section aria-labelledby="next-race-title" className="relative py-16 sm:py-20">
      <Container>
        <Reveal className="chamfer relative overflow-hidden border border-line bg-graphite">
          <div className="bg-grid-fine absolute inset-0 opacity-60" aria-hidden="true" />
          <div className="stripe-diagonal absolute right-0 top-0 h-full w-24 opacity-15" aria-hidden="true" />
          <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center">
            {race ? (
              <>
                <div>
                  <p className="label-tech flex items-center gap-3 text-apex-orange">
                    <span className="h-px w-8 bg-apex-orange" aria-hidden="true" />
                    {race.status === "live" ? "Racing now" : "Next race"}
                  </p>
                  <h2 id="next-race-title" className="mt-4 text-display-md font-bold uppercase">
                    {race.name}
                  </h2>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <SeriesBadge series={race.series} />
                    <span className="label-tech text-steel">Round {race.round}</span>
                    <span className="label-tech text-steel">{race.durationLabel}</span>
                  </div>
                  <ul className="mt-6 space-y-2 text-sm text-steel">
                    <li className="flex items-start gap-2">
                      <PinIcon size={18} className="mt-0.5 shrink-0 text-apex-blue" />
                      <span>
                        {race.circuitName} · {race.city}, {race.country}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CalendarIcon size={18} className="mt-0.5 shrink-0 text-apex-blue" />
                      <span>
                        {formatDateRange(race.startDate, race.endDate, race.timeZone)} · Start {formatTime(race.startDate, race.timeZone)}{" "}
                        {formatZone(race.startDate, race.timeZone)} (track time)
                      </span>
                    </li>
                  </ul>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <ButtonLink href={`/races/${race.slug}`} variant="blue">
                      Race details
                    </ButtonLink>
                    <ButtonLink href="/races" variant="secondary">
                      View Race Calendar
                    </ButtonLink>
                  </div>
                </div>
                <Countdown
                  startIso={race.startDate}
                  endIso={race.endDate}
                  initialNow={now}
                  size="xl"
                  description={`${race.name} starts ${formatDateRange(race.startDate, race.endDate, race.timeZone)} at ${formatTime(race.startDate, race.timeZone)} track time.`}
                />
              </>
            ) : (
              <div>
                <h2 id="next-race-title" className="text-display-md font-bold uppercase">
                  Season complete
                </h2>
                <p className="mt-3 text-steel">The next calendar will be announced soon. Browse past results in the meantime.</p>
                <Link href="/races?status=completed" className="label-tech mt-6 inline-flex min-h-11 items-center text-apex-blue">
                  Results archive →
                </Link>
              </div>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
