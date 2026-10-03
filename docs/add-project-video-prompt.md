# Prompt: integrate a project video

Drop the raw recording in `source-videos/` (gitignored), then paste the block below into Claude Code.
Fill in `<…>`; delete lines that don't apply.

---

Integrate `source-videos/<name>.mp4` into the project with slug `<slug>`.

**Choose the clip**
1. `ffprobe` the file (resolution, fps, duration, audio).
2. Make a contact sheet in the scratchpad (`ffmpeg -i … -vf "fps=1/3,scale=320:-2,tile=5x4" -frames:v 1 sheet.jpg`), view it, and pick the best ~10 s window: clear action, no loading/dead screens, doesn't end mid-action. <Optional: "start at the very beginning" / "use the part where …">

**Encode (loop + poster)**
- Loop: `ffmpeg -ss <start> -t 10 -i source-videos/<name>.mp4 -an -vf "scale=960:-2,fps=30" -c:v libx264 -preset slow -crf 25 -pix_fmt yuv420p -movflags +faststart public/assets/projects/<slug>.mp4` (portrait: `scale=540:-2`; keep source fps if it's 24).
- Poster = the loop's first frame: `ffmpeg -ss <start> -i source-videos/<name>.mp4 -frames:v 1 -vf "scale=960:-2" -q:v 3 public/assets/projects/<slug>.jpg`.
- Budget: silent, under ~1 MB (re-encode with a higher CRF if larger). Never put raw footage in `public/` or git.

**Wire it up in `src/data/projects.ts`**
- `thumbnailUrl: thumb('<slug>', 'jpg')`, `videoUrl: loop('<slug>')`, `videoAspect: <width/height>` (16 / 9 landscape; e.g. 540 / 1172 portrait).
- YouTube (<choose one>): **link**: add `{ label: 'Video', url: '<youtube url>' }` to `links` and remove `youtube`; **embed**: keep `youtube: { id, short? }` and it shows under "Watch the full demo".

**Verify and report**
Run `npm run type-check && npm run lint`, then `NEXT_PUBLIC_BASE_PATH=/portfolio npm run build`. View the poster. Report the chosen window, file sizes, and anything I should check in the browser. Commit only the loop, poster, data and docs.

---

## Prompt: re-cut an existing clip

Paste into Claude Code. Fill in `<…>`.

Re-cut the loop for `<slug>` from `source-videos/<name>.mp4` so it **starts at <describe the moment, e.g. "the blue pancake mid-flip" / "the first clear kanji screen">**.
1. Extract frames every 0.5 s around `<approx time range>` into the scratchpad as a contact sheet and view it. Choose the start time where the moment is **sharp and fully visible** (avoid fade-ins/blur); tell me the time you chose.
2. Re-encode the 10 s loop with the same settings as the video prompt above (`-an`, 960×540 or 540-wide portrait, `-crf 25`, `+faststart`), keeping the source fps if it is 24.
3. Regenerate the poster from the **new loop's first frame** (`ffmpeg -i public/assets/projects/<slug>.mp4 -frames:v 1 …<slug>.jpg`) so the wall tile, grid card and video start match. View the poster to confirm.
4. No code changes needed. Report sizes, then commit only the new `.mp4` and `.jpg`.

**Where previews show:** the 3D wall tiles, the project page hero, and the Projects tab / mobile grid cards (`PreviewVideo`) all use the project's `videoUrl` + `thumbnailUrl`, so re-cutting one loop updates every place.
