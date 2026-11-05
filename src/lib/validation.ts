import { z } from "zod";
import { CONTACT_TOPICS, NEWS_CATEGORIES, RACE_STATUSES, SERIES } from "./site";

const topicValues = CONTACT_TOPICS.map((t) => t.value) as [string, ...string[]];

const email = z
  .string({ error: "Email is required." })
  .trim()
  .min(1, "Email is required.")
  .max(254, "Email must be 254 characters or fewer.")
  .pipe(z.email({ error: "Enter a valid email address." }))
  .transform((v) => v.toLowerCase());

/** Hidden "website" field; humans leave it blank, bots tend to fill it. */
const honeypot = z.string().max(500).optional();

export const contactSchema = z.object({
  name: z
    .string({ error: "Name is required." })
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(80, "Name must be 80 characters or fewer."),
  email,
  topic: z.enum(topicValues, { error: "Choose a topic." }),
  subject: z
    .string({ error: "Subject is required." })
    .trim()
    .min(3, "Subject must be at least 3 characters.")
    .max(120, "Subject must be 120 characters or fewer."),
  message: z
    .string({ error: "Message is required." })
    .trim()
    .min(20, "Message must be at least 20 characters.")
    .max(2000, "Message must be 2,000 characters or fewer."),
  website: honeypot,
});
export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;

export const newsletterSchema = z.object({
  email,
  source: z
    .string()
    .trim()
    .max(40)
    .regex(/^[a-z0-9-]*$/i, "Invalid source.")
    .optional(),
  website: honeypot,
});
export type NewsletterInput = z.input<typeof newsletterSchema>;

const emptyToUndefined = (v: unknown) => (v === "" || v === "all" || v === null ? undefined : v);

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}(T.*)?$/, "Use an ISO date such as 2027-06-12.")
  .refine((v) => !Number.isNaN(Date.parse(v)), "Invalid date.");

export const raceQuerySchema = z
  .object({
    series: z.preprocess(
      emptyToUndefined,
      z
        .string()
        .transform((v) => v.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean))
        .pipe(z.array(z.enum(SERIES, { error: `Series must be one of: ${SERIES.join(", ")}.` })).min(1))
        .optional(),
    ),
    status: z.preprocess(
      emptyToUndefined,
      z.enum(RACE_STATUSES, { error: `Status must be one of: ${RACE_STATUSES.join(", ")}.` }).optional(),
    ),
    season: z.preprocess(emptyToUndefined, z.coerce.number().int().min(2000).max(2100).optional()),
    from: z.preprocess(emptyToUndefined, isoDate.optional()),
    to: z.preprocess(emptyToUndefined, isoDate.optional()),
    sort: z.preprocess(emptyToUndefined, z.enum(["date_asc", "date_desc"]).default("date_asc")),
    limit: z.preprocess(emptyToUndefined, z.coerce.number().int().min(1).max(100).optional()),
  })
  .refine((q) => !q.from || !q.to || Date.parse(q.from) <= Date.parse(q.to), {
    message: "`from` must be on or before `to`.",
    path: ["from"],
  });
export type RaceQuery = z.output<typeof raceQuerySchema>;

export const newsQuerySchema = z.object({
  q: z.preprocess(emptyToUndefined, z.string().trim().max(100, "Search must be 100 characters or fewer.").optional()),
  category: z.preprocess(
    emptyToUndefined,
    z.enum(NEWS_CATEGORIES, { error: `Category must be one of: ${NEWS_CATEGORIES.join(", ")}.` }).optional(),
  ),
  page: z.preprocess(emptyToUndefined, z.coerce.number().int().min(1).max(1000).default(1)),
  pageSize: z.preprocess(emptyToUndefined, z.coerce.number().int().min(1).max(24).default(6)),
});
export type NewsQuery = z.output<typeof newsQuerySchema>;

export const driverQuerySchema = z.object({
  car: z.preprocess(emptyToUndefined, z.enum(["18", "81", "RESERVE"]).optional()),
});

/** Converts URLSearchParams (or Next searchParams) into a plain object of first values. */
export function searchParamsToObject(
  params: URLSearchParams | Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  if (params instanceof URLSearchParams) {
    for (const [k, v] of params.entries()) if (!(k in out)) out[k] = v;
    return out;
  }
  for (const [k, v] of Object.entries(params)) {
    const value = Array.isArray(v) ? v[0] : v;
    if (typeof value === "string") out[k] = value;
  }
  return out;
}

/** Flattens a ZodError into { field: firstMessage }. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.length ? String(issue.path[0]) : "_form";
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}
