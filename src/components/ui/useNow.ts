"use client";

import { useEffect, useState } from "react";

/**
 * Returns the current time, ticking every `intervalMs`.
 * Starts from `initialNow` (provided by the server) so the first client render matches SSR.
 */
export function useNow(intervalMs: number, initialNow: number): number {
  const [now, setNow] = useState(initialNow);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    // Sync with the real clock right after mount, then keep ticking.
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, intervalMs);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, [intervalMs]);
  return now;
}
