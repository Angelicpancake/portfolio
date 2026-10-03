/* eslint-disable @next/next/no-img-element */
'use client';
import { useEffect, useRef, useState } from 'react';

interface Props {
  src: string;
  poster: string;
  alt: string;
  className?: string;
}

/** Card-sized muted looping preview. Plays only while on screen; poster-only for reduced motion or on error. */
export default function PreviewVideo({ src, poster, alt, className = '' }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [still, setStill] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStill(true);
      return;
    }
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) void v.play().catch(() => undefined);
        else v.pause();
      },
      { threshold: 0.2 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  if (still) return <img src={poster} alt={alt} loading="lazy" className={className} />;

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={`${alt} preview`}
      onError={() => setStill(true)}
    />
  );
}
