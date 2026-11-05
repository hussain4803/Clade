"use client";

import Image from "next/image";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import type { Livery } from "@/content/car";
import { cn } from "@/lib/cn";
import { CarSvg } from "@/components/art/CarSvg";

/** Accessible tabbed livery switcher (WAI-ARIA tabs pattern with arrow-key support). */
export function LiveryShowcase({ liveries }: { liveries: Livery[] }) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const livery = liveries[active]!;

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = liveries.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = active === last ? 0 : active + 1;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = active === 0 ? last : active - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label="Choose a livery" className="grid grid-cols-[repeat(3,minmax(0,1fr))] gap-2 sm:inline-grid sm:grid-cols-[repeat(3,auto)] sm:gap-3">
        {liveries.map((l, i) => {
          const selected = i === active;
          return (
            <button
              key={l.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`${baseId}-tab-${l.id}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={onKeyDown}
              className={cn(
                "group flex min-h-14 min-w-0 flex-col items-start justify-center gap-1.5 border px-2.5 py-2 text-left transition-colors sm:flex-row sm:items-center sm:gap-3 sm:px-5",
                selected ? "border-chalk bg-chalk/5" : "border-line hover:border-line-strong",
              )}
            >
              <span className="flex shrink-0 -space-x-1.5" aria-hidden="true">
                {[l.base, l.stripe, l.accent].map((c, ci) => (
                  <span key={ci} className="size-4 rounded-full ring-2 ring-carbon" style={{ background: c }} />
                ))}
              </span>
              <span className="w-full min-w-0 sm:w-auto">
                <span className="block truncate font-display text-[0.8rem] font-semibold uppercase tracking-wide text-chalk sm:text-base sm:tracking-wider">{l.name}</span>
                <span className="label-tech hidden text-[0.58rem] text-steel sm:block">{l.usedAt}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${livery.id}`}
        tabIndex={0}
        className="mt-8 grid gap-8 outline-none lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-center"
      >
        <div className="relative">
          <div className="absolute inset-x-[8%] bottom-[6%] h-1/3 rounded-full blur-3xl transition-colors duration-500" style={{ background: `${livery.glow}33` }} aria-hidden="true" />
          <CarSvg key={livery.id} livery={livery} idPrefix={`livery-${livery.id}`} className="page-enter relative w-full" />
        </div>
        <div>
          <p className="label-tech text-apex-blue">{livery.meaning}</p>
          <h3 className="mt-2 font-display text-display-sm font-bold uppercase">{livery.name}</h3>
          <p className="mt-3 text-steel">{livery.description}</p>
          <dl className="label-tech mt-5 space-y-2 text-[0.66rem] text-steel">
            <div className="flex gap-2">
              <dt>Usage:</dt>
              <dd className="text-chalk">{livery.usedAt}</dd>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <dt>Palette:</dt>
              {[livery.base, livery.stripe, livery.accent].map((c) => (
                <dd key={c} className="inline-flex items-center gap-1.5 text-chalk">
                  <span className="size-3 ring-1 ring-line-strong" style={{ background: c }} aria-hidden="true" />
                  {c.toUpperCase()}
                </dd>
              ))}
            </div>
          </dl>
          <div className="relative mt-6 aspect-[2/1] overflow-hidden border border-line">
            <Image src={`/images/cars/livery-${livery.id}.webp`} alt={`Studio render of the ${livery.name} livery`} fill sizes="(min-width: 1024px) 480px, 100vw" className="object-cover" />
            <span className="label-tech absolute bottom-2 left-2 bg-carbon/80 px-2 py-1 text-[0.58rem] text-steel">Studio render · illustration</span>
          </div>
        </div>
      </div>
    </div>
  );
}
