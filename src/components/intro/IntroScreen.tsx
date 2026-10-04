'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { animate, motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { about } from '@/data/about';
import { projects } from '@/data/projects';
import { enableSound } from '@/hooks/useAudio';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { asset } from '@/lib/asset';
import { useStore } from '@/store/useStore';

/** Optional artwork shown instead of the pancake, e.g. '/assets/brand/intro-mark.png'. Leave null for the pancake. */
const INTRO_MARK_SRC: string | null = null;
/** false = the entry screen shows on every full page load (any route); true = home only. */
const HOME_ONLY = false;
const MIN_LOAD_MS = 2400;

type Phase = 'loading' | 'ready' | 'leaving' | 'done';

const EASE = [0.22, 1, 0.36, 1] as const;
const PANCAKES = [286, 254, 222]; // top-ellipse centre y of the stacked pancakes, bottom to top

/** One pancake: golden side + lighter top face. */
function Pancake({ cy, rx = 98, side = 30 }: { cy: number; rx?: number; side?: number }) {
  return (
    <g>
      <rect x={200 - rx - 2} y={cy} width={(rx + 2) * 2} height={side} rx={side / 2} fill="url(#pk-side)" stroke="#9a5d1a" strokeWidth="1.5" />
      <ellipse cx="200" cy={cy} rx={rx} ry={rx * 0.195} fill="url(#pk-top)" stroke="#c88a3a" strokeWidth="1.5" />
    </g>
  );
}

