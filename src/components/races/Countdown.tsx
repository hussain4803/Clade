"use client";

import { getCountdownParts, pad2 } from "@/lib/countdown";
import { cn } from "@/lib/cn";
import { useNow } from "@/components/ui/useNow";

type Props = {
  startIso: string;
  endIso: string;
  initialNow: number;
  /** Accessible description, e.g. "Bahrain 8 Hours starts 14 Nov 2026, 14:00 local time". */
  description: string;
  size?: "xl" | "lg" | "md";
  className?: string;
};

const UNITS = [
  { key: "days", label: "Days", short: "D" },
  { key: "hours", label: "Hours", short: "H" },
  { key: "minutes", label: "Minutes", short: "M" },
  { key: "seconds", label: "Seconds", short: "S" },
] as const;

/** Live-style countdown to race start; switches to a running clock while the race is live. */
export function Countdown({ startIso, endIso, initialNow, description, size = "lg", className }: Props) {
  const now = useNow(1000, initialNow);
  const start = Date.parse(startIso);
  const end = Date.parse(endIso);
  const live = now >= start && now <= end;
  const finished = now > end;
  const parts = getCountdownParts(live ? end : start, now);
  const elapsedH = live ? Math.floor((now - start) / 3_600_000) + 1 : 0;
  const totalH = Math.round((end - start) / 3_600_000);

  const digit = {
    xl: "text-[clamp(2.4rem,1.2rem+5vw,5.25rem)]",
    lg: "text-[clamp(2rem,1.2rem+3vw,3.5rem)]",
    md: "text-[clamp(1.6rem,1.2rem+1.5vw,2.25rem)]",
  }[size];

  if (finished) {
    return (
      <div className={cn("flex items-center gap-3 text-steel", className)}>
        <span className="label-tech">Chequered flag</span>
        <span className="text-sm">This race has finished — see results below.</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <p className="sr-only">{description}</p>
      <div className="mb-3 flex items-center gap-2">
        {live ? (
          <span className="label-tech inline-flex items-center gap-2 bg-danger/15 px-2 py-1 text-[#ff7b7b]">
            <span className="size-2 rounded-full bg-danger animate-pulse-dot" aria-hidden="true" />
            Live · Hour {Math.min(elapsedH, totalH)} of {totalH} · time remaining
          </span>
        ) : (
          <span className="label-tech inline-flex items-center gap-2 text-steel">
            <span className="size-2 rounded-full bg-apex-blue animate-pulse-dot" aria-hidden="true" />
            Lights out in
          </span>
        )}
      </div>
      <div role="timer" aria-live="off" aria-atomic="true" className="grid grid-cols-4 gap-2 sm:gap-3">
        {UNITS.map((u, i) => {
          const value = parts[u.key];
          return (
            <div
              key={u.key}
              className={cn(
                "relative overflow-hidden border border-line bg-carbon/70 px-2 py-3 text-center sm:px-3 sm:py-4",
                i === 3 && "border-apex-orange/40",
              )}
            >
              <span className="absolute inset-x-0 top-1/2 h-px bg-line" aria-hidden="true" />
              <span className={cn("relative block font-mono font-bold leading-none tabular text-chalk", digit)}>
                <span key={value} className="avr-digit">
                  {u.key === "days" ? String(value).padStart(2, "0") : pad2(value)}
                </span>
              </span>
              <span className="label-tech relative mt-2 block text-[0.6rem] text-steel sm:text-[0.68rem]">
                <span className="sm:hidden" aria-hidden="true">{u.short}</span>
                <span className="max-sm:sr-only">{u.label}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
