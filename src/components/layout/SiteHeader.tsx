"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { getCountdownParts } from "@/lib/countdown";
import { cn } from "@/lib/cn";
import { NAV_LINKS } from "@/lib/site";
import { CloseIcon, MenuIcon } from "@/components/ui/Icons";
import { useNow } from "@/components/ui/useNow";
import { Logo } from "./Logo";

export type HeaderNextRace = { slug: string; shortName: string; startDate: string; endDate: string } | null;

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

function NextRaceChip({
  race,
  initialNow,
  className,
  onNavigate,
}: {
  race: NonNullable<HeaderNextRace>;
  initialNow: number;
  className?: string;
  onNavigate?: () => void;
}) {
  const now = useNow(30_000, initialNow);
  const start = Date.parse(race.startDate);
  const live = now >= start && now <= Date.parse(race.endDate);
  const p = getCountdownParts(start, now);
  return (
    <Link
      href={`/races/${race.slug}`}
      onClick={onNavigate}
      className={cn(
        "group inline-flex min-h-10 items-center gap-2 border border-line px-3 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-steel transition-colors hover:border-apex-blue hover:text-chalk",
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", live ? "bg-danger animate-pulse-dot" : "bg-apex-orange")} aria-hidden="true" />
      <span className="text-chalk">{live ? "Live" : "Next"}</span>
      <span>{race.shortName}</span>
      {!live && (
        <span className="tabular text-apex-blue">
          {p.days}d {String(p.hours).padStart(2, "0")}h
        </span>
      )}
    </Link>
  );
}

export function SiteHeader({ nextRace, initialNow }: { nextRace: HeaderNextRace; initialNow: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) buttonRef.current?.focus();
  }, []);

  // Close the menu whenever the route changes (state adjusted during render, not in an effect).
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock scroll, trap focus and listen for Escape while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("a, button")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const focusables = [buttonRef.current, ...panel.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")].filter(
        (el): el is HTMLElement => !!el,
      );
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const onResize = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) close(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open, close]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-[background-color,border-color] duration-300",
          scrolled || open ? "border-line bg-carbon/92 backdrop-blur-md" : "border-transparent bg-carbon/60 backdrop-blur-sm",
        )}
      >
        <a
          href="#main-content"
          className="label-tech absolute left-4 top-2 z-[60] -translate-y-24 bg-apex-blue px-4 py-3 text-carbon focus:translate-y-0"
        >
          Skip to content
        </a>
        <div className="mx-auto flex h-[var(--avr-header-h)] w-full max-w-[1320px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
          <Link href="/" aria-label="Apex Velocita Racing — home" className="-ml-1 flex min-h-11 items-center p-1">
            <Logo compact />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative inline-flex min-h-11 items-center px-3.5 font-display text-[0.82rem] font-semibold uppercase tracking-[0.14em] transition-colors",
                        active ? "text-chalk" : "text-steel hover:text-chalk",
                      )}
                    >
                      {link.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-x-3.5 bottom-1.5 h-0.5 origin-left bg-apex-orange transition-transform duration-300",
                          active ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {nextRace && (
              <div className="hidden xl:block">
                <NextRaceChip race={nextRace} initialNow={initialNow} />
              </div>
            )}
            <button
              ref={buttonRef}
              type="button"
              className="inline-flex size-11 items-center justify-center border border-line text-chalk transition-colors hover:border-chalk lg:hidden"
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => (open ? close() : setOpen(true))}
            >
              {open ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
            </button>
          </div>
        </div>
      </header>
      {/* Mobile / tablet menu — outside <header> so its backdrop-filter does not trap position: fixed */}
      <div
        id={menuId}
        ref={panelRef}
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[var(--avr-header-h)] z-40 overflow-y-auto border-t border-line bg-carbon lg:hidden"
      >
        <div className="bg-grid absolute inset-0 opacity-60" aria-hidden="true" />
        <nav aria-label="Mobile" className="relative mx-auto flex min-h-full max-w-xl flex-col px-4 pb-10 pt-6 sm:px-6">
          <ul className="flex flex-col">
            {NAV_LINKS.map((link, i) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href} className="border-b border-line">
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => close(false)}
                    className={cn(
                      "group flex min-h-16 items-center justify-between gap-4 py-3",
                      active ? "text-chalk" : "text-steel hover:text-chalk",
                    )}
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="label-tech text-apex-blue">{String(i + 1).padStart(2, "0")}</span>
                      <span className="font-display text-3xl font-bold uppercase tracking-wide">{link.label}</span>
                    </span>
                    <span className="label-tech hidden text-steel min-[400px]:inline">{link.description}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          {nextRace && (
            <div className="mt-8">
              <p className="label-tech mb-3 text-steel">Up next on the calendar</p>
              <NextRaceChip race={nextRace} initialNow={initialNow} onNavigate={() => close(false)} />
            </div>
          )}
          <p className="mt-auto pt-10 text-xs text-steel">Fictional team · all content is sample data.</p>
        </nav>
      </div>
    </>
  );
}