/** Original pancake illustration: stack drops in, syrup drips, a pancake gets flipped, steam rises. */
function Mark({ reduce, leaving }: { reduce: boolean; leaving: boolean }) {
  if (INTRO_MARK_SRC) {
    return (
      <motion.img
        src={asset(INTRO_MARK_SRC)}
        alt=""
        className="w-[min(60vmin,420px)] object-contain"
        animate={leaving ? { scale: 2.2, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: leaving ? 1 : 0.6, ease: [0.76, 0, 0.24, 1] }}
      />
    );
  }
  const drops = [
    { x: 126, h: 40, delay: 1.7 },
    { x: 168, h: 26, delay: 1.9 },
    { x: 226, h: 52, delay: 1.8 },
    { x: 268, h: 30, delay: 2.0 },
  ];
  return (
    <motion.svg
      viewBox="0 0 400 400"
      className="w-[min(78vmin,560px)]"
      aria-hidden
      animate={leaving ? { scale: 2.2, opacity: 0, y: 40 } : { scale: 1, opacity: 1, y: 0 }}
      transition={{ duration: leaving ? 1 : 0.6, ease: [0.76, 0, 0.24, 1] }}
    >
      <defs>
        <linearGradient id="pk-side" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eab25f" />
          <stop offset="1" stopColor="#b8741f" />
        </linearGradient>
        <radialGradient id="pk-top" cx="0.45" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#f7d291" />
          <stop offset="1" stopColor="#e3a24e" />
        </radialGradient>
        <linearGradient id="pk-syrup" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c8741f" />
          <stop offset="1" stopColor="#8f4a12" />
        </linearGradient>
      </defs>

      {/* plate */}
      <motion.g initial={reduce ? false : { opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} style={{ transformOrigin: '200px 318px' }} transition={{ duration: 0.8, ease: EASE }}>
        <ellipse cx="200" cy="322" rx="156" ry="30" fill="rgba(242,240,234,0.05)" stroke="rgba(242,240,234,0.55)" strokeWidth="1.5" />
        <ellipse cx="200" cy="320" rx="122" ry="21" fill="none" stroke="rgba(242,240,234,0.22)" strokeWidth="1" />
      </motion.g>

      {/* stack: each pancake drops in with a small squash */}
      {PANCAKES.map((cy, i) => (
        <motion.g
          key={cy}
          initial={reduce ? false : { y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 + i * 0.3, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <Pancake cy={cy} />
        </motion.g>
      ))}

      {/* syrup on the top pancake, with drips running down its side */}
      <motion.g initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.5 }}>
        {drops.map((d) => (
          <motion.rect
            key={d.x}
            x={d.x}
            y={224}
            width="13"
            height={d.h}
            rx="6.5"
            fill="url(#pk-syrup)"
            style={{ transformOrigin: 'top', transformBox: 'fill-box' }}
            initial={reduce ? false : { scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: d.delay, duration: 1.1, ease: EASE }}
          />
        ))}
        <ellipse cx="200" cy="222" rx="86" ry="15.5" fill="url(#pk-syrup)" opacity="0.95" />
        <ellipse cx="170" cy="217" rx="26" ry="4" fill="rgba(255,235,190,0.35)" />
      </motion.g>

      {/* butter pat */}
      <motion.g
        initial={reduce ? false : { y: -44, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.35, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        style={{ transformOrigin: '200px 212px' }}
      >
        <rect x="178" y="203" width="44" height="19" rx="4" fill="#fff0a8" stroke="#e3c55c" strokeWidth="1.5" transform="rotate(-6 200 212)" />
        <path d="M184 208h30" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" transform="rotate(-6 200 212)" />
      </motion.g>

      {/* the flip: a pancake is tossed above the stack, turns over, and comes back down */}
      {!reduce && (
        <motion.g
          style={{ transformOrigin: '200px 150px' }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            y: [0, -34, -58, -34, 0, 0],
            scaleY: [1, 0.25, -1, 0.25, 1, 1],
            rotate: [0, -4, 0, 4, 0, 0],
          }}
          transition={{
            opacity: { delay: 2.2, duration: 0.4 },
            y: { delay: 2.2, duration: 2.6, times: [0, 0.18, 0.4, 0.62, 0.8, 1], ease: 'easeInOut', repeat: Infinity },
            scaleY: { delay: 2.2, duration: 2.6, times: [0, 0.18, 0.4, 0.62, 0.8, 1], ease: 'easeInOut', repeat: Infinity },
            rotate: { delay: 2.2, duration: 2.6, times: [0, 0.18, 0.4, 0.62, 0.8, 1], ease: 'easeInOut', repeat: Infinity },
          }}
        >
          <Pancake cy={150} rx={74} side={16} />
        </motion.g>
      )}

      {/* steam */}
      {!reduce &&
        [140, 262].map((x, i) => (
          <motion.path
            key={x}
            d={`M${x} 232c-10-14 10-26 0-40s10-26 0-40`}
            fill="none"
            stroke="rgba(242,240,234,0.55)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 0.6, 0], y: [0, -34] }}
            transition={{ delay: 2 + i * 0.7, duration: 2.6, repeat: Infinity, ease: 'easeOut' }}
          />
        ))}
    </motion.svg>
  );
}

/** Replaces the native cursor over the entry screen. Reads "click to enable sound" once ready. */
function CursorHint({ ready, hidden }: { ready: boolean; hidden: boolean }) {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 520, damping: 42, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 520, damping: 42, mass: 0.4 });
  useEffect(() => {
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, [x, y]);
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[110] flex items-center gap-3"
      style={{ x: sx, y: sy, opacity: hidden ? 0 : 1 }}
    >
      <span className={`-ml-2.5 -mt-2.5 block size-5 rounded-full border transition-colors ${ready ? 'border-accent bg-accent/25' : 'border-paper/50'}`} />
      <span className="micro -mt-2.5 whitespace-nowrap rounded-full bg-paper px-3 py-1.5 text-ink">{ready ? 'Click to enable sound' : 'Loading'}</span>
    </motion.div>
  );
}

