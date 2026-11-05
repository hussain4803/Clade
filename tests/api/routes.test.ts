/** Calls the real Next.js route handlers against the seeded test database. */
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { POST as contactPOST } from "@/app/api/contact/route";
import { GET as driversGET } from "@/app/api/drivers/route";
import { GET as healthGET } from "@/app/api/health/route";
import { GET as newsItemGET } from "@/app/api/news/[id]/route";
import { GET as newsGET } from "@/app/api/news/route";
import { POST as newsletterPOST } from "@/app/api/newsletter/route";
import { GET as raceGET } from "@/app/api/races/[id]/route";
import { GET as racesGET } from "@/app/api/races/route";
import { prisma } from "@/lib/prisma";

const get = (path: string) => new NextRequest(`http://localhost${path}`);
const post = (path: string, body: unknown, headers: Record<string, string> = { "content-type": "application/json" }) =>
  new Request(`http://localhost${path}`, { method: "POST", headers, body: typeof body === "string" ? body : JSON.stringify(body) });
const params = (id: string) => ({ params: Promise.resolve({ id }) });

type Json = { success: boolean; data?: any; meta?: any; message?: string; error?: { code: string; message: string; fields?: Record<string, string> } }; // eslint-disable-line @typescript-eslint/no-explicit-any
const json = async (res: Response) => (await res.json()) as Json;

describe("GET /api/health", () => {
  it("reports ok with a database check", async () => {
    const res = await healthGET();
    expect(res.status).toBe(200);
    const body = await json(res);
    expect(body.data).toMatchObject({ status: "ok", database: "ok" });
  });
});

describe("GET /api/races", () => {
  it("returns every race sorted by date with metadata", async () => {
    const res = await racesGET(get("/api/races"));
    expect(res.status).toBe(200);
    const body = await json(res);
    expect(body.success).toBe(true);
    expect(body.data).toHaveLength(24);
    expect(body.meta.count).toBe(24);
    const starts = body.data.map((r: { startDate: string }) => r.startDate);
    expect([...starts].sort()).toEqual(starts);
  });

  it("filters by series, status and season and sorts descending", async () => {
    const body = await json(await racesGET(get("/api/races?series=IMSA&season=2026&sort=date_desc")));
    expect(body.data.length).toBe(4);
    expect(body.data.every((r: { series: string }) => r.series === "IMSA")).toBe(true);
    expect(body.data[0].slug).toBe("petit-le-mans-2026");

    const completed = await json(await racesGET(get("/api/races?status=completed")));
    expect(completed.data.every((r: { status: string }) => r.status === "completed")).toBe(true);
  });

  it("rejects invalid filters with field errors", async () => {
    const res = await racesGET(get("/api/races?series=F1&status=soon"));
    expect(res.status).toBe(400);
    const body = await json(res);
    expect(body.error?.code).toBe("VALIDATION_ERROR");
    expect(Object.keys(body.error?.fields ?? {})).toEqual(expect.arrayContaining(["series", "status"]));
  });
});

describe("GET /api/races/[id]", () => {
  it("finds a race by slug and by id", async () => {
    const bySlug = await json(await raceGET(get("/api/races/sebring-12-2026"), params("sebring-12-2026")));
    expect(bySlug.data.circuit.name).toBe("Sebring International Raceway");
    expect(bySlug.data.sessions.length).toBeGreaterThan(3);
    const byId = await json(await raceGET(get(`/api/races/${bySlug.data.id}`), params(bySlug.data.id)));
    expect(byId.data.slug).toBe("sebring-12-2026");
  });

  it("returns 404 JSON for unknown races", async () => {
    const res = await raceGET(get("/api/races/monaco-1929"), params("monaco-1929"));
    expect(res.status).toBe(404);
    expect((await json(res)).error?.code).toBe("NOT_FOUND");
  });
});

describe("GET /api/news", () => {
  it("paginates with metadata", async () => {
    const body = await json(await newsGET(get("/api/news?page=2&pageSize=5")));
    expect(body.data).toHaveLength(5);
    expect(body.meta).toMatchObject({ page: 2, pageSize: 5, total: 18, totalPages: 4 });
  });

  it("filters by category and search term", async () => {
    const cat = await json(await newsGET(get("/api/news?category=technical&pageSize=24")));
    expect(cat.data.length).toBe(3);
    expect(cat.data.every((a: { category: string }) => a.category === "technical")).toBe(true);
    const q = await json(await newsGET(get("/api/news?q=spa")));
    expect(q.data.map((a: { slug: string }) => a.slug)).toContain("spa-first-hypercar-win");
  });

  it("rejects an invalid category", async () => {
    expect((await newsGET(get("/api/news?category=rumours"))).status).toBe(400);
  });
});

