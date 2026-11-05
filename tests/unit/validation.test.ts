import { describe, expect, it } from "vitest";
import { contactSchema, fieldErrors, newsletterSchema, newsQuerySchema, raceQuerySchema, searchParamsToObject } from "@/lib/validation";

const validContact = {
  name: "  Alex Driver ",
  email: "Alex@Example.COM",
  topic: "media",
  subject: "Interview request",
  message: "Hello team, I'd like to request an interview before Le Mans.",
};

describe("contactSchema", () => {
  it("accepts a valid message and normalises fields", () => {
    const r = contactSchema.parse(validContact);
    expect(r.name).toBe("Alex Driver");
    expect(r.email).toBe("alex@example.com");
  });

  it("reports a message per invalid field", () => {
    const r = contactSchema.safeParse({ name: "A", email: "nope", topic: "other", subject: "", message: "short" });
    expect(r.success).toBe(false);
    if (r.success) return;
    const fe = fieldErrors(r.error);
    expect(Object.keys(fe).sort()).toEqual(["email", "message", "name", "subject", "topic"]);
    expect(fe.email).toMatch(/valid email/i);
    expect(fe.message).toMatch(/20 characters/);
  });

  it("rejects messages over 2,000 characters", () => {
    const r = contactSchema.safeParse({ ...validContact, message: "x".repeat(2001) });
    expect(r.success).toBe(false);
  });
});

describe("newsletterSchema", () => {
  it("lowercases and trims email", () => {
    expect(newsletterSchema.parse({ email: "  Fan@Example.com " }).email).toBe("fan@example.com");
  });
  it("rejects invalid email with a friendly message", () => {
    const r = newsletterSchema.safeParse({ email: "fan@" });
    expect(r.success).toBe(false);
    if (!r.success) expect(fieldErrors(r.error).email).toMatch(/valid email/i);
  });
  it("rejects a missing email", () => {
    expect(newsletterSchema.safeParse({}).success).toBe(false);
  });
});

describe("raceQuerySchema", () => {
  it("applies defaults and ignores 'all' / empty values", () => {
    expect(raceQuerySchema.parse({ series: "all", status: "" })).toEqual({ sort: "date_asc" });
  });
  it("parses a comma-separated, case-insensitive series list", () => {
    expect(raceQuerySchema.parse({ series: "wec, imsa" }).series).toEqual(["WEC", "IMSA"]);
  });
  it("rejects unknown series and status", () => {
    expect(raceQuerySchema.safeParse({ series: "F1" }).success).toBe(false);
    expect(raceQuerySchema.safeParse({ status: "postponed" }).success).toBe(false);
  });
  it("coerces season and validates date ranges", () => {
    expect(raceQuerySchema.parse({ season: "2027" }).season).toBe(2027);
    expect(raceQuerySchema.safeParse({ from: "2027-06-01", to: "2027-01-01" }).success).toBe(false);
    expect(raceQuerySchema.safeParse({ from: "not-a-date" }).success).toBe(false);
  });
});

describe("newsQuerySchema", () => {
  it("defaults to page 1 with 6 results", () => {
    expect(newsQuerySchema.parse({})).toEqual({ page: 1, pageSize: 6 });
  });
  it("caps page size and validates category", () => {
    expect(newsQuerySchema.safeParse({ pageSize: "100" }).success).toBe(false);
    expect(newsQuerySchema.safeParse({ category: "gossip" }).success).toBe(false);
    expect(newsQuerySchema.parse({ category: "technical", page: "2" })).toMatchObject({ category: "technical", page: 2 });
  });
});

describe("searchParamsToObject", () => {
  it("takes the first value of repeated keys", () => {
    expect(searchParamsToObject(new URLSearchParams("a=1&a=2&b=3"))).toEqual({ a: "1", b: "3" });
    expect(searchParamsToObject({ a: ["x", "y"], b: undefined })).toEqual({ a: "x" });
  });
});
