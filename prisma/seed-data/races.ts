/**
 * Sample race calendar for the fictional Apex Velocita Racing team.
 * Event names refer to real endurance races, but every date, session time,
 * classification, competitor and driver below is fictional demo data.
 */
import { seededRandom } from "./rng";

type SessionKind = "PRACTICE" | "QUALIFYING" | "WARMUP" | "RACE";
type SessionTemplate = { name: string; kind: SessionKind; offsetH: number; durationH: number };

type EventBase = {
  key: string;
  name: string;
  shortName: string;
  series: "WEC" | "IMSA";
  durationLabel: string;
  durationHours: number;
  timeZone: string;
  circuitName: string;
  city: string;
  country: string;
  countryCode: string;
  circuitLengthKm: number;
  circuitTurns: number;
  circuitNote: string;
  summary: string;
  description: string;
  baseLap: number; // seconds, sample reference pace
  winnerLaps: number;
};

const EVENTS: Record<string, EventBase> = {
  "daytona-24": {
    key: "daytona-24",
    name: "24 Hours of Daytona",
    shortName: "Daytona 24",
    series: "IMSA",
    durationLabel: "24 Hours",
    durationHours: 24,
    timeZone: "America/New_York",
    circuitName: "Daytona International Speedway (Road Course)",
    city: "Daytona Beach, Florida",
    country: "United States",
    countryCode: "US",
    circuitLengthKm: 5.73,
    circuitTurns: 12,
    circuitNote:
      "A hybrid of steep oval banking and a tight infield. Top speed on the banking rewards a low-drag trim, while the infield and the Bus Stop chicane punish anything that wastes braking stability.",
    summary: "The twice-around-the-clock opener of the North American endurance year.",
    description:
      "Daytona opens the endurance season with 24 hours of banking, traffic and cool Florida nights. Long full-course yellows bunch the field, so the final six hours often decide everything — the team's focus is on keeping both cars on the lead lap and the hybrid system healthy for a sprint finish.",
    baseLap: 95.2,
    winnerLaps: 781,
  },
  "qatar-1812": {
    key: "qatar-1812",
    name: "Qatar 1812 km",
    shortName: "Qatar 1812",
    series: "WEC",
    durationLabel: "1812 km (~10 Hours)",
    durationHours: 10,
    timeZone: "Asia/Qatar",
    circuitName: "Lusail International Circuit",
    city: "Lusail",
    country: "Qatar",
    countryCode: "QA",
    circuitLengthKm: 5.419,
    circuitTurns: 16,
    circuitNote:
      "Fast, flowing and abrasive. Long sweeping corners load the front-left tyre heavily, and the race runs from afternoon heat into a cooler night — track temperature can fall by more than 15 °C.",
    summary: "The world-championship curtain-raiser, run from sunset into the desert night.",
    description:
      "The season opener covers 1,812 kilometres under the floodlights. Tyre degradation in the opening stints and a changing track temperature make tyre allocation the key strategic lever.",
    baseLap: 100.5,
    winnerLaps: 335,
  },
  "sebring-12": {
    key: "sebring-12",
    name: "12 Hours of Sebring",
    shortName: "Sebring 12",
    series: "IMSA",
    durationLabel: "12 Hours",
    durationHours: 12,
    timeZone: "America/New_York",
    circuitName: "Sebring International Raceway",
    city: "Sebring, Florida",
    country: "United States",
    countryCode: "US",
    circuitLengthKm: 6.019,
    circuitTurns: 17,
    circuitNote:
      "Built on a former airfield, the concrete patchwork is famously bumpy. Sebring is the harshest test of suspension, dampers and driver endurance on the calendar.",
    summary: "Twelve hours on the bumpiest track in endurance racing.",
    description:
      "Sebring is where endurance cars are proven. The surface shakes every component, so the team runs a dedicated damper programme and conservative ride heights to finish the race in one piece.",
    baseLap: 107.3,
    winnerLaps: 342,
  },
  "imola-6": {
    key: "imola-6",
    name: "6 Hours of Imola",
    shortName: "Imola 6",
    series: "WEC",
    durationLabel: "6 Hours",
    durationHours: 6,
    timeZone: "Europe/Rome",
    circuitName: "Autodromo Enzo e Dino Ferrari",
    city: "Imola",
    country: "Italy",
    countryCode: "IT",
    circuitLengthKm: 4.909,
    circuitTurns: 19,
    circuitNote:
      "Old-school, narrow and unforgiving, with high kerbs through Acque Minerali and the Variante Alta. Overtaking is scarce, so qualifying and pit-stop execution matter more than usual.",
    summary: "A narrow, old-school six hours where track position is everything.",
    description:
      "Imola's tight layout makes passing in traffic difficult. The team prioritises a strong Hyperpole and clean, quick stops to gain positions in the pit lane rather than on track.",
    baseLap: 91.9,
    winnerLaps: 205,
  },
  "spa-6": {
    key: "spa-6",
    name: "6 Hours of Spa-Francorchamps",
    shortName: "Spa 6",
    series: "WEC",
    durationLabel: "6 Hours",
    durationHours: 6,
    timeZone: "Europe/Brussels",
    circuitName: "Circuit de Spa-Francorchamps",
    city: "Stavelot",
    country: "Belgium",
    countryCode: "BE",
    circuitLengthKm: 7.004,
    circuitTurns: 19,
    circuitNote:
      "Seven kilometres through the Ardennes forest, home of Eau Rouge and Raidillon. Weather can differ from one end of the lap to the other, making tyre calls a gamble.",
    summary: "The final dress rehearsal before Le Mans, in the unpredictable Ardennes.",
    description:
      "Spa is the last race before Le Mans and doubles as a test of the low-drag package. Changeable weather regularly turns the six hours into a strategic lottery.",
    baseLap: 122.4,
    winnerLaps: 141,
  },
  "le-mans": {
    key: "le-mans",
    name: "24 Hours of Le Mans",
    shortName: "Le Mans 24",
    series: "WEC",
    durationLabel: "24 Hours",
    durationHours: 24,
    timeZone: "Europe/Paris",
    circuitName: "Circuit de la Sarthe",
    city: "Le Mans",
    country: "France",
    countryCode: "FR",
    circuitLengthKm: 13.626,
    circuitTurns: 38,
    circuitNote:
      "Part permanent circuit, part public roads closed for race week. The Mulsanne Straight, Indianapolis and the Porsche Curves make it the ultimate balance between top speed and high-speed commitment.",
    summary: "The race the entire programme is built around.",
    description:
      "Le Mans is the reason Apex Velocita exists. Every component, every procedure and every driver-change rehearsal is designed around 24 hours at the Circuit de la Sarthe — the team targets roughly 380 laps and close to 5,200 kilometres.",
    baseLap: 205.6,
    winnerLaps: 381,
  },
  "watkins-glen-6": {
    key: "watkins-glen-6",
    name: "6 Hours of The Glen",
    shortName: "Watkins Glen 6",
    series: "IMSA",
    durationLabel: "6 Hours",
    durationHours: 6,
    timeZone: "America/New_York",
    circuitName: "Watkins Glen International",
    city: "Watkins Glen, New York",
    country: "United States",
    countryCode: "US",
    circuitLengthKm: 5.43,
    circuitTurns: 11,
    circuitNote:
      "Fast and flowing through upstate New York hills. The Esses and the Boot section reward a stable, efficient aero platform.",
    summary: "High-speed six hours through the hills of upstate New York.",
    description:
      "The Glen is all about rhythm and fuel economy. With long green-flag runs, stretching a stint by a single lap can swing the result.",
    baseLap: 92.8,
    winnerLaps: 204,
  },
  "sao-paulo-6": {
    key: "sao-paulo-6",
    name: "6 Hours of São Paulo",
    shortName: "São Paulo 6",
    series: "WEC",
    durationLabel: "6 Hours",
    durationHours: 6,
    timeZone: "America/Sao_Paulo",
    circuitName: "Autódromo José Carlos Pace (Interlagos)",
    city: "São Paulo",
    country: "Brazil",
    countryCode: "BR",
    circuitLengthKm: 4.309,
    circuitTurns: 15,
    circuitNote:
      "An anti-clockwise bowl with big elevation changes. A short lap means relentless traffic, and the climb from Juncao to the line punishes poor traction.",
    summary: "Anti-clockwise, undulating and full of traffic.",
    description:
      "Interlagos packs the field onto a short lap. Traffic management and traction out of slow corners decide the race more than outright pace.",
    baseLap: 83.9,
    winnerLaps: 236,
  },
  "lone-star": {
    key: "lone-star",
    name: "Lone Star Le Mans",
    shortName: "COTA 6",
    series: "WEC",
    durationLabel: "6 Hours",
    durationHours: 6,
    timeZone: "America/Chicago",
    circuitName: "Circuit of The Americas",
    city: "Austin, Texas",
    country: "United States",
    countryCode: "US",
    circuitLengthKm: 5.513,
    circuitTurns: 20,
    circuitNote:
      "A modern circuit with a steep climb to Turn 1 and a fast first-sector snake. Texas heat makes cooling and tyre management critical.",
    summary: "Six hours in the Texas heat.",
    description:
      "COTA mixes a high-speed first sector with heavy braking zones. Cooling packages and tyre pressures are optimised for hot-track running.",
    baseLap: 108.7,
    winnerLaps: 186,
  },
  "fuji-6": {
    key: "fuji-6",
    name: "6 Hours of Fuji",
    shortName: "Fuji 6",
    series: "WEC",
    durationLabel: "6 Hours",
    durationHours: 6,
    timeZone: "Asia/Tokyo",
    circuitName: "Fuji Speedway",
    city: "Oyama, Shizuoka",
    country: "Japan",
    countryCode: "JP",
    circuitLengthKm: 4.563,
    circuitTurns: 16,
    circuitNote:
      "One of the longest straights in the championship followed by a tight, technical final sector. Set-up is a compromise between straight-line speed and slow-corner grip.",
    summary: "Long straight, tight final sector, Mount Fuji on the horizon.",
    description:
      "Fuji forces a set-up compromise. The team trades a little top speed for stability in the final sector, where most of the lap time is found.",
    baseLap: 89.4,
    winnerLaps: 228,
  },
  "petit-le-mans": {
    key: "petit-le-mans",
    name: "Petit Le Mans",
    shortName: "Petit Le Mans",
    series: "IMSA",
    durationLabel: "10 Hours",
    durationHours: 10,
    timeZone: "America/New_York",
    circuitName: "Road Atlanta",
    city: "Braselton, Georgia",
    country: "United States",
    countryCode: "US",
    circuitLengthKm: 4.088,
    circuitTurns: 12,
    circuitNote:
      "Short, fast and hilly with blind crests through the Esses. The race finishes after dark, so headlight aim and visibility in traffic become decisive.",
    summary: "Ten hours from daylight into darkness on a short, fast, hilly circuit.",
    description:
      "The North American endurance finale runs into the Georgia night. With a short lap and a big field, the final hours are a battle through constant traffic.",
    baseLap: 69.8,
    winnerLaps: 418,
  },
  "bahrain-8": {
    key: "bahrain-8",
    name: "8 Hours of Bahrain",
    shortName: "Bahrain 8",
    series: "WEC",
    durationLabel: "8 Hours",
    durationHours: 8,
    timeZone: "Asia/Bahrain",
    circuitName: "Bahrain International Circuit",
    city: "Sakhir",
    country: "Bahrain",
    countryCode: "BH",
    circuitLengthKm: 5.412,
    circuitTurns: 15,
    circuitNote:
      "Heavy braking zones and an abrasive surface. The race starts in the afternoon heat and finishes under floodlights, so the car must work across a wide temperature window.",
    summary: "The world-championship finale, from desert afternoon to floodlit night.",
    description:
      "Bahrain closes the world-championship season. Eight hours on an abrasive surface put rear tyres and brake cooling under constant pressure — and championship positions are often settled in the final stint.",
    baseLap: 107.6,
    winnerLaps: 247,
  },
};

