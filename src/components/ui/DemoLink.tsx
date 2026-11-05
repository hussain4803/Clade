import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Stand-in for an external link that has no real destination in this demo.
 * Rendered as a disabled, clearly labelled control rather than a dead link.
 */
export function DemoLink({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <span
      role="link"
      aria-disabled="true"
      aria-label={`${label} (demo link — not active)`}
      title="Demo link — no destination in this sample site"
      className={cn("inline-flex cursor-not-allowed items-center gap-2 text-steel/80", className)}
    >
      {children}
      <span className="label-tech border border-line px-1 py-0.5 text-[0.6rem] text-steel" aria-hidden="true">
        Demo
      </span>
    </span>
  );
}
