# Prompt: update the About page from pasted content + a photo

Drop the photo in `source-videos/` (gitignored), then paste the block below into Claude Code with your content.
Fill in `<…>`; delete lines that don't apply.

---

Update the About page (`src/app/about/page.tsx`, data in `src/data/about.ts`) with the content below and `source-videos/<photo>`.

**Content:** <paste your profile, work experience, clubs, skills, hobbies, awards here>
**Also:** <optional, e.g. "remove X from awards", "add a Certifications section">

**Data rules (`src/data/about.ts`)**
- Map sections to fields: `headline` (first sentence of the profile, shown large), `paragraph` (the rest), `work` / `clubs` (`{ year, title, description }`), `skills`, `hobbies`, `awards`.
- Keep my wording verbatim. The only edits allowed are obvious typos / missing spaces / table-pipe artifacts, and you must list each one in your report. Never invent roles, dates, skills or awards; ask if something is ambiguous (for example a year range).
- Leave out sections I didn't provide instead of filling them with placeholders. Apply any removals I list.

**Hero photo (wide, never commit the raw file)**
1. `sips -g pixelWidth -g pixelHeight source-videos/<photo>` and view it to find where the face is.
2. Crop to 16:9 keeping head room, then resize: `ffmpeg -i source-videos/<photo> -vf "crop=<w>:<w*9/16>:<x>:<y>,scale=1920:1080:flags=lanczos" -q:v 3 public/assets/profile-wide.jpg` (landscape source: use the full width; portrait source: crop vertically around the face). Target under ~300 KB. View the result to confirm the head isn't cut off, and adjust `object-[55%_20%]` in `AboutHero.tsx` so the face stays visible in the 4:3 mobile crop.
3. Use it via `asset('/assets/profile-wide.jpg')` with `alt="<my name>"`.

**Layout and animation (keep these when editing)**
- Single column: `AboutHero` (wide photo with scroll parallax/zoom and a caption that fades out) → `WordReveal` headline (words light up with scroll progress) → paragraph → sections as a two-column grid (label left, content right; stacked on mobile): Work experience, Clubs / Extracurriculars, Skills, Hobbies, Awards.
- `src/components/about/Reveal.tsx` provides `Reveal` (fade + rise once in view; pass `delay` to stagger list items, `as="li"` inside lists) and `GrowLine` (hairline that draws in above timeline rows). New sections should use `Section` + `Reveal`/`Timeline` from `page.tsx` rather than plain markup.
- Every animation must respect `useReducedMotion()` (static render). Don't add animation libraries; use framer-motion (`useScroll`, `useTransform`, `whileInView`). Smooth scrolling is already provided by Lenis on this route.
- Keep the dark theme, `micro` labels and the accent year column; widen the year column if a range like "2023-2025" wraps. Keep the music-credit line.

**Verify and report**
`npm run type-check && npm run lint`, then `NEXT_PUBLIC_BASE_PATH=/portfolio npm run build`; grep `out/about/index.html` for every entry. Capture headless Chrome screenshots at 1440 px (a tall window so scroll reveals are in view) and in a 390 px-wide iframe (headless Chrome enforces a ~500 px minimum window width, so a direct 390 px capture is misleading) and check photo framing, readability and horizontal overflow. Say what to eyeball in a real browser (the motion itself can't be judged from stills). Report typo fixes and anything ambiguous. Commit only the optimized photo, data, components, page and docs.
