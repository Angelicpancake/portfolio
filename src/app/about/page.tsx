import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'About — Portfolio' };

const SKILLS = ['TypeScript', 'React / Next.js', 'Three.js / WebGL', 'GLSL', 'Node', 'Python', 'AI / LLM apps', 'Motion design'];
const TIMELINE = [
  { year: '2025', title: 'Independent', body: 'Building interactive experiences and AI-powered tools.' },
  { year: '2023', title: 'Senior Engineer', body: 'Led front-end for a realtime analytics product.' },
  { year: '2021', title: 'Creative Developer', body: 'Brand sites and WebGL campaigns for studios.' },
  { year: '2019', title: 'Started out', body: 'First commercial work in web development.' },
];

export default function AboutPage() {
  return (
    <section className="min-h-screen bg-ink px-4 pb-40 pt-28 md:px-8">
      <h1 className="max-w-4xl text-4xl font-medium leading-[1.05] tracking-tight md:text-7xl">
        I build interactive software and creative experiences for the web.
      </h1>
      <div className="mt-16 grid gap-16 md:grid-cols-2">
        <div>
          <h2 className="micro mb-4 text-mute">Profile</h2>
          <p className="max-w-lg text-lg leading-relaxed text-paper/80">
            Replace this with your own story. Placeholder copy: a developer working between engineering and design, obsessed with motion,
            performance and the small details that make a site feel alive.
          </p>
          <h2 className="micro mb-4 mt-12 text-mute">Skills</h2>
          <ul className="flex flex-wrap gap-2">
            {SKILLS.map((s) => (
              <li key={s} className="micro rounded-full border border-white/15 px-4 py-2">
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="micro mb-4 text-mute">Timeline</h2>
          <ol className="divide-y divide-white/10 border-y border-white/10">
            {TIMELINE.map((t) => (
              <li key={t.year} className="grid grid-cols-[5rem_1fr] gap-4 py-6">
                <span className="micro text-accent">{t.year}</span>
                <div>
                  <p className="text-xl">{t.title}</p>
                  <p className="mt-1 text-paper/60">{t.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <p className="micro mt-20 text-mute">
        {/* TODO: replace with the real title, creator and source link (see docs/music-credits.md) */}
        Music: TODO title by TODO creator, used with credit.
      </p>
    </section>
  );
}
