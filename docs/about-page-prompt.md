# Prompt: update the About page from pasted content + a photo

Drop the photo in `source-videos/` (gitignored), then paste the block below into Claude Code with your content.
Fill in `<…>`; delete lines that don't apply.

---

Update the About page (`src/app/about/page.tsx`, data in `src/data/about.ts`) with the content below and `source-videos/<photo>` (a profile photo).

**Content:** <paste your profile, work experience, clubs, skills, hobbies, awards here>
**Also:** <optional, e.g. "remove X from awards", "add a Certifications section">

**Data rules (`src/data/about.ts`)**
- Map sections to fields: `headline` (first sentence of the profile, shown large), `paragraph` (the rest), `work` / `clubs` (`{ year, title, description }`), `skills`, `hobbies`, `awards`.
- Keep my wording verbatim. The only edits allowed are obvious typos / missing spaces / table-pipe artifacts, and you must list each one in your report. Never invent roles, dates, skills or awards; ask if something is ambiguous (for example a year range).
- Leave out sections I didn't provide instead of filling them with placeholders. Apply any removals I list.

**Profile photo (small, never commit the raw file)**
1. `sips -g pixelWidth -g pixelHeight source-videos/<photo>` and view it to find where the face is.
2. Crop a 4:5 portrait around the face, then resize: `ffmpeg -i source-videos/<photo> -vf "crop=<h*0.8>:<h>:<x>:0,scale=400:500:flags=lanczos" -q:v 3 public/assets/profile-small.jpg` (landscape source: use the full height and center `x` on the face; portrait source: crop vertically, keeping head room). Target under ~40 KB. View the result to confirm the head and shoulders aren't cut off.
3. Use it via `asset('/assets/profile-small.jpg')` with `alt="<my name>"` (it displays at 96 px wide on mobile and 176 px on desktop, so 400 px is 2x sharp).

**Layout and animation (keep these when editing)**
- Compact header row: the small 4:5 photo on the LEFT (with my name as a small mono label under it) and, to its right, the headline at a small size (`text-xl md:text-3xl`) followed by the paragraph. On mobile the small photo sits at the top-left above the text. No big hero image.
- Below the header: sections as a two-column grid (label left, content right; stacked on mobile): Work experience, Clubs / Extracurriculars, Skills, Hobbies, Awards.
- **Everything scrolls normally: no `sticky` or `fixed` elements on this page** (the global header and bottom nav are the only fixed UI).
- Animation lives in `src/components/about/`: `Reveal` (fade + rise once in view; pass `delay` to stagger list items, `as="li"` inside lists), `GrowLine` (hairline that draws in above timeline rows) and `WordReveal` (headline words light up with scroll progress). New sections should use `Section` + `Reveal`/`Timeline` from `page.tsx` rather than plain markup.
- Every animation must respect `useReducedMotion()` (static render). Don't add animation libraries; use framer-motion (`useScroll`, `useTransform`, `whileInView`). Smooth scrolling is already provided by Lenis on this route.
- Keep the dark theme, `micro` labels and the accent year column; widen the year column if a range like "2023-2025" wraps. Keep the music-credit line.

**Verify and report**
`npm run type-check && npm run lint`, then `NEXT_PUBLIC_BASE_PATH=/portfolio npm run build`; grep `out/about/index.html` for every entry. Capture headless Chrome screenshots at 1440 px (a tall window so scroll reveals are in view) and in a 390 px-wide iframe (headless Chrome enforces a ~500 px minimum window width, so a direct 390 px capture is misleading) and check the header row (small photo left of a small headline), readability and horizontal overflow. Say what to eyeball in a real browser (the motion itself can't be judged from stills). Report typo fixes and anything ambiguous. Commit only the optimized photo, data, components, page and docs.
