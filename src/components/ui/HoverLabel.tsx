'use client';
import { useEffect, useRef } from 'react';
import { getProject } from '@/data/projects';
import { useStore } from '@/store/useStore';

/** Title chip that follows the cursor while a 3D tile is hovered. */
export default function HoverLabel() {
  const slug = useStore((s) => s.hoverSlug);
  const ref = useRef<HTMLDivElement>(null);
  const project = slug ? getProject(slug) : null;

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (ref.current) ref.current.style.transform = `translate(${e.clientX + 18}px, ${e.clientY + 18}px)`;
    };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, []);

  return (
    <div ref={ref} className="pointer-events-none fixed left-0 top-0 z-[55]" aria-hidden>
      {project && (
        <div className="micro whitespace-nowrap rounded-full bg-paper px-3 py-1.5 text-ink">
          {project.title} <span className="opacity-50">— {project.category}, {project.year}</span>
        </div>
      )}
    </div>
  );
}
