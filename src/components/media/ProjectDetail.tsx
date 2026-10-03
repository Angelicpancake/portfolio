/* eslint-disable @next/next/no-img-element */
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/data/projects';
import { sfx } from '@/hooks/useSound';
import Lightbox from './Lightbox';
import VideoHero from './VideoHero';

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

      <header className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <h1 className="text-6xl font-medium tracking-tight md:text-9xl">{project.title}</h1>
        <p className="micro text-mute">
          {project.category} · {project.year}
        </p>
      </header>

      <div className="mt-8">
        <VideoHero src={project.videoUrl} poster={project.thumbnailUrl} title={project.title} />
      </div>

      <section className="mt-16 grid gap-12 md:grid-cols-[1fr_2fr]">
        <motion.div {...fade}>
          <h2 className="micro mb-3 text-mute">Overview</h2>
          <p className="text-2xl leading-snug">{project.description}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <li key={t} className="micro rounded-full border border-white/15 px-3 py-1.5">
                {t}
              </li>
            ))}
          </ul>
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={sfx.click}
            onMouseEnter={sfx.hover}
            className="micro mt-8 inline-flex items-center gap-2 rounded-full bg-paper px-5 py-3 text-ink hover:bg-accent"
          >
            Live preview <ArrowUpRight size={14} />
          </a>
        </motion.div>
        <motion.div {...fade}>
          <h2 className="micro mb-3 text-mute">Details</h2>
          <p className="max-w-2xl text-lg leading-relaxed text-paper/75">{project.details}</p>
          <h2 className="micro mb-3 mt-10 text-mute">Tech stack</h2>
          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-4">
            {project.stack.map((s) => (
              <li key={s} className="bg-ink p-4 text-sm">
                {s}
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

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