const WEC_TEMPLATE: SessionTemplate[] = [
  { name: "Free Practice 1", kind: "PRACTICE", offsetH: -52, durationH: 1.5 },
  { name: "Free Practice 2", kind: "PRACTICE", offsetH: -47, durationH: 1.5 },
  { name: "Free Practice 3", kind: "PRACTICE", offsetH: -28.5, durationH: 1 },
  { name: "Qualifying", kind: "QUALIFYING", offsetH: -24, durationH: 0.2 },
  { name: "Hyperpole", kind: "QUALIFYING", offsetH: -23.5, durationH: 0.25 },
];

const LE_MANS_TEMPLATE: SessionTemplate[] = [
  { name: "Test Day", kind: "PRACTICE", offsetH: -151, durationH: 3 },
  { name: "Free Practice 1", kind: "PRACTICE", offsetH: -74, durationH: 3 },
  { name: "Qualifying", kind: "QUALIFYING", offsetH: -69, durationH: 1 },
  { name: "Free Practice 2 (Night)", kind: "PRACTICE", offsetH: -66, durationH: 2 },
  { name: "Free Practice 3", kind: "PRACTICE", offsetH: -49, durationH: 1.5 },
  { name: "Hyperpole", kind: "QUALIFYING", offsetH: -44, durationH: 0.5 },
  { name: "Free Practice 4 (Night)", kind: "PRACTICE", offsetH: -41.5, durationH: 1.5 },
  { name: "Warm-up", kind: "WARMUP", offsetH: -4, durationH: 0.25 },
];

