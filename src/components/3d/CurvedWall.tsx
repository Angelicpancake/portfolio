'use client';
import { useCallback, useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { PerspectiveCamera, Vector3, type Group, type Mesh } from 'three';
import { matchesFilter, projects, type Project } from '@/data/projects';
import { use3DInteraction } from '@/hooks/use3DInteraction';
import { sfx } from '@/hooks/useSound';
import { useStore } from '@/store/useStore';
import { ProjectCard3D, TILE_H } from './ProjectCard3D';

export const RADIUS = 8;
const COLS = 10;
const ROWS = 3;
const ROW_GAP = TILE_H + 0.6;
const BASE_FOV = 50;

// remembered so returning to the wall can reverse the zoom
let lastZoom: { pos: Vector3; look: Vector3 } | null = null;


export function CurvedWall({ active }: { active: boolean }) {
  const wall = useRef<Group>(null);
  const rig = useRef<Group>(null);
  const router = useRouter();
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const activeTags = useStore((s) => s.activeTags);

  use3DInteraction(wall, rig, { maxPanY: ROW_GAP, enabled: active });

  // reset (or reverse the zoom) whenever the wall becomes the active view
  useEffect(() => {
    if (!active) return;
    const look = new Vector3(0, 0, -RADIUS);
    const origin = new Vector3(0, 0, 0);
    if (lastZoom) {
      const { pos, look: zoomLook } = lastZoom;
      lastZoom = null;
      camera.position.copy(pos);
      camera.fov = 32;
      const proxy = zoomLook.clone();
      const tl = gsap.timeline({
        onUpdate: () => {
          camera.lookAt(proxy);
          camera.updateProjectionMatrix();
        },
        onComplete: () => useStore.getState().setActiveSlug(null),
      });
      tl.to(camera.position, { x: origin.x, y: origin.y, z: origin.z, duration: 1.2, ease: 'power3.inOut' }, 0)
        .to(proxy, { x: look.x, y: look.y, z: look.z, duration: 1.2, ease: 'power3.inOut' }, 0)
        .to(camera, { fov: BASE_FOV, duration: 1.2, ease: 'power3.inOut' }, 0);
      return () => {
        tl.kill();
      };
    }
    camera.position.copy(origin);
    camera.fov = BASE_FOV;
    camera.lookAt(look);
    camera.updateProjectionMatrix();
  }, [active, camera]);

  const onSelect = useCallback(
    (project: Project, mesh: Mesh) => {
      const store = useStore.getState();
      if (store.transitioning) return;
      store.setTransitioning(true);
      store.setActiveSlug(project.slug);
      store.setHoverSlug(null);
      sfx.click();
      sfx.transition();

      const target = mesh.getWorldPosition(new Vector3());
      const end = target.clone().sub(target.clone().normalize().multiplyScalar(3.6));
      const forward = camera.getWorldDirection(new Vector3()).multiplyScalar(RADIUS);
      const proxy = camera.position.clone().add(forward);
      lastZoom = { pos: end.clone(), look: target.clone() };

      gsap
        .timeline({
          onUpdate: () => {
            camera.lookAt(proxy);
            camera.updateProjectionMatrix();
          },
          onComplete: () => router.push(`/projects/${project.slug}`),
        })
        .to(camera.position, { x: end.x, y: end.y, z: end.z, duration: 1.3, ease: 'power3.inOut' }, 0)
        .to(proxy, { x: target.x, y: target.y, z: target.z, duration: 1.3, ease: 'power3.inOut' }, 0)
        .to(camera, { fov: 32, duration: 1.3, ease: 'power3.inOut' }, 0);
    },
    [camera, router],
  );

  const step = (Math.PI * 2) / COLS;
  const tiles = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const slot = r * COLS + c;
      const project = projects[(slot + r * 3) % projects.length];
      tiles.push(
        <ProjectCard3D
          key={slot}
          project={project}
          angle={c * step}
          y={(1 - r) * ROW_GAP}
          radius={RADIUS}
          visible={matchesFilter(project, activeTags)}
          delay={0.1 + (c + r * 2) * 0.045}
          onSelect={onSelect}
        />,
      );
    }
  }

  return (
    <group ref={rig}>
      <group ref={wall}>{tiles}</group>
    </group>
  );
}
