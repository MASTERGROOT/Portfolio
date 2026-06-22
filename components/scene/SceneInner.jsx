'use client';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { CameraRig }     from './CameraRig.jsx';
import { NodeGraph }     from './NodeGraph.jsx';
import { ParticleField } from './ParticleField.jsx';

export function SceneInner({ flightProgress }) {
  return (
    <Canvas
      style={{ position: 'fixed', inset: 0, zIndex: 0 }}
      camera={{ position: [0, 0, 0], fov: 75 }}
      gl={{ antialias: false, alpha: false }}
    >
      <color attach="background" args={['#050505']} />

      {/* Cyan-shifted lighting for wireframe */}
      <directionalLight color="#88CCFF" intensity={0.5} position={[5, 8, 6]} />
      <directionalLight color="#4499CC" intensity={0.3} position={[-4, -2, 8]} />
      <directionalLight color="#ffffff" intensity={0.8} position={[-2, 3, -8]} />

      <Suspense fallback={null}>
        <CameraRig flightProgress={flightProgress} />
        <NodeGraph />
        <ParticleField />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.7}
            luminanceSmoothing={0.025}
            intensity={0.3}
            mipmapBlur={true}
          />
          <Vignette offset={0.15} darkness={0.6} eskil={false} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
