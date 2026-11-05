import { cn } from "@/lib/cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={cn("shrink-0", className)} aria-hidden="true" focusable="false">
      <path d="M30 6h15l-5 9H25z" fill="var(--avr-orange)" />
      <path d="M5 42 21.5 9h7.6L43 42h-8.2l-9.3-23.6L13.2 42z" fill="var(--avr-white)" />
      <path d="M1 31h33" stroke="var(--avr-blue)" strokeWidth="4.2" />
      <path d="M1 36.5h9" stroke="var(--avr-blue)" strokeWidth="2" opacity="0.7" />
    </svg>
  );
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className="size-9" />
      <span className={cn("flex flex-col leading-none", compact && "max-[359px]:hidden")}>
        <span className="font-display text-[0.95rem] font-bold uppercase tracking-[0.14em] text-chalk sm:text-base">
          Apex Velocita
        </span>
        <span className="label-tech mt-1 text-[0.6rem] tracking-[0.42em] text-steel">Racing</span>
      </span>
    </span>
  );
}
