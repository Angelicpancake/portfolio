/* eslint-disable @next/next/no-img-element */
'use client';
import { useEffect, useRef, useState } from 'react';

interface Props {
  src: string;
  poster: string;
  title: string;
  className?: string;
}

/** Muted, looping, inline autoplay video (no iframe). Pauses off-screen; falls back to the poster on error. */
export default function AutoplayVideo({ src, poster, title, className = '' }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) void v.play().catch(() => undefined);
        else v.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`relative aspect-video w-full overflow-hidden rounded-2xl bg-white/5 ${className}`}>
      {failed ? (
        <img src={poster} alt={title} className="size-full object-cover" />
      ) : (
        <video
          ref={ref}
          className="size-full object-cover"
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setFailed(true)}
          aria-label={`${title} preview`}
        />
      )}
    </div>
  );
}
