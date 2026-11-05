/**
 * Seeds the SQLite database with fictional sample data.
 * Safe to re-run: content tables are cleared and rebuilt; form submissions are preserved
 * unless SEED_RESET_SUBMISSIONS=true.
 */
import { PrismaClient } from "@prisma/client";
import { ARTICLES, AUTHORS } from "./seed-data/articles";
import { DRIVERS } from "./seed-data/drivers";
import { buildRaces } from "./seed-data/races";

const prisma = new PrismaClient();

function readMinutes(body: string): number {
  const words = body.split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(words / 200));
}

async function main() {
  const races = buildRaces();

  await prisma.$transaction([
    prisma.raceResult.deleteMany(),
    prisma.raceSession.deleteMany(),
    prisma.race.deleteMany(),
    prisma.driver.deleteMany(),
    prisma.article.deleteMany(),
  ]);

  if (process.env.SEED_RESET_SUBMISSIONS === "true") {
    await prisma.$transaction([prisma.contactSubmission.deleteMany(), prisma.newsletterSubscriber.deleteMany()]);
  }

  for (const race of races) {
    const { sessions, results, ...data } = race;
    await prisma.race.create({
      data: {
        ...data,
        sessions: { create: sessions },
        results: { create: results },
      },
    });
  }

  await prisma.driver.createMany({
    data: DRIVERS.map((d, i) => {
      const { helmet, ...driver } = d;
      void helmet; // artwork colours are only used by the image generator
      return { ...driver, helmetImage: `/images/drivers/${d.slug}.webp`, order: i + 1 };
    }),
  });

  await prisma.article.createMany({
    data: ARTICLES.map((a) => ({
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      body: a.body,
      category: a.category,
      tags: a.tags.join(","),
      author: AUTHORS[a.author].name,
      authorRole: AUTHORS[a.author].role,
      coverImage: `/images/news/${a.slug}.webp`,
      coverAlt: a.coverAlt,
      readMinutes: readMinutes(a.body),
      featured: a.featured ?? false,
      publishedAt: new Date(a.publishedAt),
    })),
  });

  const [raceCount, resultCount, driverCount, articleCount] = await Promise.all([
    prisma.race.count(),
    prisma.raceResult.count(),
    prisma.driver.count(),
    prisma.article.count(),
  ]);
  console.log(
    `Seeded ${raceCount} races (${resultCount} result rows), ${driverCount} drivers, ${articleCount} articles — all fictional sample data.`,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
