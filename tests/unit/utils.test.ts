import { afterEach, describe, expect, it } from "vitest";
import { parseArticleBody } from "@/lib/article-body";
import { getCountdownParts, pad2 } from "@/lib/countdown";
import { formatDateRange, formatTime, ordinal } from "@/lib/format";
import { getRaceStatus, raceStatusWhere } from "@/lib/race-status";
import { rateLimit, resetRateLimits } from "@/lib/rate-limit";

describe("getRaceStatus", () => {
  const start = new Date("2027-06-12T14:00:00Z");
  const end = new Date("2027-06-13T14:00:00Z");
  it("is upcoming before the start", () => expect(getRaceStatus(start, end, new Date("2027-06-12T13:59:59Z"))).toBe("upcoming"));
  it("is live from the start until the finish (inclusive)", () => {
    expect(getRaceStatus(start, end, start)).toBe("live");
    expect(getRaceStatus(start, end, end)).toBe("live");
  });
  it("is completed after the finish", () => expect(getRaceStatus(start, end, new Date("2027-06-13T14:00:01Z"))).toBe("completed"));
  it("builds matching Prisma filters", () => {
    const now = new Date("2027-01-01T00:00:00Z");
    expect(raceStatusWhere("upcoming", now)).toEqual({ startDate: { gt: now } });
    expect(raceStatusWhere("completed", now)).toEqual({ endDate: { lt: now } });
    expect(raceStatusWhere("live", now)).toEqual({ startDate: { lte: now }, endDate: { gte: now } });
  });
});

describe("getCountdownParts", () => {
  it("splits remaining time into units", () => {
    const now = 0;
    const target = ((2 * 24 + 3) * 3600 + 4 * 60 + 5) * 1000;
    expect(getCountdownParts(target, now)).toMatchObject({ days: 2, hours: 3, minutes: 4, seconds: 5, done: false });
  });
  it("never goes negative", () => {
    expect(getCountdownParts(1000, 5000)).toMatchObject({ days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0, done: true });
  });
  it("pads to two digits", () => expect(pad2(7)).toBe("07"));
});

describe("format helpers", () => {
  it("formats same-month, cross-month and single-day ranges in track time", () => {
    expect(formatDateRange("2027-06-12T14:00:00Z", "2027-06-13T14:00:00Z", "Europe/Paris")).toBe("12–13 Jun 2027");
    expect(formatDateRange("2027-01-30T18:40:00Z", "2027-01-31T18:40:00Z", "America/New_York")).toBe("30–31 Jan 2027");
    expect(formatDateRange("2027-05-31T20:00:00Z", "2027-06-01T08:00:00Z", "UTC")).toBe("31 May – 1 Jun 2027");
    expect(formatDateRange("2027-04-18T11:00:00Z", "2027-04-18T17:00:00Z", "Europe/Rome")).toBe("18 Apr 2027");
  });
  it("formats 24h track time", () => expect(formatTime("2027-06-12T14:00:00Z", "Europe/Paris")).toBe("16:00"));
  it("builds ordinals", () => expect([1, 2, 3, 4, 11, 12, 13, 21, 22, 101].map(ordinal)).toEqual(["1st", "2nd", "3rd", "4th", "11th", "12th", "13th", "21st", "22nd", "101st"]));
});

describe("parseArticleBody", () => {
  it("parses paragraphs, headings, quotes with citations and lists", () => {
    const blocks = parseArticleBody("Intro line\ncontinues.\n\n## Heading\n\n> Quote line one\n> line two\n> — Someone (fictional)\n\n- one\n- two");
    expect(blocks).toEqual([
      { type: "paragraph", text: "Intro line continues." },
      { type: "heading", text: "Heading" },
      { type: "quote", text: "Quote line one line two", cite: "Someone (fictional)" },
      { type: "list", items: ["one", "two"] },
    ]);
  });
});

describe("rateLimit", () => {
  const prev = process.env.RATE_LIMIT_DISABLED;
  afterEach(() => {
    process.env.RATE_LIMIT_DISABLED = prev;
    resetRateLimits();
  });
  it("allows up to the limit per window, then blocks with a retry hint", () => {
    process.env.RATE_LIMIT_DISABLED = "false";
    const t = 1_000_000;
    expect(rateLimit("k", 2, 60_000, t).allowed).toBe(true);
    expect(rateLimit("k", 2, 60_000, t + 1).allowed).toBe(true);
    const blocked = rateLimit("k", 2, 60_000, t + 2);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBe(60);
    expect(rateLimit("k", 2, 60_000, t + 60_001).allowed).toBe(true);
  });
});
