'use client';
import Link from 'next/link';
import { useTimezones } from '@/hooks/useTimezones';
import { sfx, toggleMute } from '@/hooks/useAudio';
import { useAudioStore } from '@/store/useAudioStore';

export default function Header() {
  const clocks = useTimezones();
  const soundOn = !useAudioStore((s) => s.isMuted);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-start justify-between gap-4 px-4 py-4 md:px-8 md:py-6">
      <Link href="/" className="micro flex items-center gap-2 text-paper" onClick={sfx.click} aria-label="Home">
        <span className="inline-block size-3 rounded-full bg-accent" />
        <span className="font-semibold tracking-[0.2em]">JR®</span>
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
