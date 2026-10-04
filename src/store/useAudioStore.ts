import { create } from 'zustand';

interface AudioState {
  /** Sound is ON by default, but browsers only let audio start after a user gesture (see AudioController). */
  isMuted: boolean;
  volume: number;
  /** True once the AudioContext has been created/resumed from a user gesture. */
  unlocked: boolean;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  setUnlocked: (unlocked: boolean) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  isMuted: false,
  volume: 0.6,
  unlocked: false,
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
  setVolume: (volume) => set({ volume: Math.min(1, Math.max(0, volume)) }),
  setUnlocked: (unlocked) => set({ unlocked }),
}));
