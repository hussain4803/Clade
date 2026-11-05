import type { Prisma, Race, RaceResult, RaceSession } from "@prisma/client";
import { prisma } from "./prisma";
import { getRaceStatus, raceStatusWhere } from "./race-status";
import type { Series } from "./site";
import type { RaceQuery } from "./validation";
import type { RaceDetail, RaceResultDTO, RaceSessionDTO, RaceSummary, TeamFinish } from "./types";

type RaceWithTeamResults = Race & { results: Pick<RaceResult, "carNumber" | "position" | "status">[] };

function bestFinish(results: RaceWithTeamResults["results"]): TeamFinish | null {
  const classified = results.filter((r) => r.status === "CLASSIFIED").sort((a, b) => a.position - b.position);
  const best = classified[0] ?? [...results].sort((a, b) => a.position - b.position)[0];
  return best ? { carNumber: best.carNumber, position: best.position, status: best.status } : null;
}

export function toRaceSummary(race: RaceWithTeamResults, now: Date): RaceSummary {
  return {
    id: race.id,
    slug: race.slug,
    name: race.name,
    shortName: race.shortName,
    series: race.series as Series,
    season: race.season,
    round: race.round,
    startDate: race.startDate.toISOString(),
    endDate: race.endDate.toISOString(),
    timeZone: race.timeZone,
    durationLabel: race.durationLabel,
    durationHours: race.durationHours,
    summary: race.summary,
    circuitName: race.circuitName,
    city: race.city,
    country: race.country,
    countryCode: race.countryCode,
    heroImage: race.heroImage,
    status: getRaceStatus(race.startDate, race.endDate, now),
    teamBestFinish: bestFinish(race.results),
  };
}

const teamResultsSelect = {
  where: { isTeamEntry: true },
  select: { carNumber: true, position: true, status: true },
} satisfies Prisma.Race$resultsArgs;

export function buildRaceWhere(query: Partial<RaceQuery>, now: Date): Prisma.RaceWhereInput {
  const and: Prisma.RaceWhereInput[] = [];
  if (query.series?.length) and.push({ series: { in: query.series } });
  if (query.status) and.push(raceStatusWhere(query.status, now));
  if (query.season) and.push({ season: query.season });
  if (query.from) and.push({ endDate: { gte: new Date(query.from) } });
  if (query.to) {
    // Treat a bare date as inclusive of that whole day.
    const to = /^\d{4}-\d{2}-\d{2}$/.test(query.to) ? new Date(`${query.to}T23:59:59.999Z`) : new Date(query.to);
    and.push({ startDate: { lte: to } });
  }
  return and.length ? { AND: and } : {};
}

export async function listRaces(query: Partial<RaceQuery> = {}, now: Date = new Date()): Promise<RaceSummary[]> {
  const races = await prisma.race.findMany({
    where: buildRaceWhere(query, now),
    orderBy: { startDate: query.sort === "date_desc" ? "desc" : "asc" },
    take: query.limit,
    include: { results: teamResultsSelect },
  });
  return races.map((r) => toRaceSummary(r, now));
}

/** The race currently running, or the next one to start. */
export async function getNextRace(now: Date = new Date()): Promise<RaceSummary | null> {
  const race = await prisma.race.findFirst({
    where: { endDate: { gte: now } },
    orderBy: { startDate: "asc" },
    include: { results: teamResultsSelect },
  });
  return race ? toRaceSummary(race, now) : null;
}

export async function getSeasons(): Promise<number[]> {
  const rows = await prisma.race.findMany({ distinct: ["season"], select: { season: true }, orderBy: { season: "asc" } });
  return rows.map((r) => r.season);
}

function toSession(s: RaceSession): RaceSessionDTO {
  return {
    id: s.id,
    name: s.name,
    kind: s.kind as RaceSessionDTO["kind"],
    startsAt: s.startsAt.toISOString(),
    endsAt: s.endsAt.toISOString(),
  };
}

function toResult(r: RaceResult): RaceResultDTO {
  return {
    position: r.position,
    carNumber: r.carNumber,
    team: r.team,
    drivers: r.drivers,
    laps: r.laps,
    gap: r.gap,
    bestLap: r.bestLap,
    status: r.status as RaceResultDTO["status"],
    isTeamEntry: r.isTeamEntry,
  };
}

/** Looks a race up by id or slug, including schedule, results and neighbours. */
export async function getRace(idOrSlug: string, now: Date = new Date()): Promise<RaceDetail | null> {
  const race = await prisma.race.findFirst({
    where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    include: {
      sessions: { orderBy: { order: "asc" } },
      results: { orderBy: { position: "asc" } },
    },
  });
  if (!race) return null;

  const [previous, next] = await Promise.all([
    prisma.race.findFirst({
      where: { startDate: { lt: race.startDate } },
      orderBy: { startDate: "desc" },
      select: { slug: true, shortName: true, season: true },
    }),
    prisma.race.findFirst({
      where: { startDate: { gt: race.startDate } },
      orderBy: { startDate: "asc" },
      select: { slug: true, shortName: true, season: true },
    }),
  ]);

  const summary = toRaceSummary(
    { ...race, results: race.results.filter((r) => r.isTeamEntry) },
    now,
  );

  return {
    ...summary,
    description: race.description,
    circuit: {
      name: race.circuitName,
      city: race.city,
      country: race.country,
      countryCode: race.countryCode,
      lengthKm: race.circuitLengthKm,
      turns: race.circuitTurns,
      note: race.circuitNote,
    },
    sessions: race.sessions.map(toSession),
    results: race.results.map(toResult),
    previous,
    next,
  };
}
