export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  year: number;
  tags: string[];
  thumbnailUrl: string;
  videoUrl: string;
  galleryImages: string[];
  description: string;
  details: string;
  stack: string[];
  liveUrl: string;
}

const VIDEO = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

const make = (
  slug: string,
  title: string,
  category: string,
  year: number,
  tags: string[],
  description: string,
  details: string,
  stack: string[],
): Project => ({
  id: slug,
  slug,
  title,
  category,
  year,
  tags,
  thumbnailUrl: `/assets/projects/${slug}.svg`,
  videoUrl: VIDEO,
  galleryImages: [1, 2, 3].map((i) => `/assets/projects/${slug}-${i}.svg`),
  description,
  details,
  stack,
  liveUrl: 'https://example.com',
});

export const projects: Project[] = [
  make('aurora', 'Aurora', 'Experience', 2025, ['3D', 'Web'], 'A shader-driven northern lights explorer.', 'Aurora renders volumetric ribbons of light with custom GLSL, reacting to cursor and scroll. Built to run at 60fps on mid-range phones through aggressive instancing and adaptive resolution.', ['React Three Fiber', 'GLSL', 'Next.js', 'GSAP']),
  make('monolith', 'Monolith', 'Product', 2025, ['Web'], 'A design-system documentation platform.', 'Monolith ships tokens, components and live playgrounds from a single source of truth, with versioned docs and visual regression checks.', ['Next.js', 'TypeScript', 'MDX', 'Tailwind']),
  make('signal', 'Signal', 'Tool', 2024, ['AI', 'Web'], 'An AI assistant for triaging support inboxes.', 'Signal clusters incoming tickets, drafts replies, and learns from agent edits. Latency budget under 400ms for suggestions.', ['TypeScript', 'Claude API', 'Postgres', 'tRPC']),
  make('orbit', 'Orbit', 'Experience', 2024, ['3D', 'Creative'], 'An interactive solar-system sound toy.', 'Each planet is an instrument; drag orbits to compose generative music using the Web Audio API.', ['Three.js', 'Web Audio', 'Zustand']),
  make('lumen', 'Lumen', 'Brand', 2024, ['Creative', 'Web'], 'Launch site for a lighting studio.', 'A scroll-choreographed story site with smooth-scroll sections, video masks and a lightweight CMS.', ['Next.js', 'Framer Motion', 'Lenis', 'Sanity']),
  make('drift', 'Drift', 'Tool', 2023, ['AI', 'Creative'], 'Generative moodboards from a sentence.', 'Drift turns text prompts into cohesive palettes, textures and layouts, exportable to Figma.', ['Python', 'FastAPI', 'React', 'Diffusion']),
  make('vector', 'Vector', 'Product', 2023, ['Web', '3D'], 'A browser CAD viewer for large assemblies.', 'Streams and culls multi-million-triangle models using level-of-detail chunks and workers.', ['Three.js', 'WebAssembly', 'Rust', 'React']),
  make('halo', 'Halo', 'Experience', 2023, ['3D', 'Creative'], 'A WebGL music video companion.', 'Audio-reactive visuals synced to a release, with a shareable photo mode.', ['WebGL', 'GLSL', 'Web Audio']),
  make('mesh', 'Mesh', 'Tool', 2022, ['AI', '3D'], 'Text-to-3D asset pipeline.', 'Automates generation, retopology and texture baking, delivering glTF ready for the web.', ['Python', 'Blender API', 'glTF', 'Docker']),
  make('pulse', 'Pulse', 'Product', 2022, ['Web'], 'A realtime team analytics dashboard.', 'Websocket-backed charts that stay smooth with 100k points through canvas rendering and decimation.', ['React', 'D3', 'WebSockets', 'Node']),
  make('atlas', 'Atlas', 'Experience', 2022, ['3D', 'Web'], 'A tactile globe of travel stories.', 'A draggable globe with geo-tagged stories, atmospheric shaders and offline caching.', ['React Three Fiber', 'TopoJSON', 'PWA']),
  make('ember', 'Ember', 'Brand', 2021, ['Creative'], 'Identity and microsite for a coffee roaster.', 'Warm, tactile motion language with a playful cursor and an ordering flow.', ['Next.js', 'GSAP', 'Stripe']),
];

export const allTags: string[] = Array.from(new Set(projects.flatMap((p) => p.tags))).sort();

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const getAdjacent = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return {
    prev: projects[(i - 1 + projects.length) % projects.length],
    next: projects[(i + 1) % projects.length],
  };
};

export const matchesFilter = (p: Project, tags: string[]) =>
  tags.length === 0 || tags.some((t) => p.tags.includes(t));
