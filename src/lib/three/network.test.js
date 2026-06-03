import { it, expect } from 'vitest';
import * as THREE from 'three';
import { NODE_DEFS, EDGE_DEFS, buildNetwork, setNodeHighlights } from './network.js';

it('center node exists in NODE_DEFS', () => {
  expect(NODE_DEFS.find(n => n.id === 'center')).toBeDefined();
});

it('all EDGE_DEFS reference valid node IDs', () => {
  const ids = new Set(NODE_DEFS.map(n => n.id));
  EDGE_DEFS.forEach(([a, b]) => {
    expect(ids.has(a), `unknown id "${a}"`).toBe(true);
    expect(ids.has(b), `unknown id "${b}"`).toBe(true);
  });
});

it('buildNetwork adds correct number of meshes', () => {
  const scene = new THREE.Scene();
  const { nodeMap } = buildNetwork(scene);
  expect(Object.keys(nodeMap).length).toBe(NODE_DEFS.length);
});

it('setNodeHighlights sets high intensity on highlighted nodes', () => {
  const scene = new THREE.Scene();
  const { nodeMap } = buildNetwork(scene);
  setNodeHighlights(nodeMap, ['center']);
  expect(nodeMap['center'].material.emissiveIntensity).toBe(1.0);
  expect(nodeMap['sap'].material.emissiveIntensity).toBe(0.08);
});
