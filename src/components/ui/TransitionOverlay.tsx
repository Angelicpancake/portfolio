'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';

/** Fades to black at the end of the camera zoom, then reveals the destination route. */
export default function TransitionOverlay() {
  const transitioning = useStore((s) => s.transitioning);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== '/') useStore.getState().setTransitioning(false);
  }, [pathname]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[70] bg-ink"
      initial={false}
      animate={{ opacity: transitioning ? 1 : 0 }}
      transition={transitioning ? { delay: 0.85, duration: 0.45 } : { duration: 0.5 }}
    />
  );
}
