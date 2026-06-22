'use client';
import { useFrame } from '@react-three/fiber';
import { TOTAL_DEPTH } from '../../lib/zones.js';

export function CameraRig({ flightProgress }) {
  useFrame(({ camera }) => {
    const p = flightProgress.progress.current;
    camera.position.z = -p * TOTAL_DEPTH;
    camera.position.y = Math.sin(p * Math.PI) * -2.5;
    camera.position.x = Math.sin(p * Math.PI * 2) * 1.5;
    camera.lookAt(
      camera.position.x * 0.5,
      camera.position.y * 0.5,
      camera.position.z - 10
    );
  });

  return null;
}
