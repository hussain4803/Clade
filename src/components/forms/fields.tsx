import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { AlertIcon, CheckIcon, InfoIcon } from "@/components/ui/Icons";

export const inputClasses =
  "block w-full min-h-12 rounded-[2px] border bg-carbon/70 px-4 py-3 text-base text-chalk placeholder:text-steel/70 transition-colors focus:border-apex-blue focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apex-blue aria-[invalid=true]:border-danger";

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  required?: boolean;
  children: ReactNode;
  className?: string;
};

export function Field({ id, label, error, hint, required, children, className }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="label-tech mb-2 flex items-center gap-1.5 text-chalk">
        {label}
        {required && (
          <span className="text-apex-orange" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-2 text-xs text-steel">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-2 flex items-start gap-1.5 text-sm text-[#ff8a8a]">
          <AlertIcon size={16} className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

export function describedBy(id: string, error?: string, hint?: boolean) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

/** Visually hidden trap field for naive bots. */
export function Honeypot(props: ComponentProps<"input">) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" {...props} />
      </label>
    </div>
  );
}

export type FormStatus =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; message: string }
  | { kind: "info"; message: string }
  | { kind: "error"; message: string };

export function StatusMessage({ status, className }: { status: FormStatus; className?: string }) {
  // The live region is always rendered so screen readers announce changes.
  return (
    <div role="status" aria-live="polite" className={className}>
      {status.kind === "success" && (
        <p className="flex items-start gap-2 border border-success/40 bg-success/10 px-4 py-3 text-sm text-[#7ee2a4]">
          <CheckIcon size={18} className="mt-0.5 shrink-0" />
          {status.message}
        </p>
      )}
      {status.kind === "info" && (
        <p className="flex items-start gap-2 border border-apex-blue/40 bg-apex-blue/10 px-4 py-3 text-sm text-[#8fd3ff]">
          <InfoIcon size={18} className="mt-0.5 shrink-0" />
          {status.message}
        </p>
      )}
      {status.kind === "error" && (
        <p className={cn("flex items-start gap-2 border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-[#ff9a9a]")}>
          <AlertIcon size={18} className="mt-0.5 shrink-0" />
          {status.message}
        </p>
      )}
    </div>
  );
}

type ApiResult = { ok: boolean; status: number; json: Record<string, unknown> | null };

/** POSTs JSON and never throws: network/parse failures come back as status 0. */
export async function postJson(url: string, payload: unknown): Promise<ApiResult> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    let json: Record<string, unknown> | null = null;
    try {
      json = (await res.json()) as Record<string, unknown>;
    } catch {
      json = null;
    }
    return { ok: res.ok, status: res.status, json };
  } catch {
    return { ok: false, status: 0, json: null };
  }
}

export function errorMessageFrom(result: ApiResult): string {
  if (result.status === 0) return "We couldn't reach the server. Check your connection and try again.";
  const err = (result.json?.error ?? null) as { message?: string } | null;
  if (result.status === 429) return err?.message ?? "Too many attempts. Please wait a minute and try again.";
  if (result.status >= 500) return "Something went wrong on our side. Please try again shortly.";
  return err?.message ?? "Something went wrong. Please try again.";
}
