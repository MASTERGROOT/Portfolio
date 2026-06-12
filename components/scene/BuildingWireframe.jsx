'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function BuildingWireframe() {
  const pulseRef = useRef([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    pulseRef.current.forEach((mesh, i) => {
      if (mesh) {
        const s = 1 + Math.sin(t * 1.5 + i * 0.8) * 0.15;
        mesh.scale.setScalar(s);
      }
    });
  });

  // Corner node positions for a 2×3×2 box
  const corners = [
    [-1, 0, -1], [1, 0, -1], [-1, 0, 1], [1, 0, 1],
    [-1, 3, -1], [1, 3, -1], [-1, 3, 1], [1, 3, 1],
  ];

  const goldEmissive = new THREE.Color('#D4A017');

  return (
    <group position={[0, -1.5, 0]}>
      {/* Main box wireframe */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(2, 3, 2)]} />
        <lineBasicMaterial color="#F5C842" transparent opacity={0.7} />
      </lineSegments>

      {/* Floor grid */}
      <gridHelper args={[6, 6, '#4a3f2a', '#4a3f2a']} position={[0, 0, 0]} />

      {/* Pulsing corner nodes */}
      {corners.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} ref={el => { pulseRef.current[i] = el; }}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#F5C842" emissive={goldEmissive} emissiveIntensity={1.5} />
        </mesh>
      ))}
    </group>
  );
}
