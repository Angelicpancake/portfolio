import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProjectDetail from '@/components/media/ProjectDetail';
import { getAdjacent, getProject, projects } from '@/data/projects';

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const project = getProject((await params).slug);
  return { title: project ? `${project.title} — Portfolio` : 'Project', description: project?.description };
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const { prev, next } = getAdjacent(slug);
  return <ProjectDetail project={project} prev={prev} next={next} />;
}
