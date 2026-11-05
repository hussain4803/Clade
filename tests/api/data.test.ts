/** Data-layer tests against the seeded test database, using fixed clocks for determinism. */
import { describe, expect, it } from "vitest";
import { listDrivers } from "@/lib/drivers";
import { getArticle, listArticles } from "@/lib/news";
import { getNextRace, getRace, listRaces } from "@/lib/races";
import { getSeasonStats } from "@/lib/stats";

const NOV_5_2026 = new Date("2026-11-05T12:00:00Z");
const DURING_LE_MANS = new Date("2026-06-13T20:00:00Z");

describe("races data layer", () => {
  it("derives statuses from the clock", async () => {
    const upcoming = await listRaces({ status: "upcoming" }, NOV_5_2026);
    const completed = await listRaces({ status: "completed" }, NOV_5_2026);
    expect(upcoming).toHaveLength(13);
    expect(completed).toHaveLength(11);
    expect(upcoming.every((r) => r.status === "upcoming")).toBe(true);
  });

  it("finds the next race, or the live one", async () => {
    expect((await getNextRace(NOV_5_2026))?.slug).toBe("bahrain-8-2026");
    const live = await getNextRace(DURING_LE_MANS);
    expect(live?.slug).toBe("le-mans-2026");
    expect(live?.status).toBe("live");
  });

  it("filters by series, season and date range", async () => {
    const imsa2027 = await listRaces({ series: ["IMSA"], season: 2027 }, NOV_5_2026);
    expect(imsa2027.map((r) => r.shortName)).toEqual(["Daytona 24", "Sebring 12", "Watkins Glen 6", "Petit Le Mans"]);
    const june = await listRaces({ from: "2027-06-01", to: "2027-06-30" }, NOV_5_2026);
    expect(june.map((r) => r.slug)).toEqual(["le-mans-2027", "watkins-glen-6-2027"]);
  });

  it("returns race detail with schedule, results and neighbours", async () => {
    const race = await getRace("le-mans-2026", NOV_5_2026);
    expect(race?.sessions.at(-1)?.kind).toBe("RACE");
    expect(race?.results).toHaveLength(11);
    expect(race?.results.filter((r) => r.isTeamEntry).map((r) => r.position)).toEqual([2, 6]);
    expect(race?.previous?.slug).toBe("spa-6-2026");
    expect(race?.next?.slug).toBe("watkins-glen-6-2026");
    expect(race?.teamBestFinish).toEqual({ carNumber: "18", position: 2, status: "CLASSIFIED" });
  });

  it("aggregates season statistics from sample results", async () => {
    const stats = await getSeasonStats(2026, NOV_5_2026);
    expect(stats).toMatchObject({ racesCompleted: 11, wins: 3, podiums: 11, bestLeMans: 2 });
  });
});

describe("news data layer", () => {
  it("paginates newest first", async () => {
    const p1 = await listArticles({ page: 1, pageSize: 6 });
    expect(p1.pagination).toEqual({ page: 1, pageSize: 6, total: 18, totalPages: 3 });
    expect(p1.items[0]?.slug).toBe("bahrain-8-hours-preview");
    const dates = p1.items.map((a) => a.publishedAt);
    expect([...dates].sort().reverse()).toEqual(dates);
  });

  it("clamps out-of-range pages to the last page", async () => {
    expect((await listArticles({ page: 99, pageSize: 6 })).pagination.page).toBe(3);
  });

  it("searches case-insensitively across title, body and tags with all terms required", async () => {
    const r = await listArticles({ q: "HYBRID system", pageSize: 24 });
    expect(r.items.map((a) => a.slug)).toContain("inside-the-hybrid-system");
    expect((await listArticles({ q: "zzzz-no-match" })).pagination.total).toBe(0);
  });

  it("returns related stories for an article", async () => {
    const a = await getArticle("le-mans-aero-kit-explained");
    expect(a?.related).toHaveLength(3);
    expect(a?.related.some((r) => r.slug === a.slug)).toBe(false);
  });
});

describe("drivers data layer", () => {
  it("lists drivers in roster order and filters by car", async () => {
    const all = await listDrivers();
    expect(all).toHaveLength(7);
    expect(all[0]?.fullName).toBe("Mara Lindqvist");
    expect((await listDrivers({ car: "81" })).map((d) => d.lastName)).toEqual(["Duarte", "Rourke", "Okonkwo"]);
  });
});
