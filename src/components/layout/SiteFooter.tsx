import Link from "next/link";
import { SOCIAL_LINKS } from "@/content/contact";
import { NAV_LINKS, SITE } from "@/lib/site";
import { DemoLink } from "@/components/ui/DemoLink";
import { Logo } from "./Logo";

const RACING_LINKS = [
  { href: "/races?status=upcoming", label: "Upcoming races" },
  { href: "/races?status=completed", label: "Results archive" },
  { href: "/races/le-mans-2027", label: "Le Mans 2027" },
  { href: "/news?category=race-report", label: "Race reports" },
];

const TEAM_LINKS = [
  { href: "/team#drivers", label: "Drivers" },
  { href: "/team#crew", label: "Technical crew" },
  { href: "/cars#specifications", label: "AVR-26 specs" },
  { href: "/contact?topic=partnerships", label: "Partnerships" },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-line bg-graphite">
      <div className="stripe-diagonal absolute inset-x-0 top-0 h-1 opacity-80" aria-hidden="true" />
      <div className="mx-auto grid w-full max-w-[1320px] gap-12 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-10">
        <div>
          <Link href="/" aria-label="Apex Velocita Racing — home" className="inline-flex min-h-11 items-center">
            <Logo />
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-steel">{SITE.tagline} A fictional two-car Hypercar team built for the world&apos;s great endurance races.</p>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-3" aria-label="Social media (demo links)">
            {SOCIAL_LINKS.map((s) => (
              <li key={s.label}>
                <DemoLink label={s.label} className="text-sm">
                  {s.label}
                </DemoLink>
              </li>
            ))}
          </ul>
        </div>

        <FooterColumn title="Explore" links={NAV_LINKS.map((l) => ({ href: l.href, label: l.label }))} />
        <FooterColumn title="Racing" links={RACING_LINKS} />
        <FooterColumn title="Team" links={TEAM_LINKS} />
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-4 px-4 py-6 text-xs text-steel sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <p className="max-w-3xl leading-relaxed">
            <strong className="font-semibold text-chalk">Demo site.</strong> {SITE.disclaimer} Event names refer to real races for context only; no affiliation is implied.
          </p>
          <p className="label-tech shrink-0">© {new Date().getFullYear()} Apex Velocita Racing (fictional)</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <nav aria-label={title}>
      <h2 className="label-tech text-apex-blue">{title}</h2>
      <ul className="mt-4 space-y-1">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="inline-flex min-h-10 items-center text-sm text-steel transition-colors hover:text-chalk">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