/** Full-screen entry screen: pancake motion graphics, a counter, and a click anywhere to enter with sound. */
export default function IntroScreen() {
  const pathname = usePathname();
  const reduce = useReducedMotion() ?? false;
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)') ?? false;
  const setIntroDone = useStore((s) => s.setIntroDone);
  const skip = HOME_ONLY && pathname !== '/';
  const [phase, setPhase] = useState<Phase>(skip ? 'done' : 'loading');
  const [count, setCount] = useState(0);
  const [overLink, setOverLink] = useState(false);
  const enterRef = useRef<HTMLButtonElement>(null);
  const radius = useMotionValue(0);
  const mask = useMotionTemplate`radial-gradient(circle at 50% 50%, transparent ${radius}px, #000 ${radius}px)`;

  useEffect(() => {
    if (skip) {
      setPhase('done');
      setIntroDone(true);
    }
  }, [skip, setIntroDone]);

  // counter + readiness (fonts and the wall's first textures), with a minimum duration
  useEffect(() => {
    if (phase !== 'loading') return;
    const started = performance.now();
    const controls = animate(0, 100, {
      duration: MIN_LOAD_MS / 1000,
      ease: [0.4, 0, 0.2, 1],
      onUpdate: (v) => setCount(Math.min(99, Math.round(v))),
    });
    const preload = Promise.race([
      Promise.all([
        document.fonts.ready,
        ...projects.map(
          (p) =>
            new Promise<void>((res) => {
              const img = new Image();
              img.onload = img.onerror = () => res();
              img.src = p.thumbnailUrl;
            }),
        ),
      ]),
      new Promise((res) => setTimeout(res, 5000)),
    ]);
    let alive = true;
    void preload.then(() => {
      const wait = Math.max(0, MIN_LOAD_MS - (performance.now() - started));
      setTimeout(() => {
        if (!alive) return;
        setCount(100);
        setPhase('ready');
      }, wait);
    });
    return () => {
      alive = false;
      controls.stop();
    };
  }, [phase]);

  // lock scroll while the screen is up; focus the full-screen enter button once ready
  useEffect(() => {
    if (phase === 'done') return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [phase]);
  useEffect(() => {
    if (phase === 'ready') enterRef.current?.focus();
  }, [phase]);

  const enter = (withSound: boolean) => {
    if (phase !== 'ready') return;
    enableSound(withSound); // inside the click so the browser lets audio start
    setPhase('leaving');
    setIntroDone(true);
    if (reduce) {
      setTimeout(() => setPhase('done'), 450);
      return;
    }
    const diag = Math.hypot(window.innerWidth, window.innerHeight) / 2 + 40;
    animate(radius, diag, { duration: 1.15, ease: [0.76, 0, 0.24, 1], onComplete: () => setPhase('done') });
  };

  useEffect(() => {
    if (phase !== 'ready') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') enter(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (phase === 'done') return null;

  const leaving = phase === 'leaving';
  const ready = phase === 'ready';
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink text-paper ${fine ? 'cursor-none' : ''}`}
      style={leaving && !reduce ? { WebkitMaskImage: mask, maskImage: mask } : undefined}
      animate={leaving && reduce ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* click / tap / Enter anywhere */}
      <button
        ref={enterRef}
        type="button"
        aria-label="Enter with sound"
        disabled={!ready}
        onClick={() => enter(true)}
        className="absolute inset-0 z-0 outline-none focus-visible:outline-2 focus-visible:-outline-offset-8 focus-visible:outline-accent"
        style={{ cursor: 'inherit' }}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5 md:p-8">
        <p className="micro">{about.name}</p>
        <p className="micro text-mute">Portfolio</p>
      </div>

      <div className="pointer-events-none relative z-10">
        <Mark reduce={reduce} leaving={leaving} />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-5 p-6 pb-10 md:pb-12">
        {!ready && !leaving ? (
          <p className="micro tabular-nums text-mute" aria-live="polite">
            {String(count).padStart(3, '0')} / 100
          </p>
        ) : (
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: leaving ? 0 : 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {!fine && <p className="micro text-paper">Tap to enable sound</p>}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                enter(false);
              }}
              onPointerEnter={() => setOverLink(true)}
              onPointerLeave={() => setOverLink(false)}
              className="pointer-events-auto cursor-pointer micro text-mute underline-offset-4 transition-colors hover:text-paper hover:underline"
            >
              Enter without sound
            </button>
          </motion.div>
        )}
      </div>

      {fine && !leaving && <CursorHint ready={ready} hidden={overLink} />}
    </motion.div>
  );
}
