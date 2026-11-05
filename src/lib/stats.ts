import { prisma } from "./prisma";

export type SeasonStats = {
  season: number;
  racesCompleted: number;
  wins: number;
  podiums: number;
  bestLeMans: number | null;
  lapsCompleted: number;
  kilometres: number;
};

/** Aggregates fictional sample results for the team's entries in one season. */
export async function getSeasonStats(season: number, now: Date = new Date()): Promise<SeasonStats> {
  const races = await prisma.race.findMany({
    where: { season, endDate: { lt: now } },
    select: {
      slug: true,
      circuitLengthKm: true,
      results: { where: { isTeamEntry: true }, select: { position: true, status: true, laps: true } },
    },
  });
  let wins = 0;
  let podiums = 0;
  let laps = 0;
  let km = 0;
  let bestLeMans: number | null = null;
  let racesCompleted = 0;
  for (const race of races) {
    if (race.results.length) racesCompleted++;
    for (const r of race.results) {
      laps += r.laps;
      km += r.laps * race.circuitLengthKm;
      if (r.status !== "CLASSIFIED") continue;
      if (r.position === 1) wins++;
      if (r.position <= 3) podiums++;
      if (race.slug.startsWith("le-mans") && (bestLeMans === null || r.position < bestLeMans)) bestLeMans = r.position;
    }
  }
  return { season, racesCompleted, wins, podiums, bestLeMans, lapsCompleted: laps, kilometres: Math.round(km) };
}