describe("GET /api/news/[id]", () => {
  it("returns one article with body and related stories", async () => {
    const body = await json(await newsItemGET(get("/api/news/inside-the-hybrid-system"), params("inside-the-hybrid-system")));
    expect(body.data.title).toMatch(/hybrid/i);
    expect(body.data.body.length).toBeGreaterThan(200);
    expect(body.data.related.length).toBeGreaterThan(0);
  });
  it("returns 404 for unknown articles", async () => {
    expect((await newsItemGET(get("/api/news/nope"), params("nope"))).status).toBe(404);
  });
});

describe("GET /api/drivers", () => {
  it("returns the roster and supports a car filter", async () => {
    expect((await json(await driversGET(get("/api/drivers")))).data).toHaveLength(7);
    const reserve = await json(await driversGET(get("/api/drivers?car=RESERVE")));
    expect(reserve.data.map((d: { lastName: string }) => d.lastName)).toEqual(["Ferrandi"]);
    expect((await driversGET(get("/api/drivers?car=99"))).status).toBe(400);
  });
});

describe("POST /api/contact", () => {
  const valid = { name: "Test Fan", email: "Test.Fan@Example.com", topic: "fans", subject: "Great season", message: "Loved the Petit Le Mans strategy call this year!" };

  it("stores a valid submission", async () => {
    const res = await contactPOST(post("/api/contact", valid));
    expect(res.status).toBe(201);
    const body = await json(res);
    const saved = await prisma.contactSubmission.findUnique({ where: { id: body.data.id } });
    expect(saved).toMatchObject({ email: "test.fan@example.com", topic: "fans", subject: "Great season" });
  });

  it("returns field errors for invalid input", async () => {
    const res = await contactPOST(post("/api/contact", { ...valid, email: "bad", message: "too short" }));
    expect(res.status).toBe(400);
    const body = await json(res);
    expect(body.error?.fields).toMatchObject({ email: expect.any(String), message: expect.any(String) });
  });

  it("handles malformed JSON and wrong content types", async () => {
    expect((await json(await contactPOST(post("/api/contact", "{not json")))).error?.code).toBe("INVALID_JSON");
    expect((await contactPOST(post("/api/contact", "name=x", { "content-type": "application/x-www-form-urlencoded" }))).status).toBe(415);
    expect((await json(await contactPOST(post("/api/contact", "[1,2]")))).error?.code).toBe("INVALID_BODY");
  });

  it("silently drops honeypot submissions", async () => {
    const before = await prisma.contactSubmission.count();
    const res = await contactPOST(post("/api/contact", { ...valid, website: "http://spam.example" }));
    expect(res.status).toBe(201);
    expect(await prisma.contactSubmission.count()).toBe(before);
  });
});

describe("POST /api/newsletter", () => {
  const email = `subscriber-${Date.now()}@example.com`;

  it("subscribes a new email", async () => {
    const res = await newsletterPOST(post("/api/newsletter", { email, source: "test" }));
    expect(res.status).toBe(201);
    expect((await json(res)).data).toMatchObject({ email, alreadySubscribed: false });
    expect(await prisma.newsletterSubscriber.count({ where: { email } })).toBe(1);
  });

  it("treats duplicates (any casing) gracefully", async () => {
    const res = await newsletterPOST(post("/api/newsletter", { email: email.toUpperCase() }));
    expect(res.status).toBe(200);
    const body = await json(res);
    expect(body.success).toBe(true);
    expect(body.data.alreadySubscribed).toBe(true);
    expect(body.message).toMatch(/already subscribed/i);
    expect(await prisma.newsletterSubscriber.count({ where: { email } })).toBe(1);
  });

  it("rejects invalid emails", async () => {
    const res = await newsletterPOST(post("/api/newsletter", { email: "not-an-email" }));
    expect(res.status).toBe(400);
    expect((await json(res)).error?.fields?.email).toMatch(/valid email/i);
  });
});
