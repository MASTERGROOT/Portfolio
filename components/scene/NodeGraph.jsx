'use client';
import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { CHAOS_POSITIONS, GRID_POSITIONS, EDGES } from '../../lib/nodePositions.js';
import vertexShader from '../../shaders/edge.vert.glsl';
import fragmentShader from '../../shaders/edge.frag.glsl';

gsap.registerPlugin(ScrollTrigger);

const NODE_COUNT = 24;
const EDGE_COUNT = EDGES.length; // 32

// Module-level scratch object to avoid per-frame allocation
const DUMMY = new THREE.Object3D();

export function NodeGraph() {
  const progressRef = useRef(0);
  const instancedRef = useRef(null);

  // Current interpolated positions (flat array, 24×3)
  const currentPositions = useRef(
    new Float32Array(CHAOS_POSITIONS.flat())
  );

  // Geometry for nodes
  const nodeGeo = useMemo(() => new THREE.IcosahedronGeometry(0.18, 2), []);

  // Material for nodes — glass physical
  const nodeMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#1a0f00',
    emissive: '#D4A017',
    emissiveIntensity: 0.3,
    transmission: 0.85,
    roughness: 0.08,
    metalness: 0.0,
    thickness: 0.4,
    ior: 1.5,
    envMapIntensity: 1.2,
    transparent: true,
  }), []);

  // Edge geometry — positions will be updated each frame
  const edgeGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    // 2 vertices per edge
    const positions = new Float32Array(EDGE_COUNT * 2 * 3);
    // aT: 0 for start vertex, 1 for end vertex
    const aT = new Float32Array(EDGE_COUNT * 2);
    EDGES.forEach((_, i) => {
      aT[i * 2] = 0;
      aT[i * 2 + 1] = 1;
    });
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aT', new THREE.BufferAttribute(aT, 1));
    return geo;
  }, []);

  // Edge material — custom shader
  const edgeMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uPulse:   { value: 0 },
      uOpacity: { value: 0 },
      uColor:   { value: new THREE.Color('#D4A017') },
    },
    transparent: true,
    depthWrite: false,
  }), []);

  // Scroll progress driver
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => { progressRef.current = self.progress; },
    });
    return () => st.kill();
  }, []);

  // Initialize InstancedMesh with chaos positions
  useEffect(() => {
    if (!instancedRef.current) return;
    CHAOS_POSITIONS.forEach((pos, i) => {
      DUMMY.position.set(pos[0], pos[1], pos[2]);
      DUMMY.updateMatrix();
      instancedRef.current.setMatrixAt(i, DUMMY.matrix);
    });
    instancedRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame(({ clock }) => {
    const p = progressRef.current;
    const t = clock.getElapsedTime();

    // Lerp factor: 0 at p=0.15, 1 at p=0.65
    const lf = Math.min(1, Math.max(0, (p - 0.15) / 0.5));

    // Update node positions
    const cur = currentPositions.current;
    for (let i = 0; i < NODE_COUNT; i++) {
      const chaos = CHAOS_POSITIONS[i];
      const grid  = GRID_POSITIONS[i];
      cur[i*3+0] = chaos[0] + (grid[0] - chaos[0]) * lf;
      cur[i*3+1] = chaos[1] + (grid[1] - chaos[1]) * lf;
      cur[i*3+2] = chaos[2] + (grid[2] - chaos[2]) * lf;
      DUMMY.position.set(cur[i*3], cur[i*3+1], cur[i*3+2]);
      DUMMY.updateMatrix();
      if (instancedRef.current) {
        instancedRef.current.setMatrixAt(i, DUMMY.matrix);
      }
    }
    if (instancedRef.current) {
      instancedRef.current.instanceMatrix.needsUpdate = true;
    }

    // Update edge positions to follow nodes
    const posAttr = edgeGeo.attributes.position;
    EDGES.forEach(([a, b], i) => {
      posAttr.setXYZ(i*2,   cur[a*3], cur[a*3+1], cur[a*3+2]);
      posAttr.setXYZ(i*2+1, cur[b*3], cur[b*3+1], cur[b*3+2]);
    });
    posAttr.needsUpdate = true;

    // Edge opacity: lerps 0→1 during assembly (lf), maxes at 1 in illuminated
    const edgeOpacity = lf;
    edgeMat.uniforms.uOpacity.value = edgeOpacity;

    // Pulse: active in illuminated state (p > 0.65)
    const illuminated = Math.max(0, (p - 0.65) / 0.35);
    edgeMat.uniforms.uPulse.value = t * 0.3; // slow continuous pulse

    // Node emissive intensity: 0.3 → 2.5 across full scroll
    nodeMat.emissiveIntensity = 0.3 + (p * 2.2);

    // Node color shift in illuminated state: '#D4A017' → '#F5E87A'
    const warmness = illuminated;
    nodeMat.emissive.setRGB(
      0.831 + warmness * 0.128,  // R: D4→F5
      0.627 + warmness * 0.283,  // G: A0→E8
      0.090 + warmness * 0.386,  // B: 17→7A
    );
  });

  return (
    <group>
      <instancedMesh ref={instancedRef} args={[nodeGeo, nodeMat, NODE_COUNT]} />
      <lineSegments geometry={edgeGeo} material={edgeMat} />
    </group>
  );
}
