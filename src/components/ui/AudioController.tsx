'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { duck, sfx, unlock } from '@/hooks/useAudio';

const isDetail = (path: string) => /^\/projects\/[^/]+/.test(path);

/** Unlocks audio on first gesture and plays route sounds + ambient ducking. Renders nothing. */
export default function AudioController() {
  const pathname = usePathname();
  const prev = useRef<string | null>(null);

  useEffect(() => {
    const once = () => unlock();
    window.addEventListener('pointerdown', once, { once: true });
    window.addEventListener('keydown', once, { once: true });
    return () => {
      window.removeEventListener('pointerdown', once);
      window.removeEventListener('keydown', once);
    };
  }, []);

  useEffect(() => {
    const from = prev.current;
    prev.current = pathname;
    if (from === null) {
      if (isDetail(pathname)) duck(0.25); // deep link straight into a project
      return;
    }
    const was = isDetail(from);
    const now = isDetail(pathname);
    if (!was && now) {
      sfx.enter(); // deduped against the wall's click-zoom
      duck(0.25);
    } else if (was && !now) {
      sfx.back();
      duck(1);
    }
  }, [pathname]);

  return null;
}
