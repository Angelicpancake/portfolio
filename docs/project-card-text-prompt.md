# Prompt: change the text shown on wall tiles and project cards

Paste into Claude Code. Fill in `<…>`; delete lines that don't apply.

---

Change the text shown on the project surfaces: <describe, e.g. "show the year on wall tiles" / "show 2 lines of description on the Projects tab" / "drop the category chips">.

**Where each surface gets its text** (all from `src/data/projects.ts`, never invent copy):
- **Work wall (3D tiles)**: `src/components/3d/captionTexture.ts` draws a 720×280 canvas texture per project: `title`, `tagline` (max 2 lines, wrapped/ellipsized), and `tags` as chips. `ProjectCard3D.tsx` places it on a curved plane under the media (`MEDIA_H` 3.3 + `CAPTION_H` 1.4 = `TILE_H`; `CurvedWall.tsx` derives `ROW_GAP` from `TILE_H`).
- **Projects tab (`/projects`)**: `src/components/ui/ProjectGrid.tsx` shows title, `category`, `tagline`, `getBlurb(project)` (first paragraph of "What it does", clamped to 3 lines), and `tags`. Media is cropped to `aspect-[5/4]` with `object-cover`.
- **Mobile Work grid**: the same `ProjectGrid` with `showBlurb={false}` (set in `HomeView.tsx`).

**Rules**
- Use existing fields (`title`, `tagline`, `tags`, `category`, `getBlurb`); if you need new copy, add a field to the `Project` type and ask me for the wording.
- More text = crop the media more (`MEDIA_H` smaller / larger `aspect` denominator) instead of shrinking type; the cover-fit shader and `object-cover` handle the crop.
- Wall captions are drawn once into a cached `CanvasTexture` (shared by repeated tiles). Don't create per-frame textures or DOM overlays; redraw happens after `document.fonts.ready`.
- Keep wall text legible at distance: title ≥ 50 px, body ≥ 26 px, chips ≥ 20 px on the 720×280 canvas.
- After changing `TILE_H`, check the camera/radius still frames the tiles and the vertical pan clamp (`maxPanY` = `ROW_GAP`) feels right.

**Verify and report**
`npm run type-check && npm run lint && NEXT_PUBLIC_BASE_PATH=/portfolio npm run build`; confirm the built `out/projects/index.html` contains the new text. Check in the browser (`npm run dev`): wall tiles (text readable, not overlapping media, hidden with filtered-out tiles, clickable), Projects tab cards, and a ~390 px mobile width. Report anything I should eyeball. Commit only source and docs.
