import type { Metadata } from "next";
import { CAR, LIVERIES, SETUP_COMPARISON, SPEC_GROUPS } from "@/content/car";
import { CarSvg } from "@/components/art/CarSvg";
import { LiveryShowcase } from "@/components/cars/LiveryShowcase";
import { SpecCard } from "@/components/cars/SpecCard";
import { SampleBadge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { InfoIcon } from "@/components/ui/Icons";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Cars",
  description: "The fictional AVR-26 “Notturna” Hypercar: powertrain, aerodynamics, fuel system, tyres and endurance setup. All specifications are demo data.",
};

export default function CarsPage() {
  return (
    <>
      <PageHero
        eyebrow="Hypercar profile"
        title={
          <>
            {CAR.name} <span className="text-apex-blue">“{CAR.nickname}”</span>
          </>
        }
        description={<p>{CAR.intro}</p>}
        aside={
          <div className="relative">
            <CarSvg livery={LIVERIES[0]!} idPrefix="cars-hero" animated className="w-full" />
            <p className="label-tech mt-1 text-right text-[0.6rem] text-steel">{CAR.category}</p>
          </div>
        }
      >
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <SampleBadge label="All specifications are sample / demo data" />
        </div>
      </PageHero>

      <section aria-labelledby="headline-title" className="py-16">
        <Container>
          <h2 id="headline-title" className="sr-only">
            Headline figures
          </h2>
          <dl className="grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-4">
            {CAR.headline.map((h) => (
              <div key={h.label} className="flex flex-col-reverse bg-graphite p-5 sm:p-6">
                <dt className="label-tech mt-2 text-[0.64rem] text-steel">
                  {h.label} <span className="text-steel/70">· {h.note}</span>
                </dt>
                <dd className="font-mono font-bold">
                  <span className="text-display-md tabular">{h.value}</span> <span className="text-sm text-apex-blue">{h.unit}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section id="specifications" aria-labelledby="specs-title" className="scroll-mt-20 py-12 sm:py-16">
        <Container>
          <Reveal>
            <SectionHeading
              id="specs-title"
              index="01"
              eyebrow="Technical specifications"
              title="Under the bodywork"
              description={
                <p className="flex items-start gap-2">
                  <InfoIcon size={18} className="mt-1 shrink-0 text-apex-orange" />
                  <span>
                    <strong className="text-chalk">Sample/demo data.</strong> These figures are illustrative, loosely modelled on modern endurance prototypes, and do not describe any real car.
                  </span>
                </p>
              }
            />
          </Reveal>
          <ul className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {SPEC_GROUPS.map((g, i) => (
              <Reveal as="li" key={g.id} delay={(i % 3) * 80}>
                <SpecCard group={g} index={i} />
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="setup-title" className="py-12 sm:py-16">
        <Container>
          <Reveal>
            <SectionHeading id="setup-title" index="02" eyebrow="Endurance setup" title="One car, three philosophies" description={<p>How the AVR-26 is configured for different race formats (sample data).</p>} />
          </Reveal>
          <Reveal delay={100} className="mt-10">
            <div className="overflow-x-auto border border-line" role="region" aria-labelledby="setup-title" tabIndex={0}>
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <caption className="sr-only">Sample setup comparison across race formats</caption>
                <thead>
                  <tr className="bg-graphite">
                    <th scope="col" className="label-tech p-4 text-steel">
                      Parameter
                    </th>
                    {SETUP_COMPARISON.columns.map((c, i) => (
                      <th key={c} scope="col" className={`label-tech p-4 ${i === 0 ? "text-apex-orange" : "text-apex-blue"}`}>
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SETUP_COMPARISON.rows.map((r) => (
                    <tr key={r.label} className="border-t border-line transition-colors hover:bg-graphite/60">
                      <th scope="row" className="p-4 font-display font-semibold text-chalk">
                        {r.label}
                      </th>
                      {r.values.map((v, i) => (
                        <td key={i} className="p-4 text-steel">
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </Container>
      </section>

      <section id="liveries" aria-labelledby="livery-title" className="scroll-mt-20 border-y border-line bg-carbon-weave py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              id="livery-title"
              index="03"
              eyebrow="Livery showcase"
              title="Dressed for the night"
              description={<p>Three liveries for three missions. Select one to inspect it — use the arrow keys to switch between tabs.</p>}
            />
          </Reveal>
          <Reveal delay={100} className="mt-10">
            <LiveryShowcase liveries={LIVERIES} />
          </Reveal>
        </Container>
      </section>

      <section className="py-20">
        <Container className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-display-sm font-bold uppercase">See it race</h2>
            <p className="mt-2 text-steel">Follow both AVR-26s through the season calendar.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/races">View Race Calendar</ButtonLink>
            <ButtonLink href="/team" variant="secondary">
              Meet the Drivers
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
