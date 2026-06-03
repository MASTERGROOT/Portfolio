import { it, expect } from 'vitest';
import * as THREE from 'three';
import { KEYFRAMES } from './keyframes.js';

it('has exactly 8 keyframes', () => {
  expect(KEYFRAMES.length).toBe(8);
});

it('each keyframe has required fields', () => {
  KEYFRAMES.forEach((kf, i) => {
    expect(kf.cameraPos, `kf[${i}] cameraPos`).toBeInstanceOf(THREE.Vector3);
    expect(kf.lookAt,    `kf[${i}] lookAt`).toBeInstanceOf(THREE.Vector3);
    expect(Array.isArray(kf.highlight), `kf[${i}] highlight`).toBe(true);
    expect(typeof kf.edgeOpacity).toBe('number');
  });
});

it('keyframe 0 highlights all nodes', () => {
  expect(KEYFRAMES[0].highlight.length).toBeGreaterThan(10);
});

it('keyframe 7 highlights contact node', () => {
  expect(KEYFRAMES[7].highlight).toContain('contact');
});
