'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { animate, motion, useMotionTemplate, useMotionValue, useReducedMotion } from 'framer-motion';
import { about } from '@/data/about';
import { projects } from '@/data/projects';
import { enableSound } from '@/hooks/useAudio';
import { asset } from '@/lib/asset';
import { useStore } from '@/store/useStore';

/** Optional artwork shown inside the rings, e.g. '/assets/brand/intro-mark.png'. Leave null for the plain mark. */
const INTRO_MARK_SRC: string | null = null;

const SEEN_KEY = 'portfolio-intro-seen';
const MIN_LOAD_MS = 2400;

type Phase = 'loading' | 'ready' | 'leaving' | 'done';

const RINGS = [
  { r: 58, w: 1.5, delay: 0.1, dash: '1' },
  { r: 104, w: 1, delay: 0.35, dash: '0.78' },
  { r: 150, w: 1, delay: 0.6, dash: '0.9' },
  { r: 188, w: 0.75, delay: 0.85, dash: '0.62' },
];
const ORBITS = [
  { r: 104, size: 4, dur: 9, start: 30 },
  { r: 150, size: 3, dur: 14, start: 200 },
  { r: 188, size: 5, dur: 20, start: 110 },
  { r: 58, size: 2.5, dur: 6, start: 280 },
];

/** Original ring/orbit mark. Draws itself in, then orbits; scales away when entering. */
function Mark({ reduce, leaving }: { reduce: boolean; leaving: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 400 400"
      className="w-[min(78vmin,560px)]"
      aria-hidden
      animate={leaving ? { scale: 2.4, opacity: 0 } : { scale: 1, opacity: 1 }}
      transition={{ duration: leaving ? 1 : 0.6, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* hairline crosshair */}
      <motion.path
        d="M0 200H400M200 0V400"
        stroke="rgba(242,240,234,0.12)"
        strokeWidth="0.75"
        fill="none"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, ease: 'easeInOut' }}
      />
      {RINGS.map((ring) => (
        <motion.circle
          key={ring.r}
          cx="200"
          cy="200"
          r={ring.r}
          fill="none"
          stroke="rgba(242,240,234,0.85)"
          strokeWidth={ring.w}
          strokeLinecap="round"
          strokeDasharray={`${ring.dash} 1`}
          pathLength={1}
          style={{ rotate: -90, transformOrigin: '200px 200px' }}
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: ring.delay, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
      {ORBITS.map((o, i) => (
        <motion.g
          key={i}
          style={{ transformOrigin: '200px 200px', rotate: o.start }}
          animate={reduce ? undefined : { rotate: o.start + 360 }}
          transition={{ duration: o.dur, ease: 'linear', repeat: Infinity }}
        >
          <motion.circle
            cx={200 + o.r}
            cy="200"
            r={o.size}
            fill="#f2f0ea"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 + i * 0.15, duration: 0.5 }}
          />
        </motion.g>
      ))}
      {INTRO_MARK_SRC ? (
        <image href={asset(INTRO_MARK_SRC)} x="140" y="140" width="120" height="120" preserveAspectRatio="xMidYMid meet" />
      ) : (
        <>
          <motion.circle
            cx="200"
            cy="200"
            r="9"
            fill="#c8ff3d"
            initial={reduce ? false : { scale: 0 }}
            animate={reduce ? undefined : { scale: [0, 1, 1.25, 1] }}
            style={{ transformOrigin: '200px 200px' }}
            transition={{ duration: 1.2, delay: 0.3, times: [0, 0.5, 0.75, 1] }}
          />
          {!reduce && (
            <motion.circle
              cx="200"
              cy="200"
              r="9"
              fill="none"
              stroke="#c8ff3d"
              strokeWidth="1"
              style={{ transformOrigin: '200px 200px' }}
              animate={{ scale: [1, 4], opacity: [0.7, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay: 1 }}
            />
          )}
        </>
      )}
    </motion.svg>
  );
}

/** Full-screen entry screen: original motion graphics, a counter, and Enter / Enter without sound. The click unlocks audio. */
export default function IntroScreen() {
  const pathname = usePathname();
  const reduce = useReducedMotion() ?? false;
  const setIntroDone = useStore((s) => s.setIntroDone);
  const [phase, setPhase] = useState<Phase>(pathname === '/' ? 'loading' : 'done');
  const [count, setCount] = useState(0);
  const enterRef = useRef<HTMLButtonElement>(null);
  const radius = useMotionValue(0);
  const mask = useMotionTemplate`radial-gradient(circle at 50% 50%, transparent ${radius}px, #000 ${radius}px)`;

  // skip on non-home routes and for returning visitors in the same session
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === '1';
    } catch {
      /* storage unavailable */
    }
    if (pathname !== '/' || seen) {
      setPhase('done');
      setIntroDone(true);
    }
  }, [pathname, setIntroDone]);

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

  // lock scroll and focus the primary action while the screen is up
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
    try {
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* storage unavailable */
    }
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
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink text-paper"
      style={leaving && !reduce ? { WebkitMaskImage: mask, maskImage: mask } : undefined}
      animate={leaving && reduce ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5 md:p-8">
        <p className="micro">{about.name}</p>
        <p className="micro text-mute">Portfolio</p>
      </div>

      <Mark reduce={reduce} leaving={leaving} />

      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-5 p-6 pb-10 md:pb-12">
        {phase === 'loading' ? (
          <p className="micro tabular-nums text-mute" aria-live="polite">
            {String(count).padStart(3, '0')} / 100
          </p>
        ) : (
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: leaving ? 0 : 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              ref={enterRef}
              type="button"
              onClick={() => enter(true)}
              className="micro rounded-full bg-paper px-10 py-4 text-ink transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              Enter
            </button>
            <button
              type="button"
              onClick={() => enter(false)}
              className="micro text-mute underline-offset-4 transition-colors hover:text-paper hover:underline"
            >
              Enter without sound
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
