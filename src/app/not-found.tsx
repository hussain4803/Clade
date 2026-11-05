import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="bg-grid absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
      <Container className="max-w-3xl text-center">
        <p className="label-tech text-apex-orange">Error 404 · Off track</p>
        <h1 className="mt-4 text-display-lg font-bold uppercase">
          Into the <span className="text-outline">gravel</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lead text-steel">The page you were looking for has retired from the race. It may have moved, or the link may be incorrect.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/">Return to the pits</ButtonLink>
          <ButtonLink href="/races" variant="secondary">
            View Race Calendar
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
