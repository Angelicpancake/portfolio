/* eslint-disable @next/next/no-img-element */
'use client';
import { useState } from 'react';

export default function VideoHero({ src, poster, title }: { src: string; poster: string; title: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-white/5 md:aspect-[21/9]">
      {failed ? (
        <img src={poster} alt={title} className="size-full object-cover" />
      ) : (
        <video
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
