import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@/lib/cn";
import { formatDateRange, formatNumber, formatShortDay, formatTime, formatZone, ordinal } from "@/lib/format";
import { getRaceStatus } from "@/lib/race-status";
import { getRace } from "@/lib/races";
import { CircuitTrace } from "@/components/art/CircuitTrace";
import { Countdown } from "@/components/races/Countdown";
import { LocalTime } from "@/components/races/LocalTime";
import { ResultsTable } from "@/components/races/ResultsTable";
import { SampleBadge, SeriesBadge, StatusBadge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowLeft, ChevronLeft, ChevronRight, ClockIcon, FlagIcon, PinIcon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const race = await getRace(slug);
  if (!race) return { title: "Race not found" };
  return {
    title: `${race.name} ${race.season}`,
    description: `${race.summary} Circuit guide, session schedule and sample results.`,
    openGraph: { images: [{ url: race.heroImage }] },
  };
}

const SESSION_STATUS_STYLES = {
  upcoming: "text-steel",
  live: "text-[#ff7b7b]",
  completed: "text-steel/60",
} as const;

export default async function RaceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const now = new Date();
  const race = await getRace(slug, now);
  if (!race) notFound();

  const circuitKey = race.slug.replace(/-\d{4}$/, "");
  const teamResults = race.results.filter((r) => r.isTeamEntry);
  const facts = [
    { label: "Length", value: `${formatNumber(race.circuit.lengthKm, 3)} km` },
    { label: "Turns", value: String(race.circuit.turns) },
    { label: "Race distance", value: race.durationLabel },
    { label: "Track time zone", value: `${formatZone(race.startDate, race.timeZone)} · ${race.timeZone}` },
  ];

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-line">
        <Image src={race.heroImage} alt="" fill priority sizes="100vw" className="-z-20 object-cover opacity-60" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-carbon via-carbon/90 to-carbon/40" aria-hidden="true" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-carbon to-transparent" aria-hidden="true" />
        <Container className="py-10 sm:py-14">
          <nav aria-label="Breadcrumb">
            <ol className="label-tech flex flex-wrap items-center gap-2 text-steel">
              <li>
                <Link href="/races" className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-chalk">
                  <ArrowLeft size={16} /> All races
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-chalk">
                {race.shortName} {race.season}
              </li>
            </ol>
          </nav>
          <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end">
            <div className="animate-fade-up">
              <div className="flex flex-wrap items-center gap-2">
                <SeriesBadge series={race.series} />
                <StatusBadge status={race.status} />
                <span className="label-tech text-steel">
                  Season {race.season} · Round {race.round}
                </span>
              </div>
              <h1 className="mt-5 text-display-lg font-bold uppercase">
                {race.name} <span className="text-outline">{race.season}</span>
              </h1>
              <p className="mt-4 max-w-2xl text-lead text-steel">{race.description}</p>
              <ul className="mt-6 flex flex-col gap-2 text-sm text-steel sm:flex-row sm:flex-wrap sm:gap-x-6">
                <li className="flex items-center gap-2">
                  <PinIcon size={18} className="shrink-0 text-apex-blue" />
                  {race.circuit.name}, {race.circuit.city}
                </li>
                <li className="flex items-center gap-2">
                  <FlagIcon size={18} className="shrink-0 text-apex-blue" />
                  {formatDateRange(race.startDate, race.endDate, race.timeZone)}
                </li>
                <li className="flex items-center gap-2">
                  <ClockIcon size={18} className="shrink-0 text-apex-blue" />
                  Start {formatTime(race.startDate, race.timeZone)} {formatZone(race.startDate, race.timeZone)} · your time <LocalTime iso={race.startDate} withDay />
                </li>
              </ul>
            </div>
            <div className="chamfer border border-line bg-graphite/90 p-5 backdrop-blur sm:p-6">
              {race.status === "completed" ? (
                <div>
                  <p className="label-tech text-steel">Chequered flag</p>
                  {teamResults.length ? (
                    <ul className="mt-4 grid grid-cols-2 gap-3">
                      {teamResults.map((r) => (
                        <li key={r.carNumber} className="border border-line bg-carbon/60 p-4">
                          <p className="label-tech text-[0.62rem] text-steel">Car #{r.carNumber}</p>
                          <p className={cn("mt-1 font-mono text-3xl font-bold", r.status === "CLASSIFIED" && r.position <= 3 ? "text-apex-orange" : "text-chalk")}>
                            {r.status === "CLASSIFIED" ? ordinal(r.position) : "DNF"}
                          </p>
                          <p className="label-tech mt-1 text-[0.6rem] text-steel">{r.laps} laps</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-steel">Results pending.</p>
                  )}
                  <p className="mt-3 text-xs text-steel">Fictional sample results.</p>
                </div>
              ) : (
                <Countdown
                  startIso={race.startDate}
                  endIso={race.endDate}
                  initialNow={now.getTime()}
                  size="lg"
                  description={`${race.name} starts ${formatDateRange(race.startDate, race.endDate, race.timeZone)} at ${formatTime(race.startDate, race.timeZone)} track time.`}
                />
              )}
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="circuit-title" className="py-14 sm:py-16">
        <Container className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Reveal className="border border-line bg-graphite p-5 sm:p-8">
            <p className="label-tech text-apex-blue">Circuit guide</p>
            <h2 id="circuit-title" className="mt-2 font-display text-display-sm font-bold uppercase">
              {race.circuit.name}
            </h2>
            <p className="mt-1 text-sm text-steel">
              {race.circuit.city}, {race.circuit.country}
            </p>
            <div className="bg-grid-fine relative mt-6 border border-line bg-carbon/60 p-4">
              <CircuitTrace circuitKey={circuitKey} label={`Stylized outline representing ${race.circuit.name}; not to scale`} className="mx-auto w-full max-w-md" />
              <p className="label-tech mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[0.58rem] text-steel">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-0.5 w-4 bg-apex-blue" aria-hidden="true" /> S1
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-0.5 w-4 bg-apex-orange" aria-hidden="true" /> S2
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-0.5 w-4 bg-chalk" aria-hidden="true" /> S3
                </span>
                <span className="ml-auto">Stylized graphic · not to scale</span>
              </p>
            </div>
          </Reveal>
          <Reveal delay={100} className="flex flex-col gap-6">
            <dl className="grid grid-cols-2 gap-px border border-line bg-line">
              {facts.map((f) => (
                <div key={f.label} className="flex flex-col-reverse bg-graphite p-5">
                  <dt className="label-tech mt-2 text-[0.62rem] text-steel">{f.label}</dt>
                  <dd className="font-mono text-lg font-bold text-chalk">{f.value}</dd>
                </div>
              ))}
            </dl>
            <div className="border border-line bg-graphite p-5 sm:p-6">
              <h3 className="label-tech text-apex-orange">What makes it hard</h3>
              <p className="mt-3 leading-relaxed text-steel">{race.circuit.note}</p>
            </div>
            <p className="text-xs text-steel">Circuit figures are approximate and provided for demo context.</p>
          </Reveal>
        </Container>
      </section>

      <section aria-labelledby="schedule-title" className="py-10 sm:py-14">
        <Container>
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="label-tech text-apex-blue">Race week</p>
                <h2 id="schedule-title" className="mt-2 font-display text-display-sm font-bold uppercase">
                  Session schedule
                </h2>
              </div>
              <SampleBadge label="Sample schedule" />
            </div>
            <div className="mt-6 overflow-x-auto border border-line" role="region" aria-labelledby="schedule-title" tabIndex={0}>
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <caption className="sr-only">Session times shown in local track time ({formatZone(race.startDate, race.timeZone)}) with your local time alongside.</caption>
                <thead>
                  <tr className="bg-graphite">
                    {["Session", "Day", "Track time", "Your time", "Status"].map((h) => (
                      <th key={h} scope="col" className="label-tech p-3 text-steel first:pl-4">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {race.sessions.map((s) => {
                    const st = getRaceStatus(new Date(s.startsAt), new Date(s.endsAt), now);
                    return (
                      <tr key={s.id} className={cn("border-t border-line", s.kind === "RACE" && "bg-apex-orange/8")}>
                        <th scope="row" className="p-3 pl-4 font-display font-semibold">
                          <span className="flex items-center gap-2">
                            <span className={cn("size-1.5 rotate-45", s.kind === "RACE" ? "bg-apex-orange" : s.kind === "QUALIFYING" ? "bg-apex-blue" : "bg-steel")} aria-hidden="true" />
                            {s.name}
                          </span>
                        </th>
                        <td className="whitespace-nowrap p-3 text-steel">{formatShortDay(s.startsAt, race.timeZone)}</td>
                        <td className="whitespace-nowrap p-3 font-mono tabular">
                          {formatTime(s.startsAt, race.timeZone)}–{formatTime(s.endsAt, race.timeZone)}
                        </td>
                        <td className="whitespace-nowrap p-3 font-mono text-steel">
                          <LocalTime iso={s.startsAt} withDay />
                        </td>
                        <td className={cn("label-tech p-3 text-[0.62rem]", SESSION_STATUS_STYLES[st])}>{st === "completed" ? "Done" : st === "live" ? "Live" : "Upcoming"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Reveal>
        </Container>
      </section>

      <section aria-labelledby="results-title" className="py-10 sm:py-14">
        <Container>
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="label-tech text-apex-blue">Classification</p>
                <h2 id="results-title" className="mt-2 font-display text-display-sm font-bold uppercase">
                  Results
                </h2>
              </div>
              <SampleBadge label="Fictional results" />
            </div>
            <div className="mt-6">
              {race.results.length ? (
                <ResultsTable results={race.results} raceName={`${race.name} ${race.season}`} />
              ) : (
                <div className="border border-dashed border-line-strong p-8 text-center text-steel">
                  {race.status === "completed" ? "Provisional results are pending." : "Results will appear here after the chequered flag."}
                </div>
              )}
            </div>
            <p className="mt-3 text-xs text-steel">All competitors, drivers and classifications are invented for this demo and do not reflect any real race.</p>
          </Reveal>
        </Container>
      </section>

      <nav aria-label="Race navigation" className="py-10">
        <Container className="grid gap-3 sm:grid-cols-2">
          {race.previous ? (
            <Link href={`/races/${race.previous.slug}`} className="group flex min-h-20 items-center gap-4 border border-line bg-graphite p-5 transition-colors hover:border-apex-blue">
              <ChevronLeft size={22} className="shrink-0 text-apex-blue transition-transform group-hover:-translate-x-1" />
              <span>
                <span className="label-tech block text-steel">Previous event</span>
                <span className="font-display text-lg font-semibold uppercase">{race.previous.shortName} {race.previous.season}</span>
              </span>
            </Link>
          ) : (
            <span />
          )}
          {race.next ? (
            <Link href={`/races/${race.next.slug}`} className="group flex min-h-20 items-center justify-end gap-4 border border-line bg-graphite p-5 text-right transition-colors hover:border-apex-blue">
              <span>
                <span className="label-tech block text-steel">Next event</span>
                <span className="font-display text-lg font-semibold uppercase">{race.next.shortName} {race.next.season}</span>
              </span>
              <ChevronRight size={22} className="shrink-0 text-apex-blue transition-transform group-hover:translate-x-1" />
            </Link>
          ) : null}
        </Container>
        <Container className="mt-8 flex justify-center">
          <ButtonLink href="/races" variant="secondary">
            Back to calendar
          </ButtonLink>
        </Container>
      </nav>
    </>
  );
}
