/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import Reveal, { GrowLine } from '@/components/about/Reveal';
import WordReveal from '@/components/about/WordReveal';
import { about, type Entry } from '@/data/about';
import { asset } from '@/lib/asset';

export const metadata: Metadata = {
  title: 'About — Portfolio',
  description: about.headline,
};

/** Label on the left, content on the right (stacked on mobile). */
const Section = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <section className="grid gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,9fr)] md:gap-12">
    <Reveal>
      <h2 className="micro text-mute">{label}</h2>
    </Reveal>
    <div>{children}</div>
  </section>
);

const Chips = ({ items }: { items: string[] }) => (
  <ul className="flex flex-wrap gap-2">
    {items.map((s, i) => (
      <Reveal key={s} as="li" delay={i * 0.05} className="micro rounded-full border border-white/15 px-4 py-2">
        {s}
      </Reveal>
    ))}
  </ul>
);

const Timeline = ({ entries }: { entries: Entry[] }) => (
  <ol>
    {entries.map((e, i) => (
      <li key={`${e.year}-${e.title}`}>
        <GrowLine delay={0.05} />
        <Reveal delay={i * 0.04} className="grid grid-cols-[6rem_1fr] gap-4 py-7">
          <span className="micro pt-1.5 text-accent">{e.year}</span>
          <div>
            <p className="text-xl leading-snug md:text-2xl">{e.title}</p>
            <p className="mt-2 max-w-2xl text-paper/60">{e.description}</p>
          </div>
        </Reveal>
      </li>
    ))}
    <li aria-hidden>
      <GrowLine />
    </li>
  </ol>
);

export default function AboutPage() {
  return (
    <section className="min-h-screen bg-ink px-4 pb-40 pt-24 md:px-8 md:pt-32">
      <div className="mx-auto max-w-6xl">
        {/* compact header: small profile on the left, much smaller headline on the right */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-12">
          <Reveal className="shrink-0">
            <img
              src={asset('/assets/profile-small.jpg')}
              alt={about.name}
              width={400}
              height={500}
              fetchPriority="high"
              className="aspect-[4/5] w-24 rounded-xl object-cover md:w-44"
            />
            <p className="micro mt-3 text-mute">{about.name}</p>
          </Reveal>
          <div className="min-w-0">
            <WordReveal text={about.headline} className="max-w-3xl text-xl font-medium leading-snug tracking-tight md:text-3xl" />
            <Reveal as="p" delay={0.1} className="mt-5 max-w-2xl text-base leading-relaxed text-paper/75 md:text-lg">
              {about.paragraph}
            </Reveal>
          </div>
        </div>

        <div className="mt-16 space-y-16 md:mt-24 md:space-y-24">
          <Section label="Work experience">
            <Timeline entries={about.work} />
          </Section>
          <Section label="Clubs / Extracurriculars">
            <Timeline entries={about.clubs} />
          </Section>
          <Section label="Skills">
            <Chips items={about.skills.map((s) => s.toUpperCase())} />
          </Section>
          <Section label="Hobbies">
            <Chips items={about.hobbies} />
          </Section>
          <Section label="Awards">
            <ul className="space-y-4 text-lg text-paper/80">
              {about.awards.map((a, i) => (
                <Reveal key={a} as="li" delay={i * 0.06} className="flex gap-3 leading-snug">
                  <span className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                  {a}
                </Reveal>
              ))}
            </ul>
          </Section>
        </div>

        <Reveal as="p" className="micro mt-20 text-mute">
          {/* TODO: replace with the real title, creator and source link (see docs/music-credits.md) */}
          Music: TODO title by TODO creator, used with credit.
        </Reveal>
      </div>
    </section>
  );
}
