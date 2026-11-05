import type { SpecGroup } from "@/content/car";
import { SPEC_ICONS } from "@/components/ui/Icons";

export function SpecCard({ group, index }: { group: SpecGroup; index: number }) {
  const Icon = SPEC_ICONS[group.icon];
  return (
    <article id={`spec-${group.id}`} className="group flex h-full flex-col border border-line bg-graphite transition-colors hover:border-apex-blue/50">
      <header className="flex items-start gap-4 border-b border-line p-5 sm:p-6">
        <span className="chamfer-sm flex size-12 shrink-0 items-center justify-center bg-carbon text-apex-blue ring-1 ring-line transition-colors group-hover:text-apex-orange">
          <Icon size={24} />
        </span>
        <div className="min-w-0">
          <p className="label-tech text-[0.62rem] text-steel">{String(index + 1).padStart(2, "0")} / Sample spec</p>
          <h3 className="mt-1 font-display text-xl font-bold uppercase">{group.title}</h3>
          <p className="mt-1 text-sm text-steel">{group.summary}</p>
        </div>
      </header>
      <dl className="divide-y divide-line px-5 sm:px-6">
        {group.specs.map((s) => (
          <div key={s.label} className="grid gap-1 py-3 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] sm:gap-4">
            <dt className="label-tech pt-0.5 text-[0.64rem] text-steel">{s.label}</dt>
            <dd className="text-sm text-chalk">{s.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
