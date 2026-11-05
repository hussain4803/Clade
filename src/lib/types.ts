import type { NewsCategory, RaceStatus, Series } from "./site";

/** Shapes returned by the API and passed to client components (dates as ISO strings). */

export type TeamFinish = { carNumber: string; position: number; status: string };

export type RaceSummary = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  series: Series;
  season: number;
  round: number;
  startDate: string;
  endDate: string;
  timeZone: string;
  durationLabel: string;
  durationHours: number;
  summary: string;
  circuitName: string;
  city: string;
  country: string;
  countryCode: string;
  heroImage: string;
  status: RaceStatus;
  /** Best classified finish for an AVR entry, when results exist. */
  teamBestFinish: TeamFinish | null;
};

export type RaceSessionDTO = {
  id: string;
  name: string;
  kind: "PRACTICE" | "QUALIFYING" | "WARMUP" | "RACE";
  startsAt: string;
  endsAt: string;
};

export type RaceResultDTO = {
  position: number;
  carNumber: string;
  team: string;
  drivers: string;
  laps: number;
  gap: string;
  bestLap: string;
  status: "CLASSIFIED" | "DNF";
  isTeamEntry: boolean;
};

export type RaceDetail = RaceSummary & {
  description: string;
  circuit: {
    name: string;
    city: string;
    country: string;
    countryCode: string;
    lengthKm: number;
    turns: number;
    note: string;
  };
  sessions: RaceSessionDTO[];
  results: RaceResultDTO[];
  previous: { slug: string; shortName: string; season: number } | null;
  next: { slug: string; shortName: string; season: number } | null;
};

export type ArticleSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: NewsCategory;
  tags: string[];
  author: string;
  coverImage: string;
  coverAlt: string;
  readMinutes: number;
  featured: boolean;
  publishedAt: string;
};

export type ArticleDetail = ArticleSummary & {
  body: string;
  authorRole: string;
  related: ArticleSummary[];
};

export type Pagination = { page: number; pageSize: number; total: number; totalPages: number };

export type DriverDTO = {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  fullName: string;
  number: number;
  role: string;
  carNumber: "18" | "81" | "RESERVE";
  nationality: string;
  countryCode: string;
  birthYear: number;
  rating: string;
  bio: string;
  quote: string;
  helmetImage: string;
  stats: { starts: number; wins: number; podiums: number; poles: number };
};
