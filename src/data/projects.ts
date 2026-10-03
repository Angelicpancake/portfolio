import { asset } from '@/lib/asset';

/** A labelled or plain bullet. Rendered as "Label: text" when a label is present. */
export interface Item {
  label?: string;
  text: string;
}

export type Block =
  | { type: 'p'; text: string }
  | { type: 'list'; items: Item[] }
  | { type: 'group'; title: string; items: Item[] };

export interface Section {
  heading: string;
  blocks: Block[];
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: string;
  year?: number;
  tags: string[];
  thumbnailUrl: string;
  /** YouTube id; `short` switches the embed to a vertical aspect ratio. */
  youtube?: { id: string; short?: boolean };
  videoUrl?: string;
  /** width / height of videoUrl, so portrait clips aren't forced into 16:9. */
  videoAspect?: number;
  galleryImages: string[];
  /** Heading above the gallery (defaults to "Gallery"). */
  galleryTitle?: string;
  summary: string;
  sections: Section[];
  /** Verbatim "Built with" text from the write-up. */
  builtWith: string;
  stack: string[];
  links: { label: string; url: string }[];
}

const thumb = (slug: string, ext = 'svg') => asset(`/assets/projects/${slug}.${ext}`);
const loop = (slug: string) => asset(`/assets/projects/${slug}.mp4`);

