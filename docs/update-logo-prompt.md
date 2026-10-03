# Prompt: swap the header logo / brand icon

Drop the raw image in `source-videos/` (gitignored), then paste the block below into Claude Code.
Fill in `<…>`; delete lines that don't apply.

---

Replace the header brand mark with `source-videos/<file>`, and remove the old mark (text "JR®" and the green dot).

**Inspect and optimize (never commit the raw file)**
1. `sips -g pixelWidth -g pixelHeight -g hasAlpha source-videos/<file>` and view it.
2. Crop to the opaque content (bounding box via `ffmpeg … -vf "format=rgba,alphaextract,bbox=min_val=20"` or Pillow `getbbox()` on the alpha channel, ~6 px padding), fit it into a transparent square sized at ~3× its display size (currently **168×168** for a 48–56 px icon) with Lanczos, and save an optimized PNG to `public/assets/brand/<name>.png`. Budget: under ~40 KB.
3. Preview it composited on `#07070a` (scale up with `flags=neighbor`) and view it to confirm clean edges and no leftover background.

**Wire it up**
- In `src/components/ui/Header.tsx` the home `<Link>` contains only `<img src={asset('/assets/brand/<name>.png')} alt="<your name>" width={56} height={56} className="size-12 object-contain md:size-14 …">`. Keep `aria-label="Home"` and the click sound. Keep the file's `/* eslint-disable @next/next/no-img-element */` (static export uses plain `<img>`).
- Optional: use the same image for the favicon (`src/app/icon.png`).

**Verify and report**
`npm run type-check && npm run lint`, then `NEXT_PUBLIC_BASE_PATH=/portfolio npm run build`; confirm the built `out/index.html` references the new image and no longer contains "JR®". Report the file size and anything to check at mobile width (it must not crowd the sound toggle / CTA). Commit only the optimized image, header change and docs.

**Note:** only use artwork you have the rights to publish. Characters from games, anime or studios are usually copyrighted.
