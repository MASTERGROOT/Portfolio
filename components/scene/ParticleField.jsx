'use client';
import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useCursorWorld } from '../../hooks/useCursorWorld.js';
import vertexShader   from '../../shaders/particle.vert.glsl';
import fragmentShader from '../../shaders/particle.frag.glsl';

const PARTICLE_COUNT = 120;

export function ParticleField() {
  const { camera } = useThree();
  const cursorWorld = useCursorWorld(camera);
  const matRef = useRef(null);

  // Build particle geometry once
  const [positions, sizes, speeds] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const sz  = new Float32Array(PARTICLE_COUNT);
    const sp  = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
      sz[i]  = Math.random() * 3 + 1;
      sp[i]  = Math.random() * 0.5 + 0.2;
    }
    return [pos, sz, sp];
  }, []);

  const uniforms = useMemo(() => ({
    uMouse:          { value: new THREE.Vector3() },
    uVortexStrength: { value: 0 },
    uTime:           { value: 0 },
    uGoldColor:      { value: new THREE.Color('#D4A017') },
  }), []);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value  = clock.getElapsedTime();
    matRef.current.uniforms.uMouse.value.copy(cursorWorld.current);
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize"    args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aSpeed"   args={[speeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
