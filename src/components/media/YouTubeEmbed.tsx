'use client';

export default function YouTubeEmbed({ id, title, short }: { id: string; title: string; short?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-white/5 ${short ? 'mx-auto aspect-[9/16] max-h-[80vh]' : 'aspect-video'}`}
    >
      <iframe
        className="absolute inset-0 size-full"
        src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
        title={`${title} video`}
        loading="lazy"
        allow="accelerometer; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
      />
    </div>
  );
}
