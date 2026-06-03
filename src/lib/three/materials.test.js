import { it, expect } from 'vitest';
import * as THREE from 'three';
import { createNodeMaterial, createEdgeMaterial, createParticleMaterial } from './materials.js';

it('createNodeMaterial returns MeshStandardMaterial', () => {
  const mat = createNodeMaterial('center', false);
  expect(mat).toBeInstanceOf(THREE.MeshStandardMaterial);
});

it('active node has emissiveIntensity 1.0', () => {
  const mat = createNodeMaterial('center', true);
  expect(mat.emissiveIntensity).toBe(1.0);
});

it('inactive node has emissiveIntensity 0.2', () => {
  const mat = createNodeMaterial('erp', false);
  expect(mat.emissiveIntensity).toBe(0.2);
});

it('createEdgeMaterial returns transparent LineBasicMaterial', () => {
  const mat = createEdgeMaterial(0.3);
  expect(mat).toBeInstanceOf(THREE.LineBasicMaterial);
  expect(mat.transparent).toBe(true);
  expect(mat.opacity).toBe(0.3);
});

it('createParticleMaterial returns PointsMaterial', () => {
  const mat = createParticleMaterial();
  expect(mat).toBeInstanceOf(THREE.PointsMaterial);
});
