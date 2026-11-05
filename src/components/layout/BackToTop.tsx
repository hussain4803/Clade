"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { ArrowUp } from "@/components/ui/Icons";

/** Floating control that appears after scrolling and returns to the top of the page. */
export function BackToTop({ threshold = 600 }: { threshold?: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  const goTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    document.getElementById("main-content")?.focus({ preventScroll: true });
  };

  return (
    <button
      type="button"
      onClick={goTop}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={cn(
        "fixed bottom-5 right-4 z-40 inline-flex size-12 items-center justify-center border border-apex-orange/60 bg-carbon/90 text-apex-orange shadow-lg backdrop-blur transition-all duration-300 hover:bg-apex-orange hover:text-carbon sm:bottom-8 sm:right-8",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <ArrowUp size={22} />
    </button>
  );
}
