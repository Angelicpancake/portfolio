'use client';
import { useAudioStore } from '@/store/useAudioStore';

/**
 * Web Audio engine. Every sound prefers a real file from /public/audio/<name>.mp3
 * (drop in your own samples, no code change) and falls back to a synthesized version.
 */
type Name = 'swoosh-in' | 'swoosh-out' | 'ambient' | 'hover' | 'click';
const NAMES: Name[] = ['swoosh-in', 'swoosh-out', 'ambient', 'hover', 'click'];
const AMBIENT_LEVEL = 0.3; // a full song sits lower than the synth pad did
const DEDUPE_MS = 2500;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let ambientBus: GainNode | null = null;
let noise: AudioBuffer | null = null;
let loading: Promise<void> | null = null;
let ambientStop: (() => void) | null = null;
let duckLevel = 1;
let lastEnter = 0;
let lastBack = 0;
const buffers: Partial<Record<Name, AudioBuffer>> = {};

const masterLevel = () => {
  const { isMuted, volume } = useAudioStore.getState();
  return isMuted ? 0 : volume;
};

const loadFiles = (c: AudioContext) =>
  Promise.all(
    NAMES.map(async (n) => {
      try {
        const res = await fetch(`/audio/${n}.mp3`);
        if (!res.ok || !(res.headers.get('content-type') ?? '').startsWith('audio')) return;
        buffers[n] = await c.decodeAudioData(await res.arrayBuffer());
      } catch {
        /* no file or undecodable: synth fallback */
      }
    }),
  ).then(() => undefined);

const ensure = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (ctx) return ctx;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  const c = new AC();
  ctx = c;
  master = c.createGain();
  master.gain.value = masterLevel();
  master.connect(c.destination);
  ambientBus = c.createGain();
  ambientBus.gain.value = duckLevel * AMBIENT_LEVEL;
  ambientBus.connect(master);

  noise = c.createBuffer(1, c.sampleRate, c.sampleRate);
  const d = noise.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;

  loading = loadFiles(c);

  let prevMuted = useAudioStore.getState().isMuted;
  useAudioStore.subscribe((s) => {
    if (!ctx || !master) return;
    master.gain.setTargetAtTime(s.isMuted ? 0 : s.volume, ctx.currentTime, 0.05);
    if (s.isMuted !== prevMuted) {
      prevMuted = s.isMuted;
      if (s.isMuted) stopAmbient();
      else void startAmbient();
    }
  });
  return c;
};

/** Create/resume the AudioContext. Call from a user gesture. */
export const unlock = () => {
  const c = ensure();
  if (!c) return;
  if (c.state === 'suspended') void c.resume();
  useAudioStore.getState().setUnlocked(true);
};

const play = (name: Name, synth: (c: AudioContext, out: AudioNode) => void) => {
  const c = ctx;
  if (!c || !master || useAudioStore.getState().isMuted) return;
  const buf = buffers[name];
  if (buf) {
    const s = c.createBufferSource();
    s.buffer = buf;
    s.connect(master);
    s.start();
  } else {
    synth(c, master);
  }
};

