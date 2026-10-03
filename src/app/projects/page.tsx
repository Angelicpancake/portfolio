import type { Metadata } from 'next';
import ProjectGrid from '@/components/ui/ProjectGrid';

export const metadata: Metadata = { title: 'Projects — Portfolio' };

export default function ProjectsPage() {
  return (
    <section className="min-h-screen bg-ink px-4 pb-36 pt-28 md:px-8">
      <h1 className="mb-10 text-5xl font-medium tracking-tight md:text-8xl">Projects</h1>
      <ProjectGrid />
    </section>
  );
}
