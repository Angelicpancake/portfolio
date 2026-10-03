/* eslint-disable @next/next/no-img-element */
'use client';
import Link from 'next/link';
import { asset } from '@/lib/asset';
import { useTimezones } from '@/hooks/useTimezones';
import { sfx, toggleMute } from '@/hooks/useAudio';
import { useAudioStore } from '@/store/useAudioStore';

export default function Header() {
  const clocks = useTimezones();
  const soundOn = !useAudioStore((s) => s.isMuted);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-start justify-between gap-4 px-4 py-4 md:px-8 md:py-6">
      <Link href="/" className="flex items-center" onClick={sfx.click} aria-label="Home">
        <img
          src={asset('/assets/brand/joshua.png')}
          alt="Joshua"
          width={112}
          height={112}
          className="size-24 object-contain transition-transform duration-300 hover:scale-110 md:size-28"
        />
      </Link>

      <div className="micro hidden items-center gap-6 text-mute md:flex" aria-label="Local times">
        {clocks.map((c) => (
          <span key={c.label} className="tabular-nums">
            <span className="text-paper">{c.label}</span> {c.time}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <button type="button" onClick={toggleMute} className="micro text-paper transition-opacity hover:opacity-70" aria-pressed={soundOn}>
          [SOUND {soundOn ? 'ON' : 'OFF'}]
        </button>
        <a
          href="mailto:joshuasren@gmail.com"
          onClick={sfx.click}
          onMouseEnter={sfx.hover}
          className="micro rounded-full bg-paper px-4 py-2 text-ink transition-colors hover:bg-accent"
        >
          Let&apos;s Talk
        </a>
      </div>
    </header>
  );
}
