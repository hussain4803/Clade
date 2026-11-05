"use client";

import { useId, useState, type FormEvent } from "react";
import { newsletterSchema } from "@/lib/validation";
import { Button } from "@/components/ui/Button";
import { describedBy, errorMessageFrom, Field, Honeypot, inputClasses, postJson, StatusMessage, type FormStatus } from "./fields";

export function NewsletterForm({ source = "website" }: { source?: string }) {
  const id = useId();
  const emailId = `${id}-email`;
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState<string>();
  const [status, setStatus] = useState<FormStatus>({ kind: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "submitting") return;

    const parsed = newsletterSchema.safeParse({ email, source, website });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter a valid email address.");
      setStatus({ kind: "idle" });
      document.getElementById(emailId)?.focus();
      return;
    }
    setError(undefined);
    setStatus({ kind: "submitting" });

    const result = await postJson("/api/newsletter", { email: parsed.data.email, source, website });
    const message = typeof result.json?.message === "string" ? result.json.message : undefined;
    const data = result.json?.data as { alreadySubscribed?: boolean } | undefined;

    if (result.ok && data?.alreadySubscribed) {
      setStatus({ kind: "info", message: message ?? "You're already subscribed." });
    } else if (result.ok) {
      setStatus({ kind: "success", message: message ?? "You're subscribed." });
      setEmail("");
    } else {
      const fields = (result.json?.error as { fields?: Record<string, string> } | undefined)?.fields;
      if (fields?.email) setError(fields.email);
      setStatus({ kind: "error", message: errorMessageFrom(result) });
    }
  }

  const submitting = status.kind === "submitting";

  return (
    <form onSubmit={onSubmit} noValidate className="relative" aria-label="Newsletter signup">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <Field id={emailId} label="Email address" error={error} required className="flex-1">
          <input
            id={emailId}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(undefined);
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy(emailId, error)}
            aria-required="true"
            maxLength={254}
            className={inputClasses + (error ? " border-danger" : " border-line-strong")}
          />
        </Field>
        <Button type="submit" variant="primary" size="md" disabled={submitting} className="sm:mt-[1.6rem]" arrow={!submitting}>
          {submitting ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-carbon/30 border-t-carbon" aria-hidden="true" />
              Subscribing…
            </>
          ) : (
            "Subscribe"
          )}
        </Button>
      </div>
      <Honeypot value={website} onChange={(e) => setWebsite(e.target.value)} />
      <StatusMessage status={status} className="mt-4" />
      <p className="mt-3 text-xs text-steel">Demo form — your address is stored only in this site&apos;s local SQLite database. No emails are sent.</p>
    </form>
  );
}
