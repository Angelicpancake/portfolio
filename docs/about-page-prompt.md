# Prompt: update the About page from pasted content + a photo

Drop the photo in `source-videos/` (gitignored), then paste the block below into Claude Code with your content.
Fill in `<…>`; delete lines that don't apply.

---

Update the About page (`src/app/about/page.tsx`, data in `src/data/about.ts`) with the content below and `source-videos/<photo>`.

**Content:** <paste your profile, work experience, clubs, skills, hobbies, awards here>

**Data rules (`src/data/about.ts`)**
- Map sections to fields: `headline` (first sentence of the profile, shown large), `paragraph` (the rest), `work` / `clubs` (`{ year, title, description }`), `skills`, `hobbies`, `awards`.
- Keep my wording verbatim. The only edits allowed are obvious typos / missing spaces / table-pipe artifacts, and you must list each one in your report. Never invent roles, dates, skills or awards; ask if something is ambiguous (for example a year range, or a skill list given as a code block).
- Leave out sections I didn't provide instead of filling them with placeholders.

**Photo (never commit the raw file)**
1. `sips -g pixelWidth -g pixelHeight source-videos/<photo>` and view it to find where the face is.
2. Crop to a 4:5 portrait centered on the face, then resize: `ffmpeg -i source-videos/<photo> -vf "crop=<h*0.8>:<h>:<x>:0,scale=1000:1250:flags=lanczos" -q:v 3 public/assets/profile.jpg` (landscape source: use the full height; portrait source: crop vertically, keeping head room). Target under ~250 KB. View the result to confirm the head and shoulders aren't cut off.
3. Use it via `asset('/assets/profile.jpg')` with `alt="<my name>"`.

**Layout:** two columns on desktop (sticky 4:5 photo left; headline, paragraph, Work experience, Clubs / Extracurriculars, Skills, Hobbies, Awards right), single column on mobile with the photo first. Keep the dark theme, `micro` labels and accent year column; widen the year column if a range like "2023-2025" wraps. Keep the music-credit line.

**Verify and report**
`npm run type-check && npm run lint`, then `NEXT_PUBLIC_BASE_PATH=/portfolio npm run build`; grep `out/about/index.html` for every entry. Capture headless Chrome screenshots at 1440 px and 390 px (`--headless=new --window-size=… --screenshot=…`) and check the photo framing, readability and horizontal overflow. Report typo fixes and anything ambiguous. Commit only the optimized photo, data, page and docs.