const IMSA_TEMPLATE: SessionTemplate[] = [
  { name: "Practice 1", kind: "PRACTICE", offsetH: -50, durationH: 1.5 },
  { name: "Practice 2", kind: "PRACTICE", offsetH: -45, durationH: 1.5 },
  { name: "Practice 3", kind: "PRACTICE", offsetH: -26, durationH: 1 },
  { name: "Qualifying", kind: "QUALIFYING", offsetH: -22, durationH: 0.25 },
  { name: "Warm-up", kind: "WARMUP", offsetH: -3, durationH: 0.33 },
];

const IMSA_NIGHT: SessionTemplate = { name: "Night Practice", kind: "PRACTICE", offsetH: -40, durationH: 1.5 };

type CalendarEntry = {
  event: keyof typeof EVENTS;
  season: number;
  round: number;
  startUtc: string;
  /** Fictional AVR classification; omitted for events that have not happened. */
  result?: { car18: number | "DNF"; car81: number | "DNF" };
  provisional?: boolean;
};

export const CALENDAR: CalendarEntry[] = [
  // 2026 season
  { event: "daytona-24", season: 2026, round: 1, startUtc: "2026-01-24T18:40:00Z", result: { car18: 4, car81: 7 } },
  { event: "qatar-1812", season: 2026, round: 1, startUtc: "2026-02-28T08:00:00Z", result: { car18: 3, car81: 6 } },
  { event: "sebring-12", season: 2026, round: 2, startUtc: "2026-03-21T14:10:00Z", result: { car18: "DNF", car81: 2 } },
  { event: "imola-6", season: 2026, round: 2, startUtc: "2026-04-19T11:00:00Z", result: { car18: 5, car81: 4 } },
  { event: "spa-6", season: 2026, round: 3, startUtc: "2026-05-09T11:00:00Z", result: { car18: 3, car81: 1 } },
  { event: "le-mans", season: 2026, round: 4, startUtc: "2026-06-13T14:00:00Z", result: { car18: 2, car81: 6 } },
  { event: "watkins-glen-6", season: 2026, round: 3, startUtc: "2026-06-28T14:40:00Z", result: { car18: 3, car81: 5 } },
  { event: "sao-paulo-6", season: 2026, round: 5, startUtc: "2026-07-12T15:30:00Z", result: { car18: 4, car81: 2 } },
  { event: "lone-star", season: 2026, round: 6, startUtc: "2026-09-06T17:00:00Z", result: { car18: 6, car81: 3 } },
  { event: "fuji-6", season: 2026, round: 7, startUtc: "2026-09-27T02:00:00Z", result: { car18: 1, car81: 4 } },
  { event: "petit-le-mans", season: 2026, round: 4, startUtc: "2026-10-10T16:10:00Z", result: { car18: 1, car81: 3 } },
  { event: "bahrain-8", season: 2026, round: 8, startUtc: "2026-11-14T11:00:00Z" },
  // 2027 season (provisional sample dates)
  { event: "daytona-24", season: 2027, round: 1, startUtc: "2027-01-30T18:40:00Z", provisional: true },
  { event: "qatar-1812", season: 2027, round: 1, startUtc: "2027-02-27T08:00:00Z", provisional: true },
  { event: "sebring-12", season: 2027, round: 2, startUtc: "2027-03-20T14:10:00Z", provisional: true },
  { event: "imola-6", season: 2027, round: 2, startUtc: "2027-04-18T11:00:00Z", provisional: true },
  { event: "spa-6", season: 2027, round: 3, startUtc: "2027-05-08T11:00:00Z", provisional: true },
  { event: "le-mans", season: 2027, round: 4, startUtc: "2027-06-12T14:00:00Z", provisional: true },
  { event: "watkins-glen-6", season: 2027, round: 3, startUtc: "2027-06-27T14:40:00Z", provisional: true },
  { event: "sao-paulo-6", season: 2027, round: 5, startUtc: "2027-07-11T15:30:00Z", provisional: true },
  { event: "lone-star", season: 2027, round: 6, startUtc: "2027-09-05T17:00:00Z", provisional: true },
  { event: "fuji-6", season: 2027, round: 7, startUtc: "2027-09-26T02:00:00Z", provisional: true },
  { event: "petit-le-mans", season: 2027, round: 4, startUtc: "2027-10-09T16:10:00Z", provisional: true },
  { event: "bahrain-8", season: 2027, round: 8, startUtc: "2027-11-13T11:00:00Z", provisional: true },
];

