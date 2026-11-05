import type { Driver, Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import type { DriverDTO } from "./types";

export function toDriverDTO(d: Driver): DriverDTO {
  return {
    id: d.id,
    slug: d.slug,
    firstName: d.firstName,
    lastName: d.lastName,
    fullName: `${d.firstName} ${d.lastName}`,
    number: d.number,
    role: d.role,
    carNumber: d.carNumber as DriverDTO["carNumber"],
    nationality: d.nationality,
    countryCode: d.countryCode,
    birthYear: d.birthYear,
    rating: d.rating,
    bio: d.bio,
    quote: d.quote,
    helmetImage: d.helmetImage,
    stats: { starts: d.starts, wins: d.wins, podiums: d.podiums, poles: d.poles },
  };
}

export async function listDrivers(filter: { car?: DriverDTO["carNumber"] } = {}): Promise<DriverDTO[]> {
  const where: Prisma.DriverWhereInput = filter.car ? { carNumber: filter.car } : {};
  const rows = await prisma.driver.findMany({ where, orderBy: { order: "asc" } });
  return rows.map(toDriverDTO);
}
