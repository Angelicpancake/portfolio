'use client';
import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface Props {
  images: string[];
  index: number | null;
  alt: string;
  onChange: (index: number | null) => void;
}

export default function Lightbox({ images, index, alt, onChange }: Props) {
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const open = index !== null;

  const go = useCallback(
    (dir: number) => {
      if (index === null) return;
      setZoom(null);
      onChange((index + dir + images.length) % images.length);
    },
    [index, images.length, onChange],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onChange(null);
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, go, onChange]);

  return (
    <AnimatePresence>
      {open && index !== null && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/95"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          <button type="button" aria-label="Close" className="absolute right-5 top-5 z-10 text-paper hover:text-accent" onClick={() => onChange(null)}>
            <X size={24} />
          </button>
          <button type="button" aria-label="Previous" className="absolute left-3 z-10 p-3 text-paper hover:text-accent md:left-8" onClick={() => go(-1)}>
            <ChevronLeft size={32} />
          </button>
          <button type="button" aria-label="Next" className="absolute right-3 z-10 p-3 text-paper hover:text-accent md:right-8" onClick={() => go(1)}>
            <ChevronRight size={32} />
          </button>
          <div className="flex size-full items-center justify-center overflow-hidden p-4 md:p-16" onClick={() => onChange(null)}>
            <motion.img
              key={index}
              src={images[index]}
              alt={`${alt} — image ${index + 1}`}
              className={`max-h-full max-w-full object-contain ${zoom ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: zoom ? 2 : 1 }}
              style={{ transformOrigin: zoom ? `${zoom.x}% ${zoom.y}%` : 'center' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => {
                e.stopPropagation();
                if (zoom) return setZoom(null);
                const r = e.currentTarget.getBoundingClientRect();
                setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
              }}
            />
          </div>
          <p className="micro absolute bottom-6 text-mute">
            {index + 1} / {images.length}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
