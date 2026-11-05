export const SITE = {
  name: "Apex Velocita Racing",
  wordmark: "APEX VELOCITA RACING",
  shortName: "AVR",
  tagline: "Engineered for the long night.",
  description:
    "The digital home of Apex Velocita Racing — a fictional two-car Hypercar endurance team chasing the 24 Hours of Le Mans, Daytona, Sebring and the world's great long-distance races.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  disclaimer:
    "Apex Velocita Racing is a fictional team. All drivers, specifications, results, partners, articles and contact details on this site are sample data created for demonstration purposes.",
} as const;

export type NavLink = { href: string; label: string; description: string };

export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home", description: "Race hub" },
  { href: "/team", label: "Team", description: "Drivers & crew" },
  { href: "/cars", label: "Cars", description: "AVR-26 Notturna" },
  { href: "/races", label: "Races", description: "Calendar & results" },
  { href: "/news", label: "News", description: "Paddock stories" },
  { href: "/contact", label: "Contact", description: "Get in touch" },
];

export const SERIES = ["WEC", "IMSA"] as const;
export type Series = (typeof SERIES)[number];

export const SERIES_LABELS: Record<Series, string> = {
  WEC: "World Endurance",
  IMSA: "IMSA Endurance",
};

export const RACE_STATUSES = ["upcoming", "live", "completed"] as const;
export type RaceStatus = (typeof RACE_STATUSES)[number];

export const RACE_STATUS_LABELS: Record<RaceStatus, string> = {
  upcoming: "Upcoming",
  live: "Live",
  completed: "Completed",
};

export const NEWS_CATEGORIES = [
  "race-report",
  "team",
  "technical",
  "drivers",
  "behind-the-scenes",
] as const;
export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

export const NEWS_CATEGORY_LABELS: Record<NewsCategory, string> = {
  "race-report": "Race Report",
  team: "Team",
  technical: "Technical",
  drivers: "Drivers",
  "behind-the-scenes": "Behind the Scenes",
};

export const CONTACT_TOPICS = [
  { value: "general", label: "General enquiry" },
  { value: "partnerships", label: "Partnerships" },
  { value: "media", label: "Media & press" },
  { value: "careers", label: "Careers" },
  { value: "fans", label: "Fan mail" },
] as const;
export type ContactTopic = (typeof CONTACT_TOPICS)[number]["value"];

export const NEWS_PAGE_SIZE = 6;
