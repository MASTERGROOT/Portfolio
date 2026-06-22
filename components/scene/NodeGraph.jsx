'use client';
import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GRID_POSITIONS, EDGES } from '../../lib/nodePositions.js';

const NODE_COUNT = GRID_POSITIONS.length; // 24

function makeNodeTex() {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0,    'rgba(255,255,255,1)');
  g.addColorStop(0.15, 'rgba(200,230,255,.95)');
  g.addColorStop(0.35, 'rgba(150,200,255,.6)');
  g.addColorStop(0.6,  'rgba(100,160,255,.15)');
  g.addColorStop(1,    'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

// Module-level singletons — created once, shared across renders
const WIRE_MAT = new THREE.LineBasicMaterial({
  color: 0x88CCFF,
  transparent: true,
  opacity: 0.58,
});
const nodeTex = makeNodeTex();

const DUMMY = new THREE.Object3D();

export function NodeGraph() {
  const groupRef = useRef(null);
  const meshRef  = useRef(null);

  const nodeGeo = useMemo(() => new THREE.IcosahedronGeometry(0.18, 1), []);

  const edgeGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(EDGES.length * 6);
    EDGES.forEach((edge, i) => {
      const a = GRID_POSITIONS[edge[0]];
      const b = GRID_POSITIONS[edge[1]];
      pos[i*6]   = a[0]; pos[i*6+1] = a[1]; pos[i*6+2] = a[2];
      pos[i*6+3] = b[0]; pos[i*6+4] = b[1]; pos[i*6+5] = b[2];
    });
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  const nodePointsPos = useMemo(() => {
    const pos = new Float32Array(NODE_COUNT * 3);
    GRID_POSITIONS.forEach((p, i) => {
      pos[i*3] = p[0]; pos[i*3+1] = p[1]; pos[i*3+2] = p[2];
    });
    return pos;
  }, []);

  useEffect(() => {
    if (!meshRef.current) return;
    GRID_POSITIONS.forEach((pos, i) => {
      DUMMY.position.set(pos[0], pos[1], pos[2]);
      DUMMY.updateMatrix();
      meshRef.current.setMatrixAt(i, DUMMY.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  useEffect(() => {
    return () => {
      nodeGeo.dispose();
      edgeGeo.dispose();
    };
  }, [nodeGeo, edgeGeo]);

  useFrame((_, dt) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0007 * Math.min(dt * 60, 3);
    }
  });

  return (
    <group ref={groupRef} position={[-2, 0, -10]}>
      {/* Wireframe node shells */}
      <instancedMesh ref={meshRef} args={[nodeGeo, undefined, NODE_COUNT]}>
        <meshBasicMaterial color={0x88CCFF} wireframe transparent opacity={0.6} />
      </instancedMesh>

      {/* Node glow points */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePointsPos, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.65}
          map={nodeTex}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          color={0xCCE8FF}
          transparent
          opacity={1}
          sizeAttenuation
        />
      </points>

      {/* Edges */}
      <lineSegments geometry={edgeGeo} material={WIRE_MAT} />
    </group>
  );
}
