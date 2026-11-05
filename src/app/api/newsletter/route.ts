import { clientIp, jsonError, jsonOk, readJsonBody, serverError, validationError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { newsletterSchema } from "@/lib/validation";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

/** POST /api/newsletter — stores a subscription; duplicates are reported, not errors. */
export async function POST(request: Request) {
  const limit = rateLimit(`newsletter:${clientIp(request)}`, 10, 60_000);
  if (!limit.allowed) {
    return jsonError(429, "RATE_LIMITED", "Too many attempts. Please wait a minute and try again.", undefined, {
      "Retry-After": String(limit.retryAfterSeconds),
    });
  }

  const body = await readJsonBody(request);
  if (!body.ok) return body.response;

  const parsed = newsletterSchema.safeParse(body.body);
  if (!parsed.success) return validationError(parsed.error, "Please enter a valid email address.");

  const { email, source, website } = parsed.data;
  if (website) return jsonOk({ email, alreadySubscribed: false }, { status: 201, message: "You're on the grid." });

  try {
    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (existing) {
      return jsonOk(
        { email, alreadySubscribed: true, subscribedAt: existing.createdAt.toISOString() },
        { status: 200, message: "You're already subscribed — race-week briefings will keep coming to this inbox." },
      );
    }
    const created = await prisma.newsletterSubscriber.create({ data: { email, source: source || "website" } });
    return jsonOk(
      { email, alreadySubscribed: false, subscribedAt: created.createdAt.toISOString() },
      { status: 201, message: "You're on the grid. Expect race-week briefings and paddock news." },
    );
  } catch (err) {
    // Two concurrent requests for the same email: the unique constraint wins, report as duplicate.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return jsonOk({ email, alreadySubscribed: true }, { status: 200, message: "You're already subscribed." });
    }
    return serverError(err, "POST /api/newsletter");
  }
}
