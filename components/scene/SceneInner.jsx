'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useMemo, useRef } from 'react';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { Vector2 } from 'three';
import { CameraRig }     from './CameraRig.jsx';
import { NodeGraph }     from './NodeGraph.jsx';
import { ParticleField } from './ParticleField.jsx';

function ZoneWatcher({ flightProgress, caOffset }) {
  const prevZone = useRef(0);
  const timeoutRef = useRef(null);

  useFrame(() => {
    const zi = flightProgress.zoneIndex.current;
    if (zi !== prevZone.current) {
      prevZone.current = zi;
      caOffset.set(0.003, 0.003);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => caOffset.set(0, 0), 300);
    }
  });

  return null;
}

export function SceneInner({ flightProgress }) {
  const caOffset = useMemo(() => new Vector2(0, 0), []);

  return (
    <Canvas
      style={{ position: 'fixed', inset: 0, zIndex: 0 }}
      camera={{ position: [0, 0, 0], fov: 75 }}
      gl={{ antialias: false, alpha: false }}
    >
      <color attach="background" args={['#060504']} />

      <directionalLight color="#FFB347" intensity={0.6} position={[5, 8, 6]} />
      <directionalLight color="#FF8C00" intensity={0.25} position={[-4, -2, 8]} />
      <directionalLight color="#FFF8E7" intensity={0.7} position={[-2, 3, -8]} />

      <Suspense fallback={null}>
        <CameraRig flightProgress={flightProgress} />
        <NodeGraph />
        <ParticleField />
        <ZoneWatcher flightProgress={flightProgress} caOffset={caOffset} />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.55}
            luminanceSmoothing={0.9}
            intensity={0.9}
            mipmapBlur={true}
          />
          <Vignette offset={0.15} darkness={0.75} eskil={false} />
          <ChromaticAberration offset={caOffset} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
