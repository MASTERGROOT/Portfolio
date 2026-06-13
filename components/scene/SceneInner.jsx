'use client';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { CameraRig }        from './CameraRig.jsx';
import { BuildingWireframe } from './BuildingWireframe.jsx';
import { DataPanels }        from './DataPanels.jsx';
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
        <CameraRig />
        <BuildingWireframe />
        <DataPanels />
        <ParticleField />
      </Suspense>
    </Canvas>
  );
}
