'use client';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { allTags, matchesFilter, projects } from '@/data/projects';
import { sfx } from '@/hooks/useAudio';
import { useStore } from '@/store/useStore';

export default function FilterModal() {
  const open = useStore((s) => s.filterOpen);
  const setOpen = useStore((s) => s.setFilterOpen);
  const activeTags = useStore((s) => s.activeTags);
  const toggleTag = useStore((s) => s.toggleTag);
  const clearTags = useStore((s) => s.clearTags);
  const matching = projects.filter((p) => matchesFilter(p, activeTags)).length;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button type="button" aria-label="Close filters" className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Filter projects"
            className="relative w-full max-w-xl rounded-t-3xl border border-white/10 bg-[#101014] p-6 pb-10 md:mb-6 md:rounded-3xl"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 36 }}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="micro text-mute">Filter by tag</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="text-paper hover:text-accent">
                <X size={18} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => {
                const on = activeTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    aria-pressed={on}
                    onClick={() => {
                      sfx.click();
                      toggleTag(tag);
                    }}
                    onMouseEnter={sfx.hover}
                    className={`micro rounded-full border px-5 py-3 transition-colors ${on ? 'border-accent bg-accent text-ink' : 'border-white/15 text-paper hover:bg-white/10'}`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
            <div className="mt-8 flex items-center justify-between">
              <button type="button" onClick={clearTags} className="micro text-mute hover:text-paper">
                Clear all
              </button>
              <button
                type="button"
                onClick={() => {
                  sfx.click();
                  setOpen(false);
                }}
                className="micro rounded-full bg-paper px-6 py-3 text-ink hover:bg-accent"
              >
                Show {matching} {matching === 1 ? 'project' : 'projects'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
