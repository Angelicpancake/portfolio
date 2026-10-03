import { create } from 'zustand';

interface State {
  soundOn: boolean;
  activeTags: string[];
  filterOpen: boolean;
  activeSlug: string | null;
  transitioning: boolean;
  hoverSlug: string | null;
  setHoverSlug: (slug: string | null) => void;
  toggleSound: () => void;
  toggleTag: (tag: string) => void;
  clearTags: () => void;
  setFilterOpen: (open: boolean) => void;
  setActiveSlug: (slug: string | null) => void;
  setTransitioning: (v: boolean) => void;
}

export const useStore = create<State>((set) => ({
  soundOn: false,
  activeTags: [],
  filterOpen: false,
  activeSlug: null,
  transitioning: false,
  hoverSlug: null,
  setHoverSlug: (hoverSlug) => set({ hoverSlug }),
  toggleSound: () => set((s) => ({ soundOn: !s.soundOn })),
  toggleTag: (tag) =>
    set((s) => ({
      activeTags: s.activeTags.includes(tag)
        ? s.activeTags.filter((t) => t !== tag)
        : [...s.activeTags, tag],
    })),
  clearTags: () => set({ activeTags: [] }),
  setFilterOpen: (filterOpen) => set({ filterOpen }),
  setActiveSlug: (activeSlug) => set({ activeSlug }),
  setTransitioning: (transitioning) => set({ transitioning }),
}));
