import type { Metadata } from "next";
import { CONTACT_ADDRESS, CONTACT_DETAILS, SOCIAL_LINKS } from "@/content/contact";
import { CONTACT_TOPICS, type ContactTopic } from "@/lib/site";
import { ContactForm } from "@/components/forms/ContactForm";
import { SampleBadge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { DemoLink } from "@/components/ui/DemoLink";
import { MailIcon, PhoneIcon, PinIcon } from "@/components/ui/Icons";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Apex Velocita Racing (fictional) about partnerships, media, careers or fan mail. Contact details are placeholders.",
};

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function ContactPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const topicParam = typeof sp.topic === "string" ? sp.topic : undefined;
  const initialTopic = CONTACT_TOPICS.some((t) => t.value === topicParam) ? (topicParam as ContactTopic) : undefined;

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Radio the <span className="text-apex-orange">pit wall</span>
          </>
        }
        description={<p>Partnership enquiries, media requests, careers or a message for the drivers — send it over and the right person will pick it up.</p>}
      />
      <section aria-label="Contact form and details" className="py-14 sm:py-16">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="chamfer border border-line bg-graphite p-5 sm:p-8">
            <h2 className="font-display text-display-sm font-bold uppercase">Send a message</h2>
            <p className="mb-8 mt-2 text-sm text-steel">Submissions are validated and stored in the local SQLite database.</p>
            <ContactForm initialTopic={initialTopic} />
          </div>

          <aside aria-labelledby="details-title" className="space-y-6">
            <div className="border border-line bg-graphite p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 id="details-title" className="font-display text-xl font-bold uppercase">
                  Team contacts
                </h2>
                <SampleBadge label="Placeholders" />
              </div>
              <p className="mt-2 text-sm text-steel">These details are placeholders for a fictional team. The example.com addresses are reserved for documentation and do not reach anyone.</p>
              <dl className="mt-6 space-y-4">
                {CONTACT_DETAILS.map((d) => (
                  <div key={d.label} className="flex gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center border border-line text-apex-blue">
                      {d.kind === "email" ? <MailIcon size={18} /> : <PhoneIcon size={18} />}
                    </span>
                    <div className="min-w-0">
                      <dt className="label-tech text-[0.62rem] text-steel">{d.label} · placeholder</dt>
                      <dd className="mt-1 break-words font-mono text-sm text-chalk">{d.value}</dd>
                    </div>
                  </div>
                ))}
                <div className="flex gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center border border-line text-apex-blue">
                    <PinIcon size={18} />
                  </span>
                  <div>
                    <dt className="label-tech text-[0.62rem] text-steel">Address · placeholder</dt>
                    <dd className="mt-1 text-sm text-chalk">
                      {CONTACT_ADDRESS.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </dd>
                  </div>
                </div>
              </dl>
            </div>
            <div className="border border-line bg-graphite p-5 sm:p-6">
              <h2 className="font-display text-xl font-bold uppercase">Follow the team</h2>
              <p className="mt-2 text-sm text-steel">Social channels are demo links and intentionally inactive.</p>
              <ul className="mt-4 grid grid-cols-2 gap-3">
                {SOCIAL_LINKS.map((s) => (
                  <li key={s.label} className="flex min-h-11 items-center border border-line px-3">
                    <DemoLink label={s.label} className="text-sm">
                      {s.label}
                    </DemoLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-line bg-graphite p-5 sm:p-6">
              <h2 className="font-display text-xl font-bold uppercase">Response times</h2>
              <ul className="mt-3 space-y-2 text-sm text-steel">
                <li>Media requests: within 1 working day (sample)</li>
                <li>Partnerships: within 3 working days (sample)</li>
                <li>Race weeks: expect slower replies — we&apos;re at the track.</li>
              </ul>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
