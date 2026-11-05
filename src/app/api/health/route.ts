import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const started = Date.now();
  let database: "ok" | "error" = "ok";
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    console.error("[api] health check database error:", err);
    database = "error";
  }
  const healthy = database === "ok";
  return NextResponse.json(
    {
      success: healthy,
      data: {
        status: healthy ? "ok" : "degraded",
        service: "apex-velocita-racing",
        database,
        uptimeSeconds: Math.round(process.uptime()),
        responseTimeMs: Date.now() - started,
        timestamp: new Date().toISOString(),
      },
    },
    { status: healthy ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
}
