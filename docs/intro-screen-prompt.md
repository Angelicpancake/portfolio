# Prompt: create or adjust the entry (intro) screen

Paste into Claude Code. Fill in `<…>`; delete lines that don't apply.

---

<Create / change> the entry screen in `src/components/intro/IntroScreen.tsx`: <describe the change, e.g. "make the pancake flip faster", "swap the pancake for my own artwork", "only show it on the home page", "change the cursor label">.

**Purpose:** browsers block audio until a user gesture, so the entry click is what lets the background music and sound effects start immediately. It shows on every full page load (a reload shows it again); in-site navigation never re-triggers it because the component lives in the root layout.

**Current behaviour (keep unless I say otherwise)**
1. Overlay appears (dark, full screen, scroll locked). An original SVG **pancake** animates: plate, three pancakes drop in with a squash, butter and syrup (drips run down), a pancake is tossed above the stack and flips over on a loop, steam rises. A mono counter ticks `000 → 100` over ~2.4 s; readiness also waits for `document.fonts.ready` and the projects' thumbnails (5 s timeout).
2. **Cursor:** on mouse devices the native cursor is replaced by a ring plus a label that reads "LOADING" and then **"CLICK TO ENABLE SOUND"** once ready (`CursorHint`). It hides over the "Enter without sound" link. On touch devices a "Tap to enable sound" line appears instead.
3. **Click, tap, or press Enter/Space anywhere** (a full-screen `<button>` sits behind the content) → `enableSound(true)` inside the click handler (unlocks audio, sets sound on, plays `sfx.enter()`), set `introDone`, then the pancake scales away while a circular mask opens onto the wall (~1.1 s). **Enter without sound** (small link) or `Esc` → same transition with sound off (the choice is remembered by `AudioController`).

**Rules**
- **Original artwork only.** The pancake is drawn in SVG by code. Don't copy phantom.land's assets or code, and don't build the animation around third-party characters, logos or brand marks. To use my own artwork instead, set `INTRO_MARK_SRC` to a file under `public/assets/brand/` (transparent PNG/SVG, ≥ 480 px, under ~80 KB).
- Show-on-every-load is controlled by `HOME_ONLY` (false = every route and every reload; true = home page only). Tell me the trade-off if I ask for home-only (deep links skip the sound unlock).
- Respect `prefers-reduced-motion`: static pancake, no toss/steam/drips animation, a quick fade instead of the circular mask.
- Wall sync: `ProjectCard3D.tsx` starts its staggered entrance only after `introDone` (store flag in `useStore.ts`). Don't remove that or the tiles finish animating behind the overlay.
- Accessibility: `role="dialog"`, `aria-modal`, the full-screen button has an `aria-label` and a visible focus ring, the secondary action is a real `<button>`.

**Verify and report**
`npm run type-check && npm run lint && NEXT_PUBLIC_BASE_PATH=/portfolio npm run build`. Headless Chrome's `--screenshot` flags run animations on a skewed clock, so test with puppeteer-core in a scratch directory (not the project): load the built `out/` with a static server, wait in real time, and capture the pancake, the cursor label after `mouse.move`, a click at an arbitrary point, a reload (intro must show again), "Enter without sound" (`localStorage['portfolio-sound'] === 'off'`), and a 390 px viewport with `hasTouch`. Say what I should check by ear and eye in `npm run dev` (whoosh + music fade-in, flip timing, reveal onto the wall). Commit only source and docs.
