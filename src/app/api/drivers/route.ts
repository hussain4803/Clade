import type { NextRequest } from "next/server";
import { jsonOk, serverError, validationError } from "@/lib/api";
import { listDrivers } from "@/lib/drivers";
import { driverQuerySchema, searchParamsToObject } from "@/lib/validation";

export const dynamic = "force-dynamic";

/** GET /api/drivers?car=18|81|RESERVE */
export async function GET(request: NextRequest) {
  const parsed = driverQuerySchema.safeParse(searchParamsToObject(request.nextUrl.searchParams));
  if (!parsed.success) return validationError(parsed.error, "Invalid driver filter.");
  try {
    const drivers = await listDrivers(parsed.data);
    return jsonOk(drivers, { meta: { count: drivers.length, sampleContent: true } });
  } catch (err) {
    return serverError(err, "GET /api/drivers");
  }
}
