'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import { sfx } from '@/hooks/useSound';
import { useStore } from '@/store/useStore';

const TABS = [
  { href: '/', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
];

export default function Navigation() {
  const pathname = usePathname();
  const setFilterOpen = useStore((s) => s.setFilterOpen);
  const count = useStore((s) => s.activeTags.length);
  const activeHref = pathname.startsWith('/projects') ? '/projects' : pathname === '/' ? '/' : pathname;

  return (
    <nav className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 md:bottom-8" aria-label="Primary">
      <div className="flex w-full max-w-md items-center justify-between gap-2 rounded-full border border-white/10 bg-white/[0.06] p-1.5 backdrop-blur-xl">
        <ul className="flex items-center">
          {TABS.map((t) => {
            const active = activeHref === t.href;
            return (
              <li key={t.href} className="relative">
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-paper"
                    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                  />
                )}
                <Link
                  href={t.href}
                  onClick={sfx.click}
                  onMouseEnter={sfx.hover}
                  className={`micro relative block px-4 py-2.5 transition-colors ${active ? 'text-ink' : 'text-paper/80 hover:text-paper'}`}
                >
                  {t.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          onClick={() => {
            sfx.click();
            setFilterOpen(true);
          }}
          onMouseEnter={sfx.hover}
          className="micro flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-paper transition-colors hover:bg-white/10"
        >
          <SlidersHorizontal size={13} />
          Filter{count > 0 && <span className="text-accent">({count})</span>}
        </button>
      </div>
    </nav>
  );
}
