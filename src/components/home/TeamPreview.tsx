import { TEAM_STORY } from "@/content/team";
import type { SeasonStats } from "@/lib/stats";
import type { DriverDTO } from "@/lib/types";
import { DriverTile } from "@/components/team/DriverCard";
import { SampleBadge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatNumber } from "@/lib/format";

export function TeamPreview({ drivers, stats }: { drivers: DriverDTO[]; stats: SeasonStats }) {
  const crews = [
    { car: "18", label: "Car #18", tone: "text-apex-blue", drivers: drivers.filter((d) => d.carNumber === "18") },
    { car: "81", label: "Car #81", tone: "text-apex-orange", drivers: drivers.filter((d) => d.carNumber === "81") },
  ];
  const statTiles = [
    { label: "Races completed", value: stats.racesCompleted },
    { label: "Victories", value: stats.wins },
    { label: "Podiums", value: stats.podiums },
    { label: "Kilometres raced", value: formatNumber(stats.kilometres) },
  ];

  return (
    <section id="team" aria-labelledby="team-title" className="relative scroll-mt-[var(--avr-header-h)] py-20 sm:py-24">
      <div className="bg-grid absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" aria-hidden="true" />
      <Container>
        <Reveal>
          <SectionHeading
            id="team-title"
            index="01"
            eyebrow="The Team"
            title={TEAM_STORY.heading}
            description={<p>{TEAM_STORY.mission}</p>}
            action={
              <ButtonLink href="/team" variant="secondary">
                Meet the Drivers
              </ButtonLink>
            }
          />
        </Reveal>

        <Reveal delay={100} className="mt-12">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h3 className="label-tech text-steel">{stats.season} season so far</h3>
            <SampleBadge />
          </div>
          <dl className="grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-4">
            {statTiles.map((s) => (
              <div key={s.label} className="flex flex-col-reverse bg-graphite p-5 sm:p-6">
                <dt className="label-tech mt-2 text-[0.64rem] text-steel">{s.label}</dt>
                <dd className="font-mono text-display-sm font-bold tabular text-chalk">{s.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          {crews.map((crew, ci) => (
            <Reveal key={crew.car} delay={ci * 120}>
              <div className="flex items-baseline justify-between border-b border-line pb-3">
                <h3 className={`font-display text-2xl font-bold uppercase ${crew.tone}`}>{crew.label}</h3>
                <span className="label-tech text-steel">AVR-26 · Hypercar</span>
              </div>
              <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {crew.drivers.map((d) => (
                  <li key={d.id}>
                    <DriverTile driver={d} />
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
