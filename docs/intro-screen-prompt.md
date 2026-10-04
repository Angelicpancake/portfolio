# Prompt: create or adjust the entry (intro) screen

Paste into Claude Code. Fill in `<…>`; delete lines that don't apply.

---

<Create / change> the entry screen in `src/components/intro/IntroScreen.tsx`: <describe the change, e.g. "slower ring drawing", "add my own artwork in the center", "show it on every visit", "change the button labels">.

**Purpose:** browsers block audio until a user gesture, so the Enter click is what lets the background music and sound effects start immediately. "Enter" = sound on, "Enter without sound" = muted (the choice is remembered by `AudioController`).

**Sequence (keep unless I say otherwise)**
1. Overlay appears (dark, full screen, scroll locked). Concentric rings draw in (`pathLength`), dots orbit, hairline crosshair draws, a mono counter ticks `000 → 100` over ~2.4 s. Readiness also waits for `document.fonts.ready` and the projects' thumbnails (5 s timeout).
2. Counter swaps to **Enter** (focused) and **Enter without sound**. `Esc` = enter without sound.
3. On click: call `enableSound(on)` inside the click handler (unlocks audio, sets sound, plays `sfx.enter()`), set `introDone`, then rings scale away while a circular mask opens onto the wall (~1.1 s); overlay unmounts.

**Rules**
- **Original artwork only.** Don't copy phantom.land's assets or code, and don't build the animation around third-party characters, logos or brand marks. To show my own artwork inside the rings, set `INTRO_MARK_SRC` to a file under `public/assets/brand/` (transparent PNG/SVG, ≥ 240 px square, under ~60 KB).
- Show it on the home route only, once per browser session (`sessionStorage['portfolio-intro-seen']`); deep links and in-site navigation are never gated. If I ask for "every visit", drop the session check and say what that costs.
- Respect `prefers-reduced-motion`: static mark, no drawing/orbits, a quick fade instead of the circular mask.
- Wall sync: `ProjectCard3D.tsx` starts its staggered entrance only after `introDone` (store flag in `useStore.ts`). Don't remove that or the tiles finish animating behind the overlay.
- Accessibility: `role="dialog"`, `aria-modal`, focus on Enter, visible focus ring, buttons are real `<button>`s.

**Verify and report**
`npm run type-check && npm run lint && NEXT_PUBLIC_BASE_PATH=/portfolio npm run build`. Headless Chrome can render the intro but not the WebGL wall or audio, so capture screenshots of the intro at a few times (`--virtual-time-budget=1500`, `=7000`) at 1440 px and in a 390 px iframe, then tell me what to check in `npm run dev`: rings draw, counter reaches 100, Enter plays a whoosh and music fades in with the circular reveal onto an animating wall, reload in the same tab skips the intro, "without sound" stays silent. Commit only source and docs.
