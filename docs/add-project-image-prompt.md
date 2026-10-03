# Prompt: add an image or diagram to a project page

Drop the raw image in `source-videos/` (gitignored), then paste the block below into Claude Code.
Fill in `<…>`; delete lines that don't apply.

---

Add `source-videos/<file>` to the bottom of the `<slug>` project page, under the heading "<title, e.g. Core infrastructure>".

**Inspect**
- `sips -g pixelWidth -g pixelHeight -g hasAlpha <file>` and view the image. Note whether it is a wide diagram (small text) or a screenshot/photo.

**Optimize (never commit the raw file)**
- Diagram / line art / transparent PNG: keep full resolution (so lightbox zoom stays legible) and shrink with a palette:
  `ffmpeg -i source-videos/<file> -vf "split[a][b];[a]palettegen=max_colors=128:reserve_transparent=1[p];[b][p]paletteuse=dither=none" public/assets/projects/<slug>-<name>.png`
- Screenshot / photo: `ffmpeg -i source-videos/<file> -vf "scale='min(2000,iw)':-2" -q:v 3 public/assets/projects/<slug>-<name>.jpg`.
- Use WebP only if your ffmpeg has `libwebp` (`ffmpeg -encoders | grep webp`); Homebrew's build may not.
- Budget: diagrams under ~300 KB, photos under ~400 KB. View a zoomed crop (overlay on `#07070a`) to confirm text is still crisp.

**Wire it up in `src/data/projects.ts`**
- `galleryImages: [asset('/assets/projects/<slug>-<name>.png')]` (add more entries for more images) and `galleryTitle: '<title>'`.
- No component changes: `ProjectDetail` shows the gallery under the write-up with a "Click to zoom" hint, and the lightbox supports zoom, arrow keys and Esc.

**Verify and report**
Run `npm run type-check && npm run lint`, then `NEXT_PUBLIC_BASE_PATH=/portfolio npm run build`, and check the built `out/projects/<slug>/index.html` references the image. Report the file size and anything I should check in the browser. Commit only the optimized image, data and docs.
