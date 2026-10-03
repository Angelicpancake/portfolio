/* eslint-disable @next/next/no-img-element */
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/data/projects';
import { sfx } from '@/hooks/useSound';
import Lightbox from './Lightbox';
import SectionRenderer from './SectionRenderer';
import VideoHero from './VideoHero';
import YouTubeEmbed from './YouTubeEmbed';

interface Props {
  project: Project;
  prev: Project;
  next: Project;
}

const fade = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.7 } };

export default function ProjectDetail({ project, prev, next }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <motion.article
      className="min-h-screen bg-ink px-4 pb-40 pt-24 md:px-8 md:pt-28"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Link href="/" className="micro text-mute hover:text-paper" onClick={sfx.click}>
        ← Back to work
      </Link>

      <header className="mt-6 flex flex-col gap-3">
        <p className="micro text-mute">{project.category}</p>
        <h1 className="text-6xl font-medium tracking-tight md:text-9xl">{project.title}</h1>
        <p className="max-w-3xl text-xl text-paper/70 md:text-3xl">{project.tagline}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {project.links.map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={sfx.click}
              onMouseEnter={sfx.hover}
              className="micro inline-flex items-center gap-2 rounded-full bg-paper px-5 py-3 text-ink hover:bg-accent"
            >
              {l.label} <ArrowUpRight size={14} />
            </a>
          ))}
          {project.tags.map((t) => (
            <span key={t} className="micro rounded-full border border-white/15 px-3 py-2.5">
              {t}
            </span>
          ))}
        </div>
      </header>

      <div className="mt-10">
        {project.youtube ? (
          <YouTubeEmbed id={project.youtube.id} title={project.title} short={project.youtube.short} />
        ) : project.videoUrl ? (
          <VideoHero src={project.videoUrl} poster={project.thumbnailUrl} title={project.title} />
        ) : (
          <img src={project.thumbnailUrl} alt={project.title} className="aspect-video w-full rounded-2xl object-cover" />
        )}
      </div>

      <motion.div {...fade} className="mt-16 grid gap-12 md:grid-cols-[2fr_1fr]">
        <SectionRenderer sections={project.sections} />
        <aside>
          <h2 className="micro mb-4 text-mute">Built with</h2>
          <p className="text-lg leading-relaxed text-paper/80">{project.builtWith}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <li key={s} className="micro rounded-full border border-white/15 px-3 py-1.5">
                {s}
              </li>
            ))}
          </ul>
        </aside>
      </motion.div>

      {project.galleryImages.length > 0 && (
        <section className="mt-20 space-y-4" aria-label="Gallery">
          {project.galleryImages.map((src, i) => (
            <motion.button
              key={src}
              type="button"
              {...fade}
              onClick={() => {
                sfx.click();
                setLightbox(i);
              }}
              className="block w-full cursor-zoom-in overflow-hidden rounded-2xl"
              aria-label={`Open image ${i + 1}`}
            >
              <img src={src} alt={`${project.title} screenshot ${i + 1}`} loading="lazy" className="w-full transition-transform duration-700 hover:scale-[1.02]" />
            </motion.button>
          ))}
        </section>
      )}

      <nav className="micro mt-20 flex justify-between border-t border-white/10 pt-8" aria-label="More projects">
        <Link href={`/projects/${prev.slug}`} onClick={sfx.click} className="hover:text-accent">
          ← {prev.title}
        </Link>
        <Link href={`/projects/${next.slug}`} onClick={sfx.click} className="hover:text-accent">
          {next.title} →
        </Link>
      </nav>

      <Lightbox images={project.galleryImages} index={lightbox} alt={project.title} onChange={setLightbox} />
    </motion.article>
  );
}
