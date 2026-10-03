'use client';
import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { PlaneGeometry, ShaderMaterial, SRGBColorSpace, Vector2, type Group, type Mesh } from 'three';
import type { Project } from '@/data/projects';
import { sfx } from '@/hooks/useSound';
import { useStore } from '@/store/useStore';

export const TILE_W = 3.6;
export const TILE_H = 4.5;

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const fragmentShader = /* glsl */ `
uniform sampler2D uMap;
uniform vec2 uScale;
uniform float uHover;
uniform float uOpacity;
varying vec2 vUv;
void main() {
  vec2 uv = (vUv - 0.5) * uScale + 0.5;
  vec3 col = texture2D(uMap, uv).rgb;
  float edge = smoothstep(0.0, 0.06, min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y)));
  col *= mix(0.62, 1.05, uHover);
  col = mix(col, col * 1.0 + 0.04, 1.0 - edge);
  gl_FragColor = vec4(col, uOpacity);
  #include <colorspace_fragment>
}`;

interface Props {
  project: Project;
  angle: number;
  y: number;
  radius: number;
  visible: boolean;
  delay: number;
  onSelect: (project: Project, mesh: Mesh) => void;
}

export function ProjectCard3D({ project, angle, y, radius, visible, delay, onSelect }: Props) {
  const gl = useThree((s) => s.gl);
  const texture = useTexture(project.thumbnailUrl, (t) => {
    const tex = Array.isArray(t) ? t[0] : t;
    tex.colorSpace = SRGBColorSpace;
    tex.anisotropy = 8;
  });
  const scaleGroup = useRef<Group>(null);
  const mesh = useRef<Mesh>(null);
  const hover = useRef(0);
  const hovered = useRef(false);
  const appear = useRef(0);

  // plane bent onto the cylinder so edges curve toward the viewer at the centre
  const geometry = useMemo(() => {
    const g = new PlaneGeometry(TILE_W, TILE_H, 24, 1);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const a = pos.getX(i) / radius;
      pos.setX(i, Math.sin(a) * radius);
      pos.setZ(i, radius * (1 - Math.cos(a)));
    }
    g.computeVertexNormals();
    return g;
  }, [radius]);

  const material = useMemo(() => {
    const img = texture.image as { width: number; height: number } | undefined;
    const texAspect = img ? img.width / img.height : 1;
    const planeAspect = TILE_W / TILE_H;
    const scale = planeAspect > texAspect ? new Vector2(1, texAspect / planeAspect) : new Vector2(planeAspect / texAspect, 1);
    return new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: { uMap: { value: texture }, uScale: { value: scale }, uHover: { value: 0 }, uOpacity: { value: 0 } },
    });
  }, [texture]);

  useFrame((state, delta) => {
    const g = scaleGroup.current;
    if (!g) return;
    if (state.clock.elapsedTime > delay) appear.current = Math.min(1, appear.current + delta * 1.6);
    const target = visible ? 1 : 0;
    const hoverTarget = hovered.current && visible ? 1 : 0;
    hover.current += (hoverTarget - hover.current) * Math.min(1, delta * 9);
    const s = (visible ? 0.9 + appear.current * 0.1 : 0.0001) * (1 + hover.current * 0.08);
    const cur = g.scale.x;
    const next = cur + (s - cur) * Math.min(1, delta * 8);
    g.scale.setScalar(Math.max(next, 0.0001));
    g.visible = next > 0.005;
    material.uniforms.uHover.value = hover.current;
    material.uniforms.uOpacity.value += (target * appear.current - material.uniforms.uOpacity.value) * Math.min(1, delta * 8);
  });

  return (
    <group rotation-y={angle}>
      <group position={[0, y, -radius]} ref={scaleGroup}>
        <mesh
          ref={mesh}
          geometry={geometry}
          material={material}
          onPointerOver={(e) => {
            if (!visible) return;
            e.stopPropagation();
            hovered.current = true;
            gl.domElement.style.cursor = 'pointer';
            useStore.getState().setHoverSlug(project.slug);
            sfx.hover();
          }}
          onPointerOut={() => {
            hovered.current = false;
            gl.domElement.style.cursor = 'grab';
            if (useStore.getState().hoverSlug === project.slug) useStore.getState().setHoverSlug(null);
          }}
          onClick={(e) => {
            // ignore the click that ends a drag
            if (!visible || e.delta > 6 || !mesh.current) return;
            e.stopPropagation();
            onSelect(project, mesh.current);
          }}
        />
      </group>
    </group>
  );
}
