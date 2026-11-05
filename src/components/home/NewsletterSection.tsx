import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export function NewsletterSection() {
  return (
    <section aria-labelledby="newsletter-title" className="py-20 sm:py-24">
      <Container>
        <Reveal className="chamfer relative overflow-hidden border border-line bg-graphite p-6 sm:p-10 lg:p-14">
          <div className="bg-grid absolute inset-0 opacity-50" aria-hidden="true" />
          <div className="absolute -right-10 -top-10 size-64 rounded-full bg-apex-orange/15 blur-3xl" aria-hidden="true" />
          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center">
            <div>
              <p className="label-tech flex items-center gap-3 text-apex-orange">
                <span className="h-px w-8 bg-apex-orange" aria-hidden="true" />
                Pit wall briefing
              </p>
              <h2 id="newsletter-title" className="mt-4 text-display-md font-bold uppercase">
                Race-week intel, straight to your inbox
              </h2>
              <p className="mt-4 max-w-lg text-steel">Session times, strategy previews and post-race debriefs before every round of the season.</p>
            </div>
            <NewsletterForm source="home" />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
