import { clientIp, jsonError, jsonOk, readJsonBody, serverError, validationError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

/** POST /api/contact — validates and stores a contact message. */
export async function POST(request: Request) {
  const limit = rateLimit(`contact:${clientIp(request)}`, 5, 60_000);
  if (!limit.allowed) {
    return jsonError(429, "RATE_LIMITED", "Too many messages. Please wait a minute and try again.", undefined, {
      "Retry-After": String(limit.retryAfterSeconds),
    });
  }

  const body = await readJsonBody(request);
  if (!body.ok) return body.response;

  const parsed = contactSchema.safeParse(body.body);
  if (!parsed.success) return validationError(parsed.error);

  const { website, ...data } = parsed.data;
  // Honeypot filled: pretend success without storing anything.
  if (website) return jsonOk({ id: "ignored", receivedAt: new Date().toISOString() }, { status: 201, message: "Message received." });

  try {
    const saved = await prisma.contactSubmission.create({ data, select: { id: true, createdAt: true } });
    return jsonOk(
      { id: saved.id, receivedAt: saved.createdAt.toISOString() },
      { status: 201, message: "Thanks — your message is in the pit lane. We'll reply to the email you provided." },
    );
  } catch (err) {
    return serverError(err, "POST /api/contact");
  }
}
