'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { duck, sfx, unlock } from '@/hooks/useAudio';
import { useAudioStore } from '@/store/useAudioStore';

const SOUND_KEY = 'portfolio-sound';

const isDetail = (path: string) => /^\/projects\/[^/]+/.test(path);

/** Unlocks audio on first gesture and plays route sounds + ambient ducking. Renders nothing. */
export default function AudioController() {
  const pathname = usePathname();
  const prev = useRef<string | null>(null);

  // Browsers block audio until the first user gesture, so sound is "on" from the start but begins on first interaction.
  useEffect(() => {
    const events = ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown'] as const;
    const unlockOnce = () => {
      unlock();
      events.forEach((e) => window.removeEventListener(e, unlockOnce, true));
    };
    events.forEach((e) => window.addEventListener(e, unlockOnce, true));
    return () => events.forEach((e) => window.removeEventListener(e, unlockOnce, true));
  }, []);

  // remember an explicit "off" so returning visitors aren't surprised; first-time visitors get sound on
  useEffect(() => {
    try {
      if (localStorage.getItem(SOUND_KEY) === 'off') useAudioStore.setState({ isMuted: true });
    } catch {
      /* storage unavailable */
    }
    return useAudioStore.subscribe((s, prev) => {
      if (s.isMuted === prev.isMuted) return;
      try {
        localStorage.setItem(SOUND_KEY, s.isMuted ? 'off' : 'on');
      } catch {
        /* storage unavailable */
      }
    });
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
