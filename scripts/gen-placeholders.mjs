// Generates placeholder SVG thumbnails + gallery art. Replace with real assets in public/assets/projects/.
import { mkdirSync, writeFileSync } from 'node:fs';

const projects = [
  ['itadaki', 350, 20], ['foodrng', 25, 50], ['daki-life', 260, 320], ['food-ninja', 120, 150],
];
const dir = 'public/assets/projects';
mkdirSync(dir, { recursive: true });

const svg = (name, h1, h2, w, h, variant) => {
  let shapes = '';
  for (let i = 0; i < 6; i++) {
    const a = ((i + variant) * 53) % 100;
    const b = ((i * 37 + variant * 11) % 100);
    shapes += `<circle cx="${(a / 100) * w}" cy="${(b / 100) * h}" r="${(0.08 + (i % 3) * 0.07) * w}" fill="hsl(${(h1 + i * 18) % 360} 90% ${55 + i * 3}% / 0.${3 + (i % 4)})"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${h1} 70% 12%)"/><stop offset="1" stop-color="hsl(${h2} 80% 38%)"/></linearGradient>
<filter id="b"><feGaussianBlur stdDeviation="${w / 28}"/></filter></defs>
<rect width="${w}" height="${h}" fill="url(#g)"/><g filter="url(#b)">${shapes}</g>
<text x="${w * 0.06}" y="${h * 0.94}" fill="rgba(255,255,255,.85)" font-family="monospace" font-size="${w / 22}" letter-spacing="3">${name.toUpperCase()}</text></svg>`;
};

for (const [name, h1, h2] of projects) {
  writeFileSync(`${dir}/${name}.svg`, svg(name, h1, h2, 800, 1000, 0));
}
console.log('generated', projects.length, 'files');
