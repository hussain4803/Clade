import { CarHighlight } from "@/components/home/CarHighlight";
import { Hero } from "@/components/home/Hero";
import { LatestNews } from "@/components/home/LatestNews";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { NextRaceBand } from "@/components/home/NextRaceBand";
import { PartnerStrip } from "@/components/home/PartnerStrip";
import { TeamPreview } from "@/components/home/TeamPreview";
import { listDrivers } from "@/lib/drivers";
import { getLatestArticles } from "@/lib/news";
import { getNextRace } from "@/lib/races";
import { getSeasonStats } from "@/lib/stats";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const now = new Date();
  const [nextRace, drivers, articles] = await Promise.all([getNextRace(now), listDrivers(), getLatestArticles(3)]);
  // Stats for the season in progress (or the most recent one when between seasons).
  const season = nextRace?.season ?? now.getUTCFullYear();
  const stats = await getSeasonStats(season, now);

  return (
    <>
      <Hero stats={stats} nextRace={nextRace} />
      <NextRaceBand race={nextRace} now={now.getTime()} />
      <TeamPreview drivers={drivers} stats={stats} />
      <CarHighlight />
      <LatestNews articles={articles} />
      <PartnerStrip />
      <NewsletterSection />
    </>
  );
}
