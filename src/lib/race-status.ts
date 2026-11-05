import type { Prisma } from "@prisma/client";
import type { RaceStatus } from "./site";

/** Derives a race's status from its scheduled window. */
export function getRaceStatus(start: Date, end: Date, now: Date = new Date()): RaceStatus {
  const t = now.getTime();
  if (t < start.getTime()) return "upcoming";
  if (t <= end.getTime()) return "live";
  return "completed";
}

/** Prisma filter equivalent to getRaceStatus(...) === status. */
export function raceStatusWhere(status: RaceStatus, now: Date = new Date()): Prisma.RaceWhereInput {
  switch (status) {
    case "upcoming":
      return { startDate: { gt: now } };
    case "live":
      return { startDate: { lte: now }, endDate: { gte: now } };
    case "completed":
      return { endDate: { lt: now } };
  }
}
