'use client';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Vector2 } from 'three';
import { Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { CameraRig }        from './CameraRig.jsx';
import { NodeGraph }         from './NodeGraph.jsx';
import { ParticleField }     from './ParticleField.jsx';

export function SceneInner({ showContact }) {
  return (
    <Canvas
      style={{ position: 'fixed', inset: 0, zIndex: 0 }}
      camera={{ position: [0, 6, 12], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
    >
      {/* Key Light — warm gold, upper right front */}
      <directionalLight
        color="#F5C518"
        intensity={2.5}
        position={[5, 8, 6]}
        castShadow={false}
      />

      {/* Fill Light — cool blue, lower left */}
      <directionalLight
        color="#1a2840"
        intensity={0.8}
        position={[-4, -2, 8]}
      />

      {/* Rim Light — white, from behind */}
      <directionalLight
        color="#ffffff"
        intensity={1.8}
        position={[-2, 3, -8]}
      />

      <Suspense fallback={null}>
        <Environment
          preset="city"
          background={false}
          intensity={0.4}
        />
        <CameraRig />
        <NodeGraph />
        <ParticleField />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.6}
            luminanceSmoothing={0.025}
            intensity={0.4}
            mipmapBlur={true}
          />
          <Vignette
            offset={0.15}
            darkness={0.6}
            eskil={false}
          />
          <ChromaticAberration
            offset={new Vector2(0.0008, 0.0005)}
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
