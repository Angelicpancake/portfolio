import { create } from 'zustand';

interface State {
  activeTags: string[];
  filterOpen: boolean;
  activeSlug: string | null;
  transitioning: boolean;
  /** True once the entry screen has been dismissed (or skipped); the wall's entrance waits for it. */
  introDone: boolean;
  setIntroDone: (v: boolean) => void;
  hoverSlug: string | null;
  setHoverSlug: (slug: string | null) => void;
  toggleTag: (tag: string) => void;
  clearTags: () => void;
  setFilterOpen: (open: boolean) => void;
  setActiveSlug: (slug: string | null) => void;
  setTransitioning: (v: boolean) => void;
}

export const useStore = create<State>((set) => ({
  activeTags: [],
  filterOpen: false,
  activeSlug: null,
  transitioning: false,
  introDone: false,
  setIntroDone: (introDone) => set({ introDone }),
  hoverSlug: null,
  setHoverSlug: (hoverSlug) => set({ hoverSlug }),
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
