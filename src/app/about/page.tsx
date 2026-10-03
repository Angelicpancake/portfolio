import type { Metadata } from 'next';
import AboutHero from '@/components/about/AboutHero';
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
      <h2 className="micro text-mute md:sticky md:top-28">{label}</h2>
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
    <section className="min-h-screen bg-ink px-4 pb-40 pt-24 md:px-8 md:pt-28">
      <AboutHero src={asset('/assets/profile-wide.jpg')} alt={about.name} caption={about.name} />

      <div className="mx-auto mt-16 max-w-6xl md:mt-28">
        <WordReveal text={about.headline} className="text-3xl font-medium leading-[1.12] tracking-tight md:text-6xl" />
        <Reveal as="p" className="mt-8 max-w-2xl text-lg leading-relaxed text-paper/75 md:text-xl">
          {about.paragraph}
        </Reveal>

        <div className="mt-24 space-y-24 md:mt-36 md:space-y-32">
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

        <Reveal as="p" className="micro mt-28 text-mute">
          {/* TODO: replace with the real title, creator and source link (see docs/music-credits.md) */}
          Music: TODO title by TODO creator, used with credit.
        </Reveal>
      </div>
    </section>
  );
}
