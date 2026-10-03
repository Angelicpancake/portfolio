import { CanvasTexture, SRGBColorSpace } from 'three';
import type { Project } from '@/data/projects';

export const CAPTION_W = 720;
export const CAPTION_H = 280;

const cache = new Map<string, CanvasTexture>();

const cssVar = (name: string, fallback: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

/** Greedy word wrap, at most `maxLines` lines (last line is ellipsized if the text is longer). */
function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number) {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (let i = 0; i < words.length; i++) {
    const next = line ? `${line} ${words[i]}` : words[i];
    if (ctx.measureText(next).width <= maxWidth || !line) {
      line = next;
    } else {
      lines.push(line);
      line = words[i];
      if (lines.length === maxLines - 1) {
        line = words.slice(i).join(' ');
        break;
      }
    }
  }
  lines.push(line);
  const last = lines.length - 1;
  while (lines[last].length > 1 && ctx.measureText(`${lines[last]}…`).width > maxWidth && ctx.measureText(lines[last]).width > maxWidth) {
    lines[last] = lines[last].slice(0, -1).trimEnd();
  }
  if (ctx.measureText(lines[last]).width > maxWidth) lines[last] += '…';
  return lines;
}

function draw(canvas: HTMLCanvasElement, project: Project) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const sans = cssVar('--font-grotesk', 'system-ui, sans-serif');
  const mono = cssVar('--font-jbmono', 'ui-monospace, monospace');
  const pad = 28;
  ctx.clearRect(0, 0, CAPTION_W, CAPTION_H);

  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#f2f0ea';
  ctx.font = `600 54px ${sans}`;
  ctx.fillText(project.title, pad, 66, CAPTION_W - pad * 2);

  ctx.fillStyle = 'rgba(242,240,234,0.72)';
  ctx.font = `400 28px ${sans}`;
  wrap(ctx, project.tagline, CAPTION_W - pad * 2, 2).forEach((l, i) => ctx.fillText(l, pad, 112 + i * 36));

  // category chips (the project's tags) along the bottom
  ctx.font = `400 21px ${mono}`;
  let x = pad;
  const y = CAPTION_H - 30;
  for (const tag of project.tags) {
    const label = tag.toUpperCase();
    const w = ctx.measureText(label).width + 28;
    if (x + w > CAPTION_W - pad) break;
    ctx.strokeStyle = 'rgba(242,240,234,0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, y - 27, w, 40, 20);
    ctx.stroke();
    ctx.fillStyle = 'rgba(242,240,234,0.85)';
    ctx.fillText(label, x + 14, y);
    x += w + 10;
  }
}

/** Shared per-project caption (title, tagline, tag chips). Redrawn once webfonts have loaded. */
export function getCaptionTexture(project: Project): CanvasTexture {
  const hit = cache.get(project.slug);
  if (hit) return hit;
  const canvas = document.createElement('canvas');
  canvas.width = CAPTION_W;
  canvas.height = CAPTION_H;
  draw(canvas, project);
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 8;
  cache.set(project.slug, tex);
  void document.fonts.ready.then(() => {
    draw(canvas, project);
    tex.needsUpdate = true;
  });
  return tex;
}
