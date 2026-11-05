import { CREW } from "@/content/team";

export function CrewGrid() {
  return (
    <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
      {CREW.map((m, i) => (
        <li key={m.name} className="group relative flex gap-4 bg-graphite p-5 transition-colors hover:bg-graphite-2 sm:p-6">
          <span
            className="chamfer-sm flex size-14 shrink-0 items-center justify-center bg-carbon font-display text-lg font-bold text-chalk ring-1 ring-line transition-colors group-hover:text-apex-blue"
            aria-hidden="true"
          >
            {m.initials}
          </span>
          <div className="min-w-0">
            <p className="label-tech text-[0.62rem] text-apex-blue">{String(i + 1).padStart(2, "0")} · {m.role}</p>
            <h3 className="mt-1.5 font-display text-lg font-semibold">{m.name}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-steel">{m.focus}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
