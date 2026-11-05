import { CAR, LIVERIES } from "@/content/car";
import { CarSvg } from "@/components/art/CarSvg";
import { SampleBadge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function CarHighlight() {
  return (
    <section aria-labelledby="car-title" className="relative overflow-hidden border-y border-line bg-carbon-weave py-20 sm:py-24">
      <div className="absolute inset-y-0 left-1/2 -z-0 w-[140%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgb(0_163_255/0.12),transparent_60%)]" aria-hidden="true" />
      <Container className="relative">
        <Reveal>
          <SectionHeading
            id="car-title"
            index="02"
            eyebrow="The Car"
            title={
              <>
                {CAR.name} <span className="text-apex-blue">“{CAR.nickname}”</span>
              </>
            }
            description={<p>{CAR.intro}</p>}
            action={<ButtonLink href="/cars">Explore the AVR-26</ButtonLink>}
          />
        </Reveal>
        <Reveal delay={100} className="relative mt-10">
          <CarSvg livery={LIVERIES[0]!} idPrefix="home-car" className="mx-auto w-full max-w-5xl" />
          <div className="mx-auto mt-2 h-px max-w-5xl bg-gradient-to-r from-transparent via-apex-blue/60 to-transparent" aria-hidden="true" />
        </Reveal>
        <Reveal delay={160} className="mt-10">
          <div className="mb-3 flex justify-end">
            <SampleBadge label="Demo specifications" />
          </div>
          <dl className="grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-4">
            {CAR.headline.map((h) => (
              <div key={h.label} className="flex flex-col-reverse bg-graphite p-5 sm:p-6">
                <dt className="label-tech mt-2 text-[0.64rem] text-steel">
                  {h.label} <span className="text-steel/70">· {h.note}</span>
                </dt>
                <dd className="font-mono font-bold text-chalk">
                  <span className="text-display-sm tabular">{h.value}</span> <span className="text-sm text-apex-blue">{h.unit}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
