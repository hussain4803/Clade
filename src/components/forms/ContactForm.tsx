"use client";

import { useState, type FormEvent } from "react";
import { CONTACT_TOPICS, type ContactTopic } from "@/lib/site";
import { contactSchema, fieldErrors } from "@/lib/validation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { describedBy, errorMessageFrom, Field, Honeypot, inputClasses, postJson, StatusMessage, type FormStatus } from "./fields";

type Values = { name: string; email: string; topic: ContactTopic | ""; subject: string; message: string };
type FieldName = keyof Values;

const MESSAGE_MAX = 2000;

export function ContactForm({ initialTopic }: { initialTopic?: ContactTopic }) {
  const [values, setValues] = useState<Values>({ name: "", email: "", topic: initialTopic ?? "", subject: "", message: "" });
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [status, setStatus] = useState<FormStatus>({ kind: "idle" });
  const [reference, setReference] = useState<string>();

  const set = (name: FieldName) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [name]: e.target.value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  // Validate a single field on blur once the user has typed something.
  const validateField = (name: FieldName) => {
    if (!values[name]) return;
    const result = contactSchema.safeParse({ ...values, website });
    const fe = result.success ? {} : fieldErrors(result.error);
    setErrors((er) => ({ ...er, [name]: fe[name] }));
  };

  function focusFirstError(fe: Record<string, string>) {
    const order: FieldName[] = ["name", "email", "topic", "subject", "message"];
    const first = order.find((f) => fe[f]);
    if (first) document.getElementById(`contact-${first}`)?.focus();
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "submitting") return;

    const parsed = contactSchema.safeParse({ ...values, website });
    if (!parsed.success) {
      const fe = fieldErrors(parsed.error);
      setErrors(fe);
      setStatus({ kind: "error", message: "Please fix the highlighted fields and try again." });
      focusFirstError(fe);
      return;
    }
    setErrors({});
    setStatus({ kind: "submitting" });

    const result = await postJson("/api/contact", { ...parsed.data, website });
    if (result.ok) {
      const data = result.json?.data as { id?: string } | undefined;
      setReference(data?.id);
      setStatus({ kind: "success", message: (result.json?.message as string) ?? "Message sent." });
      setValues({ name: "", email: "", topic: "", subject: "", message: "" });
      return;
    }
    const fe = (result.json?.error as { fields?: Record<string, string> } | undefined)?.fields;
    if (fe) {
      setErrors(fe);
      focusFirstError(fe);
    }
    setStatus({ kind: "error", message: errorMessageFrom(result) });
  }

  const submitting = status.kind === "submitting";
  const remaining = MESSAGE_MAX - values.message.length;
  const field = (name: FieldName) => ({
    id: `contact-${name}`,
    name,
    value: values[name],
    onChange: set(name),
    onBlur: () => validateField(name),
    "aria-invalid": errors[name] ? true : undefined,
    "aria-required": true,
    className: cn(inputClasses, errors[name] ? "border-danger" : "border-line-strong"),
  });

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-6" aria-label="Contact form">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="contact-name" label="Full name" error={errors.name} required>
          <input {...field("name")} type="text" autoComplete="name" maxLength={80} aria-describedby={describedBy("contact-name", errors.name)} />
        </Field>
        <Field id="contact-email" label="Email" error={errors.email} required>
          <input
            {...field("email")}
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={254}
            aria-describedby={describedBy("contact-email", errors.email)}
          />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Field id="contact-topic" label="Topic" error={errors.topic} required>
          <select {...field("topic")} aria-describedby={describedBy("contact-topic", errors.topic)} className={cn(field("topic").className, "appearance-none bg-[length:18px] bg-[right_1rem_center] bg-no-repeat pr-10")} style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239AA4AF' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")" }}>
            <option value="" disabled>
              Choose a topic…
            </option>
            {CONTACT_TOPICS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
        <Field id="contact-subject" label="Subject" error={errors.subject} required>
          <input {...field("subject")} type="text" maxLength={120} aria-describedby={describedBy("contact-subject", errors.subject)} />
        </Field>
      </div>

      <Field
        id="contact-message"
        label="Message"
        error={errors.message}
        required
        hint={
          <span className="flex justify-between gap-4">
            <span>Minimum 20 characters.</span>
            <span className={cn("tabular", remaining < 100 && "text-apex-orange")}>{remaining} characters left</span>
          </span>
        }
      >
        <textarea
          {...field("message")}
          rows={6}
          maxLength={MESSAGE_MAX}
          aria-describedby={describedBy("contact-message", errors.message, true)}
          className={cn(field("message").className, "min-h-40 resize-y")}
        />
      </Field>

      <Honeypot value={website} onChange={(e) => setWebsite(e.target.value)} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-steel">
          Fields marked <span className="text-apex-orange">*</span> are required. Messages are stored in the local demo database only.
        </p>
        <Button type="submit" variant="primary" size="lg" disabled={submitting} arrow={!submitting}>
          {submitting ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-carbon/30 border-t-carbon" aria-hidden="true" />
              Sending…
            </>
          ) : (
            "Send message"
          )}
        </Button>
      </div>

      <StatusMessage status={status} />
      {status.kind === "success" && reference && (
        <p className="label-tech text-steel">
          Reference: <span className="text-chalk">{reference}</span>
        </p>
      )}
    </form>
  );
}
