import { create } from 'zustand';

interface AudioState {
  /** Muted by default so we respect browser autoplay policies. */
  isMuted: boolean;
  volume: number;
  /** True once the AudioContext has been created/resumed from a user gesture. */
  unlocked: boolean;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  setUnlocked: (unlocked: boolean) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  isMuted: true,
  volume: 0.6,
  unlocked: false,
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
  setVolume: (volume) => set({ volume: Math.min(1, Math.max(0, volume)) }),
  setUnlocked: (unlocked) => set({ unlocked }),
}));
