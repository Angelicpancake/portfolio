/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import { about, type Entry } from '@/data/about';
import { asset } from '@/lib/asset';

export const metadata: Metadata = {
  title: 'About — Portfolio',
  description: about.headline,
};

const Heading = ({ children }: { children: React.ReactNode }) => <h2 className="micro mb-4 text-mute">{children}</h2>;

const Chips = ({ items }: { items: string[] }) => (
  <ul className="flex flex-wrap gap-2">
    {items.map((s) => (
      <li key={s} className="micro rounded-full border border-white/15 px-4 py-2">
        {s}
      </li>
    ))}
  </ul>
);

const Timeline = ({ entries }: { entries: Entry[] }) => (
  <ol className="divide-y divide-white/10 border-y border-white/10">
    {entries.map((e) => (
      <li key={`${e.year}-${e.title}`} className="grid grid-cols-[6rem_1fr] gap-4 py-6">
        <span className="micro pt-1.5 text-accent">{e.year}</span>
        <div>
          <p className="text-xl leading-snug">{e.title}</p>
          <p className="mt-1 text-paper/60">{e.description}</p>
        </div>
      </li>
    ))}
  </ol>
);

export default function AboutPage() {
  return (
    <section className="min-h-screen bg-ink px-4 pb-40 pt-28 md:px-8">
      <div className="grid gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
        <div className="md:sticky md:top-28 md:self-start">
          <img
            src={asset('/assets/profile.jpg')}
            alt={about.name}
            width={1000}
            height={1250}
            className="aspect-[4/5] w-full max-w-md rounded-2xl object-cover"
          />
        </div>

        <div>
          <h1 className="text-3xl font-medium leading-[1.1] tracking-tight md:text-5xl">{about.headline}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/75">{about.paragraph}</p>

          <div className="mt-16">
            <Heading>Work experience</Heading>
            <Timeline entries={about.work} />
          </div>

          <div className="mt-16">
            <Heading>Clubs / Extracurriculars</Heading>
            <Timeline entries={about.clubs} />
          </div>

          <div className="mt-16">
            <Heading>Skills</Heading>
            <Chips items={about.skills.map((s) => s.toUpperCase())} />
          </div>

          <div className="mt-16 grid gap-16 md:grid-cols-2">
            <div>
              <Heading>Hobbies</Heading>
              <Chips items={about.hobbies} />
            </div>
            <div>
              <Heading>Awards</Heading>
              <ul className="space-y-3 text-paper/80">
                {about.awards.map((a) => (
                  <li key={a} className="flex gap-3 leading-snug">
                    <span className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="micro mt-20 text-mute">
            {/* TODO: replace with the real title, creator and source link (see docs/music-credits.md) */}
            Music: TODO title by TODO creator, used with credit.
          </p>
        </div>
      </div>
    </section>
  );
}