const burst = (c: AudioContext, out: AudioNode, o: { dur: number; from: number; to: number; peak: number; attack: number; q?: number; type?: BiquadFilterType }) => {
  const t = c.currentTime;
  const src = c.createBufferSource();
  src.buffer = noise;
  src.loop = true;
  const f = c.createBiquadFilter();
  f.type = o.type ?? 'bandpass';
  f.Q.value = o.q ?? 1.2;
  f.frequency.setValueAtTime(o.from, t);
  f.frequency.exponentialRampToValueAtTime(o.to, t + o.dur);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(o.peak, t + o.attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
  src.connect(f).connect(g).connect(out);
  src.start(t);
  src.stop(t + o.dur + 0.05);
};

const tone = (c: AudioContext, out: AudioNode, freq: number, end: number, dur: number, vol: number, type: OscillatorType = 'sine') => {
  const t = c.currentTime;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  o.frequency.exponentialRampToValueAtTime(end, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(out);
  o.start(t);
  o.stop(t + dur + 0.02);
};

const startAmbient = async () => {
  const c = ensure();
  if (!c || !ambientBus || ambientStop) return;
  await loading;
  if (ambientStop || useAudioStore.getState().isMuted) return;
  const bus = ambientBus;
  const out = c.createGain();
  out.gain.value = 0;
  out.gain.setTargetAtTime(1, c.currentTime, 0.8);
  out.connect(bus);
  const stops: (() => void)[] = [];

  if (buffers.ambient) {
    const s = c.createBufferSource();
    s.buffer = buffers.ambient;
    s.loop = true;
    s.connect(out);
    s.start();
    stops.push(() => s.stop());
  } else {
    // synthesized pad: three detuned sines with a slow LFO on the level
    const pad = c.createGain();
    pad.gain.value = 0.05;
    const lfo = c.createOscillator();
    const lfoGain = c.createGain();
    lfo.frequency.value = 0.07;
    lfoGain.gain.value = 0.02;
    lfo.connect(lfoGain).connect(pad.gain);
    lfo.start();
    pad.connect(out);
    stops.push(() => lfo.stop());
    [55, 82.5, 110.7, 164.9].forEach((f) => {
      const o = c.createOscillator();
      o.type = 'sine';
      o.frequency.value = f;
      o.connect(pad);
      o.start();
      stops.push(() => o.stop());
    });
  }

  ambientStop = () => {
    out.gain.setTargetAtTime(0, c.currentTime, 0.2);
    setTimeout(() => {
      stops.forEach((s) => s());
      out.disconnect();
    }, 1200);
  };
};

const stopAmbient = () => {
  ambientStop?.();
  ambientStop = null;
};

/** Fade ambient to `level` (0..1 of its base level), e.g. 0.25 inside a project, 1 on the grid. */
export const duck = (level: number) => {
  duckLevel = level;
  if (ctx && ambientBus) ambientBus.gain.setTargetAtTime(level * AMBIENT_LEVEL, ctx.currentTime, 0.5);
};

export const sfx = {
  hover: () => play('hover', (c, o) => tone(c, o, 1400 + Math.random() * 400, 2200, 0.05, 0.03)),
  click: () =>
    play('click', (c, o) => {
      tone(c, o, 240, 120, 0.1, 0.09, 'triangle');
      burst(c, o, { dur: 0.04, from: 3000, to: 3000, peak: 0.05, attack: 0.005, type: 'highpass' });
    }),
  /** Whoosh into a project. Deduped so the wall click and the route change don't double-fire. */
  enter: () => {
    const now = performance.now();
    if (now - lastEnter < DEDUPE_MS) return;
    lastEnter = now;
    play('swoosh-in', (c, o) => {
      burst(c, o, { dur: 1.0, from: 250, to: 3500, peak: 0.4, attack: 0.5 });
      tone(c, o, 90, 40, 0.5, 0.25);
    });
  },
  /** Reverse whoosh back to Work. */
  back: () => {
    const now = performance.now();
    if (now - lastBack < DEDUPE_MS) return;
    lastBack = now;
    play('swoosh-out', (c, o) => {
      burst(c, o, { dur: 0.9, from: 3200, to: 220, peak: 0.3, attack: 0.15 });
      tone(c, o, 140, 60, 0.35, 0.15);
    });
  },
};

/** Mute toggle for the header: unlock first so the click that unmutes can start audio. */
export const toggleMute = () => {
  unlock();
  useAudioStore.getState().toggleMute();
  if (!useAudioStore.getState().isMuted) sfx.click();
};

export function useAudio() {
  const isMuted = useAudioStore((s) => s.isMuted);
  const volume = useAudioStore((s) => s.volume);
  return { isMuted, volume, toggleMute, unlock, duck, sfx };
}
