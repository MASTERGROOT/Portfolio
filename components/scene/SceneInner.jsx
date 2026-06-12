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
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 5, 5]} color="#D4A017" intensity={2} />

      <Suspense fallback={null}>
        <CameraRig />
        <BuildingWireframe />
        <DataPanels />
        <ParticleField />
      </Suspense>
    </Canvas>
  );
}
