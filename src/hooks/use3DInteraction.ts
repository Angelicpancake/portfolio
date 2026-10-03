'use client';
import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import type { Group } from 'three';
import { MathUtils } from 'three';
import { useStore } from '@/store/useStore';

interface Options {
  /** Half-height the wall may pan vertically. */
  maxPanY: number;
  enabled: boolean;
}

/**
 * Drag + inertia + wheel panning for the wall, plus cursor-follow tilt.
 * `wall` receives rotation.y / position.y; `rig` receives the subtle tilt.
 */
export function use3DInteraction(wall: React.RefObject<Group | null>, rig: React.RefObject<Group | null>, { maxPanY, enabled }: Options) {
  const gl = useThree((s) => s.gl);
  const state = useRef({ rotY: 0, panY: 0, velY: 0, velPan: 0, dragging: false, lastX: 0, lastY: 0, lastT: 0, moved: 0 });

  useEffect(() => {
    const el = gl.domElement;
    const s = state.current;
    const SENS = 0.0042;
    const PAN = 0.012;

    const down = (e: PointerEvent) => {
      if (!enabled || useStore.getState().transitioning) return;
      s.dragging = true;
      s.lastX = e.clientX;
      s.lastY = e.clientY;
      s.lastT = performance.now();
      s.velY = 0;
      s.velPan = 0;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = 'grabbing';
    };
    const move = (e: PointerEvent) => {
      if (!s.dragging) return;
      const now = performance.now();
      const dt = Math.max((now - s.lastT) / 1000, 1 / 240);
      const dx = e.clientX - s.lastX;
      const dy = e.clientY - s.lastY;
      s.rotY -= dx * SENS;
      s.panY = MathUtils.clamp(s.panY - dy * PAN, -maxPanY, maxPanY);
      // smoothed velocity (units / second) for inertia on release
      s.velY = MathUtils.lerp(s.velY, (-dx * SENS) / dt, 0.4);
      s.velPan = MathUtils.lerp(s.velPan, (-dy * PAN) / dt, 0.4);
      s.lastX = e.clientX;
      s.lastY = e.clientY;
      s.lastT = now;
    };
    const up = (e: PointerEvent) => {
      if (!s.dragging) return;
      s.dragging = false;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      el.style.cursor = 'grab';
    };
    const wheel = (e: WheelEvent) => {
      if (!enabled || useStore.getState().transitioning) return;
      e.preventDefault();
      s.velY += e.deltaX * 0.0012;
      s.velPan += e.deltaY * 0.012;
    };

    el.style.cursor = 'grab';
    el.style.touchAction = 'none';
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('wheel', wheel, { passive: false });
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      el.removeEventListener('wheel', wheel);
    };
  }, [gl, enabled, maxPanY]);

  useFrame((frame, delta) => {
    const s = state.current;
    const w = wall.current;
    const r = rig.current;
    if (!w || !r) return;

    if (!s.dragging) {
      s.rotY += s.velY * delta;
      s.panY = MathUtils.clamp(s.panY + s.velPan * delta, -maxPanY, maxPanY);
      const decay = Math.exp(-3.2 * delta);
      s.velY *= decay;
      s.velPan *= decay;
      if (Math.abs(s.panY) >= maxPanY) s.velPan = 0;
    }
    w.rotation.y = s.rotY;
    w.position.y = -s.panY;

    // cursor-follow tilt
    const { x, y } = frame.pointer;
    r.rotation.x = MathUtils.damp(r.rotation.x, y * 0.06, 4, delta);
    r.rotation.y = MathUtils.damp(r.rotation.y, -x * 0.09, 4, delta);
    r.rotation.z = MathUtils.damp(r.rotation.z, -x * 0.015, 4, delta);
  });
}
