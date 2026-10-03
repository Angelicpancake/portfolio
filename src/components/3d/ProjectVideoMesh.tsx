'use client';
import { useEffect } from 'react';
import { useVideoTexture } from '@react-three/drei';
import { SRGBColorSpace, Vector2, type ShaderMaterial, type Texture } from 'three';

/** UV scale that makes a texture of the given size cover a plane of `planeAspect` (CSS object-fit: cover). */
export const coverScale = (w: number, h: number, planeAspect: number) => {
  const texAspect = w && h ? w / h : 1;
  return planeAspect > texAspect ? new Vector2(1, texAspect / planeAspect) : new Vector2(planeAspect / texAspect, 1);
};

interface Props {
  url: string;
  material: ShaderMaterial;
  fallback: Texture;
  planeAspect: number;
}

/**
 * Projects an mp4 onto a tile's shader material. Render inside <Suspense fallback={null}>:
 * while the video buffers the material keeps showing the static thumbnail, and it swaps
 * back to it on unmount (so tiles that scroll away free their video decoder).
 */
export default function ProjectVideoMesh({ url, material, fallback, planeAspect }: Props) {
  const texture = useVideoTexture(url, {
    muted: true,
    loop: true,
    start: true,
    playsInline: true,
    crossOrigin: 'anonymous',
  });

  useEffect(() => {
    const video = texture.image as HTMLVideoElement;
    texture.colorSpace = SRGBColorSpace;
    const thumb = material.uniforms.uMap.value as Texture;
    const thumbScale = (material.uniforms.uScale.value as Vector2).clone();
    material.uniforms.uMap.value = texture;
    material.uniforms.uScale.value = coverScale(video.videoWidth, video.videoHeight, planeAspect);
    return () => {
      material.uniforms.uMap.value = thumb === texture ? fallback : thumb;
      material.uniforms.uScale.value = thumbScale;
    };
  }, [texture, material, fallback, planeAspect]);

  return null;
}
