/* eslint-disable @next/next/no-img-element */
'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { matchesFilter, projects } from '@/data/projects';
import { sfx } from '@/hooks/useSound';
import { useStore } from '@/store/useStore';

/** Filterable 2D card grid: the mobile Work view and the /projects catalog. */
export default function ProjectGrid({ className = '' }: { className?: string }) {
  const activeTags = useStore((s) => s.activeTags);
  const list = projects.filter((p) => matchesFilter(p, activeTags));

  return (
    <ul className={`grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4 ${className}`}>
      {list.map((p, i) => (
        <motion.li
          key={p.slug}
          layout
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -8% 0px' }}
          transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
        >
          <Link href={`/projects/${p.slug}`} onClick={sfx.click} onMouseEnter={sfx.hover} className="group block">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white/5">
              <img
                src={p.thumbnailUrl}
                alt={p.title}
                loading="lazy"
                className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              />
            </div>
            <div className="micro mt-3 flex items-baseline justify-between gap-2">
              <span className="text-paper">{p.title}</span>
              <span className="text-mute">{p.category}</span>
            </div>
            <p className="micro text-mute">{p.tags.join(' · ')}</p>
          </Link>
        </motion.li>
      ))}
      {list.length === 0 && <li className="micro col-span-full py-20 text-center text-mute">No projects match these filters.</li>}
    </ul>
  );
}
