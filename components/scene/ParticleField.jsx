'use client';
import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const CORE_N = 2000;
const DUST_N = 8000;
const REPEL_R = 5;
const REPEL_M = 2.2;
const LERP_B  = 0.045;

const GOLD_COLS = [0xF59E0B, 0xFCD34D, 0xD97706, 0xFBBF24, 0xF97316].map(h => new THREE.Color(h));
const DUST_COLS = [0x78350F, 0x92400E, 0xFFFBEB, 0xD97706, 0xB45309].map(h => new THREE.Color(h));
const pickColor = arr => arr[Math.floor(Math.random() * arr.length)];

function makeRadialTex(size, stops) {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const r = size / 2;
  const g = ctx.createRadialGradient(r, r, 0, r, r, r);
  stops.forEach(([t, v]) => g.addColorStop(t, v));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

export function ParticleField() {
  const { camera } = useThree();
  const mouse = useRef({ nx: 0, ny: 0 });
  const coreGeoRef = useRef(null);
  const dustGeoRef = useRef(null);

  // Stable typed arrays — mutated in useFrame, never recreated
  const { cPos, cOrigin, cSpeed, cColor, dPos, dSpeed, dColor } = useMemo(() => {
    const cPos    = new Float32Array(CORE_N * 3);
    const cOrigin = new Float32Array(CORE_N * 3);
    const cSpeed  = new Float32Array(CORE_N);
    const cColor  = new Float32Array(CORE_N * 3);
    for (let i = 0; i < CORE_N; i++) {
      const x = (Math.random() - 0.5) * 52;
      const y = (Math.random() - 0.5) * 52;
      const z = -(Math.random() * 160 + 5);
      cPos[i*3] = cOrigin[i*3] = x;
      cPos[i*3+1] = cOrigin[i*3+1] = y;
      cPos[i*3+2] = cOrigin[i*3+2] = z;
      cSpeed[i] = 0.003 + Math.random() * 0.007;
      const c = pickColor(GOLD_COLS);
      cColor[i*3] = c.r; cColor[i*3+1] = c.g; cColor[i*3+2] = c.b;
    }

    const dPos   = new Float32Array(DUST_N * 3);
    const dSpeed = new Float32Array(DUST_N);
    const dColor = new Float32Array(DUST_N * 3);
    for (let i = 0; i < DUST_N; i++) {
      dPos[i*3]   = (Math.random() - 0.5) * 120;
      dPos[i*3+1] = (Math.random() - 0.5) * 120;
      dPos[i*3+2] = -(Math.random() * 160 + 5);
      dSpeed[i] = 0.001 + Math.random() * 0.003;
      const c = pickColor(DUST_COLS);
      dColor[i*3] = c.r * 0.35; dColor[i*3+1] = c.g * 0.35; dColor[i*3+2] = c.b * 0.35;
    }
    return { cPos, cOrigin, cSpeed, cColor, dPos, dSpeed, dColor };
  }, []);

  const goldTex = useMemo(() => makeRadialTex(128, [
    [0,    'rgba(255,210,100,1)'],
    [0.18, 'rgba(245,158,11,.85)'],
    [0.45, 'rgba(220,100,0,.3)'],
    [0.8,  'rgba(180,60,0,.04)'],
    [1,    'rgba(0,0,0,0)'],
  ]), []);

  const dustTex = useMemo(() => makeRadialTex(32, [
    [0,    'rgba(255,235,180,1)'],
    [0.1,  'rgba(255,210,120,.95)'],
    [0.28, 'rgba(240,160,60,.4)'],
    [1,    'rgba(0,0,0,0)'],
  ]), []);

  useEffect(() => {
    return () => {
      if (goldTex) goldTex.dispose();
      if (dustTex) dustTex.dispose();
    };
  }, [goldTex, dustTex]);

  useEffect(() => {
    const onMove = e => {
      mouse.current.nx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.ny = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame((_, dt) => {
    const dtN = Math.min(dt * 60, 3); // normalize to 60 fps ticks

    // Project mouse to world space at depth=15 from camera
    const hH = Math.tan((camera.fov * Math.PI) / 360) * 15;
    const mwx = camera.position.x + mouse.current.nx * hH * camera.aspect;
    const mwy = camera.position.y + mouse.current.ny * hH;

    // Core layer — drift up + mouse repel
    for (let i = 0; i < CORE_N; i++) {
      cOrigin[i*3+1] += cSpeed[i] * dtN;
      if (cOrigin[i*3+1] > 26) cOrigin[i*3+1] = -26;

      const ox = cOrigin[i*3], oy = cOrigin[i*3+1];
      const dx = ox - mwx, dy = oy - mwy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < REPEL_R && dist > 0.01) {
        const f = (1 - dist / REPEL_R) * REPEL_M;
        cPos[i*3]   = ox + (dx / dist) * f;
        cPos[i*3+1] = oy + (dy / dist) * f;
      } else {
        cPos[i*3]   += (ox - cPos[i*3])   * LERP_B;
        cPos[i*3+1] += (oy - cPos[i*3+1]) * LERP_B;
      }
      cPos[i*3+2] = cOrigin[i*3+2];
    }
    if (coreGeoRef.current) coreGeoRef.current.attributes.position.needsUpdate = true;

    // Dust layer — drift up only, no repel
    for (let i = 0; i < DUST_N; i++) {
      dPos[i*3+1] += dSpeed[i] * dtN;
      if (dPos[i*3+1] > 60) dPos[i*3+1] = -60;
    }
    if (dustGeoRef.current) dustGeoRef.current.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      {/* Core amber particles */}
      <points>
        <bufferGeometry ref={coreGeoRef}>
          <bufferAttribute attach="attributes-position" args={[cPos, 3]} />
          <bufferAttribute attach="attributes-color"    args={[cColor, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.55}
          map={goldTex}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
        />
      </points>

      {/* Fine dust layer */}
      <points>
        <bufferGeometry ref={dustGeoRef}>
          <bufferAttribute attach="attributes-position" args={[dPos, 3]} />
          <bufferAttribute attach="attributes-color"    args={[dColor, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          map={dustTex}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          vertexColors
          transparent
          opacity={0.55}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
