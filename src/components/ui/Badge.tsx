import { cn } from "@/lib/cn";
import { RACE_STATUS_LABELS, SERIES_LABELS, type RaceStatus, type Series } from "@/lib/site";

export function SeriesBadge({ series, className }: { series: Series; className?: string }) {
  return (
    <span
      className={cn(
        "label-tech inline-flex items-center gap-1.5 border px-2 py-1",
        series === "WEC" ? "border-apex-blue/40 text-apex-blue" : "border-apex-orange/40 text-apex-orange",
        className,
      )}
    >
      <span className="sr-only">Series: </span>
      {series}
      <span className="hidden text-steel sm:inline">· {SERIES_LABELS[series]}</span>
    </span>
  );
}

export function StatusBadge({ status, className }: { status: RaceStatus; className?: string }) {
  const styles: Record<RaceStatus, string> = {
    upcoming: "bg-apex-blue/12 text-apex-blue",
    live: "bg-danger/15 text-[#ff7b7b]",
    completed: "bg-chalk/8 text-steel",
  };
  return (
    <span className={cn("label-tech inline-flex items-center gap-1.5 px-2 py-1", styles[status], className)}>
      {status === "live" && <span className="size-1.5 rounded-full bg-danger animate-pulse-dot" aria-hidden="true" />}
      <span className="sr-only">Status: </span>
      {RACE_STATUS_LABELS[status]}
    </span>
  );
}

/** Marks fictional/demo content so it can't be mistaken for real information. */
export function SampleBadge({ label = "Sample data", className }: { label?: string; className?: string }) {
  return (
    <span
      className={cn(
        "label-tech inline-flex items-center gap-1.5 border border-dashed border-apex-orange/50 px-2 py-1 text-apex-orange",
        className,
      )}
    >
      <span className="size-1.5 rotate-45 bg-apex-orange" aria-hidden="true" />
      {label}
    </span>
  );
}
