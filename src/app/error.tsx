"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="py-24 sm:py-32">
      <Container className="max-w-3xl text-center">
        <p className="label-tech text-danger">Red flag</p>
        <h1 className="mt-4 text-display-lg font-bold uppercase">Session suspended</h1>
        <p className="mx-auto mt-5 max-w-xl text-lead text-steel">
          Something went wrong loading this page. If you&apos;re running the site locally, make sure the database has been set up with <code className="font-mono text-chalk">npm run setup</code>.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button variant="primary" onClick={reset}>
            Try again
          </Button>
          <ButtonLink href="/" variant="secondary">
            Back to home
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
