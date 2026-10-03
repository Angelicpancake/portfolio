'use client';
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { usePathname } from 'next/navigation';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { CurvedWall } from './CurvedWall';

/** Fixed full-screen WebGL layer. Stays mounted across routes so textures stay warm. */
export default function CanvasContainer() {
  const pathname = usePathname();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const home = pathname === '/';

  // phones get the 2D grid instead (see MobileGrid)
  if (isMobile === undefined || isMobile) return null;

  return (
    <div
      className="fixed inset-0 z-0"
      style={{ visibility: home ? 'visible' : 'hidden', pointerEvents: home ? 'auto' : 'none' }}
      aria-hidden={!home}
    >
      <Canvas
        frameloop={home ? 'always' : 'never'}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 0], fov: 50, near: 0.1, far: 60 }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#07070a']} />
        <fog attach="fog" args={['#07070a', 10, 24]} />
        <Suspense fallback={null}>
          <CurvedWall active={home} />
        </Suspense>
      </Canvas>
    </div>
  );
}