/** Fictional competitor entries used to fill sample classifications. */
const RIVALS = [
  { carNumber: "3", team: "Nordhaus Motorsport", drivers: "L. Brandt / E. Kowalczyk / R. Ostrander" },
  { carNumber: "4", team: "Nordhaus Motorsport", drivers: "F. Halvorsen / M. Quintero / S. Ilyinova" },
  { carNumber: "9", team: "Halcyon Racing", drivers: "A. Fairweather / D. Mbatha / P. Lanzoni" },
  { carNumber: "11", team: "Kestrel Endurance", drivers: "J. Castellan / H. Moriyama / C. Vael" },
  { carNumber: "27", team: "Solaris Prototipi", drivers: "G. Rinaldo / T. Ambrosetti / N. Petrakis" },
  { carNumber: "28", team: "Solaris Prototipi", drivers: "V. Lindahl / O. Szabady / K. Achterberg" },
  { carNumber: "33", team: "Meridian Works", drivers: "B. Okafor / Y. Tanabata / E. Marchesini" },
  { carNumber: "55", team: "Ironbark Racing", drivers: "W. Harland / I. Duquesnoy / R. Sandoval" },
  { carNumber: "63", team: "Vantor Hybrid Team", drivers: "S. Achterhof / L. Kirovski / M. Delmonte" },
];

