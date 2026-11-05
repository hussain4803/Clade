import Image from "next/image";
import { LIVERIES } from "@/content/car";
import { formatDate } from "@/lib/format";
import type { SeasonStats } from "@/lib/stats";
import type { RaceSummary } from "@/lib/types";
import { CarSvg } from "@/components/art/CarSvg";
import { ButtonLink, buttonClasses } from "@/components/ui/Button";
import { ArrowDown } from "@/components/ui/Icons";

const STREAKS = [
  { top: "18%", width: "45%", dur: "2.6s", delay: "0s", color: "var(--avr-blue)" },
  { top: "34%", width: "30%", dur: "3.4s", delay: "0.8s", color: "var(--avr-white)" },
  { top: "52%", width: "55%", dur: "2.2s", delay: "0.3s", color: "var(--avr-orange)" },
  { top: "66%", width: "38%", dur: "3s", delay: "1.4s", color: "var(--avr-blue)" },
  { top: "80%", width: "26%", dur: "2.8s", delay: "2s", color: "var(--avr-white)" },
];

export function Hero({ stats, nextRace }: { stats: SeasonStats; nextRace: RaceSummary | null }) {
  const livery = LIVERIES[0]!;
  const readouts = [
    { label: `${stats.season} wins`, value: String(stats.wins) },
    { label: `${stats.season} podiums`, value: String(stats.podiums) },
    { label: "Le Mans best", value: stats.bestLeMans ? `P${stats.bestLeMans}` : "—" },
    { label: "Next race", value: nextRace ? `${nextRace.shortName} · ${formatDate(nextRace.startDate, nextRace.timeZone)}` : "TBA" },
  ];

  return (
    <section aria-labelledby="hero-title" className="relative isolate -mt-[var(--avr-header-h)] overflow-hidden pt-[var(--avr-header-h)]">
      <Image
        src="/images/hero/night-track.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        quality={70}
        className="-z-20 object-cover object-[60%_center]"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-carbon via-carbon/80 to-carbon/20" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-carbon via-transparent to-carbon/40" aria-hidden="true" />
      <div className="bg-grid absolute inset-0 -z-10 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" aria-hidden="true" />
      <div className="absolute -right-24 top-0 -z-10 hidden h-full w-72 skew-x-[-18deg] border-l border-apex-orange/30 bg-gradient-to-b from-apex-orange/10 to-transparent lg:block" aria-hidden="true" />

      <div className="mx-auto grid w-full max-w-[1320px] gap-10 px-4 pb-10 pt-14 sm:px-6 sm:pt-20 lg:min-h-[calc(100svh-var(--avr-header-h))] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:px-10 lg:pb-28 lg:pt-16">
        <div className="relative z-10 max-w-2xl animate-fade-up">
          <p className="label-tech flex flex-wrap items-center gap-x-3 gap-y-2 text-steel">
            <span className="inline-flex items-center gap-2 text-apex-orange">
              <span className="size-2 rotate-45 bg-apex-orange" aria-hidden="true" />
              Hypercar programme
            </span>
            <span aria-hidden="true">/</span>
            <span>Cars #18 &amp; #81</span>
            <span aria-hidden="true">/</span>
            <span>Est. 2014</span>
          </p>
          <h1 id="hero-title" className="mt-6 text-display-xl font-bold uppercase">
            <span className="block">Apex</span>
            <span className="block">Velocita</span>
            <span className="text-outline block">Racing</span>
          </h1>
          <p className="mt-6 font-display text-display-sm font-semibold text-apex-blue">Engineered for the long night.</p>
          <p className="mt-4 max-w-xl text-lead text-steel">
            Two Hypercars. Seven drivers. One obsession: the 24 Hours of Le Mans. Follow our fictional endurance programme from the banking at Daytona to dawn on the Mulsanne.
          </p>
          <div className="mt-9 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap">
            <ButtonLink href="/races" size="lg">
              View Race Calendar
            </ButtonLink>
            <a href="#team" className={buttonClasses({ variant: "secondary", size: "lg" })}>
              <span>Explore the Team</span>
              <ArrowDown size={18} className="transition-transform duration-200 group-hover:translate-y-0.5" />
            </a>
          </div>
        </div>

        <div className="relative lg:-mr-6 xl:-mr-12">
          <div className="pointer-events-none absolute inset-y-[10%] -left-[20%] right-0 overflow-hidden" aria-hidden="true">
            {STREAKS.map((s, i) => (
              <span
                key={i}
                className="avr-streak absolute right-0 h-px"
                style={
                  {
                    top: s.top,
                    width: s.width,
                    background: `linear-gradient(to left, transparent, ${s.color}, transparent)`,
                    "--dur": s.dur,
                    "--delay": s.delay,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
          <div className="absolute inset-x-[10%] bottom-[8%] h-1/3 rounded-full bg-apex-blue/20 blur-3xl" aria-hidden="true" />
          <CarSvg livery={livery} idPrefix="hero-car" animated className="relative w-full drop-shadow-[0_30px_40px_rgb(0_0_0/0.6)]" />
          <p className="label-tech mt-2 text-right text-[0.62rem] text-steel/80">Illustration · AVR-26 “Notturna” · fictional</p>
        </div>
      </div>

      <div className="relative border-y border-line bg-carbon/70 backdrop-blur">
        <dl className="mx-auto grid w-full max-w-[1320px] grid-cols-2 px-4 sm:px-6 md:grid-cols-4 lg:px-10">
          {readouts.map((r, i) => (
            <div
              key={r.label}
              className={`flex min-w-0 flex-col gap-1 py-4 ${i % 2 === 1 ? "border-l border-line pl-4" : ""} ${i >= 2 ? "border-t border-line md:border-t-0" : ""} ${i === 2 ? "md:border-l md:pl-4" : ""}`}
            >
              <dt className="label-tech text-[0.62rem] text-steel">{r.label}</dt>
              <dd className="truncate font-mono text-base font-bold text-chalk sm:text-lg">{r.value}</dd>
            </div>
          ))}
        </dl>
        <p className="sr-only">Statistics are fictional sample data.</p>
      </div>
    </section>
  );
}
