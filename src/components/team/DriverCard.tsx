import Image from "next/image";
import { cn } from "@/lib/cn";
import type { DriverDTO } from "@/lib/types";

export function carLabel(car: DriverDTO["carNumber"]) {
  return car === "RESERVE" ? "Reserve" : `Car #${car}`;
}

/** Compact driver tile used on the home page. */
export function DriverTile({ driver, className }: { driver: DriverDTO; className?: string }) {
  return (
    <article className={cn("group relative overflow-hidden border border-line bg-graphite transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-apex-blue/60", className)}>
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={driver.helmetImage}
          alt={`Helmet illustration for ${driver.fullName}`}
          fill
          sizes="(min-width: 1280px) 200px, (min-width: 768px) 30vw, 45vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 font-mono text-2xl font-bold text-chalk/90">#{String(driver.number).padStart(2, "0")}</span>
      </div>
      <div className="border-t border-line p-4">
        <h3 className="font-display text-lg font-semibold uppercase leading-tight">
          <span className="block text-sm font-medium text-steel">{driver.firstName}</span>
          {driver.lastName}
        </h3>
        <p className="label-tech mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.62rem] text-steel">
          <span className="text-apex-blue">{carLabel(driver.carNumber)}</span>
          <span aria-hidden="true">·</span>
          <span>{driver.countryCode}</span>
        </p>
      </div>
    </article>
  );
}

/** Full profile card used on the team page. */
export function DriverProfile({ driver }: { driver: DriverDTO }) {
  const stats = [
    { label: "Starts", value: driver.stats.starts },
    { label: "Wins", value: driver.stats.wins },
    { label: "Podiums", value: driver.stats.podiums },
    { label: "Poles", value: driver.stats.poles },
  ];
  return (
    <article id={driver.slug} className="group grid scroll-mt-28 overflow-hidden border border-line bg-graphite sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
      <div className="relative aspect-[4/5] overflow-hidden sm:aspect-auto sm:min-h-full">
        <Image
          src={driver.helmetImage}
          alt={`Helmet illustration for ${driver.fullName}`}
          fill
          sizes="(min-width: 1024px) 260px, (min-width: 640px) 40vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="label-tech text-apex-blue">{driver.role}</p>
            <h3 className="mt-2 font-display text-2xl font-bold uppercase leading-tight">
              {driver.firstName} <span className="text-apex-orange">{driver.lastName}</span>
            </h3>
          </div>
          <span className="shrink-0 border border-line px-2.5 py-1 font-mono text-2xl font-bold text-chalk" aria-label={`Driver number ${driver.number}`}>
            {String(driver.number).padStart(2, "0")}
          </span>
        </div>
        <dl className="label-tech mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[0.66rem] text-steel">
          <div>
            <dt className="inline">Nationality: </dt>
            <dd className="inline text-chalk">{driver.nationality}</dd>
          </div>
          <div>
            <dt className="inline">Born: </dt>
            <dd className="inline text-chalk">{driver.birthYear}</dd>
          </div>
          <div>
            <dt className="inline">Rating: </dt>
            <dd className="inline text-chalk">{driver.rating}</dd>
          </div>
          <div>
            <dt className="inline">Entry: </dt>
            <dd className="inline text-chalk">{carLabel(driver.carNumber)}</dd>
          </div>
        </dl>
        <p className="mt-4 text-sm leading-relaxed text-steel">{driver.bio}</p>
        <blockquote className="mt-4 border-l-2 border-apex-orange pl-3 text-sm italic text-chalk/90">“{driver.quote}”</blockquote>
        <dl className="mt-auto grid grid-cols-4 gap-2 pt-5">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse border border-line bg-carbon/60 px-2 py-2 text-center">
              <dt className="label-tech text-[0.56rem] text-steel">{s.label}</dt>
              <dd className="font-mono text-lg font-bold text-chalk">{s.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-2 text-[0.68rem] text-steel/80">Career statistics are fictional sample data.</p>
      </div>
    </article>
  );
}
