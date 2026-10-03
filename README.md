# Portfolio

Interactive 3D portfolio inspired by phantom.land. See `CLAUDE.md` for architecture.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm run start
npm run lint && npm run type-check
```

## Replacing placeholder content
- Edit `src/data/projects.ts` (titles, tags, links, video URLs).
- Drop real images in `public/assets/projects/` (`<slug>.svg|jpg` thumbnail 4:5, `<slug>-1..3` gallery) and update the paths.
- `scripts/gen-placeholders.mjs` regenerates the gradient placeholders.
- The About page copy lives in `src/app/about/page.tsx`; the contact API (`src/app/api/contact`) is a validating stub.

## Behaviour
- Desktop: WebGL curved wall — drag / wheel / touch with inertia, cursor tilt, click a tile to zoom into `/projects/[slug]`.
- Phones (<768px): the 3D canvas is skipped in favour of a 2D smooth-scroll grid.
- Sound (Web Audio) is off by default; toggle with `[SOUND ON/OFF]` in the header.
