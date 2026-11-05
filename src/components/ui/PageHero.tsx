import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./Container";

type Props = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  aside?: ReactNode;
  className?: string;
};

/** Standard inner-page header with technical grid and racing stripe. */
export function PageHero({ eyebrow, title, description, children, aside, className }: Props) {
  return (
    <section className={cn("relative isolate overflow-hidden border-b border-line", className)}>
      <div className="bg-grid absolute inset-0 -z-10 opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden="true" />
      <div className="absolute -top-24 right-[-10%] -z-10 size-[28rem] rounded-full bg-apex-blue/10 blur-3xl" aria-hidden="true" />
      <div className="stripe-diagonal absolute bottom-0 right-0 -z-10 h-2 w-1/2 opacity-70 [mask-image:linear-gradient(to_left,black,transparent)]" aria-hidden="true" />
      <Container className="grid gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end">
        <div className="animate-fade-up">
          <p className="label-tech flex items-center gap-3 text-apex-orange">
            <span className="h-px w-8 bg-apex-orange" aria-hidden="true" />
            {eyebrow}
          </p>
          <h1 className="mt-5 text-display-lg font-bold uppercase">{title}</h1>
          {description && <div className="mt-5 max-w-2xl text-lead text-steel">{description}</div>}
          {children}
        </div>
        {aside && <div className="min-w-0">{aside}</div>}
      </Container>
    </section>
  );
}