export const projects: Project[] = [
  {
    id: 'itadaki',
    slug: 'itadaki',
    title: 'Itadaki',
    tagline: 'Japanese Kanji Learning on Reddit',
    category: 'Reddit app',
    tags: ['Web', 'Games'],
    thumbnailUrl: thumb('itadaki', 'jpg'),
    videoUrl: loop('itadaki'),
    videoAspect: 16 / 9,
    galleryImages: [],
    summary:
      'After four years of studying Japanese, I found that apps like Duolingo and Quizlet lacked an intuitive way to build kanji vocabulary gradually.',
    sections: [
      {
        heading: 'Inspiration',
        blocks: [
          {
            type: 'p',
            text: 'After four years of studying Japanese, I found that apps like Duolingo and Quizlet lacked an intuitive way to build kanji vocabulary gradually, and that learning works better with friends. Reddit already has large language-learning communities (r/LearnJapanese, r/Japanese, r/languagelearning), so we built a game that lives where those learners already are.',
          },
        ],
      },
      {
        heading: 'What it does',
        blocks: [
          {
            type: 'p',
            text: 'Itadaki picks 7 high-utility kanji each week and builds vocabulary sets around them using the Jisho dictionary API, cached in Redis.',
          },
          {
            type: 'list',
            items: [
              {
                label: 'Daily Mode',
                text: 'guess the English meaning of words from the "kanji of the day" for points, or skip if stuck. Players can also comment example sentences and give each other feedback.',
              },
              {
                label: 'Rapid Mode',
                text: "review all of the week's words in random order to practice active recall.",
              },
              {
                label: 'Leaderboard',
                text: 'scoring rewards mastery (answering every word correctly earns the most), and the board resets weekly.',
              },
            ],
          },
        ],
      },
    ],
    builtWith:
      "Reddit Devvit, TypeScript, Redis, and the Jisho API. It was a one-month build that earned recognition from Hack Reddit judges for UX, polish, and platform-native design (Note: The live Reddit app is no longer working because it hasn't been updated for Reddit's recent platform changes).",
    stack: ['Reddit Devvit', 'TypeScript', 'Redis', 'Jisho API'],
    links: [
      { label: 'GitHub', url: 'https://github.com/Angelicpancake/itadaki_ocb' },
      { label: 'Video', url: 'https://www.youtube.com/watch?v=8bwv2cXZcyE' },
    ],
  },
  {
    id: 'foodrng',
    slug: 'foodrng',
    title: 'FoodRNG',
    tagline: 'Collect, Fuse, and Upgrade Dishes from Around the World',
    category: 'Roblox game',
    tags: ['Games'],
    thumbnailUrl: thumb('foodrng', 'jpg'),
    videoUrl: loop('foodrng'),
    videoAspect: 16 / 9,
    galleryImages: [],
    summary:
      'I love game design, and I wanted to team up with my friends to build something fun together.',
    sections: [
      {
        heading: 'Inspiration',
        blocks: [
          {
            type: 'p',
            text: 'I love game design, and I wanted to team up with my friends to build something fun together. We hand-drew every food design in the game, so each dish has its own personality, and turned them into a collectible RNG game where players hunt for rare dishes from around the world.',
          },
        ],
      },
      {
        heading: 'What it does',
        blocks: [
          {
            type: 'p',
            text: 'FoodRNG is a multiplayer Roblox game where players roll for dishes, fill out a cookbook, and stack luck bonuses that make rare rolls more likely.',
          },
          {
            type: 'list',
            items: [
              {
                label: 'Server-authoritative rolling',
                text: 'the server picks a rarity (Common to Mythical, up to 1 in 2000), then a food from about 134 dishes across 10 countries.',
              },
              {
                label: 'FoodDex and luck bonuses',
                text: 'collecting new foods and finishing country sets unlocks permanent luck boosts.',
              },
              {
                label: 'Fusion',
                text: 'combine specific foods (e.g. Gimbap + Onigiri + White Rice) into Mythical recipes.',
              },
              { label: 'Star upgrades', text: 'spend duplicate copies to level up a food.' },
              {
                label: 'Player data',
                text: 'inventory, progress, and settings are saved with DataStore, plus daily login rewards.',
              },
            ],
          },
        ],
      },
    ],
    builtWith:
      'Luau, Roblox Studio, Rojo, Wally (Trove, Observers, t), Selene, and DataStoreService, using custom ModuleScripts with no framework.',
    stack: ['Luau', 'Roblox Studio', 'Rojo', 'Wally', 'Selene', 'DataStoreService'],
    links: [{ label: 'GitHub', url: 'https://github.com/Angelicpancake/rblx_foodrng' }],
  },
  {
    id: 'spike-agent',
    slug: 'spike-agent',
    title: 'Spike-Agent',
    tagline: 'Automated Spike Sorting and Unit Quality Scoring for Neural Recordings',
    category: 'Neurotech / ML',
    tags: ['AI', 'Research'],
    thumbnailUrl: thumb('spike-agent', 'jpg'),
    galleryImages: [],
    summary:
      'At Elastro, a Harvard-affiliated neurotech startup, raw recordings have to be sorted into individual neurons before they\'re useful.',
    sections: [
      {
        heading: 'Inspiration',
        blocks: [
          {
            type: 'p',
            text: "At Elastro, a Harvard-affiliated neurotech startup working on flexible neural electrodes for closed-loop deep brain stimulation, raw recordings have to be sorted into individual neurons before they're useful. Judging which sorted units are real neurons is slow, manual work that needs an expert. I wanted to automate as much of that as possible, so a researcher only has to review the uncertain cases.",
          },
        ],
      },
      {
        heading: 'What it does',
        blocks: [
          {
            type: 'p',
            text: 'Spike-Agent takes raw Intan recordings and turns them into scored, curated neural units in two stages.',
          },
          {
            type: 'group',
            title: 'Stage 1, spike sorting (built)',
            items: [
              { text: 'Loads the .rhd recordings and attaches the real 2D electrode layout.' },
              {
                text: 'Preprocesses the signal: bandpass, ADC timing correction, bad-channel removal, and common-reference.',
              },
              { text: 'Runs Kilosort4 on an AWS GPU.' },
              {
                text: 'Computes per-unit quality metrics (ISI and refractory violations, presence ratio, isolation distance, L-ratio, firing rate).',
              },
              { text: 'Auto-excludes noise units with an audit trail.' },
              { text: 'Saves a per-unit table with spike times and metrics.' },
            ],
          },
          {
            type: 'group',
            title: 'Stage 2, quality classifier (in progress)',
            items: [
              {
                text: 'Builds a labeled dataset from rule-based thresholds, LLM proposals, and human review.',
              },
              {
                text: 'Trains logistic regression and random forest classifiers to score each unit, with session-based splits.',
              },
              { text: 'Validates on MEArec ground truth first.' },
              {
                label: 'Next',
                text: 'a decoder trained on the curated units, tested by comparing decoding with all units vs. only approved units.',
              },
            ],
          },
        ],
      },
    ],
    builtWith:
      'Python, SpikeInterface, Kilosort4, PyTorch/CUDA, AWS (EC2 GPU, S3), and scikit-learn for Stage 2.',
    stack: ['Python', 'SpikeInterface', 'Kilosort4', 'PyTorch/CUDA', 'AWS (EC2 GPU, S3)', 'scikit-learn'],
    links: [],
  },
  {
    id: 'daki-life',
    slug: 'daki-life',
    title: 'Daki Life',
    tagline: 'A Focus Journal That Turns Your Notes into a Living Knowledge Graph',
    category: 'Mobile app',
    tags: ['AI', 'Mobile'],
    thumbnailUrl: thumb('daki-life', 'jpg'),
    videoUrl: loop('daki-life'),
    videoAspect: 540 / 1172,
    galleryImages: [asset('/assets/projects/daki-life-infra.png')],
    galleryTitle: 'Core infrastructure',
    summary:
      'Journaling is one of the most evidence-backed habits for mental clarity, yet most people quit because it\'s inconvenient.',
    sections: [
      {
        heading: 'Inspiration',
        blocks: [
          {
            type: 'p',
            text: "Journaling is one of the most evidence-backed habits for mental clarity, yet most people quit because it's inconvenient: you have to carve out time, face a blank page, and know what to say. Even then, every entry sits in isolation, so it's hard to spot patterns or see how much you've grown. We built Daki Life to make journaling as easy as jotting a thought during a break after a focus session, and to connect all your past ideas so they find each other.",
          },
        ],
      },
      {
        heading: 'What it does',
        blocks: [
          {
            type: 'p',
            text: 'Daki Life is a mobile focus journal that builds a semantic knowledge graph from your reflection notes.',
          },
          {
            type: 'list',
            items: [
              { label: 'Focus', text: 'a Pomodoro-style timer, with quick notes after each session.' },
              {
                label: 'Graph',
                text: 'an interactive graph that automatically groups notes into life themes (like Health, Creativity, Relationships) with subtopics nested inside.',
              },
              { label: 'Canvas', text: 'a 3D view of the 2D graph.' },
              {
                label: 'Home and Day Summaries',
                text: "session stats, top clusters, time-tracked categories, and a list of each day's entries.",
              },
            ],
          },
          {
            type: 'group',
            title: 'How the graph is built',
            items: [
              {
                label: 'Embedding',
                text: 'each note is embedded at write time (text-embedding-3-small, 1536 dimensions) and stored in Supabase with pgvector.',
              },
              {
                label: 'Clustering',
                text: 'UMAP reduces the embeddings to 8D, then HDBSCAN runs recursively to produce a multi-level cluster tree. Outlier notes stay as standalone nodes instead of being forced into a cluster.',
              },
              {
                label: 'Layout',
                text: 'PaCMAP produces the 2D/3D positions, run per cluster so each one is locally coherent.',
              },
              {
                label: 'Stability',
                text: "new clusters are matched to old ones by Jaccard similarity, so labels persist and the graph doesn't jump around as notes arrive.",
              },
              {
                label: 'Edges',
                text: 'cosine similarity connects each note to its nearest neighbors, and cluster centroids to sibling clusters.',
              },
              {
                label: 'Cluster metrics',
                text: 'taxonomic complexity, information density (TF-IDF), semantic cohesion, and semantic divergence.',
              },
            ],
          },
        ],
      },
    ],
    builtWith:
      'React Native (Expo), TypeScript, D3, Three.js, Node.js/Express, a Python FastAPI ML sidecar (umap-learn, hdbscan, scikit-learn), OpenAI gpt-4o-mini for cluster labels, and Supabase (Postgres, pgvector, Auth, Realtime).',
    stack: [
      'React Native (Expo)',
      'TypeScript',
      'D3',
      'Three.js',
      'Node.js/Express',
      'Python FastAPI',
      'OpenAI gpt-4o-mini',
      'Supabase',
    ],
    links: [
      { label: 'GitHub', url: 'https://github.com/Angelicpancake/daki_life' },
      { label: 'Devpost', url: 'https://devpost.com/software/daki-life-ks9eri' },
    ],
  },
  {
    id: 'food-ninja',
    slug: 'food-ninja',
    title: 'Food Ninja',
    tagline: 'Multiplayer Fruit-Slicing Game Controlled by Your Webcam',
    category: 'Web game',
    tags: ['Games', 'Web'],
    thumbnailUrl: thumb('food-ninja', 'jpg'),
    videoUrl: loop('food-ninja'),
    videoAspect: 16 / 9,
    galleryImages: [],
    summary:
      'I wanted to build a game with my friends over the summer that we could play against each other.',
    sections: [
      {
        heading: 'Inspiration',
        blocks: [
          {
            type: 'p',
            text: 'I wanted to build a game with my friends over the summer that we could play against each other. We used webcam hand tracking so you slice the fruit with your own hands, and all the food art is hand-drawn by us from our roblox game.',
          },
        ],
      },
      {
        heading: 'What it does',
        blocks: [
          {
            type: 'p',
            text: 'Food Ninja is a real-time multiplayer game where you slice fruit with hand gestures tracked through your webcam.',
          },
          {
            type: 'list',
            items: [
              {
                label: 'Hand tracking',
                text: 'MediaPipe follows your index fingertip, with smoothing and a motion trail, and registers a slice when the trail crosses a fruit. Spreading your fingers wide triggers a separate bomb gesture.',
              },
              {
                label: 'Multiplayer lobbies',
                text: 'players join with a 6-character room code, set a name and avatar, and ready up, with no sign-up needed (anonymous auth). Up to 4 players per room.',
              },
              {
                label: 'Live leaderboard',
                text: 'scores sync through Supabase Realtime during the match.',
              },
              {
                label: 'Combos and lives',
                text: 'combos raise points per slice, and missed fruit or bombs cost lives.',
              },
              { text: 'Results screen with the winner, personal stats, and a play-again option.' },
            ],
          },
        ],
      },
    ],
    builtWith:
      'React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, MediaPipe HandLandmarker, and Supabase (Postgres, Realtime, Edge Functions, anonymous auth, row-level security).',
    stack: [
      'React 18',
      'TypeScript',
      'Vite',
      'Tailwind CSS',
      'shadcn/ui',
      'MediaPipe HandLandmarker',
      'Supabase',
    ],
    links: [
      { label: 'GitHub', url: 'https://github.com/redY132/fruit' },
      { label: 'Website', url: 'https://pankolab.dev/' },
    ],
  },
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

/** Longer description for cards: the first paragraph of the "What it does" section, verbatim. */
export const getBlurb = (p: Project): string => {
  const section = p.sections.find((s) => s.heading === 'What it does');
  const para = section?.blocks.find((b): b is Extract<Block, { type: 'p' }> => b.type === 'p');
  return para?.text ?? p.summary;
};
