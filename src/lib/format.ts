const cache = new Map<string, Intl.DateTimeFormat>();

function fmt(options: Intl.DateTimeFormatOptions & { timeZone?: string }): Intl.DateTimeFormat {
  const key = JSON.stringify(options);
  let f = cache.get(key);
  if (!f) {
    f = new Intl.DateTimeFormat("en-GB", options);
    cache.set(key, f);
  }
  return f;
}

/** "14 Jun 2026" in the given zone (UTC by default for deterministic SSR). */
export function formatDate(iso: string | Date, timeZone = "UTC"): string {
  return fmt({ day: "numeric", month: "short", year: "numeric", timeZone }).format(new Date(iso));
}

/** "14 June 2026" */
export function formatLongDate(iso: string | Date, timeZone = "UTC"): string {
  return fmt({ day: "numeric", month: "long", year: "numeric", timeZone }).format(new Date(iso));
}

/** "Sat 13 Jun" */
export function formatShortDay(iso: string | Date, timeZone = "UTC"): string {
  return fmt({ weekday: "short", day: "numeric", month: "short", timeZone }).format(new Date(iso));
}

/** "16:00" */
export function formatTime(iso: string | Date, timeZone = "UTC"): string {
  return fmt({ hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone }).format(new Date(iso));
}

/** Short zone label such as "CEST" or "GMT+3". */
export function formatZone(iso: string | Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "short" }).formatToParts(
    new Date(iso),
  );
  return parts.find((p) => p.type === "timeZoneName")?.value ?? timeZone;
}

/** "13–14 Jun 2026" or "30 Jan – 1 Feb 2027" for a race window in track time. */
export function formatDateRange(startIso: string | Date, endIso: string | Date, timeZone = "UTC"): string {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const day = fmt({ day: "numeric", timeZone });
  const month = fmt({ month: "short", timeZone });
  const year = fmt({ year: "numeric", timeZone });
  const sameDay = formatDate(start, timeZone) === formatDate(end, timeZone);
  if (sameDay) return formatDate(start, timeZone);
  const sameMonth = month.format(start) === month.format(end) && year.format(start) === year.format(end);
  if (sameMonth) return `${day.format(start)}–${day.format(end)} ${month.format(end)} ${year.format(end)}`;
  return `${day.format(start)} ${month.format(start)} – ${day.format(end)} ${month.format(end)} ${year.format(end)}`;
}

/** Month / day parts for date badges. */
export function dateBadge(iso: string | Date, timeZone = "UTC"): { day: string; month: string; year: string } {
  const d = new Date(iso);
  return {
    day: fmt({ day: "2-digit", timeZone }).format(d),
    month: fmt({ month: "short", timeZone }).format(d).toUpperCase(),
    year: fmt({ year: "numeric", timeZone }).format(d),
  };
}

export function formatNumber(n: number, digits = 0): string {
  return new Intl.NumberFormat("en-GB", { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(n);
}

export function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] ?? s[v] ?? s[0]}`;
}
