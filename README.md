# Portfolio

Interactive 3D portfolio inspired by phantom.land. See `CLAUDE.md` for architecture.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm run start
npm run lint && npm run type-check
```

## Projects
- Edit `src/data/projects.ts` or use the reusable prompt in `docs/add-project-prompt.md` to load projects from a PDF/notes.
- Thumbnails are generated placeholders. Drop real images in `public/assets/projects/` (4:5) and update `thumbnailUrl`; add `galleryImages` to show a lightbox gallery.
- `scripts/gen-placeholders.mjs` regenerates the gradient placeholders.
- The About page copy lives in `src/app/about/page.tsx`; the contact API (`src/app/api/contact`) is a validating stub.

## Behaviour
- Desktop: WebGL curved wall — drag / wheel / touch with inertia, cursor tilt, click a tile to zoom into `/projects/[slug]`.
- Phones (<768px): the 3D canvas is skipped in favour of a 2D smooth-scroll grid.
- Sound (Web Audio) is off by default; toggle with `[SOUND ON/OFF]` in the header.

## Audio & video
- Audio is muted until `[SOUND ON]`. Sounds are synthesized by default (hover tick, click, enter/back whoosh, ambient pad, ambient ducks inside projects). To use your own, add `swoosh-in.mp3`, `swoosh-out.mp3`, `ambient.mp3`, `hover.mp3`, `click.mp3` to `public/audio/`; they're picked up automatically.
- Video: set a project's `videoUrl` to an `.mp4` in `public/assets/projects/` to autoplay it on the wall tile and project page.
- Swap the background music with the prompt in `docs/background-music-prompt.md` (file goes at `public/audio/ambient.mp3`).

## Deploy (GitHub Pages)
- The site is a static export (`output: 'export'`). `.github/workflows/deploy.yml` builds on every push to `main` with `NEXT_PUBLIC_BASE_PATH=/<repo name>` and publishes `out/`.
- One-time: GitHub repo → Settings → Pages → Source: **GitHub Actions**. The site appears at `https://<user>.github.io/<repo>/`.
- Local production check: `NEXT_PUBLIC_BASE_PATH=/portfolio npm run build`. Plain `npm run dev` uses no base path.
- Music credit: fill in `docs/music-credits.md` and the line at the bottom of the About page.
- Project videos: use the prompt in `docs/add-project-video-prompt.md` (loop + first-frame poster, under ~1 MB each; raw files stay in the gitignored `source-videos/`).
- The Projects tab and mobile grid cards play each project's loop as a muted preview (only while on screen); projects without a `videoUrl` show their still.
- Images/diagrams on a project page: use `docs/add-project-image-prompt.md` (`galleryImages` + `galleryTitle`, click-to-zoom lightbox).
- Swap the header logo with `docs/update-logo-prompt.md` (icon lives in `public/assets/brand/`).
- Text on wall tiles and project cards: see `docs/project-card-text-prompt.md` (title + tagline + tags on the wall; plus a 3-line description on the Projects tab).
- About page content and photo: edit `src/data/about.ts` or use `docs/about-page-prompt.md` (wide hero photo at `public/assets/profile-wide.jpg`, scroll animations in `src/components/about/`).