const TEAM = "Apex Velocita Racing";
const AVR_18 = "M. Lindqvist / K. Arakawa / T. Valcourt";
const AVR_81 = "I. Duarte / C. Rourke / N. Okonkwo";

function lapTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds - m * 60;
  return `${m}:${s.toFixed(3).padStart(6, "0")}`;
}

export type SeedResult = {
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

function buildResults(slug: string, base: EventBase, result: NonNullable<CalendarEntry["result"]>): SeedResult[] {
  const rand = seededRandom(slug);
  const fieldSize = RIVALS.length + 2;
  const isEnduranceCup = base.series === "IMSA" && base.durationHours >= 10;
  const avr18 = { carNumber: "18", team: TEAM, drivers: AVR_18, isTeamEntry: true };
  const avr81 = {
    carNumber: "81",
    team: TEAM,
    drivers: isEnduranceCup ? `${AVR_81} / L. Ferrandi` : AVR_81,
    isTeamEntry: true,
  };

  // Shuffle rivals deterministically.
  const rivals = RIVALS.map((r) => ({ entry: { ...r, isTeamEntry: false }, k: rand() }))
    .sort((a, b) => a.k - b.k)
    .map((r) => r.entry);

  const slots: Array<(typeof avr18) | null> = Array.from({ length: fieldSize }, () => null);
  const dnfEntries: (typeof avr18)[] = [];
  if (result.car18 === "DNF") dnfEntries.push(avr18);
  else slots[result.car18 - 1] = avr18;
  if (result.car81 === "DNF") dnfEntries.push(avr81);
  else slots[result.car81 - 1] = avr81;

  // One rival retires in every race unless an AVR car already did.
  if (dnfEntries.length === 0) dnfEntries.push(rivals.pop()!);

  const classifiedCount = fieldSize - dnfEntries.length;
  for (let i = 0; i < classifiedCount; i++) if (!slots[i]) slots[i] = rivals.shift()!;

  const out: SeedResult[] = [];
  let gapSeconds = 0;
  let lapsDown = 0;
  for (let i = 0; i < classifiedCount; i++) {
    const entry = slots[i]!;
    let gap = "Winner";
    if (i > 0) {
      if (lapsDown === 0 && i < 5) {
        gapSeconds += 3 + rand() * (base.durationHours >= 12 ? 70 : 28);
        if (gapSeconds > base.baseLap) {
          lapsDown = 1;
          gap = "+1 Lap";
        } else {
          gap = `+${gapSeconds.toFixed(3)}s`;
        }
      } else {
        lapsDown += rand() > 0.45 ? 1 : 0;
        lapsDown = Math.max(lapsDown, 1);
        gap = `+${lapsDown} Lap${lapsDown > 1 ? "s" : ""}`;
      }
    }
    out.push({
      position: i + 1,
      ...entry,
      laps: base.winnerLaps - lapsDown,
      gap,
      bestLap: lapTime(base.baseLap + rand() * 1.4),
      status: "CLASSIFIED",
    });
  }
  dnfEntries.forEach((entry, j) => {
    const laps = Math.floor(base.winnerLaps * (0.35 + rand() * 0.4));
    out.push({
      position: classifiedCount + j + 1,
      ...entry,
      laps,
      gap: "DNF",
      bestLap: lapTime(base.baseLap + 0.3 + rand() * 1.4),
      status: "DNF",
    });
  });
  return out;
}

export type SeedRace = {
  slug: string;
  name: string;
  shortName: string;
  series: "WEC" | "IMSA";
  season: number;
  round: number;
  startDate: Date;
  endDate: Date;
  timeZone: string;
  durationLabel: string;
  durationHours: number;
  summary: string;
  description: string;
  circuitName: string;
  city: string;
  country: string;
  countryCode: string;
  circuitLengthKm: number;
  circuitTurns: number;
  circuitNote: string;
  heroImage: string;
  sessions: { name: string; kind: SessionKind; startsAt: Date; endsAt: Date; order: number }[];
  results: SeedResult[];
};

const HOUR = 3_600_000;

export function buildRaces(): SeedRace[] {
  return CALENDAR.map((entry) => {
    const base = EVENTS[entry.event]!;
    const slug = `${base.key}-${entry.season}`;
    const start = new Date(entry.startUtc);
    const end = new Date(start.getTime() + base.durationHours * HOUR);

    let template =
      base.key === "le-mans" ? LE_MANS_TEMPLATE : base.series === "WEC" ? WEC_TEMPLATE : IMSA_TEMPLATE;
    if (base.series === "IMSA" && base.durationHours >= 24) {
      template = [...template, IMSA_NIGHT].sort((a, b) => a.offsetH - b.offsetH);
    }
    const sessions = [
      ...template.map((t) => ({
        name: t.name,
        kind: t.kind,
        startsAt: new Date(start.getTime() + t.offsetH * HOUR),
        endsAt: new Date(start.getTime() + (t.offsetH + t.durationH) * HOUR),
      })),
      { name: "Race", kind: "RACE" as const, startsAt: start, endsAt: end },
    ].map((s, i) => ({ ...s, order: i + 1 }));

    return {
      slug,
      name: base.name,
      shortName: base.shortName,
      series: base.series,
      season: entry.season,
      round: entry.round,
      startDate: start,
      endDate: end,
      timeZone: base.timeZone,
      durationLabel: base.durationLabel,
      durationHours: base.durationHours,
      summary: entry.provisional ? `${base.summary} Provisional sample date.` : base.summary,
      description: base.description,
      circuitName: base.circuitName,
      city: base.city,
      country: base.country,
      countryCode: base.countryCode,
      circuitLengthKm: base.circuitLengthKm,
      circuitTurns: base.circuitTurns,
      circuitNote: base.circuitNote,
      heroImage: `/images/circuits/${base.key}.webp`,
      sessions,
      results: entry.result ? buildResults(slug, base, entry.result) : [],
    };
  });
}

export const CIRCUIT_KEYS = Object.keys(EVENTS);
