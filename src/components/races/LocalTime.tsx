"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** Renders a time in the visitor's own time zone (client only; SSR shows a placeholder). */
export function LocalTime({ iso, withDay = false }: { iso: string; withDay?: boolean }) {
  const text = useSyncExternalStore(
    subscribe,
    () =>
      new Intl.DateTimeFormat(undefined, {
        weekday: withDay ? "short" : undefined,
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      }).format(new Date(iso)),
    () => "—",
  );
  return (
    <time dateTime={iso} suppressHydrationWarning>
      {text}
    </time>
  );
}
