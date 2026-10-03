'use client';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import ProjectGrid from './ProjectGrid';

/** Desktop shows the fixed WebGL wall (see CanvasContainer); phones get a smooth-scroll grid. */
export default function HomeView() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  if (!isMobile) return null;
  return (
    <section className="min-h-screen px-4 pb-32 pt-24">
      <h1 className="micro mb-6 text-mute">Selected work</h1>
      <ProjectGrid showBlurb={false} />
    </section>
  );
}
