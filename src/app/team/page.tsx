import type { Metadata } from "next";
import { ALL_TIME_STATS, MILESTONES, TEAM_STORY } from "@/content/team";
import { listDrivers } from "@/lib/drivers";
import { formatNumber } from "@/lib/format";
import { getNextRace } from "@/lib/races";
import { getSeasonStats } from "@/lib/stats";
import { CrewGrid } from "@/components/team/CrewGrid";
import { DriverProfile } from "@/components/team/DriverCard";
import { SampleBadge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Team",
  description: "Meet the fictional drivers, engineers and crew behind Apex Velocita Racing's two-car Hypercar programme.",
};

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const now = new Date();
  const [drivers, nextRace] = await Promise.all([listDrivers(), getNextRace(now)]);
  const season = await getSeasonStats(nextRace?.season ?? now.getUTCFullYear(), now);

  const groups = [
    { id: "car-18", title: "Car #18", tone: "text-apex-blue", drivers: drivers.filter((d) => d.carNumber === "18") },
    { id: "car-81", title: "Car #81", tone: "text-apex-orange", drivers: drivers.filter((d) => d.carNumber === "81") },
    { id: "reserve", title: "Reserve & simulator", tone: "text-steel", drivers: drivers.filter((d) => d.carNumber === "RESERVE") },
  ];

  const seasonStats = [
    { label: "Races completed", value: formatNumber(season.racesCompleted) },
    { label: "Wins", value: formatNumber(season.wins) },
    { label: "Podiums", value: formatNumber(season.podiums) },
    { label: "Best Le Mans", value: season.bestLeMans ? `P${season.bestLeMans}` : "—" },
    { label: "Laps completed", value: formatNumber(season.lapsCompleted) },
    { label: "Kilometres", value: formatNumber(season.kilometres) },
  ];

  return (
    <>
      <PageHero
        eyebrow="The team"
        title={
          <>
            One crew. <span className="text-apex-blue">Two cars.</span> Twenty-four hours.
          </>
        }
        description={<p>{TEAM_STORY.mission}</p>}
        aside={
          <nav aria-label="On this page" className="border border-line bg-graphite/70 p-5 backdrop-blur">
            <p className="label-tech text-steel">On this page</p>
            <ul className="mt-3 grid grid-cols-2 gap-2">
              {[
                { href: "#story", label: "Story & mission" },
                { href: "#drivers", label: "Drivers" },
                { href: "#crew", label: "Technical crew" },
                { href: "#stats", label: "Statistics" },
              ].map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="label-tech flex min-h-11 items-center border border-line px-3 text-chalk transition-colors hover:border-apex-blue hover:text-apex-blue">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        }
      />

      <section id="story" aria-labelledby="story-title" className="scroll-mt-20 py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <Reveal>
            <SectionHeading id="story-title" index="01" eyebrow="Story & mission" title={TEAM_STORY.heading} />
            <div className="mt-6 space-y-4 text-lead text-steel">
              {TEAM_STORY.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <ul className="mt-10 grid gap-4 sm:grid-cols-3">
              {TEAM_STORY.values.map((v, i) => (
                <li key={v.title} className="border-t-2 border-apex-orange bg-graphite p-5">
                  <span className="label-tech text-apex-orange">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-2 font-display text-lg font-semibold">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-steel">{v.text}</p>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120}>
            <h3 className="label-tech text-apex-blue">Milestones</h3>
            <ol className="relative mt-6 space-y-8 border-l border-line pl-8">
              {MILESTONES.map((m) => (
                <li key={m.year} className="relative">
                  <span className="absolute -left-[2.35rem] top-1 size-3 rotate-45 border border-apex-blue bg-carbon" aria-hidden="true" />
                  <p className="font-mono text-sm font-bold text-apex-blue">{m.year}</p>
                  <h4 className="mt-1 font-display text-xl font-semibold uppercase">{m.title}</h4>
                  <p className="mt-1 text-sm leading-relaxed text-steel">{m.text}</p>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-xs text-steel/80">Team history is fictional sample content.</p>
          </Reveal>
        </Container>
      </section>

      <section id="drivers" aria-labelledby="drivers-title" className="scroll-mt-20 border-t border-line bg-graphite/40 py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              id="drivers-title"
              index="02"
              eyebrow="Driver roster"
              title="The drivers"
              description={<p>Seven fictional drivers share two AVR-26s across the world&apos;s great endurance races. Numbers shown are personal driver numbers.</p>}
              action={<SampleBadge label="Fictional profiles" />}
            />
          </Reveal>
          <div className="mt-12 space-y-14">
            {groups.map((g) => (
              <div key={g.id} id={g.id} className="scroll-mt-24">
                <Reveal>
                  <h3 className={`flex items-baseline gap-3 border-b border-line pb-3 font-display text-2xl font-bold uppercase ${g.tone}`}>
                    {g.title}
                    <span className="label-tech text-steel">{g.drivers.length} driver{g.drivers.length === 1 ? "" : "s"}</span>
                  </h3>
                </Reveal>
                <ul className="mt-6 grid gap-6 xl:grid-cols-2">
                  {g.drivers.map((d, i) => (
                    <Reveal as="li" key={d.id} delay={i * 80}>
                      <DriverProfile driver={d} />
                    </Reveal>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section id="crew" aria-labelledby="crew-title" className="scroll-mt-20 py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              id="crew-title"
              index="03"
              eyebrow="Technical crew"
              title="The people behind the pit wall"
              description={<p>Engineers, strategists and mechanics who keep both cars running through the night. All names are fictional.</p>}
            />
          </Reveal>
          <Reveal delay={100} className="mt-12">
            <CrewGrid />
          </Reveal>
        </Container>
      </section>

      <section id="stats" aria-labelledby="stats-title" className="scroll-mt-20 border-t border-line bg-carbon-weave py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              id="stats-title"
              index="04"
              eyebrow="Team statistics"
              title="By the numbers"
              action={<SampleBadge />}
              description={<p>Season figures are calculated live from the sample results in the database. All-time figures are fictional.</p>}
            />
          </Reveal>
          <Reveal delay={80} className="mt-12">
            <h3 className="label-tech text-apex-blue">{season.season} season</h3>
            <dl className="mt-4 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
              {seasonStats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse bg-graphite p-5">
                  <dt className="label-tech mt-2 text-[0.62rem] text-steel">{s.label}</dt>
                  <dd className="font-mono text-display-sm font-bold tabular">{s.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={140} className="mt-10">
            <h3 className="label-tech text-apex-orange">All time · since 2014</h3>
            <dl className="mt-4 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
              {ALL_TIME_STATS.map((s) => (
                <div key={s.label} className="flex flex-col-reverse bg-graphite p-5">
                  <dt className="label-tech mt-2 text-[0.62rem] text-steel">{s.label}</dt>
                  <dd className="font-mono text-display-sm font-bold tabular">
                    {s.value}
                    {s.suffix && <span className="text-apex-orange">{s.suffix}</span>}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <div className="mt-12 flex flex-wrap gap-3">
            <ButtonLink href="/races">View Race Calendar</ButtonLink>
            <ButtonLink href="/contact?topic=careers" variant="secondary">
              Join the crew
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
