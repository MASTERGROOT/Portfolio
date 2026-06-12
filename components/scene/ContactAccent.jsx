'use client';
// Same as ParticleField but 30 nodes, tighter spread, always-on mild vortex
import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useCursorWorld } from '../../hooks/useCursorWorld.js';
import vertexShader   from '../../shaders/particle.vert.glsl';
import fragmentShader from '../../shaders/particle.frag.glsl';

const COUNT = 30;

export function ContactAccent() {
  const { camera } = useThree();
  const cursorWorld = useCursorWorld(camera);
  const matRef = useRef(null);

  const [positions, sizes, speeds] = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const sz  = new Float32Array(COUNT);
    const sp  = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3;
      sz[i]  = Math.random() * 2 + 1;
      sp[i]  = Math.random() * 0.4 + 0.15;
    }
    return [pos, sz, sp];
  }, []);

  const uniforms = useMemo(() => ({
    uMouse:          { value: new THREE.Vector3() },
    uVortexStrength: { value: 0.3 },
    uTime:           { value: 0 },
    uGoldColor:      { value: new THREE.Color('#D4A017') },
  }), []);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = clock.getElapsedTime();
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
