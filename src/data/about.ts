export interface Entry {
  year: string;
  title: string;
  description: string;
}

export const about = {
  name: 'Joshua Ren',
  headline:
    'Computer engineering student at Purdue and co-founder of Daki Life, a semantic journaling app that turns your thoughts into a living knowledge graph.',
  paragraph:
    'I work on neurotech at Elastro, a Harvard-affiliated startup, building spike-sorting pipelines for closed-loop deep brain stimulation.',
  work: [
    {
      year: '2026',
      title: 'Neuroengineering Intern, Elastro',
      description:
        'Built GPU spike-sorting pipelines on AWS for deep brain stimulation research, and developing a training model.',
    },
    {
      year: '2026',
      title: 'Co-founder, Daki Life',
      description: 'Building a semantic journaling app with a 3D knowledge graph and ML pipeline.',
    },
    {
      year: '2025',
      title: 'Venture Associate Intern, WAM Equity Partners',
      description: 'Researched EdTech and AI markets, and built an AI news-aggregation tool.',
    },
  ] satisfies Entry[],
  clubs: [
    { year: '2026', title: 'Chip Design, Purdue SoCET', description: 'Designing RISC-V SoC components in SystemVerilog.' },
    {
      year: '2026',
      title: 'Software, Purdue Lunarbotics',
      description: 'Firmware team: writing microcontroller software and ROS for an autonomous robot.',
    },
    { year: '2026', title: 'Embedded Systems, ESAP', description: 'Embedded systems programming on ESP32.' },
    {
      year: '2023-2025',
      title: 'Programming Lead, Oakton Robotics (FTC)',
      description: 'Led a team to the FIRST Tech Challenge World Championships.',
    },
  ] satisfies Entry[],
  skills: ['Python', 'C', 'SystemVerilog', 'TypeScript', 'React Native', 'Java', 'AWS', 'Embedded / ESP32', 'ML Pipelines', 'Robotics'],
  hobbies: ['Kendo', 'Photography', 'Badminton', 'Gym', 'Reading', 'Piano'],
  awards: [
    'Qualcomm Inclusion Scholar (2026)',
    'FTC World Championships qualifier (2025)',
    "Dean's List",
    'Hack Reddit recognized for exceptional UX, polish, platform-native design',
  ],
};
