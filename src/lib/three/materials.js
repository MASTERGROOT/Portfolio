import * as THREE from 'three';

export const NODE_TYPE_EMISSIVE = {
  center:    0xe8c96d,
  erp:       0xc9a84c,
  client:    0x8b6914,
  skill:     0xa07c35,
  education: 0x7a5c10,
  cert:      0xb08d3e,
  work:      0x9a7228,
  contact:   0xe8c96d,
};

export function createNodeMaterial(type = 'center', active = false) {
  return new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    emissive: NODE_TYPE_EMISSIVE[type] ?? 0xc9a84c,
    emissiveIntensity: active ? 1.0 : 0.2,
    metalness: 0.8,
    roughness: 0.2,
  });
}

export function createEdgeMaterial(opacity = 0.25) {
  return new THREE.LineBasicMaterial({
    color: 0xc9a84c,
    transparent: true,
    opacity,
  });
}

export function createParticleMaterial() {
  return new THREE.PointsMaterial({
    color: 0xe8c96d,
    size: 0.05,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
  });
}
