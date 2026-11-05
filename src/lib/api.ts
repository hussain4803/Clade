import { NextResponse } from "next/server";
import { z } from "zod";
import { fieldErrors } from "./validation";

export type ApiSuccess<T, M = Record<string, unknown>> = { success: true; data: T; message?: string; meta?: M };

export type ApiErrorBody = {
  success: false;
  error: { code: string; message: string; fields?: Record<string, string> };
};

const noStore = { "Cache-Control": "no-store" };

export function jsonOk<T, M = undefined>(
  data: T,
  opts: { status?: number; meta?: M; message?: string } = {},
): NextResponse {
  const body: Record<string, unknown> = { success: true, data };
  if (opts.message) body.message = opts.message;
  if (opts.meta !== undefined) body.meta = opts.meta;
  return NextResponse.json(body, { status: opts.status ?? 200, headers: noStore });
}

export function jsonError(
  status: number,
  code: string,
  message: string,
  fields?: Record<string, string>,
  headers?: Record<string, string>,
): NextResponse {
  const body: ApiErrorBody = { success: false, error: { code, message, ...(fields ? { fields } : {}) } };
  return NextResponse.json(body, { status, headers: { ...noStore, ...headers } });
}

export function validationError(error: z.ZodError, message = "Some fields need attention."): NextResponse {
  return jsonError(400, "VALIDATION_ERROR", message, fieldErrors(error));
}

/** Reads a JSON object body, returning a ready-made error response when it is not one. */
export async function readJsonBody(
  request: Request,
): Promise<{ ok: true; body: unknown } | { ok: false; response: NextResponse }> {
  const type = request.headers.get("content-type") ?? "";
  if (!type.toLowerCase().includes("application/json")) {
    return {
      ok: false,
      response: jsonError(415, "UNSUPPORTED_MEDIA_TYPE", "Send the request body as application/json."),
    };
  }
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 16_384) {
    return { ok: false, response: jsonError(413, "PAYLOAD_TOO_LARGE", "Request body is too large.") };
  }
  try {
    const body: unknown = await request.json();
    if (body === null || typeof body !== "object" || Array.isArray(body)) {
      return { ok: false, response: jsonError(400, "INVALID_BODY", "Request body must be a JSON object.") };
    }
    return { ok: true, body };
  } catch {
    return { ok: false, response: jsonError(400, "INVALID_JSON", "Request body is not valid JSON.") };
  }
}

/** Logs unexpected failures and returns a generic 500 without leaking internals. */
export function serverError(err: unknown, context: string): NextResponse {
  console.error(`[api] ${context}:`, err);
  return jsonError(500, "INTERNAL_ERROR", "Something went wrong on our side. Please try again shortly.");
}

export function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "local";
}
