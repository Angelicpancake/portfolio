'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { useMediaQuery } from '@/hooks/useMediaQuery';

/** Lenis smooth scroll everywhere except the desktop 3D wall, which handles wheel itself. */
export default function SmoothScroll() {
  const pathname = usePathname();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const wallActive = pathname === '/' && isMobile === false;

  useEffect(() => {
    if (wallActive || isMobile === undefined) return;
    const lenis = new Lenis({ lerp: 0.09 });
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [wallActive, isMobile]);

  return null;
}
