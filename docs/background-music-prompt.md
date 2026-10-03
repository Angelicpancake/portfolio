# Prompt: swap or tune the background music

Paste the block below into Claude Code. Replace `<path>` with your audio file.

---

Use `<path>` as the site's background music.

1. Copy it to `public/audio/ambient.mp3` (the audio engine in `src/hooks/useAudio.ts` prefers this file over its synthesized pad; no other code selects it). If it isn't an mp3, convert it first (`ffmpeg -i in.wav -b:a 160k public/audio/ambient.mp3`).
2. Check it with `afinfo public/audio/ambient.mp3`: report duration, bitrate and file size. Warn me if it's over ~8 MB.
3. Tune `src/hooks/useAudio.ts`: set `AMBIENT_LEVEL` so the music sits under the UI whooshes/ticks (start at 0.3). If the track has a long intro, set `loopStart` on the buffer source so the loop skips it.
4. Keep behaviour: muted by default, starts only after `[SOUND ON]`, fades in/out, ducks to 0.25 inside `/projects/*` and restores on Work.
5. Run `npm run type-check && npm run lint && npm run build` and report what you changed.

**Notes**
- Music you didn't make is usually copyrighted. A public site or public GitHub repo can draw a takedown. Prefer CC0/licensed tracks, or add `public/audio/ambient.mp3` to `.gitignore` if the repo is public.
- Files you drop in `public/audio/` as `swoosh-in.mp3`, `swoosh-out.mp3`, `hover.mp3`, `click.mp3` replace the other synthesized sounds the same way.
