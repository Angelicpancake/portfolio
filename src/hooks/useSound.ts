'use client';
import { useStore } from '@/store/useStore';

let ctx: AudioContext | null = null;
let drone: { osc: OscillatorNode[]; gain: GainNode } | null = null;

const getCtx = () => {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
};

const blip = (freq: number, dur: number, vol: number, type: OscillatorType = 'sine', slide = 1) => {
  if (!useStore.getState().soundOn) return;
  const c = getCtx();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  const t = c.currentTime;
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  o.frequency.exponentialRampToValueAtTime(freq * slide, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
};

export const sfx = {
  hover: () => blip(880 + Math.random() * 220, 0.09, 0.03, 'sine', 1.3),
  click: () => blip(220, 0.18, 0.08, 'triangle', 0.5),
  transition: () => blip(110, 0.8, 0.06, 'sawtooth', 3),
};

/** Start/stop a quiet ambient drone. Must be called from a user gesture when enabling. */
export const setAmbient = (on: boolean) => {
  const c = getCtx();
  if (!c) return;
  if (on && !drone) {
    const gain = c.createGain();
    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(0.025, c.currentTime + 2);
    gain.connect(c.destination);
    const osc = [55, 82.5, 110.5].map((f) => {
      const o = c.createOscillator();
      o.type = 'sine';
      o.frequency.value = f;
      o.connect(gain);
      o.start();
      return o;
    });
    drone = { osc, gain };
  } else if (!on && drone) {
    const d = drone;
    drone = null;
    d.gain.gain.cancelScheduledValues(c.currentTime);
    d.gain.gain.linearRampToValueAtTime(0, c.currentTime + 0.4);
    setTimeout(() => d.osc.forEach((o) => o.stop()), 500);
  }
};
