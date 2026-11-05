import Link from "next/link";
import { PARTNERS, type PartnerPlaceholder } from "@/content/partners";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

function Shape({ shape }: { shape: PartnerPlaceholder["shape"] }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 2.2 } as const;
  switch (shape) {
    case "hex":
      return <path d="M12 2l9 5v10l-9 5-9-5V7z" {...common} />;
    case "bolt":
      return <path d="M13 2L4 14h7l-1 8 9-12h-7z" {...common} />;
    case "ring":
      return (
        <>
          <circle cx="12" cy="12" r="9" {...common} />
          <circle cx="12" cy="12" r="4" {...common} />
        </>
      );
    case "chevron":
      return <path d="M3 18l9-12 9 12M7 18l5-6.5 5 6.5" {...common} />;
    case "grid":
      return <path d="M4 4h16v16H4zM4 12h16M12 4v16" {...common} />;
    case "wave":
      return <path d="M2 14c3-6 6-6 10 0s7 6 10 0M2 9c3-6 6-6 10 0s7 6 10 0" {...common} />;
  }
}

export function PartnerStrip() {
  return (
    <section aria-labelledby="partners-title" className="border-y border-line bg-graphite/70 py-14">
      <Container>
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="partners-title" className="label-tech text-apex-blue">
              Partner slots
            </h2>
            <p className="mt-2 max-w-xl text-sm text-steel">
              These are <strong className="text-chalk">placeholder logos</strong>. Apex Velocita Racing is fictional and has no real sponsors or partners.
            </p>
          </div>
          <Link href="/contact?topic=partnerships" className="label-tech inline-flex min-h-11 items-center gap-2 text-apex-orange transition-colors hover:text-chalk">
            Become a partner →
          </Link>
        </Reveal>
        <ul className="mt-8 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
          {PARTNERS.map((p, i) => (
            <Reveal as="li" key={p.id} delay={i * 60} className="group flex min-h-28 flex-col items-center justify-center gap-2 bg-graphite px-3 py-5 text-steel transition-colors hover:text-chalk">
              <svg viewBox="0 0 24 24" className="size-8 transition-colors group-hover:text-apex-blue" aria-hidden="true">
                <Shape shape={p.shape} />
              </svg>
              <span className="font-display text-sm font-semibold uppercase tracking-[0.18em]">{p.label}</span>
              <span className="label-tech text-[0.56rem] text-steel/70">Placeholder · {p.tier}</span>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
