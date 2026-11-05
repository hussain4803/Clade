import { Container } from "./Container";
import { Skeleton } from "./Skeleton";

/** Generic route-level loading state shown while server data streams in. */
export function PageSkeleton({ variant = "list" }: { variant?: "list" | "grid" | "article" }) {
  return (
    <div role="status" aria-live="polite" aria-label="Loading">
      <span className="sr-only">Loading…</span>
      <section className="border-b border-line">
        <Container className="py-14 sm:py-20">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="mt-6 h-12 w-3/4 max-w-2xl" />
          <Skeleton className="mt-4 h-12 w-1/2 max-w-xl" />
          <Skeleton className="mt-6 h-4 w-full max-w-xl" />
          <Skeleton className="mt-3 h-4 w-2/3 max-w-lg" />
        </Container>
      </section>
      <Container className="py-14">
        {variant === "article" ? (
          <div className="mx-auto max-w-3xl space-y-4">
            <Skeleton className="aspect-[16/9] w-full" />
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        ) : variant === "grid" ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="border border-line bg-graphite">
                <Skeleton className="aspect-[16/9] w-full" />
                <div className="space-y-3 p-5">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-5 w-5/6" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <Skeleton className="h-28 w-full" />
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-36 w-full" />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
