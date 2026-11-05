import type { Metadata } from "next";
import { formatDateRange, formatTime, formatZone } from "@/lib/format";
import { getNextRace, getSeasons, listRaces } from "@/lib/races";
import { raceQuerySchema, searchParamsToObject } from "@/lib/validation";
import { Countdown } from "@/components/races/Countdown";
import { RaceExplorer, type RaceFilters } from "@/components/races/RaceExplorer";
import { SampleBadge, SeriesBadge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Races",
  description: "Race calendar, session schedules and sample results for Apex Velocita Racing — Le Mans, Daytona, Sebring and more.",
};

export const dynamic = "force-dynamic";

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function RacesPage({ searchParams }: PageProps) {
  const raw = searchParamsToObject(await searchParams);
  const parsed = raceQuerySchema.safeParse(raw);
  const query = parsed.success ? parsed.data : raceQuerySchema.parse({});
  const now = new Date();
  const [races, seasons, nextRace] = await Promise.all([listRaces(query, now), getSeasons(), getNextRace(now)]);

  const initialFilters: RaceFilters = {
    series: query.series?.length === 1 ? query.series[0]! : "",
    status: query.status ?? "",
    season: query.season ? String(query.season) : "",
    from: query.from?.slice(0, 10) ?? "",
    to: query.to?.slice(0, 10) ?? "",
    sort: query.sort,
  };

  return (
    <>
      <PageHero
        eyebrow="Race calendar"
        title={
          <>
            The long-distance <span className="text-apex-orange">season</span>
          </>
        }
        description={
          <p>
            From the Daytona banking to the Circuit de la Sarthe. Filter the calendar by series, status and date, then open any event for its circuit guide, session schedule and results.
          </p>
        }
        aside={
          nextRace ? (
            <div className="chamfer border border-line bg-graphite/90 p-5 backdrop-blur sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="label-tech text-apex-orange">{nextRace.status === "live" ? "Live now" : "Next race"}</p>
                <SeriesBadge series={nextRace.series} />
              </div>
              <h2 className="mt-3 font-display text-2xl font-bold uppercase">{nextRace.name}</h2>
              <p className="label-tech mt-1 text-[0.64rem] text-steel">
                {formatDateRange(nextRace.startDate, nextRace.endDate, nextRace.timeZone)} · {formatTime(nextRace.startDate, nextRace.timeZone)}{" "}
                {formatZone(nextRace.startDate, nextRace.timeZone)}
              </p>
              <Countdown
                className="mt-5"
                startIso={nextRace.startDate}
                endIso={nextRace.endDate}
                initialNow={now.getTime()}
                size="md"
                description={`${nextRace.name} starts ${formatDateRange(nextRace.startDate, nextRace.endDate, nextRace.timeZone)}.`}
              />
              <ButtonLink href={`/races/${nextRace.slug}`} variant="blue" size="sm" className="mt-5 w-full">
                Race details
              </ButtonLink>
            </div>
          ) : undefined
        }
      >
        <div className="mt-6">
          <SampleBadge label="Dates & results are sample data" />
        </div>
      </PageHero>

      <section aria-labelledby="calendar-title" className="py-14 sm:py-16">
        <Container>
          <h2 id="calendar-title" className="sr-only">
            Filterable race list
          </h2>
          {!parsed.success && (
            <p className="mb-4 border border-apex-orange/40 bg-apex-orange/10 p-3 text-sm text-apex-orange" role="status">
              Some filters in the link were invalid and have been reset.
            </p>
          )}
          <RaceExplorer initialRaces={races} initialFilters={initialFilters} seasons={seasons} />
        </Container>
      </section>
    </>
  );
}
